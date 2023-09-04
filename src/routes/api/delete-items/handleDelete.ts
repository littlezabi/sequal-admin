import { PUBLIC_IMAGES_STATIC_PATH, PUBLIC_PHONE_IMAGE_FOLDER } from '$env/static/public';
import { Admin, Users, categoriesModel, smartModel } from '$lib/models';
import { unlink } from 'fs';
export const handleDeleteItem = async (body: any) => {
	const images = body.images;
	let del_ = undefined;
	if (body.model === 'mobile') del_ = await smartModel.deleteOne({ _id: body._id });
	if (del_.deletedCount) {
		images.map((image: string) => {
			if (image !== '' && !image.includes('http')) {
				try {
					unlink(PUBLIC_IMAGES_STATIC_PATH + PUBLIC_PHONE_IMAGE_FOLDER + image, (e) => {});
				} catch (e) {}
			}
		});
	}
	return new Response(
		JSON.stringify({
			message: del_.deletedCount
				? 'Item deleted successfully!'
				: 'Item not deleted please try again!',
			success: del_.deletedCount
		})
	);
};
export const handleDeleteCategory = async (body: any) => {
	const image = body.image;
	const delete_ = await categoriesModel.deleteOne({ _id: body._id });
	if (delete_.deletedCount) {
		if (image !== '' && !image.includes('http'))
			unlink(PUBLIC_IMAGES_STATIC_PATH + image, (e) => {});
	}
	return new Response(
		JSON.stringify({
			message: delete_.deletedCount
				? 'Category deleted successfully!'
				: 'Category not deleted please try again!',
			success: delete_.deletedCount
		})
	);
};
export const handleDeleteUser = async (body: any) => {
	const image = body.avatar;
	let delete_: any = undefined;
	if (body.model === 'clients') delete_ = await Users.deleteOne({ _id: body._id });
	else delete_ = await Admin.deleteOne({ _id: body._id });
	if (delete_.deletedCount) {
		if (image !== '' && !image.includes('http'))
			unlink(PUBLIC_IMAGES_STATIC_PATH + '/images/users/' + image, (e) => {});
	}
	return new Response(
		JSON.stringify({
			message: delete_.deletedCount
				? 'User deleted successfully!'
				: 'User not deleted please try again!',
			success: delete_.deletedCount
		})
	);
};
