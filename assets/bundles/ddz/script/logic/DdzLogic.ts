import { CmmProto } from "../../../../scripts/common/net/CmmProto";
import { GameService } from "../../../../scripts/common/net/GameService";
import { DouCardType } from "../../../../scripts/def/GameEnums";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";
import { Logic } from "../../../../scripts/framework/core/logic/Logic";
import { RoomManager } from "../../../gamecommon/script/manager/RoomManager";
import { CardType, DdzData } from "../data/DdzData";
import DdzView from "../view/DdzView";


export class DdzLogic extends Logic {

    private view:DdzView = null;

    onDestroy(): void {
        Log.d("HallLogic onDestroy"); 
        this.clearProto();
    }

    onLoad( gameView : GameView):void{
        super.onLoad(gameView)
        this.view = gameView as DdzView;

        //斗地主
        this.registerProto(ProtoDef.pb.S2CDouReady, this.onS2CDouReady);
        this.registerProto(ProtoDef.pb.S2CDouStart, this.onS2CDouStart);
        this.registerProto(ProtoDef.pb.S2CDouAddCards, this.onS2CDouAddCards);
        // this.registerProto(ProtoDef.pb.S2CDouFinalCards, this.onS2CDouFinalCards);
        this.registerProto(ProtoDef.pb.S2CDouCurChooseLandlord, this.onS2CDouCurChooseLandlord);
        this.registerProto(ProtoDef.pb.S2CDouChooseLandlord, this.onS2CDouChooseLandlord);
        this.registerProto(ProtoDef.pb.S2CDouSetLandlord, this.onS2CDouSetLandlord);
        this.registerProto(ProtoDef.pb.S2CDouDoubleStart, this.onS2CDouDoubleStart);
        this.registerProto(ProtoDef.pb.S2CDouDouble, this.onS2CDouDouble);
        this.registerProto(ProtoDef.pb.S2CDouPlayPos, this.onS2CDouPlayPos);
        this.registerProto(ProtoDef.pb.S2CDouPlayCards, this.onS2CDouPlayCards);
        this.registerProto(ProtoDef.pb.S2CDouSettlement, this.onS2CDouSettlement);
        this.registerProto(ProtoDef.pb.S2CDouSetTrusteeship, this.onS2CDouSetTrusteeship);
        this.registerProto(ProtoDef.pb.S2CDouBombDouble, this.onS2CDouBombDouble);
        this.registerProto(ProtoDef.pb.S2CDouLiuJu, this.onS2CDouLiuJu);
        this.registerProto(ProtoDef.pb.S2CDouRestart, this.onS2CDouRestart);
        this.registerProto(ProtoDef.pb.S2CTablePlayer, this.onS2CTablePlayer);
        this.registerProto(ProtoDef.pb.S2CDouMultiple, this.onS2CDouMultiple);
        this.registerProto(ProtoDef.pb.S2CDouUseRecorder, this.onS2CDouUseRecorder);
        this.registerProto(ProtoDef.pb.S2CDouSeeFinal, this.onS2CDouSeeFinal);
        this.registerProto(ProtoDef.pb.S2CDouViewCards, this.onS2CDouViewCards);
        this.registerProto(ProtoDef.pb.S2CUseProp, this.onS2CUseProp);

        let dd = Manager.dataCenter.get(DdzData);
        dd.initData();
    }

    private cardGroup:any = {};
    private cardCountMap = {};
    getAllPair(){   

        //对子 三张 四张
        for (let index = 3; index < 16; index++) {
            if(this.cardCountMap[index] != null){
                if (this.cardCountMap[index].length==4){
                    this.groupTypeValue(DouCardType.DouCardType_Bomb,index,4);
                    this.groupTypeValue(DouCardType.DouCardType_Third,index,3);
                    this.groupTypeValue(DouCardType.DouCardType_Pair,index,2);
                }else if (this.cardCountMap[index].length==3){
                    this.groupTypeValue(DouCardType.DouCardType_Third,index,3);
                    this.groupTypeValue(DouCardType.DouCardType_Pair,index,2);
                }else if (this.cardCountMap[index].length==2){
                    this.groupTypeValue(DouCardType.DouCardType_Pair,index,2);
                }else {
                    this.groupTypeValue(DouCardType.DouCardType_Single,index,1);
                }
            }
        }
        if (this.cardCountMap[16] != null && this.cardCountMap[17] != null) {
            this.groupType(DouCardType.DouCardType_Rocket,[1165,1175],-1);
        }

        this.groupLz();
        this.groupLd();
        this.groupFJ();
        this.groupLIANZHA();

        Log.e("cardGroup",this.cardGroup);
        // this.cardGroup[t].push(d); 
        let fristCard:number = -1;
        for (let index1 = 3; index1 < 16; index1++) {
            let isType = 0;
            let ct = this.cardGroup[DouCardType.DouCardType_Bomb];
            if (ct != null && ct.length > 0){
                if(ct[0][0] == index1){
                    continue;
                }
            }
            fristCard = index1;
        }
    }

