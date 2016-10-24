(function ($) {
    $.fn.dButtonGroup = function (options) {
        var settings = $.extend({
            buttonGroupSelector : ".d-button-group",
            buttonGroupItemSelector : ".d-button-group__item",
            buttonGroupItemButtonSelector : ".d-button-group__item .d-button",
            mode : "mode",
            selectable : "selectable",
            unselectable : "unselectable",
            multiselectable : "multiselectable"
        }, options);
        $(document).on('click', settings.buttonGroupItemButtonSelector, function (e){
            var $this = $(this);
            var $buttonGroup = $this.parents(settings.buttonGroupSelector);
            var isSelectable = $buttonGroup.data(settings.mode) == settings.selectable;
            var isUnSelectable = $buttonGroup.data(settings.mode) == settings.unselectable;
            var isMultiSelectable = $buttonGroup.data(settings.mode) == settings.multiselectable;
            var isDisabled = $this.attr("disabled") !== undefined;
            var isSelected = $this.hasClass("is-checked");
            var clearItemSelection = function () {
                $buttonGroup.find(settings.buttonGroupItemButtonSelector).removeClass("is-checked");
            };
            var selectItem = function () {
                $this.addClass("is-checked");
            };
            var unSelectItem = function () {
                $this.removeClass("is-checked");
            };
            if (!isDisabled) {
                if (isSelectable) {
                    if (!isSelected) {
                        clearItemSelection();
                        selectItem();
                    }
                } else if (isUnSelectable) {
                    if (!isSelected) {
                        clearItemSelection();
                        selectItem();
                    } else {
                        unSelectItem();
                    }
                } else if (isMultiSelectable) {
                    if (!isSelected) {
                        selectItem();
                    } else {
                        unSelectItem();
                    }
                }
            }
        });
    };
    $(".d-button-group").dButtonGroup();
}(jQuery));
