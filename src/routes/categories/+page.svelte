<script lang="ts">
	import Categories from '$compo/categories.svelte';
	import { PUBLIC_IMAGES_FETCH_URI } from '$env/static/public';
	import { getRandomColor  } from '$lib/globals';
	import { modal, modalUpdate, promptModalUpdate, updateMessages } from '$lib/store';
	import axios from 'axios';
	import type { PageData } from './$types';
	import {
		Icon,
		ListBullet,
		Photo,
		Wrench,
		Plus,
		Tag,
		Bolt,
		ChartBarSquare,
		DocumentChartBar,
		Cog8Tooth,
		Trash
	} from 'svelte-hero-icons';
	import { fade } from 'svelte/transition';
	import ListHeadFilters from '$compo/list-head-filters.svelte';
	import { onMount } from 'svelte';
	//import { goto } from '$app/navigation';
	export let data: PageData;
	let selectedItems:any = [];
	let prev_cat: any = {};
	let query: any = {};
	const handleFiltersAndTypes = (e: any, type: string) => {
		let value = typeof e === 'string' ? e : e.target.value;
		query[type] = value;
		if (type === 'category-type' && value === 'all') prev_cat['_id'] = 'all';
	};
	const handleFilteredSearch = async () => {
		let final = '';
		Object.keys(query).forEach((q) => {
			final += `${q}=${query[q]}&`;
		});
		if (final.at(-1) === '&') final = final.substring(0, final.length - 1);
		//await goto(`categories/?${final}`);
		window.location.href = `categories/?${final}`
	};
	const sort = (by: any): any => {
		let order = by.target.value.split('_').at(-1);
		by = by.target.value.split('_')[0];
		let comp_a = order === 'asc' ? 1 : -1;
		let comp_b = order === 'desc' ? 1 : -1;
		if (by === 'isActive') {
			list = JSON.parse(data.categories).sort((a: any, b: any) => {
				if (!a.isActive && b.isActive) return comp_a;
				if (a.isActive && !b.isActive) return comp_b;
				return 0;
			});
		} else if (by === 'createdAt')
			list = JSON.parse(data.categories).sort((a: any, b: any) => {
				const x: any = new Date(a.createdAt);
				const y: any = new Date(b.createdAt);
				return x - y;
			});
		else
			list = JSON.parse(data.categories).sort((a: any, b: any) => {
				if (a[by] > b[by]) return comp_a;
				if (a[by] < b[by]) return comp_b;
				else return 0;
			});
	};
	let categories = JSON.parse(data.categories);
	let list = categories;
	const handleEdit = (item: any) => {
		modalUpdate({ visible: true, item: item, title: item.category, action: 'edit' });
	};
	const handleDelete = (item: any) => {
		promptModalUpdate({

			visible: true,
			title: `CONFIRM DELETE`,
			description: `Are you sure you want to delete the category '${item.category}'? Please proceed with caution, as this action is irreversible and cannot be undone.`,
			confirm: [
				{
					title: 'DELETE',
					class: 'bg-danger',
					callback: async () => {
						await axios
							.post(
								'/api/delete-items',
								{ _id: item._id, image: item.image },
								{ headers: { requestFor: 'deleteCategory' } }
							)
							.then((e) => {
								updateMessages({
									message: e.data.message,
									variant: e.data.success ? 'success' : 'alert'
								});
								if (e.data.success) list = list.filter((e: any) => e._id !== item._id);
								promptModalUpdate({ visible: false });
							})
							.catch((e) => console.error(e));
					},
					type: 'button'
				},
				{
					title: 'CANCIL',
					callback: () => promptModalUpdate({ visible: false }),
					type: 'button'
				}
			]
		});
	};
	onMount(() => {
		let selectors: any = document.querySelectorAll('.selector-list');
		let selectAllCheck: any = document.getElementById('select-all');
		selectors.forEach((selector: any) => {
			selector.addEventListener('change', (e: any) => {
				let id = e.target.getAttribute('data-id');
				if (e.target.checked) {
					selectedItems = [...selectedItems, id];
				} else {
					selectedItems = selectedItems.filter((e:any) => e !== id);
				}
				if (selectedItems.length > 0) selectAllCheck.indeterminate = true;
				else selectAllCheck.indeterminate = false;
			});
			// selectedItems = selectedItems
		});
		selectAllCheck.addEventListener('change', (e: any) => {
			selectedItems = [];
			selectors.forEach((selector: any) => {
				let id = selector.getAttribute('data-id');
				if (e.target.checked) {
					selectedItems.push(id);
					selector.checked = true;
				} else {
					selector.checked = false;
					selectedItems = [];
				}
			});
		});
	});
