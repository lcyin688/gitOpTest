import { Config, ViewZOrder } from "../../../../scripts/common/config/Config";
import GameData from "../../../../scripts/common/data/GameData";
import { GameEvent } from "../../../../scripts/common/event/GameEvent";
import FLevel2UI from "../../../../scripts/common/fairyui/FLevel2UI";
import RealAuth from "../../../../scripts/common/fairyui/RealAuth";
import { CmmProto } from "../../../../scripts/common/net/CmmProto";
import { ActivityType, ActOption, GsCat, PlayerAttr } from "../../../../scripts/def/GameEnums";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";
import { Logic } from "../../../../scripts/framework/core/logic/Logic";
import HallView from "../view/HallView";


export class HallLogic extends Logic {


    private popManager:FLevel2UI[] = [];
    private curPop:FLevel2UI = null;
    
    private view:HallView = null;

    private id = null;
    public constructor(){
        super();
        this.id = Manager.utils.rand(0,1000000);
    }

    onDestroy(): void {
        Log.d("HallLogic onDestroy",this.id); 
        this.clearProto();
    }

    onLoad( gameView : GameView):void{
        super.onLoad(gameView);
        this.view = gameView as HallView;
        Log.d("HallLogic onLoad:",this.id,this.view);
        //人物属性操作
        this.registerProto(ProtoDef.pb.S2CSetPortraits, this.onS2CSetPortraits);
        this.registerProto(ProtoDef.pb.S2CTrueNameAuth, this.onS2CTrueNameAuth);
        this.registerProto(ProtoDef.pb.S2CSetGender, this.onS2CSetGender);
        this.registerProto(ProtoDef.pb.S2CHideMe, this.onS2CHideMe);
        this.registerProto(ProtoDef.pb.S2CSetName, this.onS2CSetName);
        this.registerProto(ProtoDef.pb.S2CSetPortBorder, this.onS2CSetPortBorder);
        this.registerProto(ProtoDef.pb.S2CZhanJi, this.onS2CZhanJi);
        this.registerProto(ProtoDef.pb.S2CZhanJiTableInfo, this.onS2CZhanJiTableInfo);

        //大厅游戏列表
        this.registerProto(ProtoDef.pb.S2CGames, this.onS2CGames);
  
        // this.registerProto(ProtoDef.pb.S2CExitMatch, this.onS2CExitMatch);
        // // this.registerProto(ProtoDef.pb.S2CEnterTable, this.onS2CEnterTable);
        // this.registerProto(ProtoDef.pb.S2CMatchUpdate, this.onS2CMatchUpdate);
        this.registerProto(ProtoDef.pb.S2CBackLobby, this.onS2CBackLobby);
        // this.registerProto(ProtoDef.pb.S2CPoChanMsg, this.onS2CPoChanMsg);





        //邮件
        this.registerProto(ProtoDef.pb.S2CMails, this.onS2CMails);
        this.registerProto(ProtoDef.pb.S2CDelMail, this.onS2CDelMail);
        this.registerProto(ProtoDef.pb.S2CGetMailAtta, this.onS2CGetMailAtta);
        this.registerProto(ProtoDef.pb.S2CReadMail, this.onS2CReadMail)

        //排行榜
        this.registerProto(ProtoDef.pb.S2CGetRankList, this.onS2CGetRankList);
        this.registerProto(ProtoDef.pb.S2CRankRewardCfgs, this.onS2CRankRewardCfgs);






        //活动
        this.registerProto(ProtoDef.pb.S2CActivityData, this.onS2CActivityData);
        this.registerProto(ProtoDef.pb.S2CDoActivity, this.onS2CDoActivity);
        this.registerProto(ProtoDef.pb.S2CActNotice, this.onS2CActNotice);
    

        this.registerProto(ProtoDef.pb.S2CZaiXianInfo, this.onS2CZaiXianInfo);
        this.registerProto(ProtoDef.pb.S2CZaiXianReward, this.onS2CZaiXianReward);

        this.registerProto(ProtoDef.pb.S2CGetMoneyDetail, this.onS2CGetMoneyDetail);
        this.registerProto(ProtoDef.pb.S2CGetMoneyCfgs, this.onS2CGetMoneyCfgs);
        this.registerProto(ProtoDef.pb.S2CGetMoney, this.onS2CGetMoney)
        this.registerProto(ProtoDef.pb.S2CGetInviteList, this.onS2CGetInviteList)
    }

