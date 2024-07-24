#!/usr/bin/env node

/**
 * 文件扫描与统计脚本
 *
 * 功能：
 * 1. 递归遍历指定目录及其子目录，统计所有文件类型的数量。
 * 2. 以 Markdown 表格的形式输出每个目录的文件类型统计。
 * 3. 在所有目录的统计结果中输出总计。
 *
 * 使用方法：
 * 1. 直接运行脚本时，它将从当前工作目录开始扫描。
 * 2. 也可以将此脚本作为模块导入到其他 Node.js 脚本中使用。
 */

const fs = require("fs");
const path = require("path");

/**
 * 递归统计目录中的文件类型数量
 *
 * @param {string} dir - 需要统计的目录路径
 * @returns {Object} - 文件类型统计结果
 */
const countFileTypes = (dir) => {
  const fileCounts = {};
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (file.startsWith(".")) {
      return; // 忽略以 . 开头的文件
    }

    if (stats.isDirectory()) {
      fileCounts[file] = countFileTypes(fullPath); // 递归统计子文件夹
    } else {
      const ext = path.extname(file) || "no extension";
      if (!fileCounts[ext]) {
        fileCounts[ext] = 0;
      }
      fileCounts[ext]++;
    }
  });

  return fileCounts;
};

/**
 * 合并文件类型统计结果
 *
 * @param {Object} counts - 文件类型统计结果
 * @returns {Object} - 合并后的文件类型统计结果
 */
const mergeFileCounts = (counts) => {
  const mergedCounts = {};

  Object.keys(counts).forEach((key) => {
    if (typeof counts[key] === "object") {
      const subCounts = mergeFileCounts(counts[key]);
      Object.keys(subCounts).forEach((subKey) => {
        if (!mergedCounts[subKey]) {
          mergedCounts[subKey] = 0;
        }
        mergedCounts[subKey] += subCounts[subKey];
      });
    } else {
      if (!mergedCounts[key]) {
        mergedCounts[key] = 0;
      }
      mergedCounts[key] += counts[key];
    }
  });

  return mergedCounts;
};

/**
 * 对齐字符串
 *
 * @param {string} str - 需要对齐的字符串
 * @param {number} length - 对齐后的总长度
 * @returns {string} - 对齐后的字符串
 */
const padString = (str, length) => {
  return str.padEnd(length, " ");
};

/**
 * 打印目录中文件类型的 Markdown 表格
 *
 * @param {string} dir - 当前目录路径
 * @param {Object} fileCounts - 文件类型统计结果
 * @param {number} indent - 缩进量，用于格式化输出
 */
const printMarkdownTable = (dir, fileCounts, indent = 0) => {
  const folderName = path.basename(dir); // 获取文件夹的名称
  const headers = ["文件类型", "数量"];
  const rows = Object.keys(fileCounts)
    .filter((key) => typeof fileCounts[key] === "number")
    .map((key) => [key, String(fileCounts[key])]);

  const colWidths = headers.map((header, index) => {
    return Math.max(header.length, ...rows.map((row) => row[index].length));
  });

  const formatRow = (row) => {
    return (
      "| " +
      row.map((cell, index) => padString(cell, colWidths[index])).join(" | ") +
      " |"
    );
  };

  const separator =
    "|-" + colWidths.map((width) => "-".repeat(width)).join("-|-") + "-|";

  const indentStr = " ".repeat(indent);

  if (rows.length > 0) {
    console.log(`\n${indentStr}文件夹: ${folderName}`);
    console.log(indentStr + formatRow(headers));
    console.log(indentStr + separator);
    rows.forEach((row) => console.log(indentStr + formatRow(row)));
  }

  // 递归打印子文件夹的文件类型统计
  Object.keys(fileCounts)
    .filter((key) => typeof fileCounts[key] === "object")
    .forEach((key) => {
      printMarkdownTable(path.join(dir, key), fileCounts[key], indent + 2);
    });
};

/**
 * 打印所有文件夹的文件类型总计
 *
 * @param {Object} fileCounts - 文件类型统计结果
 */
const printFinalSummary = (fileCounts) => {
  const mergedCounts = mergeFileCounts(fileCounts);
  const mergedRows = Object.keys(mergedCounts).map((key) => [
    key,
    String(mergedCounts[key]),
  ]);

  console.log("\n总计:");
  mergedRows.forEach((row) => console.log(`${row[0]}: ${row[1]}`));

  const mergedTotal = mergedRows.reduce(
    (sum, row) => sum + parseInt(row[1]),
    0
  );
  console.log(`总计: ${mergedTotal}`);
};

// 主函数，执行统计和打印
module.exports = () => {
  const currentDir = process.cwd();
  const fileCounts = countFileTypes(currentDir);
  printMarkdownTable(currentDir, fileCounts);
  printFinalSummary(fileCounts);
};
