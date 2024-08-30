const fs = require("fs");
const path = require("path");

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
