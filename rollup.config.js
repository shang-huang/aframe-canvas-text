import minify from "rollup-plugin-babel-minify";

export default {
  input: "components/canvas-text.js",
  plugins: [minify({ comments: false })],
  output: {
    file: "dist/canvas-text.min.js",
    format: 'iife'
  }
};