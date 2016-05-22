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
                    svg: "<?xml version=\"1.0\"?><svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"1024\" height=\"698\" viewBox=\"0 0 1024 698\"><style>image#main{opacity:0;transition:opacity 2s;}image#main.loaded{opacity:1;}</style><filter id=\"blur\" color-interpolation-filters=\"sRGB\"><feGaussianBlur stdDeviation=\"60\" edgeMode=\"duplicate\"/><feComponentTransfer><feFuncA type=\"discrete\" tableValues=\"1 1\"/></feComponentTransfer></filter><image id=\"thumb\" filter=\"url(#blur)\" xlink:href=\"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wgARCAAbACgDAREAAhEBAxEB/8QAGQAAAgMBAAAAAAAAAAAAAAAABQYCAwQH/8QAGAEAAwEBAAAAAAAAAAAAAAAAAAIDAQT/2gAMAwEAAhADEAAAAOn85IqAdWqqaQzAHlS+sxvLURTXy0UhdeWwVzPl6VOmDwKAshEP/8QALhAAAgEEAQIDBQkAAAAAAAAAAQIDAAQFERIGIRAxURMiQWFxBxQVIzOBgpGx/9oACAEBAAE/AEtII3Mqcg6EkAMdfuPjUeTgfJGwHMyL5tocT2BI3v51g+qDfZ2TGbvCUMx5TWxRPdOhpiADUU6MVHt0csOwGu/9GgQaZOQIJ7Gkz1p+JtauUWdZhGNumyd6+tQ4iG1mluFmnk0rnizqQdg+g3UcFtjsnY28MA1PKTtnO04hfL18zX2e3d3Pnsmk8weIc+HwYESt4HpnKydUm9eCD7sLtZkYyjYUPvsNb3Rj/JdSACQe4FLiFe8hu5nDPCSV0rADej6/Lzrp3puXB3dxPNkRde2L6UQ8OALcgN7O9DwDFZwFOveH+1L+k/0q9yV3EdJLx/iKtchdvIOU7mv/xAAlEQACAAMHBQEAAAAAAAAAAAABAgMRIQAEECAxcYETIjJBsdH/2gAIAQIBAT8AF3hhgw13PywvMMxOmDWwVgZlqcZJd3jzTBbpBVgyrpZISqxYe8KzwAjkiZEtj+5//8QAHxEAAgEEAgMAAAAAAAAAAAAAAQIAAxAhMREgEkGh/9oACAEDAQE/AIaTBPP1GKkYHQjG7NVc7MdiVANuMb+WJSE89v/Z\" x=\"0\" y=\"0\" height=\"100%\" width=\"100%\"/><image id=\"main\" xlink:href=\"http://cdn.magloft.com/bbh/assets/image.orig.jpg\" x=\"0\" y=\"0\" height=\"100%\" width=\"100%\" onload=\"this.classList.add('loaded');\" /></svg>",
                    width: 1024,
                    height: 698
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
