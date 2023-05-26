<script>
    import Code from "./code/Code.svelte";
    import {accounts, codes} from "../lib/stores.js";
</script>

<div class="code-list">
    {#each Array.from($accounts) as [id, account]}
        <Code id={id} issuer={account.issuer} accountName={account.account} code={$codes.get(id)}/>
    {/each}
    {#if $accounts.size > 4}
        <div class="code-list__end">That is all. You don’t have any more connected accounts.</div>
    {/if}
</div>

<style lang="scss">
    .code-list {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: start;
        align-items: stretch;
        height: 100%;
        overflow-y: auto;
        padding: 7px 20px;

        &__end {
            font-weight: 400;
            font-size: 16px;
            line-height: 24px;
            text-align: center;
            color: #5D5D5D;
            margin-bottom: 30px;
            margin-top: 16px;
        }
    }
</style>
