<script>
    import {manualFormOpened} from "../lib/stores";

    function onClick() {
        manualFormOpened.set(!$manualFormOpened);
    }
</script>

<button on:click={onClick}>Enter manually</button>
