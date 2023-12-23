<script lang="ts">
	import { getCatsAndTypes } from '$lib/globals';
	import { modalUpdate, static_data, updateStaticData } from '$lib/store';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import { ArrowPath, Icon } from 'svelte-hero-icons';
	let cat_loading = false;
	let cats: any = [];
	let types: any = [];
	export let callback: (e: string) => void;
	export let catTypeCB: (e: string) => void = () => {};
	export let prev_cat: { _id?: string; type?: string } = {};
	export let asFilter: boolean = false;
	export let collection: string = '';
	let categories_list: any = [];
	const handleCat = (e: any) => callback(e.target.value);
	const handlePType = (e: any, type = '') => {
		let v = e ? (e.target as any).value : type;
		if (v) {
			if (!asFilter) {
				cats = categories_list.filter((e: any) => e.type === v);
				return 1;
			}
			if (v === 'all') cats = categories_list;
			else cats = categories_list.filter((e: any) => e.type === v || e.type === 'all');
		}
		catTypeCB(v);
	};
	onMount(async () => {
		cat_loading = true
		let items = await getCatsAndTypes(true, true, {
			getCatsFieldOnly: {
				_id: 1,
				type: 1,
				category: 1
			},
			getTypesFieldOnly: {
				_id: 1,
				title: 1
			}
		});
		cat_loading = false
		categories_list = items.cats
		cats = items.cats
		types = items.types
		if (prev_cat.type) handlePType(false, prev_cat.type);
		if (asFilter) {
			categories_list = [{ category: 'all', type: 'all', _id: 'all' }, ...categories_list];
			cats = categories_list;
		}
	});
</script>

<div class="flex-yxz">
	<div class="a03x">
		<label for="category">
			{!asFilter ? 'CHOOSE PRODUCT TYPE' : 'SELECT TYPE'}
			{#if !asFilter}
				<small
					>(if product type is not exist here then
					<button
						class="message success"
						type="button"
						style="display:inline;background:none;border:none"
						on:click={() =>
							modalUpdate({
								visible: true,
								item: {},
								title: 'Add new category',
								action: 'new',
								no_refresh: true
							})}>add new categories or types</button
					>
				</small>{/if}</label
		>
		<div class="flex">
			<select name="_y_category" required on:change={handlePType}>
				{#if !asFilter}
					<option selected disabled value="un-selected">Select Product type</option>
				{:else}
					<option selected value="all">ALL</option>
				{/if}
				{#if types} 
					{#each types as type}
						{#if prev_cat.type === type._id}
							<option selected value={type._id}>{type.title}</option>
						{:else}
							<option value={type._id}>{type.title}</option>
						{/if}
					{/each}
				{/if}
			</select>
		</div>
	</div>

	{#if collection != 'categories'}
		<div class="a03x">
			<label for="category"
				>{!asFilter ? 'CHOOSE RIGHT CATEGORY' : 'SELECT CATEGORY'}
				{#if !asFilter}
					<a
						href="/categories"
						class="message success"
						style="display:inline"
						target="_blank"
						title="add new category">(Manage Categories)</a
					>{/if}
			</label>
			<div class="flex">
				<select name="_y_category" on:change={handleCat}>
					{#if !asFilter}
						<option selected value="un-selected">Select Category</option>
					{/if}
					{#if Array.isArray(cats)}
						{#if !asFilter}
							{#each cats as cat}
								{#if prev_cat._id === cat._id}
									<option selected value={cat._id}>{cat.type} - {cat.category}</option>
								{:else}
									<option value={cat._id}>{cat.type} - {cat.category}</option>
								{/if}
							{/each}
						{:else}
							{#each cats as cat}
								{#if prev_cat._id === cat._id || prev_cat.type === cat.type}
									<option selected value={cat._id}>{cat.category}</option>
								{:else}
									<option value={cat._id}>{cat.category}</option>
								{/if}
							{/each}
						{/if}
					{/if}
				</select>
				{#if !asFilter}
					<button
						class="btn btn-small"
						type="button"
						style="margin:0 0 0 19px;width:46px;height:42px;"
						on:click={getCats}
					>
						<Icon class={cat_loading ? 'anim-rotate' : ''} src={ArrowPath} />
					</button>
				{/if}
			</div>
		</div>
	{/if}
</div>
