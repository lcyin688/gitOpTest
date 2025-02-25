import GlobalAudio from "./scripts/common/component/GlobalAudio";
import { CmmEntry } from "./scripts/common/entry/CmmEntry";
import CommonPop from "./scripts/common/fairyui/CommonPop";
import FairyAlert from "./scripts/common/fairyui/FairyAlert";
import FFLoading from "./scripts/common/fairyui/FFLoading";
import FLoading from "./scripts/common/fairyui/FLoading";
import { FReconnect } from "./scripts/common/fairyui/FReconnect";
import FUpdateLoading from "./scripts/common/fairyui/FUpdateLoading";
import Toast from "./scripts/common/fairyui/Toast";
import UIQueue from "./scripts/common/fairyui/UIQueue";
import { CommonLanguage } from "./scripts/common/language/CommonLanguage";
import { ADManeger } from "./scripts/common/utils/ADManeger";
import BundleExtend from "./scripts/common/utils/BundleExtend";
import Reward from "./scripts/common/utils/GeneralReward";
import { Pay } from "./scripts/common/utils/Pay";
import { Platform } from "./scripts/common/utils/Platform";
import { Utils } from "./scripts/common/utils/Utils";
import { LogLevel } from "./scripts/framework/defines/Enums";
import { Framewok } from "./scripts/framework/Framework";

/**@description 游戏所有运行单例的管理 */
export class _Manager extends Framewok implements GameEventInterface {

    public netMode : boolean = true;
    get isLazyRelease(){
        Log.w(`需要使用都自己导出cc.game.EVENT_LOW_MEMORY事件`);
        return true;
    }

    get utils(){
        return getSingleton(Utils);
    }

    get reward(){
        return getSingleton(Reward);
    }

    get commonPop(){
        return getSingleton(CommonPop);
    }

    get bundleExtend(){
        return getSingleton(BundleExtend);
    }

    get platform(){
        return getSingleton(Platform);
    }

    get uiqueue(){
        return getSingleton(UIQueue);
    }

    get adManeger(){
        return getSingleton(ADManeger);
    }

    /**@description 进入后台的时间 */
    private _enterBackgroundTime = 0;

    /**@description 重连专用提示UI部分 */
    get uiReconnect( ){
        // return getSingleton(UIReconnect);
        return getSingleton(FReconnect);
    }

    /**@description 小提示 */
    get tips() {
        // return getSingleton(Tips);
        return getSingleton(Toast);
    }

    /**@description 界面加载时的全屏Loading,显示加载进度 */
    get uiLoading() {
        // return getSingleton(UILoading);
        return getSingleton(FFLoading);
    }

    /**@description 弹出提示框,带一到两个按钮 */
    get alert() {
        // return getSingleton(Alert);
        return getSingleton(FairyAlert);
    }

    /**@description 公共loading */
    get loading() {
        // return getSingleton(Loading);
        return getSingleton(FLoading);
    }

    get updateLoading(){
        return getSingleton(FUpdateLoading);
    }
    
    private _wssCacertUrl = "";
    /**@description websocket wss 证书url地址 */
    set wssCacertUrl(value) {
        this._wssCacertUrl = value;
    }
    get wssCacertUrl() {
        return this._wssCacertUrl;
    }

    get isBrowser( ){
        return cc.sys.platform == cc.sys.WECHAT_GAME || CC_PREVIEW || cc.sys.isBrowser;
    }

    get pay( ){
        return getSingleton(Pay);
    }

    /**@description 全局网络播放声音组件，如播放按钮音效，弹出框音效等 */
    private _globalAudio: GlobalAudio = null!;
    get globalAudio() {
        if (this._globalAudio) {
            return this._globalAudio;
        }
        this._globalAudio = this.uiManager.addComponent(GlobalAudio);
        return this._globalAudio;
    }

    autoDebug(){
        if(this.isBrowser){
            cc.debug.setDisplayStats(true);
        }else{
            cc.debug.setDisplayStats(false);
        }
    }

    init() {
        Log.d("=============Application.init=========");
        cc["platform"] = Manager.platform;
        super.init();
        this.updateManager.init();

        //初始化自定主entry代理
        this.entryManager.delegate = new CmmEntry();
        //语言包初始化
        //cc.log("language init");
        this.language.addSourceDelegate(new CommonLanguage);
    }

    onLoad(node: cc.Node) {
        //预先加载下loading预置体
        Manager.uiManager.onLoad(node);
        //Service onLoad
        Manager.serviceManager.onLoad();
        //入口管理器
        Manager.entryManager.onLoad(node);
    }

    update(node: cc.Node) {
        //Service 网络调试
        Manager.serviceManager.update();

        //远程资源下载任务调度
        Manager.assetManager.remote.update();
    }

    onDestroy(node: cc.Node) {
        Manager.serviceManager.onDestroy();
        //入口管理器
        Manager.entryManager.onDestroy(node);
    }

    onEnterBackground(): void {
        this._enterBackgroundTime = Date.timeNow();
        Log.d(`[MainController]`, `onEnterBackground ${this._enterBackgroundTime}`);
        Manager.globalAudio.onEnterBackground();
        Manager.serviceManager.onEnterBackground();
    }
    onEnterForgeground(): void {
        let now = Date.timeNow();
        let inBackgroundTime = now - this._enterBackgroundTime;
        Log.d(`[MainController]`, `onEnterForgeground ${now} background total time : ${inBackgroundTime}`);
        Manager.globalAudio.onEnterForgeground(inBackgroundTime);
        Manager.serviceManager.onEnterForgeground(inBackgroundTime);
    }
}

let mgr = new _Manager();
mgr.logger.level = LogLevel.ALL;
(<any>window)["Manager"] = mgr;
mgr.init();