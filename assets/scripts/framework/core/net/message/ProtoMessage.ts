import { ByteArray } from "../../../plugin/ByteArray";
import { Net } from "../Net";
import { Codec, Message } from "./Message";

/**
 * @description protobuf解析基类
 */
export abstract class ProtoMessage<T> extends Message {
    /**@description 发送或接收的消息流 */
    buffer: Uint8Array = null!;

    /**@description 直接把真正的Proto类型给赋值 */
    private type: any = null;

    /**@description 真空的Proto数据 */
    data: any = null!;

    constructor(protoType:any){
        super();
        this.type = protoType;
    }

    /**@description 打包数据 */
    encode(): boolean {
        let Object = Manager.protoManager.request();
        let req = new Object();
        req.method = this.cmd;
        req.serialized_request = this.data.toArrayBuffer() as Uint8Array;
        this.buffer = req.toArrayBuffer() as Uint8Array;
        // Log.d("====",this.buffer);
        if (this.buffer) {
            return true;
        }
        return false;
    }
    /**@description 解析数据 */
    decode(data: Uint8Array): boolean {
        if (data) {
            this.buffer = data;
            this.data = this.type.decode(this.buffer);
            return true;
        }
        return false;
    }
}

export abstract class ProtoCodec extends Codec {

}

export abstract class ProtoMessageHeartbeat extends Message{
    static type = Net.ServiceType.Proto;
}