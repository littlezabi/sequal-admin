import { PUBLIC_IMAGES_STATIC_PATH, PUBLIC_PHONE_IMAGE_FOLDER } from '$env/static/public';
import { getRandomChar } from '$lib/globals';
import { Admin, Settings, Categories, Products, smartModel, CategoryTypes } from '$lib/models';
import { writeFileSync, unlink } from 'fs';
import { join } from 'path';
import sharp from 'sharp';
import { Users } from 'svelte-hero-icons';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import getResponse from '../responses';

export const uploadImages = (images: any): string[] => {
	let f = [];
	if (Array.isArray(images))
		images.forEach(async (e: any) => {
			if (typeof e === 'string') f.push(e);
			else if ((e as File).name !== undefined) {
				try {
					const file = e as File;
					let image = file.name.replaceAll(/\s/gi, '').split('.')[0];
					if (image.length > 15) image = image.substring(0, 15);
					image =
						'images/products/' +
						image +
						'-' +
						getRandomChar(5, { numbers: false, lowercase: true }) +
						'.' +
						file.name.split('.').pop();
					image = image.toLowerCase();
					f.push(image);
					const arrayBuffer: any = await file.arrayBuffer();
					const filePath = join(PUBLIC_IMAGES_STATIC_PATH, image);
					writeFileSync(filePath, Buffer.from(arrayBuffer));
				} catch (e) {
					console.error('Error: ', e);
				}
			}
		});
	else if (typeof images === 'string') f.push(images);
	return f;
};
export const deleteImages = (trash: [] | string): void => {
	let del_ = (e: string) => {
		try {
			unlink(PUBLIC_IMAGES_STATIC_PATH + PUBLIC_PHONE_IMAGE_FOLDER + e, (e) => {});
		} catch (e) {}
	};
	if (trash) {
		if (Array.isArray(trash)) trash.forEach((e: string): void => del_(e));
		else if (typeof trash === 'string') del_(trash);
	}
};
export const handleProduct = async (formData: any, action = 'edit') => {
	try {
		const form = Object.fromEntries(formData);
		const dataframe = JSON.parse(form.df);
		const info = JSON.parse(form.info);
		if (
			!dataframe.asDraft &&
			(await Products.findOne(
				action === 'new'
					? { slug: dataframe.slug }
					: {
							slug: dataframe.slug,
							_id: { $ne: new mongoose.Types.ObjectId(dataframe._id) }
					  },
				{ _id: 1 }
			))
		)
			return getResponse(4);
		let images: File[] = [];
		Object.keys(form).forEach((e) => {
			if (e.includes('image_') && form[e]) images.push(form[e]);
		});
		dataframe.images = uploadImages(images);
		if (action === 'edit') {
			delete dataframe._id
			if (info.removeImages) deleteImages(info.removeImages);
			if (info.new_category && info.new_category !== dataframe.category) {
				await Categories.updateOne({ _id: dataframe.category }, { $inc: { items: -1 } });
				await Categories.updateOne({ _id: info.new_category }, { $inc: { items: 1 } });
				dataframe.category = info.new_category;
			}
			if(dataframe.category) dataframe.category = new mongoose.Types.ObjectId(dataframe.category);
			const saved = await Products.updateOne(
				{ _id: info._id },
				{
					$set: { ...dataframe},
				}
			);
			if (dataframe.asDraft) return getResponse(undefined, 200, 1, { message: `Draft Saved!`, product:dataframe});
			else if (saved) return new Response(JSON.stringify({ success: 1 }), { status: 200 });
			else
				return new Response(JSON.stringify({ message: 'Failed to save!', success: 0 }), {
					status: 200
				});
		}
		delete dataframe.removeImages;
		if(dataframe.category) dataframe.category = new mongoose.Types.ObjectId(dataframe.category);
		try {
			const modal = new Products(dataframe);
			const product = await modal.save();
			if (dataframe.category)
				await Categories.updateOne({ _id: dataframe.category }, { $inc: { items: 1 } });
			if (product.asDraft) return getResponse(undefined, 200, 1, { message: `Draft Saved!`, product});
			return getResponse(3, 200, 1);
		} catch (e: any) {
			return getResponse(undefined, 200, 0, { message: `Error: ${e.message}!` });
		}
	} catch (e: any) {
		console.error(e);
		return getResponse(undefined, 200, 0, { message: `Error: ${e.message}!` });
	}
};
export const handleDeviceUpdate = async (formData: any, action = 'edit') => {
	try {
		const form = Object.fromEntries(formData);
		const dataframe = JSON.parse(form.df);
		const info = JSON.parse(form.info);
		dataframe.images = [];
		let images: any = Object.keys(form).filter(
			(e) => e !== 'df' && e.includes('image_') && form[e]
		);
		images.map(async (e: any) => {
			if (typeof form[e] !== 'string' && (form[e] as File).name !== undefined) {
				try {
					const file = form[e] as File;
					let image = file.name.replaceAll(/\s/gi, '').split('.')[0];
					if (image.length > 15) image = image.substring(0, 15);
					image =
						image +
						'-' +
						getRandomChar(5, { numbers: false, lowercase: true }) +
						'.' +
						file.name.split('.').pop();
					image = image.toLowerCase();
					dataframe.images.push(image);
					const arrayBuffer: any = await file.arrayBuffer();
					const filePath = join(PUBLIC_IMAGES_STATIC_PATH + PUBLIC_PHONE_IMAGE_FOLDER, image);
					writeFileSync(filePath, Buffer.from(arrayBuffer));
					return image;
				} catch (e) {
					console.error('Error: ', e);
				}
			} else {
				dataframe.images.push(form[e]);
			}
		});
		if (action === 'edit') {
			const objectsToDelete = JSON.parse(form.objectsToDelete);
			delete dataframe.objectsToDelete;
			Object.keys(objectsToDelete).forEach((e) => delete dataframe[e]);
			const trash = info.removeImages;
			if (trash) {
				trash.forEach((e: string): void => {
					try {
						unlink(PUBLIC_IMAGES_STATIC_PATH + PUBLIC_PHONE_IMAGE_FOLDER + e, (e) => {});
					} catch (e) {}
				});
			}
			if (info.old_category !== dataframe.category) {
				await Categories.updateOne({ category: dataframe.old_category }, { $inc: { items: -1 } });
				await Categories.updateOne({ category: dataframe.category }, { $inc: { items: 1 } });
			}
			const saved = await smartModel.updateOne(
				{ _id: info._id },
				{
					$unset: objectsToDelete,
					$set: { ...dataframe, category: new mongoose.Types.ObjectId(dataframe.category) }
				}
			);
			if (saved) return getResponse();
			else return getResponse(1);
		}
		delete dataframe.removeImages;
		const exist = await smartModel.findOne({ slug: dataframe.slug }, { _id: 1 });
		if (exist) {
			return getResponse(0);
		} else {
			try {
				dataframe.integrity = ((Object.keys(dataframe).length / 35) * 100).toFixed(1);
				const modal = new smartModel(dataframe);
				await modal.save();
				await Categories.updateOne({ category: dataframe.category }, { $inc: { items: 1 } });
				return getResponse();
			} catch (e: any) {
				return getResponse(undefined, 200, 0, { message: `Error: ${e.message}!` });
			}
		}
	} catch (e: any) {
		return getResponse(undefined, 200, 0, { message: `Error: ${e.message}!` });
	}
};

