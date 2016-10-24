(function() {
  'use strict';

  angular.module('bmc.help', [
    'ui.router',
    'ui.bootstrap.dropdown'
  ]);
})();

(function () {
  'use strict';
  angular.module('bmc.help').config(['$stateProvider', function($stateProvider) {
    //states should inherit "helpTopic" property from parent
    //Note: ng-annotate overzealously tries to annotate the second parameter (causing errors) if we
    //try to call it as $stateProvider.decorator(state, func), so have to save the decorator function in a variable!
    var $decorator = $stateProvider.decorator;
    $decorator('helpTopic', function(state) {
      if (state.parent && state.parent.helpTopic && angular.isUndefined(state.self.helpTopic)) {
        state.helpTopic = state.self.helpTopic = state.parent.helpTopic;
      }
      return state.helpTopic;
    });
  }]);
}());

(function() {
  'use strict';
  /**
   * @ngdoc service
   * @name bmc.help.provider:ehHelpDocsServiceProvider
   *
   * @description
   * Provides a configurable implementation of the {@link bmc.help.service:ehHelpDocsService `ehHelpDocsService`}.
   */

  /**
   * @ngdoc method
   * @name configure
   * @methodOf bmc.help.provider:ehHelpDocsServiceProvider
   *
   * @description
   * A method for setting custom implementation of {@link bmc.help.service:ehHelpDocsService `ehHelpDocsService`}
   * by overriding properties of the default implementation.
   *
   * @param {object} options Object of overrides for the default `ehHelpDocsService` implementaion properties. Valid keys are:
   *   - `defaultTopic`: The default topic to use for a help link when no topic is specified. Should be a string or a function that returns a string. Defaults to empty string.
   *   - `externalLink`: A function that maps a help topic to its external help link. Default implementation maps `<topic>` to `https://olh.bmc.com/urlresolver/docs?topic=<topic>`.
   *   - `resourceUrl`: A function that returns the url to retrieve in-app help document for a specified topic. Used in the default implementation of `documentResource` to fetch the help document. Defaults to undefined.
   *   - `topicIndex`: An array of valid in-app help topics or a function indicating validity of a topic for in-app help. Defaults to empty array.
   *   - `documentCache`: An object with get and put methods used for caching retrieved help documents. Defaults to $cacheFactory('bmc.help.docs').
   *   - `documentProcessor`: Optional postprocessor function used to transform retrieved help documents into the html format required for {@link bmc.help.service:ehHelpPopup `ehHelpPopup`} content.
   *        When passed a raw document, this should return either processed html or a promise that resolves with processed html. Defaults to undefined.
   *   - `documentResource`: An object with get method that returns a promise fulfilled by the html-formatted help document for a requested topic.
   *
   *   <br/>
   *   Note: each of these options may alternately be an angular $injector-invokable function that returns an object matching the description specified for the option above. Invokability may be either annotated (ie. a function with $invoke array) 
   *   or inline (ie. an array with injectable dependencies and the invokable function), but not implicit. In particular, an invokable documentResource may include injectable dependencies for resourceUrl and documentProcessor since these
   *   are passed in as locals when documentResource is invoked.
  */

  /**
   * @ngdoc service
   * @name bmc.help.service:ehHelpDocsService
   * @module bmc.help
   *
   * @description
   *
   * Help document service used by {@link bmc.help.help-link.directive:ehHelpLink `ehHelpLink`} directive to
   * determine availability of in-app help documents, retrieve in-app help document content, and link topics to
   * external documentation when no in-app help document content is available.
  **/

  /**
   * @ngdoc method
   * @name getDefaultTopic
   * @methodOf bmc.help.service:ehHelpDocsService
   *
   * @description
   * Gets the default topic to use when no topic is specified in a {@link bmc.help.help-link.directive:ehHelpLink `ehHelpLink`} directive.
   *
   * @return {string} The default help topic. This uses the implementation of `defaultTopic` property
   * set during configuration of {@link bmc.help.service:ehHelpDocsServiceProvider `ehHelpDocsServiceProvider`}.
  */

  /**
   * @ngdoc method
   * @name getExternalLink
   * @methodOf bmc.help.service:ehHelpDocsService
   *
   * @description
   * Gets the url for external help for a given help topic. This uses the implementation of `externalLink` property
   * set during configuration of {@link bmc.help.service:ehHelpDocsServiceProvider `ehHelpDocsServiceProvider`}.
   *
   * @param {string} topic The help topic.
   * @return {string} The external help url for the topic.
  */

  /**
   * @ngdoc method
   * @name hasDocument
   * @methodOf bmc.help.service:ehHelpDocsService
   *
   * @description
   * Determines whether in-app help content is available for a given help topic. This uses the implementation of `topicIndex` property
   * set during configuration of {@link bmc.help.service:ehHelpDocsServiceProvider `ehHelpDocsServiceProvider`}.
   *
   * @param {string} topic The help topic.
   * @return {boolean} `true` if in-app help content is available; `false` otherwise.
  */

  /**
   * @ngdoc method
   * @name getDocument
   * @methodOf bmc.help.service:ehHelpDocsService
   *
   * @description
   * Retrieves in-app help content for a given help topic. This uses the implementations of `documentResource` and `documentCache` properties
   * set during configuration of {@link bmc.help.service:ehHelpDocsServiceProvider `ehHelpDocsServiceProvider`} to retrieve and cache the document content.
   *
   * @param {string} topic The help topic.
   * @return {promise} A promise that will be fulfilled with html-formatted help content for the topic.
  */
  
  //Consider an object as 'invokable' if it can be invoked by the angular $injector - only annotated or inline injection is allowed, not implied.
  //ie. it should either be a function with dependencies specified via an $invoke array, or an array whose elements are injectable dependencies and the function to be invoked
  function isInvokable(value) {
    return (angular.isFunction(value) && angular.isArray(value.$invoke)) || (angular.isArray(value) && angular.isFunction(value[value.length-1]));
  }

  angular.module('bmc.help').provider('ehHelpDocsService', function() {
    //Base implementations of internal provider variables:

    //defaultTopic sets the default for a help link when no topic is specified;
    //Should be a string or a function returning a string (or an invokable that returns such a string or function)
    var _defaultTopic = '',

    //externalLink determines the help link url for a topic;
    //Should be a function (or an invokable that returns a function) mapping a topic to its corresponding external help link
    _externalLink = function(topic) {
      return 'https://olh.bmc.com/urlresolver/docs?topic=' + topic;
    },

    //resourceUrl determines the url for retrieving in-app help document for a given topic;
    //Should be a function (or an invokable that returns a function) mapping a topic to its retrieval url
    _resourceUrl,

    //topicIndex is used to validate the presense of in-app help document for a given topic;
    //Should be an array of valid in-app help topics or a function indicating validity of a topic (or an invokable that returns such an array or function)
    _topicIndex = [],

    //documentCache caches retrieved in-app help documents;
    //Should be an object (or an invokable that returns an object) with get and put methods for inserting and retrieving items in the cache
    _documentCache = ['$cacheFactory', function($cacheFactory) {
      return $cacheFactory('bmc.help.docs');
    }],

    //documentProcessor is an optional postprocessor used to transform retrieved documents into the required html format;
    //Should be a function (or an invokable that returns a function) that maps a raw document into either processed html or a promise fulfilled with processed html
    _documentProcessor,

    //documentResource is the service used to retrieve in-app help documents;
    //Should be an object (or an invokable that returns an object) with a get method that returns a promise fulfilled by the html-formatted help document for a requested topic
    //The resourceUrl and documentProcessor can be included as injectable dependencies of invokable documentResource, since they are passed as locals when the resource is invoked
    _documentResource = ['$http', '$q', 'resourceUrl', 'documentProcessor', function($http, $q, resourceUrl, documentProcessor, topicIndex) {
      return {
        get: function(topic) {
          var topicUrl = angular.isFunction(resourceUrl) && resourceUrl(topic);
          return topicUrl ? $http({method: 'GET', url: topicUrl, cache: false}).then(function(result) {
            return documentProcessor ? documentProcessor(result.data) : result.data;
          }) : $q.reject('missing resource url');
        }
      };
    }];
    _externalLink.$inject = ['topic'];

    //Configuration method that allows the application to customize base implementation by overriding each of the internal variables described above
    this.configure = function(options) {
      options = options || {};
      _defaultTopic = options.defaultTopic || _defaultTopic;
      _externalLink = options.externalLink || _externalLink;
      _resourceUrl = options.resourceUrl || _resourceUrl;
      _topicIndex = options.topicIndex || _topicIndex;
      _documentCache = options.documentCache || _documentCache;
      _documentProcessor = options.documentProcessor || _documentProcessor;
      _documentResource = options.documentResource || _documentResource;
    };

    this.$get = ['$injector', '$q', function($injector, $q) {
      //use the provider variables to fix the implementation of the service, invoking via $injector.invoke where appropriate
      var defaultTopic = isInvokable(_defaultTopic) ? $injector.invoke(_defaultTopic) : _defaultTopic,
      externalLink = isInvokable(_externalLink) ? $injector.invoke(_externalLink) : _externalLink,
      resourceUrl = isInvokable(_resourceUrl) ? $injector.invoke(_resourceUrl) : _resourceUrl,
      topicIndex = isInvokable(_topicIndex) ? $injector.invoke(_topicIndex) : _topicIndex,
      documentCache = isInvokable(_documentCache) ? $injector.invoke(_documentCache) : _documentCache,
      documentProcessor = isInvokable(_documentProcessor) ? $injector.invoke(_documentProcessor) : _documentProcessor,
      //pass resourceUrl and documentProcessor as locals when invoking documentResource
      documentResource = isInvokable(_documentResource) ? $injector.invoke(_documentResource, undefined, {resourceUrl: resourceUrl, documentProcessor: documentProcessor}) : _documentResource;

      return {
        getDefaultTopic: angular.isFunction(defaultTopic) ? defaultTopic : function() { return defaultTopic; },
        getExternalLink: angular.isFunction(externalLink) ? externalLink : angular.noop,
        hasDocument: angular.isFunction(topicIndex) ? topicIndex : angular.isArray(topicIndex) ? _.curry(_.include)(topicIndex) : angular.noop,
        getDocument: function(topic) {
          var cached = documentCache && documentCache.get(topic);
          if (cached) {
            return $q.when(cached);
          }
          else {
            return documentResource.get(topic).then(function(data) {
              documentCache && documentCache.put(topic, data);
              return data;
            });
          }
        }
      };
    }];
  });
}());

