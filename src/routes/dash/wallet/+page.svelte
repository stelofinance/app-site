<script lang="ts">
	import { goto, invalidate } from "$app/navigation";
	import { PUBLIC_STL_API } from "$env/static/public";
	import SimpleArrow from "$lib/components/icons/SimpleArrow.svelte";
	import { stringify } from "lossless-json";
	import type { PageData } from "./$types";

	export let data: PageData;

	let transferToggled = false;

	async function unassignUser(userId: bigint) {
		let response = await fetch(PUBLIC_STL_API + "/wallet/users/" + userId.toString(), {
			method: "DELETE",
			credentials: "include"
		});

		if (response.status >= 400) {
			// TODO: handle error
		}

		invalidate("/dash/wallet:page");
	}

	async function transferOwnership(userId: bigint) {
		let response = await fetch(PUBLIC_STL_API + "/wallet/owner", {
			method: "PUT",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			body: stringify({
				user_id: userId
			})
		});

		if (response.status >= 400) {
			// TODO: handle error
		}

		invalidate("/dash:layout");
	}

	let assignUserInput = "";

	async function assignUser() {
		let response = await fetch(PUBLIC_STL_API + "/wallet/users", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				username: assignUserInput
			})
		});

		if (response.status >= 400) {
			// TODO: handle error
		}

		assignUserInput = "";

		invalidate("/dash/wallet:page");
	}

	async function deleteSession(id: bigint) {
		let response = await fetch(PUBLIC_STL_API + "/wallet/sessions/" + id.toString(), {
			method: "DELETE",
			credentials: "include"
		});

		if (response.status >= 400) {
			// TODO: handle error
		}

		invalidate("/dash/wallet:page");
	}

	async function createSession() {
		let response = await fetch(PUBLIC_STL_API + "/wallet/sessions", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				name: sessionInput
			})
		});

		if (response.status >= 400) {
			// TODO: handle error
		}

		sessionInput = "";

		let { token } = (await response.json()) as { token: string };
		sessionToken = token;

		invalidate("/dash/wallet:page");
	}

	let sessionInput = "";
	let sessionToken: string = "";

	async function deleteWallet() {
		let response = await fetch(PUBLIC_STL_API + "/wallet", {
			method: "DELETE",
			credentials: "include"
		});

		if (response.status >= 400) {
			// TODO: handle error
		}

		await invalidate("/dash:layout");
		goto("/dash/wallets");
	}
</script>

<div class="flex flex-col px-3 pt-3">
	<h1 class="font-medium text-3xl ml-2 whitespace-nowrap text-ellipsis overflow-hidden">
		Wallet: {data.sessionInfo.wallet_address}
	</h1>
	<a href="/dash/wallets" class="flex items-center ml-1 mt-1">
		<SimpleArrow className="text-anakiwa h-1.5 w-auto rotate-90" />
		<p class="font-medium text-sm mt-px ml-1 text-anakiwa">back to all</p>
	</a>

	<div class="flex justify-between items-center mt-4 px-2">
		<h2>Assigned users</h2>
		{#if data.sessionInfo.wallet_user_id === data.sessionInfo.user_id && data.sessionInfo.primary_wallet_id !== data.sessionInfo.wallet_id}
			{#if !transferToggled}
				<button on:click={() => (transferToggled = true)} class="text-xs text-anakiwa underline"
					>transfer ownership</button
				>
			{:else}
				<button
					on:click={() => (transferToggled = false)}
					class="text-xs text-neutral-400 underline">cancel</button
				>
			{/if}
		{/if}
	</div>

	<div class="rounded-lg flex flex-col gap-2 bg-black bg-opacity-50 px-3 py-2 mt-1">
		{#if data.assignedUsers.length >= 1}
			{#each data.assignedUsers as assignedUser}
				<div class="flex justify-between">
					<p>{assignedUser.username}</p>
					{#if data.sessionInfo.wallet_user_id === data.sessionInfo.user_id}
						{#if !transferToggled}
							<button on:click={() => unassignUser(assignedUser.id)} class="text-red-500 text-sm"
								>remove</button
							>
						{:else}
							<button
								on:click={() => transferOwnership(assignedUser.id)}
								class="text-anakiwa text-sm">transfer ownership</button
							>
						{/if}
					{/if}
				</div>
			{/each}
		{:else}
			<p class="text-sm">No assigned users</p>
		{/if}
	</div>

	{#if data.sessionInfo.wallet_user_id === data.sessionInfo.user_id}
		<div class="flex mt-2 gap-4 w-full">
			<input
				type="text"
				bind:value={assignUserInput}
				placeholder="Username..."
				class="bg-black bg-opacity-50 w-full px-2 rounded-lg"
			/>

			<button
				class="text-sm font-bold rounded-lg py-2 px-4 bg-black bg-opacity-50"
				on:click={assignUser}>ASSIGN</button
			>
		</div>
	{/if}

	<h2 class="mt-4 ml-2">Sessions</h2>

	<div class="rounded-lg flex flex-col gap-2 bg-black bg-opacity-50 px-3 py-2 mt-1">
		{#if data.sessions.length >= 1}
			{#each data.sessions as session}
				<div class="flex justify-between">
					<p>{session.name}</p>
					<button on:click={() => deleteSession(session.id)} class="text-red-500 text-sm"
						>delete</button
					>
				</div>
			{/each}
		{:else}
			<p class="text-sm">No sessions</p>
		{/if}
	</div>

	{#if data.sessionInfo.wallet_user_id === data.sessionInfo.user_id}
		<div class="flex mt-2 gap-4 w-full">
			<input
				type="text"
				bind:value={sessionInput}
				placeholder="Label..."
				class="bg-black bg-opacity-50 w-full px-2 rounded-lg"
			/>

			<button
				class="text-sm font-bold rounded-lg py-2 px-4 bg-black bg-opacity-50"
				on:click={createSession}>CREATE</button
			>
		</div>
	{/if}

	{#if sessionToken}
		<p class="text-neutral-400 text-sm ml-2 mt-1.5">{sessionToken}</p>
	{/if}

	{#if data.sessionInfo.wallet_user_id === data.sessionInfo.user_id && data.sessionInfo.primary_wallet_id !== data.sessionInfo.wallet_id}
		<button
			on:click={deleteWallet}
			class="text-sm mx-auto font-bold bg-red-700 py-1.5 mt-8 px-4 rounded-lg">DELETE</button
		>
	{/if}
</div>
