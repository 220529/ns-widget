// rollup.config.js
import pkg from "../package.json";

const file = (type) => `dist/${pkg.name}.${type}.js`;

export default {
  input: "lib/index.js",
  output: [
    {
      file: file("esm"),
      format: "es",
    },
    {
      name: "sa",
      file: file("umd"),
      format: "umd",
    },
  ],
  plugins: [],
};
