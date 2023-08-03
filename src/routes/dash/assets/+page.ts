import { browser } from "$app/environment";
import { PUBLIC_STL_API } from "$env/static/public";
import { Assets } from "$lib/dataStructures";
import type { PageLoad } from "./$types";
import { parse, parseNumberAndBigInt } from "lossless-json";

export const load = (async ({ fetch }) => {
	let assetError: string | undefined;

	let assetResponse = await fetch(`${PUBLIC_STL_API}/wallet/assets`, {
		credentials: browser ? "include" : undefined
	});

	if (assetResponse.status >= 400) {
		assetError = await assetResponse.text();
	}

	return {
		assetError,
		assets: assetError
			? undefined
			: Assets.safeParse(parse(await assetResponse.text(), undefined, parseNumberAndBigInt))
	};
}) satisfies PageLoad;
