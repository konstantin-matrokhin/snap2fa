import protobuf from 'protobufjs'
import { join } from 'path'

export class ProtobufHandler {
    public async decodeMessage(buffer: Buffer): Promise<any> {
        const root = await protobuf.load(join(__dirname, '../../migration-payload.proto'));
        const payload = root.lookupType('MigrationPayload');
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
        return payload.toObject(message);
    }
}
