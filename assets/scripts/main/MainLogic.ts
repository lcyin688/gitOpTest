import {Logic} from "../framework/core/logic/Logic";
import {GameService} from "../common/net/GameService";
import { HeartbeatProto } from "../common/protocol/HeartbetProto";
import { Config } from "../common/config/Config";
import { MainSender } from "./MainSender";


export class MainLogic extends Logic {

    protected get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }

    public connectServer(){
        this.service.heartbeat = HeartbeatProto;
        this.service.maxEnterBackgroundTime = Config.MIN_INBACKGROUND_TIME;
        this.service.connect();
        Manager.loading.showId("TS_Denglu_54",function(){
            Manager.tips.showFromId("10001");
        });
    }

    public auth(){
        let sender = Manager.netHelper.getSender(MainSender);
        sender.testAuth();
    }

    public sendYzm(phone:string){
        let sender = Manager.netHelper.getSender(MainSender);
        sender.sendAuthCode(phone);
    }
}