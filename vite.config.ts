import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	ssr: {
		noExternal: ['svelte-hero-icons', 'chart.js']
	},
	optimizeDeps: {
		// Disable dynamic imports, which will disable HMR
		include: ['js-cookie', '@kurkle/color', 'svelte-hero-icons', 'chart.js', 'axios'], // Add other dependencies to exclude if needed
	},
});
