const appRouter = function(app) {

  app.get("/", (req, res) => {
    res.send("Hello World");
  });

};

module.exports = appRouter;
