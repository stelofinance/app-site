import { PUBLIC_STL_API } from "$env/static/public";
import { redirect, type Handle, type HandleFetch } from "@sveltejs/kit";

export const handle = (async ({ event, resolve }) => {
	// Auth redirects
	if (event.url.pathname.startsWith("/dashboard")) {
		if (!event.cookies.get("stelo_token")) {
			throw redirect(307, "/");
		}
	} else if (event.cookies.get("stelo_token")) {
		throw redirect(307, "/dashboard");
	}

	return await resolve(event);
}) satisfies Handle;

export const handleFetch = (async ({ event, request, fetch }) => {
	// Duplicate cookies to the API
	if (request.url.startsWith(PUBLIC_STL_API)) {
		let cookies = event.request.headers.get("cookie");
		if (cookies) {
			request.headers.set("cookie", cookies);
		}
	}

	return fetch(request);
}) satisfies HandleFetch;
