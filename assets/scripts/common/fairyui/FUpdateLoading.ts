/**
 * @description 加载动画
 */
 import { Update } from "../../framework/core/update/Update";
import { Macro } from "../../framework/defines/Macros";
 import { ViewZOrder } from "../config/Config";
 
 export default class FUpdateLoading {
     protected static _instance: FUpdateLoading = null;
     public static Instance() { return this._instance || (this._instance = new FUpdateLoading()); }
 
     private _isWaitingHide:boolean = false;
     /**@description 当前loading节点 */
     protected _root: fgui.GComponent = null;
     private _tempStr:string = "";
     private _downloadedBytes:number = 0;
     private _lastUpdateTime:number = 0;
     constructor() {
  
     }
     static getViewPath(): ViewPath {
         let path : ViewPath = {
                 /**@description 资源路径 creator 原生使用*/
             assetUrl: "common/ui/base",
             /**@description 包名称 fgui 使用*/
             pkgName : "base",
             /**@description 资源名称 fgui 使用*/
             resName : "Downloading",
         }
         return path;
     }
 
     protected _text : fgui.GTextField = null;
     protected _bar : fgui.GProgressBar = null;

     private init(){
         if (this._root == null){
             this._root = fgui.UIPackage.createObject(FUpdateLoading.getViewPath().pkgName,FUpdateLoading.getViewPath().resName).asCom;
             this._root.name = "FUpdateLoading";
             this._text = this._root.getChild("tips").asRichTextField;
             if(this._tempStr.length > 0){
                this._text.text = this._tempStr;
                this._tempStr = "";
             }
             this._bar = this._root.getChild("progressBar").asProgress;
             let bgSpine = this._root.getChild("bgspine") as fgui.GLoader3D;
             if(bgSpine != null){
                bgSpine.animationName = "ani2";
                bgSpine.loop = true;
             }
             Manager.uiManager.addFairyView(this._root,ViewZOrder.Loading);
             this._root.makeFullScreen();
             this._root.visible = false;
             this._bar.visible = false;
            //  this._root.onClick(this.test,this);
         }
     }

     public show(text:string="") {
         if(this._text != null){
            this._text.text = text;
         }else{
            this._tempStr = text;
         }
         this._lastUpdateTime = Manager.utils.milliseconds;
         this._show();
         return this;
     }
 
     private loadFairy(bundle: BUNDLE_TYPE, path: ViewPath, progressCallback: (completedCount: number, totalCount: number, item: any) => void) {
        this._isWaitingHide = false;
         Manager.assetManager.loadFairy(bundle, path.assetUrl, cc.BufferAsset, progressCallback, (data) => {
             if (data && data.data && data.data instanceof fgui.UIPackage) {
                 this.init();
                 this._root.visible = true; 
                 Log.e("loadFairy FUpdateLoading",this._isWaitingHide);
                 //第一次在预置体没加载好就被隐藏
                 if (this._isWaitingHide) {
                     this._isWaitingHide = false;
                     this._root.visible = false;
                     return;
                 }
             }
             else {
                 Log.e("loadFairy err",path.assetUrl);
             }
         });
     }
 
    protected async _show( ){
        let bundle = Manager.bundleManager.getBundle(Macro.BUNDLE_RESOURCES);
        this.loadFairy(bundle, FUpdateLoading.getViewPath(), null);
    }
 
    public updateProgressInfo(info: Update.DownLoadInfo) {
        let speed = "0kb/s";
        if(this._downloadedBytes > 0 && this._lastUpdateTime > 0){
            let updateBytes = info.downloadedBytes - this._downloadedBytes;
            let updateTimes = Manager.utils.milliseconds - this._lastUpdateTime;
            if(updateTimes > 0){
                let updateSpeed = Math.floor(updateBytes / updateTimes);
                if(updateSpeed<1024){
                    speed = updateSpeed+"kb/s";
                }else{
                    speed = (updateSpeed/1024).toFixed(2)+"m/s";
                }
            }
        }
        this._downloadedBytes = info.downloadedBytes;
        this._lastUpdateTime = Manager.utils.milliseconds;

        var progress = info.progress;
        if (this._text) {
            if (progress == undefined || progress == null || Number.isNaN(progress)) {
                return;
            }
            if (this._root && this._root.visible == false) {
                this._root.visible = true;
            }
            progress = progress * 100;
            if(progress < 0){
                progress = 0;
            }
            if(progress > 100){
                progress = 100;
            }
     
            this._text.text = (info.downloadedBytes/1024/1024).toFixed(2)+"M/"+(info.totalBytes/1024/1024).toFixed(2) + "M " + speed;

            this.updateProgress(progress);
        }
    }

    public updateProgress(progress: number) {
        if (this._bar) {
            this._bar.value = progress;
            if(progress > 0 && this._bar.visible == false){
                this._bar.visible = true;
            }
        }
    }
 
    public hide() {
        this.updateProgress(0);
        this._downloadedBytes = 0;
        if(this._bar){
            this._bar.visible = false;
        }
        this._lastUpdateTime = Manager.utils.milliseconds;
        if (this._root) {
            this._root.visible = false;
        }else{
            this._isWaitingHide = true;
        }
    }
 }
 