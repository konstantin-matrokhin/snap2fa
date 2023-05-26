<script>
    import {BrowserQRCodeReader} from "@zxing/browser";
    import {onDestroy, onMount} from "svelte";

    const ipcRenderer = window.electron.ipcRenderer;

    let video;
    let videoDevices = [];
    let videoStream;
    let isScanning = false;

    async function init() {
        let devices = await navigator.mediaDevices.enumerateDevices();
        for (let i = 0; i < devices.length; i++) {
            const device = devices[i];
            if (device.kind === "videoinput") {
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
                video.srcObject = null;
                ipcRenderer.send('qr:read', result);
            }
        });
    }

    onMount(init);

    onDestroy(() => {
        videoStream.getVideoTracks().forEach(track => {
            track.stop();
        })
    });
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
