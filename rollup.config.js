import { terser } from "rollup-plugin-terser";

export default {
  input: "components/canvas-text.js",
  plugins: [
    terser({
      compress:
        { drop_console: true }
    })],
  output: {
    file: "dist/canvas-text.min.js",
    format: 'iife'
  }
};