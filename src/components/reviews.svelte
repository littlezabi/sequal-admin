<script lang="ts">
	import { getRandomColor, life, setUserCharName, trimTitle } from '$lib/globals';
	import { Icon, MapPin, ArrowUturnLeft, Fire } from 'svelte-hero-icons';
	import OpenComment from './open-comment.svelte';
	import { PUBLIC_IMAGES_FETCH_URI } from '$env/static/public';
	const detials = (id: string, item: any) => {
		new OpenComment({
			target: document.getElementById(id) as Element,
			hydrate: true,
			props: { item, id }
		});
	};
	export let reviews: any = [];
</script>

<div class="reviews">
	<span class="dash-icon"><Icon src={Fire} /></span>
	{#each reviews as item, i}
		<section class="flex" style={`background: ${getRandomColor(0.15)}`}>
			<div id={`item-${i}`} />
			<div class="p-view">
				<div class="image">
					{#if !item.user.avatar || item.user.avatar === ''}
						<div>
							{setUserCharName(item.user.firstname + ' ' + item.user.lastname)}
						</div>
					{:else if item.avatar}
						<img
							class="list-image"
							src={item.avatar.includes('http')
								? item.avatar
								: PUBLIC_IMAGES_FETCH_URI + 'images/users/' + item.avatar}
							alt={item.firstname}
						/>
					{/if}
				</div>
			</div>
			<div class="text">
				<div class="flex a3ss3">
					<span class="username">{item.user.firstname} {item.user.lastname}</span>
					<Icon src={MapPin} size={'20'} />
					<span class="country">{item.country}</span>
					<span class="createdAt">{life(item.createdAt).from()}</span>
				</div>
				<button on:click={() => detials(`item-${i}`, item)} class="reply-btn"
					><Icon src={ArrowUturnLeft} size={'20'} /></button
				>
				<p class="review">{trimTitle(item.review, 50, 10, '....')}</p>
			</div>
		</section>
	{/each}
</div>
