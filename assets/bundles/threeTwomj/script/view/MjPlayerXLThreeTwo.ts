import FLevel2UISecond from "../../../../scripts/common/fairyui/FLevel2UISecond";
import { MahHPGOPerate, MahPlayerState } from "../../../../scripts/def/GameEnums";
import { RoomManager } from "../../../gamecommon/script/manager/RoomManager";
import { Tool } from "../../../gamecommon/script/tools/Tool";
import { CommonMJConfig } from "../../../mjcommon/script/Config/CommonMJConfig";
import { MJEvent } from "../../../mjcommon/script/Event/MJEvent";
import { MJTool } from "../../../mjcommon/script/logic/MJTool";
import MJDispose from "../../../mjcommon/script/Manager/MJDispose";
import CMJPlayer from "../../../mjcommon/script/view/CMJPlayer";
import MJHuCardArea from "../../../mjcommon/script/view/MJHuCardArea";





export default class MjPlayerXLThreeTwo extends FLevel2UISecond {

    protected self_Gc: fgui.GComponent = null;
    protected m_imageHuType: fgui.GObject = null;
    mjHuCardAreaSC: MJHuCardArea =null;
    // 客户端坐标
    private m_eDirection:number;
    private curentHuNum:number;
    private mjplayerSC: CMJPlayer;



    public constructor(view: fgui.GComponent) {
        super(view);
        this.self_Gc=view;
    }




    public setInit() {



        this.m_imageHuType =this.self_Gc.getChild("huType");

        this.mjHuCardAreaSC = new MJHuCardArea(this.self_Gc.getChild("huArea").asCom);
        this.mjHuCardAreaSC.setInit();
        
    }

    SetCMJPlayer(mjlayer: CMJPlayer)
    {
        this.mjplayerSC= mjlayer;
    }


    /** 删除的时候 */
    protected onDestroy(): void
    {



    }



    /**設置玩家客户端坐标方位 */
    SetDirectioni(direction: number) {
        this.m_eDirection = direction;

        // //测试代码
        // let timerItem=  window.setTimeout(()=>{
        //     // for (let index = 0; index < 11 ; index++) {

        //     //     type Packet = typeof pb.MahHuData;
        //     //     let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.MahHuData);
        //     //     let packet = new Packet();
        //     //     packet.mjId=16
        //     //     packet.fromIndex=1
        //     //     packet.huIndex=1
        //     //     let huCard = this.mjHuCardAreaSC.AddHuCard(this.m_eDirection,packet,0,false);
        //     // }



        // } , 1000);


    }




    

    /** 胡的牌插入胡牌区 */
    OnHu( data: pb.IMahHuData, huori: number) 
    {

        if ( this.m_eDirection == CommonMJConfig.Direction.Bottom ) 
        {
            this.mjplayerSC.SetCardCannotClick()
        }
        if (this.mjplayerSC.GetPickCard() !=null && !data.translucent  ) //并且不是透明牌一炮双向的时候
        {
            this.mjplayerSC.SetPickCardNil()
        }

        let huCard = this.mjHuCardAreaSC.AddHuCard(this.m_eDirection,data,huori,false);
        if ( this.m_eDirection == CommonMJConfig.Direction.Bottom ) 
        {
            this.mjplayerSC.OnSetOutHandHuCardsState(false)
        }
        else
        {
            let playerData =    CommonMJConfig.MJMemberInfo[data.fromIndex] as pb.IMahPlayerData
            //其他玩家自摸
            if (!playerData.bMingPai) 
            {

                let cardsKV = CommonMJConfig.PlayerCardsInfo[this.m_eDirection];
                let tempArr =MJTool.TableKVCopyToList(cardsKV)
                this.mjplayerSC.SetCardsSit(tempArr.length)  
            }


        }


    }







    /** 重连胡的牌 */
    OnHuReContent( data: pb.IMahHuData, huori: number) 
    {

        if ( this.m_eDirection == CommonMJConfig.Direction.Bottom ) 
        {
            this.mjplayerSC.SetCardCannotClick()
        }
        // if (this.mjplayerSC.GetPickCard() !=null ) 
        // {
        //     this.mjplayerSC.SetPickCardNil()
        // }
        let huCard = this.mjHuCardAreaSC.AddHuCard(this.m_eDirection,data,huori,true);
        if ( this.m_eDirection == CommonMJConfig.Direction.Bottom ) 
        {
            this.mjplayerSC.OnSetOutHandHuCardsState(false)
        }
    }

    








