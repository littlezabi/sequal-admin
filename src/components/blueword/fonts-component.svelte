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
	import { ChevronDown, Icon, NoSymbol } from 'svelte-hero-icons';
	let textColorInput = false;
	let bgTextPallete = false;
	let fontSizes: any = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
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
	const __ck3x = (e: any) => {applyStyle({ key: 'color', value: e.target.value });}
	
	export let fontSizeInput = 14;
	export let handleFontSize:any;
	export let RemHandleFontSize:any;
	export let stylePropertiesInClass:any;
	console.log(stylePropertiesInClass)
	const setff = (e:any)=>{
		applyStyle({key:'font-family', value: e?.target.value})
	}
</script>

<section class="edit-sec">
	<div class="btn-list">
		<select name="fontfamily" id="fontfamily" on:change={setff}>
			{#if stylePropertiesInClass["font-family"]}
				<option value="{stylePropertiesInClass["font-family"]}" selected>{stylePropertiesInClass["font-family"]}</option>
			{/if}
			<option value="Inter">Inter (default)</option>
			<option value="Arial">Arial</option>
			<option value="Berlin Sans FB">Berlin Sans FB</option>
			<option value="Blackadder ITC">Blackadder ITC</option>
			<option value="Broadway">Broadway</option>
			<option value="Consolas">Consolas</option>
			<option value="Candara">Candara</option>
			<option value="Calibri">Calibri</option>
			<option value="Comic Sans MS">Comic Sans MS</option>
			<option value="Cooper">Cooper</option>
			<option value="Franklin Gothic Book">Franklin Gothic Book</option>
			<option value="Georgia">Georgia</option>
			<option value="Impact">Impact</option>
			<option value="Lato">Lato</option>
			<option value="Lucida Console">Lucida Console</option>
			<option value="Microsoft Sans Serif">Microsoft Sans Serif</option>
			<option value="Terminal">Terminal</option>
			<option value="system-ui">System UI</option>
			<option value="Times New Roman">Times New Roman</option>
			<option value="Verdana">Verdana</option>
		</select>
		<div class="font-size-wrap">
			<div class="f31">
				<!-- <input type="text" value="14px" on:change={handleFontSize} /> -->
				<button
					type="button"
					on:focus={handleFontSize}
					on:blur={RemHandleFontSize}
					class="fontSizeInput">{stylePropertiesInClass['font-size'] ? stylePropertiesInClass['font-size'].replace('px', '') : fontSizeInput}</button
				>
				<div class="f31-5">
					<Icon src={ChevronDown} style="color:inherit;width:100%;height:100%;" />
					<div class="f32">
						{#each fontSizes as fsize}
							<button on:click={applyStyle({ key: 'font-size', value: `${fsize}px` })} type="button"
								>{fsize}px</button
							>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="btn-list">
		<button
			type="button"
			title="bold text"
			on:click={() => applyStyle({ key: 'font-weight', value: 'bold' })}
			class={stylePropertiesInClass['font-weight'] ? 'active' : ''}
		>
			<img src={boldIcon} alt="text to bold" />
		</button>
		<button
			type="button"
			title="italic"
			on:click={() => applyStyle({ key: 'font-style', value: 'italic' })}
			class={stylePropertiesInClass['font-style'] ? 'active' : ''}
		>
			<img src={italicIcon} alt="text to italic" />
		</button>
		<button
			type="button"
			title="underline"
			on:click={() => applyStyle({ key: 'text-decoration', value: 'underline' })}
			class={stylePropertiesInClass['text-decoration'] === 'underline' ? 'active' : ''}
		>
			<img src={underlineIcon} alt="underline text" />
		</button>
		<button
			type="button"
			title="strikethrough"
			on:click={() => applyStyle({ key: 'text-decoration', value: 'line-through' })}
			class={stylePropertiesInClass['text-decoration'] === 'line-through' ? 'active' : ''}
		>
			<img src={strikethroughIcon} alt="strikethrough text" />
		</button>
		<button
			type="button"
			title="subscript"
			on:click={() => applyStyle({ key: 'vertical-align', value: 'sub' })}
			class={stylePropertiesInClass['vertical-align'] === 'sub' ? 'active' : ''}
		>
			<img src={subscrptIcon} alt="subscript text" />
		</button>
		<button
			type="button"
			title="superscript"
			on:click={() => applyStyle({ key: 'vertical-align', value: 'super' })}
			class={stylePropertiesInClass['vertical-align'] === 'super' ? 'active' : ''}
		>
			<img src={superscriptIcon} alt="superscript text" />
		</button>
		<button
			type="button"
			title="text color"
			on:click={() => {
				textColorInput = !textColorInput;
				bgTextPallete = false;
			}}
			class={stylePropertiesInClass['color'] ? 'active' : ''}
		>
			<img src={colortextIcon} alt="text color" />
		</button>
		<button
			type="button"
			title="background color"
			on:click={() => {
				bgTextPallete = !bgTextPallete;
				textColorInput = false;
			}}
			class={stylePropertiesInClass['background'] ? 'active' : ''}
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
							<Icon src={NoSymbol} />
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
	.font-size-wrap {
		margin-left: 8px;
		& .f31 {
			display: flex;
			flex-direction: row;
			align-items: center;
			background: #7990d529;
			width: max-content;
			border: 1px solid #7e7e7e42;
			border-radius: 2px;
			&:hover {
				& button {
					border-left-color: #7e7e7e42;
				}
			}
			& .f31-5 {
				position: relative;
				cursor: pointer;
				& button {
					border: 1px solid transparent;
					&:hover {
						background: #7e7e7e42;
					}
				}
				border-radius: 0;
				width: 17px;
				height: 19px;
				&:hover {
					background: #7e7e7e42;
					& .f32 {
						display: block;
					}
				}
			}
			& button {
				width: 30px;
				height: 14px;
				padding: 2px 6px;
				font-size: 12px;
				border-radius: 0;
				border: none;
				border-right: 1px solid transparent;
			}
		}
		& .f32 {
			position: absolute;
			z-index: 1;
			width: 57px;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			padding: 4px 4px;
			border-radius: 4px;
			margin-top: 0px;
			margin-left: 0;
			border: 1px solid rgba(136, 136, 136, 0.2196078431);
			background: var(--bg-color);
			box-shadow: 2px -1px 5px rgba(0, 0, 0, 0.2784313725);
			display: none;
			top: 20px;
			right: -2px;
			& button {
				font-size: 11px;
				width: 100%;
				text-align: left;
				padding: 0 3px;
				margin: 0;
				display: flex;
				height: 16px;
				justify-content: flex-start;
				border-radius: 0;
			}
		}
	}
	.btn-list {
		margin-bottom: 4px;
		& select {
			width: 108px;
			font-size: 10px;
			text-transform: none;
			height: 20px;
			& option {
				text-transform: none;
				font-size: 11px;
			}
		}
	}
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
			&:hover, &.active{
				background: var(--secondary-bg);
			}
			& img {
				fill: var(--primary-color);
				width: 20px !important;
			}
			
		}
	}
</style>
