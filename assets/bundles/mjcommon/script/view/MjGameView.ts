
import { Config } from "../../../../scripts/common/config/Config";
import GameData from "../../../../scripts/common/data/GameData";
import { GameEvent } from "../../../../scripts/common/event/GameEvent";
import FLevel2UI from "../../../../scripts/common/fairyui/FLevel2UI";
import RecommendChongZhi from "../../../../scripts/common/fairyui/RecommendChongZhi";
import { GameService } from "../../../../scripts/common/net/GameService";
import { MahHPGOPerate, MahHSZType, MahPlayerState, MahPoChanReason, MahTableStage, MahTiShi, PlayerAttr, PropType } from "../../../../scripts/def/GameEnums";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";
import { LoggerImpl } from "../../../../scripts/framework/core/log/Logger";
import { Data } from "../../../../scripts/framework/data/Data";
import { GameCommonEvent } from "../../../gamecommon/script/Event/GameCommonEvent";
import RoomPlayersBehaviour from "../../../gamecommon/script/logic/RoomPlayersBehaviour";
import RoomView from "../../../gamecommon/script/logic/RoomView";
import { RoomManager } from "../../../gamecommon/script/manager/RoomManager";
import { Tool } from "../../../gamecommon/script/tools/Tool";
import mjXLHZcplayers from "../../../xlhzmj/script/view/mjXLHZcplayers";
import XlhzMJView from "../../../xlhzmj/script/view/XlhzMJView";
import { CommonMJConfig } from "../Config/CommonMJConfig";
import { MJEvent } from "../Event/MJEvent";
import { MJTool } from "../logic/MJTool";
import MJDispose from "../Manager/MJDispose";
import MJManager from "../Manager/MJManager";
import { MJC2SOperation } from "../net/MJC2SOperation";
import CMJPlayers from "./CMJPlayers";
import FanXingDes from "./FanXingDes";
import MJBalanceView from "./MJBalanceView";
import MJHeadPlayers from "./MJHeadPlayers";
import MJLiuShuiView from "./MJLiuShuiView";
import Mjmiddle from "./Mjmiddle";
import MjPanel from "./MjPanel";
import MJProp from "./MJProp/MJProp";
import PoChanView from "./PoChanView";





export default class MjGameView extends FLevel2UI {



    protected selfGc: fgui.GComponent = null;
    private gameName_text: fgui.GObject = null;
    private mjmiddleGC:fgui.GComponent = null;

    protected mjmiddleSC:Mjmiddle = null;

    protected mjcplayersSC:CMJPlayers = null;
    protected mjXLHZcplayersSC:mjXLHZcplayers = null;
    protected roomPlayersBehaviourSC:RoomPlayersBehaviour = null;
    protected mjPanelSC:MjPanel = null;
    protected roomViewSC:RoomView = null;

    protected mjHeadPlayersSC:MJHeadPlayers = null;


    protected mjLiuShuiViewSC:MJLiuShuiView=null;
    protected mjBalanceViewSC:MJBalanceView=null;
    protected poChanViewSC:PoChanView=null;
    mjPropSC:MJProp=null;

    protected fanXingDesSC:FanXingDes=null;

    
    

    //有没有播放过换三张动画
    m_EffectHSZ = false; 

    m_TimerArr:number[]=[];;

    private m_GObjectPool: fgui.GObjectPool=null;


    paizhuo_load3d :fgui.GLoader3D=null



    public setInit(Fgc : fgui.GComponent) {
        // cc.macro.ENABLE_MULTI_TOUCH = false;
        this.show();
        // Log.d("mjgameview onBind setInit ffffffff  : ",   this.root );
        this.mjBalanceViewSC = new MJBalanceView(this.root.getChild("mjBalanceView").asCom);
        this.mjLiuShuiViewSC = new MJLiuShuiView(this.root.getChild("mjLiuShuiView").asCom);
        this.poChanViewSC = new PoChanView(this.root.getChild("pochanfuhuo").asCom);
        this.mjPropSC = new MJProp(this.root.getChild("mjProp").asCom);
        this.fanXingDesSC = new FanXingDes(this.root.getChild("fanXingDes").asCom);


        
        
        this.paizhuo_load3d = <fgui.GLoader3D>this.root.getChild("paizhuo");

        this.InitEvent();
        // Log.d("mjgameview onBind setInit 0: ");
        // this.PlayerPaiZhuoSpain("mj_xp2")



        // let timerItem=  window.setTimeout(()=>{

        //     for (let i = 0; i < 4; i++) 
        //     {
        //         this.mjcplayersSC.SetTanCards(i, [11,12,13,14,15,16,17,18,19,1,2,3,4,4])
        //     }
        // } , 3000);


        // let timerItem=  window.setTimeout(()=>{
        //     this.mjPanelSC.PlayCenterEff("mjsp_pf","ani")
        // } , 3000);

    }





    public SetRoomViewSC(item: RoomView)
    {
        this.roomViewSC =item;
    }
    
    public SetRoomPlayersBehaviourSC(item: RoomPlayersBehaviour)
    {
        this.roomPlayersBehaviourSC =item;
    }

    public SetMjmiddleSC(item: Mjmiddle)
    {
        this.mjmiddleSC =item;
    }

    public SetmjcplayersSC(item: CMJPlayers)
    {
        this.mjcplayersSC =item;
    }

    public SetMjPanelSC(item: MjPanel)
    {
        this.mjPanelSC =item;
    }

    public SetMJHeadPlayersSC(item: MJHeadPlayers)
    {
        this.mjHeadPlayersSC =item;
    }



    

    /** 添加事件 */
    protected InitEvent() {
        Log.d("onBind mjgameview ~~~~~~~~~~   InitEvent    ");

        Manager.dispatcher.add(MJEvent.ONSTARTGAME, this.OnStartGame, this);
        Manager.dispatcher.add(MJEvent.ONS2CMAHFAPAI, this.OnS2CMahFaPai, this);
        Manager.dispatcher.add(MJEvent.ONS2CMAHHSZNOTIFY, this.OnS2CMahHSZNotify, this);
        Manager.dispatcher.add(MJEvent.ONS2CMAHHSZRESULT, this.OnS2CMahHSZResult, this);
        Manager.dispatcher.add(MJEvent.ONS2CMAHDINGQUENOTIFY, this.OnS2CMahDingQueNotify, this);
        Manager.dispatcher.add(MJEvent.ONS2CMAHDINGQUERESULT, this.OnS2CMahDingQueResult, this);
        Manager.dispatcher.add(MJEvent.ONS2CMAHUPDATETABLEANDPLAYERSTATE, this.OnS2CMahUpdateTableAndPlayerState, this);
        Manager.dispatcher.add(MJEvent.ONS2CMAHCHUPAI, this.OnS2CMahChuPai, this);
        Manager.dispatcher.add(MJEvent.ONS2CMAHMOPAI, this.OnS2CMahMoPai, this);
        Manager.dispatcher.add(MJEvent.ONS2CMAHHASHPG, this.OnS2CMahHasHPG, this);
        Manager.dispatcher.add(MJEvent.ONS2CMAHHURESULT, this.onS2CMahHuResult, this);
        Manager.dispatcher.add(MJEvent.ONS2CMAHINNINGOVERDATA, this.onS2CMahInningOverData, this);
        Manager.dispatcher.add(MJEvent.ONS2CMHUPAITISHI, this.OnS2CMHuPaiTiShi, this);
        Manager.dispatcher.add(MJEvent.ONS2CMAHHPGDONE, this.OnS2CMahHPGDone, this);
        Manager.dispatcher.add(MJEvent.S2CMAHGAMEPOCHAN, this.OnS2CMahGamePoChan, this);
        Manager.dispatcher.add(MJEvent.ONS2CMAHAUTO, this.OnS2CMahAuto, this);
        Manager.dispatcher.add(MJEvent.UPDATE_PLAYER_HEAD_INFO, this.OnUpdatePlayerHeadInfo, this);
        Manager.dispatcher.add(MJEvent.SELECT_LACKING, this.OnSelectLacking, this);
        Manager.dispatcher.add(MJEvent.PLAY_GAME_EFFECT, this.OnPlayerGameEffect, this);
        Manager.dispatcher.add(MJEvent.SET_OUTCARD_DIRECTION, this.OnSetOutCardDirection, this);
        //麻将玩家加入房间 处理
        Manager.dispatcher.add(GameEvent.ONPLAYERENTERROOMQUAUE, this.OnMJPlayerEnterRoomQuaue, this);
        Manager.dispatcher.add("ClickTuoGuan", this.ClickTuoGuan, this);
        //牌墙中删除一张
        Manager.dispatcher.add(MJEvent.HIDEPAIQIANGCARDITEM, this.HidePaiQiangCardItem, this);
        //道具使用成功后
        Manager.dispatcher.add(MJEvent.S2CMAHPROPRESULT, this.OnS2CMahUseProp, this);
        //金钟罩次数刷新
        Manager.dispatcher.add(MJEvent.S2CUPDATEJINZHONGZHAO, this.OnS2CUpdateJinZhongZhao, this);
        //玩家明牌
        Manager.dispatcher.add(MJEvent.S2CMAHMINGPAI, this.OnS2CMahMingPai, this);
        //麻将提示文字 过手胡和不能杠
        Manager.dispatcher.add(MJEvent.S2CMAHTISHI, this.OnS2CMahTiShi, this);
        

        Manager.dispatcher.add(ProtoDef.pb.S2CBuyShopItem, this.onBuyShopItem,this);
        
        Manager.dispatcher.add(MJEvent.INITPAIQIANG, this.InitPaiQiang,this);
        Manager.dispatcher.add(ProtoDef.pb.C2SPropTableState, this.OnC2SPropTableState,this);

    }

