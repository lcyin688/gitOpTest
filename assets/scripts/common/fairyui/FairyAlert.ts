import { Macro } from "../../framework/defines/Macros";

class AlertWindow extends fgui.Window {

    private _title : fgui.GTextField = null;
    private _content : fgui.GRichTextField = null;
    private _confirm : fgui.GButton = null;
    private _cancel : fgui.GButton = null;

    private _config: AlertConfig = null;

    private _isConfirm : boolean = false;

    public constructor() {
        super();
    }

    public dispose(): void {
        Log.d("dispose");
    }

    public get config() {
        return this._config;
    }
    protected onInit(): void {
        this.load();
    }

    private load(){
        this.contentPane = fgui.UIPackage.createObject("base","AlertFrame").asCom;
        this.center();
        this.setPivot(0.5, 0.5);
        this._title = this.frame.getChild("title").asTextField;
        this._content = this.contentPane.getChild("content").asRichTextField;
        this._confirm = this.contentPane.getChild("confirm").asButton;
        this._cancel = this.contentPane.getChild("cancel").asButton;
        this.writeContent(this._config);
        this.showButton(this._config);
    }

    public open(config: AlertConfig) {
        if (!config.title) {
            config.title = Manager.getLanguage("alert_title");
        }
        if (!config.confirmString) {
            config.confirmString = Manager.getLanguage("alert_confirm");
        }
        if (!config.cancelString) {
            config.cancelString = Manager.getLanguage("alert_cancel");
        }
        this._isConfirm = false;
        this._config = config;
        this.show();
    }

    /**@description 写入提示文字 */
    private writeContent(config: AlertConfig) {
        //写内容,
        if (config.richText) {
            this._content.text = config.richText;
        }
        else {
            this._content.text = config.text;
        }

        //写标题
        if (config.title) {
            this._title.text = config.title;
        }

        //写按钮
        if (config.confirmString) {
            this._confirm.text = config.confirmString;
        }

        if (config.cancelString) {
            this._cancel.text = config.cancelString;
        }
    }

    private onClickConfirm(evt: fgui.Event) {
        this._isConfirm = true;
        if (this._config.immediatelyCallback) {
            if (this._config.confirmCb != null){
                this._config.confirmCb(true);
            } 
        } 
        this.hide();
    }

    private onClickCancel(evt: fgui.Event) {
        this._isConfirm = false;
        if (this._config.immediatelyCallback) {
            if (this._config.cancelCb != null){
                this._config.cancelCb(false);
            } 
        }
        this.hide();
    }

    protected doShowAnimation(): void {
        this.setScale(0.1, 0.1);
        fgui.GTween.to2(0.1, 0.1, 1, 1, 0.3)
            .setTarget(this, this.setScale)
            .setEase(fgui.EaseType.QuadOut)
            .onComplete(this.onShown, this);
    }

    protected doHideAnimation(): void {
        fgui.GTween.to2(1, 1, 0, 0, 0.3)
            .setTarget(this, this.setScale)
            .setEase(fgui.EaseType.QuadOut)
            .onComplete(this.hideImmediately, this);
    }

    protected onShown(): void {

    }

    protected onHide(): void {
        if (!this._config.immediatelyCallback) {
            if (this._isConfirm){
                if (this._config && this._config.confirmCb != null){
                    this._config.confirmCb(this._isConfirm);
                }
            }else{
                if (this._config && this._cancel.visible){
                    this._config.cancelCb(this._isConfirm);
                }
            }
        }
        Manager.alert.close();
    }

    /**@description 显示按钮 */
    private showButton(config: AlertConfig) {
        if (this._confirm && this._cancel) {

            //确定按钮
            if (config.confirmCb) {
                this._confirm.visible = true;
                this._confirm.onClick(this.onClickConfirm,this);
            }
            else {
                this._confirm.visible = false;
            }

            //取消按钮
            if (config.cancelCb) {
                this._cancel.visible = true;
                this._cancel.onClick(this.onClickCancel,this);
            } else {
                this._cancel.visible = false;
            }

            if (this._confirm.visible) {
                //确定按钮有显示
                if (this._cancel.visible) {
                    //两个按钮都显示，
                } else {
                    //只有显示确定
                    this._confirm.x = 335;
                }
            } else {
                //确定按钮没有显示
                if (this._cancel.visible) {
                    //只有一个取消按钮
                    this._cancel.x = 335;
                } else {
                    //无按钮显示，输入警告
                    Log.w("提示框无按钮显示");
                }
            }

        }
    }
}


