module.exports = function (grunt) {
  'use strict';
  
  grunt.loadNpmTasks("grunt-contrib-connect");

  grunt.initConfig({
    connect: {
      server: {
        options: {
          port: 8080,
          base: '.',
          keepalive: true
        }
      }
    },
    kecil: {
      files: "images/*.jpg"
    }
  });
  
  grunt.registerTask("serve", ['connect']);
  
};