    groupLz(){
        //连子
        let temp = -1;
        let start = -1;
        let tempLian:number[];
        for (let index = 3; index < 11; index++) {
            if(this.cardCountMap[index] != null){
                start = index;
                tempLian = [];
                tempLian.push(start);
                temp = index;
                for (let j = index+1; j < 15; j++){
                    if(this.cardCountMap[j] != null){
                        if(j-temp==1){
                            tempLian.push(j);
                        }else{
                            if (tempLian.length < 5){
                                break;
                            }
                        }
                        temp = j;
                    }else{
                        break;
                    }
                }
                if (tempLian.length >= 5){
                    this.groupType(DouCardType.DouCardType_Sequence ,tempLian,-1);
                }
            }else{
                start = -1;
            }
        }
    }

    groupLd(){
        //连对
        let temp = -1;
        let start = -1;
        let tempLian:number[];
        for (let index = 3; index < 13; index++) {
            if(this.cardCountMap[index] != null && this.cardCountMap[index].length >= 2){
                start = index;
                tempLian = [];
                tempLian.push(start);
                tempLian.push(start);
                temp = index;
                for (let j = index+1; j < 15; j++){
                    if(this.cardCountMap[j] != null && this.cardCountMap[j].length >= 2){
                        if(j-temp==1){
                            tempLian.push(j);
                            tempLian.push(j);
                        }else{
                            if (tempLian.length < 6){
                                break;
                            }
                        }
                        temp = j;
                    }else{
                        break;
                    }
                }
                if (tempLian.length >= 6){
                    this.groupType(DouCardType.DouCardType_LinkPair ,tempLian,-1);
                }
            }else{
                start = -1;
            }
        }
    }

    groupFJ(){
        //飞机
        let temp = -1;
        let start = -1;
        let tempLian:number[];
        for (let index = 3; index < 14; index++) {
            if(this.cardCountMap[index] != null && this.cardCountMap[index].length >= 3){
                start = index;
                tempLian = [];
                tempLian.push(start);
                tempLian.push(start);
                tempLian.push(start);
                temp = index;
                for (let j = index+1; j < 15; j++){
                    if(this.cardCountMap[j] != null && this.cardCountMap[j].length >= 3){
                        if(j-temp==1){
                            tempLian.push(j);
                            tempLian.push(j);
                            tempLian.push(j);
                        }else{
                            if (tempLian.length < 6){
                                break;
                            }
                        }
                        temp = j;
                    }else{
                        break;
                    }
                }
                if (tempLian.length >= 6){
                    this.groupType(DouCardType.DouCardType_Airplane ,tempLian,-1);
                }
            }else{
                start = -1;
            }
        }
    }

    groupLIANZHA(){
        //连炸
        let temp = -1;
        let start = -1;
        let tempLian:number[];
        for (let index = 3; index < 14; index++) {
            if(this.cardCountMap[index] != null && this.cardCountMap[index].length >= 4){
                start = index;
                tempLian = [];
                tempLian.push(start);
                tempLian.push(start);
                tempLian.push(start);
                tempLian.push(start);
                temp = index;
                for (let j = index+1; j < 15; j++){
                    if(this.cardCountMap[j] != null && this.cardCountMap[j].length >= 4){
                        if(j-temp==1){
                            tempLian.push(j);
                            tempLian.push(j);
                            tempLian.push(j);
                            tempLian.push(j);
                        }else{
                            if (tempLian.length < 8){
                                break;
                            }
                        }
                        temp = j;
                    }else{
                        break;
                    }
                }
                if (tempLian.length >= 6){
                    this.groupType(DouCardType.DouCardType_BombLink ,tempLian,-1);
                }
            }else{
                start = -1;
            }
        }
    }

    groupType(t:number,data:number[],c:number){
        if (this.cardGroup[t] == null){
            this.cardGroup[t] = [];
        }
        let d = [];
        let len = data.length;
        if (c > 0){
            len = c;
        }
        for (let index = 0; index < len; index++) {
            d.push(data[index]);
        }
        this.cardGroup[t].push(d);
    }

