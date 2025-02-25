import { Config } from "../../../../scripts/common/config/Config";
import FLevel2UI from "../../../../scripts/common/fairyui/FLevel2UI";
import { NoticeTarget } from "../../../../scripts/def/GameEnums";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";
import { HallLogic } from "../logic/HallLogic";
import HallView from "./HallView";

;

export default class ActivityPop extends FLevel2UI {

    private cc:fgui.Controller = null;
    private txt:fgui.GRichTextField = null;
    private tt:fgui.GTextField = null;
    private btn:fgui.GButton = null;
    private img:fgui.GLoader = null;
    private notice:pb.ILoginNotice= null;

    public Init(ui: GameView, name?: string): void {

        this.onClear();
        this._owner = ui;
        this.root = fgui.UIPackage.createObject(Config.BUNDLE_HALL,"ActivityPop").asCom;
        this._owner.root.addChild(this.root);

        let ct = this.root.getChild("ct").asCom;

        this.cc = ct.getController("cc");
        let list = ct.getChild("list").asList;
        this.txt = list.getChildAt(0).asLabel.getChild("title").asRichTextField;
        list.getChildAt(0).asLabel.width = list.width;
        this.tt = ct.getChild("tt").asTextField;
        this.btn = ct.getChild("jump").asButton;
        this.img = ct.getChild("img").asLoader;
        this.btn.onClick(this.onClickJump,this);
        this.img.onClick(this.onClickJump,this);
 
        this._close = ct.getChild("close");
        ct.getChild("closejin").onClick(this.hide,this);
        this.bindCloseClick();
        this.root.makeFullScreen();
        this.addEvents();
        this.root.visible = false;
    }

    public hide(){
        super.hide();
        this.removeEventListeners();
        if(this.root){
            if(this.root.parent){
                this.root.parent.removeChild(this.root);
            }
            this.root.dispose();
        }

        // let lg = Manager.logicManager.get<HallLogic>(HallLogic);
        // if(lg != null){
        //     lg.clearPop()
        //     lg.showPop();
        // }
        Manager.uiqueue.close(this);
    }

    public setActData(notice:pb.ILoginNotice){
        this.notice = notice;
        Log.d("setActData S2CActNotice",notice);
        if(notice.imageUrl.length > 0){
            this.cc.selectedIndex = 1;
            this.img.icon = notice.imageUrl;
        }else{
            this.cc.selectedIndex = 0;
            this.btn.visible = false;
            this.tt.text = notice.title;
            this.txt.text = notice.text;
            if(notice.btnSwitch){
                this.btn.visible = true;
                this.btn.text = notice.btntext;
            }
        }
    }

    private onClickJump(){
        Log.d("onClickJump");
        if(this.notice.targetType < 0){
            this.hide();
        }
    }

    protected addEvents(): void {
        
    }

    protected view(): HallView {
        return this._owner as HallView;
    }

    removeEventListeners(): void {
        super.removeEventListeners();
        if(this.root != null){
            if(this.root.parent != null){
                this.root.parent.removeChild(this.root);
            }
            this.root.dispose();
        }
    }

}
