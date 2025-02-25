import { Config } from "../../../../scripts/common/config/Config";
import { Utils } from "../../../../scripts/common/utils/Utils";
import { LoggerImpl } from "../../../../scripts/framework/core/log/Logger";
import { Tool } from "../../../gamecommon/script/tools/Tool";
import { CommonMJConfig } from "../Config/CommonMJConfig";
import { MJEvent } from "../Event/MJEvent";
import { MJTool } from "../logic/MJTool";
import MJDispose from "../Manager/MJDispose";
import { MJC2SOperation } from "../net/MJC2SOperation";
import MJNormalCard from "./MJNormalCard";


export default class MJCard extends MJNormalCard
{





    // private root : fgui.GButton = null;
    // private mask_obj: fgui.GObject = null;
    // private icon_gloder:fgui.GLoader=null;
    

    private daduo_list :fgui.GList =null

    private bg_gloder:fgui.GLoader=null;
    private eff_loader3d :fgui.GLoader3D =null;
    
    // private m_uCardID:number;
    //是否拖拽过这张牌
    isDrag = false
    //初始坐标
    private  m_vecInit={x:0,y:0}
    private timeDragOld:number;


    private m_actionPickOut;
    //牌处于的状态
    MineStatePositon=CommonMJConfig.MineCardStatePositon.Bottom;

    public constructor(root : fgui.GButton) {
        super(root);

        this.root =root;

    }

    private   isBind =false

    private isUp =false;

    setInit(isBind:boolean)
    {

        // if (this.root.getChild("mask") ) 
        // {
        //     this.mask_obj = this.root.getChild("mask").asCom;
        // }

        if (this.root.getChild("eff")) 
        {
            this.eff_loader3d = <fgui.GLoader3D> this.root.getChild("eff");
        }

        if (this.root.getChild("bg"))
        {
            this.bg_gloder = this.root.getChild("bg").asLoader;
        }

        if (this.root.getChild("daduo"))
        {
            this.daduo_list = this.root.getChild("daduo").asList;
        }
        this.setInitNew()

        if (isBind) 
        {
            CommonMJConfig.TotalBingDingCount = CommonMJConfig.TotalBingDingCount+1
            // Log.e("  isBind   CommonMJConfig.TotalBingDingCount:  ",CommonMJConfig.TotalBingDingCount)
            this.BindEvent(); 
        }

    }

    BindEvent()
    {
        // Log.e("  MJCard   BindEvent   ");
        this.isBind=true
        this.root.onClick(this.OnClick, this);
        
        this.root.draggable = true;
        this.root.on(fgui.Event.DRAG_START, this.onDragStart, this);
        this.root.on(fgui.Event.DRAG_MOVE, this.onDragMove, this);
        this.root.on(fgui.Event.DRAG_END, this.onDragEnd, this);

    }

    public Recycle(){


        if (this.isBind ) 
        {
            if (this.root.hasClickListener() ) {
                // this.root.offClick(this.OnClick, this);
                this.root.clearClick();
            }
            this.root.draggable = false;
            this.root.off(fgui.Event.DRAG_START, this.onDragStart, this);
            this.root.off(fgui.Event.DRAG_MOVE, this.onDragMove, this);
            this.root.off(fgui.Event.DRAG_END, this.onDragEnd, this);
            CommonMJConfig.TotalBingDingCount = CommonMJConfig.TotalBingDingCount -1 

            // Log.w("  Recycle   CommonMJConfig.TotalBingDingCount:  ",CommonMJConfig.TotalBingDingCount)
        } 


    }

    private OnClick() 
    {
        // Log.e("点击打牌 001 ");
        // Log.w("点击打牌 001  CommonMJConfig.ModelMineState  = ",CommonMJConfig.ModelMineState);
        if (CommonMJConfig.ModelMineState == CommonMJConfig.MineCardState.Change) 
        {
            // Log.e("点击打牌 换三张中 ");
            this.ChangeOnClick();
        }
        else
        {
            // if (!CommonMJConfig.AlreadyTang) 
            // {
                this.PlayOnClick();
            // }
            
        }
        this.isDrag = false
    }

    /** 换三张的时候的处理 */
    ChangeOnClick() 
    {
        // if (CommonMJConfig.LimitColour) 
        // {
        //     this.ChangeOnClickLimit()
        // }
        // else
        // {
            this.ChangeOnClickNotLimit()
        // }
    }

