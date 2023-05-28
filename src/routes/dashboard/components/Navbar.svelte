<script lang="ts">
	import { page } from "$app/stores";
</script>

<nav
	aria-label="main"
	class="flex text-xl py-1 justify-evenly underline bg-gray-200 text-neutral-600"
>
	<a
		href="/dashboard"
		class="hover:text-black focus:text-black"
		class:text-black={$page.url.pathname === "/dashboard"}>dashboard</a
	>
	<a
		href="/dashboard/wallets"
		class="hover:text-black focus:text-black"
		class:text-black={$page.url.pathname === "/dashboard/wallets"}>wallets</a
	>
</nav>
