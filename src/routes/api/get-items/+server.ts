import database from '$lib/database';
import countries from '$lib/assets/countries.json';
import { authenticateAdmin } from '$lib/users';
import { adminLogin, checkUsername, dataCount, emptyRequest, getSmartDevices } from './get-items';

await database.connect();
export const POST = async ({ request, cookies }: any) => {
	const body = await request.json();
	if (body.adminLogin) return adminLogin(body);
	else return emptyRequest();
};
export const GET = async ({ url, cookies, request }: any) => {
	if (url.searchParams.get('count-items')) return dataCount();

	let authenticated = await authenticateAdmin(
		cookies.get('admin'),
		request.headers.get('admin_key')
	);
	if (!authenticated) {
		cookies.delete('admin');
		return new Response(
			JSON.stringify({
				message: 'Admin Authentication Failed!',
				success: 0,
				error: 'unauthenticated_user'
			})
		);
	}
	if (url.searchParams.get('getCountries')) return new Response(JSON.stringify(countries), { status: 200 });
	if (url.searchParams.get('checkUsername')) return checkUsername(url.searchParams.get('username'));
	if (url.searchParams.get('smart_device')) return getSmartDevices(url.searchParams.get('_id'), url.searchParams.get('getCats'));
};
