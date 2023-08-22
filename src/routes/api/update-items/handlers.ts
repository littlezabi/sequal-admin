import { PUBLIC_IMAGES_STATIC_PATH, PUBLIC_PHONE_IMAGE_FOLDER } from '$env/static/public';
import { getRandomChar } from '$lib/globals';
import { Admin, Settings, categoriesModel, smartModel } from '$lib/models';
import { writeFileSync, unlink } from 'fs';
import { join } from 'path';
import sharp from 'sharp';
import { Users } from 'svelte-hero-icons';
import bcrypt from 'bcryptjs';

export const handleDeviceUpdate = async (formData: any, action = 'edit') => {
	try {
		const form = Object.fromEntries(formData);
		const dataframe = JSON.parse(form.df);
		delete dataframe.index;
		delete dataframe.visible;
		let _id = false;
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
					const filePath = join(PUBLIC_IMAGES_STATIC_PATH + 'phones-temp/', image);
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
			const trash = form.removeImages;
			delete dataframe.removeImages;
			if (trash) {
				trash.forEach((e: string): void => {
					try {
						unlink(PUBLIC_IMAGES_STATIC_PATH + PUBLIC_PHONE_IMAGE_FOLDER + e, (e) => {});
					} catch (e) {}
				});
			}
			if (dataframe.old_category !== dataframe.category) {
				await categoriesModel.updateOne(
					{ category: dataframe.old_category },
					{ $inc: { items: -1 } }
				);
				await categoriesModel.updateOne({ category: dataframe.category }, { $inc: { items: 1 } });
			}
			const saved = await smartModel.updateOne(
				{ _id: form._id },
				{ $unset: objectsToDelete, $set: dataframe }
			);
			if (saved) return new Response(JSON.stringify({ success: 1 }), { status: 200 });
			else
				return new Response(JSON.stringify({ message: 'Failed to save!', success: 0 }), {
					status: 200
				});
		}
		delete dataframe.removeImages;
		const exist = await smartModel.findOne({ slug: dataframe.slug }, { _id: 1 });
		if (exist) {
			return new Response(
				JSON.stringify({
					message: 'Slug already exist. sure that you not have same item in db',
					success: 0
				}),
				{ status: 200 }
			);
		} else {
			try {
				dataframe.integrity = ((Object.keys(dataframe).length / 35) * 100).toFixed(1);
				const modal = new smartModel(dataframe);
				await modal.save();
				await categoriesModel.updateOne({ category: dataframe.category }, { $inc: { items: 1 } });
				return new Response(JSON.stringify({ message: `Successfully added!`, success: 1 }), {
					status: 200
				});
			} catch (e: any) {
				return new Response(JSON.stringify({ message: `Error: ${e.message}!`, success: 0 }), {
					status: 200
				});
			}
		}
	} catch (e: any) {
		console.error(e);
		return new Response(JSON.stringify({ message: `Error: ${e.message}`, success: 0 }), {
			status: 200
		});
	}
};

export const handleCategories = async (formData: any) => {
	try {
		const form = Object.fromEntries(formData);
		console.log(form)
	} catch (e) {}
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
				const filePath = join(PUBLIC_IMAGES_STATIC_PATH + 'users', avatar);
				writeFileSync(filePath, resizedImage);
				try {
					unlink(PUBLIC_IMAGES_STATIC_PATH + 'users/' + user.avatar, (e) => {});
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