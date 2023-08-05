<script lang="ts">
	import { PUBLIC_STL_API } from "$env/static/public";
	import Wrench from "$lib/components/icons/Wrench.svelte";
	import { stringify } from "lossless-json";
	import type { PageData } from "./$types";
	import { error } from "@sveltejs/kit";
	import { invalidate } from "$app/navigation";
	import { slide } from "svelte/transition";
	import WalletCard from "./components/WalletCard.svelte";

	export let data: PageData;

	let showAssigned = data.sessionInfo.wallet_user_id !== data.sessionInfo.user_id;

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

<div class="flex px-3 pt-3 justify-between items-center">
	<h1 class="font-medium text-3xl ml-2">Wallets</h1>
	<div class="font-bold text-sm flex gap-1.5 items-center">
		<p class:text-neutral-400={showAssigned}>OWNED</p>
		<label class="bg-black bg-opacity-50 rounded-full h-5 w-12 p-0.5">
			<input type="checkbox" hidden bind:checked={showAssigned} />
			<div
				class="h-full aspect-square bg-white rounded-full transition-all {showAssigned
					? 'ml-7'
					: 'ml-0'}"
			/>
		</label>

		<p class:text-neutral-400={!showAssigned}>ASSIGNED</p>
	</div>
</div>

<div class="flex flex-col gap-4 mt-4 px-3">
	{#if !showAssigned}
		{#each data.wallets as wallet (wallet.id)}
			<WalletCard
				{wallet}
				sessionWalletId={data.sessionInfo.wallet_id}
				sessionPrimaryWalletId={data.sessionInfo.primary_wallet_id}
			/>
		{/each}
	{:else}
		{#each data.assignedWallets as wallet (wallet.id)}
			<WalletCard
				{wallet}
				isOwnedWallet={false}
				sessionWalletId={data.sessionInfo.wallet_id}
				sessionPrimaryWalletId={data.sessionInfo.primary_wallet_id}
			/>
		{/each}
	{/if}
</div>

{#if !showAssigned}
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
{/if}
