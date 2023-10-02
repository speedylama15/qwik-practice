import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

import "./Navbar.css";

export default component$(() => {
	const user = null;

	return (
		<nav class="navbar">
			<Link class="navbar_logo" href="/">
				QWIK-PRACTICE
			</Link>

			{user ? <button>Upload</button> : <Link href="/login">Login</Link>}
		</nav>
	);
});
