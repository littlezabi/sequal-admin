import { countCategories } from '$lib/data-counter';
import type { PageServerLoad } from './$types';

export const load:PageServerLoad = async () => {
	return {
		...await countCategories()
	};
};
