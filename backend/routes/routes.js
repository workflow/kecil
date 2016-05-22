const appRouter = function(app) {

  app.get("/resize", (req, res) => {
    const path = require('path');

    const baseDir = path.resolve(__dirname, '..');
    const srcDir = path.resolve(baseDir, 'web');

    const gm = require('gm');
    const base64 = require('node-base64-image');
    const options = {localFile: true, string: true};
    const imgPath = 'imgTmp/';

    function extractBase64 (img, fileExtension) {

      base64.base64encoder(imgPath + img, options, function (err, image) {
        if (err) {
          console.log(err);
        }
        let base64ImgString = 'data:image/' + fileExtension + ';base64,';
        console.log(base64ImgString + image);
      });

    }

    // =TODO= Get argument

    function createThumbnail() {
      let img = gm(req.query.fileName);
      let fileExtension = path.extname(req.query.fileName).split('.').pop();
      let crypto = require('crypto');
      let md5Hash = crypto.createHash('md5').update(req.query.fileName).digest("hex");

      img.resize(40);
      img.noProfile();
      img.write(imgPath + md5Hash + '.' + fileExtension, (err) => {
        if (err) {
          console.log(err)
        }
        extractBase64(md5Hash + '.' + fileExtension, fileExtension);
      });
    }

    createThumbnail();
  });

};

module.exports = appRouter;
