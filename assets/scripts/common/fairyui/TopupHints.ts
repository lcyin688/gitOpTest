
import { ProtoDef } from "../../def/ProtoDef";
import UIView from "../../framework/core/ui/UIView";
import { GameService } from "../net/GameService";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TopupHints extends UIView {

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
            resName : "THDialog",
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
        ctx.getChild("close").onClick(this.onClickClose,this);
    }

    onClickClose(){
        Manager.uiManager.close(TopupHints);
    }
    
    onError(){
        Manager.loading.hide();
        let ctx = this.root.getChild("context").asCom;
        let name = ctx.getChild("name").asCom.getChild("input").asTextInput;
        let id = ctx.getChild("id").asCom.getChild("input").asTextInput;
        name.text = "";
        id.text = "";
    }
}
