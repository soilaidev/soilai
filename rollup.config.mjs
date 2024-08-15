import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/dom/bundle.ts",
  output: { file: "dist/bundle.js", format: "cjs", sourcemap: true },
  plugins: [typescript({ tsconfig: "./tsconfig.bundle.json" }), terser()],
};
