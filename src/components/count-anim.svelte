<script lang="ts">
	import { tweened } from 'svelte/motion';
	export let targetCount:any;
    export let animationDuration:number =  1000
	const count = tweened(0, {
		duration: animationDuration,
	});
	$: {count.set(targetCount);}
</script>
{$count.toFixed(1)}