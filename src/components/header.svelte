<script lang="ts">
	import logoDark from '$img/logo-black.png';
	import logoLight from '$img/logo-white.png';
	import {
		Icon,
		User,
		Cog,
		Sun,
		Moon,
		ChatBubbleOvalLeftEllipsis,
		BellAlert,
		Home
	} from 'svelte-hero-icons';
	import { adminSession } from '../lib/store';
	import { PUBLIC_IMAGES_FETCH_URI } from '$env/static/public';
	import { onMount } from 'svelte';
	let theme: string | null = null;
	const handleTheme = () => {
		theme = theme === 'dark' ? 'light' : 'dark';
		window.localStorage.setItem('theme', theme);
		document.body.classList.toggle('dark');
	};
	onMount(() => (theme = window.localStorage.getItem('theme')));
</script>

<header>
	<nav class="page-size flex">
		<ul class="flex logo">
			<li>
				<img src={theme === 'dark' ? logoLight : logoDark} alt="sequal blue admin" />
			</li>
		</ul>
		<div class="flex ul-9ac83">
			<ul class="flex a0co35ll2">
				<li>
					<a href="/">
						<Icon src={Home} />
					</a>
				</li>
				<li class="flex search-bar">
					<input type="search" name="search" id="search-bar" placeholder="Search here..." />
				</li>
				<li>
					<a class="flex" href="/settings">
						<Icon src={Cog} />
					</a>
				</li>
				<li>
					<a href="/chats">
						<Icon src={ChatBubbleOvalLeftEllipsis} />
					</a>
				</li>
				<li>
					<button>
						<Icon src={BellAlert} />
					</button>
				</li>
				<li>
					<button on:click={handleTheme}
						><Icon
							src={theme === 'dark' ? Sun : Moon}
							class={theme === 'dark' ? 'sun' : 'moon'}
						/></button
					>
				</li>
			</ul>
			<ul>
				<li>
					<a href={$adminSession ? '/logout' : '/login'}>
						<section class="profile flex">
							{#if $adminSession.avatar && $adminSession.avatar !== ''}
								<div class="image flex">
									<img
										src={$adminSession.avatar.includes('http')
											? $adminSession.avatar
											: PUBLIC_IMAGES_FETCH_URI + '/images/users/' + $adminSession.avatar}
										alt=""
									/>
								</div>
							{:else}
								<div class="flex">
									<Icon class="user-icon" src={User} />
								</div>
							{/if}
							{#if $adminSession}
								<span>{$adminSession.username}</span>
							{:else}
								<span>Sign In</span>
							{/if}
						</section>
					</a>
				</li>
			</ul>
		</div>
	</nav>
</header>

<style lang="scss">
	header {
		color: inherit;
		position: fixed;
		min-width: 888px;
		padding: 7px 5px;
		top: 0;
		margin: auto;
		backdrop-filter: blur(36px);
		z-index: 1;
		background: var(--header-bg);
		width: 100%;
		& .profile {
			cursor: pointer;
			& .image {
				overflow: hidden;
				& img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}
			& span {
				font-size: 14px;
			}
			& div {
				justify-content: center;
				border-radius: 50%;
				height: 40px;
				width: 40px;
				background: var(--secondary-bg);
				border: 1px solid var(--light-color-border);
				margin: 0 10px 0 0px;
			}
		}
		& .search-bar {
			& input {
				width: 201px;
				height: 38px;
				border-radius: 25px;
				border: 2px solid var(--light-color-border);
				background: rgb(0 0 255 / 12%);
				padding: 0 3px 0 13px;
				margin-left: 3px;
			}
		}
		& .logo {
			margin: 0;
			margin-left: 95px;
			justify-content: center;
			align-items: center;
			display: flex;
			& img {
				margin-top: 5px;
				width: 82px;
			}
		}
		& .ul-9ac83 {
			width: 100%;
			justify-content: space-between;
			padding: 0 64px;
		}
		& .a0co35ll2 {
			& li {
				margin-left: 23px;
			}
			& a,
			& button {
				color: inherit;
				padding: 4px;
				border: none;
				background: none;
				display: block;
				position: relative;
				&::after {
					content: '';
					display: block;
					width: 6px;
					border-radius: 10px;
					height: 6px;
					background: none;
					position: absolute;
					bottom: 0;
					left: 0;
					right: 0;
					transition: 400ms;
					margin: auto;
				}
				&:hover,
				&:active {
					&::after {
						background: #a4a4ff;
					}
				}
			}
			& span {
				margin-left: 4px;
				font-size: 14px;
			}
		}
	}
</style>
