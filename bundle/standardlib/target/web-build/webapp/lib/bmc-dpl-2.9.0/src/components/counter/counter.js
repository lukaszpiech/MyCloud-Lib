//TODO: check mouse wheel
//TODO: add inline layout, readonly
//TODO: add hex format

var dplCounter = angular.module('dplCounter', ['template/counter.html'])
    .constant('dplCounterConfig', {
        inputLength: 3,
        inlineLayout: false,
        readonlyInput: false,
        templateUrl: 'template/counter.html'
    })
    .controller('dplCounterController', [
        '$scope', '$element', '$attrs', '$parse', 'dplCounterConfig',
        function($scope, $element, $attrs, $parse, dplCounterConfig) {

        var ngModelCtrl = { $setViewValue: angular.noop }; // nullModelCtrl

        $scope.inputLength = angular.isDefined($attrs.inputLength) ? $scope.$parent.$eval($attrs.inputLength) : dplCounterConfig.inputLength;
        $scope.label = angular.isDefined($attrs.label) ? $attrs.label : undefined;
        $scope.labelHidden = angular.isDefined($attrs.labelHidden);
        $scope.minValue = angular.isDefined($attrs.min) ? parseInt($attrs.min, 10) : undefined;
        $scope.maxValue = angular.isDefined($attrs.max) ? parseInt($attrs.max, 10) : undefined;
        $scope.step = angular.isDefined($attrs.step) ? parseInt($attrs.step, 10) : 1;
        $scope.required = angular.isDefined($attrs.required);

        $scope.tabindex = angular.isDefined($attrs.tabindex) ? $attrs.tabindex : 0;
        $element.removeAttr('tabindex');

        function updateValue() {
            ngModelCtrl.$setViewValue($scope.counterValue);
        }

        this.init = function (_ngModel, input) {
            var counterInput = input.eq(0);

            ngModelCtrl = _ngModel;

            ngModelCtrl.$formatters.unshift(function(modelValue) {
                $scope.counterValue = modelValue || 0;

                return modelValue ? modelValue : null;
            });

            counterInput.bind('keyup', function (e) {
                $scope.counterValue = parseInt(this.value, 10);
                updateValue();
            });
        };

        $scope.incrementCounter = function () {
            if ($scope.maxValue) {
                if ($scope.counterValue + $scope.step <= $scope.maxValue) {
                    $scope.counterValue += $scope.step;
                    updateValue();
                }
            } else {
                $scope.counterValue += $scope.step;
                updateValue();
            }
        };

        $scope.decrementCounter = function () {
            if ($scope.minValue) {
                if ($scope.counterValue - $scope.step >= $scope.minValue) {
                    $scope.counterValue -= $scope.step;
                    updateValue();
                }
            } else {
                $scope.counterValue -= $scope.step;
                updateValue();
            }
        };

    }])
    .directive('dplCounter', ['dplCounterConfig', function(dplCounterConfig) {
        return {
            restrict: 'A',
            require: ['dplCounter', '?^ngModel'],
            controller: 'dplCounterController',
            controllerAs: 'counter',
            replace: true,
            scope: {},

            templateUrl: function(element, attrs) {
                return attrs.templateUrl || dplCounterConfig.templateUrl;
            },

            link: function(scope, element, attrs, ctrls) {

                var counterCtrl = ctrls[0],
                    ngModelCtrl = ctrls[1];

                if (ngModelCtrl) {
                    counterCtrl.init(ngModelCtrl, element.find('input'));
                }
            }
        };
    }]);

angular.module('template/counter.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('template/counter.html',
        "<label class='d-counter d-counter__label ' ng-class='{\"d-counter_required\" : required}'> " +
        "  <span class='d-counter__label_name' ng-class='{\"sr-only\": labelHidden}'>{{label || 'Counter value:'}}</span>" +
        "    <span class='d-counter__unit'>" +
        "    <input class='d-counter__input' type='number' ng-model='counterValue' placeholder='' maxlength='{{inputLength}}' tabindex='{{tabindex}}' " +
        "     step='{{step}}'  min='{{minValue}}' max='{{maxValue}}'/>" +
        "    <span class='d-counter__increase d-icon-angle_up' ng-click='incrementCounter()'></span>" +
        "    <span class='d-counter__decrease d-icon-angle_down' ng-click='decrementCounter()'></span>" +
        "  </span>" +
        "</label>"
    );
}]);