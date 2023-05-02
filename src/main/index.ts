import {app, BrowserWindow, desktopCapturer, ipcMain, shell} from 'electron'
import {electronApp, optimizer} from '@electron-toolkit/utils'
import {AppWindows} from './AppWindows'
import {QRHandler} from "./QRHandler";

const appWindows = new AppWindows()
const qrHandler = new QRHandler();

let mainWindow
let qrWindow

function initMainWindow(): BrowserWindow | undefined {
    if (mainWindow) {
        return;
    }
    mainWindow = appWindows.createMainWindow()
    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
        mainWindow.webContents.openDevTools()
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })

    return mainWindow;
}

function initQRWindow(): BrowserWindow | undefined {
    if (qrWindow) {
        return;
    }
    qrWindow = appWindows.createQRReaderWindow();
    qrWindow.on('ready-to-show', () => {
        qrWindow.show()
        qrWindow.webContents.send('window:position', getPosition())
    })

    qrWindow.on('closed', () => {
        qrWindow = null
    })

    qrWindow.on('close', () => {
        qrWindow = null
    })

    qrWindow.on('move', () => {
        qrWindow.webContents.send('window:position', getPosition())
    })

    function getPosition() {
        return {
            x: qrWindow.getPosition()[0],
            y: qrWindow.getPosition()[1],
            width: qrWindow.getSize()[0],
            height: qrWindow.getSize()[1]
        }
    }

    return qrWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    initMainWindow();

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            initMainWindow();
        }
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// default format:
// otpauth://totp/accountName?secret=secretCode&issuer=issuerName
// google auth format: otpauth-migration://offline?data=...protobufMessage

ipcMain.on('qr:open', () => {
    initQRWindow();
})

ipcMain.on('recorder:init', () => {
    desktopCapturer
        .getSources({
            types: ['screen']
        })
        .then((sources) => {
            if (qrWindow) {
                qrWindow.webContents.send('recorder:sources', sources)
            }
        })
})
ipcMain.on('qr:read', async (_event, payload) => {
    qrWindow?.close();
    try {
        const totpData = await qrHandler.parseQRContent(payload.text)
        const jsonData = JSON.stringify(totpData)
        mainWindow.webContents.send('qr:parsed', jsonData)
    } catch (error) {
        console.error(error)
    }
})
