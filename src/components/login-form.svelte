<script lang="ts">
	import axios from 'axios';
	import { updateAdmin, updateMessages } from '../lib/store';
    import cookies from 'js-cookie'
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	let message: boolean | { message: string; variant: string } = false;
	$: message, updateMessages(message);
	const handleForm = async (form: any) => {
		const username = form.target['username'].value;
		const password = form.target['password'].value;
		if (username === '') {
			message = { message: 'Enter your username or email address!', variant: 'danger' };
			return 0;
		}
		if (password === '') {
			message = { message: 'Enter your password!', variant: 'danger' };
			return 0;
		}
		await axios
			.post('/api/get-items/', { adminLogin: 1, username, password })
			.then((e) => {
                const res = e.data
                if(res.status){
                    message = {message: 'Successfully logged!', variant: 'success'}
                    cookies.set('admin', JSON.stringify(res.admin), {expires:1, path:'/'})
                    delete res.admin.jwt
                    updateAdmin(res.admin)
                    goto(`/${$page.url.searchParams.get('redirect') ?? ''}`)
                }else{
                    message = {message: res.message, variant: 'danger'}
                }
			})
			.catch((e) => {
				console.error('Error: ', e);
				message = { message: `Error: ${e.message}`, variant: 'danger' };
			});
	};
</script>
<div class="form-modal">
	<div class="in-modal">
		<div class="form">
			<form on:submit|preventDefault={handleForm} autoComplete="on">
				<h2>ADMIN LOGIN</h2>
				<p>
					Your login session is open when your browser is open. when you closed the browser the user
					session will be automatically logout.
				</p>
				<div class="flex-yxz">
					<div class="a03x full-w">
						<label for="username">Enter your username or email address</label>
						<input
							type="text"
							id="username"
							name="username"
							placeholder="username or email address."
						/>
					</div>
				</div>
				<div class="flex-yxz">
					<div class="a03x full-w">
						<label for="password">Enter your password</label>
						<input type="password" name="password" id="password" placeholder="Enter password" />
					</div>
				</div>
				<div class="flex" style="flex-direction: column;">
					<input type="submit" class="login-btn" value="Sign In" />
                    {#if typeof message === 'object' && message !== null}
                        <span class="message {message.variant ? message.variant : 'success'}"
                            >{message.message}</span
                        >
                    {/if}
				</div>
			</form>
		</div>
	</div>
</div>

<style lang="scss">
	.form-modal {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 20px auto;
		color: var(--primary-color);
		& .in-modal {
			max-width: 600px;
			background: var(--modal-bg-2);
			border-radius: 8px;
			padding: 8px;
			border: 1px solid var(--light-color-border);
			box-shadow: 2px 2px 20px 1px #00000040;
			& .login-btn {
				margin: 30px auto 10px auto;
			}
		}
	}
</style>
