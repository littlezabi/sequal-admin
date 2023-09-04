import { PUBLIC_IMAGES_STATIC_PATH } from "$env/static/public";
import { getRandomChar } from "$lib/globals";
import { Admin, Users } from "$lib/models";
import {writeFileSync} from 'fs'
import {join} from 'path'
import bcrypt from 'bcryptjs'
import sharp from 'sharp'

// export const createNewDevice

export const handleUser = async (formData:any) => {
    const form = Object.fromEntries(formData);
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
			getRandomChar(12, { numbers: false, lowercase: true }) + '.' + file.name.split('.').pop();
		const arrayBuffer = await file.arrayBuffer();
		const resizedImage = await sharp(arrayBuffer).resize({ width: profileWidth }).toBuffer();
		const filePath = join(PUBLIC_IMAGES_STATIC_PATH + '/images/users', avatar);
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
};
