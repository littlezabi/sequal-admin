import { getUsers } from '$lib/item-list';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    const admin_key = url.searchParams.get('admin_key')
	const { users, admins } = await getUsers();
	return {
		users: JSON.stringify(users),
		admins: JSON.stringify(admins),
		view: url.searchParams.get('view'),
        admin_key
	};
};
