<script lang="ts">
	import RoundArrow from "$lib/components/icons/RoundArrow.svelte";
	import SimpleArrow from "$lib/components/icons/SimpleArrow.svelte";
	import RelativeTime from "@yaireo/relative-time";
	import type { Transaction } from "$lib/dataStructures";
	import type { z } from "zod";
	import { slide } from "svelte/transition";

	export let tx: z.infer<typeof Transaction>;
	export let sessionWalletId: bigint;

	let relativeTime = new RelativeTime();

	let isOpen = false;
</script>

<div
	class="flex relative flex-col py-1 px-2.5 bg-black bg-opacity-50 rounded-lg mt-4 justify-between"
>
	<div class="flex justify-between text-sm">
		{#if tx.receiving_wallet_id === sessionWalletId}
			<span class="flex gap-1 items-center">
				<RoundArrow />
				<p class="text-anakiwa">incoming</p>
			</span>
		{:else}
			<span class="flex gap-1 items-center">
				<RoundArrow className="text-melrose rotate-180" />
				<span class="text-melrose">outgoing</span>
			</span>
		{/if}

		<p class="text-neutral-400">{relativeTime.from(tx.created_at)}</p>
	</div>

	<div class="flex justify-between">
		<div class="flex flex-col">
			{#if tx.receiving_wallet_id === sessionWalletId}
				<p class="text-xl">{tx.sending_username ?? tx.sending_wallet_address}</p>
				<p class="text-sm text-neutral-400">
					wallet{tx.sending_username ? `: ${tx.sending_wallet_address}` : ""}
				</p>
			{:else}
				<p class="text-xl">{tx.receiving_username ?? tx.receiving_wallet_address}</p>
				<p class="text-sm text-neutral-400">
					wallet{tx.receiving_username ? `: ${tx.receiving_wallet_address}` : ""}
				</p>
			{/if}
		</div>
		<div class="flex flex-col text-right">
			<p class="text-xl">
				{(
					tx.assets.reduce((acc, current) => acc + current.asset.value * current.quantity, 0) / 1000
				).toLocaleString()}
			</p>
			<p class="text-sm text-neutral-400">value</p>
		</div>
	</div>

	<!-- <p class="font-medium text-xl">
				{asset.name.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())}
			</p>
			<p class="text-xl font-medium">
				<span class="text-base text-neutral-400">x</span>{asset.name === "stelo"
					? (quantity / 1000).toLocaleString()
					: quantity.toLocaleString()}
			</p> -->

	{#if isOpen}
		<div
			class="flex flex-col pb-6 pt-1"
			transition:slide|global={{
				duration: 300
			}}
		>
			<hr class="w-full border-neutral-800" />
			{#if tx.memo}
				<p class="bg-black bg-opacity-70 p-1 rounded-lg mt-1">{tx.memo}</p>
			{/if}
			<div class="flex flex-col mt-2">
				{#each tx.assets as { asset, quantity }}
					<div class="flex text-sm gap-2 items-center">
						<p>{asset.name}</p>
						<hr class="flex-grow border-neutral-800" />
						<p>
							<span class="text-xs text-neutral-400">x</span>{asset.name === "stelo"
								? (quantity / 1000).toLocaleString()
								: quantity.toLocaleString()}
						</p>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<button
		on:click={() => (isOpen = !isOpen)}
		class="absolute bottom-0 p-2 left-1/2 -translate-x-1/2 transition-transform duration-300"
		class:rotate-180={isOpen}
	>
		<SimpleArrow className="text-neutral-400" />
	</button>
</div>
