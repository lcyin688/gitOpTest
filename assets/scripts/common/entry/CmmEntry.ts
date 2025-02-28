import { EntryDelegate } from "../../framework/core/entry/EntryDelegate";
import { UpdateItem } from "../../framework/core/update/UpdateItem";
import { Macro } from "../../framework/defines/Macros";
import { Config } from "../config/Config";
import { Global } from "../data/Global";
import { BundleUpdateHandlerImpl } from "./BundleUpdateHandlerImpl";
import { CommonBundleUpdateHandlerImpl } from "./CommonBundleUpdateHandlerImpl";
import { HallUpdateHandlerImpl } from "./HallUpdateHandlerImpl";
import { MainUpdateHandlerImpl } from "./MainUpdateHandlerImpl";

export class CmmEntry extends EntryDelegate {

    /**@description 进入bundle完成 */
    onEnterGameView(entry: Entry, gameView: GameView) {
        let data = Manager.dataCenter.get(Global) as Global;
        data.prevWhere = data.where;
        data.where = entry.bundle;
        super.onEnterGameView(entry, gameView);
        Manager.loading.hide();
    }

    onShowGameView(entry: Entry | null, gameView: GameView) {
        let data = Manager.dataCenter.get(Global);
        if (data) {
            data.where = gameView.bundle as string;
        }
    }

    getEntryConfig(bundle: string): UpdateItem | null {
        let config = Config.ENTRY_CONFIG[bundle];
        if (config) {
            let item = new UpdateItem(config);
            if (bundle == Macro.BUNDLE_RESOURCES) {
                item.handler.delegate = getSingleton(MainUpdateHandlerImpl);
            } else if (bundle == Config.BUNDLE_HALL) {
                item.handler.delegate = getSingleton(HallUpdateHandlerImpl);
            } else {
                if(Manager.bundleExtend.isComm(bundle)){
                    item.handler.delegate = getSingleton(CommonBundleUpdateHandlerImpl);
                }else{
                    item.handler.delegate = getSingleton(BundleUpdateHandlerImpl);
                }
            }
            return item;
        }
        Log.e(`未找到入口配置信息`,bundle,Config.ENTRY_CONFIG);
        return null;
    }

    /**@description 获取常驻于内存不释放的bundle */
    getPersistBundle() {
        return [Macro.BUNDLE_RESOURCES, Config.BUNDLE_HALL];
    }
}