import { defineConfig } from "father";
import path from "path";

export default defineConfig({
  esm: {
    input: "src", // 默认编译目录
    platform: "browser", // 默认构建为 Browser 环境的产物
    transformer: "babel", // 默认使用 babel 以提供更好的兼容性
  },
  // umd: {
  //   entry: "src", // 默认构建入口文件
  // },
  // lessInBabelMode: true, // 启用 less 支持
  extraBabelPresets: [],
  extraBabelPlugins: [path.resolve(__dirname, "babel-plugin-less-to-css.js")],
});
