import { browser } from "$app/environment";
import { PUBLIC_STL_API } from "$env/static/public";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { WalletAssignedUsers, WalletSessions } from "$lib/dataStructures";
import { parse, parseNumberAndBigInt } from "lossless-json";

export const load = (async ({ fetch, depends }) => {
	let [assignedUsersResponse, sessionsResponse] = await Promise.all([
		fetch(PUBLIC_STL_API + "/wallet/users", {
			credentials: browser ? "include" : undefined
		}),
		fetch(PUBLIC_STL_API + "/wallet/sessions", {
			credentials: browser ? "include" : undefined
		})
	]);

	if (assignedUsersResponse.status >= 400) {
		throw error(assignedUsersResponse.status);
	}
	if (sessionsResponse.status >= 400) {
		throw error(sessionsResponse.status);
	}

	let assignedUsers = WalletAssignedUsers.safeParse(
		parse(await assignedUsersResponse.text(), undefined, parseNumberAndBigInt)
	);
	let sessions = WalletSessions.safeParse(
		parse(await sessionsResponse.text(), undefined, parseNumberAndBigInt)
	);

	if (!assignedUsers.success || !sessions.success) {
		throw error(500, "Unable to parse server response");
	}

	depends("/dash/wallet:page");

	return {
		assignedUsers: assignedUsers.data,
		sessions: sessions.data
	};
}) satisfies PageLoad;