(function() {
  'use strict';
  /**
   * @ngdoc service
   * @name bmc.help.provider:ehHelpPopupProvider
   *
   * @description
   * Provider for {@link bmc.help.service:ehHelpDocsService `ehHelpPopup`}.
   */

  /**
   * @ngdoc method
   * @name initialize
   * @methodOf bmc.help.provider:ehHelpPopupProvider
   *
   * @description
   * A method for overriding default options in {@link bmc.help.service:ehHelpPopup `ehHelpPopup`}.
   *
   * @param {object} options Overrides for the `ehHelpPopup` default options. Valid keys are:
   *   - `initialPosition`: The (string) display position at which popup will initially open. Allowable values are `'bottom-left'`, `'top-left'`, `'bottom-right'`, `'top-right'`, `'dock-left'` and `'dock-right'`.  Defaults to `'bottom-left'`.
   *   - `labels`: A plain object specifying string labels bound to elements in the popup header. Label keys used in the default template are `title`, `floating`, `dockLeft` and `dockRight`. 
   *        This option is used to seed the popup scope's `config` property, which can be overwritten at any time via the {@link bmc.help.service:ehHelpPopup `ehHelpPopup's`} extend method.
   *   - `template`: The (string) html template used when creating the popup. This should include an element with class `'eh-help-popup__content'`, which is used as container for the help document content.
  **/

  /**
   * @ngdoc service
   * @name bmc.help.service:ehHelpPopup
   * @module bmc.help
   *
   * @description
   * Singleton in-app help widget displaying html-formatted help content in a floating or docked popup.
  **/

  /**
   * @ngdoc method
   * @name open
   * @methodOf bmc.help.service:ehHelpPopup
   *
   * @description
   * Displays specified content in the help widget, and opens the widget if it is not already open.
   *
   * @param {string} content The html-formatted content to display in the popup.
  */

  /**
   * @ngdoc method
   * @name close
   * @methodOf bmc.help.service:ehHelpPopup
   *
   * @description
   * Closes the help widget.
  */

  /**
   * @ngdoc method
   * @name extend
   * @methodOf bmc.help.service:ehHelpPopup
   *
   * @description
   * Used to extend the functionality of help popup by assigning to the config property of the help popup scope.
   *
   * @param {object} config Object used to extend the help popup scope's config property.
  */
  angular.module('bmc.help').provider('ehHelpPopup', function() {
    var DISPLAY_TYPES = {
      floating: 'floating',
      dockLeft: 'dock-left',
      dockRight: 'dock-right'
    },
    _options = {
      initialPosition: 'bottom-left',  //bottom-left, top-left, bottom-right, top-right, dock-left or dock-right
      labels: {
        title: 'Help',
        dockLeft: 'Dock Left',
        dockRight: 'Dock Right',
        floating: 'Floating'
      },
      template: '<div class="eh-help-popup" ng-class="{in: isOpened}">\n' +
        '<div class="eh-help-popup__header">\n' +
        '<div class="eh-help-popup__nav">\n' +
        '<button type="button" class="eh-icon-button d-icon-angle_left help-nav__back" ng-click="back()" ng-show="!minimized" ng-disabled="!content.$prevContent"></button>' +
        '<button type="button" class="eh-icon-button d-icon-angle_right help-nav__forward" ng-click="forward()" ng-show="!minimized" ng-disabled="!content.$nextContent"></button>' +
        '</div>\n' +
        '<h3 class="eh-help-popup__title" ng-bind="config.labels.title"></h3>\n' +
        '<div class="eh-help-popup__buttons">\n' +
        '<eh-help-link topic="eh.feedback"><button type="button" class="eh-icon-button d-icon-exclamation_bubble_o" ng-show="!minimized"></button></eh-help-link>\n' +
        '<button type="button" class="eh-icon-button d-icon-squares_back" ng-click="restore()" ng-show="minimized"></button>' +
        '<span uib-dropdown ng-show="!minimized">\n' +
        '<button type="button" class="eh-icon-button d-icon-gear" uib-dropdown-toggle></button>\n' +
        '<ul uib-dropdown-menu role="menu">\n' +
        '<li><a href ng-click="setDisplay(\'dock-left\')" ng-disabled="display === \'dock-left\'" ng-bind="config.labels.dockLeft"></a></li>\n' +
        '<li><a href ng-click="setDisplay(\'dock-right\')" ng-disabled="display === \'dock-right\'" ng-bind="config.labels.dockRight"></a></li>\n' +
        '<li><a href ng-click="setDisplay(\'floating\')" ng-disabled="display === \'floating\'" ng-bind="config.labels.floating"></a></li>\n' +
        '</ul>\n' +
        '</span>\n' +
        '<button type="button" class="eh-icon-button d-icon-minus" ng-click="minimize()" ng-show="!minimized"></button>' +
        '<button type="button" class="eh-icon-button d-icon-cross" ng-click="close()"></button>\n' +
        '</div>\n' +
        '</div>\n' +
        '<div class="eh-help-popup__content"></div>\n' +
        '<div class="eh-help-popup__footer">\n' +
        '<eh-help-link topic="eh.feedback"><button type="button" class="eh-icon-button d-icon-exclamation_bubble_o" ng-show="!minimized"></button> How helpful is this experience?</eh-help-link>' +
        '</div>\n' +
        '</div>'
    };

    return {
      initialize: function(options) {
        angular.extend(_options, options);
      },
      $get: ['$compile', '$injector', '$rootScope', '$window', '$document', '$animate', '$timeout', function($compile, $injector, $rootScope, $window, $document, $animate, $timeout) {
        var _instance,
        _config = {
          labels: _options.labels
        },
        $$window = angular.element($window),
        triggerResize = function() {
          $$window.trigger('resize');
        },
        $animateCss = $injector.has('$animateCss') ? $injector.get('$animateCss') : null;

        function getInstance() {
          if (!_instance) {
            var $element, $content;
            var initial = true;
            _instance = $rootScope.$new();
            _instance.config = _config;
            $element = $compile(angular.element(_options.template))(_instance).appendTo($document[0].body);
            $element.draggable({containment: 'parent', handle: '.eh-help-popup__header'}).resizable({
              minHeight: 200,
              minWidth: 350
            });
            $content = $element.find('.eh-help-popup__content');

            var sizeElement = function() {
              if (_instance.isOpened && _instance.display === DISPLAY_TYPES.floating && !_instance.minimized && $content.is(':visible')) {
                var bottomOffset = initial && _options.initialPosition === 'bottom-left' || _options.initialPosition === 'bottom-right' ? 10 : 0,
                rightOffset = initial && _options.initialPosition === 'top-right' || _options.initialPosition === 'bottom-right' ? 10 : 0;
                $element.css('height', $content.outerHeight());
                $element.css('height', $element.outerHeight() + $content[0].scrollHeight - $content.outerHeight());
                ($element.offset().top + $element.outerHeight() + bottomOffset > $$window.height()) && $element.css('top', Math.max($$window.height() - $element.outerHeight() - bottomOffset, 0));
                ($element.offset().left + $element.outerWidth() + rightOffset > $$window.width()) && $element.css('left', Math.max($$window.width() - $element.outerWidth() - rightOffset, 0));
                initial = false;
              }
            };

            $$window.on('resize', sizeElement);
            $element.on('resize', function(e) {
              e.stopPropagation();
            });
            _instance.$watch('isOpened', function(open) {
              if (open) {
                if ($animateCss) {
                  $animateCss(angular.element($document[0].body), {addClass: 'eh-help-' + _instance.display}).start().finally(triggerResize);
                } 
                else {
                  $animate.addClass(angular.element($document[0].body), 'eh-help-' + _instance.display).then(triggerResize);
                }
                sizeElement();
              }
              else {
                $content.contents().length && $animate.leave($content.contents());
                if ($animateCss) {
                  $animateCss(angular.element($document[0].body), {removeClass: 'eh-help-' + _instance.display}).start().finally(triggerResize);
                } 
                else {
                  $animate.removeClass(angular.element($document[0].body), 'eh-help-' + _instance.display).then(triggerResize);
                }
              }
            });

            _instance.$watch('content', function(content) {
              var contentScope = _instance.$new(true);
              var body = angular.element(content.body);
              $content.contents().length && $animate.leave($content.contents());
              $animate.enter(body, $content).then(sizeElement);
              $compile(body)(contentScope);
              _instance.minimized && _instance.restore();
              _instance.isOpened = true;
            });

            _instance.setDisplay = function(type) {
              var draggable, addClass, removeClass, addBodyClass, removeBodyClass, currentDisplay = _instance.display;
              _instance.minimized = false;
              _instance.display = _.include(_.values(DISPLAY_TYPES), type) ? type : DISPLAY_TYPES.floating;
              draggable = _instance.display === DISPLAY_TYPES.floating ? 'enable' : 'disable';
              $element.draggable(draggable).resizable(draggable);

              addClass = 'eh-help-popup__' + _instance.display;
              removeClass = currentDisplay && currentDisplay !== _instance.display ? 'eh-help-popup__' + currentDisplay + ' eh-help-popup__minimized': 'eh-help-popup__minimized';
              addBodyClass = 'eh-help-' + _instance.display;
              removeBodyClass = currentDisplay && currentDisplay !== _instance.display ? 'eh-help-' + currentDisplay: '';
              if (_instance.isOpened) {
                if ($animateCss) {
                  $animateCss($element, {addClass: addClass, removeClass: removeClass}).start().finally(sizeElement);
                  $animateCss(angular.element($document[0].body), {addClass: addBodyClass, removeClass: removeBodyClass}).start().finally(triggerResize);
                } 
                else {
                  $animate.setClass($element, addClass, removeClass).then(sizeElement);
                  $animate.setClass(angular.element($document[0].body), addBodyClass, removeBodyClass).then(triggerResize);
                }
              }
              else {
                $element.addClass(addClass).removeClass((removeClass + ' eh-help-popup__minimized').trim());
              }
            };

            _instance.minimize = function() {
              if (_instance.isOpened) {
                $element.draggable('disable');
                _instance.minimized = true;
                if ($animateCss) {
                  $animateCss($element, {addClass: 'eh-help-popup__minimized', removeClass: 'eh-help-popup__' + _instance.display}).start();
                  $animateCss(angular.element($document[0].body), {removeClass: 'eh-help-' + _instance.display}).start().finally(triggerResize);
                } 
                else {
                  $animate.setClass($element, 'eh-help-popup__minimized', 'eh-help-popup__' + _instance.display);
                  $animate.removeClass(angular.element($document[0].body), 'eh-help-' + _instance.display).then(triggerResize);
                }
              }
            };

            _instance.restore = function() {
              _instance.setDisplay(_instance.display);
            };

            _instance.back = function() {
              _instance.content = _instance.content.$prevContent || _instance.content;
            };

            _instance.forward = function() {
              _instance.content = _instance.content.$nextContent || _instance.content;
            };
            
            _instance.open = open;
            _instance.close = close;

            _instance.$on('$destroy', function() {
              _instance = null;
              $element = null;
              $content = null;
              $$window.off('resize', sizeElement);
            });

            _instance.setDisplay(_options.initialPosition);
            if (_instance.display === DISPLAY_TYPES.floating) {
              var css = _options.initialPosition === 'bottom-left' ? {top:'100%', left: '10px'} : 
                _options.initialPosition === 'bottom-right' ? {top:'100%', left:'100%'} :
                _options.initialPosition === 'top-right' ? {top:'10px', left:'100%'} : {top:'10px', left:'10px'};
              $element.css(css);
            }
          }
          return _instance;
        }

        function open(content) {
          var popup = getInstance();
          
          if (popup.content && popup.content.body === content){
            popup.content = {body:content, $prevContent: popup.content.$prevContent, $nextContent: popup.content.$nextContent};
          }
          else {
            popup.content = {body: content, $prevContent: popup.content};
            if (popup.content.$prevContent) {
              popup.content.$prevContent.$nextContent = popup.content;
            }
          }
        }

        function close() {
          if (_instance) {
            _instance.isOpened = false;
          }
        }

        return {
          extend: _.curry(_.assign, 2)(_config),
          open: open,
          close: close
        };
      }]
    };
  });
}());

