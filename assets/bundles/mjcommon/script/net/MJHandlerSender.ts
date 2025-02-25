import { LobbyService } from "../../../../scripts/common/net/LobbyService";
import { HttpPackage } from "../../../../scripts/framework/core/net/http/HttpClient";
import { Http } from "../../../../scripts/framework/core/net/http/Http";
import { Sender } from "../../../../scripts/framework/core/net/service/Sender";
import { Net } from "../../../../scripts/framework/core/net/Net";

export class MJHandlerSender extends Sender {

    static module = "Lobby"
    protected get service(){
        return Manager.serviceManager.get(LobbyService);
    }
}
