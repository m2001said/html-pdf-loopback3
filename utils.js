const pdf = require("pdf-creator-node");
const fs = require("fs");
const path = require("path");

const generatePdf = (templatePath, data) => {
  const html = fs.readFileSync(templatePath, "utf8");

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
          '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
      },
    },
  };

  const document = {
    html: html,
    data: data,
    path: "./output.pdf", // Save the PDF to this path
    type: "",
  };

  return pdf.create(document, options);
};

const IMGToURI = (imgName) => {
  const base = path.resolve(__dirname, "./server/images/");
  const img = fs.readFileSync(`${base}/${imgName}`);
  const img64Image = Buffer.from(img).toString("base64");
  const URI = `data:image/${path
    .extname(imgName)
    .slice(1)};base64,${img64Image}`;
  return URI;
};

module.exports = {
  generatePdf,
  IMGToURI,
};
