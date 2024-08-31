"use strict";
const ejs = require("ejs");
const utils = require("../../utils");
const moment = require("moment");
const ar = require("../../locales/ar.json");
const en = require("../../locales/en.json");

module.exports = function (report) {
  report.remoteMethod("generate", {
    accepts: [{ arg: "res", type: "object", http: { source: "res" } }],
    returns: { type: "file", root: true },
    http: { path: "/generate", verb: "get" },
  });

  report.generate = async (res) => {
    try {
      const locale = ar; // You can switch to `en` for English content
      let program;
      let programId = 3;

      if (programId === 2) {
        program = locale.REPORT.SELF_CONFIDENCE;
      } else if (programId === 3) {
        program = locale.REPORT.LEADERSHIP;
      }

      const data = {
        // -----all images---------
        heroLogo: utils.IMGToURI("hero-logo.png"),
        rightCheck: utils.IMGToURI("right-check.png"),
        backgroundSmallTitle: utils.IMGToURI("background-small-title.jpg"),
        backgroundBigTitle: utils.IMGToURI("background-big-title.jpg"),
        arrowGreenUp: utils.IMGToURI("arrow-green-up.png"),
        arrowGreyDown: utils.IMGToURI("arrow-grey-down.png"),
        arrowOrangeUp: utils.IMGToURI("arrow-orange-up.png"),
        fullPoints: utils.IMGToURI("full-points.png"),
        mediumPoints: utils.IMGToURI("medium-points.png"),
        smallPoints: utils.IMGToURI("small-points.png"),
        note1: utils.IMGToURI("note1.png"),
        note2: utils.IMGToURI("note2.png"),
        note3: utils.IMGToURI("note3.png"),
        note4: utils.IMGToURI("note4.png"),
        treePapers: utils.IMGToURI("tree-papers.png"),

        // ---data---
        date: moment().format("DD/MM/YYYY"),
        username: "محمد خالد",

        title: program.TITLE,
        subtitle: program.SUBTITLE,
        aboutTitle: locale.REPORT.TITLE_ABOUT,
        resultDescriptionTitle: locale.REPORT.TITLE_RESULT_DESCRIPTION,
        pointsTitle: locale.REPORT.TITLE_POINTS,
        pointsRestTitle: locale.REPORT.TITLE_POINTS_REST,
        comparisonTitle: locale.REPORT.TITLE_COMPARISON,
        developmentRecommendationsTitle:
          locale.REPORT.TITLE_DEVELOPMENT_RECOMMENDATIONS,
        notesTitle: locale.REPORT.TITLE_NOTES,

        cards: program.CARDS,
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
