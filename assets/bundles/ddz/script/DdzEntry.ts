import { DdzData } from "./data/DdzData";
import { Entry } from "../../../scripts/framework/core/entry/Entry";
import { Config, ViewZOrder } from "../../../scripts/common/config/Config";
import DdzView from "./view/DdzView";
import { Update } from "../../../scripts/framework/core/update/Update";

class DdzEntry extends Entry {
    static bundle = Config.BUNDLE_DDZ;

    private get data(){
        return Manager.dataCenter.get(DdzData) as DdzData;
    }

    protected addNetHandler(): void {

    }
    protected removeNetHandler(): void {
        //大厅的到登录界面会自动初清除
        // Manager.netHelper.destoryHandler(HallHandler);
    }
    protected loadResources(completeCb: () => void): void {
        let fgui_url = "ui/gamecommon";
        let startTime = Manager.utils.milliseconds;
        Manager.assetManager.loadFairy(Config.BUNDLE_GameCOMMON, fgui_url, cc.BufferAsset, null, (data) => {
            if (data && data.data && data.data instanceof fgui.UIPackage) 
            {
                Log.e(" 加载成功~~~~~~~~~~~~ use time",fgui_url,Manager.utils.milliseconds-startTime);
                completeCb();
            }
            else
            {
                Log.e(" 加载失败~~~~~~~~~~~~ ",fgui_url);
            }
        });
    }
    protected openGameView(): void {
        // Manager.uiManager.openFairy({ type: HallView, zIndex: ViewZOrder.zero,bundle: this.bundle });
        Manager.uiManager.openFairy({ type: DdzView,bundle: this.bundle });
    }
    protected closeGameView(): void {
        Manager.uiManager.close(DdzView);
    }
    protected initData(): void {
        Config.ENTRY_CONFIG[Config.BUNDLE_GameCOMMON] = new Update.Config(Manager.getLanguage("gamecommonText"),Config.BUNDLE_GameCOMMON);
        Config.ENTRY_CONFIG[Config.BUNDLE_DDZ] = new Update.Config(Manager.getLanguage("ddzText"),Config.BUNDLE_DDZ);
    }
    protected pauseMessageQueue(): void {
        
    }
    protected resumeMessageQueue(): void {
        
    }

    /**@description 卸载bundle,即在自己bundle删除之前最后的一条消息 */
    onUnloadBundle(): void {
        Manager.dataCenter.destory(DdzData);
        super.onUnloadBundle();
    }
}

Manager.entryManager.register(DdzEntry);
