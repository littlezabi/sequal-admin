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
export const getCategories = async (skip:number=0, limit:number=20)=>{
	return await categoriesModel.find().skip(skip).limit(limit).sort('-_id')
}
export const mobileList = async (startIndex:number=0, limit:number=20) => {
	const list = await smartModel.find({}, projectSmart ).skip(startIndex).limit(limit).sort("-_id").lean();
    return list.map((e:any, i:number) => {return {...e, images: e.images.length > 1 ? [e.images[0]] : e.images, index: ++i + startIndex}})
};

export const getSettings = async ()=>{
	return await Settings.findOne({}, {cookiesOptions: 0, oneTimeAdminLoginKey:0, updatedAt: 0});
}
export const getUsers = async (startIndex:number = 0, limit:number = 20)=>{
	const users = await Users.find().skip(startIndex).limit(limit).sort('-_id').lean();
	const admins = await Admin.find().lean();
	return {users: users.map((e:any, x:number) => {return {...e, index: ++x + startIndex}}), admins: admins.map((e:any, x:any) => {return {...e, index: ++x}})}
}
