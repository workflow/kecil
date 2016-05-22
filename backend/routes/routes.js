const appRouter = function(app) {

  app.get("/kecilify", (req, res) => {
    const path = require('path');

    const baseDir = path.resolve(__dirname, '..');
    const srcDir = path.resolve(baseDir, 'web');

    const gm = require('gm');
    const base64 = require('node-base64-image');
    const options = {localFile: true, string: true};

    function extractBase64 (img, fileExtension) {

      base64.base64encoder(img, options, function (err, image) {
        if (err) {
          console.log(err);
        }
        const base64ImgString = 'data:image/' + fileExtension + ';base64,';
        console.log(base64ImgString + image);
      });

    }

    // =TODO= Get argument

    function createThumbnail() {
      const img = gm(req.query.fileName);
      const fileExtension = path.extname(req.query.fileName).split('.').pop();

      img.resize(40);
      img.noProfile();
      img.write('test.' + fileExtension, (err) => {
        if (err) {
          console.log(err)
        }
        extractBase64('test.' + fileExtension, fileExtension);
      });
    }

    createThumbnail();
  });

};

module.exports = appRouter;
