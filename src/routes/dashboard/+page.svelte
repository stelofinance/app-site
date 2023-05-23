<script lang="ts">
	let error = "";

	async function getAssets() {
		let response = await fetch(`https://api.stelo.finance/wallet/assets`, {
			method: "GET",
			credentials: "include"
		});

		if (response.status >= 400) {
			error = await response.text();
		} else {
			error = "";
			return await response.json();
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

	async function getTransactions() {
		let response = await fetch(`https://api.stelo.finance/wallet/transactions`, {
			method: "GET",
			credentials: "include"
		});

		if (response.status >= 400) {
			error = await response.text();
		} else {
			return await response.json();
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
	<div class="flex flex-col w-fit">
		{#each data as assetObj}
			<div class="flex flex-col border border-black rounded-md p-1">
				<p class="text-xs text-gray-600">id: {BigInt(assetObj.asset.id)}</p>
				<p>name: {assetObj.asset.name}</p>
				{#if assetObj.asset.name == "stelo"}
					<p>qty: {(assetObj.quantity / 1000).toLocaleString()}</p>
				{:else}
					<p>qty: {BigInt(assetObj.quantity)}</p>
				{/if}
			</div>
		{/each}
	</div>
{/await}

<h2 class="mt-8 text-xl">Transactions</h2>
<p class="text-xs text-gray-700 italic">Only the 10 most recent</p>
{#await getTransactions()}
	<p>Fetching transactions...</p>
{:then data}
	<div class="flex flex-col w-fit">
		{#each data as transaction}
			<div class="flex flex-col border border-black rounded-md p-1">
				<p class="text-xs text-gray-600">id: {BigInt(transaction.id)}</p>
				<p class="text-xs text-gray-600">sender id: {BigInt(transaction.sending_wallet_id)}</p>
				<p class="text-xs text-gray-600">receiver id: {BigInt(transaction.receiving_wallet_id)}</p>
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
								<p>qty: {(assetObj.quantity / 1000).toLocaleString()}</p>
							{:else}
								<p>qty: {BigInt(assetObj.quantity)}</p>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
{/await}
