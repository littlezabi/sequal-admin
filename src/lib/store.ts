import { writable } from 'svelte/store';
import cookies from 'js-cookie';

export const themeStore = writable('dark');
export const toggleTheme = (e: null | string) =>
	themeStore.update((theme) => (e ? e : theme === 'dark' ? 'light' : 'dark'));

export const modal: any = writable({ visible: false });
export const modalUpdate = (item: any) => modal.update((modal: any) => item);

export const promptModal: any = writable({ visible: false });
export const promptModalUpdate = (item: {
	visible: boolean;
	title?: String;
	description?: String;
	form?: {
		inputs?: {
			label: string;
			type?: string;
			name?: string;
			id?: string;
			value?: string;
			placeholder?: string;
			callback?: () => void;
			required?: boolean;
		}[];
		onSubmit?: (e?:any) => void;
		buttons?: {
			title: string;
			type?: any;
			class?: string;
			callback?: (e: any | undefined) => void;
		}[];
	};
	confirm?: {
		title: string;
		type?: any;
		class?: string;
		callback: null | ((e: any | undefined) => void);
	}[];
}) => {
	if (item.visible === false) {
		promptModal.update((prev: any) => {
			return { ...prev, visible: false };
		});
		setTimeout(() => {
			promptModal.update((prev: any) => {
				return {
					visible: false
				};
			});
		}, 1000);
	} else promptModal.update(() => item);
};

export const static_data: any = writable({ categories: [], settings: {}, countries: [], counter: false });
export const updateStaticData = (data: any) =>
	static_data.update((items: any) => ({ ...items, ...data }));

export const adminSession: any = writable(
	cookies.get('admin') ? JSON.parse(cookies.get('admin') ?? '{}') : false
);
export const updateAdmin = (admin: any) => adminSession.update((user: any) => admin);

export const messages: any = writable({ message: false, variant: 'success' });
export const updateMessages: any = (new_message: any = false) =>
	messages.update(() => {
		if (new_message) return { variant: 'success', ...new_message };
		return { message: false, variant: 'success' };
	});
