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
    callback(leImgTmpPath, fileExtension, md5Hash);
  });
}

function createThumbnail(img, extension, md5Hash, callback) {
  const gmImg = gm(img);
  gmImg.resize(40);
  gmImg.noProfile();
  gmImg.write(img, (err) => {
    if (err) {
      console.log(err)
    }
    callback(img, extension, md5Hash);
  });
}

function extractBase64(img, fileExtension, md5Hash, callback) {
  const options = { localFile: true, string: true };

  base64.base64encoder(img, options, (err, image) => {
    if (err) {
      console.log(err);
    }
    const base64ImgString = 'data:image/' + fileExtension + ';base64,';
    callback(base64ImgString + image, md5Hash);
  });
}

function getGeneratedSvg(base64String) {
  const theMostAwesomeReturnStringThatShouldRlyGoIntoARealTemplateSomewhere = `

<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{{origWidth}}" height="{{origHeight}}" viewBox="0 0 {{origWidth}} {{origHeight}}">
    <style>
        image#main {
            opacity: 0;
            transition: opacity 2s;
        }

        image#main.loaded {
            opacity: 1;
        }
    </style>
    <filter id="blur" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="75" edgeMode="duplicate"/>
        <feComponentTransfer>
            <feFuncA type="discrete" tableValues="1 1"/>
        </feComponentTransfer>
    </filter>
    <image id="thumb" filter="url(#blur)" xlink:href="${base64String}" x="0" y="0" height="100%" width="100%"/>
    <image id="main" xlink:href="image.orig.jpg?delay=2000" x="0" y="0" height="100%" width="100%" onload="this.classList.add('loaded');" />
</svg>
            `;

  //console.log(theMostAwesomeReturnStringThatShouldRlyGoIntoARealTemplateSomewhere)
  return theMostAwesomeReturnStringThatShouldRlyGoIntoARealTemplateSomewhere;
}

const appRouter = function(app) {

  app.post("/kecilify", (req, res) => {
    const imgs = req.body.images;
    let response = {
      images: [],
    };
    // =TODO= =REFACTOR= http://stackoverflow.com/questions/18983138/callback-after-all-asynchronous-foreach-callbacks-are-completed
    let imgsProcessed = 0;

    imgs.forEach((img) => {
      fetchImage(img, (imgPath, extension, md5Hash) => {
        createThumbnail(imgPath, extension, md5Hash, (img, extension, md5Hash) => {
          extractBase64(img, extension, md5Hash, (base64StringYo, md5Hash) => {
            const weWillSendThisBackNowCepatCepat = getGeneratedSvg(base64StringYo);

            response.images.push({
              key: md5Hash,
              svg: weWillSendThisBackNowCepatCepat,
              width: 200,
              height: 200,
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

};

module.exports = appRouter;
