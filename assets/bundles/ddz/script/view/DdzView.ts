import GameView from "../../../../scripts/framework/core/ui/GameView";
import { DdzLogic } from "../logic/DdzLogic";
import PlayerCards from "./PlayerCards";
import { CardType, DdzData } from "../data/DdzData";
import GameData from "../../../../scripts/common/data/GameData";
import { CfgType, CommSubID, CurrencyType, DouCardType, DouDoubleType, DouPhase, GameCat, GroupId, PlayerLoc, SpringType } from "../../../../scripts/def/GameEnums";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";  
import { GameEvent } from "../../../../scripts/common/event/GameEvent";
import GameMatches from "../../../../scripts/common/fairyui/GameMatches";
import RoomView from "../../../gamecommon/script/logic/RoomView";
import { RoomManager } from "../../../gamecommon/script/manager/RoomManager";
import DRoomPlayer from "../../../gamecommon/script/logic/DRoomPlayer";
import { Config, ViewZOrder } from "../../../../scripts/common/config/Config";
import InvitedPlayer from "../../../../scripts/common/fairyui/InvitedPlayer";
import PropUse from "../../../gamecommon/script/logic/PropUse";
import DDZRuleView from "../../../../scripts/common/fairyui/DDZRuleView";
import ReFlashPosition from "../../../gamecommon/script/tools/ReFlashPosition";


const { ccclass, property } = cc._decorator;

@ccclass
export default class DdzView extends GameView {

    private isFrist:boolean = false;
    private lastCard:pb.S2CDouPlayCards = null;

    public playerCount:number = 3;
    public cards:PlayerCards = null;
    public cardDi:number[]=null; 
    public outcards:fgui.GList[]=[];
    public leftCards:fgui.GComponent[]=[];
    public heads:fgui.GComponent[]=[];
    public clocks:fgui.Controller = null;
    public cardTips:fgui.GComponent=null;
    public top:fgui.GComponent=null;
    public bet:fgui.GComponent=null;

    public sds:fgui.GComponent[]=[];

    public jb:fgui.GComponent[]=[];

    public sendCards:fgui.GComponent[]=[];
    private sendIndex:number = 0;

    private step:number = -1;

    private textRate:fgui.GTextField = null;
    private textBet:fgui.GTextField = null;

    private curClockText:fgui.GObject = null;

    private op:fgui.Controller = null;

    private cardX:number = null;
    private cardY:number = null;

    private posDI:cc.Vec2[]=[];

    public dizhuIndex:number = -1;

    private isGameEnd = false;

    private isFristOutCard:boolean = false;

    private wait:fgui.GObject = null;

    private robStart:number = -1;

    private longTouchId:number = -1;

    private jpqList:fgui.GList = null;
    private jpqBtn:fgui.GButton = null;
    private topLoader:fgui.GLoader = null;

    private outandhandcard:number[] = [];
    private topType:string = "";

    private jpqUI2:fgui.GTextField = null;
    private jpqUI1:fgui.GTextField = null;

    private roomView:RoomView = null;

    public roomPlayer:DRoomPlayer = null;

    private jpqLeftTime:number = 0;

    private kdbBtn:fgui.GButton=null;

    //为了让服务器省事，硬编码
    private isWaitBuy:boolean = false;
    private isWaitJpq:boolean = false;
    private isWaitKdp:boolean = false;
    private isSendCardEnd = false;

    private cpDlg:fgui.GComponent = null;
    private cpContext:fgui.GComponent = null;
    private cpData:any = {};

    private centerSpine:fgui.GComponent = null;

    private adaptiveBtns_com :fgui.GComponent =null;
    private reFlashNextInvite_SC:ReFlashPosition=null;

    private isWin = false;

    public static getPrefabUrl() {
        return "prefabs/DdzView";
    }

    static getViewPath(): ViewPath {
        let path : ViewPath = {
            	/**@description 资源路径 creator 原生使用*/
            assetUrl: "ui/ddz",
            /**@description 包名称 fgui 使用*/
            pkgName : "ddz",
            /**@description 资源名称 fgui 使用*/
            resName : "DdzView",
        }
        return path;
    }
    
    static logicType = DdzLogic;

    public get logic(): DdzLogic | null {
        return this._logic as any;
    }

    onDispose(): void {
        this.roomView.removeEventListeners();
        this.roomPlayer.removeEventListeners();
        this.stopCountdown();
        super.onDispose();
    }

    
    onS2CDouUseRecorder(data:pb.S2CDouUseRecorder){
        this.updatejpqLeftTime();
    }

    updatejpqLeftTime(): void {
        this.jpqLeftTime = Manager.gd.JqpLeftTime();
        if(this.jpqLeftTime == 0){
            this.jpqBtn.text = "未使用";
        }else{
            this.jpqBtn.text = Manager.utils.transformLeftTime(this.jpqLeftTime);
        }
    }

    onUseProp(propID:number,dataId:number){
        let propData = Manager.utils.GetDefaultDaoJuConfigItem(propID);
        Log.d("DdzView.onUseProp-> propID:",propID," dataId:",dataId," propData:",propData);
        // let itemData = Manager.utils.GetShopItemData( propID,data.costtype ,shopData );

        function ff(params:boolean) {
            // Log.d("Manager.alert ff",params);
            if (params){
                this.logic.useProp(dataId);
            }else{
                Manager.tips.show("取消使用");
            }
        };

        function ffkdp(params:boolean) {
            // Log.d("Manager.alert ff",params);
            if (params){
                this.logic.C2SDouSeeFinal();
            }else{
                Manager.tips.show("取消使用");
            }
        };

        let cf:AlertConfig={
            // immediatelyCallback : true,
            title:"提示",
            text: "你要现在使用"+ propData.MingZi +"吗？",   
            confirmCb: ff.bind(this),        
            cancelCb: ff.bind(this),
            confirmString:"使用",
            cancelString:"取消",
        };

        let cfkdp:AlertConfig={
            // immediatelyCallback : true,
            title:"提示",
            text: "你要现在使用"+ propData.MingZi +"吗？",   
            confirmCb: ffkdp.bind(this),        
            cancelCb: ffkdp.bind(this),
            confirmString:"使用",
            cancelString:"取消",
        };

        if(propID >=10030 && propID<=10031){
            let cf:AlertConfig={
                // immediatelyCallback : true,
                title:"提示",
                text: propData.MingZi +"自动消耗，无需使用",   
            };
            Manager.alert.show(cf);
        }
        else if(propID >=10019 && propID<=10020){
            Manager.alert.show(cfkdp);
            
        }else if(propID >=10026 && propID<=10029){
            if(!this.isSendCardEnd){
                Manager.tips.show("请等待发牌结束");
                return;
            }
            this.cpContext.data = dataId;
            this.cpDlg.visible = true;            
        }else{
            Manager.alert.show(cf);
        }

    }

    private initEft(e3d:fgui.GLoader3D){
        e3d.verticalAlign = fgui.VertAlignType.Middle;
        e3d.align = fgui.AlignType.Center;
        e3d.autoSize = true;
        e3d.fill = fgui.LoaderFillType.Scale;
        e3d.visible = false;
    }

    onLoad() {
        super.onLoad();
        Manager.uiLoading.hide();
        this.enableFrontAndBackgroundSwitch = true;
        if(Manager.gd.player().location == PlayerLoc.PlayerLoc_Game){
            this.logic.syncState();
        }

        this.updatejpqLeftTime();
        this.step = 0;
        let sc0 = this.root.getChild("send0").asCom;
        sc0.getChild("left").text = "";
        sc0.sortingOrder = 2;
        this.sendCards.push(sc0);
        this.cardX = sc0.x;
        this.cardY = sc0.y;
        for (let index = 1; index < 54; index++) {
            let sc = fgui.UIPackage.createObject(DdzView.getViewPath().pkgName,"OCard").asCom;   
            sc.getChild("left").text = "";
            sc.name = "send"+index;
            this.sendCards.push(sc);   
            this.root.addChild(sc);
            sc.sortingOrder = 1;
            sc.x = sc0.x;
            sc.y = sc0.y;
            sc.scaleX = sc0.scaleX;
            sc.scaleY = sc0.scaleY;
            sc.setPivot(sc0.pivotX,sc0.pivotY,sc0.pivotAsAnchor);
        }
     
        this.posDI = [];
        for (let index = 0; index < this.playerCount; index++) {
        
            let d = this.root.getChild("d"+index);
            this.posDI.push(cc.v2(d.x,d.y));
            d.sortingOrder = 2;

            let com = this.root.getChild("t"+(index+1)).asCom;
            com.sortingOrder = 5;

            let e3d = <fgui.GLoader3D>this.root.getChild("ef"+(index+1));
            e3d.sortingOrder = 4;
            this.initEft(e3d);
            this.DdzData().eft.push(e3d);
            let comjb = this.root.getChild("JB"+(index)).asCom;
            comjb.visible = false;
            this.jb.push(comjb);
        }
        this.DdzData().zdEft = this.root.getChild("zd").asCom;
        this.DdzData().zdEft.visible = false;
        this.DdzData().eftCenter = <fgui.GLoader3D>this.root.getChild("efc");
        this.DdzData().eftCenter.sortingOrder = 4;
        this.DdzData().zdEft.sortingOrder = 4;
        this.initEft(this.DdzData().eftCenter);

        this.root.getChild("di").sortingOrder = 2;

        this.root.getChild("rob").sortingOrder = 3;
        this.root.getChild("mpks").sortingOrder = 3;
        this.root.getChild("ratio").sortingOrder = 5;
        this.root.getChild("obg").sortingOrder = 3;
        this.root.getChild("obend").sortingOrder = 3;

        // Log.e("this.DdzData().eft",this.DdzData().eft);
        let gd = Manager.dataCenter.get(GameData);
        let tableInfo = gd.get<pb.S2CDouTableInfo>(ProtoDef.pb.S2CDouTableInfo);
        let rule = tableInfo.tableInfo.rules;
        let xp = "经典";
        if(!rule.xiPai){
            xp = "不洗牌";
        }
        this.textBet.text = "底分:"+ Manager.utils.formatCoin(rule.base)+" "+xp+" 封顶"+rule.maxFan+"倍";
        // Log.d("ddz.onload gd:",Manager.dataCenter.get(GameData).get(ProtoDef.pb.C2SMatchTable));
        this.initPlayers();
        this.clearTable();
        if(!this.DdzData().douPlayerInfo[0].isReady){
            this.logic.douReady();
        }

        this.robStart = -1;
        


        this.kdbBtn.sortingOrder = 4;
        Manager.globalAudio.playMusic("audio/ddz_bgm",Config.BUNDLE_DDZ,true);
        this.roomView.GetRoot().sortingOrder = 9;
        this.roomView.propUse_sc.root.sortingOrder = 9;
        this.cpDlg.sortingOrder = 10;
        let bc = this.root.getChild("bc").asCom;
        bc.sortingOrder = 100;

        this.logic.onC2SUILoaded();
    }

