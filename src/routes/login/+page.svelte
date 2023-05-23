<script lang="ts">
	import { goto } from "$app/navigation";

	let error = "";
	let username = "";
	let password = "";

	let success = false;

	async function login() {
		let response = await fetch(`https://api.stelo.finance/users/${username}/sessions`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				password: password
			})
		});

		if (response.status >= 400) {
			error = await response.text();
		} else {
			success = true;
			//goto("/dashboard");
		}
	}
</script>

<h1 class="text-2xl">Login</h1>

<input type="text" placeholder="username..." bind:value={username} />
<input type="password" placeholder="password..." bind:value={password} />

<button class="bg-gray-300 rounded-sm py-1 px-4 underline" on:click={login}>Login</button>

{#if error}
	<p class="text-red-500">Error: {error}</p>
{:else if success}
	<p>Success! You have been logged in, redirecting now...</p>
{/if}
