import { BitEncrypt } from "../../plugin/BitEncrypt";

/**
 * @description 本地数据存储，为了后面可能需要对数据进入加密保存等，把cocos的封闭一层
 */

type StorageVauleType = "number" | "string" | "boolean" | "object";
interface StorageData {
    type: StorageVauleType,
    value: string | number | boolean | object;
}

export class LocalStorage {

    private static _instance: LocalStorage = null!;
    public static Instance() { return this._instance || (this._instance = new LocalStorage()); }

    public key = "VuxiAKihQ0VR9WRe";

    private encrypt(obj: {}) {
        return BitEncrypt.encode(JSON.stringify(obj), this.key);
    }

    private decryption(word: any) {
        return BitEncrypt.decode(word, this.key);
    }


    
    public getItem(key: string, defaultValue: any = null) {
        let value = this.storage.getItem(key);
        if (value) {
            //解析
            try {
                let data = this.decryption(value);
                let result: StorageData = JSON.parse(data);
                if (result.type) {
                    return result.value;
                } else {
                    return value;
                }
            } catch (error) {
                return value;
            }
        }
        else {
            return defaultValue;
        }
    }

    public setItem(key: string, value: string | number | boolean | object) {

        let type = typeof value;
        if (type == "number" || type == "string" || type == "boolean" || type == "object") {
            let saveObj: StorageData = { type: type, value: value };
            //加密
            try {
                let data = this.encrypt(saveObj);
                this.storage.setItem(key, data);
            } catch (err) {
                if (CC_DEBUG) Log.e(err);
            }
        } else {
            if (CC_DEBUG) Log.e(`存储数据类型不支持 当前的存储类型: ${type}`);
        }
    }

    public removeItem(key: string) {
        this.storage.removeItem(key);
    }

    private get storage(){
        return cc.sys.localStorage;
    }

    public clear() {
        this.storage.clear();
    }

    public clearCache() {
        if(!Manager.updateManager.isBrowser){
            let path = jsb.fileUtils.getWritablePath();
            if (jsb.fileUtils.removeDirectory(path)){
                jsb.fileUtils.createDirectory(path);
            }
        }else{
            Log.w("clearCache 仅供原生使用");
        }
    }
}