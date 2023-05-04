import {app, desktopCapturer, ipcMain} from 'electron'
import {electronApp, optimizer} from '@electron-toolkit/utils'
import {QRHandler} from './QRHandler'
import {AppContainer} from "./AppContainer";

const qrHandler = new QRHandler();
const appContainer = new AppContainer();


app.on('before-quit', () => {
    appContainer.isQuitting = true;
})

app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('kz.kmatrokhin');

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    appContainer.initMainWindow();
})

app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
})

app.on('activate', () => {
    appContainer.mainWindow.show();
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

ipcMain.on('qr:open', () => {
    appContainer.initQrWindow();
})

ipcMain.on('recorder:init', () => {
    desktopCapturer
        .getSources({
            types: ['screen']
        })
        .then((sources) => {
            if (appContainer.qrWindow) {
                appContainer.qrWindow.webContents.send('recorder:sources', sources)
            }
        });
});

ipcMain.on('qr:read', async (_event, payload) => {
    appContainer.qrWindow?.close();
    try {
        const totpData = await qrHandler.parseQRContent(payload.text);
        const jsonData = JSON.stringify(totpData);
        appContainer.mainWindow.webContents.send('qr:parsed', jsonData);
    } catch (error) {
        console.error(error);
    }
})
