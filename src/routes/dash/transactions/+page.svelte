<script lang="ts">
	import type { PageData } from "./$types";
	import AssetAccordion from "./components/AssetAccordion.svelte";

	export let data: PageData;
</script>

<div class="flex flex-col px-3 pt-3">
	<h1 class="font-medium text-3xl ml-2">Transactions</h1>

	{#each data.transactions as tx}
		<AssetAccordion {tx} sessionWalletId={data.sessionInfo.wallet_id} />
	{/each}
</div>
