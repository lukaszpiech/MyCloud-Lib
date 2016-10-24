// Used to make ckeditor know where statics
var CKEDITOR_BASEPATH = '/standardlib/lib/ckeditor-4.5.9/';

function rxLoadResources(files, immediateWrite) {
    files.forEach(function (file) {
        var ext = file.match(/\.[^\.]+$/)[0],
            line = '';

        switch (ext) {
            case '.js':
                line = '<script src="' + file + '"></script>';
                break;
            case '.css':
                line = '<link rel="stylesheet" href="' + file + '">';
                break;
        }

        if (immediateWrite) {
            document.write(line);
        } else {
            rxLoadResources.lines = rxLoadResources.lines || [];
            rxLoadResources.lines.push(line);
        }
    });
}

rxLoadResources.deferredWrite = function (files) {
    document.write((rxLoadResources.lines || []).join(''));
};

function rxInitLocalizations(data) {
    var ANGULAR_I18N = '/standardlib/lib/angular-1.4.7/i18n/angular-locale_';

    window.rxLocalization = data;
    window.rxLocalization.locale = _(window.rxLocalization).keys().first();

    var script = document.createElement('script');
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", ANGULAR_I18N + window.rxLocalization.locale + ".js");
    document.getElementsByTagName("head")[0].appendChild(script);
}

function rxLoadBundles(config) {
    var bundlesList = [],
        depsSequence = rxLoadBundles.depsTreeToSequence(config);

    rxLoadResources(Array.prototype.concat.apply([], depsSequence.map(function (dep) {
        // If bundle isApplication load -ext files but current bundle 
        // which should allways load without -ext suffix
        var bundleFile = dep.id + ((dep.isApplication && !dep.isMainModule) ? '-ext' : '');

        var bundleFiles = [];

        if (dep.containsJavaScript) {
            // Load libs css and js for standardlib
            bundleFiles.push('/' + dep.id + '/resources/css/' + bundleFile + '-deps.min.css')
            bundleFiles.push('/' + dep.id + '/scripts/' + bundleFile + '-deps.min.js');
            bundleFiles.push('/' + dep.id + '/resources/css/' + bundleFile + '.css');
            bundleFiles.push('/' + dep.id + '/scripts/' + bundleFile + '.js');
            bundlesList.push(bundleFile);
        }

        bundleFiles.push();

        return bundleFiles;
    })), true);

    document.addEventListener('DOMContentLoaded', function () {
        // Remove missing modules
        bundlesList = bundlesList.filter(function (rxBundle) {
            // Suppress console message while no standardlib module exists
            if (rxBundle == 'standardlib') {
                return false;
            }

            try {
                // Module found
                angular.module(rxBundle);
                return true;
            } catch (e) {
                if (console.info) {
                    // Show console message if some module couldn't be found
                    console.info('Angular module ' + rxBundle + ' doesn\'t exist so it can\'t be run');
                }
            }
        });

        if (bundlesList[0]) {
            angular.module(bundlesList[0]).run(function ($rootScope) {
                // Add favicon
                $rootScope.rxFavicon = '/standardlib/resources/images/favicon.ico';
            });
        }

        angular.bootstrap(document, bundlesList);

        // If there is rxLoadingComplete callback (e.g. for splash screen)
        // run it after application bootstrap
        if (typeof rxLoadingComplete == 'function') {
            rxLoadingComplete();
        }
    });
}

rxLoadBundles.depsTreeToSequence = function (tree) {
    var depsSequence = rxLoadBundles.depsTreeToSequence.walk(tree);
    tree.isMainModule = true;
    // Add root bundle
    depsSequence.unshift(tree);

    // Standardlib should be loaded first
    depsSequence = rxLoadBundles.depsTreeToSequence.addAndRemoveDuplicates(depsSequence,
        depsSequence
            .filter(function (dep) {
                return (dep.id === 'standardlib');
            })
    );

    // Load deepest deps first
    depsSequence.reverse();

    return depsSequence;
};

// Walk throw depenencies tree and get correct load queue
rxLoadBundles.depsTreeToSequence.walk = function (tree) {
    var depsSequence = [];

    if (tree && tree.dependentBundles instanceof Array) {
        depsSequence = tree.dependentBundles.filter(function (dep) {
            return dep;
        });

        for (var i = 0, iLen = tree.dependentBundles.length; i < iLen; ++i) {
            if (tree.dependentBundles[i]) {
                depsSequence = rxLoadBundles.depsTreeToSequence.addAndRemoveDuplicates(depsSequence, rxLoadBundles.depsTreeToSequence.walk(tree.dependentBundles[i]));
            }
        }
    }

    return depsSequence;
};

rxLoadBundles.depsTreeToSequence.addAndRemoveDuplicates = function (list, newItems) {
    var updatedList = [].concat(list);

    // Remove all duplicates first
    for (var i = 0, iLen = updatedList.length; i < iLen; ++i) {
        for (var j = 0, jLen = newItems.length; j < jLen; ++j) {
            if (updatedList[i] && (updatedList[i].id === newItems[j].id)) {
                updatedList.splice(i, 1);
            }
        }
    }

    return updatedList.concat(newItems);
};

var isBrowserSupported = true;
var isCompatibilityMode = false;

if (navigator.appName === 'Microsoft Internet Explorer') {
    var userAgent = navigator.userAgent;
    var trident = userAgent.indexOf('Trident/');
    var msie = userAgent.indexOf('MSIE ');

    if (trident != -1) {
        var tridentVersion = parseInt(userAgent.substring(trident + 8, userAgent.indexOf(';', trident)), 10);
        if (tridentVersion < 7) {
            isBrowserSupported = false;
        }
    }

    if (msie != -1) {
        var msieVersion = parseInt(userAgent.substring(msie + 5, userAgent.indexOf(';', msie)), 10);
        if (msieVersion < 9) {
            isCompatibilityMode = true;
        }
    }
}

if (!isBrowserSupported) {
    alert('The version of Microsoft Internet Explorer you are using is not supported');
} else if (isBrowserSupported && isCompatibilityMode) {
    alert('It looks like you have enabled Internet Explorer Compatibility View. Please disable Compatibility View before continuing');
} else {
    (function () {
        var bundleId = document.documentElement.getAttribute('rx-app');

        if (typeof window.__karma__ === 'undefined') {
            document.write('<script src="/api/rx/application/bundle/bundledescriptor/', bundleId, '/jsonp?callback=rxLoadBundles"></script>',
                '<script src="/api/rx/application/logincontent/login.json', '/jsonp?callback=rxInitLocalizations"></script>');
        }

        document.write([
            '<link ng-if="rxFavicon" rel="shortcut icon" ng-href="{{rxFavicon}}">',
            // Load jsonp with bundle config
            // Write all deferred files
            '<script>rxLoadResources.deferredWrite();</script>'
        ].join(''));
    })();
}