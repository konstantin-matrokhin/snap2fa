<script>
    import {accounts, message} from "../../lib/stores.js";
    import Countdown from "./Countdown.svelte";
    import {INVALID_SECRET_CODE_TEXT} from "../../lib/utils";

    export let id;
    export let issuer;
    export let accountName;
    export let code;

    async function copy() {
        if (!isValidSecret()) {
            return;
        }
        await navigator.clipboard.writeText(code);
        message.show("Copied!");
    }

    function formatCode(code) {
        let codeMiddle = (code.length / 2) + (code.length % 2);
        return code.slice(0, codeMiddle) + " " + code.slice(codeMiddle);
    }

    function isValidSecret() {
        return code !== INVALID_SECRET_CODE_TEXT;
    }

    function askDelete() {
        const text = "Are you sure you want to delete this account?";
        if (confirm(text)) {
            accounts.remove(id);
        }
    }
</script>

<div class="account" on:click={copy} on:contextmenu={askDelete}>
    <div class="account__info">
        <div class="account__issuer">{issuer}</div>
        <div class="account__account">{accountName}</div>
        <div class="account__value">{isValidSecret() ? formatCode(code) : INVALID_SECRET_CODE_TEXT}</div>
    </div>
    <div class="account__side">
        {#if isValidSecret() }
            <Countdown/>
        {/if}
    </div>
</div>

<style lang="scss">
    .account {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: start;
        align-items: start;
        margin: 5px 0;
        color: #f6f6f6;
        background-color: lightslategray;
        font-size: 18px;
        padding: 5px;
        cursor: pointer;
        pointer-events: bounding-box;
        -webkit-user-select: none;

        &__info {
            display: flex;
            flex-direction: column;
            flex-wrap: nowrap;
        }

        &__side {
            margin-left: auto;
        }
    }
</style>
