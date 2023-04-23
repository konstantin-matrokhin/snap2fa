import {app, BrowserWindow, desktopCapturer, ipcMain, shell, systemPreferences} from 'electron'
import {join} from 'path'
import {electronApp, is, optimizer} from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let mainWindow;
let qrWindow;

function createWindow(): void {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 900,
        height: 670,
        show: false,
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
        opacity: .5
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

    console.log('permission', systemPreferences.getMediaAccessStatus('screen'));

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

// format:
// otpauth://totp/accountName?secret=secretCode&issuer=issuerName

function parseQRContent(content: string) {
    const schema = 'otpauth://totp';
    if (!content?.startsWith(schema)) {
        return;
    }

    const uri = new URL(content);
    const account = uri.pathname.replace(/^\//, '');
    const secret = uri.searchParams.get('secret');
    const issuer = uri.searchParams.get('issuer');
    if (!secret?.trim()) {
        throw new Error('empty secret');
    }
    return {issuer, account, secret};
}


ipcMain.on('qr:open', () => {
    createQRReaderWindow();
});

ipcMain.on('recorder:init', () => {
    console.log('recorder:init');
    desktopCapturer.getSources({
        types: ['screen']
    }).then(sources => {
        if (qrWindow) {
            qrWindow.webContents.send('recorder:sources', sources);
        }
    });
});
ipcMain.on('qr:read', (_event, payload) => {
    try {
        const totpData = parseQRContent(payload.text);
        mainWindow.webContents.send('qr:parsed', totpData);
        if (qrWindow) {
            qrWindow.close();
        }
    } catch (error) {
        console.error(error);
    }
});
