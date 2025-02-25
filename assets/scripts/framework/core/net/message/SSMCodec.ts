import { ProtoDef } from "../../../../def/ProtoDef";
import { Macro } from "../../../defines/Macros";
import { ByteArray } from "../../../plugin/ByteArray";
import { Codec, IMessage } from "./Message";

export interface QLMessageStruct extends IMessage{

}

export class SSMCodec extends Codec {
    mainCmd : string = "";
    /**@description 数据buffer */
    buffer: any = null!;

    pack(data: QLMessageStruct): boolean {
        let dataSize = 0;
        /**第一种写法 */
        let ab:ArrayBuffer = null;
        if (data.buffer) {
            //如果有包体，先放入包体
            ab = data.buffer as ArrayBuffer;
            if(ab){
                dataSize = ab.byteLength;
            }
        }
        // Log.d("=============",data.cmd,data.buffer,dataSize);
        let buffer = new ByteArray();
        buffer.endian = Macro.USING_LITTLE_ENDIAN;
        buffer.writeUnsignedInt(dataSize+4);
        if (ab){
            let dataBuffer = new ByteArray(ab as Uint8Array);
            buffer.writeBytes(dataBuffer);
        }

        this.mainCmd = String(data.cmd);
        this.buffer = buffer.bytes;
        // Log.d("QLCodec pack1",this.buffer.length,this.buffer);
        return true;
    }
    unPack(event: MessageEvent): boolean {
        // Log.d("=============",event.data);
        // let dataView = new ByteArray(event.data);
        // dataView.endian = Macro.USING_LITTLE_ENDIAN;
        // Log.d("QLCodec event",event);
        //取包头
        // let dataSize = dataView.readUnsignedInt();
        // let buffer = dataView.buffer.slice(dataView.position)
        // this.buffer = new Uint8Array(buffer);
        this.buffer = event.data.slice(4,event.data.length);
        // Log.d("=============",this.buffer);
        let Request = Manager.protoManager.getProto(ProtoDef.rpc.Request);
        if (Request) {
            let msg = Request.decode(this.buffer);
            // Log.d("msg",msg.method,msg.serialized_request.length);
            if(null != msg){
                this.buffer = msg.serialized_request;
                this.mainCmd = msg.method;
                // Log.d(msg);
                return true;
            }
        }
        return false;

        // type Requst = typeof rpc.Request;
        // let Object:Requst = Manager.protoManager.request();

        // this.buffer  = Object.decode(this.buffer).finish();
        // Manager.protoManager.decode
        // return dataSize == this.buffer.length;
    }


    get cmd(){return this.mainCmd;}

}