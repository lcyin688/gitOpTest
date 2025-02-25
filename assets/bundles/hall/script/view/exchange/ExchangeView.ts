import { Config } from "../../../../../scripts/common/config/Config";
import FLevel2UI from "../../../../../scripts/common/fairyui/FLevel2UI";
import { CfgType, CurrencyType, GetMoneyState, GetMoneyType, GroupId, PlayerAttr } from "../../../../../scripts/def/GameEnums";
import { ProtoDef } from "../../../../../scripts/def/ProtoDef";
import GameView from "../../../../../scripts/framework/core/ui/GameView";
import { HallLogic } from "../../logic/HallLogic";
import TopUI from "../../../../../scripts/common/fairyui/TopUI";
import { GameEvent } from "../../../../../scripts/common/event/GameEvent";


const UI_yqhy = "yqhy";
const UI_yemx = "yemx";
const UI_yebz = "yebz";
const UI_hfcz = "hfcz";
const UI_xrhb = "xrhb";
const UI_yqhybz = "yqhybz";
const UI_ruledlg = "ruledlg";
const UI_djxq = "djxq";

export default class ExchangeView extends FLevel2UI {

    private left:fgui.GComponent = null; 
    private list:fgui.GList = null; 
    private topUI:TopUI = null;

    private inviteData:pb.S2CGetInviteList = null;

    private child:{ [k: string]: (fgui.GComponent)} = {};

    private selectItem:fgui.GComponent = null;

    private getMoneyCfgs:pb.S2CGetMoneyCfgs;

    public Init(ui: GameView, name?: string): void {
        this.onClear();
        this._owner = ui;
        this.root = fgui.UIPackage.createObject(Config.BUNDLE_HALL,"ExchangeView").asCom;
        this.root.name = "exchange";
        this._owner.root.addChild(this.root);
        
        this._close = this.root.getChild("bc");
        this._close.asCom.getChild("back").asCom.getChild("gn").text = "话费兑换";
        this.bindCloseClick();

        this.root.makeFullScreen();
        
        this.list = this.root.getChild("list").asList;
        this.list.on(fgui.Event.CLICK_ITEM, this.onClickItem, this);
        this.left = this.root.getChild("left").asCom;

        this.left.getChild("rule").onClick(this.onClickXrhbRule,this);

        // this.child[UI_yqhy] = this.root.getChild(UI_yqhy).asCom; 
        this.bindChildUI(UI_yqhy);
        this.bindChildUI(UI_yemx);
        this.bindChildUI(UI_yebz);
        this.bindChildUI(UI_hfcz);
        this.bindChildUI(UI_xrhb);
        this.bindChildUI(UI_yqhybz);
        this.bindChildUI(UI_ruledlg);
        this.bindChildUI(UI_djxq);
        

        this.root.getChild("rule").onClick(this.onClickDhsm,this);
        this.left.getChild("mx").onClick(this.onClickMx,this);

        this.topUI = new TopUI();
        this.topUI.setRoot(this.root);

        this.refresh();
        
        //邀请好友
        this.initYqhy();

        this.initYebz();

        this.initHfcz();

        this.initHydj();

        this.addEvents();

        let list = this.root.getChild("list").asList;
        let ysw = list.width - list.initWidth;
        if(ysw > 0){
            list.columnGap += ysw / 3;
        }
        let left = this.root.getChild("left").width;
        list.x = (fgui.GRoot.inst.width - left) / 2 + left;
    }

