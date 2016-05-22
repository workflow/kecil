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
    callback(leImgTmpPath);
  });
}

function extractBase64 (img, fileExtension) {
  base64.base64encoder(imgTmpPath + img, options, function (err, image) {
    if (err) {
      console.log(err);
    }
    const base64ImgString = 'data:image/' + fileExtension + ';base64,';
    console.log(base64ImgString + image);
  });
}

function createThumbnail(img) {
  const gmImg = gm(img);
  gmImg.resize(40);
  gmImg.noProfile();
  gmImg.write(img, (err) => {
    if (err) {
      console.log(err)
    }
    // callback here
    //extractBase64(md5Hash + '.' + fileExtension, fileExtension);
  });
}

const appRouter = function(app) {

  app.post("/kecilify", (req, res) => {
    const imgs = req.body.images;
    const options = {localFile: true, string: true};

    imgs.forEach((img) => {
      const imgPath = fetchImage(img, () => {
        createThumbnail(imgPath);
      });
    });
  });

};

module.exports = appRouter;
