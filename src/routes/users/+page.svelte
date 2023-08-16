<script lang="ts">
	import type { PageData } from './$types';
	import { getRandomColor, life } from '$lib/globals';
	import {
		Icon,
		Photo,
		Wrench,
		Cog6Tooth,
		AtSymbol,
		Bell,
		BellAlert,
		BellSlash,
		User,
		UserPlus,
		Clock
	} from 'svelte-hero-icons';
	import { modal, modalUpdate } from '$lib/store';
	import UserModal from '$compo/UserModal.svelte';
	import { PUBLIC_IMAGES_FETCH_URI } from '$env/static/public';
	export let data: PageData;
	let admins: any = JSON.parse(data.admins);
	let clients: any = JSON.parse(data.users);
	let admin_key:any = data.admin_key
	let users:any = []
	let old_action = 'clients';
	if(data.view === 'admins'){
		users = admins;
		old_action = 'admins';
	} 
	else users = clients;

	const sort = (by: any): any => {
		let order = by.target.value.split('_').at(-1);
		by = by.target.value.split('_')[0];
		let comp_a = order === 'asc' ? 1 : -1;
		let comp_b = order === 'desc' ? 1 : -1;
		if (by === 'isActive') {
			users = JSON.parse(old_action==='clients' ? data.users : data.admins).sort((a: any, b: any) => {
				if (!a.active && b.active) return comp_a;
				if (a.active && !b.active) return comp_b;
				return 0;
			});
		} else if (by === 'createdAt')
			users = JSON.parse(old_action==='clients' ? data.users : data.admins).sort((a: any, b: any) => {
				let x: any = new Date(a.createdAt);
				let y: any = new Date(b.createdAt);
				return x - y;
			});
		else
			users = JSON.parse(old_action==='clients' ? data.users : data.admins).sort((a: any, b: any) => {
				if (a[by] > b[by]) return comp_a;
				if (a[by] < b[by]) return comp_b;
				else return 0;
			});
	};
	const handleEdit = (item: any) => {
		modalUpdate({ visible: true, title:"EDIT USER PROFILE", action: 'edit', admin_key, user: item });
	};
	const handleStylishButton = (action: string) => {
		if (old_action === action) return 0;
		if (action === 'clients') {
			users = clients;
		} else {
			users = admins;
		}
		console.log(users);
		old_action = action;
	};
</script>

