// TODO: • add error checking,
// TODO: • add params to the directive


var dplDatetimepicker = angular.module('dplDatetimepicker', ['dplDatepicker', 'dplTimepicker'])
    .directive('dDatetimepicker', [

        function () {
            return {
                restrict: 'A',
                templateUrl: 'time-date.html'
            }
        }
    ])

    .directive('formatValidate', ['$filter', 'dateFilter', function ($filter, dateFilter) {
        "use strict";
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {

                scope.filter = $filter;

                ctrl.$validators.dateFormat = function (modelValue, viewValue) {
                    var customDate,
                        isValid = false;

                    if (!ctrl.$isEmpty(modelValue)) {

                        customDate = new Date(modelValue);
                        isValid = !isNaN(customDate);

                    } else {
                        isValid = true;
                        // consider empty models to be valid

                    }
                    // TODO: add error checking
                    return isValid;
                };

                ctrl.$parsers.push(function (data) {

                    // convert data from view format to model format
                    return data; //converted
                });

                ctrl.$formatters.push(function (data) {

                    // convert data from model format to view format
                    return dateFilter(data, 'dd MMM yyyy hh:mm a    '); //converted
                });
            }
        };

    }]).run(["$templateCache", function ($templateCache) {
        "use strict";
        $templateCache.put("time-date.html",
            "<div class=\"d-datetimepicker\">" +
            "    <label class=\"d-textfield__label d-icon-right-calendar\">" +
            "          <span class=\"d-textfield__item\">{{label || 'Pick time:'}}</span>" +
            "         <input type=\"text\" class=\"d-textfield__input\" ng-model=\"td.datetime\" placeholder=\"dd MM yyyy HH:mm a\" format-validate>" +
            "    </label>" +

            "<div class=\"d-datetimepicker__wrapper\">" +
            "<uib-datepicker " +

            "ng-model=\"td.datetime\" " +
            "class=\"d-datepicker d-datetimepicker__date\" " +
            "format-day-title=\"dd MMM yyyy\" " +
            "format-day-header=\"EE\" " +
            "format-month=\"MMM\" " +
            "format-day=\"d\" " +
            "show-weeks=\"false\" " +
            "starting-day=\"1\"> " +

            "</uib-datepicker>" +

            "<uib-timepicker " +
            "ng-model=\"td.datetime\" " +
            "class=\"d-timepicker d-datetimepicker__time\" " +

            "show-meridian=\"ismeridian\" " +
            "ng-change=\"changed()\" " +
            "minute-step=\"mstep\" " +
            "hour-step=\"hstep\" " +
            "error=\"Time is not valid\" " +
            "> " +

            "</uib-timepicker> " +
            "</div>" +
            "</div>"
        );

    }]);