/**
 * @description 子游戏连接服务
 */
import { BoxFuncType, ErrorCode, GameCat, GroupId, IapType, KickReason, PlayerLoc, PoChanTable, ScoreType, TabType } from "../../def/GameEnums";
import { ProtoDef } from "../../def/ProtoDef";
import { Config, NetPriority, ViewZOrder } from "../config/Config";
import GameData from "../data/GameData";
import { CommonEvent } from "../event/CommonEvent";
import { GameEvent } from "../event/GameEvent";
import GridUpgrade from "../fairyui/GridUpgrade";
import GameMatches from "../fairyui/GameMatches";
import RecommendChongZhi from "../fairyui/RecommendChongZhi";
import { GameMessageQuaue } from "../Quaue/GameMessageQuaue";
import { CmmProto } from "./CmmProto";

import { CommonService } from "./CommonService";
import PlayTimeOut from "../fairyui/PlayTimeOut";
import TopupHints from "../fairyui/TopupHints";
import BeInvited from "../fairyui/BeInvited";
import EnterGameProp from "../fairyui/EnterGameProp";
import { Macro } from "../../framework/defines/Macros";

import { Utils } from "../utils/Utils";
import VipDialog from "../fairyui/VipDialog";

export class GameService extends CommonService {
    static module = "GameService";
    priority = NetPriority.Game;

    private messageQuaue: GameMessageQuaue;

    /**@description 网络连接成功 */
    onOpen(ev: Event) {
        super.onOpen(ev);
        dispatch(CommonEvent.GAME_SERVICE_CONNECTED, this);
    }

    /**@description 网络关闭 */
    onClose(ev: Event) {
        super.onClose(ev);
        dispatch(CommonEvent.GAME_SERVICE_CLOSE, this);
    }

    SetReconectEnable(isEnable:boolean)
    {
        this.reconnectHandler.enabled = isEnable;
    }

    constructor(){
        super();
  
        this.reconnectHandler.enabled = true;
        this.registerProto(ProtoDef.rpc.S2CKickOut, this.onS2CKickOut);
        this.registerProto(ProtoDef.pb.S2CError, this.onErrCode);
        this.registerProto(ProtoDef.pb.S2CTipMsg, this.onS2CTipMsg);
        this.registerProto(ProtoDef.pb.S2CPing, this.onPing);
        this.registerProto(ProtoDef.pb.S2CUpdatePlayer, this.onS2CUpdatePlayer);
        this.registerProto(ProtoDef.pb.S2CPlayerAttr, this.onS2CPlayerAttr);
        this.registerProto(ProtoDef.pb.S2CCurrency, this.onS2CCurrency);
        this.registerProto(ProtoDef.pb.S2CViewPlayer, this.onS2CViewPlayer);
        this.registerProto(ProtoDef.pb.S2CGroupValue, this.onS2CGroupValue);
        this.registerProto(ProtoDef.pb.S2CUISwitches, this.onS2CUISwitches);
        
        this.registerProto(ProtoDef.pb.S2CShowItems, this.onS2CShowItems);

        //#region 游戏准备之前的消息
        this.registerProto(ProtoDef.pb.S2CMahTableData, this.OnS2CMahTableData);
        this.registerProto(ProtoDef.pb.S2CMahNewPlayerEnter, this.onS2CMahNewPlayerEnter);

        this.registerProto(ProtoDef.pb.S2CGetSeasonDuanWeiCfg, this.onS2CGetSeasonDuanWeiCfg);

        //#endregion
        this.registerProto(ProtoDef.pb.S2CEnterTable, this.onS2CEnterTable);

        this.registerProto(ProtoDef.pb.S2CGetTables, this.onS2CGetTables);

        //斗地主
        this.registerProto(ProtoDef.pb.S2CDouTableInfo, this.onS2CDouTableInfo);
        this.registerProto(ProtoDef.pb.S2CDouPlayerEnter, this.onS2CDouPlayerEnter);



        //全局配置
        this.registerProto(ProtoDef.pb.S2CCfgs, this.onS2CCfgs);       
        
        //保险箱
        this.registerProto(ProtoDef.pb.S2CInSafeBox, this.onS2CInSafeBox);
        this.registerProto(ProtoDef.pb.S2COutSafeBox, this.onS2COutSafeBox);
        
        //活动
        this.registerProto(ProtoDef.pb.S2CActivityInfo, this.onS2CActivityInfo); 

        //破产 救济金 游戏里边外边都要用
        this.registerProto(ProtoDef.pb.S2CPoChanMsg, this.onS2CPoChanMsg);
        this.registerProto(ProtoDef.pb.S2CGetPoChanReWard, this.onS2CGetPoChanReWard);

        this.registerProto(ProtoDef.pb.S2CExitMatch, this.onS2CExitMatch);
        this.registerProto(ProtoDef.pb.S2CMatchUpdate, this.onS2CMatchUpdate);

        //表情
        this.registerProto(ProtoDef.pb.S2CChat, this.onS2CChat);


        //重连
        this.registerProto(ProtoDef.pb.S2CGoOnGame, this.onS2CGoOnGame)
        //刷新斗地主
        this.registerProto(ProtoDef.pb.S2CSyncState, this.onS2CSyncState)
        //shop
        this.registerProto(ProtoDef.pb.S2CGetShopItems, this.onS2CGetShopItems);
        this.registerProto(ProtoDef.pb.S2CBuyShopItem, this.onS2CBuyShopItem);
        //背包
        this.registerProto(ProtoDef.pb.S2CGetBag, this.onS2CGetBag);
        //道具刷新
        this.registerProto(ProtoDef.pb.S2CPropUpdate, this.onS2CPropUpdate);
        //使用道具
        this.registerProto(ProtoDef.pb.S2CUseProp, this.onS2CUseProp);
        //删除道具
        this.registerProto(ProtoDef.pb.S2CDelProp, this.onS2CDelProp);

        //红点变化
        this.registerProto(ProtoDef.pb.S2CRedDotChange, this.onS2CRedDotChange);
        

        //邀请好友
        this.registerProto(ProtoDef.pb.S2CGetIdlePlayers, this.onS2CGetIdlePlayers);
        this.registerProto(ProtoDef.pb.S2CInviteNotify, this.onS2CInviteNotify);
        

        //兑换红包
        this.registerProto(ProtoDef.pb.S2CGiveBeginnerMoney, this.onS2CGiveBeginnerMoney);

        //跑马灯
        this.registerProto(ProtoDef.pb.S2CRollingNotice, this.onS2CRollingNotice);

        //跑马灯删除
        this.registerProto(ProtoDef.pb.S2CDeleteNotice, this.onS2CDeleteNotice);
        

        //退出桌子
        this.registerProto(ProtoDef.pb.S2CExitTable, this.onS2CExitTable);
        //广告生效数据
        this.registerProto(ProtoDef.pb.S2CAdCfgs, this.onS2CAdCfgs);

        //广告免输免赢次数
        this.registerProto(ProtoDef.pb.S2CGameEndGiftValue, this.onS2CGameEndGiftValue);
        

        this.registerProto(ProtoDef.pb.S2CSafeBox,this.onS2CSafeBox);

        this.registerProto(ProtoDef.pb.S2CIapGetOrderId,this.onS2CIapGetOrderId);
        this.registerProto(ProtoDef.pb.S2CShowBox,this.onS2CShowBox);

        //成就配置
        this.registerProto(ProtoDef.pb.S2CGradeCfgs, this.onS2CGradeCfgs);
        this.registerProto(ProtoDef.pb.S2CGetGradeReward, this.onS2CGetGradeReward);
        this.registerProto(ProtoDef.pb.S2CReplyAchiev, this.onS2CReplyAchiev);
        this.registerProto(ProtoDef.pb.S2CAchievReward, this.onS2CAchievReward);
        this.registerProto(ProtoDef.pb.S2CAchievCfg, this.onS2CAchievCfg);

        //赛季排位
        this.registerProto(ProtoDef.pb.S2CDuanWeiChange, this.onS2CDuanWeiChange);
        this.registerProto(ProtoDef.pb.S2CSeasonRankList, this.onS2CSeasonRankList);
        this.registerProto(ProtoDef.pb.S2CSeason, this.onS2CSeason);
        this.registerProto(ProtoDef.pb.S2CSeasonHisRankList, this.onS2CSeasonHisRankList);
        this.registerProto(ProtoDef.pb.S2CGetSeasonRewardCfg, this.onS2CGetSeasonRewardCfg);
        this.registerProto(ProtoDef.pb.S2CGetSeasonReward, this.onS2CGetSeasonReward);
        this.registerProto(ProtoDef.pb.S2CGetDuanWeiReward, this.onS2CGetDuanWeiReward);
        this.registerProto(ProtoDef.pb.S2CDuanWeiReset, this.onS2CDuanWeiReset);

        //百万豪礼
        
        this.registerProto(ProtoDef.pb.S2CGetScoreRewardCfgs, this.onS2CGetScoreRewardCfgs)
        this.registerProto(ProtoDef.pb.S2CGetScoreTop, this.onS2CGetScoreTop)
        this.registerProto(ProtoDef.pb.S2CGetScoreRewardList, this.onS2CGetScoreRewardList)
        this.registerProto(ProtoDef.pb.S2CGetScoreReward, this.onS2CGetScoreReward)
        this.registerProto(ProtoDef.pb.S2CHfqRecharge, this.onS2CHfqRecharge)
        this.registerProto(ProtoDef.pb.S2CWithdrawScore, this.onS2CWithdrawScore)
        this.registerProto(ProtoDef.pb.S2CGetHfqRechargeLog, this.onS2CGetHfqRechargeLog)

        this.registerProto(ProtoDef.pb.S2CMyLbs, this.onS2CMyLbs)
        this.registerProto(ProtoDef.pb.S2CQuickStart, this.onS2CQuickStart)
        
        this.registerProto(ProtoDef.pb.S2CVipCfgs, this.onS2CVipCfgs)
        this.registerProto(ProtoDef.pb.S2CGetVipReward, this.onS2CGetVipReward);
        this.registerProto(ProtoDef.pb.S2CGetVipDayReward, this.onS2CGetVipDayReward);
        this.registerProto(ProtoDef.pb.S2CVipChange, this.onS2CVipChange);
        
        //比赛
        this.registerProto(ProtoDef.pb.S2CRaces, this.onS2CRaces);
        

        this.addEvents();
    }

