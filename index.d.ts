declare const DOCX2PDFConverter: {
  /**
   * Converts a DOCX file to PDF.
   *
   * @param inputFilePath - Path to the input DOCX file.
   * @param outputFilePath - Path to save the output PDF file.
   * @param keepActive - Optional Flag to keep the application active (platform-dependent).
   */
  convert(
    inputFilePath: string,
    outputFilePath: string,
    keepActive?: boolean
  ): string | undefined;

  /**
   * Extracts images from a DOCX file and saves them to the specified directory.
   *
   * @param inputPath - Path to the input DOCX file.
   * @param outputDir - Directory where the extracted images will be saved.
   * @returns {Promise<boolean>}
   */
  extractImages(inputPath: string, outputDir: string): Promise<boolean>;
  /**
   * Resolves and validates input and output paths, ensuring they are correct and handle both single files and directories.
   *
   * @param inputPath - Path to the input DOCX file or directory.
   * @param outputDir - Path to the output directory or file.
   */
  resolvePaths(
    inputPath: string,
    outputPath: string
  ): Promise<{ input: string; output: string; batch: boolean }>;
  /**
   * Convert Word document to PDF on Windows using PowerShell
   *
   * @param inputFilePath - Path to the input DOCX file.
   * @param outputFilePath - Path to save the output PDF file.
   * @param keepActive - Optional Flag to keep the application active (platform-dependent).
   */
  windows(
    inputFilePath: string,
    outputFilePath: string,
    keepActive?: boolean
  ): string | undefined;
  /**
   * New PDF to DOCX conversion functions for Windows hell yeahhh
   *
   * @param inputFilePath - Path to the input DOCX file.
   * @param outputFilePath - Path to save the output PDF file.
   * @param keepActive - Optional Flag to keep the application active (platform-dependent).
   */
  windowsPdfToDocx(
    inputFilePath: string,
    outputFilePath: string,
    keepActive?: boolean
  ): string | undefined;
  /**
   * Convert Word document to PDF on macOS using a shell script
   *
   * @param inputFilePath - Path to the input DOCX file.
   * @param outputFilePath - Path to save the output PDF file.
   * @param keepActive - Optional Flag to keep the application active (platform-dependent).
   */
  macos(
    inputFilePath: string,
    outputFilePath: string,
    keepActive?: boolean
  ): string | undefined;

  /**
   * Convert Word document to PDF Linux specific function
   *
   * @param inputFilePath - Path to the input DOCX file.
   * @param outputFilePath - Path to save the output PDF file.
   * @param keepActive - Optional Flag to keep the application active (platform-dependent).
   */
  linux(
    inputFilePath: string,
    outputFilePath: string,
    keepActive?: boolean
  ): string | undefined;
};

export default DOCX2PDFConverter;
