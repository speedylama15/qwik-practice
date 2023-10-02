import { component$ } from "@builder.io/qwik";
import { Link, RequestHandler } from "@builder.io/qwik-city";

import "../../shared/css/auth-page.css";

export const onGet: RequestHandler = async ({ url, redirect }) => {
	// throw redirect(302, new URL("/", url).toString());
	console.log("LOGIN MIDDLEWARE");
};

export default component$(() => {
	return (
		<div class="auth-page">
			<form class="auth-form">
				<h1>Login</h1>

				<fieldset class="auth-fieldset">
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

				<button class="auth-button">Login</button>

				<Link href="/register" class="auth-link">
					Don't have an account? <span>Register</span>
				</Link>
			</form>
		</div>
	);
});
