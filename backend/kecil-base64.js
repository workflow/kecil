
const base64 = require('node-base64-image');
const path = require('path')
const options = {string: true};

function extractBase64 (img) {

  base64.base64encoder('http://gruntjs.com/img/grunt-logo.png', options, function (err, image) {
    if (err) {
      console.log(err);
    }
    let fileExtension = path.extname('http://gruntjs.com/img/grunt-logo.png').split('.').pop();
    let base64ImgString = 'data:image/' + fileExtension + ';base64,';
    console.log(base64ImgString + image);
  });

}

extractBase64();