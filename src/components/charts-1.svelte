<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	import {
		alterNumberFormat,
		chartDatasetOptions,
		chartOptions,
		getRandomColor,
		numberFormat
	} from '$lib/common';
	import {
		Icon,
		DevicePhoneMobile,
		ComputerDesktop,
		RectangleStack,
		ServerStack,
		CircleStack,
		Newspaper,
		CpuChip,
		Users,
		ChartBar,
		ArrowTrendingUp,
		RectangleGroup,

		AdjustmentsHorizontal

	} from 'svelte-hero-icons';
	import CountAnim from './count-anim.svelte';
	Chart.register(...registerables);
	let barChartElement: HTMLCanvasElement;
	let barChartElement_2: HTMLCanvasElement;
	let barChartElement_3: HTMLCanvasElement;
	let barChartElement_4: HTMLCanvasElement;
	let barChartElement_5: HTMLCanvasElement;
	export let countData: any;
	console.log('procesing: ', countData);
	let width: any, height: any, gradient: any;
	function getGradient(ctx: any, chartArea: any) {
		const chartWidth = chartArea.right - chartArea.left;
		const chartHeight = chartArea.bottom - chartArea.top;
		if (!gradient || width !== chartWidth || height !== chartHeight) {
			width = chartWidth;
			height = chartHeight;
			gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
			gradient.addColorStop(0, getRandomColor(false));
			gradient.addColorStop(0.5, getRandomColor(false));
			gradient.addColorStop(1, getRandomColor(false));
		}

		return gradient;
	}
	onMount(() => {
		new Chart(barChartElement_4, {
			type: 'line',
			data: {
				labels: Array(countData.views_phones.length)
					.fill()
					.map((_, index) => index + 1),
				datasets: [
					{
						label: "Top Mobile's views",
						data: countData.views_phones,
						...getRandomColor(false, true),
						borderWidth: 2
					},
					{
						label: 'Most Firmwares Views',
						data: countData.views_firms,
						...getRandomColor(false, true),
						borderWidth: 2
					},
					{
						label: 'Most Computers Views',
						data: countData.views_computer,
						...getRandomColor(false, true),
						borderWidth: 2
					},
					{
						label: 'Top Blogs',
						data: countData.views_blogs,
						...getRandomColor(false, true),
						borderWidth: 2
					}
				]
			},

			...chartOptions("TRENDING POST", true, { display: true })
		});
		new Chart(barChartElement, {
			type: 'bar',
			data: {
				labels: Object.keys(countData.count_phones_cats),
				datasets: [
					{
						label: 'Devices in each categories',
						data: Object.values(countData.count_phones_cats),
						...chartDatasetOptions(),
						borderWidth: 2,
						borderRadius:18
					}
				]
			},
			...chartOptions('PHONES CATEGORIES', true, { display: true })
		});
		new Chart(barChartElement_5, {
			type: 'bar',
			data: {
				labels: ['Blogs', 'Computers', 'Firmwares', 'Mobiles'],
				datasets: [
					{
						label: 'Number of visitors on each page',
						data: [
							countData.blog_visitors,
							countData.computer_visitors,
							countData.firmwares_visitors,
							countData.mobiles_visitors
						],
						backgroundColor: [
							getRandomColor(true),
							getRandomColor(true),
							getRandomColor(true),
							getRandomColor(true)
						],
						borderRadius: 10
					}
				]
			},
			...chartOptions('PHONES CATEGORIES', true, {
				display: true,
				beginAtZero: true,
				title: { display: false }
			})
		});
		new Chart(barChartElement_2, {
			type: 'line',
			data: {
				labels: ['Phones', 'Watches', 'Blogs', 'Computers', 'Users'],
				datasets: [
					{
						label: 'Device types',
						data: [
							countData.phones,
							countData.watches,
							countData.blogs,
							countData.computers,
							countData.users
						],
						...chartDatasetOptions(),
						borderColor: function (context) {
							const chart = context.chart;
							const { ctx, chartArea } = chart;

							if (!chartArea) {
								// This case happens on initial chart load
								return;
							}
							return getGradient(ctx, chartArea);
						}
					}
				]
			},
			...chartOptions('', true, { display: true })
		});
		new Chart(barChartElement_3, {
			type: 'doughnut',
			data: {
				labels: ['Phones & Watches', 'Computers'],
				datasets: [
					{
						label: 'Total categories',
						data: [countData.phones_category, countData.computers_category],
						backgroundColor: [getRandomColor(false), getRandomColor(false)],
						borderColor: ['#00000000', '#00000000', '#00000000'],
						borderRadius: 2,
						borderWidth: 2
					}
				]
			},
			...chartOptions('Number of categories', false, {})
		});
	});
	let start_anim = false;
	onMount(() => {
		setTimeout(() => {
			start_anim = true;
		}, 500);
	});

	const firmCounts = alterNumberFormat(countData.firmwares);
	const phoneCatCounts = alterNumberFormat(countData.phones_category);
	const phoneCounts = alterNumberFormat(countData.phones);
	const computerCatCounts = alterNumberFormat(countData.computers_category);
	const computerCounts = alterNumberFormat(countData.computers);
	const firmCatCounts = alterNumberFormat(countData.cat_firmwares);
	const usersCounts = alterNumberFormat(countData.users);
	const blogsCounts = alterNumberFormat(countData.blogs);