    /** 移除事件 */
    RemoveEvent()
    {
        Manager.dispatcher.remove(MJEvent.ONSTARTGAME, this );
        Manager.dispatcher.remove(MJEvent.ONSTARTGAME,  this);
        Manager.dispatcher.remove(MJEvent.ONS2CMAHFAPAI, this);
        Manager.dispatcher.remove(MJEvent.ONS2CMAHHSZNOTIFY,  this);
        Manager.dispatcher.remove(MJEvent.ONS2CMAHHSZRESULT,  this);
        Manager.dispatcher.remove(MJEvent.ONS2CMAHDINGQUENOTIFY,  this);
        Manager.dispatcher.remove(MJEvent.ONS2CMAHDINGQUERESULT, this);
        Manager.dispatcher.remove(MJEvent.ONS2CMAHUPDATETABLEANDPLAYERSTATE, this);
        Manager.dispatcher.remove(MJEvent.ONS2CMAHCHUPAI,this);
        Manager.dispatcher.remove(MJEvent.ONS2CMAHMOPAI, this);
        Manager.dispatcher.remove(MJEvent.ONS2CMAHHASHPG,  this);
        Manager.dispatcher.remove(MJEvent.ONS2CMAHHURESULT,  this);
        Manager.dispatcher.remove(MJEvent.ONS2CMAHINNINGOVERDATA,  this);
        Manager.dispatcher.remove(MJEvent.ONS2CMHUPAITISHI, this);
        Manager.dispatcher.remove(MJEvent.ONS2CMAHHPGDONE,  this);
        Manager.dispatcher.remove(MJEvent.S2CMAHGAMEPOCHAN,  this);
        Manager.dispatcher.remove(MJEvent.ONS2CMAHAUTO,  this);
        Manager.dispatcher.remove(MJEvent.UPDATE_PLAYER_HEAD_INFO, this);
        Manager.dispatcher.remove(MJEvent.SELECT_LACKING, this);
        Manager.dispatcher.remove(MJEvent.PLAY_GAME_EFFECT, this);
        Manager.dispatcher.remove(MJEvent.SET_OUTCARD_DIRECTION,  this);
        //麻将玩家加入房间 处理
        Manager.dispatcher.remove(GameEvent.ONPLAYERENTERROOMQUAUE,  this);
        Manager.dispatcher.remove("ClickTuoGuan", this);
        //牌墙中删除一张
        Manager.dispatcher.remove(MJEvent.HIDEPAIQIANGCARDITEM,  this);
        //道具使用成功后
        Manager.dispatcher.remove(MJEvent.S2CMAHPROPRESULT,this);
        //金钟罩次数刷新
        Manager.dispatcher.remove(MJEvent.S2CUPDATEJINZHONGZHAO,  this);
        //玩家明牌
        Manager.dispatcher.remove(MJEvent.S2CMAHMINGPAI, this);
        //麻将提示文字 过手胡和不能杠
        Manager.dispatcher.remove(MJEvent.S2CMAHTISHI,  this);
        
        Manager.dispatcher.remove(ProtoDef.pb.S2CBuyShopItem, this);
        Manager.dispatcher.remove(MJEvent.INITPAIQIANG,this);
        Manager.dispatcher.remove(ProtoDef.pb.C2SPropTableState,this);

        this.mjLiuShuiViewSC.RemoveEvent()
        this.mjBalanceViewSC.RemoveEvent()
        this.poChanViewSC.RemoveEvent()
        this.mjHeadPlayersSC.RemoveEvent()
        this.mjPropSC.RemoveEvent()
        this.fanXingDesSC.RemoveEvent()
        
    }


    onBuyShopItem(){
        Log.d("onBuyShopItem:",CommonMJConfig.isWaitBuy);
        if(CommonMJConfig.isWaitBuy){
            MJDispose.SetIsWaitBuystate(false);
            //购买并使用 自動使用破封卡
            this.mjPanelSC.OnPoFeng();
        }

    }


