import {
	Admin,
	Announcments,
	Firmwares,
	Users,
	blogsModel,
	Categories,
	firmwareCategories,
	Products,
	reviewsModel,
	smartModel,
	Settings,
	CategoryTypes
} from '$lib/models';
import { generateJWT } from '$lib/users';
import bcrypt from 'bcryptjs';

export const getCats = async (merge:boolean = false, type:boolean|string = '', only_fields={}, getTypes = false)=>{
	let cats = await Categories.find(type ? {type} : {}, only_fields).lean();
	let types = [{categoryTypes:[]}]
	if(getTypes) types = await Settings.find({},{categoryTypes:1,_id:0}).lean();
	if(merge) return cats
	return new Response(JSON.stringify({ cats, types:types[0] }), { status: 200 });
}

export const checkCatType = async (t:string) => {
	return new Response(JSON.stringify({exist: await CategoryTypes.count({title: t}) ? true : false}), {status: 200});
}
export const getCatTypes = async () => {
	return await CategoryTypes.find({}, {description: 1, categories: 1, title: 1}).sort('-_id').lean()
}
export const dataCount = async () => {
	const counter = {
		mobiles: await smartModel.count(),
		products: await Products.count(),
		blogs: await blogsModel.count(),
		clients: await Users.count(),
		admin: await Admin.count(),
		reviews: await reviewsModel.count(),
		announcments: await Announcments.count(),
		firmwareCategories: await firmwareCategories.count(),
		firmwares: await Firmwares.count(),
		categories: await Categories.count()
	};
	return new Response(JSON.stringify({ counter }), { status: 200 });
};
// export const getSmartDevices = async (_id: string | number, getCats: any) => {
// 	let cats = [];
// 	let item: any = undefined;
// 	if (_id != 0)
// 		item = await smartModel.findOne(
// 			{ _id },
// 			{
// 				_id: 0,
// 				title: 0,
// 				image: 0,
// 				integrity: 0,
// 				createdAt: 0,
// 				isActive: 0,
// 				updatedAt: 0,
// 				original: 0
// 			}
// 		);
// 	if (getCats != 0)
// 		cats = await getCats(true, getCats, { category: 1, _id: 1})
// 	return new Response(JSON.stringify({ item, cats }), { status: 200 });
// };
export const checkUsername = async (username: string) => {
	return new Response(
		JSON.stringify({
			exist: (await Admin.findOne({ username }, { username: 1 })) ? 1 : 0
		}),
		{ status: 200 }
	);
};
export const adminLogin = async (body: any) => {
	const { username, password } = body;
	let response: any = { message: '', status: 0, admin: false };
	if (username !== '' && password !== '') {
		let admin = await Admin.findOne({ username });
		if (!admin) {
			admin = await Admin.findOne({ email: username });
		}
		if (admin) {
			if (bcrypt.compareSync(password, admin.password)) {
				const a = {
					username: admin.username,
					email: admin.email,
					avatar: admin.avatar,
					_id: admin._id
				};
				const jwt = generateJWT(a);
				response = { message: 'successfully logged!', admin: { ...a, jwt }, status: 1 };
			} else response = { message: 'Username password is incorrect!', status: 0 };
		} else response = { message: 'Username or email is incorrect try again!', status: 0 };
	} else response = { message: 'Authentication is not correct please check it again!', status: 0 };

	return new Response(JSON.stringify(response), { status: 200 });
};
export const emptyRequest = () => {
	return new Response(
		JSON.stringify({ message: "Don't try to access api without authorization!" }),
		{ status: 401 }
	);
};
