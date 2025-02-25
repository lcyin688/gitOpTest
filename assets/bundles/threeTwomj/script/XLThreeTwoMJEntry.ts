import { Config } from "../../../scripts/common/config/Config";
import { Entry } from "../../../scripts/framework/core/entry/Entry";
import { MJData } from "../../mjcommon/script/data/MJData";
import { MJLanguage } from "../../mjcommon/script/data/MJLanguage";
import XLThreeTwoMJView from "../../threeTwomj/script/view/XLThreeTwoMJView";
import XLThreeTwoMJHandler from "./net/XLThreeTwoMJHandler";



class XLThreeTwoMJEntry extends Entry {
    static bundle = Config.BUNDLE_XLThreeTwo;
    protected language = new MJLanguage;

    private get data(){
        return Manager.dataCenter.get(MJData) as MJData;
    }

    protected addNetHandler(): void {
        Manager.netHelper.getHandler(XLThreeTwoMJHandler,true);
    }
    protected removeNetHandler(): void {
        //大厅的到登录界面会自动初清除
        // Manager.netHelper.destoryHandler(HallHandler);
    }

    protected loadResources(completeCb: () => void): void {
        // Log.e(" loadResources  XLThreeTwoMJEntry ");

        let fgui_url = "ui/gamecommon";
        let startTime = Manager.utils.milliseconds;
        Manager.assetManager.loadFairy(Config.BUNDLE_GameCOMMON, fgui_url, cc.BufferAsset, null, (data) => {
            if (data && data.data && data.data instanceof fgui.UIPackage) 
            {
                // Log.e("shibai data  000   ",data)
                Log.e(" 加载成功~~~~~~~~~~~~ use time",fgui_url,Manager.utils.milliseconds-startTime);
                let fgui_url1 = "ui/mjcommon";
                startTime = Manager.utils.milliseconds;
                Manager.assetManager.loadFairy(Config.BUNDLE_MJCOMMON, fgui_url1, cc.BufferAsset, null, (data) => {
                    if (data && data.data && data.data instanceof fgui.UIPackage) {
                        // Log.d(" 加载完成~~~~~~~~~~~~ ");
                        Log.e(" 加载成功~~~~~~~~~~~~ use time",fgui_url1,Manager.utils.milliseconds-startTime);
                        completeCb();
                    }else{
                        // Log.e(" 加载失败~~~~~~~~~~~~1 ",fgui_url1);
                    }
                });

            }
            // else
            // {
            //         Log.e("shibai data  ",data)
            //     Log.e(" 加载失败~~~~~~~~~~~~ 不是吧 ",fgui_url);
            // }
        });

        // let fgui_url = "ui/gamecommon";
        // Manager.assetManager.loadFairy(Config.BUNDLE_MJCOMMON, fgui_url, cc.BufferAsset, null, (data) => {
        //     if (data && data.data && data.data instanceof fgui.UIPackage) {
        //         let fgui_url1 = "ui/mjcommon";
        //         Manager.assetManager.loadFairy(Config.BUNDLE_MJCOMMON, fgui_url1, cc.BufferAsset, null, (data) => {
        //             if (data && data.data && data.data instanceof fgui.UIPackage) {
        //                 Log.d(" 加载完成~~~~~~~~~~~~ ");
        //                 completeCb();
        //             }else{
        //                 Log.e(" 加载失败~~~~~~~~~~~~1 ",fgui_url1);
        //             }
        //         });

        //     }
        //     else
        //     {
        //         Log.e(" 加载失败~~~~~~~~~~~~ ",fgui_url);
        //     }
        // });
    }
    protected  openGameView(): void {
        Log.e(" openGameView XLThreeTwoMJView ");

        Manager.uiManager.openFairy({ type: XLThreeTwoMJView, bundle: this.bundle });
        
    }
    protected  closeGameView(): void {
        Manager.uiManager.close(XLThreeTwoMJView);
    }
    protected initData(): void {
        //初始化网络
        // Manager.serviceManager.get(LobbyService,true);
        //向Config.ENTRY_CONFIG合并配置
    }
    protected pauseMessageQueue(): void {
        
    }
    protected resumeMessageQueue(): void {
        
    }

    /**@description 卸载bundle,即在自己bundle删除之前最后的一条消息 */
    onUnloadBundle(): void {
        super.onUnloadBundle();
    }
}

Manager.entryManager.register(XLThreeTwoMJEntry);
