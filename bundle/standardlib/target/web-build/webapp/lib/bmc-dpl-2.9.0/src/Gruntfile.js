module.exports = function (grunt) {
    "use strict";

    grunt.loadNpmTasks("grunt-sass");
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.initConfig({

        //TODO: add json file
        //pkg: grunt.file.readJSON("package.json"),

        concat: {
            options: {
                separator: ';'
            },
            concatFrameworkScripts: {
                files: {
                    '../dist/dpl-components.js': [
                        'components/timepicker/timepicker.js',
                        'components/datepicker/datepicker.js',
                        'components/datetimepicker/datetimepicker.js',
                        'components/tags-input/tags-input.js',
						'components/action-blade/action-blade.js',
                        'components/splitter/splitter.js',
						'components/modal/modal.js',
                        'components/popover/popover.js',
						'components/accordion/accordion.js',
						'components/slider-range/slider-range.js',
						'components/tabs/tabs.js',
						'components/ripple/ripple.js',
						'components/busy-preloader/busy-preloader-template.js',
						'components/splitter/splitter.js',
						'components/dropdown/angular.dropdown.js',
						'components/dropdown/jquery.dropdown.js',
						'components/tabs/jquery.tabs.js'
                    ]
                }
            }
        },
        uglify: {
            uglifyFramework: {
                files: {
                    '../dist/dpl-components.min.js': [
                        '..dist/dpl-components.js'
                    ]
                },
                options: {
                    beautify: false,
                    mangle: true
                }
            }
        },
        sass: {
            options: {
                sourceMap: true
            },
            compileFrameworkStyles: {
                files: {
                    '../dist/dpl-components.css': [
						'dpl-components.scss'
					]
                }
            }
        }

    });

    grunt.registerTask("compileStyles", ['sass:compileFrameworkStyles']);

    grunt.registerTask("cFramework", ['concat:concatFrameworkScripts']);
    grunt.registerTask("uFramework", ['uglify:uglifyFramework']);
    grunt.registerTask("cuFramework", ['concat:concatFrameworkScripts', 'uglify:uglifyFramework']);
};