</script>

<div>
	<div class="flex chart-2">
		<div class="flex k3992">
			<div class="dash-super count-element">
				<span class="dash-icon"><Icon src={CpuChip} /></span>
				<span class="x93">
					<CountAnim
						animationDuration={1000}
						targetCount={start_anim ? firmCounts.counts : 0}
					/>{firmCounts.postfix}
				</span>
				<span>Total Firmware</span>
			</div>
			<div class="dash-super count-element">
				<span class="dash-icon"><Icon src={DevicePhoneMobile} /></span>
				<span class="x93">
					<CountAnim
						animationDuration={2000}
						targetCount={start_anim ? phoneCounts.counts : 0}
					/>{phoneCounts.postfix}
				</span>
				<span> Number of phones </span>
			</div>
			<div class="dash-super count-element">
				<span class="dash-icon"><Icon src={ComputerDesktop} /></span>
				<span class="x93">
					<CountAnim
						targetCount={start_anim ? computerCounts.counts : 0}
						animationDuration={1500}
					/>{computerCounts.postfix}
				</span>
				<span> Number of Computers </span>
			</div>
			<div class="dash-super count-element">
				<span class="dash-icon"><Icon src={Users} /></span>
				<span class="x93">
					<CountAnim
						animationDuration={2500}
						targetCount={start_anim ? usersCounts.counts : 0}
					/>{usersCounts.postfix}
				</span>
				<span> Registered Users </span>
			</div>
		</div>
		
		<div class="wire" />

		<div class="flex as99932">
			<div class="dash-super a9932" style="width: 58%">
				<canvas bind:this={barChartElement_2} />
			</div>

			<div class="dash-super a9932 without-bg">
				<canvas bind:this={barChartElement_3} />
			</div>
		</div>
		<div class="flex k3992">
			<div class="dash-super count-element">
				<span class="dash-icon"><Icon src={RectangleStack} /></span>
				<span class="x93">
					<CountAnim
						animationDuration={2000}
						targetCount={start_anim ? phoneCatCounts.counts : 0}
					/>{phoneCatCounts.postfix}
				</span>
				<span> Phones Categories </span>
			</div>
			<div class="dash-super count-element">
				<span class="dash-icon"><Icon src={ServerStack} /></span>
				<span class="x93">
					<CountAnim
						animationDuration={1000}
						targetCount={start_anim ? computerCatCounts.counts : 0}
					/>{computerCatCounts.postfix}
				</span>
				<span> Computers Categories </span>
			</div>

			<div class="dash-super count-element">
				<span class="dash-icon"><Icon src={CircleStack} /></span>
				<span class="x93">
					<CountAnim
						animationDuration={2500}
						targetCount={start_anim ? firmCatCounts.counts : 0}
					/>{firmCatCounts.postfix}
				</span>
				<span> Firmware Categories </span>
			</div>
			<div class="dash-super count-element">
				<span class="dash-icon"><Icon src={Newspaper} /></span>
				<span class="x93">
					<CountAnim
						animationDuration={3000}
						targetCount={start_anim ? blogsCounts.counts : 0}
					/>{blogsCounts.postfix}
				</span>
				<span> Total Blogs </span>
			</div>
		</div>

	</div>
	
	<h2><span><Icon src={AdjustmentsHorizontal}/></span>Page's Visitors Analytics</h2>
	
	<div class="dash-super dash-element">
		<div class="dash-super count-element dash-side-33">
			<div class="xi003">
				<span class="dash-icon"><Icon src={ArrowTrendingUp} /></span>
				<span class="x93">
					{numberFormat(countData.blog_visitors)}
				</span>
				<span class="a099cri2">Blogs page Visitors</span>
			</div>
			<div class="xi003">
				<span class="x93">
					{numberFormat(countData.computer_visitors)}
				</span>
				<span class="a099cri2">Laptops page Visitors</span>
			</div>
			<div class="xi003">
				<span class="x93">
					{numberFormat(countData.firmwares_visitors)}
				</span>
				<span class="a099cri2">Firmwares page Visitors</span>
			</div>
			<div class="xi003">
				<span class="x93">
					{numberFormat(countData.mobiles_visitors)}
				</span>
				<span class="a099cri2">Mobiles page Visitors</span>
			</div>
		</div>
		<div class="si8323">
			<canvas bind:this={barChartElement_5} />
		</div>
	</div>
	
	<h2 style="text-align:center"> <span><Icon src={ChartBar} /></span> Trending Post's</h2>
	<div class="dash-super dash-element">
		<canvas bind:this={barChartElement_4} />
	</div>
	<h2 style="text-align:center"> <span><Icon src={RectangleGroup} /></span> Mobile & Smart Watches Categories</h2>
	<div class="dash-super dash-element">
		<canvas bind:this={barChartElement} />
	</div>
