<script lang="ts">
	let error = "";
	let username = "";
	let password = "";

	let success = false;

	async function register() {
		let response = await fetch("https://api.stelo.finance/users", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				username: username,
				password: password
			})
		});

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

<button class="bg-gray-300 rounded-sm py-1 px-4 underline" on:click={register}>Submit</button>

<a href="/login" class="underline">Go to Login</a>

{#if error}
	<p class="text-red-500">Error: {error}</p>
{:else if success}
	<p>Success! You have been registered</p>
	<a href="/login">Login</a>
{/if}
