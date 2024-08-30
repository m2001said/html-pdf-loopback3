"use strict";
const utils = require("../../utils");
const moment = require("moment");
const path = require("path");
const pdf = require("pdf-creator-node");

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

      const templatePath = path.resolve(
        __dirname,
        "../../server/templates/report.html"
      );

      // Read the HTML template
      const html = require("fs").readFileSync(templatePath, "utf8");

      const options = {
        format: "A4",
        orientation: "portrait",
        border: "10mm",
        header: {
          height: "20mm",
          contents: '<div style="text-align: center;">Header</div>',
        },
        footer: {
          height: "20mm",
          contents: {
            default:
              '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>',
          },
        },
      };

      const document = {
        html: html,
        data: data,
        type: "buffer", // Set the type to 'buffer' to directly stream it
      };

      // Generate the PDF as a buffer
      const result = await pdf.create(document, options);

      // Set headers and stream the PDF
      res.setHeader("Content-type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=report.pdf`);
      res.end(result, "binary");
    } catch (error) {
      console.error("Error generating PDF:", error.message);
      if (!res.headersSent) {
        res
          .status(500)
          .send({ error: "Failed to generate PDF", details: error.message });
      }
    }
  };
};
