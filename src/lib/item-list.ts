import database from './database';
import { smartModel } from './models';

await database.connect();
const projectSmart = {
	title: 1,
	category: 1,
	image: 1,
	integrity: 1,
	createdAt: 1,
	isActive: 1
};
export const mobileList = async (startIndex:number=0, limit:number=20) => {
	const list = await smartModel.find({}, projectSmart ).skip(startIndex).limit(limit).lean();
    return list.map((e:any, i:number) => {return {...e, index: ++i + startIndex}})
};
