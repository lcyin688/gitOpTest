
import { Update } from "../../framework/core/update/Update";
import { UpdateHandlerDelegate, UpdateItem } from "../../framework/core/update/UpdateItem";
import { Macro } from "../../framework/defines/Macros";
/**@description bundle更新下载代理 */
export class BundleUpdateHandlerImpl implements UpdateHandlerDelegate {
    private static _instance: BundleUpdateHandlerImpl = null!;
    public static Instance() { return this._instance || (this._instance = new BundleUpdateHandlerImpl()); }
    onNewVersionFund(item: UpdateItem): void {
        item.doUpdate();
    }
    onUpdateFailed(item: UpdateItem): void {
        Manager.tips.show(Manager.getLanguage(["updateFaild",item.name]));
        //更新大厅图片状态到可更新,让用户再二次点击
        Manager.uiManager.getView("HallView").then((view : GameView)=>{
            if ( view ){
                view.toUpdateStatus(item);
            }else{
                item.downloadFailedAssets();
            }
        });
    }
    onPreVersionFailed(item: UpdateItem): void {
        this.onUpdateFailed(item);
    }
    onShowUpdating(item: UpdateItem): void {
        // Manager.tips.show(Manager.getLanguage("checkingUpdate"));
    }
    onNeedUpdateMain(item: UpdateItem): void {
        let content = Manager.getLanguage("mainPackVersionIsTooLow") as string;
        Manager.alert.show({
            text: content,
            confirmCb: (isOK) => {
                Manager.entryManager.enterBundle(Macro.BUNDLE_RESOURCES);
            }
        });
    }
    onOther(item: UpdateItem): void {
        
    }
    onDownloading(item: UpdateItem, info: Update.DownLoadInfo): void {
        Manager.uiManager.getView("HallView").then((view : GameView)=>{
            if ( view ){
                view.onDownloadProgess(info);
            }
        });
    }
    onAreadyUpToData(item: UpdateItem): void {
        Manager.tips.show(Manager.getLanguage(["alreadyRemoteVersion",item.name]));
    }
    onTryDownloadFailedAssets(item: UpdateItem): void {
        //直接下载失败的更新文件
        item.downloadFailedAssets();
    }
    onStarCheckUpdate(item: UpdateItem): void {
        //子游戏更新，不做处理
    }
    onStartLoadBundle(item: UpdateItem): void {
        //子游戏加载，不做处理
    }
    onLoadBundleError(item: UpdateItem, err: Error | null): void {
        Manager.tips.show(Manager.getLanguage(["loadFailed",item.name]));
    }
    onLoadBundleComplete(item: UpdateItem): void {
        if(item.justDownload){
            return;
        }
        Manager.entryManager.onLoadBundleComplete(item);
    }

    onLoadBundle(item: UpdateItem): void {
        if(item.justDownload){
            return;
        }
        let items = Manager.bundleExtend.getRelyItems(item.bundle);
        if(items == null || items.length == 0){
            Manager.tips.showFromId("TS_UPDATE_1");
            return;
        }
        for (let index = 0; index < items.length; index++) {
            if(items[index].justDownload){
                Log.d("item:",item.bundle,"游戏还未更新完成");
                Manager.tips.showFromId("TS_UPDATE_2");
                return;
            }  
            let updateItem = Manager.updateManager.getItem(items[index]);
            if(updateItem != null && updateItem.justDownload){
                Log.d("item:",item.bundle,"游戏暂未更新完成");
                Manager.tips.showFromId("TS_UPDATE_2");
                return;
            } 
        }
        Manager.bundleManager.loadBundle(item);
    }

    onDownloadComplete(item:UpdateItem):void{
        //子游戏下载完成，不进入游戏，需要玩家二次点击进入
        //尝试先释放掉当前的bundle的资源，重新加载
        // Manager.releaseManger.tryRemoveBundle(item.bundle);
    }
}