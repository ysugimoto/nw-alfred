module.exports = function(grunt) {

    grunt.initConfig({

        // node-webkit install path
        nw_path: 'node-webkit/node-webkit.app/',

        // stylus
        stylus: {
            compile: {
                expand: true,
                cwd: 'src/stylus',
                files: {
                    'asset/css/app.css': 'src/stylus/app.styl'
                }
            }
        },

        // cssmin
        cssmin: {
            dist: {
                src: ['asset/css/app.css'],
                dest: 'asset/css/app.min.css'
            }
        },

        // uglify
        uglify: {
            dist: {
                files: {
                    'asset/js/app.min.js': ['asset/js/app.js']
                }
            }
        },

        // sprockets
        sprockets: {
            compile: {
                files: ['src/js/app.js'],
                dest: 'asset/js/app.js'
            }
        },

        // watch
        watch: {
            stylus: {
                files: ['scss/*'],
                tasks: ['sass:dist']
            },
            options: {
                livereload: true
            }
        },

        // copy
        copy: {
            dist: {
                files: [
                    {src: 'src/js/proc.js',   dest: 'asset/js/proc.js'},
                    {src: 'index.html',       dest: '<%= nw_path %>Contents/Resources/app.nw/index.html'},
                    {src: 'package.json',     dest: '<%= nw_path %>Contents/Resources/app.nw/package.json'},
                    {src: 'data',             dest: '<%= nw_path %>Contents/Resources/app.nw/'},
                    {src: 'asset/*',          dest: '<%= nw_path %>Contents/Resources/app.nw/', expand: true},
                    {src: 'asset/js/*',       dest: '<%= nw_path %>Contents/Resources/app.nw/', expand: true},
                    {src: 'asset/css/*',      dest: '<%= nw_path %>Contents/Resources/app.nw/', expand: true},
                    {src: 'asset/images/*',   dest: '<%= nw_path %>Contents/Resources/app.nw/', expand: true}
                ]
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-sprockets');

    var exec = require('child_process').exec;
    grunt.registerTask('run', 'run node-webkit', function() {
        var path = grunt.config('nw_path');
        this.async();

        exec(path + 'Contents/MacOS/node-webkit');
    });

    grunt.registerTask('build', ['stylus', 'cssmin', 'sprockets', 'uglify', 'copy']);
    grunt.registerTask('default', ['build', 'run']);
};
