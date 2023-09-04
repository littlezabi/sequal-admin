<script lang="ts">
	import { modal, modalUpdate, static_data, updateMessages, updateStaticData } from '$lib/store';
	import {
		Icon,
		User,
		XMark,
		Clipboard,
		ArrowPathRoundedSquare,
		CheckBadge
	} from 'svelte-hero-icons';

	import Loading from './loading.svelte';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import { getRandomChar } from '$lib/globals';
	import { fade } from 'svelte/transition';
	import { PUBLIC_IMAGES_FETCH_URI } from '$env/static/public';
	let countries: any = [];
	let admin: any = false;
	let newImage = false;
	let message: { message: string | boolean; variant: string | null } | boolean = false;
	$: message, updateMessages(message);
	let userObject: any = {
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
	let changesHappened = false;
	if ($modal.user && $modal.user.email) {
		userObject = { ...userObject, ...$modal.user };
		if ($modal.user.username) {
			admin = { message: 'Create a unique username!', condition: -1 };
		}
	}
	document.querySelector('body')?.classList.add('modal-open');
	const handleClose = () => {
		if (changesHappened) location.href = `/users/${admin ? 'admins' : 'clients'}`;
		modalUpdate({ visible: false });
		document.querySelector('body')?.classList.remove('modal-open');
	};
	const handleImage = (file: any) => {
		const image = file.target.files[0];
		userObject.avatar = image;
		newImage = true;
		const reader = new FileReader();
		reader.onload = (e) => {
			const imageElement = document.querySelector('.add-image') as HTMLElement;
			if (imageElement)
				imageElement.innerHTML = `<img style="width: 100%;height: 100%;object-fit: cover;border-radius: 50%;" src="${e.target?.result}" alt="profile"/>`;
		};
		reader.readAsDataURL(image);
	};
	onMount(async () => {
		if ($static_data.countries.length > 0) {
			countries = $static_data.countries;
		} else {
			await axios
				.get('/api/get-items', { params: { getCountries: 1 } })
				.then((res) => {
					countries = res.data;
					updateStaticData({ countries: res.data });
				})
				.catch((e) => console.error(e));
		}
	});
	const handleForm = async (e: Event) => {
		if (userObject.email === '') {
			message = { message: 'Enter user email address.', variant: 'alert' };
		} else if (admin && userObject.username === '') {
			message = {
				message: "Enter admin username (don't use special chars).",
				variant: 'alert'
			};
		} else if (admin && /[^\w\s]/.test(userObject.username)) {
			{
				message = {
					message: 'in username special character found! please remove it',
					variant: 'danger'
				};
			}
		} else if (!admin && userObject.firstname === '') {
			message = { message: 'Enter user firstname.', variant: 'alert' };
		} else if (!admin && userObject.lastname === '')
			message = { message: 'Enter user lastname.', variant: 'alert' };
		else {
			if ($modal.action === 'edit' && passwordToggler) {
				if (userObject.password === '' || userObject.password !== userObject.re_password) {
					message = { message: 'Password not matched.', variant: 'alert' };
					return 0;
				}
			} else if ($modal.action === 'new') {
				if (userObject.password === '' && userObject.password !== userObject.re_password) {
					message = { message: 'Password not matched.', variant: 'alert' };
					return 0;
				}
			}
			sendPost();
		}
	};
	const sendPost = async () => {
		let form = new FormData();
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

		if (!newImage) delete userObject.avatar;
		if ($modal.action === 'edit') {
			form.append('_id', $modal.user._id);
			if (!passwordToggler) {
				delete userObject.password;
				delete userObject.re_password;
			}
			if ($modal.user.username !== userObject.username) {
				form.append('new_username', userObject.username);
			}
			if ($modal.user.email !== userObject.email) {
				form.append('new_email', userObject.email);
			}
		}

		Object.keys(userObject).map((e: string) => {
			form.append(e, userObject[e]);
		});
		form.append('profileWidth', $static_data.settings.UserProfilePictureWidth ?? 300);
		const headers:any = $modal.admin_key ? { admin_key: $modal.admin_key } : {}
		headers['requestFor'] = $modal.action === 'new' ? 'adduser-1' : 'updateUser-1'
		await axios
			.post($modal.action === 'new' ? '/api/set-items' : '/api/update-items', form, {headers})
			.then((e) => {
				let res = e.data;
				changesHappened = true;
				if (res.success) {
					if ($modal.action === 'edit') {
						message = {
							message: `User updated successfully!`,
							variant: 'success'
						};
					} else {
						message = {
							message: `New user as ${userObject.userType} is added successfully!`,
							variant: 'success'
						};
					}
					handleClose();
				} else {
					if (res.error === 'unauthenticated_user')
						updateMessages({ message: "user is Unauthenticated please login and try again!", variant: 'danger' });
					else updateMessages({ message: res.message, variant: 'alert' });
				}
			})
			.catch((e) => console.error(e));
	};
	const setRandom = () => {
		let q = document.getElementById('gen-random') as HTMLInputElement;
		if (q) q.value = getRandomChar(10, { symbols: true });
	};
	const copyPassword = () => {
		let q = document.getElementById('gen-random') as HTMLInputElement;
		q.select();
		const selection = document.getSelection();
		if (selection) navigator.clipboard.writeText(selection?.toString());
		message = { message: 'Text successfully copied to clipboard!', variant: 'success' };
	};
	const loading = false;
	let usernamePending = false;
	const F___x319 = () => (document.querySelector('#avatar') as HTMLElement)?.click();
	const addInput = (e: Event | any) =>
		(userObject[e.target?.name] =
			e.target?.name === 'notifyme' || e.target?.name === 'active'
				? e.target?.checked
				: e.target?.value);
	let userNameCheck: any = undefined;
	const handleUsername = async (e: Event) => {
		const value = (e.target as HTMLInputElement).value;
		if (/[^\w\s]/.test(value) || /\s/.test(value)) {
			message = {
				message: 'special character or space not allowed! please remove it',
				variant: 'danger'
			};
			return 0;
		} else {
			usernamePending = true;
			message = false;
			if (userNameCheck) clearTimeout(userNameCheck);
			userNameCheck = setTimeout(async () => {
				await axios
					.get('/api/get-items/', { params: { checkUsername: 1, username: value } })
					.then((res) => {
						usernamePending = false;
						if (res.data.exist) {
							admin = { message: 'username exist choose another!', condition: -1 };
						} else {
							admin = { message: 'Good!', condition: 1 };
							userObject.username = value;
						}
					})
					.catch((e) => console.error(e));
			}, 1000);
			return 1;
		}
	};
	let passwordToggler = false;
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
			<form autocomplete="off" on:submit|preventDefault={handleForm}>
				<div class="flex-yxz">
					<div class="a03x full-w image-input">
						<label for="avatar">USER PROFILE AVATAR</label>
						{#if loading}
							<Loading />
						{:else}
							<div class="add-image" on:mousedown={F___x319}>
								{#if typeof userObject.avatar === 'string' && userObject.avatar && userObject.avatar !== ''}
									<img
										style="width: 100%;height: 100%;object-fit: cover;border-radius: 50%;"
										src={userObject.avatar.includes('http')
											? userObject.avatar
											: PUBLIC_IMAGES_FETCH_URI + 'images/users/' + userObject.avatar}
										alt="profile"
									/>
								{:else}
									<Icon src={User} style="height: auto;" />
									<span>add profile image</span>
								{/if}
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
				{#if $modal.action !== 'edit'}
					<div class="flex-yxz sup-a9ckq">
						<div class="a03x a03x-1">
							<input
								type="radio"
								checked={admin ? false : true}
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
								checked={admin ? true : false}
								on:change={() => (admin = { message: 'Enter a unique name', condition: 0 })}
								name="userType"
								id="userType_admin"
								value="userType_admin"
							/>
							<label style="cursor:pointer" for="userType_admin">NEW ADMIN</label>
						</div>
					</div>
				{/if}
				{#if admin}
					<div class="flex-yxz">
						<div class="a03x full-w">
							<label for="username"
								>{$modal.action === 'edit' ? 'CHANGE' : ''} USERNAME
								<small> (Don't use special characters and spaces) </small></label
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
						{#if admin}
							{#if usernamePending}
								<Loading type="spinner" />
							{:else}
								<span
									style="display:flex; align-items:center;"
									class="alert-inline {admin.condition === 1 ? 'success' : 'error'}"
									id="username-alert"
								>
									{admin.message}
									{#if admin.condition === 1}
										<Icon src={CheckBadge} style="color: lightgreen; margin-left: 8px;" />
									{/if}
								</span>
							{/if}
						{/if}
					</div>
				{:else}
					<div class="flex-yxz">
						<div class="a03x">
							<label for="firstname"
								>{$modal.action === 'edit' ? 'CHANGE' : ''} USER FIRST NAME</label
							>
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
							<label for="lastname">{$modal.action === 'edit' ? 'CHANGE' : ''} USER LAST NAME</label
							>
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
						<label for="email">{$modal.action === 'edit' ? 'CHANGE' : ''} USER EMAIL ADDRESS</label>
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
				{#if $modal.action === 'new'}
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
									value={getRandomChar(10, { symbols: true })}
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
								>{$modal.action === 'edit' ? 'CHANGE' : ''} PASSWORD
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
				{:else}
					<div class="flex" style="margin: 10px 0">
						<span>CHANGE USER PASSWORD</span>
						<button
							type="button"
							class="btn-stylish {passwordToggler ? 'active' : ''}"
							id="btn-8ck3lx"
							on:click={() => (passwordToggler = !passwordToggler)}
						>
							<div />
						</button>
					</div>
					{#if passwordToggler}
						<div transition:fade>
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
											value={getRandomChar(10, { symbols: true })}
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
										>{$modal.action === 'edit' ? 'CHANGE' : ''} PASSWORD
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
						</div>
					{/if}
				{/if}
				{#if !admin}
					<div class="flex-yxz">
						<div class="a03x a03x-1">
							<label for="active"
								>{$modal.action === 'edit' ? 'CHANGE' : ''} USER COUNTRY
								<small>(select user living country name)</small></label
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
				{#if typeof message === 'object' && message !== null}
					<span class="message {message.variant ? message.variant : 'success'}"
						>{message.message}</span
					>
				{/if}
			</form>
		</div>
	</div>
</div>

<style lang="scss">
	.alert-inline {
		display: block;
		width: 222px;
		font-size: 13px;
		&.success {
			color: rgb(var(--color-success));
		}
		&.error {
			color: rgb(var(--color-danger));
		}
	}
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
