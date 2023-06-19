<script lang="ts">
	import type { PageData } from './$types';
	import { IMAGE_ROOT } from '$lib/constant';
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
		QueueList, Wrench, Cog6Tooth
	} from 'svelte-hero-icons';
	export let data: PageData;
	let items: any = data.list;
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
			items = data.list.sort((a: any, b: any) => new Date(a.createdAt) - new Date(b.createdAt));
		else
			items = data.list.sort((a: any, b: any) => {
				if (a[by] > b[by]) return comp_a;
				if (a[by] < b[by]) return comp_b;
				else return 0;
			});
	};
    const handleEdit = (id:string)=>{
        console.log(id)
    }
</script>

<h2>Mobile List</h2>
<div class="mobile-view-list">
    <div class="head">
        <p>Change mobile and watches setting</p>
		<span>
			Sort By
			<select class="sort-select" on:change={(e) => sort(e)}>
				<option value="index_asc">Number Asc</option>
				<option value="index_desc">Number Desc</option>
				<option value="isActive_asc">Active</option>
				<option value="isActive_desc">Deactive</option>
				<option value="title_asc">Title Asc</option>
				<option value="title_desc">Title Desc</option>
				<option value="category_asc">Category Asc</option>
				<option value="category_desc">Category Desc</option>
				<option value="createdAt_asc">Date Asc</option>
				<option value="createdAt_desc">Date Desc</option>
			</select>
		</span>
	</div>
	<div class="container">
		<section class="item-head item-section" style={`background: ${getRandomColor(0.1)}`}>
			<span class="flex item-index">
				# <Icon src={ListBullet} />
			</span>
			<span>
				Image
				<Icon src={Photo} />
			</span>
			<span class="item-name">
				Title
				<Icon src={DeviceTablet} />
			</span>
			<span>
				Category
				<Icon src={CircleStack} />
			</span>
			<span>
				integrity %
				<Icon src={ReceiptPercent} />
			</span>
			<span>
				Created
				<Icon src={Clock} />
			</span>
			<span>
				Acitve
				<Icon src={QueueList} />
			</span>
			<span>
				Action
				<Icon src={Cog6Tooth} />
			</span>
		</section>
		{#each items as item}
			<section class="item-section list" style={`background: ${getRandomColor(0.1)}`}>
				<span class="item-index">{item.index}</span>
				<span>
					<img src={IMAGE_ROOT + item.image} alt={item.title} />
				</span>
				<span class="item-name">{item.title}</span>
				<span class="item-cat">{item.category}</span>
				<span>{item.integrity}%</span>
				<span>{life(item.createdAt).from()}</span>
				<span
					>{#if item.isActive}<Icon src={Eye} /> {:else} <Icon src={EyeSlash} />{/if}</span
				>
				<button on:click={()=>handleEdit(item._id)}><Icon src={Wrench} /></button>
			</section>
		{/each}
        <section class="item-head item-section" style={`background: ${getRandomColor(0.1)}`}>
			<span class="flex item-index">
				# <Icon src={ListBullet} />
			</span>
			<span>
				Image
				<Icon src={Photo} />
			</span>
			<span class="item-name">
				Title
				<Icon src={DeviceTablet} />
			</span>
			<span>
				Category
				<Icon src={CircleStack} />
			</span>
			<span>
				integrity %
				<Icon src={ReceiptPercent} />
			</span>
			<span>
				Created
				<Icon src={Clock} />
			</span>
			<span>
				Acitve
				<Icon src={QueueList} />
			</span>
			<span>
				Action
				<Icon src={Cog6Tooth} />
			</span>
		</section>
	</div>
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
			display: grid;
			grid-template-columns: auto auto 1fr 1fr 1fr 1fr 1fr 1fr;
			align-items: center;
			background-color: var(--charts-element-bg);
			padding: 6px 10px;
			border-radius: 8px;
			text-transform: capitalize;
			min-height: 39px;
			cursor: pointer;
            & button{
                width: 64px;
                height: 50px;
                background: none;
                border: none;
            }
			& span {
				width: 98px;
				&:nth-child(1) {
					width: 60px;
				}
				&:nth-child(2) {
					width: 72px;
				}
				&:nth-child(3) {
					width: 200px;
					padding: 0 8px;
				}
				&:nth-child(4) {
					width: 93px;
				}
				&:nth-child(5) {
					width: 106px;
				}
				&:nth-child(6) {
					width: 80px;
				}
				&:nth-child(7) {
					width: 69px;
				}
			}
			& .item-index {
				display: flex;
				align-items: center;
				justify-content: center;
			}
			& span {
				font-size: 14px;
			}
			&.item-head {
				& span {
					text-transform: uppercase;
					font-size: 12px;
					display: flex;
					align-items: center;
				}
				& svg {
					margin-left: 10px;
				}
			}
			& .item-name {
				padding: 0 10px;
				margin-left: 8px;
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