    /** 不允许三张不一样的花色换  */
    ChangeOnClickLimit()
    {
        // Log.w ( "ChangeOnClickLimit  0 " );

        let color = this.GetCardConfig().Color
        if (CommonMJConfig.TabelThreeCards.length ==  3 ) 
        {
            //换默认非同花色的牌、才需要把之前3张全下了
            if (CommonMJConfig.TabelThreeCards[0].GetCardConfig().Color == color) 
            {
                let isClickReadyCard = false
                for (let i = 0; i < CommonMJConfig.TabelThreeCards.length; i++) 
                {
                    if (CommonMJConfig.TabelThreeCards[i] == this ) 
                    {
                        CommonMJConfig.TabelThreeCards[i].SetCardUp(false)
                        isClickReadyCard = true
                    }   
                }

                if(!isClickReadyCard)
                {
                    CommonMJConfig.TabelThreeCards[0].SetCardUp(false)
                    CommonMJConfig.TabelThreeCards.splice(0,1)
                    this.PlayCardUp(true,0.2)
                    // CommonMJConfig.TabelThreeCards = Array.from(CommonMJConfig.TabelThreeCards)
                    CommonMJConfig.TabelThreeCards.push(this)
                }

                dispatch(MJEvent.CAN_CHANGE_CLICK, CommonMJConfig.TabelThreeCards.length == 3);
                return;
            }
            else
            {
                for (let i = 0; i < CommonMJConfig.TabelThreeCards.length; i++) 
                {
                    if (CommonMJConfig.TabelThreeCards[i] == this ) 
                    {
                        CommonMJConfig.TabelThreeCards[i].SetCardUp(false)
                    }   
                }

                CommonMJConfig.TabelThreeCards=[];
                dispatch (MJEvent.CAN_CHANGE_CLICK, false);
            }
        }

        //判断花色是否相同 不相同的把之前选的牌扣下去最后点击的弹起
        // CommonMJConfig.TabelThreeCards = Array.from(CommonMJConfig.TabelThreeCards)
        // CommonMJConfig.TabelThreeCards.forEach(v => {
        //    if (color != v.GetCardConfig().Color) 
        //    {
        //         this.ChangeCancleAllCard();    
        //    }
        // });

        for (let i = 0; i < CommonMJConfig.TabelThreeCards.length; i++) 
        {
            if (CommonMJConfig.TabelThreeCards[i].GetCardConfig().Color != color ) 
            {
               this.ChangeCancleAllCard();
            }   
        }

        this.OnPointerUp()
        if ( this.MineStatePositon == CommonMJConfig.MineCardStatePositon.Top) 
        {
            //点起来的就塞入
            // CommonMJConfig.TabelThreeCards = Array.from(CommonMJConfig.TabelThreeCards)
            CommonMJConfig.TabelThreeCards.push(this)
        }
        else
        {

            for (let i = 0; i < CommonMJConfig.TabelThreeCards.length; i++) 
            {
                if (this ==CommonMJConfig.TabelThreeCards[i] )   
                {
                    // CommonMJConfig.TabelThreeCards.splice(i,1);
                    delete CommonMJConfig.TabelThreeCards[i]
                    break;
                }
            }
        }
        // Log.e ( "ChangeOnClickLimit  CommonMJConfig.TabelThreeCards.length ",CommonMJConfig.TabelThreeCards.length );
        dispatch(MJEvent.CAN_CHANGE_CLICK, CommonMJConfig.TabelThreeCards.length == 3);
    }

