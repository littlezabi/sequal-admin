<script lang="ts">
	export let loading_lines: number = 1;
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

<div class="loading">
	{#each line_arr as line}
		<span style="width: {getWidth()}%" />
	{/each}
</div>

<style lang="scss">
	.loading {
		& span {
			background: var(--loading-bg);
			display: block;
			height: 22px;
			margin-top: 9px;
			border-radius: 7px;
			position: relative;
			overflow: hidden;
			&:before{
				content: '';
				width: 100%;
				height:100%;
				position: absolute;
				left: 0;
				top: 0;
				background: var(--loading-fg);
				animation: anim-loading 1s ease-in-out forwards infinite;
				@keyframes anim-loading {
					0%{
						left: -100%;
					}
					100%{
						left: 110%;
					}
				}
			}
		}
	}
</style>
