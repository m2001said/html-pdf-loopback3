const pdf = require("html-pdf");

const generatePdf = (data) => {
  let options = {
    format: "A4",
    orientation: "portrait",
  };
  return new Promise((resolve, reject) => {
    pdf.create(data, options).toStream((err, stream) => {
      if (err) return reject(err);
      resolve(stream);
    });
  });
};

const IMGToURI = (imgName) => {
  const fs = require("fs");
  const path = require("path");
  const base = path.resolve(__dirname, "./server/images/");
  const img = fs.readFileSync(`${base}/${imgName}`);
  const img64Image = new Buffer.from(img).toString("base64");
  const URI = `data:image/${path
    .extname(imgName)
    .slice(1)};base64,${img64Image}`;
  return URI;
};

module.exports = {
  generatePdf,
  IMGToURI,
};