    loadConfig() {
        this.getC2SVipCfgs();
    }

    protected addEvents() {
        Log.w(" gameService   addEvents   ");

        Manager.dispatcher.add(GameEvent.SDK_CALLID_COMMON, this.OnSDKCallCommon, this);
        Manager.dispatcher.add(GameEvent.SDK_CALLID_LOGIN_WX, this.OnWxSdkLogin, this);
        Manager.dispatcher.add(ProtoDef.pb.C2SGetShowItems, this.OnC2SGetShowItems, this);

    }

    private OnWxSdkLogin(data) {
        Log.d("__ts__onWxSdkLogin",data.code);
        if(data.code == null || data.code.length == 0){
            Manager.tips.show("微信授权失败,请重试!");
            return;
        }
  
        if (data.state == "wxjifen") {
            this.getC2SWithdrawScore(Manager.gd.get("__jfscoreType"), Manager.gd.get("__jfye"),data.code);
            Manager.gd.put("__jfye",null);
            Manager.gd.put("__jfscoreType",null);
        }

        if (data.state == "wxhbtx") {
            this.getMoney(Manager.gd.get("__cfgid"),data.code);
            Manager.gd.put("__cfgid",null);
        }
    }

    getMoney(id:number,pa:string){
        type Packet = typeof pb.C2SGetMoney;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGetMoney);
        let packet = new CmmProto<pb.C2SGetMoney>(Packet);
        packet.cmd = ProtoDef.pb.C2SGetMoney;
        packet.data = new Packet();
        packet.data.id = id;
        packet.data.param = pa;
        this.send(packet);
        Log.d("C2SGetMoney gbtx:",packet);
    }

    private OnSDKCallCommon(data) {
        Log.e("OnSDKCallCommon",data.toString(),data.CallNameCommon );
        if(data.CallNameCommon != null )
        {
            if (data.CallNameCommon =="OnC2SIapReceipt") // 请求验证支付
            {
                this.onC2SIapReceipt(data)
            }
            else if (data.CallNameCommon =="ReplacementOrder") // 补单
            {
                this.onC2SIapReceipt(data)
            }
            else if (data.CallNameCommon =="ShowToast")//文字提示
            {
                Manager.tips.show(data.msgTip);
            }


            

        }

    }
