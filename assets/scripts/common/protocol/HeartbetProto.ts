import { ProtoMessageHeartbeat } from "../../framework/core/net/message/ProtoMessage";
import { ProtoDef } from "../../def/ProtoDef";

/**@description protobuf心跳包 */
export class HeartbeatProto extends ProtoMessageHeartbeat {
    buffer: Uint8Array = null!;
    encode(): boolean {
        let Object = Manager.protoManager.request();
        let req = new Object();

        let C2SPing = Manager.protoManager.lookup(ProtoDef.pb.C2SPing) as any;
        let ping = new C2SPing();
        req.method = ProtoDef.pb.C2SPing;
        req.serialized_request = ping.toArrayBuffer();
        this.buffer = req.toArrayBuffer();

        return true
    }
    decode(data: any): boolean {
        Log.d("HeartbeatProto decode",data);
        return true
    }
    get cmd(){ return String(ProtoDef.pb.C2SPing) }
}
