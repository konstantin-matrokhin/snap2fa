<script>
    import ImportAccounts from "./components/ImportAccounts.svelte";
    import ExportAccounts from "./components/ExportAccounts.svelte";
    import AddFromCamera from "./components/AddFromCamera.svelte";
    import CameraScan from "./components/CameraScan.svelte";
    import {cameraScanIsOpened, uglyMenuIsShown} from "./lib/stores";
    import AddFromImage from "./components/AddFromImage.svelte";
    import AddManually from "./components/AddManually.svelte";
    import ManualForm from "./components/ManualForm.svelte";
    import Codes from './components/Codes.svelte'
    import AddAccountButton from "./components/AddFromDesktop.svelte";
    import {manualFormOpened} from "./lib/stores.js";
    import TopMenu from "./TopMenu.svelte";
</script>

<main class="container">
    <TopMenu/>
    {#if $uglyMenuIsShown}
        <div class="group">
            <AddAccountButton/>
            <AddFromCamera/>
            <AddManually/>
            <AddFromImage/>
        </div>
        <div class="group">
            <ImportAccounts/>
            <ExportAccounts/>
        </div>
    {/if}
    {#if $manualFormOpened}
        <ManualForm/>
    {/if}
    {#if $cameraScanIsOpened}
        <CameraScan/>
    {/if}
    <Codes/>
</main>

<style>
    .group {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-evenly;
        align-content: center;
    }
</style>
