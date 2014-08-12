var merge = require('lodash.merge'),
    fs = require('fs');

module.exports = function(grunt) {
    'use strict';

    var pkg = grunt.file.readJSON('package.json');

    (function () {
        var taskName;
        for(taskName in pkg.devDependencies) {
            if(taskName.substring(0, 6) === 'grunt-') {
                grunt.loadNpmTasks(taskName);
            }
        }
    })();

    grunt.initConfig({
        destDir: 'espowered_tests',
        clean: {
            power_assert: ['<%= destDir %>/']
        },
        espower: {
            power_assert: {
                files: [
                    {
                        expand: true,     // Enable dynamic expansion.
                        cwd: 'test/',      // Src matches are relative to this path.
                        src: ['power_assert/**/*.js'], // Actual pattern(s) to match.
                        dest: '<%= destDir %>/',   // Destination path prefix.
                        ext: '.js'   // Dest filepaths will have this extension.
                    },
                ]
            }
        },
        mochaTest: {
            espower_loader: {
                options: {
                    ui: 'tdd',
                    require: './loader'
                },
                src: ['test/power_assert/*.js']
            },
            normal_assert: {
                options: { ui: 'tdd' },
                src: ['test/normal_assert/*.js']
            },
            mocha_expect: {
                options: { ui: 'bdd' },
                src: ['test/mocha_expect/*.js']
            },
            power_assert: {
                options: { ui: 'tdd' },
                src: ['<%= destDir %>/**/*.js']
            }
        },
        watch: {
            normal_assert: {
                files: ['test/normal_assert/*.js'],
                tasks: ['normal_assert']
            },
            mocha_expect: {
                files: ['test/mocha_expect/*.js'],
                tasks: ['mocha_expect']
            },
            power_assert: {
                files: ['test/power_assert/*.js'],
                tasks: ['power_assert']
            }
        },
    });


    grunt.registerTask('espower_loader', ['mochaTest:espower_loader']);

    grunt.registerTask('normal_assert', ['mochaTest:normal_assert']);
    grunt.registerTask('mocha_expect', ['mochaTest:mocha_expect']);
    grunt.registerTask('power_assert', ['clean:power_assert', 'espower:power_assert', 'mochaTest:power_assert']);

    grunt.registerTask('default', ['espower_loader']);
};
