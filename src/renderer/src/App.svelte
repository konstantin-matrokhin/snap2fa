<script>
    import {accounts} from "./lib/stores.js";
    import {onMount} from "svelte";
    import {getRandomNumber} from "./lib/utils";
    import {message, page} from "./lib/stores";
    import {defaultPage, pageMapping} from "./lib/pages";
    import Message from "./components/Message.svelte";

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

    function computePageComponent(page) {
        return pageMapping.get(page) ?? defaultPage();
    }

    onMount(() => {
        accounts.loadAccounts();
    });

    $: pageComponent = computePageComponent($page)
</script>

<div>
    <div class="title-bar"></div>
    <svelte:component this={pageComponent}/>
    {#if $message}
        <Message/>
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