    /** 允许三张不一样的花色换 */
    ChangeOnClickNotLimit()
    {

        // Log.e ( "ChangeOnClickNotLimit this.card ",this.GetCardNumber() );
        if (CommonMJConfig.TabelThreeCards.length ==  3 ) 
        {
            let isClickReadyCard = false
            for (let i = 0; i < CommonMJConfig.TabelThreeCards.length; i++) 
            {
            //  Log.d("ChangeOnClickNotLimit 000000  i cardID :  ",CommonMJConfig.TabelThreeCards[i].GetCardNumber() );

                if (CommonMJConfig.TabelThreeCards[i] == this ) 
                {
                    // Log.d("ChangeOnClickNotLimit 找到之后放下去 i cardID :  ",CommonMJConfig.TabelThreeCards[i].GetCardNumber() );
                    CommonMJConfig.TabelThreeCards[i].SetCardUp(false)
                    CommonMJConfig.TabelThreeCards.splice(i,1)
                    isClickReadyCard = true
                }   
            }

            if(!isClickReadyCard)
            {
                CommonMJConfig.TabelThreeCards[0].SetCardUp(false)
                // Log.d("ChangeOnClickNotLimit 没找到 放下去第一张  CommonMJConfig.TabelThreeCards[0]  ",CommonMJConfig.TabelThreeCards[0].GetCardNumber()  );
                CommonMJConfig.TabelThreeCards.splice(0,1)

                // Log.d("ChangeOnClickNotLimit 没找到 i cardID :  ",CommonMJConfig.TabelThreeCards);

                this.PlayCardUp(true,0.2)
                CommonMJConfig.TabelThreeCards.push(this)
            }
                dispatch(MJEvent.CAN_CHANGE_CLICK, CommonMJConfig.TabelThreeCards.length == 3);
            return;
        }
        this.OnPointerUp();
        if (this.MineStatePositon == CommonMJConfig.MineCardStatePositon.Top) 
        {
            //点起来的就塞入
            // CommonMJConfig.TabelThreeCards = Array.from(CommonMJConfig.TabelThreeCards)
            CommonMJConfig.TabelThreeCards.push(this)
        } 
        else 
        {

            // Log.e(" 点下来   ")
            for (let i = 0; i < CommonMJConfig.TabelThreeCards.length; i++) 
            {
                if (this ==CommonMJConfig.TabelThreeCards[i] )   
                {
                    // Log.e(" 点下来   删除掉  ")
                    CommonMJConfig.TabelThreeCards.splice(i,1);
                    // delete CommonMJConfig.TabelThreeCards[i]
                    break;
                }
            }
        }
        // Log.e ( "ChangeOnClickNotLimit ffffffff  CommonMJConfig.TabelThreeCards ",CommonMJConfig.TabelThreeCards );
        dispatch(MJEvent.CAN_CHANGE_CLICK, CommonMJConfig.TabelThreeCards.length == 3);
    }




    ChangeCancleAllCard()
    {
        CommonMJConfig.TabelThreeCards = Array.from(CommonMJConfig.TabelThreeCards)
        CommonMJConfig.TabelThreeCards.forEach(v => {
            this.SetCardUp(false);    
         });
         CommonMJConfig.TabelThreeCards=[];
         dispatch (MJEvent.CAN_CHANGE_CLICK, false);
    }

    
    /** 游戏状态点击  */
    PlayOnClick()
    {
    
        // Log.e("点击打牌 PlayOnClick  001 ")
        if ( !CommonMJConfig.IsCanPickOutLai &&  MJTool.JudgeIsHave(CommonMJConfig.TingYong, this.m_uCardID)   ) 
        {
            return;
        }
        // Log.e("点击打牌 002 ")
        //必须 先打缺的牌 现在没这需求
        // MJTool.HasQueCard()
        // if ( !CommonMJConfig.AlreadyQue && MJTool.LaiZiCheckEqualQue(this.m_uCardID) ) 
        // {
        //     dispatch(MJEvent.SET_MJTIPS, CommonMJConfig.TipsSprite.MustQue);
        //     if (this.isDrag) 
        //     {
        //         this.isDrag =false;
        //     }
        // }

        if ( CommonMJConfig.CurrentSelectCard == this ) 
        {
            // Log.w(" MJCard  OnClick  第二次点击  mjcard ffffffff001  this.card ",this.m_uCardID );
            //连续第二次点击了自己出牌
            // 出牌  轮到自己摸牌并且杠的时候 可以直接让出牌(特殊情况)
            if (CommonMJConfig.ModelMineState == CommonMJConfig.MineCardState.Play) 
            {
                // Log.e(" MJCard  OnClick  第二次点击  出牌阶段 " );
                //是出牌阶
                this.PickOutCardAllow();
            } 
            else 
            {
                // Log.e(" MJCard  OnClick  第二次点击  不是出牌阶段 " );
                // if (this.isDrag) 
                // {
                //     this.isDrag = false;
                //     this.SetCardPosition(this.m_vecInit)
                // }
                // this.PlayCardUp(false,0.1)
                // this.SetActiveaAllOutMask(false)
                this.SetCardUp(false);
                CommonMJConfig.CurrentSelectCard = null
                dispatch(MJEvent.SHOW_OUT_HAND_FANSHU_TIP, false,0)
            }

        }
        else
        {
            // Log.e(" MJCard  OnClick  第一次点击  mjcard ffffffff001  this.card ",this.m_uCardID );
            CommonMJConfig.CurrentSelectCard = this;
            if (this.isDrag) 
            {
                this.isDrag = false;
                this.SetCardPosition(this.m_vecInit)
            }
            dispatch(MJEvent.SET_ALLCARD_DOWN)

            // this.SetActiveaAllOutMask(true)
            // this.PlayCardUp(true,0.1)

            this.SetCardUp(true);

            if ( CommonMJConfig.ModelMineState == CommonMJConfig.MineCardState.Play) 
            {
                dispatch(MJEvent.SHOW_OUT_HAND_FANSHU_TIP, true, this.m_uCardID);
                //绵阳麻将的时候还需要显示 躺牌选择界面
                if (CommonMJConfig.ClickedTang) 
                {
                    dispatch(MJEvent.SHOW_TANG_TIP, this.m_uCardID);
                }
            }
        }
    }



