import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 删除_headers文件
const headersPath = path.join(rootDir, 'dist', '_headers');
if (fs.existsSync(headersPath)) {
  console.log('正在删除 _headers 文件');
  fs.unlinkSync(headersPath);
  console.log('_headers 文件已删除');
} else {
  console.log('未找到 _headers 文件');
}

console.log('后构建清理完成'); 