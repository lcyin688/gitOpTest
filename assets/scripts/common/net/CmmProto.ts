import { ProtoMessage } from "../../framework/core/net/message/ProtoMessage";
import {QLMessageStruct} from "../../framework/core/net/message/SSMCodec";

/**@description 根据自己项目扩展 */
export class CmmProto<T> extends ProtoMessage<T> implements QLMessageStruct{
    cmd : string | number = "";
}