import { browser } from "$app/environment";
import { PUBLIC_STL_API } from "$env/static/public";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { parse, parseNumberAndBigInt } from "lossless-json";
import { Transactions } from "$lib/dataStructures";

export const load = (async ({ fetch }) => {
	let response = await fetch(`${PUBLIC_STL_API}/wallet/transactions`, {
		credentials: browser ? "include" : undefined
	});

	if (response.status >= 400) {
		throw error(response.status);
	}

	let transaction = Transactions.safeParse(
		parse(await response.text(), undefined, parseNumberAndBigInt)
	);

	if (!transaction.success) {
		console.log(transaction.error);
		throw error(500, "Unable to parse server response");
	}

	return {
		transactions: transaction.data
	};
}) satisfies PageLoad;
