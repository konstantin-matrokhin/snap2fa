<script>
    import Codes from './components/Codes.svelte'
    import AddAccountButton from "./components/AddFromDesktop.svelte";
    import {accounts, manualFormOpened} from "./lib/stores.js";
    import {onMount} from "svelte";
    import AddFromDesktop from "./components/AddFromDesktop.svelte";
    import AddManually from "./components/AddManually.svelte";
    import ManualForm from "./components/ManualForm.svelte";
    import {getRandomNumber} from "./lib/utils";
    import ImportAccounts from "./components/ImportAccounts.svelte";
    import ExportAccounts from "./components/ExportAccounts.svelte";

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
        width: 100vw;
        height: 100vh;
    }

    .group {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-evenly;
        align-content: center;
    }
</style>
