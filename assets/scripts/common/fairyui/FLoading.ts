/**
 * @description 加载动画
 */
import { Macro } from "../../framework/defines/Macros";
import { Config, ViewZOrder } from "../config/Config";

export default class FLoading {
    protected static _instance: FLoading = null;
    public static Instance() { return this._instance || (this._instance = new FLoading()); }

    private _timeout : number;
    /**@description 当前loading节点 */
    protected _root: fgui.GComponent = null;
    constructor() {
 
    }
    static getViewPath(): ViewPath {
        let path : ViewPath = {
            	/**@description 资源路径 creator 原生使用*/
            assetUrl: "common/ui/base",
            /**@description 包名称 fgui 使用*/
            pkgName : "base",
            /**@description 资源名称 fgui 使用*/
            resName : "Loading",
        }
        return path;
    }

    /**@description 是否等待关闭 */
    protected _isWaitingHide = false;
    /**@description 是否正在加载预置 */
    protected _isLoadingPrefab = false;
    private _timeOutCb ?: ()=>void;
    /**@description 显示超时回调 */
    public set timeOutCb(value){
        this._timeOutCb = value;
    }
    public get timeOutCb(){
        return this._timeOutCb;
    }

    /**@description 显示的Loading提示内容 */
    protected _content : string[] = [];
    private _showContentIndex = 0;

    /**@description 超时回调定时器id */
    private _timerId:any = -1;

    /**@description 显示的提示 */
    protected _text : fgui.GTextField = null;


    private init(){
        if (this._root == null){
            this._root = fgui.UIPackage.createObject(FLoading.getViewPath().pkgName,FLoading.getViewPath().resName).asCom;
            this._root.name = "FLoading";
            this._text = this._root.getChild("content").asRichTextField;
            Manager.uiManager.addFairyView(this._root,ViewZOrder.Loading);
            this._root.makeFullScreen();
            this._root.visible = false;
        }
    }
    /**
     * @description 显示Loading
     * @param content 提示内容
     * @param timeOutCb 超时回调
     * @param timeout 显示超时时间
     */
    public show( content : string | string[] , timeOutCb?:()=>void,timeout = Config.LOADING_TIME_OUT ) {
        this._timeOutCb = timeOutCb;
        if( Array.isArray(content) ){
            this._content = content;
        }else{
            this._content = [];
            this._content.push(content);
        }
        this._timeout = timeout;
        this._show();
        return this;
    }

    public showId( content : string | string[] , timeOutCb?:()=>void,timeout = Config.LOADING_TIME_OUT ) {
        if(!Array.isArray(content)){
            let cfg = Manager.utils.GetTiShiConfigItem(content);
            if(cfg != null){
                content = cfg.NeiRong;
            }
        }
        return this.show(content,timeOutCb,timeout);
    }


    private loadFairy(bundle: BUNDLE_TYPE, path: ViewPath, progressCallback: (completedCount: number, totalCount: number, item: any) => void) {
        Manager.assetManager.loadFairy(bundle, path.assetUrl, cc.BufferAsset, progressCallback, (data) => {
            if (data && data.data && data.data instanceof fgui.UIPackage) {
                this.init();
                this.startShowContent();
                this._root.visible = true; 
                //第一次在预置体没加载好就被隐藏
                if (this._isWaitingHide) {
                    // cc.error(`sssssssss`);
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

    protected async _show( ) {
        this._isWaitingHide = false;
        this._showContentIndex = 0;
        let bundle = Manager.bundleManager.getBundle(Macro.BUNDLE_RESOURCES);
        this.loadFairy(bundle, FLoading.getViewPath(), null);
        this.startTimeOutTimer(this._timeout);
    }

    protected startShowContent( ){
        if( this._content.length == 1 ){
            this._text.text = this._content[0];
        }else{
            cc.Tween.stopAllByTarget(this._text.node);
            cc.tween(this._text.node)
            .call(()=>{
                this._text.text = this._content[this._showContentIndex];
            })
            .delay(Config.LOADING_CONTENT_CHANGE_INTERVAL)
            .call(()=>{
                this._showContentIndex ++;
                if( this._showContentIndex >= this._content.length ){
                    this._showContentIndex = 0;
                }
                this.startShowContent();
            })
            .start();
        }
    }

    private stopShowContent(){
        if( this._text ){
            cc.Tween.stopAllByTarget(this._text.node);
        }
    }

    /**@description 开始计时回调 */
    protected startTimeOutTimer(timeout: number) {
        if (timeout > 0) {
            this._timerId = setTimeout(() => {
                this._timeOutCb && this._timeOutCb();
                this.hide();
                this._isWaitingHide = false;
            }, timeout * 1000);
        }
    }
    /**@description 停止计时 */
    protected stopTimeOutTimer( ) {
        this._timeOutCb = undefined;
        clearTimeout(this._timerId);
        this._timerId = -1;
    }

    public hide() {
        this.stopShowContent();
        this.stopTimeOutTimer();
        // Log.d("hide:","hidehide",this._root);
        if (this._root) {
            this._root.visible = false;
        } else {
            //没有加载好预置体，置一个标记
            this._isWaitingHide = true;
        }
    }
}
