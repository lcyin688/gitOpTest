import { LobbyService } from "../../../../scripts/common/net/LobbyService";
import { Sender } from "../../../../scripts/framework/core/net/service/Sender";

export class XLThreeTwoMJSender extends Sender {

    static module = "Lobby"
    protected get service(){
        return Manager.serviceManager.get(LobbyService);
    }
}
