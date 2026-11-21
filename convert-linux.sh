#!/bin/bash
# Linux 下的 DOCX 转 PDF 脚本
# 用法: ./convert-linux.sh <输入.docx> [可选输出.pdf]

set -e

if [ $# -lt 1 ]; then
  echo "用法: ./convert-linux.sh <输入.docx文件> [输出.pdf文件]"
  exit 1
fi

INPUT_FILE="$1"
OUTPUT_FILE="$2"

# 如果未指定输出文件名，自动替换 .docx 为 .pdf
if [ -z "$OUTPUT_FILE" ]; then
  OUTPUT_FILE="${INPUT_FILE%.docx}.pdf"
fi

# 检查输入文件是否存在
if [ ! -f "$INPUT_FILE" ]; then
  echo "错误: 输入文件不存在: $INPUT_FILE"
  exit 1
fi

# 检查 unoconv 是否安装
if ! command -v unoconv &> /dev/null; then
  echo "错误: 未安装 unoconv，请运行: sudo apt install unoconv"
  exit 1
fi

# 执行转换
node "$(dirname "$0")/cli.js" "$INPUT_FILE" "$OUTPUT_FILE"
