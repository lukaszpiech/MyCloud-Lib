(function ($) {
    $.fn.dAccordion = function (options) {
        var settings = $.extend({
                speed: 200,
                accordionItemSelector : ".d-accordion__item",
                accordionItemHeaderSelector: ".d-accordion__item-header",
                accordionItemContentSelector: ".d-accordion__item-content"
            }, options);
            // bind click on accordion header
            $(document).on('click', settings.accordionItemSelector, function (e){
                var $this = $(this);
                // check if accordion item isn't selected
                if (!$this.hasClass("is-checked")) {
                    $this.siblings().find(settings.accordionItemContentSelector).slideUp(settings.speed);
                    $this.find(settings.accordionItemContentSelector).slideDown(settings.speed);
                    setTimeout(function () {
                        $this.siblings().removeClass("is-checked");
                        $this.addClass("is-checked");
                    }, settings.speed);
                } else {
                    // close current item
                    $this.find(settings.accordionItemContentSelector).slideUp(settings.speed);
                    setTimeout(function () {
                        $this.removeClass("is-checked");
                    }, settings.speed);
                }
            });
            // unbind click on accordion header childs
            $(document).on('click', settings.accordionItemHeaderSelector + " a", function (e){
                e.stopPropagation();
            });
            // unbind click on accordion content childs
            $(document).on('click', settings.accordionItemContentSelector, function (e){
                e.stopPropagation();
            });
            // trigger accordion item click on enter when focused
            $(document).keypress(function (e) {
                if (e.which == 13 && $(e.target).parents($(".d-accordion"))) {
                    $(e.target).trigger('click');
                }
            });
    };
}(jQuery));
$(".d-accordion").dAccordion();