    groupTypeValue(t:number,v:number,c:number){
        if (this.cardGroup[t] == null){
            this.cardGroup[t] = [];
        }
        let d = [];
        for (let index = 0; index < c; index++) {
            d.push(v);
        }
        this.cardGroup[t].push(d);
    }
    

    onS2CDouReady(data:pb.S2CDouReady){
        Log.d("onS2CDouReady:",data);
        this.view.onS2CDouReady(data);
    }

    onS2CDouStart(data:pb.S2CDouStart){
        Log.d("onS2CDouStart:",data);
        this.view.onS2CDouStart();
    }

    onS2CDouAddCards(data:pb.S2CDouAddCards){
        Log.d("onS2CDouAddCards:",data);
        if (data.cards.length == 17 || data.cards.length == 3){

        }else{
            Manager.tips.debug("服务发的牌张数错误:"+data.cards.length);
        }
        this.view.onS2CDouAddCards(data);
    }

    // onS2CDouFinalCards(data:pb.S2CDouFinalCards){
    //     Log.d("onS2CDouFinalCards:",data);
    // }

    onS2CDouCurChooseLandlord(data:pb.S2CDouCurChooseLandlord){
        Log.d("onS2CDouCurChooseLandlord:",data);
        this.view.onS2CDouCurChooseLandlord(data);
    }

    onS2CDouChooseLandlord(data:pb.S2CDouChooseLandlord){
        Log.d("onS2CDouChooseLandlord:",data);
        this.view.onS2CDouChooseLandlord(data);
    }

    onS2CDouSetLandlord(data:pb.S2CDouSetLandlord){
        Log.d("onS2CDouSetLandlord:",data);
        this.view.onS2CDouSetLandlord(data);
    }

    onS2CDouDoubleStart(data:pb.S2CDouDoubleStart){
        Log.d("onS2CDouDoubleStart:",data);
        this.view.onS2CDouDoubleStart(data);
    }
    
    onS2CDouDouble(data:pb.S2CDouDouble){
        Log.d("onS2CDouDouble:",data);
        this.view.onS2CDouDouble(data);
    }

    onS2CDouPlayPos(data:pb.S2CDouPlayPos){
        Log.d("onS2CDouPlayPos:",data);
        this.view.onS2CDouPlayPos(data);
    }

    onS2CDouPlayCards(data:pb.S2CDouPlayCards){
        Log.d("onS2CDouPlayCards:",data);
        this.view.onS2CDouPlayCards(data);
    }

    onS2CDouSettlement(data:pb.S2CDouSettlement){
        Log.d("onS2CDouSettlement:",data);
        this.view.onS2CDouSettlement(data);
    }

    onS2CTablePlayer(data:pb.S2CTablePlayer){
        Log.d("onS2CTablePlayer:",data);
        this.view.onS2CTablePlayer(data);
    }

    onS2CDouSetTrusteeship(data:pb.S2CDouSetTrusteeship){
        Log.d("onS2CDouSetTrusteeship:",data);
        this.view.onS2CDouSetTrusteeship(data);
    }

    onS2CDouBombDouble(data:pb.S2CDouBombDouble){
        Log.d("onS2CDouBombDouble:",data);
    }

    onS2CDouLiuJu(data:pb.S2CDouLiuJu){
        Log.d("onS2CDouLiuJu:",data);
        this.view.onS2CDouLiuJu(data);
    }

    onS2CDouRestart(data:pb.S2CDouRestart){
        Log.d("onS2CDouRestart:",data);
        RoomManager.SetState(RoomManager.StateType.Playing);
    }

    onS2CDouMultiple(data:pb.S2CDouMultiple){
        Log.d("onS2CDouMultiple:",data);
        this.view.onS2CDouMultiple(data);
    }

    onS2CDouUseRecorder(data:pb.S2CDouUseRecorder){
        this.view.onS2CDouUseRecorder(data);
    }

    onS2CDouSeeFinal(data:pb.S2CDouSeeFinal){
        this.view.onS2CDouSeeFinal(data);
    }

    onS2CDouViewCards(data:pb.S2CDouViewCards){
        Log.d("onS2CDouViewCards:",data);
        this.view.onS2CDouViewCards(data);
    }

    onS2CUseProp(data:pb.S2CUseProp){
        // Log.d("onS2CUseProp:",data);
        // if(data.result == 1){
        //     let ts = Manager.utils.GetTiShiConfigItem(data.cfgId.toString());
        //     if(ts == null){
        //         Manager.tips.show("未知提示["+data.cfgId+"]");
        //         return;
        //     }
        //     if(ts.NeiRong == null || ts.NeiRong.length == 0){
        //         Manager.tips.show("未知提示[-1]");
        //         return;
        //     }
        //     Manager.utils.showTips(ts.NeiRong, [data.name]);
        // }
    }
    