    initPlayers(){
        let dd = Manager.dataCenter.get(DdzData);
        let gd = Manager.dataCenter.get(GameData);
        let bc = this.root.getChild("bc").asCom;
        let ct = bc.getChild("ct").asCom;
        for (let index = 0; index < dd.tablePlayer.length; index++) {
            let tp = dd.tablePlayer[index];
            let com = this.heads[index];
            if(com == null){
                continue;
            }

            if(tp == null){
                for (let index = 0; index < com._children.length; index++) {
                    com.getChildAt(index).visible = false;
                }
                com.getChild("headbg").visible = true;
                com.getChild("namebg").visible = true;
                com.getChild("headbd").visible = true;
                continue;
            }
            // Log.d(tp);

            com.getChild("nick").text = tp.player.name;
            com.getChild("nick").visible = true;
            com.getChild("coin").text = Manager.utils.formatCoin(tp.player.currencies[CurrencyType.CT_Coin]);
            com.getChild("coin").visible = true;

            com.getChild("loader").icon = gd.playerheadUrl(tp.player.portraits);
            com.getChild("loader").visible = true;
            com.getChild("jd").visible = true;
            // Log.d("com.getChild().icon:",com.getChild("loader").icon);
            com.getChild("dz").visible = false;
            com.getChild("jb").visible = false;    
            com.getChild("cjjb").visible = false;   
            com.getChild("tg").visible = false;  
            let h = ct.getChild("h"+index).asCom;
            h.getChild("head").asCom.getChild("icon").icon = com.getChild("loader").icon;
            h.getChild("name").text = tp.player.name;
            com.data = tp;
            this.setCpUi(index,tp);
        }
        this.roomPlayer.heads = this.heads;
    }

    setCpUi(index:number,data:pb.ITablePlayer){
        let head = this.cpContext.getChild("head"+index);
        if(head != null){
            head.icon = Manager.gd.playerheadUrl(data.player.portraits);
        }
        let nick = this.cpContext.getChild("nick"+index);
        if(nick != null){
            nick.text = data.player.name;
        }
        let dx = this.cpContext.getChild("dx"+index);
        if(dx != null){
            dx.data = data.pos;
        }
        let title = this.cpContext.getChild("title");
        if(title){
            title.asCom.getChild("tittle").icon = fgui.UIPackage.getItemURL(Config.BUNDLE_HALL,"ui_daoju_zi_112");
        }
    }

    onClickHead(evt: fgui.Event){
        Log.d("onClickHead", evt.currentTarget);
        let obj = fgui.GObject.cast(evt.currentTarget);
        let data = obj.data as pb.ITablePlayer;
        if(data != null){
            Log.d("onClickHead:",data.player.name);
            dispatch("OpenReflashPlayerDetails",data);
        }
    }

    onFairyLoad(): void {

   
        Manager.gd.LocalPosition = "DdzView";
        this.root.name = "DdzView";
        this.roomView = new RoomView();
        this.roomView.Init(this,"roomView")
        this.roomView.SetPropUse(new PropUse(this.root.getChild("propUseView").asCom));
        this.cards = new PlayerCards(this);

        this.roomPlayer = new DRoomPlayer();
        this.roomPlayer.Init(this)
        this.roomPlayer.setInit();

        this.cpDlg = this.root.getChild("cpDlg").asCom;
        this.cpContext = this.cpDlg.getChild("n0").asCom;
        this.cpContext.getChild("close").onClick(this.onClickCloseCp,this);
        this.cpContext.getChild("qd").onClick(this.onClickCp,this);
        // this.root.getChild("back").onClick(this.onClickBack,this);
        // this.root.getChild("set").onClick(this.onClickSet,this);
        // this.root.getChild("trust").onClick(this.onClickTrust,this);

        for (let index = 0; index < this.playerCount; index++) {
            let list = this.root.getChild("oc"+(index+1)).asList;
            list.removeChildrenToPool();
            list.visible = false;
            this.outcards.push(list);
            let com = this.root.getChild("h"+(index+1)).asCom;
            com.onClick(this.onClickHead,this);
            this.heads.push(com);
            let left = this.root.getChild("h"+(index+1)+"Card").asCom;
            left.visible = false;
            left.data = 0;
            this.leftCards.push(left);
            // if(index == 2){
            //     com.getChild("n16").scaleX = -1;
            // }else{
            //     com.getChild("n16").scaleX = 1;
            // }   
        }
        this.roomPlayer.heads = this.heads;
        
        let rob = this.root.getChild("rob").asCom;
        rob.getChild("btn_rob").onClick(this.onClickRob,this);
        rob.getChild("btn_rob_n").onClick(this.onClickNoRob,this);

        let ratio = this.root.getChild("ratio").asCom;
        ratio.getChild("btn_ratio_s").onClick(this.onClickSRatio,this);
        ratio.getChild("btn_ratio").onClick(this.onClickRatio,this);
        ratio.getChild("btn_ratio_n").onClick(this.onClickNRatio,this);

        let obg = this.root.getChild("obg").asCom;
        obg.getChild("buchu").onClick(this.onClickBuchu,this);
        obg.getChild("tishi").onClick(this.onClickTishi,this);
        obg.getChild("chupai").onClick(this.onClickChupai,this);

        let obend = this.root.getChild("obend").asCom;
        obend.getChild("btn_back").onClick(this.onClickEndBack,this);
        obend.getChild("btn_next").onClick(this.onClickNext,this);
        obend.getChild("btn_invaite").onClick(this.OnClickInvite,this);

        this.kdbBtn = this.root.getChild("KDP").asButton;
        this.kdbBtn.onClick(this.onClickKdp,this);
        this.kdbBtn.visible = false;

        this.cardTips = this.root.getChild("ct").asCom;
        this.bet = this.root.getChild("bet").asCom;
        this.textBet = this.bet.getChild("n1").asTextField;
        this.top = this.root.getChild("top").asCom;
        this.cardTips.getChild("qxtg").onClick(this.cancelTrust,this);
        this.cardTips.visible = false;

        this.wait = this.root.getChild("wait");
        this.wait.visible = false;

        for (let index = 0; index < 3; index++) {
            let topCom = this.top.getChild("c"+index).asCom;
            let item = topCom.getChild("item").asCom;
            this.setItemBack(item,true);
        }
        this.textRate = this.top.getChild("rate").asTextField;
        this.setTopMultiple(0);
        this.op = this.root.getController("FlowC");
        this.clocks = this.root.getController("ClockC");

        let bc = this.root.getChild("bc").asCom;
        bc.visible = false;
        let ct = bc.getChild("ct").asCom;
        bc.getChild("close").onClick(this.hideBalance,this);

        this.adaptiveBtns_com =  ct.getChild("adaptiveBtns").asCom;
        this.reFlashNextInvite_SC = new ReFlashPosition (this.adaptiveBtns_com,150);

        this.adaptiveBtns_com.getChild("Btn2").onClick(this.onClickNext,this);
        ct.getChild("inviteBtn").onClick(this.OnClickInvite,this);
        ct.getChild("inviteBtn").visible =false;

        let mask = bc.getChild("mask").asCom;
        bc.alpha = 1;
        bc.makeFullScreen();
        this.longTouchId = -1;
        mask.on(fgui.Event.TOUCH_BEGIN, this.onMoveBeginMask, this);
        mask.on(fgui.Event.TOUCH_END, this.onMoveEndMask, this);

        let jpq = this.top.getChild("jpq").asCom;
        jpq.getChild("list").asList;
        jpq.onClick(this.onClickJpqView,this);
        this.jpqUI1 = jpq.getChild("sj").asCom.getChild("value").asTextField;
        this.jpqUI2 = jpq.getChild("xj").asCom.getChild("value").asTextField;
        this.jpqList = jpq.getChild("list").asList;
        this.jpqBtn = this.top.getChild("jpbbtn").asButton;
        this.jpqBtn.onClick(this.onClickJpq,this);
        this.topLoader = this.top.getChild("loader").asLoader;
        this.topLoader.visible = false;
        this.top.getController("jpqc").selectedIndex = 1;
        this.initJpq();

        this.roomView.showBag(false);
    }

    private initJpq(){
        for (let index = 0; index < this.jpqList._children.length; index++) {
            let com = this.jpqList._children[index].asButton;
            if(index < 2){
                com.data = 1;
            }else{
                com.data = 4;
            }
            this.updateJpcItemColor(com);
        }
    }

    private updateJpcItemColor(com :fgui.GButton){
        com.text = com.data.toString();
        if(com.data == 0){
            com.getController("nc").selectedPage = "灰";
        }else if(com.data == 4){
            com.getController("nc").selectedPage = "红";
        }else{
            com.getController("nc").selectedPage = "橙";
        }
    }

    public updateJpq(cards:number[]){
        this.initJpq();
        this.outandhandcard = this.outandhandcard.concat(cards);
        // Log.e("this.outandhandcard:",this.outandhandcard);
        for (let index = 0; index < this.outandhandcard.length; index++) {
            let c = this.outandhandcard[index];
            let cc = this.DdzData().Card(c);
            // Log.d("sdfsdfsdfsfdsdf",c,cc);
            let obj = this.jpqList.getChild(cc.v.toString());
            if(obj != null){
                let com = obj.asButton;
                com.data = com.data - 1;
                if(com.data < 0){
                    com.data = 0;
                }
                this.updateJpcItemColor(com);
            }
        }
    }

    onClickCloseCp(){
        this.cpDlg.visible = false;
    }

    onClickCp(){
        if(this.cpContext.data != null){
            let c = this.cpContext.getController("cpc");
            let dx = this.cpContext.getChild(c.selectedPage);
            Log.d("=================",dx);
            if(dx != null && dx.data != null){
                // this.isWaitJpq
                Log.d("=================",dx);
                this.logic.useProp(this.cpContext.data,[dx.data]);
            }
        }
        this.onClickCloseCp();
    }

    onS2CDouViewCards(data:pb.S2CDouViewCards){
        this.roomView.hideBag();
        let pos = this.DdzData().ToLoaclPos(data.targetPos);
        this.cpData[pos] = this.DdzData().ToLocalCard(data.cards);
        this.updateCdList(pos);
    }

    private checkCdData(pos:number,card:number[]){
        let data = this.cpData[pos];
        if(data != null && data.length > 0){
            Log.d("checkCdData：",data,card);
            for (let index = 0; index < card.length; index++) {
                for (let di = 0; di < data.length; di++) {
                    if(card[index] == data[di]){
                        data.splice(di,1);
                        Log.d("checkCdData splice：",data,card);
                        break;
                    }
                }
            }
            Log.d("checkCdData end：",data,card);
            this.updateCdList(pos);
        }
    }

