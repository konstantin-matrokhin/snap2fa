<script>
    const ipcRenderer = window.electron.ipcRenderer;

    function onClick() {
        ipcRenderer.send('qr:read-file', {});
    }
</script>

<main class="container">
    <button on:click={onClick}>Scan from image</button>
</main>
