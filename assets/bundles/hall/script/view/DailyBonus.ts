

import FLevel2UI from "../../../../scripts/common/fairyui/FLevel2UI";
import { ActivityType, ActOption, CurrencyType, GroupId, RewardState } from "../../../../scripts/def/GameEnums";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";
import { HallLogic } from "../logic/HallLogic";
import HallView from "./HallView";

export default class DailyBonus extends FLevel2UI {


    private ct:fgui.GComponent = null;
    private gift:fgui.GComponent = null;

    private cfg:pb.ActivityCfg = null;

    private isBigGift:boolean = false;
    protected view(): HallView {
        return this._owner as HallView;
    }

    protected lg(): HallLogic {
        return this.view().logic;
    }

    protected addEvents(): void {
        let key = ProtoDef.pb.S2CActivityData+"_"+ActivityType.ActivityType_Login;
        Log.d("DailyBonus.addEvents",key);
        this.addEvent(ProtoDef.pb.S2CActivityData+"_"+ActivityType.ActivityType_Login, this.onS2CActivityData);
        this.addEvent(ProtoDef.pb.S2CDoActivity+"_"+ActivityType.ActivityType_Login, this.onS2CDoActivity);
    }

    protected onBind(): void {
        this.addEvents();
        this.ct = this.root.getChild("sign").asCom;
        this._close = this.ct.getChild("close");
        this.gift = this.ct.getChild("gift").asCom;
        this.gift.onClick(this.onClickGift,this);
        this.bindCloseClick();

        for (let index = 0; index < 7; index++) {
            let o = this.ct.getChild("d"+index);
            if(o != null){
                o.onClick(this.onClickItem,this);
            }
        }
    }

    onS2CActivityData(data:pb.ActivityCfg){
        Log.d("DailyBonus.onS2CActivityData:",data);
        this.cfg = data;
        this.show();
        let ccid = Manager.gd.playerGV(GroupId.GI_ActCurDay,data.id,-1);
        Log.d("GroupId.GI_ActCurDay:",ccid);
        for (let index = 0; index < data.loginCfg.actItems.length; index++) {
            let di = data.loginCfg.actItems[index];
            let o = this.ct.getChild("d"+index);
            let cid = data.id * 10000 + di.id;
            let status = Manager.gd.playerGV(GroupId.GI_ActContLoginRewardState,cid,RewardState.RewardState_Null);
            if(di.id == 8){
                if(ccid == index){
                    this.isBigGift = true;
                }
                this.gift.data = di;
                this.gift.data.index = index; 
            }
            if(o != null){
                let com = o.asCom;
                this.safeSetText(com,"txtyl",di.desc);
                this.safeSetText(com,"txtjt",di.desc);
                this.safeSetText(com,"txtwl",di.desc);

                // let r = Manager.utils.formatCoin(di.reward.value,di.reward.itemType);
                let r = di.rewardName;
                this.safeSetText(com,"txtyldou",r);
                this.safeSetText(com,"txtjtdou",r);
                this.safeSetText(com,"txtwldou",r);
                
                let loader = com.getChild("loader");
                if (loader){
                    if (di.reward.length == 1){
                        Manager.gd.getActivePropIcon(di.reward[0].itemType,loader.asLoader);
                    }else{
                        let haveJD = false;
                        let haveZs = false;
                        let haveLJ = false;
                        let haveDJK = false;
                        for (let index1 = 0; index1 < di.reward.length; index1++) {
                            let id = di.reward[index1].itemType;
                            if (id==CurrencyType.CT_Coin){
                                haveJD = true;
                            }else if (id==CurrencyType.CT_Gem){
                                haveZs = true;
                            }else if (id==CurrencyType.CT_HuafeiQuan ){
                                haveLJ = true;
                            }else{
                                haveDJK = true;
                            }
                        }
                        loader.icon = fgui.UIPackage.getItemURL("hall",this.getIcon(haveJD,haveZs,haveLJ,haveDJK));
                    }
                }

                let c = com.getController("sgc");
                if(c){
                    Log.e("status:",GroupId.GI_ActContLoginRewardState,cid,status);
                    this.updateStatus(c,status,ccid == index);
                }

                com.data = di;
                com.data.index = index; 
            }
        }
    }

