<script>
    import {accounts, message} from "../../lib/stores.js";
    import Countdown from "./Countdown.svelte";
    import {INVALID_SECRET_CODE_TEXT} from "../../lib/utils";

    export let id;
    export let issuer;
    export let accountName;
    export let code;


    let isCopied = false;

    async function copy() {
        if (!isValidSecret()) {
            return;
        }
        isCopied = true;
        setTimeout(() => {
            isCopied = false;
        }, 1500);
        await navigator.clipboard.writeText(code);
    }

    function formatCode(code) {
        let codeMiddle = (code.length / 2) + (code.length % 2);
        return code.slice(0, codeMiddle) + "-" + code.slice(codeMiddle);
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

    function computeText(isCopied, isValidSecret) {
        console.log('compute')
        if (isCopied) {
            return 'COPIED';
        }
        if (isValidSecret) {
            return formatCode(code)
        } else {
            return INVALID_SECRET_CODE_TEXT
        }
    }

    $: codeText = computeText(isCopied, isValidSecret())
</script>

<div class="account" on:click={copy} on:contextmenu={askDelete}>
    <div class="account__info">
        <div class="account__issuer">{issuer}</div>
        <div class="account__side">
            {#if isValidSecret() }
                <Countdown/>
            {/if}
        </div>
        <div class="account__account">
            <div class="account__account-text">
                {accountName}
            </div>
        </div>
        <div class="account__code">{codeText}</div>
    </div>
</div>

<style lang="scss">
    .account {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: start;
        align-items: start;
        margin: 5px 0;
        color: #000;
        font-size: 18px;
        padding: 16px;
        cursor: pointer;
        border: 1px solid #181818;
        border-radius: 12px;

        pointer-events: bounding-box;
        -webkit-user-select: none;

        &:nth-child(odd) {
            background-color: #E8A6FE;
        }

        &:nth-child(even) {
            background-color: #9E9BFF;
        }

        &__info {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
        }

        &__issuer {
            font-weight: 500;
            font-size: 24px;
            line-height: 32px;
        }

        &__account {
            font-weight: 400;
            font-size: 18px;
            line-height: 28px;
            flex-grow: 1;
            width: 100%;
        }

        &__account-text {
            white-space: pre;
            overflow: hidden;
            width: 250px;
            text-overflow: ellipsis;
            height: 34px;
        }

        &__code {
            font-weight: 500;
            font-size: 36px;
            line-height: 40px;
        }

        &__side {
            margin-left: auto
        }
    }
</style>
