<script lang="ts">
	import { modal, modalUpdate, static_data, updateMessages } from '$lib/store';
	import { Icon, User, XMark, Clipboard, ArrowPathRoundedSquare } from 'svelte-hero-icons';
	import Loading from './loading.svelte';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import { getRandomChar } from '$lib/globals';
	import { fade } from 'svelte/transition';

	let countries: any = [];
	let admin = false;
	const userObject: any = {
		firstname: '',
		lastname: '',
		username: '',
		email: '',
		avatar: '',
		notifyme: true,
		active: true,
		country: '',
		userType: 'client',
		password: '',
		re_password: ''
	};
	document.querySelector('body')?.classList.add('modal-open');
	const handleClose = () => {
		modalUpdate({ visible: false });
		document.querySelector('body')?.classList.remove('modal-open');
	};
	const handleImage = (file: any) => {
		const image = file.target.files[0];
		userObject.avatar = image;
		const reader = new FileReader();
		reader.onload = (e) => {
			const imageElement = document.querySelector('.add-image') as HTMLElement;
			if (imageElement)
				imageElement.innerHTML = `<img style="width: 100%;height: 100%;object-fit: cover;border-radius: 50%;" src="${e.target?.result}" alt="profile"/>`;
		};
		reader.readAsDataURL(image);
	};
	onMount(
		async () =>
			await axios
				.get('/api/get-items', { params: { getCountries: 1 } })
				.then((res) => (countries = res.data))
				.catch((e) => console.error(e))
	);
	const handleForm = async (e: Event) => {
		console.log(userObject);
		if (userObject.email === '')
			updateMessages({ message: 'Enter user email address.', variant: 'alert' });
		else if (admin && userObject.username === '') {
			updateMessages({
				message: "Enter admin username (don't use special chars).",
				variant: 'alert'
			});
		} else if (/[^\w\s]/.test(userObject.username)) {
			updateMessages({
				message: 'in username special character found! please remove it',
				variant: 'danger'
			});
		} else if (!admin && userObject.firstname === '')
			updateMessages({ message: 'Enter user firstname.', variant: 'alert' });
		else if (!admin && userObject.lastname === '')
			updateMessages({ message: 'Enter user lastname.', variant: 'alert' });
		else if (userObject.password === '' || userObject.password !== userObject.re_password)
			updateMessages({ message: 'Password not matched.', variant: 'alert' });
		else {
			if (admin) {
				delete userObject.firstname;
				delete userObject.lastname;
				delete userObject.notifyme;
				delete userObject.country;
				userObject.userType = 'admin';
			} else {
				delete userObject.username;
				userObject.userType = 'client';
			}
			let form = new FormData();
			Object.keys(userObject).map((e: string) => {
				form.append(e, userObject[e]);
			});
			form.append('profileWidth', $static_data.settings.UserProfilePictureWidth ?? 300);
			form.append('postKey', 'adduser-1');
			await axios
				.post('/api/set-items', form)
				.then((e) => {
					console.log(e.data);
				})
				.catch((e) => console.log(e));
		}
	};
	const setRandom = () => {
		let q = document.getElementById('gen-random') as HTMLInputElement;
		if (q) q.value = getRandomChar(10);
	};
	const copyPassword = () => {
		let q = document.getElementById('gen-random') as HTMLInputElement;
		q.select();
		const selection = document.getSelection();
		if (selection) navigator.clipboard.writeText(selection?.toString());
		updateMessages({ message: 'Text successfully copied to clipboard!', variant: 'success' });
	};
	const loading = false;
	const F___x319 = () => (document.querySelector('#avatar') as HTMLElement)?.click();
	const addInput = (e: Event | any) =>
		(userObject[e.target?.name] =
			e.target?.name === 'notifyme' || e.target?.name === 'active'
				? e.target?.checked
				: e.target?.value);
	const handleUsername = (e: Event) => {
		const value = (e.target as HTMLInputElement).value;
		if (/[^\w\s]/.test(value)) {
			console.log('symobls found...');
			updateMessages({ message: 'special character found! please remove it', variant: 'danger' });
		} else {
			updateMessages(false);
		}
		userObject.username = value;
		// addInput
	};
</script>

