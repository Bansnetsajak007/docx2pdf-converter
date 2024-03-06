#!/bin/bash

# Retrieve input and output paths from arguments
inputPath="$1"
outputPath="$2"

# Check if the input file exists
if [ ! -f "$inputPath" ]; then
    echo "Input file does not exist: $inputPath"
    exit 1
fi

# Convert the Word file to PDF using textutil command
textutil -convert pdf "$inputPath" -output "$outputPath"

# Check if the conversion was successful
if [ $? -eq 0 ]; then
    echo "Conversion completed: $inputPath to $outputPath"
else
    echo "Conversion failed."
fi