    onS2CSyncTable(data:pb.S2CDouTableInfo){

    }

    public douReady(){
        type Packet = typeof pb.C2SDouReady;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SDouReady);
        let packet = new CmmProto<pb.C2SDouReady>(Packet);
        packet.cmd = ProtoDef.pb.C2SDouReady;
        packet.data = new Packet();
        this.service?.send(packet);
        Log.d("douReady:",packet);
    }

    public douChooseLandlord(choose:boolean){
        type Packet = typeof pb.C2SDouChooseLandlord;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SDouChooseLandlord);
        let packet = new CmmProto<pb.C2SDouChooseLandlord>(Packet);
        packet.cmd = ProtoDef.pb.C2SDouChooseLandlord;
        packet.data = new Packet();
        packet.data.choose = choose;

        this.service?.send(packet);
        Log.d("DouChooseLandlord:",packet);
    }

    public douDouble(t:pb.DouDoubleType){
        type Packet = typeof pb.C2SDouDouble;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SDouDouble);
        let packet = new CmmProto<pb.C2SDouDouble>(Packet);
        packet.cmd = ProtoDef.pb.C2SDouDouble;
        packet.data = new Packet();
        packet.data.type = t;

        this.service?.send(packet);
        Log.d("douDouble:",packet);
    }

    
    public douPlayCards(cards:number[]){
        type Packet = typeof pb.C2SDouPlayCards;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SDouPlayCards);
        let packet = new CmmProto<pb.C2SDouPlayCards>(Packet);
        packet.cmd = ProtoDef.pb.C2SDouPlayCards;
        packet.data = new Packet();
        packet.data.cards = cards;
        Log.d("douPlayCards:",packet.data.cards);
        this.service?.send(packet);
    }

    public douSetTrusteeship(enable:boolean){
        type Packet = typeof pb.C2SDouSetTrusteeship;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SDouSetTrusteeship);
        let packet = new CmmProto<pb.C2SDouSetTrusteeship>(Packet);
        packet.cmd = ProtoDef.pb.C2SDouSetTrusteeship;
        packet.data = new Packet();
        packet.data.enable = enable;
        this.service?.send(packet);
        Log.d("douSetTrusteeship:",packet);
    }

    public douStartNext(){
        type Packet = typeof pb.C2SDouStartNext;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SDouStartNext);
        let packet = new CmmProto<pb.C2SDouStartNext>(Packet);
        packet.cmd = ProtoDef.pb.C2SDouStartNext;
        packet.data = new Packet();
        this.service?.send(packet);
        Log.d("douStartNext:",packet);
    }
    
    public gobackLobby(){
        type Packet = typeof pb.C2SGobackLobby;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGobackLobby);
        let packet = new CmmProto<pb.C2SGobackLobby>(Packet);
        packet.cmd = ProtoDef.pb.C2SGobackLobby;
        packet.data = new Packet();
        this.service?.send(packet);
        Log.d("gobackLobby:",packet);
    }

    public syncState(){
        this.service.syncState();
    }

    public onC2SUILoaded(){
        this.service.onC2SUILoaded();
    }

    public nextMatch(gameType:number,tableCfgId:number){
        this.service.nextMatchTable(gameType,tableCfgId);
    }

    public useProp(id:number,params:number[]=null){
        this.service.c2SUseProp(id,params);
    }

    public onC2SGetIdlePlayers(guid:number){
        this.service.onC2SGetIdlePlayers(guid);
    }
    
    // 快速使用记牌器
    public autoDouUseRecorder()
    {   
        type Packet = typeof pb.C2SDouUseRecorder;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SDouUseRecorder);
        let packet = new CmmProto<pb.C2SDouUseRecorder>(Packet);
        packet.cmd = ProtoDef.pb.C2SDouUseRecorder;
        packet.data = new Packet();
        this.service?.send(packet);
        Log.d("C2SDouUseRecorder:",packet);
    }


    public C2SDouSeeFinal()
    {   
        type Packet = typeof pb.C2SDouSeeFinal;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SDouSeeFinal);
        let packet = new CmmProto<pb.C2SDouSeeFinal>(Packet);
        packet.cmd = ProtoDef.pb.C2SDouSeeFinal;
        packet.data = new Packet();
        this.service?.send(packet);
        Log.d("C2SDouSeeFinal:",packet);
    }
    


}
