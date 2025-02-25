import { EntryDelegate } from "./EntryDelegate";
import { Macro } from "../../defines/Macros";
import { UpdateItem } from "../update/UpdateItem";


/**@description 入口管理 */
export class EntryManager {
    private static _instance: EntryManager = null!;
    public static Instance() { return this._instance || (this._instance = new EntryManager()); }
    private tag = "[EntryManager] : ";
    private _entrys: Map<string, Entry> = new Map();

    /**@description 默认代理，可根据自己项目需要重新实现 */
    public delegate: EntryDelegate = new EntryDelegate();

    private node: cc.Node | null = null;

    private entryQueue:any[] = [];

    private curDisposeGameView:string = "";

    
    /**@description 注册入口 */
    register(entryClass: EntryClass<Entry>) {
        let entry = this.getEntry(entryClass.bundle);
        if (entry) {
            if ( CC_DEBUG ){
                Log.w(`${this.tag}更新Bundle : ${entryClass.bundle} 入口程序!!!`);
            }
            this._entrys.delete(entryClass.bundle);
        }
        entry = new entryClass;
        entry.bundle = entryClass.bundle;
        this._entrys.set(entry.bundle, entry);
        if (this.node) {
            if ( CC_DEBUG ){
                Log.d(`${this.tag} ${entry.bundle} onLoad`);
            }
            entry.onLoad(this.node);
        }
    }

    onLoad(node: cc.Node) {
        this.node = node;
        this._entrys.forEach((entry,key)=>{
            if ( !entry.isRunning ){
                entry.onLoad(this.node);
                if ( entry.isMain ){
                    if ( CC_DEBUG ){
                        Log.d(`${this.tag}${entry.bundle} onEnter`);
                    }
                    //启动主程序入口
                    entry.onEnter();
                }
            }
        });
    }

    onDestroy(node: cc.Node) {
        this._entrys.forEach((entry) => {
            entry.onDestroy();
        });
    }

    /**@description 主包检测更新 */
    onCheckUpdate() {
        this.delegate.onCheckUpdate();
    }

    call(bundle: BUNDLE_TYPE, eventName: string, ...args: any[]) {
        let entry = this.getEntry(bundle);
        if (entry) {
            entry.call(eventName, args);
        }
    }

    /**
     * @description 进入bundle,默认代理没办法满足需求的情况，可自行定制 
     * @param bundle bundle
     * @param userData 用户自定义数据
     **/
    enterBundle(bundle: BUNDLE_TYPE , userData ?: any) {
        let config = this.delegate.getEntryConfig(bundle);
        if (config) {
            config.justDownload = false;
            if (bundle == Macro.BUNDLE_RESOURCES) {
                let entry = this.getEntry(bundle);
                this.entryQueue = [];
                this.delegate.onEnterMain(entry,userData);
            } else {
                if(this.entryQueue.length > 0){
                    if(bundle == this.entryQueue[0]){
                        return;
                    }
                }
                Log.d(this.tag,"enterBundle:",bundle,this.entryQueue);
                this.entryQueue.push(bundle);
                if(this.entryQueue.length == 1 && this.curDisposeGameView.length == 0){
                    Manager.bundleManager.enterBundle(config);
                }
            }
        }
    }

    /**@description 加载bundle完成 */
    onLoadBundleComplete(item:UpdateItem) {
        //通知入口管理进入bundle
        let entry = this.getEntry(item.bundle);
        if (entry) {
            entry.onEnter(item.userData);
        }else{
            Log.e("onLoadBundleComplete:err",item);
        }
    }

    /**@description 进入GameView完成，卸载除了自己之外的其它bundle */
    onEnterGameView(bundle: BUNDLE_TYPE, gameView: GameView) {
        let entry = this.getEntry(bundle);
        if (entry) {
            this.delegate.onEnterGameView(entry, gameView);
            entry.onEnterGameView(gameView);
        }
    }

    /**@description 管理器调用show时,在GameView的onLoad之后  */
    onShowGameView(bundle : BUNDLE_TYPE , gameView : GameView){
        let entry = this.getEntry(bundle);
        if ( entry ){

            Log.d(this.tag,"onShowGameView:",bundle,this.entryQueue);

            this.delegate.onShowGameView(entry,gameView);
            entry.onShowGameView(gameView);
            if(this.entryQueue.length <= 1){
                this.entryQueue = [];
                return;
            }
            if(bundle != this.entryQueue[0]){
                return;
            }
            let p = this.entryQueue.shift();
            Log.d(this.tag,"onShowGameView 1:",p,this.entryQueue);
            if(this.entryQueue.length > 0){
                let cur = this.entryQueue.shift();
                Log.d(this.tag,"onShowGameView 2:",cur,this.entryQueue);
                this.enterBundle(cur);
            }
        }
    }

    /**@description bundle管事器卸载bundle前通知 */
    onUnloadBundle(bundle: BUNDLE_TYPE) {
        let entry = this.getEntry(bundle);
        if (entry) {
            entry.onUnloadBundle();
        }
    }

    onDestroyGameView(bundle: BUNDLE_TYPE, gameView: GameView) {
        let entry = this.getEntry(bundle);
        if (entry) {
            entry.onUnloadBundle();
            entry.onDestroyGameView(gameView);
        }
    }

    onDestroyGameViewEnd(bundle: BUNDLE_TYPE, gameView: GameView) {
        Log.d("___onDestroyGameViewEnd:",bundle);
        this.curDisposeGameView = "";
        if(this.entryQueue.length > 0){
            let cur = this.entryQueue.shift();
            Log.d(this.tag,"onDestroyGameViewEnd end:",cur,this.entryQueue);
            this.enterBundle(cur);
        }
    }

    onDisposeGameView(bundle: BUNDLE_TYPE, gameView: GameView) {
        Log.d("___onDisposeGameView:",bundle);
        this.curDisposeGameView = bundle.toString();
    }

    /**@description 获取bundle入口 */
    getEntry(bundle: BUNDLE_TYPE) {
        let name = Manager.bundleManager.getBundleName(bundle);
        let entry = this._entrys.get(name)
        if (entry) {
            return entry;
        }
        return null;
    }

    print(delegate: ManagerPrintDelegate<Entry>) {
        if (delegate) {
            this._entrys.forEach((data)=>{
                delegate.print(data);
            });
        }
    }
}