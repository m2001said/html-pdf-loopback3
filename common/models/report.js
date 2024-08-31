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
      const language = ar;

      const lang = "ar";
      const gender = "male";
      const allStrength = false;
      let program;
      let programId = 3;
      if (programId === 2) {
        program = language.REPORT.SELF_CONFIDENCE;
      } else if (programId === 3) {
        program = language.REPORT.LEADERSHIP;
      }

      const result = 40;
      const averageResult = 70;

      let levelSentens;
      if (result === averageResult) {
        levelSentens = language.REPORT.LEVEL.SAME + " " + program.LEVEL_COMPARE;
      } else if (result > averageResult) {
        levelSentens =
          language.REPORT.LEVEL.LARGER + " " + program.LEVEL_COMPARE;
      } else if (result < averageResult) {
        levelSentens =
          language.REPORT.LEVEL.SMALLER + " " + program.LEVEL_COMPARE;
      }

      const data = {
        // -----all images---------
        rightCheck: utils.IMGToURI("right-check.png"),
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

        // -----------main variables-------
        programId: 2,
        allStrength: allStrength,
        levelSentens: levelSentens,

        // todo---new-------------------------
        lang: "ar",

        //todo update these images
        heroLogo:
          lang === "en"
            ? utils.IMGToURI("hero-logo-en.png")
            : utils.IMGToURI("hero-logo.png"),
        backgroundSmallTitle:
          lang === "en"
            ? utils.IMGToURI("background-small-title-en.jpg")
            : utils.IMGToURI("background-small-title.jpg"),
        backgroundBigTitle:
          lang === "en"
            ? utils.IMGToURI("background-big-title-en.jpg")
            : utils.IMGToURI("background-big-title.jpg"),
        // todo -----------------end of new code --------------

        // ---page 1 ---
        title: program.TITLE,
        subtitle: program.SUBTITLE,
        date: moment().format("DD/MM/YYYY"),
        usernameTitle: language.REPORT.REPORT_USER,
        dateTitle: language.REPORT.REPORT_DATE,
        username: "محمد سعيد",

        // ---page 2 ---
        aboutTitle: language.REPORT.TITLE_ABOUT,
        cards: program.CARDS,

        // ---page 3 ---
        resultDescriptionTitle: language.REPORT.TITLE_RESULT_DESCRIPTION,

        resultDescription: "هات الوصف يا مصطفي وحطه هنا",

        // ---page 4 ---
        pointsTitle: allStrength
          ? language.REPORT.TITLE_POINTS_STRONG
          : language.REPORT.TITLE_POINTS,
        mainLevel: program.MAIN_LEVEL,
        fullPoint: language.REPORT.FULL_POINT,
        mediumPoint: language.REPORT.MEDIUM_POINT,
        smallPoint: language.REPORT.SMALL_POINT,

        // ---page 5 ---
        pointsRestTitle: allStrength
          ? language.REPORT.TITLE_POINTS_REST_STRONG
          : language.REPORT.TITLE_POINTS_REST,

        // ---page 6 ---
        comparisonTitle: language.REPORT.TITLE_COMPARISON,
        levelDesc: language.REPORT.LEVEL.LEVEL_DESC,
        yourLevel: language.REPORT.LEVEL.YOUR_LEVEL,
        theLevel: language.REPORT.LEVEL.THE_LEVEL,

        // ---page 7 ---
        developmentRecommendationsTitle:
          language.REPORT.TITLE_DEVELOPMENT_RECOMMENDATIONS,
        recommendationsTitles: language.REPORT.RECOMMENDATIONS.TITLES,
        recommendationsDescriptions:
          lang === "en"
            ? language.REPORT.RECOMMENDATIONS.MALE
            : gender === "male"
            ? language.REPORT.RECOMMENDATIONS.MALE
            : language.REPORT.RECOMMENDATIONS.FEMALE,

        // ---page 8 ---
        notesTitle: language.REPORT.TITLE_NOTES,
        noteImages: [
          utils.IMGToURI("note1.png"),
          utils.IMGToURI("note2.png"),
          utils.IMGToURI("note3.png"),
          utils.IMGToURI("note4.png"),
        ],
        notesDescription:
          lang === "en"
            ? language.REPORT.NOTES.MALE
            : gender === "male"
            ? language.REPORT.NOTES.MALE
            : language.REPORT.NOTES.FEMALE,
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