    refresh(){

        this.left.getChild("name").text = Manager.gd.player().name;
        this.left.getChild("id").text = "ID:"+Manager.gd.player().guid;
        this.left.getChild("face").asCom.getChild("icon").icon= Manager.gd.headUrl();
        // Log.d("======fen:", Manager.utils.formatCNY(100),Manager.utils.formatCNY(105),Manager.utils.formatCNY(110),Manager.utils.formatCNY(1),Manager.utils.formatCNY(10));
        this.left.getChild("rmb").text = Manager.utils.formatCNY(Manager.gd.playerAttr(PlayerAttr.PA_CashShow));
        this.left.getChild("hfq").text = Manager.gd.playerCurrenciesStr(CurrencyType.CT_HuafeiQuan) + "话费券";

        this.left.getChild("rmbhb").text = Manager.utils.formatCNY(Manager.gd.playerAttr(PlayerAttr.PA_BeginnerMoney));
        
        let str = String.format("每日登录获得{0}元", Manager.utils.formatCNY(Manager.utils.getCfgItem(CfgType.CfGType_DayGiveBeginnerMoney),false));
        this.left.getChild("mr").text = str ;

        str = String.format("最高可得{0}元", Manager.utils.formatCNY(Manager.utils.getCfgItem(CfgType.CfgType_AdGetDayMaxHfq),false));
        this.left.getChild("zg").text = str ;

        str = String.format("小额领取[color=#f93d3c]（{0}）[/color]与话费充值[color=#f93d3c]（{1}-{2}） [/color]"
        , Manager.utils.formatCNY(Manager.utils.getCfgItem(CfgType.CfgType_GetMoneyVal),false)
        , Manager.utils.formatCNY(Manager.utils.getCfgItem(CfgType.CfgType_PhoneRechargeMin),false)
        , Manager.utils.formatCNY(Manager.utils.getCfgItem(CfgType.CfgType_PhoneRechargeMax),false));
        this.root.getChild("xelq").text = str;

        let ct = this.child[UI_yemx].getChild("context").asCom;
        ct.getChild("cz").text = Manager.utils.formatCNY(Manager.gd.playerAttr(PlayerAttr.PA_TotalPhoneRecharge));
        ct.getChild("tx").text = Manager.utils.formatCNY(Manager.gd.playerAttr(PlayerAttr.PA_TotalWithDraw));

        this.topUI.refresh();

        this.setMoneyCfgsData(null);
    }

    protected addEvents(): void {
        this.addEvent(ProtoDef.pb.S2CGetInviteList,this.onS2CGetInviteList);
        this.addEvent(GameEvent.Update_Player,this.refresh);
        this.addEvent(GameEvent.RefreshPlayer,this.refresh);
        // this.addEvent(GameEvent.Update_PlayerCurrency+"_"+CurrencyType.CT_HuafeiQuan,this.refreshHuafeiQuan);
    }

    private initHydj(){
        let cx = this.child["djxq"].getChild("context").asCom;
        cx.getChild("yq").onClick(this.onClickYqhy,this);
    }

    addListeners(): void {
        super.addListeners();
        if(this.topUI){
            this.topUI.addListeners();
        }
    }

    onClickXrhbRule(){
        this.showUI(UI_xrhb);

        // Manager.gd.put("__cfgid",1);
        // Manager.platform.loginWx("wxhbtx");
    }

    onS2CGetInviteList(data:pb.S2CGetInviteList){
        this.inviteData = data;
        let cx = this.child["djxq"].getChild("context").asCom;
        let list = cx.getChild("list").asList;
        list.setVirtual();
        list.itemRenderer = this.renderDjxqListItem.bind(this);
        list.numItems = data.items.length;
    }

    private renderDjxqListItem(index: number, obj: fgui.GObject): void {
        let com = obj.asCom;
        if(com == null){
            return;
        }
        if(this.inviteData == null ||  this.inviteData.items == null){
            return;
        }
        let data = this.inviteData.items[index];
        com.getChild("index").text = (index+1).toString();
        com.getChild("id").text = data.playerGuid.toString();
        com.getChild("name").text = data.name.toString();
        com.getChild("ts").text = Manager.utils.formatDate(data.regTime);
        com.getChild("count").text = data.playTimes.toString();
        let c = com.getController("status");
        if(data.reach){
            c.selectedIndex = 1;
        }else{
            c.selectedIndex = 2;
        }
    }

