<script lang="ts">
	import { PUBLIC_STL_API } from "$env/static/public";
	import Wrench from "$lib/components/icons/Wrench.svelte";
	import { stringify } from "lossless-json";
	import type { PageData } from "./$types";
	import { error } from "@sveltejs/kit";
	import { invalidate } from "$app/navigation";
	import { slide } from "svelte/transition";

	export let data: PageData;

	async function setActiveWallet(id: bigint) {
		let response = await fetch(PUBLIC_STL_API + "/user/session/wallet", {
			method: "PUT",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			body: stringify({
				wallet_id: id
			})
		});

		if (response.status >= 400) {
			throw error(response.status, "Error setting wallet as active");
		}

		invalidate("/dash:layout");
	}

	async function setPrimaryWallet(id: bigint) {
		let response = await fetch(PUBLIC_STL_API + "/user/wallet", {
			method: "PUT",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			body: stringify({
				wallet_id: id
			})
		});

		if (response.status >= 400) {
			throw error(response.status, "Error setting primary wallet");
		}

		invalidate("/dash:layout");
	}

	let isCreateOpen = false;
	let createInput = "";

	async function createSubmit() {
		if (!isCreateOpen) {
			isCreateOpen = true;
			return;
		}

		let response = await fetch(PUBLIC_STL_API + "/user/wallets", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			body: stringify({
				address: createInput
			})
		});

		if (response.status >= 400) {
			throw error(response.status, "Error creating new wallet");
		}

		invalidate("/dash/wallets:page");

		isCreateOpen = false;
		createInput = "";
	}
</script>

<svelte:head>
	<title>Wallets | Stelo Finance</title>
</svelte:head>

<div class="flex px-3 pt-3">
	<h1 class="font-medium text-3xl ml-2">Wallets</h1>
</div>

<div class="flex flex-col gap-4 mt-4 px-3">
	{#each data.wallets as wallet (wallet.id)}
		<div
			in:slide
			class="flex relative overflow-hidden flex-col py-1 px-2 bg-black bg-opacity-50 rounded-lg
			{wallet.id === data.sessionInfo.wallet_id ? 'border-anakiwa border' : ''}"
		>
			<h2 class="text-xl font-medium">{wallet.address}</h2>
			<div class="flex gap-2 items-center text-xs text-neutral-400">
				{#if wallet.id === data.sessionInfo.wallet_id}
					<p class="text-anakiwa">active</p>
				{:else}
					<button on:click={() => setActiveWallet(wallet.id)} class="underline"
						>set as active</button
					>
				{/if}
				<span class="w-1 h-1 rounded-full bg-neutral-600" />
				{#if wallet.id === data.sessionInfo.primary_wallet_id}
					<p class="text-melrose">primary</p>
				{:else}
					<button on:click={() => setPrimaryWallet(wallet.id)} class="underline"
						>set as primary</button
					>
				{/if}
			</div>

			{#if wallet.id === data.sessionInfo.wallet_id}
				<button
					class="absolute right-0 justify-center top-0 h-full bg-anakiwa px-3 flex flex-col items-center"
				>
					<Wrench className="text-black mt-0.5" />
					<p class="text-sm text-black font-bold">EDIT</p>
				</button>
			{/if}
		</div>
	{/each}
</div>

<div class="flex px-3 mt-5 w-full justify-center relative">
	{#if isCreateOpen}
		<input
			in:slide={{
				axis: "x"
			}}
			out:slide={{
				delay: 400,
				axis: "x"
			}}
			type="text"
			bind:value={createInput}
			placeholder="Wallet address..."
			class="bg-black bg-opacity-50 w-full px-2 rounded-lg"
		/>
		<div
			class="w-4"
			in:slide={{
				axis: "x"
			}}
			out:slide={{
				delay: 600,
				duration: 200,
				axis: "x"
			}}
		/>
		<button
			in:slide={{
				delay: 400
			}}
			out:slide
			on:click={() => (isCreateOpen = false)}
			class="text-neutral-400 underline text-sm absolute -bottom-6 left-4">cancel</button
		>
	{/if}

	<button
		class="text-sm font-bold rounded-lg py-2 px-4 bg-black bg-opacity-50 transition-colors duration-300
		{isCreateOpen ? 'bg-melrose-800' : ''}"
		on:click={createSubmit}>CREATE</button
	>
</div>
