/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/* exported CKBUILDER_CONFIG */

// This build config was used to build release and debug versions of CKEditor

var CKBUILDER_CONFIG = {
    skin: 'moono',
    ignore: [
        'bender.js',
        '.bender',
        'bender-err.log',
        'bender-out.log',
        'dev',
        'docs',
        '.DS_Store',
        '.editorconfig',
        '.gitignore',
        '.gitattributes',
        'gruntfile.js',
        '.idea',
        '.jscsrc',
        '.jshintignore',
        '.jshintrc',
        'less',
        '.mailmap',
        'node_modules',
        'package.json',
        'README.md',
        'tests'
    ],
    plugins: {
        // plugins added on top of the basic package
        'colorbutton': 1,
        'font': 1,
        'format': 1,
        'stylescombo': 1,
        'justify': 1,
        'panelbutton': 1,
        'widget': 1,
        'contextmenu': 1,

        // plugins from the basic package
        'about': 1,
        'basicstyles': 1,
        'clipboard': 1,
        'enterkey': 1,
        'entities': 1,
        'floatingspace': 1,
        'indentlist': 1,
        'link': 1,
        'list': 1,
        'toolbar': 1,
        'undo': 1,
        'wysiwygarea': 1

        /*

         These are dependency plugins; they should be put into
         `plugins` directory when building CKEditor

         - fakeobjects
         - floatpanel
         - indent
         - lineutils
         - listblock
         - menu
         - panel
         - richcombo
         - button
         - dialog
         - dialogui

         */
    },
    languages: {
        'en': 1
    }
};