    SetCardUp(isUp: boolean) 
    {
        if (this.root!=null) 
        {
            this.SetIsUp(isUp);
            // Log.e( " SetCardUp this.m_vecInit.y  ",this.m_vecInit.y )
            // Log.e( " SetCardUp CommonMJConfig.CardMoveExtent[CommonMJConfig.Direction.Bottom].ClickUpExtent  ",CommonMJConfig.CardMoveExtent[CommonMJConfig.Direction.Bottom].ClickUpExtent )
            if (isUp) 
            {
                this.root.y= -CommonMJConfig.CardMoveExtent[CommonMJConfig.Direction.Bottom].ClickUpExtent
            }
            else
            {
                this.root.y= 0
            }
        }
    }


    /** 选中的时候让桌子上的所有相同的牌变灰 */
    SetActiveaAllOutMask(isShow: boolean) 
    {

        // local list = MJManager.GetLookCard(m_uCardID);
        // for i = 1, #list do
        //     if (list[i] ~= nil) then
        //         list[i].SetActiveOutMask(isShow);
        //     end
        // end

    }


    /** 执行了打牌给服务器 正式出牌 */
    PickOutCardAllow() 
    {
        this.SetIsUp(false)

        function ff(params:boolean) 
        {
            Log.d("Manager.alert ff",params);
            if (params)
            {
                // PickOutCardAllowFinal();
                this.PickOutCardAllowFinal();
            }
        }

        if (CommonMJConfig.IsShowOutCardTip && (this.m_uCardID == 35 || this.m_uCardID == 135)) 
        {
            let cf:AlertConfig=
            {
                title:"提示",
                text: "红中是万能牌,确认要打出红中吗?",   
                confirmCb: ff.bind(this),        
                cancelCb: ff.bind(this),
            };
            Manager.alert.show(cf);
        } 
        else 
        {
            // PickOutCardAllowFinal();
            this.PickOutCardAllowFinal();
        }

    }


    PickOutCardAllowFinal() 
    {
        // Log.e(" MJCard  PickOutCardAllowFinal  ")
        // if (CommonMJConfig.AlreadyHu) 
        // {
        //     return;
        // } 
        MJDispose.SetState(CommonMJConfig.MineCardState.Lock);
        MJC2SOperation.KictOutCard(this.m_uCardID);
        CommonMJConfig.PickOutCardTable = this;
        CommonMJConfig.CurrentSelectCard = null
        this.isDrag = false
    }

    /** 弹起操作 */
    OnPointerUp()
    {
        // Log.e(" card OnPointerUp  this.root.x ",this.root.x);
        this.SetIsUp(true);
        if ( this.MineStatePositon == CommonMJConfig.MineCardStatePositon.Bottom)
        {
            // Log.e("OnPointerUp  上去  ");
            this.MineStatePositon = CommonMJConfig.MineCardStatePositon.Top
            fgui.GTween.to2(this.root.x, this.root.y, this.root.x, -CommonMJConfig.CardMoveExtent[CommonMJConfig.Direction.Bottom].ClickUpExtent, 0.2).setTarget(this.root, this.root.setPosition);
        }
        else
        {
            // Log.e("OnPointerUp  下去  ");
            this.MineStatePositon = CommonMJConfig.MineCardStatePositon.Bottom
            fgui.GTween.to2(this.root.x, this.root.y, this.root.x, 0, 0.2).setTarget(this.root, this.root.setPosition);
        }

    }


