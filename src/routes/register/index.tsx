import { component$ } from "@builder.io/qwik";
import {
	Form,
	Link,
	type RequestHandler,
	routeAction$,
} from "@builder.io/qwik-city";

import pool from "~/lib/pool";
import generateJWT from "~/lib/generateJWT";

import "../../shared/css/auth-page.css";

export const onGet: RequestHandler = async ({}) => {
	// TODO: check if both AT and RT exist
	// TODO: check both AT and RT => error => remove and stay
	// TODO: success => redirect to "/"

	// const refreshToken = cookie.get("refreshToken")?.value;

	// if (refreshToken) {
	// 	cookie.set("accessToken", "testAT", { httpOnly: true, path: "/" });

	// 	throw redirect(302, new URL("/", url).toString());
	// }

	console.log("REGISTER MIDDLEWARE");
};

export const userRegisterUser = routeAction$(
	async (data, { cookie, fail, redirect }) => {
		const dataKeys = Object.keys(data);

		if (dataKeys.length !== 5) {
			return fail(401, {
				error: {
					general: "Unauthorized",
				},
			});
		}

		for (let i = 0; i < dataKeys.length; i++) {
			const key = dataKeys[0];
			const value = data[key];

			if (typeof value !== "string" || value.length === 0) {
				return fail(401, {
					error: {
						general: "Unauthorized",
					},
				});
			}

			// TODO: should do more checkup like if email is really an email stuff like that
		}

		const { rows: checkUsername } = await pool.query(
			`
			SELECT
			id,
			first_name AS firstName,
			last_name AS lastName,
			username,
			email,
			avatar_url
			FROM users
			WHERE username=$1;
			`,
			[data.username]
		);
		const { rows: checkEmail } = await pool.query(
			`
			SELECT
			id,
			first_name AS firstName,
			last_name AS lastName,
			username,
			email,
			avatar_url
			FROM users
			WHERE username=$1;
			`,
			[data.email]
		);

		if (checkEmail.length > 0) {
			return fail(409, {
				error: { email: "Plase use a different email" },
			});
		}
		if (checkUsername.length > 0) {
			return fail(409, {
				error: { username: "Plase use a different username" },
			});
		}

		const { rows } = await pool.query(
			`
			INSERT INTO users
			(first_name, last_name, username, email, password)
			VALUES
			($1, $2, $3, $4, $5)
			RETURNING
			id,
			first_name AS firstName,
			last_name AS lastName,
			username,
			email,
			avatar_url;
			`,
			[data.firstName, data.lastName, data.username, data.email, data.password]
		);

		const newUser = rows[0];

		const accessToken = await generateJWT("accessToken", newUser);
		const refreshToken = await generateJWT("accessToken", { id: newUser.id });

		cookie.set("accessToken", accessToken, { httpOnly: true, path: "/" });
		cookie.set("refreshToken", refreshToken, { httpOnly: true, path: "/" });

		redirect(302, "/");
	}
);

export default component$(() => {
	const action = userRegisterUser();

	return (
		<div class="auth-page">
			<Form action={action} class="auth-form">
				<h1>Register</h1>

				<fieldset class="auth-fieldset">
					<div class="auth-input">
						<label class="visually-hidden" for="firstName">
							First Name
						</label>
						<input
							type="text"
							id="firstName"
							name="firstName"
							placeholder="First Name"
							required
						/>
					</div>

					<div class="auth-input">
						<label class="visually-hidden" for="lastName">
							Last Name
						</label>
						<input
							type="text"
							id="lastName"
							name="lastName"
							placeholder="Last Name"
							required
						/>
					</div>

					<div class="auth-input">
						<label class="visually-hidden" for="username">
							Username
						</label>
						<input
							type="text"
							id="username"
							name="username"
							placeholder="Username"
							required
						/>
					</div>

					<div class="auth-input">
						<label class="visually-hidden" for="email">
							Email
						</label>
						<input
							type="email"
							id="email"
							name="email"
							placeholder="Email"
							required
						/>
					</div>

					<div class="auth-input">
						<label class="visually-hidden" for="password">
							Password
						</label>
						<input
							type="password"
							id="password"
							name="password"
							placeholder="Password"
							required
						/>
					</div>
				</fieldset>

				<button class="auth-button">Register</button>

				<Link href="/login" class="auth-link">
					Already have an account? <span>Login</span>
				</Link>
			</Form>
		</div>
	);
});