    private initHfcz(){
        let cx = this.child[UI_hfcz].getChild("context").asCom;
        let hm = cx.getChild("hm").asCom.getChild("input").asTextInput;
        Manager.utils.setInputTips(hm,"请输入充值号码");
        
        let cf = cx.getChild("rpt").asCom.getChild("input").asTextInput;
        Manager.utils.setInputTips(cf,"请再次输入充值号码");
        cx.getChild("qrcz").onClick(this.onClickQrcz,this);
    }

    
    private setHfczData(data:any){
        let cx = this.child[UI_hfcz].getChild("context").asCom;
        let hm = cx.getChild("hm").asCom.getChild("input").asTextInput;
        hm.text = "";
        let cf = cx.getChild("rpt").asCom.getChild("input").asTextInput;
        cf.text = "";

        if(data != null && data.d != null){
            let cfg = data.d as pb.IGetMoneyCfg;
            cx.getChild("czk").text = Manager.utils.formatCNY(cfg.money,true,"¥");
            cx.getChild("qrcz").data = cfg;
        }
    }
    
 
    private onClickQrcz(evt:fgui.Event){
        let obj = fgui.GObject.cast(evt.currentTarget);
        if(obj == null || obj.data == null){
            return;
        }
        let data = obj.data as pb.IGetMoneyCfg;

        let cx = this.child[UI_hfcz].getChild("context").asCom;
        let hm = cx.getChild("hm").asCom.getChild("input").asTextInput;
        let rpt = cx.getChild("rpt").asCom.getChild("input").asTextInput;
        if(hm.text.length == 0){
            Manager.tips.show("号码不能为空");
            return;
        }
        if(hm.text.length != rpt.text.length){
            Manager.tips.show("两次输入号码不一致，请检查");
            return;
        }

        let num = Number(hm.text.trim());
        if(isNaN(num)){
            Manager.tips.show("号码只能为数字");
            return;
        }

        function ff(params:boolean) {
            // Log.d("Manager.alert ff",params);
            if (params){
                let lg = Manager.logicManager.get<HallLogic>(HallLogic);
                lg.getMoney(data.id,num.toString());
            }
        };

        let cf:AlertConfig={
            // immediatelyCallback : true,
            title:"确认提示",
            text: String.format("确认要给{0}充值{1}元吗？",num,Manager.utils.formatCNY(data.money,false)),   
            confirmCb: ff.bind(this),        
            cancelCb: ff.bind(this),
            confirmString:"确认",
            cancelString:"取消",
        };
        Manager.alert.show(cf);
    }

    private initYqhy(){
        let cx = this.child[UI_yqhy].getChild("context").asCom;
        cx.getChild("yqbtn").onClick(this.onClickYqhyRule,this);
        cx.getChild("yq").onClick(this.onClickYqhy,this);

        let cfg = Manager.utils.getWebConfig();
        if(cfg == null){
            return;
        }

        let qr = cx.getChild("ewm").node.getComponent('CQRCode');
        if(qr == null){
            qr = cx.getChild("ewm").node.addComponent('CQRCode');
        }
        qr.size = cx.getChild("ewm").width;
        qr.string = cfg.info.share_url+Manager.gd.guid();
    }

    private onClickWyx(){
        this.hide();
        let lg = Manager.logicManager.get<HallLogic>(HallLogic);
        if(lg != null){
            lg.quickStart();
        }
    }

    private onClickAd(){
        Log.d("ad sdk");
        
        let jsonData={adname:"",parms1:"",parms2:""}
        jsonData.adname="Ad_HfExchange";
        jsonData.parms1="";
        jsonData.parms2="";
        Manager.adManeger.WatchAds(jsonData,()=>{
            if(!Manager.platform.isAdOpen()){

            }
        })

    }

    private initYebz(){
        let cx = this.child[UI_yebz].getChild("context").asCom;
        cx.getChild("wyx").onClick(this.onClickWyx,this);
        cx.getChild("ksp").onClick(this.onClickAd,this);
    }

