<script lang="ts">
	import axios from 'axios';
	import { Icon, Photo, XMark } from 'svelte-hero-icons';
	import { modal, modalUpdate, static_data, updateMessages, updateStaticData } from '$lib/store';
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	import { PUBLIC_IMAGES_FETCH_URI } from '$env/static/public';
	import Loading from './loading.svelte';
	import { fade } from 'svelte/transition';
	import CustomNumberInput from './custom-number-input.svelte';
	import CatsType from './cats-type.svelte';

	export let type_list: any = [];
	let message: any = false;
	$: message, updateMessages(message);
	let item = $modal.item;
	let dataframe: any = { ...item, old_type: item.type_id, old_image: item.image, old_category_name: item.category };
	let cat_logo: any = '';
	let items: number = item.items;
	let loading = false;
	let changesHappened = false;
	document.querySelector('body')?.classList.add('modal-open');
	const handleClose = async () => {
		document.querySelector('body')?.classList.remove('modal-open');
		const ref = $modal.no_refresh;
		modalUpdate({ visible: false });
		if (ref) return 1;
		if (changesHappened) location.href = `/categories`;
	};
	const handleForm = async () => {
		loading = true;
		dataframe.items = items;
		delete dataframe.type_id;
		delete dataframe.type_title;
		let df = dataframe;
		if (df.category === '') {
			message = { message: 'Please enter category name!', variant: 'danger' };
			return 0;
		}
		if (df.type === 'un-selected') {
			message = { message: 'Please select category type!', variant: 'danger' };
			return 0;
		}
		const form = new FormData();
		if (df.image && typeof df.image !== 'string') {
			form.append('image', df.image);
			if ($modal.action === 'edit') form.append('old_image', df.old_image);
			delete df.image;
		}
		if ($modal.action === 'edit') {
			form.append('_id', df._id);
			delete df._id;
		}
		delete df.old_image;
		form.append('df', JSON.stringify(df));
		axios
			.post(`/api/${$modal.action === 'edit' ? 'update-items' : 'set-items'}`, form, {
				headers: { requestFor: $modal.action === 'edit' ? 'updateCategories' : 'newCategory' }
			})
			.then((res) => {
				changesHappened = true;
				loading = false;
				if (res.data?.success)
					 message = { message: res.data.message, variant: 'success' };
				
				else message = { message: `Error ${res.data.message}`, variant: 'danger' };
			})
			.catch((e) => {
				loading = false;
				console.error(e);
			});
	};
	const __ixq = (): void => {
		const element = document.querySelector('#phone-image') as HTMLElement;
		element.click();
	};
	const handleImage = (file: any) => {
		[...file.target.files].forEach((image) => {
			dataframe.image = image;
			let reader = new FileReader();
			reader.onload = (e: any) => (cat_logo = e.target.result);
			reader.readAsDataURL(image);
		});
	};

	onMount(async () => {
		if (!type_list.length) {
			await axios
				.get('/api/get-items', { params: { getCatTypes: 1 } })
				.then((e) => {
					type_list = e.data;
					dispatch('newCatList', type_list);
				})
				.catch((e) => console.error(e));
		}
	});
	const updateCats = async (categories: any) => {
		type_list = categories;
		changesHappened = true;
		await axios
			.post(
				'/api/update-items/',
				{ settings: { categoryTypes: categories }, id: $static_data.settings._id },
				{ headers: { requestFor: 'updateSettings' } }
			)
			.then(() => {
				let newSetting = { ...$static_data.settings, categoryTypes: categories };
				updateStaticData(newSetting);
				message = { message: 'updated successfully!', variant: 'success' };
			})
			.catch((e) => {
				console.error(e);
				message = { message: `Error: ${e.message}`, variant: 'danger' };
			});
	};
	const handleInputs = (e: Event) => {
		let v = e.target as HTMLInputElement;
		dataframe[v.name] = v.value;
	};
	const dispatch = createEventDispatcher();
	const updateCatDispatcherListener = (event: any) => {
		type_list = event.detail;
		dispatch('newCatList', type_list);
	};
</script>

<div class="modal" transition:fade>
	<button on:click={handleClose} type="button" class="close-btn"><Icon src={XMark} /></button>
	<div class="inner-modal">
		<div class="form" id="dataframe-form">
			<h2>{$modal.title}</h2>
			<p>
				You can add new, update or delete the categories. take any action carefully there is no
				change to undo your actions.
			</p>
			<form on:submit|preventDefault={handleForm} id="phone-form">
				<div class="flex-yxz">
					<div class="a03x full-w">
						<label for="title">CATEGORY TITLE HERE</label>
						<input
							type="text"
							name="category"
							id="title"
							placeholder="E.g. APPLE - SAMSUNG"
							value={$modal.action === 'edit' ? item.category : ''}
							on:change={handleInputs}
							required
						/>
					</div>
				</div>
				<div class="flex-yxz">
					<div class="a03x">
						<label for="category">CATEGORY TYPE</label>
						<select name="type" id="category" on:change={handleInputs}>
							{#if $modal.action === 'new'}
								<option disabled selected value="un-selected">Select category type</option>{/if}
							{#each type_list as cat}
								{#if item.type_id === cat._id}
									<option selected value={cat._id}>{cat.title}</option>
								{:else}
									<option value={cat._id}>{cat.title}</option>
								{/if}
							{/each}
						</select>
					</div>
				</div>
				<CatsType types_list={type_list} on:updateCats={updateCatDispatcherListener} />
				<div class="flex-yxz">
					<div class="a03x full-w image-input">
						<label for="phone-image">CATEGORY LOGO</label>
						{#if loading}
							<Loading />
						{:else}
							<div class="add-image" on:mousedown={__ixq} style="background:#fff;">
								{#if cat_logo !== ''}
									<img
										style="width:100%;height:100%;object-fit:contain;border-radius: 8px;"
										src={cat_logo}
										alt="logo"
									/>
								{:else if item.image && item.image !== ''}
									<img
										style="width:100%;height:100%;object-fit:contain;border-radius: 8px;"
										src={item.image.includes('http')
											? item.image
											: PUBLIC_IMAGES_FETCH_URI + item.image}
										alt="logo"
									/>
								{:else}
									<Icon src={Photo} />
									<span>Click to add image's</span>
								{/if}
							</div>
						{/if}
						<input
							type="file"
							name="phone-image"
							id="phone-image"
							accept="image/*"
							on:change={handleImage}
						/>
					</div>
				</div>
				<div class="flex-yxz number-sec">
					<div class="a03x">
						<CustomNumberInput
							value={items}
							title={'Number of items'}
							callback={(n) => {
								items = n;
								return n;
							}}
						/>
					</div>
				</div>
				{#if loading}
					<div style="margin:25px 78px;width:0;"><Loading type="spinner" /></div>
				{:else}
					<input type="submit" value="SAVE" />
				{/if}
				{#if typeof message === 'object' && message !== null}
					<span
						class="message {message.variant ? message.variant : 'success'}"
						style="margin: 10px 0;">{message.message}</span
					>
				{/if}
			</form>
		</div>
	</div>
</div>
