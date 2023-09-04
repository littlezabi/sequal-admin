import { getPagination } from '$lib/globals.js';
import { mobileList } from '$lib/item-list';
import type { PageServerLoad } from './$types';
export const load:PageServerLoad = async ({ url, cookies }) => {
	const { skip, limit, page } = getPagination(cookies, url);
	const mobiles = await mobileList(skip, limit);
	return { list: JSON.parse(JSON.stringify(mobiles)), pageNo: page };
}
