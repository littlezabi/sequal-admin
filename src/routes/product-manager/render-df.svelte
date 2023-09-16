<script lang="ts">
	import { promptModalUpdate, static_data, updateMessages } from '$lib/store';
	import { Icon, Minus, Plus } from 'svelte-hero-icons';
	export let item_specs: string[];
	export let dataFrame: any;
	export let objectsToDelete: any;
	export let newSpecItem: any;
	export let headersToString: any;
	const removeFromSpecs = (specs: string, spec: string = '', key_value = false): void => {
		if (key_value) delete dataFrame.data[specs];
		else if (spec === '') {
			delete dataFrame.data[specs];
			objectsToDelete[specs] = '';
		} else {
			console.log(specs, spec)
			let n = dataFrame.data[specs].filter((e: any) => Object.keys(e)[0] !== spec);
			dataFrame.data[specs] = n;
		}

		dataFrame.data = dataFrame.data;
		item_specs = item_specs;
		console.log(dataFrame.data, item_specs)
	};
	const __cxd = (e: Event): void => {
		if (e.target instanceof HTMLInputElement) {
			if (e.target.name === 'new-key') newSpecItem = { ...newSpecItem, key: e.target.value.trim() };
			if (e.target.name === 'spec-value')
				newSpecItem = { ...newSpecItem, value: e.target.value.trim() };
		}
	};
	const addSpecItemInDF = () => {
		const key = newSpecItem.key;
		let regex = /^[a-zA-Z0-9\s]+$/;
		let m: boolean | string = false;
		if (!regex.test(key)) m = 'You can not add special characters in your key/title.';
		if (key === undefined || key === '') m = 'Enter a key of your new specification!';
		if (newSpecItem.value === undefined || newSpecItem.value === '')
			m = 'Enter a value of your new specification!';
		let exist = dataFrame.data[newSpecItem.specs].filter(
			(item: any) => Object.keys(item)[0] === key
		);
		if (exist.length > 0) m = `Your entered key (${key}) is already exist on ${newSpecItem.specs}.`;
		if (m) return updateMessages({ message: m, variant: 'danger' });
		const name = `${newSpecItem.specs}___${++newSpecItem.lastInputIndex}_x_${key}`;
		dataFrame.data[newSpecItem.specs].push({ [key]: newSpecItem.value });
		updateMessages({
			message: `Title (${newSpecItem.key}) and value (${newSpecItem.value}) added successfully! add more on ${newSpecItem.specs}.`,
			variant: 'success'
		});
		let tempElement = document.createElement('div');
		tempElement.innerHTML = `<div class="a03x s-96QAaaAScBii"><label 
			for="s${key.replaceAll(' ', '')}-spec" 
			class="s-96QAaaAScBii">${key}</label><input type="text" name="${name}" value="${newSpecItem.value}"
			id="s${key.replaceAll(' ', '')}-spec"
		 	placeholder="Enter ${key} details" class="s-96QAaaAScBii"/></div>`;
		const childNodes = tempElement.childNodes;
		for (let i = 0; i < childNodes.length; i++)
			newSpecItem.specs_list.appendChild(childNodes[i].cloneNode(true));
		dataFrame.data = dataFrame.data
		item_specs = item_specs
	};
	const addNewElement = (id: string) => {
		const element = document.getElementById(id);
		let lastElement: any = element?.querySelectorAll('div');
		lastElement = lastElement[lastElement.length - 1];
		let lastInputIndex = 0
		if(lastElement) {
			let c = lastElement.querySelector('input')['name'];
			lastInputIndex = Number(c.match(/\d+(?=_x_)/g)[0]);
		}
		newSpecItem = {
			specs: id.split('-super')[0].replace('---', ' '),
			lastInputIndex,
			specs_list: element
		};

		promptModalUpdate({
			visible: true,
			title: `Add Specs of ${newSpecItem.specs.toUpperCase()}`,
			description:
				'In our device dataset, all specifications have a key and value. When adding new specifications, we need to provide both the key and value. The first input is for the key, and the second input is for the value.',
			form: {
				inputs: [
					{
						label: `NEW ${newSpecItem.specs.toUpperCase()} SPEC TITLE`,
						type: 'text',
						placeholder: 'E.g. Item body weight',
						name: 'new-key',
						value: newSpecItem.key ?? '',
						callback: __cxd,
						required: true
					},
					{
						label: `NEW ${newSpecItem.specs.toUpperCase()} SPEC VALUE`,
						type: 'text',
						placeholder: 'E.g. 2.05 KG',
						name: 'spec-value',
						value: newSpecItem.value ?? '',
						callback: __cxd,
						required: true
					}
				],
				buttons: [
					{
						type: 'button',
						title: 'ADD SPECS',
						callback: addSpecItemInDF
					},
					{
						type: 'button',
						title: 'Close',
						callback: () => promptModalUpdate({ visible: false })
					}
				]
			}
		});
	};
	const addToHeader = (id: string) => {
		if (dataFrame.data.headers.length >= $static_data.settings.deviceViewHeaderTextLength) {
			updateMessages({
				message: `headers limit is ${$static_data.settings.deviceViewHeaderTextLength} we can't add more.`,
				variant: 'alert'
			});
			return 0;
		}
		let value: null | HTMLElement | string = document.getElementById(id);
		if (value instanceof HTMLInputElement || value instanceof HTMLTextAreaElement)
			value = value.value;
		if (dataFrame.data.headers.includes(value)) {
			updateMessages({
				message: `(${value}) already exist on headers.`,
				variant: 'alert'
			});
			return 0;
		}
		if (value !== '') {
			dataFrame.data.headers = [...dataFrame.data.headers, value];
			headersToString();
			updateMessages({ message: `(${value}) added to headers.`, variant: 'success' });
		}
	};
