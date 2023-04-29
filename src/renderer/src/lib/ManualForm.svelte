<script>
    import {accounts, manualFormOpened, message} from "../stores";
    import {getRandomNumber, validateSecret} from "../utils";

    let issuer = '';
    let account = '';
    let secret = '';

    function addAccount() {
        const error = validateForm();
        if (error) {
            message.show(error);
        } else {
            accounts.add(getRandomNumber(100, 999), {issuer, account, secret});
            manualFormOpened.set(false);
        }
    }

    function validateForm() {
        if (issuer.trim().length === 0) {
            return 'Issuer cannot be empty';
        }
        if (account.trim().length === 0) {
            return 'Account cannot be empty';
        }
        if (secret.trim().length === 0 || !validateSecret(secret)) {
            return 'Invalid secret';
        }
    }

    function clearForm() {
        issuer = '';
        account = '';
        secret = '';
    }
</script>

<form method="POST" on:submit|preventDefault={addAccount}>
    <input type="text" placeholder="Issuer" bind:value={issuer} />
    <input type="text" placeholder="Account name" bind:value={account} />
    <input type="text" placeholder="Secret" bind:value={secret} />
    <button type="submit">Add account</button>
</form>
