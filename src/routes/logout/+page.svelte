<script lang="ts">
	import cookies from 'js-cookie';
	import { goto } from '$app/navigation';
	import { updateAdmin, adminSession } from '$lib/store';
	import { onMount } from 'svelte';
	const handleForm = () => {
		cookies.remove('admin');
		updateAdmin(false);
		goto('/login');
	};
	onMount(() => {
		if (!$adminSession) goto('/login');
	});
</script>

<div class="form-modal">
	<div class="in-modal" style="margin-bottom: 60px;">
		<div class="form">
			<form on:submit|preventDefault={handleForm} autoComplete="on">
				<h2 style="text-align:center;">ADMIN LOGOUT</h2>
				<p style="text-align:center;">
					Would you like to log out of this session? Please click the 'Logout' button to sign out.
					Rest assured, your security is our priority, and your password will never be shown to
					anyone.
				</p>
				<div class="flex" style="flex-direction: column;">
					<input type="submit" class="login-btn" value="Logout" />
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
