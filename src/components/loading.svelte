<script lang="ts">
	export let loading_lines: number = 1;
	export let type: string = 'wave';
	export let width:number = 0
	const line_arr = new Array(loading_lines).fill(1);
	const getWidth = () => {
		let w = () => Math.ceil(Math.random() * 100 + 10);
		let width = w();
		while (true) {
			if (width > 100) width = w();
			else return width;
		}
	};
</script>

{#if type === 'spinner'}
	<div class="loading-spinner">
		<div />
	</div>
{:else}
	<div class="loading">
		{#each line_arr as line}
			<span style="width: {width ? width : getWidth()}%" />
		{/each}
	</div>
{/if}

<style lang="scss">
	.loading-spinner {
		& div {
			width: 30px;
			height: 30px;
			background: none;
			border: 3px solid #00213e9e;
			border-radius: 50%;
			border-top-color: white;
			animation: spinner 1s cubic-bezier(0.12, 0.52, 1, 0.46) infinite forwards;
			@keyframes spinner {
				0% {
					border-right-color: white;
					transform: rotate(0deg);
				}
				25%{
					border-left-color: white;
				}
				50%{
					border-right-color: #0087ff;
				}
				75%{
					border-left-color: #0087ff;
				}
				100% {
					border-left-color: #0087ff;
					transform: rotate(360deg);
				}
			}
		}
	}
	.loading {
		& span {
			background: var(--loading-bg);
			display: block;
			height: 22px;
			margin-top: 9px;
			border-radius: 7px;
			position: relative;
			overflow: hidden;
			&:before {
				content: '';
				width: 100%;
				height: 100%;
				position: absolute;
				left: 0;
				top: 0;
				background: var(--loading-fg);
				animation: anim-loading 1s ease-in-out forwards infinite;
				@keyframes anim-loading {
					0% {
						left: -100%;
					}
					100% {
						left: 110%;
					}
				}
			}
		}
	}
</style>
