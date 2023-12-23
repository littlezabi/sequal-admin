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
	CategoryTypes
} from '$lib/models';
import { generateJWT } from '$lib/users';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
const reGenObjFromURLParams = (searchParams: any) => {
	let reconstructedObject = {};
	for (let [key, value] of searchParams.entries()) {
		let keys = key.split('[').map((k: any) => k.replace(']', ''));
		let currentObject: any = reconstructedObject;
		for (let i = 0; i < keys.length; i++) {
			let currentKey = keys[i];
			if (!currentObject[currentKey]) {
				currentObject[currentKey] = {};
			}
			if (i === keys.length - 1) {
				currentObject[currentKey] =
					value === '1' || value === '0'
						? Number(value)
						: value === 'true' || value === 'false'
						? JSON.parse(value)
						: value;
			} else {
				currentObject = currentObject[currentKey];
			}
		}
	}
	return reconstructedObject;
};
export const getCatsAndTypes = async (params: any) => {
	let res: any = {};
	params = reGenObjFromURLParams(params);
	if (params.getCats) {
		if (typeof params.getTypes === 'string') {
			res.cats = await Categories.find(
				{ type: new mongoose.Types.ObjectId(params.getTypes) },
				params.options.getCatsFieldOnly ? params.options.getCatsFieldOnly : {}
			);
		} else {
			let pipleline: any = [
				{
					$lookup: {
						from: 'category_types',
						localField: 'type',
						foreignField: '_id',
						as: 'cat_type'
					}
				},
				{
					$unwind: {
						path: '$cat_type',
						preserveNullAndEmptyArrays: true
					}
				},
				{
					$facet: {
						results: [
							{
								$project: {
									...params.options.getCatsFieldOnly ? params.options.getCatsFieldOnly : {},
									'cat_type.title': 1,
									'cat_type._id': 1
								}
							}
						]
					}
				}
			];
			const list = await Categories.aggregate(pipleline).exec();
			// let c = list[0].results.map((e: any, i: number) => {
			// 	let x = {
			// 		...e,
			// 		type_id: e.cat_type._id,
			// 		type_title: e.cat_type.title
			// 	};
			// 	delete x.cat_type;
			// 	return x;
			// });

			// console.log(c);
			res.cats = list[0].results
		}
	}
	if (params.getTypes === true) {
		res.types = await CategoryTypes.find(
			{},
			params.options.getTypesFieldOnly ? params.options.getTypesFieldOnly : {}
		);
	}
	return new Response(JSON.stringify(res), { status: 200 });
};

export const checkCatType = async (t: string) => {
	return new Response(
		JSON.stringify({ exist: (await CategoryTypes.count({ title: t })) ? true : false }),
		{ status: 200 }
	);
};
export const getCatTypes = async () => {
	return await CategoryTypes.find({}, { description: 1, categories: 1, title: 1 })
		.sort('-_id')
		.lean();
};
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
