

import FLevel2UI from "../../../../scripts/common/fairyui/FLevel2UI";
import { ActivityType, ActOption, GroupId, RewardState, ZaiXianRewardState } from "../../../../scripts/def/GameEnums";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";
import { HallLogic } from "../logic/HallLogic";
import HallView from "./HallView";

export default class RegularReward extends FLevel2UI {


    private ct:fgui.GComponent = null;
    private dlg:fgui.GComponent = null;
    private list:fgui.GList = null;
    private listDesc:fgui.GList = null;

    protected view(): HallView {
        return this._owner as HallView;
    }

    protected lg(): HallLogic {
        return this.view().logic;
    }

    protected addEvents(): void {
        this.addEvent(ProtoDef.pb.S2CZaiXianInfo, this.onS2CZaiXianInfo);
        this.addEvent(ProtoDef.pb.S2CZaiXianReward, this.onS2CZaiXianReward);
    }

    protected onBind(): void {
        this.addEvents();
        this.ct = this.root.getChild("rl").asCom;
        this._close = this.ct.getChild("close");
        this.dlg = this.ct.getChild("ruledlg").asCom;
        let context = this.dlg.getChild("context").asCom;
        this.list = this.ct.getChild("list").asList;
        this.list.on(fgui.Event.CLICK_ITEM, this.onClickItem, this);
        context.getChild("close").onClick(this.onClickCloseDlg,this);
        context.getChild("qd").onClick(this.onClickCloseDlg,this);
        this.bindCloseClick();
        this.ct.getChild("tips").onClick(this.onClickDlg,this);
        this.listDesc = context.getChild("list").asList;
    }

    onClickDlg(){
        this.dlg.visible = true;
    }

    onClickCloseDlg(){
        this.dlg.visible = false;
    }

    onS2CZaiXianInfo(data:pb.S2CZaiXianInfo){
        this.show();
        Log.d("RegularReward.onS2CZaiXianInfo:",data);
        this.listDesc.removeChildrenToPool();
        let dcom = this.listDesc.addItemFromPool().asCom;
        dcom.getChild("desc").text = "定时登陆即可获得奖励：";
        this.list.removeChildrenToPool(); 
        for (let index = 0; index < data.data.length; index++) {
            let di = data.data[index];
            let com = this.list.addItemFromPool().asCom;
            com.getChild("name").text = di.title;
            this.updateStatus(com,di.state);
            com.getChild("time").text = di.time;
            let rList = com.getChild("list").asList;
            com.data = di;
            rList.removeChildrenToPool();
            for (let child = 0; child < di.reward.length; child++) {
                let cc = rList.addItemFromPool().asCom;
                cc.getChild("loader").icon = Manager.gd.getActivePropIcon4(di.reward[child].key);
                if(di.reward[child].value < 0){
                    cc.getChild("num").text = "???";
                }else{
                    cc.getChild("num").text = Manager.utils.formatCoin(di.reward[child].value,di.reward[child].key);
                }
            }

            let dcom = this.listDesc.addItemFromPool().asCom;
            dcom.getChild("desc").text = di.title+di.time+"登陆游戏，可领取"+di.title+"奖励";
        }
        dcom = this.listDesc.addItemFromPool().asCom;
        dcom.getChild("desc").text = "登录奖励每日凌晨0:00重置刷新";
        
    }

    private onClickItem(com: fgui.GComponent){
        if(com.data != null){
            if(com.data.state == ZaiXianRewardState.DSRS_InTime){
                let jsonData={adname:"",parms1:"",parms2:""}
                jsonData.adname="Ad_TimedLogin";
                jsonData.parms1=com.data.id.toString();
                jsonData.parms2="";
                Manager.adManeger.WatchAds(jsonData,()=>{
                    if (!Manager.platform.isAdOpen()) {
                        this.lg().zaiXianReward(com.data.id);
                    } 

                })
            }
        }
    }

    onS2CZaiXianReward(data:pb.S2CZaiXianReward){
        Log.d("RegularReward.onS2CZaiXianReward:",data);
        if(data.errcode != 1){
            Manager.tips.show("领取奖励失败，请稍后再试！");   
            return;
        }
        for (let index = 0; index < this.list._children.length; index++) {
            let com = this.list.getChildAt(index).asCom;
            if(com.data.id == data.id){
                com.data.state = ZaiXianRewardState.DSRS_Geted;
                this.updateStatus(com,com.data.state);
                break;
            }
        }
    }

    private updateStatus(com:fgui.GComponent,status:number){
        if(status == ZaiXianRewardState.DSRS_InTime){
            com.getController("status").selectedIndex = 0;
        }else if(status == ZaiXianRewardState.DSRS_Geted){
            com.getController("status").selectedIndex = 1;
        }else{
            com.getController("status").selectedIndex = 2;
        }
        Manager.utils.quickSetIcon(com);
    }

}


