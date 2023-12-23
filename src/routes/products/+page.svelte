<script lang="ts">
	import type { PageData } from './$types';
	import { PUBLIC_IMAGES_FETCH_URI } from '$env/static/public';
	import { getRandomColor, life } from '$lib/globals';
	import {
		Icon,
		Eye,
		EyeSlash,
		CircleStack,
		Clock,
		ListBullet,
		Photo,
		QueueList,
		Wrench,
		Cog6Tooth,
		Plus,
		Trash,
		Funnel
	} from 'svelte-hero-icons';
	import { modal, promptModalUpdate, static_data, updateMessages } from '$lib/store';
	import SmartDeviceView from '$compo/product-view.svelte';
	import axios from 'axios';
	import Pagination from '$compo/pagination.svelte';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import CategoryInputView from '$compo/category-input-view.svelte';
	import ListHeadFilters from '$compo/list-head-filters.svelte';
	export let data: PageData;
	let items: any = data.list;
	let filtered_total_items = 0;
	$: data.pageNo, (items = data.list), (filtered_total_items = data.total);

	let selectedItems: string[] = [];

	const handleDelete = (item: any) => {
		promptModalUpdate({
			visible: true,
			title: `CONFIRM DELETE`,
			description: `Are you sure you want to delete the item '${item.title}'? Please proceed with caution, as this action is irreversible and cannot be undone.`,
			confirm: [
				{
					title: 'DELETE',
					class: 'bg-danger',
					callback: async () => {
						await axios
							.post(
								'/api/delete-items',
								{ _id: item._id, model: 'product' },
								{ headers: { requestFor: 'deleteItem' } }
							)
							.then((e) => {
								updateMessages({
									message: e.data.message,
									variant: e.data.success ? 'success' : 'alert'
								});
								if (e.data.success) items = items.filter((e: any) => e._id !== item._id);
								promptModalUpdate({ visible: false });
							})
							.catch((e) => console.error(e));
					},
					type: 'button'
				}
			]
		});
	};
	let prev_cat: any = {};

	let query: any = {};
	onMount(() => {
		for (let i of $page.url.searchParams.keys()) query[i] = $page.url.searchParams.get(i);
		if ($page.url.searchParams.get('category-type'))
			prev_cat['type'] = $page.url.searchParams.get('category-type');
		if ($page.url.searchParams.get('category'))
			prev_cat['_id'] = $page.url.searchParams.get('category');
	});
	const handleFiltersAndTypes = (e: any, type: string) => {
		let value = typeof e === 'string' ? e : e.target.value;
		query[type] = value;
		if (type === 'category-type' && value === 'all') prev_cat['_id'] = 'all';
	};
	const handleFilteredSearch = () => {
		let final = '';
		Object.keys(query).forEach((q) => {
			final += `${q}=${query[q]}&`;
		});
		if (final.at(-1) === '&') final = final.substring(0, final.length - 1);
		goto(`products/?${final}`);
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
					selectedItems = selectedItems.filter((e) => e !== id);
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
	const sort = (by: any): any => {
		let order = by.target.value.split('_').at(-1);
		by = by.target.value.split('_')[0];
		let comp_a = order === 'asc' ? 1 : -1;
		let comp_b = order === 'desc' ? 1 : -1;
		if (by === 'isActive') {
			items = data.list.sort((a: any, b: any) => {
				if (!a.isActive && b.isActive) return comp_a;
				if (a.isActive && !b.isActive) return comp_b;
				return 0;
			});
		} else if (by === 'createdAt')
			items = data.list.sort((a: any, b: any) => {
				const x: any = new Date(a.createdAt);
				const y: any = new Date(b.createdAt);
				return x - y;
			});
		else
			items = data.list.sort((a: any, b: any) => {
				if (a[by] > b[by]) return comp_a;
				if (a[by] < b[by]) return comp_b;
				else return 0;
			});
	};
</script>

<div transition:fade|global>
	<h2>Products List</h2>
	<div class="product-list-view">
		<div class="head">
			<div class="flex">
				<p>Change product settings carefully because any action can't be undo.</p>
				<button
					class="btn flex"
					style="width: 148px;height: 45px;margin-left:40px;"
					on:click={() => goto('/product-manager/new')}
				>
					<Icon src={Plus} /> PRODUCT
				</button>
			</div>
		</div>
		<ListHeadFilters
			{prev_cat}
			{selectedItems}
			{handleFilteredSearch}
			{handleFiltersAndTypes}
			{sort}
			filters = {data.filters}
			collection="product"
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
							<div>
								<Icon src={Photo} />
								<span style="margin-left: 10px;">Image</span>
							</div>
						</th>
						<th class="item-name">
							<div>
								<Icon src={QueueList} />
								<span style="margin-left: 10px;">Title</span>
							</div>
						</th>
						<th>
							<div>
								<Icon src={CircleStack} />
								<span style="margin-left: 10px;">Category</span>
							</div>
						</th>
						<th>
							<div>
								<Icon src={Clock} />
								<span style="margin-left: 10px;">Created</span>
							</div>
						</th>
						<th>
							<div>
								<Icon src={Eye} />
								<span style="margin-left: 10px;">Acitve</span>
							</div>
						</th>
						<th>
							<div>
								<Icon src={Cog6Tooth} />
								<span style="margin-left: 10px;">Action</span>
							</div>
						</th>
					</tr>
				</thead>
				<tbody>
					{#each items as item, index}
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
								{#if item.images.length}
									<img
										src={item.images[0].includes('http')
											? item.images[0]
											: PUBLIC_IMAGES_FETCH_URI + item.images[0]}
										alt={item.title}
									/>
								{:else}
									<Icon src={Photo} class="image-alter" />
								{/if}
							</td>
							<td>{item.title}</td>
							<td class="fs-12 capi"
								>{item.category ? `${item.category}` : 'NULL'}</td
							>
							<td class="fs-12">{life(item.createdAt).from()}</td>
							<td
								>{#if item.isActive}<Icon src={Eye} /> {:else} <Icon src={EyeSlash} />{/if}</td
							>
							<td>
								<button title="Edit" on:click={() => goto(`/product-manager/${item._id}`)}
									><Icon src={Wrench} /></button
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
						<th />
						<th>
							<div>
								<Icon src={ListBullet} />
								<span style="margin-left: 10px;">#</span>
							</div>
						</th>
						<th>
							<div>
								<Icon src={Photo} />
								<span style="margin-left: 10px;">Image</span>
							</div>
						</th>
						<th class="item-name">
							<div>
								<Icon src={QueueList} />
								<span style="margin-left: 10px;">Title</span>
							</div>
						</th>
						<th>
							<div>
								<Icon src={CircleStack} />
								<span style="margin-left: 10px;">Category</span>
							</div>
						</th>
						<th>
							<div>
								<Icon src={Clock} />
								<span style="margin-left: 10px;">Created</span>
							</div>
						</th>
						<th>
							<div>
								<Icon src={Eye} />
								<span style="margin-left: 10px;">Acitve</span>
							</div>
						</th>
						<th>
							<div>
								<Icon src={Cog6Tooth} />
								<span style="margin-left: 10px;">Action</span>
							</div>
						</th>
					</tr>
				</tfoot>
			</table>
		</div>
		<Pagination
			__count__={data.total}
			renderFor={`/products/`}
			pageNo={data.pageNo}
		/>
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
	.product-list-view {
		.item-section {
			& img {
				width: 100%;
				display: block;
				object-fit: contain;
			}
		}
	}
</style>
