import database from './database';
import {
	Admin,
	Products,
	Settings,
	Users,
	Categories,
	smartModel,
	CategoryTypes
} from '$lib/models';
import mongoose from 'mongoose';

await database.connect();
const projectSmart = {
	title: 1,
	category: 1,
	images: 1,
	integrity: 1,
	createdAt: 1,
	isActive: 1
};

export const getCategories = async (
	startIndex: number,
	limit: number,
	ctype: string,
	category: any,
	filter: any,
	sort: string[]
) => {
	let match: any = false;
	if (filter) match = { [filter[0]]: filter[1] };
	if (category) {
		try {
			category = new mongoose.Types.ObjectId(category);
		} catch (e) {
			category = false;
		}
		match = match ? { $and: [{ category }, { ...match }] } : { category };
	}
	if (ctype) {
		match = match ? { $and: [{ type: ctype }, { ...match }] } : { type: ctype };
	}
	let pipleline: any = [
		{ $match: match ? match : {} },
		{
			$lookup: {
				from: 'category_types',
				localField: 'type',
				foreignField: '_id',
				as: 'type'
			}
		},
		{
			$unwind: {
				path: '$type',
				preserveNullAndEmptyArrays: true
			}
		},
		{
			$facet: {
				count: [{ $count: 'total' }],
				results: [
					{ $skip: startIndex },
					{ $limit: limit },
					{ $sort: { [sort[0]]: sort[1] } },
					{
						$project: {
							category: 1,
							items: 1,
							image: 1,
							'type.title': 1,
							'type._id': 1
						}
					}
				]
			}
		}
	];
	const list = await Categories.aggregate(pipleline).exec();
	return {
		total: list[0]?.count[0]?.total,
		categories: list[0].results.map((e: any, i: number) => {
			let x = {
				...e,
				type_id: e.type._id,
				type_title: e.type.title,
				index: ++i + startIndex
			};
			delete x.type;
			return x;
		})
	};
};

export const getProduct = async (_id: string) => {
	try {
		const product = await Products.findOne({ _id }).lean();
		let category = {};
		if (product)
			category = await Categories.findOne(
				{ _id: new mongoose.Types.ObjectId(product.category) },
				{ type: 1 }
			).lean();
		return { product, category };
	} catch (e) {
		return false;
	}
};
export const productList = async (
	startIndex: number,
	limit: number,
	ctype: string,
	category: any,
	filter: any,
	sort: string[]
) => {
	let match: any = false;
	if (filter) match = { [filter[0]]: filter[1] };
	if (category) {
		try {
			category = new mongoose.Types.ObjectId(category);
		} catch (e) {
			category = false;
		}
		match = match ? { $and: [{ category }, { ...match }] } : { category };
	}
	if (ctype) {
		match = match ? { $and: [{ 'cat.type': ctype }, { ...match }] } : { 'cat.type': ctype };
	}
	let pipleline: any = [
		{
			$lookup: {
				from: 'categories',
				localField: 'category',
				foreignField: '_id',
				as: 'cat'
			}
		},
		{
			$unwind: {
				path: '$category',
				preserveNullAndEmptyArrays: true
			}
		},
		{ $match: match ? match : {} },
		{
			$facet: {
				count: [{ $count: 'total' }],
				results: [
					{ $skip: startIndex },
					{ $limit: limit },
					{ $sort: { [sort[0]]: sort[1] } },
					{
						$project: {
							...projectSmart,
							'cat.category': 1,
							'cat._id': 1,
							'cat.type': 1
						}
					}
				]
			}
		}
	];
	const list = await Products.aggregate(pipleline).exec();
	return {
		total: list[0]?.count[0]?.total,
		mobiles: list[0].results.map((e: any, i: number) => {
			let cats = {};
			if (e.cat[0] && e.cat[0].category) {
				cats = {
					category: e.cat[0].category,
					category_id: e.cat[0]._id,
					category_type: e.cat[0].type
				};
			}
			let x = {
				...e,
				images: e.images.length > 1 ? [e.images[0]] : e.images,
				...cats,
				index: ++i + startIndex
			};
			delete x.cat;
			return x;
		})
	};
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
					title: 1,
					category: 1,
					images: 1,
					integrity: 1,
					createdAt: 1,
					isActive: 1,
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
