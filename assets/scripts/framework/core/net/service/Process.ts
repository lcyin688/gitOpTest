import { Codec, Message } from "../message/Message";
import { Net } from "../Net";
import {SSMCodec} from "../message/SSMCodec";
import { ProtoDef } from "../../../../def/ProtoDef";

export type MessageHandleFunc = (handleTypeData: any) => number;

export class Process {
    public Codec: new () => Codec = SSMCodec;

    /** 监听集合*/
    protected _listeners: { [key: string]: Net.ListenerData[] } = {};
    /** 消息处理队列 */
    protected _messageQueue: Array<Net.ListenerData[]> = new Array<Net.ListenerData[]>();


    /** 是否正在处理消息 ，消息队列处理消息有时间，如执行一个消息需要多少秒后才执行一下个*/
    protected _isDoingMessage: boolean = false;

    /** @description 可能后面有其它特殊需要，特定情况下暂停消息队列的处理, true为停止消息队列处理 */
    public isPause: boolean = false;
    serviceType: Net.ServiceType = null!;

    /**
     * @description 暂停消息队列消息处理
     */
    public pauseMessageQueue() { this.isPause = true }

    /**
     * @description 恢复消息队列消息处理
     */
    public resumeMessageQueue() { this.isPause = false }


    public handMessage() {

        //如果当前暂停了消息队列处理，不再处理消息队列
        if (this.isPause) return;

        //如果当前有函数正在处理
        if (this._isDoingMessage) return;
        //如果当前执行队列为空
        if (this._messageQueue.length == 0) return;

        let datas = this._messageQueue.shift();
        if (datas == undefined) return;
        if (datas.length == 0) return;

        this._isDoingMessage = true;
        let handleTime = 0;

        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS){
            for (let i = 0; i < datas.length; i++) {
                let data = datas[i];
                if (data.func instanceof Function) {
                    try {
                        let tempTime = data.func.call(data.target, data.data);
                        if (typeof tempTime == "number") {
                            handleTime = Math.max(handleTime, tempTime);
                        }
                    } catch (err) {
                        Log.e("data:",data);
                        Log.e("err:",err);
                    }
                }
            }
        }else{
            for (let i = 0; i < datas.length; i++) {
                let data = datas[i];
                if (data.func instanceof Function) {

                    let tempTime = data.func.call(data.target, data.data);
                    if (typeof tempTime == "number") {
                        handleTime = Math.max(handleTime, tempTime);
                    }
                }
            }
        }

