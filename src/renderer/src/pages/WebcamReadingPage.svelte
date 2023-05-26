<script>
    import TopMenu from "../components/TopMenu.svelte";
    import {goto, PAGE_MAIN} from "../lib/pages";
    import CancelButton from "../components/CancelButton.svelte";
    import CameraScan from "../components/CameraScan.svelte";
</script>

<main class="container">
    <TopMenu title="Scan QR Code"/>
    <CameraScan/>
    <CancelButton text="Cancel" onClick={() => goto(PAGE_MAIN)} />
</main>