    private setYqhyData(){
        let cx = this.child[UI_yqhy].getChild("context").asCom;
        let list = cx.getChild("list").asList;
        list.removeChildrenToPool();
        let max = 1000;
        for (let index = 0; index < this.getMoneyCfgs.items.length; index++) {
            let item = this.getMoneyCfgs.items[index];
            if(item.iType == GetMoneyType.GMT_PhoneCharge){
                let com = list.addItemFromPool().asCom;
                com.getChild("rmbhb").text = Manager.utils.formatCNY(item.money,true,"¥");
                com.getChild("desc").text = String.format(item.inviteDesc,item.needInvite);;
                if(item.invitePlayTimes < max){
                    max = item.invitePlayTimes;
                }
            }
        }
        let str = String.format("邀请好友[color=#f93d3c]下载游戏玩{0}局[/color]即可兑换话费充值",max);
        cx.getChild("yqsj").text = str;

        let inviteall = Manager.gd.playerAttr(PlayerAttr.PA_TotalInvite);
        let invitexh = Manager.gd.playerAttr(PlayerAttr.PA_ConsumeInvite);

        let bar = cx.getChild("bar").asProgress;
        bar.min = 0;
        bar.max = max;
        let left = inviteall - invitexh;
        if(left < 0){
            left = 0;
        }
        if(left > max){
            left = max;
        }
        bar.value = left;
        bar.getChild("tips").text = String.format("您已成功邀请了[color=#f93d3c]{0}位[/color]好友",left);
        for (let index = 0; index < 3; index++) {
            bar.getChild(index.toString()).visible = false;
        }
        if(left > 0){
            bar.getChild("0").visible = true;
        }
        if(left >= max/2){
            bar.getChild("1").visible = true;
        }
    }

    private onClickYqhy(){
        Log.d("yqhy sdk");
        Manager.platform.WxInvite();
    }

    private onClickYqhyRule(){
        this.showUI(UI_yqhybz,false);
    }

    private setYebzData(data:any){
        let cx = this.child[UI_yebz].getChild("context").asCom;
        if(data != null && data.d != null){
            let cfg = data.d as pb.IGetMoneyCfg;
            cx.getChild("title").text = String.format("还差[color=#f93d3c]{0}元[/color]可兑换",Manager.utils.formatCNY(cfg.needRemain-Manager.gd.playerAttr(PlayerAttr.PA_CashShow),false));
        }
    }

    private bindChildUI(childName:string){
        this.child[childName] = this.root.getChild(childName).asCom; 
        this.child[childName].visible = false;
        let cx = this.child[childName].getChild("context");
        if(cx){
            cx.asCom.getChild("close").onClick(this.closeUI,this);
        }
    }

    removeEventListeners(): void {
        super.removeEventListeners();
        if(this.root != null){
            if(this.root.parent != null){
                this.root.parent.removeChild(this.root);
            }
            this.root.dispose();
        }
        if(this.topUI){
            this.topUI.removeEventListeners();
        }
    }

