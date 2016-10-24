var dpl_components = angular.module('dpl_components', []);

(function () {
    angular.module('dpl_components')
        .directive('dButtonGroup', ['$compile', function ($compile) {
            return {
                restrict: 'C',
                scope: {
                    model: "="
                },
                controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
                    this.getScopeValue = function (key) {
                        return $scope[key];
                    };
                    var getElementValue = function (el) {
                        return el.data("value") || el.attr("value");
                    };
                    this.updateModel = function () {
                        if ($attrs.mode == "selectable" || $attrs.mode == "unselectable") {
                            $scope.model = getElementValue($element.find(".is-checked"));
                            $scope.$apply();
                        } else if ($attrs.mode == "multiselectable") {
                            var arr = [];
                            $element.find(".is-checked").each(function () {
                                arr.push(getElementValue($(this)));
                            });
                            $scope.model = arr;
                            $scope.$apply();
                        }
                    };
                    this.updateButtons = function ($button) {
                        if ($scope.model !== undefined) {
                            if ($scope.model.constructor == Array) {
                                if ($attrs.mode == "multiselectable") {
                                    if ($scope.model.indexOf(getElementValue($button)) != -1) {
                                        $button.addClass("is-checked");
                                    } else {
                                        $button.removeClass("is-checked");
                                    }
                                }
                            } else {
                                if ($attrs.mode == "selectable" || $attrs.mode == "unselectable") {
                                    if (getElementValue($button) == $scope.model) {
                                        $button.addClass("is-checked");
                                    } else {
                                        $button.removeClass("is-checked");
                                    }
                                }
                            }
                        }
                    }
                }]
            };
        }])
        .directive('dButtonGroupItem', ['$compile', function ($compile) {
            return {
                restrict: 'C',
                scope: {},
                require: '^dButtonGroup',
                link: function (scope, element, attrs, ctrl) {

                    element.on("click", function () {
                        setTimeout(function () {
                            ctrl.updateModel();
                        }, 0);
                    });
                    scope.$watch(function () {
                        return ctrl.getScopeValue("model");
                    }, function () {
                        ctrl.updateButtons(element.find(".d-button"));
                    }, true);
                }
            };
        }]);
}());