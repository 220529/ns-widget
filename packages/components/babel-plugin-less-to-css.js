const less = require("less");
const fs = require("fs");
const path = require("path");

function parentPath(filePath) {
  // 获取父目录名称
  const parentDir = path.basename(path.dirname(filePath));
  // 返回父目录名称作为组件名称
  return parentDir;
}

module.exports = function () {
  return {
    visitor: {
      ImportDeclaration(importPath, state) {
        const importValue = importPath.node.source.value;

        // 只处理 .less 文件
        if (importValue.endsWith(".less")) {
          const absolutePath = path.resolve(
            path.dirname(state.file.opts.filename),
            importValue
          );

          console.log(`Processing LESS file: ${absolutePath}`);

          if (fs.existsSync(absolutePath)) {
            const lessContent = fs.readFileSync(absolutePath, "utf8");

            less.render(lessContent, (err, output) => {
              if (err) {
                console.error(`Error compiling LESS file: ${err}`);
                return;
              }

              // 获取构建目录路径
              const distDir = path.resolve(
                __dirname,
                "dist/esm",
                parentPath(absolutePath)
              );
              const cssPath = path.join(
                distDir,
                path.basename(absolutePath).replace(/\.less$/, ".css")
              );

              // 确保 dist 目录存在
              if (fs.existsSync(distDir)) {
                // 写入生成的 CSS 文件
                fs.writeFileSync(cssPath, output.css, "utf8");

                // 删除对应的 LESS 文件
                fs.unlinkSync(path.join(distDir, path.basename(absolutePath)));

                // 替换 importPath 中的 .less 为 .css
                importPath.node.source.value = importValue.replace(
                  /\.less$/,
                  ".css"
                );
                console.log(`Compiled and replaced: ${cssPath}`);
              }
            });
          } else {
            console.error(`LESS file not found: ${absolutePath}`);
          }
        }
      },
    },
  };
};
