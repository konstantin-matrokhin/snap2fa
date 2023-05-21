<script>
    import {accounts} from "./lib/stores.js";
    import {onMount} from "svelte";
    import {getRandomNumber} from "./lib/utils";
    import {page} from "./lib/stores";
    import MainPage from "./MainPage.svelte";
    import AddPage from "./AddPage.svelte";
    import {PAGE_ADD, PAGE_MAIN, PAGE_SCAN_QR} from "./lib/pages";

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

<div>
    <div class="title-bar"></div>
    {#if $page === PAGE_MAIN}
        <MainPage/>
    {:else if $page === PAGE_ADD}
        <AddPage/>
    {:else if $page === PAGE_SCAN_QR}
        <AddPage/>
    {/if}
</div>


<style>
    .title-bar {
        -webkit-app-select: none;
        -webkit-app-region: drag;
        width: 100%;
        height: 25px;
    }
</style>
