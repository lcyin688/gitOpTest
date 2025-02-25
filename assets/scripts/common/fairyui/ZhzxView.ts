
import { ProtoDef } from "../../def/ProtoDef";
import UIView from "../../framework/core/ui/UIView";
import { Macro } from "../../framework/defines/Macros";
import { GameService } from "../net/GameService";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ZhzxView extends UIView {
    private content_com :fgui.GComponent = null;
    private content0_ob :fgui.GObject = null;
    private content1_com :fgui.GComponent = null;
    private content2_ob :fgui.GObject = null;



    private input1 :fgui.GTextInput = null;
    
    private input2 :fgui.GTextInput = null;


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
            resName : "ZhzxContext",
        }
        return path;
    }

    onLoad() {
        super.onLoad();
    }

    onFairyLoad(): void {
        this.content_com = this.root.getChild("content").asCom;
        this.content0_ob = this.content_com.getChild("content0");
        this.content1_com = this.content_com.getChild("content1").asCom;
        this.content2_ob = this.content_com.getChild("content2");
        this.content0_ob.makeFullScreen();
        this.content2_ob.makeFullScreen();

        
        this.content0_ob.visible =true;
        this.content1_com.visible =false;
        this.content2_ob.visible =false;

        this.content_com.getChild("close").onClick(this.onClickClose,this);
        this.content_com.getChild("sureBtn").onClick(this.onClickSureZX,this);
        this.content_com.getChild("closebtnFinal").onClick(()=>{
            setTimeout(() => {
                cc.game.end();
            }, 100);
        },this);

        let content = this.content1_com.asCom.getChild("content").asCom;
        this.input1=content.getChild("input1").asTextInput;
        this.input2=content.getChild("input2").asTextInput;
        content.getChild("close").onClick(()=>{ this.content1_com.visible =false; },this);
        content.getChild("btn1").onClick(this.onClickSureNext,this);
        Manager.utils.setInputTips(this.input1,"请输入姓名");
        Manager.utils.setInputTips(this.input2,"请输入身份证号");


    }



    onClickClose(){
        Log.d("onClickClose");
        Manager.uiManager.close(ZhzxView);
    }
    onClickSureZX(){
        let btn = this.content_com.getChild("Agreement").asCom.getChild("xy").asButton;
        if(!btn.selected){
            Manager.utils.CommonShowMsg("TS_Denglu_60");
            return
        }
        this.content1_com.visible =true;

    }
    
    onClickSureNext(){

        let nameStr = this.input1.text.trim();
        let idStr = this.input2.text.trim();
        if(nameStr.length == 0){
            Manager.utils.CommonShowMsg("TS_INPUT_NULL");
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
            Manager.utils.CommonShowMsg("100");
            return;
        }
        let gs = Manager.serviceManager.get(GameService) as GameService;
        gs.OnC2SLogoffAccount(nameStr,idStr);
        this.content0_ob.visible=false;
        this.content1_com.visible=false;
        this.content2_ob.visible=true;

    }


    




}
