import {writable} from 'svelte/store'
import cookies from 'js-cookie'
console.log()

export const themeStore = writable('dark')
export const toggleTheme = (e:null|string)=> themeStore.update((theme)=> e ? e : theme === 'dark' ? 'light' : 'dark')

export const modal:any = writable({visible: false})
export const modalUpdate = (item:any) => modal.update((modal:any)=>item)

export const static_data:any = writable({categories: [], settings: {}, countries: []})
export const updateStaticData = (data:any)=> static_data.update((items:any)=> ({...items, ...data}))

export const adminSession:any = writable(cookies.get('admin') ? JSON.parse(cookies.get('admin') ?? '{}') : false)
export const updateAdmin = (admin:any)=> adminSession.update((user:any)=> admin)

export const messages:any = writable({message: false, variant: 'success'})
export const updateMessages:any = (new_message:any = false)=>messages.update(()=>{
    if(new_message) return {variant: 'success', ...new_message}
    return {message: false, variant: 'success'}
})