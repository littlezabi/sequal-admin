import { PUBLIC_IMAGES_STATIC_PATH } from '$env/static/public';
import { getRandomChar } from '$lib/globals';
import { Admin, Settings, Users, smartModel } from '$lib/models';
import { writeFileSync, unlink } from 'fs';
import { join } from 'path';
import bcrypt from 'bcryptjs';
import sharp from 'sharp';
import { authenticateAdmin } from '$lib/users';
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
	try {
		const form = Object.fromEntries(await request.formData());
		const postKey = form.postKey;
		if (postKey === 'updateMobileDevice') {
			const dataframe = JSON.parse(form.df);
			let images: any = [];

			const _id = form._id;
			console.log('image: ', images);
			delete form._id;
			delete form.postKey;
			form.images = [];
			Object.keys(form).filter(async (e) => {
				if (e !== 'df' && e.includes('image-')) {
					try {
						if ((form[e] as File).name !== undefined) {
							const file = form[e] as File;
							let image =
								file.name.replaceAll(/\s/gi, '').substring(0, 10) +
								'-' +
								getRandomChar(4, { numbers: false, lowercase: true }) +
								'.' +
								file.name.split('.').pop();
							image = image.toLowerCase();
							const arrayBuffer: any = await file.arrayBuffer();
							const filePath = join(PUBLIC_IMAGES_STATIC_PATH + 'phones-temp/', image);
							writeFileSync(filePath, Buffer.from(arrayBuffer));
							form.images.push(image);
							/* try {
								unlink(PUBLIC_IMAGES_STATIC_PATH + 'users/' + user.avatar, (e) =>
									console.log(e)
								);
							} catch (e) {} */
						}
					} catch (e) {
						console.error('Error: ', e);
					}
				}
			});

			// const saved = await smartModel.updateOne({ _id }, { $set: dataframe });

			// console.log('form: ', form, 'saved: ', saved);
			return new Response(JSON.stringify(form), { status: 200 });
		}
		if (postKey === 'updateUser-1') {
			try {
				let modal = undefined;
				delete form.username;
				delete form.email;
				if (form.new_username) {
					form.username = form.new_username;
					delete form.new_username;
				}
				console.log('form: ', form);

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

				const user = await modal
					.findOne({ _id: form._id }, { username: 1, _id: 1, avatar: 1 })
					.lean();
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
							getRandomChar(12, { numbers: false, lowercase: true }) +
							'.' +
							file.name.split('.').pop();
						const arrayBuffer = await file.arrayBuffer();
						const resizedImage = await sharp(arrayBuffer)
							.resize({ width: profileWidth })
							.toBuffer();
						const filePath = join(PUBLIC_IMAGES_STATIC_PATH + 'users', avatar);
						writeFileSync(filePath, resizedImage);
						try {
							unlink(PUBLIC_IMAGES_STATIC_PATH + 'users/' + user.avatar, (e) => console.log(e));
						} catch (e) {}
					}
				}
				form.avatar = avatar;
				if (form.password) form.password = bcrypt.hashSync(form.password);
				console.log('form:1 ', form);
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
		}
	} catch (e) {}
	try {
		const req = await request.json();
		if (req.updateSettings) {
			await Settings.updateOne({ _id: req.id }, { $set: req.settings });
		}
		return new Response(JSON.stringify({ request: req }), { status: 200 });
	} catch (error) {}
};
