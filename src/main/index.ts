import {app, BrowserWindow, desktopCapturer, ipcMain, shell, systemPreferences} from 'electron'
import {join} from 'path'
import {electronApp, is, optimizer} from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import {getAccountsFromGoogleAuth} from "./protobuf-handler";
import {Account} from "./types/Account";

let mainWindow;
let qrWindow;

function createWindow(): void {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 300,
        height: 600,
        show: false,
        resizable: false,
        autoHideMenuBar: true,
        title: '2fa',
        ...(process.platform === 'linux' ? {icon} : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false,
            nodeIntegration: true
        }
    })

    win.on('ready-to-show', () => {
        mainWindow = win;
        win.show()
        win.webContents.openDevTools()
    })

    win.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return {action: 'deny'}
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        win.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        win.loadFile(join(__dirname, '../renderer/index.html'))
    }
}

function createQRReaderWindow() {
    const qrWin = new BrowserWindow({
        width: 300,
        height: 300,
        title: 'QR Reader',
        webPreferences: {
            sandbox: false,
            preload: join(__dirname, '../preload/index.js'),
            webSecurity: false,
            nodeIntegration: true
        },
        // opacity: .5
    });

    qrWin.on('ready-to-show', () => {
        qrWin.show();
        qrWin.webContents.send('window:position', getPosition());
    })

    qrWin.on('closed', () => {
        qrWindow = null;
    });

    qrWin.on('close', () => {
        qrWindow = null;
    });

    function getPosition() {
        return {
            x: qrWin.getPosition()[0],
            y: qrWin.getPosition()[1],
            width: qrWin.getSize()[0],
            height: qrWin.getSize()[1]
        }
    }

    qrWin.on('move', () => {
        qrWin.webContents.send('window:position', getPosition());
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        qrWin.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/index2.html')
    } else {
        qrWin.loadFile(join(__dirname, '../renderer/index2.html'))
    }

    qrWindow = qrWin;
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

    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
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
async function parseQRContent(content: string): Promise<Account[]> {
    content = content.trim();
    const defaultSchema = 'otpauth:';
    const googleAuthenticatorSchema = 'otpauth-migration:';
    const url = new URL(content);

    if (url.protocol === defaultSchema) {
        return [parseStandardAuthCode(url)];
    } else if (url.protocol === googleAuthenticatorSchema) {
        return await parseGoogleAuthCode(url);
    }
    throw new Error('invalid QR content ' + content);
}


ipcMain.on('qr:open', () => {
    if (!qrWindow) {
        createQRReaderWindow();
    }
});

ipcMain.on('recorder:init', () => {
    desktopCapturer.getSources({
        types: ['screen']
    }).then(sources => {
        if (qrWindow) {
            qrWindow.webContents.send('recorder:sources', sources);
        }
    });
});
ipcMain.on('qr:read', async (_event, payload) => {
    if (qrWindow) {
        qrWindow.close();
    }
    try {
        const totpData = await parseQRContent(payload.text);
        const jsonData = JSON.stringify(totpData);
        mainWindow.webContents.send('qr:parsed', jsonData);
    } catch (error) {
        console.error(error);
    }
});

function parseStandardAuthCode(url: URL): Account {
    const account = url.pathname.replace(/^\//, '');
    const secret = url.searchParams.get('secret');
    const issuer = url.searchParams.get('issuer') || '';
    if (!secret?.trim()) {
        throw new Error('empty secret');
    }
    return {issuer, account, secret};
}

async function parseGoogleAuthCode(url: URL): Promise<Account[]> {
// ipcMain.on('qr:parse-proto', async (_event, payload) => {
    // const str = "CjQKFMREUB7hkE6lUgSVk2dg5l6Vbte5Egtrb3RlYmFsdnJvdBoJSW5zdGFncmFtIAEoATACChYKCneHdGtNPeefH38SAnZrIAEoATACClgKDvdsjCcTXFZr1rJHKdSaEi9CbG9ja2NoYWluOjEzOGEyMTE4LTMyOTctNDczOC04OWQwLWJiNWYzYmY5ZGRiMxoPYmxvY2tjaGFpbi5pbmZvIAEoATACCkYKFFPH+tD7t7j/8lEynKdm+02nd8D6EiBrb25zdGFudGluLm1hdHJva2hpbkBiZXRvb2xhLmNvbRoGR29vZ2xlIAEoATACCjkKFBqpzghZs5icJUWqwUprHJajyzHvEhFrb25zdGFudGluLnNlbHNreRoIRmFjZWJvb2sgASgBMAIKJgoKf2QXRBzkUinI6BIKa21hdHJva2hpbhoGR2l0SHViIAEoATACCjoKFENDYnBKa2F3Q3RoUHdKVWpOSnNjEhRrb25zdGFudGluLm1hdHJva2hpbhoGTW9uZWZmIAEoATACCjAKCkh/RmkbWitROCQSEkJpdGZpbmV4LTExLTgtMjAyMhoIQml0ZmluZXggASgBMAIKPwoKkWNwcqz6qv0uHRIea29uc3RhbnRpbi5tYXRyb2toaW5AZ21haWwuY29tGgtCaW5hbmNlLmNvbSABKAEwAgpHChT+kI2/hxW0pmaO8RE2Y1lT+TpWVxIha29uc3RhbnRpbi5tYXRyb2toaW5Ac3Bpa2VhcHAuY29tGgZHb29nbGUgASgBMAIQARgBIAA=";
    const protobufMessage = url.searchParams.get('data')!;
    const otpBuffer = Buffer.from(protobufMessage, 'base64');
    return await getAccountsFromGoogleAuth(otpBuffer);
    // mainWindow.webContents.send('qr:import-proto-accounts', accounts);
// });
}
