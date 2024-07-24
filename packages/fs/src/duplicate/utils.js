const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function progressBar(progress, total) {
    const width = 50;
    const percent = ((progress / total) * 100).toFixed(2);
    const completed = Math.round(width * progress / total);
    const remaining = width - completed;
    const bar = '[' + '='.repeat(completed) + '>'.repeat(remaining) + ']';
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`任务进度: ${bar} ${percent}%`);
}

function printSeparator(length) {
    process.stdout.write(`\n` + '='.repeat(length) + '\n');
}


// 获取文件类型
function getType(filePath) {
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

function getHash(filePath, size = 2) {
    const blockSize = 1024 * 1024 * 1 * size; // 2MB

    // 打开文件并获取文件描述符
    const fd = fs.openSync(filePath, 'r');

    try {
        // 获取文件的总大小和中间位置
        const fileSize = fs.statSync(filePath).size;
        const middleStart = Math.floor(Math.max(fileSize / 2 - blockSize / 2, 0)); // 使用 Math.floor() 进行向下取整

        // 读取文件头部 1MB 的内容
        const headBuffer = Buffer.alloc(blockSize);
        const bytesReadHead = fs.readSync(fd, headBuffer, 0, blockSize, 0);

        // 读取文件中间 1MB 的内容
        const middleBuffer = Buffer.alloc(blockSize);
        const bytesReadMiddle = fs.readSync(fd, middleBuffer, 0, blockSize, middleStart);

        // 读取文件尾部 1MB 的内容
        const tailBuffer = Buffer.alloc(blockSize);
        const bytesReadTail = fs.readSync(fd, tailBuffer, 0, blockSize, fileSize - blockSize);

        // 计算头部、中间和尾部的哈希值
        const headHash = crypto.createHash('md5').update(headBuffer.slice(0, bytesReadHead)).digest('hex');
        const middleHash = crypto.createHash('md5').update(middleBuffer.slice(0, bytesReadMiddle)).digest('hex');
        const tailHash = crypto.createHash('md5').update(tailBuffer.slice(0, bytesReadTail)).digest('hex');

        // 将三个哈希值拼接在一起
        const combinedHash = headHash + middleHash + tailHash;
        // 使用原始哈希算法计算新的哈希值
        return crypto.createHash('md5').update(combinedHash).digest('hex');
    } finally {
        // 关闭文件描述符
        fs.closeSync(fd);
    }
}

function calculateTotal(obj) {
    let total = 0;
    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            total += obj[key];
        }
    }
    return total;
}

const delay = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}


module.exports = {
    delay,
    getType,
    getHash,
    progressBar,
    printSeparator,
    calculateTotal
}