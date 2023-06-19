import { mobileList } from "$lib/item-list"
// import type { PageServerLoad } from "./$types"
export const load= async ()=>{
    return {list: JSON.parse(JSON.stringify(await mobileList()))}
}