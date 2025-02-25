
import GameData from "../../../../scripts/common/data/GameData";
import { GameEvent } from "../../../../scripts/common/event/GameEvent";
import FLevel2UI from "../../../../scripts/common/fairyui/FLevel2UI";
import GameMatches from "../../../../scripts/common/fairyui/GameMatches";
import { CurrencyType, GameCat, GroupId, RankCat } from "../../../../scripts/def/GameEnums";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";
import { HallLogic } from "../logic/HallLogic";
import HallView from "./HallView";
import TopUI from "../../../../scripts/common/fairyui/TopUI";
import { GameService } from "../../../../scripts/common/net/GameService";

export default class RankView extends FLevel2UI {

    private curS2CGetRankListData:pb.S2CGetRankList = null;

    private leftTab:fgui.GButton[] = [];

    private list:fgui.GList = null;

    private top3:fgui.GButton[] = [];

    private mHead:fgui.GComponent = null;
    private mNick:fgui.GTextField = null;
    private mCoin:fgui.GTextField = null;

    private yes:fgui.GComponent = null;
    private tod:fgui.GComponent = null;
    private rs:fgui.GComponent = null;

    private rl:fgui.GComponent = null;
    private topUI:TopUI = null;
    protected view(): HallView {
        return this._owner as HallView;
    }

