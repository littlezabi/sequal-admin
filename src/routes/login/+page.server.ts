import { dev } from '$app/environment';
import { authenticateAdminKey } from '$lib/users';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load = (async ({ url, cookies }) => {
	if (cookies.get('admin')) throw redirect(302, '/');
	const admin_key = url.searchParams.get('admin');
	if (admin_key) {
		if (admin_key?.length > 80)
			if (await authenticateAdminKey(admin_key)) {
				cookies.set('admin_key', admin_key, {
					path: '/',
					httpOnly: true,
					secure: !dev,
					maxAge: 60 * 60 * 6
				});
				throw redirect(302, '/users');
			}
	}
	return { himom: 1 };
}) satisfies PageServerLoad;
