(function ($) {
    $.fn.dDropdown = function (options) {
        var getElementAttributeValue = function (element) {
            return element.data("value") || element.attr("value");
        };
        var settings = $.extend({
            dropdownSelector : ".d-js-dropdown",
            dropdownTriggerSelector : ".d-dropdown__trigger",
            dropdownOptionSelector : ".d-dropdown__menu-options-item-option",
            selectable : "selectable",
            unselectable : "unselectable",
            multiselectable : "multiselectable"
        }, options);
        // bind click on label to trigger dropdown's trigger
        $(document).on('click', ".d-dropdown__label", function (e){
            var $this = $(this);
            $this.parents(settings.dropdownSelector).find(settings.dropdownTriggerSelector).trigger("click");
        });
        // bind click on dropdown trigger
        $(document).on('click', settings.dropdownTriggerSelector, function (e){
            e.stopPropagation();
            var $this = $(this); // dropdown trigger
            if (!$this.attr("disabled")) { // check dropdown trigger not disabled
                if (!$this.hasClass("is-checked")) { // check dropdown trigger is not open
                    $(settings.dropdownSelector).removeClass("is-open");
                    $(settings.dropdownTriggerSelector).removeClass("is-checked");
                    $this.parents(settings.dropdownSelector).addClass("is-open");
                    $this.addClass("is-checked");
                } else {
                    $this.parents(settings.dropdownSelector).removeClass("is-open");
                    $this.removeClass("is-checked");
                }
                $this.parents(settings.dropdownSelector).find(".d-textfield__input").focus();
            }
        });
        // bind click on document to close dropdown on click outside of dropdown
        $(document).on('click', function (e){
            $(settings.dropdownSelector).removeClass("is-open");
            $(settings.dropdownTriggerSelector).removeClass("is-checked");
        });
        $(document).on('click', '.d-js-dropdown', function (e){
            e.stopPropagation();
        });
        // bind click on escape button to close dropdown
        $(document).keyup(function(e) {
            if (e.keyCode == 27) { // escape
                $(settings.dropdownSelector).removeClass("is-open");
                $(settings.dropdownTriggerSelector).removeClass("is-checked");
            }
        });

        var updateTriggerValue = function ($dropdown) {
            var dropdownTriggerValue = "";
            var $dropdownTrigger = $dropdown.find(settings.dropdownTriggerSelector);
            if ($dropdownTrigger.data("showValue") !== undefined) {
                $dropdown.find(settings.dropdownOptionSelector + ".is-checked").each(function () {
                    var val = $(this).data("value");
                    var title = $(this).text();
                    dropdownTriggerValue +='<span data-value="'+val+'">' + title + '</span>';
                });
                if (dropdownTriggerValue == "") {
                    dropdownTriggerValue = $dropdownTrigger.data("placeholder");
                } else {

                }
                $dropdownTrigger.html(dropdownTriggerValue);
            }

        };
        var unSelectItems = function ($dropdown) {
            $dropdown.find(settings.dropdownOptionSelector).removeClass("is-checked");
        };
        var selectItems = function ($dropdown) {
            $dropdown.find(settings.dropdownOptionSelector).addClass("is-checked");
        };
        var selectItem = function ($item) {
            $item.addClass("is-checked");
        };
        var unSelectItem = function ($item) {
            $item.removeClass("is-checked");
        };


        $(document).on('click', '.d-dropdown__menu-options-item-option', function (e) {
            var $this = $(this);
            var $dropdown = $this.parents(settings.dropdownSelector);
            var isSelectable = $dropdown.data("mode") == settings.selectable;
            var isUnSelectable = $dropdown.data("mode") == settings.unselectable;
            var isMultiSelectable = $dropdown.data("mode") == settings.multiselectable;
            var isDisabled = $this.attr("disabled") !== undefined;
            var isSelected = $this.hasClass("is-checked");
            if (!isDisabled) {
                if (isSelectable) {
                    if (!isSelected) {
                        unSelectItems($dropdown);
                        selectItem($this);
                    }
                    $this.parents(".d-js-dropdown").removeClass("is-open");
                    $this.parents(".d-js-dropdown").find(".d-dropdown__trigger").removeClass("is-checked");
                } else if (isUnSelectable) {
                    if (!isSelected) {
                        unSelectItems($dropdown);
                        selectItem($this);
                    } else {
                        unSelectItem($this);
                    }
                    $this.parents(".d-js-dropdown").removeClass("is-open");
                    $this.parents(".d-js-dropdown").find(".d-dropdown__trigger").removeClass("is-checked");
                } else if (isMultiSelectable) {
                    if (!isSelected) {
                        selectItem($this);
                    } else {
                        unSelectItem($this);
                    }
                } else {
                    $this.parents(".d-js-dropdown").removeClass("is-open");
                    $this.parents(".d-js-dropdown").find(".d-dropdown__trigger").removeClass("is-checked");
                }
            }
            updateTriggerValue($dropdown);
        });
        $(document).on('click', '.d-dropdown__menu-actions-action_select-all', function (e) {
            var $this = $(this);
            var $dropdown = $this.parents(settings.dropdownSelector);
            var isMultiSelectable = $dropdown.data("mode") == settings.multiselectable;
            if (isMultiSelectable) {
                selectItems($dropdown);
                updateTriggerValue($dropdown);
            }  else {
                console.log("error log: all dropdown options can't be selected");
            }
        });
        $(document).on('click', '.d-dropdown__menu-actions-action_select-none', function (e) {
            var $this = $(this);
            var $dropdown = $this.parents(settings.dropdownSelector);
            var isUnSelectable = $dropdown.data("mode") == settings.unselectable;
            var isMultiSelectable = $dropdown.data("mode") == settings.multiselectable;
            if (isUnSelectable || isMultiSelectable) {
                unSelectItems($dropdown);
                updateTriggerValue($dropdown);
            } else {
                console.log("error log: dropdown options can't be unselected");
            }
        });
    };

    $(".d-js-dropdown").dDropdown();
}(jQuery));