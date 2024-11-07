import { sa } from "./sa.js";

const print = () => {
  console.log("this is print.");
  sa();
};

console.log("this is @ns-widget/sa");

export { print, sa };
