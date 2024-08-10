const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const assert = require('assert');

const packageVersion = require('./package.json').version;

/**
 * Convert Word document to PDF on Windows using PowerShell
 */
function windows(inputPath, outputPath, keepActive) {
    if (!inputPath) {
      console.error('Input path is not provided.');
      return;
    }
  
    const scriptPath = path.resolve(__dirname, 'convert.ps1');
    const inputFilePath = path.resolve(inputPath);
    const outputFilePath = path.resolve(outputPath);
  
    const command = `powershell -File "${scriptPath}" "${inputFilePath}" "${outputFilePath}" ${keepActive ? 'true' : 'false'}`;
  
    execSync(command);
  }

  // New PDF to DOCX conversion functions for Windows hell yeahhh
function windowsPdfToDocx(inputPath, outputPath, keepActive = false) {
  if (!inputPath) {
      console.error('Input path is not provided.');
      return;
  }

  const scriptPath = path.resolve(__dirname, 'convertTodocx.ps1');
  const inputFilePath = path.resolve(inputPath);
  const outputFilePath = path.resolve(outputPath);

  const command = `powershell -File "${scriptPath}" "${inputFilePath}" "${outputFilePath}" ${keepActive ? 'true' : 'false'}`;

  execSync(command);
}
  

/*
  Linux specific function
 */

function linux(inputPath, outputPath, keepActive) {
  if (!inputPath) {
    console.error('Input path is not provided.');
    return;
  }

  const inputFilePath = path.resolve(inputPath);
  const outputFilePath = outputPath ? path.resolve(outputPath) : `${inputFilePath}.pdf`;
  const command = `libreoffice --headless --convert-to pdf "${inputFilePath}" --outdir "${path.dirname(outputFilePath)}"`;
  execSync(command);

}

/**
 * Resolve input and output paths
 */
function resolvePaths(inputPath, outputPath) {
  if (!inputPath) {
    console.error('Input path is not provided.');
    process.exit(1); // Exit with an error code
  }

  const inputFilePath = path.resolve(inputPath);
  let outputFilePath = outputPath ? path.resolve(outputPath) : null;

  const output = {};

  if (!fs.existsSync(inputFilePath)) {
    console.error('Input file does not exist:', inputFilePath);
    process.exit(1); // Exit with an error code
  }

  if (fs.statSync(inputFilePath).isDirectory()) {
    output.batch = true;
    output.input = inputFilePath;

    if (outputPath) {
      if (!fs.existsSync(outputPath) || !fs.statSync(outputPath).isDirectory()) {
        console.error('Output path is not a valid directory:', outputPath);
        process.exit(1); // Exit with an error code
      }
    } else {
      outputPath = inputFilePath;
    }

    output.output = outputPath;
  } else {
    output.batch = false;
    assert(inputFilePath.endsWith('.docx'));
    output.input = inputFilePath;

    if (outputPath && fs.statSync(outputPath).isDirectory()) {
      outputFilePath = path.resolve(outputPath, `${path.basename(inputFilePath, '.docx')}.pdf`);
    } else if (outputPath && outputPath.endsWith('.pdf')) {
      // outputPath is a file path
      outputFilePath = outputPath;
    } else {
      outputFilePath = path.resolve(path.dirname(inputFilePath), `${path.basename(inputFilePath, '.docx')}.pdf`);
    }

    output.output = outputFilePath;
  }

  return output;
}


/**
 * Convert Word document to PDF on macOS using a shell script
 */
function macos(inputPath, outputPath, keepActive) {
  if (!inputPath) {
    console.error('Input path is not provided.');
    return;
  }
  
  const scriptPath = path.resolve(__dirname, 'convert.sh');
  const inputFilePath = path.resolve(inputPath);
  const outputFilePath = outputPath ? path.resolve(outputPath) : null;

  const command = `sh "${scriptPath}" "${inputFilePath}" "${outputFilePath}" ${keepActive ? 'true' : 'false'}`;

  execSync(command);
}

/**
 * Convert Word document to PDF using platform-specific method
 */
function convert(inputPath, outputPath, keepActive = false) {
  if (process.platform === 'darwin') {
      macos(inputPath, outputPath, keepActive);
  } else if (process.platform === 'win32') {
      windows(inputPath, outputPath, keepActive);
  } else if (process.platform === 'linux') {
      linux(inputPath, outputPath, keepActive);
  } else {
      console.error('Unsupported platform:', process.platform);
  }
}

module.exports = {
    convert,
    resolvePaths,
    windows,
    windowsPdfToDocx,
    macos,
    linux,
    packageVersion,
  };

  // const inputPath = 'report.docx'; // Adjust this based on the actual filename
  // const outputPath = 'output.pdf';  // Adjust this based on the desired output filename
  // const keepActive = false;
  
  // windows(inputPath, outputPath, keepActive);
  