    setMoneyCfgsData(dataCfgs:pb.S2CGetMoneyCfgs){
        // this.show();
        this.showUI("");
        if(dataCfgs != null){
            this.getMoneyCfgs = dataCfgs;
        }

        if(this.getMoneyCfgs == null){
            return;
        }

        let cs = Manager.gd.playerAttr(PlayerAttr.PA_CashShow);
        let adall = Manager.gd.playerAttr(PlayerAttr.PA_TotalAdTimes);
        let inviteall = Manager.gd.playerAttr(PlayerAttr.PA_TotalInvite);

        let adxh = Manager.gd.playerAttr(PlayerAttr.PA_ConsumeAdTimes);
        let invitexh = Manager.gd.playerAttr(PlayerAttr.PA_ConsumeInvite);
        this.list.removeChildrenToPool();
        for (let index = 0; index < this.getMoneyCfgs.items.length; index++) {
            let item = this.getMoneyCfgs.items[index];
            let com = this.list.addItemFromPool().asCom;
            com.data = {};
            com.data.d = item;
            com.getChild("rmb").text = Manager.utils.formatCNY(item.money);

            let ct = com.getChild("qd").asCom;
            ct.getController("sc").selectedIndex = 0;
            com.getChild("ms").text = ""; 
            if(cs < item.money){
                com.getChild("ms").text = String.format(item.remainDesc,Manager.utils.formatCNY(item.needRemain,false),Manager.utils.formatCNY(item.money,false));
                com.data.i = 0;
                ct.getController("sc").selectedIndex = 2;
                continue;
            }

            if(adall-adxh < item.needAd){
                com.getChild("ms").text = String.format(item.adDesc,item.needAd);
                com.data.i = 1;
                ct.getController("sc").selectedIndex = 3;
                ct.getChild("title").text = "看广告"+(adall-adxh)+"/"+item.needAd;
                continue;
            }

            if(inviteall-invitexh < item.needInvite){
                com.getChild("ms").text = String.format(item.inviteDesc,item.needInvite);
                ct.getController("sc").selectedIndex = 1;
                com.data.i = 2;
                continue;
            }

            if(inviteall-invitexh < item.invitePlayTimes){
                com.getChild("ms").text = String.format(item.invitePlayDesc,item.invitePlayTimes);
                ct.getController("sc").selectedIndex = 4;
                com.data.i = 3;
                continue;
            }
        }

        if(this.list._children.length < 6){
            for (let index = 0; index < this.getMoneyCfgs.items.length; index++) {
                let c = this.list.getChildAt(index).asCom;
                let data = c.data.d as pb.IGetMoneyCfg;
                let i = c.data.i;
                if(i==0){
                    if(this.addItem(data,1,adall,inviteall)){
                        break;
                    }
                    if(this.addItem(data,2,adall,inviteall)){
                        break;
                    }
                    if(this.addItem(data,3,adall,inviteall)){
                        break;
                    }
                }else if(i==1){
                    if(this.addItem(data,2,adall,inviteall)){
                        break;
                    }
                    if(this.addItem(data,3,adall,inviteall)){
                        break;
                    }
                }else if(i==2){
                    if(this.addItem(data,3,adall,inviteall)){
                        break;
                    }
                }else{
                    continue
                }
            }
        }

        this.setYqhyData();
    }


    protected addItem(data:pb.IGetMoneyCfg,index:number,adall:number,inviteall:number):boolean{
        let com = this.list.addItemFromPool().asCom;
        com.data = {}
        com.data.d = data;
        com.data.i = index;

        com.getChild("rmb").text = Manager.utils.formatCNY(data.money);


        let adxh = Manager.gd.playerGV(GroupId.GI_GetMoneyUseAdTimes,data.id,0);
        let invitexh = Manager.gd.playerGV(GroupId.GI_GetMoneyUseInvite,data.id,0);
        com.getChild("ms").text = "";
        let ct = com.getChild("qd").asCom;
        ct.getController("sc").selectedIndex = 1;
        Log.d("addItem:",index,data,adall-adxh ,data.needAd,inviteall-invitexh, data.needInvite,inviteall-invitexh , data.invitePlayTimes);
        if((adall-adxh >= data.needAd) && (inviteall-invitexh >= data.needInvite) && (inviteall-invitexh >= data.invitePlayTimes)){
            ct.getController("sc").selectedIndex = 0;
            Log.d("达成");
        }

        if(index == 1){
            if(adall-adxh < data.needAd){
                com.getChild("ms").text = String.format(data.adDesc,data.needAd);
                ct.getController("sc").selectedIndex = 3;
                ct.getChild("title").text = "看广告"+(adall-adxh)+"/"+data.needAd;
                Log.d("1");
                return (this.list._children.length >= 6);
            }
        }
        if(index == 2){
            if(inviteall-invitexh < data.needInvite){
                com.getChild("ms").text = String.format(data.inviteDesc,data.needInvite);
                ct.getController("sc").selectedIndex = 1;
                Log.d("2");
                return (this.list._children.length >= 6);
            }
        }
        if(index == 3){
            if(inviteall-invitexh < data.invitePlayTimes){
                com.getChild("ms").text = String.format(data.invitePlayDesc,data.invitePlayTimes);
                ct.getController("sc").selectedIndex = 4;
                Log.d("3");
                return (this.list._children.length >= 6);
            }
        }
        this.list.removeChild(com);
        return false;
    } 

