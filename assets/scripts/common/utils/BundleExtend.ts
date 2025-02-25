import { Update } from "../../framework/core/update/Update";
import { UpdateItem } from "../../framework/core/update/UpdateItem";

export class Rely {
    /**@description bundle名 */
    bundle: string = "";
    /**@description 资源占比 */
    rate: number = 0;
    /**@description 下载进度 */
    progress: number = 0;

    constructor(
        rate: number,
        bundle: string) {
        this.rate = rate;
        this.bundle = bundle;
        this.progress = 0;
    }
}

export default class BundleExtend {
    private static _instance: BundleExtend = null;
    public static Instance() { return this._instance || (this._instance = new BundleExtend()); }

    private progressAmend:any = {};
    public isRestartApp:boolean = false;    
    private relySet:{ [k: string]: (Rely[]) } = {};
    

    public bindRely(bundle:string,rely:Rely[]){
        this.relySet[bundle] = rely;
        this.print();
    }

    public clearRely(bundle:string = null){
        if(bundle != null){
            this.relySet[bundle] = null;
        }else{``
            this.relySet = {};
        }
    }

    public belong(bundle:string,belong:string):boolean{
        let r = this.relySet[belong];
        if(r){
            for (let index = 0; index < r.length; index++) {
                const element = r[index];
                if(element.bundle == bundle){
                    return true;
                }
            }
        }
        return false;
    }

    public setDownloadProgress(info: Update.DownLoadInfo){
        for (const [key, val] of Object.entries(this.relySet)) {
            if(val != null){
                for (let index = 0; index < val.length; index++) {
                    const element = val[index];
                    if(info.bundle == element.bundle){
                        element.progress = info.progress;
                        Log.d("setDownloadProgress:",info.bundle,info.progress);
                    }
                }
            }
        }
    }


    public isRely(bundle:string):Rely[]{
        for (const [key, val] of Object.entries(this.relySet)) {
            if(val != null){
                return val;
            }
        }
        return null;
    }

    public isComm(bundle:string):boolean{
        for (const [key, val] of Object.entries(this.relySet)) {
            if(val != null){
                if(bundle == key){
                    return false;
                }
            }
        }
        return true;
    }

    public setDownloaded(info: UpdateItem):boolean{
        for (const [key, val] of Object.entries(this.relySet)) {
            if(val != null){
                for (let index = 0; index < val.length; index++) {
                    const element = val[index];
                    if(info.bundle == element.bundle){
                        element.progress = 1.1;
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private onProgressAmend(bundle:string,progress:number):number{
        Log.d("onProgressAmend",bundle,progress,this.progressAmend[bundle]);
        if(this.progressAmend[bundle] == null || isNaN(this.progressAmend[bundle])){
            this.progressAmend[bundle] = progress;
            // Log.d("onProgressAmend == null)",this.progressAmend[bundle]);
        }
        if(progress > this.progressAmend[bundle]){
            this.progressAmend[bundle] = progress;
        }
        // Log.d("onProgressAmend",this.progressAmend[bundle],JSON.stringify(this.progressAmend));
        return this.progressAmend[bundle];
    }

    clearAmend(){
        this.progressAmend = {};
    }

    public getDownloadProgress(bundle:string):number{
        let bundles = this.relySet[bundle];
        let p = 0;
        let a = 0;
        if(bundles != null){
            for (let index = 0; index < bundles.length; index++) {
                const element = bundles[index];
                Log.d("elementProgress:",bundles[index].bundle,element.progress);
                p += element.progress * element.rate;
                a += element.rate;       
            }
        }
        Log.d("getDownloadProgress:",bundle,p,a);
        let progress = 0;
        if(a == 0){
            progress = 0;
        }else{
            progress = p/a;
        }
        return this.onProgressAmend(bundle,progress);
    }

    public getAllProgress():number{

        let allSet:{ [k: string]: (Rely) } = {};

        for (const [key, val] of Object.entries(this.relySet)) {
            if(val != null){
                for (let index = 0; index < val.length; index++) {
                    const element = val[index];
                    allSet[element.bundle] = val[index];
                }
            }
        }

        let p = 0;
        let a = 0;


        for (const [key, val] of Object.entries(allSet)) {
            p += val.progress * val.rate;
            a += val.rate;
        }

        Log.d("getAllProgress:",p,a);
        let progress = 0;
        if(a == 0){
            progress = 0;
        }else{
            progress = p/a;
        }
        return this.onProgressAmend("all",progress);
    }

    public getRelyItems(bundle:string):UpdateItem[]{
        let r = this.relySet[bundle];
        if(r == null){
            return null;
        }
        if(r.length == 0){
            return null;
        }
        let items:UpdateItem[] = [];
        for (let index = 0; index < r.length; index++) {
            const elt = r[index];
            let it = Manager.entryManager.delegate.getEntryConfig(elt.bundle);
            if(it != null){
                items.push(it);
            }
        }
        return items;
    }




    private print(){
        for (const [key, val] of Object.entries(this.relySet)) {
            if(val != null){
                let data = val as [];
                // Log.d("key:------->>>>>>",key);
                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    // Log.d("key:-------rely",element);
                }
                // Log.d("key:-------<<<<<<",key);
            }
        }
    }
}
