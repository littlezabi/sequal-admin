<script lang="ts">
	import axios from 'axios';
	import { Icon, Minus, Plus, XMark } from 'svelte-hero-icons';
	import { promptModalUpdate, static_data, updateMessages } from '$lib/store';
	import CustomNumberInput from '$compo/custom-number-input.svelte';
	import HandleImages from '$compo/handle-images.svelte';
	import { fade } from 'svelte/transition';
	import CategoryInputView from '$compo/category-input-view.svelte';
	import type { PageData } from './$types';
	import { handleHeadersArea, headersToString } from '../../../render-common';

	export let data: PageData;
	let message: any = false;
	$: message, updateMessages(message);
	let loading = false;
	let dataFrame: any = {
		data: {
			...data.product
		},
		info: {
			removeImages: []
		},
		images: []
	};
	let headers: string = headersToString(
		dataFrame.data.headers,
		$static_data.settings.deviceViewHeaderTextLength
	);
	let filesList: any = dataFrame.data.images;

	const postDataframe = async () => {
		const form = new FormData();
		if (dataFrame.images)
			dataFrame.images.forEach((e: File, i: number) => form.append(`image_${i}`, e));
		form.append('df', JSON.stringify(dataFrame.data));
		form.append('info', JSON.stringify(dataFrame.info));
		if (dataFrame.info.removeImages && dataFrame.info.removeImages.length)
			form.append('removeImages', dataFrame.info.removeImages);
		await axios
			.post('/api/set-items', form, {
				headers: { requestFor: 'product-new' }
			})
			.then((response) => {
				const res = response.data;
				if (res.error && res.error === 'unauthenticated_user') {
					message = { message: 'unauthenticated user please login!', variant: 'danger' };
					return null;
				}
				if (res.success === 0) message = { message: res.message, variant: 'danger' };
				if (res.success === 1) message = { message: 'successfully saved!', variant: 'success' };
			})
			.catch((e) => {
				message = { message: e.message, variant: 'danger' };
				console.error('error: ', e);
			});
	};
	let newSpecItem: any = { key: '', value: '' };
	const handleForm = (e: any) => {
		e.preventDefault();
		message = false;
		if (!dataFrame.images || !dataFrame.images.length)
			message = { message: 'Select at least one product image!', variant: 'alert' };
		else if (dataFrame.data.keywords === '')
			message = { message: 'Please add some keywords!', variant: 'alert' };
		else if (dataFrame.data.slug === '')
			message = { message: 'Please enter a slug!', variant: 'alert' };
		else !dataFrame.data.category || dataFrame.data.category === 'un-selected';
		message = { message: 'Please select a category of device!', variant: 'alert' };
		if (!message) return 0;
		postDataframe();
	};
	const handleAddNewSpec = () => {
		const spec_title: any = document.getElementById('new-spec-title');
		const spec_name: any = document.getElementById('new-spec-name');
		const spec_value: any = document.getElementById('new-spec-value');
		[spec_name, spec_title, spec_value].forEach((e) => (e.style.borderBottomColor = '#5f5f5f52'));
		updateMessages({ message: false });
		if (spec_title.value !== '') {
			if (Object.keys(dataFrame.data).includes(spec_title.value.toLowerCase())) {
				updateMessages({
					message: 'Specification title is already exist!',
					variant: 'alert',
					closing_time: 10000
				});
				spec_title.style.borderBottomColor = '#ff0057';
				return 0;
			}
		}
		if (spec_name.value !== '') {
			if (spec_value.value !== '') {
				if (spec_title.value !== '') {
					dataFrame.data.specs_list[spec_title.value.toLowerCase()] = [
						{ [spec_name.value]: spec_value.value }
					];
				} else {
					dataFrame.data.specs_list[spec_name.value] = spec_value.value;
				}
				dataFrame.data.specs_list = dataFrame.data.specs_list;
				spec_title.value = '';
				spec_name.value = '';
				spec_value.value = '';
				updateMessages({
					message: 'New specification added successfully!',
					variant: 'success'
				});
			} else {
				updateMessages({
					message: 'Add value of new specification.',
					variant: 'danger'
				});
				spec_value.style.borderBottomColor = '#ff0057';
			}
		} else {
			updateMessages({ message: 'Add name of new specification.', variant: 'danger' });
			spec_name.style.borderBottomColor = '#ff0057';
		}
	};
	const removeKeyword = (keyword: string) => {
		dataFrame.data.keywords = dataFrame.data.keywords.replace(keyword + ',', '');
	};
	const addKeywords = (e: any) => {
		if (e.target.value.includes(',')) {
			if (!dataFrame.data.keywords.includes(e.target.value))
				dataFrame.data.keywords += e.target.value.trim() + ' ';
			e.target.value = '';
		}
	};

	const headerTextInput = (e: any) => {
		updateMessages();
		const { res, message } = handleHeadersArea(e, $static_data.settings.deviceViewHeaderTextLength);
		dataFrame.data.headers = res;
		headers = headersToString(res, $static_data.settings.deviceViewHeaderTextLength);
		if (message) {
			updateMessages({
				message: message,
				variant: 'alert'
			});
		}
	};

	const __npc = (e: any, name: string, checked: boolean): void => {
		if (e.target instanceof HTMLButtonElement) {
			e.target.classList.toggle('active');
			if (name === 'is-active') dataFrame.data.isActive = checked;
			else dataFrame.data.is_new = checked;
		}
	};
	const addToDataframe = (e: any) => {
		let name = e.target.name;
		let value = e.target.value;
		if (name === 'slug') handleSlug(e);
		else if (name === 'title') {
			dataFrame.data.title = value;
			handleSlug(e);
		} else if (name === 'price') dataFrame.data['price'] = Number(value);
		else dataFrame.data[name] = value;
	};
	const handleSlug = (e: Event): void => {
		if (e.target instanceof HTMLInputElement) {
			let v = e.target.value
				.replaceAll(/\s|\W|[_]/gi, '-')
				.replaceAll(/-{1,}/gi, '-')
				.toLowerCase();
			if (v.at(-1) === '-') v = v.substring(0, v.length - 1);
			dataFrame.data.slug = v;
		}
	};
	const removeFromSpecs = (specs: string, spec: string = ''): void => {
		if (spec === '') {
			dataFrame.data[specs] = [];
		} else {
			let n = dataFrame.data[specs].filter((e: any) => Object.keys(e)[0] !== spec);
			dataFrame.data[specs] = n;
		}
	};
	const addToHeader = (value: string) => {
		let m: boolean | string = false;
		if (dataFrame.data.headers.length >= $static_data.settings.deviceViewHeaderTextLength)
			m = `headers limit is ${$static_data.settings.deviceViewHeaderTextLength} we can't add more.`;
		if (!m && dataFrame.data.headers.includes(value)) m = `(${value}) already exist on headers.`;
		if (!m && value !== '') {
			dataFrame.data.headers = [...dataFrame.data.headers, value];
			headers = headersToString(
				dataFrame.data.headers,
				$static_data.settings.deviceViewHeaderTextLength
			);
			m = `(${value}) added to headers.`;
		}
		if (m) {
			updateMessages({
				message: m,
				variant: m.includes('exist') || m.includes("can't") ? 'alert' : 'success'
			});
			return 0;
		}
	};
	const __cxd = (e: Event): void => {
		if (e.target instanceof HTMLInputElement) {
			if (e.target.name === 'new-key') newSpecItem = { ...newSpecItem, key: e.target.value.trim() };
			if (e.target.name === 'spec-value')
				newSpecItem = { ...newSpecItem, value: e.target.value.trim() };
		}
	};
	const addSpecItemInDF = () => {
		const key = newSpecItem.key;
		let regex = /^[a-zA-Z0-9\s]+$/;
		let m: boolean | string = false;
		if (!regex.test(key)) m = 'You can not add special characters in your key/title.';
		if (key === undefined || key === '') m = 'Enter a key of your new specification!';
		if (newSpecItem.value === undefined || newSpecItem.value === '')
			m = 'Enter a value of your new specification!';
		let exist = dataFrame.data.specs_list[newSpecItem.specs].filter(
			(item: any) => Object.keys(item)[0] === key
		);
		if (exist.length > 0) m = `Your entered key (${key}) is already exist on ${newSpecItem.specs}.`;
		if (m) return updateMessages({ message: m, variant: 'danger' });
		dataFrame.data.specs_list[newSpecItem.specs].push({ [key]: newSpecItem.value });
		updateMessages({
			message: `Title (${newSpecItem.key}) and value (${newSpecItem.value}) added successfully! add more on ${newSpecItem.specs}.`,
			variant: 'success'
		});
		dataFrame.data.specs_list = dataFrame.data.specs_list;
	};
	const addNewElement = (id: string) => {
		const element = document.getElementById(id);
		let lastElement: any = element?.querySelectorAll('div');
		lastElement = lastElement[lastElement.length - 1];
		let lastInputIndex = lastElement.querySelector('input')['name'];
		lastInputIndex = Number(lastInputIndex.match(/\d+(?=_x_)/g)[0]);
		newSpecItem = {
			specs: id.split('-super')[0].replace('---', ' '),
			lastInputIndex,
			specs_list: element
		};
		promptModalUpdate({
			visible: true,
			title: `Add Specs of ${newSpecItem.specs.toUpperCase()}`,
			description:
				'In our device dataset, all specifications have a key and value. When adding new specifications, we need to provide both the key and value. The first input is for the key, and the second input is for the value.',
			form: {
				inputs: [
					{
						label: `NEW ${newSpecItem.specs.toUpperCase()} SPEC TITLE`,
						type: 'text',
						placeholder: 'E.g. Item body weight',
						name: 'new-key',
						value: newSpecItem.key ?? '',
						callback: __cxd,
						required: true
					},
					{
						label: `NEW ${newSpecItem.specs.toUpperCase()} SPEC VALUE`,
						type: 'text',
						placeholder: 'E.g. 2.05 KG',
						name: 'spec-value',
						value: newSpecItem.value ?? '',
						callback: __cxd,
						required: true
					}
				],
				buttons: [
					{
						type: 'button',
						title: 'ADD SPECS',
						callback: addSpecItemInDF
					},
					{
						type: 'button',
						title: 'Close',
						callback: () => promptModalUpdate({ visible: false })
					}
				]
			}
		});
	};