<div class="modal" transition:fade>
	<button on:click={handleClose} class="close-btn"><Icon src={XMark} /></button>
	<div class="inner-modal">
		<div class="form" id="dataframe-form">
			<h2>{$modal.title ?? 'Closing....'}</h2>
			<p>
				You can add new, update or delete the user information. take any action carefully there is
				no change to undo your actions.
			</p>
			<form autocomplete="off" on:submit={handleForm}>
				<div class="flex-yxz">
					<div class="a03x full-w image-input">
						<label for="avatar">USER PROFILE AVATAR</label>
						{#if loading}
							<Loading />
						{:else}
							<div class="add-image" on:mousedown={F___x319}>
								<Icon src={User} style="height: auto;" />
								<span>add profile image</span>
							</div>
						{/if}
						<input type="file" name="avatar" id="avatar" accept="image/*" on:change={handleImage} />
					</div>
				</div>
				<div class="flex-yxz">
					<div class="a03x a03x-1 full-w">
						<label for="active">USER TYPE <small>(select user type admin or client)</small></label>
					</div>
				</div>
				<div class="flex-yxz sup-a9ckq">
					<div class="a03x a03x-1">
						<input
							type="radio"
							checked
							id="userType_client"
							name="userType"
							value="userType_client"
							on:change={() => (admin = false)}
						/>
						<label style="cursor:pointer" for="userType_client">NEW CLIENT</label>
					</div>
					<div class="a03x a03x-1">
						<input
							type="radio"
							on:change={() => (admin = true)}
							name="userType"
							id="userType_admin"
							value="userType_admin"
						/>
						<label style="cursor:pointer" for="userType_admin">NEW ADMIN</label>
					</div>
				</div>
				{#if admin}
					<div class="flex-yxz">
						<div class="a03x full-w">
							<label for="username"
								>USERNAME<small> (Don't use special characters and spaces) </small></label
							>
							<input
								type="text"
								name="username"
								id="username"
								placeholder="E.g. littlezabi"
								value={userObject.username}
								on:keyup={handleUsername}
								required
							/>
						</div>
					</div>
				{:else}
					<div class="flex-yxz">
						<div class="a03x">
							<label for="firstname">USER FIRST NAME</label>
							<input
								type="text"
								name="firstname"
								id="firstname"
								placeholder="E.g. Muhammad"
								value={userObject.firstname}
								on:change={addInput}
								required
							/>
						</div>
						<div class="a03x">
							<label for="lastname">USER LAST NAME</label>
							<input
								type="text"
								name="lastname"
								id="lastname"
								placeholder="E.g. Zohaib"
								value={userObject.lastname}
								on:change={addInput}
								required
							/>
						</div>
					</div>
				{/if}
				<div class="flex-yxz">
					<div class="a03x full-w">
						<label for="email">USER EMAIL ADDRESS</label>
						<input
							type="text"
							name="email"
							id="email"
							placeholder="E.g. example@123.com"
							value={userObject.email}
							on:change={addInput}
							required
						/>
					</div>
				</div>

				<div class="flex-yxz">
					<div class="a03x highlight-bg">
						<label for="gen-random">GENERATE RANDOM PASSWORD</label>
						<br />
						<div class="flex">
							<input
								type="text"
								name="gen-random"
								id="gen-random"
								placeholder="generate a random password"
								value={getRandomChar(10)}
							/>
							<button
								class="btn btn-small"
								type="button"
								on:click={copyPassword}
								style="margin-top:0;margin-bottom:0;"
							>
								<Icon src={Clipboard} />
							</button>
							<button
								class="btn btn-small"
								type="button"
								on:click={setRandom}
								style="margin-top:0;margin-bottom:0;margin-left:3px"
							>
								<Icon src={ArrowPathRoundedSquare} />
							</button>
						</div>
					</div>
				</div>
				<div class="flex-yxz">
					<div class="a03x">
						<label for="password"
							>PASSWORD
							<small>(minimum 8 characters by using alphabet, numerical and symbols).</small>
						</label>
						<input
							type="password"
							name="password"
							id="password"
							placeholder="Enter a strong password"
							on:change={addInput}
							required
						/>
					</div>
				</div>
				<div class="flex-yxz">
					<div class="a03x">
						<label for="re_password">PASSWORD AGAIN</label>
						<input
							type="password"
							name="re_password"
							id="re_password"
							placeholder="Re-type password here..."
							on:change={addInput}
							required
						/>
					</div>
				</div>
				{#if !admin}
					<div class="flex-yxz">
						<div class="a03x a03x-1">
							<label for="active"
								>SELECT USER COUNTRY <small>(select user living country name)</small></label
							>
						</div>
						<div class="a03x a03x-1">
							<select name="country" on:change={addInput}>
								<option value={''} disabled selected>Select your country</option>
								{#each countries as country}
									<option value={country.country}>{country.country} - {country.capital}</option>
								{/each}
							</select>
						</div>
					</div>

					<div class="flex-yxz">
						<div class="a03x a03x-1">
							<input
								type="checkbox"
								name="notifyme"
								id="notifyme"
								on:change={addInput}
								checked={userObject.notifyme}
							/>
							<label for="notifyme"
								>Notify Me <small>(send emails about arrivals and events).</small></label
							>
						</div>
						<div class="a03x a03x-1">
							<input
								type="checkbox"
								name="active"
								id="active"
								on:change={addInput}
								checked={userObject.active}
							/>
							<label for="active"
								>Active <small>(none-active user can not login to the website)</small></label
							>
						</div>
					</div>
				{:else}
					<div class="flex-yxz">
						<div class="a03x a03x-1">
							<input
								type="checkbox"
								name="active"
								id="active"
								on:change={addInput}
								checked={userObject.active}
							/>
							<label for="active"
								>Active <small>(none-active admin can't make any changes)</small></label
							>
						</div>
					</div>
				{/if}
				<input type="submit" value="ADD NEW USER" />
			</form>
		</div>
	</div>
</div>

<style lang="scss">
	.sup-a9ckq {
		margin-top: -17px;
		margin-left: 22px;
		font-size: 13px;
	}
	.form .flex-yxz {
		flex-wrap: nowrap;
	}
	.image-input .add-image {
		width: 150px;
		height: 150px;
		border-radius: 50%;
		padding: 2px;
		justify-content: center;
	}
</style>
