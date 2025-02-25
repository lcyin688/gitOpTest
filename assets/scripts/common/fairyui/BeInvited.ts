
import { GroupId } from "../../def/GameEnums";
import { ProtoDef } from "../../def/ProtoDef";
import UIView from "../../framework/core/ui/UIView";
import { Config } from "../config/Config";
import GameData from "../data/GameData";
import { GameService } from "../net/GameService";
import Toast from "./Toast";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BeInvited extends UIView {

    private des_text:fgui.GObject=null;

    get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }

    static getViewPath(): ViewPath {
        let path : ViewPath = {
            	/**@description 资源路径 creator 原生使用*/
            assetUrl: "ui/hall",
            /**@description 包名称 fgui 使用*/
            pkgName : "hall",
            /**@description 资源名称 fgui 使用*/
            resName : "beInvitedView",
        }
        return path;
    }

    protected addEvents(): void 
    {

    }

    onLoad() {
        super.onLoad();
        this.show();
        this.ReFlashView()
    }

    onClickClose(){
        Manager.uiManager.close(BeInvited);
    }

    onFairyLoad(): void {
        Log.w("加载完成 onFairyLoad ")

        this.root.getChild("closeBtn").onClick(this.onClickClose,this);
        this.root.getChild("di").onClick(this.onClickClose,this);
        this.root.getChild("cancleBtn").asButton.getChild("title").text ="拒绝邀请"
        this.root.getChild("cancleBtn").onClick(this.onClickCancle,this);
        this.root.getChild("joinGameBtn").asButton.getChild("title").text ="加入游戏"
        this.root.getChild("joinGameBtn").onClick(this.onClickJoinGame,this);
        this.des_text= this.root.getChild("des")

    }


    public show(): void {
        super.show();
    }

    //加入游戏
    onClickJoinGame()
    {
        let data = Manager.gd.get<pb.S2CInviteNotify>(ProtoDef.pb.S2CInviteNotify);
        this.service.onC2SInviteNotify(data.target,data.inviterConnId,true)
        this.onClickClose()
    }
    //拒绝邀请
    onClickCancle()
    {
        let data = Manager.gd.get<pb.S2CInviteNotify>(ProtoDef.pb.S2CInviteNotify);
        this.service.onC2SInviteNotify(data.target,data.inviterConnId,false)
        this.onClickClose()
    }

       
    ReFlashView()
    {
        let data = Manager.gd.get<pb.S2CInviteNotify>(ProtoDef.pb.S2CInviteNotify);
        // Log.w("ReFlashView  data ; ",data)
        let desStr:string =String.format("玩家【{0}】邀请您一起玩\n [color=#ff0000]{1}[/color] 是否接受他的邀请",data.playerName,data.gameName)
        this.des_text.text = desStr;
    }


    
}


