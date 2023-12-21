<script lang="ts">
	import '$lib/styles/main.scss';
	import SideBar from '$compo/side-bar.svelte';
	import Header from '$compo/header.svelte';
	import { onMount } from 'svelte';
	import {
		messages,
		updateMessages,
		updateStaticData,
		promptModal,
		static_data
	} from '../lib/store';
	import Footer from '$compo/footer.svelte';
	import { CheckCircle, ExclamationTriangle, Icon, XMark } from 'svelte-hero-icons';
	import { fade } from 'svelte/transition';
	import PromptModal from '$compo/prompt-modal.svelte';
	import { setCookies, staticBody } from '$lib/globals';
	import axios from 'axios';
	let pageLoad: boolean = false;
	onMount(async () => {
		pageLoad = true;
		if ($static_data.settings.no_settings) {
			await axios
				.get('/api/get-items/', { params: { getSettings: 1 } })
				.then((e) => {
					updateStaticData({ settings: e.data });
					setCookies('item-per-page', e.data['itemsPerPage']);
				})
				.catch((e) => {
					console.error(e);
				});
		}
	});
	let closingModalInterval: any = undefined;
	$: $messages, closeModal();
	const closeModal = () => {
		if (closingModalInterval) clearTimeout(closingModalInterval);
		closingModalInterval = setTimeout(
			updateMessages,
			$messages.closing_time ? $messages.closing_time : 5000
		);
	};
	$: $promptModal.visible, pageLoad && staticBody($promptModal.visible);
</script>

<div id="main-container">
	<Header />
	<main class="page-size">
		{#if $promptModal.visible}
			<PromptModal />
		{/if}
		{#if $messages.message}
			<div class="g-messages {$messages.variant}" transition:fade>
				<div class="flex">
					<span style="margin-right: 8px;">
						{$messages.message}
					</span>
					{#if $messages.variant === 'success'}
						<Icon class="success" src={CheckCircle} />
					{/if}
					{#if $messages.variant === 'alert' || $messages.variant === 'danger'}
						<Icon class="alert" src={ExclamationTriangle} />
					{/if}
				</div>
				<button on:click={() => updateMessages(null)}>
					<Icon src={XMark} />
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
	<Footer />
</div>

<style lang="scss">
	.g-messages {
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
		&.success {
			color: rgb(var(--color-success));
			border-color: rgba(var(--color-success), 0.3);
		}
		&.alert {
			color: rgb(var(--color-alert));
			border-color: rgba(var(--color-alert), 0.3);
		}
		&.danger {
			color: rgb(var(--color-danger));
			border-color: rgba(var(--color-danger), 0.3);
		}
		& span {
			display: block;
			padding: inherit;
		}
		& button {
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
		width: 1280px;
		margin-top: 50px;
		overflow: hidden;
		& .left,
		& .right {
			color: var(--priamry-color);
			margin: 0 8px;
		}
		& .left {
			background: var(--header-bg);
			max-width: 25%;
			position: fixed;
			z-index: 5;
			top: 78px;
			border-radius: 6px;
			bottom: 0;
			display: flex;
			align-items: center;
			overflow: scroll;
			height: max-content;
			backdrop-filter: blur(18px);
			box-shadow: var(--common-shadow);
			border: 1px solid rgb(112 112 112 / 12%);
			transition: background 300ms linear;
			scrollbar-width: 2px;
			scrollbar-color: #ffffff00;
			scrollbar-arrow-color: #ffffff00;
			scrollbar-base-color: #ffffff00;
			scrollbar-gutter: #ffffff00;
			&::-webkit-scrollbar {
				width: 2px;
				background: #ffffff00;
			}
			&::-webkit-scrollbar-thumb {
				background-color: #767b785e;
			}
			transition: background 300ms linear;
		}
		& .right {
			width: 92%;
			margin-left: 100px;
		}
	}
</style>
