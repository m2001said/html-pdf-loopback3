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

        // ---page 1 ---
        title: program.TITLE,
        subtitle: program.SUBTITLE,
        date: moment().format("DD/MM/YYYY"),
        username: "محمد خالد",

        // ---page 2 ---
        aboutTitle: locale.REPORT.TITLE_ABOUT,
        cards: program.CARDS,

        // ---page 3 ---
        resultDescriptionTitle: locale.REPORT.TITLE_RESULT_DESCRIPTION,
        resultDescription: "هات الوصف يا مصطفي وحطه هنا",

        // ---page 4 ---
        pointsTitle: locale.REPORT.TITLE_POINTS,

        // ---page 5 ---
        pointsRestTitle: locale.REPORT.TITLE_POINTS_REST,

        // ---page 6 ---
        comparisonTitle: locale.REPORT.TITLE_COMPARISON,

        // ---page 7 ---
        developmentRecommendationsTitle:
          locale.REPORT.TITLE_DEVELOPMENT_RECOMMENDATIONS,

        // ---page 8 ---
        notesTitle: locale.REPORT.TITLE_NOTES,
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