    private updateCdList(pos:number){
        let cp = this.root.getChild("cp"+pos);
        if(cp != null && this.cpData[pos] != null){
            let list = cp.asList;
            list.removeChildrenToPool();
            let len = this.cpData[pos].length;
            for (let index = 0; index < len; index++) {
                let card =  this.DdzData().Card(this.cpData[pos][index]);
                let com = list.addItemFromPool().asCom;
                let item = com.getChild("item").asCom;
                // this.setItemBack(item,false);
                this.setCardData(com,card.v,card.t,false,true);
                this.setItemBack(item,false);
                com.visible = true;
            }
            let leftNode = this.leftCards[pos].getChild("left");
            let count = leftNode.data;
            if(this.leftCards[pos].visible == false){
                count = 17;
            }
            let left = count - len;
            if(left > 0){
                for (let index = 0; index < left; index++) {
                    let com = list.addItemFromPool().asCom;
                    let item = com.getChild("item").asCom;
                    this.setItemBack(item,true);
                }
            }
            this.root.getChild("cpt"+pos).visible = true;
        }
    }

    onClickKdp(){
        if(!Manager.utils.HaveDaoJuItemDdzKDp()){
            this.roomView.showBag();
            this.isWaitBuy = false;
            this.isWaitKdp = this.roomView.backUseDdzKdp();
        }else{
            this.logic.C2SDouSeeFinal();
        }
    }

    onS2CDouSeeFinal(data:pb.S2CDouSeeFinal){
        let pos = this.DdzData().ToLoaclPos(data.pos);
        if(pos != 0){
            let name = this.DdzData().tablePlayer[pos].player.name;
            Manager.tips.show("玩家"+name+"使用了看牌卡");
            return;
        }
        this.root.getChild("di").visible = true;
        for (let index = 0; index < data.cards.length; index++) {
            let c = this.DdzData().cardMap[data.cards[index]];
            let com = this.root.getChild("d"+index).asCom;
            com.data = c;
            this.setPlayFlip(com,index,false);      
            // let topCom = this.top.getChild("c"+index).asCom;
            // topCom.data = c;
            // this.setTopPlayFlip(topCom,index);
        }
        // this.setTopMul(data.cards);
        this.kdbBtn.visible = false;
    }


    onClickJpq(){

        if(this.jpqLeftTime <= 0){
            if(Manager.utils.HaveDaoJuItemDdzJpq()){
                this.logic.autoDouUseRecorder();   
            }else{
                this.roomView.showBag();
            }
        }else{
            let jc = this.top.getController("jpqc");
            jc.selectedIndex = 1-jc.selectedIndex;
        }

    }

    onClickJpqView(){
        if(this.jpqLeftTime > 0){
            let jc = this.top.getChild("jpq").asCom.getController("jattr");
            jc.selectedIndex = 1-jc.selectedIndex;
        }
    }

    onMoveBeginMask(evt: fgui.Event){
        evt.captureTouch();
        if(this.longTouchId != -1){
            clearInterval(this.longTouchId);
        }
        this.longTouchId = setTimeout(() => {
            let bc = this.root.getChild("bc").asCom;
            bc.alpha = 0;
        }, 1000);
    }

    onMoveEndMask(evt: fgui.Event){
        let bc = this.root.getChild("bc").asCom;
        bc.visible = true;
        bc.alpha = 1;
        if(this.longTouchId != -1){
            clearInterval(this.longTouchId);
        }
        this.longTouchId = -1;
    }

    private hideBalance(){
        let bc = this.root.getChild("bc").asCom;
        bc.visible = false;
    }

    protected onEnterForgeground(inBackgroundTime: number) {


        Log.d("DDZView.onEnterForgeground.C2SSyncState:",inBackgroundTime);
        if (RoomManager.GetRoomState() != RoomManager.StateType.Resulting) {
            //从后台返回刷新数据
            this.logic.syncState();
        }
    }

    onS2CDouStart(){
        let bc = this.root.getChild("bc").asCom;
        bc.visible = false;
        this.cpDlg.visible = false;
        let data =  Manager.gd.get<pb.S2CDouTableInfo>(ProtoDef.pb.S2CDouTableInfo);
        let dd = Manager.dataCenter.get(DdzData);
        dd.initData();  
        this.roomPlayer.n2lPosMap = dd.Guid2lPosMap;
        this.setTopMultiple(data.tableInfo.landlordDouble);
        this.initPlayers();
        this.clearTable();
        this.op.selectedPage = "mpks";
    }

    onNextMatch(){
        this.onS2CDouStart();
        this.logic.douReady();
        Manager.uiManager.hide(GameMatches);
    }

    clearPlayer(guid:number){
        let index = this.DdzData().clearPlayer(guid);
        if(index == -1){
            return;
        }
        if(index >= this.heads.length ){
            return;
        }
        let head = this.heads[index];
        if(head == null){
            return;
        }
        for (let index = 0; index < head._children.length; index++) {
            head.getChildAt(index).visible = false;
        }
        head.getChild("headbg").visible = true;
        head.getChild("namebg").visible = true;
        head.getChild("headbd").visible = true;
    }

    onRefreshGameTable(data:pb.S2CDouTableInfo){
        let bc = this.root.getChild("bc").asCom;
        bc.visible = false;
        Log.d("重连数据:",data);
        let dd = Manager.dataCenter.get(DdzData);
        Manager.gd.put(ProtoDef.pb.S2CDouTableInfo,data);
        Manager.dataCenter.get(DdzData).initData();  
        this.roomPlayer.n2lPosMap = dd.Guid2lPosMap;
        this.setTopMultiple(data.tableInfo.landlordDouble);
        this.initPlayers();
        this.clearTable();
        Log.d("阶段：",data.tableInfo.phase);


        this.lastCard = null;
        let dpc = data.tableInfo.boutCards;
        if(dpc != null && dpc.length > 0){
            for (let index = 0; index < dpc.length; index++) {
                let lc = dd.ToLoaclPos(dpc[index].pos);
                if(dpc[index].cards.length > 0){
                    let card = dd.ToLocalCard(dpc[index].cards);
                    this.outCard(lc,card,false);
                }
                if(dpc[index].pos == data.tableInfo.lastPlayPos){
                    if(this.lastCard == null){
                        type Packet = typeof pb.S2CDouPlayCards;
                        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.S2CDouPlayCards);
                        this.lastCard = new Packet();
                    }
                    this.lastCard.cards = dpc[index].cards;
                    this.lastCard.cardType = data.tableInfo.lastCardType;
                }
            }
        }
        Log.d("onRefreshGameTable.lastcard:",this.lastCard);
  
        let tempGroup:pb.IDouCardGroup=null;

        if(data.tableInfo.phase != DouPhase.DouPhase_Wait && data.tableInfo.phase != DouPhase.DouPhase_Ended && data.tableInfo.phase != DouPhase.DouPhase_Settle ){
            for (let index = 0; index < data.players.length; index++) {
                if(data.players[index].doubleType != DouDoubleType.DouDouble_Null){
                    this.setDouDoubleNotips(data.players[index].pos,data.players[index].doubleType);
                } 
                this.setDouSetTrusteeship(data.players[index].pos,data.players[index].isTrusteeship);
                if(data.players[index].isLandlord){
                    this.dizhuIndex = dd.ToLoaclPos(data.players[index].pos);
                }
                let pos = dd.ToLoaclPos(data.players[index].pos);
                if(pos == 0){
                    tempGroup = data.players[index].group;
                    this.cards.setServerGroup(data.players[index].group);
                    this.isFrist = false;
                    if(this.cards.getGroupCardCount()>0){
                        this.isFrist = true;
                    }
                }
            }
        }

    

        let all = [];
        for (let i = 0; i < data.players.length; i++) {
            let index = this.DdzData().ToLoaclPos(data.players[i].pos);
            this.leftCards[index].getChild("left").data = data.players[i].handCardsNum == null ? 0 : data.players[i].handCardsNum;
            this.leftCards[index].getChild("left").text = this.leftCards[index].getChild("left").data+"";   
            this.leftCards[index].visible = true; 
            if(index == 0){
                this.cards.refreshCard(data.players[i].handCards);
                for (let hi = 0; hi < data.players[i].handCards.length; hi++) {
                    const hc = data.players[i].handCards[hi];
                    all.push(hc);
                }
            }else{
                if(data.players[i].handCards.length > 0){
                    this.cpData[index] = this.DdzData().ToLocalCard(data.players[i].handCards);
                    this.updateCdList(index); 
                }
            }

        }
        
        if(data.tableInfo.phase == DouPhase.DouPhase_Wait){
            this.logic.douReady();
            RoomManager.SetState(RoomManager.StateType.Resulting);
        }else if(data.tableInfo.phase == DouPhase.DouPhase_Starting){
            RoomManager.SetState(RoomManager.StateType.Playing);
            Manager.tips.debug("客户端不应该收到这个状态DouPhase.DouPhase_Starting");
        }else if(data.tableInfo.phase == DouPhase.DouPhase_DealCard){
            RoomManager.SetState(RoomManager.StateType.Playing);
            Manager.tips.debug("客户端不应该收到这个状态DouPhase.DouPhase_DealCard");
        }else if(data.tableInfo.phase == DouPhase.DouPhase_Landlord){
            RoomManager.SetState(RoomManager.StateType.Playing);
            this.isSendCardEnd = true;
            fgui.GTween.kill(this,false);
            for(let i=0;i<54;i++){
                let sc = this.root.getChild("send"+i).asCom;
                fgui.GTween.kill(sc,false);
                if(i>50){
                    sc.getChild("left").text = sc.getChild("left").data+"";
                    let di = this.root.getChild("d"+(i-51));
                    di.scaleX = 1;
                    di.scaleY = 1;
                    sc.scaleX = 1;
                    sc.scaleY = 1;
                    sc.x = di.x;
                    sc.y = di.y;
                }
                sc.visible = false;
            }
            for (let index = 0; index < data.players.length; index++) {
                if(data.players[index].pos == this.DdzData().meNSeat){
                    if(!data.players[index].isJiao){
                        this.setLand(data.tableInfo.curActPos,data.tableInfo.curActTime,data.tableInfo.landlordDouble);
                    }
                }     
            }
            this.reConnKdp(data);
        }else if(data.tableInfo.phase == DouPhase.DouPhase_Double){
            RoomManager.SetState(RoomManager.StateType.Playing);
            this.isSendCardEnd = true;
            for (let index = 0; index < data.players.length; index++) {
                if(data.players[index].doubleType == DouDoubleType.DouDouble_Null){
                    if(data.players[index].pos == this.DdzData().meNSeat){
                        this.setDoubleStart(data.tableInfo.curActTime);
                    }
                } 
            }
            this.reConnKdp(data);
        }else if(data.tableInfo.phase == DouPhase.DouPhase_Play){
            this.root.getChild("di").visible = false;
            RoomManager.SetState(RoomManager.StateType.Playing);
            this.isSendCardEnd = true;
            this.isFrist = false;

            if(this.lastCard == null && data.tableInfo.curActPos == dd.meNSeat){
                this.isFrist = true;
            }
            this.setDouPlayPos(data.tableInfo.curActPos,data.tableInfo.curActTime,this.isFrist,tempGroup);
        }else if(data.tableInfo.phase == DouPhase.DouPhase_Settle){
            this.root.getChild("di").visible = false;
            RoomManager.SetState(RoomManager.StateType.Resulting);
        }else if(data.tableInfo.phase == DouPhase.DouPhase_Ended){
            this.root.getChild("di").visible = false;
            RoomManager.SetState(RoomManager.StateType.Resulting);
        }

