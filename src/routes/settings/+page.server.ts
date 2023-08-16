import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { getSettings } from '../../lib/item-list';
import { authenticateAdmin } from '$lib/users';
export const load: PageServerLoad = async ({ cookies }) => {
	if (!authenticateAdmin(cookies.get('admin'))) {
		cookies.delete('admin');
		throw redirect(303, '/login?redirect=settings');
	}
	return { settings: JSON.stringify(await getSettings()) };
};
