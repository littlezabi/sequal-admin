<script lang="ts">
	import { ArrowUturnLeft, ChevronLeft, ChevronRight, Icon, Photo, Trash } from 'svelte-hero-icons';
	import Loading from './loading.svelte';
	import { PUBLIC_IMAGES_FETCH_URI, PUBLIC_PHONE_IMAGE_FOLDER } from '$env/static/public';
	export let loading: boolean;
	export let dataFrame: any;
	export let filesList: any;
	const shiftImage = (shift: string, cur_index: number): void => {
		let position = 1;
		position = shift === 'left' ? cur_index - 1 : cur_index + 1;
		const e = filesList.splice(cur_index, 1);
		filesList.splice(position, 0, e[0]);
		const frameImage = dataFrame.images.splice(cur_index, 1);
		dataFrame.images.splice(position, 0, frameImage[0]);
		filesList = filesList;
	};
	const removeImage = (index: number): void => {
		filesList.splice(index, 1);
		filesList = filesList;
		if (typeof dataFrame.images[index] === 'string')
			dataFrame.info.removeImages.push(dataFrame.images[index]);
		dataFrame.images.splice(index, 1);
		dataFrame.images = dataFrame.images;
		dataFrame.info.removeImages = dataFrame.info.removeImages;
	};
	const removeFromTrash = (index: number): void => {
		filesList = [...filesList, dataFrame.info.removeImages[index]];
		dataFrame.images.push(dataFrame.info.removeImages[index]);
		dataFrame.info.removeImages.splice(index, 1);
		dataFrame.info.removeImages = dataFrame.info.removeImages;
	};
	const __ixq = (): void => {
		const element = document.querySelector('#phone-image') as HTMLElement;
		element.click();
	};
	const handleImage = (file: any) => {
		[...file.target.files].forEach((image) => {
			if (dataFrame.images) dataFrame.images = [...dataFrame.images, image];
			else dataFrame.images = [image];
			let reader = new FileReader();
			reader.onload = (e: any) => (filesList = [...filesList, e.target.result]);
			reader.readAsDataURL(image);
		});
	};
</script>

<div class="flex-yxz">
	<div class="a03x full-w image-input">
		<label for="phone-image">PRODUCT IMAGE</label>
		{#if loading}
			<Loading />
		{:else}
			<div class="add-image" on:mousedown={__ixq}>
				<Icon src={Photo} />
				<span>Click to add image's</span>
			</div>
		{/if}
		<input
			type="file"
			name="phone-image"
			id="phone-image"
			accept="image/*"
			multiple={true}
			on:change={handleImage}
		/>
	</div>
</div>
{#if filesList.length}
	<span style="font-size: 11px;">Sort image carefully first images is device display images</span>
	<div class="flex-yxz image-list">
		{#each filesList as file, index}
			<div class="image-view">
				<button
					title="Remove Image"
					on:click={() => removeImage(index)}
					type="button"
					class="cls-btn"><Icon src={Trash} /></button
				>
				<img
					src={file.includes('data:') || file.includes('http')
						? file
						: PUBLIC_IMAGES_FETCH_URI + file}
					alt={file}
				/>
				<div class="image-shift">
					{#if index !== 0}
						<button on:click={() => shiftImage('left', index)} title="shift to Left" type="button"
							><Icon src={ChevronLeft} /></button
						>
					{/if}
					{#if index < filesList.length - 1}
						<button on:click={() => shiftImage('right', index)} title="shift to Right" type="button"
							><Icon src={ChevronRight} /></button
						>
					{/if}
				</div>
			</div>
		{/each}
	</div>
{/if}
{#if dataFrame.info.removeImages && dataFrame.info.removeImages.length}
	<span style="font-size: 12px;color:orangered;"
		>Image Trash (Trash images will be permanently deleted after saving)</span
	>
	<div class="flex-yxz image-list" style="background:#b4222233">
		{#each dataFrame.info.removeImages as file, index}
			<div class="image-view">
				<button
					title="Add back to the image list"
					on:click={() => removeFromTrash(index)}
					type="button"
					class="cls-btn"><Icon src={ArrowUturnLeft} /></button
				>
				<img
					src={file.includes('http')
						? file
						: PUBLIC_IMAGES_FETCH_URI + file}
					alt={file}
				/>
			</div>
		{/each}
	</div>
{/if}
