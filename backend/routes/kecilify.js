const path = require('path');
const gm = require('gm');
const base64 = require('node-base64-image');
const crypto = require('crypto');
const request = require('request');
const fs = require('fs');

const baseDir = path.resolve(__dirname, '..');
const imgTmpPath = `${baseDir}/.imgTmp`;

function fetchImage(img, callback) {
  const fileExtension = path.extname(img).split('.').pop();
  const md5Hash = crypto.createHash('md5').update(img).digest('hex');
  const leImgTmpPath = `${imgTmpPath}/${md5Hash}.${fileExtension}`;

  const requestedImg = request(img);
  requestedImg.pipe(fs.createWriteStream(leImgTmpPath)).on('finish', () => {
    callback(leImgTmpPath, fileExtension);
  });
}

function createThumbnail(img, extension, callback) {
  const gmImg = gm(img);
  gmImg.resize(40);
  gmImg.noProfile();
  gmImg.write(img, (err) => {
    if (err) {
      console.log(err)
    }
    callback(img, extension);
  });
}

function extractBase64 (img, fileExtension) {
  const options = {localFile: true, string: true};

  base64.base64encoder(img, options, (err, image) => {
    if (err) {
      console.log(err);
    }
    const base64ImgString = 'data:image/' + fileExtension + ';base64,';
    console.log(base64ImgString + image);
  });
}

const appRouter = function(app) {

  app.post("/kecilify", (req, res) => {
    const imgs = req.body.images;

    imgs.forEach((img) => {
      fetchImage(img, (imgPath, extension) => {
        createThumbnail(imgPath, extension, (img, extension) => {
          extractBase64(img, extension);
        });
      });
    });
  });

};

module.exports = appRouter;
