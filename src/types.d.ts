import { ScramjetController } from "./controller/index";
import {
	rewriteBlob,
	rewriteUrl,
	unrewriteBlob,
	unrewriteUrl,
} from "./shared/rewriters/url";
import { rewriteCss, unrewriteCss } from "./shared/rewriters/css";
import {
	htmlRules,
	rewriteHtml,
	rewriteSrcset,
	unrewriteHtml,
} from "./shared/rewriters/html";
import { rewriteJs } from "./shared/rewriters/js";
import { rewriteHeaders } from "./shared/rewriters/headers";
import { rewriteWorkers } from "./shared/rewriters/worker";
import type { Codec } from "./codecs";
import { BareClient, BareMuxConnection } from "@mercuryworkshop/bare-mux";
import { parseDomain } from "parse-domain";
import { ScramjetHeaders } from "./shared/headers";
import { CookieStore } from "./shared/cookie";
import { SCRAMJETCLIENT, SCRAMJETFRAME } from "./symbols";
import { ScramjetClient } from "./client/client";
import { ScramjetFrame } from "./controller/frame";

type ScramjetFlags = {
	serviceworkers: boolean;
	naiiveRewriter: boolean;
	captureErrors: boolean;
	cleanerrors: boolean;
	scramitize: boolean;
	sourcemaps: boolean;
	syncxhr: boolean;
};

interface ScramjetConfig {
	prefix: string;
	globals: {
		wrapfn: string;
		trysetfn: string;
		importfn: string;
		rewritefn: string;
		metafn: string;
		setrealmfn: string;
		pushsourcemapfn: string;
	};
	files: {
		wasm: string;
		shared: string;
		worker: string;
		client: string;
		sync: string;
	};
	flags: ScramjetFlags;
	siteflags: Record<string, ScramjetFlags>;
	codec: {
		encode: string;
		decode: string;
	};
}

declare global {
	interface Window {
		$scramjet: {
			shared: {
				url: {
					rewriteUrl: typeof rewriteUrl;
					unrewriteUrl: typeof unrewriteUrl;
					rewriteBlob: typeof rewriteBlob;
					unrewriteBlob: typeof unrewriteBlob;
				};
				rewrite: {
					rewriteCss: typeof rewriteCss;
					unrewriteCss: typeof unrewriteCss;
					rewriteHtml: typeof rewriteHtml;
					unrewriteHtml: typeof unrewriteHtml;
					rewriteSrcset: typeof rewriteSrcset;
					rewriteJs: typeof rewriteJs;
					rewriteHeaders: typeof rewriteHeaders;
					rewriteWorkers: typeof rewriteWorkers;
					htmlRules: typeof htmlRules;
				};
				util: {
					BareClient: typeof BareClient;
					BareMuxConnection: typeof BareMuxConnection;
					ScramjetHeaders: typeof ScramjetHeaders;
					parseDomain: typeof parseDomain;
				};
				CookieStore: typeof CookieStore;
			};
			config: ScramjetConfig;
			codec: {
				encode: (url: string) => string;
				decode: (url: string) => string;
			};
		};
		COOKIE: string;
		WASM: string;
		ScramjetController: typeof ScramjetController;

		// the scramjet client belonging to a window
		[SCRAMJETCLIENT]: ScramjetClient;
	}

	interface HTMLDocument {
		// should be the same as window
		[SCRAMJETCLIENT]: ScramjetClient;
	}

	interface HTMLIFrameElement {
		// the event target belonging to an <iframe> holding a /prefix/blah url
		[SCRAMJETFRAME]: ScramjetFrame;
	}
}
