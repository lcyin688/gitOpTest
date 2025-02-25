import { Config, ViewZOrder } from "../../../../scripts/common/config/Config";
import FLevel2UI from "../../../../scripts/common/fairyui/FLevel2UI";
import ShopView from "../../../../scripts/common/fairyui/ShopView";
import { GameService } from "../../../../scripts/common/net/GameService";
import { GroupId, PlayerAttr, RewardState } from "../../../../scripts/def/GameEnums";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";
import { HallLogic } from "../logic/HallLogic";
import HallView from "./HallView";

export default class VipView extends FLevel2UI {

    public ct:fgui.GComponent = null;

    public lv:fgui.GTextField = null;
    public desc2:fgui.GTextField = null;
    public desc1:fgui.GRichTextField = null;

    public progress:fgui.GProgressBar = null;

    public lvPanel:fgui.GComponent = null;
    public list:fgui.GRichTextField = null;

    public descList:fgui.GList = null;
    public rewardList:fgui.GList = null;

    public lvTitle:fgui.GTextField = null;

    public tmpLevel:number = 0;

    public recv:fgui.GButton = null;

    public Init(ui: GameView, name?: string): void {
        this.onClear();
        this._owner = ui;
        this.root = fgui.UIPackage.createObject(Config.BUNDLE_HALL,"VipView").asCom;
        this.root.name = "vip";
        this._owner.root.addChild(this.root);

        this.ct = this.root.getChild("ct").asCom;
        
        this._close = this.ct.getChild("close");
        this.bindCloseClick();

        this.lv = this.ct.getChild("lv").asTextField;

        this.ct.getChild("qcz").onClick(this.onClickQcz,this);
        this.ct.getChild("gift").onClick(this.onClickMrlb,this);

        this.lvPanel = this.ct.getChild("vip").asCom;
        this.progress = this.ct.getChild("progress").asProgress;
        this.desc1 = this.ct.getChild("desc1").asRichTextField;
        this.desc2 = this.ct.getChild("desc2").asTextField;

        this.lvPanel.getChild("right").onClick(this.onClickRight,this);
        this.lvPanel.getChild("left").onClick(this.onClickLeft,this);
        this.recv = this.lvPanel.getChild("recv").asButton;
        this.recv.onClick(this.onClicklq,this);

        this.descList = this.lvPanel.getChild("VipLevelDescList").asList;
        this.rewardList = this.lvPanel.getChild("VipLevelRewardList").asList;
        this.lvTitle = this.lvPanel.getChild("title").asTextField;
        
        this.root.makeFullScreen();
        this.addEvents();

        
    }

    protected addEvents(): void {
        this.addEvent(ProtoDef.pb.S2CGetVipReward,this.onGetVipReward);
        this.addEvent(ProtoDef.pb.S2CGetVipDayReward,this.onS2CGetVipDayReward);
    }

    onGetVipReward(data:pb.S2CGetVipReward){
        if(data.ec == 1 && data.level == this.recv.data){
            this.recv.enabled = false;
            this.recv.text = "已领取";
            return;
        }
    } 

    onS2CGetVipDayReward(data:pb.S2CGetVipReward){

    } 

    onClickQcz(){
        Manager.uiManager.getView("HallView").then((view : HallView)=>{
            if ( view ){
                if (!Manager.uiManager.isShow(ShopView)) {
                    Manager.gd.put(ProtoDef.pb.S2CGetShopItems+"Index",{catName:"钻石"});
                    Manager.uiManager.openFairy({ type: ShopView, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.ShopUI, name: "商城" });
                }
                else
                {
                    Manager.gd.put(ProtoDef.pb.S2CGetShopItems+"Index",{catName:"钻石"});
                    dispatch(ProtoDef.pb.S2CGetShopItems+"shopView");
                }
            }
        })
    }

    onClickMrlb(){
        let lg = Manager.serviceManager.get(GameService) as GameService;
        lg.getVipDayReward();
    }

    onClicklq(){
        if(this.recv.text == "领取"){
            let lg = Manager.serviceManager.get(GameService) as GameService;
            lg.getVipReward(this.recv.data);
            return;
        }
        this.onClickQcz();
    }

    onClickLeft(){
        if(this.tmpLevel-1<0){
            return;
        }
        this.setLevel(this.tmpLevel-1);
    }

    onClickRight(){
        let cfg = Manager.gd.get<pb.S2CVipCfgs>(ProtoDef.pb.S2CVipCfgs);
        if(cfg == null){
            Manager.tips.show("配置未下发，请稍等");
            this.hide();
            return;
        }
        if(this.tmpLevel+1>=cfg.items.length){
            return;
        }
        this.setLevel(this.tmpLevel+1);
    }

    public show(){
        let cfg = Manager.gd.get<pb.S2CVipCfgs>(ProtoDef.pb.S2CVipCfgs);
        if(cfg == null){
            Manager.tips.show("配置未下发，请稍等");
            this.hide();
            return;
        }
        this.lv.icon = Manager.gd.playerVipIcon();

        let lv = Manager.gd.playerAttr(PlayerAttr.PA_VipLevel);
        let curCfg = cfg.items[lv+1];
        if(curCfg != null){
            this.progress.max = Math.floor(curCfg.payAmount/10);
            this.progress.value = Math.floor(Manager.gd.playerAttr(PlayerAttr.PA_TotalPay)/10);  
            this.desc1.visible = false;
            if(lv+1<=cfg.items.length){
                this.desc1.visible = true;
                this.desc1.text = String.format("再充值[color=#ffcc00]{0}元[/color]升级为特权[color=#ffcc00]{1}级[/color]",Math.floor((this.progress.max-this.progress.value)/10),lv+1);  
            }
        }


        this.setLevel(lv);
        Manager.uiqueue.addToQueue(this);
    }

    setLevel(lv:number){
        let cfg = Manager.gd.get<pb.S2CVipCfgs>(ProtoDef.pb.S2CVipCfgs);
        if(lv < 1){
            lv = 1;
        }
        if(lv >= cfg.items.length){
            lv = cfg.items.length - 1;
        }
        let curCfg = cfg.items[lv-1];
        if(curCfg == null){
            this.hide();
            return;
        }
        this.tmpLevel = lv;
        this.lvTitle.text = String.format("特权{0}级每日专属权益",curCfg.level); 
        this.descList.getChildAt(0).text = curCfg.desc;     

        let plv = Manager.gd.playerAttr(PlayerAttr.PA_VipLevel);
        this.recv.data = curCfg.level;
        this.recv.enabled = true;
        this.recv.text = "未达成";
        Log.d(plv, curCfg.level);
        if(plv == curCfg.level){
            this.recv.text = "领取";
        }

        if (Manager.gd.playerGV(GroupId.GI_VipReward,curCfg.level,RewardState.RewardState_Reach) == RewardState.RewardState_Geted) {
            this.recv.enabled = false;
            this.recv.text = "已领取";
        }

        this.rewardList.removeChildrenToPool();

        for (const [key, val] of Object.entries(curCfg.gift)) {
            let c = this.rewardList.addItemFromPool().asCom;
            let nt = Number(key);
            Manager.gd.getNBPropIcon(nt,c.getChild("loader").asLoader);
            c.getChild("num").text = Manager.utils.formatCoin(val,nt);   
            c.getChild("name").text = Manager.utils.GetDjName(nt);
        }
    }

    public hide(): void {
        Manager.uiqueue.close(this);
        super.hide();
    }
}
