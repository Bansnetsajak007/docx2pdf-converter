# Docx to PDF Converter

A lightweight npm package designed to convert Word documents (docx) to PDF format. While similar tools exist in Python, I found a gap in the JavaScript ecosystem and decided to fill it by creating this simple and efficient solution.

## Features

- Cross-platform compatibility: Supports both Windows and macOS.
- Easy-to-use API: Convert docx files to PDF with just a few lines of code.
- Batch conversion: Convert entire directories of docx files to PDF.

## Installation

Install the package via npm:

```bash
npm i docx2pdf-converter
```

## Usage

This line of code simply converts single docx file into pdf file

```javascript
const topdf = require('docx2pdf-converter')

const inputPath = './report.docx';

topdf.convert(inputPath,'output.pdf')
```

## converting entire directory of docs file into pdf file

This line of code converts entire directory of docx file into another directory of pdf file

```javascript
const fs = require('fs');
const path = require('path');
const { convert, resolvePaths } = require('docx2pdf-converter');


function convertDirectory(inputDir, outputDir) {
  const files = fs.readdirSync(inputDir);

  files.forEach((file) => {
    if (file.endsWith('.docx')) {
      const inputPath = path.join(inputDir, file);
      const { output } = resolvePaths(inputPath, outputDir);
      convert(inputPath, output);
      console.log(`Converted: ${file}`);
    }
  });
}
/*
 assume the both directories input and output are in same folder
 if they dont exist the you can give absolute path to that folder
*/
const inputDirectory = './inputdir';
const outputDirectory = './outputdir';

convertDirectory(inputDirectory, outputDirectory);
```



