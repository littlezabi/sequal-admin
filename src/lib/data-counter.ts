import database from './database';
import { Analytics, Firmwares, blogsModel, categoriesModel, laptopsModel, smartModel } from './models';

await database.connect();
export const countCategories = async () => {
	const categories = await categoriesModel.find({}, { _id: 0, image: 0 }).lean();
	const analytics = await Analytics.findOne({}, {_id: 0}).lean()
    const limit = 15
    let topViewsFirm = await Firmwares.find({}, {views: 1, _id: 0}).sort({views: -1}).limit(limit).lean()
    let topViewsPhone = await smartModel.find({}, {views: 1, _id: 0}).sort({views: -1}).limit(limit).lean()
    let topViewsLap = await laptopsModel.find({}, {views: 1, _id: 0}).sort({views: -1}).limit(limit).lean()
    let topViewsBlogs = await blogsModel.find({}, {views: 1, _id: 0}).sort({views: -1}).limit(limit)
	let count_phones_cats: any = {};
	let count_computers_cats: any = {};
    let views_phones:any = []
    let views_firms:any = []
    let views_blogs:any = []
    let views_computer:any = []
    topViewsPhone.map((item:any) => views_phones.push(item.views))
    topViewsFirm.map((item:any) => views_firms.push(item.views))
    topViewsBlogs.map((item:any) => views_blogs.push(item.views))
    topViewsLap.map((item:any) => views_computer.push(item.views))
    
	categories.filter((cat: any) => {
		if (!cat.category) return 0;
		if (cat.type === 'phones') {
			count_phones_cats[cat.category] = cat.items;
		}
		if (cat.type === 'laptops') {
			count_computers_cats[cat.category] = cat.items;
		}
	});
	return {
		count_phones_cats,
		count_computers_cats,
        views_phones,
        views_firms,
        views_blogs,
        views_computer,
		...analytics
	};
};
