import { browser } from "$app/environment";
import { PUBLIC_STL_API } from "$env/static/public";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { parse, parseNumberAndBigInt } from "lossless-json";
import { Assets } from "$lib/dataStructures";

export const load = (async ({ fetch, depends }) => {
	let response = await fetch(`${PUBLIC_STL_API}/wallet/assets`, {
		credentials: browser ? "include" : undefined
	});

	if (response.status >= 400) {
		// TODO: handle error
	}

	let assets = Assets.safeParse(parse(await response.text(), undefined, parseNumberAndBigInt));

	if (!assets.success) {
		throw error(500, "Unable to parse server response");
	}

	depends("/dash/transact:page");

	return {
		assets: assets.data
	};
}) satisfies PageLoad;
