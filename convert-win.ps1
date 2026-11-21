param (
    [string]$inputPath,
    [string]$outputPath = "",
    [string]$keepActive = "false"
)

# 自动推导输出文件名（如果未提供）
if ([string]::IsNullOrWhiteSpace($outputPath)) {
    $outputPath = $inputPath -replace '\.docx$', '.pdf'
}

# Convert $keepActive to a boolean
$keepActiveBoolean = $keepActive -eq 'true'

# Check if the input file exists
if (-not (Test-Path $inputPath)) {
    Write-Error "Input file does not exist: $inputPath"
    exit 1
}

# Convert the Word file to PDF using Word COM
try {
    $word = New-Object -ComObject Word.Application
    $doc = $word.Documents.Open($inputPath)
    $doc.SaveAs([ref]$outputPath, [ref]17)  # 17 = PDF format
    $doc.Close()
    $word.Quit()
    
    Write-Host "✅ 转换成功: $inputPath → $outputPath"
} catch {
    Write-Error "❌ 转换失败: $_"
    exit 1
}