import MainPage from "../pages/MainPage.svelte";
import AddPage from "../pages/AddPage.svelte";
import ScanQRPage from "../pages/ScanQRPage.svelte";
import {page} from "./stores";
import ImageUploading from "../pages/ImageUploadingPage.svelte";
import WebcamReading from "../pages/WebcamReadingPage.svelte";
import ScreenReading from "../pages/ScreenReadingPage.svelte";
import ManualEnterPage from "../pages/ManualEnterPage.svelte";

export const PAGE_MAIN = 'PAGE_MAIN';
export const PAGE_ADD = 'PAGE_ADD';
export const PAGE_SCAN_QR = 'PAGE_SCAN_QR';
export const PAGE_SCREEN_READING = 'PAGE_SCREEN_READING';
export const PAGE_IMAGE_UPLOADING = 'PAGE_IMAGE_UPLOADING';
export const PAGE_WEBCAM = 'PAGE_WEBCAM';
export const PAGE_ADD_MANUALLY = 'PAGE_ADD_MANUALLY';
export const PAGE_IMPORT = 'PAGE_IMPORT';

export const pageMapping = new Map([
    [PAGE_MAIN, MainPage],
    [PAGE_ADD, AddPage],
    [PAGE_SCAN_QR, ScanQRPage],
    [PAGE_SCREEN_READING, ScreenReading],
    [PAGE_IMAGE_UPLOADING, ImageUploading],
    [PAGE_WEBCAM, WebcamReading],
    [PAGE_ADD_MANUALLY, ManualEnterPage],
]);

export function defaultPage() {
    return MainPage;
}

export function defaultPageName() {
    return PAGE_MAIN;
}

export function goto(pageName) {
    page.set(pageName);
}
