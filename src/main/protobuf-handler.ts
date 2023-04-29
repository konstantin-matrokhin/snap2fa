import base32 from 'hi-base32';
import protobuf from 'protobufjs';
import {join} from "path";
import {Account} from "./types/Account";

export async function decodeMessage(buffer) {
    const root = await protobuf.load(join(__dirname, "../../migration-payload.proto"));
    debugger;
    const payload = root.lookupType("MigrationPayload");
    const err = payload.verify(buffer);
    if (err) {
        throw err;
    }
    let message;
    try {
        message = payload.decode(buffer);
    } catch (err) {
        throw err;
    }
    // const obj = payload.toObject(message);

    return payload.toObject(message);
}

export async function getAccountsFromGoogleAuth(otpBuffer): Promise<Account[]> {
    const payload = await decodeMessage(otpBuffer);
    const otpArray = payload.otpParameters;
    const result: any[] = [];
    for(let i = 0; i < otpArray.length; i++) {
        const otp = otpArray[i];
        result.push({
            issuer: otp.issuer,
            account: otp.name,
            secret: base32.encode(otp.secret)
        });
    }
    return result;
}
