<script>
    import Searchbar from "./Searchbar.svelte";
    import PlusButton from "./PlusButton.svelte";
    import SettingsButton from "./SettingsButton.svelte";
    import {page} from "../lib/stores";
    import {defaultPageName} from "../lib/pages";

    export let title = '';
</script>

<div class="top-menu">
    {#if $page === defaultPageName()}
        <Searchbar/>
    {:else}
        <h1 class="title">{title}</h1>
    {/if}
    <SettingsButton/>
    <PlusButton isCloseButton={$page !== defaultPageName()}/>
</div>

<style>
    .top-menu {
        padding: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .title {
        font-size: 24px;
        line-height: 32px;
        color: #F3F3F3;
        flex-grow: 1;
    }
</style>
