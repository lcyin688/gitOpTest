import GameData from "../../../../scripts/common/data/GameData";
import { CmmProto } from "../../../../scripts/common/net/CmmProto";
import { GameService } from "../../../../scripts/common/net/GameService";
import { MahHPGOPerate } from "../../../../scripts/def/GameEnums";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";
import { LoggerImpl } from "../../../../scripts/framework/core/log/Logger";
import { RoomManager } from "../../../gamecommon/script/manager/RoomManager";

export class MJC2SOperation  {
    static get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }


    /** 托管 */
    static ReMjTuoGuan( bAuto: boolean, auto_next: boolean, limit_value: number) 
    {
    
        type Packet = typeof pb.C2SMahAuto;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SMahAuto);
        let packet = new CmmProto<pb.C2SMahAuto>(Packet);
        packet.cmd = ProtoDef.pb.C2SMahAuto;
        packet.data = new Packet();
        packet.data.bAuto =bAuto;
        packet.data.bNext =auto_next;
        packet.data.minValue = limit_value;
        this.service?.send(packet);
    }

    /** 准备 */
    static C2SMjZhunBei() {
        // Log.e(" C2SMjZhunBei  给服务器发送准备消息 ");
        type Packet = typeof pb.C2SMahReady;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SMahReady);
        let packet = new CmmProto<pb.C2SMahReady>(Packet);
        packet.cmd = ProtoDef.pb.C2SMahReady;
        packet.data = new Packet();
        this.service?.send(packet);
    }

    
    /** 换三张 */
    static ReSendSelectedChangeThree(cards:number[],useMo:boolean) {
        type Packet = typeof pb.C2SMahHSZ;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SMahHSZ);
        let packet = new CmmProto<pb.C2SMahHSZ>(Packet);
        packet.cmd = ProtoDef.pb.C2SMahHSZ;
        packet.data = new Packet();
        packet.data.mjs=cards;
        packet.data.useMo=useMo;
        
        this.service?.send(packet);
    }

    
    
    /** 定章 */
    static SelectLacking(color :number ) {
        type Packet = typeof pb.C2SMahDingQue;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SMahDingQue);
        let packet = new CmmProto<pb.C2SMahDingQue>(Packet);
        packet.cmd = ProtoDef.pb.C2SMahDingQue;
        packet.data = new Packet();
        packet.data.que=color;
        this.service?.send(packet);
    }

    

    /** 出牌 */
    static KictOutCard(cardid :number ) {

        Log.w(" 给服务器发送打牌 数据  cardid:   ",cardid  )
        type Packet = typeof pb.C2SMahChuPai;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SMahChuPai);
        let packet = new CmmProto<pb.C2SMahChuPai>(Packet);
        packet.cmd = ProtoDef.pb.C2SMahChuPai;
        packet.data = new Packet();
        packet.data.mjId=cardid;
        this.service?.send(packet);
    }


    /** 碰牌 */
    static PengCard(cardid :number ) {
        type Packet = typeof pb.C2SMahHPG;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SMahHPG);
        let packet = new CmmProto<pb.C2SMahHPG>(Packet);
        packet.cmd = ProtoDef.pb.C2SMahHPG;
        packet.data = new Packet();
        packet.data.mjId=cardid;
        packet.data.operate = MahHPGOPerate.HPG_Peng;
        this.service?.send(packet);
    }

    /** 杠牌 */
    static GangCard(cardid :number ,gangType:number ) {
        type Packet = typeof pb.C2SMahHPG;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SMahHPG);
        let packet = new CmmProto<pb.C2SMahHPG>(Packet);
        packet.cmd = ProtoDef.pb.C2SMahHPG;
        packet.data = new Packet();
        packet.data.mjId=cardid;
        packet.data.operate = gangType;

        // Log.w(" C2S GangCard   cardid ",cardid)
        // Log.w(" C2S GangCard   operate ",gangType)

        this.service?.send(packet);
    }


    /** 胡牌 */
    static HuCard(cardid :number ) {
        type Packet = typeof pb.C2SMahHPG;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SMahHPG);
        let packet = new CmmProto<pb.C2SMahHPG>(Packet);
        packet.cmd = ProtoDef.pb.C2SMahHPG;
        packet.data = new Packet();
        packet.data.mjId=cardid;
        packet.data.operate = MahHPGOPerate.HPG_Hu;
        this.service?.send(packet);
        Log.w(" C2SMahHPG  HuCard cardid ",cardid)
    }

    
    /** 过 */
    static GiveUp() {

        type Packet = typeof pb.C2SMahHPG;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SMahHPG);
        let packet = new CmmProto<pb.C2SMahHPG>(Packet);
        packet.cmd = ProtoDef.pb.C2SMahHPG;
        packet.data = new Packet();
        packet.data.mjId=0;
        packet.data.operate = MahHPGOPerate.HPG_Guo;
        this.service?.send(packet);
    }

    /** 明牌 */
    static MingPai() {

        type Packet = typeof pb.C2SMahMingPai;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SMahMingPai);
        let packet = new CmmProto<pb.C2SMahMingPai>(Packet);
        packet.cmd = ProtoDef.pb.C2SMahMingPai;
        packet.data = new Packet();
        this.service?.send(packet);
    }



    /** 主动请求重连 */
    static ReQuestMJConect() {
        // type Packet = typeof pb.C2SMahReqPlayerTable;
        // let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SMahReqPlayerTable);
        // let packet = new CmmProto<pb.C2SMahReqPlayerTable>(Packet);
        // packet.cmd = ProtoDef.pb.C2SMahReqPlayerTable;
        // packet.data = new Packet();
        // this.service?.send(packet);
    }

    /** 请求 匹配下一局 */
    static NextGameFinal() {
        type Packet = typeof pb.C2SNextMatch;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SNextMatch);
        let packet = new CmmProto<pb.C2SNextMatch>(Packet);
        packet.cmd = ProtoDef.pb.C2SNextMatch;
        packet.data = new Packet();

        packet.data.gameType = RoomManager.gameType;
        packet.data.tableCfgId = RoomManager.roomcfgId
        this.service?.send(packet);
    }

    
    /** 请求 局内战绩 */
    static ReQuestLiuShui() {
        type Packet = typeof pb.C2SMahLiuShui;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SMahLiuShui);
        let packet = new CmmProto<pb.C2SMahLiuShui>(Packet);
        packet.cmd = ProtoDef.pb.C2SMahLiuShui;
        packet.data = new Packet();
        this.service?.send(packet);
    }

    

    /** 胡牌后 是否打开道具界面 */
    static OnC2SPropTableState(open:number) {
        Log.e(" OnC2SPropTableState   open:  ",open)
        type Packet = typeof pb.C2SPropTableState;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SPropTableState);
        let packet = new CmmProto<pb.C2SPropTableState>(Packet);
        packet.cmd = ProtoDef.pb.C2SPropTableState;
        packet.data = new Packet();
        packet.data.open = open;
        this.service?.send(packet);
    }


    


    /** GM 命令 */
    static ReS2CMahTestMsg( type :number,cardArr:number[] ) {
        // Log.w  ("ReS2CMahTestMsg  type  ",type,cardArr)
        type Packet = typeof pb.C2SMahTestMsg;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SMahTestMsg);
        let packet = new CmmProto<pb.C2SMahTestMsg>(Packet);
        packet.cmd = ProtoDef.pb.C2SMahTestMsg;
        packet.data = new Packet();
        packet.data.param1 =type;
        packet.data.param2 =cardArr;
        this.service?.send(packet);
    }


    
}