</div>

<style lang="scss">
	h2 {
		color: var(--primary-color);
		display: flex;
		align-items: center;
		justify-content: center;
		& span{
			margin: 0 10px;
		}
	}
	.si8323 {
		width: 100%;
	}
	.dash-side-33 {
		width: 200px !important;
		margin-top: -12px !important;
		border: none !important;
		background: none !important;
		box-shadow: none !important;
		& .xi003 {
			display: flex;
			flex-direction: column;
			margin: 2px auto;
			& span.a099cri2 {
				font-size: 11px !important;
			}
		}
	}
	.dash-icon {
		background: var(--dash-element-icon-color);
		width: 43px;
		height: 43px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		border: 1px solid var(--light-color-border-2);
		top: -19px;
		left: 0;
		right: 0;
		margin: auto;
	}
	.as99932 {
		width: 100%;
		justify-content: center;
		background: var(--charts-element-bg);
		padding: 18px 0;
		border-radius: 9px;
		& div {
			width: 25%;
		}
	}
	.without-bg {
		background: none !important;
		border: none !important;
		box-shadow: none !important;
	}
	.chart-2 {
		flex-wrap: wrap;
		& .k3992 {
			margin: 15px auto;
			flex-wrap: wrap;
			justify-content: center;
		}
	}
	.a9932 {
		margin: 6px 21px;
		align-items: flex-end;
		justify-content: center;
		border-radius: 25px;
		padding: 19px;
		min-height: 300px;
	}
	.count-element {
		color: var(--primary-color);
		width: 200px;
		padding: 33px 19px;
		margin: 13px 5px;
		font-weight: 500;
		flex-direction: column;
		text-align: center;
		& .x93 {
			font-size: 59px;
			font-weight: bold;
			margin: 17px 0 0 0;
		}
	}

	.dash-element {
		margin-top: 30px;
		padding: 10px;
	}
	.dash-super {
		cursor: pointer;
		position: relative;
		background: var(--charts-element-bg);
		border-radius: 14px;
		display: flex;
		font-size: 14px;
		box-shadow: var(--common-shadow);
		border: 1px solid var(--light-color-border-2);
	}
</style>
