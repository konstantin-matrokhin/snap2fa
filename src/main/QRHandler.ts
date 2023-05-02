import {Account} from "./types/Account";
import {ProtobufHandler} from "./ProtobufHandler";
import base32 from "hi-base32";

export class QRHandler {
    protobufHandler = new ProtobufHandler();

    public async parseQRContent(content: string): Promise<Account[]> {
        content = content.trim()
        const defaultSchema = 'otpauth:'
        const googleAuthenticatorSchema = 'otpauth-migration:'
        const url = new URL(content)

        if (url.protocol === defaultSchema) {
            return [this.parseStandardAuthCode(url)]
        } else if (url.protocol === googleAuthenticatorSchema) {
            return await this.parseGoogleAuthCode(url)
        }
        throw new Error('invalid QR content ' + content)
    }


    private parseStandardAuthCode(url: URL): Account {
        const account = url.pathname.replace(/^\//, '')
        const secret = url.searchParams.get('secret')
        const issuer = url.searchParams.get('issuer') || ''
        if (!secret?.trim()) {
            throw new Error('empty secret')
        }
        return {issuer, account, secret}
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

}
