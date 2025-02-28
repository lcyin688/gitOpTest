
/**
 * @description 事件派发器，原生的，当前节点没有在运行时，无法收到消息
 */

import { GameEvent } from "../../../common/event/GameEvent";

interface IEvent {
    type: string, // 事件类型
    target: any, //事件target
    callback: Function;//事件回调
}

export class Dispatcher {

    private static _instance: Dispatcher = null!;
    public static Instance() { return this._instance || (this._instance = new Dispatcher()); }
    private _eventCaches: { [key: string]: Array<IEvent> } = null!;
    constructor() {
        this._eventCaches = {};
    }
    /**
     * @description 添加事件
     * @param type 事件类型
     * @param callback 事件回调
     * @param target target
     */
    public add(type: string, callback: Function, target: any) {
        if (!type || !callback || !target) return;
        let eventCaches: Array<IEvent> = this._eventCaches[type] || [];
        let hasSame = false;
        for (let i = 0; i < eventCaches.length; i++) {
            if (eventCaches[i].target === target) {
                hasSame = true;
                Log.e("add event err:",type,target,eventCaches[i].type,type);
                break;
            }
        }
        if (hasSame) {
            return;
        }
        let newEvent: IEvent = { type: type, callback: callback, target: target };
        eventCaches.push(newEvent);
        this._eventCaches[type] = eventCaches;
    }

    /**
     * @description 移除事件
     * @param type 事件类型
     * @param target 
     */
    public remove(type: string, target: any) {
        if (!type || !target) {
            return;
        }
        let eventCaches: Array<IEvent> = this._eventCaches[type];
        if (!eventCaches) {
            return;
        }
        for (let i = 0; i < eventCaches.length; i++) {
            if (eventCaches[i].target === target) {
                eventCaches.splice(i, 1);
                break;
            }
        }
        if (eventCaches.length == 0) {
            delete this._eventCaches[type];
        }
    }

    /**
     * @description 派发事件
     * @param type 事件类型
     * @param data 事件数据
     */
    public dispatch() {
        if ( arguments.length < 1 ){
            return;
        }
        let type = arguments[0];
        if (!type) return;
        Array.prototype.shift.apply(arguments);
        let eventCaches: Array<IEvent> = this._eventCaches[type];
        if (!eventCaches){
            // Log.e("event dispatch not found:",type);
            if(type == GameEvent.EnterBundle || type == GameEvent.ENTER_HALL || type == GameEvent.ENTER_GAME){
                Manager.entryManager.enterBundle(arguments[0]);
            }
            return;
        } 
        for (let i = 0; i < eventCaches.length; i++) {
            let event = eventCaches[i];

            // if (typeof Reflect == "object") {
            //     Reflect.apply(event.callback,event.target,arguments);
            // } else {
            //     event.callback.apply(event.target, arguments);
            // }
            try {
                if (typeof Reflect == "object") {
                    Reflect.apply(event.callback,event.target,arguments);
                } else {
                    event.callback.apply(event.target, arguments);
                }
            } catch (err) {
                Log.e(err,i,eventCaches,eventCaches.length);
            }
        }
    }
}

window.dispatch = function () {
    //向自己封闭的管理器中也分发
    Reflect.apply(Dispatcher.Instance().dispatch,Dispatcher.Instance(),arguments);
}