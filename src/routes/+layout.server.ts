// import { getSettings } from '$lib/item-list';
import { authenticateAdmin } from '$lib/users';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ cookies, url }: any) => {
	if (!(url.pathname === '/login')) {
		const auth = await authenticateAdmin(cookies.get('admin'));
		if (!auth) {
			cookies.delete('admin');
			throw redirect(303, '/login');
		}
	}
	return {};
};
