<script lang="ts">
	import Categories from '$compo/categories.svelte';
	import { PUBLIC_IMAGES_FETCH_URI, PUBLIC_PHONE_IMAGE_FOLDER } from '$env/static/public';
	import { getRandomColor, life } from '$lib/globals';
	import { modal, modalUpdate } from '$lib/store';
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
		Cog8Tooth
	} from 'svelte-hero-icons';
	export let data: PageData;
	let categories = JSON.parse(data.categories);
	let list = categories;
	const sort = (by: any): any => {
		let order = by.target.value.split('_').at(-1);
		by = by.target.value.split('_')[0];
		let comp_a = order === 'asc' ? 1 : -1;
		let comp_b = order === 'desc' ? 1 : -1;
        console.log(by)
		list = categories.sort((a: any, b: any) => {
			if (a[by] > b[by]) return comp_a;
			if (a[by] < b[by]) return comp_b;
			else return 0;
		});
	};
	const handleEdit = (item: any) => {
        modalUpdate({ visible: true, item: item, title: item.category, action:'edit' });
    };
</script>
{#if $modal.visible}
	<Categories />
{/if}
<div class="mobile-view-list">
	<div class="head">
		<p>Change categories setting</p>
		<div>
			<button class="btn flex">
				<span>NEW DEVICE</span>
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
						<button on:click={() => handleEdit(item)}><Icon src={Wrench} /></button>
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
