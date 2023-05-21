import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { BrowserWindow } from 'electron'
import icon from '../../resources/icon.png?asset'

export class AppWindows {
    public createMainWindow(): BrowserWindow {
        const mainWindow = new BrowserWindow({
            title: 'Snap2FA',
            backgroundColor: '#0E0E0E',
            minimizable: false,
            maximizable: false,
            width: 334,
            height: 700,
            resizable: false,
            alwaysOnTop: false,
            titleBarStyle: 'hiddenInset',
            frame: false,
            ...(process.platform === 'linux' ? { icon } : {}),
            webPreferences: {
                preload: join(__dirname, '../preload/index.js'),
                sandbox: false,
                nodeIntegration: true
            }
        });
        // HMR for renderer base on electron-vite cli.
        // Load the remote URL for development or the local html file for production.
        if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
            mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
        } else {
            mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
        }

        return mainWindow;
    }

    public createQRReaderWindow(): BrowserWindow {
        const qrWin = new BrowserWindow({
            title: 'Snap2FA',
            width: 300,
            height: 300,
            alwaysOnTop: true,
            opacity: .5,
            webPreferences: {
                sandbox: false,
                preload: join(__dirname, '../preload/index.js'),
                webSecurity: false,
                nodeIntegration: true
            }
        });

        if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
            qrWin.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/index2.html');
        } else {
            qrWin.loadFile(join(__dirname, '../renderer/index2.html'));
        }

        return qrWin;
    }
}
