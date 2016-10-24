var dplModal = angular.module('dplModal', ['ngAnimate', 'ui.bootstrap', 'template/modal.html']);


angular.module('template/modal.html', []).run(['$templateCache', function ($templateCache) {
    'use strict';

    //TODO: add differernts d-modal__header

    $templateCache.put('template/modal.html',
        "<div class='d-modal' ng-click='close($event)' modal-render='{{$isRendered}}' tabindex='-1' role='dialog' ng-class=\"{'d-modal_in': animate}\" modal-animation-class='d-modal_fade' modal-in-class='d-modal_in' ng-style=\"{'z-index': 1050 + index*10, display: 'block'}\">" +
        "<div class='d-modal__dialog'>" +
        "<div class='d-modal__header'></div>" +
        "<div class='d-modal__content'></div>" +
        "<div class='d-modal__footer'> " +
        "</div>" +
        "</div>" +
        "</div>");
}]);