/**
 * @description 加载动画
 */

 import { Macro } from "../../framework/defines/Macros";
 import { Config, ViewZOrder } from "../config/Config";
 
 
 export default class FFLoading {
     private static _instance: FFLoading = null;
     public static Instance() { return this._instance || (this._instance = new FFLoading()); }
     /**@description 当前loading节点 */
     private _root: fgui.GComponent = null;
    //  private _fake: fgui.GComponent = null;
     constructor() {

     }

     static getViewPath(): ViewPath {
        let path : ViewPath = {
            	/**@description 资源路径 creator 原生使用*/
            assetUrl: "common/ui/base",
            /**@description 包名称 fgui 使用*/
            pkgName : "base",
            /**@description 资源名称 fgui 使用*/
            resName : "UILoading",
        }
        return path;
    }

     private _isWaitingHide = false;
     private delay : number = null;
    //  private text: fgui.GTextField = null;
     private _uiName = null;
 
     private init(){
        if (this._root == null){
            this._root = fgui.UIPackage.createObject(FFLoading.getViewPath().pkgName,FFLoading.getViewPath().resName).asCom;
            this._root.name = "FFLoading";
            // this._fake = this._root.getChild("fake").asCom;
            // this.text = this._fake.getChild("content").asTextField;
            // this.text.text = "0%";
            Manager.uiManager.addFairyView(this._root,ViewZOrder.UILoading);
            this._root.makeFullScreen();
            this._root.visible = false;
            // this._fake.visible = false;
        }
    }

    private loadFairy(bundle: BUNDLE_TYPE, path: ViewPath, progressCallback: (completedCount: number, totalCount: number, item: any) => void) {
        Manager.assetManager.loadFairy(bundle, path.assetUrl, cc.BufferAsset, progressCallback, (data) => {
            Log.e("FFLoading loadFairy data",data.data instanceof fgui.UIPackage);
            if (data && data.data && data.data instanceof fgui.UIPackage) {
                this.init();
                //第一次在预置体没加载好就被隐藏
                if (this._isWaitingHide) {
                    this._isWaitingHide = false;
                    this._root.visible = false;
                    return;
                }
                this.startTimeOutTimer(Config.LOAD_VIEW_TIME_OUT);
                // this._fake.visible = true;
                // if ( this.delay > 0 ){
                //     this._fake.visible = false;
                //     fgui.GTween.delayedCall(this.delay).setTarget(this._fake).onComplete(function(callback: Function, target?: any){
                //         this._fake.visible = true;
                //     },this);
                // }
                this._root.visible = true; 
            }
            else {
                Log.e("FFLoading loadFairy err",path.assetUrl);
            }
        });
    }


     /**
     * @description 显示全屏幕加载动画
     * @param delay 延迟显示时间 当为null时，不会显示loading进度，但会显示阻隔层 >0时为延迟显示的时间
     */
     public show( delay ?: number ,name ?: string) {
         if( delay == undefined || delay == null || delay < 0 ){
             this.delay = Config.LOAD_VIEW_DELAY;
         }else{
             this.delay = delay;
         }
         this._uiName = name ? name : "";
         this._show();
     }
     private _timerId : any = -1;
     private _simulateTimerId : any = -1;
     private _simulateProgress : number = 0;
     /**
      * @description 显示动画
      * @param timeOut 超时加载时间。默认10为加载界面失败
      * @param timeOutCb 超时回调
      */
     private _show() {
         this._isWaitingHide = false;
         let bundle = Manager.bundleManager.getBundle(Macro.BUNDLE_RESOURCES);
         this.loadFairy(bundle, FFLoading.getViewPath(), null);
     }
 
 
     /**@description 开始计时回调 */
     private startTimeOutTimer(timeout: number) {
         this.stopTimeOutTimer();
         if (timeout) {
             this._timerId = setTimeout(() => {
                 Manager.tips.debug(`加载界面${this._uiName ? this._uiName : ""}超时，请重试`);
                 this.hide();
                 this._isWaitingHide = false;
             }, timeout * 1000);
         }
     }
     /**@description 停止计时 */
     private stopTimeOutTimer() {
         clearTimeout(this._timerId);
         this._timerId = -1;
     }
 
 
     public hide() {
         this.stopTimeOutTimer();
         this.stopSimulateProgress();
         if (this._root) {
             this._isWaitingHide = true;
             this._root.visible = false;
         } else {
             //没有加载好预置体，置一个标记
             this._isWaitingHide = true;
         }
     }
 
     public updateProgress(progress: number) {
        //  if (this.text) {
        //      if (progress == undefined || progress == null || Number.isNaN(progress)) {
        //          this.hide();
        //          return;
        //      }
        //      if (progress >= 0 && progress <= 100) {
        //          this.text.text = `${progress}%`;
        //      }
        //  }
     }
 
     public startSimulateProgress() {
         this.stopSimulateProgress();
        //  if (this.text) {
        //      this._simulateTimerId = setInterval(() => {
        //          this._simulateProgress += 1;
        //          this.updateProgress(this._simulateProgress);
        //      }, 100);
     
        //  }
     }
 
     public stopSimulateProgress() {
         this._simulateTimerId = -1;
         this._simulateProgress = 0;
         clearInterval(this._simulateTimerId);
     }
 }
 