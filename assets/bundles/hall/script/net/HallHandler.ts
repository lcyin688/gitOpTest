/**
 * @description 大厅网络逻辑流程控制器  
 */
import { GameService } from "../../../../scripts/common/net/GameService";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";
import { Handler } from "../../../../scripts/framework/core/net/service/Handler";

export default class HallHandler extends Handler {
    static module = "Lobby"
    protected get service(){
        return Manager.serviceManager.get(GameService);
    }

    onLoad() {
        super.onLoad()
        // this.registerProto(ProtoDef.pb.S2CSetPortraits, this.onS2CSetPortraits);
        // this.register(HallProtoConfig.CMD_ROOM_INFO.cmd, this.onTestProtoMessage, HallProtoConfig.CMD_ROOM_INFO.className);
        // this.register(GetCmdKey(MainCmd.CMD_LOBBY, SUB_CMD_LOBBY.TEST_BINARY_MSG), this.onTestBinaryMessage, TestBinaryMessage);
    }

    // protected onS2CSetPortraits(data :pb.S2CSetPortraits){
    //     Log.d("onS2CSetPortraits：",data);
    //     dispatch(ProtoDef.pb.S2CSetPortraits,data);
    // }
}