    private getIcon(haveJD:boolean,haveZs:boolean,haveLJ:boolean,haveDJK:boolean):string {
        if (haveJD && haveZs && haveDJK && haveLJ){
            return "ui_sign_dou13";
        }
        if (haveJD && haveZs && haveLJ){
            return "ui_sign_dou10";
        }
        if (haveJD && haveZs && haveDJK){
            return "ui_sign_dou15";
        }
        if (haveJD && haveLJ && haveDJK){
            return "ui_sign_dou11";
        }
        if (haveZs && haveLJ && haveDJK){
            return "ui_sign_dou12";
        }

        if (haveJD && haveZs){
            return "ui_sign_dou14";
        }
        if (haveJD && haveLJ){
            return "ui_sign_dou5";
        }
        if (haveJD && haveDJK){
            return "ui_sign_dou6";
        }
        if (haveZs && haveLJ){
            return "ui_sign_dou7";
        }
        if (haveZs && haveDJK){
            return "ui_sign_dou8";
        }
        if (haveLJ && haveDJK){
            return "ui_sign_dou9";
        }
        return;
    }

    private onClickItem(evt: fgui.Event){
        let obj = fgui.GObject.cast(evt.currentTarget);
        if(obj.data != null && this.cfg != null){
            let cid = this.cfg.id * 10000 + obj.data.id;
            let status = Manager.gd.playerGV(GroupId.GI_ActContLoginRewardState,cid,RewardState.RewardState_Null);
            if(status == RewardState.RewardState_Reach || status == RewardState.RewardState_Back){
                let jsonData={adname:"",parms1:"",parms2:""}
                jsonData.adname="Ad_SignIn";
                jsonData.parms1=this.cfg.id.toString();
                jsonData.parms2=obj.data.id.toString();
                Log.d("jsonData  ",jsonData);
                Manager.adManeger.WatchAds(jsonData,()=>{
                    if (!Manager.platform.isAdOpen()) {
                        this.lg().doActivity(this.cfg.id,ActOption.ActOpt_GetReward,obj.data.id);
                    } 

                })


            }else{
                Log.e("未达成或已领取：","cid->"+cid+" status"+status);
            }
        }   
    }

    private onClickGift(evt: fgui.Event){
        this.onClickItem(evt)
    }

    private safeSetText(com:fgui.GComponent,name:string,value:any){
        let o = com.getChild(name);
        if(o){
            o.text = value.toString();
        }
    }

    private safeSetIcon(com:fgui.GComponent,name:string,value:any){
        let o = com.getChild(name);
        if(o){
            o.icon = value.toString();
        }
    }

    onS2CDoActivity(data:pb.S2CDoActivity){
        let start = -1;
        for (let index = 0; index < this.cfg.loginCfg.actItems.length; index++) {
            let com = this.cfg.loginCfg.actItems[index];
            if(com.id == data.subId){
                start = index;
                break;
            }
        }

        if(start > -1){
            let o = this.ct.getChild("d"+start);
            if(o != null){
                let com = o.asCom;
                let c = com.getController("sgc");
                if(c){
                    let cid = data.id * 10000 + com.data.id;
                    let status = Manager.gd.playerGV(GroupId.GI_ActContLoginRewardState,cid,RewardState.RewardState_Null);
                    let ccid = Manager.gd.playerGV(GroupId.GI_ActCurDay,data.id,-1);
                    Log.d("GroupId.GI_ActCurDay:",ccid);
                    this.updateStatus(c,status,ccid==com.data.index);
                }
            }
        }else{
            Manager.tips.show("reward id not found:"+data.subId);
        }
    }

    private updateStatus(c:fgui.Controller,status:number,isToday:boolean=false){
        if(status == RewardState.RewardState_Reach){
            if(isToday){
                c.selectedPage = "今日未签";
            }else{
                c.selectedPage = "过时未签";
            }
        }else if(status == RewardState.RewardState_Geted){
            if(isToday){
                c.selectedPage = "今日已签";
            }else{
                c.selectedPage = "过时已签";
            }
        }else if(status == RewardState.RewardState_Back){
            c.selectedPage = "过时未签";
        }else{
            c.selectedPage = "未达成";
        }
    }

}


