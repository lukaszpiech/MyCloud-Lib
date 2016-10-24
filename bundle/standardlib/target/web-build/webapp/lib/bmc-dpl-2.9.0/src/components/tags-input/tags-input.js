
/* HTML templates */
var dplTagsInput = angular.module('dplTagsInput', ['ngTagsInput']);


dplTagsInput.run(["$templateCache", function($templateCache) {
    $templateCache.put('ngTagsInput/tags-input.html',
        "<div class=\"host d-tags-host\" tabindex=\"-1\" ng-click=\"eventHandlers.host.click()\" ti-transclude-append><div class=\"tags d-input-tags\" ng-class=\"{focused: hasFocus}\"><ul class=\"tag-list\"><li class=\"tag-item d-tag\" ng-repeat=\"tag in tagList.items track by track(tag)\" ng-class=\"{ selected: tag == tagList.selected }\" ng-click=\"eventHandlers.tag.click(tag)\"><ti-tag-item data=\"::tag\"></ti-tag-item></li></ul><input class=\"input\" autocomplete=\"off\" ng-model=\"newTag.text\" ng-model-options=\"{getterSetter: true}\" ng-keydown=\"eventHandlers.input.keydown($event)\" ng-focus=\"eventHandlers.input.focus($event)\" ng-blur=\"eventHandlers.input.blur($event)\" ng-paste=\"eventHandlers.input.paste($event)\" ng-trim=\"false\" ng-class=\"{'invalid-tag': newTag.invalid}\" ng-disabled=\"disabled\" ti-bind-attrs=\"{type: options.type, placeholder: options.placeholder, tabindex: options.tabindex, spellcheck: options.spellcheck}\" ti-autosize></div></div>"
    );

    $templateCache.put('ngTagsInput/tag-item.html',
        "<span ng-bind=\"$getDisplayText()\"></span> <a ng-click=\"$removeTag()\" data-role=\"remove\"></a>"
    );

    $templateCache.put('ngTagsInput/auto-complete.html',
        "<div class=\"autocomplete d-tags-autocomplete\" ng-if=\"suggestionList.visible\"><ul class=\"suggestion-list d-tags-suggestion-list\"><li class=\"suggestion-item d-tags-suggestion-item\" ng-repeat=\"item in suggestionList.items track by track(item)\" ng-class=\"{selected: item == suggestionList.selected}\" ng-click=\"addSuggestionByIndex($index)\" ng-mouseenter=\"suggestionList.select($index)\"><ti-autocomplete-match data=\"::item\"></ti-autocomplete-match></li></ul></div>"
    );

    $templateCache.put('ngTagsInput/auto-complete-match.html',
        "<span ng-bind-html=\"$highlight($getDisplayText())\"></span>"
    );
}]);