    onClickItem(com:fgui.GComponent){
        this.selectItem = com;
        Log.d("onClickItem:",com);
        let ct = com.getChild("qd").asCom;
        let ctIndex = ct.getController("sc").selectedIndex;
        // ctIndex = 0;
        
        switch (ctIndex) {
            case 0:
                if(com.data != null){
                    let cfg = com.data.d as pb.IGetMoneyCfg;
                    if(cfg.iType == GetMoneyType.GMT_PhoneCharge){
                        this.showUI(UI_hfcz);
                        this.setHfczData(com.data);
                    }else if(cfg.iType == GetMoneyType.GMT_WithDraw){
                        //弹窗调sdk
                        Manager.gd.put("__cfgid",cfg.id);
                        Manager.platform.loginWx("wxhbtx");
                        Log.d("sdk wxhb");
                    }else{
                        Log.e("onClickItem cfg.iType",cfg.iType);
                    }
                }
                break;
            case 1:
                this.showUI(UI_yqhy);
                break;
            case 2:
                this.showUI(UI_yebz);
                this.setYebzData(com.data);
                break;
            case 3:
                //调sdk看广告
                this.onClickAd();
                break;
            case 4:
                //叫好友玩游戏
                Log.d("叫好友玩游戏");
                let lg = Manager.logicManager.get<HallLogic>(HallLogic);
                if(lg){
                    lg.getInviteList();
                    this.showUI(UI_djxq);
                }
                break;
            default:
                break;
        }
    }

    private showUI(name:string,hideOther:boolean = true){
        if(hideOther){
            for (const [key, val] of Object.entries(this.child)) {
                if(val != null){
                    val.visible = false;
                }
            }
        }
        if(this.child[name] != null){
            this.child[name].visible = true;
        }
    }

    private closeUI(evt: fgui.Event){
        let obj = fgui.GObject.cast(evt.currentTarget);
        if(obj && obj.parent && obj.parent.parent){
            obj.parent.parent.visible = false;
        }
    }

    private onClickDhsm(){
        this.showUI(UI_ruledlg);
        let ct = this.child[UI_ruledlg].getChild("context").asCom;
        let list = ct.getChild("list").asList;
        list.scrollToView(0);
    }

    private onClickMx(){
        let logic = Manager.logicManager.get<HallLogic>(HallLogic);
        logic.getMoneyDetail();
    }

    setMoneyDetailData(data:pb.S2CGetMoneyDetail){
        // this.show();
        // this.left.getChild("rmb").text = data.items
        this.showUI(UI_yemx);
        Manager.gd.put(ProtoDef.pb.S2CGetMoneyDetail,data);
        let ct = this.child[UI_yemx].getChild("context").asCom;
        let list = ct.getChild("list").asList;
        list.setVirtual();
        list.itemRenderer = this.renderMxListItem.bind(this);
        list.numItems = data.items.length;
    }
    
    private renderMxListItem(index: number, obj: fgui.GObject): void {

        let data:pb.S2CGetMoneyDetail = Manager.gd.get<pb.S2CGetMoneyDetail>(ProtoDef.pb.S2CGetMoneyDetail);
        if(data == null){
            return;
        }
        let com = obj.asCom;
        if(com == null){
            return;
        }
        let di = data.items[index];  

        com.getChild("sj").text = Manager.utils.formatDate(di.time);
        com.getChild("dhcz").text = "";
        if(di.iType == GetMoneyType.GMT_PhoneCharge){
            com.getChild("dhcz").text = "充值话费";
            com.getChild("czhm").text = di.param;
        }else if(di.iType == GetMoneyType.GMT_WithDraw){
            com.getChild("dhcz").text = "小额兑换";
            com.getChild("czhm").text = "-";
        }
        com.getChild("dhje").text = Manager.utils.formatCNY(di.amount);
        com.getChild("ye").text = Manager.utils.formatCNY(di.cash);
        if(di.state == GetMoneyState.GetMoneyState_Fail){
            com.getChild("zt").text = "失败";
        }else if(di.state == GetMoneyState.GetMoneyState_Succ){
            com.getChild("zt").text = "成功";
        }else if(di.state == GetMoneyState.GetMoneyState_Process){
            com.getChild("zt").text = "处理中";
        }
    }
}
