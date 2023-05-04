<script>
    import {BrowserQRCodeReader} from "@zxing/browser";
    import {cameraScanIsOpened} from "../lib/stores";

    const ipcRenderer = window.electron.ipcRenderer;

    let video;
    let videoDevices = [];
    let videoStream;
    let isScanning = false;

    async function init() {
        // ipcRenderer.send('qr:open', {});
        let devices = await navigator.mediaDevices.enumerateDevices();
        for (let index = 0; index < devices.length; index++) {
            const device = devices[index];
            if (device.kind === "videoinput") {
                //Add the video device because it is a videoDevice. Manually create a new object with device details instead of passing device.
                videoDevices = [...videoDevices, {
                    deviceId: device.deviceId,
                    kind: device.kind,
                    label: device.label,
                }];
            }
        }
    }

    async function useDevice(deviceId) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
                deviceId
            }
        });
        video.srcObject = mediaStream;
        videoStream = mediaStream;
        isScanning = true;
        scanQR(videoStream);
    }

    function scanQR(stream) {
        const codeReader = new BrowserQRCodeReader();
        codeReader.decodeFromStream(stream, video, result => {
            if (result) {
                cameraScanIsOpened.set(false);
                video.srcObject = null;
                ipcRenderer.send('qr:read', result);
            }
        });
    }

    init();
</script>

{#each videoDevices as device }
    <button on:click={() => useDevice(device.deviceId)}>{device.label}</button>
{/each}
<video class="video" bind:this={video}></video>

<style>
    .video {
        border: 1px solid red;
        width: 100%;
        height: 200px;
    }
</style>
