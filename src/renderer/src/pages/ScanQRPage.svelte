<script>
    import TopMenu from "../components/TopMenu.svelte";
    import PrimaryButton from "../components/PrimaryButton.svelte";
    import {goto, PAGE_IMAGE_UPLOADING, PAGE_SCREEN_READING, PAGE_WEBCAM} from "../lib/pages";
</script>

<div>
    <TopMenu title="Scan QR Code"/>
    <PrimaryButton text="With Screen" icon="qr" onClick={() => goto(PAGE_SCREEN_READING)}/>
    <PrimaryButton text="With Camera" icon="cmd" onClick={() => goto(PAGE_WEBCAM)}/>
    <PrimaryButton text="With Image" icon="upload" onClick={() => goto(PAGE_IMAGE_UPLOADING)}/>
</div>
