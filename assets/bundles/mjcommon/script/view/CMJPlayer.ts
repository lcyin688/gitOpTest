import { Config } from "../../../../scripts/common/config/Config";
import FLevel2UISecond from "../../../../scripts/common/fairyui/FLevel2UISecond";
import { Utils } from "../../../../scripts/common/utils/Utils";
import { MahHPGOPerate, MahPoChanReason } from "../../../../scripts/def/GameEnums";
import { RoomManager } from "../../../gamecommon/script/manager/RoomManager";
import { Tool } from "../../../gamecommon/script/tools/Tool";
import { CommonMJConfig } from "../Config/CommonMJConfig";
import { MJEvent } from "../Event/MJEvent";
import { MJTool } from "../logic/MJTool";
import MJDispose from "../Manager/MJDispose";
import MJManager from "../Manager/MJManager";
import { MJC2SOperation } from "../net/MJC2SOperation";
import BlackGangCard from "./BlackGangCard";
import BuDianGangCard from "./BuDianGangCard";
import MJCard from "./MJCard";
import MJNormalCard from "./MJNormalCard";
import MJOutCardArea from "./MJOutCardArea";
import PaiQiangItem from "./PaiQiangItem";
import PengCard from "./PengCard";



export default class CMJPlayer extends FLevel2UISecond {





    protected self_Gc: fgui.GComponent = null;
    private effect_Gc: fgui.GComponent = null;

    //自摸平胡杠上花 杠上炮 一炮双响 展示
    private effectzimoHu_Gc: fgui.GComponent = null;


    private effSpine_load3d: fgui.GLoader3D = null;
    private spicon_load: fgui.GLoader = null;

    private bigCard_obj: fgui.GObject = null;

    private m_objOutCardEffect: fgui.GObject = null;
    

    

    private giveUp_obj: fgui.GObject = null;
    private tuoguan_obj: fgui.GObject = null;

    
    
    // private  hand_list: fgui.GList;
    private  pick_list: fgui.GList;



    private hjzy_obj: fgui.GObject = null;
    private chongzhiZhong_com: fgui.GComponent = null;
    private waitChongzhiZhong_com: fgui.GComponent = null;
    private  mjOutCardAreaSC : MJOutCardArea=null;
    private se_load: fgui.GLoader = null;
    private mjPaiQiangItemSC:PaiQiangItem;










    // 客户端坐标
    private m_eDirection:number;


    //其他玩家是否在换三张过程中删除过牌了
    private m_isHSZDele = false




    // m_tableOut :Array<MJNormalCard>= [];
    m_tableAlt:Array<PengCard>  = [];
    m_tableCtrl:Array<BuDianGangCard> = [];
    m_tableBlackCtrl :Array<BlackGangCard>  = [];
    // m_tableCards :Array<MJCard>= [];
    //摸得牌
    m_objPickCard:MJCard ;
    // m_tableFei = []

    //碰杠飞的牌 第一次参数牌值 第二个参数癞子牌 第三个参数每次 碰杠飞总数(插入的索引)
    team_tablePengGang:Array<number[]> =[];
    //碰杠 牌物体
    groupArr_obj:Array<fairygui.GObject> =[];



    

    //换来的牌给个标记
    m_blShowChangeTag;

    m_TimerArr:number[]=[];

    //计时器工具
    timer_1: number;
    //当前倒计时
    m_uCountDown:number =15;


    private liuguang_gload3d:fgui.GLoader3D=null;

    //group 左右两边碰杠牌需要缩放和位置移动不确定不会用 Glist 

    private  pengganggroup_com: fgui.GComponent;
    private m_pengGangPool: fgui.GObjectPool=null;
    private  tangMingPick_list: fgui.GList;
    //躺的牌和明的牌公用
    private  tangMing_com: fgui.GComponent;
    private m_tangMingPool: fgui.GObjectPool=null;
    //摊明的手上的牌 (左右两边的人 明牌和站立的牌都是他 )
    // private    m_tanMingCards :Array<MJNormalCard>= [];
    private    m_tanMingCards :Array<MJCard>= [];
    // private    m_tanMingCards = [];
    //摊明摸得牌
    private    m_tanMingPickCard:MJCard =null;
    // private  tang_list: fgui.GList;


    private hand_com: fgui.GComponent = null;
    // private m_GObjectPool: fgui.GObjectPool=null;

    public constructor(view: fgui.GComponent) {
        super(view);
        this.self_Gc=view;
        this.setInit();
    }




    public setInit() {
        this.m_pengGangPool =new fgui.GObjectPool()
        this.m_tangMingPool =new fgui.GObjectPool()
        // this.m_GObjectPool =new fgui.GObjectPool()

        this.hand_com =this.self_Gc.getChild("hand_com").asCom;

        if (this.self_Gc.getChild("liuguang")) {
            
            this.liuguang_gload3d=<fgui.GLoader3D>this.self_Gc.getChild("liuguang");
        }
        
        this.effect_Gc =this.self_Gc.getChild("effect").asCom;
        this.effSpine_load3d=<fgui.GLoader3D>this.effect_Gc.getChild("effSpine");
        this.spicon_load=this.effect_Gc.getChild("icon").asLoader;
        this.effectzimoHu_Gc=this.effect_Gc.getChild("zimohuEff").asCom;

        
        

        this.bigCard_obj=this.effect_Gc.getChild("outCardShow");


        this.giveUp_obj=this.self_Gc.getChild("giveUp").asCom;
        this.tuoguan_obj=this.self_Gc.getChild("tuoguan");
        this.hjzy_obj=this.self_Gc.getChild("hjzy");
        
        this.chongzhiZhong_com=this.self_Gc.getChild("chongzhiZhong").asCom;
        this.waitChongzhiZhong_com=this.self_Gc.getChild("waitChongzhiZhong").asCom;
        
        


        // this.hand_list =  this.self_Gc.getChild("hands").asList;
        // this.hand_list.removeChildrenToPool();


        this.pick_list =  this.self_Gc.getChild("pick").asList;
        this.pick_list.removeChildrenToPool();
        
        this.pengganggroup_com =  this.self_Gc.getChild("pengganggroup").asCom;

        

        this.tangMing_com =  this.self_Gc.getChild("tangcom").asCom;

        this.tangMingPick_list =  this.self_Gc.getChild("picktang").asList;
        
        

        this.mjOutCardAreaSC = new MJOutCardArea(this.self_Gc.getChild("outArea").asCom);
        this.mjOutCardAreaSC.setInit();
        


        

        this.mjPaiQiangItemSC = new PaiQiangItem(this.self_Gc.getChild("paiqiang").asCom);


        this.InitTable();


        this.effect_Gc.sortingOrder=this.effect_Gc.sortingOrder+50

        this.tuoguan_obj.onClick(this.OnClickTuoGuan, this);

    }

    OnClickTuoGuan() 
    {
        MJC2SOperation.ReMjTuoGuan(false,false,0);
    }


    /** 删除的时候 */
    protected onDestroy(): void
    {



    }



    /**設置玩家客户端坐标方位 */
    SetDirectioni(direction: number) {
        this.m_eDirection = direction;
        // if (this.hand_com == null) {
        //     let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, CommonMJConfig.OutHandPath[direction])
        //     Log.e ("MJOutCardArea  :  direction ",direction  );
        //     Log.e ("MJOutCardArea  :  url ",url  );
        //     this.hand_com =   this.m_GObjectPool.getObject(url).asCom
        //     this.root.addChild(this.hand_com)
        //     this.hand_com.sortingOrder =99

        // }

        this.mjOutCardAreaSC.SetDirectioni(direction,this.self_Gc,this.hand_com)
    }

    

    /**设置手牌位置 */
    OnSetPlayerHandsPosition()
    {
        //在Android和ios上设置不同的位置 iOS有个白线

    }

    /** 初始化数据 */
    InitTable()
    {

        // this.m_tableOut = [];
        this.m_tableAlt = [];
        this.m_tableCtrl = [];
        this.m_tableBlackCtrl = [];
        // this.m_tableCards = [];
        // this.m_tableFei = []


    }


    SetActiveHand(isShow:boolean )
    {
        if (this.hand_com!=null) {
            this.hand_com.visible=isShow
        }
    
    }


    //设置破产 SetActiveGoBreak
    SetActiveGoBreak(isShow:boolean )
    {
        this.giveUp_obj.visible =isShow;
    }

    //设置托管 SetActiveTuoGuan
    SetActiveTuoGuan(isShow:boolean )
    {
        this.tuoguan_obj.visible =isShow;
    }

    SetActiveBigCards(isShow:boolean )
    {
        this.bigCard_obj.visible =isShow;
    }


    SetActiveOutCardEffect(isShow:boolean )
    {
        if (this.m_objOutCardEffect!=null) {
            this.m_objOutCardEffect.visible =isShow;
        }
    }

    
    /** 设置换三张三张牌删除过了没 */
    Setm_isHSZDele(state:boolean)
    {
        this.m_isHSZDele= state;

    }

    /** 初始化卡牌 */
    InitHandCard (cards: {},moPai:number)
    {
        Log.e( "InitHandCard  cards : ",cards );
        Log.e( "InitHandCard    moPai : ",moPai );

        this.ClearTanMingCards();
        MJManager.SetRandomValue();
        let tempCards = Tool.Clone(cards);
        let tempCardsArr:Array<number> = Object.values(tempCards); 
        let len:number=tempCardsArr.length;
        //随机排序
        tempCardsArr.sort(function (A, B) {
            return (Math.random());
        });

        Log.e( "InitHandCard  tempCardsArr : ",tempCardsArr );

        this.m_blShowChangeTag =false;

        //自己对家的时候放到pick 上 左右放到 tangCom

        this.SetCardsSit(13)

        for (let i = 0; i < this.m_tanMingCards.length; i++) {
            this.m_tanMingCards[i].SetCard(tempCardsArr[i],this.RemoveHandCard);
            this.m_tanMingCards[i].SetActiveCard(false);
        }
            

        if (len == 14 ) 
        {
            this.PickCard(tempCardsArr[13] ,false  );
            this.m_objPickCard.SetActiveCard(false)
        }

        let timerItem=  window.setTimeout(()=>{
            this.InitHandCardFinal(tempCardsArr,len,moPai)
        } , 200);

        this.m_TimerArr.push(timerItem)



    }

    /** 刷新某一张牌的位置 */
    ShuaXinHandCardItemPos(cardObj:fgui.GObject,index:number,direction: number)
    {

        let tempX=0;
        let startX=0 //起始位置
        if (direction == CommonMJConfig.Direction.Right ) 
            {
                startX =0;
                tempX=startX + (index-1)*7
                // let sca = this.handcardsScaleArr1[index-1];
                // cardObj.setScale(sca,sca)

            }
        else if (direction == CommonMJConfig.Direction.Left ) 
        {

            startX =0;
            tempX=startX + (index-1)*7
        }
        cardObj.x = tempX;

    }


