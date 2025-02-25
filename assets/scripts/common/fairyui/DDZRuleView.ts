
import UIView from "../../framework/core/ui/UIView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DDZRuleView extends UIView {

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
            resName : "DDZRule",
        }
        return path;
    }

    onLoad() {
        super.onLoad();
    }

    onFairyLoad(): void {
        let cx = this.root.getChild("n1").asCom;
        cx.getChild("close").onClick(this.onClickClose,this);
    }

    onClickClose(){
        Log.d("onClickClose");
        Manager.uiManager.close(DDZRuleView);
    }

}