{#if $modal.visible}
	<UserModal />
{/if}
<h2>Manage Users</h2>
<div class="mobile-view-list">
	<div class="head">
		<p>You can add, remove, update users and admins.</p>
		<div>
			<button
				class="btn flex"
				on:click={() => modalUpdate({ visible: true, action: 'new', title: 'Add a new user' })}
				><span>ADD NEW USER</span> <Icon src={UserPlus} /></button
			>
		</div>
		<span>
			Sort By
			<select class="sort-select" on:change={(e) => sort(e)}>
				<option value="index_asc">Number Asc</option>
				<option value="index_desc">Number Desc</option>
				<option value="isActive_asc">Active</option>
				<option value="isActive_desc">Deactive</option>
				<option value="firstname_asc">Name Asc</option>
				<option value="firstname_desc">Name Desc</option>
				<option value="createdAt_asc">Date Asc</option>
				<option value="createdAt_desc">Date Desc</option>
			</select>
		</span>
	</div>
	<div class="head">
		<div class="flex">
			<div class="flex">
				<span>All clients</span>
				<button
					class="btn-stylish {old_action === 'clients' ? 'active' : ''}"
					id="btn-8ck3lx"
					on:click={(e) => handleStylishButton('clients')}
				>
					<div />
				</button>
			</div>

			<div class="flex" style="margin-left: 30px;">
				<span>All admins</span>
				<button
					class="btn-stylish {old_action === 'admins' ? 'active' : ''}"
					id="btn-8ck3lx2"
					on:click={(e) => handleStylishButton('admins')}
				>
					<div />
				</button>
			</div>
		</div>
	</div>
	<div class="container">
		<table>
			<thead>
				<tr class="item-head item-section" style={`background: ${getRandomColor(0.1)}`}>
					<th>#</th>
					<th>
						<div class="flex">
							<Icon src={Photo} />
							<span style="margin-left: 10px;">Avatar</span>
						</div>
					</th>
					{#if old_action === 'clients'}
						<th>
							<div class="flex">
								<Icon src={User} />
								<span style="margin-left: 10px;">Fullname</span>
							</div>
						</th>
					{:else}
						<th>
							<div class="flex">
								<Icon src={User} />
								<span style="margin-left: 10px;">Username</span>
							</div>
						</th>
					{/if}
					<th>
						<div class="flex">
							<Icon src={AtSymbol} />
							<span style="margin-left: 10px;">Email</span>
						</div>
					</th>
					{#if old_action === 'clients'}
						<th>
							<div class="flex">
								<Icon src={Bell} />
								<span style="margin-left: 10px;">Notify</span>
							</div>
						</th>
					{/if}
					<th>
						<div class="flex">
							<Icon src={Clock} />
							<span style="margin-left: 10px;">created</span>
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
				{#each users as item}
					<tr class="item-section list" style={`background: ${getRandomColor(0.1)}`}>
						<td class="item-index">{item.index}</td>
						<td style="text-align:center;">
							{#if item.avatar && item.avatar !== ''}
								<img
									class="list-image"
									src={item.avatar.includes('http')
										? item.avatar
										: PUBLIC_IMAGES_FETCH_URI + 'images/users/' + item.avatar}
									alt={item.firstname}
								/>
							{:else}
								<Icon class="list-image" src={User} />
							{/if}
						</td>
						{#if old_action === 'clients'}
							<td class="item-name">{item.firstname} {item.lastname}</td>
						{:else}
							<td class="item-name">{item.username}</td>
						{/if}
						<td class="item-cat">{item.email}</td>
						{#if old_action === 'clients'}
							<td>
								{#if item.notifyme}
									<Icon src={BellAlert} />
								{:else}
									<Icon src={BellSlash} />
								{/if}
							</td>
						{/if}
						<td>
							{life(item.createdAt).from()}
						</td>
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
							<span style="margin-left: 10px;">Avatar</span>
						</div>
					</th>
					{#if old_action === 'clients'}
						<th>
							<div class="flex">
								<Icon src={User} />
								<span style="margin-left: 10px;">Fullname</span>
							</div>
						</th>
					{:else}
						<th>
							<div class="flex">
								<Icon src={User} />
								<span style="margin-left: 10px;">Username</span>
							</div>
						</th>
					{/if}
					<th>
						<div class="flex">
							<Icon src={AtSymbol} />
							<span style="margin-left: 10px;">Email</span>
						</div>
					</th>
					{#if old_action === 'clients'}
						<th>
							<div class="flex">
								<Icon src={Bell} />
								<span style="margin-left: 10px;">Notify</span>
							</div>
						</th>
					{/if}
					<th>
						<div class="flex">
							<Icon src={Clock} />
							<span style="margin-left: 10px;">created</span>
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
</div>

<style lang="scss">
	.list-image {
		width: 69px;
		height: 69px;
		padding: 0;
	}
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
		padding: 20px;
		margin: 20px 0;
		background: var(--item-list-bg);
		border-radius: 8px;
		color: var(--primary-color);
		& table {
			& td {
				padding: 10px 20px;
			}
			& thead,
			& tfoot {
				& th {
					padding: 0 23px;
					text-align: left;
				}
				height: 58px;
				text-transform: uppercase;
			}
		}
		.item-section {
			background-color: var(--charts-element-bg);
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
			& img {
				padding: 6px;
				border-radius: 4px;
				height: 72px;
			}
		}
	}
</style>
