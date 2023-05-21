<script>
    import Searchbar from "./components/Searchbar.svelte";
    import AddButton from "./components/AddButton.svelte";
    import SettingsButton from "./components/SettingsButton.svelte";
</script>

<div class="top-menu">
    <Searchbar/>
    <SettingsButton/>
    <AddButton/>
</div>

<style>
    .top-menu {
        padding: 20px;

        display: flex;
        flex-direction: row;
        align-items: center;
    }
</style>
