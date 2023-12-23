<script lang="ts">
	import { static_data, updateStaticData } from '$lib/store';
	import { onMount } from 'svelte';
	import Loading from './loading.svelte';
	import {
		ChevronDoubleLeft,
		ChevronDoubleRight,
		ChevronLeft,
		ChevronRight,
		Icon
	} from 'svelte-hero-icons';
	import { page } from '$app/stores';
	const paginateButtonShow = $static_data.settings.paginateButtonShow ?? 6;
	const itemPerPage = $static_data.settings.itemsPerPage ?? 20;
	export let pageNo = 0;
	export let renderFor = '';
	export let __count__: number;
	const generatePagi = async () => {};
	let loading = true;
	let totalPages = 0;
	let startPage = 0;
	let endPage = 0;
	onMount(() => {
		calculateStartAndEndPage(__count__);
	});
	function range(start: number, end: number) {
		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	}
	function calculateStartAndEndPage(__count__: number) {
		totalPages = Math.abs(Math.ceil(__count__ / itemPerPage));
		if (totalPages <= paginateButtonShow) {
			startPage = 0;
			endPage = totalPages - 1;
		} else {
			const half = Math.floor(paginateButtonShow / 2);
			startPage = Math.max(0, pageNo - half);
			endPage = Math.min(totalPages - 1, startPage + paginateButtonShow - 1);

			if (endPage - startPage < paginateButtonShow - 1) {
				startPage = endPage - paginateButtonShow + 1;
			}
		}
		loading = false;
	}
	const renderPageTo = (pageNo: number) => {
		let query = $page.url.search;
		let cNum = $page.url.searchParams.get('p');
		if (cNum) {
			query = query.replace(`p=${cNum}`, `p=${pageNo}`);
			return renderFor + query;
		} else
			return query.includes('?') ? renderFor + query + '&p=' + pageNo : renderFor + '?p=' + pageNo;
	};
</script>

<div class="pagination">
	{#if loading}
		<Loading width={100} />
	{/if}
	{#if !loading && totalPages > 1}
		<div class="abc-abc">
			<p>
				Page {pageNo + 1} of {totalPages}
			</p>
		</div>
		<div class="pagination-links">
			{#if startPage > 0}
				<a href={renderPageTo(1)} title="Go to first page">
					<Icon style="width: 20px;color: #ffffff87;" src={ChevronDoubleLeft} />
				</a>
			{/if}
			<a
				href={renderPageTo(pageNo - 1)}
				class={pageNo === 0 ? 'disabled' : ''}
				title="Go to previous page"
			>
				<Icon style="width: 20px;color: #ffffff87;" src={ChevronLeft} />
			</a>
			{#each range(startPage, endPage) as page}
				<a
					href={renderPageTo(page + 1)}
					class={page === pageNo ? 'active' : ''}
					title={`Go to page ${page + 1}`}
				>
					{page + 1}
				</a>
			{/each}
			<a
				href={renderPageTo(pageNo + 2)}
				class={pageNo === totalPages - 1 ? 'disabled' : ''}
				title="Go to next page"
			>
				<Icon style="width: 20px;color: #ffffff87;" src={ChevronRight} />
			</a>
			{#if endPage < totalPages - 1}
				<a href={renderPageTo(totalPages)} title="Go to last page">
					<Icon style="width: 20px;color: #ffffff87;" src={ChevronDoubleRight} />
				</a>
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	.pagination {
		max-width: 600px;
		width: 100%;
		margin: 15px auto;
		& .abc-abc {
			& p {
				text-align: center;
				font-size: 12px;
				font-weight: 500;
				color: #828282;
			}
		}
		& .pagination-links {
			margin: 5px auto;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		& a {
			background-color: #000000;
			color: #ffffffad;
			margin: 1px 2px;
			font-weight: 500;
			cursor: pointer;
			border-radius: 50%;
			width: 38px;
			height: 38px;
			font-size: 13px;
			display: flex;
			align-items: center;
			justify-content: center;
			transition: background 400ms ease-in-out;
			font-family: inherit;
			border: 2px solid #476b9d73;
			& {
				&.disabled {
					pointer-events: none;
					opacity: 0.6;
				}
				&.active,
				&:hover {
					border-color: #00e7ff57;
					background: #363e65;
					color: white;
				}
			}
		}
	}
</style>
