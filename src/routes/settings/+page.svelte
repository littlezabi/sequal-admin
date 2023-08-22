<script lang="ts">
	import axios from 'axios';
	export let data: any;
	const settings = JSON.parse(data.settings);
	const dataFrame = settings;
	const keys: any = [];
	const values: any = [];
	const noKeys = ['_id', 'active'];
	Object.keys(settings).map((setting, i: number) => {
		if (!noKeys.includes(setting)) {
			values.push(settings[setting]);
			keys.push(setting);
		}
	});
	const saveDataframe = async () => {
		const id = dataFrame._id;
		delete dataFrame._id;
		await axios
			.post(
				'/api/update-items',
				{ id, settings: dataFrame },
				{ headers: { requestingFor: 'updateSettings' } }
			)
			.then((res) => {
				console.log('res: ', res.data);
			})
			.catch((e) => console.error(e));
	};
	const handleForm = (element: any) => {
		let e = element as HTMLInputElement;
		for (let key of keys) {
			let v: string | number = '';
			if (element.target[key].type === 'number') v = Number(element.target[key].value);
			else if (element.target[key].type === 'checkbox') v = element.target[key].checked;
			else v = element.target[key].value;
			dataFrame[key] = v;
		}
		saveDataframe();
	};
</script>

<h2>APPLICATION SETTINGS</h2>
<div class="settings">
	<p>These settings can directly affect website behaviors, so make changes carefully.</p>
	<div class="form">
		<form on:submit|preventDefault={handleForm}>
			<div class="flex-yxz">
				{#each keys as setting, index}
					{#if setting !== '_id'}
						<div class={typeof values[index] === 'boolean' ? 'a03x checkbox' : 'a03x'}>
							<label for={setting}>
								{setting === 'deviceViewHeaderTextLength'
									? 'Number of device top view text'
									: setting.replaceAll(/([a-z])([A-Z])/g, '$1 $2').toLowerCase()}
								<small>
									{#if setting === 'timeAfterAnnouncmentVisible'}
										(Enter time in seconds)
									{:else if setting === 'websiteName'}
										(it will change the website name throughout the entire website)
									{:else if setting === 'itemsPerPage'}
										(number of items in a page when pagination is visible)
									{:else if setting === 'deviceViewHeaderTextLength'}
										(Length of middle/Top view of devices spec)
										<a href="/information#deviceViewHeaderTextLength" target="_blank"> &#x2139; </a>
									{:else if setting === 'maximumFilesAllowInImageTools' || setting === 'minimumFilesAllowInImageTools'}
										(image batch size)
									{:else if setting === 'mainCatPerCollLimit'}
										(category per column)
									{/if}
								</small>
							</label>
							<input
								type={typeof values[index] === 'number'
									? 'number'
									: typeof values[index] === 'boolean'
									? 'checkbox'
									: 'text'}
								class={typeof values[index] === 'number' ? 'number-input' : ''}
								name={setting}
								placeholder="Enter here..."
								value={values[index]}
								id={setting}
							/>
						</div>
					{/if}
				{/each}
			</div>
			<input type="submit" value="Save" />
		</form>
	</div>
</div>

<style lang="scss">
	.settings {
		margin: 30px auto 100px auto;
		// background:var(--secondary-bg);
	}
	.settings,
	h2 {
		color: var(--primary-color);
	}

	.a03x label {
		&::first-letter {
			text-transform: capitalize;
		}
		& a {
			margin-left: 3px;
			background: #49484885;
			color: white;
			width: 20px;
			height: 20px;
			border-radius: 50%;
			display: inline-flex;
			align-items: center;
			justify-content: center;
		}
	}
	.a03x {
		&.checkbox {
			flex-direction: row-reverse;
			justify-content: flex-end;

			& input {
				margin-right: 15px;
			}
		}
	}
	.number-input {
		width: 114px !important;
	}
</style>
