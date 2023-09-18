import { PUBLIC_IMAGES_STATIC_PATH } from '$env/static/public';
import { Admin, Products, Users, Categories, smartModel } from '$lib/models';
import { unlink } from 'fs';
import getResponse from '../responses';
export const handleDeleteMultipleItems = async (body: any) => {
	let model = body.model === 'mobile' ? smartModel : Products;
	let products = await model.find({ _id: { $in: body.listIDs } }, { images: 1 });
	if (products) {
		products.forEach((product: any) => {
			const images = product.images;
			images.map((image: string) => {
				if (image !== '' && !image.includes('http')) {
					try {
						unlink(PUBLIC_IMAGES_STATIC_PATH + image, (e) => {});
					} catch (e) {}
				}
			});
		});
	}
	let del_ = await model.deleteMany({_id: {$in: body.listIDs}}, {images: 1})
	return getResponse(del_.deletedCount ? 5 : 6, 200, del_.deletedCount ? 1 : 0);
};
export const handleDeleteItem = async (body: any) => {
	let model = body.model === 'mobile' ? smartModel : Products;
	let product = await model.findOne({ _id: body._id }, { images: 1 });
	if (product) {
		const images = product.images;
		let del_ = undefined;
		del_ = await model.deleteOne({ _id: body._id });
		if (del_.deletedCount) {
			images.map((image: string) => {
				if (image !== '' && !image.includes('http')) {
					try {
						unlink(PUBLIC_IMAGES_STATIC_PATH + image, (e) => {});
					} catch (e) {}
				}
			});
		}
		return getResponse(del_.deletedCount ? 5 : 6, 200, del_.deletedCount);
	}
};
export const handleDeleteCategory = async (body: any) => {
	const image = body.image;
	const delete_ = await Categories.deleteOne({ _id: body._id });
	if (delete_.deletedCount) {
		if (image !== '' && !image.includes('http'))
			unlink(PUBLIC_IMAGES_STATIC_PATH + image, (e) => {});
	}
	return getResponse(delete_.deletedCount ? 5 : 6, 200, delete_.deletedCount);
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
	return getResponse(delete_.deletedCount ? 5 : 6, 200, delete_.deletedCount);
};
