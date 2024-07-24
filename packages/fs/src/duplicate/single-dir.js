const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { glob } = require('glob');
const fse = require('fs-extra');
const { log, time } = require("@ns-cli/utils");

class Dir {
    constructor(options) {
        this.path = options.path;
        this.newDir = options.newDir;

        this.videoLen = 0;
        this.pictureLen = 0;
        this.hashMap = {};

        // 副本
        this.dlVideoLen = 0;
        this.dlPictureLen = 0;
        this.duplicate = {};

        // 忽略那些文件夹
        this.ignore = options.ignore;
    }
    async searchInParallel() {
        time.start();
        try {
            // 遍历所有文件，不包含目录
            const dirs = await glob('**', { nodir: true, cwd: this.path, ignore: this.ignore });
            dirs.forEach(dir => {
                const filePath = path.join(this.path, dir);
                const fileType = this.getType(filePath);
                const fileHash = this.getHash(filePath);

                if (fileType === "video") {
                    this.videoLen++
                } else if (fileType === "picture") {
                    this.pictureLen++
                }

                // 如果哈希值已经存在，则认为是重复文件
                if (this.hashMap[fileHash]) {
                    this.hashMap[fileHash].count++;
                    this.hashMap[fileHash].paths.push(filePath);
                } else {
                    this.hashMap[fileHash] = {
                        count: 1,
                        fileType,
                        paths: [filePath]
                    };
                }
            })
        } catch (error) {
            log.error('Error:', error.message);
        }
        time.end(`扫描完毕，发现文件${this.videoLen + this.pictureLen}个，视频 ${this.videoLen} 个，图片 ${this.pictureLen} 个 `);
    }
    async filterDuplicate() {
        time.start();
        try {
            Object.keys(this.hashMap)?.forEach(fileHash => {
                const fileMap = this.hashMap[fileHash];
                if (fileMap?.count > 1) {
                    const first = fileMap.paths[0];
                    const duplicates = fileMap.paths.slice(1);
                    if (duplicates.length) {
                        log.warn(`发现 ${first} 的的重复文件，${duplicates.length} 个`)
                        duplicates.forEach(i => {
                            try {
                                if (fileMap.fileType === "video") {
                                    this.dlVideoLen++
                                } else if (fileMap.fileType === "picture") {
                                    this.dlPictureLen++
                                }
                            } catch (error) {
                                log.error(error.message)
                            }
                        })
                        this.duplicate[fileHash] = {
                            fileType: fileMap.fileType,
                            path: first,
                            duplicates
                        }
                    }
                }
            })
        } catch (error) {
            log.error('Error:', error.message);
        }
        time.end(`发现副本${this.dlVideoLen + this.dlPictureLen}个，视频${this.dlVideoLen}个，图片${this.dlPictureLen}个 `);
    }

    async moveDuplicate() {
        time.start();
        try {
            const fullPath = path.join(this.path, this.newDir);
            fs.mkdirSync(fullPath, { recursive: true });

            Object.keys(this.duplicate).forEach(key => {
                const { duplicates = [] } = this.duplicate[key];
                duplicates?.forEach(filePath => {
                    // 获取图片文件名
                    const oldFilePath = path.basename(filePath);
                    log.warn(`正在移动${oldFilePath}`);
                    fs.renameSync(filePath, path.join(fullPath, oldFilePath))
                })
            })
        } catch (error) {
            log.error('Error:', error.message);
        }
        time.end(`已将所有副本移动到 ${this.newDir} `);
    }
    async deleteDuplicate() {
        const targetPath = path.join(this.path, this.newDir)
        if (fs.existsSync(targetPath)) {
            fse.emptyDirSync(targetPath);
            log.success('已清空', targetPath);
        } else {
            log.success('文件夹不存在', targetPath);
        }
    }
    // 计算文件的哈希值
    getHash(filePath) {
        const hash = crypto.createHash('md5');
        const fileContent = fs.readFileSync(filePath);
        return hash.update(fileContent).digest('hex');
    }
    // 获取文件类型
    getType(filePath) {
        const etx = path.extname(filePath).toLowerCase();
        switch (etx) {
            case '.mp4':
            case '.avi':
            case '.mov':
                return 'video';
            case '.jpg':
            case '.jpeg':
            case '.png':
            case '.gif':
                return 'picture';
            default:
                return '未知';
        }
    }
}

module.exports = Dir