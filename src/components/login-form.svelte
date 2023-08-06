<script lang="ts">
    import axios from 'axios';
    import {updateMessages} from '../lib/store'
    const handleForm = async (form:any) => {
        const username = form.target['username'].value;
        const password = form.target['password'].value;
        if(username === ''){
            updateMessages({message: 'Enter your username or email address!', variant: 'danger'})
            return 0
        }
        if(password === '') {
            updateMessages({message: "Enter your password!", variant: 'danger'})
            return 0
        }
        await axios.post('/api/get-items/', {adminLogin: 1, username, password})
        .then(res => {
            console.log('response: ', res.data)
        })
        .catch(e => {
            console.error('Error: ', e)
            updateMessages({message: `Error: ${e.message}`, variant: 'danger'})
        })
    }
</script>

<div class="form-modal">
    <div class="in-modal">
        <div class="form">
            <form 
                on:submit|preventDefault={handleForm}
                autoComplete="on"
            > 
                <h2>ADMIN LOGIN</h2>
                <p>Your login session is open when your browser is open. when you closed the browser the user session will be automatically logout.
                    <div class="flex-yxz">
                        <div class="a03x full-w">
                            <label for="username">Enter your username or password</label>
                            <input type="text" id="username" name="username" placeholder="Enter your username\email here."/>
                        </div>
                    </div>
                    <div class="flex-yxz">
                        <div class="a03x full-w">
                            <label for="password">Enter your password</label>
                            <input type="password" name="password" id="password" placeholder="Enter password"/>
                        </div>
                    </div>
                    <div class='flex'>
                        <input type="submit" class="login-btn" value="Loing"/>
                    </div>
                </form>
    </div>
    </div>
</div>

<style lang="scss">
    .form-modal{
        display:flex;
        align-items:center;
        justify-content:center;
        margin: 20px auto;
        color: var(--primary-color);
        & .in-modal{
            max-width: 600px;
            background: var(--modal-bg-2);
            border-radius: 8px;
            padding: 8px;
            border: 1px solid var(--light-color-border);
            box-shadow: 2px 2px 20px 1px #00000040;
            & .login-btn{ margin: 30px auto 10px auto;} 
        }
    }
</style>
