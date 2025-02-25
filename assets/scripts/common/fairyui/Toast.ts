/**
 * @description 提示
 */

import { ViewZOrder } from "../config/Config";
import { HotfixConfig } from "../config/HotfixConfig";

class FariyToast {
    private root : fgui.GComponent = null;

    public constructor(text:string) {
        this.root = fgui.UIPackage.createObject("base","Tips").asCom;
        this.root.name = "FariyToast";
        this.root.getChild("content").text = text;
        Manager.uiManager.addFairyView(this.root, ViewZOrder.Tips);
        this.root.setPivot(0.5, 0.5);
        this.root.center();
        this.root.y = this.root.y / 2;
        this.root.y =300;
    }

    public run(durtime:number){
        fgui.GTween.to2(this.root.x, this.root.y, this.root.x, this.root.y-250, durtime)
        .setTarget(this.root, this.root.setPosition)
        .setEase(fgui.EaseType.Linear)
        .onComplete(()=>
        {
            let trans = this.root.getTransition("t1");
            if (trans){
                trans.play(this.close.bind(this));
            }
        },this)

    }

    public remove(){
        this.root.dispose();
    }

    private close(){
        Manager.tips.close(this);
    }
}
 
export default class Toast {

    private static _instance: Toast = null;
    public static Instance() { return this._instance || (this._instance = new Toast()); }

    // private _queue : string [] = [];
    private _queue : {str:string,durTime:number} [] = [];

    private handle: number = -1;

    private update(){
        if (this._queue.length > 0){
            let msg = this._queue.shift();
            new FariyToast(msg.str).run(msg.durTime);
            if (this._queue.length == 0 && this.handle > 0){
                clearInterval(this.handle);
                // Log.d("11111111", this.handle);
                this.handle = -1;
            }
        }
    }

    public show( msg : string ,durTime:number=1){
        if ( msg == null || msg == undefined || msg == ""){
            return;
        }
        // Log.d("Toast.show msg=%s %d",msg,this.handle);
        this._queue.push({str:msg,durTime:durTime});
        if (this.handle < 0){
            this.update();
            this.handle = setInterval(() => {
                this.update();
            }, 280);
            // Log.d("hd %d",msg,this.handle);
        }
    }

    public showFromId( id : string,params:string[]=null){
        let cfg = Manager.utils.GetTiShiConfigItem(id);
        if(cfg == null){
            Log.e("showFromId err",id);
            return;
        }

        if(cfg.NeiRong == null || cfg.NeiRong.length == 0){
            Manager.tips.debug("未知提示[-3]");
            return;
        }
        let tips = cfg.NeiRong;
        if(params != null && params.length > 0){
            tips = String.format(cfg.NeiRong, params);
            if(tips == null || tips.length == 0){
                Manager.tips.debug("未知提示[-2]");
                return;
            }
        }

        this.show(tips);
    }

    public debug( msg : string ){
        if(Manager.platform.isTestPkg()){
            this.show("[DEBUG] "+msg,1);
        }
    }

    public close(ft:FariyToast){
        ft.remove();
    }

    public clear(){
        this._queue = [];
    }

}