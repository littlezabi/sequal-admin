<script lang="ts">
	import '$lib/styles/main.scss';
	import SideBar from '$compo/side-bar.svelte';
	import Header from '$compo/header.svelte';
	import { onMount, afterUpdate } from 'svelte';
	import { themeStore, toggleTheme } from '../lib/store';
	import Footer from '$compo/footer.svelte';
	onMount(() => {
		toggleTheme(window.localStorage.getItem('theme'));
	});
</script>

<div id="main-container" class:dark={$themeStore === 'dark'}>
	<Header />
	<main class="page-size">
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