</script>

<div class="product-new" transition:fade>
	<div class="product-inner">
		<div class="form" id="dataframe-form">
			<h2>EDIT PRODUCT</h2>
			<p>Edit your product carefully. fields which is empty and not required will be removed.</p>
			<form on:submit={handleForm} id="product-form">
				<div class="flex xkez">
					{#if message}
						<span class="message {message.variant}" style="margin: 10px 0;">{message.message}</span>
					{/if}
				</div>
				<CategoryInputView callback={(e) => (dataFrame.data.category = e)} />
				<div class="flex-yxz">
					<div class="a03x">
						<label for="title">PRODUCT TITLE HERE <small>(required)</small></label>
						<input
							type="text"
							name="title"
							id="title"
							value={dataFrame.data.title}
							placeholder="E.g. Samsung Galaxy A02"
							on:change={addToDataframe}
							required
						/>
					</div>
					<div class="a03x flex-col">
						<label for="title">PRODUCT PRICE <small>(not required)</small></label>
						<input
							type="number"
							class="num-input"
							placeholder="E.g. 299.9"
							step="0.5"
							min={0.0}
							name="price"
							id="price"
							value={dataFrame.data.price}
							on:change={addToDataframe}
						/>
					</div>
				</div>
				<div class="flex-yxz">
					<div class="a03x full-w">
						<label for="description">DESCRIBE PRODUCT IN DETAILS</label>
						<textarea
							name="description"
							id="description"
							value={dataFrame.data.description}
							placeholder="Describe your product in details"
							on:change={addToDataframe}
						/>
					</div>
				</div>
				<div class="flex-yxz">
					<div class="a03x full-w">
						<label for="headers">
							ADD PRODUCT HEADERS TEXT
							<small>
								(seperate with Enter (\n). You can add maximum {$static_data.settings
									.deviceViewHeaderTextLength} headers. use shortest lines)
							</small>
						</label>
						<textarea
							name="headers"
							id="headers"
							on:change={headerTextInput}
							placeholder="Enter some short lines about product">{headers}</textarea
						>
					</div>
				</div>
				<HandleImages {dataFrame} {filesList} {loading} />
				{#each Object.keys(dataFrame.data.specs_list) as specs}
					{#if dataFrame.data.specs_list[specs]}
						<div class="add-spec-item">
							<h3 class="spec-item-title" id={'__' + specs} data-original={specs} contenteditable>
								{specs}
							</h3>
							<button
								class="add-to-header remove-spec"
								type="button"
								title="Remove '{specs}' and its specs"
								style="margin-left: 34px;"
								on:click={() => removeFromSpecs(specs)}
							>
								<Icon src={Minus} />
							</button>
							<button
								type="button"
								title="Add new specification on '{specs}'"
								on:click={() => addNewElement(specs.replaceAll(' ', '---') + '-super')}
								><Icon src={Plus} /></button
							>
						</div>
						<div class="flex-yxz spec-items" id="{specs.replaceAll(' ', '---')}-super">
							{#each dataFrame.data.specs_list[specs] as spec, item_index}
								{#each Object.keys(spec) as key}
									<div class="a03x c-88323">
										<button
											class="add-to-header remove-spec"
											type="button"
											title="Remove '{key}'"
											on:click={() => removeFromSpecs(specs, key)}
										>
											<Icon src={Minus} />
										</button>
										<label for="s{key.replaceAll(' ', '')}-spec">{key}</label>
										<input
											type="text"
											name="{specs}___{item_index}_x_{key}"
											value={spec[key]}
											id="s{key.replaceAll(' ', '')}-spec"
										/>
										<button
											class="add-to-header"
											type="button"
											title="add '{key}' value to headers list"
											on:click={() => addToHeader(spec[key])}
										>
											<Icon src={Plus} />
										</button>
									</div>
								{/each}
							{/each}
						</div>
					{/if}
				{/each}
				<div class="border-tag">
					<div class="flex-yxz spec-items">
						<div class="a03x" style="width:100%">
							<label for="new-spec-title"
								>Add a new specification title <small
									>(its optional field. after adding this title its generate a array of
									specifications. better choice if you have a list of sub-specs in specification)</small
								></label
							>
							<input
								type="text"
								name="new-spec-title"
								value=""
								id="new-spec-title"
								placeholder="E.g. Device Screen"
							/>
						</div>
					</div>
					<div class="flex-yxz spec-items">
						<div class="a03x">
							<label for="new-spec-name">Enter specification name</label>
							<input
								type="text"
								name="new-spec-name"
								value=""
								id="new-spec-name"
								placeholder="E.g. Screen Width"
							/>
						</div>
						<div class="a03x">
							<label for="new-spec-value">Enter specification value</label>
							<input
								type="text"
								name="new-spec-value"
								value=""
								id="new-spec-value"
								placeholder="E.g. HD 1920px"
							/>
						</div>
						<button type="button" on:click={handleAddNewSpec} class="btn">Add Spec</button>
					</div>
				</div>
				<div class="flex-yxz number-sec">
					<div class="a03x">
						<CustomNumberInput
							value={dataFrame.data.views}
							title={'Views'}
							callback={(n) => {
								dataFrame.data.views = n;
								return n;
							}}
						/>
					</div>
					<div class="a03x">
						<CustomNumberInput
							value={dataFrame.data.rating}
							title={'Rating'}
							maximum={5.0}
							minimum={0.0}
							callback={(n) => {
								n = Number(n.toFixed(1));
								dataFrame.data.rating = n;
								return n;
							}}
							step={0.1}
						/>
					</div>
					<div class="a03x">
						<CustomNumberInput
							value={dataFrame.data.loves}
							title={'Loves'}
							callback={(n) => {
								dataFrame.data.loves = n;
								return n;
							}}
						/>
					</div>
				</div>
				<div class="flex-yxz">
					<h3 class="spec-item-title">KEYWORDS</h3>
					<div class="keywords-list">
						{#if dataFrame.data.keywords}
							{#each dataFrame.data.keywords.split(',') as keyword}
								{#if keyword.length > 2}
									<span>
										{keyword}
										<button type="button" on:click={() => removeKeyword(keyword)}
											><Icon src={XMark} /></button
										>
									</span>
								{/if}
							{/each}
						{/if}
					</div>
					<div class="a03x">
						<label for="keywords">ENTER KEYWORD <small>(seperate with comma)</small></label>
						<input
							type="text"
							name="keywords"
							id="keywords"
							placeholder="Enter revelant keyword..."
							on:keyup={addKeywords}
						/>
					</div>
				</div>
				<div class="jkcw">
					<div class="flex">
						<button
							type="button"
							class="btn-stylish {dataFrame.data.isActive ? 'active' : ''}"
							data-name="is-new"
							on:click={(e) => __npc(e, 'is-active', !dataFrame.data.isActive)}
						/>
						<span>SET PRODUCT VISIBLE <small>(toggle visibility of the device)</small></span>
					</div>
					<div class="flex">
						<button
							type="button"
							class="btn-stylish {dataFrame.data.is_new ? 'active' : ''}"
							data-name="is-new"
							on:click={(e) => __npc(e, 'is-new', !dataFrame.data.is_new)}
						/>
						<span>SET PRODUCT AS NEW <small>(toggle to item as new)</small></span>
					</div>
				</div>
				<div class="flex-yxz">
					<div class="a03x full-w">
						<label for="slug">SLUG</label>
						<input
							type="text"
							name="slug"
							value={dataFrame.data.slug ?? ''}
							id="slug"
							placeholder="Enter product slug here..."
							on:keyup={addToDataframe}
						/>
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
	.product-new {
		color: var(--primary-color);
		& p {
			color: inherit;
		}
	}
</style>
