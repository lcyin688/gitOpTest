
import GameView from "../../../../scripts/framework/core/ui/GameView";
import { HallLogic } from "../logic/HallLogic";
import GameLevel from "./GameLevel";

import { GameEvent } from "../../../../scripts/common/event/GameEvent";
import PlayerUI from "./PlayerUI";
import { Config, ViewZOrder } from "../../../../scripts/common/config/Config";



import EmailView from "./EmailView";
import ATView from "./ATView";
import RankView from "./RankView";
import { GameCat, PlayerAttr, RankCat, RewardState, ScoreType } from "../../../../scripts/def/GameEnums";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";
import GameData from "../../../../scripts/common/data/GameData";
import SetView from "../../../../scripts/common/fairyui/SetView";
import Grid from "./Grid";
import StrongBox from "../../../../scripts/common/fairyui/StrongBox";
// import WanFa from "./wanfa/WanFa";
import RotaryTable from "./RotaryTable";
import DailyBonus from "./DailyBonus";
import RegularReward from "./RegularReward";
import ActivityView from "./ActivityView";
import { Update } from "../../../../scripts/framework/core/update/Update";
import { UpdateItem } from "../../../../scripts/framework/core/update/UpdateItem";
import PacksackView from "./PacksackView";
import { GameService } from "../../../../scripts/common/net/GameService";
import { LanguagePO } from "../../../../../tools/excel2ts/tsConfig/languagePO";
import RedDot from "./RedDot";
import LogonRedPacket from "./exchange/LogonRedPacket";
import ExchangeView from "./exchange/ExchangeView";
import PaoMaDengView from "./PaoMaDengView";
import FLevel2UI from "../../../../scripts/common/fairyui/FLevel2UI";
import ActivityPop from "./ActivityPop";
import TopUI from "../../../../scripts/common/fairyui/TopUI";
import ShopView from "../../../../scripts/common/fairyui/ShopView";
import CommonPop from "../../../../scripts/common/fairyui/CommonPop";
import Commonjifen from "./Commonjifen";
import { LoggerImpl } from "../../../../scripts/framework/core/log/Logger";
import VipView from "./VipView";
import VipDialog from "../../../../scripts/common/fairyui/VipDialog";
import MatchDaTing from "./Match/MatchDaTing";



const { ccclass, property } = cc._decorator;

@ccclass
export default class HallView extends GameView {

    public center:fgui.GComponent = null;

    public head:fgui.GComponent = null;

    public buttom:fgui.GComponent = null;

    public left:fgui.GComponent = null;

    public gameLevel:GameLevel = null;
    public headUi:PlayerUI = null;
    // public shop:ShopView = null;
    public email:EmailView = null;
    public atView:ATView = null;
    public rankView:RankView = null;
    public grid:Grid = null;
    public rotaryTable:RotaryTable = null;
    public dailyBonus:DailyBonus = null;
    public regularReward:RegularReward = null;
    public activityView:ActivityView = null;
    
    public packsack:PacksackView = null;

    public topUi:TopUI = null;

    // public wanFa:WanFa = null;

    public rp:RedDot = null;

    public newGrid:fgui.GComponent = null;

    //话费兑换
    private redPacket:LogonRedPacket = null;
    private exchangeView:ExchangeView = null;
    private vipView:VipView = null;

    protected RedPacket():LogonRedPacket{
        if(this.redPacket == null){
            this.redPacket = new LogonRedPacket();
            this.redPacket.Init(this);
            this.redPacket.addListeners();
        }
        return this.redPacket;
    }

    protected Exchange():ExchangeView{
        if(this.exchangeView == null){
            this.exchangeView = new ExchangeView();
            this.exchangeView.Init(this);
            this.exchangeView.addListeners();
        }
        return this.exchangeView;
    }

    protected Vip():VipView{
        if(this.vipView == null){
            this.vipView = new VipView();
            this.vipView.Init(this);
            this.vipView.addListeners();
        }
        return this.vipView;
    }


    public paoMaDengViewSC:PaoMaDengView = null;


    public static getPrefabUrl() {
        return "prefabs/HallView";
    }

    static getViewPath(): ViewPath {
        let path : ViewPath = {
            	/**@description 资源路径 creator 原生使用*/
            assetUrl: "ui/hall",
            /**@description 包名称 fgui 使用*/
            pkgName : "hall",
            /**@description 资源名称 fgui 使用*/
            resName : "HallView",
        }
        return path;
    }
    
    static logicType = HallLogic;

    public get logic(): HallLogic | null {
        return this._logic as any;
    }

