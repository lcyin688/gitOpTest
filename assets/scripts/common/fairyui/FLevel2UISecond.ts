

export default class FLevel2UISecond {
    protected root:fgui.GComponent = null;

    protected _close:fgui.GObject = null;

    public constructor(ui:fgui.GComponent,isSetCenter=false){
        this.setOwner(ui,isSetCenter);
        // this.onBind();
    }

    public setOwner(ui:fgui.GComponent,isSetCenter:boolean){
       this.onClear();
        this.root = ui.root;
        if (isSetCenter) {
            this.root.center();
        }
    }

    public bind(){
        this.onBind();
    }

    protected bindCloseClick(){
        this._close.onClick(this.hide,this);
    }


    protected onClear(){

    }

    protected onBind(){

    }

    public onData(){

    }

    public show(){
        if (this.root){
            this.root.visible = true;
        }
        Log.d(this);
    }

    public hide(){
        if(this.root){
            this.root.visible = false;
        }

    }
}
