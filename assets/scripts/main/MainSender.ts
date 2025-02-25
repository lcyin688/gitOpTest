import {Sender} from "../framework/core/net/service/Sender";
import {GameService} from "../common/net/GameService";
import { CmmProto } from "../common/net/CmmProto";
import { ProtoDef } from "../def/ProtoDef";
import GameData from "../common/data/GameData";

export class MainSender extends Sender {
    static module = "Main"
    protected get service(): Service | null {
        return Manager.serviceManager.get(GameService);
    }

    public testAuth(){
        let auth = Manager.dataCenter.get(GameData).playerAuth();
        this.service?.send(auth);

        Manager.loading.showId("TS_Denglu_55",function(){
            Manager.tips.showFromId("TS_Denglu_52");
        });
        Manager.uiLoading.startSimulateProgress();
    }

    public sendAuthCode(phone:string){
        type Packet = typeof pb.C2SGenAuthCode;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGenAuthCode);
        let packet = new CmmProto<pb.C2SGenAuthCode>(Packet);
        packet.cmd = ProtoDef.pb.C2SGenAuthCode;
        packet.data = new Packet();
        packet.data.phone=phone;
        this.send(packet);
        Log.d("sendAuthCode",packet);
    }
}