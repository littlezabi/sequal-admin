import { countCategories } from '$lib/data-counter';

export const load = async () => {
	return {
		...await countCategories()
	};
};
