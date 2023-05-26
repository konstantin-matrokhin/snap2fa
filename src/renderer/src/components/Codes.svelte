<script>
    import Code from "./code/Code.svelte";
    import {accounts, codes} from "../lib/stores.js";
</script>

<div class="code-list">
    {#each Array.from($accounts) as [id, account]}
        <Code id={id} issuer={account.issuer} accountName={account.account} code={$codes.get(id)}/>
    {/each}
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
    }
</style>
