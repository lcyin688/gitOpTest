/**
 * @description bundle管理器
 */

import { Macro } from "../../defines/Macros";
import { UpdateItem } from "../update/UpdateItem";

export class BundleManager {
   private static _instance: BundleManager = null!;
   public static Instance() { return this._instance || (this._instance = new BundleManager()); }
   protected isEngineBundle(key : any){
      if ( key == cc.AssetManager.BuiltinBundleName.INTERNAL || key == cc.AssetManager.BuiltinBundleName.MAIN ||
         key == cc.AssetManager.BuiltinBundleName.RESOURCES || key == cc.AssetManager.BuiltinBundleName.START_SCENE){
            return true;
         }
      return false;
   }
   
   /**@description 删除已经加载的bundle */
   public removeLoadedBundle(excludeBundles: string[]) {
      let loaded: string[] = [];
      cc.assetManager.bundles.forEach((bundle, key) => {
         //引擎内置包不能删除
         if (!this.isEngineBundle(key)) {
            loaded.push(key);
         }
      });
      let i = loaded.length;
      while (i--) {
         let bundle = loaded[i];
         if (excludeBundles.indexOf(bundle) == -1) {
            //在排除bundle中找不到，直接删除
            Manager.entryManager.onUnloadBundle(bundle);
            let result = this.getBundle(bundle);
            if (result) {
               // Manager.cacheManager.removeBundle(bundle);
               // Manager.releaseManger.removeBundle(result);
            }
         }
      }
   }

   /**
    * @description 获取Bundle
    * @param bundle Bundle名|Bundle
    **/
   public getBundle(bundle: BUNDLE_TYPE) {
      if (bundle) {
         if (typeof bundle == "string") {
            return cc.assetManager.getBundle(bundle);
         }
         return bundle;
      }
      return null;
   }

   public getBundleName(bundle: BUNDLE_TYPE): string {
      if (bundle) {
         if (typeof bundle == "string") {
            return bundle;
         } else {
            return bundle.name;
         }
      }
      Log.e(`输入参数错误 : ${bundle}`);
      return Macro.UNKNOWN;
   }

   /**
    * 外部接口 进入Bundle
    * @param config 配置
    */
   public enterBundle(config: UpdateItem | null) {
      if ( config ){
         Log.d("enterBundle:",config);
         Manager.updateManager.dowonLoad(config);
      }else{
         Log.e(`无效的入口信息`);
      }
   }

   private loadMainBundle(item:UpdateItem){
      let bundle = this.getBundle(item.bundle);
      if (bundle) {
         Log.d(`${item.bundle}已经加载在缓存中，直接使用`);
         Manager.releaseManger.onLoadBundle(item.bundle);
         item.handler.onLoadBundleComplete(item);
         return;
      }
      item.handler.onStartLoadBundle(item);
      Log.d(`loadBundle : ${item.bundle}`);
      let startTime = Manager.utils.milliseconds;
      cc.assetManager.loadBundle(item.bundle, (err, bundle) => {
         if (err) {
            Log.e(`load bundle : ${item.bundle} fail !!!`);
            item.handler.onLoadBundleError(item,err);
         } else {
            Manager.releaseManger.onLoadBundle(item.bundle);
            Log.d(`load bundle : ${item.bundle} success !!!,use time:`,Manager.utils.milliseconds - startTime);
            item.handler.onLoadBundleComplete(item);
         }
      });
   }

   public loadBundle(item:UpdateItem) {
      let rely = Manager.bundleExtend.getRelyItems(item.bundle);
      if(rely == null || rely.length == 0){
         this.loadMainBundle(item);
      }else{
         this.loadRely(rely);
      }
   }

   public loadRely(rely:UpdateItem[],index:number=0) {
      let bundle = this.getBundle(rely[index].bundle);
      if (bundle) {
         if(index+1 == rely.length){
            Manager.bundleManager.loadMainBundle(rely[rely.length-1]);
         }else{
            Manager.bundleManager.loadRely(rely,index+1);
         }
         return;
      }
      let startTime = Manager.utils.milliseconds;
      cc.assetManager.loadBundle(rely[index].bundle, (err, bundle) => {
         if (err) {
            Log.e(`load bundle : ${rely[index]} fail !!!`);
         } else {
            Log.d(`load bundle : ${rely[index]} success !!!,use time:`,Manager.utils.milliseconds - startTime);
            if(index+1 == rely.length){
               Manager.bundleManager.loadMainBundle(rely[rely.length-1]);
            }else{
               Manager.bundleManager.loadRely(rely,index+1);
            }
         }
      });
   }

   /**
    * @description 打印bundle管理器状态信息
    * @param delegate 
    */
   print(delegate: ManagerPrintDelegate<{
      loaded: cc.AssetManager.Bundle[], //已在加载的bundle
   }>) {
      if (delegate) {
         let loaded: cc.AssetManager.Bundle[] = [];
         cc.assetManager.bundles.forEach((bundle, key) => {
            loaded.push(bundle);
         });
         delegate.print({
            loaded: loaded
         })
      }
   }
}
