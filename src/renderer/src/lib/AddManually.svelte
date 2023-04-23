<script>
    import {manualFormOpened} from "../stores";

    function onClick() {
        manualFormOpened.set(!$manualFormOpened);
    }
</script>

<button on:click={onClick}>Enter manually</button>
