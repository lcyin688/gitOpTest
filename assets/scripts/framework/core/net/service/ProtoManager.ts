import { ProtoDef } from "../../../../def/ProtoDef";
import { Macro } from "../../../defines/Macros";
import { Resource } from "../../asset/Resource";
import { Net } from "../Net";

export class ProtoManager {
    private static _instance: ProtoManager = null!;
    public static Instance() { return this._instance || (this._instance = new ProtoManager()); }
    private tag = "[ProtoManager] : "
    /**@description 记录已经加载过的目录，加载过的proto将不会重新加载 */
    private _loadDir : {[key : string] : boolean} = {};
    private tMsg = {};
    private protobufjs:any = null;
    private longjs:any = null;
    constructor() {
        this.protobufjs = require('../pbjs5/protobuf.js');
        this.longjs = require('../pbjs5/long.js');
        let self = this.protobufjs;
       		// 此方法是将ProtoBuf.Util.fetch函数替换成cc.loader.loadRes函数，以解决在微信小游戏中不能使用XHR的问题
        this.protobufjs.loadProtoFile = function (filename, callback, builder) {
            if (callback && typeof callback === 'object') {
                builder = callback,
                    callback = null;
            } else if (!callback || typeof callback !== 'function') {
                callback = null;
            }
            if (callback) {
                return cc.loader.loadRes(typeof filename === 'string' ? filename : filename["root"] + "/" + filename["file"], function (error, contents) {
                    if (contents === null) {
                        callback(Error("Failed to fetch file"));
                        return;
                    }
                    try {
                        callback(error, self.loadProto(contents, builder, filename));
                    } catch (e) {
                        callback(e);
                    }
                });
            }
            var contents = cc.loader.loadRes(typeof filename === 'object' ? filename["root"] + "/" + filename["file"] : filename);
            return contents === null ? null : self.loadProto(contents, builder, filename);
        };

        // 解决在一个proto文件import另一个proto文件的问题，前提得这个proto文件import过的
        this.protobufjs.Util.fetch = cc.loader.getRes.bind(cc.loader);
    }

    loadFile(filePath: string, doFunc: Function): any {
		let newBuilder = this.protobufjs.newBuilder();

		this.protobufjs.loadProtoFile(filePath, (error, builder) => {
			if (error) {
				console.error('ProtoBuf loadFile error, msg = ' + error);
				doFunc(null, error);
				return;
			}
			console.log(`loadFile ${filePath} success!`);
			if (typeof doFunc == 'function') {
				doFunc(builder, null);
			}
		}, newBuilder);
	}

    /**
     * @description 加载所有bundle.path下的所有proto描述文件
     * @param bundle 所在 bundle
     * @param path 相对 bundle 的 path proto资源文件目录,默认为bundle/proto目录
     * @returns 
     */
    load(bundle: string, path: string = "proto") {
        return new Promise<any>((resolove, reject) => {
            this.loadFile(path+"/proto_rpc",(builder, error) => {
                this.onBuilder([builder]);
                this.loadFile(path+"/proto_pb",(builder, error) => {
                    this.onBuilder([builder]);
                    resolove(true);
                })
            })
        });
    }

    private onBuilder(builders) {
        builders.forEach((b) => {
            let pbObj = b.build('');
            this.registerMsg(pbObj);
        });
    }

    registerMsg(fileMsgObj) {
        for (let msgName in fileMsgObj) {
            this.tMsg[msgName] = fileMsgObj[msgName];
        }
    }

    /**@description 当进入登录界面，不需要网络配置时，卸载proto的类型，以防止后面有更新，原有的proto类型还保存在内存中 */
    unload(){
        Log.d("ProtoManager unload")
        this._loadDir = {};
        // this._root = new protobuf.Root();
    }


    /**
     * @description 查找 proto类型
     * @param className 类型名
     */
    lookup(className: string) {
        // if (this._root) {
        //     return this._root.lookup(className);
        // }
        // return null;
        let cn = className.split(".");
        let pkg = cn[0];
        let name = cn[1];

        if (this.tMsg.hasOwnProperty(pkg)) {
            let msg = this.tMsg[pkg];
            if (msg.hasOwnProperty(name)){
                return msg[name];
            }
        }
        console.error('找不到消息名为' + className + '的消息');
        return null;
    }

