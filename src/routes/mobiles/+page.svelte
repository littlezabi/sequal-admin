<script lang="ts">
	import type { PageData } from './$types';
	import { PUBLIC_IMAGES_FETCH_URI, PUBLIC_PHONE_IMAGE_FOLDER } from '$env/static/public';
	import { getRandomColor, life } from '$lib/globals';
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
		Trash
	} from 'svelte-hero-icons';
	import { modal, modalUpdate, promptModalUpdate, updateMessages } from '$lib/store';
	import SmartDeviceView from '$compo/product-view.svelte';
	import axios from 'axios';
	import Pagination from '$compo/pagination.svelte';
	export let data: PageData;
	let items: any = data.list;
	$: data.pageNo, (items = data.list);
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
	const handleEdit = (item: any) => {
		modalUpdate({ visible: true, ...item, action: 'edit', type: 'device' });
	};
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
								{ _id: item._id, images: item.images, model: 'mobile' },
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
</script>

{#if $modal.visible}
	<SmartDeviceView />
{/if}
<h2>Mobile List</h2>
<div class="mobile-view-list">
	<div class="head">
		<p>Change mobile and watches setting</p>
		<div>
			<button
				class="btn flex"
				on:click={() =>
					modalUpdate({ visible: true, action: 'new', title: 'Add new mobile device', type: 'device' })}
			>
				<span>NEW DEVICE</span>
				<Icon src={Plus} />
			</button>
		</div>
		<span>
			Sort By
			<select class="sort-select" on:change={(e) => sort(e)}>
				<optgroup label="By Index">
					<option value="index_asc">Ascending</option>
					<option value="index_desc">Descending</option>
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
							<Icon src={DeviceTablet} />
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
							<Icon src={ReceiptPercent} />
							<span style="margin-left: 10px;">Integrity</span>
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
										: PUBLIC_IMAGES_FETCH_URI + PUBLIC_PHONE_IMAGE_FOLDER + item.images[0]}
									alt={item.title}
								/>
							{:else}
								<Icon style="width: 42px !important" src={DevicePhoneMobile} />
							{/if}
						</td>
						<td class="item-name">{item.title}</td>
						<td class="item-cat">{item.category}</td>
						<td>{item.integrity}%</td>
						<td>{life(item.createdAt).from()}</td>
						<td
							>{#if item.isActive}<Icon src={Eye} /> {:else} <Icon src={EyeSlash} />{/if}</td
						>
						<td>
							<button title="Edit" on:click={() => handleEdit(item)}><Icon src={Wrench} /></button>
							<button title="Delete" style="margin-left: 8px;" on:click={() => handleDelete(item)}
								><Icon src={Trash} /></button
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<Pagination renderFor={`/mobiles/`} counter_model={`mobiles`} pageNo={data.pageNo} />
</div>

<style lang="scss">
	h2 {
		color: var(--primary-color);
	}
	.head {
		display: flex;
		align-items: flex-end;
		margin: 8px -2px 24px 0;
		justify-content: space-between;
		align-items: center;
		& .sort-select {
			margin: 0 7px;
			width: 188px;
			height: 30px;
			background: var(--input-background);
			border: 2px solid rgba(110, 0, 255, 0.59);
			border-radius: 25px;
			padding: 0 8px;
			color: inherit;
			font-family: inherit;
			& option {
				background: var(--bg-color);
			}
		}
	}
	.mobile-view-list {
		box-shadow: var(--common-shadow);
		padding: 10px;
		margin: 20px 0;
		background: var(--item-list-bg);
		border-radius: 8px;
		color: var(--primary-color);

		.item-section {
			margin: 8px 0;
			background-color: var(--charts-element-bg);
			padding: 6px 10px;
			border-radius: 8px;
			text-transform: capitalize;
			min-height: 39px;
			cursor: pointer;
			& button {
				width: 64px;
				height: 50px;
				background: none;
				border: none;
				border-radius: 5px;
				&:hover {
					background: #9b9bff69;
				}
			}

			&.item-head {
				& span {
					text-transform: uppercase;
					font-size: 12px;
					display: flex;
					align-items: center;
				}
			}

			& .item-cat {
				text-transform: uppercase;
			}

			& img {
				background: white;
				padding: 6px;
				border-radius: 4px;
				height: 72px;
			}
		}
	}
</style>
