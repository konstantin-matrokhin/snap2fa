<script>
    import {cameraScanIsOpened} from "../lib/stores";

    const ipcRenderer = window.electron.ipcRenderer;

    function onClick() {
        cameraScanIsOpened.set(!$cameraScanIsOpened);
    }
</script>

<button on:click={onClick}>Scan QR from camera</button>
