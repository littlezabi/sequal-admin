<script lang="ts">
	import { Cog6Tooth, Icon, Plus, Trash } from 'svelte-hero-icons';
	import Loading from './loading.svelte';
	import { promptModalUpdate, updateMessages } from '$lib/store';

	export let updateCats: any;
	export let categories: any;

	let loading = false;
	let newCat = '';
	let message: any = false;
	let checking: any = undefined;
	const handleEdit = async (index: number): Promise<void> => {
		promptModalUpdate({
			visible: true,
			title: `Change category type name`,
			description: `Change the type name but keep in mind if name is exist then no changes happen.`,
			form: {
				inputs: [
					{
						label: 'Enter category type name here.',
						type: 'text',
						placeholder: 'Enter category type name...',
						name: 'type-name',
						value: categories[index]
					}
				],
				buttons: [
					{ type: 'submit', title: 'ADD' },
					{ title: 'CANCIL', callback: () => promptModalUpdate({ visible: false }), type: 'button' }
				],
				onSubmit: async (e: any) => {
					let d = e.target['type-name'].value;
					if (d && d.length) {
						d = d.toLowerCase();
						if (categories.includes(d.toLowerCase())) {
							updateMessages({ message: 'Category type is already exist!', variant: 'alert' });
						} else {
							categories = categories.map((e: string) => {
								if (e === categories[index]) return d;
								return e;
							});
							promptModalUpdate({ visible: false });
							await updateCats(categories).then(() => (loading = false));
						}
					} else {
						updateMessages({
							message: 'Please enter the name of category type.',
							variant: 'alert'
						});
					}
				}
			}
		});
	};
	const handleDelete = (index: number): void => {
		promptModalUpdate({
			visible: true,
			title: `CONFIRM DELETE CATEGORY TYPE`,
			description: `
				Are you sure you want to delete the category type '${categories[index]}'? Please proceed with caution, as this action is irreversible and cannot be undone.
			`,
			confirm: [
				{
					title: 'YES',
					class: 'bg-danger',
					callback: async () => {
						categories = categories.filter((e: string) => e !== categories[index]);
						promptModalUpdate({ visible: false });
						updateCats(categories);
					},
					type: 'button'
				},
				{
					title: 'NO',
					callback: () => promptModalUpdate({ visible: false }),
					type: 'button'
				}
			]
		});
	};
	const handleCheck = (e: Event) => {
		loading = true;
		const element = (e.target as HTMLInputElement).value.trim();
		if (checking) clearTimeout(checking);
		newCat = element.toLowerCase();
		checking = setTimeout(() => {
			if (!categories.includes(element.toLowerCase()))
				message = {
					message: 'This category type is not exist click button to add!',
					variant: 'success'
				};
			else message = { message: 'Category type is already exist!', variant: 'alert' };
			loading = false;
		}, 500);
	};
	const handleAdd = async () => {
		if (!categories.includes(newCat)) {
			loading = true;
			categories = [...categories, newCat];
			await updateCats(categories).then(() => (loading = false));
		} else message = { message: 'Category type is already exist!', variant: 'alert' };
	};
</script>

<div>
	<div class="a03x full-w table-view">
		<p>Edit, delete and add more types of categories.</p>
		<table>
			<thead>
				<tr>
					<th>#</th>
					<th>Type</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>
				{#each categories as cat, i}
					<tr>
						<td>{i + 1}</td>
						<td>{cat}</td>
						<td>
							<button class="btn btn-small" on:click={() => handleDelete(i)} type="button">
								<Icon src={Trash} />
							</button>
							<button class="btn btn-small" type="button" on:click={() => handleEdit(i)}>
								<Icon src={Cog6Tooth} />
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<div class="a03x highlight-bg full-w">
		<label for="category-type"
			>NEW TYPE <small>(Add new category type like shoes, clothes, phones, laptops, etc).</small
			></label
		>
		<br />
		<div class="flex">
			<input
				type="text"
				name="category-type"
				id="category-type"
				placeholder="E.g. laptops - ear buds"
				on:keyup={handleCheck}
			/>
			{#if loading}
				<div style="margin-left: 10px;"><Loading type="spinner" /></div>
			{:else}
				<button class="btn btn-small" type="button" on:click={handleAdd}>
					<Icon src={Plus} />
				</button>
			{/if}
		</div>
		{#if typeof message === 'object' && message !== null}
			<span class="message {message.variant ? message.variant : 'success'}">{message.message}</span>
		{/if}
	</div>
</div>

<style lang="scss">
	.btn-small {
		margin-top: 0;
		margin-bottom: 0;
		width: 60px !important;
	}
	.highlight-bg.full-w {
		width: 92% !important;
		margin: 21px auto -3px auto;
	}
	.table-view {
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
</style>
