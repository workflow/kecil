var url = require('url');
var serveStatic = require('serve-static');

module.exports = function (grunt) {
  'use strict';
  
  grunt.loadNpmTasks("grunt-contrib-connect");

  grunt.initConfig({
    connect: {
      server: {
        options: {
          port: 8080,
          base: '.',
          keepalive: true,
          middleware: function(connect, options, middlwares) {
            return [
              function(req, res, next) {
                var parts = url.parse(req.url, true);
                var query = parts.query;
                if(query.delay) {
                  setTimeout(function() {
                    return next(false);
                  }, parseInt(query.delay));
                }else{
                  return next(false);
                }
              },
              serveStatic(options.base[0])
            ];
          }
        }
      }
    }
  });
  
  grunt.registerTask("serve", ['connect']);
};
