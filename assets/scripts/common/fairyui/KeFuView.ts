
import UIView from "../../framework/core/ui/UIView";
import { Macro } from "../../framework/defines/Macros";

const {ccclass, property} = cc._decorator;

@ccclass
export default class KeFuView extends UIView {

    private kf:fgui.GComponent = null;

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
            resName : "KfView",
        }
        return path;
    }

    onLoad() {
        super.onLoad();
    }

    onFairyLoad(): void {
        this.kf = this.root.getChild("kf").asCom;
        this.kf.getChild("close").onClick(this.onClickClose,this);
        this.kf.getChild("copy").onClick(this.onClickCopy,this);

        let kfData = Manager.utils.getWebConfig();
        if(kfData != null){
            this.kf.getChild("desc1").text = kfData.info.tips;
            this.kf.getChild("desc2").text = kfData.info.weixin;
            this.kf.getChild("qrcode").icon = kfData.info.qr;
        }
    }

    onClickCopy(){
        let kfData = Manager.utils.getWebConfig();
        if(kfData != null){
            Manager.platform.copyToClipboard(kfData.info.title);
        }
    }

    onClickClose(){
        Log.d("onClickClose");
        Manager.uiManager.close(KeFuView);
    }

}
