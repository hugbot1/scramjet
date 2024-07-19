import typescript from "rollup-plugin-typescript2";
import { join } from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

import { nodeResolve } from "@rollup/plugin-node-resolve";

// check if its
const production = !process.env.ROLLUP_WATCH;
console.log(production);
fs.rmSync(join(fileURLToPath(new URL(".", import.meta.url)), "./dist"), {
	recursive: true,
	force: true,
});

const commonPlugins = () => [
	typescript({
		tsconfig: "tsconfig.json",
	}),
	nodeResolve(),
];

export default {
	plugins: commonPlugins(),
	input: {
		client: "./src/client/index.ts",
		worker: "./src/worker/index.ts",
		config: "./src/scramjet.config.ts",
	},
	output: {
		entryFileNames: "scramjet.[name].js",
		dir: "./dist",
		format: "system",
		bundle: true,
		minify: production,
		sourcemap: true,
		treeshake: "recommended",
	},
};
