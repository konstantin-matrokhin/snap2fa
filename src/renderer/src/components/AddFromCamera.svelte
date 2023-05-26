<script>
    import {cameraScanIsOpened} from "../lib/stores";

    function onClick() {
        cameraScanIsOpened.set(!$cameraScanIsOpened);
    }
</script>

<button on:click={onClick}>Scan QR from camera</button>
