import type { Handle } from "@sveltejs/kit";

export const handle = (async ({ event, resolve }) => {
	// if (event.url.pathname.startsWith("/dashboard")) {
	// 	if (!event.cookies.get("stelo_token")) {
	// 		throw redirect(307, "/");
	// 	}
	// }

	// else if (event.cookies.get("stelo_token")) {
	// 	throw redirect(307, "/dashboard");
	// }

	return await resolve(event);
}) satisfies Handle;
