<script lang="ts">
	import Categories from '$compo/categories.svelte';
	import { PUBLIC_IMAGES_FETCH_URI, PUBLIC_PHONE_IMAGE_FOLDER } from '$env/static/public';
	import { getRandomColor, life } from '$lib/globals';
	import { modal, modalUpdate, promptModalUpdate, updateMessages } from '$lib/store';
	import axios from 'axios';
	import type { PageData } from './$types';
	import {
		Icon,
		Eye,
		EyeSlash,
		DeviceTablet,
		ReceiptPercent,
		CircleStack,
		Clock,
		ListBullet,
		Photo,
		QueueList,
		Wrench,
		Cog6Tooth,
		DevicePhoneMobile,
		Plus,
		Tag,
		Bolt,
		ChartBarSquare,
		DocumentChartBar,
		Cog8Tooth,

		Trash

	} from 'svelte-hero-icons';
	export let data: PageData;
	let categories = JSON.parse(data.categories);
	let list = categories;
	const sort = (by: any): any => {
		let order = by.target.value.split('_').at(-1);
		by = by.target.value.split('_')[0];
		let comp_a = order === 'asc' ? 1 : -1;
		let comp_b = order === 'desc' ? 1 : -1;
		list = categories.sort((a: any, b: any) => {
			if (a[by] > b[by]) return comp_a;
			if (a[by] < b[by]) return comp_b;
			else return 0;
		});
	};
	const handleEdit = (item: any) => {
        modalUpdate({ visible: true, item: item, title: item.category, action:'edit' });
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
</script>
{#if $modal.visible}
	<Categories />
{/if}
<div class="mobile-view-list">
	<div class="head">
		<p>Change categories setting</p>
		<div>
			<button class="btn flex" type="button" on:click={()=> modalUpdate({ visible: true, item: {}, title: 'Add new category', action:'new' })}>
				<span>NEW CATEGORY</span>
				<Icon src={Plus} />
			</button>
		</div>
		<span>
			Sort By
			<select class="sort-select" on:change={(e) => sort(e)}>
				<optgroup label="By Title">
					<option value="category_asc">Ascending</option>
					<option value="category_desc">Descending</option>
				</optgroup>
				<optgroup label="By Items">
					<option value="items_asc">Ascending</option>
					<option value="items_desc">Descending</option>
				</optgroup>
			</select>
		</span>
	</div>
	<div class="container">
		<table>
			<thead>
				<tr class="item-head item-section" style={`background: ${getRandomColor(0.1)}`}>
					<th>#</th>
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
				{#each list as item,i}
					<tr class="item-section list" style={`background: ${getRandomColor(0.1)}`}>
						<td class="item-index">{++i}</td>
						<td style="">
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
						<td class="item-cat">{item.category}</td>
						<td>{item.type}</td>
						<td>{item.items}</td>
						<td>
							<button on:click={() => handleEdit(item)}><Icon src={Wrench} /></button>
							<button title="Delete" style="margin-left: 8px;" on:click={() => handleDelete(item)}
								><Icon src={Trash} /></button
							>
						</td>
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr class="item-head item-section" style={`background: ${getRandomColor(0.1)}`}>
					<th>#</th>
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

<style lang="scss">
	img.list-image {
		border-radius: 4px !important;
		background: white;
		width: auto;
		max-width: 158px;
		height: 30px;
		object-fit: contain;
	}
</style>
