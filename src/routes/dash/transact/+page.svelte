<script lang="ts">
	import { PUBLIC_STL_API } from "$env/static/public";
	import type { PageData } from "./$types";

	export let data: PageData;

	let stagedAssets: {
		name: string;
		quantity: number | undefined;
	}[] = [];

	let selectedAsset: string;

	$: selectableAssets = data.assets.filter(
		(asset) => !stagedAssets.find((stagedAsset) => stagedAsset.name === asset.asset.name)
	);

	let memo: string;

	let recipient = "";

	let recipientType: "username" | "address" = "username";

	function getRecipientTypeOpposite(recipientType: string) {
		return recipientType === "address" ? "username" : "address";
	}

	async function sendTransaction() {
		let assetObject: {
			[key: string]: number;
		} = {};

		for (const asset of stagedAssets) {
			if (asset.quantity !== undefined) {
				assetObject[asset.name] = asset.quantity;
			}
		}

		let response = await fetch(PUBLIC_STL_API + "/wallet/transactions", {
			method: "post",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				recipient,
				type: recipientType === "username" ? 0 : 1,
				memo: memo !== "" ? memo : undefined,
				assets: assetObject
			})
		});

		if (response.status === 201) {
			sentMessage = "Transaction sent";
		} else {
			sentMessage = "Failed to sent";
		}
	}

	let sentMessage: string | undefined;

	$: readyToSend = stagedAssets.length >= 1 && recipient.length >= 1;
</script>

<div class="flex flex-col px-3 pt-3">
	<h1 class="font-medium text-3xl ml-2">Transact</h1>

	<h2 class="ml-2 mt-4">Assets</h2>

	<div class="flex flex-col gap-2 mt-1">
		{#if selectableAssets.length}
			<div class="flex h-7 w-full">
				<select
					class="bg-black bg-opacity-50 flex-grow mr-2 px-2 rounded-lg"
					bind:value={selectedAsset}
				>
					{#each selectableAssets as { asset }}
						<option class="bg-black" value={asset.name}>{asset.name}</option>
					{/each}
				</select>

				<button
					on:click={() => {
						stagedAssets.push({ name: selectedAsset, quantity: undefined });
						stagedAssets = stagedAssets;
					}}
					class="text-sm font-bold rounded-lg py-1 px-4 bg-black bg-opacity-50 w-fit"
					>ADD ASSET</button
				>
			</div>
		{/if}

		{#each stagedAssets as asset (asset.name)}
			<div class="flex items-center">
				<p>{asset.name}</p>
				<div class="h-px grow bg-neutral-800 mx-4 mt-1" />
				<input
					type="number"
					placeholder="Qty..."
					bind:value={asset.quantity}
					class="bg-black bg-opacity-90 w-20 placeholder:text-center text-right pr-1 rounded-lg"
				/>
			</div>
		{/each}
	</div>

	<h2 class="ml-2 mt-4">Memo <span class="text-xs text-neutral-400">(optional)</span></h2>
	<input
		type="text"
		bind:value={memo}
		placeholder="Memo..."
		class="bg-black bg-opacity-50 w-full px-2 rounded-lg"
	/>

	<h2 class="ml-2 mt-4">Recipient</h2>
	<input
		type="text"
		bind:value={recipient}
		placeholder="{recipientType}..."
		required
		class="bg-black bg-opacity-50 w-full px-2 rounded-lg"
	/>
	<button
		on:click={() => (recipientType = getRecipientTypeOpposite(recipientType))}
		class="text-xs mt-1 text-neutral-400 underline w-fit ml-2"
		>switch to {getRecipientTypeOpposite(recipientType)}</button
	>

	<button
		class="text-sm font-bold mt-2 w-fit mx-auto rounded-lg py-2 bg-black px-4 bg-opacity-50 transition-colors duration-300
		{readyToSend ? 'bg-melrose-800' : ''}"
		on:click={() => sendTransaction()}>SEND</button
	>

	{#if sentMessage}
		<p>{sentMessage}</p>
	{/if}
</div>
