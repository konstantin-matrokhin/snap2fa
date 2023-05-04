<script>
    import {BrowserQRCodeReader} from "@zxing/browser";
    import {onMount} from "svelte";

    let windowX;
    let windowY;
    let windowWidth;
    let windowHeight;

    const ipcRenderer = window.electron.ipcRenderer;

    async function recordScreen() {
        ipcRenderer.send('recorder:init', {});
    }

    ipcRenderer.on('window:position', (event, payload) => {
        windowX = payload.x;
        windowY = payload.y;
        windowWidth = payload.width;
        windowHeight = payload.height;
    })

    ipcRenderer.on('recorder:sources', async (event, sources) => {
        const source = sources[0];
        console.log('recorder:sources', sources);

        const constraints = {
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: source.id,
                },
            }
        }

        navigator.mediaDevices.getUserMedia(constraints).then(stream => {
            scanQR(stream);
        });
    });

    function scanQR(stream) {
        const codeReader = new BrowserQRCodeReader();
        codeReader.decodeFromStream(stream, undefined, result => {
            console.log(result)
            if (result) {
                ipcRenderer.send('qr:read', result);
            }
        });
    }

    onMount(() => {
        recordScreen();
    });
</script>

<main class="container">
    11231312312
</main>

<style>
    .container {
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-content: start;
    }
</style>
