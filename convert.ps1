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

# Your conversion logic here...
# For example, using Word to convert to PDF:
$word = New-Object -ComObject Word.Application
$doc = $word.Documents.Open($inputPath)
$doc.SaveAs([ref]$outputPath, [ref]17)  # 17 represents PDF format
$doc.Close()
$word.Quit()

# End of your conversion logic

Write-Host "Conversion completed: $inputPath to $outputPath"
