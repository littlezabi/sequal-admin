import { getPagination } from '$lib/globals';
import { getUsers } from '$lib/item-list';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ url, cookies, params }: any) => {
	let user_type: string = params.user_type;
	const { skip, limit, page } = getPagination(cookies, url);
	let data = { clients: [], admin: [] };
	if (user_type === 'admin' || user_type === 'clients')
		data[user_type] = await getUsers(skip, limit, user_type);
	if (!data.clients.length && !data.admin.length)
		error(404, 'Users or Admin data not found!');
	return {
		clients: data.clients ? JSON.parse(JSON.stringify(data.clients)) : data.clients,
		admin: JSON.parse(JSON.stringify(data.admin)),
		user_type,
		page,
		skip,
	};
};
