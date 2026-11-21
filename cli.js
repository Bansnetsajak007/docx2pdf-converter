const path = require('path');
const { convert } = require('./index.js');

// CLI 脚本：支持传入 docx 文件路径和可选的 pdf 输出路径
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('用法: node cli.js <输入.docx文件> [输出.pdf文件]');
  process.exit(1);
}

const inputPath = path.resolve(args[0]);
let outputPath = args[1] ? path.resolve(args[1]) : `${inputPath.slice(0, -5)}pdf`;

convert(inputPath, outputPath)
  .then(() => {
    console.log(`✅ 转换成功: ${inputPath} → ${outputPath}`);
    process.exit(0);
  })
  .catch(err => {
    console.error(`❌ 转换失败: ${err.message}`);
    process.exit(1);
  });