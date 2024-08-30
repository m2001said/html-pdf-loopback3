"use strict";
const ejs = require("ejs");
const utils = require("../../utils"); // Adjust the path as necessary
const moment = require("moment");

module.exports = function (report) {
  report.remoteMethod("generate", {
    accepts: [{ arg: "res", type: "object", http: { source: "res" } }],
    returns: { type: "file", root: true },
    http: { path: "/generate", verb: "get" },
  });

  report.generate = (res) => {
    const data = {
      date: moment().format("DD/MM/YYYY"),
      username: "محمد خالد",
      heroLogo: utils.IMGToURI("hero-logo.png"),
      rightCheck: utils.IMGToURI("right-check.png"),
      backgroundSmallTitle: utils.IMGToURI("background-small-title.jpg"),
    };

    ejs.renderFile(
      `${__dirname}/../../server/templates/report.ejs`,
      data,
      (err, html) => {
        if (err) throw err;

        utils
          .generatePdf(html)
          .then((stream) => {
            res.setHeader("Content-type", "application/pdf");
            res.setHeader(
              "Content-Disposition",
              `attachment; filename=report.pdf`
            );
            stream.pipe(res);
          })
          .catch((err) => {
            res.status(500).send(err);
          });
      }
    );
  };
};
