<script lang="ts">
	import axios from 'axios';
	import { Icon, Photo, Plus, XMark } from 'svelte-hero-icons';
	import { modal, modalUpdate, static_data, updateMessages, updateStaticData } from '$lib/store';
	import { PUBLIC_IMAGES_FETCH_URI } from '$env/static/public';
	import { life, numberFormat } from '$lib/globals';
	import Loading from './loading.svelte';
	import { fade } from 'svelte/transition';
	import CustomNumberInput from './custom-number-input.svelte';
	let loading = true;
	let item = $modal;
	let loves: number = 0;
	let views: number = 0;
	let rating: number = 0;
	let headers: string = '';
	$: $modal, (item = $modal), getItem($modal._id);
	let cats: [] | any = $static_data.categories;
	document.querySelector('body')?.classList.add('modal-open');
	const handleClose = () => {
		modalUpdate({ visible: false });
		document.querySelector('body')?.classList.remove('modal-open');
	};
	let filesList: any = [];
	let item_specs: any = [];
	let item_specs_exclude = [
		'visible',
		'_id',
		'title',
		'category',
		'image',
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
		'isNew',
		'updatedAt',
		'headers'
	];
	let dataFrame: any = {};
	const postDataframe = async ()=>{
		await axios.post('/api/set-items', dataFrame).then(response => {
			console.log(response.data)
		}).catch(e => {
			console.log('error: ', e)
		})
	}
	const headersToString = (sep = '\n') => {
		headers = '';
		dataFrame.headers.map((e: string, i: number) => {
			if (e !== '') {
				if (i + 1 >= dataFrame.headers.length) headers += e;
				else {
					if (i + 1 >= $static_data.settings.deviceViewHeaderTextLength) headers += e;
					else headers += e + sep;
				}
			}
		});
	};

	const getItem = async (_id: string) => {
		await axios
			.get('/api/get-items/', {
				params: { smart_device: 1, _id, getCats: cats.length > 0 ? 0 : 1 }
			})
			.then((e) => {
				loading = false;
				item = { ...item, ...e.data.item };
				dataFrame = item;
				headersToString();
				item_specs = Object.keys(dataFrame)
					.filter((e) => (item_specs_exclude.includes(e) ? null : e))
					.sort();
				filesList = [PUBLIC_IMAGES_FETCH_URI + item.image, ...filesList];
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
	const handleImage = (file: any) => {
		[...file.target.files].forEach((image) => {
			if (dataFrame.images) dataFrame.images = [...dataFrame.images, image];
			else dataFrame.images = [image];
			let reader = new FileReader();
			reader.onload = (e: any) => (filesList = [...filesList, e.target.result]);
			reader.readAsDataURL(image);
		});
	};
	let newSpecItem: any = { visible: false, key: '', value: '' };
	const addNewElement = (id: string) => {
		const element = document.getElementById(id);
		let lastElement: any = element?.querySelectorAll('div');
		lastElement = lastElement[lastElement.length - 1];
		let lastInputIndex = lastElement.querySelector('input')['name'];
		console.log(lastInputIndex);
		lastInputIndex = Number(lastInputIndex.match(/\d+(?=_x_)/g)[0]);
		newSpecItem = {
			visible: true,
			specs: id.split('-super')[0],
			lastInputIndex,
			specs_list: element
		};
		console.log(newSpecItem);
	};
	const addSpecItemInDF = () => {
		const key = newSpecItem.key;
		let regex = /^[a-zA-Z0-9\s]+$/;
		if (!regex.test(key))
			return updateMessages({
				message: 'You can not add special characters in your key/title.',
				variant: 'danger'
			});
		if (key === undefined || key === '')
			return updateMessages({
				message: 'Enter a key of your new specification!',
				variant: 'danger'
			});
		if (newSpecItem.value === undefined || newSpecItem.value === '')
			return updateMessages({
				message: 'Enter a value of your new specification!',
				variant: 'danger'
			});
		let exist = dataFrame[newSpecItem.specs].filter((item: any) => Object.keys(item)[0] === key);
		if (exist.length > 0) {
			return updateMessages({
				message: `Your entered key (${key}) is already exist on ${newSpecItem.specs}.`,
				variant: 'danger'
			});
		}
		const name = `${newSpecItem.specs}___${++newSpecItem.lastInputIndex}_x_${key}`;
		dataFrame[newSpecItem.specs].push({ [key]: newSpecItem.value });
		updateMessages({
			message: `Title (${newSpecItem.key}) and value (${newSpecItem.value}) added successfully! add more on ${newSpecItem.specs}.`,
			variant: 'success'
		});
		newSpecItem.specs_list.innerHTML += `
			<div class="a03x s-96QAaaAScBii">
				<label for="s${key.replaceAll(' ', '')}-spec" class="s-96QAaaAScBii">${key}</label>
				<input
					type="text"
					name="${name}"
					value="${newSpecItem.value}"
					id="s${key.replaceAll(' ', '')}-spec"
					placeholder="Enter ${key} details"
					class="s-96QAaaAScBii"
				/>
			</div>
			
		`;
	};
	const handleForm = (e: any) => {
		e.preventDefault();
		let inputs = document.querySelectorAll('#dataframe-form input');
		let specsTitle = document.querySelectorAll('#dataframe-form .spec-item-title');
		let titles: any = {};
		for (const title of specsTitle) {
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
				dataFrame[loc][index] = { [key]: value };
			}
			key = element.name.split('_y_')[1];
			if (key) {
				value = element.value;
				dataFrame[key] = value;
			}
		});
		Object.keys(dataFrame).map((key) => {
			if (titles[key] && titles[key] !== key) {
				dataFrame[titles[key]] = dataFrame[key];
				delete dataFrame[key];
			}
		});
		dataFrame['description'] = document.querySelector('#dataframe-form #description')?.value;
		dataFrame['category'] = document.querySelector('#dataframe-form #category')?.value;
		item_specs = Object.keys(dataFrame).filter((e) => (item_specs_exclude.includes(e) ? null : e));
		item_specs = item_specs.sort();
		dataFrame.loves = loves;
		dataFrame.rating = rating;
		dataFrame.views = views;
		postDataframe()
	};
	const handleAddNewSpec = () => {
		const spec_title: any = document.getElementById('new-spec-title');
		const spec_name: any = document.getElementById('new-spec-name');
		const spec_value: any = document.getElementById('new-spec-value');
		updateMessages({ message: false });
		if (spec_title.value !== '') {
			if (Object.keys(dataFrame).includes(spec_title.value.toLowerCase()))
				updateMessages({ message: 'Specification title is already exist!', variant: 'alert' });
			else if (spec_name.value !== '') {
				if (spec_value.value !== '') {
					dataFrame[spec_title.value] = [{ [spec_name.value]: spec_value.value }];
					item_specs.push(spec_title.value);
					spec_title.value = '';
					spec_name.value = '';
					spec_value.value = '';
					updateMessages({ message: 'New specification added successfully!', variant: 'success' });
				} else updateMessages({ message: 'Add value of new specification.', variant: 'danger' });
			} else updateMessages({ message: 'Add name of new specification.', variant: 'danger' });
		} else updateMessages({ message: 'Add a title of new specification.', variant: 'danger' });
	};
	const removeKeyword = (keyword: string) => {
		dataFrame.keywords = dataFrame.keywords.replace(keyword + ',', '');
	};
	const addKeywords = (e: any) => {
		if (e.target.value.includes(',')) {
			if (!dataFrame.keywords.includes(e.target.value))
				dataFrame.keywords += e.target.value.trim() + ' ';
			e.target.value = '';
		}
	};
	const addToHeader = (id: string) => {
		if (dataFrame.headers.length >= $static_data.settings.deviceViewHeaderTextLength) {
			updateMessages({
				message: `headers limit is ${$static_data.settings.deviceViewHeaderTextLength} we can't add more.`,
				variant: 'alert'
			});
			return 0;
		}
		const value = document?.getElementById(id)?.value;
		if (dataFrame.headers.includes(value)) {
			updateMessages({
				message: `(${value}) already exist on headers.`,
				variant: 'alert'
			});
			return 0;
		}
		if (value !== '') {
			dataFrame.headers = [...dataFrame.headers, value];
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
		dataFrame.headers = x;
		headersToString();
		if (h.length > $static_data.settings.deviceViewHeaderTextLength) {
			updateMessages({
				message: `headers limit is ${$static_data.settings.deviceViewHeaderTextLength} we can't add more.`,
				variant: 'alert'
			});
			return 0;
		}
	};
</script>

<div class="modal">
	<button on:click={handleClose} class="close-btn"><Icon src={XMark} /></button>
	{#if newSpecItem.visible}
		<div class="spec-input-modal" transition:fade>
			<div class="inner-spec-modal">
				<div class="form">
					<h2>Add Specs of {item.title} {newSpecItem.specs.toUpperCase()}</h2>
					<p>
						In our device dataset, all specifications have a key and value. When adding new
						specifications, we need to provide both the key and value. The first input is for the
						key, and the second input is for the value.
					</p>
					<form>
						<div class="flex-yxz">
							<div class="a03x full-w">
								<label for="new-key">NEW {newSpecItem.specs.toUpperCase()} SPEC TITLE</label>
								<input
									type="text"
									name="new-key"
									id="new-key"
									value={newSpecItem.key ?? ''}
									placeholder="E.g. Screen width"
									on:change={(e) => {
										newSpecItem = { ...newSpecItem, key: e.target?.value };
									}}
									required
								/>
							</div>
							<div class="a03x full-w">
								<label for="spec-value">NEW {newSpecItem.specs.toUpperCase()} SPEC VALUE</label>
								<input
									type="text"
									name="spec-value"
									id="spec-value"
									value={newSpecItem.value ?? ''}
									placeholder="E.g 720 pixels"
									on:change={(e) => {
										newSpecItem = { ...newSpecItem, value: e.target?.value };
									}}
								/>
							</div>
						</div>
						<div class="flex-yxz">
							<button type="button" on:click={addSpecItemInDF}>ADD SPECS</button>
							<button type="button" on:click={() => (newSpecItem = { visible: false })}
								>CANCIL</button
							>
						</div>
					</form>
				</div>
			</div>
		</div>
	{/if}
	<div class="inner-modal">
		<div class="form" id="dataframe-form">
			<h2>{item.title}</h2>
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
			<p>
				You can add new, update or delete the device. take any action carefully there is no change
				to undo your actions.
			</p>
			<form on:submit={handleForm} id="phone-form">
				<div class="flex" style="justify-content:space-between;">
					<input style="margin:0" type="submit" value="SAVE PHONE" />
				</div>
				<div class="flex-yxz">
					<div class="a03x">
						<label for="title">DEVICE TITLE HERE</label>
						<input
							type="text"
							name="_y_title"
							id="title"
							placeholder="E.g. Samsung Galaxy A02"
							value={item.title}
							required
						/>
					</div>
					<div class="a03x">
						<label for="category">DEVICE CATEGORY</label>
						<select name="_y_category" id="category">
							{#if !cats.length}
								<option selected value={item.category}>{item.category}</option>
							{/if}
							{#each cats as cat}
								{#if cat.category === item.category}
									<option selected value={cat.category}>{cat.category}</option>
								{:else}
									<option value={cat.category}>{cat.category}</option>
								{/if}
							{/each}
						</select>
					</div>
				</div>
				<div class="flex-yxz">
					<div class="a03x full-w">
						<label for="description">PHONE DESCRIPTION</label>
						{#if loading}
							<div style="width: 256px;">
								<Loading />
							</div>
						{:else}
							<textarea
								name="description"
								id="description"
								placeholder="Type something about phone"
								required>{item.description}</textarea
							>
						{/if}
					</div>
				</div>
				<div class="flex-yxz">
					<div class="a03x full-w">
						<label for="description"
							>PHONE HEADERS <small
								>(seperate with Enter (\n). You can add maximum {$static_data.settings
									.deviceViewHeaderTextLength} headers)</small
							></label
						>
						{#if loading}
							<div style="width: 256px;">
								<Loading />
							</div>
						{:else}
							<textarea
								name="headers"
								id="headers"
								on:change={handleHeadersArea}
								placeholder="Type something about phone"
								required>{headers}</textarea
							>
						{/if}
					</div>
				</div>

				<div class="flex-yxz">
					<div class="a03x full-w image-input">
						<label for="phone-image">PHONE IMAGE</label>
						{#if loading}
							<Loading />
						{:else}
							<div
								class="add-image"
								on:mousedown={() => document.querySelector('#phone-image')?.click()}
							>
								<Icon src={Photo} />
								<span>Click to add image's</span>
							</div>
						{/if}
						<input
							type="file"
							name="phone-image"
							id="phone-image"
							accept="image/*"
							multiple={true}
							on:change={handleImage}
						/>
					</div>
				</div>
				<div class="flex-yxz image-list">
					{#each filesList as file}
						<div class="image-view">
							<button><Icon src={XMark} /></button>
							<img src={file} alt={file} />
						</div>
					{/each}
				</div>

				{#each item_specs as specs}
					<div class="add-spec-item">
						<h3 class="spec-item-title" id={'__' + specs} data-original={specs} contenteditable>
							{specs}
						</h3>
						<button
							type="button"
							on:click={() => addNewElement(specs.replaceAll(' ', '') + '-super')}
							><Icon src={Plus} /></button
						>
					</div>
					<div class="flex-yxz spec-items" id="{specs.replaceAll(' ', '')}-super">
						{#each dataFrame[specs] as spec, item_index}
							{#each Object.keys(spec) as key}
								<div class="a03x c-88323">
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
										on:click={() => addToHeader(`s${key.replaceAll(' ', '')}-spec`)}
									>
										<Icon src={Plus} />
									</button>
								</div>
							{/each}
						{/each}
					</div>
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
						<CustomNumberInput bind:output={views} value={dataFrame.views} title={'Views'} />
					</div>
					<div class="a03x">
						<CustomNumberInput
							bind:output={rating}
							value={dataFrame.rating}
							title={'Rating'}
							maximum={5.0}
							minimum={0.0}
							callback={(n) => Number(n.toFixed(1))}
							step={0.1}
						/>
					</div>
					<div class="a03x">
						<CustomNumberInput bind:output={loves} value={dataFrame.loves} title={'Loves'} />
					</div>
				</div>

				<div class="flex-yxz">
					<h3 class="spec-item-title">KEYWORDS</h3>
					<div class="keywords-list">
						{#if dataFrame.keywords}
							{#each dataFrame.keywords.split(',') as keyword}
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

				<div class="flex-yxz">
					<div class="a03x a03x-1">
						<input
							type="checkbox"
							on:change={(e) => (dataFrame.isActive = e.target?.checked)}
							name="is-active"
							id="is-active"
							checked={item.isActive}
						/>
						<label for="is-active">VISIBLE <small>(toggle visibility of the device)</small></label>
					</div>
					<div class="a03x a03x-1">
						<input
							type="checkbox"
							name="is-new"
							id="is-new"
							on:change={(e) => (dataFrame.isNew = e.target?.checked)}
							checked={item.isNew}
						/>
						<label for="is-new">ITEM IS NEW <small>(toggle to item as new)</small></label>
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
								value={item.slug}
								id="slug"
								placeholder="Enter phone slug here..."
							/>
						{/if}
					</div>
				</div>
				<input type="submit" value="UPDATE PHONE" />
			</form>
		</div>
	</div>
</div>

<style lang="scss">
	
	</style>
