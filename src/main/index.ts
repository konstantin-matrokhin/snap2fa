import {app, shell, BrowserWindow} from 'electron'
import {join} from 'path'
import {electronApp, optimizer, is} from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import {desktopCapturer, ipcMain, systemPreferences} from 'electron'

function createWindow(): void {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 900,
        height: 670,
        show: false,
        autoHideMenuBar: true,
        title: '2fa',
        ...(process.platform === 'linux' ? {icon} : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false,
            devTools: true
        }
    })

    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
        mainWindow.webContents.openDevTools()
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return {action: 'deny'}
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }
}

function createQRReaderWindow() {
    const qrWin = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'QR Reader',
        webPreferences: {
            sandbox: false,
            preload: join(__dirname, '../preload/index.js'),
            webSecurity: false,
            devTools: true,
            nodeIntegration: true
        }
    });
    ipcMain.on('recorder:init', () => {
        console.log('recorder:init');
        desktopCapturer.getSources({
            types: ['screen'],
            thumbnailSize: {width: 1920, height: 1080}
        }).then(sources => {
            qrWin.webContents.send('recorder:sources', sources);
        });
    });
    qrWin.on('ready-to-show', () => {
        qrWin.show();
        qrWin.webContents.openDevTools();
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        qrWin.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/index2.html')
    } else {
        qrWin.loadFile(join(__dirname, '../renderer/index2.html'))
    }
    return qrWin;
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
    createQRReaderWindow()

    console.log('permission', systemPreferences.getMediaAccessStatus('screen'));

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
            createQRReaderWindow()
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
