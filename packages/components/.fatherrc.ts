import { defineConfig } from "father";

export default defineConfig({
  esm: {
    input: "src", // 默认编译目录
    platform: "browser", // 默认构建为 Browser 环境的产物
    transformer: "babel", // 默认使用 babel 以提供更好的兼容性
  },
});
