<script>
    import TopMenu from "../components/TopMenu.svelte";
    import PrimaryButton from "../components/PrimaryButton.svelte";
    import {goto, PAGE_ADD_MANUALLY, PAGE_IMPORT, PAGE_SCAN_QR} from "../lib/pages";
</script>

<div>
    <TopMenu title="Add Account"/>
    <PrimaryButton text="Scan QR Code" icon="qr" onClick={() => goto(PAGE_SCAN_QR)}/>
    <PrimaryButton text="Enter Manually" icon="cmd" onClick={() => goto(PAGE_ADD_MANUALLY)}/>
    <PrimaryButton text="Import" icon="upload" onClick={() => goto(PAGE_IMPORT)}/>
</div>
