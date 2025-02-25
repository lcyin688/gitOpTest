import FLevel2UI from "./FLevel2UI";

export default class UIQueue {

    private static _instance: UIQueue = null!;
    public static Instance() { return this._instance || (this._instance = new UIQueue()); }


    public queue:any[] = [];

    public _show:boolean = false;

    protected cur:any = null;

    public Init(){
        this.queue = [];
    }

    public addToQueue(ui:any){
        if(ui && ui.root != null){
            ui.root.visible = false;
        }
        Log.d("addToQueue:",ui);
        this.queue.push(ui);
        this.popup();
    }

    show(s:boolean= true){
        this._show = s;
        this.popup();
    }

    popup(){
        if(!this._show){
            return;
        }
        if(this.cur != null){
            return;
        }
        if(this.queue.length <= 0){
            return;
        }
        this.cur = this.queue.shift();
        Log.d("onPopup:",this.queue.length);
        if(this.cur != null && this.cur.root != null){
            this.cur.root.visible = true;
        }
        if(this.cur != null && this.cur.type != null && this.cur.bundle != null && this.cur.zIndex != null){
            Manager.uiManager.openFairy(this.cur);
        }
    }

    public close(ui:any){
        if(this.cur == ui){
            this.cur = null;
        }
        if(this.cur != null && this.cur.type != null && this.cur.bundle != null && this.cur.zIndex != null){
            if(ui._className == this.cur.type.name){
                this.cur = null;
            }
        }
        setTimeout(()=>{
            this.popup();
        },100);
    }
}
