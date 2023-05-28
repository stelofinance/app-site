import { browser } from "$app/environment";
import { PUBLIC_STL_API } from "$env/static/public";
import type { LayoutLoad } from "./$types";

export const load = (async ({ fetch }) => {
	// let response = await fetch(`${PUBLIC_STL_API}/user/session`, {
	// 	credentials: browser ? "include" : undefined
	// });
	return {};
}) satisfies LayoutLoad;
