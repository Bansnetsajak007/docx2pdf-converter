const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip'); 
const { exec } = require('child_process');
const assert = require('assert');
const { promisify } = require('util');

const packageVersion = require('./package.json').version;

const execAsync = promisify(exec);

/**
 * check if file exists async
 * @param {string} inputPath 
 * @returns 
 */
const isExists = async (inputPath) => {
  try {
    await fs.promises.access(inputPath);
    return true;
  } catch (error) {
    console.error('Input file does not exist:', inputPath);
    return false;
  }
}

/**
 * check if path is directory async
 * @param {string} inputPath 
 * @returns 
 */
const isDirectory = async (inputPath) => {
  try {
    return (await fs.promises.stat(inputPath)).isDirectory();
  } catch (error) {
    console.error('Input file does not exist:', inputPath);
    return false;
  }
}

/**
 * Extract images from a DOCX file
 * @param {string} inputPath - Path to the DOCX file
 * @param {string} outputDir - Directory where images will be saved
 * @returns {Promise<boolean>}
 */
async function extractImages(inputPath, outputDir) {
  if (!inputPath) {
    console.error('Input path is not provided.');
    return;
  }

  if (!(await isExists(inputPath))) {
    console.error('Input file does not exist:', inputPath);
    return;
  }

  // Ensure the output directory exists
  if (!(await isExists(outputDir))) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const zip = new AdmZip(inputPath);
  const zipEntries = zip.getEntries(); // List all entries in the ZIP

  // Iterate over entries to find images in the "word/media" folder
  for(const entry of zipEntries) {
    if (entry.entryName.startsWith('word/media/')) {
      const imageName = entry.entryName.split('/').pop();
      const imagePath = path.join(outputDir, imageName);

      // Extract the image to the output directory
      await fs.promises.writeFile(imagePath, entry.getData());
      console.log('Extracted image:', imageName);
    }
  }

  console.log('Image extraction completed.');
  return true;
}


/**
 * Convert Word document to PDF on Windows using PowerShell
 * @param {string} inputPath 
 * @param {string} outputPath 
 * @param {boolean} keepActive 
 */
async function windows(inputPath, outputPath, keepActive) {
  if (!inputPath) {
    console.error('Input path is not provided.');
    return;
  }

  const scriptPath = path.resolve(__dirname, 'convert.ps1');
  const inputFilePath = path.resolve(inputPath);
  const outputFilePath = path.resolve(outputPath);

  const command = `powershell -File "${scriptPath}" "${inputFilePath}" "${outputFilePath}" ${keepActive ? 'true' : 'false'}`;

  const result = await execAsync(command);
  if(result.stderr) {
    throw new Error(result.stderr);
  }

  return result.stdout;
}

/**
 * New PDF to DOCX conversion functions for Windows hell yeahhh
 * @param {string} inputPath 
 * @param {string} outputPath 
 * @param {string} keepActive 
 */
async function windowsPdfToDocx(inputPath, outputPath, keepActive = false) {
  if (!inputPath) {
      console.error('Input path is not provided.');
      return;
  }

  const scriptPath = path.resolve(__dirname, 'convertTodocx.ps1');
  const inputFilePath = path.resolve(inputPath);
  const outputFilePath = path.resolve(outputPath);

  const command = `powershell -File "${scriptPath}" "${inputFilePath}" "${outputFilePath}" ${keepActive ? 'true' : 'false'}`;
  
  const result = await execAsync(command);
  if(result.stderr) {
    throw new Error(result.stderr);
  }

  return result.stdout;
}
  

/**
  * ! Not the best solution for ms word files fonts and layout may changed whether use `unoconv` or `soffice` as they relay of libreoffice
  * Convert Word document to PDF Linux specific function
  * @param inputFilePath - Path to the input DOCX file.
  * @param outputFilePath - Path to save the output PDF file.
  * @param keepActive - Optional Flag to keep the application active (platform-dependent).
*/
async function linux(inputPath, outputPath, keepActive) {
  if (!inputPath) {
    console.error('Input path is not provided.');
    return;
  }

  const inputFilePath = path.resolve(inputPath);
  const outputFilePath = outputPath ? path.resolve(outputPath) : `${inputFilePath}.pdf`;
  const command = `unoconv -f pdf -o "${outputPath}" "${inputPath}"`;
  // const command = `soffice --headless --convert-to pdf:writer_pdf_Export --outdir "${path.dirname(outputPath)}" "${inputPath}"`;
  
  const result = await execAsync(command);
  if(result.stderr) {
    throw new Error(result.stderr);
  }

  return result.stdout;
}

/**
 * Resolves and validates input and output paths, ensuring they are correct and handle both single files and directories.
 *
 * @param inputPath - Path to the input DOCX file or directory.
 * @param outputDir - Path to the output directory or file.
*/
async function resolvePaths(inputPath, outputPath) {
  if (!inputPath) {
    console.error('Input path is not provided.');
    process.exit(1); // Exit with an error code
  }

  const inputFilePath = path.resolve(inputPath);
  let outputFilePath = outputPath ? path.resolve(outputPath) : null;

  const output = {};

  if (!(await isExists(inputFilePath))) {
    console.error('Input file does not exist:', inputFilePath);
    process.exit(1); // Exit with an error code
  }

  if ((await isDirectory(inputFilePath))) {
    output.batch = true;
    output.input = inputFilePath;

    if (outputPath) {
      if (!(await isExists(outputPath)) || !(await isDirectory(outputPath))) {
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

    if (outputPath && (await isDirectory(outputPath))) {
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
async function macos(inputPath, outputPath, keepActive) {
  if (!inputPath) {
    console.error('Input path is not provided.');
    return;
  }
  
  const scriptPath = path.resolve(__dirname, 'convert.sh');
  const inputFilePath = path.resolve(inputPath);
  const outputFilePath = outputPath ? path.resolve(outputPath) : null;

  const command = `sh "${scriptPath}" "${inputFilePath}" "${outputFilePath}" ${keepActive ? 'true' : 'false'}`;

  
  const result = await execAsync(command);
  if(result.stderr) {
    throw new Error(result.stderr);
  }

  return result.stdout;
}

/**
 * Convert Word document to PDF using platform-specific method
 */
function convert(inputPath, outputPath, keepActive = false) {
  if (process.platform === 'darwin') {
    return macos(inputPath, outputPath, keepActive);
  } else if (process.platform === 'win32') {
    return windows(inputPath, outputPath, keepActive);
  } else if (process.platform === 'linux') {
    return linux(inputPath, outputPath, keepActive);
  } else {
    throw new Error('Unsupported platform: ' + process.platform);
  }
}

module.exports = {
  convert,
  resolvePaths,
  windows,
  windowsPdfToDocx,
  macos,
  linux,
  extractImages,
  packageVersion,
};

  // const inputPath = 'report.docx'; // Adjust this based on the actual filename
  // const outputPath = 'output.pdf';  // Adjust this based on the desired output filename
  // const keepActive = false;
  
  // windows(inputPath, outputPath, keepActive);
  

