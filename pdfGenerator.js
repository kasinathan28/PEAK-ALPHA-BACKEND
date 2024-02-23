const pdf = require('html-pdf');

// Function to generate PDF from HTML content
const generatePDF = (htmlContent, callback) => {
  pdf.create(htmlContent).toBuffer((err, buffer) => {
    if (err) {
      console.error("Error generating PDF:", err);
      callback(err, null);
    } else {
      callback(null, buffer);
    }
  });
};

module.exports = generatePDF;
