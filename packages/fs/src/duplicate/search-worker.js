const path = require("path");
const { getType, getHash } = require("./utils");
const { log } = require("@ns-cli/utils");

process.on("message", async ({ files, basePath }) => {
  let videoLen = 0;
  let pictureLen = 0;

  const hashMap = {};
  const childProcessId = process.pid; // 获取子进程ID

  try {
    for (let i = 0; i < files.length; i++) {
      const filePath = path.join(basePath, files[i]);
      const fileType = getType(filePath);
      const fileHash = getHash(filePath);

      if (fileType === "video") {
        videoLen++;
      } else if (fileType === "picture") {
        pictureLen++;
      }

      // 如果哈希值已经存在，则认为是重复文件
      if (hashMap[fileHash]) {
        hashMap[fileHash].count++;
        hashMap[fileHash].paths.push(filePath);
      } else {
        hashMap[fileHash] = {
          count: 1,
          fileType,
          paths: [filePath],
        };
      }
      process.send({ childProcessId, completed: i + 1 }); // 将子进程ID和已完成进度一起发送给主进程
    }
    // 处理完所有文件后，发送最终结果给主进程
    process.send({ videoLen, pictureLen, hashMap });
    process.exit();
  } catch (error) {
    log.error("Error:", error.message);
  }
});
