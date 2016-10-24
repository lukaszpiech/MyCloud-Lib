;(function() {
    "use strict";

    angular.module("template/tabs/tab.html", []).run(["$templateCache", function ($templateCache) {
        $templateCache.put("uib/template/tabs/tab.html",
            "<div class=\"d-tabs__tab \" ng-class=\"{'is-checked': active}\"  ng-click=\"select($event)\" uib-tab-heading-transclude>{{heading}}</a>\n");
    }]);

    angular.module("template/tabs/tabset.html", []).run(["$templateCache", function ($templateCache) {
        $templateCache.put("uib/template/tabs/tabset.html",
            "<div>" +
            "   <div class=\"d-tabs__tab-bar\" ng-transclude></div>\n " +
            "   <div class=\"d-tabs__panel\">\n " +
            "       <div  class=\"d-tabs__item\"\n " +
            "               ng-repeat=\"tab in tabset.tabs\"\n " +
            "               ng-class=\"{'is-checked': tabset.active === tab.index}\"\n " +
            "               uib-tab-content-transclude=\"tab\">\n " +
            "       </div>" +
            "   </div>" +
            "</div>" +
            "");
    }]);
}());