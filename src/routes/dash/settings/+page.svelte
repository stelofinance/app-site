<script lang="ts">
	import { PUBLIC_STL_API } from "$env/static/public";
	import type { PageData } from "./$types";

	export let data: PageData;

	let username = data.sessionInfo.username;
	let usernameErrorMessage: string | undefined;
	let usernameMessage: string | undefined;

	async function updateUsername() {
		usernameErrorMessage = undefined;
		usernameMessage = undefined;

		let response = await fetch(PUBLIC_STL_API + "/user/username", {
			method: "put",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				username
			})
		});

		if (response.status != 200) {
			usernameErrorMessage = await response.text();
		} else {
			usernameMessage = "Username updated";
		}
	}
</script>

<div class="flex flex-col px-3 pt-3">
	<h1 class="font-medium text-3xl ml-2">Settings</h1>

	<div class="flex mt-2 gap-4 w-full">
		<input
			type="text"
			bind:value={username}
			placeholder="Username..."
			class="bg-black bg-opacity-50 w-full px-2 rounded-lg"
		/>

		<button
			class="text-sm font-bold rounded-lg py-2 px-4 bg-black bg-opacity-50"
			on:click={updateUsername}>UPDATE</button
		>
	</div>
	{#if usernameErrorMessage}
		<p class="text-red-600">{usernameErrorMessage}</p>
	{:else if usernameMessage}
		<p>{usernameMessage}</p>
	{/if}
</div>
