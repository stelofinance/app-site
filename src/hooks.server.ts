import { redirect, type Handle } from "@sveltejs/kit";

export const handle = (async ({ event, resolve }) => {
	console.log("yayayay");
	if (event.url.pathname.startsWith("/dashboard")) {
		if (!event.cookies.get("stelo_token")) {
			throw redirect(307, "/");
		}
	} else if (event.cookies.get("stelo_token")) {
		throw redirect(307, "/dashboard");
	}

	return await resolve(event);
}) satisfies Handle;
