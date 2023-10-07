const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

// 源文件夹路径
const sourceDir = 'D:/aidi-service/aidi_web_recruiting-vite/src/sdk-wx';

// 目标文件夹路径
const targetDir = 'D:/Users/aidi/WeChatProjects/miniprogram-3/';

function getSrcFromPath(dir) {
  const directoryPath = path.dirname(dir);
  const regex = /(src.*)/g;
  const result = directoryPath.match(regex)[0];
  return `${targetDir}${result}`;
}

function copyFile(filePath) {
  const fileName = path.basename(filePath);
  const targetDirPath = getSrcFromPath(filePath);
  if (!fs.existsSync(targetDirPath)) fs.mkdirSync(targetDirPath, { recursive: true });
  const targetFilePath = path.join(targetDirPath, fileName);
  fs.copyFileSync(filePath, targetFilePath);
}

// 创建监视器
const watcher = chokidar.watch(sourceDir, {
  persistent: true,
  ignoreInitial: true,
});
// 监听文件变化
watcher
  .on('add', (filePath) => {
    copyFile(filePath);
  })
  .on('change', (filePath) => {
    copyFile(filePath);
  })
  .on('unlink', (filePath) => {
    const fileName = path.basename(filePath);
    const targetDirPath = getSrcFromPath(filePath);
    const targetFilePath = path.join(targetDirPath, fileName);
    console.log(targetFilePath);
    if (fs.existsSync(targetFilePath)) {
      fs.unlinkSync(targetFilePath);
    } else {
      console.log('文件不存在！');
    }
  })
  .on('error', (error) => {
    console.error(`发生错误： ${error.message}`);
  });