    ResetDate()
    {
        this.curentHuNum =0
    }


    
    

    SetActiveHuType(isShow:boolean)
    {
        if (this.m_imageHuType) {
            this.m_imageHuType.visible = isShow;
        }

    }
    SHowHuCardHuEff() 
    {
        this.mjHuCardAreaSC.PlayHPGuangEff(this.m_eDirection)
    }



    //每个玩家的游戏数据恢复
    SetPlayerReconnect(data: pb.MahPlayerData) 
    {
        // Log.w(" SetPlayerReconnect  meige wanjai   data  :  ",data)
        let direct = MJTool.PositionToDirection(data.index);
        //#region 碰杠牌
        for (let i = 0; i < data.pengGangs.length; i++) 
        {
            let v = data.pengGangs[i] 
            if (v.type == MahHPGOPerate.HPG_Peng ) 
            {
                CommonMJConfig.AllCards[v.mjId] = CommonMJConfig.AllCards[v.mjId] - 3;
               let directionIndex = CommonMJConfig.AltOriTab[direct][MJTool.AltPositionToDirection(v.fromIndex, data.index)]
               this.mjplayerSC.AddAltCard(v.mjId, directionIndex, true);
            } 
            else 
            {
                if (v.mjId!=35) 
                {
                    CommonMJConfig.AllCards[v.mjId] = 0;
                } 
                else 
                {
                    CommonMJConfig.AllCards[v.mjId] = CommonMJConfig.AllCards[v.mjId]-4;
                }
                if (v.type == MahHPGOPerate.HPG_DianGang ) 
                {
                
                    let directionIndex = CommonMJConfig.AltOriTab[direct][MJTool.AltPositionToDirection(v.fromIndex, data.index)]
                    this.mjplayerSC.AddCtrlCard(v.mjId, directionIndex, true);

                } 
                else  if (v.type == MahHPGOPerate.HPG_BuGang ) 
                {
                    this.mjplayerSC.AddCtrlCard(v.mjId, 5, true);
                }
                else  if (v.type == MahHPGOPerate.HPG_AnGang ) 
                {
                    this.mjplayerSC.AddBlackCtrlCard(v.mjId, true);
                }
            }

        }
        //#endregion
        //#region 手牌
        let addCards:number[] =[]
        addCards = Tool.Clone(data.mjs)
        if (direct ==CommonMJConfig.Direction.Bottom ) 
        {
            MJDispose.SetUseHongZhongPropState(data.usedHongZhong)
            if (data.moPaiId != 0 ) 
            {
                MJDispose.SetSelfLastPickCard(data.moPaiId)
            }

            for (let i = 0; i < data.mjs.length; i++) 
            {
                let cardId= data.mjs[i]
                if (  !CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom][cardId] ) 
                {
                    CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom][cardId]=1
                }
                else
                {
                    CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom][cardId]= CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom][cardId]+1  
                }
                CommonMJConfig.AllCards[cardId] = CommonMJConfig.AllCards[cardId]-1;
            }
        } 
        else 
        {
            if (data.bMingPai) 
            {
                for (let i = 0; i < data.mjs.length; i++) 
                {
                    let cardId= data.mjs[i]
                    if (  !CommonMJConfig.PlayerCardsInfo[direct][cardId] ) 
                    {
                        CommonMJConfig.PlayerCardsInfo[direct][cardId]=1
                    }
                    else
                    {
                        CommonMJConfig.PlayerCardsInfo[direct][cardId]= CommonMJConfig.PlayerCardsInfo[direct][cardId]+1  
                    }
                    CommonMJConfig.AllCards[cardId] = CommonMJConfig.AllCards[cardId]-1;
                }
            }
            else
            {
                CommonMJConfig.PlayerCardsInfo[direct][0]= data.mjs.length
            }


        }
        //#endregion

        //#region 打牌阶段 换三张阶段定缺阶段 自己是庄的时候需要放进手牌  手牌刷新
        if (MJTool.GetIsCanChuPai(addCards.length) ) 
        {

            Log.w(" SetPlayerReconnect   打牌阶段重连  ")
            if (direct == CommonMJConfig.Direction.Bottom && (data.state == MahPlayerState.PS_ChuPaiing || data.state == MahPlayerState.PS_Operateing) ) 
            {
                MJDispose.SetState(CommonMJConfig.MineCardState.Play)
            }
            

            if (data.state == MahPlayerState.PS_HSZed) //换三张状态中需要删除掉三张牌
            {
              
                addCards= Tool.RemoveSmallArr(addCards,data.huanSanZhangMahs)
                this.mjplayerSC.SetPlayerReconnectHands(addCards,data)
            } 
            else 
            {   
                if (direct == CommonMJConfig.Direction.Bottom ) 
                {
                    addCards= Tool.RemoveSmallArr(addCards,[data.moPaiId])
                    this.mjplayerSC.SetPlayerReconnectHands(addCards,data)
                    if (data.moPaiId!=0 ) 
                    {
                        this.mjplayerSC.PickCard(data.moPaiId,data.bMingPai)
                    }

                    MJTool.HasQueCard();
                    dispatch(MJEvent.SET_DINGQUE_CARD_STATE, CommonMJConfig.AlreadyQue, true);
                }
                else
                {
                    Log.w(" SetPlayerReconnect  其他玩家 打牌阶段重连  ")
                    if (data.bMingPai) 
                    {
                        addCards= Tool.RemoveSmallArr(addCards,[data.moPaiId])
                    }
                    else
                    {
                        addCards= Tool.RemoveSmallArr(addCards,[0])
                    }
                    this.mjplayerSC.SetPlayerReconnectHands(addCards,data)
                    Log.w(" SetPlayerReconnect  其他玩家 打牌阶段重连  ",data.moPaiId,data.bMingPai)
                    this.mjplayerSC.PickCard(data.moPaiId,data.bMingPai)
                }
            } 

        } 
        else 
        {
            Log.w(" SetPlayerReconnect   不是  打牌阶段重连  ")
            if (data.state == MahPlayerState.PS_HSZed) //换三张状态中需要删除掉三张牌
            {
              
                addCards= Tool.RemoveSmallArr(addCards,data.huanSanZhangMahs)
                this.mjplayerSC.SetPlayerReconnectHands(addCards,data)
            } 
            else 
            {
                this.mjplayerSC.SetPlayerReconnectHands(addCards,data)
                if (direct == CommonMJConfig.Direction.Bottom ) 
                {
                    MJTool.HasQueCard();
                    dispatch(MJEvent.SET_DINGQUE_CARD_STATE, CommonMJConfig.AlreadyQue, true);
                }
            } 
        }
        //#endregion



        //#region  打出的牌

        for (let  i= 0; i < data.PaiHeMahs.length; i++) 
        {
            let cardId = data.PaiHeMahs[i]
            CommonMJConfig.AllCards[cardId] = CommonMJConfig.AllCards[cardId]-1;
            this.mjplayerSC.AddOutCard(cardId,true)
        }
        //#endregion

        //#region  胡的牌


        if (data.hu!=null && data.hu.length!=0 ) 
        {
            if (direct == CommonMJConfig.Direction.Bottom ) 
            {
                MJDispose.SetAlreadyHu(true)
                this.mjplayerSC.SetCardCannotClick()
            }
    
            for (let  i= 0; i < data.hu.length; i++) 
            {
                let et = data.hu[i]
                let isZiMo = (et.fromIndex == et.huIndex)
                let directionIndex = CommonMJConfig.AltOriTab[direct][MJDispose.HuPositionToDirection(et.fromIndex, et.huIndex)]
                if (isZiMo) {
                    directionIndex = 5
                }
                this.OnHuReContent(et,directionIndex)
            }
        }
        //#endregion
        this.mjplayerSC.SetActiveTuoGuan(data.autoOpeateState)
        //设置破产标记
        this.mjplayerSC.SetActiveGoBreak(data.state==MahPlayerState.PS_GiveUp)



        if (direct == CommonMJConfig.Direction.Bottom ) 
        {
            this.SetMySelfPlayerReconnect(data)
        }
    
    }

    SetMySelfPlayerReconnect(data: pb.MahPlayerData) 
    {
        if (data.state ==MahPlayerState.PS_UnHSZ  ) 
        {
            CommonMJConfig.DefaultThreeCards = data.huanSanZhangMahs
            this.mjplayerSC.RecommendChangeThree(data.huanSanZhangMahs)
            //换三张提示亮起来 重连外层处理
        }
        MJTool.HasQueCard()
        //胡的操作亮不  重连外层处理
        RoomManager.SetSelfIsPoChan(data.state==MahPlayerState.PS_GiveUp)




    }









    //重置每个玩家 --删除掉所有的延迟和 dotween
    public ResetPlayer() 
    {
        this.ResetDate();

        this.mjHuCardAreaSC.RemoveAllHuCard()
        this.SetActiveHuType(false);

    }

    StopCoroutineTweenAni()
    {
        
    }






}
