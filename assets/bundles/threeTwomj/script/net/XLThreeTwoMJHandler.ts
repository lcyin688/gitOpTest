import { LobbyService } from "../../../../scripts/common/net/LobbyService";
import { Handler } from "../../../../scripts/framework/core/net/service/Handler";


export default class XLThreeTwoMJHandler extends Handler {
    static module = "Lobby"
    protected get service(){
        return Manager.serviceManager.get(LobbyService);
    }
    onLoad() {
        super.onLoad()
    }


}
