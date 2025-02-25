import { GameEvent } from "../../../../scripts/common/event/GameEvent";
import FLevel2UI from "../../../../scripts/common/fairyui/FLevel2UI";
import { CommSubID, GroupId, RedDotId } from "../../../../scripts/def/GameEnums";
import HallView from "./HallView";

export default class RedDot extends FLevel2UI {
    //k -- enum RedDotId
    private rp: { [k: number]: (fgui.GLabel) } = {}

    private atViewRoot: fgui.GComponent = null;

    public show(){
 
    }

    public hide(){

    }

    protected addEvents(): void {
        for (let index = 1; index < RedDotId.RedDotId_Set; index++) {
            this.addEvent(GameEvent.GP_Update+GroupId.GI_RedDot+"_"+index,this.onChange);   
        }
        this.addEvent(GameEvent.UI_SHOW_ATVIEW,this.onATViewShow); 
        this.addEvent(GameEvent.GP_Update+GroupId.GI_Comm+"_"+CommSubID.CommSubID_AchievRed,this.onTaskChange); 
        this.addEvent(GameEvent.GP_Update+GroupId.GI_Comm+"_"+CommSubID.CommSubID_GradeReward,this.onGradeChange); 
    }

    protected onBind(): void {
        this.addEvents();
        this.rp = {};
        let left = this.root.getChild("left").asCom;
        this.bindRp(left.getChild("dzp"),RedDotId.RedDotId_Lottery);
        this.bindRp(left.getChild("qd"),RedDotId.RedDotId_SignIn);
        this.bindRp(left.getChild("xshd"),RedDotId.RedDotId_TimedLogin);

        let buttom = this.root.getChild("buttom").asCom;
        this.bindRp(buttom.getChild("yj"),RedDotId.RedDotId_Mail);
        this.bindRp(buttom.getChild("cj"),RedDotId.RedDotId_Achiev);
        this.bindRp(buttom.getChild("phb"),RedDotId.RedDotId_RankList);
        this.bindRp(buttom.getChild("hd"),RedDotId.RedDotId_Act);
        this.bindRp(buttom.getChild("beibao"),RedDotId.RedDotId_Bag);
        // this.bindRp(buttom.getChild("hf"),RedDotId.RedDotId_Money);

        this.bindRp(this.root.getChild("shop"),RedDotId.RedDotId_Shop);

        let top = this.root.getChild("top").asCom;
        this.bindRp(top.getChild("sz"),RedDotId.RedDotId_Set);
        
    }

    private bindRp(obj:fgui.GObject,key:number){
        // Log.d("======================",obj.name,obj.asCom.getChild("rp").asLabel);
        this.rp[key] = obj.asCom.getChild("rp").asLabel;
        // Log.d( this.rp[key].name)
        this.rp[key].text = "";
        this.rp[key].visible = false;
    }

    onChange(gv:pb.IGroupValue){
        this.updateRd(gv.subId,gv.value);
    }

    public onLoad(){
        for (let index = 1; index < RedDotId.RedDotId_Set; index++) {
            let rd = Manager.gd.playerGV(GroupId.GI_RedDot,index,0);
            this.updateRd(index,rd);
        }
    }

    private updateRd(rdId:number,count:number){
        //商店红点特殊处理
        if(rdId == RedDotId.RedDotId_Shop || rdId == RedDotId.RedDotId_Lottery){
            count = 1;
        }
        let rdLabel = this.rp[rdId];
        if(rdLabel != null){
            rdLabel.text = "";
            rdLabel.visible = false;
            let rp = rdLabel.getChild("rp");
            rp.scaleX = 1;
            rp.scaleY = 1;
            if(count == 1){
                rdLabel.visible = true;
            }else if(count > 1){
                rdLabel.visible = true;
                rdLabel.text = count.toString();
                // rp.scaleX = 1.5;
                // rp.scaleY = 1.5;
            }
        }
    }

    private updateAtRd(obj:fgui.GObject,count:number){
        let rdLabel = obj.asCom.getChild("rp").asLabel;
        if(rdLabel != null){
            rdLabel.text = "";
            rdLabel.visible = false;
            let rp = rdLabel.getChild("rp");
            rp.scaleX = 1;
            rp.scaleY = 1;
            if(count == 1){
                rdLabel.visible = true;
            }else if(count > 1){
                rdLabel.visible = true;
                rdLabel.text = count.toString();
                // rp.scaleX = 1.5;
                // rp.scaleY = 1.5;
            }
        }
    }

    onTaskChange(gv:pb.IGroupValue){
        if(this.atViewRoot != null){
            this.updateAtRd(this.atViewRoot.getChild("tab0"),gv.value);
        }
    }

    onGradeChange(gv:pb.IGroupValue){
        if(this.atViewRoot != null){
            this.updateAtRd(this.atViewRoot.getChild("tab1"),gv.value);
        }
    }

    onATViewShow(viewRoot:fgui.GComponent){
        this.atViewRoot = viewRoot;
        let count = Manager.gd.playerGV(GroupId.GI_Comm,CommSubID.CommSubID_AchievRed,0);
        // Log.d("onATViewShow task:",count);
        this.updateAtRd(this.atViewRoot.getChild("tab0"),count);
        count = Manager.gd.playerGV(GroupId.GI_Comm,CommSubID.CommSubID_GradeReward,0);
        // Log.d("onATViewShow grade:",count);
        this.updateAtRd(this.atViewRoot.getChild("tab1"),count);
    }
}
