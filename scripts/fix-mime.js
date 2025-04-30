// 使用ESM导入
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

console.log('开始修复MIME类型...');

async function fixMimeTypes() {
  try {
    // 获取dist目录下所有的JS文件
    const jsFiles = await glob('dist/assets/**/*.js');
    console.log(`找到 ${jsFiles.length} 个JS文件需要处理`);

    // 确保每个JS文件的第一行包含MIME类型注释
    for (const file of jsFiles) {
      console.log(`处理文件: ${file}`);
      
      let content = fs.readFileSync(file, 'utf8');
      
      // 添加MIME类型注释到文件开头
      if (!content.startsWith('// @ts-check')) {
        content = `// @ts-check\n// Content-Type: application/javascript\n${content}`;
        fs.writeFileSync(file, content, 'utf8');
        console.log(`已修复文件: ${file}`);
      }
    }

    // 创建一个.vercelignore文件以忽略不必要的文件
    fs.writeFileSync('.vercelignore', `
node_modules
.git
.github
.gitignore
README.md
`);

    console.log('MIME类型修复完成！');
  } catch (error) {
    console.error('修复过程中出错:', error);
    process.exit(1);
  }
}

// 执行修复函数
fixMimeTypes(); 