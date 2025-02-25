import GameData from "../../../../scripts/common/data/GameData";
import { GameEvent } from "../../../../scripts/common/event/GameEvent";
import FLevel2UI from "../../../../scripts/common/fairyui/FLevel2UI";
import { GameService } from "../../../../scripts/common/net/GameService";
import { CurrencyType, GameCat, GenderType, GroupId, PlayerAttr } from "../../../../scripts/def/GameEnums";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";
import HallView from "./HallView";
import TopUI from "../../../../scripts/common/fairyui/TopUI";
import ShopView from "../../../../scripts/common/fairyui/ShopView";
import { Config, ViewZOrder } from "../../../../scripts/common/config/Config";

export default class PlayerUI extends FLevel2UI {

    protected hallHeadRoot:fgui.GComponent = null;

    private headName:fgui.GObject = null;
    private headLevel:fgui.GObject = null;
    private headIcon:fgui.GLoader = null;
    private headVip:fgui.GObject = null;


    private selectHead:fgui.GComponent = null;
    private hideInfo:fgui.GComponent = null;
    private xgnc:fgui.GComponent = null;
    private attr:fgui.GComponent = null;
    private hideBtn:fgui.GButton = null;
    private topUI:TopUI = null;

    private tableName:any = null;
    private lastIndex:number = 1;

    private selectHeadIndex = 0;
    private curSelectHeadIndex = -1;

