/**@description 游戏层公共基类 */
import { Update } from "../update/Update";
import { UpdateItem } from "../update/UpdateItem";
import UIView from "./UIView";

/**
 * @description 游戏视图基类,处理了前后台切换对网络进行后台最大允许时间做统一处理,
 * 游戏层设置为ViewZOrder.zero
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameView extends UIView {

    static logicType : LogicClass<Logic> | null = null;
    protected _logic : Logic | null = null;
    get logic(){
        return this._logic;
    }
    /**@description 由管理器统一设置，请勿操作 */
    setLogic(logic : Logic ){
        this._logic = logic;
        if ( logic ){
            logic.onLoad(this);
            this.RegisterEvent();
        }
        Log.d("GameView.setLogic");
    }

    protected RegisterEvent(){

    }

    toUpdateStatus(item:UpdateItem){
        Log.d("GameView.toUpdateStatus",item);
    }

    onDownloadProgess( info: Update.DownLoadInfo){
        Log.d("GameView.onDownloadProgess",info);
    }
    
    onLoad(){
        super.onLoad();
        //进入场景完成，即onLoad最后一行  必须发进入完成事件
        Manager.reward.pause = true;
        this.onEnterGameView()
    }

    show(args ?: any[] | any){
        super.show(args);
        Manager.entryManager.onShowGameView(this.bundle,this);
    }

    protected onEnterGameView(){
        Manager.entryManager.onEnterGameView(this.bundle,this);
    }

    enterBundle( bundle : BUNDLE_TYPE, userData ?: any){
         Manager.entryManager.enterBundle(bundle , userData);
    }

    onDestroy(){
        Manager.entryManager.onDestroyGameView(this.bundle,this);
        super.onDestroy();
        Manager.entryManager.onDestroyGameViewEnd(this.bundle,this);
    }

    onDispose() {
        Manager.entryManager.onDisposeGameView(this.bundle,this);
        if ( this.audioHelper ){
            //停止背景音乐
            //this.audioHelper.stopMusic();
            this.audioHelper.stopAllEffects();
        }
        if ( this.logic ){
            Manager.logicManager.destory(this.logic.bundle);
        }
        super.onDispose();
    }

    update(dt:number){
        if ( this.logic ){
            this.logic.update(dt);
        }
    }

    /**@description 游戏重置 */
    protected reset(){
        if ( this.logic ){
            this.logic.reset(this);
        }
    }
}
