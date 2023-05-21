<script>
    import TopMenu from "./TopMenu.svelte";
    import PrimaryButton from "./components/PrimaryButton.svelte";
</script>

<div>
    <TopMenu/>
    <PrimaryButton text="Scan QR Code" icon="qr"/>
    <PrimaryButton text="Enter Manually" icon="cmd"/>
    <PrimaryButton text="Import" icon="upload"/>
</div>