/**
 * @description 注册网络事件
 * @param cmd cmd
 * @param func 处理函数
 * @param handleType 处理数据类型
 * @param isQueue 接收到消息，是否进行队列处理
 */
    protected register(cmd: string, func: (data: any) => void, handleType?: any, isQueue = true) {
        this.addListener(cmd, handleType, func, isQueue, this);
        // Log.d("register msg:",cmd);
    }

    protected registerProto(cmd: any, func: (data: any) => void, isQueue = true) {
        this.register(cmd,func,cmd,isQueue);
    }

    protected onS2CGetSeasonDuanWeiCfg(data :pb.S2CGetSeasonDuanWeiCfg){
        Log.d("onS2CGetSeasonDuanWeiCfg:",data);
        Manager.dataCenter.get(GameData).put(ProtoDef.pb.S2CGetSeasonDuanWeiCfg+"_"+Manager.utils.gt(data.gameCat),data);
        dispatch(ProtoDef.pb.S2CGetSeasonDuanWeiCfg+"_"+Manager.utils.gt(data.gameCat));
    }

    private onS2CKickOut(data: rpc.S2CKickOut){
        Log.e("onS2CKickOut",data);
        if (data.reason == KickReason.KR_DupLogin){
            Manager.tips.showFromId("TS_Denglu_4");
        }else{
            Manager.tips.showFromId("TS_Denglu_57");
        }
        Manager.entryManager.enterBundle(Macro.BUNDLE_RESOURCES,true);
    }

    private onErrCode(data: pb.S2CError) {
        Log.d("onErrCode:",data);
        Manager.tips.debug(data.errCode+" "+data.msgName+" "+data.param);
        
        if(data.errCode == 11 && data.msgName == ProtoDef.pb.C2SMatchTable){
            Manager.dataCenter.get(GameData).put(ProtoDef.pb.C2SMatchTable,null);
            return;
        }
        // if(data.errCode == 22){
        //     dispatch(GameEvent.Err_Close_GameList);
        //     return;
        // }
        if(data.msgName == ProtoDef.pb.C2STrueNameAuth){
            dispatch(data.msgName+"_Err");
            return;
        }

        //一小时游戏限制
        if(data.errCode == ErrorCode.EC_Lt18PlayTimeout){ 
            Manager.uiManager.openFairy({ type: PlayTimeOut, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.UI, name: "未成年保护" });
            return;
        }

        //未成年人不能充值
        if(data.errCode == ErrorCode.EC_LessThan18CantBuy){ 
            Manager.uiManager.openFairy({ type: TopupHints, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.UI, name: "游戏适龄提示" });
            return;
        }

        let ts = Manager.utils.GetTiShiConfigItem(data.errCode.toString());
        if(ts == null){
            Manager.tips.debug("未知错误["+data.errCode+"]");
            return;
        }
        
        if(ts.NeiRong == null || ts.NeiRong.length == 0){
            Manager.tips.debug("未知错误[-1]");
            return;
        }
        Manager.tips.show(ts.NeiRong);
    }








    private onS2CTipMsg(data: pb.S2CTipMsg) {
        let ts = Manager.utils.GetTiShiConfigItem(data.cfgId.toString());
        if(ts == null){
            Manager.tips.debug("未知提示["+data.cfgId+"]");
            return;
        }
        if(ts.NeiRong == null || ts.NeiRong.length == 0){
            Manager.tips.debug("未知提示[-1]");
            return;
        }

        Manager.utils.showTips(ts.NeiRong, data.params);
        // Log.e(ts.NeiRong, data.params);
        // let tips = String.format(ts.NeiRong, data.params);
        // if(tips == null || tips.length == 0){
        //     Manager.tips.show("未知提示[-2]");
        //     return;
        // }
        // Log.e(tips);
        // Manager.tips.show(tips);
    }

    private onPing(data: pb.S2CPing) {
        // Log.d("onPing:",data);
    }

    private onS2CVipCfgs(data: pb.S2CVipCfgs) {
        Log.d("onS2CVipCfgs:",data);
        Manager.gd.put(ProtoDef.pb.S2CVipCfgs,data);
    }

    //VIP配置
    getC2SVipCfgs(){
        type Packet = typeof pb.C2SVipCfgs;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SVipCfgs);
        let packet = new CmmProto<pb.C2SVipCfgs>(Packet);
        packet.cmd = ProtoDef.pb.C2SVipCfgs;
        packet.data = new Packet();
        this.send(packet);
        Log.d("getC2SVipCfgs:",packet);
    }

    private onS2CUpdatePlayer(data: pb.S2CUpdatePlayer) {
        Log.d("onS2CUpdatePlayer:",data);
        let gd = Manager.dataCenter.get(GameData);
        gd.updatePlayer(data.data);
        this.refreshUIPlayer();
    }

    refreshUIPlayer(){
        if(Manager.gd.inHall()){
            dispatch(GameEvent.RefreshPlayer);
        }
    }

    private onS2CPlayerAttr(data: pb.S2CPlayerAttr) {
        Log.d("onS2CPlayerAttr:",data);
        let gd = Manager.dataCenter.get(GameData);
        gd.setPlayerAttrs(data);
        // this.refreshUIPlayer();
    }

    private onS2CCurrency(data: pb.S2CCurrency) {
        Log.d("S2CCurrency:",data);
        let gd = Manager.dataCenter.get(GameData);
        gd.setPlayerCurrencies(data);
        this.refreshUIPlayer();
    }

    private onS2CViewPlayer(data: pb.S2CViewPlayer) {
        Log.d("S2CCurrency:",data);
        // let gd = Manager.dataCenter.get(GameData);
        // gd.updatePlayer(data.data);
        // this.refreshUIPlayer();
    }

    private onS2CGroupValue(data: pb.S2CGroupValue) {
        Log.d("S2CGroupValue:",data);
        let gd = Manager.dataCenter.get(GameData);
        gd.setPlayerGroupValue(data);
        this.refreshUIPlayer();
        // for (let index = 0; index < data.groups.length; index++) {
        //     let group = data.groups[index];
        //     if (group.groupId == GroupId.GI_SeasonRound )
        // }
    }

    private onS2CUISwitches(data: pb.S2CUISwitches) {
        let data1 = Manager.gd.get(ProtoDef.pb.S2CUISwitches);
        Log.e("S2CUISwitches old:",data1);
        Manager.gd.put(ProtoDef.pb.S2CUISwitches,data);
        Log.e("S2CUISwitches new :",data);
    }

    protected onS2CGetTables(data :pb.S2CGetTables){
        Manager.dataCenter.get(GameData).put(ProtoDef.pb.S2CGetTables,data);
        Log.d("服务器 onS2CGetTables",data);
        Manager.loading.hide();
        if(data.gsCat == 1){
            dispatch(GameEvent.UI_OpenGrid,data);
        }else{
            dispatch(ProtoDef.pb.S2CGetTables,data);
            // this.view.onShowGameList(data);
        }
    }

    private onS2CShowItems(data: pb.S2CShowItems) {
        Log.d("S2CShowItems:",data);
        // dispatch(GameEvent.UI_General_Reward,data);
        Manager.reward.show(data);
        dispatch(GameEvent.Update_Player);
    }


    //玩家看过了这个奖励
    OnC2SShowItemsReply(uid:number){
        type Packet = typeof pb.C2SShowItemsReply;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SShowItemsReply);
        let packet = new CmmProto<pb.C2SShowItemsReply>(Packet);
        packet.cmd = ProtoDef.pb.C2SShowItemsReply;
        packet.data = new Packet();
        packet.data.uid = uid;
        this.send(packet);
        Log.d("OnC2SShowItemsReply:",packet);
    }

    //请求下还有没有奖励没看的 每次请求前 先清空下奖励队列 并且请求下最新商城数据(看完广告的时候刷新观看广告次数)
    OnC2SGetShowItems(){
        this.getShopItems();

        Manager.reward.clear();
        type Packet = typeof pb.C2SGetShowItems;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGetShowItems);
        let packet = new CmmProto<pb.C2SGetShowItems>(Packet);
        packet.cmd = ProtoDef.pb.C2SGetShowItems;
        packet.data = new Packet();
        this.send(packet);
    }

    


    //#region  游戏准备之前的消息

    public GetMessageQuaue()
    {
        return this.messageQuaue

    }


    //当前牌桌数据 OnMjRoomInfo
    OnS2CMahTableData(data: pb.S2CMahTableData) {
        Log.d("重连 服务器告诉玩家进入了麻将 S2CMahTableData:",data ,Manager.utils.milliseconds);
        Manager.dataCenter.get(GameData).put(ProtoDef.pb.S2CMahTableData,data);
        let gd = Manager.dataCenter.get(GameData);
        //         this.refreshUIPlayer();
        type Packet = typeof pb.S2CMahResetTable;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.S2CMahResetTable);
        let dataTemp = new Packet();
        dataTemp.tableCommon = data.tableCommon,
        dataTemp.gameTable = data.gameTable,
        dataTemp.gameRule = data.gameRule,
        dataTemp.gamePlayers = data.gamePlayers

        if (this.messageQuaue!=null) {
            this.messageQuaue.ClearFun();
        }
        this.messageQuaue = new GameMessageQuaue();
        this.messageQuaue.AddFun( (endFun,t)=>{
            //血流红中 pb.GameCat.GameCat_Mahjong
            if (data.tableCommon.gameType == GameCat.GameCat_Mahjong  ) {
                Manager.dataCenter.get(GameData).put(ProtoDef.pb.S2CMahResetTable,{data,endFun});
                Log.d("重连 服务器告诉玩家进入了 血流红中麻将 Manager.gd.LocalPosition:",Manager.gd.LocalPosition ,Manager.utils.milliseconds);
                if(Manager.gd.LocalPosition == "HallView"){

                    dispatch(GameEvent.ENTER_GAME, Config.BUNDLE_XLHZ);
                }else if(Manager.gd.LocalPosition == "XlhzMJView"){

                    dispatch(GameEvent.RefreshGameTable);
                }
            }
            else if (data.tableCommon.gameType == GameCat.GameCat_Mah3Ren2Fang  ) {
                Manager.dataCenter.get(GameData).put(ProtoDef.pb.S2CMahResetTable,{data,endFun});
                Log.d("重连 服务器告诉玩家进入了 三人两房麻将 Manager.gd.LocalPosition:",Manager.gd.LocalPosition ,Manager.utils.milliseconds);
                if(Manager.gd.LocalPosition == "HallView"){
                    Log.d("重连 服务器告诉玩家进入了 三人两房麻将 在大厅中");
                    dispatch(GameEvent.ENTER_GAME, Config.BUNDLE_XLThreeTwo);
                }else if( Manager.gd.LocalPosition == "XLThreeTwoMJView"){
                    Log.d("重连 服务器告诉玩家进入了 三人两房麻将 在游戏中");
                    dispatch(GameEvent.RefreshGameTable);
                }
            }


        });
    }

    //新玩家进入
    protected onS2CMahNewPlayerEnter(data: pb.S2CMahNewPlayerEnter) {
        Log.d("服务器告诉玩家 新玩家进入  onS2CMahNewPlayerEnter:",data);
        this.messageQuaue.AddFun( (endFun,t)=>{
            // if (data.tableCommon.gameType == GameCat.GameCat_Mahjong || data.tableCommon.gameType == GameCat.GameCat_Mah3Ren2Fang ) {
                dispatch(GameEvent.ONPLAYERENTERROOMQUAUE,{data,endFun});
            // }
        });
    }

    // 玩家进入桌子
    protected onS2CEnterTable(data: pb.S2CEnterTable) {
        Log.d("玩家进入桌子  onS2CEnterTable:",data);
        let tableInfo = Manager.dataCenter.get(GameData).get<pb.S2CDouTableInfo>(ProtoDef.pb.S2CDouTableInfo);
        if(tableInfo != null && tableInfo.tableBase && tableInfo.tableBase.players){
            tableInfo.tableBase.players.push(data.item);
        }
    }

    // 斗地主
    protected onS2CDouTableInfo(data: pb.S2CDouTableInfo) {
        Log.d("onS2CDouTableInfo:",data);
        Manager.dataCenter.get(GameData).put(ProtoDef.pb.S2CDouTableInfo,data);
        if (data.tableBase.playerCount == data.players.length) {
            if(data.tableBase.players.length != data.tableBase.playerCount){
                Log.e("onS2CDouTableInfo:",JSON.stringify(data));
                return;
            }
            Log.e("onS2CDouTableInfo:",data.tableBase.players.length + "  " + data.tableBase.playerCount);
            this.enterDouDdz();   
        }
    }
    // 斗地主
    protected onS2CDouPlayerEnter(data: pb.S2CDouPlayerEnter) {
        Log.d("onS2CDouPlayerEnter:",data);
        let tableInfo = Manager.dataCenter.get(GameData).get<pb.S2CDouTableInfo>(ProtoDef.pb.S2CDouTableInfo);
        tableInfo.players.push(data.player);

        if (tableInfo.tableBase.playerCount == tableInfo.players.length) {
            this.enterDouDdz();  
        }else{
            if(Manager.gd.isPlayerInGameView()){
                dispatch(ProtoDef.pb.S2CDouTableInfo,data);
            }
        }
        
    }    

    protected enterDouDdz(){
        if(Manager.gd.LocalPosition == "HallView"){
            dispatch(GameEvent.ENTER_GAME,Config.BUNDLE_DDZ);
        }else if(Manager.gd.LocalPosition == "DdzView"){
            dispatch(GameEvent.DDZ_Match_SUCC);
        }
    }

    // // 斗地主
    // protected onS2CTablePlayer(data: pb.S2CTablePlayer) {
    //     Log.d("onS2CTablePlayer:",data);
    //     Manager.dataCenter.get(GameData).put(ProtoDef.pb.S2CDouTableInfo,data);
    // }    
    // // 斗地主
    // protected onS2CDouStart(data: pb.S2CDouStart) {
    //     Log.d("onS2CDouStart:",data);
    //     Manager.dataCenter.get(GameData).put(ProtoDef.pb.S2CDouStart,data);
    // }  
    // // 斗地主3+
    // protected onS2CServiceFee(data: pb.S2CServiceFee) {
    //     Log.d("onS2CServiceFee:",data);
    //     Manager.dataCenter.get(GameData).put(ProtoDef.pb.S2CServiceFee,data);
    // }  
    // // 斗地主
    // protected onS2CDouAddCards(data: pb.S2CDouAddCards) {
    //     Log.d("onS2CDouAddCards:",data);
    //     Manager.dataCenter.get(GameData).put(ProtoDef.pb.S2CDouAddCards,data);
    // }  
    //#endregion

    


    protected onS2CCfgs(data: pb.S2CCfgs) {
        Log.d("onS2CCfgs:",data);
        Manager.gd.put(ProtoDef.pb.S2CCfgs,data);
    } 

    protected onS2CInSafeBox(data:pb.S2CInSafeBox){
        Log.d("onS2CInSafeBox:",data);
        dispatch(ProtoDef.pb.S2CInSafeBox,data);
    }

    protected onS2COutSafeBox(data:pb.S2COutSafeBox){
        Log.d("onS2COutSafeBox:",data);
        dispatch(ProtoDef.pb.S2COutSafeBox,data);
    }


    ///send...
    sendGM(cmd:string){
        type Packet = typeof pb.C2SCmd;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SCmd);
        let packet = new CmmProto<pb.C2SCmd>(Packet);
        packet.cmd = ProtoDef.pb.C2SCmd;
        packet.data = new Packet();
        packet.data.cmd = cmd;
        this.send(packet);
        Log.e("-----------发送GM命令:"+cmd+"------------");
    }

    inSafeBox(coin:number){
        type Packet = typeof pb.C2SInSafeBox;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SInSafeBox);
        let packet = new CmmProto<pb.C2SInSafeBox>(Packet);
        packet.cmd = ProtoDef.pb.C2SInSafeBox;
        packet.data = new Packet();
        packet.data.coin = coin;
        this.send(packet);
        Log.d("C2SInSafeBox:",packet);
    }

    outSafeBox(coin:number){
        type Packet = typeof pb.C2SOutSafeBox;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SOutSafeBox);
        let packet = new CmmProto<pb.C2SOutSafeBox>(Packet);
        packet.cmd = ProtoDef.pb.C2SOutSafeBox;
        packet.data = new Packet();
        packet.data.coin = coin;
        this.send(packet);
        Log.d("C2SOutSafeBox:",packet);
    }

    getAdReward(id:number,t:number){
        type Packet = typeof pb.C2SGetAdReward;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGetAdReward);
        let packet = new CmmProto<pb.C2SGetAdReward>(Packet);
        packet.cmd = ProtoDef.pb.C2SGetAdReward;
        packet.data = new Packet();
        packet.data.id = id;
        packet.data.type = t;
        this.send(packet);
        Log.d("C2SGetAdReward:",packet);
    }
    //活动
    protected onS2CActivityInfo(data:pb.S2CActivityInfo){
        Log.d("onS2CActivityInfo:",data);
        Manager.gd.put(ProtoDef.pb.S2CActivityInfo,data);
    }

    //破产 充值 救济金
    protected onS2CPoChanMsg(data :pb.S2CPoChanMsg)
    {
        Log.d(" fuwuqi  破产救济金  onS2CPoChanMsg:",data);
        Manager.gd.put(ProtoDef.pb.S2CPoChanMsg,data);
        if ( data.type ==PoChanTable.PoChanTable_None ) 
        {
            // dispatch(ProtoDef.pb.S2CPoChanMsg+"None")
            Manager.uiManager.openFairy({ type: EnterGameProp, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.UI, name: "道具进游戏" });
        }
        else
        {
            Manager.uiManager.openFairy({ type: RecommendChongZhi, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.UI, name: "破产救济金" });
        }

    }


    onC2SPoChanMsg(id:number,type:number){
        Log.d(" onC2SPoChanMsg:",id,type);
        type Packet = typeof pb.C2SPoChanMsg;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SPoChanMsg);
        let packet = new CmmProto<pb.C2SPoChanMsg>(Packet);
        packet.cmd = ProtoDef.pb.C2SPoChanMsg;
        packet.data = new Packet();
        packet.data.id = id;
        packet.data.type = type;
        this.send(packet);
    }

    protected onS2CGetPoChanReWard(data:pb.S2CGetPoChanReWard){
        Log.d("onS2CGetPoChanReWard:",data);
        dispatch(ProtoDef.pb.S2CGetPoChanReWard,data);
    }



    protected onS2CMatchUpdate(data :pb.S2CMatchUpdate){
        Log.d(" onS2CMatchUpdate",data);
        let dataJ = Manager.gd.get<pb.S2CPoChanMsg>(ProtoDef.pb.S2CMatchUpdate);
        if (dataJ==null) {
            Manager.gd.put(ProtoDef.pb.S2CMatchUpdate,data);
            Manager.uiManager.openFairy({ type: GameMatches, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.UI, name: "匹配界面" });
        }
        else
        {
            dispatch(ProtoDef.pb.S2CMatchUpdate,data);
        }
    }

    exitMatch(){
        type Packet = typeof pb.C2SExitMatch;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SExitMatch);
        let packet = new CmmProto<pb.C2SExitMatch>(Packet);
        packet.cmd = ProtoDef.pb.C2SExitMatch;
        packet.data = new Packet();
        this.send(packet);
        Log.e(" 退出匹配 exitMatch:",packet);
    }


    protected onS2CExitMatch(data :pb.S2CExitMatch){
        Log.d("onS2CExitMatch",data);
        dispatch("OnExitMatch");
  
    }

    /** chatType 互动类型  id 是道具id  target 是玩家 guid */
    onC2SChat(chatType:number,id:number,target:number){
        Log.d(" onC2SChatMsg:",chatType,id,target);
        type Packet = typeof pb.C2SChat;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SChat);
        let packet = new CmmProto<pb.C2SChat>(Packet);
        packet.cmd = ProtoDef.pb.C2SChat;
        packet.data = new Packet();
        packet.data.chatType = chatType;
        packet.data.id = id;
        packet.data.target = target;
        this.send(packet);
    }


    protected onS2CChat(data :pb.S2CChat){
        Log.d("S2CChat",data);
        dispatch(ProtoDef.pb.S2CChat,data);
    }
    

    //商店
    onc2SBuyShopItem(id:number,num:number){
        Log.d("onc2SBuyShopItem",id,num);
        type Packet = typeof pb.C2SBuyShopItem;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SBuyShopItem);
        let packet = new CmmProto<pb.C2SBuyShopItem>(Packet);
        packet.cmd = ProtoDef.pb.C2SBuyShopItem;
        packet.data = new Packet();
        packet.data.id = id;
        packet.data.num = num;
        this.send(packet);
    }
    
    
    public GetBag(){
        Log.w("获取背包  ~~~ ")
        type Packet = typeof pb.C2SGetBag;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGetBag);
        let packet = new CmmProto<pb.C2SGetBag>(Packet);
        packet.cmd = ProtoDef.pb.C2SGetBag;
        packet.data = new Packet();
        this.send(packet);
    }

    //背包
    protected onS2CGetBag(data :pb.S2CGetBag){
        Log.d("onS2CGetBag 服务器回来  ",data);
        Manager.dataCenter.get(GameData).put(ProtoDef.pb.S2CGetBag,data);
        dispatch(ProtoDef.pb.S2CGetBag); 
        dispatch(ProtoDef.pb.S2CGetBag+"Enter"); 
        // this.view.packsack.open(data);
    }

    //重连数据
    onS2CGoOnGame(data :pb.S2CGoOnGame){
        if(data != null){
            Log.d("重连  onS2CGoOnGame:",data);
            if(data.gameCat == GameCat.GameCat_Mahjong || data.gameCat == GameCat.GameCat_Mah3Ren2Fang){
                let msg = this.gameDataMahTableData(data.gameData);
                if(null != msg){
                    Manager.tips.debug("正在重新进入麻将");
                    this.onReEnterMJ(msg);
                    return;
                }
            }else if(data.gameCat == GameCat.GameCat_Dou){
                let msg = this.gameData2DouTableInfo(data.gameData);
                if(null != msg){
                    Manager.tips.debug("正在重新进入斗地主");;
                    this.onReEnterDdz(msg);
                    return;
                }
                Log.e("onS2CGoOnGame:解析数据失败");
            }else{
                Manager.tips.debug("在未知的游戏中"+data.gameCat);
            }
        }
    }

    onReEnterDdz(data: pb.S2CDouTableInfo){
        Log.d("onReEnterDdz:",data);
        Manager.gd.put(ProtoDef.pb.S2CGoOnGame,{GameCat:data.tableBase.gameType,GameData:data})
    }


    gameData2DouTableInfo(gd:Uint8Array) :pb.S2CDouTableInfo{
        type S2CDouTableInfo = typeof pb.S2CDouTableInfo;
        let protoType = Manager.protoManager.getProto(ProtoDef.pb.S2CDouTableInfo) as S2CDouTableInfo;
        if (protoType) {
            let msg = protoType.decode(gd) as pb.S2CDouTableInfo;
            Manager.protoManager.decodeHelper(msg);
            if(null != msg){
                return msg;
            }
        }
        return null;
    }

    onReEnterMJ(data: pb.S2CMahTableData){
        Log.d("重连 onReEnterMJ:",data,Manager.utils.milliseconds);
        Manager.gd.put(ProtoDef.pb.S2CGoOnGame,{GameCat:data.tableCommon.gameType,GameData:data})
        if (data.tableCommon.gameType == GameCat.GameCat_Mahjong || data.tableCommon.gameType == GameCat.GameCat_Mah3Ren2Fang) {
            this.OnS2CMahTableData(data)
        }
    }


    gameDataMahTableData(gd:Uint8Array) :pb.S2CMahTableData{
        type S2CMahTableData = typeof pb.S2CMahTableData;
        let protoType = Manager.protoManager.getProto(ProtoDef.pb.S2CMahTableData) as S2CMahTableData;
        if (protoType) {
            let msg = protoType.decode(gd) as pb.S2CMahTableData;
            Manager.protoManager.decodeHelper(msg);
            if(null != msg){
                return msg;
            }
        }
        return null;
    }


    syncState(){
        type Packet = typeof pb.C2SSyncState;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SSyncState);
        let packet = new CmmProto<pb.C2SSyncState>(Packet);
        packet.cmd = ProtoDef.pb.C2SSyncState;
        packet.data = new Packet();
        this.send(packet);
        Log.e("C2SSyncState:",packet);
    }

    onS2CSyncState(data: pb.S2CSyncState){
        Log.d("重连 onS2CSyncState:",data ,Manager.utils.milliseconds);
        if(data.location == PlayerLoc.PlayerLoc_Game){
            if(data.isGame){
                //在游戏中
                if(data.gameCat == GameCat.GameCat_Mahjong || data.gameCat == GameCat.GameCat_Mah3Ren2Fang){
                    Manager.tips.debug("重连 在麻将");
                    let msg = this.gameDataMahTableData(data.gameData);
                    if(null != msg){
                        // Log.w("麻将重连  msg : ",msg)
                        // dispatch(GameEvent.RefreshGameTable,msg);
                        this.OnS2CMahTableData(msg)
                        return;
                    }
                    Manager.tips.debug("解析重连数据失败");
                }else if(data.gameCat == GameCat.GameCat_Dou){
                    // Manager.tips.debug("在斗地主");
                    let msg = this.gameData2DouTableInfo(data.gameData);
                    if(null != msg){
                        dispatch(GameEvent.RefreshGameTable,msg);
                        return;
                    }
                    Manager.tips.debug("解析重连数据失败");
                }else{
        
                }
            }else{
                //在游戏列表
                Manager.tips.debug("在游戏列表");
                if(Manager.gd.isPlayerInGameView()){
                    dispatch(GameEvent.EnterBundle,Config.BUNDLE_HALL);
                }
            }
        }else{
            //在大厅
            Manager.tips.debug("在大厅");
            if(Manager.gd.isPlayerInGameView()){
                dispatch(GameEvent.EnterBundle,Config.BUNDLE_HALL);
            }
        }
    }




    public matchTable(gameType:number,tableCfgId:number){
        type Packet = typeof pb.C2SMatchTable;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SMatchTable);
        let packet = new CmmProto<pb.C2SMatchTable>(Packet);
        packet.cmd = ProtoDef.pb.C2SMatchTable;
        packet.data = new Packet();
        packet.data.gameType = gameType;
        packet.data.tableCfgId = tableCfgId;
        this.send(packet);
        let gd = Manager.dataCenter.get(GameData);
        gd.put(ProtoDef.pb.C2SMatchTable,{gt:gameType,tid:tableCfgId});  
        // Log.d("matchTable:",packet);
        // Log.d("matchTable gd:",gd.get(ProtoDef.pb.C2SMatchTable));
    }


    public c2SUseProp(id:number,params:number[])
    {
        type Packet = typeof pb.C2SUseProp;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SUseProp);
        let packet = new CmmProto<pb.C2SUseProp>(Packet);
        packet.cmd = ProtoDef.pb.C2SUseProp;
        packet.data = new Packet();
        Log.d("C2SUseProp",id,params);
        packet.data.id = id;
        if(params != null){
            packet.data.params = params;
        }


        Log.d("C2SUseProp",packet.data);
        this.send(packet);
    }


    //使用物品
    protected onS2CUseProp(data :pb.S2CUseProp){
        Log.d("服务器回使用了道具 onS2CUseProp",data);
        Manager.gd.put(ProtoDef.pb.S2CUseProp,data);
        if (data.result == 1) 
        {
            dispatch(ProtoDef.pb.S2CPropUpdate+"Use");
        } 
    }

    //道具刷新
    protected onS2CPropUpdate(data :pb.S2CPropUpdate){

        Manager.gd.put(ProtoDef.pb.S2CPropUpdate,data);
        dispatch(ProtoDef.pb.S2CPropUpdate+"Use");
        dispatch(ProtoDef.pb.S2CPropUpdate+"Enter");
    }

    //道具删除
    protected onS2CDelProp(data :pb.S2CDelProp){

        let bagData = Manager.gd.get<pb.S2CGetBag>(ProtoDef.pb.S2CGetBag);
        Log.w(" onS2CDelProp  data ",data)
        Log.w("onS2CDelProp  bagData ",bagData)
        for (const [key, val] of Object.entries(bagData.items))
        {
            if (bagData.items[key].id==data.id ) 
            {
                bagData.items[key].item.value= 0;
            }
        }

        Manager.dataCenter.get(GameData).put(ProtoDef.pb.S2CGetBag,bagData);
    }


    

    //红点变化
    protected onS2CRedDotChange(data :pb.S2CRedDotChange){
        Log.d("onS2CRedDotChange：",data);
    }
  


    public getShopItems(){
        type Packet = typeof pb.C2SGetShopItems;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGetShopItems);
        let packet = new CmmProto<pb.C2SGetShopItems>(Packet);
        packet.cmd = ProtoDef.pb.C2SGetShopItems;
        packet.data = new Packet();
        this.send(packet);

        Log.e("getShopItems  C2SGetShopItems ",packet);
    }

    //商店
    protected onS2CGetShopItems(data :pb.S2CGetShopItems){
        Log.e("onS2CGetShopItems",data);
        // this.view.shop.open(data);
        Manager.gd.put(ProtoDef.pb.S2CGetShopItems,data);
        dispatch(ProtoDef.pb.S2CGetShopItems+"shopView");    
    }

    //商店
    protected onS2CBuyShopItem(data :pb.S2CBuyShopItem){
        Log.d("onS2CBuyShopItem",data);
        // this.view.shop.open(data);
        if (data.ec == 1){
            //懒得找服务器要数据了，自己瞎基霸刷新也不知道id是不是买的那个，成功了就刷新
            dispatch(ProtoDef.pb.S2CBuyShopItem);
        }else{
            // Manager.tips.showFromId("购买失败["+ data.id.toString()+"-"+ data.ec.toString()+"]");
        }
        dispatch(ProtoDef.pb.S2CBuyShopItem+"_refresh");
    }

    //开始看广告 code 错误码 result 拉取 成功
    public c2SAdStart(item:pb.AdData)
    {
        Log.d("c2SAdStart ffffffff  item :",item);
        type Packet = typeof pb.C2SAdStart;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SAdStart);
        let packet = new CmmProto<pb.C2SAdStart>(Packet);
        packet.cmd = ProtoDef.pb.C2SAdStart;
        packet.data = new Packet();
        packet.data.item=item
        packet.data.result=true
        this.send(packet);
        Log.d("c2SAdStart  packet :",packet);
    }


    //广告看完了
    public c2SAdEnd(data){

        type Packet = typeof pb.C2SAdEnd;
   
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SAdEnd);
        let packet = new CmmProto<pb.C2SAdEnd>(Packet);
        packet.cmd = ProtoDef.pb.C2SAdEnd;
        packet.data = new Packet();
        let AdData = Manager.protoManager.getProto(ProtoDef.pb.AdData);
        packet.data.item = new AdData();
        Log.d("c2SAdEnd:",packet.data,data);
        if(data.sdkType!=null){
            packet.data.item.sdkType= Number(data.sdkType);
        }
        if(data.funcId!=null){
            packet.data.item.funcId=Number(data.funcId);
        }
        if(data.intParam!=null){
            packet.data.item.intParam=Number(data.intParam);
        }
        if(data.strParam!=null){
            packet.data.item.strParam=data.strParam.toString();
        }
        if (data.code!=null) {
            packet.data.code=data.code.toString();
        }
        this.send(packet);
        Log.d("c2SAdEnd  packet :",packet);
    }

    
    onS2CSafeBox(data :pb.S2CSafeBox)
    {
        Log.d("onS2CSafeBox",data);
        Manager.gd.player().safeBox = data.value;
        // let dataBuffer = new ByteArray(data.value);
        // dataBuffer.readUnsignedInt
    }
    

        //广告生效数据
    onS2CAdCfgs(data :pb.S2CAdCfgs)
    {
        Log.d("onS2CAdCfgs",data);
        Manager.gd.put(ProtoDef.pb.S2CAdCfgs,data);
    }


    //广告免输免赢
    onS2CGameEndGiftValue(data :pb.S2CGameEndGiftValue)
    {
        Log.e("onS2CGameEndGiftValue",data);
        // Manager.gd.put(ProtoDef.pb.S2CGameEndGiftValue,data);
    }

    public reportLocat(lbs:string){
        Manager.gd.put(ProtoDef.pb.C2SLocat,null);
        type Packet = typeof pb.C2SLocat;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SLocat);
        let packet = new CmmProto<pb.C2SLocat>(Packet);
        packet.cmd = ProtoDef.pb.C2SLocat;
        packet.data = new Packet();
        packet.data.data = lbs;
        this.send(packet);
        Log.d("C2SLocat:",lbs);
    }

    public nextMatchTable(gameType:number,tableCfgId:number){
        Manager.gd.put(ProtoDef.pb.S2CDouTableInfo,null);
        type Packet = typeof pb.C2SNextMatch;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SNextMatch);
        let packet = new CmmProto<pb.C2SNextMatch>(Packet);
        packet.cmd = ProtoDef.pb.C2SNextMatch;
        packet.data = new Packet();
        packet.data.gameType = gameType;
        packet.data.tableCfgId = tableCfgId;
        this.send(packet);
        Log.d("nextMatchTable:",packet);
    }

    public realAuth(name:string,id:string){
        type Packet = typeof pb.C2STrueNameAuth;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2STrueNameAuth);
        let packet = new CmmProto<pb.C2STrueNameAuth>(Packet);
        packet.cmd = ProtoDef.pb.C2STrueNameAuth;
        packet.data = new Packet();
        packet.data.idNum = id;
        packet.data.name = name;
        this.send(packet);
        Log.d("C2STrueNameAuth:",packet);
    }
    //请求邀请好友
    onC2SGetIdlePlayers(guid:number){
        Log.d("onC2SGetIdlePlayers请求邀请好友 ");
        type Packet = typeof pb.C2SGetIdlePlayers;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGetIdlePlayers);
        let packet = new CmmProto<pb.C2SGetIdlePlayers>(Packet);
        packet.cmd = ProtoDef.pb.C2SGetIdlePlayers;
        packet.data = new Packet();
        if (guid!=null) {
           packet.data.guid=guid;
        }
        this.send(packet);
    }


    //邀请好友界面数据
    protected onS2CGetIdlePlayers(data :pb.S2CGetIdlePlayers){
        Log.d("服务器回邀请好友数据 S2CGetIdlePlayers",data);
        if (data.guid>0) 
        {
            Manager.gd.put(ProtoDef.pb.S2CGetIdlePlayers+"search",data);
        }
        else
        {
            Manager.gd.put(ProtoDef.pb.S2CGetIdlePlayers,data);
        }

        dispatch(ProtoDef.pb.S2CGetIdlePlayers);

    }

    //邀请好友 值<=0时 一键邀请，其它为指定玩家GUID
    onC2SInvitePlay(guid:number){
        Log.d("onC2SInvitePlay   请求邀请好友 ");
        type Packet = typeof pb.C2SInvitePlay;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SInvitePlay);
        let packet = new CmmProto<pb.C2SInvitePlay>(Packet);
        packet.cmd = ProtoDef.pb.C2SInvitePlay;
        packet.data = new Packet();
        packet.data.guid=guid;

        this.send(packet);
    }



    //邀请通知
    protected onS2CInviteNotify(data :pb.S2CInviteNotify){
        Log.d("被邀请 S2CInviteNotify",data);
        Manager.gd.put(ProtoDef.pb.S2CInviteNotify,data);
        Manager.uiManager.openFairy({ type: BeInvited, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.UI, name: "被好友邀请" });

    }

    protected onS2CGiveBeginnerMoney(data :pb.S2CGiveBeginnerMoney){
        Log.d("onS2CGiveBeginnerMoney:",data);
        Manager.gd.put(ProtoDef.pb.S2CGiveBeginnerMoney,data);
        dispatch(ProtoDef.pb.S2CGiveBeginnerMoney);
    }
    
    //被邀请玩家回复通知
    onC2SInviteNotify(target:pb.IInviteTarget,inviterConnId:number,agree :boolean ){
        Log.d("C2SInviteNotify   target ",target);
        Log.d("C2SInviteNotify   inviterConnId ",inviterConnId);
        Log.d("C2SInviteNotify   agree ",agree);
        type Packet = typeof pb.C2SInviteNotify;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SInviteNotify);
        let packet = new CmmProto<pb.C2SInviteNotify>(Packet);
        packet.cmd = ProtoDef.pb.C2SInviteNotify;
        packet.data = new Packet();
        packet.data.target=target
        packet.data.inviterConnId=inviterConnId;
        packet.data.agree=agree
        this.send(packet);
    }

    
    //跑马灯
    protected onS2CRollingNotice(data :pb.S2CRollingNotice){
        // Log.d(" 跑马灯  onS2CRollingNotice    data:  ",data);
        if (data.items!=null && data.items.length!=0 ) {
            let dataOld = Manager.gd.get<pb.S2CRollingNotice>(ProtoDef.pb.S2CRollingNotice);
            if (dataOld!=null&& dataOld.items!=null && dataOld.items.length!=0) //已经有过数据了
            {

                for (let c = 0; c < data.items.length; c++) {
                    let isHave=false;
                    for (let i = 0; i < dataOld.items.length; i++) 
                    {
                        if (dataOld.items[i].id== data.items[c].id) 
                        {
                            dataOld.items[i]= data.items[c]
                            isHave=true;
                            break;
                        }
                    }
                    if (!isHave) 
                    {
                        dataOld.items.push(data.items[c])
                    }
                }
            }
            else
            {
                Manager.gd.put(ProtoDef.pb.S2CRollingNotice,data);
            }
            
            dispatch(ProtoDef.pb.S2CRollingNotice);
        }
    }


    //跑马灯删除
    protected onS2CDeleteNotice(data :pb.S2CDeleteNotice){
        // Log.d(" 跑马灯 onS2CDeleteNotice    data:  ",data);
        if (data.items!=null && data.items.length!=0 ) {
            let dataOld = Manager.gd.get<pb.S2CRollingNotice>(ProtoDef.pb.S2CRollingNotice);
            if (dataOld!=null&& dataOld.items!=null && dataOld.items.length!=0) //已经有过数据了
            {

                for (let c = 0; c < data.items.length; c++) {
                    let isHave=false;
                    for (let i = 0; i < dataOld.items.length; i++) 
                    {
                        if (dataOld.items[i].id== data.items[c].id) 
                        {
                            dataOld.items.splice(i)
                            isHave=true;
                            break;
                        }
                    }
                }
            }
            dispatch(ProtoDef.pb.S2CRollingNotice);
        }
    }

    protected onS2CExitTable(data :pb.S2CExitTable){
        Log.d("onS2CExitTable data:",data);
        if(data.guid == Manager.gd.player().guid){
            if(Manager.gd.isPlayerInGameView()){
                dispatch(ProtoDef.pb.S2CExitTable,data);
                dispatch(GameEvent.EnterBundle,Config.BUNDLE_HALL);
            }
        }else{
            dispatch(ProtoDef.pb.S2CExitTable,data);
        }
    }
    
    public exitTable(){                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
        type Packet = typeof pb.C2SExitTable;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SExitTable);
        let packet = new CmmProto<pb.C2SExitTable>(Packet);
        packet.cmd = ProtoDef.pb.C2SExitTable;
        packet.data = new Packet();
        this.send(packet);
        Log.d("C2SExitTable",packet);
    }
    
    onC2SHasPoChan(gameType:number,cfgId:number){
        type Packet = typeof pb.C2SHasPoChan;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SHasPoChan);
        let packet = new CmmProto<pb.C2SHasPoChan>(Packet);
        packet.cmd = ProtoDef.pb.C2SHasPoChan;
        packet.data = new Packet();
        packet.data.gameCat = gameType;
        packet.data.cfgId = cfgId;
        this.send(packet);
        Log.d("C2SHasPoChan",packet);
    }


    onC2SUILoaded(){
        type Packet = typeof pb.C2SUILoaded;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SUILoaded);
        let packet = new CmmProto<pb.C2SUILoaded>(Packet);
        packet.cmd = ProtoDef.pb.C2SUILoaded;
        packet.data = new Packet();
        this.send(packet);
        Log.w("!!!!!!!!!!!!!!!!!!!!onC2SUILoaded",packet);
    }


    getC2SIapGetOrderId(iapType:number,shopId:string,param:string=""){
        type Packet = typeof pb.C2SIapGetOrderId;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SIapGetOrderId);
        let packet = new CmmProto<pb.C2SIapGetOrderId>(Packet);
        packet.cmd = ProtoDef.pb.C2SIapGetOrderId;
        packet.data = new Packet();

        let GenOrderItem = Manager.protoManager.getProto(ProtoDef.pb.GenOrderItem);
        packet.data.item = new GenOrderItem();

        packet.data.item.iapType = iapType;
        packet.data.item.shopId = shopId;
        packet.data.item.param = param;
        this.send(packet);
        Manager.loading.showId("TS_ShangCheng_11",function(){
            Manager.tips.showFromId("TS_ShangCheng_11");
        });
        Log.d("__log__ts__ C2SIapGetOrderId",iapType,shopId);
    }

    onS2CIapGetOrderId(data:pb.S2CIapGetOrderId){
        Log.d("__log__ts__ S2CIapGetOrderId",data.item.iapType," ",data);
        Manager.loading.hide();

        this.getC2SSetBuyCb(data.orderId);
        if (data.item.iapType == IapType.IapType_Alipay){
            Manager.platform.alipay(data.param);
        }
        else if (data.item.iapType == IapType.IapType_HuaWei){
            let shopId =data.item.shopId;
            let shopData = Manager.gd.get<pb.S2CGetShopItems>(ProtoDef.pb.S2CGetShopItems);
            let shopItem = Manager.utils.getShopItem(Number(shopId),shopData);
            let content = JSON.stringify({
                shopId:shopId, 
                orderId:data.orderId,
                name:shopItem.name,
                amount:shopItem.price+".00",
            });

            Manager.platform.huaWeiPay(content);
        }else if(data.item.iapType == IapType.IapType_Apple){
            Manager.platform.IOSPay(data);
        }
        else if(data.item.iapType == IapType.IapType_WeiXin){
            Log.d("__log__ts__ S2CIapGetOr  微信支付 ");
            Manager.platform.wxPay(data.param);
        }
    }







    // 请求验证支付
    onC2SIapReceipt(data){
        Log.d("onC2SIapReceipt",data.toString() );
        // Log.d("onC2SIapReceipt data.iapType",data.iapType );
        // Log.d("onC2SIapReceipt data.orderId",data.orderId );
        // Log.d("onC2SIapReceipt data.shopId",data.shopId );
        // Log.d("onC2SIapReceipt data.param",data.param );
        type Packet = typeof pb.C2SIapReceipt;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SIapReceipt);
        let packet = new CmmProto<pb.C2SIapReceipt>(Packet);
        packet.cmd = ProtoDef.pb.C2SIapReceipt;
        packet.data = new Packet();
        packet.data.iapType=Number(data.iapType) ;
        packet.data.orderId=data.orderId;
        packet.data.shopId=data.shopId;
        let param = JSON.stringify({
            purchaseToken:data.param
        });;
        packet.data.param=param;
        this.send(packet);
        Log.w("!!!!!!!!!!!!!!!!!!!!onC2SIapReceipt",packet);
    }


    getAchievCfg(){
        type Packet = typeof pb.C2SAchievCfg;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SAchievCfg);
        let packet = new CmmProto<pb.C2SAchievCfg>(Packet);
        packet.cmd = ProtoDef.pb.C2SAchievCfg;
        packet.data = new Packet();
        this.send(packet);
        Log.d("getAchievCfg:",packet);
    }




    // private isHave=false;
    // private count=0;

    //主动弹框
    onS2CShowBox(data:pb.S2CShowBox){
        Log.d("S2CShowBox ",data);
        let dwData:pb.S2CGetSeasonDuanWeiCfg = Manager.dataCenter.get(GameData).get<pb.S2CGetSeasonDuanWeiCfg>(ProtoDef.pb.S2CGetSeasonDuanWeiCfg+"_1000");
        if(dwData == null){
            return;
        }
        dwData = Manager.dataCenter.get(GameData).get<pb.S2CGetSeasonDuanWeiCfg>(ProtoDef.pb.S2CGetSeasonDuanWeiCfg+"_3000");
        if(dwData == null){
            return;
        }
        let taskCfg = Manager.dataCenter.get(GameData).get<pb.S2CAchievCfg>(ProtoDef.pb.S2CAchievCfg);
        if(taskCfg == null){
            return;
        }




        Manager.commonPop.show(data);

    }


    //关闭主动弹框
    OnC2SCloseShowBox(adType:number,buZaiTiShi:boolean){
        type Packet = typeof pb.C2SCloseShowBox;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SCloseShowBox);
        let packet = new CmmProto<pb.C2SCloseShowBox>(Packet);
        packet.cmd = ProtoDef.pb.C2SCloseShowBox;
        packet.data = new Packet();
        packet.data.adType = adType;
        packet.data.buZaiTiShi = buZaiTiShi;
        this.send(packet);
        Log.d("getC2SCloseShowBox",adType,buZaiTiShi);
    }



    protected onS2CGradeCfgs(data :pb.S2CGradeCfgs){
        Log.d("onS2CGradeCfgs",data);
        Manager.dataCenter.get(GameData).put(ProtoDef.pb.S2CGradeCfgs,data.items);
    }

    protected onS2CGetGradeReward(data :pb.S2CGetGradeReward){
        Log.d("等级提升的时候 onS2CGetGradeReward",data);
        if(data.isOk){
            dispatch(GameEvent.UI_ACH_RefreshGrade,data.grade);
            dispatch(ProtoDef.pb.S2CShowBox+"ReFlash",data.grade);
        }
    }

    protected onS2CReplyAchiev(data :pb.S2CReplyAchiev){
        Log.d("onS2CReplyAchiev",data);
        dispatch(ProtoDef.pb.S2CReplyAchiev,data);      
    }

    protected onS2CAchievReward(data :pb.S2CAchievReward){
        Log.d("onS2CAchievReward",data);
        dispatch(ProtoDef.pb.S2CAchievReward,data);
        dispatch(ProtoDef.pb.S2CShowBox+"ReFlash",data.id);
    }


    protected onS2CAchievCfg(data :pb.S2CAchievCfg){
        Log.d("onS2CAchievCfg",data);
        Manager.dataCenter.get(GameData).put(ProtoDef.pb.S2CAchievCfg,data);

        dispatch(ProtoDef.pb.S2CAchievCfg,data);
    }


    //赛季排位
    protected onS2CDuanWeiChange(data :pb.S2CDuanWeiChange){
        Log.d("onS2CDuanWeiChange:",data);
        dispatch(ProtoDef.pb.S2CDuanWeiChange,data);
        Manager.dataCenter.get(GameData).put(ProtoDef.pb.S2CDuanWeiChange,data);
        if(data.oldDuanWei != 0 && data.oldDuanWei % 5 == 0 && data.newDuanWei > data.oldDuanWei){
            Manager.uiManager.openFairy({ type: GridUpgrade, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.UI, name: "段位升级" });
        }
    }

    protected onS2CSeasonRankList(data :pb.S2CSeasonRankList){
        dispatch(ProtoDef.pb.S2CSeasonRankList,data);
    }

    protected onS2CSeason(data :pb.S2CSeason){
        Log.d("onS2CSeason :",data);
        Manager.dataCenter.get(GameData).put(ProtoDef.pb.S2CSeason,data);
        dispatch(ProtoDef.pb.S2CSeason,data);

    }

    protected onS2CSeasonHisRankList(data :pb.S2CSeasonHisRankList){
        dispatch(ProtoDef.pb.S2CSeasonHisRankList,data);
    }
    
    protected onS2CGetSeasonRewardCfg(data :pb.S2CGetSeasonRewardCfg){
        Log.d("onS2CGetSeasonRewardCfg:",data);
        Manager.dataCenter.get(GameData).put(ProtoDef.pb.S2CGetSeasonRewardCfg+"_"+Manager.utils.gt(data.gameCat),data);
    }

    protected onS2CGetSeasonReward(data :pb.S2CGetSeasonReward){
        dispatch(ProtoDef.pb.S2CGetSeasonReward,data);
    }

    protected onS2CGetDuanWeiReward(data :pb.S2CGetDuanWeiReward){
        dispatch(ProtoDef.pb.S2CGetDuanWeiReward,data);
        if (data.ok) {
            dispatch(ProtoDef.pb.S2CShowBox+"ReFlash",data.duanWei);
        }


    }

    protected onS2CDuanWeiReset(data:pb.S2CDuanWeiReset){
        dispatch(ProtoDef.pb.S2CDuanWeiReset,data);
    }



    getAchievReward(lv:number){
        type Packet = typeof pb.C2SAchievReward;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SAchievReward);
        let packet = new CmmProto<pb.C2SAchievReward>(Packet);
        packet.cmd = ProtoDef.pb.C2SAchievReward;
        packet.data = new Packet();
        packet.data.id = lv;
        this.send(packet);
        Log.d("getAchievReward:",packet);
    }


    getASKAchievData(){
        type Packet = typeof pb.C2SASKAchievData;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SASKAchievData);
        let packet = new CmmProto<pb.C2SASKAchievData>(Packet);
        packet.cmd = ProtoDef.pb.C2SASKAchievData;
        packet.data = new Packet();
        this.send(packet);
        Log.d("getASKAchievData:",packet);
    }

    //领取成就奖励
    getGradeReward(lv:number){
        type Packet = typeof pb.C2SGetGradeReward;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGetGradeReward);
        let packet = new CmmProto<pb.C2SGetGradeReward>(Packet);
        packet.cmd = ProtoDef.pb.C2SGetGradeReward;
        packet.data = new Packet();
        packet.data.grade = lv;
        this.send(packet);
    }

    public openGameList(gameId:number){
        gameId = Number(gameId);
        type Packet = typeof pb.C2SEnterGame;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SEnterGame);
        let packet = new CmmProto<pb.C2SEnterGame>(Packet);
        packet.cmd = ProtoDef.pb.C2SEnterGame;
        packet.data = new Packet();
        packet.data.game = gameId;
        Log.d("openGameList:",gameId);
        this.send(packet);
        Manager.loading.showId("TS_DaTing_11",function(){
            Manager.tips.showFromId("TS_DaTing_12");
        });

        let data:pb.S2CGames = Manager.dataCenter.get(GameData).get<pb.S2CGames>(ProtoDef.pb.S2CGames);
        if(data != null){
            for (let index = 0; index < data.items.length; index++) {
                if(data.items[index].id == gameId){
                    dispatch("GameLevelSetGameName",data.items[index].name);
                }
            }
        }
    }


    getSeasonReward(cat:number){
        type Packet = typeof pb.C2SGetSeasonReward;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGetSeasonReward);
        let packet = new CmmProto<pb.C2SGetSeasonReward>(Packet);
        packet.cmd = ProtoDef.pb.C2SGetSeasonReward;
        packet.data = new Packet();
        packet.data.gameCat = cat;
        this.send(packet);
        Log.d("C2SGetSeasonReward:",packet);
    }



    getDuanWeiReward(duanWei:number){
        type Packet = typeof pb.C2SGetDuanWeiReward;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGetDuanWeiReward);
        let packet = new CmmProto<pb.C2SGetDuanWeiReward>(Packet);
        packet.cmd = ProtoDef.pb.C2SGetDuanWeiReward;
        packet.data = new Packet();
        packet.data.duanWei = duanWei;
        this.send(packet);
        Log.d("getDuanWeiReward:",packet);
    }


    getBWHLInfo(scoreType:pb.ScoreType){
        type Packet = typeof pb.C2SGetScoreTop;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGetScoreTop);
        let packet = new CmmProto<pb.C2SGetScoreTop>(Packet);
        packet.cmd = ProtoDef.pb.C2SGetScoreTop;
        packet.data = new Packet();
        packet.data.scoreType = scoreType;
        this.send(packet);
        Log.d("C2SZaiXianInfo",packet);
    }

    onS2CGetScoreTop(data:pb.S2CGetScoreTop){
        Log.d("onS2CGetScoreTop  :  ",data);
        Manager.gd.put(ProtoDef.pb.S2CGetScoreTop,data);
        dispatch(ProtoDef.pb.S2CGetScoreTop);
    }

    //获取排行榜配置数据
    getSGetScoreRewardCfgs(){
        type Packet = typeof pb.C2SGetScoreRewardCfgs;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGetScoreRewardCfgs);
        let packet = new CmmProto<pb.C2SGetScoreRewardCfgs>(Packet);
        packet.cmd = ProtoDef.pb.C2SGetScoreRewardCfgs;
        packet.data = new Packet();
        this.send(packet);
        Log.d("getSGetScoreRewardCfgs:",packet);
    }


    onS2CGetScoreRewardCfgs(data:pb.S2CGetScoreRewardCfgs){
        Log.d("onS2CGetScoreRewardCfgs  :  ",data);
        Manager.gd.put(ProtoDef.pb.S2CGetScoreRewardCfgs,data);

    }



    
    //获取排行榜领取数据
    getSGetScoreRewardList(scoreType:pb.ScoreType){
        type Packet = typeof pb.C2SGetScoreRewardList;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGetScoreRewardList);
        let packet = new CmmProto<pb.C2SGetScoreRewardList>(Packet);
        packet.cmd = ProtoDef.pb.C2SGetScoreRewardList;
        packet.data = new Packet();
        packet.data.scoreType =scoreType;
        this.send(packet);
        Log.d("getSGetScoreRewardCfgs:",packet);
    }

    onS2CGetScoreRewardList(data:pb.S2CGetScoreRewardList){
        Log.d("onS2CGetScoreRewardList  :  ",data);
        Manager.gd.put(ProtoDef.pb.S2CGetScoreRewardList,data);
        dispatch(ProtoDef.pb.S2CGetScoreRewardList);
    }


    //获取排行榜领取数据
    getC2SGetScoreReward(scoreType:pb.ScoreType,date:number){
        type Packet = typeof pb.C2SGetScoreReward;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGetScoreReward);
        let packet = new CmmProto<pb.C2SGetScoreReward>(Packet);
        packet.cmd = ProtoDef.pb.C2SGetScoreReward;
        packet.data = new Packet();
        packet.data.scoreType =scoreType;
        packet.data.date =date;
        this.send(packet);
        Log.d("getC2SGetScoreReward:",packet);
    }
    
    //领取了奖励表现 数据刷新 界面刷新 奖励发放
    onS2CGetScoreReward(data:pb.S2CGetScoreReward){
        Log.e("onS2CGetScoreReward 领取了奖励  :  ",data);

        let dataLq = Manager.gd.get<pb.S2CGetScoreRewardList>(ProtoDef.pb.S2CGetScoreRewardList);
        if (dataLq.scoreType == data.scoreType ) 
        {
            for (let index = 0; index < dataLq.items.length; index++) 
            {
                if (dataLq.items[index].date== data.date) 
                {
                    dataLq.items[index].state=0;//已领取
                }

            }
            Manager.gd.put(ProtoDef.pb.S2CGetScoreRewardList,dataLq);
            dispatch(ProtoDef.pb.S2CGetScoreRewardList);
        }







    }

    

    //获取排行榜领取数据
    getC2SHfqRecharge(phone:string,amount:number){
        type Packet = typeof pb.C2SHfqRecharge;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SHfqRecharge);
        let packet = new CmmProto<pb.C2SHfqRecharge>(Packet);
        packet.cmd = ProtoDef.pb.C2SHfqRecharge;
        packet.data = new Packet();
        packet.data.phone =phone;
        packet.data.amount =amount;
        this.send(packet);
        Log.d("getC2SHfqRecharge:",packet);
    }
    
    //话费充值结果 充值成功给个飘字提示
    onS2CHfqRecharge(data:pb.S2CHfqRecharge){
        Log.e("onS2CHfqRecharge 话费充值结果  :  ",data);
        if (data.ec==1) {
            Manager.tips.show("充值成功");
        }
        else
        {
            Manager.tips.show("充值失败");
        }
    }



    //微信提现
    getC2SWithdrawScore(scoreType:ScoreType,amount:number,wxCode:string){
        type Packet = typeof pb.C2SWithdrawScore;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SWithdrawScore);
        let packet = new CmmProto<pb.C2SWithdrawScore>(Packet);
        packet.cmd = ProtoDef.pb.C2SWithdrawScore;
        packet.data = new Packet();
        packet.data.scoreType =scoreType;
        packet.data.amount =amount;
        packet.data.wxCode =wxCode;
        this.send(packet);
        Log.d("getC2SHfqRecharge:",packet);
    }
    


    onS2CWithdrawScore(data:pb.S2CWithdrawScore){
        Log.e("onS2CWithdrawScore 微信提现结果  :  ",data);
        if (data.ec==1) {
            Manager.tips.show("提现成功");
        }
        else
        {
            Manager.tips.show("提现失败");
        }
    }
    
    //话费充值记录查询
    getC2SGetHfqRechargeLog(){
        type Packet = typeof pb.C2SGetHfqRechargeLog;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGetHfqRechargeLog);
        let packet = new CmmProto<pb.C2SGetHfqRechargeLog>(Packet);
        packet.cmd = ProtoDef.pb.C2SGetHfqRechargeLog;
        packet.data = new Packet();
        this.send(packet);
        Log.d("getC2SHfqRecharge:",packet);
    }
    
    onS2CGetHfqRechargeLog(data:pb.S2CGetHfqRechargeLog){
        Log.d("onS2CGetHfqRechargeLog  :  ",data);
        Manager.gd.put(ProtoDef.pb.S2CGetHfqRechargeLog,data);
        dispatch(ProtoDef.pb.S2CGetHfqRechargeLog);
    }
    
    onS2CMyLbs(data:pb.S2CMyLbs){
        Log.d("C2SLocat onS2CMyLbs  :",data);
        Manager.gd.put(ProtoDef.pb.S2CMyLbs,data);
        dispatch(ProtoDef.pb.S2CMyLbs);
    }
    
    onS2CQuickStart(data:pb.S2CQuickStart){
        Log.d("S2CQuickStart  :",data);
        Manager.gd.put(ProtoDef.pb.S2CQuickStart,data);
        dispatch(ProtoDef.pb.S2CQuickStart);
    }
    
    //商城购买可能不一样
    getC2SSetBuyCb(orderId:string){
        Log.d("getC2SSetBuyCb  ts 00000000000 ");
        let data = Manager.gd.get<{shopId:number,num:number,orderId:string}>("C2SSetBuyCb");
        if (data ==null ) {
            return;
        }
        type Packet = typeof pb.C2SSetBuyCb;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SSetBuyCb);
        let packet = new CmmProto<pb.C2SSetBuyCb>(Packet);
        packet.cmd = ProtoDef.pb.C2SSetBuyCb;
        packet.data = new Packet();
        packet.data.orderId = orderId;
        packet.data.shopId = data.shopId;
        this.send(packet);
        Log.d("getC2SSetBuyCb:",packet);
        Manager.gd.put("C2SSetBuyCb",null);
    }


    /** 破产后去看广告复活 */
    OnC2SPoChangAdStart() {
        Log.e(" C2SPoChangAdStart   open:  ")
        type Packet = typeof pb.C2SPoChangAdStart;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SPoChangAdStart);
        let packet = new CmmProto<pb.C2SPoChangAdStart>(Packet);
        packet.cmd = ProtoDef.pb.C2SPoChangAdStart;
        packet.data = new Packet();
        this.send(packet);
    }
    //注销账号
    public OnC2SLogoffAccount(name:string,id:string){
        type Packet = typeof pb.C2SLogoffAccount;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SLogoffAccount);
        let packet = new CmmProto<pb.C2SLogoffAccount>(Packet);
        packet.cmd = ProtoDef.pb.C2SLogoffAccount;
        packet.data = new Packet();
        packet.data.idNum = id;
        packet.data.name = name;
        this.send(packet);
        Log.d("C2SLogoffAccount:",packet);
    }

    public getVipReward(lv:number){
        type Packet = typeof pb.C2SGetVipReward;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGetVipReward);
        let packet = new CmmProto<pb.C2SGetVipReward>(Packet);
        packet.cmd = ProtoDef.pb.C2SGetVipReward;
        packet.data = new Packet();
        packet.data.level = lv;
        this.send(packet);
        Log.d("C2SGetVipReward:",packet);
    }

    public onS2CGetVipReward(data:pb.S2CGetVipReward){
        dispatch(ProtoDef.pb.S2CGetVipReward,data);
    }

    public onS2CGetVipDayReward(data:pb.S2CGetVipDayReward){
        dispatch(ProtoDef.pb.S2CGetVipDayReward,data);
    }

    public onS2CVipChange(data:pb.S2CVipChange){
        Log.d("S2CVipChange:",data);
        if(data.newVip != data.oldVip){
            Manager.uiqueue.addToQueue({type: VipDialog, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.TwoUI, name: "VIP升级奖励" ,args:"奖励"});
            Manager.uiqueue.addToQueue({type: VipDialog, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.TwoUI, name: "VIP每日奖励" ,args:"每日"});
        }

    }
    
    public getVipDayReward(){
        type Packet = typeof pb.C2SGetVipDayReward;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SGetVipDayReward);
        let packet = new CmmProto<pb.C2SGetVipDayReward>(Packet);
        packet.cmd = ProtoDef.pb.C2SGetVipDayReward;
        packet.data = new Packet();
        this.send(packet);
        Log.d("C2SGetVipDayReward:",packet);
    }

    //免输 赢翻倍
    public OnC2SNoLoseWinMore(){
        type Packet = typeof pb.C2SNoLoseWinMore;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SNoLoseWinMore);
        let packet = new CmmProto<pb.C2SNoLoseWinMore>(Packet);
        packet.cmd = ProtoDef.pb.C2SNoLoseWinMore;
        packet.data = new Packet();
        this.send(packet);
        Log.d("C2SNoLoseWinMore:",packet);
    }
    
    //请求比赛数据
    public onC2SRaces(){
        type Packet = typeof pb.C2SRaces;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.C2SRaces);
        let packet = new CmmProto<pb.C2SRaces>(Packet);
        packet.cmd = ProtoDef.pb.C2SRaces;
        packet.data = new Packet();
        this.send(packet);
        Log.d("onC2SRaces:",packet);
    }

    protected onS2CRaces(data :pb.S2CRaces)
    {
        Log.d(" 赛季列表数据  onS2CRaces:",data);
        Manager.gd.put(ProtoDef.pb.S2CRaces,data);



    }







}

