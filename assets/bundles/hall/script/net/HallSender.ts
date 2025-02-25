import { LobbyService } from "../../../../scripts/common/net/LobbyService";
import { HttpPackage } from "../../../../scripts/framework/core/net/http/HttpClient";
import { Http } from "../../../../scripts/framework/core/net/http/Http";
import { Sender } from "../../../../scripts/framework/core/net/service/Sender";
import { Net } from "../../../../scripts/framework/core/net/Net";
import { GameService } from "../../../../scripts/common/net/GameService";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";
import { CmmProto } from "../../../../scripts/common/net/CmmProto";

export class HallSender extends Sender {

    static module = "Lobby"
    protected get service(){
        return Manager.serviceManager.get(GameService);
    }

    public setPlayerHead(id:number){

        type Packet = typeof pb.C2SSetPortraits;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SSetPortraits);
        let packet = new CmmProto<pb.C2SSetPortraits>(Packet);
        packet.cmd = ProtoDef.pb.C2SSetPortraits;
        packet.data = new Packet();
        packet.data.iconId = id;

        this.service?.send(packet);
    }
}
