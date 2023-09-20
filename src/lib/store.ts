import { writable, type Writable } from 'svelte/store';
import cookies from 'js-cookie';

export const modal: any = writable({ visible: false });
export const modalUpdate = (item: any) => modal.update((modal: any) => item);

export const promptModal: any = writable({ visible: false });
export const promptModalUpdate = (item: {
	visible: boolean;
	title?: String;
	description?: String;
	remove_close_button?: boolean,
	form?: {
		inputs?: {
			label: string;
			type?: string;
			name?: string;
			id?: string;
			value?: string;
			placeholder?: string;
			callback?: (e: Event) => void;
			required?: boolean;
		}[];
		onSubmit?: (e?: any) => void;
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

export const static_data: any = writable({
	categories: [],
	settings: {no_settings: true},
	countries: [],
	counter: false
});
export const updateStaticData = (data: any) =>
	static_data.update((items: any) => ({ ...items, ...data }));

export const adminSession: any = writable(
	cookies.get('admin') ? JSON.parse(cookies.get('admin') ?? '{}') : false
);
export const updateAdmin = (admin: any) => adminSession.update((user: any) => admin);

interface Message{
	message: string | boolean;
	variant?: string | null;
	closing_time?: number | null;
}
export const messages: Writable<Message> = writable({ message: false, variant: 'success', closing_time: 6000 });
export const updateMessages = (new_message: Message|null) =>
	messages.update(() => {
		if (new_message) return { variant: 'success', ...new_message };
		return { message: false };
	});
