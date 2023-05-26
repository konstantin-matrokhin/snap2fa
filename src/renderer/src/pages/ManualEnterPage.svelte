<script>
    import {accounts, message} from "../lib/stores";
    import {getRandomNumber, validateSecret} from "../lib/utils";
    import TopMenu from "../components/TopMenu.svelte";
    import PrimaryButton from "../components/PrimaryButton.svelte";
    import {goto, PAGE_MAIN} from "../lib/pages";
    import CancelButton from "../components/CancelButton.svelte";

    let issuer = '';
    let account = '';
    let secret = '';

    function addAccount() {
        const error = validateForm();
        if (error) {
            message.show(error);
        } else {
            accounts.add(getRandomNumber(100, 999), {issuer, account, secret});
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
</script>

<main class="container">
    <TopMenu title="Add Manually"/>
    <form method="POST" on:submit|preventDefault={addAccount} class="form">
        <label class="input-group">
            Issuer
            <input class="input-field" type="text" placeholder="ex. Google" bind:value={issuer}>
        </label>
        <label class="input-group">
            Account
            <input class="input-field" type="text" placeholder="ex. Email or Username" bind:value={account}>
        </label>
        <label class="input-group">
            Secret code
            <input class="input-field" type="text" placeholder="Secret code" bind:value={secret}>
        </label>
        <button on:click={addAccount}>Add</button>
    </form>
    <CancelButton text="Cancel" onClick={() => goto(PAGE_MAIN)} />
</main>

<style lang="scss">
    .form {
        margin: 0 20px;
        display: flex;
        flex-direction: column;
    }

    .input-group {
        margin-bottom: 16px;
        display: flex;
        flex-direction: column;
        font-size: 14px;
        line-height: 20px;
        color: #F3F3F3;
    }

    .input-field {
        padding: 9px 13px;
        height: 38px;
        background: #454545;
        border-radius: 6px;
        border: none;

        &::placeholder {
            font-size: 14px;
            line-height: 20px;
            color: #C5C5C5;
        }
    }
</style>