</script>

{#if $modal.visible}
	<Categories />
{/if}

<div transition:fade>
	<h2>Categories List</h2>
	<div class="product-list-view">
		<div class="head">
			<div class="flex">
				<p style="margin-right: 20px">Edit, update or add new category</p>
				<button
					class="btn flex"
					type="button"
					on:click={() =>
						modalUpdate({ visible: true, item: {}, title: 'Add new category', action: 'new' })}
				>
					<span>NEW CATEGORY</span>
					<Icon src={Plus} />
				</button>
			</div>
		</div>
		<ListHeadFilters
			{prev_cat}
			{selectedItems}
			{handleFilteredSearch}
			{handleFiltersAndTypes}
			{sort}
			collection="categories"
		/>
		<div class="container">
			<table>
				<thead>
					<tr class="item-head item-section" style={`background: ${getRandomColor(0.1)}`}>
						<th>
							<div>
								<input class="check-box-selected" type="checkbox" name="" id="select-all" />
							</div>
						</th>
						<th>
							<div>
								<Icon src={ListBullet} />
								<span style="margin-left: 10px;">#</span>
							</div>
						</th>
						<th>
							<div class="flex">
								<Icon src={Photo} />
								<span style="margin-left: 10px;">Logo</span>
							</div>
						</th>
						<th>
							<div class="flex">
								<Icon src={Tag} />
								<span style="margin-left: 10px;">Title</span>
							</div>
						</th>
						<th>
							<div class="flex">
								<Icon src={Bolt} />
								<span style="margin-left: 10px;">Type</span>
							</div>
						</th>
						<th>
							<div class="flex">
								<Icon src={ChartBarSquare} />
								<span style="margin-left: 10px;">Items</span>
							</div>
						</th>
						<th>
							<div class="flex">
								<Icon src={Cog8Tooth} />
								<span style="margin-left: 10px;">Actions</span>
							</div>
						</th>
					</tr>
				</thead>
				<tbody>
					{#each list as item, index}
						<tr
							class="fade-in item-section list"
							style={`background: ${getRandomColor(0.1)};animation-delay: ${index * 100}ms`}
						>
							<td style="text-align:center;"
								><input
									type="checkbox"
									class="check-box-selected selector-list"
									data-id={item._id}
								/></td
							>
							<td>{item.index}</td>
							<td>
								{#if item.image && item.image !== ''}
									<img
										class="list-image"
										src={item.image.includes('http')
											? item.image
											: PUBLIC_IMAGES_FETCH_URI + item.image}
										alt={item.category}
									/>
								{:else}
									<Icon class="list-image" src={DocumentChartBar} />
								{/if}
							</td>
							<td style="text-transform:uppercase;text-align:left;">{item.category}</td>
							<td style="text-transform: capitalize">{item.type}</td>
							<td>{item.items}</td>
							<td>
								<button title="Edit" on:click={() => handleEdit(item)}>
									<Icon src={Wrench} /></button
								>
								<button title="Delete" on:click={() => handleDelete(item)}
									><Icon src={Trash} /></button
								>
							</td>
						</tr>
					{/each}
				</tbody>
				<tfoot>
					<tr class="item-head item-section" style={`background: ${getRandomColor(0.1)}`}>
						<th>
						</th>
						<th>
							<div>
								<Icon src={ListBullet} />
								<span style="margin-left: 10px;">#</span>
							</div>
						</th>
						<th>
							<div class="flex">
								<Icon src={Photo} />
								<span style="margin-left: 10px;">Logo</span>
							</div>
						</th>
						<th>
							<div class="flex">
								<Icon src={Tag} />
								<span style="margin-left: 10px;">Title</span>
							</div>
						</th>
						<th>
							<div class="flex">
								<Icon src={Bolt} />
								<span style="margin-left: 10px;">Type</span>
							</div>
						</th>
						<th>
							<div class="flex">
								<Icon src={ChartBarSquare} />
								<span style="margin-left: 10px;">Items</span>
							</div>
						</th>
						<th>
							<div class="flex">
								<Icon src={Cog8Tooth} />
								<span style="margin-left: 10px;">Actions</span>
							</div>
						</th>
					</tr>
				</tfoot>
			</table>
		</div>
	</div>
</div>

<style lang="scss">
	table td,
	table th {
		text-align: center;
	}
	.check-box-selected {
		width: 17px;
		height: 17px;
		margin: auto;
	}
	img.list-image {
		width: 98px;
		height: 50px;
		object-fit: scale-down;
		border-radius: unset !important;
		padding: 1px;
		border: none;
		background: white;
	}
</style>
