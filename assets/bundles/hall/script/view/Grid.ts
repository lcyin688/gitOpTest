import GameData from "../../../../scripts/common/data/GameData";
import { GameEvent } from "../../../../scripts/common/event/GameEvent";
import FLevel2UI from "../../../../scripts/common/fairyui/FLevel2UI";
import { GameService } from "../../../../scripts/common/net/GameService";
import { Utils } from "../../../../scripts/common/utils/Utils";
import { AreaId, AreaUnit, CurrencyType, GroupId, RewardState, SeasonState } from "../../../../scripts/def/GameEnums";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";
import { HallLogic } from "../logic/HallLogic";
import HallView from "./HallView";
import TopUI from "../../../../scripts/common/fairyui/TopUI";

export default class Grid extends FLevel2UI {

    private topUI:TopUI = null;

    // private newGridOpen:fgui.GComponent = null; //新赛季开启
    private sjRewardRule:fgui.GComponent = null; //赛季奖励与规则
    private history:fgui.GComponent = null;//赛季历史排行
    private national:fgui.GComponent = null;//全国排行
    // private levelup:fgui.GComponent = null;//段位提升

    private gameComBox:fgui.GComboBox = null;
    private levelComBox:fgui.GComboBox = null;
    private tableComBox:fgui.GComboBox = null;

    // private tableData:string[] = [];

    private tables :pb.S2CGetTables = null;
    private curLevel:number = -1;
    private curTable:number = -1;

    private gameType:number = -1;
    private tableCfgId:number = -1;

    private tempTime:string = "";

    private seasonData:pb.S2CSeason = null;

    protected view(): HallView {
        return this._owner as HallView;
    }

    protected lg(): HallLogic {
        return this.view().logic;
    }

