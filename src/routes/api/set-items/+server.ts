import { authenticateAdmin } from '$lib/users';
import { handleDeviceUpdate } from '../update-items/handlers';
import { handleUser } from './set-items';

export const POST = async ({ request, cookies }: any) => {
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
	const requestFor = request.headers.get('requestFor')
	if (requestFor === 'newDeviceReq') return handleDeviceUpdate(await request.formData(), 'new')
	if (requestFor === 'adduser-1') return handleUser(await request.formData())
	return new Response(JSON.stringify({ message: 'Its seem you accessing api without any data', success: 0 }), { status: 200 });
};
