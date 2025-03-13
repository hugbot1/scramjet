import { ScramjetClient } from "../client";
import { config, rewriteJs } from "../../shared";

export default function (client: ScramjetClient, self: Self) {
	// used for proxying *direct eval*
	// eval("...") -> eval($scramjet$rewrite("..."))
	Object.defineProperty(self, config.globals.rewritefn, {
		value: function (js: any) {
			if (typeof js !== "string") return js;

			const rewritten = rewriteJs(js, "(direct eval proxy)", client.meta);

			return rewritten;
		},
		writable: false,
		configurable: false,
	});
}

export function indirectEval(this: ScramjetClient, strict: boolean, js: any) {
	// > If the argument of eval() is not a string, eval() returns the argument unchanged
	if (typeof js !== "string") return js;

	let indirection: Function;
	if (strict) {
		console.log("STRICT");
		indirection = new Function(`
			"use strict";
			return eval;
		`);
	} else {
		indirection = this.global.eval;
	}

	return indirection(
		rewriteJs(js, "(indirect eval proxy)", this.meta) as string
	);
}
