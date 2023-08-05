import { browser } from "$app/environment";
import { PUBLIC_STL_API } from "$env/static/public";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { Wallets } from "$lib/dataStructures";
import { parse, parseNumberAndBigInt } from "lossless-json";

export const load = (async ({ fetch, depends }) => {
	let response = await fetch(PUBLIC_STL_API + "/user/wallets", {
		credentials: browser ? "include" : undefined
	});

	if (response.status >= 400) {
		throw error(response.status);
	}

	let wallets = Wallets.safeParse(parse(await response.text(), undefined, parseNumberAndBigInt));

	if (!wallets.success) {
		throw error(500, "Unable to parse server response");
	}

	depends("/dash/wallets:page");

	return {
		wallets: wallets.data
	};
}) satisfies PageLoad;
