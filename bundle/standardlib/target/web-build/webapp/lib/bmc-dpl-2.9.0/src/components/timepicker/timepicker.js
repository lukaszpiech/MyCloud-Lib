var dplTimepicker = angular.module('dplTimepicker', ['ui.bootstrap', 'template/timepicker.html']);

dplTimepicker.config(['$provide', function ($provide) {
    'use strict';

    $provide.decorator('uibTimepickerDirective', ['$delegate', function ($delegate) {
        $delegate[0].templateUrl = 'template/timepicker.html';

        var directive = $delegate[0];

        angular.extend(directive.scope, {
            label: '@',
            error: '@'
        });

        return $delegate;
    }]);
}]);

angular.module('template/timepicker.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('template/timepicker.html',
        "<div>" +
        "  <label class='d-timepicker__label'>" +
        "      <span class='d-timepicker__label_name' ng-if='label !== undefined'>{{label || 'Pick time:'}}</span>" +
        "      <span class='d-timepicker__unit d-timepicker__unit_hours' ng-class='{hasError: invalidHours}'>" +
        "        <span class='sr-only'>Hours:</span>" +
        "        <input class='d-timepicker__input' type='text' ng-model='hours' ng-change='updateHours()' ng-disabled='noIncrementHours()' placeholder='' maxlength='2' tabindex='{{::tabindex}}' ng-readonly='::readonlyInput' ng-blur='blur()'/>" +
        "        <span class='d-timepicker__increase d-icon-angle_up' ng-click='incrementHours()' ng-class='{\"is-disabled\": noIncrementHours()}' ng-disabled='noIncrementHours()'></span>" +
        "        <span class='d-timepicker__decrease d-icon-angle_down' ng-click='decrementHours()' ng-class='{\"is-disabled\": noDecrementHours()}' ng-disabled='noDecrementHours()'></span>" +
        "        </span>" +
        "    </label>" +
        "    <div class='d-timepicker__unit' ng-class='{hasError: invalidMinutes}'>" +
        "      <label>" +
        "        <span class='sr-only'>Minutes:</span>" +
        "        <input class='d-timepicker__input' type='text' ng-model='minutes' ng-disabled='noIncrementMinutes()' ng-change='updateMinutes()' placeholder='' ng-readonly='::readonlyInput' maxlength='2' tabindex='{{::tabindex}}' ng-blur='blur()'/>" +
        "      </label>" +
        "      <span class='d-timepicker__increase d-icon-angle_up' ng-click='incrementMinutes()' ng-class='{\"is-disabled\": noIncrementMinutes()}' ng-disabled='noIncrementMinutes()'></span>" +
        "      <span class='d-timepicker__decrease d-icon-angle_down' ng-click='decrementMinutes()' ng-class='{\"is-disabled\": noDecrementMinutes()}' ng-disabled='noDecrementMinutes()'></span>" +
        "    </div>" +
        "    <div class='d-timepicker__unit d-timepicker__meridian' ng-show='showMeridian' ng-click='toggleMeridian()'>" +
        "      <label>" +
        "        <span class='sr-only'>AM\\PM (Meridian):</span>" +
        "        <input class='d-timepicker__input' type='text' readonly maxlength='2' value='{{meridian}}' ng-class='{\"is-disabled\": noToggleMeridian()}' tabindex='{{::tabindex}}' ng-disabled='noToggleMeridian()'/>" +
        "      </label>" +
        "      <span class='d-timepicker__increase d-icon-angle_up' ng-class='{\"is-disabled\": noToggleMeridian()}'></span>" +
        "      <span class='d-timepicker__decrease d-icon-angle_down' ng-class='{\"is-disabled\": noToggleMeridian()}'></span>" +
        "    </div>" +
        "    <p class='d-error'>{{error || 'Time is not valid'}}</p>" +
        "</div>"
    );
}]);