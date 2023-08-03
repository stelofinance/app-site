<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<svelte:head>
	<title>Assets | Stelo Finance</title>
</svelte:head>

<div class="flex flex-col px-3 pt-3">
	<h1 class="font-medium text-3xl ml-2">Assets</h1>

	{#if data.assetError}
		<p class="border-red-400 border pt-1.5 pb-2 mt-4 text-red-400 text-center w-full rounded-lg">
			error: {data.assetError}
		</p>
	{:else if data.assets?.success === true}
		{#each data.assets.data as { asset, quantity }}
			<div class="flex pt-1.5 pb-2 px-3 bg-black bg-opacity-50 rounded-lg mt-4 justify-between">
				<p class="font-medium text-xl">
					{asset.name.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())}
				</p>
				<p class="text-xl font-medium">
					<span class="text-base text-neutral-400">x</span>{asset.name === "stelo"
						? (quantity / 1000).toLocaleString()
						: quantity.toLocaleString()}
				</p>
			</div>
		{/each}
	{/if}
</div>