    /** 牌上下移动的动画 */
    PlayCardUp(isUp:boolean,duration:number)
    {

        // Log.e(" card PlayCardUp  this.root.x ",this.root.x);
        this.SetIsUp(isUp);
        if (isUp) 
        {
            this.MineStatePositon = CommonMJConfig.MineCardStatePositon.Top
            fgui.GTween.to2(this.root.x, this.root.y, this.root.x, -CommonMJConfig.CardMoveExtent[CommonMJConfig.Direction.Bottom].ClickUpExtent, duration).setTarget(this.root, this.root.setPosition);
        } 
        else 
        {
            this.MineStatePositon = CommonMJConfig.MineCardStatePositon.Bottom
            fgui.GTween.to2(this.root.x, this.root.y, this.root.x, 0, duration).setTarget(this.root, this.root.setPosition);
        }
    }






    /** 设置牌的位置 */
    SetCardPosition(rect:{x:number,y:number})
    {
        this.root.setPosition(rect.x,rect.y);
    }


    /** 设置卡牌值 */
    SetCard(card:number,action )
    {
        this.SetIsUp(false)
        this.SetActiveCard(true);
        this.SetActiveMask(false)
        this.SetActiveHu(false)
        this.SetActiveEff_loader3d(false)
        this.SetCardAlpha(1);
        if (card ==null || card==0) //别人的牌
        {
            return;    
        }
        this.SetActiveQueLaiFu(false);

        this.m_uCardID = card;
        this.m_actionPickOut = action;

        if (CommonMJConfig.IsCanShowQue) 
        {
            if (MJTool.LaiZiCheckEqualQue(this.m_uCardID)) 
            {
                this.SetActiveQue(true);
            }
        }

        if (CommonMJConfig.IsCanShowLai && this.m_uCardID !=135 ) 
        {
            if (MJTool.JudgeIsHave(CommonMJConfig.TingYong, this.m_uCardID)) 
            {
                this.SetActiveLai(true)
            }
        }

        if (this.m_uCardID == 135) 
        {
           this.SetActiveFu(true)
        }
        if ( this.icon_gloder!=null ) 
        {
            let urlStr = fgui.UIPackage.getItemURL("hall",CommonMJConfig.MahjongID[this.m_uCardID].spriteUrl)
            // Log.e("SetCard 01  ",urlStr  );
            this.icon_gloder.icon =urlStr;   
        }


    }


    
    SetActiveCard(isShow : boolean)
    {
        this.root.visible=isShow;
    }



    SetCardAlpha(value : number)
    {
        this.root.alpha=value;
    }











    // SetActiveMask(isShow : boolean)
    // {
    //     if ( this.mask_obj!=null ) 
    //     {
    //         this.mask_obj.visible =isShow;
    //     }
    // }








    PlayCardAni(aniStr: string) 
    {



    }





    // 获取牌号
    GetCardNumber()
    {
        return this.m_uCardID;
    }


    //获取 卡牌配置

    GetCardConfig()
    {
        return CommonMJConfig.MahjongID[this.m_uCardID]
    }




    //设置是否可点击状态  state 标识 有没有打缺 isShowMask 是否展示 黑底板
    SetAlreadyClick(state: boolean,isShowMask:boolean) 
    {
        if (CommonMJConfig.AlreadyQue) 
        {
            state=true;
        }
        if (state) 
        {
            this.SetRaycastStatus(true);
            this.SetActiveMask(false)
        } 
        else 
        {
            if (MJTool.LaiZiCheckEqualQue(this.m_uCardID)) 
            {
                this.SetActiveMask(CommonMJConfig.IsQueShowMask)
                if (isShowMask) 
                {
                    this.SetActiveQue(true)
                }

            } 
            else 
            {
                this.SetActiveMask(!CommonMJConfig.IsQueShowMask)
            }
            this.SetRaycastStatus(MJTool.LaiZiCheckEqualQue(this.m_uCardID));
        }
    }

    /** 能否点击  现在不去限制 */
    SetRaycastStatus(isCanTouch:boolean)
    {
        // Log.e(" MJCard  SetRaycastStatus  isCanTouch : ",isCanTouch)
        // this.root.touchable = isCanTouch;
        this.root.touchable = true;
    }

    SetActiveDaduo(isShow:boolean)
    {
        if (this.daduo_list!=null) {
            this.daduo_list.visible =isShow
        }
    }


