<script lang="ts">
	import axios from 'axios';
	import { Icon, Photo, XMark } from 'svelte-hero-icons';
	import { modal, modalUpdate, static_data, updateStaticData } from '$lib/store';
	import { IMAGE_ROOT } from '$lib/constant';
	import { life, numberFormat } from '$lib/globals';
	import Loading from './loading.svelte';
	let loading = true;
	let item = $modal;
	$: $modal, (item = $modal), setTimeout(()=>getItem($modal._id), 10);
	let cats: [] | any = $static_data.categories;
	document.querySelector('body')?.classList.add('modal-open');
	const handleClose = () => {
		modalUpdate({ visiable: false });
		document.querySelector('body')?.classList.remove('modal-open');
	};
	let filesList: any = [];
	const getItem = async (_id: string) => {
		await axios
			.get('/api/get-items/', {
				params: { smart_device: 1, _id, getCats: cats.length > 0 ? 0 : 1 }
			})
			.then((e) => {
				loading = false;
				item = { ...item, ...e.data.item };
				console.log(item);
				filesList = [IMAGE_ROOT + item.image, ...filesList];
				if (!(cats.length > 0)) {
					updateStaticData({ categories: e.data.cats });
					cats = e.data.cats;
				}
			})
			.catch((e) => {
				loading = false;
				console.error(e);
			});
	};
	const handleImage = (e: any) => {
		[...e.target.files].forEach((image) => {
			let reader = new FileReader();
			reader.onload = (e: any) => {
				filesList = [...filesList, e.target.result];
			};
			reader.readAsDataURL(image);
		});
	};
</script>

