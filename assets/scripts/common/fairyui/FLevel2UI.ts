
import GameView from "../../framework/core/ui/GameView";

const fullScreneUI = ["l2_ginfo","l2_shop","l2_player","l2_rank","achtask","grid","newGrid","exchange"];
export default abstract class FLevel2UI {

    protected root:fgui.GComponent = null;
    protected _owner:GameView = null;

    protected _close:fgui.GObject = null;

    public GetRoot():fgui.GComponent{
        return this.root;
    }

    public Init(ui:GameView,name:string=""){
    //    Log.d("name:",name);
       this.onClear();
       this._owner = ui;
        if (name=="") {
            this.root = ui.root.asCom;
        } else {
            this.root = ui.root.getChild(name).asCom;
            this.root.visible = false;
        }
        this.root.makeFullScreen();
    }

    

    public bind(){
        this.onBind();
    }

    protected bindCloseClick(){
        this._close.onClick(this.hide,this);
    }

    public getOwner(){
        return this._owner;
    }

    protected onClear(){

    }

    protected onBind(){

    }

    public onData(){

    }

    public show(){
        if (this.root){
            if(this._owner != null && this._owner.root != null){
                let isFullUI = false;
                for (let index = 0; index < fullScreneUI.length; index++) {
                    if(this.root.name == fullScreneUI[index]){
                        isFullUI = true;
                        break;
                    }       
                }
                if(isFullUI){
                    for (let index = 0; index < fullScreneUI.length; index++) {
                        let u = this._owner.root.getChild(fullScreneUI[index]);
                        if(u){
                            u.visible = false;
                        }   
                    }
                }
            }
            this.root.visible = true;
        }
    }

    public hide(){
        if(this.root){
            this.root.visible = false;
        }
        if(this._owner){
            this._owner.showCover();
        }
    }

    private _events: Map<string, Function> = new Map();

    /**
     * 注册事件 ，在onLoad中注册，在onDestroy自动移除
     * @param name 
     * @param func 
     */
    protected addEvent(name: string, func: Function) {
        if (this._events.has(name)) {
            Log.e(`${name} 重复注册`);
            return;
        }
        this._events.set(name, func);
    }

    protected removeEvent(eventName: string) {
        if (this._events.has(eventName)) {
            //事件移除
            Manager.dispatcher.remove(eventName, this);
            //删除本地事件
            this._events.delete(eventName);
        }
    }
    protected addEvents() {

    }

    addListeners() {
        this._events.forEach((func,name)=>{
            Manager.dispatcher.add(name,func,this);
        });
    }

    removeEventListeners() {
        this._events.forEach((func,name)=>{
            Manager.dispatcher.remove(name,this);
        });
        this._events.clear();
    }
}
