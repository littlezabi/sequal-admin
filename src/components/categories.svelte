<script lang="ts">
	import axios from 'axios';
	import { ArrowDownCircle, Icon, Photo, XMark } from 'svelte-hero-icons';
	import { modal, modalUpdate, static_data, updateMessages, updateStaticData } from '$lib/store';
	import { PUBLIC_IMAGES_FETCH_URI, PUBLIC_PHONE_IMAGE_FOLDER } from '$env/static/public';
	import Loading from './loading.svelte';
	import { fade, slide } from 'svelte/transition';
	import CustomNumberInput from './custom-number-input.svelte';
	import CatsType from './cats-type.svelte';
	let message: any = false;
	$: message, updateMessages(message);
	let item = $modal.item;
	let dataframe: any = {...item, old_image:item.image};
	let cat_logo: any = '';
	let items: number = item.items;
	let loading = false;
	let changesHappened = false;
	document.querySelector('body')?.classList.add('modal-open');
	const handleClose = async () => {
		modalUpdate({ visible: false });
		document.querySelector('body')?.classList.remove('modal-open');
		if (changesHappened) location.href = `/categories`;
	};
	const handleForm = async () => {
        dataframe.items = items
        console.log(dataframe)
        axios.post('api/update-items', items,{headers: {requestFor: "updateCategories"}})
        .then((res)=>{
            console.log(res.data)
        }).catch((e)=> {
            console.error(e)
        })
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
	let typeToggled = false;
	const handleTypesToggler = (e: Event) => {
		typeToggled = !typeToggled;
		let svg = document.querySelector('.arrow-expand') as HTMLElement | null;
		if (typeToggled && svg) svg.style.transform = 'rotate(180deg)';
		else if (svg) svg.style.transform = 'rotate(0deg)';
	};
	let type_list = $static_data.settings.categoryTypes;
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
		console.log(dataframe);
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
			<form on:submit={handleForm} id="phone-form">
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
							<option selected value="phones">Phones</option>
							{#each type_list as cat}
								<option value={cat}>{cat}</option>
							{/each}
						</select>
					</div>
				</div>

				<div class="flex-yxz types-category">
					<div style="width: 100%">
						<button class="expand-tree" type="button" on:click={handleTypesToggler}>
							<p>List of categories types</p>
							<Icon src={ArrowDownCircle} class="arrow-expand" style="margin-left: 10px;" />
						</button>
						{#if typeToggled}
							<div transition:slide>
								<CatsType categories={type_list} {updateCats} />
							</div>
						{/if}
					</div>
				</div>
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
						<CustomNumberInput bind:output={items} value={items} title={'Number of Items'} />
					</div>
				</div>
				<input type="submit" value="SAVE" />
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

<style lang="scss">
	.expand-tree {
		width: max-content;
		display: flex;
		align-items: center;
		background: none;
		border: 0;
		padding: 4px 1px;
		& p {
			font-size: 16px;
			color: white;
			padding: 0;
			margin: 0;
		}
	}
	.types-category {
		margin: 21px 0px;
		background: #8989ff1c;
		padding: 21px;
		border-radius: 8px;
	}
</style>
