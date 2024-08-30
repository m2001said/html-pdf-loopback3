"use strict";
const utils = require("../../utils");
const moment = require("moment");
const path = require("path");
const fs = require("fs");
const pdf = require("pdf-creator-node");

module.exports = function (report) {
  report.remoteMethod("generate", {
    accepts: [{ arg: "res", type: "object", http: { source: "res" } }],
    returns: { type: "file", root: true },
    http: { path: "/generate", verb: "get" },
  });

  report.generate = async (res) => {
    try {
      // Correct the path to the template file
      const templatePath = path.resolve(
        __dirname,
        "../../server/templates/report.html"
      );
      const html = fs.readFileSync(templatePath, "utf8");

      const options = {
        format: "A3",
        orientation: "portrait",
        border: "10mm",
        header: {
          height: "45mm",
          contents:
            '<div style="text-align: center;">Author: Shyam Hajare</div>',
        },
        footer: {
          height: "28mm",
          contents: {
            first: "Cover page",
            2: "Second page", // Any page number is working. 1-based index
            default:
              '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            last: "Last Page",
          },
        },
      };

      const document = {
        html: html,
        data: {
          date: moment().format("DD/MM/YYYY"),
          username: "محمد خالد",
          heroLogo: utils.IMGToURI("hero-logo.png"),
          rightCheck: utils.IMGToURI("right-check.png"),
          backgroundSmallTitle: utils.IMGToURI("background-small-title.jpg"),
        },
        path: "./output.pdf",
        type: "",
      };

      pdf
        .create(document, options)
        .then((result) => {
          console.log(result);
          res.download(result.filename, "report.pdf", (err) => {
            if (err) {
              console.error("Error downloading PDF:", err.message);
              if (!res.headersSent) {
                res.status(500).send({
                  error: "Failed to download PDF",
                  details: err.message,
                });
              }
            }
          });
        })
        .catch((error) => {
          console.error("Error generating PDF:", error.message);
          if (!res.headersSent) {
            res.status(500).send({
              error: "Failed to generate PDF",
              details: error.message,
            });
          }
        });
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
