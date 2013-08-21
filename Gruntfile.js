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
            functional_test: ['<%= destDir %>/']
        },
        espower: {
            functional_test: {
                files: [
                    {
                        expand: true,     // Enable dynamic expansion.
                        cwd: 'test/',      // Src matches are relative to this path.
                        src: ['tobe_instrumented/**/*.js'], // Actual pattern(s) to match.
                        dest: '<%= destDir %>/',   // Destination path prefix.
                        ext: '.js'   // Dest filepaths will have this extension.
                    },
                ]
            }
        },
        mochaTest: {
            options: {
                reporter: 'dot'
            },
            functional_test: {
                src: ['<%= destDir %>/**/*.js']
            },
            demo0: {
                options: { ui: 'tdd' },
                src: ['test/demo0/*.js']
            },
            demo1: {
                src: ['test/demo1/*.js']
            },
            demo2: {
                src: ['test/demo2/*.js']
            },
            demo3: {
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

    for (var i = 0; i < 10; i += 1) {
        grunt.registerTask('demo' + i, ['mochaTest:demo' + i]);
    }
    //grunt.registerTask('test', ['clean', 'espower', 'mochaTest']);
};
