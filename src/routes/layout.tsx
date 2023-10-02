import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$, useLocation } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";
import * as jose from "jose";

import Navbar from "~/components/Navbar/Navbar";
import { secret } from "~/lib/generateJWT";

// export const onGet: RequestHandler = async ({ cacheControl }) => {
// 	// Control caching for this request for best performance and to reduce hosting costs:
// 	// https://qwik.builder.io/docs/caching/
// 	cacheControl({
// 		// Always serve a cached response by default, up to a week stale
// 		staleWhileRevalidate: 60 * 60 * 24 * 7,
// 		// Max once every 5 seconds, revalidate on the server to get a fresh version of this page
// 		maxAge: 5,
// 	});
// };

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
	const location = useLocation();
	const user = useCurrentUser();

	console.log(user.value);

	return (
		<>
			{/* {location.url.pathname === "/register/" ||
			location.url.pathname === "/login/" ? null : (
				<Navbar />
			)} */}

			<Navbar />

			{user?.value ? <h1>LAYOUT In</h1> : <h1>LAYOUT OUT</h1>}

			<Slot />
		</>
	);
});
