<script lang="ts">
	import Charts_1 from '$compo/charts-1.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="dashboard">
	<h2>Analytics Overview</h2>
	
	<Charts_1 countData={data} />

	<br />
	<br />
	<br />
	<br />
</div>

<style lang="scss">
	h2 {
		color: var(--primary-color);
	}
</style>
