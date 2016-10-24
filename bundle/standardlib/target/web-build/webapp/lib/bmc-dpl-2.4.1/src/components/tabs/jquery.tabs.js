(function ($) {
    $.fn.dTabs = function (options) {
        var settings = $.extend({
            tabsSelector: ".d-tabs",
            tabsMenuItemSelector: ".d-tabs__tab",
            tabsContentItemSelector: ".d-tabs__item",
            checkedClass: "is-checked"
        }, options);
        $(document).on('click', settings.tabsMenuItemSelector, function (e) {
            var $this = $(this);
            if (!$this.hasClass(settings.checkedClass)) {
                var $tabs = $this.parents(settings.tabsSelector);
                var $menuItem = $tabs.find(settings.tabsMenuItemSelector);
                var $contentItem = $tabs.find(settings.tabsContentItemSelector);
                $menuItem.removeClass(settings.checkedClass);
                $contentItem.removeClass(settings.checkedClass);
                $this.addClass(settings.checkedClass);
                $contentItem.eq($(this).index()).addClass(settings.checkedClass);
            }
        });
    };
    $("d-tabs").dTabs();
}(jQuery));