<div class="modal">
	<button on:click={handleClose} class="close-btn"><Icon src={XMark} /></button>
	<div class="inner-modal">
		<div class="form">
			<h2>{item.title}</h2>
			{#if loading}
				<span>
					<Loading loading_lines={2} />
				</span>
			{:else}
				<span>
					Added <b>{life(item.createdAt).from()}</b>. Information integrity score is
					<b>{item.integrity}%</b>. total <b>{numberFormat(item.loves)}</b> people love this phone.
				</span>
			{/if}
			<p>
				You can add new, update or delete the device. take any action carefully there is no change
				to undo your actions.
			</p>
			<form>
				<div class="flex-yxz">
					<div class="a03x">
						<label for="firstname">DEVICE TITLE HERE</label>
						<input
							type="text"
							name="firstname"
							id="firstname"
							placeholder="E.g. Samsung Galaxy A02"
							value={item.title}
							required
						/>
					</div>
					<div class="a03x">
						<label for="lastname">DEVICE CATEGORY</label>
						<select name="lastname" id="lastname">
							{#if !cats.length}
								<option selected value={item.category}>{item.category}</option>
							{/if}
							{#each cats as cat}
								{#if cat.category === item.category}
									<option selected value={cat.category}>{cat.category}</option>
								{:else}
									<option value={cat.category}>{cat.category}</option>
								{/if}
							{/each}
						</select>
					</div>
				</div>
				<div class="flex-yxz">
					<div class="a03x full-w">
						<label for="description">PHONE DESCRIPTION</label>
						{#if loading}
							<div style="width: 256px;">
								<Loading />
							</div>
						{:else}
							<textarea
								name="description"
								id="description"
								placeholder="Type something about phone"
								required>{item.description}</textarea
							>
						{/if}
					</div>
				</div>

				<div class="flex-yxz">
					<div class="a03x full-w image-input">
						<label for="phone-image">PHONE IMAGE</label>
						{#if loading}
							<Loading />
						{:else}
							<div
								class="add-image"
								on:mousedown={() => document.querySelector('#phone-image')?.click()}
							>
								<Icon src={Photo} />
								<span>Click to add image's</span>
							</div>
						{/if}
						<input
							type="file"
							name="phone-image"
							id="phone-image"
							accept="image/*"
							on:change={handleImage}
						/>
					</div>
				</div>
				
				<div class="flex-yxz image-list">
					{#each filesList as file}
						<div class="image-view">
							<button><Icon src={XMark} /></button>
							<img src={file} alt={file} />
						</div>
					{/each}
				</div>

				<div class="flex-yxz">
					<div class="a03x full-w">
						<label for="slug">SLUG</label>
						{#if loading}
							<div style="width: 416px"><Loading/></div>
						{:else}
							<input
								type="text"
								name="slug"
								value={item.slug}
								id="slug"
								placeholder="Enter phone slug here..."
							/>
						{/if}
					</div>
				</div>

				<input type="submit" value="UPDATE PHONE" />
			</form>
		</div>
	</div>
</div>

<style lang="scss">
	.image-view {
		position: relative;
		cursor: pointer;
		& button {
			position: absolute;
			right: 0;
			width: 25px;
			top: -9px;
			padding: 3px;
			height: 25px;
			display: flex;
			margin: 0;
			align-items: center;
			justify-content: center;
			background: black;
			border: none;
			border-radius: 50%;
			display: none;
		}
		&:hover {
			& > button {
				display: flex;
			}
		}
	}
	.image-input {
		& input {
			display: none;
		}
		& .add-image {
			padding: 10px;
			border: 1px solid rgba(0, 255, 141, 0.1411764706);
			width: 213px;
			border-radius: 8px;
			margin: 10px 0;
			text-align: center;
			display: flex;
			flex-direction: column;
			align-items: center;
			& span {
				text-align: center;
				width: 100%;
				font-size: 11px;
			}
		}
	}
	.image-list {
		margin: 5px 0;
		background: #27315f1a;
		padding: 10px;
		border-radius: 10px;
		min-height: 100px;
		& img {
			height: 110px;
			margin: 0 5px;
		}
	}
	.modal {
		background: #00000073;
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		backdrop-filter: blur(18px);
		right: 0;
		width: 100%;
		z-index: 10;
		color: var(--primary-color);
		display: flex;
		align-items: center;
		justify-content: center;
		& .close-btn {
			position: absolute;
			top: 34px;
			right: 52px;
			border-radius: 35px;
			width: 43px;
			background: #383838;
			height: 43px;
			border: none;
			&:hover {
				background: #ff004e;
			}
		}
		& .inner-modal {
			color: inherit;
			border-radius: 8px;
			background: var(--bg-color);
			padding: 20px;
			max-width: 90%;
			overflow-y: scroll;
			max-height: 90%;
			border: 1px solid rgba(255, 255, 255, 0.0705882353);
			&::-webkit-scrollbar {
				width: 2px;
				background: var(--bg-color);
			}
			&::-webkit-scrollbar-thumb {
				background: linear-gradient(45deg, transparent, #4b3fff, transparent);
			}
		}
	}

	.form {
		padding: 13px 57px;
		margin-left: 76px;
		& .selected-files-list {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			align-items: flex-start;

			& span {
				display: flex;
				font-size: 12px;
				border: 1px solid #7aff00;
				background: rgba(6, 252, 129, 0.2392156863);
				margin: 3px;
				border-radius: 4px;
				padding: 2px 8px;
				align-items: center;
			}

			& .close-333 {
				background: transparent;
				font-size: 18px;
				border: none;
				font-weight: bold;
				cursor: pointer;
				color: black;
				padding: 1px 7px;
				transition: 500ms;

				&:hover {
					color: #ff0029;
				}
			}
		}

		& .drop-zone {
			width: 100%;
			height: 145px;
			border: 2px #00000059 dashed;
			border-radius: 10px;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			background: #05f20026;
			cursor: pointer;

			&.active {
				animation: dropZoneAnim 300ms ease-in forwards infinite;
				background-color: #05ff0052;
			}

			& input {
				display: none;
			}

			& .sp-1 {
				display: block;
				font-size: 18px;
				font-weight: 500;
			}

			& .sp-2 {
				font-size: 20px;
				font-weight: bold;
				margin: 6px auto;
				color: #8c8c8c;
			}

			& .btn-1 {
				height: 40px;
				width: 200px;
				border-radius: 39px;
				border: none;
				background: #0062ff;
				color: white;
				font-size: 14px;
				font-family: inherit;
				cursor: pointer;
			}
		}

		& h2 {
			text-transform: uppercase;
			font-size: 28px;
			letter-spacing: 1px;
		}

		& p {
			font-size: 14px;
			font-weight: 400;
		}

		& form {
			margin-top: 20px;
		}

		& .flex-yxz {
			display: flex;

			&.attachment {
				display: block;
			}

			& .a03x {
				display: flex;
				flex-direction: column;
				width: 50%;
				margin-top: 15px;
				margin-right: 20px;

				&.full-w {
					width: 100%;
				}

				& input,
				& select {
					height: 32px;
					border: none;
					border-bottom: 1px solid rgb(95 95 95);
					width: 85%;
					background: none;
					color: inherit;
					&:active,
					&:hover {
						border-bottom-color: rgb(0, 255, 106);
					}
				}
				& select {
					cursor: pointer;
					text-transform: uppercase;
					& option {
						background: var(--bg-color);
						font-size: 14px;
						text-transform: uppercase;
					}
				}
				& textarea {
					width: 100%;
					border: none;
					border-bottom: 2px solid #868686;
					padding: 9px 12px;
					font-size: 16px;
					border-radius: 12px 12px 0 0;
					min-height: 80px;
					background: #f700a71a;
					color: var(--primary-color);
					font-family: inherit;
					margin-top: 4px;
				}
			}
		}
		& input[type='submit'] {
			width: 278px;
			height: 50px;
			margin: 22px auto 11px 0;
			border-radius: 37px;
			border: 2px solid #0c5493;
			background: #0062ff;
			color: white;
			font-size: 14px;
			font-weight: 500;
			letter-spacing: 1px;
			cursor: pointer;
			&:hover {
				background: #002dff;
			}
		}
	}
</style>
