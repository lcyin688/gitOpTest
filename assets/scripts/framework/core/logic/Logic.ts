import { GameService } from "../../../common/net/GameService";
import { Macro } from "../../defines/Macros";

export class Logic {
    /**@description logic bundle，管理器设置 */
    static bundle = Macro.UNKNOWN;
    /**@description logic bundle，管理器设置 */
    bundle: string = Macro.UNKNOWN;

    protected gameView : GameView = null!;


    private _events: Map<string, Function> = new Map();

    /**@description 重置游戏逻辑 */
    reset( gameView : GameView) {

    }

    onLoad( gameView : GameView):void{
        this.gameView = gameView;
    }
    update(dt: number): void{}
    onDestroy():void{}

    protected get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }

            /**
     * @description 注册网络事件
     * @param cmd cmd
     * @param func 处理函数
     * @param handleType 处理数据类型
     * @param isQueue 接收到消息，是否进行队列处理
     */
    protected register(cmd: string, func: (data: any) => void, handleType?: any, isQueue = true) {
        if (this.service) {
            this.service.addListener(cmd, handleType, func, isQueue, this);
            this._events.set(cmd, func);
            // Log.d("register msg:",cmd);
            return;
        }
        if( CC_DEBUG ){
            Log.e(`必须绑定Service`);
        }
    }

    protected registerProto(cmd: any, func: (data: any) => void, isQueue = true) {
        this.register(cmd,func,cmd,isQueue);
    }

    protected clearProto(){
        this._events.forEach((func,name)=>{
            this.service.removeListeners(this,name);
        });
        this._events.clear();
    }
}