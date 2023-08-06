import type { PageServerLoad } from '../$types'
import {getSettings} from '../../lib/item-list'
export const load:PageServerLoad = async ()=>{
    return {settings: JSON.stringify(await getSettings())} 
}
