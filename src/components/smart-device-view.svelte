<script lang="ts">
	import axios from 'axios';
	import { Icon, Photo, Plus, XMark } from 'svelte-hero-icons';
	import { modal, modalUpdate, static_data, updateMessages, updateStaticData } from '$lib/store';
	import { IMAGE_ROOT } from '$lib/constant';
	import { life, numberFormat } from '$lib/globals';
	import Loading from './loading.svelte';
	import { fade } from 'svelte/transition';
	import CustomNumberInput from './custom-number-input.svelte';
	let loading = true;
	let item = $modal;
	// $: $modal, (item = $modal), setTimeout(() => getItem($modal._id), 10);
	$: $modal, (item = $modal), getItem($modal._id);
	let cats: [] | any = $static_data.categories;
	document.querySelector('body')?.classList.add('modal-open');
	const handleClose = () => {
		modalUpdate({ visiable: false });
		document.querySelector('body')?.classList.remove('modal-open');
	};
	let filesList: any = [];
	let item_specs: any = [];
	let item_specs_exclude = [
		'visiable',
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
	const getItem = async (_id: string) => {
		await axios
			.get('/api/get-items/', {
				params: { smart_device: 1, _id, getCats: cats.length > 0 ? 0 : 1 }
			})
			.then((e) => {
				loading = false;
				item = { ...item, ...e.data.item };
				dataFrame = item;
				let x = Object.keys(item);
				item_specs = x.filter((e) => (item_specs_exclude.includes(e) ? null : e));
				// console.log('item_specs: ', item_specs)
				filesList = [IMAGE_ROOT + item.image, ...filesList];
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
	const handleImage = (e: any) => {
		[...e.target.files].forEach((image) => {
			let reader = new FileReader();
			reader.onload = (e: any) => {
				filesList = [...filesList, e.target.result];
			};
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
		// newSpecItem.specs_list.appendChild(`<span>hello world</span>`)
		// newSpecItem = { ...newSpecItem, key: '', value: '' };
	};
	const handleForm = (e: any) => {
		e.preventDefault();
		let inputs = document.querySelectorAll('#dataframe-form input');
		let desc = document.querySelectorAll('#dataframe-form #description');
		let cat = document.querySelectorAll('#dataframe-form #category');

		[...inputs].forEach((element:any) => {
			let key = element.name.split('_x_')[1];
			let value = element.value;
			if (key) {
				let loc = element.name?.split('___')[0];
				let index = element.name?.match(/\d+(?=_x_)/);
				if (index) index = index[0];
				console.log('key => ', key);
				dataFrame[loc][index] = {[key]:value}
				console.log(dataFrame[loc][index], '=> ', {[key]:value});
			}
		});
		console.log('results: ', dataFrame['features'])
	};
	let child_value = 0;
	$: child_value, console.log(child_value);
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
							name="title"
							id="title"
							placeholder="E.g. Samsung Galaxy A02"
							value={item.title}
							required
						/>
					</div>
					<div class="a03x">
						<label for="category">DEVICE CATEGORY</label>
						<select name="category" id="category">
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
						<h3 class="spec-item-title">{specs}</h3>
						<button
							type="button"
							on:click={() => addNewElement(specs.replaceAll(' ', '') + '-super')}
							><Icon src={Plus} /></button
						>
					</div>
					<div class="flex-yxz spec-items" id="{specs.replaceAll(' ', '')}-super">
						{#each dataFrame[specs] as spec, item_index}
							{#each Object.keys(spec) as key}
								<div class="a03x">
									<label for="s{key.replaceAll(' ', '')}-spec">{key}</label>
									<input
										type="text"
										name="{specs}___{item_index}_x_{key}"
										value={spec[key]}
										id="s{key.replaceAll(' ', '')}-spec"
										placeholder="Enter {key} details"
									/>
								</div>
							{/each}
						{/each}
					</div>
				{/each}

				<div class="flex-yxz number-sec">
					<div class="a03x">
						<CustomNumberInput bind:output={child_value} value={dataFrame.views} title={'Views'} />
					</div>
					<div class="a03x">
						<CustomNumberInput
							bind:output={child_value}
							value={dataFrame.rating}
							title={'Rating'}
							maximum={5.0}
							minimum={0.0}
							callback={(n) => Number(n.toFixed(1))}
							step={0.1}
						/>
					</div>
					<div class="a03x">
						<CustomNumberInput bind:output={child_value} value={dataFrame.loves} title={'Loves'} />
					</div>
				</div>

				<div class="flex-yxz">
					<h3 class="spec-item-title">Keywords</h3>
					<div class="keywords-list">
						{#if dataFrame.keywords}
							{#each dataFrame.keywords.split(',') as keyword}
								{#if keyword.length > 2}
									<span>{keyword}</span>
								{/if}
							{/each}
						{/if}
					</div>
					<div class="a03x">
						<label for="keywords">ENTER KEYWORD</label>
						<input
							type="text"
							name="keywords"
							id="keywords"
							placeholder="Enter revelant keyword..."
						/>
					</div>
				</div>

				<div class="flex-yxz">
					<div class="a03x a03x-1">
						<input type="checkbox" name="is-active" id="is-active" checked={item.isActive} />
						<label for="is-active">VISIBLE <small>(toggle visibility of the device)</small></label>
					</div>
					<div class="a03x a03x-1">
						<input type="checkbox" name="is-new" id="is-new" checked={item.isNew} />
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
								name="slug"
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
	.spec-input-modal {
		position: fixed;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #000000b8;
		backdrop-filter: blur(11px);
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		& .inner-spec-modal {
			background: var(--modal-bg-2);
			width: 497px;
			padding: 10px;
			border-radius: 3px;
			border: 1px solid #ffffff17;
			& .form {
				margin: 0;
				& input[type='text'] {
					width: 100% !important;
				}
				& button {
					width: 48% !important;
					margin: 11px 3px;
					height: 42px;
					background: var(--button-color);
					border: 1px solid var(--button-border);
					border-radius: 34px;
					font-size: 14px;
					font-family: 'Inter';
					color: white;
					font-weight: 500;
					&:hover {
						opacity: 0.7;
					}
				}
			}
		}
	}
	.add-spec-item {
		margin-top: 26px;
		display: flex;
		align-items: center;
		& button {
			background: var(--secondary-bg);
			width: 28px;
			height: 28px;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-left: 12px;
			border: 2px solid #0000001c;
			padding: 4px;
		}
		& .spec-item-title {
			margin: 0;
			text-transform: uppercase;
		}
	}
	.keywords-list {
		margin: 13px 0;
		& span {
			background-color: rgba(0, 45, 255, 0.0901960784);
			border: 1px solid #008dff36;
			padding: 9px 12px;
			margin: 3px 4px;
			display: inline-block;
			font-size: 13px;
			border-radius: 18px;
		}
	}

	.image-view {
		position: relative;
		cursor: pointer;
		& button {
			position: absolute;
			right: 0;
			width: 25px;
			top: -9px;
			padding: 3px;
			height: 25px;
			display: flex;
			margin: 0;
			align-items: center;
			justify-content: center;
			background: black;
			border: none;
			border-radius: 50%;
			display: none;
		}
		&:hover {
			& > button {
				display: flex;
			}
		}
	}
	.image-input {
		& input {
			display: none;
		}
		& .add-image {
			padding: 10px;
			border: 1px solid rgba(0, 255, 141, 0.1411764706);
			width: 213px;
			border-radius: 8px;
			margin: 10px 0;
			text-align: center;
			display: flex;
			flex-direction: column;
			align-items: center;
			& span {
				text-align: center;
				width: 100%;
				font-size: 11px;
			}
		}
	}
	.image-list {
		margin: 5px 0;
		background: #27315f1a;
		padding: 10px;
		border-radius: 10px;
		min-height: 100px;
		& img {
			height: 110px;
			margin: 0 5px;
		}
	}
	.modal {
		background: #00000073;
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		backdrop-filter: blur(18px);
		right: 0;
		width: 100%;
		z-index: 10;
		color: var(--primary-color);
		display: flex;
		align-items: center;
		justify-content: center;
		& .close-btn {
			position: absolute;
			top: 34px;
			right: 52px;
			border-radius: 35px;
			width: 43px;
			background: #383838;
			height: 43px;
			border: none;
			&:hover {
				background: #ff004e;
			}
		}
		& .inner-modal {
			color: inherit;
			border-radius: 8px;
			background: var(--bg-color);
			padding: 20px;
			max-width: 90%;
			overflow-y: scroll;
			max-height: 90%;
			border: 1px solid rgba(255, 255, 255, 0.0705882353);
			&::-webkit-scrollbar {
				width: 2px;
				background: var(--bg-color);
			}
			&::-webkit-scrollbar-thumb {
				background: linear-gradient(45deg, transparent, #4b3fff, transparent);
			}
		}
	}

	.form {
		padding: 13px 57px;
		margin-left: 76px;
		& .selected-files-list {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			align-items: flex-start;

			& span {
				display: flex;
				font-size: 12px;
				border: 1px solid #7aff00;
				background: rgba(6, 252, 129, 0.2392156863);
				margin: 3px;
				border-radius: 4px;
				padding: 2px 8px;
				align-items: center;
			}

			& .close-333 {
				background: transparent;
				font-size: 18px;
				border: none;
				font-weight: bold;
				cursor: pointer;
				color: black;
				padding: 1px 7px;
				transition: 500ms;

				&:hover {
					color: #ff0029;
				}
			}
		}

		& .drop-zone {
			width: 100%;
			height: 145px;
			border: 2px #00000059 dashed;
			border-radius: 10px;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			background: #05f20026;
			cursor: pointer;

			&.active {
				animation: dropZoneAnim 300ms ease-in forwards infinite;
				background-color: #05ff0052;
			}

			& input {
				display: none;
			}

			& .sp-1 {
				display: block;
				font-size: 18px;
				font-weight: 500;
			}

			& .sp-2 {
				font-size: 20px;
				font-weight: bold;
				margin: 6px auto;
				color: #8c8c8c;
			}

			& .btn-1 {
				height: 40px;
				width: 200px;
				border-radius: 39px;
				border: none;
				background: #0062ff;
				color: white;
				font-size: 14px;
				font-family: inherit;
				cursor: pointer;
			}
		}

		& h2 {
			text-transform: uppercase;
			font-size: 28px;
			letter-spacing: 1px;
		}

		& p {
			font-size: 14px;
			font-weight: 400;
		}

		& form {
			margin-top: 20px;
		}

		& .flex-yxz {
			display: flex;
			flex-wrap: wrap;
			align-items: flex-end;
			&.attachment {
				display: block;
			}

			& .a03x {
				display: flex;
				flex-direction: column;
				width: 48%;
				margin-top: 15px;
				margin-right: 20px;

				&.full-w {
					width: 100%;
				}

				& input,
				& select {
					height: 32px;
					border: none;
					border-bottom: 1px solid #5f5f5f52;
					width: 92%;
					background: none;
					color: inherit;
					&:active,
					&:hover {
						border-bottom-color: rgb(0, 255, 106);
					}
				}
				& select {
					cursor: pointer;
					text-transform: uppercase;
					& option {
						background: var(--bg-color);
						font-size: 14px;
						text-transform: uppercase;
					}
				}
				& input[type='checkbox'] {
					width: 15px;
					height: 15px;
					cursor: pointer;
				}
				& textarea {
					width: 100%;
					border: none;
					border-bottom: 2px solid #868686;
					padding: 9px 12px;
					font-size: 16px;
					border-radius: 12px 12px 0 0;
					min-height: 80px;
					background: #f700a71a;
					color: var(--primary-color);
					font-family: inherit;
					margin-top: 4px;
				}
				&.a03x-1 {
					flex-direction: row;
					align-items: center;
					margin: 21px 0 4px 0;
					& input[type='checkbox'] {
						margin-right: 16px;
					}
				}
			}

			&.spec-items {
				margin-bottom: 35px;
				position: relative;
				& label {
					text-transform: uppercase;
				}
				& .a03x {
					width: 31%;
				}
			}
			&.number-sec {
				& .a03x {
					width: 173px;
					margin-right: 43px;
					& input[type='number'] {
						border: 1px solid #7d7d7d40;
						border-radius: 25px;
						text-align: center;
						padding: 0 10px;
						margin-top: 6px;
						height: 38px;
					}
				}
			}
		}
		& input[type='submit'] {
			width: 278px;
			height: 50px;
			margin: 22px auto 11px 0;
			border-radius: 37px;
			border: 2px solid #0c5493;
			background: #0062ff;
			color: white;
			font-size: 14px;
			font-weight: 500;
			letter-spacing: 1px;
			cursor: pointer;
			&:hover {
				background: #002dff;
			}
		}
	}
</style>
