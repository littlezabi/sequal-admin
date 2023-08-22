<script lang="ts">
	import { numberFormat } from '$lib/globals';
	import { createEventDispatcher } from 'svelte';
	import { Icon, Minus, PlusSmall } from 'svelte-hero-icons';
	const dispatch = createEventDispatcher();
	export let minimum: number = 0;
	export let maximum: number = Infinity;
	export let title: string = '';
	export let step: number = 1;
	export let value: number = 0;
	export let output: number = value;
	export let callback = (n: number): number => n;
	$: value, (output = value);
	let intervalId: any;
	const handleNumbers = (variation: number) => {
		if (variation === -1)
			intervalId = setInterval(() => {
				value <= minimum ? (value = callback(minimum)) : (value = callback(value - Number(step)));
			}, 100);
		else
			intervalId = setInterval(() => {
				value >= maximum ? (value = callback(maximum)) : (value = callback(value + Number(step)));
			}, 100);
		dispatch('viewsValue', value);
	};
	const setNumbers = (e: any) => {
		let n = e.target.value;
		if (n >= maximum) e.target.value = callback(maximum);
		else value += callback(Number(step));
		dispatch('viewsValue', value);
	};
</script>

<div class="custom-number">
	<div class="inner-custom-number">
		<button
			on:mousedown={() => handleNumbers(-1)}
			on:mouseup={() => clearInterval(intervalId)}
			on:click={() =>
				value <= minimum ? (value = callback(minimum)) : (value = callback(value - Number(step)))}
			type="button"><Icon src={Minus} /></button
		>
		<div class="numbering">
			<input
				type="number"
				class="numbers"
				min={minimum}
				max={maximum}
				{step}
				on:change={setNumbers}
				{value}
				style="display: inline-block"
			/>
			<span class="cn-title">{numberFormat(value ?? 0)} {title}</span>
		</div>
		<button
			on:mousedown={() => handleNumbers(1)}
			on:mouseup={() => clearInterval(intervalId)}
			on:click={() =>
				value >= maximum ? (value = callback(maximum)) : (value = callback(value + Number(step)))}
			type="button"><Icon src={PlusSmall} /></button
		>
	</div>
</div>

<style lang="scss">
	.custom-number {
		width: 200px;
		& .inner-custom-number {
			background: var(--secondary-bg);
			width: 100%;
			border-radius: 6px;
			height: 47px;
			padding: 4px 0;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			& .numbering {
				display: flex;
				align-items: center;
				height: 33px;
				flex-direction: column;
				justify-content: center;
			}
			& .numbers {
				max-width: 119px;
				text-align: center;
				background: none;
				border: none;
				color: var(--color);
				font-size: 18px;
				appearance: textfield;
				&::-webkit-inner-spin-button,
				&::-webkit-outer-spin-button {
					-webkit-appearance: none;
					margin: 0;
				}
				-moz-appearance: textfield;
			}
			& button {
				background: none;
				border: unset;
			}
			& .cn-title {
				font-size: 10px;
				margin-bottom: -5px;
			}
		}
	}
</style>
