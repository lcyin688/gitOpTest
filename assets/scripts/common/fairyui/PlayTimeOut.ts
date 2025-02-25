
import UIView from "../../framework/core/ui/UIView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayTimeOut extends UIView {

    public static getPrefabUrl() {
        return "prefabs/HallView";
    }

    static getViewPath(): ViewPath {
        let path : ViewPath = {
            	/**@description 资源路径 creator 原生使用*/
            assetUrl: "common/ui/base",
            /**@description 包名称 fgui 使用*/
            pkgName : "base",
            /**@description 资源名称 fgui 使用*/
            resName : "JPDialog",
        }
        return path;
    }

    onLoad() {
        super.onLoad();
    }

    onFairyLoad(): void {
        // this.root.onClick(this.onClickClose,this);
        this.root.makeFullScreen();
        let ctx = this.root.getChild("context").asCom;
        ctx.getChild("exit").onClick(this.onClickExit,this);
    }

    onClickExit(){
        cc.game.end();
    }

}
