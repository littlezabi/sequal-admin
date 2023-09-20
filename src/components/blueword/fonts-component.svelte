<script lang="ts">
	export let applyStyle: any;
	import boldIcon from '$img/format_bold.svg';
	import italicIcon from '$img/format_italic.svg';
	import underlineIcon from '$img/format_underlined.svg';
	import strikethroughIcon from '$img/format_strikethrough.svg';
	import subscrptIcon from '$img/subscript.svg';
	import superscriptIcon from '$img/superscript.svg';
	import paletteIcon from '$img/palette.svg';
	import colortextIcon from '$img/format_color_text.svg';
	import { slide } from 'svelte/transition';
	import { Icon, NoSymbol } from 'svelte-hero-icons';
	let textColorInput = false;
	let bgTextPallete = false;
	let colors = [
		'none',
		'#F44336',
		'#e91e63',
		'#9c27b0',
		'#f400ff',
		'#673ab7',
		'#2196f3',
		'#03a9f4',
		'#00bcd4',
		'#009688',
		'#4caf50',
		'#8bc34a',
		'#cddc39',
		'#ffeb3b',
		'#ffc107',
		'#ff9800',
		'#ff5722',
		'#795548',
		'#9e9e9e',
		'#938ce7',
		'#607d8b',
		'#aea6af',
		'#191730',
		'#3e3e3e',
		'#231a25'
	];
	const __ck3x = (e: any) => {
		applyStyle({ key: 'color', value: e.target.value });
	};
</script>

<section class="edit-sec">
	<div class="btn-list">
		<button
			type="button"
			title="bold text"
			on:click={() => applyStyle({ key: 'font-weight', value: 'bold' })}
		>
			<img src={boldIcon} alt="text to bold" />
		</button>
		<button
			type="button"
			title="italic"
			on:click={() => applyStyle({ key: 'font-style', value: 'italic' })}
		>
			<img src={italicIcon} alt="text to italic" />
		</button>
		<button
			type="button"
			title="underline"
			on:click={() => applyStyle({ key: 'text-decoration', value: 'underline' })}
		>
			<img src={underlineIcon} alt="underline text" />
		</button>
		<button
			type="button"
			title="strikethrough"
			on:click={() => applyStyle({ key: 'text-decoration', value: 'line-through' })}
		>
			<img src={strikethroughIcon} alt="strikethrough text" />
		</button>
		<button
			type="button"
			title="subscript"
			on:click={() => applyStyle({ key: 'vertical-align', value: 'sub' })}
		>
			<img src={subscrptIcon} alt="subscript text" />
		</button>
		<button
			type="button"
			title="superscript"
			on:click={() => applyStyle({ key: 'vertical-align', value: 'super' })}
		>
			<img src={superscriptIcon} alt="superscript text" />
		</button>
		<button type="button" title="text color" on:click={() => {textColorInput = !textColorInput; bgTextPallete = false}}>
			<img src={colortextIcon} alt="text color" />
		</button>
		<button
			type="button"
			title="background color"
			on:click={() => {bgTextPallete = !bgTextPallete;textColorInput=false}}
		>
			<img src={paletteIcon} alt="background color" />
		</button>
	</div>
	{#if textColorInput || bgTextPallete}
		<div class="color-pallete" transition:slide>
			<p style="margin:4px 0;">{textColorInput ? 'TEXT COLOR' : 'BACKGROUND COLOR'}</p>
			<div>
				<input type="color" on:change={__ck3x} name="color" id="color-pallete" />
			</div>
			<div class="hck2">
				{#each colors as color}
					{#if color === 'none'}

					<button
						type="button"
						on:click={applyStyle({ key: textColorInput ? 'color' : 'background', value: color })}
						style="background:{color}"
					>
					<Icon src={NoSymbol}/>
				</button>
					{:else}
					<button
						type="button"
						on:click={applyStyle({ key: textColorInput ? 'color' : 'background', value: color })}
						style="background:{color}"
					/>
					{/if}
				{/each}
			</div>
		</div>
	{/if}
	<span class="x3c3">Font</span>
</section>

<style lang="scss">
	.color-pallete {
		
		margin: 10px 0px;
		& .hck2 {
			width: 200px;
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			margin: auto;
			justify-content: center;
		}
		& button {
			width: 19px !important;
			margin: 2px !important;
			height: 19px !important;
			transition: 150ms !important;
			border: 1px solid transparent !important;
			&:hover {
				border-color: var(--elements-hover) !important;
			}
		}
		& input {
			height: 56px;
			color: #8d8d8d24;
		}
	}
	section.edit-sec {
		width: max-content;
		text-align: center;
		text-align: center;
		border-left: 1px solid #66666624;
		border-right: 1px solid #66666624;
		padding: 2px 6px;
		margin: 10px 2px;
		& .x3c3 {
			font-size: 12px;
			margin: 10px auto;
			display: block;
		}
		& .btn-list {
			display: flex;
			flex-wrap: wrap;
		}
		& button {
			margin: 0;
			padding: 0;
			width: 24px;
			height: 24px;
			color: inherit;
			border-radius: 4px;
			border: none;
			background: none;
			transition: 200ms;
			margin-left: 2px;
			display: flex;
			align-items: center;
			justify-content: center;
			&:hover {
				background: var(--secondary-bg);
			}
			& img {
				fill: var(--primary-color);
				width: 20px !important;
			}
		}
	}
</style>
