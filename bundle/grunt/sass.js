var path = require('path'),
    _ = require(path.join(process.cwd(), 'node_modules/lodash'));

module.exports = function (grunt, config) {
    function resolvePath(url, prev, done) {
        // Search in both process and root file directories
        var cwd = [
                path.resolve(path.dirname(prev)), 
                process.cwd()
            ],
            name = path.basename(url);

        url = grunt.template.process(url);

        // Get first found file by patterns
        var filename;
        for (var i = 0, len = cwd.length; (i < len) && !filename; ++i) {
            filename = grunt.file.expand(path.join(cwd[i], path.dirname(url), '+(_|)' + name + '+(.scss|.css)'))[0];
        }

        done({
            file: filename,
            contents: grunt.file.read(filename),
            map: ''
        });
    }

    return _.mapValues({
        options: {
            sourceMap: true,
            importer: resolvePath
        },
        debug: {
            options: {
                outputStyle: 'expanded'
            }
        },
        release: {
            options: {
                outputStyle: 'compressed'
            }
        }
    }, function (value) {
        return _.merge({
            files: config.bundle.packages.app.styles.concat(config.bundle.packages.ext.styles).map(function (style) {
                // TODO unhardcode this
                style += '.scss';
                
                return {
                    src: '<%= bundle.src %>/' + style,
                    dest: '<%= bundle.target %>/' + style.replace(/s[ac]ss/g, 'css')
                };
            })
        }, value);
    });
};