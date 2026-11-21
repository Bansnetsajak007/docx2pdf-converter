const DOCX2PDFConverter = require('./index.js'); // 如果在当前项目中
const path = require('path');

const inputPath = path.join(__dirname, "test1.docx");
const outputPath = path.join(__dirname, "output.pdf");

DOCX2PDFConverter.convert(inputPath, outputPath)
  .then((res) => {
    console.log("转换成功:", res);
  })
  .catch(error => {
    console.error("转换失败:", error);
  });