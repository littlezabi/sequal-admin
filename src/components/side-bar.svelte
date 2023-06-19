<script lang="ts">
	import {
		Icon,
		ChartPie,
		DevicePhoneMobile,
		ComputerDesktop,
		InformationCircle,
		ClipboardDocument,
		Photo,
		CpuChip,
		Users,
		ChatBubbleBottomCenterText,
		ChevronLeft
	} from 'svelte-hero-icons';
	let sideBarClose = true;
</script>

<div class="side-bar" class:close={sideBarClose}>
	<button
		class="side-bar-toggler"
		class:close={sideBarClose}
		on:click={() => (sideBarClose = !sideBarClose)}
	>
		<Icon src={ChevronLeft} />
	</button>
	<ul class="ul-top">
		<li>
			<a class="flex" href="/">
				<Icon src={ChartPie} />
				<span>Dashboard</span>
			</a>
		</li>
		<li>
			<a class="flex" href="/mobiles">
				<Icon src={DevicePhoneMobile} />
				<span>Mobile Phones</span>
			</a>
		</li>
		<li>
			<a class="flex" href="/">
				<Icon src={ComputerDesktop} />
				<span>Computer & Laptops</span>
			</a>
		</li>
		<li>
			<a class="flex" href="/">
				<Icon src={CpuChip} />
				<span>Firmware's</span>
			</a>
		</li>
		<li>
			<a class="flex" href="/">
				<Icon src={ClipboardDocument} />
				<span>Blogs</span>
			</a>
		</li>
		<li>
			<a class="flex" href="/">
				<Icon src={Photo} />
				<span>Files</span>
			</a>
		</li>
		<li>
			<a class="flex" href="/">
				<Icon src={Users} />
				<span>Users</span>
			</a>
		</li>
		<li>
			<a class="flex" href="/">
				<Icon src={ChatBubbleBottomCenterText} />
				<span>Users</span>
			</a>
		</li>
		<li>
			<a class="flex" href="/">
				<Icon src={InformationCircle} />
				<span>Informations</span>
			</a>
		</li>
	</ul>
</div>

<style lang="scss">
	.side-bar {
		background: var(--side-bar);
		color: var(--primary-color);
		padding: 10px;
		border-radius: 6px;
		margin: 13px 1px;
		position: relative;
		width: 270px;
		transition: 300ms;
		backdrop-filter: blur(18px);
		box-shadow: var(--common-shadow);
		border: 1px solid #0000000d;
		& .side-bar-toggler {
			width: 25px;
			height: 25px;
			border: 1px solid var(--light-color-border);
			padding: 3px;
			background: var(--bg-color);
			border-radius: 50%;
			text-align: center;
			display: flex;
			position: absolute;
			right: -11px;
			top: 8px;
			transition: 800ms;
			transform: matrix(1, 0, 0, -1, 0, 0);
			&.close {
				transform: matrix(-1, 0, 0, -1, 0, 0);
			}
		}
		.ul-top {
			margin: 28px 0;
			cursor: pointer;
			& li {
				margin-top: 4px;
				padding: 0 5px;
				margin-left: auto;
				padding: 5px 2px;
				border-radius: 4px;
				& span {
					font-size: 14px;
					margin-left: 12px;
					transition: 300ms;
				}
			}
		}
		&.close {
			width: 38px;
			& li {
				& a {
					& span {
						margin: 0;
						font-size: 0px;
						//     opacity: 0;
						//     transform: scale(0);
					}
				}
			}
		}
	}
</style>
