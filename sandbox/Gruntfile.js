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
          middleware: function(app, options, middlwares) {
            return [
              function(req, res, next) {
                var parts = url.parse(req.url, true);
                var query = parts.query;
                if(query.delay) {
                  setTimeout(function() {
                    return next(false);
                  }, parseInt(query.delay));
                }else{
                  return next();
                }
              },
              function(req, res, next) {
                if (req.url == "/kecilify") {
                  res.statusCode = 200
                  res.setHeader("Content-Type", "application/json")
                  var images = [];
                  images.push({
                    key: "0700bdc889fa3f7a6328a41605209f84",
                    svg: "<?xml version=\"1.0\"?><svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"1024\" height=\"698\" viewBox=\"0 0 1024 698\"><style>image#main{opacity:0;transition:opacity 2s;}image#main.loaded{opacity: 1;}</style><filter id=\"blur\" color-interpolation-filters=\"sRGB\"><feGaussianBlur stdDeviation=\"60\" edgeMode=\"duplicate\"/><feComponentTransfer><feFuncA type=\"discrete\" tableValues=\"1 1\"/></feComponentTransfer></filter><image id=\"thumb\" filter=\"url(#blur)\" xlink:href=\"image.tiny.jpg\" x=\"0\" y=\"0\" height=\"100%\" width=\"100%\"/><image id=\"main\" xlink:href=\"image.jpg?delay=2000\" x=\"0\" y=\"0\" height=\"100%\" width=\"100%\" onload=\"this.classList.add('loaded');\" /></svg>",
                    width: 300,
                    height: 200
                  });
                  return res.end(JSON.stringify({images: images})); 
                }else{
                  return next();
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
