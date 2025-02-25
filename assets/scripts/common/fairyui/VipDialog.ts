
import { PlayerAttr } from "../../def/GameEnums";
import { ProtoDef } from "../../def/ProtoDef";
import UIView from "../../framework/core/ui/UIView";
import { Config } from "../config/Config";
import { GameService } from "../net/GameService";

export default class VipDialog extends UIView {


    public ct:fgui.GComponent = null;
    public cc:fgui.Controller = null;

    public list:fgui.GList = null;

    public lv:fgui.GTextField = null;

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
            resName : "VipDialog",
        }
        return path;
    }

    onLoad() {
        super.onLoad();
        this.open(this.args);
    }

    onFairyLoad(): void {
        this.ct = this.root.getChild("ct").asCom;
        this.ct.getChild("close").onClick(this.hide,this);

        this.cc = this.ct.getController("cv");
        this.lv = this.ct.getChild("lv").asTextField;
        this.list = this.ct.getChild("list").asList;

        this.ct.getChild("recv").onClick(this.onRecv,this);

        this.root.makeFullScreen();
    }

    protected addEvents(): void {
        this.addEvent(ProtoDef.pb.S2CGetVipReward,this.onGetVipReward);
        this.addEvent(ProtoDef.pb.S2CGetVipDayReward,this.onS2CGetVipDayReward);
    }

    onGetVipReward(data:pb.S2CGetVipReward){
        if(data.ec == 1){
            this.ct.getChild("recv").enabled = false;
            this.ct.getChild("recv").text = "已领取";
            return;
        }
    } 

    onS2CGetVipDayReward(data:pb.S2CGetVipReward){
        if(data.ec == 1){
            this.ct.getChild("recv").enabled = false;
            this.ct.getChild("recv").text = "已领取";
            return;
        }
    } 

    protected onRecv(): void {
        let lg = Manager.serviceManager.get(GameService) as GameService;
        if(this.cc.selectedIndex == 1){
            lg.getVipReward(Manager.gd.playerAttr(PlayerAttr.PA_VipLevel));
        }else{
            lg.getVipDayReward();
        }
    }

    public open(type:string): void {
        this.cc.selectedPage = type;
        let cfg = Manager.gd.get<pb.S2CVipCfgs>(ProtoDef.pb.S2CVipCfgs);
        if(cfg == null){
            Manager.tips.show("配置未下发，请稍等");
            this.hide();
            return;
        }
        
        let lvNum = Manager.gd.playerAttr(PlayerAttr.PA_VipLevel);
        this.lv.text = lvNum.toString();
        let cur = cfg.items[lvNum-1];
        if(cur == null){
            Manager.tips.show("配置错误，未找到数据");
            this.hide();
            return;
        }
        this.ct.getChild("recv").text = "立即领取";
        this.ct.getChild("recv").enabled = true;
        let reward = cur.dayGift;
        if(this.cc.selectedIndex == 1){
            reward = cur.gift;
        }

        this.list.removeChildrenToPool();

        for (const [key, val] of Object.entries(reward)) {
            let c = this.list.addItemFromPool().asCom;
            let nt = Number(key);
            Manager.gd.getNBPropIcon(nt,c.getChild("loader").asLoader);
            c.getChild("num").text = Manager.utils.formatCoin(val,nt);   
            c.getChild("name").text = Manager.utils.GetDjName(nt);
        }
    }

    public hide(){
        Manager.uiqueue.close(this);
        Manager.uiManager.close(VipDialog);
    }
}
