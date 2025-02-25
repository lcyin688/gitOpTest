import FLevel2UI from "../../../../scripts/common/fairyui/FLevel2UI";
import { RoomManager } from "../../../gamecommon/script/manager/RoomManager";
import { MJEvent } from "../Event/MJEvent";
import MJHeadPlayer from "./MJHeadPlayer";
import CMJPlayer from "./CMJPlayer";
import { LoggerImpl } from "../../../../scripts/framework/core/log/Logger";
import { CommonMJConfig } from "../Config/CommonMJConfig";
import { MJTool } from "../logic/MJTool";
import MJCard from "./MJCard";
import MJDispose from "../Manager/MJDispose";



export default class CMJPlayers extends FLevel2UI {



    protected selfGc: fgui.GComponent = null;
    private gameName_text: fgui.GObject = null;

    private  mjcplayerSC0:CMJPlayer ;
    private  mjcplayerSC1:CMJPlayer ;
    private  mjcplayerSC2:CMJPlayer ;
    private  mjcplayerSC3:CMJPlayer  ;


    // private outCardPoint_obj :fgui.GObject=null;

    private  m_tablePlayers:CMJPlayer[]=[];


    //打出的牌
    t_OutCardPoint =null

    /** 添加事件 */
    protected InitEvent() {
        Manager.dispatcher.add(MJEvent.SET_PLAYER_HANDS_POSITION, this.OnSetPlayerHandsPosition, this);


        Manager.dispatcher.add(MJEvent.CHANGE_PLAYER_THREE_CARD, this.OnChangeThreeCard,this);
        //获取同时拖拽牌的数量
        Manager.dispatcher.add(MJEvent.GET_DRAGMJCARDCOUNT, this.GetDragMJCardCount,this);
        Manager.dispatcher.add(MJEvent.SELFISHAVETHISCARDTAB, this.SelfIsHaveThisCardTab,this);
        Manager.dispatcher.add(MJEvent.SET_OUTCARD_POINT_SHOW, this.OnSetOutCardPointShow,this);
        Manager.dispatcher.add(MJEvent.HU_CARD_BY_RECONNECT, this.OnHuByReConnect,this);
        Manager.dispatcher.add(MJEvent.ALL_ADD_HAND_CARDS, this.OnAddHandCards,this);
        Manager.dispatcher.add(MJEvent.SET_OUT_HAND_HU_CARDS_STATE, this.OnSetOutHandHuCardsState,this);
        Manager.dispatcher.add(MJEvent.SET_DINGQUE_CARD_STATE, this.OnSetDingQueCardState,this);
        Manager.dispatcher.add(MJEvent.END_CHANGE_THREE, this.OnEndChangeThree,this);
        Manager.dispatcher.add(MJEvent.SET_ALLCARD_DOWN, this.SetAllCardDown,this);
        Manager.dispatcher.add(MJEvent.SETACTIVETUOGUAN, this.SetActiveTuoGuan,this);
        

        
        Manager.dispatcher.add("GetSelfMoCardId", this.GetSelfMoCardId,this);
        Manager.dispatcher.add("GetSelfMoCardIsUp", this.GetSelfMoCardIsUp,this);

        
        
    }
   


    /** 移除事件 */
    RemoveEvent() {
        Manager.dispatcher.remove(MJEvent.SET_PLAYER_HANDS_POSITION, this);
        Manager.dispatcher.remove(MJEvent.CHANGE_PLAYER_THREE_CARD, this);
        Manager.dispatcher.remove(MJEvent.GET_DRAGMJCARDCOUNT,this);
        Manager.dispatcher.remove(MJEvent.SELFISHAVETHISCARDTAB,this);
        Manager.dispatcher.remove(MJEvent.SET_OUTCARD_POINT_SHOW,this);
        Manager.dispatcher.remove(MJEvent.HU_CARD_BY_RECONNECT,this);
        Manager.dispatcher.remove(MJEvent.ALL_ADD_HAND_CARDS,this);
        Manager.dispatcher.remove(MJEvent.SET_OUT_HAND_HU_CARDS_STATE,this);
        Manager.dispatcher.remove(MJEvent.SET_DINGQUE_CARD_STATE,this);
        Manager.dispatcher.remove(MJEvent.END_CHANGE_THREE,this);
        Manager.dispatcher.remove(MJEvent.SET_ALLCARD_DOWN,this);
        Manager.dispatcher.remove(MJEvent.SETACTIVETUOGUAN,this);
        Manager.dispatcher.remove("GetSelfMoCardId",this);
        Manager.dispatcher.remove("GetSelfMoCardIsUp",this);
    }
    

