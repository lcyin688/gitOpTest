import { RoomManager } from "../../../gamecommon/script/manager/RoomManager"
import { CommonMJConfig } from "../Config/CommonMJConfig"
import { MJEvent } from "../Event/MJEvent"
import { MJTool } from "../logic/MJTool"
import { MJC2SOperation } from "../net/MJC2SOperation"
import MJNormalCard from "../view/MJNormalCard"
import MJDispose from "./MJDispose"



export default class MJManager {



  static LookCardItem:Array<MJNormalCard>= [];

  //明牌对象
  static m_tableLookCards:{}



  static RandomValue: number















  /**
   * @description  初始化牌局
   */
  static InitBoard() {
    // Log.e(" HidePaiQiangCardItem  InitBoard ")
    // CommonMJConfig.allPaiqiangArr=[] 
    MJDispose.SetIsWaitBuystate(false)
    // MJDispose.SetPoFengstate(false)
    MJDispose.SetYuJiShouYi(0)
    MJDispose.SetAlreadyTang(false)
    MJDispose.SetSelfAlreadyFei(false)
    MJDispose.SetSureQueMoreState(false)
    MJDispose.SetReChargeState(false)
    RoomManager.SetSelfIsPoChan(false)
    MJDispose.ClearHuTip()

    CommonMJConfig.HuanSanZhangBuHuanData = {}
    CommonMJConfig.HuanPosData = []
    CommonMJConfig.PoChanClientPos = {}

    CommonMJConfig.TangCards[CommonMJConfig.Direction.Bottom].IsHu = false
    CommonMJConfig.TangCards[CommonMJConfig.Direction.Bottom].TanCards = []
    CommonMJConfig.TangCards[CommonMJConfig.Direction.Bottom].HuCards = []
    CommonMJConfig.TangCards[CommonMJConfig.Direction.Right].IsHu = false
    CommonMJConfig.TangCards[CommonMJConfig.Direction.Right].TanCards = []
    CommonMJConfig.TangCards[CommonMJConfig.Direction.Right].HuCards = []
    CommonMJConfig.TangCards[CommonMJConfig.Direction.Top].IsHu = false
    CommonMJConfig.TangCards[CommonMJConfig.Direction.Top].TanCards = []
    CommonMJConfig.TangCards[CommonMJConfig.Direction.Top].HuCards = []
    CommonMJConfig.TangCards[CommonMJConfig.Direction.Left].IsHu = false
    CommonMJConfig.TangCards[CommonMJConfig.Direction.Left].TanCards = []
    CommonMJConfig.TangCards[CommonMJConfig.Direction.Left].HuCards = []



    CommonMJConfig.ClickedTang = false
    CommonMJConfig.PiaoData = {}
    CommonMJConfig.BenJinCard = 0
    CommonMJConfig.TingYong = {}

    // CommonMJConfig.S2CMjDingQue = null
    CommonMJConfig.S2CMjDingQueResult = null


    CommonMJConfig.ChangeEffectOver = false;
    CommonMJConfig.m_objAllBalance = null;
    CommonMJConfig.MineChangeThreeCards = [];
    CommonMJConfig.TabelThreeCards = []

    MJDispose.SetHuTipCards(null)
    MJDispose.SetHuTipFanShu(null)

    CommonMJConfig.CurrentOutHandHuTip = null;
    CommonMJConfig.CurrentOutHandHuFanShuTip = null;
    CommonMJConfig.LastPickCard = null;
    CommonMJConfig.LastOutCard = null;

    MJDispose.SetAlreadyQueState(false)
    MJDispose.SetAlreadyHu(false)
    CommonMJConfig.SetSelectLackingOver = false;
    MJDispose.SetMineQueCard(-1)
    CommonMJConfig.AllCards = {};



    for (const [key, val] of Object.entries(CommonMJConfig.MahjongID)) {
      if (val.ISHave) {
        let cardId = Number(key);
        if (cardId == 35) {
          CommonMJConfig.AllCards[cardId] = CommonMJConfig.HZTotalCount
        }
        else if (cardId == 135) {
          CommonMJConfig.AllCards[cardId] = CommonMJConfig.extraHZCount
        }
        else
        {
          CommonMJConfig.AllCards[cardId] = 4
        }
      }
    }
    CommonMJConfig.PlayerCardsInfo = { };
    CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom] = { };
    CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Top] = { };
    CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Left] = { };
    CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Right] = { };


    // CommonMJConfig.MineGangTypeCardsBuGang=[];
    // CommonMJConfig.MineGangTypeCardsDianGang=[];
    // CommonMJConfig.MineGangTypeCardsAnGang=[];

    CommonMJConfig.PlayerPengGang = { };
    CommonMJConfig.PlayerPengGang[CommonMJConfig.Direction.Bottom] = [];
    CommonMJConfig.PlayerPengGang[CommonMJConfig.Direction.Top] = [];
    CommonMJConfig.PlayerPengGang[CommonMJConfig.Direction.Left] = [];
    CommonMJConfig.PlayerPengGang[CommonMJConfig.Direction.Right] = [];




    CommonMJConfig.DefaultThreeCards = [];
    dispatch(MJEvent.SET_PLAYER_HANDS_POSITION);


  }



  /** 初始化明牌区域 */
  static InitLookCard() 
  {


      this.m_tableLookCards = {};
  }


  static AddLookCards(cardId: number, mjNormalCardArr: MJNormalCard[]) 
  {
      if (cardId!=0) 
      {
        if (this.m_tableLookCards[cardId] == null) 
        {
          // let m_tableCards :Array<MJNormalCard>= [];
          this.m_tableLookCards[cardId] =[];
        } 
        for (let index = 0; index < mjNormalCardArr.length; index++) 
        {
          this.m_tableLookCards[cardId].push();
        }
      }
  }


  /** 设置随机因子 */
  static SetRandomValue()
  {
    this.RandomValue = Math.random()*1000;
  }


  /** 随机排序 */
  static SetSortByRandom(tempCardsArr:Array<number>)
  {
        tempCardsArr.sort(function (A, B) {
          return (Math.random());
      });
  }

  /** 麻将癞子排序 */
  static CardSortByLaiZi(tempCardsArr: Array<number> )
  {
        tempCardsArr.sort(function (a, b) {
          
          if (MJTool.JudgeIsHave(CommonMJConfig.TingYong, a) && MJTool.JudgeIsHave(CommonMJConfig.TingYong, b) ) 
          {
            if (a==135 || b==135 ) 
            {
              return b-135
            }
            return a-b;
          }
          else if( MJTool.JudgeIsHave(CommonMJConfig.TingYong, a) && !MJTool.JudgeIsHave(CommonMJConfig.TingYong, b)   )
          {
              return -1
          }
          else if( MJTool.JudgeIsHave(CommonMJConfig.TingYong, b) && !MJTool.JudgeIsHave(CommonMJConfig.TingYong, a)   )
          {
              return 1
          }
          else
          {
            return a-b;
          }
      });
  }

  /** 麻将癞子定缺后 排序 */
  static CardSortByLaiZiAndQue(tempCardsArr: Array<number> )
  {
        tempCardsArr.sort(function (a, b) {
          
          if (MJTool.JudgeIsHave(CommonMJConfig.TingYong, a) && MJTool.JudgeIsHave(CommonMJConfig.TingYong, b) ) 
          {
            if (a==135 || b==135 ) 
            {
              return b-135
            }
            return a-b;
          }
          else if( MJTool.JudgeIsHave(CommonMJConfig.TingYong, a) && !MJTool.JudgeIsHave(CommonMJConfig.TingYong, b)   )
          {
              return -1
          }
          else if( MJTool.JudgeIsHave(CommonMJConfig.TingYong, b) && !MJTool.JudgeIsHave(CommonMJConfig.TingYong, a)   )
          {
              return 1
          }
          else
          {
            if ((MJDispose.CheckEqualQue(a) == MJDispose.CheckEqualQue(b))) 
            {
              return a-b;
            } 
            else 
            {
                if (a!=0) {
                    let colour = CommonMJConfig.MahjongID[a].Color;
                    if (colour == CommonMJConfig.MineQueCard) 
                    {
                        return 1
                    } 
                    else 
                    {
                      return -1
                    }
                } 
                else
                {
                    return 1;
                }
            }
          }
      });
  }


    /** 反转排序  麻将癞子定缺后 排序 */
    static CardSortByLaiZiAndQueRevert(tempCardsArr: Array<number> )
    {
          tempCardsArr.sort(function (a, b) {
            
            if (MJTool.JudgeIsHave(CommonMJConfig.TingYong, a) && MJTool.JudgeIsHave(CommonMJConfig.TingYong, b) ) 
            {
              if (a==135 || b==135 ) 
              {
                return b-135
              }
              return b-a;
            }
            else if( MJTool.JudgeIsHave(CommonMJConfig.TingYong, a) && !MJTool.JudgeIsHave(CommonMJConfig.TingYong, b)   )
            {
                return 1
            }
            else if( MJTool.JudgeIsHave(CommonMJConfig.TingYong, b) && !MJTool.JudgeIsHave(CommonMJConfig.TingYong, a)   )
            {
                return -1
            }
            else
            {
              if ((MJDispose.CheckEqualQue(a) == MJDispose.CheckEqualQue(b))) 
              {
                return b-a;
              } 
              else 
              {
                  if (a!=0) {
                      let colour = CommonMJConfig.MahjongID[a].Color;
                      if (colour == CommonMJConfig.MineQueCard) 
                      {
                          return -1
                      } 
                      else 
                      {
                        return 1
                      }
                  } 
                  else
                  {
                      return -1;
                  }
              }
            }
        });
    }
  
  

    /** 麻将癞子排序 */
    static PengGangSort(penggangData)
    {
        penggangData.sort(function (a, b) 
        {
            return a.index-b.index
        });
    }


  //只是自己赢的时候在飞金币
  static DoPiaoAniByCoinData(data: pb.ICoinData[]) 
  {
      Log.w(" DoPiaoAniByCoinData  data  ",data    )
      if (data.length==0) 
      {
        return;
      }
      let toPos:number[] =[];
      for (let i = 0; i < data.length; i++) 
      {
        if ( data[i].coin > 0 ) 
        {
          toPos.push(data[i].idx);
        }
      }
      let goldPiaoData :pb.IId2Val[] =[] ;
      for (let i = 0; i < data.length; i++) 
      {
        if (data[i].coin < 0 ) 
        {
            for (let c = 0; c < toPos.length; c++) 
            {
                type Packet = typeof pb.Id2Val;
                let Packet:Packet = Manager.protoManager.getProto("pb.CoinData");
                let packet = new Packet();
                packet.key = data[i].idx;
                packet.value = toPos[c];
                goldPiaoData.push(packet);
            }
        }
      }

      Log.w(" DoPiaoAniByCoinData  goldPiaoData  ",goldPiaoData    )
      


      dispatch(MJEvent.PIAOGOLDANI,goldPiaoData);
  }

  static DoPiaoAniByKV(data: pb.IId2Val[]) 
  {
      if (data.length==0) 
      {
        return;
      }
      let toPos:number[] =[];
      for (let i = 0; i < data.length; i++) 
      {
        if ( data[i].value > 0 ) 
        {
          toPos.push(data[i].value);
        }
      }
      let goldPiaoData :pb.IId2Val[] =[] ;
      for (let i = 0; i < data.length; i++) 
      {
        if (data[i].value < 0 ) 
        {
            for (let c = 0; c < toPos.length; c++) 
            {
                type Packet = typeof pb.Id2Val;
                let Packet:Packet = Manager.protoManager.getProto("pb.CoinData");
                let packet = new Packet();
                packet.key = data[i].key;
                packet.value = toPos[c];
                goldPiaoData.push(packet);
            }
        }
      }
      dispatch(MJEvent.PIAOGOLDANI,goldPiaoData);
  }






  /**
   * @description  下一局游戏
   */
  NextGame()
  {
    //匹配场不是托管自动下一局并且有红中卡
    if (! CommonMJConfig.mjAutoNext) {
        dispatch(MJEvent.RESET_CARDS);
        MJC2SOperation.NextGameFinal()
    }


  }


  RemoveLookCard()
  {


    
  }



}