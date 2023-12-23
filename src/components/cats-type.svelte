<script lang="ts">
	import { ArrowDownCircle, Cog6Tooth, Icon, Plus, Trash } from 'svelte-hero-icons';
	import Loading from './loading.svelte';
	import { promptModalUpdate, updateMessages } from '$lib/store';
	import axios from 'axios';
	import { slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	let loading = false;
	let message: any = false;
	let catTypes: any = [];
	let checking: any = undefined;
	export let types_list: any = [];
	const dispatch = createEventDispatcher();
	const updateCatTypes = () => {
		dispatch('updateCats', catTypes);
	};
	onMount(async () => {
		if (types_list.length > 0) {
			catTypes = types_list;
		} else {
			await axios
				.get('/api/get-items', { params: { getCatTypes: 1 } })
				.then((e) => {
					catTypes = e.data;
				})
				.catch((e) => console.error(e));
		}
	});
	const handleEdit = async (_id: string): Promise<void> => {
		let item: any = {};
		for (let type of catTypes) {
			if (type._id === _id) {
				item = type;
				break;
			}
		}
		promptModalUpdate({
			visible: true,
			title: `Change category type name`,
			description: `Change the type name but keep in mind if name is exist then no changes happen.`,
			remove_close_button: true,
			form: {
				inputs: [
					{
						label: 'Edit title.',
						type: 'text',
						placeholder: 'Enter category type name...',
						name: 'type-name',
						value: item.title
					},
					{
						label: 'Edit description.',
						type: 'textarea',
						placeholder: 'Edit category type',
						name: 'type-desc',
						value: item.description
					}
				],
				buttons: [
					{ type: 'submit', title: 'UPDATE' },
					{ type: 'button', title: 'CLOSE', callback: () => promptModalUpdate({ visible: false }) }
				],
				onSubmit: async (e: any) => {
					let t = e.target['type-name'].value.toLowerCase();
					let d = e.target['type-desc'].value;
					handleAdd(t, d, _id);
					promptModalUpdate({ visible: false });
				}
			}
		});
	};
	const handleDelete = (_id: string, title: string, categories: number): void => {
		if (title === 'general')
			return updateMessages({
				message:
					"You can't delete general category because its default category and many items is related to this category.",
				variant: 'danger'
			});

		promptModalUpdate({
			visible: true,
			title: `CONFIRM DELETE CATEGORY TYPE`,
			description: `
				Are you sure you to delete type '${title}'? this category type have ${categories} categories. Please proceed with caution, as this action is irreversible and cannot be undone.
			`,
			confirm: [
				{
					title: 'YES',
					class: 'bg-danger',
					callback: async () => {
						console.log('sending...');
						await axios
							.post(
								'/api/delete-items',
								{ _id, categories },
								{
									headers: { requestFor: 'deleteCatType' }
								}
							)
							.then((res) => {
								if (res.data.success) {
									updateMessages({
										message: 'Category type deleted successfully!',
										variant: 'success'
									});
									promptModalUpdate({ visible: false });
									catTypes = catTypes.filter( (e:any) => e._id != _id)
									updateCatTypes()
								}
							})
							.catch((res) => console.log(res));
					},
					type: 'button'
				}
			]
		});
	};
	let titleExist = true;
	const handleCheck = (e: Event) => {
		loading = true;
		message = false;
		const element = (e.target as HTMLInputElement).value.trim();
		if (checking) clearTimeout(checking);
		checking = setTimeout(async () => {
			await axios
				.get('/api/get-items', { params: { checkCatTypeExistence: 1, type: element.toLowerCase() } })
				.then((e) => {
					if (e.data.exist) {
						message = { message: 'Already exist please try another title', variant: 'alert' };
						titleExist = true;
					} else {
						titleExist = false;
					}
				})
				.catch((e) => console.error(e));
			loading = false;
		}, 500);
	};
	let catTypeValue = '';
	let catTypeDesc = '';
	const handleAdd = async (title: string, desc: string, _id: string | boolean = false) => {
		message = false;
		if (_id === false && titleExist) {
			if (_id)
				updateMessages({ message: 'title exist please choose another title.', variant: 'alert' });
			else message = { message: 'title exist please choose another title.', variant: 'alert' };
			return;
		}

		if (title === '') {
			if (_id)
				updateMessages({ message: 'Please add title of your category type.', variant: 'alert' });
			else message = { message: 'Please add title of your category type.', variant: 'alert' };
			return;
		}
		let form = new FormData();
		form.append('setCatType', title.toLowerCase());
		form.append('setCatDesc', desc);
		//@ts-ignore;
		if (_id) form.append('_id', _id);
		await axios
			.post(`/api/${_id ? 'update-items' : 'set-items'}`, form, {
				headers: { requestFor: 'setCatType' }
			})
			.then((res) => {
				if (res.data.response === 'success') {
					if (_id) updateMessages({ message: 'successfully updated!', variant: 'success' });
					else message = { message: 'successfully added!', variant: 'success' };
					if (_id === false) {
						delete res.data.success;
						catTypes = [res.data, ...catTypes];
					} else {
						catTypes = catTypes.map((e: any) => {
							if (e._id === _id) {
								return { ...e, title, description: desc };
							} else return e;
						});
					}
					updateCatTypes();
					catTypeDesc = '';
					catTypeValue = ''
				} else if (res.data.response === 'Exist') {
					if (_id)
						updateMessages({
							message:
								'Category type title already exist. title is not changed but description is changed',
							variant: 'alert'
						});
					else
						message = {
							message: 'Category type title already exist. please choose another title.',
							variant: 'alert'
						};
				} else if (res.data.response === 'Empty') {
					if (_id) updateMessages({ message: 'Please fill title field.', variant: 'alert' });
					message = { message: 'Please fill title field.', variant: 'alert' };
				} else console.error(res.data);
			})
			.catch((e) => console.error(e));
	};
	let typeToggled = false;
	const handleTypesToggler = (e: Event) => {
		typeToggled = !typeToggled;
		let svg = document.querySelector('.expand-tree svg') as HTMLElement | null;
		if (typeToggled && svg) svg.style.transform = 'rotate(180deg)';
		else if (svg) svg.style.transform = 'rotate(0deg)';
	};
</script>

<div class="flex-yxz types-category">
	<div style="width: 100%">
		<button class="expand-tree" type="button" on:click={handleTypesToggler}>
			<p>List of categories types</p>
			<Icon src={ArrowDownCircle} class="arrow-expand" style="margin-left: 10px;" />
		</button>
		{#if typeToggled}
			<div transition:slide|global>
				<div class="highlight-bg">
					<div class="a03x full-w">
						<label for="category-type"
							>NEW TYPE <small
								>(Add new category type like shoes, clothes, phones, laptops, etc. sub categories
								come under this tpyes).</small
							></label
						>
						<input
							type="text"
							name="category-type"
							id="category-type"
							placeholder="E.g. laptops / ear buds / face beauty"
							bind:value={catTypeValue}
							on:keyup={handleCheck}
						/>
					</div>

					<div class="a03x full-w">
						<label for="category-desc">About Category type</label>
						<textarea
							name="category-desc"
							id="category-desc"
							placeholder="Say something about category type"
							bind:value={catTypeDesc}
						/>
					</div>

					<div class="a03x">
						{#if message}
							<span class={`message ${message.variant}`}>{message.message}</span>
						{/if}
					</div>
					<div class="a03x">
						{#if loading}
							<div style="margin-left: 10px;"><Loading type="spinner" /></div>
						{:else}
							<button
								class="btn btn-small"
								type="button"
								on:click={() => handleAdd(catTypeValue, catTypeDesc)}
							>
								<Icon src={Plus} />
							</button>
						{/if}
					</div>
				</div>

				<div class="a03x full-w table-view">
					<p>
						Edit, delete and add more types of categories. sub categories come under this category
						types
					</p>
					<div class="ut23">
						<table>
							<thead>
								<tr>
									<th>#</th>
									<th>Type</th>
									<th>Categories</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{#each catTypes as cat, i}
									<tr>
										<td>{i + 1}</td>
										<td>{cat.title}</td>
										<td>{cat.categories}</td>
										<td>
											<button
												class="btn btn-small"
												on:click={() => handleDelete(cat._id, cat.title, cat.categories)}
												type="button"
											>
												<Icon src={Trash} />
											</button>
											<button
												class="btn btn-small"
												type="button"
												on:click={() => handleEdit(cat._id)}
											>
												<Icon src={Cog6Tooth} />
											</button>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.a03x {
		& label {
			margin-bottom: 8px;
			font-size: 12px;
		}
	}
	.btn-small {
		margin-top: 0;
		margin-bottom: 0;
		width: 60px !important;
	}
	.table-view {
		& .ut23 {
			max-height: 600px;
			overflow-y: scroll;
		}
		& table {
			width: 100%;

			& tr {
				text-align: left;
				background: #4343434d;
				& td,
				& th {
					padding: 8px;
				}
				&:nth-child(even) {
					background: #7b7b7b4d;
				}
			}
		}
	}
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
