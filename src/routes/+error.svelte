<script>
	import { page } from '$app/stores';
	import { FaceFrown, Icon } from 'svelte-hero-icons';
</script>

<div class="a-404">
	<h1>{$page.status} {$page?.error?.message}</h1>
	<span class="icon-x">
		<Icon src={FaceFrown} style="width: 100px;" />
	</span>
</div>

<style>
	.a-404 {
		padding: 30px;
		margin: 10px;
		text-align: center;
	}
	h1 {
		padding: 0;
		margin: 0;
		color: var(--primary-color);
	}
</style>
