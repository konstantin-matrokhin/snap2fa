<script>
    const ipcRenderer = window.electron.ipcRenderer;

    function onClick() {
        ipcRenderer.send('qr:open', {});
    }
</script>

<button on:click={onClick}>Scan QR from camera</button>
