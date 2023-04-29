<script>
    import Codes from './lib/Codes.svelte'
    import AddAccountButton from "./lib/AddFromDesktop.svelte";
    import {accounts, manualFormOpened} from "./stores.js";
    import {onMount} from "svelte";
    import AddFromDesktop from "./lib/AddFromDesktop.svelte";
    import AddManually from "./lib/AddManually.svelte";
    import ManualForm from "./lib/ManualForm.svelte";
    import {getRandomNumber} from "./utils";
    import ImportAccounts from "./lib/ImportAccounts.svelte";
    import ExportAccounts from "./lib/ExportAccounts.svelte";

    onMount(() => {
        accounts.loadAccounts();
    })

    const ipcRenderer = window.electron.ipcRenderer;

    ipcRenderer.on('qr:parsed', (event, payload) => {
        const parsedAccounts = JSON.parse(payload);
        console.log(parsedAccounts)
        const maximum = 999;
        const minimum = 100;

        const randomNumber = getRandomNumber(minimum, maximum);
        for (let i = 0; i < parsedAccounts.length; i++) {
            const {issuer, account, secret} = parsedAccounts[i];
            accounts.add(randomNumber + i, {issuer, account, secret});
        }
    })
</script>

<main class="container">
    <div class="group">
        <AddAccountButton/>
        <AddFromDesktop/>
        <AddManually/>
    </div>
    <div class="group">
        <ImportAccounts/>
        <ExportAccounts/>
    </div>
    {#if $manualFormOpened}
        <ManualForm/>
    {/if}
    <Codes/>
</main>

<style>
    .container {
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-content: start;
    }

    .group {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-evenly;
        align-content: center;
    }
</style>
