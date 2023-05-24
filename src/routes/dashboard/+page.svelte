<script lang="ts">
	import { z } from "zod";
	import { parse, parseNumberAndBigInt } from "lossless-json";

	let error = "";

	const Assets = z.array(
		z.object({
			asset: z.object({
				id: z.coerce.bigint(),
				name: z.string(),
				value: z.coerce.bigint()
			}),
			quantity: z.coerce.string()
		})
	);

	async function getAssets() {
		let response = await fetch(`https://api.stelo.finance/wallet/assets`, {
			method: "GET",
			credentials: "include"
		});

		if (response.status >= 400) {
			error = await response.text();
		} else {
			error = "";
			try {
				let data = Assets.parse(parse(await response.text(), undefined, parseNumberAndBigInt));
				return data;
			} catch (error) {
				console.log(error);
				error = "Error with server, tell nin";
			}
		}
	}

	let txUsername = "";
	let txRecipientType = 0;
	let txMemo = "";
	let txQty = 0;
	let txError = "";
	let txSuccess = false;

	async function sendTransaction() {
		txError = "";
		txSuccess = false;
		let body: any = {
			recipient: txUsername,
			type: txRecipientType,
			assets: {
				stelo: Math.floor(txQty * 1000)
			}
		};

		if (txMemo) {
			body.memo = txMemo;
		}

		let response = await fetch(`https://api.stelo.finance/wallet/transactions`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(body)
		});

		if (response.status >= 400) {
			txError = await response.text();
		} else {
			txSuccess = true;
		}
	}

	const Transactions = z.array(
		z.object({
			id: z.coerce.bigint(),
			sending_wallet_id: z.coerce.bigint(),
			receiving_wallet_id: z.coerce.bigint(),
			created_at: z.string(),
			memo: z.string(),
			assets: z.array(
				z.object({
					asset: z.object({
						id: z.coerce.bigint(),
						name: z.string(),
						value: z.coerce.bigint()
					}),
					quantity: z.coerce.string()
				})
			)
		})
	);

	async function getTransactions() {
		let response = await fetch(`https://api.stelo.finance/wallet/transactions`, {
			method: "GET",
			credentials: "include"
		});

		if (response.status >= 400) {
			error = await response.text();
		} else {
			let parseData = Transactions.safeParse(
				parse(await response.text(), undefined, parseNumberAndBigInt)
			);
			if (!parseData.success) {
				error = "Error with server, tell nin";
			} else {
				return parseData.data;
			}
		}
	}
</script>

<h1 class="text-2xl">Dashboard</h1>

<h2 class="mt-8 text-xl">Send transaction</h2>
<div>
	<input type="text" placeholder="recipient..." bind:value={txUsername} />
	<select bind:value={txRecipientType}>
		<option value={0} selected>Username</option>
		<option value={1}>Wallet Address</option>
		<option value={2}>Wallet ID</option>
	</select>
	<input type="text" placeholder="memo..." bind:value={txMemo} />
	<input type="number" placeholder="stelo qty..." bind:value={txQty} />
	<button class="bg-gray-300 rounded-sm py-1 px-4 underline" on:click={sendTransaction}
		>Send TX</button
	>
</div>
{#if txSuccess}
	<p class="text-green-700">Transaction sent!</p>
{:else if txError}
	<p class="text-red-500">{txError}</p>
{/if}

<h2 class="mt-8 text-xl">Assets</h2>
{#await getAssets()}
	<p>Fetching assets...</p>
{:then data}
	{#if data}
		<div class="flex flex-col w-fit">
			{#each data as assetObj}
				<div class="flex flex-col border border-black rounded-md p-1">
					<p class="text-xs text-gray-600">id: {assetObj.asset.id}</p>
					<p>name: {assetObj.asset.name}</p>
					{#if assetObj.asset.name == "stelo"}
						<p>
							qty: {Number(
								assetObj.quantity.slice(0, -4) + "." + assetObj.quantity.slice(-4)
							).toLocaleString()}
						</p>
					{:else}
						<p>qty: {BigInt(assetObj.quantity)}</p>
					{/if}
				</div>
			{/each}
		</div>
	{:else if error}
		<p class="text-red-500">{error}</p>
	{/if}
{/await}

<h2 class="mt-8 text-xl">Transactions</h2>
<p class="text-xs text-gray-700 italic">Only the 10 most recent</p>
{#await getTransactions()}
	<p>Fetching transactions...</p>
{:then data}
	{#if data}
		<div class="flex flex-col w-fit">
			{#each data as transaction}
				<div class="flex flex-col border border-black rounded-md p-1">
					<p class="text-xs text-gray-600">id: {transaction.id}</p>
					<p class="text-xs text-gray-600">sender id: {transaction.sending_wallet_id}</p>
					<p class="text-xs text-gray-600">receiver id: {transaction.receiving_wallet_id}</p>
					<p>Created at: {transaction.created_at}</p>
					{#if transaction.memo}
						<p>Memo: {transaction.memo}</p>
					{/if}
					<div>
						<p>Assets:</p>
						{#each transaction.assets as assetObj}
							<div class="flex flex-col border border-black rounded-md p-1">
								<p class="text-xs text-gray-600">id: {BigInt(assetObj.asset.id)}</p>
								<p>name: {assetObj.asset.name}</p>
								{#if assetObj.asset.name == "stelo"}
									<p>
										qty: {Number(
											assetObj.quantity.slice(0, -4) + "." + assetObj.quantity.slice(-4)
										).toLocaleString()}
									</p>
								{:else}
									<p>qty: {BigInt(assetObj.quantity)}</p>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{:else if error}
		<p class="text-red-500">{error}</p>
	{/if}
{/await}
