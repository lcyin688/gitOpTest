import { Update } from "../../framework/core/update/Update";
import { UpdateHandlerDelegate, UpdateItem } from "../../framework/core/update/UpdateItem";
import { Config } from "../config/Config";

/**@description 主包更新代理 */
export class MainUpdateHandlerImpl implements UpdateHandlerDelegate {
    private static _instance: MainUpdateHandlerImpl = null!;
    public static Instance() { return this._instance || (this._instance = new MainUpdateHandlerImpl()); }
    onNewVersionFund(item: UpdateItem): void {
        item.doUpdate();
    }
    onUpdateFailed(item: UpdateItem): void {
        let content = Manager.getLanguage("downloadFailed");
        Manager.alert.show({
            text: content,
            confirmCb: (isOK) => {
                item.downloadFailedAssets();
            }
        });
        // Manager.updateLoading.hide();
    }
    onPreVersionFailed(item: UpdateItem): void {
        let content = Manager.getLanguage("downloadFailed");
        Manager.alert.show({
            text: content,
            confirmCb: (isOK) => {
                item.checkUpdate();
            }
        });
        // Manager.updateLoading.hide();
    }
    onShowUpdating(item: UpdateItem): void {
        Manager.updateLoading.show(Manager.getLanguage("loading"));
    }
    onNeedUpdateMain(item: UpdateItem): void {
        
    }
    onOther(item: UpdateItem): void {
        
    }
    onDownloading(item: UpdateItem, info: Update.DownLoadInfo): void {
        Log.d("main info:",JSON.stringify(info));
        Manager.updateLoading.updateProgressInfo(info);
    }
    onAreadyUpToData(item: UpdateItem): void {
        // Manager.updateLoading.hide();
    }
    onTryDownloadFailedAssets(item: UpdateItem): void {
        item.downloadFailedAssets();
    }
    onStarCheckUpdate(item: UpdateItem): void {
        Manager.updateLoading.show(Manager.getLanguage("loading"));
    }
    onStartLoadBundle(item: UpdateItem): void {
        Log.dump("update MAIN","onStartLoadBundle");
    }
    onLoadBundleError(item: UpdateItem, err: Error | null): void {
        //主包原则上说是不可能加载错误的
        // Manager.updateLoading.hide();
        Manager.tips.show(Manager.getLanguage(["loadFailed",item.name]));
        Log.dump(err,"onLoadBundleError");
    }
    onLoadBundleComplete(item: UpdateItem): void {
        // Manager.updateLoading.hide();
        Manager.entryManager.onLoadBundleComplete(item);
        Log.dump("update MAIN","onLoadBundleComplete");
    }
    onLoadBundle(item: UpdateItem): void {
        //主包不会释放，直接隐藏loading
        Log.dump("update MAIN","onLoadBundle");
        Manager.updateLoading.updateProgress(0);
        let hall = Manager.entryManager.delegate.getEntryConfig(Config.BUNDLE_HALL);
        if(hall.userData == null){
            hall.userData = {};
        }
        hall.userData.autoEnter = false;
        Manager.updateManager.dowonLoad(hall);
    }
    onDownloadComplete(item:UpdateItem):void{
        Log.d("主包下载完成");
        if(Manager.bundleExtend.isRestartApp){
            Log.d("主包有更新需要重启");
            setTimeout(() => {
                Manager.bundleExtend.isRestartApp = false;
                cc.game.restart();
            }, 1000);
        }else{
          
        }
       
    }
}