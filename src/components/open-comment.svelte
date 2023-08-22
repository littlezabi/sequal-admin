<script lang="ts">
	import { PUBLIC_IMAGES_FETCH_URI } from '$env/static/public';
	import { life, setUserCharName } from '$lib/globals';
	import { Icon, MapPin, PaperAirplane, XMark } from 'svelte-hero-icons';
	export let item: any = [];
	export let id: string;
	const handleReply = (e: any) => {
		console.log(e.target.reply.value);
	};
	let closing = false;
	const removeModal = () => {
		closing = true;
		setTimeout(() => {
			let x = document.getElementById(id) as HTMLElement;
			x.innerHTML = '';
		}, 100);
	};
</script>

<div class="slide-in expanded-view">
	<div class="fade-in inner-view" class:fadeOut={closing}>
		<button class="reply-btn" on:click={removeModal}><Icon src={XMark} size={'20'} /></button>
		<div>
			<div class="p-view">
				<div class="image">
					{#if !item.user.avatar || item.user.avatar === ''}
						<div>
							{setUserCharName(item?.fullname)}
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
				<div class="flex a3ss3">
					<span class="username">{item.fullname}</span>
					<div>
						<Icon src={MapPin} size={'20'} />
						<span class="country">{item.country}</span>
						<span class="createdAt">{life(item.createdAt).from()}</span>
					</div>
				</div>
			</div>
			<div class="text">
				<p class="review">{item.review}</p>
				<form on:submit|preventDefault={handleReply}>
					<div class="submit-input">
						<input name="reply" type="text" placeholder="Enter your replay..." />
						<input type="hidden" name="id" value="asdf" />
						<button type="submit"><Icon src={PaperAirplane} /></button>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