    public setInit() {
        this.show();
        this.InitEvent();
        this.InitPlayers();





    }

    /** 返回 CMJPlayerSC */
    GetMJCMJPlayer(direct:number):CMJPlayer
    {
        return this.m_tablePlayers[direct];
    }





    InitPlayers()
    {
        // Log.e("  CMJPlayers  InitPlayers   this.root.name  : "+this.root.name);
        // this.root.getChild("mjplayer0").asCom.getChild("n13").text="我认输"
        for(let i = 0;i<= 3;i++) 
        {
            // Log.e("  CMJPlayers  InitPlayers   mjplayer  : "+i);
            let itemobj : fgui.GObject  =   this.root.getChild("mjplayer"+i)
            let item = new CMJPlayer(itemobj.asCom);
            // item.setInit();
            item.SetDirectioni(i);
            this.m_tablePlayers[i]=item;
        }
    }

    OnInitCardsPlayEndZhuangAni(bottomcards: {},moPai:number) 
    {
        this.m_tablePlayers[CommonMJConfig.Direction.Bottom].InitHandCard(bottomcards,moPai);

        
        // Log.w( "OnInitCardsPlayEndZhuangAni CommonMJConfig.MJMemberInfo ", CommonMJConfig.MJMemberInfo);
        for (const [key, val] of Object.entries(CommonMJConfig.MJMemberInfo)) {
            let clientPos = MJTool.PositionToDirection( CommonMJConfig.MJMemberInfo[key].index  )
            if (clientPos != CommonMJConfig.Direction.Bottom ) 
            {
                let cards:number[] =[0,0,0,0,0,0,0,0,0,0,0,0,0]
                if (CommonMJConfig.MJMemberInfo[key].bZhuang  ) 
                {
                    cards =[0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                    CommonMJConfig.PlayerCardsInfo[clientPos][0]=14;
                }
                else
                {
                    CommonMJConfig.PlayerCardsInfo[clientPos][0]=13;
                }
                // CommonMJConfig.PlayerCardsInfo[clientPos]=cards
                // Log.e( "OnInitCardsPlayEndZhuangAni clientPos ", clientPos);
                // Log.e( "OnInitCardsPlayEndZhuangAni ", CommonMJConfig.PlayerCardsInfo[clientPos]);
                this.m_tablePlayers[clientPos].InitHandCard(cards,-1);
            }
        }


        
    }


    /*自己弹起换三张的三张牌*/
    RecommendChangeThree(direct:number, cards:number[])
    {
        this.m_tablePlayers[direct].RecommendChangeThree(cards);
    }





    ResetCards(direct: number) 
    {
        // Log.e( "ResetCards CMJPlayers   direct : ",direct );
        this.m_tablePlayers[direct].ResetCards();
    }



    /** 设置自己所有牌 放下去 */
    SetAllCardDown() 
    {
        this.m_tablePlayers[CommonMJConfig.Direction.Bottom].SetCardDown();
    }



    /** 换三张结束 表现 */
    OnEndChangeThree() 
    {
        this.m_tablePlayers[CommonMJConfig.Direction.Bottom].RemoveHandViewCards();
        this.m_tablePlayers[CommonMJConfig.Direction.Bottom].PickToHands();
        this.m_tablePlayers[CommonMJConfig.Direction.Bottom].ResetCards();
        this.SetAllCardDown();
    }

    /**  设置定缺牌显示状态 */
    OnSetDingQueCardState(state:boolean, isShowTip:boolean) 
    {
        this.m_tablePlayers[CommonMJConfig.Direction.Bottom].SetDingQueState(state, isShowTip);
    
    
    }
    
    /** 关闭大牌展示 */
    HideAllBigCardShow() 
    {
        for (let i = 0; i < this.m_tablePlayers.length; i++) 
        {
            this.m_tablePlayers[i].HideBigCardShow();
        }
    }

    /** 设置打牌胡牌提示 */
    OnSetOutHandHuCardsState(state : boolean) 
    {
        this.m_tablePlayers[CommonMJConfig.Direction.Bottom].OnSetOutHandHuCardsState(state);
    }
    

    
    OnAddHandCards() 
    {
    
    
    }


    OnHuByReConnect() 
    {
    
    
    
    }
    
    
    OnSetOutCardPointShow(direct: number) 
    {
        this.m_tablePlayers[direct].OnSetOutCardPointShow();
    }
    
    
    
    PlayEffFire(direct: number,isMingPai:boolean) 
    {
        this.m_tablePlayers[direct].PlayEffFire(isMingPai);
    }
    
    //明牌数据
    SetMingPaiCards(direct: number,mjs: number[],moMj:number) 
    {
        this.m_tablePlayers[direct].SetMingPaiCards(mjs,moMj);
    }
    
    
    HideAllDaduo() 
    {
        this.m_tablePlayers[CommonMJConfig.Direction.Bottom].HideAllDaduo();
    }


    SelfIsHaveThisCardTab() 
    {
    
    
    }
    
    
    GetDragMJCardCount() 
    {
    
    
    }
    
    //  换三张得到的牌
    OnChangeThreeCard( newCards:number[] ) 
    {
        //正常操作得到的三张牌 暂时没收到别人 换三张的通知 在别人换三张确认的时候删除掉三张
        // Log.e(" OnChangeThreeCard 换三张得到的牌 newCards : ",newCards);
        this.m_tablePlayers[CommonMJConfig.Direction.Top].ChangeCards([ 0, 0, 0]);
        this.m_tablePlayers[CommonMJConfig.Direction.Left].ChangeCards([ 0, 0, 0]);
        this.m_tablePlayers[CommonMJConfig.Direction.Right].ChangeCards([ 0, 0, 0]);
        this.m_tablePlayers[CommonMJConfig.Direction.Bottom].ChangeCards(newCards);



    
    }


    
    
    /**设置手牌位置 */
    OnSetPlayerHandsPosition()
    {
        for (const [key, val] of Object.entries(this.m_tablePlayers)) {
            this.m_tablePlayers[key].OnSetPlayerHandsPosition();
        }
    }





    /** 定缺后 重新排序 */
    SortCardByLacking(direct: number) 
    {
        this.m_tablePlayers[direct].SortCardByLacking();
    }


    /** 其他确认换三张 玩家删除掉三张牌 */
    DeleteChangeCards(direct: number) 
    {
        this.m_tablePlayers[direct].DeleteChangeCards()

    }


    /** 删除掉手牌 */
    RemoveHandCard(direct: number, removecard: number,cardView:MJCard) 
    {
        this.m_tablePlayers[direct].RemoveHandCard(removecard, cardView);

    }


    RemoveHandCards(direct: number, removecards: number[], opIndex: number,removeHandCount:number) 
    {
        this.m_tablePlayers[direct].RemoveHandCards(removecards, opIndex,removeHandCount)
    }



    /** 添加摸牌 是否先隐藏 isHide 第一次初始化牌的时候需要隐藏播放动画 */
    PickCard(direct: number, mjId: number,bMingPai:boolean) 
    {
        this. m_tablePlayers[direct].PickCard(mjId,bMingPai)
    }


    PlaySpainEff(direct: number,fileName:string,aniName:string)
    {
        this. m_tablePlayers[direct].PlaySpainEff(fileName,aniName)
    }



    /** 打出去的牌 */
    OnPickOutCardOut(direct: number, mjId: number) 
    {
        let outCard = this.m_tablePlayers[direct].AddOutCard(mjId,false);

    }


    // /** 打出去的牌 */
    // GetOutHongZhongCount(direct: number) 
    // {
    //     return  this.m_tablePlayers[direct].GetOutHongZhongCount();

    // }

    



    ShowPGHEffect(direct: number, type: number) 
    {
        this.m_tablePlayers[direct].ShowPGHEffect(type);
    }

    ShowEffectHu(direct:number, huPath:string ,gencount:Number,isShowBenJin:boolean)
    {
        this.m_tablePlayers[direct].ShowEffectHu(huPath ,gencount,isShowBenJin);

    }

    
    
    ShowEffectGangSelf()
    {
        this.m_tablePlayers[CommonMJConfig.Direction.Bottom].ShowEffectGang();

    }


    HandsToPick(direct: number) 
    {
        this.m_tablePlayers[direct].HandsToPick();
    }


    //直接刷新牌
    ReFalshCardView(direct: number) 
    {
        this.m_tablePlayers[direct].ReFalshCardView();
    }
    

    /** 删除出牌玩家的 出牌区域最后一张牌 */
    RemoveLastOutCard(direct: number) 
    {
        this.m_tablePlayers[direct].RemoveLastOutCard();
    }

    


    /** 添加一组碰牌 */
    AddAltCard(direct:number, card:number, ori:number, reconnect:boolean)
    {
        this.m_tablePlayers[direct].AddAltCard(card, ori, reconnect)
    }

    /** 飞  杠 变碰 */
    ChangCtrlToAlt(direct:number, card:number, ori:number,othertype:number)
    {
        this.m_tablePlayers[direct].ChangCtrlToAlt(card, ori,othertype)

    }

    /** 添加 点杠  */
    AddCtrlCard(direct: number, mjId: number, directionIndex: number,reconnect:boolean) 
    {
        this.m_tablePlayers[direct].AddCtrlCard(mjId, directionIndex, reconnect)

    }


    /** 添加 补杠 碰变杠  */
    ChangAltToCtrl(direct: number, mjId: number, directionIndex: number) 
    {
        this.m_tablePlayers[direct].ChangAltToCtrl(mjId, directionIndex);

    }
    

    /** 添加 补杠 碰变杠  */
    AddBlackCtrlCard(direct: number, mjId: number, reconnect: boolean) 
    {
        this.m_tablePlayers[direct].AddBlackCtrlCard(mjId, reconnect);

    }

    
    // SetActiveHuEffect(direct: number,isShow : boolean) 
    // {
    //     this. m_tablePlayers[direct].SetActiveHuEffect(isShow);
    
    // }


    HidePGHEffect(direct: number, _type: number) 
    {
        this. m_tablePlayers[direct].HidePGHEffect(_type);
    
    }



    OnS2CMahGamePoChan(direct :number,data: pb.S2CMahGamePoChan) 
    {
        this. m_tablePlayers[direct].OnS2CMahGamePoChan(data);
    }

    OnS2CMahAuto(direct: number, isTuoGuan: boolean) 
    {
        this. m_tablePlayers[direct].OnS2CMahAuto(isTuoGuan);
    }


    

    SetActiveTuoGuan(direct: number, isTuoGuan: boolean) 
    {
        this. m_tablePlayers[direct].SetActiveTuoGuan(isTuoGuan);
    }

    // SetPickOutCard(outCard )
    // {
    //     // t_OutCardPoint = outCard:Find("point/outpoint")
    //     // this.outCardPoint_obj


    // }


    /** 呼叫转移 */
    SeHuJiaoZhuanYiActive(direct: number, isShow: boolean) 
    {
        this. m_tablePlayers[direct].SeHuJiaoZhuanYiActive(isShow);
    }

    // SetActiveYPSX(direct: number) 
    // {
    //     this. m_tablePlayers[direct].SetActiveYPSX();
    // }


    ShowEffectHuTY(direct: number, hutype: number) 
    {
        this.m_tablePlayers[direct].ShowEffectHuTY(hutype);
    }



    PlaySpainLiuGuangEff()
    {
        this.m_tablePlayers[CommonMJConfig.Direction.Bottom].PlaySpainLiuGuangEff();
    }
    
    SetActiveLiuGuangHide()
    {
        this.m_tablePlayers[CommonMJConfig.Direction.Bottom].SetActiveLiuGuang(false);
    }

    


    SHowOutCardHuEff(direct: number) 
    {
        this.m_tablePlayers[direct].SHowOutCardHuEff()

    }


    /** 设置躺牌  现在全部用tangCom 和pick  */
    SetTanCards(direct: number, mjs: number[],isMingPai:boolean) 
    {
        this.m_tablePlayers[direct].SetTanCards(mjs,isMingPai);
    }

    //设置牌倒下去
    SetCardsSit(direct: number) 
    {
        let cardsKV = CommonMJConfig.PlayerCardsInfo[direct];
        let cardsArr =MJTool.TableKVCopyToList(cardsKV)
        
        this.m_tablePlayers[direct].SetCardsSit(cardsArr.length);
    }


    OnMjPropChangeCards(direct: number, data: pb.S2CMahPropResult) 
    {
    
        this.m_tablePlayers[direct].OnMjPropChangeCards(data);
    }




    SetInitPaiQiangDataStart(direct: number, count: number,starIndex:number,startCardIndex:number) 
    {
        this.m_tablePlayers[direct].SetInitPaiQiangDataStart(count,starIndex,startCardIndex);
    }

    SetInitPaiQiangDataEnd(direct: number, count: number,starIndex:number,startCardIndex:number) 
    {
        this.m_tablePlayers[direct].SetInitPaiQiangDataEnd(count,starIndex,startCardIndex);
    }
    

    SetActivePaiQiang(direct: number, isShow: boolean) 
    {
        this.m_tablePlayers[direct].SetActivePaiQiang(isShow);
    }

    SetActiveAllPaiQiang( isShow: boolean) 
    {
        this.m_tablePlayers[CommonMJConfig.Direction.Bottom].SetActivePaiQiang(isShow);
        this.m_tablePlayers[CommonMJConfig.Direction.Right].SetActivePaiQiang(isShow);
        this.m_tablePlayers[CommonMJConfig.Direction.Top].SetActivePaiQiang(isShow);
        this.m_tablePlayers[CommonMJConfig.Direction.Left].SetActivePaiQiang(isShow);
    }

    
    
    // InitPaiQiangDataStart(direct: number, index: number) 
    // {
    //     CommonMJConfig.allPaiqiangArr=[]
    //     this.m_tablePlayers[direct].InitPaiQiangDataStart(index);
    //     this.m_tablePlayers[(direct+3)%4].InitPaiQiangDataAll();
    //     this.m_tablePlayers[(direct+2)%4].InitPaiQiangDataAll();
    //     this.m_tablePlayers[(direct+1)%4].InitPaiQiangDataAll();
    //     this.m_tablePlayers[direct].InitPaiQiangDataEnd(index);

    //     // Log.e(" InitPaiQiangDataStart  CommonMJConfig.allPaiqiangArr   ",CommonMJConfig.allPaiqiangArr.length)

    // }


    GetSelfMoCardId()
    {
      let cardId=  this.m_tablePlayers[CommonMJConfig.Direction.Bottom].GetSelfMoCardId();
      MJDispose.SetSelfMoCard(cardId)
    }
    //是否是选中状态
    GetSelfMoCardIsUp()
    {
        let isUp= this.m_tablePlayers[CommonMJConfig.Direction.Bottom].GetSelfMoCardIsUp();
        MJDispose.SetSelfMoCardIsUp(isUp)
    }


    // //重置出牌标示
    // ResetOutCardPoint()
    // {
    //     if (this.outCardPoint_obj!=null) {
    //         this.outCardPoint_obj.visible = false;
    //     }
    // }




    ResetPlayer()
    {

        for (let index = 0; index < this.m_tablePlayers.length; index++) 
        {
            this.m_tablePlayers[index].RemoveAllCard()
            this.m_tablePlayers[index].ResetPlayer()
        }

    }






    StopCoroutineTweenAni() {
        for (let index = 0; index < this.m_tablePlayers.length; index++) 
        {
            this.m_tablePlayers[index].StopCoroutineTweenAni()
        }

    }




}
