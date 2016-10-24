angular.module('dpl-busy-loader', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('template/busy-loader.html',
        "<div class='d-busy__wrapper'>" +
        "    <div class='d-busy__cover'>" +
        "       <div class='d-preloader d-icon-left-circle_25_o'></div>" +
        "        <p class='d-busy__text'>{{$message}}</p>" +
        "    </div>" +
        "</div>");
}]);
