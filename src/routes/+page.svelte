<script lang="ts">
	import Charts_1 from '$compo/charts-1.svelte';
	import Users from '$compo/users.svelte';
	import Reviews from '$compo/reviews.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="dashboard">
	<h2>Analytics Overview</h2>
	<Charts_1 countData={data.chart_data} />
	<div class="flex lower-items">
		<div >
			<h2>New Users</h2>
			<Users users={data.lastUsers}/>
		</div>
		<div class="x99x">
			<h2>Latest Chat's</h2>
			<Reviews reviews={data.lastReviews}/>
		</div>
	</div>
</div>

<style lang="scss">
	.dashboard{
		margin-bottom: 100px;
	}
	.lower-items{
		justify-content: center;
		align-items: flex-start;
		& .x99x{
			margin: 0 20px;
		}
	}
	h2 {
		color: var(--primary-color);
	}
</style>
