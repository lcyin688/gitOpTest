
/**
 * @description 登录流程 , 不用导出
 */

import { Config, ViewZOrder } from "../common/config/Config";
import { Macro } from "../framework/defines/Macros";
import { Entry } from "../framework/core/entry/Entry";
import MainView from "./view/MainView";
import {GameService} from "../common/net/GameService";
import MainHandler from "./MainHandler";
import {Global} from "../common/data/Global";
import GameData from "../common/data/GameData";
import { setLabelFont } from "../framework/plugin/CocosUtils";
import { Update } from "../framework/core/update/Update";
import { ProtoDef } from "../def/ProtoDef";

class MainEntry extends Entry {
    static bundle = Macro.BUNDLE_RESOURCES;
    /**@description 是否是主包入口，只能有一个主包入口 */
    isMain = true;

    protected addNetHandler(): void {
        Manager.netHelper.getHandler(MainHandler,true);
    }
    protected removeNetHandler(): void {
        Manager.netHelper.destoryHandler(MainHandler);
    }
    protected loadResources(completeCb: () => void): void {
        // Log.d("11111111111111111111111111111122222");
        Manager.assetManager.loadFairy(Macro.BUNDLE_RESOURCES, MainView.getViewPath().assetUrl, cc.BufferAsset, null, (data) => {
            if (data && data.data && data.data instanceof fgui.UIPackage) 
            {
                Manager.protoManager.load(this.bundle).then((isSuccess)=>{
                    Log.d("=====pbloaded");

                    // let S2CChat = Manager.protoManager.getProto(ProtoDef.pb.S2CChat);
                    // let ct = new S2CChat();
                    // ct.id = 1000;
                    // ct.param = "2021adfas";

                    // let Req = Manager.protoManager.getProto(ProtoDef.rpc.Request);
                    // let req = new Req();
                    // req.method = "200";
                    // req.serialized_request = ct.toArrayBuffer();
                    // let ab = req.toArrayBuffer();
                    // Log.d("=============",req,ab);

                    // let req1 = Req.decode(ab);
                    // Log.d("=============",req1);
                    completeCb()
                })
            }
            else
            {
                Log.e("加载Macro.BUNDLE_RESOURCES err",Macro.BUNDLE_RESOURCES);
            }
        });
    }
    protected openGameView(): void {
        Manager.uiManager.openFairy({ type: MainView, zIndex: ViewZOrder.zero, bundle: this.bundle });
        // Manager.uiManager.open({ type: MainView, zIndex: ViewZOrder.zero, bundle: this.bundle });
        Manager.entryManager.onCheckUpdate();
    }
    protected closeGameView(): void {
        Manager.uiManager.close(MainView);
    }
    protected initData(): void {
        Manager.serviceManager.get(GameService,true);
        Manager.dataCenter.get(GameData,true);
        Config.ENTRY_CONFIG[Config.BUNDLE_HALL] = new Update.Config(Manager.getLanguage("hallText"),Config.BUNDLE_HALL);
        Config.ENTRY_CONFIG[Macro.BUNDLE_RESOURCES] = new Update.Config(Manager.getLanguage("mainPack"),Macro.BUNDLE_RESOURCES)
        Manager.gd.clearCache();
        Log.e("Config.ENTRY_CONFIG",Config.ENTRY_CONFIG);
    }
    protected pauseMessageQueue(): void {
        
    }
    protected resumeMessageQueue(): void {
        
    }

    
    /**@description 管理器通知自己进入GameView */
    onEnter(isQuitGame : boolean) {
        super.onEnter(isQuitGame);
        Log.d(`--------------onEnterMainView--------------`);
    }

    /**@description 这个位置说明自己GameView 进入onLoad完成 */
    onEnterGameView(gameView:GameView) {
        super.onEnterGameView(gameView);
        cc.sys.localStorage.setItem('EnterPropStorage',0);
        let data = Manager.dataCenter.get(Global) as Global;
        if (data.prevWhere != Macro.UNKNOWN){
            //销毁所有网络Handler
            // Manager.netHelper.clearHandler();
            //销毁所有网络Sender
            // Manager.netHelper.clearSender();
            //关闭网络
            Manager.serviceManager.close();
            // 卸载proto
            // Manager.protoManager.unload();
        }

        //关闭除登录之外的界面
        Manager.uiManager.closeExcept([MainView]);
        if (data.prevWhere != Macro.UNKNOWN){
            //清理所有数据中数据
            Manager.dataCenter.clear();
        }
    }

    /**@description 卸载bundle,即在自己bundle删除之前最后的一条消息 */
    onUnloadBundle() {
        //移除本模块网络事件
        this.removeNetHandler();
        //卸载资源
        this.unloadResources();
    }
}
Manager.entryManager.register(MainEntry);
