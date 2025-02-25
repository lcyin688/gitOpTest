import { Handler } from "../framework/core/net/service/Handler";
import { GameService } from "../common/net/GameService";
import { ProtoDef } from "../def/ProtoDef";
import GameData from "../common/data/GameData";
import { GameEvent } from "../common/event/GameEvent";
import { Config } from "../common/config/Config";
import { CmmProto } from "../common/net/CmmProto";
import { AuthResult } from "../def/GameEnums";

export default class MainHandler extends Handler {
    static module = "Main";

    private isLogin = false;

    protected get service(): GameService | null {
        return Manager.serviceManager.get(GameService) as GameService;
    }

    protected get gameData(): GameData | null {
        return Manager.dataCenter.get(GameData) as GameData;
    }

    onLoad() {
        super.onLoad()
        this.registerProto(ProtoDef.rpc.S2CAuth, this.onAuth);
        this.registerProto(ProtoDef.pb.S2CLogin, this.onLogin);
    }


    private onAuth(data: rpc.S2CAuth) {
        Log.d("onAuth:", data);
        Manager.localStorage.setItem("server_token",data.token);
        Manager.uiLoading.hide();
        if(data.result != AuthResult.AR_Ok){
            Manager.tips.show("认证失败["+data.result+"]");
            return;
        }
        type Packet = typeof pb.C2SLogin;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SLogin);
        let packet = new CmmProto<pb.C2SLogin>(Packet);
        packet.cmd = ProtoDef.pb.C2SLogin;
        packet.data = new Packet();
        
        this.isLogin = false;
        this.service?.send(packet);

        Manager.loading.showId("TS_Denglu_53",function(){
            Manager.tips.showFromId("TS_Denglu_51");
        },5);
        // Manager.uiLoading.show(null,"");
        // Manager.uiLoading.startSimulateProgress();
    
    }

    private onLogin(data: pb.S2CLogin) {
        if(data.data == null){
            return;
        }
        this.service?.loadConfig();
        Log.d("onLogin:", data);
        Manager.loading.hide();
        let gd = Manager.dataCenter.get(GameData);
        gd.updatePlayer(data.data);
        let txt = "正在进入大厅";
        let cfg = Manager.utils.GetTiShiConfigItem("TS_Denglu_56");
        if(cfg != null){
            txt = cfg.NeiRong;
        }
        Manager.uiLoading.show(null,txt);
        Manager.uiLoading.startSimulateProgress();       
        gd.printPlayerData();

        if(!this.isLogin){
            dispatch(GameEvent.ENTER_HALL, Config.BUNDLE_HALL);
        }

        this.isLogin = true;
        let content = JSON.stringify({
            payType:"payType", 
        });
        Manager.platform.ReplacementOrder(content);

    }
}