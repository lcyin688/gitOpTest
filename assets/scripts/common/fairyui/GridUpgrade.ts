
import { ProtoDef } from "../../def/ProtoDef";
import UIView from "../../framework/core/ui/UIView";
import { Macro } from "../../framework/defines/Macros";
import GameData from "../data/GameData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GridUpgrade extends UIView {

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
            resName : "GridLevelUp",
        }
        return path;
    }

    onLoad() {
        super.onLoad();
    }

    onFairyLoad(): void {
        this.root.onClick(this.onClickClose,this);
        this.root.makeFullScreen();
        let data = Manager.dataCenter.get(GameData).get<pb.S2CDuanWeiChange>(ProtoDef.pb.S2CDuanWeiChange);
        if(data != null){
 
            let dwData:pb.S2CGetSeasonDuanWeiCfg = Manager.dataCenter.get(GameData).get<pb.S2CGetSeasonDuanWeiCfg>(ProtoDef.pb.S2CGetSeasonDuanWeiCfg+"_"+Manager.utils.gt(data.gameCat));
            let context = this.root.getChild("n0").asCom;
            let old = context.getChild("old").asCom;
            this.setDw(old,data.oldDuanWei,dwData);

            let n = context.getChild("new").asCom;
            this.setDw(n,data.newDuanWei,dwData);
        }
    }

    setDw(com:fgui.GComponent,dw:number,dwData:pb.S2CGetSeasonDuanWeiCfg){
        if(dw <= 0){
            dw = 1;
        }
        if(dw > dwData.items.length){
            dw = dwData.items.length;
        }
        // let conf = dwData.items[dw-1];  
        // com.getChild("tile").text = conf.name;
        // let iconId = Manager.utils.dwIcon(dw);
        // com.getChild("n0").icon = fgui.UIPackage.getItemURL(GridUpgrade.getViewPath().pkgName,"ui_rank_dw_di_"+iconId);

        Manager.utils.setHz(com,null,dw,dwData,false);
    }

    onClickClose(){
        Manager.uiManager.close(GridUpgrade);
    }
}