export default class FairyAlert {

    private static _instance: FairyAlert = null;
    public static Instance() { return this._instance || (this._instance = new FairyAlert()); }

    private curPanel: AlertWindow = null;
    private queue: AlertConfig[] = [];

    constructor() {
 
    }

    private getConfig( config : AlertConfig ){
        let result : AlertConfig = {};
        if( config.tag ){
            result.tag = config.tag;
        }
        if( config.text){
            result.text = config.text;
        }
        if( config.title){
            result.title = config.title;
        }
        if( config.confirmString){
            result.confirmString = config.confirmString;
        }
        if( config.cancelString){
            result.cancelString = config.cancelString;
        }
        if( config.richText){
            result.richText = config.richText;
        }
        if( config.immediatelyCallback){
            result.immediatelyCallback = config.immediatelyCallback;
        }
        if( config.isRepeat){
            result.isRepeat = config.isRepeat;
        }
        return result;
    }
    /**
     * @description 显示弹出框
     * @param config 配置信息
     */
    public show(config: AlertConfig) {
        if (config.tag && config.isRepeat === false) {
            if (this.isRepeat(config.tag)) {
                Log.w(`弹出框已经存在 config : ${JSON.stringify(this.getConfig(config))}`);
                return false;
            }
        }
        this.queue.push(config);
        this._show(config);
        return true;
    }

    /**@description 当前显示的弹出框是否是tag */
    public isCurrentShow(tag: string | number) {
        if (this.curPanel) {
            let current = this.curPanel.config;
            if (current.tag == tag) {
                return true;
            }
        }
        return false;
    }

    /**@description 获取当前显示弹出的配置 */
    public currentShow( tag? : string | number ){
        if( this.curPanel ){
            let current = this.curPanel.config;
            if( tag ){
                if( current.tag == tag ){
                    return current;
                }
            }else{
                return current;
            }
        }
        return null;
    }

    /**@description 是否有该类型的弹出框 */
    public isRepeat(tag: string | number) {
        if (this.curPanel) {
            let current = this.curPanel.config;
            if (current.tag == tag) {
                Log.w(`重复的弹出框 config ; ${JSON.stringify(this.getConfig(current))}`)
                return true;
            }
        } else {
            for (let i = 0; i < this.queue.length; i++) {
                let data = this.queue[i];
                if (data.tag == tag) {
                    Log.w(`重复的弹出框 config ; ${JSON.stringify(this.getConfig(data))}`)
                    return true;
                }
            }
        }
        return false;
    }

    /**@description 关闭当前显示的 
     * @param tag 可不传，关闭当前的弹出框，否则关闭指定tag的弹出框
     */
    public close(tag?: string | number) {
        if (tag) {
            let j = this.queue.length;
            while (j--) {
                if (this.queue[j].tag == tag) {
                    this.queue.splice(j, 1);
                }
            }
            if (this.curPanel) {
                let current = this.curPanel.config;
                if (current.tag == tag) {

                    this.finishAlert();
                }
            }
        } else {
            this.finishAlert();
        }
    }

    public closeAll() {
        this.queue = [];
        this.finishAlert();
    }

    public finishAlert() {
        if (this.curPanel) {
            this.curPanel.dispose();
            this.curPanel = null;
        }

        let config = this.queue.shift();
        if (this.queue.length != 0) {
            this._show(this.queue[0]);
            return this.queue[0];
        }
        return config;
    }

    private _show(config: AlertConfig) {
        Log.d("_show  this.curPanel",this.curPanel);
        if (!this.curPanel) {
            this.curPanel = new AlertWindow();
            this.curPanel.open(config);
        }
    }
}