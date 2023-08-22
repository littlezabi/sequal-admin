import { getCategories } from "$lib/item-list";
import type { PageServerLoad } from "./$types";

export const load = (async ()=>{
    return {
        categories: JSON.stringify(await getCategories())
    }
}) satisfies PageServerLoad