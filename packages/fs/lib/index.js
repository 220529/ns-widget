#! /usr/bin/env node

const { Command } = require("commander");
const program = new Command();

const list = require("../src/list");
const duplicate = require("../src/duplicate");

const registerCommand = () => {
  program
    .name("fs-文件")
    .description("CLI to some JavaScript string utilities")
    .version("1.0.0");

  program
    .command("ls")
    .description("统计，各个文件夹下，资源的类型和数量")
    .action(list);

  program
    .command("dl")
    .description("检查，是否有重复的文件")
    .option("-m --move", "是否将副本筛选出来", false)
    .option("-d --delete", "是否清空副本文件夹", false)
    .option("-l --length <value>", "文件较多时，子进程检索多少个文件，可忽略")
    .action((options) => duplicate(options));

  program.parse(process.argv);

  if (!program.args?.length) {
    program.outputHelp();
  }
};

function core() {
  registerCommand();
}

core();

module.exports = core;
