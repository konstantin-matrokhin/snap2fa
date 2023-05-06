import {app, desktopCapturer, dialog, ipcMain, Menu, Tray} from 'electron'
import {electronApp, optimizer} from '@electron-toolkit/utils'
import {QRHandler} from './QRHandler'
import {AppContainer} from "./AppContainer";
import {join} from "path";

const qrHandler = new QRHandler();
const appContainer = new AppContainer();


app.on('before-quit', () => {
    appContainer.isQuitting = true;
})

app.whenReady().then(() => {
    setMainMenu();
    electronApp.setAppUserModelId('kz.kmatrokhin');

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
    sendScreenRecordingSources();
});

ipcMain.on('qr:read', async (_event, payload) => {
    handleQRIsRead(payload.text);
})

ipcMain.on('qr:read-file', async () => {
    parseSelectedImageFiles();
});

function sendScreenRecordingSources() {
    desktopCapturer
        .getSources({
            types: ['screen']
        })
        .then((sources) => {
            appContainer.qrWindow?.webContents.send('recorder:sources', sources)
        });
}

async function handleQRIsRead(qrContent: string): Promise<void> {
    appContainer.qrWindow?.close();
    try {
        const totpData = await qrHandler.parseQRContent(qrContent);
        const jsonData = JSON.stringify(totpData);
        appContainer.mainWindow.webContents.send('qr:parsed', jsonData);
    } catch (error) {
        console.error(error);
    }
}

async function parseSelectedImageFiles() {
    const dialogResult = await dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
        filters: [
            {name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif']},
        ]
    });
    if (dialogResult.canceled || dialogResult.filePaths.length === 0) {
        return;
    }

    const accounts = await qrHandler.parseFromFiles(dialogResult.filePaths);
    const jsonData = JSON.stringify(accounts);
    appContainer.mainWindow.webContents.send('qr:parsed', jsonData);
}

function setMainMenu() {
    const tray = new Tray(join(__dirname, '../../resources/tray-icon.png'));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Exit',
            click: () => {
                app.quit();
            }
        },
    ])
    tray.on('click', () => {
        appContainer.mainWindow.show();
    })
    tray.on('right-click', () => {
        tray.popUpContextMenu(contextMenu);
    })
    tray.setToolTip('Snap2FA');
}

app.setName("Snap2FA");
app.setAboutPanelOptions({
    applicationName: "Snap2FA",
    applicationVersion: "0.0.1 alpha",
    version: "build 1",
    credits: "dev: Konstantin Matrokhin\ndesign: Dmytro Antonenko",
    authors: [
        "Konstantin Matrokhin",
        "Dmytro Antonenko"
    ],
    website: "https://matrokh.in",
    copyright: "2023"
});
