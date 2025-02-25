import { Config } from "../../../../../scripts/common/config/Config";
import FLevel2UI from "../../../../../scripts/common/fairyui/FLevel2UI";
import { ProtoDef } from "../../../../../scripts/def/ProtoDef";
import GameView from "../../../../../scripts/framework/core/ui/GameView";
import { HallLogic } from "../../logic/HallLogic";
import HallView from "../HallView";

export default class LogonRedPacket extends FLevel2UI {

    protected ct:fgui.GComponent = null;

    public Init(ui: GameView, name?: string): void {

        this.onClear();
        this._owner = ui;
        this.root = fgui.UIPackage.createObject(Config.BUNDLE_HALL,"ECHb").asCom;
        this._owner.root.addChild(this.root);

        this.ct = this.root.getChild("context").asCom;
        this.ct.getChild("kai").onClick(this.onClickOpen,this);
        this.ct.getChild("ljdh").onClick(this.onClickOpen,this);
        this.ct = this.root.getChild("context").asCom;
        this._close = this.ct.getChild("close");
        this.bindCloseClick();
        this.root.makeFullScreen();
        this.addEvents();
        this.root.visible = false;
    }

    public hide(){
        super.hide();
        let lg = Manager.logicManager.get<HallLogic>(HallLogic);
        if(lg != null){
            lg.clearPop()
            lg.showPop();
        }
    }
    
    protected addEvents(): void {
        
    }

    protected view(): HallView {
        return this._owner as HallView;
    }

    public show(): void {
        super.show();
        let data = Manager.gd.get<pb.S2CGiveBeginnerMoney>(ProtoDef.pb.S2CGiveBeginnerMoney);
        
        this.ct.getChild("xrzs").text = Manager.utils.formatCNY(data.total,false)+"元额度";
        this.ct.getChild("jrdz").text = Manager.utils.formatCNY(data.cur,false)+"元额度";
        this.ct.getChild("sy").text = Manager.utils.formatCNY(data.left,false)+"元额度";
        if(data.first){
            this.ct.getChild("desc").text = "立即到账";
        }else{
            this.ct.getChild("desc").text = "今日到账";
        }
        Manager.gd.put(ProtoDef.pb.S2CGiveBeginnerMoney,null);
    }

    onClickOpen(){
        this.hide();
        this.view().onClickHf();
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
