import database from "$lib/database"
import { categoriesModel, smartModel } from "$lib/models"

export const GET = async ({url}:any)=>{
    if(url.searchParams.get('smart_device'))
    {
        let cats = []
        const item:any = await smartModel.findOne({_id: url.searchParams.get('_id')}, {
            _id: 0,
            title: 0,
            category: 0,
            image: 0,
            integrity: 0,
            createdAt: 0,
            isActive: 0,
        })
        if(Number(url.searchParams.get('getCats'))) cats = await categoriesModel.find({}, {image: 0}).lean()
        return new Response(JSON.stringify({item, cats}), {status: 200})
    }
}