import type {BrowserWindow} from "electron";
import {shell} from "electron";
import {AppWindows} from "./AppWindows";
import {is} from "@electron-toolkit/utils";

export class AppContainer {
    private _appWindows = new AppWindows();
    private _mainWindow: BrowserWindow | undefined;
    private _qrWindow: BrowserWindow | undefined;
    private _isQuitting = false;

    public initMainWindow(): BrowserWindow {
        if (this._mainWindow?.isVisible()) {
            throw new Error('main window is already opened!');
        }
        let _mainWindow = this._appWindows.createMainWindow();
        _mainWindow.on('ready-to-show', () => {
            if (is.dev) {
                _mainWindow.webContents.openDevTools();
            }
        });
        _mainWindow.on('close', (e) => {
            if (!this._isQuitting) {
                e.preventDefault();
                _mainWindow.hide();
            }
        })
        _mainWindow.webContents.setWindowOpenHandler((details) => {
            shell.openExternal(details.url);
            return {action: 'deny'};
        })

        this._mainWindow = _mainWindow;
        return _mainWindow;
    }

    public initQrWindow(): BrowserWindow {
        if (this._qrWindow) {
            throw new Error('qr window is already opened!');
        }
        let _qrWindow = this._appWindows.createQRReaderWindow();
        _qrWindow.on('ready-to-show', () => {
            _qrWindow?.show();
            _qrWindow?.webContents.send('window:position', this.getQRWinPosition());
        })

        _qrWindow.on('closed', () => {
            this._qrWindow = undefined;
        })

        _qrWindow.on('close', () => {
            this._qrWindow = undefined;
        })

        _qrWindow.on('move', () => {
            _qrWindow?.webContents.send('window:position', this.getQRWinPosition());
        })

        this._qrWindow = _qrWindow;
        return _qrWindow;
    }

    getQRWinPosition() {
        return {
            x: this._qrWindow?.getPosition()[0],
            y: this._qrWindow?.getPosition()[1],
            width: this._qrWindow?.getSize()[0],
            height: this._qrWindow?.getSize()[1]
        };
    }

    get mainWindow(): BrowserWindow {
        return this._mainWindow!;
    }

    set mainWindow(value: BrowserWindow) {
        this._mainWindow = value;
    }

    get qrWindow(): BrowserWindow {
        return this._qrWindow!;
    }

    set qrWindow(value: BrowserWindow) {
        this._qrWindow = value;
    }

    get isQuitting(): boolean {
        return this._isQuitting;
    }

    set isQuitting(value: boolean) {
        this._isQuitting = value;
    }
}
