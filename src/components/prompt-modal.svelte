<script lang="ts">
	import { fade } from 'svelte/transition';
	import { promptModal, promptModalUpdate } from '$lib/store';
</script>

<div class="spec-input-modal" transition:fade>
	<div class="inner-spec-modal">
		<div class="form">
			<h2>{$promptModal.title}</h2>
			{#if $promptModal.description}<p>{$promptModal.description}</p>{/if}
			{#if $promptModal.form && $promptModal.form.inputs}
				<form
					on:submit|preventDefault={$promptModal.form.onSubmit
						? $promptModal.form.onSubmit
						: () => {}}
				>
					<div class="flex-yxz">
						{#each $promptModal.form.inputs as input, i}
							<div class="a03x full-w">
								<label for="new-key">{input.label}</label>
								<input
									type={input.type ? input.type : 'text'}
									name={input.name ? input.name : 'input_' + i}
									id={input.id ? input.id : 'id_' + i}
									value={input.value ? input.value : ''}
									placeholder={input.placeholder ? input.placeholder : 'Enter text here....'}
									on:change={input.callback ? input.callback : () => {}}
									required={input.required ? input.required : false}
								/>
							</div>
						{/each}
					</div>
					{#if $promptModal.form.buttons}
						<div class="flex-yxz">
							{#each $promptModal.form.buttons as button}
								<button
									class={button.class ? button.class : ''}
									type={button.type ? button.type : 'button'}
									on:click={button.callback ? button.callback : () => {}}>{button.title}</button
								>
							{/each}
						</div>
					{/if}
				</form>
			{/if}
			<div class="flex-yxz">
				{#if $promptModal.confirm}
					{#each $promptModal.confirm as button}
						<button
							class={button.class ? button.class : ''}
							type={button.type ? button.type : 'button'}
							on:click={button.callback ? button.callback : () => {}}>{button.title}</button
						>
					{/each}
				{/if}
				{#if !$promptModal.remove_close_button}
					<button type="button" on:click={() => promptModalUpdate({ visible: false })}>CLOSE</button
					>
				{/if}
			</div>
		</div>
	</div>
</div>