    get service(){
        return Manager.serviceManager.get(GameService) as GameService;
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

    protected addEvents(): void {
        this.addEvent(GameEvent.UI_OpenGrid,this.onOpenGrid);
        this.addEvent(ProtoDef.pb.S2CDuanWeiChange,this.onS2CDuanWeiChange);
        this.addEvent(ProtoDef.pb.S2CSeasonRankList,this.onS2CSeasonRankList);
        this.addEvent(ProtoDef.pb.S2CSeason,this.onS2CSeason);
        // this.addEvent(ProtoDef.pb.S2CGetSeasonDuanWeiCfg,this.onS2CGetSeasonDuanWeiCfg);
        this.addEvent(ProtoDef.pb.S2CSeasonHisRankList,this.onS2CSeasonHisRankList);
        // this.addEvent(ProtoDef.pb.S2CGetSeasonRewardCfg,this.onS2CGetSeasonRewardCfg);
        this.addEvent(ProtoDef.pb.S2CGetSeasonReward, this.onS2CGetSeasonReward);
        this.addEvent(ProtoDef.pb.S2CGetDuanWeiReward, this.onS2CGetDuanWeiReward);
        this.addEvent(ProtoDef.pb.S2CMyLbs, this.onUpdateS2CMyLbs);
    }

    protected bindCloseClick(){
        this._close.onClick(this.onClickClose,this);
    }

    protected onClickClose(){
        this.lg().gobackLobby();
    }

    protected onBind(): void {
        this.addEvents();
        this._close = this.root.getChild("close");
        let back = this._close.asCom.getChild("back").asCom;
        back.getChild("gn").text = "赛季";
        // back.getChild("n2").visible = false;
        this.bindCloseClick();

        // this.newGridOpen = this.root.getChild("open").asCom;
        // this.newGridOpen.visible = false;

        this.sjRewardRule = this.root.getChild("sj").asCom;
        this.sjRewardRule.visible = false;


        let p0 = this.sjRewardRule.getChild("p0").asCom;
        let rcv = p0.getChild("rcv");
        rcv.onClick(this.onClickLQSJJL,this);
        Manager.utils.quickSetIcon(rcv);

        this.history = this.root.getChild("ls").asCom;
        this.history.getChild("bg").asCom.getChild("bg").asCom.getChild("n6").visible = false;
        this.history.visible = false;
        // for (let index = 0; index < 2; index++) {
        //     let tab = this.history.getChild("tab"+index).asCom;
        //     tab.getChild("title1").text = tab.getChild("title").text;
        // }
        for (let index = 0; index < 3; index++) {
            let tab = this.sjRewardRule.getChild("tab"+index).asCom;
            tab.getChild("title1").text = tab.getChild("title").text;
        }

        this.national = this.root.getChild("qg").asCom;
        this.national.visible = false;

        // this.levelup = this.root.getChild("lvup").asCom;
        // this.levelup.visible = false;

        this.root.getChild("sg").onClick(this.onClickStartGrid,this);

        this.gameComBox = this.root.getChild("gt").asComboBox;
        this.levelComBox = this.root.getChild("pt").asComboBox;
        this.tableComBox = this.root.getChild("rt").asComboBox;

        this.gameComBox.dropdown.x = this.gameComBox.x + this.gameComBox.width / 2 - this.gameComBox.dropdown.width / 2;
        this.levelComBox.dropdown.x = this.levelComBox.x + this.levelComBox.width / 2 - this.levelComBox.dropdown.width / 2;
        this.tableComBox.dropdown.x = this.tableComBox.x + this.tableComBox.width / 2 - this.tableComBox.dropdown.width / 2;

        this.gameComBox.on(fgui.Event.STATUS_CHANGED,this.onGameChange,this);
        this.levelComBox.on(fgui.Event.STATUS_CHANGED,this.onLevelChange,this);
        this.tableComBox.on(fgui.Event.STATUS_CHANGED,this.onTableChange,this);

        this.gameComBox._customizedItem = this.onCustomizedGameItem.bind(this);
        this.levelComBox._customizedItem = this.onCustomizedLevelItem.bind(this);
        this.tableComBox._customizedItem = this.onCustomizedTableItem.bind(this);

        this.root.getChild("qs").onClick(this.onClickQs,this);
        let bg = this.history.getChild("bg").asLabel;
        bg.getChild("close").onClick(this.onClickCloseQs,this);


        this.root.getChild("hint").onClick(this.onClickSj,this);

        this.root.getChild("sjjl").onClick(this.onClickJLSJ,this);
        this.root.getChild("dwjl").onClick(this.onClickJLDW,this);
        bg = this.sjRewardRule.getChild("bg").asLabel;
        bg.getChild("close").onClick(this.onClickCloseJLSJ,this);
        bg.getChild("close").onClick(this.onClickCloseJLDW,this);

        this.root.getChild("dwjl").asCom.getChild("qsname").text = "段位礼包";

        this.root.getChild("rn").onClick(this.onClickQG,this);
        let qg = this.root.getChild("qg").asCom;
        bg = qg.getChild("bg").asLabel;
        bg.getChild("close").onClick(this.onClickCloseQG,this);

        // qg.getChild("r0").onClick(this.onClickQG,this);
        let r1 = qg.getChild("r1");
        let r2 = qg.getChild("r2");
        r1.onClick(this.onClickShengPaim,this);
        r2.onClick(this.onClickShiPaim,this);

        let lbs = Manager.gd.get<pb.S2CMyLbs>(ProtoDef.pb.S2CMyLbs);
        if(lbs != null && lbs.item != null){
            if(lbs.item.cityId > 0 && lbs.item.cityName.length > 0){
                r2.text = lbs.item.cityName;
                r2.data = lbs.item.cityId;
                r2.visible = true;
            }
            if(lbs.item.provId > 0 && lbs.item.provName.length > 0){
                r1.text = lbs.item.provName;
                r1.data = lbs.item.provId;
                r1.visible = true;
            }
        }

        let rn = this.root.getChild("rn").asCom;
        let list = rn.getChild("list").asList;
        list.removeChildrenToPool();

        list = qg.getChild("list").asList;
        list.removeChildrenToPool();

        this.topUI = new TopUI();
        this.topUI.setRoot(this.root);
    }

    onUpdateS2CMyLbs(){

        let qg = this.root.getChild("qg").asCom;

        let r1 = qg.getChild("r1");
        let r2 = qg.getChild("r2");

        let lbs = Manager.gd.get<pb.S2CMyLbs>(ProtoDef.pb.S2CMyLbs);
        if(lbs != null && lbs.item != null){
            if(lbs.item.cityId > 0 && lbs.item.cityName.length > 0){
                r2.text = lbs.item.cityName;
                r2.data = lbs.item.cityId;
                r2.visible = true;
            }
            if(lbs.item.provId > 0 && lbs.item.provName.length > 0){
                r1.text = lbs.item.provName;
                r1.data = lbs.item.provId;
                r1.visible = true;
            }
        }
    }

    onCustomizedGameItem(cindex:number,com:fgui.GButton){
        if(cindex == this.gameComBox.selectedIndex){
            com.getController("cc").selectedIndex = 0;
        }else{
            com.getController("cc").selectedIndex = 1;
        }
    }

    onCustomizedLevelItem(index:number,com:fgui.GButton){
        if(index == this.levelComBox.selectedIndex){
            com.getController("cc").selectedIndex = 0;
        }else{
            com.getController("cc").selectedIndex = 1;
        }
    }

    onCustomizedTableItem(index:number,com:fgui.GButton){
        Log.d("onCustomizedTableItem:",index);

        if(index == this.tableComBox.selectedIndex){
            com.getController("cc").selectedIndex = 0;
        }else{
            com.getController("cc").selectedIndex = 1;
        }

        let item = this.tables.tables[this.curLevel].items[index];
        let di = "底分"+Manager.utils.formatCoin(item.radix);
        com.getChild("di").text = di;
        com.getChild("count").text = item.playerNum.toString();
        com.getChild("enter").text = item.cond;
        com.getChild("n14").visible = false;
        let gd = Manager.dataCenter.get(GameData);
        let coin = gd.playerCurrencies(CurrencyType.CT_Coin);
        // this.tableData[index] = di;
        if(coin>= item.recommCurrency.first && ( item.recommCurrency.second == 0 || coin <= item.recommCurrency.second)){
            com.getChild("n14").visible = true;
            this.tableCfgId = item.cfgId;
            this.tableComBox._list.scrollToView(index);
            this.curTable = index;
            this.tableComBox.selectedIndex = this.curTable;
        }
    }

    onGameChange(){
        let games = Manager.dataCenter.get(GameData).get(ProtoDef.pb.S2CGames) as pb.S2CGames;
        Log.d("onGameChange",this.gameComBox.selectedIndex);
        let last = this.gameType;
        this.gameType = games.items[this.gameComBox.selectedIndex].id;
        if(last != this.gameType){
            this.lg().openGridGameList(this.gameType);
        }
    }

    onLevelChange(){
        Log.d("onLevelChange",this.levelComBox.selectedIndex);
        this.curLevel = this.levelComBox.selectedIndex;
        let tables = this.tables.tables[this.curLevel];

        let tableString:string[]= [];

        let coin = Manager.gd.playerCurrencies(CurrencyType.CT_Coin);

        for (let child = 0; child < tables.items.length; child++) {
            let item = tables.items[child];
            tableString.push(item.changCiName);
            let curRadix = "底分"+Manager.utils.formatCoin(item.radix)


            if(coin>= item.recommCurrency.first && ( item.recommCurrency.second == 0 || coin <= item.recommCurrency.second)){
                this.curTable = child;
                this.tableComBox.selectedIndex = this.curTable;
                this.tableComBox.getChild("di").text = curRadix;
            }
        }    
        this.tableComBox.items = tableString;
        for (let index = 0; index < this.levelComBox._list._children.length; index++) {
            if(index==this.levelComBox.selectedIndex){
                this.levelComBox._list.getChildAt(index).asCom.getController("cc").selectedIndex = 0;
            }else{
                this.levelComBox._list.getChildAt(index).asCom.getController("cc").selectedIndex = 1;
            }
        }
    }

    onTableChange(){
        Log.d("onTableChange",this.tableComBox.selectedIndex);
        if(this.curTable != this.tableComBox.selectedIndex){
            this.tableComBox.selectedIndex = this.curTable;
        }
    }

    onOpenGrid(data :pb.S2CGetTables){
        // Log.d("onOpenGrid",data);
        Manager.dataCenter.get(GameData).put(ProtoDef.pb.S2CGetTables,data);
        Manager.localStorage.setItem("gridGameId",data.gameType);
        this.tables = data;

        let games = Manager.dataCenter.get(GameData).get(ProtoDef.pb.S2CGames) as pb.S2CGames;

        let gameItems:string[]= [];
        for (let index = 0; index < games.items.length; index++) {
            gameItems.push(games.items[index].name);     
        }
        this.gameComBox.items = gameItems;
        this.gameType = data.gameType;
        for (let index = 0; index < games.items.length; index++) {
            if(data.gameType == games.items[index].id){
                this.gameComBox.selectedIndex = index;
            }       
        }
        let levelItems:string[]= [];
        let tableString:string[]= [];
  
        for (let index = 0; index < data.tables.length; index++) {
            levelItems.push(data.tables[index].catName);  
            for (let child = 0; child < data.tables[index].items.length; child++) {
                let item = data.tables[index].items[child];
                // Log.d("item",item);
                if (index == 0) {
                    tableString.push(item.changCiName);
                    this.curLevel = index;
                }
            }          
        }

        this.levelComBox.items = levelItems;
        this.levelComBox.selectedIndex = this.curLevel;

        let radix = "";
        let gd = Manager.dataCenter.get(GameData);
        let coin = gd.playerCurrencies(CurrencyType.CT_Coin);
        let d = this.tables.tables[this.curLevel].items;
        for (let index1 = 0; index1 < d.length; index1++) {
            const et = d[index1];
            if(coin>= et.recommCurrency.first && ( et.recommCurrency.second == 0 || coin <= et.recommCurrency.second)){
                this.curTable = index1;
                radix = "底分"+Manager.utils.formatCoin(et.radix)
                this.tableCfgId = et.cfgId;
            }
        }

        this.tableComBox.items = tableString;
        this.tableComBox.getChild("di").text = radix;
        this.tableComBox.selectedIndex = this.curTable;

        this.show();
        this.topUI.refresh();
        this.lg().getSeasonHisRankList(this.gameType);
        // this.lg().getSeasonRewardCfg(this.gameType);
    }   

    onClickStartGrid(){
        let item = this.tables.tables[this.curLevel].items[this.curTable];
        let gd = Manager.dataCenter.get(GameData);
        let coin = gd.playerCurrencies(CurrencyType.CT_Coin);
        if(coin>= item.recommCurrency.first && ( item.recommCurrency.second == 0 || coin <= item.recommCurrency.second)){
            // this.lg().matchTable(this.gameType,this.tableCfgId);
            this.service.matchTable(this.gameType,this.tableCfgId);
        }else{
            let d = this.tables.tables[this.curLevel].items;
            for (let index1 = 0; index1 < d.length; index1++) {
                const et = d[index1];
                if(coin>= et.recommCurrency.first && ( et.recommCurrency.second == 0 || coin <= et.recommCurrency.second)){
                    Manager.tips.show("请您前往"+et.changCiName+"挑战");
                    return;
                }
            }
            Manager.tips.show("服务器数据错误,没有找到符合你的场次");
        }
    }


    protected onS2CDuanWeiChange(data :pb.S2CDuanWeiChange){
        Log.d("onS2CDuanWeiChange:",JSON.stringify(data));
    }

    protected onS2CSeasonRankList(data :pb.S2CSeasonRankList){
        Log.d("onS2CSeasonRankList:",data);
        
        let lbs = Manager.gd.get<pb.S2CMyLbs>(ProtoDef.pb.S2CMyLbs);
        if(data.areaId <= 0){
            Manager.dataCenter.get(GameData).put(ProtoDef.pb.S2CSeasonRankList,data);
            let rn = this.root.getChild("rn").asCom;
            let list = rn.getChild("list").asList;
    
            list.setVirtual();
            list.itemRenderer = this.renderListItem.bind(this);
            list.numItems = data.items.length;
            return;
        }

        if(lbs != null && lbs.item != null){
            if(data.areaId ==lbs.item.provId){
                Manager.dataCenter.get(GameData).put(ProtoDef.pb.S2CSeasonRankList+"_"+data.areaId,data);
                let qg = this.root.getChild("qg").asCom;
                let list = qg.getChild("list1").asList;
        
                list.setVirtual();
                list.itemRenderer = this.renderQgListItem1.bind(this);
                list.numItems = data.items.length;
                this.refreshNational1(data);
            }
            if(data.areaId ==lbs.item.cityId){
                Manager.dataCenter.get(GameData).put(ProtoDef.pb.S2CSeasonRankList+"_"+data.areaId,data);
                let rn = this.root.getChild("qg").asCom;
                let list = rn.getChild("list2").asList;
                list.setVirtual();
                list.itemRenderer = this.renderQgListItem2.bind(this);
                list.numItems = data.items.length;
                this.refreshNational2(data);
            }
        }

        // for (let index = 0; index < data.items.length; index++) {
        //     let d = data.items[index];
        //     let com = list.addItemFromPool().asCom;
        //     if(d.rank < 4){
        //         com.getChild("rank").visible = true;
        //         com.getChild("rank").icon = fgui.UIPackage.getItemURL(HallView.getViewPath().pkgName,"ui_rank_icon_"+d.rank);
        //     }else{
        //         com.getChild("rank").visible = false;
        //     }
        //     if(d.player != null){
        //         let head = com.getChild("head").asCom.getChild("loader").asLoader;
        //         let headUrl = gd.playerheadUrl(d.player.portraits);
        //         head.icon = headUrl;
        //     }
        // }
    }

    private renderListItem(index: number, obj: fgui.GObject): void {
        let com = obj.asCom;
        if(com == null){
            return;
        }
        let data = Manager.gd.get<pb.S2CSeasonRankList>(ProtoDef.pb.S2CSeasonRankList);
        if(data == null){
            return;
        }
        let d = data.items[index];
        if(d.rank < 4){
            com.getChild("rank").visible = true;
            com.getChild("rank").icon = fgui.UIPackage.getItemURL(HallView.getViewPath().pkgName,"ui_rank_icon_"+d.rank);
        }else{
            com.getChild("rank").visible = false;
        }
        if(d.player != null){
            let head = com.getChild("head").asCom.getChild("loader").asLoader;
            let headUrl = Manager.gd.playerheadUrl(d.player.portraits);
            head.icon = headUrl;
        }
    }

    private renderListItem1(index: number, obj: fgui.GObject): void {
        let com = obj.asCom;
        if(com == null){
            return;
        }
        let data = Manager.gd.get<pb.S2CSeasonRankList>(ProtoDef.pb.S2CSeasonRankList);
        if(data == null){
            return;
        }
        let d = data.items[index];
        if(d.rank < 4){
            com.getChild("rank").visible = true;
            com.getChild("rank").icon = fgui.UIPackage.getItemURL(HallView.getViewPath().pkgName,"ui_rank_icon_"+d.rank);
        }else{
            com.getChild("rank").visible = false;
        }
        if(d.player != null){
            let head = com.getChild("head").asCom.getChild("loader").asLoader;
            let headUrl = Manager.gd.playerheadUrl(d.player.portraits);
            head.icon = headUrl;
        }
    }

    private renderListItem2(index: number, obj: fgui.GObject): void {
        let com = obj.asCom;
        if(com == null){
            return;
        }
        let data = Manager.gd.get<pb.S2CSeasonRankList>(ProtoDef.pb.S2CSeasonRankList);
        if(data == null){
            return;
        }
        let d = data.items[index];
        if(d.rank < 4){
            com.getChild("rank").visible = true;
            com.getChild("rank").icon = fgui.UIPackage.getItemURL(HallView.getViewPath().pkgName,"ui_rank_icon_"+d.rank);
        }else{
            com.getChild("rank").visible = false;
        }
        if(d.player != null){
            let head = com.getChild("head").asCom.getChild("loader").asLoader;
            let headUrl = Manager.gd.playerheadUrl(d.player.portraits);
            head.icon = headUrl;
        }
    }

    protected onS2CSeason(data :pb.S2CSeason){
        this.seasonData = data;
        Log.d("onS2CSeason:",JSON.stringify(data));
        let t = this.root.getChild("t").asTextField;

        if(data.season.state == SeasonState.SeasonState_Wait){
            t.text = "距离赛季开启剩余"+Manager.utils.transformDjs(data.season.startTime);
        }else{
            let start = Manager.utils.formatDate(data.season.startTime,"/");
            let end = Manager.utils.formatDate(data.season.startTime + data.season.duration * 86400,"/");
            this.tempTime = start + "-" + end;
            t.text = this.tempTime;
        }

        let rate = Math.floor(data.rankPercent * 100)
        this.root.getChild("tips").text = "您已经超越了全国[color=#ffcc00]"+ rate +"%[/color]的玩家";
        let sjName = this.root.getChild("sjname");
        this.updateSJname(sjName,data);
    }

    protected updateSJname(sjName:fgui.GObject,data){
        Log.e("data.season.state",data.season.state);
        if(data.season.state == SeasonState.SeasonState_Wait){
            sjName.text = "休赛期";
        }else if(data.season.state == SeasonState.SeasonState_Run){
            sjName.text = "S"+data.season.seasonNum+"赛季";
        }else{
            sjName.text = "赛季未开启";
        }
    }

    protected onS2CGetSeasonDuanWeiCfg(data :pb.S2CGetSeasonDuanWeiCfg){
        Log.d("onS2CGetSeasonDuanWeiCfg:",data);
        if (data==null) {
            return;
        }

        this.refreshDWDesc(data);
        this.refreshRewardDW(data);
        let bar = this.root.getChild("bar").asProgress;
        bar.visible = true;
        let gd = Manager.dataCenter.get(GameData);
        
        let gt = Manager.utils.gt(this.gameType);

        let score = gd.playerGV(GroupId.GI_SeasonScore,gt,0);
        let lv = gd.playerGV(GroupId.GI_SeasonDuanWei,gt,1);
  
        Log.d("onS2CGetSeasonDuanWeiCfg:",score,lv,data.items.length);
        let need = score;
        
        let cfgLevel = lv;
        if(lv >= data.items.length){
            cfgLevel = data.items.length - 1;
        }

        let conf = data.items[cfgLevel];
        need = conf.needScore;
        
        let maxNeedScore = data.items[data.items.length-1].needScore;
        if(need > maxNeedScore){
            need = maxNeedScore;
        }

        bar.min = 0;
        bar.max = need;
        bar.value = score;



        if(lv > data.items.length){
            Manager.tips.debug("配置错误，段位配置长度小于段位等级");
            return;
        }
        let hz = this.root.getChild("hz").asCom;
        let stars = this.root.getChild("stars").asCom;
        Manager.utils.setHz(hz,stars,lv,data,true);
        // hz.visible = true;

        // let conf = data.items[lv-1];  
        // hz.getChild("tile").text = conf.name;
        // let iconId = Manager.utils.dwIcon(lv);
        // hz.getChild("n0").icon = fgui.UIPackage.getItemURL(HallView.getViewPath().pkgName,"ui_rank_dw_di_"+iconId);
        // let starCount = Math.floor(lv%5);
        // if(starCount == 0){
        //     starCount = 5;
        // }
        // Log.d("starCount:",starCount);

        // let stars = this.root.getChild("stars").asCom;
        // stars.visible = true;
        // for (let index = 0; index < stars._children.length; index++) {
        //     let star = stars.getChild("s"+index).asCom;
        //     if(index < starCount){
        //         star.getChild("star").visible = true;
        //     }else{
        //         star.getChild("star").visible = false;
        //     }
        // }

        //显示固定图标
        // let childKey = (gt << 16) | lv;
        // let rewardState = 0; 
        // let recvLv = 0;

        // for (let index = 1; index < lv + 1; index++) {
        //     let gv = gd.playerGroupValue(GroupId.GI_SeasonDuanWeiReward, childKey);
        //     if (gv != null){
        //         if(gv.value == 1){
        //             recvLv = index;
        //             rewardState = gv.value;
        //             break;
        //         }
        //     }  
        // }

        // if(recvLv == 0){
        //     for (let index = 1; index < lv + 1; index++) {
        //         let gv = gd.playerGroupValue(GroupId.GI_SeasonDuanWeiReward, childKey);
        //         if (gv != null){
        //             if(gv.value == 0){
        //                 recvLv = index;
        //                 rewardState = gv.value;
        //                 break;
        //             }
        //         }  
        //     }
        // }
        // Log.d("childKey",childKey,rewardState,recvLv);
        // if(recvLv > data.items.length){
        //     Manager.tips.debug("配置错误，段位配置长度小于段位奖励等级");
        //     return;
        // }

        // if(recvLv < 2){
        //     Manager.tips.debug("GroupValue配置错误，没有找到奖励配置childKey:"+childKey);
        //     recvLv = 2;
        // }

        // let dwjl = this.root.getChild("dwjl").asCom;
        // dwjl.visible = true;
        // let rconf = data.items[recvLv-1]; 
        
        // let list = dwjl.getChild("list").asList;
        // list.removeChildrenToPool();
        // Log.d("rconf.reward.length",rconf.reward.length);
        // if(JSON.stringify(rconf.reward) == "{}"){
        //     Manager.tips.debug("DuanWeiCfg配置表错误,没有配置奖励,id:"+rconf.id+" recvLv:"+recvLv);
        //     return;
        // }

        // for (const [key, val] of Object.entries(rconf.reward)) {
        //     let com = list.addItemFromPool().asCom;
        //     com.getChild("loader").icon = gd.getPropIcon(Number(key));
        // }
  
    }
    
    protected onS2CSeasonHisRankList(data :pb.S2CSeasonHisRankList){
        Log.d("onS2CSeasonHisRankList:",data);


        let dwData:pb.S2CGetSeasonDuanWeiCfg = Manager.dataCenter.get(GameData).get<pb.S2CGetSeasonDuanWeiCfg>(ProtoDef.pb.S2CGetSeasonDuanWeiCfg+"_"+Manager.utils.gt(this.gameType));
        this.onS2CGetSeasonDuanWeiCfg(dwData);
        let sjData:pb.S2CGetSeasonRewardCfg = Manager.dataCenter.get(GameData).get<pb.S2CGetSeasonRewardCfg>(ProtoDef.pb.S2CGetSeasonRewardCfg+"_"+Manager.utils.gt(this.gameType));
        this.onS2CGetSeasonRewardCfg(sjData);

        if(data.datas.length  == 0){
            Manager.tips.debug("历史排行榜没有返回数据");
            return;
        }

        if(data.datas[0].items.length == 0){
            Manager.tips.debug("历史排行榜items数据为0");
            return;
        }

        if(data.datas[0].items[0].items.length  == 0){
            Manager.tips.debug("历史排行榜items[0].items数据为0");
            return;
        }

        let p = data.datas[0].items[0].items[0];
        if(p.player == null){
            Manager.tips.debug("历史排行榜datas[0].items[0].items[0].player数据为null");
            return;
        }

        // if(data.gameCat != this.gameType){
        //     return;
        // }
        
        this.refreshQs(data);
        Manager.dataCenter.get(GameData).put(ProtoDef.pb.S2CSeasonHisRankList,data);
        let qs = this.root.getChild("qs").asCom;
        qs.visible = true;
        qs.getChild("qsname").text = p.player.name;
        let gd = Manager.dataCenter.get(GameData);
        qs.getChild("head").asCom.getChild("loader").icon = gd.playerheadUrl(p.player.portraits);
    }

    onClickQG(){
        let qg = this.root.getChild("qg").asCom;
        qg.visible = true;
        this.refreshNational();
    }

    onClickShengPaim(){
        let qg = this.root.getChild("qg").asCom;
        qg.visible = true;
        let lbs = Manager.gd.get<pb.S2CMyLbs>(ProtoDef.pb.S2CMyLbs);
        if(lbs == null || lbs.item == null){
            return;
        }
        this.lg().getGridRank(lbs.item.provId);
    }

    onClickShiPaim(){
        let qg = this.root.getChild("qg").asCom;
        qg.visible = true;
        let lbs = Manager.gd.get<pb.S2CMyLbs>(ProtoDef.pb.S2CMyLbs);
        if(lbs == null || lbs.item == null){
            return;
        }
        this.lg().getGridRank(lbs.item.cityId);
    }
    
    private renderQgListItem2(index: number, obj: fgui.GObject): void {
        let com = obj.asCom;
        if(com == null){
            return;
        }
        let lbs = Manager.gd.get<pb.S2CMyLbs>(ProtoDef.pb.S2CMyLbs);
        if(lbs == null || lbs.item == null){
            return;
        }

        let data:pb.S2CSeasonRankList = Manager.dataCenter.get(GameData).get<pb.S2CSeasonRankList>(ProtoDef.pb.S2CSeasonRankList+"_"+lbs.item.cityId);
        if(data == null){
            return;
        }
        let dwData:pb.S2CGetSeasonDuanWeiCfg = Manager.dataCenter.get(GameData).get<pb.S2CGetSeasonDuanWeiCfg>(ProtoDef.pb.S2CGetSeasonDuanWeiCfg+"_"+Manager.utils.gt(this.gameType));
        if(dwData == null){
            return;
        }
        if(index >= data.items.length){
            return;
        }
        this.renderQgList(index,com,data,dwData);
    }

    private renderQgListItem1(index: number, obj: fgui.GObject): void {
        let com = obj.asCom;
        if(com == null){
            return;
        }
        let lbs = Manager.gd.get<pb.S2CMyLbs>(ProtoDef.pb.S2CMyLbs);
        if(lbs == null || lbs.item == null){
            return;
        }

        let data:pb.S2CSeasonRankList = Manager.dataCenter.get(GameData).get<pb.S2CSeasonRankList>(ProtoDef.pb.S2CSeasonRankList+"_"+lbs.item.provId);
        if(data == null){
            return;
        }
        let dwData:pb.S2CGetSeasonDuanWeiCfg = Manager.dataCenter.get(GameData).get<pb.S2CGetSeasonDuanWeiCfg>(ProtoDef.pb.S2CGetSeasonDuanWeiCfg+"_"+Manager.utils.gt(this.gameType));
        if(dwData == null){
            return;
        }
        if(index >= data.items.length){
            return;
        }

        this.renderQgList(index,com,data,dwData);
    }

    private renderQgListItem(index: number, obj: fgui.GObject): void {
        let com = obj.asCom;
        if(com == null){
            return;
        }
        let data:pb.S2CSeasonRankList = Manager.dataCenter.get(GameData).get<pb.S2CSeasonRankList>(ProtoDef.pb.S2CSeasonRankList);
        if(data == null){
            return;
        }
        let dwData:pb.S2CGetSeasonDuanWeiCfg = Manager.dataCenter.get(GameData).get<pb.S2CGetSeasonDuanWeiCfg>(ProtoDef.pb.S2CGetSeasonDuanWeiCfg+"_"+Manager.utils.gt(this.gameType));
        if(dwData == null){
            return;
        }

        if(index >= data.items.length){
            return;
        }
        this.renderQgList(index,com,data,dwData);
    }

    private renderQgList(index: number, com: fgui.GComponent,data:pb.S2CSeasonRankList,dwData:pb.S2CGetSeasonDuanWeiCfg): void {
        if(index >= data.items.length){
            return;
        }

        let d = data.items[index];
        if(d.rank < 4){
            com.getChild("rankloader").visible = true;
            com.getChild("rankloader").icon = fgui.UIPackage.getItemURL(HallView.getViewPath().pkgName,"ui_rank_icon_"+d.rank);
            com.getChild("ranknum").visible = false;
        }else{
            com.getChild("rankloader").visible = false;
            com.getChild("ranknum").visible = true;
            com.getChild("ranknum").text = d.rank.toString();
        }
        if(d.player != null){
            let head = com.getChild("head").asCom.getChild("loader").asLoader;
            let headUrl = Manager.gd.playerheadUrl(d.player.portraits);
            head.icon = headUrl;
            com.getChild("nick").text = d.player.name;
            let dw = dwData.items[d.duanWei-1];
            // let iconId = Manager.utils.dwIcon(d.duanWei); 
            // com.getChild("dwloader").icon = fgui.UIPackage.getItemURL(HallView.getViewPath().pkgName,"ui_rank_dw_di_"+iconId);
            let dl = com.getChild("dwlabel").asLabel;
            // Log.d("setDwLabel",d.player.name,d.duanWei,dw);
            Manager.utils.setDwLabel(dl,dw);

            com.getChild("dw").text = dw.name;
            com.getChild("sls").text = d.winTimes.toString();
            if(d.playTimes == 0){
                com.getChild("sl").text = "0%";
            }else{
                let sl = Math.floor(100*d.winTimes/d.playTimes); 
                com.getChild("sl").text = sl+"%";
            }
        }
    }


    refreshNational(){
        let data:pb.S2CSeasonRankList = Manager.dataCenter.get(GameData).get<pb.S2CSeasonRankList>(ProtoDef.pb.S2CSeasonRankList);
        let qg = this.root.getChild("qg").asCom;
        let me = qg.getChild("me").asCom;

        let list = qg.getChild("list").asList;
        let gd = Manager.dataCenter.get(GameData);
        list.setVirtual();
        list.itemRenderer = this.renderQgListItem.bind(this);
        list.numItems = data.items.length;

        let indexMe = -1;
        for (let index = 0; index < data.items.length; index++) {
            let d = data.items[index];
            if(d.player != null){
                if(d.player.guid == gd.player().guid){
                    indexMe = d.rank;
                }
            }
        }
        this.refreshNationalType(data,me);
    }

    refreshNational1(data:pb.S2CSeasonRankList){
        let qg = this.root.getChild("qg").asCom;
        let me = qg.getChild("me1").asCom;
        this.refreshNationalType(data,me);
    }

    refreshNational2(data:pb.S2CSeasonRankList){;
        let qg = this.root.getChild("qg").asCom;
        let me = qg.getChild("me2").asCom;
        this.refreshNationalType(data,me);
    }

    refreshNationalType(data:pb.S2CSeasonRankList,me:fgui.GComponent){
        let dwData:pb.S2CGetSeasonDuanWeiCfg = Manager.dataCenter.get(GameData).get<pb.S2CGetSeasonDuanWeiCfg>(ProtoDef.pb.S2CGetSeasonDuanWeiCfg+"_"+Manager.utils.gt(this.gameType));
        let gd = Manager.dataCenter.get(GameData);
        let indexMe = -1;
        for (let index = 0; index < data.items.length; index++) {
            let d = data.items[index];
            if(d.player != null){
                if(d.player.guid == gd.player().guid){
                    indexMe = d.rank;
                }
            }
        }
        
        me.getChild("rankloader").visible = true;
        me.getChild("ranknum").visible = true;
        if(indexMe < 1){
            me.getChild("rankloader").visible = false;
            me.getChild("ranknum").text = "未上榜";
        }else{
            if(indexMe < 4){
                me.getChild("rankloader").visible = true;
                me.getChild("ranknum").visible = false;
                me.getChild("rankloader").icon = fgui.UIPackage.getItemURL(HallView.getViewPath().pkgName,"ui_rank_icon_"+indexMe);
            }else{
                me.getChild("rankloader").visible = false;
                me.getChild("ranknum").visible = true;
                me.getChild("ranknum").text = indexMe.toString();
            }
        }

        let head = me.getChild("head").asCom.getChild("loader").asLoader;
        let headUrl = gd.headUrl();
        head.icon = headUrl;
        me.getChild("nick").text = gd.player().name;
        let lv = 1;
        let gt = Manager.utils.gt(this.gameType);
        let gv = gd.playerGroupValue(GroupId.GI_SeasonDuanWei,gt);
        if (gv != null){
            lv = gv.value;
        }
        // let iconId = Manager.utils.dwIcon(lv);
        // me.getChild("dwloader").icon = fgui.UIPackage.getItemURL(HallView.getViewPath().pkgName,"ui_rank_dw_di_"+iconId);

        let dw = dwData.items[lv-1];
        me.getChild("dw").text = dw.name;

        let dl = me.getChild("dwlabel").asLabel;
        Manager.utils.setDwLabel(dl,dw);

        let pt = gd.playerGV(GroupId.GI_PlayTimes,gt,0);
        me.getChild("sls").text = pt.toString();

        let wc = gd.playerGV(GroupId.GI_WinTimes,gt,0);
        if(pt == 0){
            me.getChild("sl").text = "0%";
        }else{
            let sl = Math.floor(100*wc/pt); 
            me.getChild("sl").text = sl+"%";
        }
    }

    onClickCloseQG(){
        let qg = this.root.getChild("qg").asCom;
        qg.visible = false;
    }


    onClickQs(){
        let qg = this.root.getChild("ls").asCom;
        qg.visible = true;
    }


    private renderQsListItem(index: number, obj: fgui.GObject): void {
        let dwData:pb.S2CGetSeasonDuanWeiCfg = Manager.dataCenter.get(GameData).get<pb.S2CGetSeasonDuanWeiCfg>(ProtoDef.pb.S2CGetSeasonDuanWeiCfg+"_"+Manager.utils.gt(this.gameType));
        if(dwData == null){
            return;
        }
        let data = Manager.gd.get<pb.S2CSeasonHisRankList>(ProtoDef.pb.S2CSeasonHisRankList);
        if(data == null){
            return;
        }
        let com = obj.asCom;
        if(com == null){
            return;
        }
        if(index >=data.datas.length){
            return;
        }
        let sj = data.datas[index];
        if(sj.items != null && sj.items.length > 0 && sj.items[0].items != null && sj.items[0].items.length > 0){
            let d = sj.items[0].items[0]; 
            // Log.e(sj.startTime,sj.endTime);
            let start = Manager.utils.formatDate(sj.startTime,"/");
            let end = Manager.utils.formatDate(sj.endTime,"/");
            com.getChild("sjqj").text = start + "-" + end;
            com.getChild("head").asCom.getChild("loader").icon = Manager.gd.playerheadUrl(d.player.portraits);
            com.getChild("nick").text = d.player.name;

            let dw = dwData.items[d.duanWei-1];

            // let iconId = Manager.utils.dwIcon(d.duanWei); 
            // com.getChild("dwloader").icon = fgui.UIPackage.getItemURL(HallView.getViewPath().pkgName,"ui_rank_dw_di_"+iconId);

            let dl = com.getChild("dwlabel").asLabel;
            Manager.utils.setDwLabel(dl,dw);

            com.getChild("dw").text = dw.name;
            com.getChild("sjname").text = "S"+sj.seasonNum+"赛季";
        }
    }

    refreshQs(data :pb.S2CSeasonHisRankList){
        let list = this.history.getChild("list").asList;
        Manager.gd.put(ProtoDef.pb.S2CSeasonHisRankList,data);
        list.setVirtual();
        list.itemRenderer = this.renderQsListItem.bind(this);
        list.numItems = data.datas.length;

        // let dwData:pb.S2CGetSeasonDuanWeiCfg = Manager.dataCenter.get(GameData).get<pb.S2CGetSeasonDuanWeiCfg>(ProtoDef.pb.S2CGetSeasonDuanWeiCfg+"_"+Manager.utils.gt(this.gameType));
        // let gd = Manager.dataCenter.get(GameData);
        // for (let index = 0; index < data.datas.length; index++) {
        //     let sj = data.datas[index];
        //     if(sj.items != null && sj.items.length > 0 && sj.items[0].items != null && sj.items[0].items.length > 0){
        //         let d = sj.items[0].items[0]; 
        //         let com = list.addItemFromPool().asCom;
        //         // Log.e(sj.startTime,sj.endTime);
        //         let start = Manager.utils.formatDate(sj.startTime,"/");
        //         let end = Manager.utils.formatDate(sj.endTime,"/");
        //         com.getChild("sjqj").text = start + "-" + end;
        //         com.getChild("head").asCom.getChild("loader").icon = gd.playerheadUrl(d.player.portraits);
        //         com.getChild("nick").text = d.player.name;

        //         let dw = dwData.items[d.duanWei-1];
        //         let iconId = Manager.utils.dwIcon(d.duanWei); 
        //         com.getChild("dwloader").icon = fgui.UIPackage.getItemURL(HallView.getViewPath().pkgName,"ui_rank_dw_di_"+iconId);
        //         com.getChild("dw").text = dw.name;
        //     }
        // }
    }

    onClickCloseQs(){
        this.history.visible = false;
    }

    onClickJLSJ(){
        this.sjRewardRule.visible = true;
        this.sjRewardRule.getController("grrrrc").selectedIndex = 0;
    }

    onClickCloseJLSJ(){
        this.sjRewardRule.visible = false;
    }

    onClickJLDW(){
        this.sjRewardRule.visible = true;
        this.sjRewardRule.getController("grrrrc").selectedIndex = 1;
    }

    onClickCloseJLDW(){
        this.sjRewardRule.visible = false;
    }

    
    onClickSj(){
        this.sjRewardRule.visible = true;
        this.sjRewardRule.getController("grrrrc").selectedIndex = 2;
    }

    private renderDwListItem(index: number, obj: fgui.GObject): void {
        let data:pb.S2CGetSeasonDuanWeiCfg = Manager.dataCenter.get(GameData).get<pb.S2CGetSeasonDuanWeiCfg>(ProtoDef.pb.S2CGetSeasonDuanWeiCfg+"_"+Manager.utils.gt(this.gameType));
        let com = obj.asCom;
        if(data == null){
            return;
        }
        if(com == null){
            return;
        }
        let di = data.items[index];  
        com.getChild("dw").text = di.name; 
        com.getChild("dwjf").text = di.scoreDesc;
        if(di.inherit > 0 && di.inherit <= data.items.length){
            let jc = data.items[di.inherit-1];
            com.getChild("jc").text = jc.name;
        }
        com.getChild("yes").visible = (di.protect == 1);
        com.getChild("no").visible = (di.protect == 0);
    }

    refreshDWDesc(data :pb.S2CGetSeasonDuanWeiCfg){
        let p2 = this.sjRewardRule.getChild("p2").asCom;
        let list = p2.getChild("list").asList;
        list.setVirtual();
        list.itemRenderer = this.renderDwListItem.bind(this);
        list.numItems = data.items.length;

        // for (let index = 0; index < data.items.length; index++) {
        //     let com = list.addItemFromPool().asCom;
        //     let di = data.items[index];  
        //     com.getChild("dw").text = di.name; 
        //     com.getChild("dwjf").text = di.scoreDesc;
        //     if(di.inherit > 0 && di.inherit <= data.items.length){
        //         let jc = data.items[di.inherit-1];
        //         com.getChild("jc").text = jc.name;
        //     }
        //     com.getChild("yes").visible = (di.protect == 1);
        //     com.getChild("no").visible = (di.protect == 0);
        // }
    }

    private renderSJListItem(index: number, obj: fgui.GObject): void {

        let data:pb.S2CGetSeasonRewardCfg = Manager.dataCenter.get(GameData).get<pb.S2CGetSeasonRewardCfg>(ProtoDef.pb.S2CGetSeasonRewardCfg+"_"+Manager.utils.gt(this.gameType));
        if(data == null){
            return;
        }
        let com = obj.asCom;
        if(com == null){
            return;
        }
        let di = data.items[index];  

        com.getChild("dw").text = di.desc;
        let cList = com.getChild("list").asList;
        cList.removeChildrenToPool();
        for (const [key, val] of Object.entries(di.reward)) {
            let ccom = cList.addItemFromPool().asCom;
            ccom.getChild("loader").icon = Manager.gd.getPropIcon(Number(key));
            ccom.getChild("sum").text = Manager.utils.formatCoin(val,Number(key));
        }
    }

    //赛季奖励
    refreshRewardSJ(data :pb.S2CGetSeasonRewardCfg){
        let p0 = this.sjRewardRule.getChild("p0").asCom;

        if(this.seasonData.season.state == SeasonState.SeasonState_Wait){
            let start = Manager.utils.formatDate(this.seasonData.season.lastStartTime,"/");
            let end = Manager.utils.formatDate(this.seasonData.season.lastEndTime,"/");
            p0.getChild("t").text = start + "-" + end;
        }else{
            p0.getChild("t").text = this.tempTime;
        }

        p0.getChild("sjname").text = "S"+this.seasonData.season.seasonNum+"赛季";
        let list = p0.getChild("list").asList;
        list.setVirtual();
        list.itemRenderer = this.renderSJListItem.bind(this);
        list.numItems = data.items.length;

        // let gd = Manager.dataCenter.get(GameData);
        // for (let index = 0; index < data.items.length; index++) {
        //     let di = data.items[index];  
        //     let com = list.addItemFromPool().asCom;

        //     // let dw = dwData.items[di.duanWei-1];
        //     // let iconId = Manager.utils.dwIcon(d.duanWei); 
        //     // com.getChild("dwloader").icon = fgui.UIPackage.getItemURL(HallView.getViewPath().pkgName,"ui_rank_dw_di_"+iconId);
        //     com.getChild("dw").text = di.desc;
        //     let cList = com.getChild("list").asList;
        //     cList.removeChildrenToPool();
        //     for (const [key, val] of Object.entries(di.reward)) {
        //         let ccom = cList.addItemFromPool().asCom;
        //         ccom.getChild("loader").icon = gd.getPropIcon(Number(key));
        //         ccom.getChild("sum").text = Manager.utils.formatCoin(val,Number(key));
        //     }
        // }
    }

    protected onS2CGetSeasonRewardCfg(data :pb.S2CGetSeasonRewardCfg){
        Log.d("onS2CGetSeasonRewardCfg:",data);
        if (data==null) {
            return;
        }
        this.refreshRewardSJ(data);
        let sjjl = this.root.getChild("sjjl").asCom;
        sjjl.visible = true;
        let gd = Manager.dataCenter.get(GameData);

        //显示固定图标，不显示内容
        // let list = sjjl.getChild("list").asList;
        // list.removeChildrenToPool();
        // let frist = data.items[0];
        // for (const [key, val] of Object.entries(frist.reward)) {
        //     let com = list.addItemFromPool().asCom;
        //     com.getChild("loader").icon = gd.getPropIcon(Number(key));
        // }

        let p0 = this.sjRewardRule.getChild("p0").asCom;
        let gt = Manager.utils.gt(this.gameType);
  
        let tlist = p0.getChild("tlist").asList;
        let btn = p0.getChild("rcv").asButton;
        Manager.utils.quickSetIcon(btn)
        let ylq = p0.getChild("ylq");
        tlist.visible = false;
        btn.visible = false;
        ylq.visible = false;
    
        let gv = gd.playerGV(GroupId.GI_SeasonReward,gt,0);
        // gv = 1;
        Log.d("自己的赛季奖励 gv：",gt,gv);
        if(gv > 0){
            tlist.removeChildrenToPool();
            let iid = -1;
            let rk = gd.playerGV(GroupId.GI_SeasonRank,gt,0);
            let gj = 0;
            let rkiD = 0;
            let rk2 = Number(rk).toString(2);
            if (rk > 0 && rk2.length < 33) {
                Manager.tips.debug("赛季排名奖励数据错误"+rk);
                return;
            } 

            let gjStr = rk2.substring(0,rk2.length-32);
            let rkStr = rk2.substring(rk2.length-32,rk2.length);
            gj = parseInt(gjStr,2);
            rkiD = parseInt(rkStr,2);

            // gj = 1;
            Log.d("自己的赛季奖励：gj",gj,rk,rkiD,Number(rk).toString(2));
            if(gj != AreaUnit.AreaUnit_Nation){
                return;
            }
            Log.d("自己的赛季奖励：rkiD",rkiD);
            for (let index = 0; index < data.items.length; index++) {
                let di = data.items[index];
                if(rkiD >= di.startRank && rkiD <= di.endRank){
                    iid = index;
                    break;
                }
            }
            // iid = 1;
            Log.d("自己的赛季奖励：",iid,data.items);
            if(iid > -1){
                tlist.visible = true;
                btn.visible = true;
                if(gv == 1){
                    // Log.d("1111111111111111111")
                }else{
                    // Log.d("11111111111111111112")
                    ylq.visible = true;
                    btn.enabled = false;
                }
             
                let di = data.items[iid];
                for (const [key1, val1] of Object.entries(di.reward)) {
                    let com1 = tlist.addItemFromPool().asCom;
                    com1.getChild("loader").icon = gd.getPropIcon(Number(key1));
                    com1.getChild("sum").text = Manager.utils.formatCoin(val1,Number(key1));
                }
            }
        }
    }

    onClickLQSJJL(){

        let jsonData={adname:"",parms1:"",parms2:""}
        jsonData.adname="Ad_SeasonReward";
        jsonData.parms1="";
        jsonData.parms2="";
        Manager.adManeger.WatchAds(jsonData,()=>{
            if (!Manager.platform.isAdOpen()) {
                this.service.getSeasonReward(this.gameType);
            } 

        })

    }

    protected onS2CGetSeasonReward(data :pb.S2CGetSeasonReward){
        if(data.ok){
            // let p0 = this.sjRewardRule.getChild("p0").asCom;
            // let btn = p0.getChild("rcv").asButton;
            // let ylq = p0.getChild("ylq");
            // ylq.visible = true;
            // btn.visible = false;


            let p0 = this.sjRewardRule.getChild("p0").asCom;
            let list = p0.getChild("list").asList;
            list.refreshVirtualList();
        }
    }

    private renderDWListItem(index: number, obj: fgui.GObject): void {

        let data:pb.S2CGetSeasonDuanWeiCfg = Manager.dataCenter.get(GameData).get<pb.S2CGetSeasonDuanWeiCfg>(ProtoDef.pb.S2CGetSeasonDuanWeiCfg+"_"+Manager.utils.gt(this.gameType));
        if(data == null){
            return;
        }
        let com = obj.asCom;
        if(com == null){
            return;
        }
        let di = data.items[index];
        com.getChild("dw").text = di.descript;
        // let iconId = Manager.utils.dwIcon(di.level); 
        // com.getChild("dwloader").icon = fgui.UIPackage.getItemURL(HallView.getViewPath().pkgName,"ui_rank_dw_di_"+iconId);

        let dl = com.getChild("dwlabel").asLabel;
        Manager.utils.setDwLabel(dl,di);


        let cList = com.getChild("list").asList;
        cList.removeChildrenToPool();
        for (const [key, val] of Object.entries(di.reward)) {
            let ccom = cList.addItemFromPool().asCom;
            ccom.getChild("loader").icon = Manager.gd.getPropIcon(Number(key));
            ccom.getChild("sum").text = Manager.utils.formatCoin(val,Number(key));
        }
        let ylq = com.getChild("ylq");
        let dj = com.getChild("dj").asButton;
        let lq = com.getChild("lq").asButton;
        Manager.utils.quickSetIcon(lq);
        ylq.visible = false;
        dj.visible = false;
        lq.visible = false;

        dj.clearClick();
        dj.onClick(this.onClickDuiJu,this);
        lq.clearClick();
        lq.onClick(this.onClickDWLQ,this);
        lq.data = di.level;
        let gt = Manager.utils.gt(this.gameType);
        let childKey = (gt << 16) | di.level;
        let gv = Manager.gd.playerGV(GroupId.GI_SeasonDuanWeiReward, childKey,0);
  
        if(gv == RewardState.RewardState_Null){
            dj.visible = true;
        }else if(gv == RewardState.RewardState_Reach){
            lq.visible = true;
            lq.enabled = true;
        }else{
            // lq.visible = true;
            ylq.visible = true;
            dj.visible = false;
            lq.visible = false;
        }
    }

    refreshRewardDW(data :pb.S2CGetSeasonDuanWeiCfg){
        let p1 = this.sjRewardRule.getChild("p1").asCom;
        // let gt = Manager.utils.gt(this.gameType);
        let list = p1.getChild("list").asList;
        // let gd = Manager.dataCenter.get(GameData);
        list.setVirtual();
        list.itemRenderer = this.renderDWListItem.bind(this);
        list.numItems = data.items.length;

        // let lv = gd.playerGV(GroupId.GI_SeasonDuanWei,gt,1);
        // list.removeChildrenToPool();
        // for (let index = 0; index < data.items.length; index++) {
        //     let di = data.items[index];
        //     let com = list.addItemFromPool().asCom;
        //     com.getChild("dw").text = di.descript;
        //     let iconId = Manager.utils.dwIcon(di.level); 
        //     com.getChild("dwloader").icon = fgui.UIPackage.getItemURL(HallView.getViewPath().pkgName,"ui_rank_dw_di_"+iconId);
        //     let cList = com.getChild("list").asList;
        //     cList.removeChildrenToPool();
        //     for (const [key, val] of Object.entries(di.reward)) {
        //         let ccom = cList.addItemFromPool().asCom;
        //         ccom.getChild("loader").icon = gd.getPropIcon(Number(key));
        //         ccom.getChild("sum").text = Manager.utils.formatCoin(val,Number(key));
        //     }
        //     let ylq = com.getChild("ylq");
        //     let dj = com.getChild("dj").asButton;
        //     let lq = com.getChild("lq").asButton;

        //     ylq.visible = false;
        //     dj.visible = false;
        //     lq.visible = false;

        //     dj.clearClick();
        //     dj.onClick(this.onClickDuiJu,this);
        //     lq.clearClick();
        //     lq.onClick(this.onClickDWLQ,this);
        //     lq.data = di.level;
        //     let childKey = (gt << 16) | di.level;
        //     let gv = gd.playerGV(GroupId.GI_SeasonDuanWeiReward, childKey,0);
      
        //     if(gv == 0){
        //         dj.visible = true;
        //     }else if(gv == 1){
        //         lq.visible = true;
        //     }else{
        //         lq.visible = true;
        //         ylq.visible = true;
        //         lq.enabled = true;
        //     }
        // }
    }

    onClickDuiJu(){
        this.onClickCloseJLDW();
        this.onClickStartGrid();
    }

    onClickDWLQ(evt: fgui.Event){
        let obj = fgui.GObject.cast(evt.currentTarget);
        // this.tempButton = obj.asButton;
        Log.d(obj.data);
        let jsonData={adname:"",parms1:"",parms2:""}
        jsonData.adname="Ad_DuanweiReward";
        jsonData.parms1=obj.data.toString();
        jsonData.parms2="";

        Manager.adManeger.WatchAds(jsonData,()=>{
            if (!Manager.platform.isAdOpen()) {
                this.service.getDuanWeiReward(obj.data);
            } 
        })


    }

    protected onS2CGetDuanWeiReward(data :pb.S2CGetDuanWeiReward){
        if(data.ok){
            // if(this.tempButton != null){
            //     this.tempButton.enabled = true;
            //     this.tempButton.parent.getChild("ylq").visible = true;
            // }

            let p1 = this.sjRewardRule.getChild("p1").asCom;
            // let gt = Manager.utils.gt(this.gameType);
            let list = p1.getChild("list").asList;
            list.refreshVirtualList();
    
        }
    }
}
