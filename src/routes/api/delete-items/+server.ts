import database from '$lib/database';
import { authenticateAdmin } from '$lib/users';
import { emptyRequest } from '../get-items/get-items';
import { handleDeleteCategory, handleDeleteItem, handleDeleteMultipleItems, handleDeleteUser } from './handleDelete';

await database.connect();
export const POST = async ({ request, cookies }: any) => {
	const body = await request.json();
	let authenticated = await authenticateAdmin(cookies.get('admin'));
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

    if (requestFor === "deleteUser") return handleDeleteUser(body)
    if (requestFor === "deleteItem") return handleDeleteItem(body)
    if (requestFor === "deleteItemsList") return handleDeleteMultipleItems(body)
    if (requestFor === "deleteCategory") return handleDeleteCategory(body)
    return emptyRequest();
};