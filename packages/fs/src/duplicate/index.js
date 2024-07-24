const emoji = require('node-emoji');
const { log, prompt } = require("@ns-cli/utils");

const Dir = require("./dir");
// const Dir = require("./single-dir");

const init = async (options) => {
    const dir = new Dir({
        ...options,
        path: process.cwd(),
        ignore: ["dedup/**"],
        newDir: 'dedup'
    })
    await dir.prepare();
    await dir.serach();
    await dir.filterDuplicate();
    if (!(dir.dlVideoLen + dir.dlPictureLen)) {
        return log.success(emoji.get('tada'), emoji.get('tada'), emoji.get('tada'), "未发现重复的文件")
    }
    if (options.move) {
        const isMove = await prompt({
            type: "confirm",
            message: `将所有副本移动到${dir.newDir}？`,
            default: false
        })
        if (isMove) {
            await dir.moveDuplicate();
            if (options.delete) {
                const isDelete = await prompt({
                    type: "confirm",
                    message: `删除${dir.newDir}下的所有副本？`,
                    default: false
                })
                if (isDelete) {
                    await dir.deleteDuplicate();
                }
            }
        }
    }
    log.success(emoji.get('tada'), "流程结束")
}
module.exports = init;