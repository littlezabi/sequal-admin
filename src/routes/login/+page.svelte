<script lang='ts'>
    import LoginForm from '$compo/login-form.svelte'
</script>
<div class="login-form">
    <h2>ADMIN SIGN-IN</h2>
    <LoginForm/>
</div>
<style lang="scss">
    h2{
        color: var(--primary-color);
    }
    .login-form{
        display: block;
        margin: 10px auto 80px auto;
    }
</style>