    InitHandCardFinal(tempCardsArr:Array<number>,len:number,moPai:number)
    {
        //四张四张的播动画
        // Log.e(" InitHandCardFinal  tempCardsArr 四张四张的翻牌动画 :  ", tempCardsArr)
        // Log.e(" InitHandCardFinal  this.m_dre:  ", this.m_eDirection,len)
        if (this.m_eDirection == CommonMJConfig.Direction.Bottom ) 
        {
            MJTool.PlaySound(CommonMJConfig.SoundEffPath.FaPaiFour,Config.BUNDLE_MJCOMMON);
        }
        let intervalTime = 300;
        for (let i = 0; i <= 3; i++) 
        {
            let timerItem =window.setTimeout(()=>{

                if (i<3) //前三次都只播放 4张翻牌动画
                {
                    for (let c = 12 - (i * 4);c>= 9 - (i * 4); c--) 
                    {
                        // Log.e( "InitHandCardFinal c :  ",c );

                        this.m_tanMingCards[c].SetActiveCard(true)

                        //如果是自己 播放第一次摸排动画
                        if (this.m_eDirection == CommonMJConfig.Direction.Bottom ) 
                        {
                            // this.m_tableCards[c].PlayCardAni(1)
                        }
                        dispatch(MJEvent.HIDEPAIQIANGCARDITEM,true)
                    }
                }
                else
                {
                    //最后一张
                    this.m_tanMingCards[0].SetActiveCard(true)
                    dispatch(MJEvent.HIDEPAIQIANGCARDITEM,true)
                    if (len==14) 
                    {
                        // if (this.m_eDirection == CommonMJConfig.Direction.Left || this.m_eDirection == CommonMJConfig.Direction.Right )  
                        // {
                        //     this.m_tanMingPickCard.SetActiveCard(true)
                        // }
                        // else
                        // {

                        // }
                        // Log.e(" InitHandCardFinal  14 張的時候 ")
                        dispatch(MJEvent.HIDEPAIQIANGCARDITEM,true)
                        this.m_objPickCard.SetActiveCard(true)
                    }
                    // MJTool.PlaySound(CommonMJConfig.SoundEffPath.MoPai, Config.BUNDLE_MJCOMMON);
                    //如果是自己 播放第一次摸排动画
                    // if (this.m_eDirection == CommonMJConfig.Direction.Bottom ) 
                    // {
                    //     // this.m_tableCards[c].PlayCardAni(1)
                    // }
                }


            } , intervalTime*i);
        
            this.m_TimerArr.push(timerItem)

        }

        //自己倒牌动画后排序
        if (this.m_eDirection == CommonMJConfig.Direction.Bottom ) 
        {
            let timerItemOne =window.setTimeout(()=>{
                MJManager.CardSortByLaiZiAndQueRevert(tempCardsArr);
                // Log.e("InitHandCardFinal tempCardsArr    ",tempCardsArr);
                if ( this.m_objPickCard != null ) //14 张的时候手牌不能变
                {

                    this.m_objPickCard.SetCard(moPai,this.RemoveHandCard);
                    this.m_objPickCard.Reset();
                    let tempCards = Tool.Clone(tempCardsArr);
                    for (let c2 = 0; c2 < tempCards.length; c2++) 
                    {
                        if (tempCards[c2]== moPai) {
                            tempCards.splice(c2,1)
                            break;
                        }
                    }
                    MJManager.CardSortByLaiZiAndQueRevert(tempCards);
                    // Log.e("InitHandCardFinal tempCards  ffffffff  ",tempCards);
                    for (let index = 0; index < 13 ; index++) 
                    {
                        this.m_tanMingCards[index].SetCard(tempCards[index],this.RemoveHandCard);
                        this.m_tanMingCards[index].Reset();
                    }  
                }
                else
                {
                    for (let index = 0; index < 13 ; index++) 
                    {
                        // Log.e("InitHandCardFinal 002   index  ",index);
                        // this.m_tableCards[index].SetCard(tempCardsArr[index],this.RemoveHandCard);
                        this.m_tanMingCards[index].SetCard(tempCardsArr[index],this.RemoveHandCard);
                        this.m_tanMingCards[index].Reset();
                    }  
                }

                

                this.ResetCards();
                if (!CommonMJConfig.MjRoomRule.dingQue && !CommonMJConfig.MjRoomRule.hsz )  
                {
                    MJDispose.SetState(CommonMJConfig.MineCardState.Play);
                }
                // for (let i = 0; i < this.m_tanMingCards.length; i++) {
                //     Log.e("InitHandCardFinal 002   tangcard  ",this.m_tanMingCards[i].GetCardId() );
                // }

            } , 3000);
            this.m_TimerArr.push(timerItemOne)
        }



    }




    //添加摸牌 是否先隐藏 isHide 第一次初始化牌的时候需要隐藏播放动画
     PickCard(card:number,bMingPai:boolean)
    {
        Log.e ("ffffffff !!! PickCard this.m_eDirection ",this.m_eDirection  ,bMingPai,card)
        if (this.m_eDirection == CommonMJConfig.Direction.Bottom ) //我自己的时候永远在手牌位置生成
        {
            //生成一张牌在手牌位置
            if (this.m_objPickCard!=null) 
            {
                this.m_objPickCard.Recycle();
            }
            this.pick_list.removeChildrenToPool();
            let item: fgui.GButton = this.pick_list.addItemFromPool().asButton;
            this.m_objPickCard = new MJCard(item);
            this.m_objPickCard.setInit(this.m_eDirection==0);
            this.m_objPickCard.SetCard(card,this.RemoveHandCard);
            this.m_objPickCard.SetActiveCard(true)
            this.m_objPickCard.Reset();    
            //明牌后一直冒火
            if (bMingPai)
            {
                this.m_objPickCard.PlayEff("mjsp_huoyan","animation",true);
            }        
        }
        else //其他玩家明牌前 在手牌位置生成 明牌后在明牌摸牌位置生成
        {
            if (bMingPai) 
            {
                
                Log.e (" 其他人 明牌 重连 摸的牌 00 ~~~~~   ")

                this.tangMingPick_list.removeChildrenToPool();
                let item: fgui.GButton = this.tangMingPick_list.addItemFromPool().asButton;
                this.m_tanMingPickCard = new MJCard(item);
                this.m_tanMingPickCard.setInit(false);
                this.m_tanMingPickCard.BaseSetCard(card);
                this.m_tanMingPickCard.SetActiveCard(true);
                this.m_tanMingPickCard.SetActiveFire(true);
                Log.e (" 其他人 明牌 重连 摸的牌 01 ~~~~~   ")
            }
            else
            {
                //生成一张牌在手牌位置
                this.pick_list.removeChildrenToPool();

                // Log.w ("this.pick_list x ",this.pick_list.x)
                // Log.w ("this.pick_list y ",this.pick_list.y)

                let item: fgui.GButton = this.pick_list.addItemFromPool().asButton;
                this.m_objPickCard = new MJCard(item);
                this.m_objPickCard.setInit(this.m_eDirection==0);
                this.m_objPickCard.SetCard(0,this.RemoveHandCard);
                this.m_objPickCard.SetActiveCard(true)
                this.m_objPickCard.Reset();               
            }



        }



        // Log.e("  添加一张摸牌  this.m_eDirection  :  ",this.m_eDirection )

    }




    /**删除手牌 cardView mjCardTable 打掉的牌 */
    RemoveHandCard(cardId:number,mjcard:MJCard)
    {
        // Log.w(" RemoveHandCard  cardId:   ",cardId);
        //暂时 直接刷新手牌
        this.ReFalshCardView();
return;
        // Log.e(" RemoveHandCard 回收 现在是直接删除手牌  ");
        // if (mjcard != null && cardId == mjcard.GetCardNumber() ) 
        // {
        //     if (this.m_objPickCard != null && this.m_objPickCard == mjcard) 
        //     {
        //         //回收 现在是直接删除手牌 
        //         // Log.e(" 回收 现在是直接删除手牌  ");
        //         // let item: fgui.GButton = this.hand_list.addItemFromPool().asButton;
        //         this.m_objPickCard.Recycle();
        //         this.m_objPickCard = null;
        //         this.pick_list.removeChildToPoolAt(0);
        //     }
        //     else
        //     {
        //         // let tempCardsArr:Array<any> = Object.values(this.m_tableCards); 
        //         for (let i = 0; i <this.m_tableCards.length; i++) 
        //         {
        //             if (this.m_tableCards[i] ==  mjcard  ) 
        //             {
        //                 this.hand_list.removeChildToPoolAt(i);

        //                 this.m_tableCards.splice(i,1);
        //                 if (this.m_eDirection == CommonMJConfig.Direction.Bottom)
        //                 {
        //                     if (this.m_objPickCard!=null) //摸得有牌的时候 插入到对应位置动画
        //                     {
                                
        //                     }
        //                     else
        //                     {
        //                         //是自己是庄第一次出牌 做牌的插入动画
        //                         if (this.m_tableCards.length == 13) 
        //                         {
                                
                                    

        //                         }
        //                         else//单纯做个右移的动画 和自己是庄第一次出牌一样
        //                         {


        //                         }



        //                     }



        //                 }
        //                 else
        //                 {
        //                     this.PickToHands();
                            
        //                 }


        //             }
        //         }



        //     }
            

        // } 
        // else 
        // {
        //     if (this.m_eDirection == CommonMJConfig.Direction.Bottom) //服务器帮自己打牌的时候 ")
        //     {
        //         if (this.m_objPickCard != null && this.m_objPickCard.GetCardNumber() == cardId) 
        //         {
        //             this.m_objPickCard.Recycle();
        //             this.m_objPickCard = null;
        //             this.pick_list.removeChildrenToPool();

        //         } 
        //         else //播放一个牌打出并且插入牌的动画 
        //         {
        //             Log.e(" RemoveHandCard 我自己 打出了 一张牌 cardId: ",cardId  );
        //             let finded = false;
        //             for (let i = 0; i < this.m_tableCards.length; i++) 
        //             {
        //                 if (this.m_tableCards[i].GetCardNumber() == cardId) 
        //                 {
        //                     this.m_tableCards[i].Recycle();
        //                     this.m_tableCards.splice(i ,1 );
        //                     this.hand_list.removeChildToPoolAt(i);
        //                     if (this.m_objPickCard != null) 
        //                     {
        //                         this.SetOutCardAni(i);
        //                     } 
        //                     else 
        //                     {
        //                         this.ResetCards()
        //                     }

        //                 }
                        


        //             }



        //         }
                
        //     } 
        //     else //其他玩家直接删除手牌
        //     {
        //         if (this.m_objPickCard !=null)
        //         {
        //             this.pick_list.removeChildrenToPool();
        //             this.m_objPickCard = null;
        //         }
        //         else
        //         {
        //             this.m_tableCards.splice(0 ,1 );
        //             this.hand_list.removeChildToPoolAt(0);
        //         }

        //     }

        // }





    }


    /**  删除多张手牌 是否是 opIndex 1 碰 2 杠  碰的时候移除2张牌 */
    RemoveHandCards(removecards: number[], opIndex: number,removeHandCount:number) 
    {

        //暂时 多张牌删除直接刷新
        this.ReFalshCardView();



    }



    /** 胡的时候显示 根的个数和是否有本金  自摸平胡 本金 的展示   现在只有个  自摸和平胡 */
    ShowEffectHu(huPath: string, gencount: Number, isShowBenJin: boolean) 
    {
        this.SetActiveEffectzimoHu_Gc(true)
        let bg_load=  this.effectzimoHu_Gc.getChild("bg")
        let bgurlStr = fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON,"mjgame_hu_di" )
        bg_load.icon=bgurlStr

