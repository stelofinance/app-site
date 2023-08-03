<script lang="ts">
	import GearIcon from "$lib/components/icons/GearIcon.svelte";
	import RecentIcon from "$lib/components/icons/RecentIcon.svelte";
	import ThreeHexagons from "$lib/components/icons/ThreeHexagons.svelte";
	import TransactIcon from "$lib/components/icons/TransactIcon.svelte";
	import WalletIcon from "$lib/components/icons/WalletIcon.svelte";
	import { page } from "$app/stores";
</script>

<nav
	role="main"
	class="fixed z-10 bottom-5 flex w-11/12 max-w-sm justify-between h-14 items-center px-4 left-1/2 -translate-x-1/2 bg-neutral-800 rounded-xl"
>
	<a href="/dash/assets" aria-label="Assets">
		<ThreeHexagons
			className="w-10 h-10 {$page.url.pathname === '/dash/assets'
				? 'text-neutral-200'
				: 'text-neutral-500'}"
		/>
	</a>

	<a href="/dash/transactions" aria-label="Transactions">
		<RecentIcon
			className="w-10 h-10 {$page.url.pathname === '/dash/transactions'
				? 'text-neutral-200'
				: 'text-neutral-500'}"
		/>
	</a>

	<a href="/dash/transact" aria-label="Transact">
		<TransactIcon
			className={$page.url.pathname === "/dash/transact" ? "border border-white" : ""}
		/>
	</a>

	<a href="/dash/wallets" aria-label="Wallets">
		<WalletIcon
			className="w-10 h-10 {$page.url.pathname === '/dash/wallets'
				? 'text-neutral-200'
				: 'text-neutral-500'}"
		/>
	</a>

	<a href="/dash/settings" aria-label="Settings">
		<GearIcon
			className="w-10 h-10 {$page.url.pathname === '/dash/settings'
				? 'text-neutral-200'
				: 'text-neutral-500'}"
		/>
	</a>
</nav>

<slot />
