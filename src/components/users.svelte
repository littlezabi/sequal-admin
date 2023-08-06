<script lang="ts">
	import { getRandomColor, life, setUserCharName } from '$lib/globals';
	import { Icon, MapPin, Users } from 'svelte-hero-icons';
	export let users: any = [];
</script>

<div class="reviews">
	<span class="dash-icon"><Icon src={Users} /></span>
	{#each users as item, i}
		<section class="flex" style={`background: ${getRandomColor(0.15)}`}>
			<div class="p-view">
				<div class="image">
				{#if !item.avatar || item.avatar === ''}
					<div>
						{setUserCharName(item?.firstname + ' ' + item?.lastname)}
					</div>
				{:else}
					<img
						style={`border-color: ${getRandomColor(0.5)}`}
						src={item.avatar}
						alt={item.firstname}
					/>
				{/if}
			</div>
			</div>
			<div class="text">
				<div class="flex a3ss3">
					<span class="username1">{item.firstname + ' ' + item.lastname}</span>
					<Icon src={MapPin} size={'20'} />
					<span class="country">{item.country}</span>
					<span class="createdAt">{life(item.createdAt).from()}</span>
				</div>
				<span class="email">{item.email}</span>
			</div>
		</section>
	{/each}
</div>

<style lang='scss'>
	.username1 {
		font-size: 16px;
		text-transform: capitalize;
	}
	.email {
		font-size: 12px;
	}
</style>
