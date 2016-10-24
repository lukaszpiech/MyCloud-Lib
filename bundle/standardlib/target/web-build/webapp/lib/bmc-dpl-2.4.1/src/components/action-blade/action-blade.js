var dplActionBlade = angular.module('dplActionBlade', ['ngAnimate', 'ui.bootstrap', 'template/action-blade.html']);

angular.module('template/action-blade.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('template/action-blade.html',
        "<div class='modal-header'>" +
        "	<h3>{{data.header}}</h3>" +
        "</div>" +
        "<div class='modal-body'>" +
        "{{data.body}}" +
        "</div>"
    );
}]);
