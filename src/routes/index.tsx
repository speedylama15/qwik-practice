import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import * as jose from "jose";

import { secret } from "~/lib/generateJWT";

export const head: DocumentHead = {
	title: "Welcome to Qwik",
	meta: [
		{
			name: "description",
			content: "Qwik site description",
		},
	],
};

// TODO: decode the accessToken
export const useCurrentUser = routeLoader$(async ({ cookie }) => {
	let user;
	const accessToken = cookie.get("accessToken")?.value;

	if (!accessToken) return null;

	try {
		const { payload } = await jose.jwtVerify(accessToken, secret);
		user = payload;
	} catch (error) {
		user = null;
	}

	return user;
});

export default component$(() => {
	const user = useCurrentUser();

	return <div>{user.value ? <h1>HOME IN</h1> : <h1>HOME OUT</h1>}</div>;
});
