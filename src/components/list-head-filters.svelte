<script lang="ts">
	import { Funnel, Icon, Trash } from 'svelte-hero-icons';
	import CategoryInputView from './category-input-view.svelte';
	import { promptModalUpdate, updateMessages } from '$lib/store';
	import { goto } from '$app/navigation';
	import axios from 'axios';
	import { page } from '$app/stores';
	export let prev_cat:
		| {
				_id?: string | undefined;
				type?: string | undefined;
		  }
		| undefined = undefined;
	export let filters: any;
	export let handleFiltersAndTypes: any;
	export let handleFilteredSearch: any;
	export let sort: any;
	export let selectedItems: any = [];
	export let collection: string;
	const handleListDelete = () => {
		if (selectedItems.length)
			promptModalUpdate({
				visible: true,
				title: `CONFIRM ${selectedItems.length > 1 ? "MULTIPLE DELETE'S" : 'DELETE'} `,
				description: `Are you sure you want to delete the item'${
					selectedItems.length > 1 ? 's' : ''
				}'? Please proceed with caution, as this action is irreversible and cannot be undone.`,
				confirm: [
					{
						title: 'DELETE',
						class: 'bg-danger',
						callback: async () => {
							await axios
								.post(
									'/api/delete-items',
									{ listIDs: selectedItems, model: collection },
									{ headers: { requestFor: 'deleteItemsList' } }
								)
								.then((e) => {
									updateMessages({
										message: e.data.message,
										variant: e.data.success ? 'success' : 'alert'
									});
									if (e.data.success) goto(`/products/${$page.url.search}`);
									promptModalUpdate({ visible: false });
								})
								.catch((e) => console.error(e));
						},
						type: 'button'
					}
				]
			});
	};
</script>

<div class="form">
	<h3 style="margin:0;">Filters Products view</h3>
	<div class="flex-yxz">
		<div class="a03x" style="width:500px;margin-top:7px;">
			<CategoryInputView
				{collection}
				{prev_cat}
				catTypeCB={(e) => {
					handleFiltersAndTypes(e, 'category-type');
				}}
				asFilter={true}
				callback={(e) => handleFiltersAndTypes(e, 'category')}
			/>
		</div>
		{#if collection != 'categories'}
			<div class="a03x" style="width:129px;margin-top:7px;">
				<span>
					FILTER BY
					<select class="sort-select" on:change={(e) => handleFiltersAndTypes(e, 'filter')}>
						{#each [{ all: 'All' }, { asDraft_1: 'Drafts' }, { asDraft_0: 'Posted' }] as opt}
							{#if filters.filter && 'asDraft_' + (filters.filter[1] ? '1' : '0') === Object.keys(opt)[0]}
								<option value={Object.keys(opt)[0]} selected>{Object.values(opt)[0]}</option>
							{:else}
								<option value={Object.keys(opt)[0]}>{Object.values(opt)[0]}</option>
							{/if}
						{/each}
					</select>
				</span>
			</div>
		{/if}
		<div class="a03x" style="width:159px;margin-top:7px;">
			<span>
				SORT BY
				<select class="sort-select" on:change={(e) => handleFiltersAndTypes(e, 'sort')}>
					{#if filters.sort}
						<optgroup label="By {filters.sort[0]}">
							{#if filters.sort[1] === 1}
								<option value="{filters.sort[0]}_asc" selected>Ascending</option>
							{:else}
								<option value="{filters.sort[0]}_desc">Descending</option>
							{/if}
						</optgroup>
					{/if}
					<optgroup label="By Index">
						<option value="id_asc">Ascending</option>
						<option value="id_desc">Descending</option>
					</optgroup>

					<optgroup label="By Title">
						<option value="title_asc">Ascending</option>
						<option value="title_desc">Descending</option>
					</optgroup>
					<optgroup label="By Category">
						<option value="category_asc">Ascending</option>
						<option value="category_desc">Descending</option>
					</optgroup>
					{#if collection != 'categories'}
						<optgroup label="By Activeness">
							<option value="isActive_asc">Active</option>
							<option value="isActive_desc">Deactive</option>
						</optgroup>
						<optgroup label="By Date">
							<option value="createdAt_asc">Ascending</option>
							<option value="createdAt_desc">Descending</option>
						</optgroup>
					{:else}
						<optgroup label="By Items">
							<option value="items_asc">Ascending</option>
							<option value="items_desc">Descending</option>
						</optgroup>
					{/if}
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
<div class="wire" />
<div class="head" style="justify-content: left">
	<span>
		SORT TABLE
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
	{#if selectedItems.length}
		<button
			title="Delete"
			style="margin-left: 8px;background:none;border:none"
			on:click={handleListDelete}><Icon src={Trash} /></button
		>
	{/if}
</div>
