var espower = require('espower'),
    CoffeeScript = require('coffee-script-redux'),
    _ = require('lodash'),
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
            power_assert: ['<%= destDir %>/'],
            power_coffee: ['<%= destDir %>/']
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
        espower_csredux: {
            power_coffee: {
                files: [
                    {
                        expand: true,     // Enable dynamic expansion.
                        cwd: 'test/',      // Src matches are relative to this path.
                        src: ['power_coffee/**/*.coffee'], // Actual pattern(s) to match.
                        dest: '<%= destDir %>/',   // Destination path prefix.
                        ext: '.js'   // Dest filepaths will have this extension.
                    },
                ]
            }
        },
        mochaTest: {
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
            },
            power_coffee: {
                options: { ui: 'bdd' },
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
            },
            power_coffee: {
                files: ['test/power_coffee/*.coffee'],
                tasks: ['power_coffee']
            },
        },
    });


    grunt.registerMultiTask('espower_csredux', 'instrument power assert into the coffee.', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
                destructive: false,
                powerAssertVariableName: 'assert'
            });

        // Iterate over all specified file groups.
        this.files.forEach(function(f) {
            var src = f.src.filter(function(filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).forEach(function(filepath) {
                grunt.verbose.writeln('espower src: ' + f.src);
                var absPath = fs.realpathSync(filepath),
                    csCode = fs.readFileSync(filepath, 'utf-8'),
                    parseOptions = {raw: true},
                    compileOptions = {bare: true},
                    jsGenerateOptions = {compact: false},
                    espowerOptions = _.merge(options, {
                        path: absPath,
                        source: csCode
                    });
                var csAST = CoffeeScript.parse(csCode, parseOptions);
                var jsAST = CoffeeScript.compile(csAST, compileOptions);
                var espoweredAst = espower(jsAST, espowerOptions);
                var jsCode = CoffeeScript.js(espoweredAst, jsGenerateOptions);
                grunt.verbose.writeln('espower dest: ' + f.dest);
                grunt.file.write(f.dest, jsCode);
            });
        });
    });


    grunt.registerTask('normal_assert', ['mochaTest:normal_assert']);
    grunt.registerTask('mocha_expect', ['mochaTest:mocha_expect']);
    grunt.registerTask('power_assert', ['clean:power_assert', 'espower:power_assert', 'mochaTest:power_assert']);
    grunt.registerTask('power_coffee', ['clean:power_coffee', 'espower_csredux:power_coffee', 'mochaTest:power_coffee']);

    grunt.registerTask('default', ['power_assert']);
};
