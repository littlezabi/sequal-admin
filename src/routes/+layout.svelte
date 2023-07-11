<script lang="ts">
	import '$lib/styles/main.scss';
	import SideBar from '$compo/side-bar.svelte';
	import Header from '$compo/header.svelte';
	import { onMount } from 'svelte';
	import { themeStore, toggleTheme, messages, updateMessages } from '../lib/store';
	import Footer from '$compo/footer.svelte';
	import { Icon, XMark } from 'svelte-hero-icons';
	import { fade } from 'svelte/transition';
	onMount(() => {
		toggleTheme(window.localStorage.getItem('theme'));
	});
</script>

<div id="main-container" class:dark={$themeStore === 'dark'}>
	<Header />
	<main class="page-size">
		{#if $messages.message}
			<div class='g-messages {$messages.variant}' transition:fade>
				<span>
					{$messages.message}
				</span>
				<button on:click={()=>updateMessages()}>
					<Icon src={XMark}/> 
				</button>
			</div>
		{/if}
		<div class="main-wrapper">
			<div class="left">
				<SideBar />
			</div>
			<div class="right">
				<slot />
			</div>
		</div>
	</main>
	<Footer/>
</div>

<style lang="scss">
	.g-messages{
		background: var(--secondary-bg);
		max-width: 400px;
		margin: auto;
		text-align: left;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		min-height: 34px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 5px 12px;
		font-size: 14px;
		border: 1px solid #f5f5ff30;
		border-radius: 8px;
		margin-top: 10px;
		border: 1px solid transparent;
		z-index: 1000;
		&.success{
			color: rgb(var(--color-success));
			border-color: rgba(var(--color-success), 0.3);
		}
		&.alert{
			color: rgb(var(--color-alert));
			border-color: rgba(var(--color-alert), 0.3);
		}
		&.danger{
			color: rgb(var(--color-danger));
			border-color: rgba(var(--color-danger), 0.3);
		}
	& span{
		display: block;
   	 padding: inherit;
	}
	& button{
		border-radius: 50%;
		width: 32px;
		height: 32px;
		display: flex;
		background: none;
		border: none;
	}
	}
	.main-wrapper {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		flex-direction: row;
		width: 100%;
		margin-top: 50px;
		overflow: hidden;
		& .left,
		& .right {
			color: var(--priamry-color);
			margin: 0 8px;
		}
		& .left {
			max-width: 25%;
			position: fixed;
			z-index: 5;
			top: 0;
			bottom: 0;
			display: flex;
			align-items: center;
		}
		& .right {
			width: 92%;
    		margin-left: 100px;		
		}
	}
</style>
