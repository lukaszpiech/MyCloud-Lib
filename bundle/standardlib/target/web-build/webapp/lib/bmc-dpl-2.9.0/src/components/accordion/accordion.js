;(function () {
    "use strict";
    
    angular.module("dplAccordion", ["ui.bootstrap", "ngAnimate", "template/accordion.html"]);

    angular.module('template/accordion.html', []).run(['$templateCache', function ($templateCache) {
        $templateCache.put('template/accordion.html',
            '<li class="d-accordion__item" ng-class="{\'is-checked\': isOpen}">' +
            '   <div tabindex="0" ng-click="toggleOpen()" uib-accordion-transclude="heading" class="d-accordion__title d-icon-right-angle_down">' +
            '       {{heading}}' +
            '   </div>' +
            '   <div class="d-accordion__content" uib-collapse="!isOpen" ng-transclude></div>' +
            '</li>');
    }]);

})();