(function () {
  'use strict';
  /**
   * @ngdoc directive
   * @name bmc.help.help-link.directive:ehHelpLink
   * @module bmc.help
   * @restrict E
   * @description
   * Creates a help documentation link that either loads content in the {@link bmc.help.service:ehHelpPopup `ehHelpPopup`}
   * or navigates to external documentation, depending on the availability of internal help documentation for the directive's help topic.
   *
   * @param {string=} topic Help topic to use for the link. If omitted, the link's topic is dynamically generated
   * from the `helpTopic` property of the application's current ui-router state.
   *
   * A ui-router state's `helpTopic` should be either a string or an $injector-invokable function that returns a string; it is
   * inherited from the parent state.
   *
   * When the `topic` is omitted and the current state has no associated `helpTopic`, the configured `defaultTopic` in {@link bmc.help.service:ehHelpDocsService `ehHelpDocsService`}
   * is used instead.
  **/
  angular.module('bmc.help').directive('ehHelpLink', ['$state', '$injector', '$timeout', 'ehHelpDocsService', 'ehHelpPopup', function($state, $injector, $timeout, ehHelpDocsService, ehHelpPopup) {
    return {
      restrict: 'EAC',
      scope: true,
      transclude: true,
      template: '<a target="_blank" href="." ng-transclude class="d-icon-question_circle_o"></a>',
      link: function($scope, $element, $attrs) {
        var $link = $element.children('a');

        function getTopic() {
          if (_.isString($attrs.topic) && $attrs.topic) {
            return $attrs.topic;
          }
          else {
            var topic = $state.current.helpTopic;
            topic = angular.isFunction(topic) || (angular.isArray(topic) && angular.isFunction(topic[topic.length-1])) ? $injector.invoke(topic) : topic;
            return _.isString(topic) && topic || ehHelpDocsService.getDefaultTopic();
          }
        }

        $link.on('click', function(e) {
          var topic = getTopic();
          if (ehHelpDocsService.hasDocument(topic)) {
            ehHelpDocsService.getDocument(topic).then(ehHelpPopup.open);
            return false;
          }
          else {
            $link.attr('href', ehHelpDocsService.getExternalLink(topic));
            $timeout(function(){ $link.attr('href', '.'); });
          }
        });
      }
    };
  }]);  
}());
