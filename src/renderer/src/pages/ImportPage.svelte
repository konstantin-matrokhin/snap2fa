<script>
    import TopMenu from "../components/TopMenu.svelte";
    import PrimaryButton from "../components/PrimaryButton.svelte";
    import {goto, PAGE_SCREEN_READING} from "../lib/pages";
</script>

<div>
    <TopMenu title="Import"/>
    <PrimaryButton text="From Google" icon="qr" onClick={() => goto(PAGE_SCREEN_READING)}/>
</div>
