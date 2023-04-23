<script>
    import {BrowserQRCodeReader} from "@zxing/browser";

    let video;

    const ipcRenderer = window.electron.ipcRenderer;

    async function recordScreen() {
        ipcRenderer.send('recorder:init', {});
    }

    function scanQR() {
        // let scanner = new Instascan.Scanner({ video });
        // scanner.addListener('scan', function (content) {
        //     console.log(content);
        // });
        // Instascan.Camera.getCameras().then(function (cameras) {
        //     if (cameras.length > 0) {
        //         scanner.start(cameras[0]);
        //     } else {
        //         console.error('No cameras found.');
        //     }
        // }).catch(function (e) {
        //     console.error(e);
        // });
    }

    ipcRenderer.on('recorder:sources', async (event, sources) => {
        const codeReader = new BrowserQRCodeReader();
        const source = sources[0];
        const constraints = {
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: source.id,
                    region: {
                        left: {exact: 100},
                        top: {exact: 100},
                        right: {exact: 740},
                        bottom: {exact: 580},
                    }
                },
            }
        }

        navigator.mediaDevices.getUserMedia(constraints).then(stream => {
            video.srcObject = stream;
            video.play();
            codeReader.decodeFromStream(stream, video, code => {
                console.log(code);
            })
        }).catch(error => {
            console.log('error', error);
        });
    });
</script>

<main class="container">
    <button on:click={recordScreen}>Scan!</button>
    <video class="video" width="300" height="300" bind:this={video} autoplay></video>
</main>

<style>
    .video {
        border: 1px solid red;
    }

    .container {
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-content: start;
    }
</style>
