

import { Config } from "../../../../scripts/common/config/Config";
import FLevel2UI from "../../../../scripts/common/fairyui/FLevel2UI";
import { ADManeger } from "../../../../scripts/common/utils/ADManeger";
import { ActivityType, ActOption, GroupId } from "../../../../scripts/def/GameEnums";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";
import { HallLogic } from "../logic/HallLogic";
import HallView from "./HallView";

export default class RotaryTable extends FLevel2UI {


    private ct:fgui.GComponent = null;
    private item:fgui.GComponent = null;

    private cfg:pb.ActivityCfg = null;
    private data:pb.S2CDoActivity = null;

    private isLock:number = -1;


    private g1:fgui.GTweener = null;
    private g2:fgui.GTweener = null;
    private g3:fgui.GTweener = null;

    protected view(): HallView {
        return this._owner as HallView;
    }

    protected lg(): HallLogic {
        return this.view().logic;
    }

    protected addEvents(): void {
        this.addEvent(ProtoDef.pb.S2CActivityData+"_"+ActivityType.ActivityType_Lottery, this.onS2CActivityData);
        this.addEvent(ProtoDef.pb.S2CDoActivity+"_"+ActivityType.ActivityType_Lottery, this.onS2CDoActivity);
    }

    protected onBind(): void {
        this.addEvents();
        this.ct = this.root.getChild("ct").asCom;
        this.item = this.ct.getChild("item").asCom;
        this._close = this.ct.getChild("close");

        this.ct.getChild("br").onClick(this.onClickRotary,this);
        let ad = this.ct.getChild("ad");
        ad.onClick(this.onClickVideoRotary,this);

        Manager.utils.quickSetIcon(ad);

        this.bindCloseClick();
    }

    public hide(): void {
        if(this.isLock > 0){
            return;
        }
        Manager.reward.pause = false;
        super.hide();
    }

    onS2CActivityData(data:pb.ActivityCfg){
        Log.d("RotaryTable.onS2CActivityData:",data);
        this.show();
        this.isLock = 0;
        this.cfg = data;
        this.refreshLeftTimes();
        for (let index = 0; index < data.turnTable.actItems.length; index++) {
            let ai = data.turnTable.actItems[index];
            let com = this.item.getChild("i"+index).asCom;
            Manager.gd.getNBPropIcon(ai.reward.itemType,com.getChild("loader").asLoader);
            com.getChild("sum").text = Manager.utils.formatCoin(ai.reward.value,ai.reward.itemType);
            com.data = ai;
            if(index % 2 == 0){
                com.getTransition("t0").play(null,-1);
            }else{
                com.getTransition("t1").play(null,-1);
            }
            com.getChild("eft").visible = true;
        }
    }

    protected refreshLeftTimes(){
        let free = Manager.gd.playerGV(GroupId.GI_ActLotteryFreeTimes,this.cfg.id,0);
        let ad = Manager.gd.playerGV(GroupId.GI_ActLotteryAdvertTimes ,this.cfg.id,0);
        if(free < this.cfg.turnTable.freeTimes){
            this.ct.getChild("adcount").text = "剩余免费次数:" + (this.cfg.turnTable.freeTimes - free);
        }else{
            if(ad < this.cfg.turnTable.advertTimes){
                if(Manager.platform.isAdOpen()){
                    this.ct.getChild("adcount").text = "看视频即可免费抽奖，剩余次数：" + (this.cfg.turnTable.advertTimes - ad);
                }else{
                    this.ct.getChild("adcount").text = "分享即可免费抽奖，剩余次数：" + (this.cfg.turnTable.advertTimes - ad);
                }
            }
        }
    }

    protected autoRotary(){
        let free = Manager.gd.playerGV(GroupId.GI_ActLotteryFreeTimes,this.cfg.id,0);
        let ad = Manager.gd.playerGV(GroupId.GI_ActLotteryAdvertTimes ,this.cfg.id,0);
        if(free < this.cfg.turnTable.freeTimes){
            this.onRotary(ActOption.ActOpt_Free);
        }else{
            if(ad < this.cfg.turnTable.advertTimes){
                this.onClickVideoRotary();
            }
        }
    }

