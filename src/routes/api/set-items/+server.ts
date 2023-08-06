import jwt from 'jsonwebtoken';
import { getRandomChar } from '$lib/globals.js';
import { Admin, Users } from '$lib/models.js';
import { PUBLIC_IMAGES_STATIC_PATH } from '$env/static/public';
import { writeFileSync } from 'fs';
import bcrypt from 'bcryptjs'
import { join } from 'path';
import sharp from 'sharp';

export const POST = async ({ request }: any) => {
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
		if (user) return new Response(JSON.stringify({ message: `${userType} exist`, success: 0 }));
		let avatar = form.avatar;
		let profileWidth = Number(form.profileWidth);
		delete form.profileWidth;
		delete form.postKey;
		delete form.re_password;
		delete form.userType;
		if (avatar !== '' && (form.avatar as File).name !== undefined) {
			const file = avatar as File;
			avatar = getRandomChar(12, false, false) + '.' + file.name.split('.').pop();
			const arrayBuffer = await file.arrayBuffer();
			const resizedImage = await sharp(arrayBuffer).resize({ width: profileWidth }).toBuffer();
			const filePath = join(PUBLIC_IMAGES_STATIC_PATH + 'users', avatar);
			writeFileSync(filePath, resizedImage);
		}
		form.avatar = avatar
		form.password = bcrypt.hashSync(form.password)
		console.log('form: ', form);
		if(userType === 'admin'){
			const admin = new Admin(form)

			admin.save()
		}
		console.log('done');
	}
	return new Response(JSON.stringify({ ok: 'yes' }), { status: 200 });
};
