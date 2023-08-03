import { browser } from "$app/environment";
import { PUBLIC_STL_API } from "$env/static/public";
import { error } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";
import { parse, parseNumberAndBigInt } from "lossless-json";
import { SessionInfo } from "$lib/dataStructures";

export const load = (async ({ fetch }) => {
	let response = await fetch(`${PUBLIC_STL_API}/user/session`, {
		credentials: browser ? "include" : undefined
	});

	if (response.status >= 400) {
		throw error(response.status);
	}

	let sessionInfo = SessionInfo.safeParse(
		parse(await response.text(), undefined, parseNumberAndBigInt)
	);

	if (!sessionInfo.success) {
		throw error(500, "Unable to parse server response");
	}

	return {
		sessionInfo: sessionInfo.data
	};
}) satisfies LayoutLoad;
