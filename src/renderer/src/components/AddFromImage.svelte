<script>
    const ipcRenderer = window.electron.ipcRenderer;

    function onClick() {
        ipcRenderer.send('qr:read-file', {});
    }
</script>

<button on:click={onClick}>Scan from image</button>
