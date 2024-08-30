const puppeteer = require("puppeteer");
const path = require("path");

const generatePdf = async (html) => {
  const browser = await puppeteer.launch(); // Launch the browser
  const page = await browser.newPage(); // Open a new page
  await page.setContent(html, { waitUntil: "networkidle0" }); // Set the HTML content
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    landscape: false,
  }); // Generate PDF as a buffer
  await browser.close(); // Close the browser
  return pdfBuffer; // Return the buffer
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
