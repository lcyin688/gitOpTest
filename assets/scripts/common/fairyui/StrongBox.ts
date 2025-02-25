import { CfgType, CurrencyType, PlayerAttr } from "../../def/GameEnums";
import { ProtoDef } from "../../def/ProtoDef";
import UIView from "../../framework/core/ui/UIView";
import { GameService } from "../net/GameService";

const {ccclass, property} = cc._decorator;

@ccclass
export default class StrongBox extends UIView {

    private sbox:fgui.GComponent = null;
    private slider:fgui.GSlider = null;
    private sub:fgui.GObject = null;
    private add:fgui.GObject = null;
    private qd:fgui.GObject = null;

    private maxSum:number = 0;
    private step:number = -1;
    private saveMin:number = -1;
    private leftMin:number = -1;
    private key = "SBC";
    protected addEvents(): void {
        this.addEvent(ProtoDef.pb.S2COutSafeBox,this.onS2COutSafeBox);
        this.addEvent(ProtoDef.pb.S2CInSafeBox,this.onS2CInSafeBox);
    }

    
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
            resName : "StrongBox",
        }
        return path;
    }

    onLoad() {
        super.onLoad();
        this.show();
    }

    onClickClose(){
        Manager.uiManager.close(StrongBox);
    }

    onFairyLoad(): void {

        this.sbox = this.root.getChild("n1").asCom;
        let close = this.sbox.getChild("close");
        close.onClick(this.onClickClose,this);

        this.sbox.getChild("tab0").onClick(this.onClickOut,this);
        this.sbox.getChild("tab1").onClick(this.onClickIn,this);
        Manager.utils.fontSyncText(this.sbox.getChild("tab0").asCom);
        Manager.utils.fontSyncText(this.sbox.getChild("tab1").asCom);
        this.sub = this.sbox.getChild("sub_");
        this.sub.onClick(this.onClickSub,this);
        this.add = this.sbox.getChild("add_");
        this.add.onClick(this.onClickAdd,this);
        this.qd = this.sbox.getChild("qd");
        this.qd.onClick(this.onClickQd,this);

        this.slider = this.sbox.getChild("sbar").asSlider;
        this.slider.on(fgui.Event.STATUS_CHANGED,this.onSlider,this);
        let index = Manager.localStorage.getItem(this.key,1);
        this.sbox.getController(this.key).selectedIndex = index;
    }

    private onSlider(slider:fgui.GSlider){
        slider.value = Math.floor(slider.value);
        slider.getChild("tips").text = Manager.utils.formatCoin(slider.value);
        // slider.getChild("tips").x = slider.width * (slider.value / (slider.max-slider.min)) - slider.getChild("tips").width / 2;
    }

    public show(): void {
        super.show();
        let cfg = Manager.gd.get<pb.S2CCfgs>(ProtoDef.pb.S2CCfgs);

        this.saveMin = 0;
        this.leftMin = 0;
        if(cfg != null){
            this.step = cfg.items[CfgType.CfgType_SafeBoxStep];  
            this.saveMin = cfg.items[CfgType.CfgType_SafeBoxInLimit];  
            this.leftMin = cfg.items[CfgType.CfgType_SafeBoxInRetainCoin];
        }
        if(this.step == -1){
            Manager.tips.debug("全局配置未找到保险柜步长");
        }
        
        this.slider.enabled = true;
        this.sub.enabled = true;
        this.add.enabled = true;
        this.qd.enabled = true;
        Log.e("cfg 00  show  ", Manager.gd.playerCurrenciesStr(CurrencyType.CT_Coin))
        Log.e("cfg 01  show  ", Manager.gd.getPlayerSafeBoxStr() ) 

        this.sbox.getChild("xd").text = Manager.gd.playerCurrenciesStr(CurrencyType.CT_Coin);
        this.sbox.getChild("kc").text = Manager.gd.getPlayerSafeBoxStr();
        let max = 0;
        if(this.sbox.getController(this.key).selectedIndex == 0){
            max = Manager.gd.getPlayerSafeBox();
        }else{
            max = Manager.gd.playerCurrencies(CurrencyType.CT_Coin);
            if(max > this.leftMin){
                max = max - this.leftMin;
            }
        }
        this.maxSum = max;
        if(max == 0){
            max = 100;
            this.slider.enabled = false;
            this.sub.enabled = false;
            this.add.enabled = false;
            this.qd.enabled = false;
        }
        this.slider.max = max;
        this.slider.min = 0;
        this.slider.value = 0;
        if(this.sbox.getController(this.key).selectedIndex == 0){

        }else{
            if(this.maxSum > this.saveMin){
                this.slider.min = this.saveMin;
                this.slider.value = this.saveMin; 
            }
            Log.d(this.maxSum,this.saveMin,this.leftMin);
            if(this.maxSum - this.saveMin < this.leftMin){
                this.slider.enabled = false;
                this.sub.enabled = false;
                this.add.enabled = false;
                this.qd.enabled = false;
            }
        }

        this.onSlider(this.slider);

        if(this.step == -1){
            this.sub.enabled = false;
            this.add.enabled = false;
        }
    }

    protected onClickIn(){
        this.slider.enabled = true;
        this.sub.enabled = true;
        this.add.enabled = true;
        this.qd.enabled = true;
        let max = Manager.gd.playerCurrencies(CurrencyType.CT_Coin);
        if(max > this.leftMin){
            max = max - this.leftMin;
        }
        this.maxSum = max;
        if(max == 0){
            max = 100;
            this.slider.enabled = false;
            this.sub.enabled = false;
            this.add.enabled = false;
            this.qd.enabled = false;
        }
        this.slider.max = max;
        this.slider.min = 0;
        this.slider.value = 0;
        if(this.maxSum > this.saveMin){
            this.slider.min = this.saveMin;
            this.slider.value = this.saveMin; 
        }
        Log.d(this.maxSum,this.saveMin,this.leftMin);
        if(this.maxSum - this.saveMin < this.leftMin){
            this.slider.enabled = false;
            this.sub.enabled = false;
            this.add.enabled = false;
            this.qd.enabled = false;
        }
        this.onSlider(this.slider);

        Log.d("onClickIn:",this.sbox.getController(this.key).selectedIndex);
        Manager.localStorage.setItem(this.key,this.sbox.getController(this.key).selectedIndex);

        if(this.step == -1){
            this.sub.enabled = false;
            this.add.enabled = false;
        }
    }

    protected onClickOut(){
        this.slider.enabled = true;
        this.sub.enabled = true;
        this.add.enabled = true;
        this.qd.enabled = true;
        let max = Manager.gd.getPlayerSafeBox();
        this.maxSum = max;
        if(max == 0){
            max = 100;
            this.slider.enabled = false;
            this.sub.enabled = false;
            this.add.enabled = false;
            this.qd.enabled = false;
        }
        this.slider.max = max;
        this.slider.min = 0;
        this.slider.value = 0;
        this.onSlider(this.slider);

        Log.d("onClickOut:",this.sbox.getController(this.key).selectedIndex);
        Manager.localStorage.setItem(this.key,this.sbox.getController(this.key).selectedIndex);

        if(this.step == -1){
            this.sub.enabled = false;
            this.add.enabled = false;
        }
    }

    protected onClickSub(){
        if(this.slider.value - this.step > 0){
            this.slider.value = this.slider.value - this.step;
        }else{
            this.slider.value = 0;
        }
        this.onSlider(this.slider);
    }

    protected onClickAdd(){
        if(this.slider.value + this.step < this.maxSum){
            this.slider.value = this.slider.value + this.step;
        }else{
            this.slider.value = this.maxSum;
        }
        this.onSlider(this.slider);
    }

    protected onClickQd(){
        let gs = Manager.serviceManager.get(GameService) as GameService;
        if(this.slider.value == 0){
            Manager.tips.showFromId("TS_BXQ_1");
            return;
        }
        if(this.sbox.getController(this.key).selectedIndex == 0){
            gs.outSafeBox(this.slider.value);
        }else{
            gs.inSafeBox(this.slider.value);
        }
    }

    protected onS2CInSafeBox(data:pb.S2CInSafeBox){
        if(data.ec == 1){
            this.sbox.getChild("xd").text = Manager.gd.playerCurrenciesStr(CurrencyType.CT_Coin);
            this.sbox.getChild("kc").text = Manager.gd.getPlayerSafeBoxStr();
            this.onClickIn();

            
        }else{
            Manager.tips.showFromId("TS_BXQ_2");
        }
    }

    protected onS2COutSafeBox(data:pb.S2COutSafeBox){
        if(data.ec == 1){
            this.sbox.getChild("xd").text = Manager.gd.playerCurrenciesStr(CurrencyType.CT_Coin);
            this.sbox.getChild("kc").text = Manager.gd.getPlayerSafeBoxStr();
            this.onClickOut();
        }else{
            Manager.tips.showFromId("TS_BXQ_3");
        }
    }

    
}