    onClickVideoRotary(){

        // Log.e("onClickVideoRotary  ",cc.sys.os)
        //看广告
        let jsonData={adname:"Ad_Lottery",parms1:this.cfg.id.toString(),parms2:""}
        Manager.adManeger.WatchAds(jsonData,()=>{
            if (!Manager.platform.isAdOpen()) {
                this.onRotary(ActOption.ActOpt_Advert);
            }
           
        } ,false )
        // this.onRotary(ActOption.ActOpt_Advert);
    }

    onClickRotary(){
        this.autoRotary();
    }

    onRotary(ot:ActOption){
        Log.d("onRotary:",this.isLock);

        if(this.isLock == 3){
            return;
        }

        if(this.isLock == 1){
            return;
        }
        if(this.isLock == 2){
            this.onRotaryFinish();
            return;
        }

        this.isLock = 1;
        Manager.reward.pause = true;
        this.lg().doActivity(this.cfg.id,ot);
    }
    
    
    onS2CDoActivity(data:pb.S2CDoActivity){
        if(data.ec == 1){
            this.data = data;
            this.onRotaryReward();
            this.isLock = 2;
        }else{
            this.isLock = 0;
            Manager.tips.debug("抽奖失败");
        }
    }

    onRotaryReward(){
        for (let index = 0; index < this.cfg.turnTable.actItems.length; index++) {
            let com = this.item.getChild("i"+index).asCom;
            com.getTransition("t0").stop();
            com.getTransition("t1").stop();
            com.getTransition("t2").stop();
            com.getChild("eft").visible = false;
        }

        Manager.globalAudio.playEffect("audio/reward_zhaunpan",Config.BUNDLE_HALL);

        this.g1 = fgui.GTween.to(this.item.rotation, this.item.rotation+360, 0.5)
        .setTarget(this.item)
        .setEase(fgui.EaseType.QuadIn)
        .onUpdate(function (tweener:fgui.GTweener): void {
            tweener.target.rotation = tweener.value.x;
        }, this).onComplete(this.onRotaryComplete.bind(this));
    }

    setReward(){
        let start = -1;
        for (let index = 0; index < this.cfg.turnTable.actItems.length; index++) {
            let com = this.cfg.turnTable.actItems[index];
            if(com.id == this.data.subId){
                start = index;
                break;
            }
        }

        if(start > -1){
            let cl =  this.cfg.turnTable.actItems.length;
            for (let index = 0; index < cl; index++) {
                let key = (index+start) % cl;
                Log.d("onS2CDoActivity",start,this.data.subId,key);
                let ai = this.cfg.turnTable.actItems[key];
                let com = this.item.getChild("i"+index).asCom;
                Manager.gd.getNBPropIcon(ai.reward.itemType,com.getChild("loader").asLoader);
                com.getChild("sum").text = Manager.utils.formatCoin(ai.reward.value,ai.reward.itemType);
                com.data = ai;
            }
        }else{
            Manager.tips.show("reward id not found:"+this.data.subId);
        }
    }

    onRotaryComplete(){
        this.g2 = fgui.GTween.to(this.item.rotation, this.item.rotation+360*5, 2)
        .setTarget(this.item)
        .setEase(fgui.EaseType.Linear)
        .onUpdate(function (tweener:fgui.GTweener): void {
            tweener.target.rotation = tweener.value.x;
        }, this).onComplete(this.onRotaryFinish.bind(this));
    }

    onRotaryFinish(){
        if(this.g1 != null){
            this.g1.kill();
        }
        if(this.g2 != null){
            this.g2.kill();
        }
        this.isLock = 3;
        this.setReward();
        this.g3 = fgui.GTween.to(0, 360, 1)
        .setTarget(this.item)
        .setEase(fgui.EaseType.QuadOut)
        .onUpdate(function (tweener:fgui.GTweener): void {
            tweener.target.rotation = tweener.value.x;
        }, this).onComplete(this.onFinish.bind(this));
    }

    onFinish(){
        Manager.reward.pause = false;
        this.isLock = 0;
        // this.ct.getChild("adcount").data = this.ct.getChild("adcount").data - 1;
        // if(this.ct.getChild("adcount").data < 0){
        //     this.ct.getChild("adcount").data = 0;
        // }
        // this.ct.getChild("adcount").text = "剩余免费广告次数:" + this.ct.getChild("adcount").data;
        this.refreshLeftTimes();
        let com = this.item.getChild("i0").asCom;
        com.getTransition("t2").play(null,-1);
        com.getChild("eft").visible = true;

        //转完后发奖励
        Manager.reward.pause = false;
    }
}
