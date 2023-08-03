<script lang="ts">
	import SteloFullMono from "$lib/components/logos/SteloFullMono.svelte";
</script>

<svelte:head>
	<title>Stelo Finance</title>
</svelte:head>

<div class="h-screen max-h-screen flex flex-col justify-center items-center">
	<SteloFullMono className="text-white h-20 w-auto" />

	<a
		href="/login"
		class="mt-20 text-xl font-bold bg-white text-black py-1.5 rounded-md px-8 w-52 text-center"
		>LOGIN</a
	>
	<a
		href="/register"
		class="mt-6 text-xl font-bold border border-white py-1.5 rounded-md text-center w-52"
		>REGISTER</a
	>
</div>
