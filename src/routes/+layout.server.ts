import { getSettings } from '$lib/item-list';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async () => {
	return {
		settings: JSON.stringify(await getSettings())
	};
};