        let icon_load=  this.effectzimoHu_Gc.getChild("icon")
        let urlStr = fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON,huPath )
        // Log.w(" PlayEffectzimoHu urlStr  ",urlStr  );
        icon_load.icon=urlStr
        let timerItem=  window.setTimeout(()=>
        {
            this.SetActiveEffectzimoHu_Gc(false)
        } , 800);
        this.m_TimerArr.push(timerItem)


    }

    
    /** 杠 */
    ShowEffectGang() 
    {
        this.SetActiveEffectzimoHu_Gc(true)
        let bg_load=  this.effectzimoHu_Gc.getChild("bg")
        let bgurlStr = fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON,"mjgame_gang_di" )
        bg_load.icon=bgurlStr

        let icon_load=  this.effectzimoHu_Gc.getChild("icon")
        let urlStr = fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON,"mjgame_gang_wenzi" )
        icon_load.icon=urlStr
        let timerItem=  window.setTimeout(()=>
        {
            this.SetActiveEffectzimoHu_Gc(false)
        } , 800);
        this.m_TimerArr.push(timerItem)



    }


    /** 摸完后打牌动画 --摸牌有的时候 indexOut 打出的牌的位置 */
    SetOutCardAni(indexOut:number)
    {
        //先直接刷新牌 之后在添加 插牌动画

        this.ReFalshSelfCard();



    }




    ReFalshCardView()
    {
        if (this.m_eDirection == CommonMJConfig.Direction.Bottom) 
        {
            this.ReFalshSelfCard();
        }
        else
        {
            Log.w("  ReFalshCardView 刷新其他玩家手牌  ")
            this.ReFalshOtherCard()
        }
    }




    //直接刷新到最新的牌
    ReFalshOtherCard()
    {
        // Log.e(" ReFalshOtherCard ")

        this.ClearTanMingCards();
        this.ClearTanMingCards();
        // Log.e("ReFalshOtherCard   this.m_eDirection  : ",this.m_eDirection);
        // Log.e("ReFalshOtherCard   CommonMJConfig.MJMemberInfo  : ",CommonMJConfig.MJMemberInfo);

        let serPos = RoomManager.ConvertServerPos(this.m_eDirection)

        let playerData =    CommonMJConfig.MJMemberInfo[serPos] as pb.IMahPlayerData
        // Log.e("ReFalshOtherCard   playerData  : ",playerData);
        let cardsKV = CommonMJConfig.PlayerCardsInfo[this.m_eDirection];
        let tempArr =MJTool.TableKVCopyToList(cardsKV)

        if (playerData.bMingPai) 
        {
            // Log.w("ReFalshOtherCard 00  明牌玩家")

            MJManager.CardSortByLaiZiAndQue(tempArr);
            let isCanChu= MJTool.GetIsCanChuPai(tempArr.length)
            // Log.w("ReFalshOtherCard   tempArr  : ",tempArr);
            if (isCanChu) 
            {
                this.SetMingPaiCards(tempArr,playerData.moPaiId)
            }
            else
            {
                this.SetMingPaiCards(tempArr,0)
            }
        }
        //没有明牌但是胡过了 其他玩家就把牌趴下
        else if (playerData.hu.length>0 )
        {
            this.SetCardsSit(tempArr.length)
        }
        else
        {
            this.SetCardsSit(tempArr.length)
        }
    }






    //直接刷新到最新的牌
    ReFalshSelfCard()
    {

        let serPos = RoomManager.ConvertServerPos(this.m_eDirection)
        let playerData =    CommonMJConfig.MJMemberInfo[serPos] as pb.IMahPlayerData

        let mineCards = CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom];
        this.ClearTanMingCards();
        let tempArr =MJTool.TableKVCopyToList(mineCards)
        MJManager.CardSortByLaiZiAndQueRevert(tempArr);
        // Log.e("ReFalshSelfCard 粗暴刷新  tempArr nice : ",tempArr);
        let isCanChu= MJTool.GetIsCanChuPai(tempArr.length)
        if (isCanChu)
        {
            // Log.e("ReFalshSelfCard 粗暴刷新  chupaijieduan  : ",CommonMJConfig.selfMoCard);
            MJDispose.SetState(CommonMJConfig.MineCardState.Play);
            //有手牌的时候 
            if (CommonMJConfig.selfMoCard!=0) 
            {
                let item: fgui.GButton = this.pick_list.addItemFromPool().asButton;
                let cardItem = new MJCard(item);
                cardItem.setInit(true);
                cardItem.SetCard(CommonMJConfig.selfMoCard,this.RemoveHandCard);
                cardItem.SetCardUp( false );
                if (playerData.bMingPai) {
                    cardItem.PlayEff("mjsp_huoyan","animation",true);
                }
                this.m_objPickCard=cardItem;

                for (let c = 0; c < tempArr.length; c++)
                {
                    if (tempArr[c]== CommonMJConfig.selfMoCard) 
                    {
                        tempArr.splice(c,1)
                        break;
                    }    
                }
            }
            else//碰后走最后一张牌拿出来
            {
                MJDispose.SetSelfMoCard(tempArr[0]);
                let item: fgui.GButton = this.pick_list.addItemFromPool().asButton;
                let cardItem = new MJCard(item);
                cardItem.setInit(true);
                cardItem.SetCard(CommonMJConfig.selfMoCard,this.RemoveHandCard);
                cardItem.SetCardUp( false );
                if (playerData.bMingPai) {
                    cardItem.PlayEff("mjsp_huoyan","animation",true);
                }
                this.m_objPickCard=cardItem;

                tempArr.splice(0,1)
            }
            
            for (let i = 0; i < tempArr.length; i++) 
            {
                let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_HALL, CommonMJConfig.SelfHandCardPath)
                let item: fgui.GButton = this.m_tangMingPool.getObject(url).asButton
                item.visible =true;
                this.tangMing_com.addChild(item)
                let cardItem = new MJCard(item);
                cardItem.setInit(true);
                this.m_tanMingCards.push(cardItem)

            }
            // Log.e("ReFalshSelfCard 粗暴刷新  tempArr ffffffff  : ",tempArr );

            for (let i = 0; i < this.m_tanMingCards.length; i++) 
            {
                this.m_tanMingCards[i].SetCard(tempArr[i],this.RemoveHandCard);
                this.m_tanMingCards[i].SetCardUp( false );

                if (playerData.bMingPai) {
                    this.m_tanMingCards[i].PlayEff("mjsp_huoyan","animation",true);
                }
            }

        }
        else
        {
            for (let i = 0; i < tempArr.length; i++) 
            {
                let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_HALL, CommonMJConfig.SelfHandCardPath)
                let item: fgui.GButton = this.m_tangMingPool.getObject(url).asButton
                item.visible =true;
                this.tangMing_com.addChild(item)
                let cardItem = new MJCard(item);
                cardItem.setInit(true);

                this.m_tanMingCards.push(cardItem)
            }
            for (let i = 0; i < this.m_tanMingCards.length; i++) 
            {
                this.m_tanMingCards[i].SetCard(tempArr[i],this.RemoveHandCard);
                this.m_tanMingCards[i].SetCardUp( false );
                if (playerData.bMingPai) {
                    this.m_tanMingCards[i].PlayEff("mjsp_huoyan","animation",true);
                }
            }
            
        }

        this.ShuaXinTanSortingOrder()
        this.SetTanCardsPosition(false);

        MJTool.HasQueCard(); 
        dispatch(MJEvent.SET_DINGQUE_CARD_STATE, CommonMJConfig.AlreadyQue, true);

        // Log.e(  " ReFalshSelfCard  this.m_tableCards[0]  ",this.m_tableCards[0] );
        this.ResetCards();
        // this.SetDingQueState(CommonMJConfig.AlreadyQue,false);
    }



    //设置所有牌放下去
    SetCardDown()
    {
        // for (const [key, val] of Object.entries(this.m_tanMingCards)) 
        // {
            

        // }
        for (let i = 0; i < this.m_tanMingCards.length; i++) {
            this.m_tanMingCards[i].StopCoroutineTweenAni();
            this.m_tanMingCards[i].SetCardUp(false);
        }
        if (this.m_objPickCard != null) 
        {
            this.m_objPickCard.StopCoroutineTweenAni();    
            this.m_objPickCard.SetCardUp(false);    
        }
    }


    /** 推荐的三张牌 */
    RecommendChangeThree(cards:number[])
    {
        if (this.m_objPickCard != null) 
        {
            this.m_tanMingCards.push(this.m_objPickCard)
        }
        // Log.e("RecommendChangeThree  cards :  "+cards  );
        // Log.e("RecommendChangeThree  this.m_tanMingCards.length :  ",this.m_tanMingCards.length );
        let cardsTemp =Tool.Clone(cards)
        for (let j = 0; j < this.m_tanMingCards.length; j++) {
            // Log.e("RecommendChangeThree  cards :  ",j,this.m_tanMingCards[j].GetCardNumber()  );
            for (let i = 0; i < cardsTemp.length; i++) 
            {
                if (this.m_tanMingCards[j].GetCardNumber() == cardsTemp[i]  )    
                {
                    this.m_tanMingCards[j].ChangeOnClick();
                    cardsTemp.splice(i,1)
                }
            }
        }

        if(this.m_objPickCard !=null )
        {
            this.m_tanMingCards.pop()
        }

    }

    /** 删除多张手牌牌  比如换三张 */
    RemoveHandViewCards()
    {
        // Log.e(" RemoveHandViewCards   ffffffff   CommonMJConfig.TabelThreeCards  ",CommonMJConfig.TabelThreeCards);
        for (let i = 0;  i < CommonMJConfig.TabelThreeCards.length; i++) 
        {
            if ( this.m_objPickCard !=null && this.m_objPickCard == CommonMJConfig.TabelThreeCards[i] ) 
            {   
                this.m_objPickCard.Recycle();
                this.m_objPickCard=null
                this.pick_list.removeChildrenToPool();
            } 
            else 
            {
                for (let index = 0; index < this.m_tanMingCards.length; index++) 
                {
                    let cardItem = this.m_tanMingCards[index]
                    if ( cardItem== CommonMJConfig.TabelThreeCards[i] ) 
                    {
                        cardItem.Recycle();

                        this.m_tanMingCards.splice( index,1 );

                        // this.m_tangMingPool.returnObject(cardItem.GetObj())
                        cardItem.GetObj().dispose();
                        // this.hand_list.removeChildToPoolAt(index);
                        // Log.e(" RemoveHandViewCards   index ",index);
                    }
                }
            }
        }

        if (this.m_eDirection == CommonMJConfig.Direction.Bottom) 
        {
            this.ResetCards();
        }

        this.SetTanCardsPosition(false);

    }

    /** 换来的三张 */
    ChangeCards( newCards:number[] )
    {

        if (this.m_eDirection == CommonMJConfig.Direction.Bottom) 
        {
            this.m_blShowChangeTag =true;

            this.ReFalshSelfCard();

        } 
        else 
        {
            //别的玩家庄的时候生成 14 其他生成 13 
            if (CommonMJConfig.ClientZhuangIndex== this.m_eDirection) 
            {
                //客户端坐标转换服务器坐标
                let serPos = RoomManager.ConvertServerPos(this.m_eDirection)
                let playerData =    CommonMJConfig.MJMemberInfo[serPos] as pb.IMahPlayerData
                this.PickCard(0,playerData.bMingPai)
            }

            // if ( this.m_eDirection== CommonMJConfig.Direction.Left || this.m_eDirection== CommonMJConfig.Direction.Right ) 
            // {
                for (let index = 0; index < this.m_tanMingCards.length; index++) 
                {
                    this.m_tanMingCards[index].SetActiveCard(true)
                }

            // }
            // else
            // {
            //     for (let i = this.m_tableCards.length; i < 13; i++) 
            //     {
            //         let item: fgui.GButton = this.hand_list.addItemFromPool().asButton;
            //         let cardItem = new MJCard(item);
            //         cardItem.setInit(false);
            //         this.m_tableCards.push(cardItem)
            //     }
            //     for (let i = 0; i < this.m_tableCards.length; i++) 
            //     {
            //         this.m_tableCards[i].SetCard(0,this.RemoveHandCard);
            //     }
            //     // this.ShuaXinHandCardsPos()

            // }




        }

        this.ResetCards();
    }





    /** 摸得牌加入手牌  */
    PickToHands()
    {

        if(this.m_objPickCard != null)
        {
            if (this.m_eDirection == CommonMJConfig.Direction.Bottom) 
            {
                let pickCardId =this.m_objPickCard.GetCardNumber()
                if (pickCardId != 0) 
                {
                    // 暂时先直接插入牌 后期优化

                    this.pick_list.removeChildrenToPool();
                    let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_HALL, CommonMJConfig.SelfHandCardPath)
                    let item: fgui.GButton = this.m_tangMingPool.getObject(url).asButton
                    item.visible =true;
                    this.tangMing_com.addChild(item)

                    let cardItem = new MJCard(item);
                    cardItem.setInit(true);
                    cardItem.SetCard(pickCardId,this.RemoveHandCard);

                    this.m_tanMingCards.push(cardItem)


                }
            } 
            else 
            {

                this.pick_list.removeChildrenToPool();
                this.tangMingPick_list.removeChildrenToPool();
                let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, CommonMJConfig.TangMingPath[this.m_eDirection])
                let item: fgui.GButton = this.m_tangMingPool.getObject(url).asButton

                let cardItem = new MJCard(item);
                cardItem.setInit(false);
                this.m_tanMingCards.push(cardItem)

            }
            
            this.m_objPickCard.Recycle();
            this.m_objPickCard = null;
        }


        this.ResetCards()




    }

    /** 设置定缺状态 state 是否已经打缺 */
    SetDingQueState(state:boolean, isShowTip:boolean)
    {

        for (let i = 0; i < this.m_tanMingCards.length; i++) 
        {
            this.m_tanMingCards[i].SetAlreadyClick(state,true);
        }
        if (this.m_objPickCard != null ) 
        {
            this.m_objPickCard.SetAlreadyClick(state,true);
        }
        // if ( !state && isShowTip) 
        // {
        //     dispatch(MJEvent.SET_MJTIPS, CommonMJConfig.TipsSprite.MustQue);
        // }
    }


    /** 定缺后的排序  如果自己是庄需要把摸得牌放进手牌 排序后再塞回摸牌 */
    SortCardByLacking()
    {
        if (this.m_eDirection == CommonMJConfig.Direction.Bottom) 
        {
            this.ReFalshSelfCard();
            // let mineCards = CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom];
            // // Log.e("SortCardByLacking 定缺后  mineCards  : ",mineCards);
            // let tempArr =MJTool.TableKVCopyToList(mineCards)
            // // Log.e("SortCardByLacking 定缺后  tempArr  : ",tempArr);
            // MJManager.CardSortByLaiZiAndQue(tempArr);
        
            // for (let i = 0; i < this.m_tableCards.length; i++) 
            // {
            //     this.m_tableCards[i].SetCard(tempArr[i],this.RemoveHandCard);
            //     this.m_tableCards[i].SetCardUp( false );
            // }

            // if (tempArr.length==14)
            // {
            //     this.pick_list.removeChildrenToPool();
            //     let item: fgui.GButton = this.pick_list.addItemFromPool().asButton;
            //     let cardItem = new MJCard(item);
            //     cardItem.setInit(true);
            //     cardItem.SetCard(tempArr[13],this.RemoveHandCard);
            //     cardItem.SetCardUp( false );
            //     this.m_objPickCard=cardItem;
            // }
            // this.ResetCards();
            // this.SetDingQueState(CommonMJConfig.AlreadyQue,false);
        }
    }

    /** 其他确认换三张 玩家删除掉三张牌 */
    DeleteChangeCards()
    {
        // Log.e(" 其他玩家 玩家删除掉三张牌  index :  " , this.m_eDirection  )

        if (!this.m_isHSZDele) 
        {
            // Log.e(" 其他玩家 玩家删除掉三张牌  001 :  "   )
            this.m_isHSZDele =true;

            if (this.m_eDirection == CommonMJConfig.Direction.Left || this.m_eDirection == CommonMJConfig.Direction.Right
                || this.m_eDirection == CommonMJConfig.Direction.Top) 
            {
                if (this.m_objPickCard != null ) 
                {
                    this.pick_list.removeChildrenToPool();
                    this.m_objPickCard=null;
                    if (this.m_eDirection == CommonMJConfig.Direction.Right) {
                        this.m_tanMingCards[this.m_tanMingCards.length-1].SetActiveCard(false)
                        this.m_tanMingCards[this.m_tanMingCards.length-2].SetActiveCard(false)
                    }
                    else
                    {
                        this.m_tanMingCards[0].SetActiveCard(false)
                        this.m_tanMingCards[1].SetActiveCard(false)
                    }
                } 
                else
                {
                    if (this.m_eDirection == CommonMJConfig.Direction.Right) {
                    
                        this.m_tanMingCards[this.m_tanMingCards.length-1].SetActiveCard(false)
                        this.m_tanMingCards[this.m_tanMingCards.length-2].SetActiveCard(false)
                        this.m_tanMingCards[this.m_tanMingCards.length-3].SetActiveCard(false)
                    
                    }
                    else
                    {
                        this.m_tanMingCards[0].SetActiveCard(false)
                        this.m_tanMingCards[1].SetActiveCard(false)
                        this.m_tanMingCards[2].SetActiveCard(false)

                    }

                }
                
            }
            // else
            // {
            //     for (let i = 0; i < 3; i++) 
            //     {
            //         if (this.m_objPickCard != null ) 
            //         {
            //             this.pick_list.removeChildrenToPool();
            //             this.m_objPickCard=null;
            //         } 
            //         else 
            //         {
            //             // Log.e(" 其他玩家 玩家删除掉牌"   )
            //             this.hand_list.removeChildToPoolAt(1);
            //             this.m_tableCards.splice(0,1);
            //         }
            //     }
            //     this.ShuaXinHandCardsPos()
            // }

            
        }
    }

    /** 添加一张打出去的牌 并返回牌 */
    AddOutCard(mjId: number,isReconnection:boolean)
    {
        //在出牌区域 生成一张牌 并大牌展示一下

       let mjOutCard = this.mjOutCardAreaSC.AddOutCard(mjId,this.m_eDirection,isReconnection);





    }

    /** 获取打牌区域的最后一张牌 碰杠胡的时候要删掉桌子上的牌 */
    GetLastOutCard()
    {
        return  this.mjOutCardAreaSC.GetLastOutCard()
    }


    // GetOutHongZhongCount()
    // {
    //     return  this.mjOutCardAreaSC.GetOutHongZhongCount()
    // }
    


    /** 删除出牌 */
    RemoveLastOutCard()
    {
        // Log.e(" 删除出牌  OutCardArea  玩家 this.dire :  ",this.m_eDirection )
        this.mjOutCardAreaSC.RemoveLastOutCard()
    }


    /** 手牌加入摸的牌 */
    HandsToPick() 
    {
        if (this.m_tanMingCards.length >1 ) 
        {
            let card = this.m_tanMingCards[1].GetCardNumber();
            this.RemoveHandCard(card, this.m_tanMingCards[1])
            let serPos = RoomManager.ConvertServerPos(this.m_eDirection)
            let playerData =    CommonMJConfig.MJMemberInfo[serPos] as pb.IMahPlayerData
            this.PickCard(card,playerData.bMingPai);
        }


    }


    GetGridAltIndex()
    {
        // + this.m_tableFei.length
        return this.m_tableAlt.length + this.m_tableCtrl.length + this.m_tableBlackCtrl.length 

    }


    /** 添加碰牌 */
    AddAltCard(card: number, ori: number, reconnect: boolean) 
    {
        let indexPos = this.GetGridAltIndex();
        // Log.e( "AddAltCard   card ",card  )
        // Log.e( "AddAltCard   ori ",ori  )
        let tab ={cardOne:card,cardTwo:0,index:indexPos, ori :ori,type:MahHPGOPerate.HPG_Peng }
        CommonMJConfig.PlayerPengGang[this.m_eDirection].push(tab)

        this.team_tablePengGang.push([card,0,indexPos]);
        let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, CommonMJConfig.AltPath[this.m_eDirection])



        // Log.e ("MJOutCardArea  :  url ",url  );
        let obj =   this.m_pengGangPool.getObject(url)
        this.pengganggroup_com.addChild(obj)

        obj.visible=true;
        let cardItem = new PengCard(obj.asButton);
        cardItem.SetCard(card,ori);
        if (this.m_eDirection == CommonMJConfig.Direction.Left ) 
        {
            cardItem.mjNormalCardSC1.SetCardBgIcon("mj_zuo_gang2")
            cardItem.mjNormalCardSC2.SetCardBgIcon("mj_zuo_gang1")
            cardItem.mjNormalCardSC3.SetCardBgIcon("mj_zuo_gang0")
            cardItem.mjNormalCardSC1.SetCardBgIconScale(1,1)
            cardItem.mjNormalCardSC2.SetCardBgIconScale(1,1)
            cardItem.mjNormalCardSC3.SetCardBgIconScale(1,1)
        }
        else if(this.m_eDirection == CommonMJConfig.Direction.Right ) 
        {

            cardItem.mjNormalCardSC1.SetCardBgIcon("mj_zuo_gang0")
            cardItem.mjNormalCardSC2.SetCardBgIcon("mj_zuo_gang1")
            cardItem.mjNormalCardSC3.SetCardBgIcon("mj_zuo_gang2")
            cardItem.mjNormalCardSC1.SetCardBgIconScale(-1,1)
            cardItem.mjNormalCardSC2.SetCardBgIconScale(-1,1)
            cardItem.mjNormalCardSC3.SetCardBgIconScale(-1,1)
        }


        this.m_tableAlt.push(cardItem)
        this.groupArr_obj.push(obj)

        this.SetGroupChildPosAndScale(obj,indexPos)



    }


    /** 飞  杠变碰 */
    ChangCtrlToAlt(card: number, ori: number, othertype: number) 
    {
        //删除杠
        for (let i = 0; i < this.m_tableCtrl.length; i++) 
        {
            if (this.m_tableCtrl[i].m_uCardID == card   ) 
            {
                // Log.e("ChangAltToCtrl  找到了这张需要变碰牌 card ",card)

                this.m_tableCtrl[i].Recycle()
                this.m_tableCtrl.splice(i,1)
            }
        }
        //获取到碰变杠的牌的索引
        let index = this.GetGridAltIndexByCard(card);


        // Log.e("ChangCtrlToAlt  index :  ",index)
        this.RemoveGridAltIndex(card);
        this.AddAltCard(card,index,false)
        this.groupArr_obj.splice(index,1)
        //数据变化
        for (let index = 0; index < CommonMJConfig.PlayerPengGang[this.m_eDirection].length; index++) 
        {
            let itemData = CommonMJConfig.PlayerPengGang[this.m_eDirection]
            if (itemData.cardOne==card   ) 
            {
                itemData.type=MahHPGOPerate.HPG_Peng
            }
        }




    }



    
    /** 添加杠牌 点杠 补杠是一个 (重连的时候的补杠) */
    AddCtrlCard(card: number, ori: number, reconnect: boolean) 
    {
        let indexPos = this.GetGridAltIndex();
        // Log.e( "AddCtrlCard   card ",card  )
        // Log.e( "AddCtrlCard   ori ",ori  )
        let tab ={cardOne:card,cardTwo:0,index:indexPos, ori :ori,type:MahHPGOPerate.HPG_BuGang }
        CommonMJConfig.PlayerPengGang[this.m_eDirection].push(tab)
        this.team_tablePengGang.push([card,0,indexPos]);
        let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, CommonMJConfig.BuDianGangPath[this.m_eDirection])

        let obj =   this.m_pengGangPool.getObject(url)
        this.pengganggroup_com.addChild(obj)
        obj.visible=true;

        let cardItem = new BuDianGangCard(obj.asButton);
        cardItem.setInit();
        cardItem.SetCard(card,ori);

        if (this.m_eDirection == CommonMJConfig.Direction.Left ) 
        {
            cardItem.mjNormalCardSC1.SetCardBgIcon("mj_zuo_gang2")
            cardItem.mjNormalCardSC2.SetCardBgIcon("mj_zuo_gang1")
            cardItem.mjNormalCardSC3.SetCardBgIcon("mj_zuo_gang0")
            cardItem.mjNormalCardSC4.SetCardBgIcon("mj_zuo_gang3")
            cardItem.mjNormalCardSC1.SetCardBgIconScale(1,1)
            cardItem.mjNormalCardSC2.SetCardBgIconScale(1,1)
            cardItem.mjNormalCardSC3.SetCardBgIconScale(1,1)
            cardItem.mjNormalCardSC4.SetCardBgIconScale(1,1)
        }
        else if(this.m_eDirection == CommonMJConfig.Direction.Right ) 
        {

            cardItem.mjNormalCardSC1.SetCardBgIcon("mj_zuo_gang0")
            cardItem.mjNormalCardSC2.SetCardBgIcon("mj_zuo_gang1")
            cardItem.mjNormalCardSC3.SetCardBgIcon("mj_zuo_gang2")
            cardItem.mjNormalCardSC4.SetCardBgIcon("mj_zuo_gang3")
            cardItem.mjNormalCardSC1.SetCardBgIconScale(-1,1)
            cardItem.mjNormalCardSC2.SetCardBgIconScale(-1,1)
            cardItem.mjNormalCardSC3.SetCardBgIconScale(-1,1)
            cardItem.mjNormalCardSC4.SetCardBgIconScale(-1,1)
        }



        this.m_tableCtrl.push(cardItem)
        this.groupArr_obj.push(obj)

        this.SetGroupChildPosAndScale(obj,indexPos)

    }

    
    /** 添加暗杠 */
    AddBlackCtrlCard(card: number, reconnect: boolean) 
    {
        let indexPos = this.GetGridAltIndex();
        let tab ={cardOne:card,cardTwo:0,index:indexPos, ori :0,type:MahHPGOPerate.HPG_AnGang }
        CommonMJConfig.PlayerPengGang[this.m_eDirection].push(tab)
        this.team_tablePengGang.push([card,0,indexPos]);
        let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, CommonMJConfig.BlackCtrlsPath[this.m_eDirection])
        let obj =   this.m_pengGangPool.getObject(url)
        this.pengganggroup_com.addChild(obj)
        obj.visible=true;

        let cardItem = new BlackGangCard(obj.asButton);
        cardItem.setInit();
        cardItem.SetCard(card);

        if (this.m_eDirection == CommonMJConfig.Direction.Left ) 
        {
            cardItem.mjNormalCardSC.SetCardBgIcon("mj_zuo_gang3")
            cardItem.mjNormalCardSC.SetCardBgIconScale(1,1)
        }
        else if(this.m_eDirection == CommonMJConfig.Direction.Right ) 
        {

            cardItem.mjNormalCardSC.SetCardBgIcon("mj_zuo_gang3")
            cardItem.mjNormalCardSC.SetCardBgIconScale(-1,1)
        }


        this.m_tableBlackCtrl.push(cardItem)
        this.groupArr_obj.push(obj)

        this.SetGroupChildPosAndScale(obj,indexPos)

    }
    
    



    //左右两边的 scale 也不一样  
    SetGroupChildPosAndScale(childObj: fairygui.GObject, index: number) 
    {
        // Log.w(" SetGlistGroupChildrensPos ffffffff SetGroupChildPos00000  index ",index)
        let configTemp = CommonMJConfig.PengGangCardsPosition[this.m_eDirection][index+1]
        childObj.scaleX = configTemp.scaleX
        childObj.scaleY = configTemp.scaleY
        childObj.x = configTemp.x
        childObj.y = configTemp.y

    
    }


    /** 删除碰 变成 补杠 (存在的位置不能变化) */
    ChangAltToCtrl(card: number, othertype: number) 
    {

        // Log.e(" ChangAltToCtrl  this.m_tableAlt   ",this.m_tableAlt)
        //删除碰
        for (let i = 0; i < this.m_tableAlt.length; i++) 
        {
            if (this.m_tableAlt[i].m_uCardID == card   ) 
            {
                // Log.e("ChangAltToCtrl  找到了这张碰牌  i ",i)
                this.m_tableAlt[i].Recycle()
                this.m_tableAlt.splice(i,1)
                break;
            }
        }
        //获取到碰变杠的牌的索引
        let index = this.GetGridAltIndexByCard(card);

        // Log.w("ChangAltToCtrl  index :  ",index)
        this.RemoveGridAltIndex(card);
        this.AddCtrlCardAt(card,index,othertype)
        this.groupArr_obj.splice(index,1)
        //数据变化
        for (let index = 0; index < CommonMJConfig.PlayerPengGang[this.m_eDirection].length; index++) 
        {
            let itemData = CommonMJConfig.PlayerPengGang[this.m_eDirection]
            if (itemData.cardOne==card   ) 
            {
                itemData.type=MahHPGOPerate.HPG_BuGang
            }
        }

        // Log.w("ChangAltToCtrl  CommonMJConfig.PlayerPengGang[this.m_eDirection] :  ",CommonMJConfig.PlayerPengGang[this.m_eDirection] )
    }




    /** 在指定位置添加 补杠  */
    AddCtrlCardAt(card: number, index: number, othertype: number) 
    {

        this.team_tablePengGang.splice(index,0, [card,0,index]);
        // Log.e("AddCtrlCardAt this.team_tablePengGang  ",this.team_tablePengGang)
        // let url 
        // if (this.m_eDirection==CommonMJConfig.Direction.Bottom) 
        // {
        //     url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, CommonMJConfig.BuDianGangPath[this.m_eDirection])
        // } 
        // else 
        // {
        //     url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, CommonMJConfig.BuDianGangPath[this.m_eDirection])
        // }
        let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, CommonMJConfig.BuDianGangPath[this.m_eDirection])
        let obj =   this.m_pengGangPool.getObject(url)
        this.pengganggroup_com.addChild(obj)
        obj.visible=true;
        let cardItem = new BuDianGangCard(obj.asButton);

        cardItem.SetCard(card,CommonMJConfig.CtrlOri.Bu);

        this.m_tableCtrl.push(cardItem)

        this.groupArr_obj.push(obj)
        this.SetGroupChildPosAndScale(obj,index)

    }



    





    /** 获取到当前牌在碰杠去的索引 */
    GetGridAltIndexByCard(card):number
    {
        for (let i = 0; i < this.team_tablePengGang.length; i++) 
        {
            if(card == this.team_tablePengGang[i][0] )
            {
                //或者返回 this.team_tablePengGang[i][2]
                return this.team_tablePengGang[i][2]
            }
        }
        return 0
    }

    /** 删除掉当前牌在碰杠区数据 */
    RemoveGridAltIndex(card)
    {
        for (let i = 0; i < this.team_tablePengGang.length; i++) 
        {
            if(card == this.team_tablePengGang[i][0] )
            {
                this.team_tablePengGang.splice(i,1);
                break;
            }
        }
    }
    




    /** 重置所有卡牌 位置 */
    ResetCards()
    {
        // Log.e("  ResetCards 重置所有卡牌 位置 ");

        // for (const [key, val] of Object.entries(this.m_tableCards)) 
        // {
        //     // Log.e("  ResetCards key  :    ",key);
        //     this.m_tableCards[key].Reset();
        // }
        
        for (let i = 0; i < this.m_tanMingCards.length; i++) 
        {
            this.m_tanMingCards[i].Reset()
        }

        if (this.m_objPickCard != null) 
        {
            this.m_objPickCard.Reset();    
        }
    }



    /** 关掉大牌展示 */
    HideBigCardShow()
    {
        this.SetActiveBigCards(false)

    }


    /**  设置出牌时胡牌提示 */
    OnSetOutHandHuCardsState(state: boolean) 
    {
        if (state) 
        {
            //首先 这张牌打了能胡 然后去计算打完的牌胡几张 几番 去互相比较之后 设置提示的普通 大 多  (大多)
            //-- 出掉牌之后 清空掉所有的出牌提示
            //找出胡的最多的牌数 和 最大的番数
            let maxCount =0
            let maxfan =0
            for (let index = 0; index < CommonMJConfig.CurrenMahKeHuDataArr.length; index++) 
            {
                let cardCount =0
                for (let c = 0;  c < CommonMJConfig.CurrenMahKeHuDataArr[index].data.length; c++) 
                {
                    let fannum =Number(CommonMJConfig.CurrenMahKeHuDataArr[index].data[c].mul)
                    if (fannum >maxfan  ) //打出这张牌能胡
                    {
                        maxfan =fannum
                    }
                    cardCount =cardCount+ CommonMJConfig.AllCards[CommonMJConfig.CurrenMahKeHuDataArr[index].data[c].mjid]
                }
                if (cardCount > maxfan ) 
                {
                    maxCount =cardCount
                }
            }

            for (let i = 0; i < this.m_tanMingCards.length; i++) 
            {
                let outCardId = this.m_tanMingCards[i].GetCardNumber();

                let itemData: pb.IMahKeHuData = MJDispose.GetHuTipState(outCardId)

                if (itemData!= null  ) 
                {
                    let cardCount =0
                    let maxfanItem =0
                    for (let c = 0;  c < itemData.data.length; c++) 
                    {
                        let fannum =Number(itemData.data[c].mul)
                        if (fannum >maxfanItem  ) //打出这张牌能胡
                        {
                            maxfanItem =fannum
                        }
                        cardCount =cardCount+ CommonMJConfig.AllCards[itemData.data[c].mjid]
                    }
                    // Log.w("  dachu后能胡 hand  outCardId : ",  outCardId)
                    this.m_tanMingCards[i].SetHuTipState(true,maxfan== maxfanItem,maxCount== cardCount );
                }
                
            }

            if (this.m_objPickCard!=null) 
            {
                let outCardId = this.m_objPickCard.GetCardNumber();

                let itemData: pb.IMahKeHuData = MJDispose.GetHuTipState(outCardId)

                if (itemData!= null  ) 
                {
                    let cardCount =0
                    let maxfanItem =0
                    for (let c = 0;  c < itemData.data.length; c++) 
                    {
                        let fannum =Number(itemData.data[c].mul)
                        if (fannum >maxfanItem  ) //打出这张牌能胡
                        {
                            maxfanItem =fannum
                        }
                        cardCount =cardCount+ CommonMJConfig.AllCards[itemData.data[c].mjid]
                    }
                    // Log.w("  dachu后能胡 pick  outCardId : ",  outCardId)
                    this.m_objPickCard.SetHuTipState(true,maxfan== maxfanItem,maxCount== cardCount );
                }
            }
        }
        else
        {
            for (let index = 0; index < this.m_tanMingCards.length; index++) 
            {
                this.m_tanMingCards[index].SetHuTipState(false,false,false);
            }
            if(this.m_objPickCard != null)
            {
                this.m_objPickCard.SetHuTipState(false,false,false);
            }

        }


    }
    

    ShowPGHEffect(_type: number) 
    {
        if (_type == CommonMJConfig.HandleTag.Peng)
        {

        } 
        else if (_type == CommonMJConfig.HandleTag.Gang)
        {

        } 

    }


    

    HidePGHEffect(_type: number) 
    {
        if (_type == CommonMJConfig.HandleTag.Peng)
        {

        } 
        else if (_type == CommonMJConfig.HandleTag.Gang)
        {

        } 
    }


    /** 设置呼叫转移  */
    SeHuJiaoZhuanYiActive(isShow: boolean) 
    {
        

    }

    // /** 设置一炮双响 的显示 */
    // SetActiveYPSX() 
    // {




    // }

    SetActivespicon_load(isShow)
    {
        this.spicon_load.visible =isShow;
    }


    /** 展示胡牌通用特效 */
    ShowEffectHuTY(hutype: number) 
    {
        // Log.w("  ShowEffectHuTY    hutype  ",hutype);
        let hutypeConfig =CommonMJConfig.HuTypeEffConfig[hutype]
        // let  effPath = CommonMJConfig.huPath[this.m_eDirection]
        // MJTool.PlaySound(hutypeConfig.sound,Config.BUNDLE_MJCOMMON);

        
        //加载出特效 并设置图片播放 时间到了之后 删除掉特效

        if (this.m_eDirection == CommonMJConfig.Direction.Bottom ) 
        {
            // Log.e("  ShowEffectHuTY    自己胡的时候  ");
            this.PlaySpainEff("mjsp_ty_ty2",hutypeConfig.aniName)
            MJTool.PlaySound(["eff_lv_1"],Config.BUNDLE_MJCOMMON);
        } 
        else 
        {
            this.PlaySpainEff("mjsp_ty_ty1","ty1")
            MJTool.PlaySound(["eff_lv_2"],Config.BUNDLE_MJCOMMON);
        }

        this.SetActivespicon_load(true)
        // Log.e("  ShowEffectHuTY    texture  ",hutypeConfig.texture  );
        let urlStr = fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON,hutypeConfig.texture )
        // Log.e(" ShowEffectHuTY SetCard 01  ",urlStr  );
        this.spicon_load.icon =urlStr;   
        let timerItem=  window.setTimeout(()=>
        {
            this.SetActivespicon_load(false)
        } , 500);
        this.m_TimerArr.push(timerItem)



    }

    
    SetActiveEffectzimoHu_Gc(isShow)
    {
        this.effectzimoHu_Gc.visible =isShow;
    }







    SetCardCannotClick() 
    {
        for (let index = 0; index < this.m_tanMingCards.length; index++) 
        {
            this.m_tanMingCards[index].SetCardCannotClick();
        }
        if (this.m_objPickCard!=null) 
        {
            this.m_objPickCard.SetCardCannotClick();
        }

    }

    GetPickCard() :MJCard
    {
        if (this.m_objPickCard!=null ) 
        {
            return this.m_objPickCard;    
        }
        else
        {
            return null;
        }

    }


    SetPickCardNil()
    {
        Log.w("SetPickCardNil  ~~~ ");
        if (this.m_objPickCard!=null) 
        {
            this.m_objPickCard.Recycle();
        }
        this.m_objPickCard=null;
        this.pick_list.removeChildrenToPool();


        if(this.m_tanMingPickCard!=null)
        {
            this.m_tanMingPickCard=null
        }
        this.tangMingPick_list.removeChildrenToPool();
        

    }

    /** 打出点炮玩家 播放胡牌特效 */
    SHowOutCardHuEff() 
    {
        this.mjOutCardAreaSC.SHowOutCardHuEff(this.m_eDirection);
    }

    /** 生成摊牌 把之前手上的牌删除 */
    SetTanCards(mjs: number[],isMingPai:boolean) 
    {
        let serPos = RoomManager.ConvertServerPos(this.m_eDirection)
        let playerData =    CommonMJConfig.MJMemberInfo[serPos] as pb.IMahPlayerData

        this.ClearTanMingCards();
        this.ClearTanMingCards();
        let cardsArr = Tool.Clone(mjs);
        MJManager.CardSortByLaiZiAndQueRevert(cardsArr);
        Log.w(   "SetTanCards   cardsArr  ",cardsArr);



        for (let index = 0; index < cardsArr.length; index++) 
        {
            let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, CommonMJConfig.TangMingPath[this.m_eDirection])
            let item: fgui.GButton = this.m_tangMingPool.getObject(url).asButton
            item.visible =true;
            this.tangMing_com.addChild(item)
            let cardItem = new MJCard(item);
            cardItem.setInit(false);
            // Log.e(   "SetTanCards   cardsArr[index]  ",cardsArr[index]);
            if (this.m_eDirection == CommonMJConfig.Direction.Right || this.m_eDirection == CommonMJConfig.Direction.Top ) 
            {
                cardItem.BaseSetCard(cardsArr[cardsArr.length-index-1]);
            }
            else
            {
                cardItem.BaseSetCard(cardsArr[index]);
            }
            cardItem.SetActiveFire(playerData.bMingPai);
            this.m_tanMingCards.push(cardItem)
        }
        this.ShuaXinTanSortingOrder()

        this.SetTanCardsSprite(isMingPai);

        this.SetTanCardsPosition(isMingPai);
    }

    /** 刷新牌的底图精灵 */
    SetTanCardsSprite(isMingPai:boolean)
    {
        // Log.w ("SetTanCardsSprite isMingPai  ",isMingPai)

        let serPos = RoomManager.ConvertServerPos(this.m_eDirection)
        let playerData =    CommonMJConfig.MJMemberInfo[serPos] as pb.IMahPlayerData

        if (this.m_eDirection == CommonMJConfig.Direction.Top) 
        {
            for (let i = 0; i < this.m_tanMingCards.length; i++) 
            {
                
                let url = "mj_shang_dao_bei"+i
                if (isMingPai) 
                {
                    url =  "mj_shang_dao"+i
                    if (i>12) {
                        url = "mj_shang_dao12" 
                    }
                    this.m_tanMingCards[i].SetTangCardInit(this.m_eDirection,i)    
                }
                else if(playerData.hu.length>0) //不是明牌 并且胡过了扣牌 结算的时候传的是明牌
                {
                    url =  "mj_shang_dao_bei"+i
                    if (i>12) {
                        url = "mj_shang_dao_bei12" 
                    } 
                }
                else
                {
                    url =  "handstand_top"+(i+1)
                }

                this.m_tanMingCards[i].SetCardBgIcon(url)   
            }
        }
        else if (this.m_eDirection == CommonMJConfig.Direction.Left) 
        {

            for (let i = 0; i < this.m_tanMingCards.length; i++) 
            {
                
                let url = "mj_zuo_dao_bei"+i
                if (isMingPai) 
                {
                    url =  "mj_zuo_dao"+i
                    if (i>12) {
                        url = "mj_zuo_dao12" 
                    }
                    this.m_tanMingCards[i].SetCardBgIconScale(1,1)
                    this.m_tanMingCards[i].SetTangCardInit(this.m_eDirection,i)     
                }
                else if(playerData.hu.length>0) //不是明牌 并且胡过了扣牌 结算的时候传的是明牌
                {
                    url =  "mj_zuo_dao_bei"+i
                    if (i>12) {
                        url = "mj_zuo_dao_bei12" 
                    }
                    this.m_tanMingCards[i].SetCardBgIconScale(1,1)
                }
                else
                {
                    url =  "mj_zuo_li"+i
                    if (i>12) {
                        url = "mj_zuo_li12" 
                    }
                    this.m_tanMingCards[i].SetCardBgIconScale(-1,1)
                }

                this.m_tanMingCards[i].SetCardBgIcon(url)

                   
            }
        }
        else if (this.m_eDirection == CommonMJConfig.Direction.Right) 
        {

            for (let i = 0; i < this.m_tanMingCards.length; i++) 
            {
                
                let url =  "mj_zuo_dao_bei"+(12-i)
                if (isMingPai) 
                {
                    url = "mj_zuo_dao"+(12-i)
                    if (i>12) {
                        url = "mj_zuo_dao0" 
                    }
                    this.m_tanMingCards[i].SetCardBgIconScale(-1,1)
                    this.m_tanMingCards[i].SetTangCardInit(this.m_eDirection,i)      
                }
                else if(playerData.hu.length>0) //不是明牌 并且胡过了扣牌 结算的时候传的是明牌
                {
                    url =  "mj_zuo_dao_bei"+(12-i)
                    if (i>12) {
                        url = "mj_zuo_dao_bei0" 
                    }
                    this.m_tanMingCards[i].SetCardBgIconScale(-1,1)   
                }
                else //右边站起的牌
                {
                    url = "mj_zuo_li"+(12-i)
                    if (i>12) {
                        url = "mj_zuo_li0" 
                    }
                    this.m_tanMingCards[i].SetCardBgIconScale(1,1)   
                }
                this.m_tanMingCards[i].SetCardBgIcon(url)

            }
        }


    }





    /** 上家和自己不需要设置位置   */
    SetTanCardsPosition(isMingPai:boolean)
    {

        let serPos = RoomManager.ConvertServerPos(this.m_eDirection)
        let playerData =    CommonMJConfig.MJMemberInfo[serPos] as pb.IMahPlayerData
        for (let i = 0; i < this.m_tanMingCards.length; i++) 
        {
            let  itemConfig = CommonMJConfig.TangMingCardsPosition[this.m_eDirection][i+1]
            // Log.w( "SetTanCardsPosition  itemConfig : ",itemConfig )
            let itemObj = this.m_tanMingCards[i].GetObj()
            if (isMingPai) 
            {
                itemObj.x = itemConfig.xtan
                itemObj.y = itemConfig.ytan
            }
            // else if(playerData.hu.length>0 || this.m_eDirection==CommonMJConfig.Direction.Left || this.m_eDirection==CommonMJConfig.Direction.Right) //不是明牌 并且胡过了扣牌 结算的时候传的是明牌
            // {
            //     itemObj.x = itemConfig.xpa
            //     itemObj.y = itemConfig.ypa
            // }

            else
            {
                if (this.m_eDirection == CommonMJConfig.Direction.Bottom) 
                {
                    itemObj.x = itemConfig.xtan
                    itemObj.y = itemConfig.ytan
                }
                else
                {
                    itemObj.x = itemConfig.xpa
                    itemObj.y = itemConfig.ypa
                }

            }
            if (this.m_eDirection == CommonMJConfig.Direction.Bottom) 
            {
                this.m_tanMingCards[i].Reset();
            }

        }
        // if (this.m_eDirection == CommonMJConfig.Direction.Top) 
        // {


        // }
        // else if (this.m_eDirection == CommonMJConfig.Direction.Left) 
        // {

        // }
        // else if (this.m_eDirection == CommonMJConfig.Direction.Left) 
        // {

        // }
    }

    /** 刷新层级 */
    ShuaXinTanSortingOrder() 
    {
        // Log.w( "ShuaXinSortingOrder 上边  this.m_tanMingCards ",this.m_tanMingCards.length )
        if (this.m_eDirection ==CommonMJConfig.Direction.Right ) 
        {
            let orderArr = MJTool.GetSortHierarchyLeftout(this.m_tanMingCards.length,13,99);
            // Log.w ( "ShuaXinSortingOrder 右边  orderArr ",orderArr )
            for (let i = 0; i < this.m_tanMingCards.length; i++) 
            {
                this.m_tanMingCards[i].GetObj().sortingOrder= orderArr[i];
            }
        }
        else if (this.m_eDirection ==CommonMJConfig.Direction.Left ) 
        {
            let orderArr = MJTool.GetSortHierarchyRightout(this.m_tanMingCards.length,13,99);
            // Log.w ( "ShuaXinSortingOrder 左边  orderArr ",orderArr )
            for (let i = 0; i < this.m_tanMingCards.length; i++) 
            {
                this.m_tanMingCards[i].GetObj().sortingOrder= orderArr[i];
            }
        }
        else if (this.m_eDirection ==CommonMJConfig.Direction.Top ) 
        {
            // let orderArr = MJTool.GetSortHierarchyLeftout(this.m_tanMingCards.length,13,99);
            // Log.w ( "ShuaXinSortingOrder 上边  orderArr ",orderArr )
            for (let i = 0; i < this.m_tanMingCards.length; i++) 
            {
                if (i<7) {
                    this.m_tanMingCards[i].GetObj().sortingOrder= i;
                }
                else
                {
                    this.m_tanMingCards[i].GetObj().sortingOrder= 13-i;
                }

            }
        }
        else if (this.m_eDirection ==CommonMJConfig.Direction.Bottom ) 
        {
            let orderArr = MJTool.GetSortHierarchyRightout(this.m_tanMingCards.length,13,99);
            // Log.w ( "ShuaXinSortingOrder 右边  orderArr ",orderArr )
            for (let i = 0; i < this.m_tanMingCards.length; i++) 
            {
                this.m_tanMingCards[i].GetObj().sortingOrder= orderArr[i];
            }
        }




    }





    /** 生成明牌 暂时直接刷新  其他三家的牌刷新到手牌位置 和摸牌位置*/
    SetMingPaiCards(mjs: number[],moMj:number) 
    {
        
        this.ClearTanMingCards();
        let cardsArr = Tool.Clone(mjs);
        Log.e(   "SetTanCards 00  mjs  ",mjs);
        for (let i = 0; i < cardsArr.length; i++) 
        {
            if (cardsArr[i] == moMj ) 
            {
                cardsArr.splice(i,1)
                break;
            }
        }
        Log.w(   "SetTanCards 01   cardsArr  ",cardsArr);
        MJManager.CardSortByLaiZiAndQueRevert(cardsArr);

        for (let index = 0; index < cardsArr.length; index++) 
        {
            let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, CommonMJConfig.TangMingPath[this.m_eDirection])
            let item: fgui.GButton = this.m_tangMingPool.getObject(url).asButton
            item.visible =true;
            this.tangMing_com.addChild(item)
            let cardItem = new MJCard(item);
            cardItem.setInit(false);
            // Log.e(   "SetTanCards   cardsArr[index]  ",cardsArr[index]);
            cardItem.BaseSetCard(cardsArr[index]);
            cardItem.SetActiveFire(true);
            // cardItem.PlayEff("mjsp_huoyan","animation",true);
            this.m_tanMingCards.push(cardItem)
        }
        this.ShuaXinTanSortingOrder()
        this.SetTanCardsSprite(true);
        this.SetTanCardsPosition(true);

        this.tangMingPick_list.removeChildrenToPool();
        if (moMj!=null &&  moMj!=0 ) 
        {
            // Log.e(   "SetTanCards  设置了摸牌  moMj ",moMj);
            let cardObj: fgui.GButton = this.tangMingPick_list.addItemFromPool().asButton;
            cardObj.visible =true;
            let cardItem = new MJCard(cardObj.asButton);
            cardItem.setInit(false);
            cardItem.BaseSetCard(moMj); 
            cardItem.SetActiveFire(true); 
            // cardItem.PlayEff("mjsp_huoyan","animation",true);
            this.m_tanMingPickCard = cardItem;  
        }
    }

    //没明牌的玩家 牌扣下去
    SetCardsSit(cardCount:number)
    {
        this.ClearTanMingCards();
        this.ClearTanMingCards();

        // let cardsKV = CommonMJConfig.PlayerCardsInfo[this.m_eDirection];
        // let cardsArr =MJTool.TableKVCopyToList(cardsKV)
        // Log.w( "SetCardsSit  胡的时候如果是自摸要先删除掉手上的牌  cardCount  :   " ,cardCount ,this.m_eDirection )
        
        for (let index = 0; index < cardCount; index++) 
        {

            if (this.m_eDirection ==  CommonMJConfig.Direction.Bottom)
            {
                let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_HALL, CommonMJConfig.SelfHandCardPath)
                let item: fgui.GButton = this.m_tangMingPool.getObject(url).asButton
                item.visible =true;
                this.tangMing_com.addChild(item)
                let cardItem = new MJCard(item);
                cardItem.setInit(true);
                this.m_tanMingCards.push(cardItem)
            }
            else
            {
                let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, CommonMJConfig.TangMingPath[this.m_eDirection])
                let item: fgui.GButton = this.m_tangMingPool.getObject(url).asButton
                item.visible =true;
                this.tangMing_com.addChild(item)
                let cardItem = new MJCard(item);
                cardItem.setInit(false);
                cardItem.SetCardSit();
                this.m_tanMingCards.push(cardItem)
            }
        }
        this.ShuaXinTanSortingOrder()
        if (this.m_eDirection !=  CommonMJConfig.Direction.Bottom)
        {
            this.SetTanCardsSprite(false);
        }

        this.SetTanCardsPosition(false);


    }







    /** 设置呼叫转移 显示 */
    SetActiveHJZY(isShow:boolean)
    {
        this.hjzy_obj.visible = isShow
    }

    /** 设置充值中 显示 */
    SetActiveChongZhiZhong(isShow:boolean)
    {
        this.chongzhiZhong_com.visible = isShow
    }
    
    SetActiveWaitChongZhiZhong(isShow:boolean)
    {
        this.waitChongzhiZhong_com.visible = isShow
    }

    public UpdateCountDown() {
        // Log.e(" UpdateCountDown  ");
        if ( this.m_uCountDown > 0) {
            this.m_uCountDown = this.m_uCountDown- 1;
            this.SetCountDown(this.m_uCountDown)
        }
    }
    
    public SetCountDown(tnum: number) 
    {
        this.m_uCountDown = tnum;
        this.waitChongzhiZhong_com.getChild("time").text=String.format("({0}s)",tnum)
        this.chongzhiZhong_com.getChild("time").text=String.format("({0}s)",tnum)
    }


    /** 设置充值破产 */
    OnS2CMahGamePoChan(data: pb.S2CMahGamePoChan) 
    {   
        let isCongZhiJieDuan =true
        if (data.type == MahPoChanReason.PCR_PoChan || data.type == MahPoChanReason.PCR_FuHuo  ) 
        {
            isCongZhiJieDuan =false;
        }

        MJDispose.SetReChargeState(isCongZhiJieDuan);
        this.onClearTimer()
        if (data.type == MahPoChanReason.PCR_PoChan )
        {
            this.SetActiveWaitChongZhiZhong(true)
            this.SetActiveChongZhiZhong(false)
            this.SetActiveGoBreak(false)
            window.clearInterval(this.timer_1);
            this.timer_1 = window.setInterval(this.UpdateCountDown.bind(this), 1000);
            this.SetCountDown(data.waittime)
        } 
        else if (data.type == MahPoChanReason.PCR_ChongZhi )
        {
            this.SetActiveWaitChongZhiZhong(false)
            this.SetActiveChongZhiZhong(true)
            this.SetActiveGoBreak(false)
            
            this.timer_1 = window.setInterval(this.UpdateCountDown.bind(this), 1000);
            this.SetCountDown(data.waittime)
        } 
        else if (data.type == MahPoChanReason.PCR_FuHuo )
        {
            this.SetActiveWaitChongZhiZhong(false)
            this.SetActiveChongZhiZhong(false)
            this.SetActiveGoBreak(false)
        } 
        else if (data.type == MahPoChanReason.PCR_GiveUp )
        {
            this.SetActiveWaitChongZhiZhong(false)
            this.SetActiveChongZhiZhong(false)
            this.SetActiveGoBreak(true)
        } 


        if (this.m_eDirection == CommonMJConfig.Direction.Bottom ) //自己的時候
        {
            if (data.type == MahPoChanReason.PCR_PoChan ) //自己去看视频之类的
            {

            } 
            else if (data.type == MahPoChanReason.PCR_ChongZhi )
            {

            } 
            else if (data.type == MahPoChanReason.PCR_FuHuo )
            {
            } 
            else if (data.type == MahPoChanReason.PCR_GiveUp )
            {
                MJTool.PlaySound(CommonMJConfig.SoundEffPath.PoChan,Config.BUNDLE_MJCOMMON);
                // 自己破产只有允许离开房间
                RoomManager.SetSelfIsPoChan(true)
                dispatch(MJEvent.SETACTIVENEXTGAMEMJ,true)
                this.OnS2CMahAuto(false)
            } 
        } 
    }


    


    OnS2CMahAuto(isTuoGuan: boolean) 
    {
        this.SetActiveTuoGuan(isTuoGuan);
        if (isTuoGuan&& this.m_eDirection ==  CommonMJConfig.Direction.Bottom ) 
        {
            this.tuoguan_obj.asButton.getChild("title").text="取消托管"
            MJTool.PlaySound(CommonMJConfig.SoundEffPath.TuoGuan, Config.BUNDLE_MJCOMMON);
        }
    }


    SetActiveEffectSpain(isShow:boolean )
    {
        if (this.effSpine_load3d) 
        {
            this.effSpine_load3d.visible =isShow;
        }
    }

    /** 播放胡碰杠胡过 等等 所有牌型的特效  中心胡不用 */
    PlaySpainEff(fileName:string,aniName:string)
    {
        // Log.w("其他玩家播放 胡牌特效 ")
        // this.SetActiveEffectSpain(true)
        // this.effSpine_load3d.animationName = aniName;
        // let sp = <sp.Skeleton>this.effSpine_load3d.content;
        // sp.setCompleteListener(function(){
        //     this.SetActiveEffectSpain(false)
        // }.bind(this));

        Manager.utils.PlaySpine(this.effSpine_load3d,fileName,aniName,Config.BUNDLE_MJCOMMON,()=>{
            this.SetActiveEffectSpain(false)
        })

    }


    SetActiveLiuGuang(isShow)
    {
        if (this.liuguang_gload3d!=null) {
            this.liuguang_gload3d.visible =isShow
        }
    }

    PlaySpainLiuGuangEff()
    {
        this.liuguang_gload3d.animationName = "liuguang";
        this.SetActiveLiuGuang(true)
        let sp = <sp.Skeleton>this.liuguang_gload3d.content;
        sp.setCompleteListener(function(){
            this.SetActiveLiuGuang(false)
        }.bind(this));
    }


    SetInitPaiQiangDataStart(count:number,starIndex:number,startCardIndex:number)
    {
        // Log.w("InitPaiQiang   m_eDirection: count   ",this.m_eDirection,count)
        this.mjPaiQiangItemSC.SetInitPaiQiangDataStart(count,this.m_eDirection,starIndex,startCardIndex)
    }

    SetInitPaiQiangDataEnd(count:number,starIndex:number,startCardIndex:number)
    {
        // Log.w("InitPaiQiang   m_eDirection: count   ",this.m_eDirection,count)
        this.mjPaiQiangItemSC.SetInitPaiQiangDataEnd(count,this.m_eDirection,starIndex,startCardIndex) 


    }


    SetActivePaiQiang(isShow:boolean)
    {
        this.mjPaiQiangItemSC.SetActivePaiQiang(isShow)
    }


    // InitPaiQiangDataStart(index: number) 
    // {
    //     this.mjPaiQiangItemSC.InitPaiQiangDataStart(index)
    
    // }



    // InitPaiQiangDataEnd(index: number) 
    // {
    //     this.mjPaiQiangItemSC.InitPaiQiangDataEnd(index)
    
    // }
    // InitPaiQiangDataAll() 
    // {
    //     this.mjPaiQiangItemSC.InitPaiQiangDataAll()
    
    // }
    
    
    GetSelfMoCardId() :number
    {
        if (this.m_objPickCard!=null) 
        {
            return  this.m_objPickCard.GetCardNumber();
        }
        else
        {
            return 0 
        }
    }

    GetSelfMoCardIsUp() :boolean
    {
        if (this.m_objPickCard!=null) 
        {
            return  this.m_objPickCard.GetIsUp();
        }
        else
        {
            return false
        }
    }


    

    //道具处理
    OnMjPropChangeCards(data: pb.S2CMahPropResult) 
    {
    
        let serPos = RoomManager.ConvertServerPos(this.m_eDirection)
        let playerData =    CommonMJConfig.MJMemberInfo[serPos] as pb.IMahPlayerData
        let bMingPai = playerData.bMingPai;

        let addCards =[]
        let removeCards=[]
        let moCardID= data.newMo
        for (let i = 0; i < data.param1.length; i++) 
        {
            removeCards.push({cardID:data.param1[i],isUse:false})
        }

        for (let i = 0; i < data.param2.length; i++) 
        {
            addCards.push(data.param2[i])
        }
        dispatch("GetSelfMoCardId")
        this.OnPlayMoCardAni(moCardID,bMingPai)

        if (moCardID!=null &&  moCardID!=0) 
        {
            for (let i = 0; i < data.param2.length; i++) 
            {
                if (removeCards[i][0] == CommonMJConfig.selfMoCard ) 
                {
                    removeCards.splice(i,1)
                    break;
                }
            }

            for (let i = 0; i < data.param2.length; i++) 
            {
                if (addCards[i] == moCardID ) 
                {
                    addCards.splice(i,1)
                    break;
                }
            }
        }
        CommonMJConfig.selfMoCard=0 
        let isNeedsearch = true
        // Log.w(" OnMjPropChangeCards  CommonMJConfig.PropIndex : ",CommonMJConfig.PropIndex  )
        for (let c = 0; c < removeCards.length; c++) 
        {
            //找到一张相同的牌倒下去 站起来的时候换成新的牌
            if (CommonMJConfig.PropIndex!=0) 
            {
                let cardid = this.m_tanMingCards[CommonMJConfig.PropIndex].GetCardNumber()
                if (cardid== removeCards[c].cardID && !removeCards[c].isUse ) //多张一样的牌避免
                {

                    // this.m_tableCards[CommonMJConfig.PropIndex].PlaySpainAni(CommonMJConfig.AnimationType.DaoPai)
                    this.m_tanMingCards[CommonMJConfig.PropIndex].SetCard(addCards[c], this.RemoveHandCard);
                    this.m_tanMingCards[CommonMJConfig.PropIndex].SetAlreadyClick(false,true)
                    if (bMingPai)
                    {
                        this.m_tanMingCards[CommonMJConfig.PropIndex].PlayEff("mjsp_huoyan","animation",true);
                    }  
                    isNeedsearch = false
                    removeCards[c].isUse =true
                }
            }
        }

        if (isNeedsearch) 
        {
            for (let i = 0; i < this.m_tanMingCards.length; i++) 
            {
                let cardid = this.m_tanMingCards[i].GetCardNumber()

                for (let c = 0; c < removeCards.length; c++) 
                {
                    if (cardid== removeCards[c].cardID && !removeCards[c][1]) 
                    {
                        // this.m_tableCards[i].PlaySpainAni(CommonMJConfig.AnimationType.DaoPai)
                        this.m_tanMingCards[i].SetCard(addCards[c], this.RemoveHandCard);
                        this.m_tanMingCards[i].SetAlreadyClick(false,true)
                        if (bMingPai)
                        {
                            this.m_tanMingCards[i].PlayEff("mjsp_huoyan","animation",true);
                        }  
                        removeCards[c].isUse =true
                        break
                    }
                }
            }
        }


        let timerItem=  window.setTimeout(()=>{
            dispatch("GetSelfMoCardId")

            //重新生成一次牌 重新排序
            this.ReFalshSelfCardAnMoPai(CommonMJConfig.selfMoCard)
        } , 1000 );
        this.m_TimerArr.push(timerItem)
    
    }

    //直接刷新到最新的牌
    ReFalshSelfCardAnMoPai(mocardId:number)
    {
        let serPos = RoomManager.ConvertServerPos(this.m_eDirection)
        let playerData =    CommonMJConfig.MJMemberInfo[serPos] as pb.IMahPlayerData
        let bMingPai = playerData.bMingPai;

        this.ClearTanMingCards();
        let mineCards = CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom];
        // Log.w(" OnMjPropChangeCards 刷新 mineCards  : ",mineCards);
        let handCardArr =MJTool.TableKVCopyToList(mineCards)
        if (mocardId!=null && mocardId !=0   )  
        {
            for (let index = 0; index < handCardArr.length; index++) 
            {
                if (mocardId == handCardArr[index] ) 
                {
                    handCardArr.splice(index,1)
                    break;
                }
            }
        }


        MJManager.CardSortByLaiZiAndQueRevert(handCardArr);

        // Log.w(" ReFalshSelfCardAnMoPai mocardId : ",mocardId);
        // Log.w(" ReFalshSelfCardAnMoPai handCardArr : ",handCardArr);

        for (let i = 0; i < handCardArr.length; i++) 
        {
            let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_HALL, CommonMJConfig.SelfHandCardPath)
            let item: fgui.GButton = this.m_tangMingPool.getObject(url).asButton
            item.visible =true;
            this.tangMing_com.addChild(item)

            let cardItem = new MJCard(item);
            cardItem.setInit(true);
            this.m_tanMingCards.push(cardItem)
        }
        for (let i = 0; i < this.m_tanMingCards.length; i++) 
        {
            this.m_tanMingCards[i].SetCard(handCardArr[i],this.RemoveHandCard);
            this.m_tanMingCards[i].SetCardUp( false );
            if (bMingPai)
            {
                this.m_tanMingCards[i].PlayEff("mjsp_huoyan","animation",true);
            }  
        }

        if (mocardId!=null && mocardId !=0   )  
        {
            let item: fgui.GButton = this.pick_list.addItemFromPool().asButton;
            MJDispose.SetState(CommonMJConfig.MineCardState.Play);
            this.m_objPickCard = new MJCard(item);
            this.m_objPickCard.setInit(true);
            this.m_objPickCard.SetCard(mocardId,this.RemoveHandCard);
            this.m_objPickCard.Reset();   
            if (bMingPai)
            {
                this.m_objPickCard.PlayEff("mjsp_huoyan","animation",true);
            }  
        }
        this.ShuaXinTanSortingOrder()
        this.SetTanCardsPosition(false);

        MJTool.HasQueCard(); 
        dispatch(MJEvent.SET_DINGQUE_CARD_STATE, CommonMJConfig.AlreadyQue, true);
        this.ResetCards();
    }






    //摸得牌换掉了的动画展示
    OnPlayMoCardAni(carID:number,bMingPai:boolean)
    {
        if (carID!=null&& carID!=0 && CommonMJConfig.selfMoCard!=null && CommonMJConfig.selfMoCard !=0 && this.m_objPickCard!=null ) 
        {
            // this.m_objPickCard.PlaySpainAni(MJConfig.AnimationType.DaoPai)
            this.m_objPickCard.SetCard(carID,this.RemoveHandCard);
            this.m_objPickCard.SetAlreadyClick(false,true)
            if (bMingPai)
            {
                this.m_objPickCard.PlayEff("mjsp_huoyan","animation",true);
            }  

        }


    }


    //添加所有手牌
    SetPlayerReconnectHands(tempArr:number[],data: pb.MahPlayerData)
    {
        Log.e(" SetPlayerReconnectHands ffffffff 01 tempArr : ", tempArr, this.m_eDirection);
        this.ClearTanMingCards();
        this.ClearTanMingCards();
        MJManager.CardSortByLaiZiAndQueRevert(tempArr);
        let bMingPai= data.bMingPai
        //首先是自己的时候直接刷新
        if (this.m_eDirection == CommonMJConfig.Direction.Bottom) 
        {
            // Log.e(" SetPlayerReconnectHands 自己的时候 tempArr : ", tempArr, this.m_eDirection);
            for (let i = 0; i < tempArr.length; i++) 
            {
                let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_HALL, CommonMJConfig.SelfHandCardPath)
                let item: fgui.GButton = this.m_tangMingPool.getObject(url).asButton
                item.visible =true;
                this.tangMing_com.addChild(item)
                let cardItem = new MJCard(item);
                cardItem.setInit(true);
                this.m_tanMingCards.push(cardItem)
            }
            for (let i = 0; i < this.m_tanMingCards.length; i++) 
            {
                this.m_tanMingCards[i].SetCard(tempArr[i],this.RemoveHandCard);
                this.m_tanMingCards[i].SetCardUp( false );
                if (bMingPai)
                {
                    this.m_tanMingCards[i].PlayEff("mjsp_huoyan","animation",true);
                }  
            }

            this.ShuaXinTanSortingOrder()
            this.SetTanCardsPosition(false);

            // this.ResetCards();
            return
        }
        //其他玩家的时候
        // Log.e(" SetPlayerReconnectHands ffffffff 02  ");
        if (bMingPai ) 
        {
            this.SetMingPaiCards(tempArr,0)
        }
        else if (data.hu.length>0 ) //胡过了一定不是换三张阶段
        {
            for (let index = 0; index < tempArr.length; index++) 
            {
                let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, CommonMJConfig.TangMingPath[this.m_eDirection])
                let item: fgui.GButton = this.m_tangMingPool.getObject(url).asButton
                item.visible =true;
                this.tangMing_com.addChild(item)
                let cardItem = new MJCard(item);
                cardItem.setInit(false)
                cardItem.SetCardSit();
                cardItem.SetActiveFire(false);
                this.m_tanMingCards.push(cardItem)
            }
            this.ShuaXinTanSortingOrder()
            this.SetTanCardsSprite(false);
            this.SetTanCardsPosition(false);
        }
        else
        {
            // Log.e(" SetPlayerReconnectHands ffffffff 03  ");
            //左右两边 站立的牌每个位置都不一样
            // if (this.m_eDirection == CommonMJConfig.Direction.Right || this.m_eDirection == CommonMJConfig.Direction.Left) 
            // {
                Log.e(" SetPlayerReconnectHands tempArr : ", tempArr,this.m_eDirection);

                for (let index = 0; index < tempArr.length; index++) 
                {
                    let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, CommonMJConfig.TangMingPath[this.m_eDirection])
                    let item: fgui.GButton = this.m_tangMingPool.getObject(url).asButton
                    item.visible =true;
                    this.tangMing_com.addChild(item)
                    let cardItem = new MJCard(item);
                    cardItem.setInit(false);
                    cardItem.SetCardSit();
                    cardItem.SetActiveFire(false);
                    this.m_tanMingCards.push(cardItem)
                }
                this.ShuaXinTanSortingOrder()
                this.SetTanCardsSprite(false);
                this.SetTanCardsPosition(false);


            // }
            // else
            // {

            //     for (let i = 0; i < tempArr.length; i++) 
            //     {
            //         let item: fgui.GButton = this.hand_list.addItemFromPool().asButton;
            //         let cardItem = new MJCard(item);
            //         cardItem.setInit(true);
            //         this.m_tableCards.push(cardItem)
            //     }
            //     for (let i = 0; i < this.m_tableCards.length; i++) 
            //     {
            //         this.m_tableCards[i].SetCard(tempArr[i],this.RemoveHandCard);
            //         this.m_tableCards[i].SetCardUp( false );
            //     }
            //     this.ShuaXinHandCardsPos()

            // }

        }





    }

    
    OnSetOutCardPointShow() 
    {
        this.mjOutCardAreaSC.OnSetOutCardPointShow()


    }


    //明牌后需要一直播放火焰
    PlayEffFire(isMingPai:boolean)
    {
        for (let index = 0; index < this.m_tanMingCards.length; index++) 
        {
            this.m_tanMingCards[index].PlayEff("mjsp_huoyan","animation",true);

            let timerItem=  window.setTimeout(()=>
            {
                if (!isMingPai) 
                {
                    if (this.m_tanMingCards!=null&& this.m_tanMingCards!=[] && this.m_tanMingCards[index]!=null) 
                    {
                        this.m_tanMingCards[index].SetActiveEff_loader3d(false);
                    }
                }
            } , 2000);
            this.m_TimerArr.push(timerItem)


        }

        if (this.m_objPickCard!=null) 
        {
            this.m_objPickCard.PlayEff("mjsp_huoyan","animation",true);
            let timerItem=  window.setTimeout(()=>
            {
                if (!isMingPai) 
                {
                    if (this.m_objPickCard!=null) 
                    {
                        this.m_objPickCard.SetActiveEff_loader3d(false); 
                    }  
                }
            } , 2000);
            this.m_TimerArr.push(timerItem)

        }
    }



    HideAllDaduo()
    {
        for (let index = 0; index < this.m_tanMingCards.length; index++) 
        {
            this.m_tanMingCards[index].SetActiveDaduo(false);
        }

        if (this.m_objPickCard!=null) 
        {
            this.m_objPickCard.SetActiveDaduo(false);
        }
    }


    






    //移除所有牌
    public RemoveAllCard() 
    {
        this.ClearTanMingCards();
        this.mjOutCardAreaSC.ReSet()

        this.ClearTanMingCards();
        this.ClearPengGangFeiCards();
        this.team_tablePengGang=[];

        this.HideBigCardShow();

        this.SetActiveOutCardEffect(false);
        this.SetActiveLiuGuang(false)



        

        // if m_gridAlt.transform.childCount > 0 then
        //     local childCount = m_gridAlt.transform.childCount
        //     for i = childCount, 1,-1 do
        //         local obj = m_gridAlt.transform:GetChild(i-1)
        //         if obj then
        //             GameObject.Destroy(obj.gameObject)
        //         end
        //     end
        // end
        // m_gridTans:ReMoveAll()
        // m_gridAlt:ReMoveAll()

        
    }

    //重置每个玩家 --删除掉所有的延迟和 dotween
    public ResetPlayer() 
    {
        this.SetActiveHand(false);
        this.Setm_isHSZDele(false);
        this.SetActiveBigCards(false);
        this.SetActiveEffectSpain(false);
        this.SetActiveTuoGuan(false);
        this.SetActiveGoBreak(false);
        this.SetActiveHJZY(false);

        this.SetActivespicon_load(false)
        this.SetActiveEffectSpain(false)
        this.StopCoroutineTweenAni();

        this.SetActiveChongZhiZhong(false);
        this.SetActiveWaitChongZhiZhong(false)
        this.SetActiveEffectzimoHu_Gc(false)
        this.mjPaiQiangItemSC.Reset()
        window.clearInterval(this.timer_1);

    }


    
    
    /** 移除碰杠飞的牌和数据  */
    ClearPengGangFeiCards()
    {
        //碰杠飞的牌都要去释放掉
        for (let i = 0; i < this.m_tableAlt.length; i++) 
        {
            // this.m_tableAlt[i].Recycle();
            this.m_pengGangPool.returnObject(this.m_tableAlt[i].GetObj() );
        }
        for (let i = 0; i < this.m_tableCtrl.length; i++) 
        {
            // this.m_tableCtrl[i].Recycle();
            this.m_pengGangPool.returnObject(this.m_tableCtrl[i].GetObj() );
        }
        for (let i = 0; i < this.m_tableBlackCtrl.length; i++) 
        {
            // this.m_tableBlackCtrl[i].Recycle();
            this.m_pengGangPool.returnObject(this.m_tableBlackCtrl[i].GetObj() );
        }
        this.m_tableAlt=[];
        this.m_tableCtrl=[];
        this.m_tableBlackCtrl=[];
        this.team_tablePengGang=[]
        this.groupArr_obj  =[]
        this.m_pengGangPool.clear()
    }



    /** 移除所有摊牌 明牌  */
    ClearTanMingCards()
    {
        for (let index = 0; index < this.m_tanMingCards.length; index++) 
        {
            this.m_tanMingCards[index].Recycle();
            this.m_tangMingPool.returnObject(this.m_tanMingCards[index].GetObj() );
        }
        this.m_tanMingCards=[];



        this.m_tanMingPickCard=null;
        this.tangMingPick_list.removeChildrenToPool();
        this.m_tangMingPool.clear()

        if (this.m_objPickCard!=null) 
        {
            this.m_objPickCard.Recycle();
        }
        this.m_objPickCard=null;
        this.pick_list.removeChildrenToPool();

    }

    // /** 移除所有手牌 和摸得牌 */
    // ClearHandPickCards()
    // {
    //     // for (let index = 0; index < this.m_tableCards.length; index++) 
    //     // {
    //     //     this.m_tableCards[index].Recycle();
    //     // }
    //     // this.m_tableCards=[];
    //     // if (this.m_objPickCard!=null) 
    //     // {
    //     //     this.m_objPickCard.Recycle();
    //     // }
    //     // this.m_objPickCard=null;
    //     // this.pick_list.removeChildrenToPool();
    //     // this.hand_list.removeChildrenToPool();
    // }
    




    onClearTimer(): void 
    {
        if (this.timer_1!=null) {
            window.clearInterval(this.timer_1);        
        }
    }



    StopCoroutineTweenAni()
    {
        // for (const [key, val] of Object.entries(this.m_tableCards)) {
        //     this.m_tableCards[key].StopCoroutineTweenAni();
        // }
        this.mjOutCardAreaSC.StopCoroutineTweenAni()

        for (let index = 0; index < this.m_tanMingCards.length; index++) 
        {
            this.m_tanMingCards[index].StopCoroutineTweenAni();
        }

        if (this.m_TimerArr !=null ) 
        {
            // Log.w(" StopCoroutineTweenAni CMJPlayer  this.m_TimerArr.length ",this.m_TimerArr.length, this.m_eDirection)

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
