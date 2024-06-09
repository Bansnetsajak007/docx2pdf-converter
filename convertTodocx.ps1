param (
    [string]$inputPath,
    [string]$outputPath,
    [string]$keepActive
)

# Convert $keepActive to a boolean
$keepActiveBoolean = $keepActive -eq 'true'

# Check if the input file exists
if (-not (Test-Path $inputPath)) {
    Write-Error "Input file does not exist: $inputPath"
    exit 1
}

# Add COM object for Microsoft Word
Add-Type -AssemblyName "Microsoft.Office.Interop.Word"

# Create a new Word application instance
$word = New-Object -ComObject Word.Application

# Set visibility of the Word application
if (-not $keepActiveBoolean) {
    $word.Visible = $false
}

try {
    # Open the PDF document
    $document = $word.Documents.Open($inputPath)
    
    # Save the document as DOCX
    $document.SaveAs([ref]$outputPath, [ref]16)  # 16 represents the default DOCX format
    
    # Close the document
    $document.Close()
    
    Write-Host "Conversion completed: $inputPath to $outputPath"
} catch {
    Write-Error "An error occurred during conversion: $_"
} finally {
    # Quit the Word application if keepActive is false
    if (-not $keepActiveBoolean) {
        $word.Quit()
    }
}
