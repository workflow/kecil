const appRouter = function(app) {

  app.get("/resize", (req, res) => {
    const path = require('path');

    const baseDir = path.resolve(__dirname, '..');
    const srcDir = path.resolve(baseDir, 'web');

    const gm = require('gm');

    // =TODO= Get argument

    function createThumbnail() {
      const img = gm(req.query.fileName);

      img.resize(40);
      img.noProfile();
      img.write('test.jpg', (err) => {
        if (err) {
          console.log(err)
        }
      });
    }

    createThumbnail();
  });

};

module.exports = appRouter;
