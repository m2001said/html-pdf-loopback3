"use strict";
const ejs = require("ejs");
const utils = require("../../utils");
const moment = require("moment");

module.exports = function (report) {
  report.remoteMethod("generate", {
    accepts: [{ arg: "res", type: "object", http: { source: "res" } }],
    returns: { type: "file", root: true },
    http: { path: "/generate", verb: "get" },
  });

  report.generate = async (res) => {
    try {
      const data = {
        date: moment().format("DD/MM/YYYY"),
        username: "محمد خالد",
        heroLogo: utils.IMGToURI("hero-logo.png"),
        rightCheck: utils.IMGToURI("right-check.png"),
        backgroundSmallTitle: utils.IMGToURI("background-small-title.jpg"),
      };

      const html = await ejs.renderFile(
        `${__dirname}/../../server/templates/report.ejs`,
        data
      );

      const pdfBuffer = await utils.generatePdf(html);

      res.setHeader("Content-type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=report.pdf`);
      res.end(pdfBuffer, "binary");
    } catch (err) {
      console.error("Error generating PDF:", err.message);
      res
        .status(500)
        .send({ error: "Failed to generate PDF", details: err.message });
    }
  };
};
