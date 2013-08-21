var espower = require('espower'),
    CoffeeScript = require('coffee-script-redux'),
    fs = require('fs');

module.exports = function(grunt) {
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
        coffee_espower: {
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
            tdd: {
                options: { ui: 'tdd' },
                src: ['test/tdd/*.js']
            },
            bdd: {
                options: { ui: 'bdd' },
                src: ['test/bdd/*.js']
            },
            power_assert: {
                options: { ui: 'tdd' },
                src: ['<%= destDir %>/**/*.js']
            },
            power_coffee: {
                options: { ui: 'bdd' },
                src: ['<%= destDir %>/**/*.js']
            },
            demo0: {
                options: { ui: 'tdd' },
                src: ['test/demo0/*.js']
            },
            demo1: {
                options: { ui: 'tdd' },
                src: ['test/demo1/*.js']
            },
            demo2: {
                options: { ui: 'tdd' },
                src: ['test/demo2/*.js']
            },
            demo3: {
                options: { ui: 'bdd' },
                src: ['test/demo3/*.js']
            },
            demo4: {
                src: ['test/demo4/*.js']
            },
            demo5: {
                src: ['test/demo5/*.js']
            }
        }
    });


    grunt.registerMultiTask('coffee_espower', 'instrument power assert onto the coffee.', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var _ = grunt.util._,
            options = this.options({
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
                    csCode = fs.readFileSync(filepath, 'utf-8');

                var parseOptions = {raw: true};
                var compileOptions = {bare: true};
                var jsGenerateOptions = {compact: false};
                var espowerOptions = _.merge(options, {
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


    for (var i = 0; i < 10; i += 1) {
        grunt.registerTask('demo' + i, ['mochaTest:demo' + i]);
    }
    grunt.registerTask('tdd', ['mochaTest:tdd']);
    grunt.registerTask('bdd', ['mochaTest:bdd']);
    grunt.registerTask('power_assert', ['clean:power_assert', 'espower:power_assert', 'mochaTest:power_assert']);
    grunt.registerTask('power_coffee', ['clean:power_coffee', 'coffee_espower:power_coffee', 'mochaTest:power_coffee']);
};
