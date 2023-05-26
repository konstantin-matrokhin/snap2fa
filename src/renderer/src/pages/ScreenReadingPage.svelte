<script>
    import TopMenu from "../components/TopMenu.svelte";
    import PrimaryButton from "../components/PrimaryButton.svelte";
    import {onMount} from "svelte";
    import * as pages from "../lib/pages";
    import {PAGE_MAIN, PAGE_SCAN_QR} from "../lib/pages";

    const ipcRenderer = window.electron.ipcRenderer;

    let done = false;

    function readScreen() {
        ipcRenderer.send('qr:open', {});
    }

    function gotoMain() {
        pages.goto(PAGE_MAIN);
    }

    onMount(() => {
        readScreen();
        ipcRenderer.on('qr:parsed', () => {
            done = true;
            setTimeout(gotoMain, 3000);
        });
    });
</script>

<div>
    <TopMenu/>
    {#if !done}
        <h2>Scanning...</h2>
        <p>Point a new window to hover over the QR Code</p>
        <PrimaryButton text="Cancel" onClick={gotoMain}/>
    {:else}
        <h2>Account Added</h2>
    {/if}
</div>
