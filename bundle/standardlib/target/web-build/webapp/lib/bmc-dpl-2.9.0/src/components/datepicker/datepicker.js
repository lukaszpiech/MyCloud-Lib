var dplDatepicker = angular.module('dplDatepicker', [
        'ui.bootstrap',
        'gm.datepickerMultiSelect',
        'd-datepicker-templates'
    ])

    .constant('uibDatepickerConfig', {
        datepickerMode: 'day',
        formatDay: 'd',
        formatMonth: 'MMM',
        formatYear: 'yyyy',
        formatDayHeader: 'EE',
        formatDayTitle: 'MMM yyyy',
        formatMonthTitle: 'yyyy',
        maxDate: null,
        maxMode: 'year',
        minDate: null,
        minMode: 'day',
        ngModelOptions: {},
        shortcutPropagation: false,
        startingDay: 1,
        showWeeks: false,
        yearColumns: 5,
        yearRows: 4

    })
        
    /**
     * Standard Angular dateFilter doesn't support two letters Day-`-Week names
     * it supports only:
     * 'EEEE': Day in Week,(Sunday-Saturday)
     * 'EEE': Day in Week, (Sun-Sat)
     *
     * we need to extend it to allow the next:
     * 'EE': Day in Week, (Su-Sa)
     *
     *
     */
    .config(['$provide', '$injector', function ($provide, $injector) {
        $provide.decorator('dateFilter', ['$delegate', function ($delegate) {
            var srcFilter = $delegate;

            return function () {

                var g,
                    twoLettersDay = (arguments[1] === "EE");

                arguments[1] = (twoLettersDay) ? "EEE" : arguments[1];
                g = srcFilter.apply(this, arguments);

                // TODO: double check with timezones
                return (twoLettersDay) ? g.slice(0, 2) : g;
            };

        }]);
    }]);
