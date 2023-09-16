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
	export let data: PageData;
	let items: any = data.list;
	$: data.pageNo, (items = data.list);
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
				},
				{
					title: 'CANCIL',
					callback: () => promptModalUpdate({ visible: false }),
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
		let value = typeof e === 'string' ? e : e.target.value
		query[type] = e;
		if(type === 'category-type' && e === 'all') prev_cat['_id'] = 'all'
		console.log(query);
	};
	const handleFilteredSearch = () => {
		let final = '';
		Object.keys(query).forEach((q) => {
			final += `${q}=${query[q]}&`;
		});
		if (final.at(-1) === '&') final = final.substring(0, final.length - 1);
		goto(`products/?${final}`);
	};
</script>

{#if $modal.visible}
	<SmartDeviceView />
{/if}
<div transition:fade>
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
		<div class="form">
			<h3 style="margin:0;">Filters Products view</h3>
			<div class="flex-yxz">
				<div class="a03x" style="width:500px;margin-top:7px;">
					<CategoryInputView
						{prev_cat}
						catTypeCB={(e) => {
							handleFiltersAndTypes(e, 'category-type');
						}}
						asFilter={true}
						callback={(e) => handleFiltersAndTypes(e, 'category')}
					/>
				</div>
				<div class="a03x" style="width:129px;margin-top:7px;">
					<span>
						FILTER
						<select class="sort-select" on:change={(e) => handleFiltersAndTypes(e, 'filter')}>
							<option value="all">All</option>
							<option value="asDraft_1">Drafts</option>
							<option value="asDraft_0">Posted</option>
						</select>
					</span>
				</div>
				<div class="a03x" style="width: 159px;margin-top:7px;">
					<span>
						SORT BY
						<select class="sort-select" on:change={(e) => handleFiltersAndTypes(e, 'sort')}>
							<optgroup label="By Index">
								<option value="id_asc">Ascending</option>
								<option value="id_desc">Descending</option>
							</optgroup>
							<optgroup label="By Activeness">
								<option value="isActive_asc">Active</option>
								<option value="isActive_desc">Deactive</option>
							</optgroup>
							<optgroup label="By Title">
								<option value="title_asc">Ascending</option>
								<option value="title_desc">Descending</option>
							</optgroup>
							<optgroup label="By Category">
								<option value="category_asc">Ascending</option>
								<option value="category_desc">Descending</option>
							</optgroup>
							<optgroup label="By Date">
								<option value="createdAt_asc">Ascending</option>
								<option value="createdAt_desc">Descending</option>
							</optgroup>
						</select>
					</span>
				</div>
				<button
					class="btn flex"
					style="width: 148px;height: 45px;margin-left:4px;"
					on:click={handleFilteredSearch}
				>
					<Icon src={Funnel} />SEARCH
				</button>
			</div>
			<div class="flex-yxz" />
		</div>
		<!-- 			
		</div> -->
		<div class="container">
			<table>
				<thead>
					<tr class="item-head item-section" style={`background: ${getRandomColor(0.1)}`}>
						<th>
							<div class="flex">
								<Icon src={ListBullet} />
								<span style="margin-left: 10px;">#</span>
							</div>
						</th>
						<th>
							<div class="flex">
								<Icon src={Photo} />
								<span style="margin-left: 10px;">Image</span>
							</div>
						</th>
						<th class="item-name">
							<div class="flex">
								<Icon src={QueueList} />
								<span style="margin-left: 10px;">Title</span>
							</div>
						</th>
						<th>
							<div class="flex">
								<Icon src={CircleStack} />
								<span style="margin-left: 10px;">Category</span>
							</div>
						</th>
						<th>
							<div class="flex">
								<Icon src={Clock} />
								<span style="margin-left: 10px;">Created</span>
							</div>
						</th>
						<th>
							<div class="flex">
								<Icon src={Eye} />
								<span style="margin-left: 10px;">Acitve</span>
							</div>
						</th>
						<th>
							<div class="flex">
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
							<td class="item-name">{item.title}</td>
							<td class="item-cat">{item.category}</td>
							<td>{life(item.createdAt).from()}</td>
							<td
								>{#if item.isActive}<Icon src={Eye} /> {:else} <Icon src={EyeSlash} />{/if}</td
							>
							<td>
								<button title="Edit" on:click={() => goto(`/product-manager/${item._id}`)}
									><Icon src={Wrench} /></button
								>
								<button title="Delete" style="margin-left: 8px;" on:click={() => handleDelete(item)}
									><Icon src={Trash} /></button
								>
							</td>
						</tr>
					{/each}
				</tbody>
				<tfoot>
					<tr class="item-head item-section" style={`background: ${getRandomColor(0.1)}`}>
						<th>
							<div class="flex">
								<Icon src={ListBullet} />
								<span style="margin-left: 10px;">#</span>
							</div>
						</th>
						<th>
							<div class="flex">
								<Icon src={Photo} />
								<span style="margin-left: 10px;">Image</span>
							</div>
						</th>
						<th class="item-name">
							<div class="flex">
								<Icon src={QueueList} />
								<span style="margin-left: 10px;">Title</span>
							</div>
						</th>
						<th>
							<div class="flex">
								<Icon src={CircleStack} />
								<span style="margin-left: 10px;">Category</span>
							</div>
						</th>
						<th>
							<div class="flex">
								<Icon src={Clock} />
								<span style="margin-left: 10px;">Created</span>
							</div>
						</th>
						<th>
							<div class="flex">
								<Icon src={Eye} />
								<span style="margin-left: 10px;">Acitve</span>
							</div>
						</th>
						<th>
							<div class="flex">
								<Icon src={Cog6Tooth} />
								<span style="margin-left: 10px;">Action</span>
							</div>
						</th>
					</tr>
				</tfoot>
			</table>
		</div>
		<Pagination renderFor={`/products/`} counter_model={`products`} pageNo={data.pageNo} />
	</div>
</div>

<style lang="scss">
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