    /**  设置胡牌提示状态 */
    SetHuTipState(isShow: boolean,isMaxFan:boolean,isMaxCoung:boolean) 
    {
        this.daduo_list.removeChildrenToPool();
        if (isShow ) 
        {
            this.SetActiveDaduo(true)
            if (isMaxFan) 
            {
                let item_com = this.daduo_list.addItemFromPool().asCom;
                let urlStr = fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON,"icon_da")
                item_com.getChild("icon").icon = urlStr;
            }
            if (isMaxCoung) 
            {
                let item_com = this.daduo_list.addItemFromPool().asCom;
                let urlStr = fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON,"icon_duo")
                item_com.getChild("icon").icon = urlStr;
            }
            if ( !isMaxFan && !isMaxCoung) 
            {
                // Log.w(" 常规胡的牌   cardid : " ,this.m_uCardID )
                let item_com = this.daduo_list.addItemFromPool().asCom;
                let urlStr = fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON,"icon_arrow")
                // Log.w(" 常规胡的牌   urlStr : " ,  urlStr )
                item_com.getChild("icon").icon = urlStr;
            }
        } 

    }

    //胡牌后不让点击
    SetCardCannotClick() 
    {
        this.SetCardUp(false);
        this.SetActiveMask(false)
        this.SetRaycastStatus(false)
    }

    SetActiveEff_loader3d(isShow :boolean)
    {
        if (this.eff_loader3d!=null) 
        {
            this.eff_loader3d.visible = isShow;
        }
    }
    
    //火焰
    PlayEff(path: string, aniName: string,isShow:boolean) 
    {
        if (this.eff_loader3d!=null) {
            Manager.utils.PlaySpine(this.eff_loader3d,path,aniName,Config.BUNDLE_MJCOMMON,()=>{
            },isShow)
        }


    }


    







    StopCoroutineTweenAni()
    {
        fgui.GTween.kill(this.root);

    }




    //复位数据
    Reset()
    {
        // Log.e(" card Reset  复位数据  this.root.x ",this.root.x);
        this.m_vecInit.x=this.root.x;
        this.m_vecInit.y=0;

    }


    private onDragStart() 
    {
        // Log.e("mjcard  __onDragStart   mjcard ");

        if (!this.isDrag) {
            this.timeDragOld =  Manager.utils.milliseconds
        }
    }



    private onDragMove(evt:fgui.Event) 
    {

        if (Manager.utils.milliseconds-this.timeDragOld >=5000 ) {
            if (this.isDrag) 
            {
                
            }
        }

        // Log.e("mjcard  __onDragMove   mjcard ");
        // Log.e("mjcard  __onDragMove   evt ",evt);
        // if (Math.abs(evt.pos.y-this.m_vecInit.y) >200  ) {
        //     this.SetCardPosition(this.m_vecInit)
        // }

    }
    
    SetIsUp(isUp:boolean)
    {
        this.isUp=isUp;
    }

    GetIsUp():boolean
    {
        return this.isUp;
    }

    
    private onDragEnd(evt:fgui.Event) 
    {
        Log.e("mjcard  __onDragEnd   mjcard ");
        Log.e("mjcard  __onDragEnd   evt ",evt);
        Log.e("mjcard  __onDragEnd   this.m_vecInit ",this.m_vecInit);

        Log.e("mjcard  __onDragEnd   Manager.utils.milliseconds ",  Manager.utils.milliseconds  );
        if (this.root!=null) {

            this.SetCardPosition(this.m_vecInit)
            if (Math.abs(evt.pos.y-this.m_vecInit.y) >200  ) {
                if (CommonMJConfig.ModelMineState == CommonMJConfig.MineCardState.Play) 
                {
                    //是出牌
                    this.PickOutCardAllow();
                } 
            }
        }




    }

    //左 右边 上边 位置初始化设置
    SetTangCardInit(m_eDirection: number, i: number) 
    {
        let  itemConfig = CommonMJConfig.TangMingCardsPosition[m_eDirection][i+1]
        if (m_eDirection != CommonMJConfig.Direction.Bottom) 
        {
            Log.e( " SetTangCardInit    m_eDirection  "+m_eDirection );
            this.quelaifu_gloder.setPosition(itemConfig.quelaifu.x,itemConfig.quelaifu.y);
            this.quelaifu_gloder.setScale(itemConfig.quelaifu.scalex,itemConfig.quelaifu.scaley);
            this.icon_gloder.setPosition(itemConfig.icon.x,itemConfig.icon.y);
            this.icon_gloder.setScale(itemConfig.icon.scalex,itemConfig.icon.scaley);
        }
    }


}




