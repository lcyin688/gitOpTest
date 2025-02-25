
import { ProtoDef } from "../../def/ProtoDef";
import UIView from "../../framework/core/ui/UIView";
import { Macro } from "../../framework/defines/Macros";
import { Config, ViewZOrder } from "../config/Config";
import ZhzxView from "./ZhzxView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SetView extends UIView {

    private set:fgui.GComponent = null;

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
            resName : "SetView",
        }
        return path;
    }

    onLoad() {
        super.onLoad();
    }

    onFairyLoad(): void {
        this.set = this.root.getChild("set").asCom;
        this.set.getChild("close").onClick(this.onClickClose,this);
        this.set.getChild("music").onClick(this.onClickMusic,this);
        this.set.getChild("audio").onClick(this.onClickSound,this); 
        this.set.getChild("shake").onClick(this.onClickShake,this);
        this.set.getChild("ghzh").onClick(this.onClickGHZH,this);
        this.set.getChild("smrz").onClick(this.onClickSMRZ,this);
        this.set.getChild("lxkf").onClick(this.onClickLXKF,this);
        this.set.getChild("yhxl").onClick(this.onClickYHXY,this);
        this.set.getChild("yszc").onClick(this.onClickYSZC,this);
        this.set.getChild("etyszc").onClick(this.onClickETYSZC,this);
        this.set.getChild("zxzh").onClick(this.onClickZXZH,this);

        let box = this.set.getChild("db").asComboBox;
        box.onClick(this.onClickVoice,this);
        this.set.getChild("smrz").visible = false;

        this.set.getChild("music").asLabel.getChild("btn").asButton.selected = Manager.globalAudio.isMusicOn;
        this.set.getChild("audio").asLabel.getChild("btn").asButton.selected = Manager.globalAudio.isEffectOn;

        if(this.args != null){
            this.set.getChild("ghzh").enabled = false;
        }
        this.SetUISwitch();
    }


    SetUISwitch()
    {
        let uiconfig = Manager.gd.get<pb.S2CUISwitches>(ProtoDef.pb.S2CUISwitches);
        if(uiconfig == null || uiconfig.items == null){
            return;
        }
        this.set.getChild("smrz").visible = true;
        if(uiconfig.items["real_auth"] == null || uiconfig.items["real_auth"] == 0)
        {
            this.set.getChild("smrz").visible = false;
        }

        this.set.getChild("zxzh").visible = true;
        if( uiconfig.items["zlzh_set"] == 0)
        {
            this.set.getChild("zxzh").visible = false;
        }


    }


    onClickVoice(){
        Log.d("onClickVoice");
    }

    onClickClose(){
        Log.d("onClickClose");
        Manager.uiManager.close(SetView);
    }

    onClickGHZH(){
        Manager.localStorage.clear();
        Manager.entryManager.enterBundle(Macro.BUNDLE_RESOURCES,true);
    }

    onClickSMRZ(){

    }

    onClickZXZH(){
        function ffFinal(params:boolean) {
            // Log.d("Manager.alert ff",params);
            if (params){
                // Manager.utils.openUrl("https://m.66qp.com.cn/user/cancel.html?guid=653235885");
                // Manager.uiManager.mainController().OpenWebUrl("https://m.66qp.com.cn/user/cancel.html?guid=653235885");
                Manager.uiManager.openFairy({ type: ZhzxView, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.Alert, name: "账号注销界面" });
                this.onClickClose();

            }else{

            }
        }

        function ff(params:boolean) {

            if (params){
                Manager.utils.CommonShowMsg("TS_Denglu_59",ffFinal);
            }else{

            }
        }
        Manager.utils.CommonShowMsg("TS_Denglu_58",ff);


    }
    


    onClickLXKF(){
        setTimeout(() => {
            cc.game.end();
        }, 100);
    }

    onClickMusic(){
        Manager.globalAudio.isMusicOn = this.set.getChild("music").asLabel.getChild("btn").asButton.selected;
    }

    onClickSound(){
        Manager.globalAudio.isEffectOn = this.set.getChild("audio").asLabel.getChild("btn").asButton.selected;
    }

    onClickShake(){

    }

    onClickYHXY(){
        Manager.utils.openYhxy();
    }

    onClickYSZC(){
        Manager.utils.openYszc();
    }

    onClickETYSZC(){
        Manager.utils.openEtyszc();
    }
}
