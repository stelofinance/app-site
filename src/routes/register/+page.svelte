<script lang="ts">
	import { goto } from "$app/navigation";
	import { PUBLIC_STL_API } from "$env/static/public";
	import SteloFullMono from "$lib/components/logos/SteloFullMono.svelte";

	let error = "";
	let username: string;
	let password: string;

	async function register() {
		error = "";
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

		if (response.status >= 400) {
			error = await response.text();
		} else {
			let response = await fetch(`${PUBLIC_STL_API}/users/${username}/sessions`, {
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
				goto("/login");
			} else {
				goto("/dash/assets");
			}
		}

		password = "";
	}
</script>

<svelte:head>
	<title>Register | Stelo Finance</title>
</svelte:head>

<div class="h-screen max-h-screen flex flex-col justify-center items-center">
	<SteloFullMono className="text-white h-20 w-auto" />

	<input
		type="text"
		placeholder="Username..."
		bind:value={username}
		required
		class="mt-20 bg-transparent pb-1 border-b border-neutral-400 w-60 pl-1"
	/>
	<input
		type="password"
		placeholder="Password..."
		bind:value={password}
		required
		class="mt-7 bg-transparent pb-1 border-b border-neutral-400 w-60 pl-1"
	/>
	{#if error}
		<p class="mt-2 text-red-500 text-xs w-60">{error}</p>
	{/if}

	<button
		on:click={register}
		class="mt-8 text-xl font-bold bg-white text-black py-1.5 rounded-md px-8 w-52 text-center"
		>REGISTER</button
	>

	<div class="flex gap-2 mt-6">
		<p class="text-neutral-400">Already registered?</p>
		<a href="/login" class="underline">Login</a>
	</div>
</div>
