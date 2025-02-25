
import { ProtoDef } from "../../def/ProtoDef";
import UIView from "../../framework/core/ui/UIView";
import GameData from "../data/GameData";
import { GameService } from "../net/GameService";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RealAuth extends UIView {

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
            resName : "RealAuthView",
        }
        return path;
    }

    protected addEvents(): void {
        this.addEvent(ProtoDef.pb.C2STrueNameAuth+"_Err",this.onError);
    }

    onLoad() {
        super.onLoad();
    }

    onFairyLoad(): void {
        // this.root.onClick(this.onClickClose,this);
        this.root.makeFullScreen();
        let ctx = this.root.getChild("context").asCom;
        ctx.getChild("qd").onClick(this.onClickRz,this);

        let name = ctx.getChild("name").asCom.getChild("input").asTextInput;
        Manager.utils.setInputTips(name,"请输入姓名");

        let id = ctx.getChild("id").asCom.getChild("input").asTextInput;
        // id.promptText = "[color=#999999]请输入身份证号[/color]";
        Manager.utils.setInputTips(id,"请输入身份证号");

        let list = ctx.getChild("list").asList;

        let data = Manager.gd.get<pb.S2CCfgs>(ProtoDef.pb.S2CCfgs);
        Log.d("data.authRewards:",data.authRewards);
        if(data != null && data.authRewards != null){
            for (const [key, val] of Object.entries(data.authRewards)) {
                let com = list.addItemFromPool().asCom;
                let t = Number(key);
                Manager.gd.getPropIcon(t,com.getChild("icon").asLoader);
                com.getChild("title").text = Manager.utils.formatCoin(val,t);
            }
        }
    }

    onClickRz(){
        let ctx = this.root.getChild("context").asCom;
        let name = ctx.getChild("name").asCom.getChild("input").asTextInput;
        let id = ctx.getChild("id").asCom.getChild("input").asTextInput;
        let nameStr = name.text.trim();
        let idStr = id.text.trim();
        if(nameStr.length == 0){
            Manager.tips.showFromId("TS_INPUT_NULL");
            return;
        }
        let lenCheck = false;
        if(idStr.length == 15){
            lenCheck = true;
        }
        if(idStr.length == 18){
            lenCheck = true;
        }

        if(!lenCheck){
            Manager.tips.showFromId("100");
            return;
        }
        let gs = Manager.serviceManager.get(GameService) as GameService;
        gs.realAuth(nameStr,idStr);
    }

    onClickClose(){
        Manager.uiManager.close(RealAuth);
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