export const handleCategories = async (formData: any, action = 'edit') => {
	try {
		const form = Object.fromEntries(formData);
		let _id = form._id;
		let dataframe = JSON.parse(form.df);
		if (form.image) {
			if ((form.image as File).name !== undefined) {
				const file = form.image as File;
				let image_name =
					'/images/logos/' +
					getRandomChar(12, { numbers: false, lowercase: true }) +
					'.' +
					file.name.split('.').pop();
				image_name = image_name.toLowerCase();
				dataframe.image = image_name;
				const arrayBuffer: any = await file.arrayBuffer();
				const filePath = join(PUBLIC_IMAGES_STATIC_PATH, image_name);
				writeFileSync(filePath, Buffer.from(arrayBuffer));
				if (action === 'edit') {
					try {
						if (form.old_image !== form.image)
							unlink(PUBLIC_IMAGES_STATIC_PATH + form.old_image, (e) => {});
					} catch (e) {}
				}
			}
		}
		if (action === 'edit') delete dataframe.old_image;
		dataframe.type = new mongoose.Types.ObjectId(dataframe.type)
		delete dataframe.old_category_name;
		delete dataframe.old_category_type;

		if (action === 'edit') {
			await Categories.updateOne({ _id }, { $set: dataframe });
			return new Response(
				JSON.stringify({
					message: `Successfully updated!`,
					success: 1
				})
			);
		} else {
			const c = new Categories(dataframe);
			await c.save();
			await CategoryTypes.updateOne({_id: dataframe.type}, {$inc: {categories: 1}})
			return new Response(
				JSON.stringify({
					message: `Successfully created!`,
					success: 1
				})
			);
		}
	} catch (e: any) {
		return new Response(
			JSON.stringify({
				message: `Error: ${e.message}`,
				success: 0
			}),
			{ status: 200 }
		);
	}
};
export const handleUpdateUser = async (formData: any) => {
	try {
		const form = Object.fromEntries(formData);
		let modal = undefined;
		delete form.username;
		delete form.email;
		if (form.new_username) {
			form.username = form.new_username;
			delete form.new_username;
		}
		const userType = form.userType;
		if (userType === 'admin') modal = Admin;
		else modal = Users;
		if (form.new_email) {
			form.email = form.new_email;
			if (userType === 'admin' && (await modal.findOne({ email: form.email })))
				return new Response(
					JSON.stringify({
						message: `This email address is already exist!`,
						success: 0
					})
				);
			delete form.new_email;
		}
		if (form.password && form.password !== form.re_password)
			return new Response(JSON.stringify({ message: `password not matched`, success: 0 }));

		if (
			userType === 'admin' &&
			form.username &&
			(await modal.findOne({ username: form.new_username }))
		)
			return new Response(
				JSON.stringify({
					message: `Admin with this username is already exist please change it!`,
					success: 0
				})
			);

		const user = await modal.findOne({ _id: form._id }, { username: 1, _id: 1, avatar: 1 }).lean();
		if (!user)
			return new Response(JSON.stringify({ message: 'User not found', success: 0 }), {
				status: 200
			});

		let avatar = form.avatar;
		let profileWidth = Number(form.profileWidth);
		delete form.profileWidth;
		delete form.postKey;
		delete form.re_password;
		delete form.userType;
		delete form.new_username;
		if (avatar && avatar !== '') {
			if ((form.avatar as File).name !== undefined) {
				const file = avatar as File;
				avatar =
					getRandomChar(12, { numbers: false, lowercase: true }) + '.' + file.name.split('.').pop();
				const arrayBuffer = await file.arrayBuffer();
				const resizedImage = await sharp(arrayBuffer).resize({ width: profileWidth }).toBuffer();
				const filePath = join(PUBLIC_IMAGES_STATIC_PATH + '/images/users', avatar);
				writeFileSync(filePath, resizedImage);
				try {
					unlink(PUBLIC_IMAGES_STATIC_PATH + '/images/users/' + user.avatar, (e) => {});
				} catch (e) {}
			}
		}
		form.avatar = avatar;
		if (form.password) form.password = bcrypt.hashSync(form.password);
		let _id = form._id;
		delete form._id;
		delete form.index;
		await modal.updateOne({ _id: _id }, { $set: form });
		return new Response(
			JSON.stringify({
				message: 'successfully updated',
				success: 1
			}),
			{ status: 200 }
		);
	} catch (e: any) {
		return new Response(
			JSON.stringify({
				message: `Error: ${e.message}`,
				success: 0
			}),
			{ status: 200 }
		);
	}
};

export const updateSettings = async (jsonRequest: any) => {
	await Settings.updateOne({ _id: jsonRequest.id }, { $set: jsonRequest.settings });
	return new Response(JSON.stringify({ request: jsonRequest }), { status: 200 });
};