</script>

{#each item_specs as specs}
	{#if Array.isArray(dataFrame.data[specs])}
		<div class="add-spec-item">
			<h3 class="spec-item-title" id={'__' + specs} data-original={specs} contenteditable>
				{specs}
			</h3>
			<button
				class="add-to-header remove-spec"
				type="button"
				title="Remove '{specs}' and its specs"
				style="margin-left: 34px;"
				on:click={() => removeFromSpecs(specs)}
			>
				<Icon src={Minus} />
			</button>
			<button
				type="button"
				title="Add new specification on '{specs}'"
				on:click={() => addNewElement(specs.replaceAll(' ', '---') + '-super')}
				><Icon src={Plus} /></button
			>
		</div>
		<div class="flex-yxz spec-items" id="{specs.replaceAll(' ', '---')}-super">
			{#each dataFrame.data[specs] as spec, item_index}
				{#each Object.keys(spec) as key}
					<div class="a03x c-88323">
						<button
							class="add-to-header remove-spec"
							type="button"
							title="Remove '{key}'"
							on:click={() => removeFromSpecs(specs, key)}
						>
							<Icon src={Minus} />
						</button>
						<label for="s{key.replaceAll(' ', '')}-spec">{key}</label>
						<input
							type="text"
							name="{specs}___{item_index}_x_{key}"
							value={spec[key]}
							id="s{key.replaceAll(' ', '')}-spec"
						/>
						<button
							class="add-to-header"
							type="button"
							title="add '{key}' value to headers list"
							on:click={() => addToHeader(`s${key.replaceAll(' ', '')}-spec`)}
						>
							<Icon src={Plus} />
						</button>
					</div>
				{/each}
			{/each}
		</div>
	{:else if dataFrame.data[specs]}
		<div class="flex-yxz spec-items" id="{specs.replaceAll(' ', '---')}-super">
			<div class="a03x c-88323">
				<button
					class="add-to-header remove-spec"
					type="button"
					title="Remove '{specs}'"
					on:click={() => removeFromSpecs(specs, '', true)}
				>
					<Icon src={Minus} />
				</button>
				<label for="s{specs.replaceAll(' ', '')}-spec">{specs}</label>
				<input
					type="text"
					name="{specs}___x_{specs}"
					value={dataFrame.data[specs]}
					id="s{specs.replaceAll(' ', '')}-spec"
				/>
				<button
					class="add-to-header"
					type="button"
					title="add '{specs}' value to headers list"
					on:click={() => addToHeader(`s${specs.replaceAll(' ', '')}-spec`)}
				>
					<Icon src={Plus} />
				</button>
			</div>
		</div>
	{/if}
{/each}
