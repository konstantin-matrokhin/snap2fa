<script>
    import TopMenu from "../components/TopMenu.svelte";
    import PrimaryButton from "../components/PrimaryButton.svelte";
    import {onMount} from "svelte";
    import * as pages from "../lib/pages";
    import {PAGE_MAIN, PAGE_SCAN_QR} from "../lib/pages";

    const ipcRenderer = window.electron.ipcRenderer;

    function readScreen() {
        ipcRenderer.send('qr:open', {});
    }

    function gotoMain() {
        pages.goto(PAGE_MAIN);
    }

    onMount(readScreen);
</script>

<div>
    <TopMenu/>
    <h2>Scanning...</h2>
    <p>Point a new window to hover over the QR Code</p>
    <PrimaryButton text="Cancel" onClick={gotoMain}/>
</div>