    decode<ProtoType>(name,buffer): ProtoType {
        let protoType = this.lookup(name);
        if (protoType) {
            let data = protoType.decode(buffer);
            this.decodeHelper(data);
            return data;
        }
        return null;
    }

    // private isHelp = false
    decodeHelper(obj){
        // if(this.isHelp){
        //     return;
        // }
        // this.isHelp = true;
        // Log.d("___decodeObject:",obj.toString(),obj);
        this.decodeChild(obj);
        // Log.d("___decodeObject end:",obj);
    }

    
    decodeChild(obj){
        for (let key in obj) {
            let ty = typeof obj[key];
            if(ty == "function"){
                continue
            }
            if(obj[key] != null && ty == "object"){
                // Log.d("___decodOBj",obj[key],key);
                if (this.isLong(obj[key])){
                    // Log.w("___decode isLong",key);
                    this.decodeLong(obj,key)
                    // Log.w("___decode isLong end",obj);
                    continue;
                }
                if (obj[key].hasOwnProperty("field") && obj[key].hasOwnProperty("map")){
                    // Log.w("___decode map",key);
                    this.decodeMap(obj,key)
                    continue;
                }
                if (obj[key].hasOwnProperty("buffer") && obj[key].hasOwnProperty("offset")){
                    // Log.w("___decode buffer",key);
                    continue;
                }
                if (obj[key].hasOwnProperty("length")){
                    // Log.w("___decode array",key);
                    this.decodeArray(obj,key)
                    continue;
                }
                if (obj[key].hasOwnProperty("buffer") && obj[key].hasOwnProperty("offset")){
                    // Log.w("___decode array",key);
                    continue;
                }
                // Log.e("___decode other value",key,ty);
                this.decodeChild(obj[key]);   
            }
        }    
    }

    isLong(obj){
        return this.longjs.isLong(obj);
    }

    checkLong(obj,value){
        if(value == null){
            return;
        }
        if (Array.isArray(value)){
            this.checkLongArray(obj,value);
            return;
        }
        Log.d("C2SUseProp:",obj,value);
        if(this.isLong(obj)){
            obj = this.longjs.fromValue(value);
            Log.d("C2SUseProp end:",obj,value);
            return;
        }
        obj = value;
    }

    toLong(obj,key,value){
        if(value == null){
            return;
        }
        if (Array.isArray(value)){
            this.checkLongArray(obj,value);
            return;
        }
        Log.d("checkLong:",obj,value);
        if(this.isLong(obj[key])){
            obj[key] = this.longjs.fromValue(value);
            Log.d("checkLong end:",obj[key],value);
            return;
        }
        obj[key] = value;
    }

    checkLongArray(obj,arr){
        for (let index = 0; index < arr.length; index++) {
            obj.push(this.longjs.fromValue(arr[index]));
        }
    }

    decodeLong(obj,key){
        obj["_"+key] = obj[key];
        obj[key] = obj[key].toNumber(); 
    }

    decodeMap(obj,key){
        obj["_"+key] = obj[key];
        obj[key] = {};
        let mapObject = obj["_"+key].map;
        for (const [cKey, mapData] of Object.entries(mapObject)) {
            let k = cKey as any;
            if (this.isLong(k)){
                k = k.toNumber(); 
            }
            let v = mapData as any;
            let value = v.value;
            if (this.isLong(value)){ 
                obj[key][k]=value.toNumber();
            }else{
                this.decodeChild(value)
                obj[key][k]=value;
            }
    
        }
    }

    decodeArray(obj,key){
        let arrData = obj[key];
        for (let index = 0; index < arrData.length; index++) {
            const element = arrData[index];
            if (this.isLong(element)){
                arrData[index] = element.toNumber();
            }else{
                this.decodeChild(arrData[index]);
            }
        }
    }

    printObject(obj){
        for (let key in obj) {
            Log.w("___decode printObject",key,obj[key]);
        }
    }

    print( delegate : ManagerPrintDelegate<{[key : string] : boolean}>){
        if( delegate ){
            delegate.print(this._loadDir);
        }
    }

    request() : any {
        return this.getProto(ProtoDef.rpc.Request);
    }

    getProto(protoName :string) : any {
        return this.lookup(protoName) as any;
    }
}
