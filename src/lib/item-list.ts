import database from './database';
import { Admin, Settings, Users, categoriesModel, smartModel } from '$lib/models';

await database.connect();
const projectSmart = {
	title: 1,
	category: 1,
	images: 1,
	integrity: 1,
	createdAt: 1,
	isActive: 1
};
export const getCategories = async (skip: number = 0, limit: number = 20) => {
	return await categoriesModel.find().skip(skip).limit(limit).sort('-_id');
};
export const mobileList = async (startIndex: number, limit: number) => {
	const list = await smartModel
		.aggregate([
			{ $skip: startIndex },
			{ $limit: limit },
			{ $sort: { _id: -1 } },
			{
				$lookup: {
					from: 'categories',
					localField: 'category',
					foreignField: '_id',
					as: 'cat'
				}
			},
			{ $unwind: '$cat' },
			{
				$project: {
					...projectSmart,
					'cat.category': 1,
					'cat._id': 1
				}
			}
		])
		.exec();
	return list.map((e: any, i: number) => {
		let x = {
			...e,
			images: e.images.length > 1 ? [e.images[0]] : e.images,
			category: e.cat.category,
			category_id: e.cat._id,
			index: ++i + startIndex
		};
		delete x.cat;
		return x;
	});
};

export const getSettings = async (): Promise<object[]> => {
	return await Settings.findOne({}, { cookiesOptions: 0, oneTimeAdminLoginKey: 0, updatedAt: 0 });
};
export const getUsers = async (
	startIndex: number = 0,
	limit: number = 20,
	user_type: string = 'users'
) => {
	if (user_type === 'clients')
		return await Users.find().skip(startIndex).limit(limit).sort('-_id').lean();
	else return await Admin.find().lean();
};
