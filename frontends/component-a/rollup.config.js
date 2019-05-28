import babel from "rollup-plugin-babel";
import nodeResolve from "rollup-plugin-node-resolve";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "iife",
    name: "index",
    sourcemap: true,
    chunkFileNames: "[name]-[hash].js"
  },
  plugins: [
    nodeResolve({
      jsnext: true
    }),
    babel({
      exclude: "node_modules/**",
      extensions: [".ts", ".js"]
    })
  ]
};
