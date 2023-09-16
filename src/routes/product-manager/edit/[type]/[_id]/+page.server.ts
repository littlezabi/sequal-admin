import { parse } from "$lib/globals";
import { getProduct } from "$lib/item-list";
import type { PageServerLoad } from "../../../../$types";

export const load:PageServerLoad = async ({params}:any)=>{
    let type = params.type
    let _id = params._id
    let product = parse(await getProduct(_id))
    return {type, product}
}