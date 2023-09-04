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
		Clock,
		Trash
	} from 'svelte-hero-icons';
	import { modal, modalUpdate, promptModalUpdate, updateMessages } from '$lib/store';
	import UserModal from '$compo/UserModal.svelte';
	import { PUBLIC_IMAGES_FETCH_URI } from '$env/static/public';
	import axios from 'axios';
	import Pagination from '$compo/pagination.svelte';
	import { fade, slide } from 'svelte/transition';
	export let data: PageData;
	let admin: any = data.admin;
	let clients: any = data.clients;
	let users: any = [];
	$: data.user_type,
		(function () {
			admin = data.admin;
			clients = data.clients;
			if (data.user_type === 'admin') {
				users = admin;
			} else users = clients;
		})();
	const sort = (by: any): any => {
		let order = by.target.value.split('_').at(-1);
		by = by.target.value.split('_')[0];
		let comp_a = order === 'asc' ? 1 : -1;
		let comp_b = order === 'desc' ? 1 : -1;
		if (by === 'isActive') {
			users = JSON.parse(data.user_type === 'clients' ? data.clients : data.admin).sort(
				(a: any, b: any) => {
					if (!a.active && b.active) return comp_a;
					if (a.active && !b.active) return comp_b;
					return 0;
				}
			);
		} else if (by === 'createdAt')
			users = JSON.parse(data.user_type === 'clients' ? data.clients : data.admin).sort(
				(a: any, b: any) => {
					let x: any = new Date(a.createdAt);
					let y: any = new Date(b.createdAt);
					return x - y;
				}
			);
		else
			users = JSON.parse(data.user_type === 'clients' ? data.clients : data.admin).sort(
				(a: any, b: any) => {
					if (a[by] > b[by]) return comp_a;
					if (a[by] < b[by]) return comp_b;
					else return 0;
				}
			);
	};
	const handleEdit = (item: any) => {
		modalUpdate({
			visible: true,
			title: 'EDIT USER PROFILE',
			action: 'edit',
			user: item
		});
	};
	const handleDelete = (user: any) => {
		promptModalUpdate({
			visible: true,
			title: `CONFIRM DELETE`,
			description: `
				You are requesting the permanent deletion of the user account '${
					data.user_type === 'clients' ? user.firstname + ' ' + user.lastname : user.username
				}'. Please proceed with caution, as after the user is deleted, they will no longer be able to log in, make purchases, post comments, write reviews, and perform other related actions.
			`,
			confirm: [
				{
					title: 'DELETE',
					class: 'bg-danger',
					callback: async () => {
						await axios
							.post(
								'/api/delete-items',
								{ _id: user._id, avatar: user.avatar, model: data.user_type },
								{ headers: { requestFor: 'deleteUser' } }
							)
							.then((e) => {
								updateMessages({
									message: e.data.message,
									variant: e.data.success ? 'success' : 'alert'
								});
								if (e.data.success) {
									users = users.filter((e: any) => e._id !== user._id);
								}
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
	<UserModal />
{/if}
<h2>Manage Users</h2>
<div class="mobile-view-list">
	<div class="head">
		<p>You can add, remove, update {data.user_type} informations.</p>
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
		<!-- <div class="flex">
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
				<span>All admin</span>
				<button
					class="btn-stylish {old_action === 'admin' ? 'active' : ''}"
					id="btn-8ck3lx2"
					on:click={(e) => handleStylishButton('admin')}
				>
					<div />
				</button>
			</div>
		</div> -->
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
					{#if data.user_type === 'clients'}
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
					{#if data.user_type === 'clients'}
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
				{#each users as item, index}
					<tr class="fade-in item-section list" style={`background: ${getRandomColor(0.1)};animation-delay: ${index*100}ms`}>
						<td class="item-index">{data.skip + (index + 1)}</td>
						<td style="text-align:center;" class="xck393">
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
						{#if data.user_type === 'clients'}
							<td class="item-name">{item.firstname} {item.lastname}</td>
						{:else}
							<td class="item-name">{item.username}</td>
						{/if}
						<td class="item-cat">{item.email}</td>
						{#if data.user_type === 'clients'}
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
						<td style="display:flex;">
							<button title="Edit" on:click={() => handleEdit(item)}><Icon src={Wrench} /></button>
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
							<span style="margin-left: 10px;">Avatar</span>
						</div>
					</th>
					{#if data.user_type === 'clients'}
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
					{#if data.user_type === 'clients'}
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
		<Pagination renderFor={`/users/${data.user_type}`} counter_model={data.user_type} pageNo={data.page} />
	</div>
</div>

<style lang="scss">
	.list-image {
		width: 69px;
		height: 69px;
		padding: 0;
	}
	.mobile-view-list .item-section .xck393 {
		& img {
			height: 62px;
			width: 62px;
		}
	}
</style>