    protected view(): HallView {
        return this._owner as HallView;
    }
    get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }

    protected addEvents(): void {
        Log.e("PlayerUI.addEvents");
        this.addEvent(GameEvent.RefreshPlayer,this.RefreshPlayer);
        this.addEvent(ProtoDef.pb.S2CZhanJi,this.onS2CZhanJi);
        this.addEvent(ProtoDef.pb.S2CZhanJiTableInfo,this.onS2CZhanJiTableInfo);

        let gt = Manager.utils.gt(GameCat.GameCat_Mahjong);
        this.addEvent(ProtoDef.pb.S2CGetSeasonDuanWeiCfg+"_"+gt,this.refreshHz);
    }

    protected onBind(): void {
        Log.d(this.root.name);
        this._close = this.root.getChild("close");
        this._close.asCom.getChild("back").asCom.getChild("gn").text = "个人信息";
        this.bindCloseClick();

        this.selectHead = this.root.getChild("select").asCom;
        this.selectHead.visible = false;

        this.hideInfo = this.root.getChild("ycxx").asCom;
        this.hideInfo.visible = false;
        this.hideInfo.getChild("close").onClick(this.hideHideTips,this);
        this.hideInfo.getChild("dbtn").onClick(this.hideHideTips,this);
        

        this.xgnc = this.root.getChild("xgnc").asCom;
        this.xgnc.visible = false;
        this.xgnc.getChild("dbtn").onClick(this.onClickDlgModNick,this);
        this.xgnc.getChild("close").onClick(this.onClickDlgModNickClose,this);

        let lb = this.selectHead.getChild("label").asLabel;
        lb.getChild("close").onClick(this.onClickSelectHeadClose,this);
        lb.getChild("gg").onClick(this.onClickSelectHeadMod,this);
        

        let xx = this.root.getChild("xinxi").asCom
        // xx.getChild("title1").text = xx.getChild("title").text;
        // xx.getChild("title1").asTextField.fontSize = xx.getChild("title").asTextField.fontSize;
        Manager.utils.fontSyncAll(xx);

        xx = this.root.getChild("zhanji").asCom
        // xx.getChild("title1").text = xx.getChild("title").text;
        // xx.getChild("title1").asTextField.fontSize = xx.getChild("title").asTextField.fontSize;
        Manager.utils.fontSyncAll(xx);

        let record = this.root.getChild("record").asCom;
        let tList = record.getChild("rlist").asList;
        tList.removeChildrenToPool();

        tList = record.getChild("list").asList;
        tList.selectedIndex = 0;

        xx.onClick(this.onClickZj,this);
        // let tab = tList.getChild("tab").asCom;
        // for (let index = 0; index < tab._children.length; index++) {
        //     let c = tab._children[index].asButton;
        //     c.getChild("title1").text = c.getChild("title").text;
        //     c.getChild("title1").asTextField.fontSize = c.getChild("title").asTextField.fontSize;
        // }
        this.topUI = new TopUI();
        this.topUI.setRoot(this.root);

        for (let index = 0; index < 16; index++) {
            let headId = index % 14;
            let url = fgui.UIPackage.getItemURL("hall","head_"+(101+headId));
            // Log.e(headId,url);
            let btn = lb.getChild("h"+index).asButton;
            btn.getChild("loader").icon = url;
            btn.data = index;
            btn.onClick(this.onClickHeadSelect,this);
        }

        this.attr = this.root.getChild("attr").asCom
        this.attr.getChild("ghtx").onClick(this.onClickSelectHead,this);
        this.attr.getChild("xgnc").onClick(this.onClickModNick,this);
        this.hideBtn = this.attr.getChild("hide").asButton;
        this.hideBtn.onClick(this.onClickPlayerInfoHide,this);

        this.attr.getChild("sex1").onClick(this.onClickMale,this);
        this.attr.getChild("sex2").onClick(this.onClickFemale,this);

        let zdj = Manager.gd.playerAttr(PlayerAttr.PA_TotalPlay);
        let zsl = Manager.gd.playerAttr(PlayerAttr.PA_TotalWin);
        let szTxt = "";
        if(zdj == 0){
            szTxt = "0.0%";
        }else{
            szTxt = (100 * (zsl / zdj)).toFixed(1) + "%";
        }
        this.attr.getChild("zsl").text = szTxt;
        this.attr.getChild("zdj").text = zdj;

        this.addEvents();
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
    
    public RefreshPlayer(){
        this.topUI.refresh();
        let gd = Manager.dataCenter.get(GameData);
        let pData = gd.player();
        this.headName.text = pData.name;
        this.attr.getChild("nick").text = pData.name;
        this.attr.getChild("uid").text = pData.guid;
        this.headLevel.text = "等级："+gd.playerAttr(PlayerAttr.PA_Grade);

        if(gd.playerAttr(PlayerAttr.PA_Gender) == GenderType.Gender_Male){
            this.attr.getController("SexG").selectedIndex = 0;
        }else{
            this.attr.getController("SexG").selectedIndex = 1;
        }
        // let icon = Number(pData.portraits.replace("file://",""));
        // icon = icon % 16;
        // if (icon < 0){
        //     icon = 16;
        // }
        // icon = icon + 101;
        // // Log.d(icon,"head_"+icon);
        // let iconUrl = fgui.UIPackage.getItemURL(HallView.getViewPath().pkgName,"head_"+icon);
        // this.headIcon.icon = iconUrl;
        let headUrl = gd.headUrl();
        Log.d("____headUrl",headUrl);
        this.attr.getChild("icon_loader").icon = headUrl;
        this.headVip.icon = gd.playerVipIcon();
        this.headVip.visible = false;

        let hide1 = gd.playerAttr(PlayerAttr.PA_HideInfo);
        if (hide1 == null || hide1 == 0){
            this.hideBtn.selected = false;
        }else{
            this.hideBtn.selected = true;
        }   
        this.refreshHeadIcon();
    }

    private refreshHz(){
        let hz = this.attr.getChild("hz").asCom;
        let gt = Manager.utils.gt(GameCat.GameCat_Mahjong);
        let dwData:pb.S2CGetSeasonDuanWeiCfg = Manager.dataCenter.get(GameData).get<pb.S2CGetSeasonDuanWeiCfg>(ProtoDef.pb.S2CGetSeasonDuanWeiCfg+"_"+gt);
        if(dwData != null){
            let lv = Manager.gd.playerGV(GroupId.GI_SeasonDuanWei,gt,1);
            let stars = this.attr.getChild("stars").asCom;
            Manager.utils.setHz(hz,stars,lv,dwData,true,false);

            // let conf = dwData.items[lv-1]; 
            // hz.getChild("tile").text = conf.name;
            // let iconId = Manager.utils.dwIcon(lv);
            // hz.getChild("n0").icon = fgui.UIPackage.getItemURL(HallView.getViewPath().pkgName,"ui_rank_dw_di_"+iconId);
            // let starCount = Math.floor(lv%5);
            // if(starCount == 0){
            //     starCount = 5;
            // }
            // Log.d("starCount:",starCount);
    
            // let stars = this.attr.getChild("stars").asCom;
            // stars.visible = true;
            // for (let index = 0; index < stars._children.length; index++) {
            //     let star = stars.getChild("s"+index).asCom;
            //     if(index < starCount){
            //         star.getChild("star").visible = true;
            //     }else{
            //         star.getChild("star").visible = false;
            //     }
            // }
        }
    }


    public setHallHead(sh : fgui.GComponent){
        this.hallHeadRoot = sh;
        this.headName = this.hallHeadRoot.getChild("name");
        this.headLevel = this.hallHeadRoot.getChild("level")
        this.headIcon = this.hallHeadRoot.getChild("face").asCom.getChild("icon").asLoader;
        this.headVip = this.hallHeadRoot.getChild("vip");


    }

    public onData(): void {
        this.RefreshPlayer();        
        this.refreshSex();
    }

    protected onClickJinbi(evt: fgui.Event){
        // let btn: fgui.GObject = fgui.GObject.cast(evt.currentTarget);
        // this.view().shop.setSelectIndex(0);
        // this.service.getShopItems();
        // this.view().shop.show();

        Manager.gd.put(ProtoDef.pb.S2CGetShopItems+"Index",{catName:"免费金豆"});
        Manager.uiManager.openFairy({ type: ShopView, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.ShopUI, name: "商城" });


    }

    protected onClickZuanshi(evt: fgui.Event){

        // let btn: fgui.GObject = fgui.GObject.cast(evt.currentTarget);
        Manager.gd.put(ProtoDef.pb.S2CGetShopItems+"Index",{catName:"钻石"});
        Manager.uiManager.openFairy({ type: ShopView, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.ShopUI, name: "商城" });
    }

    protected onClickLijuan(evt: fgui.Event){
        // let btn: fgui.GObject = fgui.GObject.cast(evt.currentTarget);
        // this.view().shop.setSelectIndex(4);
        // this.service.getShopItems();
        // this.view().shop.show();

        // this.view().logic.getMoneyCfgs();
        this.view().onClickHf();


    }

    protected onClickHeadSelect(evt: fgui.Event){
        let btn: fgui.GObject = fgui.GObject.cast(evt.currentTarget);
        this.curSelectHeadIndex = btn.data;
    }

    protected onClickSelectHead(){
        this.selectHead.visible = true;
        
        let gd = Manager.dataCenter.get(GameData);
        let pData = gd.player();
        let icon = gd.headIndex();
        this.selectHeadIndex = icon;
        
        let lb = this.selectHead.getChild("label").asLabel;
        lb.getChild("h"+icon).asButton.selected = true;
        this.curSelectHeadIndex = this.selectHeadIndex;
    }
    
    protected onClickPlayerInfoHide(){
        if (this.hideBtn.selected){
            this.showHideTips();
        }
        this.view().logic.hideMe(this.hideBtn.selected);
    }

    protected showHideTips(){
        this.hideInfo.visible = true;
    }

    protected hideHideTips(){
        this.hideInfo.visible = false;
    }

    protected onClickModNick(){
        // let nick = this.attr.getChild("nick").text;
        // let gd = Manager.dataCenter.get(GameData);
        // let pData = gd.player();
        // if (nick != pData.name){
        //     this.view().logic.modifySetName(nick);
        // }

        this.xgnc.visible = true;
    }

    protected onClickDlgModNick(){
        let nick = this.xgnc.getChild("n5").text;
        let gd = Manager.dataCenter.get(GameData);
        let pData = gd.player();
        if (nick != pData.name){
            this.view().logic.modifySetName(nick);
        }
    }

    protected onClickDlgModNickClose(){
        this.xgnc.visible = false;
    }

    protected onClickSelectHeadClose(){
        this.selectHead.visible = false;
    }

    protected onClickSelectHeadMod(){
        this.selectHead.visible = false;
        Log.e("onClickSelectHeadMod",this.curSelectHeadIndex,this.selectHeadIndex);
        if (this.curSelectHeadIndex != this.selectHeadIndex){
            this.view().logic.modifyHeadIcon(this.curSelectHeadIndex);
        }
    }

    protected onClickMale(){
        let gd = Manager.dataCenter.get(GameData);
        if (gd.playerAttr(PlayerAttr.PA_Gender) != 1){
            this.view().logic.modifySex(1);
        }
    }

    protected onClickFemale(){
        let gd = Manager.dataCenter.get(GameData);
        Log.d(gd.playerAttr(PlayerAttr.PA_Gender));
        if (gd.playerAttr(PlayerAttr.PA_Gender) != 2){
            this.view().logic.modifySex(2);
        }
    }

    ///////////////////////////////
    refreshHeadIcon(){
        let gd = Manager.dataCenter.get(GameData);
        let pData = gd.player();
        // let icon = Number(pData.portraits.replace("file://",""));
        // icon = icon % 16;
        // if (icon < 0){
        //     icon = 16;
        // }
        // icon = icon + 101;
        // // Log.d(icon,"head_"+icon);
        // let iconUrl = fgui.UIPackage.getItemURL(HallView.getViewPath().pkgName,"head_"+icon);
        let iconUrl = gd.headUrl();
        this.headIcon.icon = iconUrl;
        this.attr.getChild("icon_loader").icon = iconUrl;

        this.selectHeadIndex = gd.headIndex();
        this.curSelectHeadIndex = this.selectHeadIndex;
    }

    refreshNick(){
        let gd = Manager.dataCenter.get(GameData);
        let pData = gd.player();
        this.headName.text = pData.name;
        this.attr.getChild("nick").text = pData.name;
        this.xgnc.visible = false;
    }

    refreshSex(){
        let gd = Manager.dataCenter.get(GameData);
        let sex = gd.playerAttr(PlayerAttr.PA_Gender);
        this.attr.getChild("sex"+sex).asButton.selected = true;
    }


    onClickZj(){
        this.view().logic.getZhanJiTableInfo();
    }

    onClickItem(com: fgui.GComponent){
        if(com.data != null){
            if(this.lastIndex != com.data.tableId){
                this.view().logic.getZhanJi(com.data.tableId);
            }
        }
    }

    protected onS2CZhanJiTableInfo(data :pb.S2CZhanJiTableInfo){
        this.topUI.refresh();
        let record = this.root.getChild("record").asCom;
        let tList = record.getChild("list").asList;
        tList.off(fgui.Event.CLICK_ITEM, this.onClickItem, this);
        tList.removeChildrenToPool();
        this.tableName = {};
        for (let index = 0; index < data.tables.length; index++) {
            let di = data.tables[index];
            let com = tList.addItemFromPool().asCom;
            Manager.utils.fontSetText(com,di.name);
            com.data = di;
            this.tableName[di.tableId] = di.name;
        }
        tList.selectedIndex = 0;
        this.view().logic.getZhanJi();
        tList.on(fgui.Event.CLICK_ITEM, this.onClickItem, this);
    }
    

    protected onS2CZhanJi(data :pb.S2CZhanJi){
        this.topUI.refresh();
        this.lastIndex = data.tableId;
        let record = this.root.getChild("record").asCom;
        let tList = record.getChild("rlist").asList;
        tList.removeChildrenToPool();
        for (let index = 0; index < data.zhanJi.length; index++) {
            let di = data.zhanJi[index];
            let com = tList.addItemFromPool().asCom;
            com.width = tList.width;
            com.getChild("name").text = this.tableName[di.tableId];
            com.getChild("date").text = Manager.utils.formatTime(di.time);
            let icon = "";
            if(di.winLose > 0){
                icon = fgui.UIPackage.getItemURL(HallView.getViewPath().pkgName,"player_record_zi_1");
            }else{
                icon = fgui.UIPackage.getItemURL(HallView.getViewPath().pkgName,"player_record_zi_2");
            }
            com.getChild("ret").icon = icon;
            com.getChild("n4").text = Manager.utils.formatCoin(di.coin);
            if((index+1)%2 == 1){
                com.getChild("n5").visible = true;
                com.getChild("n12").visible = false;
            }else{
                com.getChild("n12").visible = true;
                com.getChild("n5").visible = false;
            }
        }
        tList.scrollToView(0);
    }

}