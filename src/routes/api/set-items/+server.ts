import { getRandomChar } from '$lib/globals.js';
import { Admin, Users } from '$lib/models.js';
import { PUBLIC_IMAGES_STATIC_PATH } from '$env/static/public';
import { writeFileSync } from 'fs';
import bcrypt from 'bcryptjs';
import { join } from 'path';
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
	const form = Object.fromEntries(await request.formData());
	const postKey = form.postKey;
	if (postKey === 'adduser-1') {
		let modal = undefined;
		const userType = form.userType;
		if (form.password !== form.re_password)
			return new Response(JSON.stringify({ message: `password not matched`, success: 0 }));
		if (userType === 'admin') modal = Admin;
		else modal = Users;
		const user = await modal.findOne({ email: form.email });
		if (user)
			return new Response(
				JSON.stringify({
					message: `${userType} already exist with this email address!`,
					success: 0
				})
			);
		if (userType === 'admin' && (await modal.findOne({ username: form.username })))
			return new Response(
				JSON.stringify({
					message: `Admin with this username is already exist please change it!`,
					success: 0
				})
			);
		let avatar = form.avatar;
		let profileWidth = Number(form.profileWidth);
		delete form.profileWidth;
		delete form.postKey;
		delete form.re_password;
		delete form.userType;
		if (avatar && avatar !== '' && (form.avatar as File).name !== undefined) {
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
		} else avatar = '';
		form.avatar = avatar;
		form.password = bcrypt.hashSync(form.password);
		if (userType !== 'admin') {
			form.code = getRandomChar(30, { separator: '-' });
		}
		let user_modal = userType === 'admin' ? new Admin(form) : new Users(form);
		await user_modal.save();
		return new Response(
			JSON.stringify({
				message: 'successfully added',
				success: 1
			}),
			{ status: 200 }
		);
	}
	return new Response(JSON.stringify({ ok: 'yes' }), { status: 200 });
};
