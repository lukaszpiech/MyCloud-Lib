// TODO: • add error checking

var dplDatetimepicker = angular.module('dplDatetimepicker', ['dplDatepicker', 'dplTimepicker'])
    .controller('dplDatetimepickerController', [
        '$scope', '$element', '$attrs', '$document',
        function ($scope, $element, $attrs, $document) {

            var ngModelCtrl = {$setViewValue: angular.noop}; // nullModelCtrl

            $scope.focused = false;

            $scope.ismeridian = angular.isDefined($attrs.showMeridian) ? ($attrs.showMeridian.toLowerCase() === "true") : true;
            $scope.hstep = angular.isDefined($attrs.hstep) ? parseInt($attrs.hstep, 10) : 1;
            $scope.mstep = angular.isDefined($attrs.mstep) ? parseInt($attrs.mstep, 10) : 5;

            $scope.label = angular.isDefined($attrs.label) ? $attrs.label : undefined;
            $scope.labelHidden = angular.isDefined($attrs.labelHidden);
            $scope.required = angular.isDefined($attrs.required);

            $scope.tabindex = angular.isDefined($attrs.tabindex) ? $attrs.tabindex : 0;
            $element.removeAttr('tabindex');

            function updateValue() {
                ngModelCtrl.$setViewValue($scope.datetime);
            }

            this.init = function (_ngModel) {

                ngModelCtrl = _ngModel;

                ngModelCtrl.$formatters.unshift(function (modelValue) {

                    $scope.datetime = modelValue || new Date();
                    $scope.initValue = modelValue || new Date();

                    return modelValue || null;
                });
            };

            /**
             * destroys click and ESC event listeners
             */
            function destroyListeners() {
                document.body.removeEventListener('click', $scope.clickHandler, true);
                $document.off('keydown keypress', $scope.escapeKeyHandler);
            }

            /**
             * closes picker and destroys listeners
             */
            function closePicker() {

                $scope.focused = false;
                $scope.datetime = $scope.initValue;
                $scope.$apply();

                updateValue();
                destroyListeners();
            }

            /**
             * adds event listeners to handle clicks outside and ESC button,
             * closure is used to pass $element inside clickHandler (jqLite#on does not support eventData parameters as jQuery does.)
             * @param $element - dtpicker element
             * @param $scope - $scope of dtpicker
             */
            function initEventListeners($element, $scope) {

                $scope.clickHandler = function (e) {
                    if (!$element[0].contains(e.target)) {
                        closePicker();
                    }
                };

                $scope.escapeKeyHandler = function (e) {
                    if (e.which === 27) {
                        closePicker();
                    }
                };

                // need to catch click event before AngularJS change DOM tree
                document.body.addEventListener('click', $scope.clickHandler, true);
                $document.on('keydown keypress', $scope.escapeKeyHandler);
            }

            /**
             * sets current date
             */
            $scope.today = function () {
                $scope.datetime = new Date();
            };

            /**
             * is being called by Accept button, accepts new value
             */
            $scope.accept = function () {
                $scope.focused = false;
                $scope.initValue = $scope.datetime;
                updateValue();
                destroyListeners();
            };

            /**
             * opens picker, makes sure adding eventlisteners just once
             */
            $scope.openPicker = function () {

                if (!$scope.focused) {
                    $scope.focused = true;
                    initEventListeners($element, $scope);
                }
            };

            /**
             * clears event listeners on destroy
             */
            $scope.$on('$destroy', function () {
                destroyListeners();
            });
        }])
    .directive('dDatetimepicker', [function () {
        return {
            restrict: 'A',
            require: ['dDatetimepicker', '?^ngModel'],
            controller: 'dplDatetimepickerController',
            controllerAs: 'dtpicker',
            replace: true,
            scope: {},
            templateUrl: 'time-date.html',

            link: function (scope, element, attrs, ctrls) {

                var counterCtrl = ctrls[0],
                    ngModelCtrl = ctrls[1];

                if (ngModelCtrl) {
                    counterCtrl.init(ngModelCtrl);
                }
            }
        };
    }
    ])

    .directive('formatValidate', ['$filter', 'dateFilter', function ($filter, dateFilter) {
        "use strict";
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                //
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

                ctrl.$formatters.push(function (data, c, d) {
                    var format = this ? 'dd MMM yyyy hh:mm a': 'dd MMM yyyy HH:mm';

                    // convert data from model format to view format
                    return dateFilter(data, format ); //converted
                }.bind(scope.ismeridian));
            }
        };

    }]).run(["$templateCache", function ($templateCache) {
        "use strict";
        $templateCache.put("time-date.html",
            "<div class=\"d-datetimepicker\" ng-class=\"{'is-open':focused}\">" +
            "    <label class=\"d-textfield__label d-icon-right-calendar\">" +
            "          <span class=\"d-textfield__item\" ng-class='{\"sr-only\": labelHidden, \"d-datetimepicker_required\": required}'>{{label || 'Pick time:'}}</span>" +
            "         <input type=\"text\" class=\"d-textfield__input\" ng-focus=\"openPicker()\" ng-model=\"datetime\" placeholder=\"dd MM yyyy HH:mm a\" tabindex=\"{{tabindex}}\" format-validate>" +
            "    </label>" +
            "<div class=\"d-datetimepicker__wrapper\" ng-show=\"focused\">" +
            "<uib-datepicker " +

            "ng-model=\"datetime\" " +
            "class=\"d-datepicker d-datetimepicker__date\"> " +

            "</uib-datepicker>" +

            "<uib-timepicker " +
            "ng-model=\"datetime\" " +
            "class=\"d-timepicker d-datetimepicker__time\" " +

            "show-meridian=\"ismeridian\" " +
            "ng-change=\"changed()\" " +
            "minute-step=\"mstep\" " +
            "hour-step=\"hstep\" " +
            "error=\"Time is not valid\" " +
            "> " +

            "</uib-timepicker> " +

            "<div class=\"d-datetimepicker__actions\">" +
            "    <button ng-click=\"today()\" class=\"d-button d-button_action d-button_small d-datetimepicker__today\" type=\"text\">Today</button>" +
            "    <button ng-click=\"accept()\" class=\"d-button d-button_primary d-button_service d-button_small \" type=\"text\">Accept</button>" +
            "</div>" +
            "</div>" +
            "</div>"
        );

    }]);