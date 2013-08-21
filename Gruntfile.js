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
                options: { ui: 'tdd' },
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

    for (var i = 0; i < 10; i += 1) {
        grunt.registerTask('demo' + i, ['mochaTest:demo' + i]);
    }
    grunt.registerTask('tdd', ['mochaTest:tdd']);
    grunt.registerTask('bdd', ['mochaTest:bdd']);
    grunt.registerTask('power_assert', ['clean:power_assert', 'espower:power_assert', 'mochaTest:power_assert']);
    grunt.registerTask('power_coffee', ['clean:power_assert', 'espower:power_assert', 'mochaTest:power_assert']);
};