    OnS2CMahUseProp(dataAll:{data: pb.S2CMahPropResult,endFun:()=>{}} )
    {
        let data = dataAll.data;
        if (data.errcode != 1 ) 
        {
            dataAll.endFun();
            return;
        }

        let direct = MJTool.PositionToDirection(data.index)
        let playerDataTab:pb.TablePlayer = CommonMJConfig.MJMemberHeadInfo[data.index]
        let tsConfig =  Manager.utils.GetTSPeiZhiConfig();
        let tiShiConfigItem = Manager.utils.GetTiShiConfigItem( "TS_DaoJu_"+data.type ,tsConfig );
        // Log.w("OnS2CMahUseProp  data.type  "+data.type )
        // Log.w("OnS2CMahUseProp  tiShiConfigItem.NeiRong  "+tiShiConfigItem.NeiRong  )
        // Log.w("OnS2CMahUseProp  playerData.player.name  "+playerData.player.name  )
        // Log.w("OnS2CMahUseProp  str  "+str  )

        if (data.type==PropType.PropType_PoFengCard) //破封卡
        {
            Manager.tips.show(String.format(tiShiConfigItem.NeiRong,playerDataTab.player.name,CommonMJConfig.MjRoomRule.max_fan),5);
            //破封卡使用成功后播放一个特效
            // MJDispose.SetPoFengstate(true)
            MJTool.PlaySound(CommonMJConfig.SoundEffPath.PoFeng,Config.BUNDLE_MJCOMMON);
            this.mjPanelSC.PlayCenterEff("mjsp_pf","ani")
            let timerItem=  window.setTimeout(()=>{
                dataAll.endFun()
            } , 1333);
            this.m_TimerArr.push(timerItem)

            //胡牌使用破封卡后，在播放破封特效时,隐藏操作按钮
            this.mjPanelSC.mjHandlesSC.HideAllHandle()
            return;
        }
        else
        {
            Manager.tips.show(String.format(tiShiConfigItem.NeiRong,playerDataTab.player.name));
            // dataAll.endFun()
        }

        if (PropType.PropType_HongZhongCard == data.type||
            PropType.PropType_FixColorCard == data.type || PropType.PropType_HaiDiLaoYue== data.type||
            PropType.PropType_YanQueCard == data.type || PropType.PropType_RuYiCard== data.type||
            PropType.PropType_PoFengCard == data.type || PropType.PropType_JiPaiQi== data.type
            )
        {
            dataAll.endFun()
            return
        }

        if (direct != CommonMJConfig.Direction.Bottom) //别的玩家使用道具 谈个提示框如果是明牌玩家就需要刷新明牌
        {
            //其他玩家 使用道具表现
            this.OnS2CMahUsePropOther(data)
            dataAll.endFun()
            return
        }


        for (let i = 0; i < data.param1.length; i++) 
        {
            let cardId = data.param1[i]
            CommonMJConfig.AllCards[cardId] = CommonMJConfig.AllCards[cardId] + 1;
            let oldCount = CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom][cardId]
            CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom][cardId] =oldCount-1
        }

        for (let i = 0; i < data.param2.length; i++) 
        {
            let cardId = data.param2[i]
            CommonMJConfig.AllCards[cardId] = CommonMJConfig.AllCards[cardId] - 1;
            if (CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom][cardId]==null) 
            {
                CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom][cardId]=0
            }
            CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom][cardId] =CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom][cardId]+1
        }
        this.mjcplayersSC.OnMjPropChangeCards(CommonMJConfig.Direction.Bottom,data)

        this.mjcplayersSC.HideAllBigCardShow();
        this.mjPanelSC.HideAllHandleAndSelectGang();
        this.mjPanelSC.SetActiveOutCardHuTip(false);

        let tempArr =  CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom]
        let isCanChu= MJTool.GetIsCanChuPai(tempArr.length)

        if ( data.operate!=null && data.operate.operate!=null && data.operate.operate.length!=0 ) 
        {
            this.mjPanelSC.OnShowHandles( data.operate,isCanChu )
        }


        //刷新 胡牌提示
        

        let timerItem1=  window.setTimeout(()=>{
            //胡牌提示

            if (isCanChu ) 
            {
                dispatch("GetSelfMoCardId")
                if (data.ShowKeHu) {
                    this.SetCommonHuTip(data.data,CommonMJConfig.selfMoCard)
                }

                this.mjPanelSC.SetActiveMJTipDeng(false);
            }
            else
            {
                CommonMJConfig.CurrenMahKeHuDataArr = data.data
                if ( CommonMJConfig.CurrenMahKeHuDataArr!=null && CommonMJConfig.CurrenMahKeHuDataArr!= [] ) 
                {
                    let itemData: pb.IMahKeHuData = CommonMJConfig.CurrenMahKeHuDataArr[0]
                    if (itemData!=null) 
                    {
                        this.mjPanelSC.SetActiveMJTipDeng(true);
                        this.mjPanelSC.SetActiveHuTipContent(false);
                        this.mjPanelSC.RefreshHuTipView(itemData)
                    }
                }
            }



            dataAll.endFun()
        } , 200 );

    }
    OnS2CMahUsePropOther(data: pb.S2CMahPropResult) 
    {
        let playerData =    CommonMJConfig.MJMemberInfo[data.index] as pb.IMahPlayerData
        if (playerData.bMingPai) 
        {
            let direct = MJTool.PositionToDirection(data.index)
            for (let i = 0; i < data.param1.length; i++) 
            {
                let cardId = data.param1[i]
                CommonMJConfig.AllCards[cardId] = CommonMJConfig.AllCards[cardId] + 1;
                let oldCount = CommonMJConfig.PlayerCardsInfo[direct][cardId]
                CommonMJConfig.PlayerCardsInfo[direct][cardId] =oldCount-1
            }
    
            for (let i = 0; i < data.param2.length; i++) 
            {
                let cardId = data.param2[i]
                CommonMJConfig.AllCards[cardId] = CommonMJConfig.AllCards[cardId] - 1;
                if (CommonMJConfig.PlayerCardsInfo[direct][cardId]==null) 
                {
                    CommonMJConfig.PlayerCardsInfo[direct][cardId]=0
                }
                CommonMJConfig.PlayerCardsInfo[direct][cardId] =CommonMJConfig.PlayerCardsInfo[direct][cardId]+1
            }

            if (data.newMo!=null && data.newMo!=0) 
            {
                playerData.moPaiId = data.newMo
            }
            this.mjcplayersSC.ReFalshCardView(direct);
        }
    
    }



    /** 金钟罩次数 */
    OnS2CUpdateJinZhongZhao(data:pb.S2CUpdateJinZhongZhao)
    {
        for (let index = 0; index < data.idxVal.length; index++) 
        {
            this.mjHeadPlayersSC.SetMianSiCount(MJTool.PositionToDirection(data.idxVal[index].key ),data.idxVal[index].value )
        }
        
    }
    
    



    /** 隐藏一张牌墙 */
    HidePaiQiangCardItem(isNeedLose:boolean)
    {
        // Log.w( "HidePaiQiangCardItem  isNeedLose ",isNeedLose , CommonMJConfig.ResidueCards,CommonMJConfig.allPaiqiangArr.length)
        let totalCount = CommonMJConfig.totalCount
        if (isNeedLose) 
        {
            MJDispose.SetResidueCards(CommonMJConfig.ResidueCards - 1)
        }
        let index = totalCount-CommonMJConfig.ResidueCards-1
        if (CommonMJConfig.allPaiqiangArr[index]!=null) {
            CommonMJConfig.allPaiqiangArr[index].visible=false
        }

        this.mjmiddleSC.OnSetResidueCards(CommonMJConfig.ResidueCards);
        this.mjPanelSC.SettipsText_Gc(CommonMJConfig.ResidueCards)
    }



    /** 重连牌墙 */
    ReconnectPaiQiang()
    {

        let totalCount = CommonMJConfig.totalCount;
        let index = totalCount-CommonMJConfig.ResidueCards-1
        // Log.w(" ReconnectPaiQiang  totalCount ",totalCount,index,CommonMJConfig.ResidueCards,
        // CommonMJConfig.allPaiqiangArr.length)
        
        for (let i = 0; i < index+1; i++) 
        {
            if (CommonMJConfig.allPaiqiangArr[index]!=null) {
                CommonMJConfig.allPaiqiangArr[i].visible=false
            }

        }
    }
    


    /** 点击了托管 */
    ClickTuoGuan()
    {
        // Log.w("点击了托管按钮  ")
        MJC2SOperation.ReMjTuoGuan(true,false,0);

    }


    




    //麻将有个不是自己的 玩家加入房间
    OnMJPlayerEnterRoomQuaue(dataAll:{data: pb.S2CMahNewPlayerEnter,endFun:()=>{}})
    {
        // Log.w("   MJgameview OnMJPlayerEnterRoomQuaue  新玩家进来 data : ",dataAll )
        for (const iterator of dataAll.data.gamePlayer) {
            CommonMJConfig.MJMemberInfo[iterator.index] = iterator
        }
        let selfguid=Manager.dataCenter.get(GameData).player().guid;
        // Log.e(  " OnReconnectGameData    selfguid   :   ",selfguid    )
        for (const iterator of dataAll.data.tableCommon.players) {
            CommonMJConfig.MJMemberHeadInfo[iterator.pos] = iterator
            RoomManager.MemberInfo[iterator.pos] = iterator
            if ( selfguid == iterator.player.guid ) {
                RoomManager.SelfPosition = iterator.pos
            }
            this.OnUpdatePlayerHeadInfo(iterator)
        }
        dataAll.endFun();
    }







    /**
     * @description 刷新某一个玩家的头像 信息
     */
    OnUpdatePlayerHeadInfo(data:pb.ITablePlayer) 
    {

        // Log.e("  OnUpdatePlayerHeadInfo  刷新頭像進來了 data:  ",data);
        this.roomPlayersBehaviourSC.OnReFlashPlayer(MJTool.PositionToDirection(data.pos),data)
    }












    InitPaiQiang(touZi: number[], zhuangIndex: number)
    {
        let totalCount = CommonMJConfig.totalCount
        CommonMJConfig.allPaiqiangArr=[]
        // Log.e("InitPaiQiang  touZi  totalCount ", touZi,zhuangIndex, totalCount,CommonMJConfig.extraHZCount)
        let startIndex = touZi[0]
        let startCardIndex = touZi[1]
        if (touZi[1]>touZi[0]) 
        {
            startIndex = touZi[1]
            startCardIndex = touZi[0]
        }
        let zhuangClientPos = MJTool.PositionToDirection(zhuangIndex) 
        let clientStartMoPos = (zhuangClientPos+startIndex)%4
        // startCardIndex

        //偶数的时候
        if (totalCount%2==0) 
        {
            // Log.e("InitPaiQiang  偶数的时候 ",totalCount)
            let PersonItemCount =  Math.ceil(totalCount/8)
            // Log.e("InitPaiQiang 0 偶数的时候PersonItemCount  ",PersonItemCount)
            if (totalCount%8 == 0 ) 
            {
                this.mjcplayersSC.SetInitPaiQiangDataStart((clientStartMoPos+0)%4 ,PersonItemCount*2,clientStartMoPos,startCardIndex)
                this.mjcplayersSC.SetInitPaiQiangDataStart((clientStartMoPos+3)%4 ,PersonItemCount*2,clientStartMoPos,startCardIndex)
                this.mjcplayersSC.SetInitPaiQiangDataStart((clientStartMoPos+2)%4 ,PersonItemCount*2,clientStartMoPos,startCardIndex)
                this.mjcplayersSC.SetInitPaiQiangDataStart((clientStartMoPos+1)%4,PersonItemCount*2,clientStartMoPos,startCardIndex)
                this.mjcplayersSC.SetInitPaiQiangDataEnd((clientStartMoPos+0)%4  ,PersonItemCount*2,clientStartMoPos,startCardIndex)
                
            }
            else
            {
                this.mjcplayersSC.SetInitPaiQiangDataStart((clientStartMoPos+0)%4 ,PersonItemCount*2,clientStartMoPos,startCardIndex)
                let lastCards = totalCount-PersonItemCount*2
                PersonItemCount =  Math.ceil(lastCards/6)
                if (lastCards%6 == 0) 
                {
                    this.mjcplayersSC.SetInitPaiQiangDataStart((clientStartMoPos+3)%4  ,PersonItemCount*2,clientStartMoPos,startCardIndex)
                    this.mjcplayersSC.SetInitPaiQiangDataStart((clientStartMoPos+2)%4  ,PersonItemCount*2,clientStartMoPos,startCardIndex)
                    this.mjcplayersSC.SetInitPaiQiangDataStart((clientStartMoPos+1)%4  ,PersonItemCount*2,clientStartMoPos,startCardIndex)
                    this.mjcplayersSC.SetInitPaiQiangDataEnd((clientStartMoPos+0)%4  ,PersonItemCount*2,clientStartMoPos,startCardIndex)
                } 
                else 
                {
                    this.mjcplayersSC.SetInitPaiQiangDataStart((clientStartMoPos+3)%4  ,PersonItemCount*2,clientStartMoPos,startCardIndex)
                    lastCards = lastCards-PersonItemCount*2
                    PersonItemCount =  Math.ceil(lastCards/4)
                    if (lastCards%4 == 0) 
                    {
                        this.mjcplayersSC.SetInitPaiQiangDataStart((clientStartMoPos+2)%4  ,PersonItemCount*2,clientStartMoPos,startCardIndex)
                        this.mjcplayersSC.SetInitPaiQiangDataStart((clientStartMoPos+1)%4  ,PersonItemCount*2,clientStartMoPos,startCardIndex) 
                        this.mjcplayersSC.SetInitPaiQiangDataEnd((clientStartMoPos+0)%4  ,PersonItemCount*2,clientStartMoPos,startCardIndex)
                    } 
                    else 
                    {
                        this.mjcplayersSC.SetInitPaiQiangDataStart((clientStartMoPos+2)%4  ,PersonItemCount*2,clientStartMoPos,startCardIndex)
                        lastCards = lastCards-PersonItemCount*2
                        PersonItemCount =  Math.ceil(lastCards/2)
                        this.mjcplayersSC.SetInitPaiQiangDataStart((clientStartMoPos+1)%4  ,PersonItemCount*2,clientStartMoPos,startCardIndex) 
                        this.mjcplayersSC.SetInitPaiQiangDataEnd((clientStartMoPos+0)%4  ,PersonItemCount*2,clientStartMoPos,startCardIndex)
                    }
                }
            }

        }
        else
        {
            // Log.e("InitPaiQiang  奇数的时候 城墙 多出来的牌放到其实摸牌前边 ",totalCount)


            totalCount=totalCount+1
            let PersonItemCount =  Math.ceil(totalCount/8)
            if (totalCount%8 == 0 ) 
            {
                this.mjcplayersSC.SetInitPaiQiangDataStart((clientStartMoPos+0)%4  ,PersonItemCount*2-1,clientStartMoPos,startCardIndex)
                this.mjcplayersSC.SetInitPaiQiangDataStart((clientStartMoPos+3)%4  ,PersonItemCount*2,clientStartMoPos,startCardIndex)
                this.mjcplayersSC.SetInitPaiQiangDataStart((clientStartMoPos+2)%4  ,PersonItemCount*2,clientStartMoPos,startCardIndex)
                this.mjcplayersSC.SetInitPaiQiangDataStart((clientStartMoPos+1)%4  ,PersonItemCount*2,clientStartMoPos,startCardIndex)
                this.mjcplayersSC.SetInitPaiQiangDataEnd((clientStartMoPos+0)%4  ,PersonItemCount*2-1,clientStartMoPos,startCardIndex)
            }
            else
            {
                this.mjcplayersSC.SetInitPaiQiangDataStart((clientStartMoPos+0)%4  ,PersonItemCount*2-1,clientStartMoPos,startCardIndex)
                let lastCards = totalCount-PersonItemCount*2
                PersonItemCount =  Math.ceil(lastCards/6)
                if (lastCards%6 == 0) 
                {
                    this.mjcplayersSC.SetInitPaiQiangDataStart((clientStartMoPos+3)%4  ,PersonItemCount*2,clientStartMoPos,startCardIndex)
                    this.mjcplayersSC.SetInitPaiQiangDataStart((clientStartMoPos+2)%4  ,PersonItemCount*2,clientStartMoPos,startCardIndex)
                    this.mjcplayersSC.SetInitPaiQiangDataStart((clientStartMoPos+1)%4  ,PersonItemCount*2,clientStartMoPos,startCardIndex)
                    this.mjcplayersSC.SetInitPaiQiangDataEnd((clientStartMoPos+0)%4  ,PersonItemCount*2-1,clientStartMoPos,startCardIndex)
                } 
                else 
                {
                    this.mjcplayersSC.SetInitPaiQiangDataStart((clientStartMoPos+3)%4  ,PersonItemCount*2,clientStartMoPos,startCardIndex)
                    lastCards = lastCards-PersonItemCount*2
                    PersonItemCount =  Math.ceil(lastCards/4)
                    if (lastCards%4 == 0) 
                    {
                        this.mjcplayersSC.SetInitPaiQiangDataStart((clientStartMoPos+2)%4  ,PersonItemCount*2,clientStartMoPos,startCardIndex)
                        this.mjcplayersSC.SetInitPaiQiangDataStart((clientStartMoPos+1)%4  ,PersonItemCount*2,clientStartMoPos,startCardIndex) 
                        this.mjcplayersSC.SetInitPaiQiangDataEnd((clientStartMoPos+0)%4  ,PersonItemCount*2-1,clientStartMoPos,startCardIndex)
                    } 
                    else 
                    {
                        this.mjcplayersSC.SetInitPaiQiangDataStart((clientStartMoPos+2)%4  ,PersonItemCount*2,clientStartMoPos,startCardIndex)
                        lastCards = lastCards-PersonItemCount*2
                        PersonItemCount =  Math.ceil(lastCards/2)
                        this.mjcplayersSC.SetInitPaiQiangDataStart((clientStartMoPos+1)%4  ,PersonItemCount*2,clientStartMoPos,startCardIndex) 
                        this.mjcplayersSC.SetInitPaiQiangDataEnd((clientStartMoPos+0)%4  ,PersonItemCount*2-1,clientStartMoPos,startCardIndex)
                    }
                }
            }



        }



    }


    /** 播放换三张特效 */
    OnPlayerGameEffect(type:number,endFun:()=>{}) 
    {
        let aniName = "duijiahuanpai";
        if (type == MahHSZType.HSZ_AntiClockWise ) 
        {
            aniName = CommonMJConfig.EffectPath.AntiClockWise;
        }
        else if (type == MahHSZType.HSZ_ClockWise)
        {
            aniName = CommonMJConfig.EffectPath.ClockWise;
        }
        else if (type == MahHSZType.HSZ_OppoSiteSide)
        {
            aniName = CommonMJConfig.EffectPath.Opposite;
        }


        let timerItem=  window.setTimeout(()=>{
            this.OnPlayerGameEffectDetails(aniName,endFun);
        } , 1000);

        this.m_TimerArr.push(timerItem)
    }

    /** 播放换三张特效 */
    OnPlayerGameEffectDetails(aniName:string,endFun:()=>{}) 
    {
        this.mjPanelSC.SetActiveChangeThree(false);
        this.mjPanelSC.SetActiveHuanSanZhangEff(false);

        //加载出换三张特效出来
        
        
        this.mjPanelSC.PlayCenterEff("mjsp_huansanzhang",aniName)


        MJTool.PlaySound(CommonMJConfig.SoundEffPath.Huansanzhang,Config.BUNDLE_MJCOMMON);

        //时间到删除掉特效
        let timerItem=  window.setTimeout(()=>
        {
            dispatch(MJEvent.CHANGE_PLAYER_THREE_CARD, CommonMJConfig.MineGetThreeCards);
            CommonMJConfig.MineGetThreeCards = null;
            CommonMJConfig.ChangeEffectOver = false;
            CommonMJConfig.SetSelectLackingOver = false;
            if (!CommonMJConfig.MjRoomRule.dingQue) 
            {
                this.roomViewSC.SetActivePropBtn(true)
                this.mjPanelSC.SetActivejpqBtn(true)
            }

            endFun();
        } , 2400);

        this.m_TimerArr.push(timerItem)

    }




    // OnStartSelectLacking() 
    // {
        
    // }

    /** 初始化玩家手牌 */
    OnStartGameInitCards(bottomcards:{},moPai:number) 
    {
        MJManager.InitLookCard();
        //直接生成牌然后每四个播放一次动画,自己的牌先排序  庄家的牌多的一张放进手牌

        this.mjcplayersSC.OnInitCardsPlayEndZhuangAni(bottomcards,moPai);
    }

    /** 定庄  骰子 轮盘 */
    OnDingZhuang(zhuangPos:number)
    {
        RoomManager.SetZhaungPos(zhuangPos);
        for (const [key, val] of Object.entries(CommonMJConfig.MJMemberInfo)) {
            // 类型是 pb.IMahPlayerData
            if (CommonMJConfig.MJMemberInfo[key].index== zhuangPos ) 
            {
                CommonMJConfig.MJMemberInfo[key].bZhuang =true;
            }
            else
            {
                CommonMJConfig.MJMemberInfo[key].bZhuang =false;
            }
        }
        MJDispose.SetClientZhuangIndex(MJTool.PositionToDirection(zhuangPos));
        // 设置轮盘
        this.mjmiddleSC.SetTableWheel(CommonMJConfig.ClientZhuangIndex);
        this.OnSetOutCardDirection(CommonMJConfig.ClientZhuangIndex);



        //设置庄家飘庄动画

        this.mjHeadPlayersSC.PlayZhuangAni()
      
    }

    /** 设置指示灯位置 头像亮起 */
    OnSetOutCardDirection(direct:number) 
    {
        this.mjmiddleSC.OnSetOutCardDirection(direct);
        this.mjHeadPlayersSC.SetActivehead_3dLoad(direct);
    }

    /** 游戏开始 */
    OnStartGame(dataAll:{data: pb.S2CGameBegin,endFun:()=>{}}) 
    {
        let data =dataAll.data;
        dispatch(MJEvent.RESET_CARDS)
        MJDispose.SetRoomState(MahTableStage.TS_TableBegin,true)

        RoomManager.curRound = data.curinning
        this.roomPlayersBehaviourSC.SetActiveReadyAllHide();
        //游戏开始的动画
        MJTool.PlaySound(CommonMJConfig.EffectPath.StartGame.sound, Config.BUNDLE_MJCOMMON);
        dispatch("PLAYCENTEREFF", CommonMJConfig.EffectPath.StartGame.path,CommonMJConfig.EffectPath.StartGame.aniName  )
        //播放定庄的动画
        this.OnDingZhuang(data.index);
        
        let timerItem=  window.setTimeout(()=>
        {
            dataAll.endFun();
        } , 2000);
        this.m_TimerArr.push(timerItem)


    }

    /** 根据骰子点数初始化数据 */
    // SetPaiQingDataByGameBegin(data: pb.S2CMahFaPai)
    // {

    //     this.SetPaiQingDataByTouZi(data.touZi,RoomManager.zhuang)
    // }
    // SetPaiQingDataByTouZi(touZi: number[], zhuangIndex: number) 
    // {
    //     //找出骰子的算出摸牌起点位置
    //     // Log.e("  SetPaiQingDataByTouZi  touZi  ",touZi,Manager.utils.milliseconds);
    //     let startIndex = touZi[0]
    //     let startCardIndex = touZi[1]
    //     if (touZi[1]>touZi[0]) 
    //     {
    //         startIndex = touZi[1]
    //         startCardIndex = touZi[0]
    //     }
    //     let zhuangClientPos = MJTool.PositionToDirection(zhuangIndex) 
    //     let clientStartMoPos = (zhuangClientPos+startIndex)%4

    //     // Log.e("  SetPaiQingDataByTouZi  zhuangClientPos clientStartMoPos ",zhuangClientPos,clientStartMoPos,startCardIndex);

    //     this.mjcplayersSC.InitPaiQiangDataStart(clientStartMoPos,startCardIndex*2)
    // }

    /** 开始发牌 */
    OnS2CMahFaPai(dataAll:{data: pb.S2CMahFaPai,endFun:()=>{}}) 
    {

        this.mjmiddleSC.SetActiveTouZi(false);
        let data =dataAll.data;
        MJDispose.SetSelfMoCard(data.moPai)
        let hzCount =0
        // Log.e("  OnS2CMahFaPai  开始发牌  CommonMJConfig.MJMemberInfo :  ", CommonMJConfig.MJMemberInfo );
        for (let i = 0; i < data.FuKaHZIndex.length; i++) 
        {
            let serPos = i+1;
            // Log.e("  OnS2CMahFaPai  开始发牌  CommonMJConfig.MJMemberInfo[serPos]  :  ", CommonMJConfig.MJMemberInfo[serPos] ,serPos);
            if (data.FuKaHZIndex[i]==1) {
                 hzCount=hzCount+1
                 CommonMJConfig.MJMemberInfo[serPos].usedHongZhong = true;
            }
            else
            {
                CommonMJConfig.MJMemberInfo[serPos].usedHongZhong = false;
            }
        }
        MJDispose.SetExtraHZCount(hzCount)
        dispatch(MJEvent.INITMJ,data.touZi,RoomManager.zhuang);
        MJManager.InitBoard();  
        this.InitPaiQiang(data.touZi,RoomManager.zhuang)

        // Log.e(" CommonMJConfig.allPaiqiangArr CommonMJConfig.totalCount  :  ",CommonMJConfig.allPaiqiangArr.length, CommonMJConfig.totalCount)
        dispatch(MJEvent.SETLAIZI);
        MJDispose.SetRoomState(MahTableStage.TS_FaPai,true);
        // Log.e(" OnS2CMahFaPai    data.mjs.length :  ", data.mjs.length); 


        
        // this.SetPaiQingDataByGameBegin(data)

        let timerItem=  window.setTimeout(()=>
        {
            this.mjmiddleSC.PlayTouZiAni(data.touZi)
        } , 1000);
        this.m_TimerArr.push(timerItem)


        this.PlayerPaiZhuoSpain(dataAll)

    }




    PlayerPaiZhuoSpain(dataAll:{data: pb.S2CMahFaPai,endFun:()=>{}} )
    {
        let isPlayed =false

        Manager.utils.PlaySpine(this.paizhuo_load3d,"mjsp_xp","mj_xp1",Config.BUNDLE_MJCOMMON,()=>{

            if (!isPlayed) 
            {
                // Log.w(" 只能来一次播放完成 ")
                isPlayed =true

                Manager.utils.PlaySpineOnly(this.paizhuo_load3d,"mj_xp2",()=>{
                    // Log.w(" 连续的动画 只能来一次播放完成 ")
                    this.paizhuo_load3d.visible =true
                });

                this.mjcplayersSC.SetActiveAllPaiQiang(true)
                // CommonMJConfig.allPaiqiangArr[0].visible =false;
                // CommonMJConfig.allPaiqiangArr[1].visible =false;
                this.MahFaPaiFinal(dataAll)
            }

        })

    }
    

    MahFaPaiFinal(dataAll:{data: pb.S2CMahFaPai,endFun:()=>{}})
    {
        let data =dataAll.data;
        let bottomcards = { };
        for (let index = 0; index < data.mjs.length; index++) 
        {
            let v= data.mjs[index]; 
            // Log.e(" OnS2CMahFaPai   v ",v);      
            bottomcards[index]=v;
            CommonMJConfig.AllCards[v] = CommonMJConfig.AllCards[v] - 1;
            if (!CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom][v]) 
            {
                CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom][v]=1;
            }
            else
            {
                CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom][v]+=1;
            }
        }
        
        this.OnStartGameInitCards(bottomcards,data.moPai);

        //设置剩余拍数和倒计时
        this.mjmiddleSC.SetCountDown(CommonMJConfig.TimeCountDown.Common)
        this.mjmiddleSC.SetActiveResidue(true)

        let timerItem=  window.setTimeout(()=>
        {
            MJDispose.SetResidueCards(data.restCount);
            this.mjmiddleSC.OnSetResidueCards(CommonMJConfig.ResidueCards)
            if (!CommonMJConfig.MjRoomRule.dingQue && !CommonMJConfig.MjRoomRule.hsz )//没有换三张和发牌的时候 
            {
                this.roomViewSC.SetActivePropBtn(true)
                this.mjPanelSC.SetActivejpqBtn(true)
            }

            dataAll.endFun();
        } , 5000);
        this.m_TimerArr.push(timerItem)




    }




    /** 开始换三张 */
    OnS2CMahHSZNotify(dataAll:{data: pb.S2CMahHSZNotify,endFun:()=>{}}) 
    {

        let data =dataAll.data;
        CommonMJConfig.DefaultThreeCards = data.mjId;
        // Log.e("  OnS2CMahFaPai  CommonMJConfig.DefaultThreeCards  :  ",CommonMJConfig.DefaultThreeCards);

        // if (!CommonMJConfig.MjRoomRule.hsz) 
        // {
        //     //没有换三张玩法直接跳过 一般服务器不会发 做容错处理
        //     Log.e("  OnS2CMahFaPai 没有换三张玩法直接跳过 ");
        //     dataAll.endFun();
        //     return;
        // }
        
        MJDispose.SetState(CommonMJConfig.MineCardState.Change);

        this.mjmiddleSC.SetCountDown(CommonMJConfig.TimeCountDown.Common)
        if (!this.m_EffectHSZ) 
        {
            this.m_EffectHSZ = true;
            //现在暂时没有好牌不换的玩法
            CommonMJConfig.SelfHaoPaiBuHuan =false;
            this.mjPanelSC.SetActiveChangeThree(true)
            // this.mjPanelSC.SetInteractablemBtnChangeCard(true)
            CommonMJConfig.CurrentSelectCard=null;
            this.mjcplayersSC.ResetCards(CommonMJConfig.Direction.Bottom)
            this.mjcplayersSC.SetAllCardDown()
            this.mjcplayersSC.RecommendChangeThree(CommonMJConfig.Direction.Bottom,CommonMJConfig.DefaultThreeCards)
        }
        dataAll.endFun();
    }




    
    /** 结束换三张 */
    OnS2CMahHSZResult(dataAll:{data: pb.S2CMahHSZResult,endFun:()=>{}}) 
    {

        let data =dataAll.data;

        MJDispose.SetSelfMoCard(data.newMo);
        // Log.w("  OnS2CMahHSZResult  结束换三张  data  :  ",data);
        MJDispose.SetState(CommonMJConfig.MineCardState.Lock)
        CommonMJConfig.MineGetThreeCards=[];
        CommonMJConfig.OldChangeThreeCards=[];

        for (let i = 0; i <   data.delMahs.length; i++) 
        {
            let v =data.delMahs[i];
            CommonMJConfig.OldChangeThreeCards.push(v);
            if ( v!=0 ) 
            {
                CommonMJConfig.AllCards[v] = CommonMJConfig.AllCards[v] + 1;
                let oldcount = CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom][v];
                CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom][v] = oldcount - 1;
            }
        }
        
        for (let i = 0; i <   data.getMahs.length; i++) 
        {
            let v =data.getMahs[i];
            CommonMJConfig.MineGetThreeCards.push(v);
            if ( v!=0 ) 
            {
                CommonMJConfig.AllCards[v] = CommonMJConfig.AllCards[v] - 1;
                if (CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom][v] == null) 
                {
                    CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom][v] = 0;
                }
                CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom][v] = CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom][v] + 1;
            }
        }

        this.OnPlayerGameEffect(data.type,dataAll.endFun);





    }





    
    /** 开始定缺 */
    OnS2CMahDingQueNotify(dataAll:{data: pb.S2CMahDingQueNotify,endFun:()=>{}}) 
    {
        let data =dataAll.data;
        // Log.w("  OnS2CMahDingQueNotify  开始定缺  data  :  ",data);
        MJDispose.SetState(CommonMJConfig.MineCardState.Lock)
        MJDispose.SetRoomState( MahTableStage.TS_DingQue ,true)

        this.mjmiddleSC.SetCountDown(CommonMJConfig.TimeCountDown.Common)
        // this.SetActiveHuanSanZhangEff(false);

        //展示定缺中
        this.mjPanelSC.SetMJTips( CommonMJConfig.TipsSprite.WaitDingQue )

        this.mjcplayersSC.ResetCards(CommonMJConfig.Direction.Bottom );
        MJDispose.SetState(CommonMJConfig.MineCardState.Lock)
        this.mjPanelSC.OnStartSelectLackingMjPanel(data);
        dataAll.endFun();

    }

    
    
    /** 定缺结果 */
    OnS2CMahDingQueResult(dataAll:{data: pb.S2CMahDingQueResult,endFun:()=>{}}) 
    {
        let data =dataAll.data;
        // Manager.alert.close();
        MJDispose.SetRoomState(MahTableStage.TS_MoPaiStage,true)


        this.mjmiddleSC.SetCountDown(CommonMJConfig.TimeCountDown.Common);
        for (let i = 0; i < data.que.length; i++) 
        {
            if (data.que[i].key != null && data.que[i].key ==RoomManager.SelfPosition ) 
            {
                MJDispose.SetMineQueCard(data.que[i].value)
                if (data.que[i].value != -1 ) 
                {
                    //自己如果已经定缺了 在去判断
                    dispatch(MJEvent.HIDE_MJTIPS);
                    MJTool.HasQueCard();
                    // dispatch(MJEvent.SET_DINGQUE_CARD_STATE, CommonMJConfig.AlreadyQue, CommonMJConfig.MJMemberInfo[RoomManager.SelfPosition].iszhuang);
                }
                break;
            }
        }
        for (let i = 0; i < data.que.length; i++) 
        {
            if (data.que[i].key != null ) 
            {
                this.OnSelectLacking(data.que[i].key,data.que[i].value);
            }
        }
        //定缺状态走完 如果自己是庄之后设置出牌  排序后手牌变换后再设置出牌
        if (CommonMJConfig.MJMemberInfo[RoomManager.SelfPosition].iszhuang) 
        {

            this.OnSetOutCardDirection(CommonMJConfig.Direction.Bottom)
            MJDispose.SetState(CommonMJConfig.MineCardState.Play);
            // dispatch(MJEvent.SET_INITCARDSHOWHUTIP);
        } 
        else 
        {
            // dispatch(MJEvent.SET_MJHUTIP, true);
        }

        dispatch(MJEvent.HIDE_SELECT_LACKING);
        // dispatch(MJEvent.SET_DINGQUEING,false);
        this.mjPanelSC.SetActivetipsWZSprite_Gc(false)  
        MJDispose.SetState(CommonMJConfig.MineCardState.Play);
        let timerItem=  window.setTimeout(()=>
        {
            this.roomViewSC.SetActivePropBtn(true)
            this.mjPanelSC.SetActivejpqBtn(true)
            dataAll.endFun();
        } , 500);
        this.m_TimerArr.push(timerItem)



    }



    /** 某个玩家定缺 */
    OnSelectLacking( pos:number,color:number ) 
    {
        let direct = MJTool.PositionToDirection(pos);
        if (direct == CommonMJConfig.Direction.Bottom &&  color  != -1 ) 
        {
            this.mjcplayersSC.SortCardByLacking(CommonMJConfig.Direction.Bottom)
        }
        this.mjHeadPlayersSC.PlaySeAni(direct,color);

    }



    
    /** 更新玩家状态  换三张 定缺  别人(状态改变) 操作 */
    OnS2CMahUpdateTableAndPlayerState( dataAll:{data: pb.S2CMahUpdateTableAndPlayerState,endFun:()=>{}} ) 
    {

        let data =dataAll.data;
        // Log.e("  OnS2CMahUpdateTableAndPlayerState  玩家状态改变  data  :  ",data);
        let  state = data.tableStage;
        let  playerState = data.playerState;
        if (MahTableStage.TS_WaitForBegin) 
        {
            // for (let i = 0; i < playerState.length; i++) 
            // {
            //     if (playerState[i].key == RoomManager.SelfPosition) 
            //     {

            //     }
            //     this.roomPlayersBehaviourSC.SetActiveReady(playerState[i].key,playerState[i].value == MahPlayerState.PS_Ready)
            // }
        } 
        else if (MahTableStage.TS_HuanSanZhang)
        {
            this.mjPanelSC.SetActiveHuanSanZhangEff(true)
            for (let i = 0; i < playerState.length; i++) 
            {
                //不是自己 并且已经扣牌了 不是好牌不换的玩家 是第一次扣牌
                if (playerState[i].key != RoomManager.SelfPosition && playerState[i].value == MahPlayerState.PS_HSZed  ) 
                {
                    if ( !MJDispose.GetIsHuanByPos(playerState[i].key)) {
                        this.mjcplayersSC.DeleteChangeCards(MJTool.PositionToDirection(playerState[i].key))
                        CommonMJConfig.HuanPosData.push(playerState[i].key)
                    }

                }
                this.mjPanelSC.SetActiveThreeCards(playerState[i].key,playerState[i].value == MahPlayerState.PS_HSZed );
            }
        }
        else if (MahTableStage.TS_DingQue)
        {
            for (let i = 0; i < playerState.length; i++) 
            {
                if ( playerState[i].value == MahPlayerState.PS_DingQueed &&  playerState[i].key ==  RoomManager.SelfPosition ) 
                {
                    this.mjPanelSC.SetActiveSelectLacking(false)
                }
            }
        }

        dataAll.endFun();

    }


    /** 玩家出牌 */
    OnS2CMahChuPai(dataAll:{data: pb.S2CMahChuPai,endFun:()=>{}}) 
    {
        let data =dataAll.data;
        let playerData =    CommonMJConfig.MJMemberInfo[data.index] as pb.IMahPlayerData
        playerData.moPaiId = 0
        let direct = MJTool.PositionToDirection(data.index);
        //只要有玩家出牌就把之前打的牌的 特效关掉
        if (CommonMJConfig.LastOutCard!=null) 
        {
            CommonMJConfig.LastOutCard.SetActivezhishideng(false)
        }
        else
        {
            Log.w( " 出牌异常  data.mjId : ",  data.mjId );
        }

        if (direct == CommonMJConfig.Direction.Bottom) 
        {
            MJDispose.SetSelfMoCard(0);
            MJDispose.SetState(CommonMJConfig.MineCardState.Lock);
            let oldcount = CommonMJConfig.PlayerCardsInfo[direct][data.mjId];
            if (oldcount!=null && oldcount !=0 ) 
            {
                CommonMJConfig.PlayerCardsInfo[direct][data.mjId] = oldcount - 1;
            }
            if ( !CommonMJConfig.AlreadyHu ||  CommonMJConfig.AlreadyHuShowTip) 
            {
                this.mjcplayersSC.HideAllDaduo()   
                dispatch(MJEvent.HIDE_ALL_HANDLE_BTN);
                dispatch(MJEvent.HIDE_MJTIPS);
                dispatch(MJEvent.SET_ALLCARD_DOWN);
                dispatch(MJEvent.SHOW_OUT_HAND_FANSHU_TIP,false);
                this.mjPanelSC.moreGang_SC.SetActiveMoreGangView(false);
                MJTool.HasQueCard();
                dispatch(MJEvent.SET_DINGQUE_CARD_STATE, CommonMJConfig.AlreadyQue, true);

            }
            this.mjPanelSC.SetActivetipsWZSprite_Gc(false);
            //自己出了牌关掉所有 碰杠胡操作

            this.mjPanelSC.mjHandlesSC.HideAllHandle()

        } 
        else 
        {
            if (data.operate!=null && data.operate.operate!=null  && data.operate.operate.length!=0 ) 
            {
                // this.mjPanelSC.OnShowHandles( false,data.operate.operate,data.mjId,data.operate.KeGangMjs,data.mjId,false ,data.operate.HuFan)
                this.mjPanelSC.OnShowHandles( data.operate,false )
            }
            //貌似不能这样用
            // Log.e( "  CommonMJConfig.PlayerCardsInfo[direct] ~~~ ",direct );
            // Log.e( "  CommonMJConfig.PlayerCardsInfo[direct]  ",CommonMJConfig.PlayerCardsInfo[direct] );
            let playerData =    CommonMJConfig.MJMemberInfo[data.index] as pb.IMahPlayerData
            if (playerData.bMingPai) //玩家明牌了后打牌就不需要在走牌库中删牌了
            {
                CommonMJConfig.PlayerCardsInfo[direct][data.mjId] = CommonMJConfig.PlayerCardsInfo[direct][data.mjId] -1 
            } 
            else 
            {
                CommonMJConfig.PlayerCardsInfo[direct][0] = CommonMJConfig.PlayerCardsInfo[direct][0] -1 
                CommonMJConfig.AllCards[data.mjId] = CommonMJConfig.AllCards[data.mjId] - 1;
            }
        }

        MJTool.PlaySound(CommonMJConfig.SoundEffPath.ChuPai,Config.BUNDLE_MJCOMMON);

        let playerDataTab :pb.ITablePlayer =    RoomManager.GetPlayerByIndex(direct)
        if (  Number(playerDataTab.player.attrs[PlayerAttr.PA_Gender] ) == 1 ) //男
        {
            dispatch(MJEvent.MJPLAYSOUNDCARD, data.mjId,true);
        }
        else
        {
            dispatch(MJEvent.MJPLAYSOUNDCARD, data.mjId,false);
        }


        this.OnPickOutCard(direct,data.mjId,dataAll.endFun);

        if (direct == CommonMJConfig.Direction.Bottom) 
        {
            if ( CommonMJConfig.CurrenMahKeHuDataArr!=null && CommonMJConfig.CurrenMahKeHuDataArr!= [] ) 
            {
                if ( CommonMJConfig.MjRoomRule.isHongZhongGang && ( data.mjId==35 || data.mjId==135 ) ) //10和16红中的时候红中算杠
                {
                    MJDispose.SetCurrenMahKeHuDataArrBei(2)
                }
                let itemData: pb.IMahKeHuData = MJDispose.GetHuTipState(data.mjId)
                if (itemData!=null) 
                {
                    // 自己出的是红中并且有红中杠玩法的时候
                    this.mjPanelSC.SetActiveMJTipDeng(true);
                    this.mjPanelSC.SetActiveHuTipContent(false);
                    this.mjPanelSC.RefreshHuTipView(itemData)
                }
            }
            //胡牌提示
        }

    }
    /** 出牌 */
    OnPickOutCard(direct: number, mjId: number,endFun: () => {}) 
    {
        // Log.e("OnPickOutCard   mjId  :",mjId)
        
        this.mjcplayersSC.HideAllBigCardShow()
        if (direct == CommonMJConfig.Direction.Bottom) 
        {
            if (CommonMJConfig.PickOutCardTable != null) 
            {
                this.mjcplayersSC.RemoveHandCard(direct, mjId, CommonMJConfig.PickOutCardTable)
                CommonMJConfig.PickOutCardTable =null;
            }
            else
            {
                this.mjcplayersSC.RemoveHandCard(direct, mjId,null)
            }
            //自己打完牌 关掉自己胡牌提示的Flag  如果自己听牌提示听牌提示按钮亮起来
            if (!CommonMJConfig.AlreadyHu ||  CommonMJConfig.AlreadyHuShowTip) 
            {
                this.mjcplayersSC.OnSetOutHandHuCardsState(false);
                // dispatch(MJEvent.SET_MJHUTIP, false);
                // dispatch(MJEvent.OUTCARDHPTS, mjId)
            }
            let timerItem=  window.setTimeout(()=>{
                if ( CommonMJConfig.MjRoomRule.isHongZhongGang && ( mjId==35 || mjId==135 ) ) //10和16红中的时候红中算杠
                {
                    this.mjcplayersSC.ShowEffectGangSelf()
                }
            } ,  500 );
            this.m_TimerArr.push(timerItem)

        }
        else
        {
            let serPos = RoomManager.ConvertServerPos(direct)
            let playerData =    CommonMJConfig.MJMemberInfo[serPos] as pb.IMahPlayerData

            if (playerData.bMingPai) //明牌了之后其他玩家打牌也有插牌动画了 暂时直接刷新
            {
                Log.e(" 打牌玩家是明牌的 ")
                this.mjcplayersSC.ReFalshCardView(direct);
            } 
            else 
            {
                this.mjcplayersSC.RemoveHandCard(direct, 0,null)
            }
        }

        this.mjcplayersSC.OnPickOutCardOut(direct,mjId)
        this.mjmiddleSC.SetCountDown(CommonMJConfig.TimeCountDown.Common);
        //自己打的牌是35 展示红中杠次数
        if  ( CommonMJConfig.MjRoomRule.isHongZhongGang && ( mjId==35 || mjId==135 ) )
        {
            this.mjHeadPlayersSC.SetHongZhongADDCount(direct)
        }
        let timerItem=  window.setTimeout(()=>{
            // Log.d("打牌表现结束 ")
            if (direct == CommonMJConfig.Direction.Bottom) {
                this.mjPropSC.Reflash();
            }

            endFun();
        } , CommonMJConfig.OperateTime.Da);
        this.m_TimerArr.push(timerItem)
    
    
    }

    

    /** 玩家摸牌 */
    OnS2CMahMoPai( dataAll:{data: pb.S2CMahMoPai,endFun:()=>{}} )
    {
        let data =dataAll.data;

        // Log.e("  OnS2CMahMoPai  玩家摸牌  data  :  ",data);
        let playerData =    CommonMJConfig.MJMemberInfo[data.index] as pb.IMahPlayerData
        playerData.moPaiId = data.mjId
        let direct = MJTool.PositionToDirection(data.index);
        this.OnSetOutCardDirection(direct);
        this.HidePaiQiangCardItem(true)
        if (data.restCount!=null) 
        {
            MJDispose.SetResidueCards(data.restCount)
        }
        else
        {
            MJDispose.SetResidueCards(0)
        }
        this.mjmiddleSC.SetCountDown(CommonMJConfig.TimeCountDown.Common);
        this.mjPanelSC.mjHandlesSC.HideAllHandle();

        if (direct==CommonMJConfig.Direction.Bottom) //自己摸牌的时候
        {
            MJDispose.SetSelfMoCard(data.mjId)
            this.OnMinePickUpCard(data);
            if (data.ShowKeHu) {
                let timerItem1=  window.setTimeout(()=>{
                    //胡牌提示
                    this.SetCommonHuTip(data.data,data.mjId)
                    // this.mjPanelSC.SetActiveMJTipDeng(false);
                } , 200 );
                this.m_TimerArr.push(timerItem1)
            }
            if (data.data.length !=0 ) {
                this.mjcplayersSC.PlaySpainLiuGuangEff()
            }
            let timerItem=  window.setTimeout(()=>{
                this.mjPropSC.Reflash();
                dataAll.endFun();
            } , CommonMJConfig.OperateTime.SelfMo);
            this.m_TimerArr.push(timerItem)
        } 
        else 
        {
        
            Log.w(" 别的玩家摸牌 ~~~~~~~~~~~~~~  ")
            this.OnOtherPickUpCard(data);
            let timerItem=  window.setTimeout(()=>{
                dataAll.endFun();
            } , CommonMJConfig.OperateTime.OtherMo );
            // 
            this.m_TimerArr.push(timerItem)
        }
    }



    /** 别的玩家摸牌 */
    OnOtherPickUpCard(data: pb.S2CMahMoPai) 
    {
        let direct = MJTool.PositionToDirection(data.index);
        let playerData =    CommonMJConfig.MJMemberInfo[data.index] as pb.IMahPlayerData
        Log.e("OnOtherPickUpCard    playerData.bMingPai ",playerData.bMingPai)

        if (playerData.bMingPai) 
        {
            if ( CommonMJConfig.PlayerCardsInfo[direct][data.mjId] == null ) 
            {
                CommonMJConfig.PlayerCardsInfo[direct][data.mjId] =0;
            }
            CommonMJConfig.PlayerCardsInfo[direct][data.mjId] = CommonMJConfig.PlayerCardsInfo[direct][data.mjId] + 1;
            CommonMJConfig.AllCards[data.mjId] = CommonMJConfig.AllCards[data.mjId] - 1;
        } 
        else 
        {
            CommonMJConfig.PlayerCardsInfo[direct][0]=CommonMJConfig.PlayerCardsInfo[direct][0]+1;
        }
        this.OnOtherPickUpCardDetails(direct,data.mjId,playerData.bMingPai)
        this.mjPanelSC.HideAllHandleAndSelectGang();

    }

    /** 别的玩家摸牌 */
    OnOtherPickUpCardDetails(direct: number, mjId: number,isMingPai) 
    {

        this.mjcplayersSC.PickCard(direct, mjId,isMingPai);
    }

    /** 自己摸牌 */
    OnMinePickUpCard(data:pb.S2CMahMoPai)
    {
        this.mjcplayersSC.HideAllBigCardShow();
        this.mjPanelSC.HideAllHandleAndSelectGang();
        this.mjPanelSC.SetActiveOutCardHuTip(false);

        //自己摸牌是否触发 搓牌动画
        if ( CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom][data.mjId] == null ) 
        {
            CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom][data.mjId] =0;
        }
        CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom][data.mjId] = CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom][data.mjId] + 1;
        this.OnMinePickUpCardDetails(data.index,data.mjId)
        CommonMJConfig.AllCards[data.mjId] = CommonMJConfig.AllCards[data.mjId] - 1;
        MJDispose.SetSelfLastPickCard(data.mjId)
        if (!CommonMJConfig.AlreadyHu ||  CommonMJConfig.AlreadyHuShowTip) 
        {
            MJTool.HasQueCard();
            dispatch(MJEvent.SET_DINGQUE_CARD_STATE, CommonMJConfig.AlreadyQue, true);
            MJDispose.SetState(CommonMJConfig.MineCardState.Play)
            // dispatch(MJEvent.SET_INITCARDSHOWHUTIP)
        }

        if ( data.operate!=null && data.operate.operate!=null && data.operate.operate.length!=0 ) {
            // this.mjPanelSC.OnShowHandles( true,data.operate.operate,data.mjId,data.operate.KeGangMjs,data.mjId,data.chuoPaiAction,data.operate.HuFan )
            this.mjPanelSC.OnShowHandles( data.operate,true )
        }

    }

    /** 自己 摸牌  index 服务器坐标 */
    OnMinePickUpCardDetails( index :number ,mjId: number) 
    {

        let playerData =    CommonMJConfig.MJMemberInfo[index] as pb.IMahPlayerData
        //自己摸牌的时候自己 明牌了这个牌要冒火
        this.mjcplayersSC.PickCard( CommonMJConfig.Direction.Bottom, mjId,playerData.bMingPai)

    }







    /** 自己可以胡碰杠的时候 弹出操作按钮 */
    OnS2CMahHasHPG( dataAll:{data: pb.S2CMahHasHPG,endFun:()=>{}} )
    {
        let data =dataAll.data;
        // let handles :number[]= MJTool.GetOpraArr(data.operate.operate);
        if ( data.operate.operate.length != 0) 
        {

            let cardsKV = CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom];
            let tempArr =MJTool.TableKVCopyToList(cardsKV)
            MJManager.CardSortByLaiZiAndQue(tempArr);
            let isCanChu= MJTool.GetIsCanChuPai(tempArr.length)
            //自己能出牌的时候说明是自己的阶段
            if (isCanChu) 
            {
                this.mjPanelSC.OnShowHandles( data.operate,true )
            } 
            else
            {
                this.mjPanelSC.OnShowHandles( data.operate,false )
            }
        }

    }

    
    /** 玩家胡 */
    onS2CMahHuResult( dataAll:{data: pb.S2CMahHuResult,endFun:()=>{}} )
    {
        let data =dataAll.data;
        let isDo =false

        for (let index = 0; index < data.hu.length; index++) 
        {
            //别人胡的时候牌扣下去 如果有明牌的话
            let playerData =    CommonMJConfig.MJMemberInfo[data.hu[index].huIndex] as pb.IMahPlayerData
            playerData.hu.push(data.hu[index])

            let hudirect = MJTool.PositionToDirection( data.hu[index].huIndex );
            if (hudirect ==CommonMJConfig.Direction.Bottom  )//自己胡牌了
            {
                MJDispose.SetSelfMoCard(0)
                if ( RoomManager.GetRoomState() != RoomManager.StateType.Resulting) 
                {
                    RoomManager.SetState(RoomManager.StateType.SelfHu)
                }
                MJDispose.SetAlreadyHu(true);
                dispatch (MJEvent.HIDE_ALL_HANDLE_BTN)
                this.mjcplayersSC.HideAllDaduo()   
                if ( CommonMJConfig.CurrenMahKeHuDataArr!=null && CommonMJConfig.CurrenMahKeHuDataArr!= [] ) 
                {
                    if (!isDo) {
                        isDo =true
                        let itemData: pb.IMahKeHuData = MJDispose.GetHuTipState(data.hu[index].mjId)
                        if (itemData!=null) 
                        {
                            this.mjPanelSC.SetActiveMJTipDeng(true);
                            this.mjPanelSC.SetActiveHuTipContent(false);
                            this.mjPanelSC.RefreshHuTipView(itemData)
                        }
                    }
                }

            }
            else
            {
                CommonMJConfig.TangCards[hudirect].IsHu = true
                CommonMJConfig.TangCards[hudirect].HuCards = []
                dispatch(MJEvent.HIDE_HANDLE_OTHERHU);

                // //其他玩家自摸
            }

            dispatch(MJEvent.SET_WEIFLAG)
        }

        dispatch(MJEvent.HU_CARD,dataAll)


    }



    /** 小结算 */
    onS2CMahInningOverData( dataAll:{data: pb.S2CMahInningOverData,endFun:()=>{}} )
    {
        let data =dataAll.data;
        this.roomViewSC.Reset()
        this.poChanViewSC.SetActivePoChan(false)
        Manager.uiManager.close(RecommendChongZhi);
        // Log.e("     onS2CMahInningOverData 麻将小结算        data :",data);
        this.mjcplayersSC.SetActiveLiuGuangHide()
        dispatch(MJEvent.SETACTIVETUOGUAN,CommonMJConfig.Direction.Bottom,false);
        MJDispose.SetMJGameSmallResult(data)
        MJDispose.SetRoomState(MahTableStage.TS_InningOver,true)

        this.mjPanelSC.SetActiveMJTipDeng(false);
        //小结算处理 如果小结算 显示过了那就直接刷新
        if (this.mjBalanceViewSC.GetActiveBalanceView()) 
        {
            this.mjBalanceViewSC.onS2CMahInningResult(dataAll.data)
            dataAll.endFun();
            return;
        }
        else
        {
            // MJDispose.ClosePropPanel()
            this.mjLiuShuiViewSC.SetActiveLiuShui(false);
            // MJTrusteeshipPanel   托管界面关闭
            MJDispose.SetUseHongZhongPropState(false)

            dispatch(MJEvent.STOP_COUNTDOWU);
            RoomManager.curRound = RoomManager.curRound + 1;
            this.OnMJJieSunResultReal(dataAll)
        }
    }

    /** 结算处理 先播放 结束(流局)动画 躺牌 最后在 展示小结算面板  */    
    OnMJJieSunResultReal(dataAll: { data: pb.S2CMahInningOverData; endFun: () => {}; }) 
    {
        this.mjcplayersSC.SetActiveAllPaiQiang(false);
        let data = dataAll.data
        let center_com = this.mjPanelSC.GetCenterCom();
        center_com.visible =true;
        let effPath = CommonMJConfig.EffectPath.LiuJuEndGame
        let effObj:fgui.GObject;
        let needTime = 4000
        if (data.isLiuJu) 
        {
            effPath = CommonMJConfig.EffectPath.LiuJuEndGame
            //流局 扣钱
            let timerItem=  window.setTimeout(()=>{ 
                for (let index = 0; index < data.result.length; index++) 
                {
                    let itemData = data.result[index]
                    let liuJuCh = data.result[index].liuju
                    if (liuJuCh!=null ) 
                    {
                        let coin = 0
                        if (liuJuCh.coin!=null )
                        {
                            coin = liuJuCh.coin 
                        }
                        let bFengDing=false
                        if (liuJuCh.bFengDing!=null )
                        {
                            bFengDing = liuJuCh.bFengDing
                        }
                        let bUseJinZhongZhao=false
                        if (liuJuCh.bUseJinZhongZhao!=null )
                        {
                            bUseJinZhongZhao = liuJuCh.bUseJinZhongZhao
                        }

                        this.mjHeadPlayersSC.PlayScore(itemData.index,coin,bFengDing,bUseJinZhongZhao)
                        if (bUseJinZhongZhao) 
                        {
                            this.mjHeadPlayersSC.SetActiveMianSi(MJTool.PositionToDirection( itemData.index),true )
                            this.mjHeadPlayersSC.SetActiveJinzhongzhao_3d(MJTool.PositionToDirection( itemData.index),true )
                        }


                    }
                    let timerItem1 = window.setTimeout(()=>{ 
                        this.roomPlayersBehaviourSC.SetCurrentCore(itemData.index ,itemData.curcoin );
                    } , CommonMJConfig.OperateTime.PiaofenShuaXin);
                    this.m_TimerArr.push(timerItem1)
                }
            } , 2000);
            this.m_TimerArr.push(timerItem)
        }
        else
        {
            effPath = CommonMJConfig.EffectPath.EndGame
        }
        let timerItem=  window.setTimeout(()=>{ 
            // this.m_GObjectPool.returnObject( effObj );
            this.mjBalanceViewSC.onS2CMahInningResult(dataAll.data)
            dataAll.endFun();
        } , needTime);
        this.m_TimerArr.push(timerItem)

        for (let i = 0; i < data.result.length; i++) 
        {
            let direct = MJTool.PositionToDirection(data.result[i].index)
            if (direct!=CommonMJConfig.Direction.Bottom) {
                // let playerData =    CommonMJConfig.MJMemberInfo[data.result[i].index] as pb.IMahPlayerData
                this.mjcplayersSC.SetTanCards(direct, data.result[i].mjs,true)
            }

        }
        


    }

    
    /** 胡牌提示刷新数据 */
    OnS2CMHuPaiTiShi( dataAll:{data: pb.S2CMHuPaiTiShi,endFun:()=>{}} )
    {
        let data =dataAll.data;
        // Log.e("     OnS2CMHuPaiTiShi 麻将胡牌提示数据        data :",data);
        if (data.ShowKeHu) {
            this.SetCommonHuTip(data.data,data.mjid);
        }

        dataAll.endFun();
    }

    
    //outCardId 打出后是否有胡  摸牌的时候默认摸得牌打出 outCardId =0 表示碰后或者起手
    SetCommonHuTip(data: pb.IMahKeHuData[],outCardId:number)
    {
        //摸得那张牌 打出去之后还能胡 才去亮提示灯
        CommonMJConfig.CurrenMahKeHuDataArr = data;
        if ( data.length ==0 ) //没得胡
        {
            //
            this.mjPanelSC.SetActiveMJTipDeng(false);
            this.mjPanelSC.SetActiveHuTipContent(false);
        }
        else if ( data.length == 1 ) //没得胡
        {
            this.mjPanelSC.SetActiveMJTipDeng(outCardId ==data[0].mjId);
            this.mjPanelSC.SetActiveHuTipContent(false);
            this.mjPanelSC.RefreshHuTipView(data[0])

        }
        else //需要点击某张牌去选
        {
            let isShowDeng =false
            for (let index = 0; index < data.length; index++) 
            {
                if (outCardId ==data[index].mjId) 
                {
                    isShowDeng =true
                }
            }
            this.mjPanelSC.SetActiveMJTipDeng(isShowDeng);
            this.mjPanelSC.SetActiveHuTipContent(false);
            // if (CommonMJConfig.AlreadyHu )//已经胡了不在去刷新了 
            // {
                this.mjcplayersSC.OnSetOutHandHuCardsState(true)
            // }

            
        }
    }



    /** 有操作的玩家 完成了一个操作  优先级高的 操作了 我这边关掉操作框 跳出 */
    OnS2CMahHPGDone(dataAll: { data: pb.S2CMahHPGDone; endFun: () => {}; })
    {
        let  data=dataAll.data;
        // 玩家操作了碰 杠胡过的操作 好像是用不上的感觉
        this.mjPanelSC.mjHandlesSC.HideAllHandle();
        dataAll.endFun();


    }

    /** 充值 破产  */
    OnS2CMahGamePoChan(data: pb.S2CMahGamePoChan)
    {
        let direct = MJTool.PositionToDirection(data.inedx);
        if (data.waittime >0 ) 
        {
            this.mjmiddleSC.SetCountDown(data.waittime)
            this.OnSetOutCardDirection(direct);
        }
        this.mjcplayersSC.OnS2CMahGamePoChan(direct,data)
        if (data.curCoin>0) 
        {
            this.roomPlayersBehaviourSC.SetCurrentCore(data.inedx,data.curCoin)    
        }

        if (data.type == MahPoChanReason.PCR_FuHuo ) 
        {
            if (direct== CommonMJConfig.Direction.Bottom) {
                this.mjPanelSC.PlayCenterEff("mjsp_ksfc","ani")
                MJTool.PlaySound(CommonMJConfig.SoundEffPath.FuHuo,Config.BUNDLE_MJCOMMON);

            } else {
                this.mjHeadPlayersSC.PlayFuChou(direct)
            }

        }


    }

    
    /** 托管  */
    OnS2CMahAuto(data: pb.S2CMahAuto)
    {
        // Log.w(  "OnS2CMahAuto   ",data )
        for (let index = 0; index < data.indexAuto.length; index++) 
        {
            //key 是坐标  1是托管
            let direct = MJTool.PositionToDirection(data.indexAuto[index].key);

            let isTuoGuan = (Number(data.indexAuto[index].value) ==1 )
            this.mjcplayersSC.OnS2CMahAuto(direct,isTuoGuan)
        }

    }



    /** 有没有播放过换三张 */
    Setm_EffectHSZ(state :boolean)
    {

        this.m_EffectHSZ =state;

    }

    /** 玩家明牌 */
    OnS2CMahMingPai(data:pb.S2CMahMingPai)
    {
        //玩家明牌的处理
        Log.w(" 玩家明牌的处理   data:  ",data)
        //如果是自己明牌了就一直展示火焰  其他玩家明牌了 倒下去 展示火焰

        let playerData =    CommonMJConfig.MJMemberInfo[data.index] as pb.IMahPlayerData
        playerData.bMingPai = true
        playerData.mjs =data.mjs
        let direct = MJTool.PositionToDirection(data.index)
        this.mjHeadPlayersSC.SetActivefire_3d(direct,true)

        let playerDataTab :pb.ITablePlayer =   RoomManager.GetPlayerByIndex(direct)
        if (  Number(playerDataTab.player.attrs[PlayerAttr.PA_Gender] ) == 1 ) //男
        {
            MJTool.PlaySound(CommonMJConfig.SoundEffPath.NanMingpai, Config.BUNDLE_MJCOMMON);
        }
        else
        {
            MJTool.PlaySound(CommonMJConfig.SoundEffPath.NvMingpai, Config.BUNDLE_MJCOMMON);
        }



        Log.w(" 玩家明牌的处理   direct:  ",direct)
        if (direct == CommonMJConfig.Direction.Bottom)
        {
            //自己明牌的时候胡牌提示的所有倍数X6 关掉胡牌提示界面
            MJDispose.SetCurrenMahKeHuDataArrBei(6)
            this.mjPanelSC.SetActiveHuTipContent(false);
            this.mjcplayersSC.PlayEffFire(CommonMJConfig.Direction.Bottom,playerData.bMingPai)
            //如果明牌后只有一个过的按钮就关掉
            this.mjPanelSC.mjHandlesSC.SetHuHandleText(6)
            

        }
        else//其他玩家明牌
        {
            CommonMJConfig.PlayerCardsInfo[direct] = { }
            for (let i = 0; i < data.mjs.length; i++) 
            {
                let v = data.mjs[i]
                CommonMJConfig.AllCards[v] = CommonMJConfig.AllCards[v] - 1;
                if (!CommonMJConfig.PlayerCardsInfo[direct][v]) 
                {
                    CommonMJConfig.PlayerCardsInfo[direct][v]=1;
                }
                else
                {
                    CommonMJConfig.PlayerCardsInfo[direct][v]+=1;
                } 
            }
            this.mjcplayersSC.SetMingPaiCards(direct,data.mjs,data.moMj) 
        }




        
    }



    OnS2CMahTiShi(data:pb.S2CMahTiShi)
    {
        
        if (data.ts==MahTiShi.GuoShuiBuHu) 
        {
            this.mjPanelSC.SetMJTips( CommonMJConfig.TipsSprite.GuoShouCaiHu )
        }
        else if (data.ts==MahTiShi.BuNengGang) 
        {
            Manager.tips.show("不能杠");
        }
    }


    //两个都关掉或者只有一个打开的时候 发消息
    OnC2SPropTableState(data:{name:string,isShow:boolean})
    {
        if (data.name=="propUse") 
        {
            if (data.isShow) 
            {
                if (!this.mjPropSC.root.visible)
                {
                    MJC2SOperation.OnC2SPropTableState(1);
                }
            }
            else
            {
                if (!this.mjPropSC.root.visible)
                {
                    MJC2SOperation.OnC2SPropTableState(0);
                }
            }
        }
        else if (data.name=="mjProp")
        {
            if (data.isShow) 
            {
                if (!this.roomViewSC.propUse_sc.root.visible)
                {
                    MJC2SOperation.OnC2SPropTableState(1);
                }
            }
            else
            {
                if (!this.roomViewSC.propUse_sc.root.visible)
                {
                    MJC2SOperation.OnC2SPropTableState(0);
                }
            }
        }
    }




    /**
     * 重置所有牌 牌局
     */
    OnResetCards() 
    {
        // this.PlayerPaiZhuoSpain("mj_xp2")
        this.mjBalanceViewSC.ReSet()
        this.mjcplayersSC.ResetPlayer();
        this.mjHeadPlayersSC.Reset();
        this.Setm_EffectHSZ(false);
        this.mjPanelSC.OnResetMJPanel()
        MJDispose.SetMineQueCard(-1)
        this.mjmiddleSC.ResetView()
        this.StopCoroutineTweenAni();
        this.roomPlayersBehaviourSC.Reset();
        this.poChanViewSC.SetActivePoChan(false)
        this.mjPropSC.Reset()
        this.roomViewSC.Reset()
    }







    /**
     * 移除掉所有的计时器
     */
    public StopCoroutineTweenAni()
    {
        this.mjmiddleSC.StopCoroutineTweenAni();
        this.mjPanelSC.StopCoroutineTweenAni();

        if (this.m_TimerArr !=null ) 
        {
            // Log.w(" StopCoroutineTweenAni MJGameView  this.m_TimerArr.length ",this.m_TimerArr.length)
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
