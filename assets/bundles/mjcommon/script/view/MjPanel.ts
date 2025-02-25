import { Config, ViewZOrder } from "../../../../scripts/common/config/Config";
import FLevel2UI from "../../../../scripts/common/fairyui/FLevel2UI";
import InvitedPlayer from "../../../../scripts/common/fairyui/InvitedPlayer";
import { GameService } from "../../../../scripts/common/net/GameService";
import { MahColor, MahHPGOPerate, MahTableStage, PropType } from "../../../../scripts/def/GameEnums";
import { RoomManager } from "../../../gamecommon/script/manager/RoomManager";
import { CommonMJConfig } from "../Config/CommonMJConfig";
import { MJEvent } from "../Event/MJEvent";
import { MJTool } from "../logic/MJTool";
import MJDispose from "../Manager/MJDispose";
import { MJC2SOperation } from "../net/MJC2SOperation";
import huTipView from "./huTipView";
import MJHandles from "./MJHandles";
import moreGangView from "./moreGangView";
import ReFlashPosition from "../../../gamecommon/script/tools/ReFlashPosition";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";



export default class MjPanel extends FLevel2UI {



    get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }

    protected bottom_Gc: fgui.GComponent = null;
    protected HuanSanZhangEff_Gc: fgui.GComponent = null;
    protected hszPlayer0_Gc: fgui.GComponent = null;
    protected hszPlayer1_Gc: fgui.GComponent = null;
    protected hszPlayer2_Gc: fgui.GComponent = null;
    protected hszPlayer3_Gc: fgui.GComponent = null;
    playersHSZ=
    {
        [0]:this.hszPlayer0_Gc,
        [1]:this.hszPlayer1_Gc,
        [2]:this.hszPlayer2_Gc,
        [3]:this.hszPlayer3_Gc,
    
    };
    
    // private tuoGuan_obj :  fgui.GObject = null;
    // private roboBtn_obj :  fgui.GObject = null;
    private tipsDeng_obj :  fgui.GObject = null;

    private tipsWZSprite_Gc :  fgui.GComponent = null;
    private tipsWZ_load :  fgui.GLoader = null;
    private tipsText_Gc :  fgui.GComponent = null;



    

    private m_objSelectLacking :  fgui.GComponent = null;
    

    private m_btnWan :fgui.GButton = null;
    private m_btnTiao :fgui.GButton = null;
    private m_btnTong :fgui.GButton = null;


    private m_objChangeThree :fgui.GComponent = null;
    private sureBtn_btn :fgui.GButton = null;

    private zhongxin_com: fgui.GComponent =null;


    private centerEff_loader3d :fgui.GLoader3D =null;

    

    private hutipView_Gc :  fgui.GComponent = null;
    private hutipView_SC :  huTipView = null;
    
    private moreGang_Gc :  fgui.GComponent = null;
    moreGang_SC :  moreGangView = null;


    //取消按钮只有在多杠的时候才触发
    private m_objcancle :  fgui.GObject = null;


    private nextGame_Btn :  fgui.GObject = null;
    private invite_Btn :  fgui.GObject = null;
    // private obj_quitGame :  fgui.GObject = null;
    
    private reFlashNextInvite_SC:ReFlashPosition=null;
    
    //对局流水详情按钮
    private recordBtnF_btn :fgui.GButton = null;



    public mjHandlesSC:MJHandles = null;
    


    m_EffectHSZ = false;  // 有没有播放过换三张动画

    m_blHuTipShow =false;// 亮不



    m_tipsTimer:number;
    //false 为别人出牌 true 自己摸牌
    // m_blisMineTurn: boolean;
    //当前的操作数据
    // m_tableHandles: number[];
    // m_objNormalCard: number;
    // m_pengCard: number;
    // m_huCard: number;
    // m_tableGangCards: pb.IId2Val[];
    kecaozuo:pb.IKeCaoZuo;

    m_TimerArr:number[]=[];


    private jpqBtn:fgui.GButton=null;

    private xinshoutip:fgui.GObject=null;


    protected onBind(): void 
    {

        
    }

    public setInit() {
        this.show();


        this.zhongxin_com  =this.root.getChild("center").asCom

        this.centerEff_loader3d = <fgui.GLoader3D> this.zhongxin_com.getChild("Effects").asCom.getChild("eff");
        // this.centerIcon_gload = this.zhongxin_com.getChild("Effects").asCom.getChild("icon").asLoader;


        

        // Log.e(this);
        this.HuanSanZhangEff_Gc = this.root.getChild("center").asCom.getChild("Effects").asCom.getChild("HuanSanZhangEff").asCom;
        this.hszPlayer0_Gc = this.HuanSanZhangEff_Gc.getChild("player0").asCom;
        this.hszPlayer1_Gc = this.HuanSanZhangEff_Gc.getChild("player1").asCom;
        this.hszPlayer2_Gc = this.HuanSanZhangEff_Gc.getChild("player2").asCom;
        this.hszPlayer3_Gc = this.HuanSanZhangEff_Gc.getChild("player3").asCom;
        this.playersHSZ=
        {
            [0]:this.hszPlayer0_Gc,
            [1]:this.hszPlayer1_Gc,
            [2]:this.hszPlayer2_Gc,
            [3]:this.hszPlayer3_Gc,
        
        };

        this.bottom_Gc = this.root.getChild("bottom").asCom;
        this.mjHandlesSC = new MJHandles(this.bottom_Gc.getChild("handles").asList);

        this.mjHandlesSC.HideAllHandle();
        

        // let tuoGuanBtn = this.bottom_Gc.getChild("tuoGuanBtn").asCom;
        // this.tuoGuan_obj = tuoGuanBtn.getChild("tuoGuanBtn");
        // this.roboBtn_obj = tuoGuanBtn.getChild("roboBtn");
        this.tipsWZSprite_Gc = this.bottom_Gc.getChild("mjTips").asCom;
        this.tipsWZ_load = this.tipsWZSprite_Gc.getChild("icon").asLoader;
        
        this.tipsText_Gc = this.bottom_Gc.getChild("mjTextTips").asCom;
        
        
        
        this.tipsDeng_obj = this.bottom_Gc.getChild("hutipBtn");
        this.m_objSelectLacking = this.bottom_Gc.getChild("selectlacking").asCom;

        this.m_btnWan = this.m_objSelectLacking.getChild("wan").asButton;
        this.m_btnTiao = this.m_objSelectLacking.getChild("tiao").asButton;
        this.m_btnTong = this.m_objSelectLacking.getChild("tong").asButton;
        this.m_objChangeThree = this.bottom_Gc.getChild("changeThree").asCom;
        this.sureBtn_btn = this.m_objChangeThree.getChild("sureBtn").asButton
        this.sureBtn_btn.getChild("title").text ="确认"

        

        this.hutipView_Gc = this.bottom_Gc.getChild("hutipView").asCom;
        this.hutipView_SC = new huTipView (this.hutipView_Gc);

        this.moreGang_Gc = this.bottom_Gc.getChild("moreGangView").asCom;
        this.moreGang_SC = new moreGangView (this.moreGang_Gc);
        

        this.reFlashNextInvite_SC = new ReFlashPosition (this.bottom_Gc.getChild("nextInviteBtns").asCom,50);
        

        // this.obj_quitGame = this.bottom_Gc.getChild("quitBtn");
                                                     
        this.nextGame_Btn = this.bottom_Gc.getChild("nextInviteBtns").asCom.getChild("nextBtn");
        this.invite_Btn = this.bottom_Gc.getChild("nextInviteBtns").asCom.getChild("inviteBtn");


        this.recordBtnF_btn = this.bottom_Gc.getChild("recordBtnF").asButton;


        this.jpqBtn =this.bottom_Gc.getChild("jpqBtn").asButton

        this.jpqBtn.onClick(()=>{

            CommonMJConfig.JiPaiQiTime = Manager.gd.MJJqpLeftTime();
            Log.e (" CommonMJConfig.JiPaiQiTime   ",CommonMJConfig.JiPaiQiTime)
            if(CommonMJConfig.JiPaiQiTime == 0)
            {
                dispatch("ShowPropBag")
                // Manager.tips.show("使用了记牌器就可看牌");
            }
            else
            {
                // this.jpqBtn.text = Manager.utils.transformLeftTime(CommonMJConfig.JiPaiQiTime);
                if (CommonMJConfig.RoomState> MahTableStage.TS_DingQue  ) 
                {
                    dispatch("ShowJiShiQi")
                }
            }

        },this);

        this.xinshoutip = this.bottom_Gc.getChild("n39");
        this.bottom_Gc.getChild("mask").onClick(()=>{this.xinshoutip.visible=false; },this);
        this.bottom_Gc.getChild("xinshoutip").asCom.getChild("n30").onClick(()=>{
            this.xinshoutip.visible=false; 
            let data = this.xinshoutip.data as pb.S2CMahBetterMjSuggestion
            Log.e("   点此进入  data  ",data);
            //参考破封卡 有得话去购买没有的话直接 跳转

            let tempData ={func:(isBackUse:boolean)=>{
                MJDispose.SetIsWaitBuystate(isBackUse)
            },propType:PropType.PropType_SuperSwapCard,dataSpe:data}
            Manager.gd.put("SpecialPropUse",tempData);
            dispatch("SpecialPropUse")


        },this);

        this.BindEvent();
        this.InitEvent();
        
    }




    InitEvent()
    {

        Manager.dispatcher.add(MJEvent.HIDE_ALL_HANDLE_BTN, this.HideAllHandleAndSelectGang,this);
        Manager.dispatcher.add(MJEvent.HIDE_HANDLE_OTHERHU, this.HideHandleOtherHu,this);
        Manager.dispatcher.add(MJEvent.SHOW_OUT_HAND_FANSHU_TIP, this.OnShowFanShuTip,this);
        Manager.dispatcher.add(MJEvent.CAN_CHANGE_CLICK, this.OnCanChangeClick,this);
        Manager.dispatcher.add(MJEvent.HIDE_SELECT_LACKING, this.OnHideSelectLacking,this);
        //麻将内部提示框
        Manager.dispatcher.add(MJEvent.SET_MJTIPS, this.SetMJTips,this);
        //麻将内部提示框关闭
        Manager.dispatcher.add(MJEvent.HIDE_MJTIPS, this.HideMJTips,this);
        //自己的取消托管按键亮起
        //麻将过手胡
        Manager.dispatcher.add(MJEvent.SHOWGUOSHOUBUHU, this.OnShowGuoShouTip,this);
        Manager.dispatcher.add(MJEvent.CLICK_PASS, this.OnPass,this);
        Manager.dispatcher.add(MJEvent.CLICK_PENG, this.OnPeng,this);
        Manager.dispatcher.add(MJEvent.CLICK_GANG, this.OnGang,this);
        Manager.dispatcher.add(MJEvent.CLICK_HU, this.OnHu,this);
        Manager.dispatcher.add(MJEvent.CLICK_MINGPAI, this.OnMingPai,this);
        Manager.dispatcher.add(MJEvent.CLICK_POFENG, this.OnPoFeng,this);
        Manager.dispatcher.add(MJEvent.SHOW_TANG_TIP_VIEW, this.SetTangTipView,this);
        Manager.dispatcher.add("NEXT_GAME", this.OnNextGame,this);
        Manager.dispatcher.add(MJEvent.SETACTIVENEXTGAMEMJ, this.SetActiveNextGame,this);
        Manager.dispatcher.add(MJEvent.SETACTIVEINVITEBTN, this.SetActiveInviteBtn,this);
        Manager.dispatcher.add("PLAYCENTEREFF", this.PlayCenterEff,this);
        Manager.dispatcher.add(ProtoDef.pb.S2CMahBetterMjSuggestion, this.OnS2CMahBetterMjSuggestion,this);

    }

    RemoveEvent()
    {

        Manager.dispatcher.remove(MJEvent.HIDE_ALL_HANDLE_BTN, this);
        Manager.dispatcher.remove(MJEvent.HIDE_HANDLE_OTHERHU, this);
        Manager.dispatcher.remove(MJEvent.SHOW_OUT_HAND_FANSHU_TIP, this);
        Manager.dispatcher.remove(MJEvent.CAN_CHANGE_CLICK, this);
        Manager.dispatcher.remove(MJEvent.HIDE_SELECT_LACKING, this);
        //麻将内部提示框
        Manager.dispatcher.remove(MJEvent.SET_MJTIPS, this);
        //麻将内部提示框关闭
        Manager.dispatcher.remove(MJEvent.HIDE_MJTIPS, this);
        //麻将过手胡
        Manager.dispatcher.remove(MJEvent.SHOWGUOSHOUBUHU, this);
        Manager.dispatcher.remove(MJEvent.CLICK_PASS, this);
        Manager.dispatcher.remove(MJEvent.CLICK_PENG, this);
        Manager.dispatcher.remove(MJEvent.CLICK_GANG, this);
        Manager.dispatcher.remove(MJEvent.CLICK_HU, this);

        Manager.dispatcher.remove(MJEvent.SHOW_TANG_TIP_VIEW, this);
        Manager.dispatcher.remove("NEXT_GAME", this);

        Manager.dispatcher.remove(MJEvent.SETACTIVENEXTGAMEMJ, this);
        Manager.dispatcher.remove(MJEvent.SETACTIVEINVITEBTN, this);

        
        Manager.dispatcher.remove("PLAYCENTEREFF",this);

    }


    OnSetView()
    {
        let inviteable = RoomManager.tableCommon.inviteable
        if (!inviteable) 
        {
            this.invite_Btn.asButton.text="邀请玩家游戏";
            let uiconfig = Manager.gd.get<pb.S2CUISwitches>(ProtoDef.pb.S2CUISwitches);
            if(uiconfig == null || uiconfig.items == null){
                return;
            }
            if(uiconfig.items["game_share"] == null || uiconfig.items["game_share"] == 0)
            {
                this.SetActiveInviteBtn(false);
            }
        }
        else
        {
            this.invite_Btn.asButton.text="退出游戏";
        }
    }


    /**  记牌器 */
    SetActivejpqBtn(isShow:boolean) 
    {
        this.jpqBtn.visible =isShow;
    }

    OnNextGame() 
    {

    }
    SetTangTipView() 
    {

    }
    // SetActiveCenterIcon(isShow: boolean) 
    // {
    //     this.centerIcon_gload.visible =isShow;
    
    // }

    // PlayCenterIcon(texture: string) 
    // {
    //     this.SetActiveCenterIcon(true);
    //     let urlStr = fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON,texture )
    //     this.centerIcon_gload.icon =urlStr;
    //     fgui.GTween.to(0.3, 1, 1)
    //     .setTarget( this.centerIcon_gload)
    //     .setEase(fgui.EaseType.CubicOut).onComplete(() => 
    //     {
    //         //透明度改变完成
    //         setTimeout(() => {
    //             this.SetActiveCenterIcon(false)
    //         }, 1000);
    //     }, this);

    // }



    /** 获取center位置给播放中心特效的节点 */
    GetCenterCom():fgui.GComponent
    {
        return this.zhongxin_com
    }

    SetActivecenterEff_loader3d(isShow :boolean)
    {
        this.centerEff_loader3d.visible = isShow;
    }
    

    /** 胡 */
    OnHu()
    {
        // Log.e("  OnHu this.m_huCard ffffffff   "  )
        // Log.e("  OnHu this.m_huCard   ",this.kecaozuo.KeHuMjs  )
        MJC2SOperation.HuCard(this.kecaozuo.KeHuMjs[0]);
        this.mjHandlesSC.HideAllHandle();
        this.HideMJTips();

    }

    /** 明牌 */
    OnMingPai()
    {
        Log.w(" OnMingPai   " )
        MJC2SOperation.MingPai();
        this.mjHandlesSC.HideMingPaiHandle();
    }

    /** 破封 */
    OnPoFeng()
    {
        Log.w(" OnPoFeng   " )
        // let tempData ={func:()=>{this.OnHu(); },propType:PropType.PropType_PoFengCard}
        let tempData ={func:(isBackUse:boolean)=>{
            MJDispose.SetIsWaitBuystate(isBackUse)
        },propType:PropType.PropType_PoFengCard,dataSpe:null}
        Manager.gd.put("SpecialPropUse",tempData);
        dispatch("SpecialPropUse")

    }


    /** 杠 */
    OnGang()
    {
        if (this.kecaozuo.KeGangMjs.length > 1 ) 
        {
            Log.w(" 多杠的时候  this.m_tableGangCards : ",this.kecaozuo.KeGangMjs)
            //多杠的时候 需要多杠选择
            this.moreGang_SC.SetMoreGangView(this.kecaozuo.KeGangMjs)
        } 
        else //胡牌后或者 躺牌 杠牌
        {
            //key 是操作 value 是杠的牌
            this.GangSureView(Number(this.kecaozuo.KeGangMjs[0].value),this.kecaozuo.KeGangMjs[0].key)
        }
        this.HideMJTips();
    }



    



    GangSureView(cardId:number,gangType:number) 
    {
        function ff(params:boolean) 
        {
            Log.d("Manager.alert ff",params);
            if (params)
            {
                MJC2SOperation.GangCard(cardId,gangType);
                this.mjHandlesSC.HideAllHandle();
            }
        }

        if ( cardId == 35 || cardId == 135 ) 
        {
            let cf:AlertConfig=
            {
                title:"提示",
                text: "您确定暗杠4个红中吗?", 
                confirmString:"确认",
                cancelString:"取消",  
                confirmCb: ff.bind(this),        
                cancelCb: ff.bind(this),
            };
            Manager.alert.show(cf);
        } 
        else 
        {
            MJC2SOperation.GangCard(cardId,gangType);
            this.mjHandlesSC.HideAllHandle();
        }

    }



    /** 碰 */
    OnPeng()
    {
        MJC2SOperation.PengCard(this.kecaozuo.KePengMjs[0]);
        this.mjHandlesSC.HideAllHandle();
        this.HideMJTips();

    }
    /** 过 */
    OnPass()
    {
        MJC2SOperation.GiveUp();
        this.mjHandlesSC.HideAllHandle();
        this.HideMJTips();
    }
    OnShowGuoShouTip()
    {

    }

    
    HideMJTips()
    {

        this.SetActivetipsWZSprite_Gc(false);

    }



    SetMJTips(tab:{ Sprite: string, Time: number, IsAutoQut: boolean ,Des:string })
    {
        this.SetActivetipsWZSprite_Gc(true);
        this.SetmjTipSprite_obj(tab.Sprite);
        if (tab.IsAutoQut) 
        {

            let timerItem=  window.setTimeout(()=>
            {
                this.SetActivetipsWZSprite_Gc(false);
            } , tab.Time);
            this.m_TimerArr.push(timerItem)


        }


    }


    // /** 显示操作按钮 */
    // // OnShowHandles(isMineTurn:boolean,operateArr:number[],normalcard:number,gangcard:any,isneedShowCuoPai:boolean ) 
    // OnShowHandles( isMineTurn:boolean, operateArr:number[],pengCard:number,gangcard:pb.IId2Val[],hucard:number,isneedShowCuoPai:boolean ,fanshu:number) 
    // {
    //     this.m_blisMineTurn = isMineTurn;
    //     this.m_tableHandles = operateArr;

    //     this.m_pengCard =pengCard;
    //     this.m_tableGangCards = gangcard;
    //     this.m_huCard =hucard;

    //     // if (isneedShowCuoPai) 
    //     // {
    //     //     let timerItem=  window.setTimeout(()=>{
    //     //         this.mjHandlesSC.OnShowHandlesDefinite(operateArr,hucard,fanshu,isMineTurn)
    //     //     } , 2000);
    //     //     this.m_TimerArr.push(timerItem)
    //     // }
    //     // else
    //     // {
    //         this.mjHandlesSC.OnShowHandlesDefinite(operateArr,hucard,fanshu,isMineTurn)
    //     // }


    // }

        /** 显示操作按钮 */
    // OnShowHandles(isMineTurn:boolean,operateArr:number[],normalcard:number,gangcard:any,isneedShowCuoPai:boolean ) 
    OnShowHandles( data:pb.IKeCaoZuo,isMineTurn:boolean) 
    {
        // this.m_blisMineTurn = isMineTurn;
        this.kecaozuo = data;
        // this.m_pengCard =pengCard;
        // this.m_tableGangCards = gangcard;
        // this.m_huCard =hucard;

        // if (isneedShowCuoPai) 
        // {
        //     let timerItem=  window.setTimeout(()=>{
        //         this.mjHandlesSC.OnShowHandlesDefinite(operateArr,hucard,fanshu,isMineTurn)
        //     } , 2000);
        //     this.m_TimerArr.push(timerItem)
        // }
        // else
        // {
            // this.mjHandlesSC.OnShowHandlesDefinite(operateArr,hucard,fanshu,isMineTurn)
            this.mjHandlesSC.OnShowHandlesDefinite(data,isMineTurn)
        // }


    }




    /** 隐藏定章 */
    OnHideSelectLacking()
    {
        this.SetActiveSelectLacking(false);
        // dispatch(MJEvent.SET_DINGQUEING, false);
    }

    /** 换三张按钮状态 */
    OnCanChangeClick(isCanTouch:boolean )
    {
        // Log.e("  OnCanChangeClick 换三张 isCanTouch:  ",isCanTouch);
        this.SetInteractablemBtnChangeCard(isCanTouch);
        //可能有需要换 灰色图片的需求
        this.sureBtn_btn.grayed= !isCanTouch;
    }







    HideHandleOtherHu() 
    {




        
    }






    //绑定事件
    BindEvent()
    {
        // this.tuoGuan_obj.onClick(this.clickTuoGuanBtn, this);
        // this.roboBtn_obj.onClick(()=>{
        //     dispatch("TRUSTEESHIP_EFFECT")
        // }, this);
        this.sureBtn_btn.onClick(this.OnChangeCardClick,this);
        this.m_btnWan.onClick(this.OnSelectWan,this);
        this.m_btnTong.onClick(this.OnSelectTong,this);
        this.m_btnTiao.onClick(this.OnSelectTiao,this);
        this.recordBtnF_btn.onClick(this.clickRecordBtn, this);
        this.tipsDeng_obj.onClick( ()=>{
            //
            if (this.hutipView_Gc.visible) 
            {
                this.SetActiveHuTipContent( false );
            }
            else
            {
                dispatch("GetSelfMoCardId");
                if (CommonMJConfig.selfMoCard!=null && CommonMJConfig.selfMoCard !=0   )  
                {
                    this.OnShowFanShuTip(true ,CommonMJConfig.selfMoCard ) 
                }
                else
                {
                    Log.w("CommonMJConfig.CurrenMahKeHuDataArr  ", CommonMJConfig.CurrenMahKeHuDataArr)
                    if (CommonMJConfig.CurrenMahKeHuDataArr.length==1) {
                        this.RefreshHuTipView(CommonMJConfig.CurrenMahKeHuDataArr[0]);
                    }
                    this.SetActiveHuTipContent( true );
                }
            }
            
        },this)


        this.nextGame_Btn.onClick(()=>{
            let tempData ={gameType:RoomManager.tableCommon.gameType,cfgId:RoomManager.tableCommon.tablecfgId,func:RoomManager.NextMatch,isInGame:true}
            Manager.gd.put("EnterGamePropData",tempData);
            this.service.onC2SHasPoChan(RoomManager.tableCommon.gameType,RoomManager.tableCommon.tablecfgId)
        }, this);
        
        this.invite_Btn.onClick(()=>{
            let inviteable = RoomManager.tableCommon.inviteable
            if (!inviteable) 
            {
                let tempData ={gameType:RoomManager.tableCommon.gameType,cfgId:RoomManager.tableCommon.tablecfgId,func:()=>{        
                    Manager.gd.put("GameMatchAutoInvite",{isInvite:true});
                    RoomManager.NextMatch();
                    },isInGame:true}
                Manager.gd.put("EnterGamePropData",tempData);
                this.service.onC2SHasPoChan(RoomManager.tableCommon.gameType,RoomManager.tableCommon.tablecfgId)

                // this.service.onC2SGetIdlePlayers(null);
                // Manager.uiManager.openFairy({ type: InvitedPlayer, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.UI, name: "邀请好友" });
            }
            else
            {
                RoomManager.ExitTableFinal();
            }
        }, this);
    }


    /** 点击流水请求按钮 */
    clickRecordBtn()
    {

        if (CommonMJConfig.MjGameSmallResult !=null ) 
        {
            Log.w( "  clickRecordBtn  点击流水请求 1 ");
            if ( CommonMJConfig.RoomState == MahTableStage.TS_InningOver || CommonMJConfig.RoomState == MahTableStage.TS_Close ) 
            {
                //直接刷新 界面
                dispatch(MJEvent.ONS2CMAHLIUSHUI, CommonMJConfig.MjGameSmallResult.liuShui);
            } 
        } 
        else 
        {
            MJC2SOperation.ReQuestLiuShui();
        }
    }


    Setm_blHuTipShow(isShow : boolean)
    {
        this.m_blHuTipShow =isShow;
    }


    /** 设置提示文字 */
    SetmjTipSprite_obj(spriteUrl:string)
    {

        let urlStr = fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON,spriteUrl)
        // Log.e("SetmjTipSprite_obj 01  ",urlStr  );
        this.tipsWZ_load.icon =urlStr;   
    }
    

    /** 设置提示文字 图片的 */
    SetActivetipsWZSprite_Gc(isShow:boolean)
    {
        // Log.e(" SetActivetipsWZSprite_Gc   isShow :  ",isShow)

        this.tipsWZSprite_Gc.visible=isShow;
    }

    SetActivetipsText_Gc(isShow:boolean)
    {
        // Log.e(" SetActivetipsWZSprite_Gc   isShow :  ",isShow)
        this.tipsText_Gc.visible=isShow;
    }
    

    SettipsText_Gc(count:number)
    {
        if (count==10) 
        {
            this.SetActivetipsText_Gc(true)
            this.tipsText_Gc.getChild("tittle").text=String.format("牌张剩余数量:{0}",count)
            let timerItem=  window.setTimeout(()=>{
                this.SetActivetipsText_Gc(false)
            } , 1000);
            this.m_TimerArr.push(timerItem)
        }
    }
    

    /** 麻将提示灯 */
    SetActiveMJTipDeng(isShow : boolean) {
        // Log.w(" SetActiveMJTipDeng  isShow :  ",isShow);
        this.tipsDeng_obj.visible =isShow;
    }


    /**换三张特效 桌子中间的三张牌 */
    SetActiveHuanSanZhangEff(isShow: boolean) {
        this.HuanSanZhangEff_Gc.visible = isShow;
    }



    /** 请选择任意 三张手牌 组件 */
    SetActiveChangeThree(isShow: boolean) {
        // console.trace('SetActiveChangeThree isShow :',isShow)
        this.m_objChangeThree.visible = isShow;
    }

    /** 确认换三张 按钮是否能点击 */
    SetInteractablemBtnChangeCard(isCanTouch: boolean)
    {
        this.sureBtn_btn.touchable = isCanTouch;
    }




    /** 胡牌提示的具体界面   */
    SetActiveHuTipContent(isShow: boolean) {
        // Log.w(" SetActiveHuTipContent  isShow :  ",isShow )
        this.hutipView_SC.SetActiveHuTip(isShow);
        // this.hutipView_Gc.visible = isShow;
    }

    /** 刷新胡牌提示界面 */
    RefreshHuTipView(data : pb.IMahKeHuData )
    {
        this.hutipView_SC.RefreshView(data);
    }

    

    /** 设置出牌胡牌提示 */
    OnShowFanShuTip(isShow:boolean ,outCardId:number ) 
    {
        this.SetActiveHuTipContent(false); 
        if ( isShow ) 
        {
            for (let index = 0; index < CommonMJConfig.CurrenMahKeHuDataArr.length; index++) 
            {
                if (outCardId == CommonMJConfig.CurrenMahKeHuDataArr[index].mjId ) //打出这张牌能胡
                {
                    this.RefreshHuTipView(CommonMJConfig.CurrenMahKeHuDataArr[index]);
                    this.SetActiveHuTipContent(true); 
                }
            }
        } 
    }


    /** 胡牌提示的具体界面   */
    SetActiveMoreGangView(isShow: boolean) 
    {
        this.moreGang_SC.SetActiveMoreGangView(isShow)
    }

    // /** 托管按鍵 */
    // SetTuoGuanBtnActive(isShow: boolean) {
    //     this.tuoGuan_obj.visible =isShow;
    //     //托管的时候 关掉 道具使用界面
    // }

    // /** 托管机器人 */
    // SetTuoGuanrobotActive(isShow: boolean) {
    //     this.roboBtn_obj.visible =isShow;
    // }


    /** 隐藏所有碰杠胡操作 */
    HideAllHandleAndSelectGang() {
        this.HideAllHandle();


    }
    
    /**隐藏操作 */
    HideAllHandle() 
    {
        this.mjHandlesSC.HideAllHandle()


    }
    
    /** 请求局内战绩按钮 显隐 */
    SetActiveRecordBtn(isShow:boolean)
    {
        this.recordBtnF_btn.visible =isShow;   
    }


    SetActiveOutCardHuTip(isShow:boolean)
    {

        this.SetActiveHuTipContent(isShow)

    }
    
    


    SetActivem_objcancle(isShow:boolean)
    {
        if (this.m_objcancle!=null) {
            this.m_objcancle.visible =isShow;
        }
    }


    SetActiveSelectLacking(isShow:boolean)
    {
        if (this.m_objSelectLacking!=null) {
            this.m_objSelectLacking.visible =isShow;
        }
    }

    SetActiveNextGame(isShow:boolean)
    {
        if (this.nextGame_Btn!=null) {
            this.nextGame_Btn.visible =isShow;
        }
        this.reFlashNextInvite_SC.ReFlash()
    }

    SetActiveInviteBtn(isShow:boolean)
    {
        if (this.invite_Btn!=null) {
            this.invite_Btn.visible =isShow;
        }
        this.reFlashNextInvite_SC.ReFlash()
    }

    



    // SetActiveQuitGame(isShow:boolean)
    // {
    //     if (this.obj_quitGame!=null) {
    //         this.obj_quitGame.visible =isShow;
    //     }
    // }
    
    /** 点击确认换三张按钮 */
    OnChangeCardClick()
    {
        Log.w(" OnChangeCardClick 确认换掉的牌是 CommonMJConfig.TabelThreeCards  : ",CommonMJConfig.TabelThreeCards);
        this.SetActiveChangeThree(false);
        if (CommonMJConfig.TabelThreeCards.length == 3 ) 
        {
            let cards:number[]=[];
            for (let i = 0; i < CommonMJConfig.TabelThreeCards.length; i++) 
            {
                let cardIdItem = CommonMJConfig.TabelThreeCards[i].GetCardNumber();
                cards.push(cardIdItem);
                CommonMJConfig.MineChangeThreeCards.push(cardIdItem)
            }
            Log.w(" OnChangeCardClick 确认换掉的牌是  : ",cards);
            dispatch("GetSelfMoCardIsUp")
            //如果自己的手牌是站起的时候就是使用了摸牌  首先自己是庄才有机会
            Log.w(" OnChangeCardClick CommonMJConfig.selfMoCardIsUp  : ",CommonMJConfig.selfMoCardIsUp);
            
            MJC2SOperation.ReSendSelectedChangeThree(cards,CommonMJConfig.selfMoCardIsUp);
            dispatch(MJEvent.END_CHANGE_THREE);
        }
        this.HideMJTips();


    }


    /** 选择定章 */
    OnStartSelectLackingMjPanel(data: pb.S2CMahDingQueNotify) 
    {
        this.OnTuiJianDingQue(data.que);

    }


    public OnTuiJianDingQue(queColor:MahColor)
    {
        this.SetActiveSelectLacking(true)
        if ( queColor == MahColor.CL_Wan ) 
        {
            Manager.utils.PlaySpine(<fgui.GLoader3D> this.m_btnWan.getChild("n3"),"mjsp_dingque1","wan",Config.BUNDLE_MJCOMMON,()=>{

            },true)
            Manager.utils.PlaySpine(<fgui.GLoader3D> this.m_btnTiao.getChild("n3"),"mjsp_dingque1","tiao1",Config.BUNDLE_MJCOMMON,()=>{

            })
            Manager.utils.PlaySpine(<fgui.GLoader3D> this.m_btnTong.getChild("n3"),"mjsp_dingque1","tong2",Config.BUNDLE_MJCOMMON,()=>{

            })
        } 
        else if ( queColor == MahColor.CL_Tiao ) 
        {
            Manager.utils.PlaySpine(<fgui.GLoader3D> this.m_btnWan.getChild("n3"),"mjsp_dingque1","wan2",Config.BUNDLE_MJCOMMON,()=>{

            })
            Manager.utils.PlaySpine(<fgui.GLoader3D> this.m_btnTiao.getChild("n3"),"mjsp_dingque1","tiao",Config.BUNDLE_MJCOMMON,()=>{

            },true)
            Manager.utils.PlaySpine(<fgui.GLoader3D> this.m_btnTong.getChild("n3"),"mjsp_dingque1","tong2",Config.BUNDLE_MJCOMMON,()=>{

            })
        }
        else if ( queColor == MahColor.CL_Tong ) 
        {
            Manager.utils.PlaySpine(<fgui.GLoader3D> this.m_btnWan.getChild("n3"),"mjsp_dingque1","wan2",Config.BUNDLE_MJCOMMON,()=>{

            })
            Manager.utils.PlaySpine(<fgui.GLoader3D> this.m_btnTiao.getChild("n3"),"mjsp_dingque1","tiao1",Config.BUNDLE_MJCOMMON,()=>{

            })
            Manager.utils.PlaySpine(<fgui.GLoader3D> this.m_btnTong.getChild("n3"),"mjsp_dingque1","tong",Config.BUNDLE_MJCOMMON,()=>{

            },true)
        }



    }

    /** 选择 缺万 */
    OnSelectWan()
    {
        // Log.e(" OnSelectWan  万 ");
        function ff(params:boolean) 
        {
            Log.d("OnSelectWan ",params);
            if (params)
            {
                this.OnSelectWanFinal();   
            }
        }

        let  count = MJTool.GetHasCardCountByColor(MahColor.CL_Wan)
        if ( count> 6 &&  !CommonMJConfig.IsSureQueMore) 
        {
            let cf:AlertConfig=
            {
                title:"小提示",
                text: "万字超过6张,是否确认定缺?",   
                confirmCb: ff.bind(this),        
                cancelCb: ff.bind(this),
            };
            Manager.alert.show(cf);
        } 
        else 
        {
            this.OnSelectWanFinal()
        }
    }

    /** 定章万 */
    OnSelectWanFinal()
    {
        this.SetActiveSelectLacking(false);
        this.HideMJTips()
        MJC2SOperation.SelectLacking(MahColor.CL_Wan);
    }




    

    /** 选择 缺筒 */
    OnSelectTong()
    {
        // Log.e(" OnSelectTong  筒 ");


        function ff(params:boolean) 
        {
            Log.d("OnSelectTong ",params);
            if (params)
            {
                this.OnSelectTongFinal();
            }
        }

        let  count = MJTool.GetHasCardCountByColor(MahColor.CL_Tong)
        if ( count> 6 &&  !CommonMJConfig.IsSureQueMore) 
        {
                
            let cf:AlertConfig=
            {
                title:"小提示",
                text: "筒超过6张,是否确认定缺?",   
                confirmCb: ff.bind(this),        
                cancelCb: ff.bind(this),
            };
            Manager.alert.show(cf);
        } 
        else 
        {
            this.OnSelectTongFinal()
        }


    }
    /** 定章筒 */
    OnSelectTongFinal()
    {
        this.SetActiveSelectLacking(false);
        this.HideMJTips()
        MJC2SOperation.SelectLacking(MahColor.CL_Tong);
    }

    /** 选择 缺条 */
    OnSelectTiao()
    {
        // Log.e(" OnSelectTiao  条 ");
        function ff(params:boolean) 
        {
            Log.d("OnSelectTiao ",params);
            if (params)
            {
                this.OnSelectTiaoFinal();
            }
        }

        let  count = MJTool.GetHasCardCountByColor(MahColor.CL_Tiao)
        if ( count> 6 &&  !CommonMJConfig.IsSureQueMore) 
        {
                
            let cf:AlertConfig=
            {
                title:"小提示",
                text: "条超过6张,是否确认定缺?",   
                confirmCb: ff.bind(this),        
                cancelCb: ff.bind(this),
            };
            Manager.alert.show(cf);
        } 
        else 
        {
            this.OnSelectTiaoFinal()
        }

    }



    /** 定章条 */
    OnSelectTiaoFinal()
    {
        this.SetActiveSelectLacking(false);
        this.HideMJTips()
        MJC2SOperation.SelectLacking(MahColor.CL_Tiao);
    }


    /** 换三张的扣下去的三张牌 去处理 */
    SetActiveThreeCards(pos: number, isShow: boolean) 
    {
        let clientPos =MJTool.PositionToDirection(pos)
        this.playersHSZ[clientPos].visible =isShow;
        
    }


    PlayCenterEff(huPath: string, aniName: string) 
    {
        // Log.e(" PlayCenterEff  huPath  aniName ",huPath,aniName)x
        this.SetActivecenterEff_loader3d(true);
        // Manager.utils.PlaySpine(this.centerEff_loader3d,huPath,aniName,Config.BUNDLE_MJCOMMON,()=>{
        //     this.SetActivecenterEff_loader3d(false);
        // })
        Manager.utils.PlaySpine(this.centerEff_loader3d,huPath,aniName,Config.BUNDLE_MJCOMMON,()=>{
            this.SetActivecenterEff_loader3d(false);
        })

    }


    OnS2CMahBetterMjSuggestion(data: pb.S2CMahBetterMjSuggestion) 
    {
        Log.e(" OnS2CMahBetterMjSuggestion  进来了  ");
        this.xinshoutip.visible=true; 
        this.xinshoutip.data=data;
        let timerItem=  window.setTimeout(()=>
        {
            this.xinshoutip.visible=false; 
        } , 1000*10);
        this.m_TimerArr.push(timerItem)


    }


    

    /** 重置 */
    OnResetMJPanel() 
    {
        this.xinshoutip.visible=false; 
        this.SetActivetipsText_Gc(false);
        this.SetActivetipsWZSprite_Gc(false);
        this.Setm_blHuTipShow(false);
        MJDispose.SetEffectResultDQ(false);
        MJDispose.SetEffectResultHSZ(false);
        this.SetActiveSelectLacking(false);
        this.SetActiveChangeThree(false);

        // this.SetTuoGuanBtnActive(false);
        this.SetActiveHuTipContent(false);
        this.HideAllHandleAndSelectGang();
        this.SetActiveNextGame(false);
        this.SetActiveInviteBtn(false);

        this.SetActiveHuanSanZhangEff(false);
        this.SetActivecenterEff_loader3d(false)
        
        this.SetActiveMoreGangView(false);
        this.SetActiveMJTipDeng(false)
        this.SetActivejpqBtn(false)

        for (const [key, val] of Object.entries(this.playersHSZ)) {
            val.visible =false;
        }
        MJDispose.SetSelfHaoPaiBuHuan(false);
        CommonMJConfig.HuanSanZhangBuHuanData = {}

    }

    


    StopCoroutineTweenAni() 
    {
        if ( this.m_tipsTimer!=null) {
            clearTimeout( this.m_tipsTimer)
        }

        if (this.m_TimerArr !=null ) 
        {
            // Log.w(" StopCoroutineTweenAni MJPanel  this.m_TimerArr.length ",this.m_TimerArr.length)
            //关掉所有的延迟函数
            for (let i = 0; i <this.m_TimerArr.length ; i++) 
            {
                if ( this.m_TimerArr[i]!=null) {
                    clearTimeout( this.m_TimerArr[i])
                    this.m_TimerArr[i]=null;
                }
            }
            this.m_TimerArr=[];
        }



    }


}
