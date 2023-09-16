<script lang="ts">
	import axios from 'axios';
	import { Icon, Minus, Plus, XMark } from 'svelte-hero-icons';
	import {
		modal,
		modalUpdate,
		promptModalUpdate,
		static_data,
		updateMessages,
		updateStaticData
	} from '$lib/store';
	import { life, numberFormat } from '$lib/globals';
	import Loading from './loading.svelte';
	import CustomNumberInput from './custom-number-input.svelte';
	import HandleImages from './handle-images.svelte';
	let message: any = false;
	$: message, updateMessages(message);
	let item = $modal;
	let loves: number = 0;
	let views: number = 0;
	let rating: number = 0;
	let headers: string = '';
	let loading = false;
	let cats: [] | any = $static_data.categories;
	$: $modal, (item = $modal), getItem($modal.action === 'new' ? 0 : $modal._id);

	document.querySelector('body')?.classList.add('modal-open');
	const handleClose = () => {
		modalUpdate({ visible: false });
		document.querySelector('body')?.classList.remove('modal-open');
	};
	let filesList: any = [];
	let item_specs: any = [];
	const objectsToDelete: any = {};
	let item_specs_exclude = [
		'visible',
		'_id',
		'title',
		'category',
		'images',
		'integrity',
		'isActive',
		'createdAt',
		'index',
		'keywords',
		'description',
		'views',
		'loves',
		'rating',
		'slug',
		'original',
		'is_new',
		'updatedAt',
		'headers',
		'removeImages',
		'action',
		'old_category',
		'category_id'
	];
	let dataFrame: any = {
		data: {
			headers: [],
			images: [],
			keywords: '',
			is_new: true,
			isActive: true,
			description: '',
			slug: ''
		},
		info: {
			removeImages: []
		},
		images: []
	};
	const postDataframe = async (objectsToDelete: any) => {
		const form = new FormData();
		console.log('frame: ', dataFrame);
		if (dataFrame.images)
			dataFrame.images.forEach((e: File, i: number) => form.append(`image_${i}`, e));
		form.append('df', JSON.stringify(dataFrame.data));
		form.append('info', JSON.stringify(dataFrame.info));
		form.append('objectsToDelete', JSON.stringify(objectsToDelete));
		if (dataFrame.info.removeImages && dataFrame.info.removeImages.length)
			form.append('removeImages', dataFrame.info.removeImages);
		await axios
			.post(`/api/${$modal.action === 'new' ? 'set-items' : 'update-items'}`, form, {
				headers: { requestFor: $modal.action === 'new' ? 'newDeviceReq' : 'updateMobileDevice' }
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
	const headersToString = (sep = '\n') => {
		headers = '';
		if (dataFrame.data.headers)
			dataFrame.data.headers.map((e: string, i: number) => {
				if (e !== '') {
					if (i + 1 >= dataFrame.data.headers.length) headers += e;
					else {
						if (i + 1 >= $static_data.settings.deviceViewHeaderTextLength) headers += e;
						else headers += e + sep;
					}
				}
			});
	};
	const getItem = async (_id: string | number = 0) => {
		console.log($modal);
		if (_id == 0 && cats.length) return 0;
		const params: any = { smart_device: 1, _id };
		if (!cats.length) params['getCats'] = 'phones';
		await axios
			.get('/api/get-items/', {
				params
			})
			.then((e) => {
				loading = false;
				if (_id) {
					item = { ...item, ...e.data.item };
					dataFrame.data = item;
					loves = item.loves;
					rating = item.rating;
					views = item.views;
					dataFrame.info.old_category = item.category_id;
					dataFrame.info._id = _id;
					dataFrame.images = item.images;
					['images', 'category_id', 'visible', 'action', '_id', 'createdAt'].map(
						(e) => delete dataFrame.data[e]
					);
					headersToString();
					item_specs = Object.keys(dataFrame.data)
						.filter((e) => (item_specs_exclude.includes(e) ? null : e))
						.sort();
					filesList = [...dataFrame.images, ...filesList];
				}
				if (!(cats.length > 0)) {
					updateStaticData({ categories: e.data.cats });
					cats = e.data.cats;
				}
			})
			.catch((e) => {
				loading = false;
				console.error(e);
			});
	};
	let newSpecItem: any = { key: '', value: '' };
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
	const addSpecItemInDF = () => {
		const key = newSpecItem.key;
		let regex = /^[a-zA-Z0-9\s]+$/;
		let m: boolean | string = false;
		if (!regex.test(key)) m = 'You can not add special characters in your key/title.';
		if (key === undefined || key === '') m = 'Enter a key of your new specification!';
		if (newSpecItem.value === undefined || newSpecItem.value === '')
			m = 'Enter a value of your new specification!';
		let exist = dataFrame.data[newSpecItem.specs].filter(
			(item: any) => Object.keys(item)[0] === key
		);
		if (exist.length > 0) m = `Your entered key (${key}) is already exist on ${newSpecItem.specs}.`;
		if (m) return updateMessages({ message: m, variant: 'danger' });
		const name = `${newSpecItem.specs}___${++newSpecItem.lastInputIndex}_x_${key}`;
		dataFrame.data[newSpecItem.specs].push({ [key]: newSpecItem.value });
		updateMessages({
			message: `Title (${newSpecItem.key}) and value (${newSpecItem.value}) added successfully! add more on ${newSpecItem.specs}.`,
			variant: 'success'
		});
		let tempElement = document.createElement('div');
		tempElement.innerHTML = `<div class="a03x s-96QAaaAScBii"><label 
			for="s${key.replaceAll(' ', '')}-spec" 
			class="s-96QAaaAScBii">${key}</label><input type="text" name="${name}" value="${newSpecItem.value}"
			id="s${key.replaceAll(' ', '')}-spec"
		 	placeholder="Enter ${key} details" class="s-96QAaaAScBii"/></div>`;
		const childNodes = tempElement.childNodes;
		for (let i = 0; i < childNodes.length; i++)
			newSpecItem.specs_list.appendChild(childNodes[i].cloneNode(true));
	};
	const handleForm = (e: any) => {
		e.preventDefault();
		let inputs = document.querySelectorAll('#dataframe-form input');
		let specsTitle = document.querySelectorAll('#dataframe-form .spec-item-title');
		let titles: any = {};
		for (const t of specsTitle) {
			const title: any = t;
			let original: any = title.getAttribute('data-original');
			if (original) titles[original] = title.innerText.toLowerCase().trim();
		}
		[...inputs].forEach((element: any) => {
			let key = element.name.split('_x_')[1];
			let value = element.value;
			if (key) {
				let loc = element.name?.split('___')[0];
				let index = element.name?.match(/\d+(?=_x_)/);
				if (index) index = index[0];
				dataFrame.data[loc][index] = { [key]: value };
			}
			key = element.name.split('_y_')[1];
			if (key) {
				value = element.value;
				dataFrame.data[key] = value;
			}
		});
		Object.keys(dataFrame.data).map((key) => {
			if (titles[key] && titles[key] !== key) {
				dataFrame.data[titles[key]] = dataFrame.data[key];
				objectsToDelete[key] = '';
				delete dataFrame.data[key];
			}
		});
		const k = document.querySelector('#dataframe-form #description') as HTMLTextAreaElement;
		let c = document.querySelector('#dataframe-form #category') as any;
		if (k) dataFrame.data['description'] = k.value;
		if (c) dataFrame.data['category'] = c.value;
		item_specs = Object.keys(dataFrame.data).filter((e) =>
			item_specs_exclude.includes(e) ? null : e
		);
		item_specs = item_specs.sort();
		dataFrame.data.loves = loves;
		dataFrame.data.rating = rating;
		dataFrame.data.views = views;
		if (!dataFrame.images || !dataFrame.images.length) {
			message = { message: 'Select at least one device image!', variant: 'alert' };
			return 0;
		}
		if (dataFrame.data.headers.length < 4) {
			message = { message: 'Add 4 or 5 device headers text!', variant: 'alert' };
			return 0;
		}
		if (dataFrame.data.keywords === '') {
			message = { message: 'Please add some keywords!', variant: 'alert' };
			return 0;
		}
		if (dataFrame.data.slug === '') {
			message = { message: 'Please enter a slug!', variant: 'alert' };
			return 0;
		}
		if (dataFrame.data.category === '' || dataFrame.data.category === 'un-selected') {
			message = { message: 'Please select a category of device!', variant: 'alert' };
			return 0;
		}
		postDataframe(objectsToDelete);
	};
	const handleAddNewSpec = () => {
		const spec_title: any = document.getElementById('new-spec-title');
		const spec_name: any = document.getElementById('new-spec-name');
		const spec_value: any = document.getElementById('new-spec-value');
		updateMessages({ message: false });
		if (spec_title.value !== '') {
			if (Object.keys(dataFrame.data).includes(spec_title.value.toLowerCase()))
				updateMessages({
					message: 'Specification title is already exist!',
					variant: 'alert'
				});
			else if (spec_name.value !== '') {
				if (spec_value.value !== '') {
					dataFrame.data[spec_title.value] = [{ [spec_name.value]: spec_value.value }];
					item_specs.push(spec_title.value);
					spec_title.value = '';
					spec_name.value = '';
					spec_value.value = '';
					updateMessages({
						message: 'New specification added successfully!',
						variant: 'success'
					});
				} else
					updateMessages({
						message: 'Add value of new specification.',
						variant: 'danger'
					});
			} else updateMessages({ message: 'Add name of new specification.', variant: 'danger' });
		} else updateMessages({ message: 'Add a title of new specification.', variant: 'danger' });
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
	const addToHeader = (id: string) => {
		if (dataFrame.data.headers.length >= $static_data.settings.deviceViewHeaderTextLength) {
			updateMessages({
				message: `headers limit is ${$static_data.settings.deviceViewHeaderTextLength} we can't add more.`,
				variant: 'alert'
			});
			return 0;
		}
		let value: null | HTMLElement | string = document.getElementById(id);
		if (value instanceof HTMLInputElement || value instanceof HTMLTextAreaElement)
			value = value.value;

		if (dataFrame.data.headers.includes(value)) {
			updateMessages({
				message: `(${value}) already exist on headers.`,
				variant: 'alert'
			});
			return 0;
		}
		if (value !== '') {
			dataFrame.data.headers = [...dataFrame.data.headers, value];
			headersToString();
			updateMessages({ message: `(${value}) added to headers.`, variant: 'success' });
		}
	};
	const handleHeadersArea = (e: any) => {
		updateMessages();
		let h = e.target.value.trim().split('\n');
		let x: any = [];
		for (let t of h) if (!x.includes(t.trim()) && t !== '') x.push(t.trim());
		x = x.slice(0, $static_data.settings.deviceViewHeaderTextLength);
		dataFrame.data.headers = x;
		headersToString();
		if (h.length > $static_data.settings.deviceViewHeaderTextLength) {
			updateMessages({
				message: `headers limit is ${$static_data.settings.deviceViewHeaderTextLength} we can't add more.`,
				variant: 'alert'
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
	const __npc = (e: any, name: string, checked: boolean): void => {
		if (e.target instanceof HTMLButtonElement) {
			e.target.classList.toggle('active');
			if (name === 'is-active') dataFrame.data.isActive = checked;
			else dataFrame.data.is_new = checked;
		}
	};
	const removeFromSpecs = (specs: string, spec: string = ''): void => {
		if (spec === '') {
			dataFrame.data[specs] = [];
			objectsToDelete[specs] = '';
		} else {
			let n = dataFrame.data[specs].filter((e: any) => Object.keys(e)[0] !== spec);
			dataFrame.data[specs] = n;
		}
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
</script>

<div class="modal">
	<button on:click={handleClose} class="close-btn"><Icon src={XMark} /></button>
	<div class="inner-modal">
		<div class="form" id="dataframe-form">
			<h2>{item.title}</h2>
			{#if $modal.action === 'edit' && item.type !== 'product'}
				{#if loading}
					<span>
						<Loading loading_lines={2} />
					</span>
				{:else}
					<span>
						Added <b>{life(item.createdAt).from()}</b>. Information integrity score is
						<b>{item.integrity}%</b>. total <b>{numberFormat(item.loves)}</b> people love this phone.
					</span>
				{/if}
			{/if}
			<p>
				You can add new, update or delete the {item.type}. take any action carefully there is no
				change to undo your actions.
			</p>
			<form on:submit={handleForm} id="phone-form">
				<div class="flex xkez">
					{#if typeof message === 'object' && message !== null}
						<span
							class="message {message.variant ? message.variant : 'success'}"
							style="margin: 10px 0;">{message.message}</span
						>
					{/if}
					<input style="margin:0" type="submit" value="SAVE" />
				</div>
				<div class="flex-yxz">
					<div class="a03x">
						<label for="title">{item.type} TITLE HERE</label>
						<input
							type="text"
							name="_y_title"
							id="title"
							placeholder="E.g. Samsung Galaxy A02"
							value={$modal.action === 'edit' ? item.title : ''}
							on:keyup={handleSlug}
							required
						/>
					</div>
					<div class="a03x">
						<label for="category">{item.type} CATEGORY</label>
						<select name="_y_category" id="category">
							{#if $modal.action === 'new'}
								<option selected disabled value="un-selected">Select Category</option>
							{/if}
							{#if Array.isArray(cats)}
								{#each cats as cat}
									{#if $modal.action === 'edit' && cat._id === dataFrame.data.category}
										<option selected value={cat._id}>{cat.category}</option>
									{:else}
										<option value={cat._id}>{cat.category}</option>
									{/if}
								{/each}
							{/if}
						</select>
					</div>
				</div>
				<div class="flex-yxz">
					<div class="a03x full-w">
						<label for="description">{item.type} DESCRIPTION</label>
						{#if loading}
							<div style="width: 256px;">
								<Loading />
							</div>
						{:else}
							<textarea
								name="description"
								id="description"
								placeholder="Type something about {item.type}"
								required>{$modal.action === 'edit' ? item.description : ''}</textarea
							>
						{/if}
					</div>
				</div>
				<div class="flex-yxz">
					<div class="a03x full-w">
						<label for="headers">
							{$modal.type} HEADERS
							<small>
								(seperate with Enter (\n). You can add maximum {$static_data.settings
									.deviceViewHeaderTextLength} headers. use shortest lines)
							</small>
						</label>
						{#if loading}
							<div style="width: 256px;">
								<Loading />
							</div>
						{:else}
							<textarea
								name="headers"
								id="headers"
								on:change={handleHeadersArea}
								placeholder="Enter some short lines about product"
								required>{headers}</textarea
							>
						{/if}
					</div>
				</div>
				<HandleImages {dataFrame} {filesList} {loading} />
				{#each item_specs as specs}
					{#if dataFrame.data[specs].length}
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
							{#each dataFrame.data[specs] as spec, item_index}
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
											on:click={() => addToHeader(`s${key.replaceAll(' ', '')}-spec`)}
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
						<div class="a03x">
							<label for="new-spec-title">Add a new specification title</label>
							<input
								type="text"
								name="new-spec-title"
								value=""
								id="new-spec-title"
								placeholder="Enter name of new specification..."
							/>
						</div>
					</div>
					<div class="flex-yxz spec-items">
						<div class="a03x">
							<label for="new-spec-name">Add minimum one specification name</label>
							<input
								type="text"
								name="new-spec-name"
								value=""
								id="new-spec-name"
								placeholder="Enter name of new specification..."
							/>
						</div>
						<div class="a03x">
							<label for="new-spec-value">Add minimum one specification value</label>
							<input
								type="text"
								name="new-spec-value"
								value=""
								id="new-spec-value"
								placeholder="Enter name of new specification..."
							/>
						</div>
						<button type="button" on:click={handleAddNewSpec} class="btn">Add Spec</button>
					</div>
				</div>
				<div class="flex-yxz number-sec">
					<div class="a03x">
						<CustomNumberInput bind:output={views} value={views} title={'Views'} />
					</div>
					<div class="a03x">
						<CustomNumberInput
							bind:output={rating}
							value={rating}
							title={'Rating'}
							maximum={5.0}
							minimum={0.0}
							callback={(n) => Number(n.toFixed(1))}
							step={0.1}
						/>
					</div>
					<div class="a03x">
						<CustomNumberInput bind:output={loves} value={loves} title={'Loves'} />
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
						<span>VISIBLE <small>(toggle visibility of the device)</small></span>
					</div>
					<div class="flex">
						<button
							type="button"
							class="btn-stylish {dataFrame.data.is_new ? 'active' : ''}"
							data-name="is-new"
							on:click={(e) => __npc(e, 'is-new', !dataFrame.data.is_new)}
						/>
						<span>ITEM IS NEW <small>(toggle to item as new)</small></span>
					</div>
				</div>
				<div class="flex-yxz">
					<div class="a03x full-w">
						<label for="slug">SLUG</label>
						{#if loading}
							<div style="width: 416px"><Loading /></div>
						{:else}
							<input
								type="text"
								name="_y_slug"
								value={item.slug ?? dataFrame.data.slug ?? ''}
								id="slug"
								placeholder="Enter device slug here..."
							/>
						{/if}
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
