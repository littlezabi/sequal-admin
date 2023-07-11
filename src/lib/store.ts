import {writable} from 'svelte/store'

export const themeStore = writable('dark')
export const toggleTheme = (e:null|string)=> themeStore.update((theme)=> e ? e : theme === 'dark' ? 'light' : 'dark')

export const modal:any = writable({visiable: false})
export const modalUpdate = (item:any) => modal.update((modal:any)=>item)

export const static_data:any = writable({categories: []})
export const updateStaticData = (data:any)=> static_data.update((items:any)=> ({...items, ...data}))

export const messages:any = writable({message: false, variant: 'success'})
export const updateMessages:any = (new_message:any = false)=>messages.update(()=>{
    if(new_message) return {variant: 'success', ...new_message}
    return {message: false, variant: 'success'}
})