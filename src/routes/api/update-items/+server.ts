import { authenticateAdmin } from '$lib/users';
import { setCatType } from '../set-items/set-items';
import { handleCategories, handleDeviceUpdate, handleProduct, handleUpdateUser, updateSettings } from './handlers';
export const POST = async ({ request, cookies }: any) => {
	let authenticated = await authenticateAdmin(cookies.get('admin'));
	if (!authenticated) {
		/* @migration task: add path argument */ cookies.delete('admin');
		return new Response(
			JSON.stringify({
				message: 'Admin Authentication Failed!',
				success: 0,
				error: 'unauthenticated_user'
			})
		);
	}
	let requestingFor = request.headers.get('requestFor');
	if (requestingFor === 'updateMobileDevice') return handleDeviceUpdate(await request.formData());
	else if (requestingFor === 'updateUser-1') return handleUpdateUser(await request.formData());
	else if (requestingFor === 'updateCategories') return handleCategories(await request.formData());
	else if (requestingFor === 'updateSettings') return updateSettings(await request.json());
	else if (requestingFor === 'product-edit')  return handleProduct(await request.formData(), 'edit')
	else if (requestingFor === 'setCatType') return setCatType(await request.formData(), 'edit');
	else {
		return new Response(
			JSON.stringify({ message: 'API working but request data not found!', status: 0 }),
			{ status: 200 }
		);
	}
};