    get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }

    private checkBundleStatus(){
        if(Manager.updateManager.isSkipCheckUpdate || Manager.updateManager.isBrowser){
            this.center.getChild("hzxl").asCom.getChild("di").visible = false;
            this.center.getChild("ddz").asCom.getChild("di").visible = false;
            this.center.getChild("sjpw").asCom.getChild("di").visible = false;
            this.center.getChild("srlf").asCom.getChild("di").visible = false;
            this.center.getChild("match").asCom.getChild("di").visible = false;
            return;
        }

        let statusOther = false;
        let statusCM = Manager.updateManager.getStatus(Config.BUNDLE_GameCOMMON);
        let statusDDZ = Manager.updateManager.getStatus(Config.BUNDLE_DDZ);
        if (statusDDZ == Update.Status.UP_TO_DATE && statusCM == Update.Status.UP_TO_DATE) {
            this.center.getChild("ddz").asCom.getChild("di").visible = false;
        }else{
            this.center.getChild("ddz").asCom.getChild("di").visible = true;
            let uiconfig = Manager.gd.get<pb.S2CUISwitches>(ProtoDef.pb.S2CUISwitches);
            if(uiconfig != null && uiconfig.items != null){
                if(uiconfig.items["hall_ddz"] != null && uiconfig.items["hall_ddz"] == 1)
                {
                    statusOther = true;
                }
            }
        }


        let statusMJCM = Manager.updateManager.getStatus(Config.BUNDLE_MJCOMMON);
        let statusXLHZ = Manager.updateManager.getStatus(Config.BUNDLE_XLHZ);
        let statusXLTT = Manager.updateManager.getStatus(Config.BUNDLE_XLThreeTwo);

        if (statusCM == Update.Status.UP_TO_DATE && statusMJCM == Update.Status.UP_TO_DATE && statusXLHZ == Update.Status.UP_TO_DATE) {
            this.center.getChild("hzxl").asCom.getChild("di").visible = false;
        }else{
            this.center.getChild("hzxl").visible = true;
            statusOther = true;
        }

        if (statusCM == Update.Status.UP_TO_DATE && statusMJCM == Update.Status.UP_TO_DATE && statusXLTT == Update.Status.UP_TO_DATE) {
            this.center.getChild("srlf").asCom.getChild("di").visible = false;
        }else{
            this.center.getChild("srlf").visible = true;
            statusOther = true;
        }

        this.center.getChild("sjpw").asCom.getChild("di").visible = statusOther;
        this.center.getChild("match").asCom.getChild("di").visible = statusOther;
    }

    toUpdateStatus(item:UpdateItem){
        // Log.d("HallView.toUpdateStatus",JSON.stringify(item));
        let content = Manager.getLanguage("downloadFailed");
        Manager.alert.show({
            text: content,
            confirmString:"重试",
            confirmCb: (isOK) => {
                item.checkUpdate();
            }
        });
    }

    onDownloadProgess(info: Update.DownLoadInfo){
        // Log.d("HallView.onDownloadProgess",cur,max,JSON.stringify(info));
        Manager.bundleExtend.setDownloadProgress(info);
        if(Manager.bundleExtend.belong(info.bundle,Config.BUNDLE_DDZ)){
            this.onDownloadProgessDDZ(info,Manager.bundleExtend.getDownloadProgress(Config.BUNDLE_DDZ));
        }
        if(Manager.bundleExtend.belong(info.bundle,Config.BUNDLE_XLHZ)){
            this.onDownloadProgessXLHZ(info,Manager.bundleExtend.getDownloadProgress(Config.BUNDLE_XLHZ));
        }

        if(Manager.bundleExtend.belong(info.bundle,Config.BUNDLE_XLThreeTwo)){
            this.onDownloadProgessXLThreeTwo(info,Manager.bundleExtend.getDownloadProgress(Config.BUNDLE_XLThreeTwo));
        }

        this.onDownloadProgessSJPW();
    }


    private onDownloadProgessSJPW(){
        let mask = this.center.getChild("sjpw").asCom.getChild("di").asCom;
        if(mask.data == null){
            return;
        }
        let progress = Manager.bundleExtend.getAllProgress();
        Log.d("onDownloadProgessSJPW:",progress);
        if(progress < 0){
            mask.visible = true;
        }else if(progress < 1){
            let cm = mask.getChild("mask").asImage;
            cm.fillAmount = 1-progress;
        }else if(progress >= 1.1){
            mask.visible = false;
        }
    }

    private onDownloadProgessDDZ(info: Update.DownLoadInfo,progress:number){
        let mask = this.center.getChild("ddz").asCom.getChild("di").asCom;
        if(mask.data == null){
            return;
        }
        Log.d("onDownloadProgessDDZ:",progress);
        if(progress < 0){
            mask.visible = true;
        }else if(progress < 1){
            let cm = mask.getChild("mask").asImage;
            cm.fillAmount = 1-progress;
        }else if(progress >= 1.1){
            mask.visible = false;
        }
    }

    private onDownloadProgessXLHZ(info: Update.DownLoadInfo,progress:number){
        let mask = this.center.getChild("hzxl").asCom.getChild("di").asCom;
        if(mask.data == null){
            return;
        }
        Log.d("onDownloadProgessXLHZ:",progress);
        if(progress < 0){
            mask.visible = true;
        }else if(progress < 1){
            let cm = mask.getChild("mask").asImage;
            cm.fillAmount = 1-progress;
        }else if(progress >= 1.1){
            mask.visible = false;
        }
    }
    
    private onDownloadProgessXLThreeTwo(info: Update.DownLoadInfo,progress:number){
        let mask = this.center.getChild("srlf").asCom.getChild("di").asCom;
        if(mask.data == null){
            return;
        }
        Log.d("onDownloadProgessXLThreeTwo:",progress);
        if(progress < 0){
            mask.visible = true;
        }else if(progress < 1){
            let cm = mask.getChild("mask").asImage;
            cm.fillAmount = 1-progress;
        }else if(progress >= 1.1){
            mask.visible = false;
        }
    }
    


    onClickDlSrlf(evt: fgui.Event){
        let mask = this.center.getChild("srlf").asCom.getChild("di").asCom;
        if(mask.data != null){
            return;
        }
        Manager.tips.show("已加入下载队列，请耐心等待");
        mask.data = "downloading";
        if(!Manager.updateManager.dowonLoadGame(Config.BUNDLE_XLThreeTwo)){
            Manager.tips.show("添加三人两房到下载列表失败失败");
        }
        // Manager.tips.show("敬请期待");
    }

    onClickDlSjpw(evt: fgui.Event){
        let mask = this.center.getChild("sjpw").asCom.getChild("di").asCom;
        if(mask.data != null){
            return;
        }
        Manager.tips.show("已加入下载队列，请耐心等待");
        mask.data = "downloading";
        if(!Manager.updateManager.dowonLoadGame(Config.BUNDLE_XLHZ)){
            Manager.tips.show("添加血流红中到下载列表失败失败");
        }
        if(!Manager.updateManager.dowonLoadGame(Config.BUNDLE_XLThreeTwo)){
            Manager.tips.show("添加血流红中到下载列表失败失败");
        }

        if(!Manager.updateManager.dowonLoadGame(Config.BUNDLE_DDZ)){
            Manager.tips.show("添加斗地主到下载列表失败失败");
        }

        // let uiconfig = Manager.gd.get<pb.S2CUISwitches>(ProtoDef.pb.S2CUISwitches);
        // if(uiconfig != null && uiconfig.items != null){
        //     if(uiconfig.items["hall_ddz"] != null && uiconfig.items["hall_ddz"] == 1)
        //     {
        //         if(!Manager.updateManager.dowonLoadGame(Config.BUNDLE_DDZ)){
        //             Manager.tips.show("添加斗地主到下载列表失败失败");
        //         }
        //     }
        // }


    }
    onClickDlMatch(evt: fgui.Event){
        let mask = this.center.getChild("match").asCom.getChild("di").asCom;
        if(mask.data != null){
            return;
        }
        Manager.tips.show("已加入下载队列，请耐心等待");
        mask.data = "downloading";
        if(!Manager.updateManager.dowonLoadGame(Config.BUNDLE_XLHZ)){
            Manager.tips.show("添加血流红中到下载列表失败失败");
        }
        if(!Manager.updateManager.dowonLoadGame(Config.BUNDLE_XLThreeTwo)){
            Manager.tips.show("添加血流红中到下载列表失败失败");
        }

        if(!Manager.updateManager.dowonLoadGame(Config.BUNDLE_DDZ)){
            Manager.tips.show("添加斗地主到下载列表失败失败");
        }

        // let uiconfig = Manager.gd.get<pb.S2CUISwitches>(ProtoDef.pb.S2CUISwitches);
        // if(uiconfig != null && uiconfig.items != null){
        //     if(uiconfig.items["hall_ddz"] != null && uiconfig.items["hall_ddz"] == 1)
        //     {
        //         if(!Manager.updateManager.dowonLoadGame(Config.BUNDLE_DDZ)){
        //             Manager.tips.show("添加斗地主到下载列表失败失败");
        //         }
        //     }
        // }


    }
    onClickDlDdz(evt: fgui.Event){
        Log.d("onClickDlDdz");
        let mask = this.center.getChild("ddz").asCom.getChild("di").asCom;
        if(mask.data != null){
            return;
        }
        Manager.tips.show("已加入下载队列，请耐心等待");
        mask.data = "downloading";
        if(!Manager.updateManager.dowonLoadGame(Config.BUNDLE_DDZ)){
            Manager.tips.show("添加斗地主到下载列表失败失败");
        }
    }
    onClickDlHzxl(evt: fgui.Event){
        Log.d("onClickDlHzxl");
        let mask = this.center.getChild("hzxl").asCom.getChild("di").asCom;
        if(mask.data != null){
            return;
        }
        Manager.tips.show("已加入下载队列，请耐心等待");
        mask.data = "downloading";
        if(!Manager.updateManager.dowonLoadGame(Config.BUNDLE_XLHZ)){
            Manager.tips.show("添加血流红中到下载列表失败失败");
        }
    }

    onDestroy(): void {
        this.gameLevel.removeEventListeners();
        this.headUi.removeEventListeners();
        this.gameLevel.removeEventListeners();
        this.headUi.removeEventListeners();
        // this.shop.removeEventListeners();
        this.email.removeEventListeners();
        this.atView.removeEventListeners();
        this.rankView.removeEventListeners();
        this.grid.removeEventListeners();
        // this.wanFa.removeEventListeners();
        this.rotaryTable.removeEventListeners();
        this.dailyBonus.removeEventListeners();
        this.regularReward.removeEventListeners();

        this.activityView.removeEventListeners();
        this.packsack.removeEventListeners();
        this.rp.removeEventListeners();

        this.topUi.removeEventListeners();

        if(this.redPacket != null){
            this.redPacket.removeEventListeners();
        }
        if(this.exchangeView != null){
            this.exchangeView.removeEventListeners();
        }
        if(this.vipView != null){
            this.vipView.removeEventListeners();
        }
        // this.MjMatCh.onDestroy();

        this.paoMaDengViewSC.RemoveEvent()

        super.onDestroy();
    }

    onLoad() {
        
        Log.d("popup: onLoad==================");
        // setTimeout(() => {
        //     //广告测试
        //     Manager.adManeger.WatchAds("Ad_ActTurnTable",null);
        // }, 2000);
        super.onLoad();

        this.addEft();

        this.logic.logined();

        this.gameLevel.addListeners();
        this.headUi.addListeners();
        // this.shop.addListeners();
        this.email.addListeners();
        this.atView.addListeners();
        this.rankView.addListeners();
        this.grid.addListeners();
        this.rotaryTable.addListeners();
        this.dailyBonus.addListeners();
        this.regularReward.addListeners();
        this.activityView.addListeners();
        // this.wanFa.addListeners();
        this.packsack.addListeners();
        this.topUi.addListeners();

        this.rp.addListeners();
        this.rp.onLoad();

        Manager.platform.getLocation();
        // this.bindHead();
        // this.bindProperty();
        // this.refreshUI();
        this.setQsGameName();

        // let d = new VipDialog();
        // d.Init(this);
        // d.open("每日");

        // d = new VipDialog();
        // d.Init(this);
        // d.open("奖励");

        Log.e("HallView Config.ENTRY_CONFIG:",Config.ENTRY_CONFIG);

        Manager.uiLoading.hide();
        Log.d("hallview onLoad Manager.netMode=",Manager.netMode);

        //可能服务器调整了消息顺序，在大厅主动刷新一次
        dispatch(GameEvent.RefreshPlayer);
        //处理重连
        let reGameData = Manager.gd.get(ProtoDef.pb.S2CGoOnGame) as any;
        Log.d("重连 hallview onLoad reGameData=",reGameData);
        if(reGameData != null){
            if(reGameData.GameCat == GameCat.GameCat_Dou){
                if(reGameData.GameData != null){
                    // if(reGameData.GameData.tableBase.players.length == reGameData.GameData.tableBase.playerCount){
                        Manager.dataCenter.get(GameData).put(ProtoDef.pb.S2CDouTableInfo,reGameData.GameData);
                        dispatch(GameEvent.ENTER_GAME,Config.BUNDLE_DDZ);
                        Manager.gd.put(ProtoDef.pb.S2CGoOnGame,null);
                        return;
                    // }
                }
            }else if(reGameData.GameCat == GameCat.GameCat_Mahjong || reGameData.GameCat == GameCat.GameCat_Mah3Ren2Fang){
                if(reGameData.GameData != null){
                    this.service.OnS2CMahTableData(reGameData.GameData)
                    
                    Manager.gd.put(ProtoDef.pb.S2CGoOnGame,null);
                    return;
                }
            }
            Log.e("重新进入游戏失败，数据错误：",reGameData);
            return;
        }

        this.logic.gradeCfgs();
        this.logic.rankRewardCfgs();

        let data = Manager.dataCenter.get(GameData).get(ProtoDef.pb.S2CGetTables) as any;
        if(data != null){
            this.gameLevel.open(data);
        }else{
            this.logic.getGameList();
        }
        // //如果还在游戏中，拉入了游戏，就不处理
        // if (Manager.netMode){
        //     let data = Manager.dataCenter.get(GameData).get(ProtoDef.pb.S2CGames) as any;
        //     if(data != null){
        //         for (let index = 0; index < data.items.length; index++) {
        //             this.bindGameID(index+1,data.items[index]);
        //         }
        //     }else{
                

        //     }
        // }


        Manager.globalAudio.playMusic("audio/hall_bgm",Config.BUNDLE_HALL,true);
        // this.playGameItmeAction();   

        let beginnerMoney = Manager.gd.get<pb.S2CGiveBeginnerMoney>(ProtoDef.pb.S2CGiveBeginnerMoney);
        if(beginnerMoney != null){
            this.onS2CGiveBeginnerMoney(beginnerMoney);
        }
        // this.checkActPop();
        this.logic.checkRealAuth();
        //请求下任务数据
        this.service.getAchievCfg();

        this.logic.getSeasonHisRankList(GameCat.GameCat_Mahjong);

        //请求下排行榜配置数据
        this.service.getSGetScoreRewardCfgs();
        Manager.reward.pause = false;

        this.SetUISwitch();

        if(Manager.gd.playerAttr(PlayerAttr.PA_VipDayReward) == RewardState.RewardState_Reach){
            Manager.uiqueue.addToQueue({type: VipDialog, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.TwoUI, name: "VIP每日奖励" ,args:"每日"});
        }

        Manager.uiqueue.show();
    }

    SetUISwitch()
    {
        let uiconfig = Manager.gd.get<pb.S2CUISwitches>(ProtoDef.pb.S2CUISwitches);
        if(uiconfig == null || uiconfig.items == null){
            return;
        }
        this.left.getChild("bwhl").visible=true;
        if(uiconfig.items["hall_bwhl"] == null || uiconfig.items["hall_bwhl"] == 0)
        {
            this.left.getChild("bwhl").visible=false;
        }

        this.buttom.getChild("hf").visible=true;
        if(uiconfig.items["hall_hf"] == null || uiconfig.items["hall_hf"] == 0)
        {
            this.buttom.getChild("hf").visible=false;
        }

        this.center.getChild("ddz").visible=true;
        if(uiconfig.items["hall_ddz"] == null || uiconfig.items["hall_ddz"] == 0)
        {
            this.center.getChild("ddz").visible=false;
        }

        


    }



    checkActPop(){
        // Log.d("checkActPop S2CActNotice");
        let data = Manager.gd.get<pb.S2CActNotice>(ProtoDef.pb.S2CActNotice);
        Log.d("checkActPop S2CActNotice",data);
        if(data == null){
            return;
        }
        for (let index = 0; index < data.items.length; index++) {
            let item = data.items[index];
            if(!item.popup){
                continue;
            }
            // Log.d("checkActPop S2CActNotice item",item);
            let ap = new ActivityPop();
            ap.Init(this);
            ap.setActData(item);
            // this.logic.addToPopQueue(ap);
            Manager.uiqueue.addToQueue(ap);
        }
        // this.logic.showPop();
    }

    onLbs(data:any){
        let gs = Manager.serviceManager.get(GameService) as GameService;
        if(gs != null){
            gs.reportLocat(JSON.stringify(data));
        }
    }

    onS2CGiveBeginnerMoney(data:pb.S2CGiveBeginnerMoney){
        this.logic.addToPopQueue(this.RedPacket());
        this.logic.showPop();
    }

    playGameItmeAction(){
        this.center.visible = true;
        this.center.getTransition("t0").play();
        this.root.getTransition("t1").play();
    }

    bindGameID(index:number,gameId:pb.IGameItem){
        if(gameId.id == GameCat.GameCat_Dou){
            this.center.getChild("ddz").data = gameId;
            return;
        }
        if(gameId.id == GameCat.GameCat_Mahjong){
            this.center.getChild("hzxl").data = gameId;
            return;
        }
        if(gameId.id == GameCat.GameCat_Mah3Ren2Fang){
            this.center.getChild("srlf").data = gameId;
            return;
        }
        Manager.tips.debug("未知的游戏："+gameId.name);
    }

    private isNetInit(obj: fgui.GObject):boolean{

        Log.d("isNetInit  obj.data  ",obj.data);

        if (obj.data == null){
            let ip = Manager.localStorage.getItem("ip");
            if (ip != null){
                Manager.tips.show("服务器["+ip+"]没有返回 pb.S2CGames");
            }
            Manager.tips.show("服务器没有返回 pb.S2CGames");
            this.logic.getGameList();
            return false
        }
        return true;
    }

    //经典玩法
    onClickDdz(evt: fgui.Event){
        let obj: fgui.GObject = fgui.GObject.cast(evt.currentTarget);
        if (!this.isNetInit(obj)){
            return;
        }
        if (obj.asCom.getChild("di").visible) {
            this.onClickDlDdz(evt)
        }
        else
        {
            this.service.openGameList(obj.data.id);
        }
    }

    //血流红中
    onClickXLHZ(evt: fgui.Event){
        let obj: fgui.GObject = fgui.GObject.cast(evt.currentTarget);
        if (!this.isNetInit(obj)){
            return;
        }

        if (obj.asCom.getChild("di").visible) {
            this.onClickDlHzxl(evt)
        }
        else
        {
            this.service.openGameList(obj.data.id);
        }
    }

    //排位
    onClickGrid(evt: fgui.Event){
        let data = Manager.dataCenter.get(GameData).get(ProtoDef.pb.S2CGames);
        if (data == null){
            return;
        }
        let lastGameId = Manager.localStorage.getItem("gridGameId",-1);

        let obj: fgui.GObject = fgui.GObject.cast(evt.currentTarget);
        if (obj.asCom.getChild("di").visible) {
            this.onClickDlSjpw(evt)
        }
        else
        {
            this.logic.openGridGameList(lastGameId);
        }


    }

    //比赛
    onClickMatch(evt: fgui.Event){
        Log.e(" onClickMatch  比赛 " );
        // let data = Manager.dataCenter.get(GameData).get(ProtoDef.pb.S2CGames);
        // if (data == null){
        //     return;
        // }
        let obj: fgui.GObject = fgui.GObject.cast(evt.currentTarget);
        if (obj.asCom.getChild("di").visible) {
            this.onClickDlMatch(evt)
        }
        else
        {
            Log.e(" onClickMatch  比赛 009 " );
            this.service.onC2SRaces();
            Manager.uiManager.openFairy({ type: MatchDaTing, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.UI, name: "比赛大厅" });
        }


    }


    



    //三人两房
    onClickSRLF(evt: fgui.Event){
        let obj: fgui.GObject = fgui.GObject.cast(evt.currentTarget);
        
        // Log.e(" onClickSRLF  obj : ",obj.data );
        if (!this.isNetInit(obj)){
            return;
        }
        if (obj.asCom.getChild("di").visible) {
            this.onClickDlSrlf(evt)
        }
        else
        {
            this.service.openGameList(obj.data.id);
        }

    }

    //商店
    onClickShop(evt: fgui.Event){

        Log.w("Hallview 点击了商城 ")

        // let obj: fgui.GObject = fgui.GObject.cast(evt.currentTarget);
        // this.shop.setSelectIndex(0);
        // this.shop.show();
        // this.service.getShopItems();

        Manager.gd.put(ProtoDef.pb.S2CGetShopItems+"Index",{catName:"免费金豆"});
        Manager.uiManager.openFairy({ type: ShopView, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.ShopUI, name: "商城" });
        
    }

    // GoToShop(index :number)
    // {        
    //     // this.shop.setSelectIndex(index);
    //     // this.shop.show();
    //     // this.service.getShopItems();
    // }


    onShowGameList(tables:pb.S2CGetTables){
        Log.w("Hallview onShowGameList   tables ",tables)
        if (tables.gameType!=-1) {
            this.hideCover();
            this.gameLevel.open(tables);
        }

    }
    onEventSilentGoHall(data){
        Log.d("onEventSilentGoHall:",data);
        this.logic.onEventSilentGoHall();
    }
    //邮件
    onClickEmail(evt: fgui.Event){
        this.logic.openEmail();
    }

    onEmailOpen(mails:pb.S2CMails){
        // this.hideCover();
        this.email.open(mails);
    }

    //快速开始名称
    setQsGameName(){

        let data = Manager.gd.get<pb.S2CQuickStart>(ProtoDef.pb.S2CQuickStart);
        if(data != null){
            this.root.getChild("qs").text = data.name;
            return;
        }

        let cfgs = Manager.gd.get<pb.S2CCfgs>(ProtoDef.pb.S2CCfgs);
        if(cfgs != null && cfgs.quickStart != null && cfgs.quickStart.length > 0){
            this.root.getChild("qs").text = cfgs.quickStart;
            Log.w("setQsGameName:",cfgs.quickStart);
        }
    }

    onQuickStart(){
        let data = Manager.gd.get<pb.S2CQuickStart>(ProtoDef.pb.S2CQuickStart);
        if(data != null){
            this.root.getChild("qs").text = data.name;
        }
    }
    //快速开始
    onClickQs(){
        this.logic.quickStart();
    }

    //活动
    onClickActivity(){
        // this.rankView.show();
        this.activityView.show();
    }

    //背包
    onClickPacksack(){
        this.service.GetBag();
        this.packsack.open();
    }

    onS2CGetMoneyDetail(data:pb.S2CGetMoneyDetail){
        if(this.exchangeView){
            this.exchangeView.setMoneyDetailData(data);
        }
    }

    onS2CGetMoneyCfgs(data:pb.S2CGetMoneyCfgs){
        let ec = this.Exchange();
        ec.setMoneyCfgsData(data);
    }

    //VIP
    onClickVip(){
        this.Vip().show();
    }

    //话费
    onClickHf(){
        this.logic.getMoneyCfgs();
        if(this.exchangeView){
            this.exchangeView.show();
        }
    }

    //排行榜
    onClickRank(){
        // this.rankView.show();
        this.logic.getRankList(RankCat.RankCat_Coin);
    }

    //头像点击 
    onClickHead(){
        this.hideCover();
        this.headUi.show();
    }

    //任务等级
    onClickTA(){
        this.hideCover();
        this.atView.show();
    }

    //转盘
    onClickRotaryTable(){
        this.logic.getActivityRotary();
    }

    //7日签到
    onClickDailyBonus(){
        this.logic.getActivityDailyBonus();
    }

    //定时登录
    onClickRegularReward(){
        this.logic.getZaiXianInfo();
    }

    //百万豪礼
    onClickBWHL(){
        this.service.getBWHLInfo(ScoreType.ST_Day);
        Manager.uiManager.openFairy({ type: Commonjifen, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.UI, name: "百万豪礼" });

    }
    

        
    onClickStrong(){
        Manager.uiManager.openFairy({ type: StrongBox, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.UI, name: "保险箱" });
    }

    public showCover(){
        // let group = this.root.getChild("cover").asGroup;
        // group.visible = true;
        // this.playGameItmeAction();
    }

    protected hideCover(){
        // let group = this.root.getChild("cover").asGroup;  
        // group.visible = false;
    }

    onFairyLoad(): void {
        // this.root.alpha =0.2;
        // fgui.GTween.to(1, 0, 500)
        // .setTarget(this.centerEff_loader3d, this.centerEff_loader3d.alpha)
        // .setEase(fgui.EaseType.CubicOut).onComplete(() => {undefined
        //     this.SetActivecenterEff_loader3d(false);
        //     //透明度改变完成
        // }, this);

        Manager.utils.GetDaoJuConfig();
        Manager.utils.GetAdsConfig();

        this.root.name = "HallView";
        this.gameLevel = new GameLevel();
        this.gameLevel.Init(this,"l2_ginfo");
        this.gameLevel.bind();

        // this.shop = new ShopView();
        // this.shop.Init(this,"l2_shop");
        // this.shop.bind();

        this.rankView = new RankView();
        this.rankView.Init(this,"l2_rank");
        this.rankView.bind();

        // this.wanFa = new WanFa();
        // this.wanFa.Init(this,"wanFaView");
        // this.wanFa.bind();
        
        this.rotaryTable = new RotaryTable();
        this.rotaryTable.Init(this,"rtable");
        this.rotaryTable.bind();

        this.dailyBonus = new DailyBonus();
        this.dailyBonus.Init(this,"ss");
        this.dailyBonus.bind();

        this.regularReward = new RegularReward();
        this.regularReward.Init(this,"rr");
        this.regularReward.bind();

        this.email = new EmailView();
        this.email.Init(this,"email");
        this.email.bind();

        this.activityView = new ActivityView();
        this.activityView.Init(this,"activityView");
        this.activityView.bind();

        this.atView = new ATView();
        this.atView.Init(this,"achtask");
        this.atView.bind();

        this.grid = new Grid();
        this.grid.Init(this,"grid");
        this.grid.bind();

        this.packsack = new PacksackView();
        this.packsack.Init(this,"packsack");
        this.packsack.bind();


        this.root.getChild("shop").onClick(this.onClickShop,this);

        this.center = this.root.getChild("center").asCom;
        this.center.getChild("ddz").onClick(this.onClickDdz,this);
        this.center.getChild("hzxl").onClick(this.onClickXLHZ,this);
        this.center.getChild("sjpw").onClick(this.onClickGrid,this);
        this.center.getChild("srlf").onClick(this.onClickSRLF,this);
        this.center.getChild("match").onClick(this.onClickMatch,this);
        
        // this.center.visible = false;


        // this.center.getChild("ddz").asCom.getChild("di").onClick(this.onClickDlDdz,this);
        // this.center.getChild("hzxl").asCom.getChild("di").onClick(this.onClickDlHzxl,this);
        // this.center.getChild("sjpw").asCom.getChild("di").onClick(this.onClickDlSjpw,this);
        // this.center.getChild("srlf").asCom.getChild("di").onClick(this.onClickDlSrlf,this);
        this.checkBundleStatus();

        this.newGrid = this.root.getChild("newGrid").asCom;
        this.newGrid.visible = false;
        this.newGrid.getChild("n0").asCom.getChild("qd").onClick(this.onClickSJOpen,this);
    
        this.head = this.root.getChild("faceArea").asCom;
        this.headUi = new PlayerUI();
        this.headUi.Init(this,"l2_player");
        this.headUi.bind();
        this.headUi.setHallHead(this.head);
        this.head.getChild("face").onClick(this.onClickHead,this);
        this.head.getChild("vip").onClick(this.onClickVip,this);

        this.topUi = new TopUI();
        this.topUi.Init(this,"top");

        this.buttom = this.root.getChild("buttom").asCom;
        // this.buttom.getChild("sz").onClick(this.onClickSet,this);
        this.buttom.getChild("yj").onClick(this.onClickEmail,this);
        this.buttom.getChild("cj").onClick(this.onClickTA,this);
        this.buttom.getChild("phb").onClick(this.onClickRank,this);
        this.buttom.getChild("hd").onClick(this.onClickActivity,this);
        this.buttom.getChild("beibao").onClick(this.onClickPacksack,this);
        this.buttom.getChild("hf").onClick(this.onClickHf,this);
        // Log.d("this.buttom",this.buttom.width );
        // this.buttom.setSize(this.buttom.width * (fgui.GRoot.inst.width/1334),this.buttom.height);
        // Log.d("this.buttom",this.buttom.width );

        this.left = this.root.getChild("left").asCom;
        this.left.getChild("bxx").onClick(this.onClickStrong,this);
        this.left.getChild("dzp").onClick(this.onClickRotaryTable,this);
        this.left.getChild("qd").onClick(this.onClickDailyBonus,this);
        this.left.getChild("xshd").onClick(this.onClickRegularReward,this); 
        this.left.getChild("bwhl").onClick(this.onClickBWHL,this); 
        this.root.getChild("qs").onClick(this.onClickQs,this);

        this.rp = new RedDot();
        this.rp.Init(this)
        this.rp.bind();

        Manager.gd.LocalPosition = "HallView";

        this.paoMaDengViewSC = new PaoMaDengView(this.root.getChild("paoMaDeng").asCom);


        // Manager.uiManager.openFairy({ type: CommonPop, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.Reward, name: "主动弹窗" });

    }

    protected addEvents() {
        super.addEvents();
        this.addEvent(GameEvent.ENTER_GAME, this.enterGame);
        this.addEvent(GameEvent.Err_Close_GameList, this.errCloseGameList);
        this.addEvent(ProtoDef.pb.S2CDuanWeiReset, this.onS2CDuanWeiReset);
        // this.addEvent(GameEvent.UI_General_WanFa, this.showGeneralQWanFa);
        this.addEvent(ProtoDef.pb.S2CGetTables, this.onShowGameList);
        this.addEvent(GameEvent.Silent_GO_HALL, this.onEventSilentGoHall);
        this.addEvent(ProtoDef.pb.S2CGiveBeginnerMoney, this.onS2CGiveBeginnerMoney);
        this.addEvent(ProtoDef.pb.S2CGetMoneyDetail, this.onS2CGetMoneyDetail);
        this.addEvent(ProtoDef.pb.S2CGetMoneyCfgs, this.onS2CGetMoneyCfgs);
        // this.addEvent("GoToShop", this.GoToShop);
        this.addEvent(ProtoDef.pb.S2CActNotice, this.checkActPop);

        this.addEvent(GameEvent.SDK_LBS,this.onLbs)
        this.addEvent(ProtoDef.pb.S2CQuickStart, this.onQuickStart);
    }

    protected onS2CDuanWeiReset(data:pb.S2CDuanWeiReset){
        this.newGrid.visible = true;
        let hz = this.newGrid.getChild("n0").asCom.getChild("hz").asCom;
        let dwData:pb.S2CGetSeasonDuanWeiCfg = Manager.dataCenter.get(GameData).get<pb.S2CGetSeasonDuanWeiCfg>(ProtoDef.pb.S2CGetSeasonDuanWeiCfg+"_"+Manager.utils.gt(data.gameCat));
        let conf = dwData.items[data.newDuanWei-1];  
        // hz.getChild("tile").text = conf.name;
        // let iconId = Manager.utils.dwIcon(data.newDuanWei);
        // Log.e("onS2CDuanWeiReset",data,iconId);
        // hz.getChild("n0").icon = fgui.UIPackage.getItemURL(HallView.getViewPath().pkgName,"ui_rank_dw_di_"+iconId);
        // hz.getChild("level").text = fgui.UIPackage.getItemURL(HallView.getViewPath().pkgName,"ui_rank_dw_di_"+iconId);

        Manager.utils.setHz(hz,null,data.newDuanWei,dwData,true,true);
    }

    
    protected onClickSJOpen(){
        this.newGrid.visible = false;
    }

    protected errCloseGameList(){
        this.gameLevel.hide();
        this.grid.hide();
    }
    
    // protected showGeneralQWanFa(gameType:GameCat)
    // {
    //     this.wanFa.SetData(gameType)
    // }   

    /**进入麻将匹配界面  */
    public enterGame(data:any){
        // console.log(" 点击了 血流红中入口按键 释放进入 血流红中 事件 ");
        Log.w("enterGame:",data)
        this.enterBundle(data);
    }

    private addEft(){
        let bg = this.root.getChild("bg");
        if(bg){
            let node = new cc.Node();
            let par = node.addComponent(cc.ParticleSystem);
            par.loadFile({bundle:Config.BUNDLE_HALL,url:"particles/bjxxxiaoguo",view:null});
            node.x = this.root.node.width * 3 / 4;
            node.y = -50;
            bg.node.addChild(node);
        }
     }
}