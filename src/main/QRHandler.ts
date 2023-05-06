import {Account} from "./Account";
import {ProtobufHandler} from "./ProtobufHandler";
import base32 from "hi-base32";
import {BinaryBitmap, HybridBinarizer, QRCodeReader, RGBLuminanceSource} from "@zxing/library";
import jimp from "jimp";

export class QRHandler {
    protobufHandler = new ProtobufHandler();
    qrCodeReader = new QRCodeReader();

    public async parseQRContent(content: string): Promise<Account[]> {
        content = content.trim();
        const defaultSchema = 'otpauth:';
        const googleAuthenticatorSchema = 'otpauth-migration:';
        const url = new URL(content)

        if (url.protocol === defaultSchema) {
            return [this.parseStandardAuthCode(url)];
        } else if (url.protocol === googleAuthenticatorSchema) {
            return await this.parseGoogleAuthCode(url);
        }
        throw new Error('invalid QR content ' + content);
    }

    public async parseFromFiles(paths: string[]): Promise<Account[]> {
        let accounts: Account[] = [];
        for (let path of paths) {
            const content = await this.decodeQRFromFile(path);
            const parsedAccounts = await this.parseQRContent(content);
            accounts = accounts.concat(parsedAccounts);
        }
        return accounts;
    }

    private parseStandardAuthCode(url: URL): Account {
        const account = url.pathname.replace(/^\//, '');
        const secret = url.searchParams.get('secret');
        const issuer = url.searchParams.get('issuer') || '';
        if (!secret?.trim()) {
            throw new Error('empty secret');
        }
        return {issuer, account, secret};
    }

    private async getAccountsFromGoogleAuth(otpBuffer: Buffer): Promise<Account[]> {
        const payload = await this.protobufHandler.decodeMessage(otpBuffer);
        const otpArray = payload.otpParameters;
        const result: any[] = [];
        for (let i = 0; i < otpArray.length; i++) {
            const otp = otpArray[i];
            result.push({
                issuer: otp.issuer,
                account: otp.name,
                secret: base32.encode(otp.secret)
            });
        }
        return result;
    }

    private async parseGoogleAuthCode(url: URL): Promise<Account[]> {
        const protobufMessage = url.searchParams.get('data')!;
        const otpBuffer = Buffer.from(protobufMessage, 'base64');
        return await this.getAccountsFromGoogleAuth(otpBuffer);
    }

    private async decodeQRFromFile(path: string): Promise<string> {
        const img = await jimp.read(path);
        const imageData = img.bitmap;
        const len = imageData.width * imageData.height;
        const luminancesUint8Array = new Uint8ClampedArray(len)
        for (let i = 0; i < len; i++) {
            luminancesUint8Array[i] = ((imageData.data[i * 4] + imageData.data[i * 4 + 1] * 2 + imageData.data[i * 4 + 2]) / 4) & 0xFF
        }

        const luminanceSource = new RGBLuminanceSource(luminancesUint8Array, imageData.width, imageData.height)
        const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource))

        const decoded = this.qrCodeReader.decode(binaryBitmap)
        return decoded.getText();
    }

}
