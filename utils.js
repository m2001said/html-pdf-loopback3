// --important notes for puppeteer :https://apitemplate.io/blog/tips-for-generating-pdfs-with-puppeteer/
const puppeteer = require("puppeteer");
const path = require("path");

const generatePdf = async (html) => {
  const browser = await puppeteer.launch({
    headless: true,
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    height: `842px`,
    width: "595px",
    printBackground: true,
    landscape: false,
  }); // Generate PDF as a buffer
  await browser.close();
  return pdfBuffer;
};

const IMGToURI = (imgName) => {
  const fs = require("fs");
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
