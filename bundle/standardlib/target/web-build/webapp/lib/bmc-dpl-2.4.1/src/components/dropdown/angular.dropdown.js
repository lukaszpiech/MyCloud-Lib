(function () {
    angular.module('dpl_components')
        .directive('dDropdown', ['$compile', function ($compile) {
            return {
                restrict: 'C',
                scope: {
                    model: "="
                },
                controller : function($scope, $element, $attrs){
                    this.getScopeValue = function (key) {
                        return $scope[key];
                    };
                    var getElementValue = function (el) {
                        if (el.data("value") !== undefined) {
                            return el.data("value");
                        } else {
                            return el.attr("value");
                        }
                    };
                    this.updateModel = function () {
                        if ($attrs.mode == "selectable" || $attrs.mode == "unselectable") {
                            $scope.model = getElementValue($element.find(".d-dropdown__menu .is-checked"));
                            $scope.$apply();
                        } else if ($attrs.mode == "multiselectable") {
                            var arr = [];
                            $element.find(".d-dropdown__menu .is-checked").each(function() {
                                arr.push(getElementValue($(this)));
                            });
                            $scope.model = arr;
                            $scope.$apply();
                        }
                    };
                    this.updateOptions = function ($item) {
                        if ($scope.model !== undefined) {
                            if ($scope.model.constructor == Array) {
                                if ($attrs.mode == "multiselectable") {
                                    if ($scope.model.indexOf(getElementValue($item)) != -1) {
                                        $item.addClass("is-checked");
                                    } else {
                                        $item.removeClass("is-checked");
                                    }
                                }
                            } else  {
                                if ($attrs.mode == "selectable" || $attrs.mode == "unselectable") {
                                    if (getElementValue($item) == $scope.model) {
                                        $item.addClass("is-checked");
                                    } else {
                                        $item.removeClass("is-checked");
                                    }
                                }
                            }
                        }
                    };
                    this.updateTriggerValue = function () {

                        var dropdownTriggerValue = "";
                        var $dropdownTrigger = $element.find(".d-dropdown__trigger");

                        $element.find(".d-dropdown__menu-options-item-option.is-checked").each(function () {
                            var val = $(this).data("value");
                            var title = $(this).html();
                            dropdownTriggerValue +='<span data-value="'+val+'">' + title + '</span>';
                        });
                        if (dropdownTriggerValue == "") {
                            dropdownTriggerValue = $dropdownTrigger.data("placeholder");
                        }
                        $dropdownTrigger.html(dropdownTriggerValue);
                    };
                    this.checkInit = function () {
                        return $attrs.model !== undefined;
                    };
                    this.checkShowValue = function () {
                        return $element.find(".d-dropdown__trigger").data("showValue") !== undefined;
                    }
                },
                link: function (scope, element, attrs, ctrl, transclude) {
                    if (ctrl.checkInit()) {
                        if (ctrl.checkShowValue()) {
                            scope.$watch(function () {return ctrl.getScopeValue("model");}, function () {
                                setTimeout(function () {
                                    //console.log("update trigger value");
                                    ctrl.updateTriggerValue();
                                }, 0);
                            }, true);
                        }
                    }
                }
            };
        }])
        .directive('dDropdownMenuOptionsItemOption', ['$compile', function ($compile) {
            return {
                restrict: 'C',
                scope: {},
                require: "^dDropdown",
                link: function (scope, element, attrs, ctrl, transclude) {
                    if (ctrl.checkInit()) {
                        element.on("click", function() {
                            //console.log("click");
                            setTimeout(function() {
                                ctrl.updateModel();
                            }, 0);
                        });
                        scope.$watch(function(){return ctrl.getScopeValue("model");}, function () {
                            //console.log("options update");
                            ctrl.updateOptions(element);
                        }, true);
                    }
                }
            };
        }])
        .directive('dDropdownMenuActionsActionSelectAll', ['$compile', function ($compile) { // "select all" filter
            return {
                restrict: 'C',
                scope: {},
                require: "^dDropdown",
                link: function (scope, element, attrs, ctrl, transclude) {
                    if (ctrl.checkInit()) {
                        element.on("click", function() {
                            setTimeout(function() {
                                ctrl.updateModel();
                            }, 0);
                        });
                        scope.$watch(function(){return ctrl.getScopeValue("model");}, function () {
                            //console.log("options update");
                            ctrl.updateOptions(element);
                        }, true);
                    }
                }
            };
        }])
        .directive('dDropdownMenuActionsActionSelectNone', ['$compile', function ($compile) { // "select none" filter
            return {
                restrict: 'C',
                scope: {},
                require: "^dDropdown",
                link: function (scope, element, attrs, ctrl, transclude) {
                    if (ctrl.checkInit()) {
                        element.on("click", function() {
                            setTimeout(function() {
                                ctrl.updateModel();
                            }, 0);
                        });
                        scope.$watch(function(){return ctrl.getScopeValue("model");}, function () {
                            //console.log("options update");
                            ctrl.updateOptions(element);
                        }, true);
                    }
                }
            };
        }]);
}());