import {contextBridge} from 'electron'
import {electronAPI} from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld('api', api)
    } catch (error) {
        console.error(error)
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI
    // @ts-ignore (define in dts)
    window.api = api
}

// const {ipcRenderer} = require('electron')

// ipcRenderer.on('SET_SOURCE', async (_event, sourceId) => {
//     try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//             audio: false,
//             video: {
//                 mandatory: {
//                     chromeMediaSource: 'desktop',
//                     chromeMediaSourceId: sourceId,
//                 }
//             }
//         })
//         handleStream(stream)
//     } catch (e) {
//         handleError(e)
//     }
// })
//
// function handleStream(stream) {
//     const video = document.querySelector('video')
//     video.srcObject = stream
//     video.onloadedmetadata = (e) => video.play()
// }
//
// function handleError(e) {
//     console.log(e)
// }
