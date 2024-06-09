#!/bin/bash

inputFilePath=$1
outputFilePath=$2
keepActive=$3

# Check if input file exists
if [ ! -f "$inputFilePath" ]; then
    echo "Input file does not exist: $inputFilePath"
    exit 1
fi

# Extract text from PDF using pdftotext (requires Poppler installed)
tempTextFilePath="$(mktemp).txt"
pdftotext -layout "$inputFilePath" "$tempTextFilePath"

if [ ! -f "$tempTextFilePath" ]; then
    echo "Failed to extract text from PDF: $inputFilePath"
    exit 1
fi

# Convert extracted text to DOCX using pandoc (requires pandoc installed)
if [ -z "$outputFilePath" ]; then
    outputFilePath="${inputFilePath%.pdf}.docx"
fi

pandoc "$tempTextFilePath" -o "$outputFilePath"

# Clean up temporary text file
rm "$tempTextFilePath"
echo "Conversion complete: $outputFilePath"
