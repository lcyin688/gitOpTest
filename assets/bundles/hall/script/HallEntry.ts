import HallView from "./view/HallView";
import { HallData } from "./data/HallData";
import { Entry } from "../../../scripts/framework/core/entry/Entry";
import { Config, ViewZOrder } from "../../../scripts/common/config/Config";
import HallHandler from "./net/HallHandler";
import { Update } from "../../../scripts/framework/core/update/Update";
import { ProtoDef } from "../../../scripts/def/ProtoDef";
import { Rely } from "../../../scripts/common/utils/BundleExtend";

class HallEntry extends Entry {
    static bundle = Config.BUNDLE_HALL;

    private get data(){
        return Manager.dataCenter.get(HallData) as HallData;
    }

    protected addNetHandler(): void {
        Manager.netHelper.getHandler(HallHandler,true);
    }
    protected removeNetHandler(): void {
        //大厅的到登录界面会自动初清除
        // Manager.netHelper.destoryHandler(HallHandler);
    }
    protected loadResources(completeCb: () => void): void {
        // Manager.protoManager.load(this.bundle).then((isSuccess)=>{S2CTipMsg
        //     completeCb();
        // })
        Manager.utils.GetDaoJuConfig();
        completeCb();
    }
    protected openGameView(): void {
        // Manager.uiManager.openFairy({ type: HallView, zIndex: ViewZOrder.zero,bundle: this.bundle });
        Manager.uiManager.openFairy({ type: HallView,bundle: this.bundle });
    }
    protected closeGameView(): void {
        Manager.uiManager.close(HallView);
    }
    protected initData(): void {
        //初始化网络
        // Manager.serviceManager.get(LobbyService,true);
        //向Config.ENTRY_CONFIG合并配置

        Manager.bundleExtend.clearAmend();

        Config.ENTRY_CONFIG[Config.BUNDLE_GameCOMMON] = new Update.Config(Manager.getLanguage("gamecommonText"),Config.BUNDLE_GameCOMMON);
        Config.ENTRY_CONFIG[Config.BUNDLE_MJCOMMON] = new Update.Config(Manager.getLanguage("mjcommonText"),Config.BUNDLE_MJCOMMON);
        Config.ENTRY_CONFIG[Config.BUNDLE_XLHZ] = new Update.Config(Manager.getLanguage("xlhzmjText"),Config.BUNDLE_XLHZ);
        Config.ENTRY_CONFIG[Config.BUNDLE_XLThreeTwo] = new Update.Config(Manager.getLanguage("xlhzmjText"),Config.BUNDLE_XLThreeTwo);
        Config.ENTRY_CONFIG[Config.BUNDLE_DDZ] = new Update.Config(Manager.getLanguage("ddzText"),Config.BUNDLE_DDZ);

        Manager.bundleExtend.bindRely(Config.BUNDLE_XLHZ ,[new Rely(4,Config.BUNDLE_GameCOMMON),new Rely(45,Config.BUNDLE_MJCOMMON),new Rely(1.5,Config.BUNDLE_XLHZ)]);
        Manager.bundleExtend.bindRely(Config.BUNDLE_XLThreeTwo ,[new Rely(4,Config.BUNDLE_GameCOMMON),new Rely(45,Config.BUNDLE_MJCOMMON),new Rely(1.5,Config.BUNDLE_XLThreeTwo)]);
        Manager.bundleExtend.bindRely(Config.BUNDLE_DDZ ,[new Rely(4,Config.BUNDLE_GameCOMMON),new Rely(9,Config.BUNDLE_DDZ)]);

        let data = Manager.gd.get<pb.S2CGetTables>(ProtoDef.pb.S2CGetTables);
        if(data != null && data.quick != null){
            data.quick = null;
        }
        Log.e("HallView Config.ENTRY_CONFIG:",Config.ENTRY_CONFIG);
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

Manager.entryManager.register(HallEntry);