        if (handleTime == 0) {
            //立即进行处理
            this._isDoingMessage = false;
        }
        else {
            Manager.uiManager.mainController?.scheduleOnce(() => {
                this._isDoingMessage = false;
            }, handleTime);
        }
    }

    public onMessage(code: Codec) {
        if(code.cmd != ProtoDef.pb.S2CRollingNotice && code.cmd != ProtoDef.pb.S2CPing){
            Log.d(`recv data msg cmd : ${code.cmd}`);
        }
        let key = String(code.cmd);
        if (!this._listeners[key]) {
            Log.w(`no find listener data msg cmd : ${code.cmd}`);
            return;
        }
        if (this._listeners[key].length <= 0) {
            return;
        }

        this.addMessageQueue(key, code, true)
    }

    /**
     * @description 重置
     */
    public reset() {
        this._isDoingMessage = false;
        this._listeners = {};
        this._messageQueue = [];
        this.resumeMessageQueue();
    }

    public close() {
        this._messageQueue = [];
        this._isDoingMessage = false;
    }

    public addListener(cmd: string, handleType: any, handleFunc: MessageHandleFunc, isQueue: boolean, target: any) {
        let key = cmd;
        // Log.d("addListener msg:",cmd);
        if (this._listeners[key]) {
            let hasSame = false;
            for (let i = 0; i < this._listeners[key].length; i++) {
                if (this._listeners[key][i].target === target) {
                    hasSame = true;
                    break;
                }
            }
            if (hasSame) {
                return;
            }
            this._listeners[key].push({
                cmd: cmd,
                func: handleFunc,
                type: handleType,
                isQueue: isQueue,
                target: target
            });
        }
        else {
            this._listeners[key] = [];
            this._listeners[key].push({
                cmd: cmd,
                func: handleFunc,
                type: handleType,
                isQueue: isQueue,
                target: target
            });
        }
    }

    public removeListeners(target: any, eventName?: string) {
        // Log.d("removeListeners msg:",target,eventName);
        if (eventName) {
            let self = this;
            Object.keys(this._listeners).forEach((value) => {
                let datas = self._listeners[value];
                let i = datas.length;
                while (i--) {
                    if (datas[i].target == target && datas[i].cmd == eventName) {
                        datas.splice(i, 1);
                    }
                }
                if (datas.length == 0) {
                    delete self._listeners[value];
                }
            });

            //移除网络队列中已经存在的消息
            let i = this._messageQueue.length;
            while (i--) {
                let datas = this._messageQueue[i];
                // if(datas[i] == null){
                //     this._messageQueue.splice(i, 1);
                //     continue;
                // }
                let j = datas.length;
                while (j--) {
                    // if(datas[j] == null){
                    //     datas.splice(j, 1);
                    //     continue;
                    // }
                    if(datas[j] != null && datas[i] != null){
                        if (datas[j].target == target && datas[i].cmd == eventName) {
                            datas.splice(j, 1);
                        }
                    }
                }
                if (datas.length == 0) {
                    this._messageQueue.splice(i, 1);
                }
            }

        } else {
            let self = this;
            Object.keys(this._listeners).forEach((value: string, index: number, arr: string[]) => {
                let datas = self._listeners[value];

                let i = datas.length;
                while (i--) {
                    if (datas[i].target == target) {
                        datas.splice(i, 1);
                    }
                }

                if (datas.length == 0) {
                    delete self._listeners[value];
                }
            })

            //移除网络队列中已经存在的消息
            let i = this._messageQueue.length;
            while (i--) {
                let datas = this._messageQueue[i];
                let j = datas.length;
                while (j--) {
                    if (datas[j].target == target) {
                        datas.splice(j, 1);
                    }
                }
                if (datas.length == 0) {
                    this._messageQueue.splice(i, 1);
                }
            }
        }
    }

    protected decode(o: Net.ListenerData, header: Codec): Message | null {
        let obj: Message = null!;
        if ( this.serviceType == Net.ServiceType.Proto ){
            if ( o.type && typeof o.type == "string" ){
                let type = Manager.protoManager.lookup(o.type);
                if( type ){
                    obj = Manager.protoManager.decode(
                         o.type,
                         header.buffer,
                    ) as any;
                    // Log.d("obj",obj)
                }else{
                    obj = header.buffer as any;
                }
            }else{
                obj = header.buffer as any;
            }
            return obj;
        }else{
            if (o.type && typeof o.type != "string") {
                obj = new o.type();
                //解包
                Log.d("obj",obj)
                obj.decode(header.buffer);
            } else {
                //把数据放到里面，让后面使用都自己解析,数据未解析，此消息推后解析
                obj = header.buffer as any;
            }
            return obj
        }
    }

    public addMessageQueue(key: string, data: any, encode: boolean) {
        if (this._listeners[key].length <= 0) { return }
        let listenerDatas = this._listeners[key];
        let queueDatas = [];

        for (let i = 0; i < listenerDatas.length; i++) {
            let obj: Message = data
            if (encode) {
                obj = this.decode(listenerDatas[i], data) as Message
            }

            if (listenerDatas[i].isQueue) {
                //需要加入队列处理
                queueDatas.push(this.copyListenerData(listenerDatas[i], obj));
            }
            else {
                //不需要进入队列处理
                try {
                    listenerDatas[i].func && listenerDatas[i].func.call(listenerDatas[i].target, obj);
                } catch (err) {
                    Log.e(err);
                }

            }
        }
        if (queueDatas.length > 0) {
            this._messageQueue.push(queueDatas);
        }
    }

    /**
     * @description 复制proto协议监听数据
     * @param input 
     * @param data 
     */
    private copyListenerData(input: Net.ListenerData, data: any): Net.ListenerData {
        return {
            type: input.type,
            func: input.func,
            isQueue: input.isQueue,
            data: data,
            target: input.target,
            cmd: input.cmd
        };
    }
}