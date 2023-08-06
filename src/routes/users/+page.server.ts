import { getUsers } from "$lib/item-list";
import { authenticateAdminKey } from "$lib/users";
import type { PageServerLoad } from "./$types";
import { redirect } from '@sveltejs/kit';

export const load:PageServerLoad = async ({cookies})=>{
    let access = false
    const session = cookies.get('admin')
    const adminKey = cookies.get('admin_key')
    if(adminKey) access = await authenticateAdminKey(adminKey)
    if(access){
        const {users, admins} = await getUsers()
        return {
            users:JSON.stringify(users),
            admins: JSON.stringify(admins),
        }
    }else{
        throw redirect(302, '/login')
    }
}