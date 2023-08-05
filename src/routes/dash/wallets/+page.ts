import { browser } from "$app/environment";
import { PUBLIC_STL_API } from "$env/static/public";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { Wallets } from "$lib/dataStructures";
import { parse, parseNumberAndBigInt } from "lossless-json";

export const load = (async ({ fetch, depends }) => {
	let [walletsResponse, assignedWalletsResponse] = await Promise.all([
		fetch(PUBLIC_STL_API + "/user/wallets", {
			credentials: browser ? "include" : undefined
		}),
		fetch(PUBLIC_STL_API + "/user/assigned_wallets", {
			credentials: browser ? "include" : undefined
		})
	]);

	if (walletsResponse.status >= 400) {
		throw error(walletsResponse.status);
	}
	if (assignedWalletsResponse.status >= 400) {
		throw error(assignedWalletsResponse.status);
	}

	let wallets = Wallets.safeParse(
		parse(await walletsResponse.text(), undefined, parseNumberAndBigInt)
	);
	let assignedWallets = Wallets.safeParse(
		parse(await assignedWalletsResponse.text(), undefined, parseNumberAndBigInt)
	);

	if (!wallets.success || !assignedWallets.success) {
		throw error(500, "Unable to parse server response");
	}

	depends("/dash/wallets:page");

	return {
		wallets: wallets.data,
		assignedWallets: assignedWallets.data
	};
}) satisfies PageLoad;