        if(data.tableInfo.finalCards != null && data.tableInfo.finalCards.length > 0){
            for (let index = 0; index < data.tableInfo.finalCards.length; index++) {
                let c = dd.cardMap[data.tableInfo.finalCards[index]];
                let topCom = this.top.getChild("c"+index).asCom;
                topCom.data = c;
                this.setTopPlayNoFlip(topCom,index);;
                if(data.players[index].isLandlord){
                    let cid = dd.ToLoaclPos(data.players[index].pos);
                    this.heads[cid].getChild("dz").visible = true;
                }
            }
            this.setTopMul(data.tableInfo.finalCards);
            this.showTopMul();
        }

        if(data.tableInfo.recordCards != null && data.tableInfo.recordCards.length > 0){
            for (let index = 0; index < data.tableInfo.recordCards.length; index++) {
                let dcr = data.tableInfo.recordCards[index];
                let cid = dd.ToLoaclPos(dcr.pos);
                let ctxt = "";
                for (let ci = 0; ci < dcr.items.length; ci++) {
                    const cis = dcr.items[ci];
                    let text = "";
                    for (let cica= 0; cica < cis.cards.length; cica++) {
                        const cicas = cis.cards[cica];
                        all.push(cicas);
                        let lcc = dd.Card(dd.cardMap[cicas]);
                        let lccs = dd.CardValueStr(lcc.v);
                        text = text + lccs;
                    }
                    ctxt = ctxt + text + " ";
                }
                if(cid == 1){
                    this.jpqUI1.text = ctxt;
                }else if(cid == 2){
                    this.jpqUI2.text = ctxt;
                }
            }
        }
        if(all.length > 0){
            this.updateJpq(this.DdzData().ToLocalCard(all));
            if(data.tableInfo.phase >= DouPhase.DouPhase_Play){
                if(this.jpqLeftTime > 0){
                    let jpcc = this.top.getController("jpqc");
                    if(jpcc.selectedIndex != 0){
                        jpcc.selectedIndex = 0;
                    }   
                }
            }
        }
    }

    private reConnKdp(data:pb.S2CDouTableInfo){
        this.root.getChild("di").visible = true;
        let dd = Manager.dataCenter.get(DdzData);
        // this.kdbBtn.visible = true;
        if(data.tableInfo.finalCards != null && data.tableInfo.finalCards.length > 0){
            for (let index = 0; index < data.tableInfo.finalCards.length; index++) {
                let c = dd.cardMap[data.tableInfo.finalCards[index]];
                let com = this.top.getChild("c"+index).asCom;
                com.data = c;
                let cardTV = dd.Card(com.data);
                this.setCardData(com,cardTV.v,cardTV.t,false);

                let comd = this.root.getChild("d"+index).asCom;
                comd.data = c;
                this.setCardData(comd,cardTV.v,cardTV.t,false);
            }
            this.kdbBtn.visible = false;
        }else{
            for (let index = 0; index < 3; index++) {
                let com = this.root.getChild("d"+index).asCom;
                let item = com.getChild("item").asCom;
                this.setItemBack(item,true);
            }
            this.kdbBtn.visible = true;
        }
    }

    setItemBack(item:fgui.GComponent,v:boolean){
        item.getChild("back").visible = v;
        item.getChild("mask").visible = false;
    }

    onClickEndBack(){
        this.roomView.leaveGame();
    }

    onClickNext(){
        if(this.isGameEnd){     
            // this.enterBundle(Config.BUNDLE_HALL);
            let tbInfo = Manager.gd.get<pb.S2CDouTableInfo>(ProtoDef.pb.S2CDouTableInfo);
            if(tbInfo == null){
                Log.e("房间信息没有找到");
                this.onErrorBackHall();
                return;
            }

            if(tbInfo.tableBase.inviteable){
                this.logic.douReady();
            }else{
                let np = Manager.gd.getNextMatch(tbInfo.tableBase.catName);
                if(np == null){
                    this.onErrorBackHall();
                    return;
                }
                this.logic.nextMatch(np.gt,np.cfgId);
            }
        }
    }

    private OnClickInvite() 
    {
        Log.w("OnClickInvite 点击了邀请按钮 ")

        let tbInfo = Manager.gd.get<pb.S2CDouTableInfo>(ProtoDef.pb.S2CDouTableInfo);
        if ( tbInfo.tableBase.inviteable) 
        {
            // this.logic.douReady();
            this.logic.onC2SGetIdlePlayers(null);
            Manager.uiManager.openFairy({ type: InvitedPlayer, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.UI, name: "邀请好友" });
        }
    }



    onErrorBackHall(){
        Log.e("数据错误,返回大厅");
    }

    cancelTrust(){
        this.logic.douSetTrusteeship(false);
    }

    showTrust(){
        this.cardTips.getChild("rbl").visible = false;
        this.cardTips.getChild("qxtg").visible = true;
    }

    showAnirgama(){
        if(this.cardTips.getChild("qxtg").visible){
            return;
        }
        this.cardTips.visible = true;
        this.cardTips.getChild("rbl").visible = true;
        this.cardTips.getChild("qxtg").visible = false;
    }

    hideAnirgama(){
        if(this.cardTips.getChild("qxtg").visible){
            return;
        }
        this.cardTips.visible = false;
        this.cardTips.getChild("rbl").visible = false;
        this.cardTips.getChild("qxtg").visible = false;
    }

    onS2CDouSetTrusteeship(data:pb.S2CDouSetTrusteeship){
        this.setDouSetTrusteeship(data.pos,data.enable);
    }

    setDouSetTrusteeship(pos:number,enable:boolean){
        let cid = this.DdzData().ToLoaclPos(pos);
        this.DdzData().douPlayerInfo[cid].isTrusteeship = enable;
        if(cid == 0){
            this.cardTips.visible = enable;
            if(enable){
                this.showTrust();
            }
        }else{
            this.heads[cid].getChild("tg").visible = enable;
        }
    }

    onS2CDouMultiple(data:pb.S2CDouMultiple){
        Log.d("onS2CDouMultiple:",data);
        this.setTopMultiple(data.multiple);
    }

    setTopMultiple(mult:number){
        this.textRate.text = "倍数x"+mult;
    }

    onClickRule(){
        Manager.uiManager.openFairy({ type: DDZRuleView, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.UI, name: "斗地主规则界面" });
    }
    onClickTrust(){
        this.logic.douSetTrusteeship(true);
    }

    randCard():number{
        return 1000+Manager.utils.rand(1,15)*10+Manager.utils.rand(1,4);
    }

    randCardData(cardCom:fgui.GComponent,dz:boolean){
        // for (let index = 0; index < 100; index++) {
        //     Log.e(Manager.utils.rand(1,3));
            
        // }
        this.setCardData(cardCom,Manager.utils.rand(1,15),Manager.utils.rand(1,4),dz)
    }

    setCardList(cardCom:fgui.GComponent,visible:boolean,color:cc.Color=cc.Color.WHITE){
        let item = cardCom.getChild("item").asCom;
        let light = item.getChild("light").asMovieClip;
        light.visible = visible;
        // light.color = color;
    }

    setCardData(cardCom:fgui.GComponent,cardValue:number,cardType:number,dz:boolean,cp:boolean=false){
        if (cardType < 1 || cardType > 5 || cardValue < 3 || cardValue > 17){
            Log.e("setCardData err:",cardValue,cardType);
            return;
        }
        // Log.d("setCardData:",cardValue,cardType);
        let item = cardCom.getChild("item").asCom;
        item.getChild("dz").visible = dz;
        item.getChild("cp").visible = cp;
        item.getChild("light").visible = false;
        if (cardType != CardType.GUI) {
            let _num = "ddz_hong_";
            if (cardType==CardType.HEI || cardType==CardType.MEI){
                _num = "ddz_hei_";
            }
            _num = _num + cardValue;
            item.getChild("gloader").visible = false;
            item.getChild("cc").visible = true;
            item.getChild("cs").visible = true;
            item.getChild("cv").visible = true;
            let curl = fgui.UIPackage.getItemURL(DdzView.getViewPath().pkgName,"ddz_cl_"+cardType);
            item.getChild("cc").icon = curl;
            item.getChild("cs").icon = curl;
            item.getChild("cv").icon = fgui.UIPackage.getItemURL(DdzView.getViewPath().pkgName,_num);
        }else{
            item.getChild("gloader").visible = true;
            item.getChild("cc").visible = false;
            item.getChild("cv").visible = false;
            item.getChild("cs").visible = false;
            item.getChild("gloader").icon = fgui.UIPackage.getItemURL(DdzView.getViewPath().pkgName,"ddz_"+cardValue);
        }
    }

    playSendCardAction(){
        for (let index = 0; index < 51; index++) {
            fgui.GTween.delayedCall(index*0.01).setTarget(this).onComplete(function(){
                let card = this.sendCards.pop();
                let index = this.getSendIndex();
                card.data = index;
                let pos = this.getSendPos();
                card.scaleX = 1;
                card.scaleY = 1;
                fgui.GTween.to2(card.x, card.y, pos.x, pos.y, 0.1)
                    .setTarget(card, card.setPosition)
                    .setEase(fgui.EaseType.CircOut)
                    .onComplete(this.moveComplete,this);
                let sc = this.getSendScale();
                fgui.GTween.to2(card.scaleX, card.scaleY, sc.x, sc.y, 0.5)
                .setTarget(card, card.setScale)
                .setEase(fgui.EaseType.CircOut);
                this.sendIndex+=1;
            }, this);
        }
        fgui.GTween.delayedCall(51*0.01+0.1).setTarget(this).onComplete(function(){
            this.playMoveDipaiAction();
        },this);
    }

    playMoveDipaiAction(){
        Log.d("playMoveDipaiAction:",this.sendCards.length);
        this.root.getChild("di").visible = false;
        for (let i = 0; i < 3; i++) {
            let card = this.sendCards.pop();
            let di = this.root.getChild("d"+i).asCom;
            di.x = this.posDI[i].x;
            di.y = this.posDI[i].y;
            di.scaleX = 1;
            di.scaleY = 1;
            di.visible = true;
            let item = di.getChild("item").asCom;
            this.setItemBack(item,true);
            card.scaleX = 1;
            card.scaleY = 1;
            card.data = di;
            fgui.GTween.to2(card.x, card.y, di.x, di.y, 1)
                .setTarget(card, card.setPosition)
                .setEase(fgui.EaseType.CircOut).onComplete(()=>{
                    card.visible = false;
                    this.root.getChild("di").visible = true;
                });
        }
        fgui.GTween.delayedCall(1).setTarget(this).onComplete(()=>{
            this.kdbBtn.visible = true;
        });
        this.isSendCardEnd = true;
    }

    moveComplete(gt:fgui.GTweener){
        let index = gt.target.data;
        if (index >=0 && index< this.playerCount){
            // Log.d("moveComplete",index);
            if (index==0){
                gt.target.visible = false;
                this.cards.addCard();
                this.DdzData().PlaySendCard();
            }else{
                this.leftCards[index].visible = true;
                this.leftCards[index].getChild("left").data = this.leftCards[index].getChild("left").data+1;
                this.leftCards[index].getChild("left").text = this.leftCards[index].getChild("left").data;
                gt.target.visible = false;
            }
        }else{
            Log.e("moveComplete err",gt,index);
        }
    }

    getSendPos():cc.Vec2{
        let index = this.sendIndex % this.playerCount;
        if (index==0){
            let pos = this.cards.curPosition();
            // Log.d(pos.x);
            return pos;
        }else{
            return cc.v2(this.leftCards[index].x,this.leftCards[index].y);
        }
        return cc.Vec2.ZERO;
    }

    getSendScale():cc.Vec2{
        let index = this.sendIndex % this.playerCount;
        if (index==0){
            return cc.v2(1,1);
        }else{
            return cc.v2(0.4,0.4);
        }
        return cc.Vec2.ZERO;
    }

    getSendIndex():number{
        let index = this.sendIndex % this.playerCount;
        return index;
    }

    protected addEvents() {
        this.addEvent(GameEvent.RefreshGameTable,this.onRefreshGameTable);
        this.addEvent(GameEvent.DDZ_Match_SUCC,this.onNextMatch);
        this.addEvent("ClickTuoGuan", this.onClickTrust);
        this.addEvent("ClickWanFa", this.onClickRule);
        this.addEvent(GameEvent.EnterBundle, this.enterBundle);
        this.addEvent("propUseCommon",this.onUseProp);
        this.addEvent(ProtoDef.pb.S2CBuyShopItem, this.onBuyShopItem);
        this.addEvent(ProtoDef.pb.S2CExitTable, this.onS2CExitTable);
        this.addEvent(ProtoDef.pb.S2CDouTableInfo, this.onS2CDouTableInfo);

    }


    private isCp(c:number,lc:number):boolean{
        let cp = this.cpData[lc];
        // Log.d("iscp 11:",c,cp);
        if(cp == null){
            return false;
        }
        if(cp.length == 0){
            return false;
        }
        // Log.d("iscp:",c,cp);
        for (let index = 0; index < cp.length; index++) {
            if(c == cp[index]){
                // Log.d("iscp:",c == cp[index]);
                return true;
            }
            
        }
        return false;
    }

    outCard(lc:number,cards:number[],isAct=true,isSort=true){
        if (cards.length == 0){
            Log.e("outCard 0");
            return;
        }
        let list = this.outcards[lc];
        if(list == null){
            return;
        }
        list.removeChildrenToPool();
        list.visible = true;

        if (isSort){
            let dd = Manager.dataCenter.get(DdzData);
            cards = dd.reSort(cards);
        }

        for (let index = 0; index < cards.length; index++) {
            let cardValue = cards[index] % 1000;
            let cardType = cardValue % 10;
            cardValue = Math.floor(cardValue / 10);
            let com = list.addItemFromPool().asCom;
            let item = com.getChild("item").asCom;
            this.setCardData(com,cardValue,cardType,this.dizhuIndex == lc,this.isCp(cards[index],lc));
            item.getChild("back").visible = false;
            item.getChild("mask").visible = false;
            com.visible = true;
        }
        list.visible = true;
        if(!isAct){
            return;
        }
        if (cards.length >=5){
            for (let index = 0; index < list._children.length; index++) {
                let com = list._children[index].asCom;
                com.visible = false;
                fgui.GTween.delayedCall(index*0.05).setTarget(com).onComplete(this.outCardComplete,this);
            }
        }else{
            let s = this.root.getTransition("s"+lc);
            s.play();
        }
    }

    outCardComplete(gt:fgui.GTweener){
        gt.target.visible = true;
        let t = gt.target.getTransition("t0");
        t.playReverse(); 
    }

    DdzData():DdzData{
        return Manager.dataCenter.get(DdzData);
    }

    clearTable(){
        this.root.getChild("cp1").asList.removeChildrenToPool();
        this.root.getChild("cp2").asList.removeChildrenToPool();
        this.root.getChild("cpt1").visible = false;
        this.root.getChild("cpt2").visible = false;
        this.DdzData().zdEft.visible;
        this.cpData = {};
        this.isSendCardEnd = false;
        this.isWaitKdp = false;
        this.isWaitBuy = false;
        this.isWaitJpq = false;
        this.outandhandcard = [];
        this.topType = "";
        this.jpqUI1.text = "";
        this.jpqUI2.text = "";
        this.cardDi = [];
        this.kdbBtn.visible = false;
        this.root.getChild("di").visible = false;
        for (let index = 0; index < this.playerCount; index++) {
            this.root.getChild("oc"+(index+1)).visible = false;
            this.root.getChild("oc"+(index+1)).visible = false;
            this.root.getChild("oc"+(index+1)).visible = false;
            this.heads[index].getChild("score").visible = false;
            this.heads[index].getChild("jb").visible = false;
            this.heads[index].getChild("cjjb").visible = false;
        }
        for (let index = 0; index < this.outcards.length; index++) {
            let list = this.outcards[index];
            list.removeChildrenToPool();
            let com = this.root.getChild("t"+(index+1)).asCom;
            this.hideTip(com,false);
        }
        this.sendCards = [];
        for(let i=0;i<54;i++){
            let sc = this.root.getChild("send"+i).asCom;
            fgui.GTween.kill(sc,false);
            sc.x = this.cardX;
            sc.y = this.cardY;
            sc.visible = false;
            this.sendCards.push(sc);
        }

        if(this.posDI.length > 0){
            for (let index = 0; index < this.posDI.length; index++) {
                let d = this.root.getChild("d"+index);
                d.x = this.posDI[index].x;
                d.y = this.posDI[index].y;
                this.leftCards[index].getChild("left").data = 0;

                let com = this.top.getChild("c"+index).asCom;
                let item = com.getChild("item").asCom;
                this.setItemBack(item,true);
            }
        }
        this.topType = "";
        this.showTopMul();
        this.cards.clearCard();
    }

    //ui clock
    setCountdown(){
        this.curClockText.data.interval = this.curClockText.data.interval - 1;
        // Log.e("this.curClockText.data",this.curClockText.data);
        if (this.curClockText.data.interval < 0){
            if (this.curClockText.data.c != null){
                this.curClockText.data.c.selectedIndex = 0;
            }
            this.stopCountdown();
            return;
        }
        if(this.curClockText.parent.parent.visible == false){
            this.stopCountdown();
            return;
        }
        if(this.curClockText.data.interval <= 4){
            let ts = this.curClockText.parent.parent.getTransition("t0");
            this.DdzData().PlayDJS();
            ts.play();
        }

        let str = this.curClockText.data.interval + "";
        if(str.length == 1){
            this.curClockText.x = 18;
        }else{
            this.curClockText.x = 16;
        }
        this.curClockText.text = this.curClockText.data.interval;
    }

    stopCountdown(){
        cc.director.getScheduler().unscheduleAllForTarget(this);
    }

    runCountdown(){
        this.stopCountdown();
        cc.director.getScheduler().schedule(this.setCountdown,this,1);
    }
    //uilogic
    onS2CDouCurChooseLandlord(data:pb.S2CDouCurChooseLandlord){
        this.setLand(data.pos,data.interval,data.double);
    }

    setLand(pos:number,interval:number,double:number){
        RoomManager.SetZhaungPos(pos);
        this.op.selectedPage = "mpks";
        if (this.curClockText != null && this.curClockText.data != null){
            this.curClockText.data.c.selectedIndex = 0;
        }
        if(pos == this.DdzData().meNSeat){
            let rob = this.root.getChild("rob").asCom;
            let com = rob.getChild("c").asCom;
            this.curClockText = com.getChild("CC").asCom.getChild("time");
            this.op.selectedPage = rob.name;
            this.curClockText.data = {};
            this.curClockText.data.c = this.op;
            if(double == 0){
                // rob.getChild("btn_rob").icon = fgui.UIPackage.getItemURL(DdzView.getViewPath().pkgName,"btn_jiaodizhu");
                // rob.getChild("btn_rob_n").icon = fgui.UIPackage.getItemURL(DdzView.getViewPath().pkgName,"btn_tips");
                rob.getChild("btn_rob").text = "叫地主";
                rob.getChild("btn_rob_n").text = "不叫";
            }else{
                // rob.getChild("btn_rob").icon = fgui.UIPackage.getItemURL(DdzView.getViewPath().pkgName,"btn_qdz");
                // rob.getChild("btn_rob_n").icon = fgui.UIPackage.getItemURL(DdzView.getViewPath().pkgName,"btn_buqiang");
                rob.getChild("btn_rob").text = "抢地主";
                rob.getChild("btn_rob_n").text = "不抢";
            }
        }else{
            let cid = this.DdzData().ToLoaclPos(pos);
            Log.d("cid:",cid,pos);
            this.curClockText = this.root.getChild("c"+(cid+1)).asCom.getChild("CC").asCom.getChild("time");
            this.clocks.selectedIndex = cid;
            this.curClockText.data = {};
            this.curClockText.data.c = this.clocks;
        }
        this.curClockText.data.interval = interval;
        this.curClockText.text = interval.toString();
        this.runCountdown();   
    }

    onS2CDouChooseLandlord(data:pb.S2CDouChooseLandlord){
        this.op.selectedPage = "mpks";
        this.stopCountdown();
        let cid = this.DdzData().ToLoaclPos(data.pos);
        if(this.robStart < 0){
            this.robStart = cid;
        }
        let com = this.root.getChild("t"+(cid+1)).asCom;
        com.visible = true;
        let content = com.getChild("n0").asCom;
        let tips = content.getController("SC");
        com.getTransition("default").play();
        if (data.double == 0){
            tips.selectedPage = "不叫";
            this.DdzData().PlayBj(cid);
        }else{
            if(data.choose){
                if(data.double == 1){
                    tips.selectedPage = "叫地主";
                    this.DdzData().PlayJdz(cid);
                }else{
                    tips.selectedPage = "抢地主";
                    this.DdzData().PlayQdz(cid,this.robStart == cid);
                }
            }else{
                tips.selectedPage = "不抢";
                this.DdzData().PlayBq(cid);
            }
        }
    }

    onS2CDouAddCards(data:pb.S2CDouAddCards){
        this.updatejpqLeftTime();
        for (let index = 0; index < this.outcards.length; index++) {
            let list = this.outcards[index];
            list.removeChildrenToPool();
        }
        this.cards.setServerCard(data.cards);
        for (let index = 0; index < this.sendCards.length; index++) {
            this.sendCards[index].visible = true;
            this.sendCards[index].x = this.cardX;
            this.sendCards[index].y = this.cardY;
        }
        this.sendIndex = 0;
        this.playSendCardAction();
    }

    onS2CDouSetLandlord(data:pb.S2CDouSetLandlord){
        // this.stopCountdown();this.outandhandcard 
        this.kdbBtn.visible = false;
        let cid = this.DdzData().ToLoaclPos(data.pos);
        if (cid == 0){
            this.cards.setServerCard(data.cards);
            this.isFristOutCard = true;
        }
        this.dizhuIndex = cid;
        this.heads[cid].getChild("dz").visible = true;
        this.cardDi = data.cards;
        let dd = Manager.dataCenter.get(DdzData);
        // Log.d(this.root);

        for (let index = 0; index < 54; index++) {
            this.root.getChild("send"+index).visible = false;
        }

        this.root.getChild("di").visible = true;
        if(cid == 0){
            this.cards.showDz();
        }
        
        for (let index = 0; index < data.cards.length; index++) {
            let c = dd.cardMap[data.cards[index]];
            let com = this.root.getChild("d"+index).asCom;
            com.data = c;
            this.setPlayFlip(com,index);
            let topCom = this.top.getChild("c"+index).asCom;
            topCom.data = c;
            this.setTopPlayFlip(topCom,index);
        }
        this.setTopMul(data.cards);
        this.kdbBtn.visible = false;
    }

    setTopPlayFlip(com:fgui.GComponent,index:number){
        com.visible = true;
        let dd = Manager.dataCenter.get(DdzData);
        let cardTV = dd.Card(com.data);
        this.setCardData(com,cardTV.v,cardTV.t,false);
        let t2 = com.getTransition("t2");
        let item = com.getChild("item").asCom;
        t2.setHook("flip",function () {
            this.cards.setItemBack(item,false);
            this.showTopMul();
        }.bind(this));
        t2.play();
    }

    setTopMul(netCard:number[]){
        this.topType = "";
        if(netCard.length == 3){
            let lc = this.DdzData().ToLocalCard(netCard);
            Log.e("setTopMul",netCard,lc);
            if(lc[2] == this.DdzData().cardMap[54] && lc[1] == this.DdzData().cardMap[53]){
                this.topType = "ui_ddz_text_sw";
                return;
            }
            if(this.DdzData().Card(lc[2]).v == this.DdzData().Card(lc[1]).v && this.DdzData().Card(lc[2]).v == this.DdzData().Card(lc[0]).v){
                this.topType = "ui_ddz_text_st";
                return;
            }
            if(lc[2]-lc[0]==2){
                this.topType = "ui_ddz_text_ths";
                return;
            }
            if(this.DdzData().Card(lc[2]).t == this.DdzData().Card(lc[1]).t && this.DdzData().Card(lc[2]).t == this.DdzData().Card(lc[0]).t){
                this.topType = "ui_ddz_text_th";
                return;
            }

            if(this.DdzData().Card(lc[2]).v - this.DdzData().Card(lc[1]).v == 1 && this.DdzData().Card(lc[1]).v - this.DdzData().Card(lc[0]).v == 1){
                this.topType = "ui_ddz_text_sz";
                return;
            }
            if(lc[2] == this.DdzData().cardMap[54]){
                this.topType = "ui_ddz_text_dw";
                return;
            }
            if(this.DdzData().Card(lc[2]).v == this.DdzData().Card(lc[1]).v || this.DdzData().Card(lc[2]).v == this.DdzData().Card(lc[0]).v || this.DdzData().Card(lc[1]).v == this.DdzData().Card(lc[0]).v){
                this.topType = "ui_ddz_text_dz";
                return;
            }
        }else{
            Log.e("底牌长度不对：",netCard.length);
        }
    }

    showTopMul(){
        if(this.topType.length == 0){
            this.topLoader.visible = false;
            return;
        }
        this.topLoader.visible = true;
        this.topLoader.icon = fgui.UIPackage.getItemURL(DdzView.getViewPath().pkgName,this.topType);
    }

    setTopPlayNoFlip(com:fgui.GComponent,index:number){
        com.visible = true;
        let dd = Manager.dataCenter.get(DdzData);
        let cardTV = dd.Card(com.data);
        this.setCardData(com,cardTV.v,cardTV.t,false);
        let item = com.getChild("item").asCom;
        this.cards.setItemBack(item,false);
    }


    setPlayFlip(com:fgui.GComponent,index:number,isMove = true){
        com.visible = true;
        let dd = Manager.dataCenter.get(DdzData);
        let cardTV = dd.Card(com.data);
        // Log.d("setPlayFlip:",com,cardTV,index,isMove);
        this.setCardData(com,cardTV.v,cardTV.t,false);
        let transName = "t3";
        let item = com.getChild("item").asCom;
        if(!item.getChild("back").visible){
            transName = "t4";
        }
        let t2 = com.getTransition(transName);

        t2.setHook("flip",function () {
            this.setItemBack(item,false);
        }.bind(this));
        if(isMove){
            if (this.dizhuIndex != 0){
                let ts = this.leftCards[this.dizhuIndex];
                t2.play(function(){
                        fgui.GTween.to2(com.scaleX,com.scaleY,ts.scaleX,ts.scaleY,0.2).setTarget(com,com.setScale);
                        fgui.GTween.to2(com.x,com.y,ts.x,ts.y,0.3).setTarget(com,com.setPosition).onComplete(function(){
                            com.visible = false;
                            if (index==0){
                                ts.getChild("left").data = 20;
                                ts.getChild("left").text = ts.getChild("left").data+"";
                                this.updateCdList(this.dizhuIndex);
                            }
                        },this);
                }.bind(this));
            }else{
                let curPosition = this.cards.curPosition();
                fgui.GTween.to2(com.x,com.y,curPosition.x,curPosition.y,0.3).setTarget(com,com.setPosition).onComplete(function(){
                    com.visible = false;
                    this.cards.addCard();
                },this);
            }
        }else{
            t2.play();
        }
    }


    onClickRob(){
        this.logic.douChooseLandlord(true);
    }

    onClickNoRob(){
        this.logic.douChooseLandlord(false);
    }

    onS2CDouDoubleStart(data:pb.S2CDouDoubleStart){
        this.setDoubleStart(data.interval);
    }

    setDoubleStart(interval:number){
        this.clocks.selectedIndex = 0;
        this.op.selectedPage = "ratio"; 
        let ratio = this.root.getChild("ratio").asCom;
        let com = ratio.getChild("c").asCom;
        this.curClockText = com.getChild("CC").asCom.getChild("time");
        this.curClockText.data = {};    
        this.curClockText.data.interval = interval;
        this.curClockText.text = interval.toString();
        this.runCountdown();
    }

    onClickRatio(){
        this.logic.douDouble(DouDoubleType.DouDouble_Double);
    }

    onBuyShopItem(){
        Log.d("onBuyShopItem:",this.isWaitBuy);
        if(this.isWaitBuy){
            this.isWaitBuy = false;
            this.onClickSRatio();
        }
        if(this.isWaitJpq){
            this.isWaitJpq = false;
            this.logic.autoDouUseRecorder();
        }
        if(this.isWaitKdp){
            this.isWaitKdp = false;
            this.logic.C2SDouSeeFinal();
            this.roomView.hideBag();
        }
    }

    onS2CExitTable(data:pb.S2CExitTable){
        if(data.guid == Manager.gd.player().guid){
            return;
        }
        let pos = this.DdzData().Guid2lPosMap[data.guid];
        this.clearPlayer(data.guid);
        if(pos != null && pos < this.playerCount){
            let com = this.root.getChild("t"+(pos+1)).asCom;
            if(com != null){
                com.visible = false;
            }
        }
        let obend = this.root.getChild("obend").asCom;
        obend.visible = true;
        if(this.DdzData().douPlayerInfo[0].isReady){
            obend.getChild("btn_invaite").visible = true;
            obend.getChild("btn_next").visible = false;
            obend.getChild("btn_back").visible = false;
        }else{
            obend.getChild("btn_invaite").visible = false;
            obend.getChild("btn_next").visible = true;
            obend.getChild("btn_back").visible = true;
        }
    }

    onS2CDouTableInfo(data:pb.S2CDouTableInfo){
        Log.d("onS2CDouTableInfo:",data);
        this.DdzData().initData();
        this.roomPlayer.n2lPosMap = this.DdzData().Guid2lPosMap;
        this.initPlayers();
    }

    
    onS2CDouReady(data:pb.S2CDouReady){
        let tbInfo = Manager.gd.get<pb.S2CDouTableInfo>(ProtoDef.pb.S2CDouTableInfo);
        if(tbInfo == null){
            return;
        }
        if(!tbInfo.tableBase.inviteable){
            return;
        }

        let lpos = this.DdzData().ToLoaclPos(data.pos);
        if(lpos == 0){
            let bc = this.root.getChild("bc").asCom;
            bc.visible = false;
            let obend = this.root.getChild("obend").asCom;
            if(obend.visible){
                if(this.DdzData().HaveNullSit()){
                    obend.getChild("btn_invaite").visible = true;
                }
                obend.getChild("btn_next").visible = false;
                obend.getChild("btn_back").visible = false;
            }
        }
        this.DdzData().douPlayerInfo[lpos].isReady = true;

        let com = this.root.getChild("t"+(lpos+1)).asCom;
        if(com == null){
            return;
        }
        com.visible = true;
        let content = com.getChild("n0").asCom;
        let tips = content.getController("SC");
        tips.selectedPage = "准备";
        com.getTransition("buchu").play();
    }

    onClickSRatio(){
        if(Manager.utils.HaveDaoJuItemDdzCJJB()){
            this.logic.douDouble(DouDoubleType.DouDouble_Super);
        }else{
            this.isWaitKdp = false;
            this.isWaitBuy = this.roomView.backUseDdzCjjb();
            // let tempData ={propID:Number,shopId:Number,price:Number,currentType:Number}
            // tempData.propID = obj.data.itemType
            // tempData.shopId = obj.data.id
            // tempData.price = obj.data.price
            // tempData.currentType = obj.data.ct
            // Manager.gd.put("PropBuyData",tempData);
            // Manager.uiManager.openFairy({ type: PropBuy, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.Reward, name: "道具购买" });
        }
    }

    onClickNRatio(){
        this.logic.douDouble(DouDoubleType.DouDouble_None);
    }

    onS2CDouDouble(data:pb.S2CDouDouble){
        // this.stopCountdown();
        let cid = this.DdzData().ToLoaclPos(data.pos);
        Log.d("onS2CDouDouble:",this.DdzData().meNSeat,data.pos,cid);
        if(cid == 0){
            Log.d("隐藏加倍面板");
            this.op.selectedIndex = 0;
            this.wait.visible = true;
            this.stopCountdown();
        }
        let com = this.root.getChild("t"+(cid+1)).asCom;
        com.visible = true;
        let content = com.getChild("n0").asCom;
        // Log.d(content);
        let tips = content.getController("SC");
        com.getTransition("default").play();
        if (data.type == DouDoubleType.DouDouble_None){
            tips.selectedPage = "不加倍";
            this.DdzData().PlayBJB(cid);
        }else if(data.type == DouDoubleType.DouDouble_Double){
            tips.selectedPage = "加倍";
            this.DdzData().PlayJB(cid);
            this.heads[cid].getChild("jb").visible = true;
        }else if(data.type == DouDoubleType.DouDouble_Super){
            tips.selectedPage = "超级加倍";
            this.heads[cid].getChild("cjjb").visible = true;
            this.DdzData().PlayCJJB(cid);
        }else{
            Log.e("onS2CDouDouble err",data);
        }
        // Log.e("onS2CDouDouble:",tips.selectedPage);
    }

    setDouDouble(pos:number,type:number){
        let cid = this.DdzData().ToLoaclPos(pos);
        let com = this.root.getChild("t"+(cid+1)).asCom;
        com.visible = true;
        let content = com.getChild("n0").asCom;
        // Log.d(content);
        let tips = content.getController("SC");
        com.getTransition("default").play();
        if (type == DouDoubleType.DouDouble_None){
            tips.selectedPage = "不加倍";
            this.DdzData().PlayBJB(cid);
        }else if(type == DouDoubleType.DouDouble_Double){
            tips.selectedPage = "加倍";
            this.DdzData().PlayJB(cid);
            this.heads[cid].getChild("jb").visible = true;
        }else if(type == DouDoubleType.DouDouble_Super){
            tips.selectedPage = "超级加倍";
            this.heads[cid].getChild("cjjb").visible = true;
        }else{
            Log.e("setDouDouble err",type);
        }
    }

    setDouDoubleNotips(pos:number,type:number){
        let cid = this.DdzData().ToLoaclPos(pos);
        if (type == DouDoubleType.DouDouble_None){

        }else if(type == DouDoubleType.DouDouble_Double){
            this.heads[cid].getChild("jb").visible = true;
        }else if(type == DouDoubleType.DouDouble_Super){
        }else{
            Log.e("setDouDouble err",type);
        }
    }
    onS2CDouPlayPos(data:pb.S2CDouPlayPos){
        this.setDouPlayPos(data.pos,data.interval,data.first,data.group);
    }

    clearLastOutCard(cid:number,isFrist:boolean = false){
        let list = this.outcards[cid];
        list.removeChildrenToPool();
        let com = this.root.getChild("t"+(cid+1)).asCom;
        this.hideTip(com,isFrist);
    }

    private hideTip(com:fgui.GComponent,isFrist:boolean = false){   

        let hideCom = function(){
            com.visible = false;
            let n0 = com.getChild("n0");
            n0.scaleX = 0;
            n0.scaleY = 0;
        }

        if(isFrist){
            fgui.GTween.delayedCall(0.8).setTarget(this).onComplete(()=>{
                hideCom();
            });
        }else{
            hideCom();
        }

    }

    setDouPlayPos(pos:number,interval:number,first:boolean,group: pb.IDouCardGroup){
        this.stopCountdown();
        let cid = this.DdzData().ToLoaclPos(pos);
        this.wait.visible = false;
        if (this.curClockText != null && this.curClockText.data != null){
            if (this.curClockText.data.c != null){
                this.curClockText.data.c.selectedIndex = 0;
            }
        }
        this.isFrist = first;
        if(first){
            for (let index = 0; index < this.outcards.length; index++) {
                this.outcards[index].removeChildrenToPool();
                let com = this.root.getChild("t"+(index+1)).asCom;
                this.hideTip(com,first);
            }
            this.lastCard = null;
        } 

        this.clearLastOutCard(cid,first);

        if(cid == 0){
            if(this.DdzData().douPlayerInfo[cid].isTrusteeship){
                return;
            }

            this.op.selectedPage = "obg"; 
            let obg = this.root.getChild("obg").asCom;
            obg.getChild("buchu").text = "不出";

            obg.getChild("tishi").visible = true;
            obg.getChild("chupai").visible = true;
            if(this.isFrist){
                // this.isFristOutCard = false;
                obg.getChild("chupai").x = 467;
                obg.getChild("tishi").x = 126;
                obg.getChild("c").x = 360; 
                obg.getChild("buchu").visible = false; 
            }else{
                obg.getChild("chupai").x = 594;
                obg.getChild("tishi").x = 346;
                obg.getChild("buchu").x = 13; 
                obg.getChild("c").x = 242; 
                for (let index = 0; index < obg._children.length; index++) {
                    obg._children[index].visible = true;
                }
            }
            let com = obg.getChild("c").asCom;
            this.curClockText = com.getChild("CC").asCom.getChild("time");
            this.curClockText.data = {};   
            this.curClockText.data.c = this.op;

            if(group == null){
                Manager.tips.debug("自己出牌是group=null,数据错误");
                return;
            }

            this.cards.isGroup = false;
            if(this.isFrist){
                // this.cards.groupCard();
                this.cards.setServerGroup(group);
            }else{
                if(this.lastCard != null){
                    this.cards.setBeServerGroup(this.lastCard,group);
                    let card = this.cards.getGroupCardCount();
                    if(card == 0){
                        Log.d("没有大过上家的牌");
                        obg.getChild("tishi").visible = false;
                        obg.getChild("chupai").visible = false;
                        obg.getChild("buchu").x = 346; 
                        obg.getChild("buchu").text = "要不起";
                        this.cards.onClickLucency();
                        this.showAnirgama();
                        // return;
                    }
                }
            }

        }else{
            this.hideAnirgama();
            this.clocks.selectedIndex = cid;
            let com = this.root.getChild("c" + (cid+1)).asCom;
            this.curClockText = com.getChild("CC").asCom.getChild("time");
            this.curClockText.data = {};  
            this.curClockText.data.c = this.clocks;
        }
        this.curClockText.data.interval = interval;
        this.curClockText.text = interval.toString();
        this.runCountdown();
    }

    onS2CDouPlayCards(data:pb.S2CDouPlayCards){
        let cid = this.DdzData().ToLoaclPos(data.pos);
        if (data.ec != 1){
            Manager.tips.show("斗地主出牌失败["+data.ec+"]");
            if(cid ==0){
                this.cards.onClickLucency();
            }
            return;
        }
        if(this.jpqLeftTime > 0){
            let jpcc = this.top.getController("jpqc");
            if(jpcc.selectedIndex != 0){
                jpcc.selectedIndex = 0;
            }   
        }

        this.op.selectedPage = "mpks";
        let com = this.root.getChild("t"+(cid+1)).asCom;
        com.visible = true;

        if (data.cardType == DouCardType.DouCardType_Null){
            let content = com.getChild("n0").asCom;
            let tips = content.getController("SC");
            tips.selectedPage = "不出";
            this.DdzData().PlayPass(cid);
            com.getTransition("buchu").play();
            if(cid ==0){
                this.cards.onClickLucency();
            }
            return;
        }
        let ts = this.leftCards[cid];
        ts.getChild("left").data = data.leftCount;
        ts.getChild("left").text = data.leftCount+"";
        if(data.leftCount >0 && data.leftCount < 3){
            this.jb[cid].visible = true;
            let ts = this.jb[cid].getTransition("t0");
            if(!ts.playing){
                ts.play(null,-1);
            }
            this.DdzData().PlayBD(cid,data.leftCount);
        }

        let list = this.root.getChild("oc"+(cid+1)).asList;
        list.removeChildrenToPool();
        list.visible = true;
        let localCard:number[] = [];
        let text = "";
        let dd = Manager.dataCenter.get(DdzData);
        for (let index = 0; index < data.cards.length; index++) {
            let lc = dd.cardMap[data.cards[index]];
            localCard.push(dd.cardMap[data.cards[index]]);
            let lcc = dd.Card(lc);
            let lccs = dd.CardValueStr(lcc.v);
            text = text + lccs;
        }
        this.outCard(cid,localCard);
        this.checkCdData(cid,localCard);
        if(cid == 0){
            this.cards.outCard(data.cards);
        }else{
            this.updateJpq(localCard);
            this.lastCard = data;
            Log.d("text:",text);
            if(cid==1){
                this.jpqUI1.text = this.jpqUI1.text + text + " ";
            }else{
                this.jpqUI2.text = this.jpqUI2.text + text + " ";
            }
        }
        this.DdzData().zdSx = this.heads[cid].x + 60;
        this.DdzData().zdSy = this.heads[cid].y + 100;
        this.DdzData().PlayCard(cid,localCard,data.cardType);
    }

    onClickBuchu(){
        Log.d("onClickBuchu");
        let bc:number[] = [];
        this.logic.douPlayCards(bc);
    }

    onClickTishi(){
        let card = this.cards.getGroupCard();
        if(card == null || card.length == 0){
            Log.d("没有大过上家的牌");
            return;
        }
        this.cards.upCard(card);
    }

    onClickChupai(){
        Log.d("onClickChupai");
        let oc = this.cards.getSelectCard();
        if (oc.length<=0){
            Manager.tips.show("请选择要出的牌");
            return;
        }
        this.logic.douPlayCards(oc);
    }

    onS2CTablePlayer(data:pb.S2CTablePlayer){
        let cid = this.DdzData().ToLoaclPos(data.player.pos);
        this.heads[cid].getChild("coin").text = Manager.utils.formatCoin(data.player.score);
    }

    setBalanceCard(cards:number[],list:fgui.GList){
        if (cards.length == 0){
            Log.e("outCard 0");
            return;
        }
        list.removeChildrenToPool();
        list.visible = true;
        for (let index = 0; index < cards.length; index++) {
            let cardValue = cards[index] % 1000;
            let cardType = cardValue % 10;
            cardValue = Math.floor(cardValue / 10);
            let com = list.addItemFromPool().asCom;
            let item = com.getChild("item").asCom;
            this.setCardData(com,cardValue,cardType,this.dizhuIndex == 0);
            item.getChild("back").visible = false;
            item.getChild("mask").visible = false;
            com.visible = true;
        }
        list.visible = true;
    }

    onS2CDouSettlement(data:pb.S2CDouSettlement){

        this.root.getChild("cp1").asList.removeChildrenToPool();
        this.root.getChild("cp2").asList.removeChildrenToPool();
        this.root.getChild("cpt1").visible = false;
        this.root.getChild("cpt2").visible = false;

        let obend = this.root.getChild("obend").asCom;
        obend.getChild("btn_next").text = "下一局";

        obend.getChild("btn_invaite").visible = false;
        obend.getChild("btn_next").visible = true;
        obend.getChild("btn_back").visible = true;

        let bc = this.root.getChild("bc").asCom;
        let ct = bc.getChild("ct").asCom;
        let tbInfo = Manager.gd.get<pb.S2CDouTableInfo>(ProtoDef.pb.S2CDouTableInfo);
        let dataTab =  Manager.dataCenter.get(GameData).get<pb.S2CGetTables >(ProtoDef.pb.S2CGetTables);
        let tablecfgId = tbInfo.tableBase.tablecfgId;
        let inviteable = tbInfo.tableBase.inviteable;
        Log.e("房间列表信息没有找到 tablecfgId  :  ",tablecfgId);
        Log.e("房间列表信息没有找到 dataTab  :  ",dataTab);
        ct.getChild("inviteBtn").visible = false;
        if(dataTab != null){
            for (let i = 0; i < dataTab.tables.length; i++) 
            {
                for (let c = 0; c < dataTab.tables[i].items.length; c++) 
                {
                    let et = dataTab.tables[i].items[c]
                    if (et.cfgId== tablecfgId && et.inviteable && !inviteable )
                    {
                        ct.getChild("inviteBtn").visible = true
                    }
                }
            }
        }

        bc.visible = false;
        let blist = ct.getChild("list").asList;
        blist.defaultItem = this.outcards[0].defaultItem;
        this.clocks.selectedIndex = 0;
        let dd = Manager.dataCenter.get(DdzData);
        let dzurl = fgui.UIPackage.getItemURL(DdzView.getViewPath().pkgName,"icon_dizhu");
        this.heads[0].getChild("coin").text =  Manager.dataCenter.get(GameData).playerCurrenciesStr(CurrencyType.CT_Coin);

        for (let index = 0; index < data.settleInfo.length; index++) {
            let sell = data.settleInfo[index];
            let lpos = this.DdzData().ToLoaclPos(sell.pos);
            if(lpos==0){
                this.isWin = sell.expend > 0;
                this.SetActiveLookGGBtn(sell.expend!=0)

                this.DdzData().PlayEnd(this.isWin);
                if(this.isWin){
                    ct.getController("DdzBV").selectedIndex = 1;
                }else{
                    ct.getController("DdzBV").selectedIndex = 0;
                }
            }

            let txt = this.heads[lpos].getChild("score").asTextField;
            let bh = ct.getChild("h"+lpos).asCom;
            let wbg =  bh.getChild("wbg");
            let lbg =  bh.getChild("lbg");
            wbg.visible = false;
            lbg.visible = false;
            if(lpos!=0){
                if(sell.expend > 0){
                    wbg.visible = true;
                }else{
                    lbg.visible = true;
                }
            }
            let ctTxt = bh.getChild("scoreText").asTextField;
            if(sell.expend > 0){
                txt.font = fgui.UIPackage.getItemURL(Config.BUNDLE_GameCOMMON,"winScoreFont");
                txt.text = "+"+Manager.utils.formatCoin(sell.expend);
                // this.heads[lpos].getChild("score").asTextField.color = cc.Color.ORANGE;
            }else{
                // Log.d("sell.expend",sell.expend,Manager.utils.formatCoin(sell.expend));
                txt.font = fgui.UIPackage.getItemURL(Config.BUNDLE_GameCOMMON,"loseScoreFont");
                txt.text = Manager.utils.formatCoin(sell.expend);
                // this.heads[lpos].getChild("score").asTextField.color = cc.Color.RED;
            }
            ctTxt.text = txt.text;
            bh.getChild("dz").visible = false;
            if(this.dizhuIndex == lpos){
                bh.getChild("dz").icon = dzurl;
                bh.getChild("dz").visible = true;
            }
            if(lpos==0){
                ctTxt.font = txt.font;
            }else{
                let zt = bh.getChild("zuoweiText");
                if(zt != null){
                    if(this.dizhuIndex == lpos){
                        zt.text = "地主";
                    }else{
                        zt.text = "平民";
                    }
                }
            }
            if(sell.isPochan){
                bh.getChild("pochanFlag").visible = true;
            }else{
                bh.getChild("pochanFlag").visible = false;
            }

            this.heads[lpos].getTransition("t0").play();
            this.heads[lpos].getChild("score").visible = true;

            this.leftCards[lpos].visible = false;
            this.leftCards[lpos].getChild("left").data = 0;
            this.leftCards[lpos].getChild("left").text = this.leftCards[lpos].data;

            let localCard:number[] = [];
            for (let index = 0; index < sell.cards.length; index++) {
                localCard.push(dd.cardMap[sell.cards[index]]);
            }
            localCard.sort(function (A, B) {
                return B-A;
            })
            if(lpos != 0){
                this.outCard(lpos,localCard,false,false);
            }
            this.jb[lpos].visible = false;
            if(lpos==0){
                let localinitCard:number[] = [];
                for (let index = 0; index < sell.initCards.length; index++) {
                    localinitCard.push(dd.cardMap[sell.initCards[index]]);
                }
                localinitCard.sort(function (A, B) {
                    return B - A;
                })
                this.setBalanceCard(localinitCard,blist);
            }
        }


        let bar = ct.getChild("exp").asProgress;
        bar.visible = true;
        let gd = Manager.dataCenter.get(GameData);
        let gt = Manager.utils.gt(GameCat.GameCat_Dou);

        let score = gd.playerGV(GroupId.GI_SeasonScore,gt,0);
        let lv = gd.playerGV(GroupId.GI_SeasonDuanWei,gt,1);

        let need = score;


        let cfgLevel = lv;
        let dwData:pb.S2CGetSeasonDuanWeiCfg = Manager.dataCenter.get(GameData).get<pb.S2CGetSeasonDuanWeiCfg>(ProtoDef.pb.S2CGetSeasonDuanWeiCfg+"_"+gt);
        if (dwData != null){
            if(lv >= dwData.items.length){
                cfgLevel = dwData.items.length - 1;
            }
    
            let conf = dwData.items[cfgLevel];
            need = conf.needScore;
        }

        bar.min = 0;
        bar.max = need;
        bar.value = score;

        // let hz = ct.getChild("hz").asCom;
        // hz.getChild("tg").visible = false;
        // hz.getChild("tile").visible = false;
        // let iconId = Manager.utils.dwIcon(lv);
        // hz.getChild("n0").icon = fgui.UIPackage.getItemURL(Config.BUNDLE_HALL,"ui_rank_dw_di_"+iconId); 
        // let starCount = Math.floor(lv%5);
        // if(starCount == 0){
        //     starCount = 5;
        // }
        // Log.d("starCount:",starCount);

        // let stars = ct.getChild("star").asCom;
        // stars.visible = true;
        // for (let index = 0; index < stars._children.length; index++) {
        //     let star = stars.getChild("s"+index).asCom;
        //     if(index < starCount){
        //         star.getChild("star").visible = true;
        //     }else{
        //         star.getChild("star").visible = false;
        //     }
        // }
        let hz = ct.getChild("hz").asCom;
        let stars = ct.getChild("star").asCom;
        Manager.utils.setHz(hz,stars,lv,dwData);

        if(this.isWin){
            this.adaptiveBtns_com.getChild("Btn1").text = "双倍领取";
        }else{
            this.adaptiveBtns_com.getChild("Btn1").text = "看广告免输";
        }

        let dt = 3;
        if(data.springType != SpringType.SpringType_None){
            dt = 4;
            dd.PlaySpineCTResult(this.isWin);
        }else{
            dd.PlayResult(this.isWin);
        }


        fgui.GTween.delayedCall(dt).setTarget(this).onComplete(()=>{
            bc.visible = true;
            this.op.selectedPage = "next"; 
        });
        this.stopCountdown();
        this.cardTips.visible = false;
        this.isGameEnd = true;
        RoomManager.SetState(RoomManager.StateType.Resulting);
        this.roomView.hideBag();
        this.isSendCardEnd = false;
        this.SetMianShuYingFanbei();
    }

    SetActiveLookGGBtn(isShow:boolean)
    {
        this.adaptiveBtns_com.getChild("Btn1").visible =false;
        this.reFlashNextInvite_SC.ReFlash()
    }

    SetMianShuYingFanbei()
    {

        let cfg = Manager.gd.get<pb.S2CCfgs>(ProtoDef.pb.S2CCfgs);
        let mianShuTotal  = 0;
        let fanBeiTotal  = 0;
        let isShow=true;
        if(cfg != null){
            mianShuTotal = cfg.items[CfgType.CfgType_NoLoseTimes];  
            fanBeiTotal = cfg.items[CfgType.CfgType_WinMoreTimes];  
            let currentMianShuCount = Manager.gd.playerGV(GroupId.GI_Comm ,CommSubID.CommSubID_NoLoseTimes,0);
            let currentFanBeiCount = Manager.gd.playerGV(GroupId.GI_Comm ,CommSubID.CommSubID_WinMultipleTimes,0);
            if (this.isWin && currentFanBeiCount >=fanBeiTotal ) 
            {
                isShow =false;
            }
            else if (!this.isWin && currentMianShuCount >=mianShuTotal ) 
            {
                isShow =false;
            }
        }
        this.SetActiveLookGGBtn(isShow);
    }


    onS2CDouLiuJu(data:pb.S2CDouLiuJu){
        this.clearTable();
        for (let index = 0; index < data.cards.length; index++) {
            let dc = data.cards[index];
            let lpos = this.DdzData().ToLoaclPos(dc.pos);
            let localCards = this.DdzData().ToLocalCard(dc.cards);
            localCards.sort(function (A, B) {
                return B - A;
            })
            this.outCard(lpos,localCards);
        }
    }
}