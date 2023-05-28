<script lang="ts">
	import { PUBLIC_STL_API } from "$env/static/public";

	let error = "";
	let username = "";
	let password = "";

	let success = false;

	async function register() {
		error = "";
		success = false;
		let response = await fetch(`${PUBLIC_STL_API}/users`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				username: username,
				password: password
			})
		});

		password = "";

		if (response.status >= 400) {
			error = await response.text();
		} else {
			success = true;
		}
	}
</script>

<h1 class="text-2xl">Register</h1>

<input type="text" placeholder="username..." bind:value={username} />
<input type="password" placeholder="password..." bind:value={password} />

<button class="bg-gray-300 rounded-sm py-1 px-4 underline" on:click={register}>Register</button>

<br />
<a href="/login" class="underline">Go to Login</a>

{#if success}
	<p>Success! You have been registered</p>
	<a href="/login" class="underline">Login</a>
{:else if error}
	<p class="text-red-500">Error: {error}</p>
{/if}
