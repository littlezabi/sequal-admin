import {writable} from 'svelte/store'

export const themeStore = writable('dark')
export const toggleTheme = (e:null|string)=> themeStore.update((theme)=> e ? e : theme === 'dark' ? 'light' : 'dark')