    protected lg(): HallLogic {
        return this.view().logic;
    }
    get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }
    protected addEvents(): void {
        this.addEvent(GameEvent.UI_Rank_RefreshList,this.eventRefreshList);
        this.addEvent(GameEvent.RefreshPlayer,this.RefreshPlayer);
        
        this.addEvent(GameEvent.GP_Update+GroupId.GI_RankGetedReward+"_"+RankCat.RankCat_Coin,this.onRecvReward);   
        this.addEvent(GameEvent.GP_Update+GroupId.GI_RankGetedReward+"_"+RankCat.RankCat_Multiples,this.onRecvReward);      
        this.addEvent(GameEvent.GP_Update+GroupId.GI_RankGetedReward+"_"+RankCat.RankCat_PlayTimes,this.onRecvReward);   
        this.addEvent(GameEvent.GP_Update+GroupId.GI_RankGetedReward+"_"+RankCat.RankCat_WinCoin,this.onRecvReward);   
    }

    addListeners(): void {
        super.addListeners();
        if(this.topUI){
            this.topUI.addListeners();
        }
    }

    removeEventListeners(): void {
        super.removeEventListeners();
        if(this.topUI){
            this.topUI.removeEventListeners();
        }
    }
    
    protected onBind(): void {
      
        this.addEvents();

        this.top3 = [];
        this._close = this.root.getChild("close");
        this._close.asCom.getChild("back").asCom.getChild("gn").text = "排行榜";
        this.bindCloseClick();

        this.yes = this.root.getChild("yes").asCom;
        this.yes.getChild("recv").text = "领取奖励"
        this.tod = this.root.getChild("tod").asCom;
        this.tod.getChild("recv").text = "冲刺排名"
        
        this.rl = this.root.getChild("rl").asCom;

        for (let index = 0; index < 4; index++) {
            this.leftTab[index]=this.root.getChild("tab"+index).asButton;
            this.leftTab[index].onClick(this.onClickLeftTab,this);
            this.leftTab[index].getChild("title1").asTextField.fontSize = this.leftTab[index].getChild("title").asTextField.fontSize;
            this.leftTab[index].getChild("title1").text = this.leftTab[index].getChild("title").text;
            this.leftTab[index].data = index+1;
            if(index==0){
                this.yes.getChild("recv").data = index+1;
            }
         }

         Manager.utils.fontSyncText(this.rl.getChild("tab_tod").asCom);
         Manager.utils.fontSyncText(this.rl.getChild("tab_yes").asCom);

         this.rl.getChild("tab_tod").onClick(this.onClickTodayTab,this);
         this.rl.getChild("tab_yes").onClick(this.onClickYesTodayTab,this);

         this.list = this.rl.getChild("list").asList;
         this.list.removeChildrenToPool();

         for (let index = 0; index < 3; index++) {
            let rq = this.root.getChild("rq"+(index+1)).asButton;
            this.top3.push(rq);
            this.top3[index].data = index+1;
            this.initTop3item(this.top3[index]);
         }

         this.mHead = this.root.getChild("dhead").asCom;
         this.mNick = this.root.getChild("nick").asTextField;
         this.mCoin = this.root.getChild("coin").asTextField;

         this.rs = this.root.getChild("rs").asButton;
         this.rs.onClick(this.hideRs,this);
         this.rs.visible = false;

         this.yes.getChild("recv").onClick(this.onClickLq,this);
         this.tod.getChild("recv").onClick(this.onClickCc,this);

         this.setMeRank(-1,-1);

         this.topUI = new TopUI();
         this.topUI.setRoot(this.root);

         this.root.getChild("hint").onClick(this.clickrankRule,this);
         


    }

    hideRs(){
        this.rs.visible = false;
    }

    showRs(evt :fgui.Event){
        let obj = fgui.GObject.cast(evt.currentTarget);
        if(obj.data == null){
            return;
        }
        if(this.curS2CGetRankListData == null){
            return;
        }
        let items = Manager.gd.get<pb.IRankRewardCfg[]>(ProtoDef.pb.S2CRankRewardCfgs);
        if(items == null || items.length == 0){
            return;
        }
        let cur = this.curS2CGetRankListData.cat;
        for (let index = 0; index < items.length; index++) {
            let et = items[index];
            if(et.cat == cur){
                if(et.rankStart >= obj.data && et.rankEnd <= obj.data){
                    let list = this.rs.getChild("list").asList;
                    list.removeChildrenToPool()
                    for (const [key, val] of Object.entries(et.rewards)) {
                        let com = list.addItemFromPool().asCom;
                        com.getChild("title").text = Manager.utils.formatCoin(val,Number(key));
                        Manager.gd.getPropIcon(Number(key),com.getChild("icon").asLoader);
                    }
                    this.rs.visible = true;
                    return;
                }
            }
        }
    }

    initTop3item(com:fgui.GButton){
        com.getChild("head").asCom.getChild("loader").icon = fgui.UIPackage.getItemURL("base","player_info_diban_8");;
        com.onClick(this.showRs,this);
    }

    setMeRank(tod_rank:number,yes_rank:number){
        if (tod_rank <=0 ){
            this.tod.getChild("wsb").visible = true;
            this.tod.getChild("rank").visible = false;
            this.tod.getChild("sb").visible = false;
        }else{
            this.tod.getChild("wsb").visible = false;
            this.tod.getChild("rank").visible = true;
            this.tod.getChild("sb").visible = true;
            this.tod.getChild("rank").text = tod_rank.toString();
        }

        if (yes_rank <=0 ){
            this.yes.getChild("wsb").visible = true;
            this.yes.getChild("rank").visible = false;
            this.yes.getChild("sb").visible = false;
            this.yes.getChild("recv").enabled = false;
            this.yes.getChild("recv").text = "未达成";
        }else{
            this.yes.getChild("wsb").visible = false;
            this.yes.getChild("rank").visible = true;
            this.yes.getChild("sb").visible = true;
            this.yes.getChild("rank").text = yes_rank.toString();
            this.yes.getChild("recv").enabled = true;
            this.yes.getChild("recv").text = "领取奖励";
        }
    }

    onClickLeftTab(evt: fgui.Event){
        let obj = fgui.GObject.cast(evt.currentTarget);
        Log.d("onClickLeftTab:",obj.data);
        this.yes.getChild("recv").data = obj.data;
        this.lg().getRankList(obj.data);
    }

    onClickTodayTab(evt: fgui.Event){
        this.eventRefreshToday();
    }

    onClickYesTodayTab(evt: fgui.Event){
        this.eventRefreshYesToday();
    }

    onClickLq(evt: fgui.Event){
        this.lg().getRankReward(this.curS2CGetRankListData.cat);
    }

    onClickCc(evt: fgui.Event){
        this.hide();
        this.service.openGameList(GameCat.GameCat_Mahjong);
    }

    RefreshPlayer(){
        let gd = Manager.dataCenter.get(GameData);
        this.mCoin.text = gd.playerCurrenciesStr(CurrencyType.CT_Coin);
        this.mNick.text = gd.player().name;
        this.mHead.getChild("loader").icon = gd.headUrl();
    }
    
    onRecvReward(){
        this.yes.getChild("recv").enabled = false;
        this.yes.getChild("recv").text = "已领取";
    }

    eventRefreshList(data:pb.S2CGetRankList){
        Log.d("eventRefreshList:",data);
        if(this.root.visible == false){
            this.show();
            this.root.getController("RankLeft").selectedIndex = 0;
        }
        this.yes.getChild("recv").data = data.cat;
        this.curS2CGetRankListData = data;
        this.rl.getController("rt").selectedIndex = 0;
        this.RefreshPlayer();
        this.eventRefreshToday();
        this.findMe();
        this.topUI.refresh();
    }

    findMe(){
        let today = -1;
        let player = Manager.dataCenter.get(GameData).player();
        for (let index = 0; index < this.curS2CGetRankListData.todayData.items.length; index++) {
            let item = this.curS2CGetRankListData.todayData.items[index];
            if (item.player.guid == player.guid){
                today = item.rank;
                break;
            }
        }
        let yes = -1;
        for (let index = 0; index < this.curS2CGetRankListData.yesData.items.length; index++) {
            let item = this.curS2CGetRankListData.yesData.items[index];
            if (item.player.guid == player.guid){
                yes = item.rank;
                break;
            }
        }
        this.setMeRank(today,yes);
        if(this.yes.getChild("recv").enabled){
            let dataReward = Manager.gd.playerGV(GroupId.GI_RankGetedReward,this.curS2CGetRankListData.cat,0);
            let localData = Manager.utils.formatYesDate();
            if(dataReward.toString() == localData){
                this.yes.getChild("recv").enabled = false;
                this.yes.getChild("recv").text = "已领取";
            }else{
                this.yes.getChild("recv").enabled = true;
                this.yes.getChild("recv").text = "领取奖励";
            }
            Log.d(dataReward,localData);
        }
    }

    clearTop3(){
        for (let index = 0; index < this.top3.length; index++) {
            this.top3[index].getChild("head").asCom.getChild("loader").icon = "";
        }
    }

    eventRefreshToday(){
        // this.list.removeChildrenToPool();
        this.clearTop3();
        this.list.setVirtual();
        this.list.itemRenderer = this.renderTodayListItem.bind(this);
        this.list.numItems = this.curS2CGetRankListData.todayData.items.length;
        this.list.scrollToView(0);
        // for (let index = 0; index < this.curS2CGetRankListData.todayData.items.length; index++) {
        //     let item = this.curS2CGetRankListData.todayData.items[index];
        //     let com = this.list.addItemFromPool().asCom;
        //     this.setRankItem(com,item);
        //     this.setTodayTop3(item);
        // }
    }

    private renderTodayListItem(index: number, obj: fgui.GObject): void {
        let com = obj.asCom;
        if(com == null){
            return;
        }
        if(index >=this.curS2CGetRankListData.todayData.items.length){
            Log.e("数据长度错误")
            return;
        }
        let item = this.curS2CGetRankListData.todayData.items[index];
        if(item == null){
            Log.e("数据错误")
            return;
        }
        com.width = this.list.width;
        this.setRankItem(com,item);
        this.setTodayTop3(item);
    }

    setTodayTop3(data:pb.IRankItem){
        if (data.rank >0 && data.rank < 4){
            this.top3[data.rank-1].getChild("head").asCom.getChild("loader").icon = Manager.dataCenter.get(GameData).playerheadUrl(data.player.portraits);
        }
    }

    setRankItem(com:fgui.GComponent,data:pb.IRankItem){
        if (data.rank < 4){
            com.getChild("rank123").icon = fgui.UIPackage.getItemURL(HallView.getViewPath().pkgName,"ui_rank_icon_"+data.rank);
            com.getChild("rank").visible = false;
            com.getChild("rank123").visible = true;
        }else{
            com.getChild("rank").visible = true ;
            com.getChild("rank123").visible = false;
            com.getChild("rank").text = data.rank.toString();
        }
        com.getChild("head").asCom.getChild("loader").icon = Manager.dataCenter.get(GameData).playerheadUrl(data.player.portraits);
        com.getChild("nick").text = data.player.name;
        if (data.cat == RankCat.RankCat_Coin){
            com.getChild("icoin").visible = true;
            com.getChild("coin").visible = true;
            com.getChild("coin").text = Manager.utils.formatCoin(data.value);;
            com.getChild("value").visible = false;
        }else{
            com.getChild("icoin").visible = false;
            com.getChild("coin").visible = false;
            com.getChild("value").visible = true;
        }
        if(data.cat == RankCat.RankCat_Multiples){
            com.getChild("value").text = "倍数:"+data.value;
        }
        if(data.cat == RankCat.RankCat_PlayTimes){
            com.getChild("value").text = "对局:"+data.value;
        }
        if(data.cat == RankCat.RankCat_WinCoin){
            com.getChild("value").text = "赢分:"+ Manager.utils.formatCoin(data.value);
        }
    }

    eventRefreshYesToday(){
        // this.list.removeChildrenToPool();

        // this.list.removeChildrenToPool();
        this.clearTop3();
        this.list.setVirtual();
        this.list.itemRenderer = this.renderYesListItem.bind(this);
        this.list.numItems = this.curS2CGetRankListData.yesData.items.length;
        this.list.scrollToView(0);
        // for (let index = 0; index < this.curS2CGetRankListData.yesData.items.length; index++) {
        //     let item = this.curS2CGetRankListData.yesData.items[index];
        //     let com = this.list.addItemFromPool().asCom;
        //     this.setRankItem(com,item);
        // }
    }

    private renderYesListItem(index: number, obj: fgui.GObject): void {
        let com = obj.asCom;
        if(com == null){
            return;
        }
        if(index >=this.curS2CGetRankListData.yesData.items.length){
            Log.e("数据长度错误")
            return;
        }
        let item = this.curS2CGetRankListData.yesData.items[index];
        if(item == null){
            Log.e("数据错误")
            return;
        }
        this.setRankItem(com,item);
    }

    clickrankRule(evt: fgui.Event){

        Log.e("  clickrankRule !!!!  ");



    }




}