angular.module("d-datepicker-templates", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("uib/template/datepicker/datepicker.html",
        "<div ng-switch=\"datepickerMode\" role=\"application\" ng-keydown=\"keydown($event)\">\n" +
        "  <uib-daypicker ng-switch-when=\"day\" tabindex=\"0\"></uib-daypicker>\n" +
        "  <uib-monthpicker ng-switch-when=\"month\" tabindex=\"0\"></uib-monthpicker>\n" +
        "  <uib-yearpicker ng-switch-when=\"year\" tabindex=\"0\"></uib-yearpicker>\n" +
        "</div>");

    $templateCache.put("uib/template/datepicker/day.html",
        "<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\" class=\"d-datepicker-table\">\n" +
        "  <thead>\n" +
        "    <tr>\n" +
        "      <th><button type=\"button\" class=\"d-datepicker-prev\" ng-click=\"move(-1)\" tabindex=\"-1\"></button></th>\n" +
        "      <th colspan=\"{{::5 + showWeeks}}\">" +
        "          <button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"d-datepicker__shown-date\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\">" +
        "           {{title}}" +
        "           </button>" +
        "       </th>\n" +
        "      <th><button type=\"button\" class=\"d-datepicker-next\" ng-click=\"move(1)\" tabindex=\"-1\"></button></th>\n" +
        "    </tr>\n" +
        "    <tr>\n" +
        "      <th ng-if=\"showWeeks\" class=\"text-center\"></th>\n" +
        "      <th ng-repeat=\"label in ::labels track by $index\" class=\"d-datepicker-weeks\"><span aria-label=\"{{::label.full}}\">{{::label.abbr}}</span></th>\n" +
        "    </tr>\n" +
        "  </thead>\n" +
        "  <tbody>\n" +
        "    <tr ng-repeat=\"row in rows track by $index\">\n" +
        "      <td ng-if=\"showWeeks\" class=\"text-center h6\"><em>{{ weekNumbers[$index] }}</em></td>\n" +
        "      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{::dt.uid}}\" ng-class=\"::dt.customClass\">\n" +
        "        <button type=\"button\" style=\"min-width:100%;\" ng-show=\"!dt.secondary\" class=\"d-datepicker__day\" ng-class=\"{'d-datepicker__selected' : dt.selected, 'd-datepicker__current': dt.current, 'd-datepicker__active': isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\">" +
        "           <span ng-class=\"::{'text-muted': dt.secondary, 'd-datepicker__muted': dt.secondary, 'text-info': dt.current}\">{{::dt.label}}</span>" +
        "       </button>\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "");

    $templateCache.put("uib/template/datepicker/month.html",
        "<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\" class=\"d-datepicker-table\">\n" +
        "  <thead>\n" +
        "    <tr>\n" +
        "      <th><button type=\"button\" class=\"d-datepicker-prev\" ng-click=\"move(-1)\" tabindex=\"-1\"></button></th>\n" +
        "      <th><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"d-datepicker__shown-date\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\" style=\"width:100%;\">" +
        "            <strong>{{title}}</strong>" +
        "          </button></th>\n" +
        "      <th><button type=\"button\" class=\"d-datepicker-next\" ng-click=\"move(1)\" tabindex=\"-1\"></button></th>\n" +
        "    </tr>\n" +
        "  </thead>\n" +
        "  <tbody>\n" +
        "    <tr ng-repeat=\"row in rows track by $index\">\n" +
        "      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{::dt.uid}}\" ng-class=\"::dt.customClass\">\n" +
        "        <button type=\"button\" style=\"min-width:100%;\" class=\"d-datepicker__month\" ng-class=\"{'d-datepicker__selected': dt.selected, 'd-datepicker__current': dt.current, 'd-datepicker__active': isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\">" +
        "           <span ng-class=\"::{'text-info': dt.current}\">{{::dt.label}}</span>" +
        "       </button>\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "");

    $templateCache.put("uib/template/datepicker/year.html",
        "<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\" class=\"d-datepicker-table\">\n" +
        "  <thead>\n" +
        "    <tr>\n" +
        "      <th><button type=\"button\" class=\"d-datepicker-prev\" ng-click=\"move(-1)\" tabindex=\"-1\"></button></th>\n" +
        "      <th colspan=\"3\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"d-datepicker__shown-date\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\" style=\"width:100%;\"><strong>{{title}}</strong></button></th>\n" +
        "      <th><button type=\"button\" class=\"d-datepicker-next\" ng-click=\"move(1)\" tabindex=\"-1\"></button></th>\n" +
        "    </tr>\n" +
        "  </thead>\n" +
        "  <tbody>\n" +
        "    <tr ng-repeat=\"row in rows track by $index\">\n" +
        "      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{::dt.uid}}\" ng-class=\"::dt.customClass\">\n" +
        "        <button type=\"button\" style=\"min-width:100%;\" class=\"d-datepicker__year\" ng-class=\"{'d-datepicker__selected': dt.selected, 'd-datepicker__current': dt.current, 'd-datepicker__active': isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\">" +
        "           <span ng-class=\"::{'text-info': dt.current}\">{{::dt.label}}</span>" +
        "       </button>\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "");

    $templateCache.put("uib/template/datepickerPopup/popup.html",
        "  <div>" +
        "  <ul class=\"d-datepicker uib-datepicker-popup d-datepicker-popup uib-position-measure\" ng-if=\"isOpen\" ng-keydown=\"keydown($event)\" ng-click=\"$event.stopPropagation()\">\n" +
        "	<li ng-transclude></li>\n" +
        "    <li ng-if=\"showButtonBar\" class=\"uib-button-bar\">\n" +
        "		<span class=\"btn-group pull-left\">\n" +
        "          <button type=\"button\" class=\"btn btn-sm btn-info uib-datepicker-current\" ng-click=\"select('today', $event)\" ng-disabled=\"isDisabled('today')\">{{ getText('current') }}</button>\n" +
        "          <button type=\"button\" class=\"btn btn-sm btn-danger uib-clear\" ng-click=\"select(null, $event)\">{{ getText('clear') }}</button>\n" +
        "		</span>\n" +
        "		<button type=\"button\" class=\"btn btn-sm btn-success pull-right\" ng-click=\"close()\">{{ getText('close') }}</button>\n" +
        "	</li>\n" +
        "</ul>\n" +
        "</div>" +

        "");
}]);