const path = require('path');
const gm = require('gm');
const base64 = require('node-base64-image');
const crypto = require('crypto');
const request = require('request');
const fs = require('fs');
const svgo = require('svgo');

const baseDir = path.resolve(__dirname, '..');
const imgTmpPath = `${baseDir}/.imgTmp`;

function fetchImage(img, callback) {
  const fileExtension = path.extname(img).split('.').pop();
  const md5Hash = crypto.createHash('md5').update(img).digest('hex');
  const leImgTmpPath = `${imgTmpPath}/${md5Hash}.${fileExtension}`;
  const origImgPath = img;

  const requestedImg = request(img);
  requestedImg.pipe(fs.createWriteStream(leImgTmpPath)).on('finish', () => {
    callback(leImgTmpPath, fileExtension, md5Hash, origImgPath);
  });
}

function getSize(img, extension, md5Hash, origImgPath, callback) {
  const gmImg = gm(img);
  gmImg.size((err, size) => {
    if (err) {
      console.log(err);
    } else {
      callback(img, extension, md5Hash, origImgPath, size.width, size.height);
    }
  });
}

function createThumbnail(img, extension, md5Hash, origImgPath, origWidth, origHeight, callback) {
  const gmImg = gm(img);
  gmImg.resize(40);
  gmImg.noProfile();
  gmImg.write(img, (err) => {
    if (err) {
      console.log(err)
    }
    callback(img, extension, md5Hash, origImgPath, origWidth, origHeight);
  });
}

function extractBase64(img, fileExtension, md5Hash, origImgUrl, origWidth, origHeight, callback) {
  const options = { localFile: true, string: true };

  base64.base64encoder(img, options, (err, image) => {
    if (err) {
      console.log(err);
    }
    const base64ImgString = 'data:image/' + fileExtension + ';base64,';
    callback(base64ImgString + image, md5Hash, origImgUrl, origWidth, origHeight);
  });
}

function getGeneratedSvg(base64String, origImgUrl, origWidth, origHeight, md5Hash, callback) {
  const theMostAwesomeReturnStringThatShouldRlyGoIntoARealTemplateSomewhere = `<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${origWidth}" height="${origHeight}" viewBox="0 0 ${origWidth} ${origHeight}">
    <style>
        image#main {
            opacity: 0;
            transition: opacity 2s;
            -webkit-transition: opacity 2s;
        }

        image#main.loaded {
            opacity: 1;
        }
    </style>
    <filter id="blur" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="50" edgeMode="duplicate"/>
        <feComponentTransfer>
            <feFuncA type="discrete" tableValues="1 1"/>
        </feComponentTransfer>
    </filter>
    <image id="thumb" filter="url(#blur)" xlink:href="${base64String}" x="0" y="0" height="100%" width="100%"/>
    <image id="main" xlink:href="${origImgUrl}" x="0" y="0" height="100%" width="100%" onload="this.classList.add('loaded');" />
</svg>
            `;

  const optimizer = new svgo();
  optimizer.optimize(theMostAwesomeReturnStringThatShouldRlyGoIntoARealTemplateSomewhere, (res) => {
    callback(res.data, origWidth, origHeight, md5Hash);
  });
}

const appRouter = function(app) {

  app.post("/kecilify", (req, res) => {
    const imgs = req.body.images;
    let response = {
      images: [],
    };
    // =TODO= =REFACTOR= http://stackoverflow.com/questions/18983138/callback-after-all-asynchronous-foreach-callbacks-are-completed
    let imgsProcessed = 0;

    // Create temp caching dir if it doesn't already exist
    if (!fs.existsSync(imgTmpPath)){
      fs.mkdirSync(imgTmpPath);
    }

    imgs.forEach((img) => {
      fetchImage(img, (imgPath, extension, md5Hash, origImgUrl) => {
        getSize(imgPath, extension, md5Hash, origImgUrl, (imgPath, extension, md5Hash, origImgUrl, origWidth, origHeight) => {
          createThumbnail(imgPath, extension, md5Hash, origImgUrl, origWidth, origHeight, (img, extension, md5Hash, origImgUrl, origWidth, origHeight) => {
            extractBase64(img, extension, md5Hash, origImgUrl, origWidth, origHeight, (base64StringYo, md5Hash, origImgUrl, origWidth, origHeight) => {
              getGeneratedSvg(base64StringYo, origImgUrl, origWidth, origHeight, md5Hash, (optimizedSvg, origWidth, origHeight, md5Hash) => {
                response.images.push({
                  key: md5Hash,
                  svg: optimizedSvg,
                  width: origWidth,
                  height: origHeight,
                });
                imgsProcessed++;

                if (imgsProcessed === imgs.length) {
                  res.send(JSON.stringify(response));
                }
              });
            });
          });
        });
      });
    });


  });

};

module.exports = appRouter;
