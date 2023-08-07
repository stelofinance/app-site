<script lang="ts">
	import { invalidate } from "$app/navigation";
	import { PUBLIC_STL_API } from "$env/static/public";
	import Wrench from "$lib/components/icons/Wrench.svelte";
	import type { Wallet } from "$lib/dataStructures";
	import { error } from "@sveltejs/kit";
	import { stringify } from "lossless-json";
	import { slide } from "svelte/transition";
	import type { z } from "zod";

	export let wallet: z.infer<typeof Wallet>;
	export let sessionWalletId: bigint;
	export let sessionPrimaryWalletId: bigint;
	export let isOwnedWallet = true;

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
</script>

<div
	in:slide
	class="flex relative overflow-hidden flex-col py-1 px-2 bg-black bg-opacity-50 rounded-lg
			{wallet.id === sessionWalletId ? 'border-anakiwa border' : ''}"
>
	<h2 class="text-xl font-medium">{wallet.address}</h2>
	<div class="flex gap-2 items-center text-xs text-neutral-400">
		{#if wallet.id === sessionWalletId}
			<p class="text-anakiwa">active</p>
		{:else}
			<button on:click={() => setActiveWallet(wallet.id)} class="underline">set as active</button>
		{/if}
		{#if isOwnedWallet}
			<span class="w-1 h-1 rounded-full bg-neutral-600" />
			{#if wallet.id === sessionPrimaryWalletId}
				<p class="text-melrose">primary</p>
			{:else}
				<button on:click={() => setPrimaryWallet(wallet.id)} class="underline"
					>set as primary</button
				>
			{/if}
		{/if}
	</div>

	{#if wallet.id === sessionWalletId}
		<a
			href="/dash/wallet"
			class="absolute right-0 justify-center top-0 h-full bg-anakiwa px-3 flex flex-col items-center"
		>
			<Wrench className="text-black mt-0.5" />
			<p class="text-sm text-black font-bold">EDIT</p>
		</a>
	{/if}
</div>
