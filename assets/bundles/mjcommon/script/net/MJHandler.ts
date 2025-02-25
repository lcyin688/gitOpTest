/**
 * @description 大厅网络逻辑流程控制器  
 */
import { LobbyService } from "../../../../scripts/common/net/LobbyService";
import { Handler } from "../../../../scripts/framework/core/net/service/Handler";

export default class MJHandler extends Handler {
    static module = "Lobby"
    protected get service(){
        return Manager.serviceManager.get(LobbyService);
    }
    
    onLoad() {
        super.onLoad()
    }




 






}