    ////////////////////////////////////////////////////////

    public logined(){
        type Packet = typeof pb.C2SLogined;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SLogined);
        let packet = new CmmProto<pb.C2SLogined>(Packet);
        packet.cmd = ProtoDef.pb.C2SLogined;
        packet.data = new Packet();
        this.service?.send(packet);
        Log.d("==========logined==============");
    }

    public modifyHeadIcon(id:number){
        type Packet = typeof pb.C2SSetPortraits;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SSetPortraits);
        let packet = new CmmProto<pb.C2SSetPortraits>(Packet);
        packet.cmd = ProtoDef.pb.C2SSetPortraits;
        packet.data = new Packet();
        packet.data.iconId = id;
        this.service?.send(packet);
    }

    
    public modifySetName(data:string){
        type Packet = typeof pb.C2SSetName;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SSetName);
        let packet = new CmmProto<pb.C2SSetName>(Packet);
        packet.cmd = ProtoDef.pb.C2SSetName;
        packet.data = new Packet();
        packet.data.name = data;
        this.service?.send(packet);
    }

    public modifySex(data:pb.GenderType){
        type Packet = typeof pb.C2SSetGender;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SSetGender);
        let packet = new CmmProto<pb.C2SSetGender>(Packet);
        packet.cmd = ProtoDef.pb.C2SSetGender;
        packet.data = new Packet();
        packet.data.sex = data;
        this.service?.send(packet);
    }

    public hideMe(data:boolean){
        type Packet = typeof pb.C2SHideMe;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SHideMe);
        let packet = new CmmProto<pb.C2SHideMe>(Packet);
        packet.cmd = ProtoDef.pb.C2SHideMe;
        packet.data = new Packet();
        packet.data.hide = data;
        this.service?.send(packet);
    }

    public modifyPortBorder(data:number){
        type Packet = typeof pb.C2SSetPortBorder;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SSetPortBorder);
        let packet = new CmmProto<pb.C2SSetPortBorder>(Packet);
        packet.cmd = ProtoDef.pb.C2SSetPortBorder;
        packet.data = new Packet();
        packet.data.id = data;
        this.service?.send(packet);
    }

    public locat(data:string){
        type Packet = typeof pb.C2SLocat;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SLocat);
        let packet = new CmmProto<pb.C2SLocat>(Packet);
        packet.cmd = ProtoDef.pb.C2SLocat;
        packet.data = new Packet();
        packet.data.data = data;
        this.service?.send(packet);
    }

    public trueNameAuth(idNum:string,name:string){
        type Packet = typeof pb.C2STrueNameAuth;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2STrueNameAuth);
        let packet = new CmmProto<pb.C2STrueNameAuth>(Packet);
        packet.cmd = ProtoDef.pb.C2STrueNameAuth;
        packet.data = new Packet();
        packet.data.idNum = idNum;
        packet.data.name = name;
        this.service?.send(packet);
    }

    public getGameList(){
        type Packet = typeof pb.C2SGames;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGames);
        let packet = new CmmProto<pb.C2SGames>(Packet);
        packet.cmd = ProtoDef.pb.C2SGames;
        packet.data = new Packet();
        this.service?.send(packet);
        // Manager.loading.showId("TS_DaTing_11",function(){
        //     Manager.tips.showFromId("TS_DaTing_12");
        // });
    }

    public getGameTables(gameId:number){
        type Packet = typeof pb.C2SGetTables;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGetTables);
        let packet = new CmmProto<pb.C2SGetTables>(Packet);
        packet.cmd = ProtoDef.pb.C2SGetTables;
        packet.data = new Packet();
        packet.data.gameType = gameId;
        this.service?.send(packet);
    }



    public openGridGameList(gameId:number = -1){
        type Packet = typeof pb.C2SEnterGame;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SEnterGame);
        let packet = new CmmProto<pb.C2SEnterGame>(Packet);
        packet.cmd = ProtoDef.pb.C2SEnterGame;
        packet.data = new Packet();
        packet.data.game = gameId;
        packet.data.gsCat = GsCat.GsCat_Rank;
        this.service?.send(packet);
        Log.d("openGameList:",gameId);
        Manager.loading.show("请求赛季列表中",function(){
            Manager.tips.show("服务器返回数据超时,赛季列表消息未响应");
        });
    }



    public nextMatchTable(gameType:number,tableCfgId:number){
        type Packet = typeof pb.C2SNextMatch;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SNextMatch);
        let packet = new CmmProto<pb.C2SNextMatch>(Packet);
        packet.cmd = ProtoDef.pb.C2SNextMatch;
        packet.data = new Packet();
        packet.data.gameType = gameType;
        packet.data.tableCfgId = tableCfgId;
        this.service?.send(packet);
        Log.d("nextMatchTable:",packet);
    }






    //邮件
    public openEmail(){
        type Packet = typeof pb.C2SMails;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SMails);
        let packet = new CmmProto<pb.C2SMails>(Packet);
        packet.cmd = ProtoDef.pb.C2SMails;
        packet.data = new Packet();
        this.service?.send(packet);
    }

    public readMail(eil:number[]){
        type Packet = typeof pb.C2SReadMail;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SReadMail);
        let packet = new CmmProto<pb.C2SReadMail>(Packet);
        packet.cmd = ProtoDef.pb.C2SReadMail;
        packet.data = new Packet();
        packet.data.ids = eil;
        this.service?.send(packet);
    }
    
    public getMailAtta(eil:number[]){
        type Packet = typeof pb.C2SGetMailAtta;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGetMailAtta);
        let packet = new CmmProto<pb.C2SGetMailAtta>(Packet);
        packet.cmd = ProtoDef.pb.C2SGetMailAtta;
        packet.data = new Packet();
        packet.data.ids = eil;
        this.service?.send(packet);
    }

    public delMail(eil:number[]){
        type Packet = typeof pb.C2SDelMail;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SDelMail);
        let packet = new CmmProto<pb.C2SDelMail>(Packet);
        packet.cmd = ProtoDef.pb.C2SDelMail;
        packet.data = new Packet();
        packet.data.ids = eil;
        this.service?.send(packet);
    }

    //排行榜
    getRankList(cat:number){
        type Packet = typeof pb.C2SGetRankList;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGetRankList);
        let packet = new CmmProto<pb.C2SGetRankList>(Packet);
        packet.cmd = ProtoDef.pb.C2SGetRankList;
        packet.data = new Packet();
        packet.data.cat = cat;
        this.service?.send(packet);
    }

    //排行榜
    getRankReward(cat:number){
        type Packet = typeof pb.C2SGetRankReward;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGetRankReward);
        let packet = new CmmProto<pb.C2SGetRankReward>(Packet);
        packet.cmd = ProtoDef.pb.C2SGetRankReward;
        packet.data = new Packet();
        packet.data.cat = cat;
        this.service?.send(packet);
    }

    //排行榜
    rankRewardCfgs(){

        if (Manager.gd.get(ProtoDef.pb.S2CRankRewardCfgs) != null){
            Log.d("排行榜配置已存在不需要请求了");
            return;
        }

        type Packet = typeof pb.C2SRankRewardCfgs;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SRankRewardCfgs);
        let packet = new CmmProto<pb.C2SRankRewardCfgs>(Packet);
        packet.cmd = ProtoDef.pb.C2SRankRewardCfgs;
        packet.data = new Packet();
        this.service?.send(packet);
    }

    //请求成就配置
    gradeCfgs(){
        if (Manager.gd.get(ProtoDef.pb.S2CGradeCfgs) != null){
            Log.d("成就配置已存在不需要请求了");
            return;
        }


        type Packet = typeof pb.C2SGradeCfgs;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGradeCfgs);
        let packet = new CmmProto<pb.C2SGradeCfgs>(Packet);
        packet.cmd = ProtoDef.pb.C2SGradeCfgs;
        packet.data = new Packet();
        this.service?.send(packet);
    }
    // //领取成就奖励
    // getGradeReward(lv:number){
    //     type Packet = typeof pb.C2SGetGradeReward;
    //     let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGetGradeReward);
    //     let packet = new CmmProto<pb.C2SGetGradeReward>(Packet);
    //     packet.cmd = ProtoDef.pb.C2SGetGradeReward;
    //     packet.data = new Packet();
    //     packet.data.grade = lv;
    //     this.service?.send(packet);
    // }

    // getAchievCfg(){
    //     type Packet = typeof pb.C2SAchievCfg;
    //     let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SAchievCfg);
    //     let packet = new CmmProto<pb.C2SAchievCfg>(Packet);
    //     packet.cmd = ProtoDef.pb.C2SAchievCfg;
    //     packet.data = new Packet();
    //     this.service?.send(packet);
    //     Log.d("getAchievCfg:",packet);
    // }


    onEventSilentGoHall(){
        let data = Manager.gd.get<pb.S2CGetTables>(ProtoDef.pb.S2CGetTables);
        //服务给的值不确定有默认值，有时候是null。。。
        if(data != null && data.quick != null && data.quick.catName != null && data.quick.cfgId != null && data.quick.catName.length > 0 && data.quick.cfgId > 0){
            this.gobackLobby();
        }
    }

    gobackLobby(){
        type Packet = typeof pb.C2SGobackLobby;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGobackLobby);
        let packet = new CmmProto<pb.C2SGobackLobby>(Packet);
        packet.cmd = ProtoDef.pb.C2SGobackLobby;
        packet.data = new Packet();
        Manager.loading.showId("TS_DaTing_9",function(){
            Manager.tips.showFromId("TS_DaTing_10");
        });
        this.service?.send(packet);
        Log.d("gobackLobby:",packet);
    }

    getMoney(id:number,pa:string){
        type Packet = typeof pb.C2SGetMoney;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGetMoney);
        let packet = new CmmProto<pb.C2SGetMoney>(Packet);
        packet.cmd = ProtoDef.pb.C2SGetMoney;
        packet.data = new Packet();
        packet.data.id = id;
        packet.data.param = pa;
        this.service?.send(packet);
        Log.d("C2SGetMoney:",packet);
    }

    //段位
    getSeasonDuanWeiCfg(cat:number){
        type Packet = typeof pb.C2SGetSeasonDuanWeiCfg;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGetSeasonDuanWeiCfg);
        let packet = new CmmProto<pb.C2SGetSeasonDuanWeiCfg>(Packet);
        packet.cmd = ProtoDef.pb.C2SGetSeasonDuanWeiCfg;
        packet.data = new Packet();
        packet.data.gameCat = cat;
        this.service?.send(packet);
        Log.d("getSeasonDuanWeiCfg:",packet);
    }

    getSeasonHisRankList(cat:number){
        type Packet = typeof pb.C2SSeasonHisRankList;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SSeasonHisRankList);
        let packet = new CmmProto<pb.C2SSeasonHisRankList>(Packet);
        packet.cmd = ProtoDef.pb.C2SSeasonHisRankList;
        packet.data = new Packet();
        packet.data.gameCat = cat;
        this.service?.send(packet);
        Log.d("seasonHisRankList:",packet);
    }

    getSeasonRewardCfg(cat:number){
        type Packet = typeof pb.C2SGetSeasonRewardCfg;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGetSeasonRewardCfg);
        let packet = new CmmProto<pb.C2SGetSeasonRewardCfg>(Packet);
        packet.cmd = ProtoDef.pb.C2SGetSeasonRewardCfg;
        packet.data = new Packet();
        packet.data.gameCat = cat;
        this.service?.send(packet);
        Log.d("getSeasonRewardCfg:",packet);
    }




    getZhanJi(tableId:number=-1){
        type Packet = typeof pb.C2SZhanJi;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SZhanJi);
        let packet = new CmmProto<pb.C2SZhanJi>(Packet);
        packet.cmd = ProtoDef.pb.C2SZhanJi;
        packet.data = new Packet();
        packet.data.tableId = tableId;
        this.service?.send(packet);
        Log.d("C2SZhanJi:",packet);
    }

    getZhanJiTableInfo(){
        type Packet = typeof pb.C2SZhanJiTableInfo;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SZhanJiTableInfo);
        let packet = new CmmProto<pb.C2SZhanJiTableInfo>(Packet);
        packet.cmd = ProtoDef.pb.C2SZhanJiTableInfo;
        packet.data = new Packet();
        this.service?.send(packet);
        Log.d("C2SZhanJiTableInfo:",packet);
    }

    //活动
    getActivityData(aid:number){
        type Packet = typeof pb.C2SActivityData;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SActivityData);
        let packet = new CmmProto<pb.C2SActivityData>(Packet);
        packet.cmd = ProtoDef.pb.C2SActivityData;
        packet.data = new Packet();
        packet.data.id = aid;
        this.service?.send(packet);
        Log.d("C2SActivityData:",packet);
    }

    getActivityRotary(){
        let data = Manager.gd.get<pb.S2CActivityInfo>(ProtoDef.pb.S2CActivityInfo);
        if(!data){
            Manager.tips.show("活动未开启");
            return;
        }
        Log.d("getActivityRotary:",data);
        for (let index = 0; index < data.data.length; index++) {
            if(data.data[index].type == ActivityType.ActivityType_Lottery){
                this.getActivityData(data.data[index].id);
                return;
            }
        }
        Manager.tips.show("转盘活动未开启");
    }

    getActivityDailyBonus(){
        let data = Manager.gd.get<pb.S2CActivityInfo>(ProtoDef.pb.S2CActivityInfo);
        if(!data){
            Manager.tips.show("活动未开启");
            return;
        }
        Log.d("getActivityRotary:",data);
        for (let index = 0; index < data.data.length; index++) {
        if(data.data[index].type == ActivityType.ActivityType_Login){
                this.getActivityData(data.data[index].id);
                return;
            }
        }
        Manager.tips.show("七日签到活动未开启");
    }

    doActivity(aid:number,t:ActOption,sid:number=-1){
        type Packet = typeof pb.C2SDoActivity;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SDoActivity);
        let packet = new CmmProto<pb.C2SDoActivity>(Packet);
        packet.cmd = ProtoDef.pb.C2SDoActivity;
        packet.data = new Packet();
        packet.data.id = aid;
        packet.data.opType = t;
        if(sid >-1){
            packet.data.subId = sid;
        }
        this.service?.send(packet);
        Log.d("C2SDoActivity",packet);
    }

    getZaiXianInfo(){
        type Packet = typeof pb.C2SZaiXianInfo;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SZaiXianInfo);
        let packet = new CmmProto<pb.C2SZaiXianInfo>(Packet);
        packet.cmd = ProtoDef.pb.C2SZaiXianInfo;
        packet.data = new Packet();
        this.service?.send(packet);
        Log.d("C2SZaiXianInfo",packet);
    }


    


    zaiXianReward(aid:number){
        type Packet = typeof pb.C2SZaiXianReward;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SZaiXianReward);
        let packet = new CmmProto<pb.C2SZaiXianReward>(Packet);
        packet.cmd = ProtoDef.pb.C2SZaiXianReward;
        packet.data = new Packet();
        packet.data.id = aid;
        this.service?.send(packet);
        Log.d("C2SZaiXianReward",packet);
    }
    //////////////////////////////////////////////
    
    protected onS2CSetPortraits(data :pb.S2CSetPortraits){
        Log.d("onS2CSetPortraits：",data);
        let gd = Manager.dataCenter.get(GameData);
        let pData = gd.player();
        pData.portraits = "file://" + data.iconId;
        this.view.headUi.refreshHeadIcon();
    }

    protected onS2CTrueNameAuth(data :pb.S2CTrueNameAuth){
        Log.d("onS2CTrueNameAuth",data);
        Manager.loading.hide();
        if(data.result == 1){
            Manager.uiManager.close(RealAuth);
        }else{
            Manager.tips.show("认证失败，请重新认证");
        }
    }

    public checkRealAuth(){
        let cfgs = Manager.gd.get<pb.S2CCfgs>(ProtoDef.pb.S2CCfgs);
        if(cfgs == null){
            return;
        }
        if(cfgs.authRewards == null){
            return;
        }
        let uiconfig = Manager.gd.get<pb.S2CUISwitches>(ProtoDef.pb.S2CUISwitches);

    Log.e (" real_auth ffffffff  ",uiconfig);
    Log.e (" real_auth  ~  ",uiconfig.items["real_auth"]);

        if(uiconfig == null || uiconfig.items == null){
            return;
        }
        if(uiconfig.items["real_auth"] == null){
            return;
        }

        if(uiconfig.items["real_auth"] == 0){
            return;
        }
        if (Manager.gd.playerAttr(PlayerAttr.PA_TrueNameAuth) == 0){
            Manager.uiManager.openFairy({ type: RealAuth, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.UI, name: "实名认证" });
        }
    }



    
    public quickStart(){
        type Packet = typeof pb.C2SQuickStart;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SQuickStart);
        let packet = new CmmProto<pb.C2SQuickStart>(Packet);
        packet.cmd = ProtoDef.pb.C2SQuickStart;
        packet.data = new Packet();
        this.service?.send(packet);
        Log.d("C2SQuickStart",packet);
    }

    protected onS2CSetGender(data :pb.S2CSetGender){
        Log.d("S2CSetGender",data);
        let gd = Manager.dataCenter.get(GameData);
        gd.setPlayerAttr(PlayerAttr.PA_Gender,data.sex);
    }

    protected onS2CHideMe(data :pb.S2CHideMe){
        Log.d("S2CHideMe",data);
    }

    protected onS2CSetName(data :pb.S2CSetName){
        Log.d("S2CSetName",data);
        if (data.result == 1){
            let gd = Manager.dataCenter.get(GameData);
            let pData = gd.player();
            pData.name = data.name;
            this.view.headUi.refreshNick();
            Manager.tips.show("修改成功");
        }else if(data.result == 2){
            Manager.tips.show("昵称非法");
        }else{
            Manager.tips.show("修改失败");
        }
    }

    protected onS2CSetPortBorder(data :pb.S2CSetPortBorder){
        Log.d("S2CSetPortBorder",data);
        let gd = Manager.dataCenter.get(GameData);
        gd.setPlayerAttr(PlayerAttr.PA_PortBorder,data.id);
    }

    protected onS2CZhanJi(data :pb.S2CZhanJi){
        Log.d("onS2CZhanJi",data);
        dispatch(ProtoDef.pb.S2CZhanJi,data);
    }

    protected onS2CZhanJiTableInfo(data :pb.S2CZhanJiTableInfo){
        Log.d("onS2CZhanJiTableInfo",data);
        dispatch(ProtoDef.pb.S2CZhanJiTableInfo,data);
    }

    protected onS2CGames(data :pb.S2CGames){
        Log.d("onS2CGames",data);
        if(data.items.length == 0){
            Manager.tips.debug("错误，服务器返回onS2CGames中的游戏列表长度为0,尝试重新请求");
            // this.getGameList();

            return;
        }
        for (let index = 0; index < data.items.length; index++) {
            this.view.bindGameID(index+1,data.items[index]);
            this.getSeasonDuanWeiCfg(data.items[index].id);
            this.getSeasonRewardCfg(data.items[index].id);
        }
        Manager.dataCenter.get(GameData).put(ProtoDef.pb.S2CGames,data);
        Manager.loading.hide();
    }

    


    // protected onS2CEnterTable(data :pb.S2CEnterTable){
    //     Log.d("玩家 进入游戏  onS2CEnterTable",data);

    // }

    // protected onS2CMahTableData(data :pb.S2CMahTableData){
    //     Log.d("正式进入游戏  S2CMahTableData",data);
  




    // }
    


    // protected onS2CPoChanMsg(data :pb.S2CPoChanMsg){
    //     Manager.tips.show("您的钱不够请前往充值");
    //     this.getShopItems();
    // }
    
    protected onS2CBackLobby(data :pb.S2CBackLobby){
        Log.d("onS2CBackLobby",data);
        this.view.gameLevel.hide();
        this.view.grid.hide();
        Manager.loading.hide();
        Manager.uiManager.closeExcept([HallView]);
        this.getGameList();
    }



    //邮件
    protected onS2CMails(data :pb.S2CMails){
        Log.d("S2CMails",data);
        this.view.onEmailOpen(data);
    }

    protected onS2CDelMail(data :pb.S2CDelMail){
        Log.d("onS2CDelMail",data);
        this.openEmail();
    }

    protected onS2CGetMailAtta(data :pb.S2CGetMailAtta){
        Log.d("S2CGetMailAtta",data);
        this.openEmail();
        this.view.email.showRward(data);
    }

    protected onS2CReadMail(data :pb.S2CReadMail){
        Log.d("S2CReadMail",data);
    }

    protected onS2CGetRankList(data :pb.S2CGetRankList){
        Log.d("onS2CGetRankList",data);
        dispatch(GameEvent.UI_Rank_RefreshList,data);
    }

    protected onS2CRankRewardCfgs(data :pb.S2CRankRewardCfgs){
        Log.d("onS2CRankRewardCfgs",data);
        Manager.dataCenter.get(GameData).put(ProtoDef.pb.S2CRankRewardCfgs,data.items);
    }








    
    protected onS2CActivityData(data:pb.S2CActivityData){
        for (let index = 0; index < data.data.length; index++) {
            let key = ProtoDef.pb.S2CActivityData+"_"+data.data[index].cfg.type;
            Log.d("onS2CActivityData:",key," ->",data);
            dispatch(key,data.data[index].cfg);
        }
    }

    protected onS2CDoActivity(data:pb.S2CDoActivity){
        Log.d("onS2CDoActivity:",data);
        dispatch(ProtoDef.pb.S2CDoActivity+"_"+data.aType,data);  
    }

    protected onS2CZaiXianInfo(data:pb.S2CZaiXianInfo){
        Log.d("onS2CZaiXianInfo:",data);
        dispatch(ProtoDef.pb.S2CZaiXianInfo,data); 
    }

    protected onS2CZaiXianReward(data:pb.S2CZaiXianReward){
        Log.d("onS2CZaiXianReward:",data);
        dispatch(ProtoDef.pb.S2CZaiXianReward,data); 
    }


    getMoneyDetail(){
        type Packet = typeof pb.C2SGetMoneyDetail;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGetMoneyDetail);
        let packet = new CmmProto<pb.C2SGetMoneyDetail>(Packet);
        packet.cmd = ProtoDef.pb.C2SGetMoneyDetail;
        packet.data = new Packet();
        this.service?.send(packet);
        Log.d("C2SGetMoneyDetail:",packet);
    }

    getMoneyCfgs(){
        type Packet = typeof pb.C2SGetMoneyCfgs;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGetMoneyCfgs);
        let packet = new CmmProto<pb.C2SGetMoneyCfgs>(Packet);
        packet.cmd = ProtoDef.pb.C2SGetMoneyCfgs;
        packet.data = new Packet();
        this.service?.send(packet);
        Log.d("C2SGetMoneyCfgs:",packet);
    }

    onS2CGetMoneyDetail(data:pb.S2CGetMoneyDetail){
        Log.d("onS2CGetMoneyDetail:",data);
        dispatch(ProtoDef.pb.S2CGetMoneyDetail,data);
    }

    onS2CGetMoneyCfgs(data:pb.S2CGetMoneyCfgs){
        Log.d("onS2CGetMoneyCfgs:",data);
        dispatch(ProtoDef.pb.S2CGetMoneyCfgs,data);
    }

    onS2CGetMoney(data:pb.S2CGetMoney){
        if(data.ec == 1){
            Manager.tips.show("订单已提交");
        }
    }

    onS2CGetInviteList(data:pb.S2CGetInviteList){
        dispatch(ProtoDef.pb.S2CGetInviteList,data);
    }
    
    getInviteList(){
        type Packet = typeof pb.C2SGetInviteList;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGetInviteList);
        let packet = new CmmProto<pb.C2SGetInviteList>(Packet);
        packet.cmd = ProtoDef.pb.C2SGetInviteList;
        packet.data = new Packet();
        this.service?.send(packet);
        Log.d("C2SGetInviteList:",packet);
    }

    
    public getActivityNotice(){
        type Packet = typeof pb.C2SActNotice;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SActNotice);
        let packet = new CmmProto<pb.C2SActNotice>(Packet);
        packet.cmd = ProtoDef.pb.C2SActNotice;
        packet.data = new Packet();
        this.service?.send(packet);
        Log.d("C2SActNotice:",packet);
    }

    onS2CActNotice(data:pb.S2CActNotice){
        Log.d("onS2CActNotice:",data);
        Manager.gd.put(ProtoDef.pb.S2CActNotice,data);
        dispatch(ProtoDef.pb.S2CActNotice,data);
    }
    
    addToPopQueue(v:FLevel2UI){
        this.popManager.push(v);
    }

    showPop(){
        if(this.curPop != null){
            return;
        }
        Log.d("this.popManager.length",this.popManager.length);
        if(this.popManager.length > 0){
            this.curPop = this.popManager.pop();
            this.curPop.show();
        }
    }

    clearPop(){
        if(this.curPop != null){
            this.curPop = null;
        }
    }

    public getGridRank(rank:number){
        type Packet = typeof pb.C2SSeasonRankList;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SSeasonRankList);
        let packet = new CmmProto<pb.C2SSeasonRankList>(Packet);
        packet.cmd = ProtoDef.pb.C2SSeasonRankList;
        packet.data = new Packet();
        packet.data.areaId = rank;
        this.service?.send(packet);
        Log.d("C2SSeasonRankList:",packet);
    }



















}
