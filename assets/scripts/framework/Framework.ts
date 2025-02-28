import { Dispatcher } from "./core/event/Dispatcher";
import { UIManager } from "./core/ui/UIManager";
import { LocalStorage } from "./core/storage/LocalStorage";
import { AssetManager } from "./core/asset/AssetManager";
import { CacheManager } from "./core/asset/CacheManager";
import { NodePoolManager } from "./core/nodePool/NodePoolManager";
import { BundleManager } from "./core/asset/BundleManager";
import { CocosExtentionInit } from "./plugin/CocosExtention";
import { Language } from "./core/language/Language";
import { Macro } from "./defines/Macros";
import { ProtoManager } from "./core/net/service/ProtoManager";
import { EntryManager } from "./core/entry/EntryManager";
import { DataCenter } from "./data/DataCenter";
import { LogicManager } from "./core/logic/LogicManager";
import { LoggerImpl } from "./core/log/Logger";
import NetHelper from "./core/net/service/NetHelper";
import { ServiceManager } from "./core/net/service/ServiceManager";
import GameData from "../common/data/GameData";
import { UpdateManager } from "./core/update/UpdateManager";
import { ReleaseManager } from "./core/asset/ReleaseManager";


/**@description 框架层使用的各管理器单例的管理 */
export class Framewok {

    /**@description 资源是否懒释放，true时，只有收到平台的内存警告才会释放资源，还有在更新时才分释放,否则不会释放资源 */
    get isLazyRelease(){
        return false;
    }

    /**@description 瓷业释放管理 */
    get releaseManger(){
        return getSingleton(ReleaseManager);
    }

    /**@description 网络Service管理器 */
    get serviceManager() {
        return getSingleton(ServiceManager);
    }
    
    /**@description 网络辅助类 */
    get netHelper(){
        return getSingleton(NetHelper);
    }

    /**@description 日志 */
    get logger(){
        return getSingleton(LoggerImpl);
    }

    /**@description 逻辑管理器 */
    get logicManager(){
        return getSingleton(LogicManager);
    }

    /**@description 数据中心 */
    get dataCenter(){
        return getSingleton(DataCenter);
    }

    /**@description 入口管理器 */
    get entryManager(){
        return getSingleton(EntryManager);
    }

    /**@description protobuf类型管理 */
    get protoManager(){
        return getSingleton(ProtoManager);
    }

    /**@description bundle管理器 */
    get bundleManager() {
        return getSingleton(BundleManager);
    }

    /**@description 热更新管理器 */
    get updateManager() { return getSingleton(UpdateManager) }

    /**@description 常驻资源指定的模拟view */
    get retainMemory() { return this.uiManager.retainMemory; }

    /**@description 语言包 */
    get language() {
        return getSingleton(Language);
    }

    /**@description 事件派发器 */
    get dispatcher() {
        return getSingleton(Dispatcher);
    }

    /**@description 界面管理器 */
    get uiManager() {
        return getSingleton(UIManager);
    }

    /**@description 本地仓库 */
    get localStorage() {
        return getSingleton(LocalStorage);
    }

    /**@description 资源管理器 */
    get assetManager() {
        return getSingleton(AssetManager);
    }

    /**@description 资源缓存管理器 */
    get cacheManager() {
        return getSingleton(CacheManager);
    }

    /**@description 对象池管理器 */
    get nodePoolManager() {
        return getSingleton(NodePoolManager);
    }

    /**@description 小提示 */
    get tips() : any{
        return null;
    }

    /**@description 界面加载时的全屏Loading,显示加载进度 */
    get uiLoading():any {
        return null;
    }

    /**@description websocket wss 证书url地址 */
    get wssCacertUrl() {
        return "";
    }

    /**@description 当前游戏GameView, GameView进入onLoad赋值 */
    gameView: GameView | null = null;

    getGameView<T extends GameView>(){
        return <T>this.gameView;
    }

    get gd():GameData{
        return this.dataCenter.get(GameData);
    }

    makeLanguage(param: string | (string | number)[], bundle: BUNDLE_TYPE = Macro.BUNDLE_RESOURCES): (string | number)[] | string {
        if (typeof param == "string") {
            if (bundle) {
                return `${Macro.USING_LAN_KEY}${bundle}.${param}`;
            }
            return `${Macro.USING_LAN_KEY}${param}`;
        }
        if (typeof param[0] == "string" && param instanceof Array) {
            if (bundle) {
                param[0] = `${Macro.USING_LAN_KEY}${bundle}.${param[0]}`;
            } else {
                param[0] = `${Macro.USING_LAN_KEY}${param[0]}`;
            }
        }
        return param;
    }

    /**
     * @description 获取语言包 
     * 
     */
    getLanguage(param: string | (string | number)[], bundle: BUNDLE_TYPE | null = null): any {
        if ( !bundle ){
            bundle = Macro.BUNDLE_RESOURCES;
        }
        let key = "";
        if (typeof param == "string") {
            key = `${Macro.USING_LAN_KEY}${bundle}.${param}`;
            return this.language.get([key]);
        }
        if (typeof param[0] == "string" && param instanceof Array) {
            param[0] = `${Macro.USING_LAN_KEY}${bundle}.${param[0]}`;
            return this.language.get(param);
        }
        Log.e(`传入参数有误`);
        return "";
    }

    init(){
        //引擎扩展初始化
        CocosExtentionInit();
    }

    onLowMemory(){
        this.releaseManger.onLowMemory();
    }
}
