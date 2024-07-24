const fs = require('fs');
const path = require('path');
const { fork } = require('child_process');
const { glob } = require('glob');
const fse = require('fs-extra');
const { log, time, progress: ProgressBar } = require("@ns-cli/utils");
const os = require('os');
const numCPUs = os.cpus().length;

const { calculateTotal, delay } = require("./utils");
// 创建进度条实例
const progressBar = new ProgressBar();

class Dir {
    constructor(options) {
        this.path = options.path;
        this.newDir = options.newDir;

        this.dirs = [];
        this.videoLen = 0;
        this.pictureLen = 0;
        this.hashMap = {};

        this.length = Number(options.length) || 50; // 多少个文件拆成一组

        // 副本
        this.dlVideoLen = 0; // 视频的副本
        this.dlPictureLen = 0;
        this.duplicate = {};

        this.forkChildren = {};

        // 忽略那些文件夹
        this.ignore = options.ignore;
    }
    async prepare() {
        this.dirs = await glob('**', { nodir: true, cwd: this.path, ignore: this.ignore });
        log.warn(`${this.path} 共有 ${this.dirs.length} 个文件`);
    }
    mergeHash(results) {
        return results.reduce((prev, next) => {
            prev.videoLen += next.videoLen;
            prev.pictureLen += next.pictureLen;
            Object.keys(next.hashMap).forEach((hash) => {
                if (prev.hashMap[hash]) {
                    // 如果哈希已经存在，则更新它的计数和路径
                    prev.hashMap[hash].count += next.hashMap[hash].count;
                    prev.hashMap[hash].paths.push(...next.hashMap[hash].paths);
                } else {
                    // 如果哈希不存在，则将其添加到结果中
                    prev.hashMap[hash] = { ...next.hashMap[hash] };
                }
            });
            return prev;
        }, { videoLen: 0, pictureLen: 0, hashMap: {} });
    }

    // 将分组的数据合并
    combineHashData(data) {
        let combinedData = {
            videoLen: 0,
            pictureLen: 0,
            hashMap: {}
        };

        // 遍历每个输入数据
        data.forEach(obj => {
            // 累加视频长度
            combinedData.videoLen += obj.videoLen;
            // 累加图片长度
            combinedData.pictureLen += obj.pictureLen;

            // 合并哈希映射
            for (const key in obj.hashMap) {
                if (obj.hashMap.hasOwnProperty(key)) {
                    if (!combinedData.hashMap[key]) {
                        // 如果在组合数据中找不到相同的键，则创建一个新的键
                        combinedData.hashMap[key] = { ...obj.hashMap[key] };
                    } else {
                        // 如果已经存在相同的键，则累加计数
                        combinedData.hashMap[key].count += obj.hashMap[key].count;
                    }
                }
            }
        });

        return combinedData;
    }

    async serach() {
        const groups = [];
        for (let i = 0; i < this.dirs.length; i += this.length) {
            groups.push(this.dirs.slice(i, i + this.length));
        }
        const results = [];
        // 将任务分开，
        for (let i = 0; i < groups.length; i++) {
            // 等待当前任务完成
            const result = await this.searchInParallel(groups[i]);
            results.push(this.mergeHash(result));
            console.log(`Task ${i + 1}/${groups.length} completed`);
            await delay(100);
        }
        const combineHashData = this.combineHashData(results);
        this.hashMap = combineHashData.hashMap;
        this.videoLen = combineHashData.videoLen;
        this.pictureLen = combineHashData.pictureLen;
    }
    async searchInParallel(group) {
        time.start();

        const chunkSize = Math.ceil(group.length / numCPUs); // 将文件列表分成多个子任务
        const promises = [];

        // 在终端输出进度条
        progressBar.start(group.length);
        // 创建子进程并分发任务
        for (let i = 0; i < numCPUs; i++) {
            const start = i * chunkSize;
            const end = start + chunkSize;
            const filesChunk = group.slice(start, end);

            // 创建子进程
            const childProcess = fork(__dirname + '/search-worker.js');
            promises.push(new Promise((resolve, reject) => {
                childProcess.on('message', (message) => {
                    if (message.childProcessId) {
                        this.forkChildren[message.childProcessId] = message.completed;
                        progressBar.update(calculateTotal(this.forkChildren));

                    } else {
                        resolve(message);
                    }
                });
                childProcess.on('error', (err) => {
                    reject(err);
                });
                childProcess.send({ files: filesChunk, basePath: this.path });
            }));
        }
        // 等待所有子任务完成
        const results = await Promise.all(promises);
        progressBar.stop();
        time.end("扫描完毕");
        return results
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
}

module.exports = Dir