
import { Config } from "../../../../scripts/common/config/Config";
import { MahColor, MahHPGOPerate, MahHu } from "../../../../scripts/def/GameEnums";
import { RoomManager } from "../../../gamecommon/script/manager/RoomManager";
import { Tool } from "../../../gamecommon/script/tools/Tool";
import { CommonMJConfig } from "../Config/CommonMJConfig";
import MJDispose from "../Manager/MJDispose";
import MJManager from "../Manager/MJManager";
import MJCard from "../view/MJCard";
import MJNormalCard from "../view/MJNormalCard";

export class MJTool  {

     /**
      * @description 播放声音
      * @param pathTab 音效路径
      * @param _type 声音 播放器
      */
    static PlaySound(pathArr :string[] ,buddle:string)
    {
        let intRodom = Tool.GetRandomNum(1,pathArr.length);
        // Log.e (" PlaySound  intRodom  "+intRodom   );
        let name = pathArr[intRodom-1]
        // Log.e(" PlaySound name  ",name)
        Manager.globalAudio.playEffect("audio/"+name,buddle);
    }





     /**
      * @description 判断表里是否有
      * @param arg 数组  let a = [1, 2, 3, 4, 5, 6];
      * @param temp 具体值
      */
      static JudgeIsHave(arg :  {} , temp:number){
        let isHave= false;
        if (arg==null || arg=={}  ) {
            return false;
        } else {
            for (const [key, val] of Object.entries(arg)) {
                // Log.e("IsWeiCard : ",key, val)
                if (Number(val)== Number(temp)) 
                {
                    isHave =true;
                    return isHave
                }
            
            }
        }
        return isHave;
    }


    /**
     *  @description 癞子玩法 这张牌是否 是缺的花色
     * @param card 牌值
     */
    static LaiZiCheckEqualQue(card:number) {
        if (card !=null&& card!=0) 
        {
            // Log.e ("LaiZiCheckEqualQue card : ",card );
            let colour = CommonMJConfig.MahjongID[card].Color;
            if (MJTool.JudgeIsHave(CommonMJConfig.TingYong, card)) 
            {
                return false;
            } 
            else 
            {
                return colour == CommonMJConfig.MineQueCard;
            }
        } 
        else 
        {
            return true;
        }


    } 


     /**
      * @description 分割癞子牌和常规牌 组合
      * @param cards 数组  let a = [1, 2, 3, 4, 5, 6];
      */
      static SplitLaiZiCards(cards :  Array<number>)
      {
  
        let laiZiArr :  Array<number>;
        let commonArr :  Array<number>;

        for (const carditem of cards) {
            
            if (MJTool.JudgeIsHave(CommonMJConfig.TingYong,carditem) ) {
                
                laiZiArr.splice(laiZiArr.length,0,carditem);
            } 
            else {
                commonArr.splice(commonArr.length,0,carditem);
            }

        }
        return [laiZiArr, laiZiArr]
      }


     /**
      * @description 打出牌后 是否还缺
      */
      static NowHasQueCard()
      {
        let mineCards= CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom]
        for (const [key, val] of Object.entries( mineCards )) 
        {
            let count = Number(mineCards[key] );
            if ( count  >0 ) 
            {
                if ( !this.JudgeIsHave(CommonMJConfig.TingYong, Number(key)) && CommonMJConfig.MineQueCard == CommonMJConfig.MahjongID[Number(key)].Color ) 
                {
                    return false ;
                }
            }
        }
        return true;
      }


     /**
      * @description  是否拥有缺的牌
      */
      static HasQueCard()
      {
        let mineCards= CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom]
        for (const [key, val] of Object.entries( mineCards )) 
        {
            let count = Number(mineCards[key] );
            if ( count  >0 ) 
            {
                if ( !this.JudgeIsHave(CommonMJConfig.TingYong, Number(key)) && CommonMJConfig.MineQueCard == CommonMJConfig.MahjongID[Number(key)].Color ) 
                {
                    MJDispose.SetAlreadyQueState(false)
                    return;
                }
            }
        }
        MJDispose.SetAlreadyQueState(true)
      }




     /**
      * @description 服务器坐标转换成客户端坐标 位置变换方位
      */
      static PositionToDirection(position: number):number
      {

        

        let direct = CommonMJConfig.Direction.Bottom;
        let playerCount = RoomManager.tableCommon.playerCount;

        if (playerCount >= 3) 
        {
            if (position == RoomManager.SelfPosition) 
            {
                direct = CommonMJConfig.Direction.Bottom;
            }
            else if(position == RoomManager.SelfPosition - 1 || position == RoomManager.SelfPosition + (playerCount - 1) )
            {
                direct = CommonMJConfig.Direction.Left;
            }
            else if( position == RoomManager.SelfPosition + 1 || position == RoomManager.SelfPosition - (playerCount - 1) )
            {
                direct = CommonMJConfig.Direction.Right;
            }
            else if( position == RoomManager.SelfPosition + playerCount / 2 || position == RoomManager.SelfPosition - playerCount / 2 )
            {
                direct = CommonMJConfig.Direction.Top;
            }

        } 
        else
        {
            if (position == RoomManager.SelfPosition)
            {
                direct = CommonMJConfig.Direction.Bottom;
            } 
            else 
            {
                direct = CommonMJConfig.Direction.Top;
            }
        }
        // Log.e("PositionToDirection  position :  ",position);
        // Log.e("PositionToDirection  direct :  ",direct);

          return direct;
      }

     /**
      * @description  获取碰牌相对位置
      * @param frompos 打出碰的玩家坐标
      * @param pengPos 碰的玩家坐标
      */
      static AltPositionToDirection(frompos: number, pengPos: number){
            let  direct = CommonMJConfig.AltOri.Front;
            let playerCount = RoomManager.tableCommon.playerCount;
            if (playerCount >= 3) {
                if (frompos == pengPos - 1 || frompos == pengPos + (playerCount - 1) )
                {
                    direct = CommonMJConfig.Direction.Left
                }
                else if (frompos == pengPos + 1 || frompos == pengPos - (playerCount - 1)) 
                {
                    direct = CommonMJConfig.Direction.Right
                }
                else if (frompos == pengPos + playerCount / 2 || frompos == pengPos - playerCount / 2)
                {
                    direct = CommonMJConfig.Direction.Top
                }

            }
            else
            {
                direct = CommonMJConfig.AltOri.Front;
            }
          return direct;
    }
      


     /**
      * @description  获取是否是出牌状态
      * @param cardCount 手里牌的数量
      */
    static GetIsCanChuPai(cardCount :number):boolean
    {
        return cardCount % 3 == 2
    }


    /** KV 转成数组 */
    static TableKVCopyToList(mineCards) :number[]
    {
        let temp:number[] = [];
        for (const [key, val] of Object.entries( mineCards )) 
        {
            let count = Number(mineCards[key] );
            if ( count  >0 ) 
            {
                for (let i = 0; i < count; i++) 
                {
                    temp.push(Number(key))
                }
            }
        }
        return temp
    }

    /** 找到当前花色的张数 */
    static GetHasCardCountByColor(color: MahColor) 
    {
        let mineCards = CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom];
        let countAll =0;

        for (const [key, val] of Object.entries( mineCards )) 
        {
            let count = Number(mineCards[key] );
            if ( count  >0 ) 
            {
                if ( !this.JudgeIsHave(CommonMJConfig.TingYong, Number(key)) && color == CommonMJConfig.MahjongID[Number(key)].Color ) 
                {
                    countAll=countAll+count
                }

            }
        }
        // Log.e("  GetHasCardCountByColor  countAll :",countAll)
        return countAll
    }



    /** 排序 胡牌顺序 */
    static SortHuPaiType(tempCardsArr: Array<number>) 
    {
        tempCardsArr.sort(function (a, b) {
            let aa = CommonMJConfig.SortWanFaType.xlhzmj_sort
            if (MJTool.JudgeIsHave(aa, a) && !MJTool.JudgeIsHave(aa, b) ) 
            {
                return -1
            }
            else if(!MJTool.JudgeIsHave(aa, a) && MJTool.JudgeIsHave(aa, b) ) 
            {
                return 1
            }
            else if(!MJTool.JudgeIsHave(aa, a) && !MJTool.JudgeIsHave(aa, b) ) 
            {
                return a-b
            }
            else if( MJTool.JudgeIsHave(aa, a) && MJTool.JudgeIsHave(aa, b) ) 
            {
                return MJTool.GetTabIndex(aa,a)-  MJTool.GetTabIndex(aa,b)
            }
        });
    }

    static SortHuPaiTypeCenterHu(tempCardsArr: Array<number>) 
    {
        tempCardsArr.sort(function (a, b) {
            let aa = CommonMJConfig.SortWanFaType.xlhzmjCenterHu_sort
            if (MJTool.JudgeIsHave(aa, a) && !MJTool.JudgeIsHave(aa, b) ) 
            {
                return -1
            }
            else if(!MJTool.JudgeIsHave(aa, a) && MJTool.JudgeIsHave(aa, b) ) 
            {
                return 1
            }
            else if(!MJTool.JudgeIsHave(aa, a) && !MJTool.JudgeIsHave(aa, b) ) 
            {
                return a-b
            }
            else if( MJTool.JudgeIsHave(aa, a) && MJTool.JudgeIsHave(aa, b) ) 
            {
                return MJTool.GetTabIndex(aa,a)-  MJTool.GetTabIndex(aa,b)
            }
        });
    }





    static GetTabIndex(arrtemp: number[], b: number) 
    {
        for (let i = 0; i < arrtemp.length; i++) 
        {
            if (arrtemp[i] == b ) 
            {
                return i
            }
            
        }
        return 0
    }



    static GetSortHierarchy(Count: number, rowCount: number,hangCountNextCeng:number) :number[]
    {
        let resultArr:number[]=[Count];
        let allCol = Math.ceil(Count  / rowCount);
        Log.e("Count : "+Count + "    allCol:" + allCol);
        let pos;
        let index = 0;
        let cengTotalCount = rowCount*hangCountNextCeng
        let yuNum = Count % (cengTotalCount);
        for (let i = 0; i < allCol; i++)
        {
            for (let j = 0; j < rowCount; j++)
            {
                if (Count <= cengTotalCount) 
                {
                    pos = (allCol - i - 1) * rowCount + j;
                }
                else
                {
                    if (index < cengTotalCount) 
                    {
                        pos = (allCol - i - 1) * rowCount + j -yuNum;
                    }
                    else
                    {
                        pos = cengTotalCount + (allCol - i - 1) * rowCount + j -yuNum ;
                    }

                }
                if (pos < Count)
                {
                    Log.e("pos:" + pos + "    index:" + index);
                    resultArr[index] = pos;
                    index++;
                }
            }
        }
        return resultArr;
    }

    // 左侧胡类似
    static GetSortHierarchyMore(Count: number, rowCount: number,hangCountNextCeng:number) :number[]
    {
        let resultArr:number[]=[Count];
        let allCol = Math.ceil(Count  / rowCount);
        let pos;
        let index = 0;
        let cengTotalCount = rowCount*hangCountNextCeng
        let yuNum = Count % (cengTotalCount);
        if (yuNum==0) {
            yuNum=cengTotalCount
        }
        let totalCeng =  Math.ceil(Count  / cengTotalCount);
        let lastCurentCol =allCol%hangCountNextCeng
        if (lastCurentCol==0) 
        {
            lastCurentCol = hangCountNextCeng
        }
        //最后一层 最后一列 能不能放满

        let isman = true

        if (Count%rowCount !=0 ) 
        {
            isman =false
        }


        // Log.e("GetSortHierarchyMore  Count : "+Count + "    rowCount:" + rowCount +" hangCountNextCeng : "+hangCountNextCeng +"    allCol: "+allCol  +"   cengTotalCount : "+cengTotalCount  );
        // Log.w ( "GetSortHierarchyMore  yuNum   : "+ yuNum +"totalCeng    :"+totalCeng )

        for (let i = 0; i < allCol; i++)
        {
            for (let j = 0; j < rowCount; j++)
            {
                if (index >= Count) 
                {
                     break;   
                }

                if (Count <= cengTotalCount) 
                {


                    let xx  =Math.ceil( (index+1)  / rowCount)
                    if (xx ==0) 
                    {
                        xx = hangCountNextCeng   
                    }

                    let curentCengLie =  (index-(xx-1)*rowCount)%rowCount +1



                    if (lastCurentCol == xx ) //最后一列不能放满  并且  当前位置就是最后一列
                    {
                        pos =  curentCengLie-1
                    }
                    else
                    {
                        pos = (yuNum-1) -(rowCount*(  xx  )  )+ curentCengLie
                    }

                }
                else
                {
                    if (index < cengTotalCount) 
                    {
                        let xx   =Math.ceil( (index+1)  / rowCount)
                        pos = cengTotalCount -(rowCount*(  xx  )  )+ index%rowCount
                    }
                    else
                    {
                        let dangqiancengshu = Math.ceil( (index+1)  / cengTotalCount)
                        let xx  =Math.ceil( (index+1)  / rowCount)%hangCountNextCeng
                        if (xx ==0) 
                        {
                            xx = hangCountNextCeng   
                        }
                        // Log.w ( "GetSortHierarchyMore  index   : "+ index +" XX : "+xx +" dangqiancengshu:  "+dangqiancengshu )
                        if (totalCeng == dangqiancengshu ) //最后一层的时候 单独处理
                        {
                            //当前层的第几列
                            
                            let curentCengIndex = (index+1)%cengTotalCount
                            if (curentCengIndex== 0)
                            {
                                curentCengIndex = cengTotalCount
                            }
                            let curentCengLie =  curentCengIndex%rowCount
                            if (curentCengLie==0 ) 
                            {
                                curentCengLie= rowCount
                            }
                            // pos = cengTotalCount*(dangqiancengshu-1) + (yuNum-1)- (rowCount*(  xx-1  )) + curentCengLie 

                            if (!isman && lastCurentCol == xx ) //最后一列不能放满  并且  当前位置就是最后一列
                            {
                                pos = cengTotalCount*(dangqiancengshu-1) + curentCengLie-1
                                // Log.w ( "GetSortHierarchyMore  pos  锤子哦  : "+ pos )
                            }
                            else
                            {

                                // Log.w ( "GetSortHierarchyMore  不是吧  cengTotalCount : "+ cengTotalCount+" dangqiancengshu:  "+dangqiancengshu )
                                // Log.w ( "GetSortHierarchyMore  不是吧  yuNum : "+ yuNum+"    rowCount:  "+rowCount )
                                // Log.w ( "GetSortHierarchyMore  不是吧  xx :  "+ xx+"   curentCengLie:  "+curentCengLie )
                                pos = cengTotalCount*(dangqiancengshu-1)+(yuNum-1) -(rowCount*(  xx  )  )+ curentCengLie
                                // Log.w ( "GetSortHierarchyMore  不是吧  : "+ pos )
                            }


                            // Log.w("GetSortHierarchyMore  ffffffff  pos:" + pos + "    index:" + index);
                        } 
                        else
                        {
                            pos = cengTotalCount*dangqiancengshu -(rowCount*(  xx  )  )+ index%rowCount
                        }
                        // Log.w("GetSortHierarchyMore  nice  pos:" + pos + "    index:" + index);
                    }

                }
                if (pos < Count)
                {
                    // Log.w("GetSortHierarchyMore   pos:" + pos + "    index:" + index);
                    resultArr[index] = pos;
                    index++;
                }
            }
        }
        return resultArr;
    }


    static GetSortHierarchy2(Count: number, rowCount: number) :number[]
    {
        let resultArr:number[]=[Count];
        // let allCol = (Count - 1) / rowCount + 1;
        let allCol = Math.ceil(Count  / rowCount);
        //Debug.LogError("allCol:" + allCol);
        let pos;
        let index = 0;
        let yuNum = Count % rowCount;
        for (let i = 0; i < allCol; i++)
        {
            for (let j = 0; j < rowCount; j++)
            {

                if (index <= Count - 1)
                {
                    if (i >= rowCount - 1 && yuNum != 0 ) //最后一行并且没有整除
                    {
                        pos = i * rowCount+ yuNum -j-1 ;
                    }
                    else
                    {
                        pos = (i + 1) * rowCount - j - 1;
                    }
                    if (pos < Count)
                    {
                        //Debug.LogError("GetSortHierarchy2 pos:" + pos + "    index:" + index);
                        resultArr[index] = pos;
                        index++;
                    }
                }
            }
        }

        return resultArr

    }



    static GetSortHierarchyRightout(Count: number, rowCount: number,hangCountNextCeng:number) :number[]
    {
        let resultArr:number[]=[Count];
        let allCol = Math.ceil(Count  / rowCount);
        let pos;
        let index = 0;
        let cengTotalCount = rowCount*hangCountNextCeng
        let yuNum = Count % (cengTotalCount)
        if (yuNum == 0 ) 
        {
            yuNum =   cengTotalCount 
        }
        let totalCeng =  Math.ceil(Count  / cengTotalCount);
        for (let i = 0; i < allCol; i++)
        {
            for (let j = 0; j < rowCount; j++)
            {
                if (index >= Count) 
                {
                     break;   
                }
                if (Count <= cengTotalCount ) //只有一层的时候
                {
                    pos = yuNum -index-1 
                } 
                else //多层的时候
                {
                    let curenCeng =  Math.ceil( (index+1)  / cengTotalCount)
                    let curentCengIndex = (index+1) % cengTotalCount
                    if (curentCengIndex==0 ) 
                    {
                        curentCengIndex=cengTotalCount
                    }
                    if (totalCeng == curenCeng) //最后一层
                    {
                        pos = (curenCeng-1 )*cengTotalCount +yuNum -curentCengIndex
                    } else {
                        pos = curenCeng*cengTotalCount - curentCengIndex
                    }
                }
                if (pos < Count)
                {
                    // Log.w("GetSortHierarchyMore   pos:" + pos + "    index:" + index);
                    resultArr[index] = pos;
                    index++;
                }
            }
        }
        return resultArr;
    }


    static GetSortHierarchyLeftout(Count: number, rowCount: number,hangCountNextCeng:number) :number[]
    {
        let resultArr:number[]=[Count];
        let allCol = Math.ceil(Count  / rowCount);
        let pos;
        let index = 0;
        let cengTotalCount = rowCount*hangCountNextCeng
        let yuNum = Count % (cengTotalCount)
        if (yuNum == 0 ) 
        {
            yuNum =   cengTotalCount 
        }
        //最后一行剩余几个
        let yuNumHang = Count % (rowCount)
        if (yuNumHang==0 ) {
            yuNumHang=rowCount
        }

        let totalCeng =  Math.ceil(Count  / cengTotalCount);
        let lastCurentCol =allCol%hangCountNextCeng
        if (lastCurentCol==0) 
        {
            lastCurentCol = hangCountNextCeng
        }
        // Log.e( "GetSortHierarchyLeftout  Count  "+Count+  " yuNum =  "+yuNum +"    yuNumHang :"+yuNumHang  )
        let maxHangLastCeng   = allCol % hangCountNextCeng
        if (maxHangLastCeng == 0) 
        {
            maxHangLastCeng=hangCountNextCeng
        }
        // Log.e( "GetSortHierarchyLeftout  maxHangLastCeng  "+maxHangLastCeng  )

        for (let i = 0; i < allCol; i++)
        {
            for (let j = 0; j < rowCount; j++)
            {
                if (index >= Count) 
                {
                     break;   
                }
                if (Count <= cengTotalCount ) //只有一层的时候
                {
                    let curentHang   =Math.ceil( (index+1)  / rowCount)
                    let currentLie  = (index+1)%rowCount
                    if (currentLie ==0) 
                    {
                        currentLie =rowCount
                    }
                    // Log.e( "GetSortHierarchyLeftout  curentHang  "+curentHang+  " currentLie =  "+currentLie +"    index :"+index  )

                    if (curentHang == maxHangLastCeng) //最后一行的时候
                    {
                        pos = currentLie-1
                    }
                    else
                    {
                        pos = Count-curentHang*rowCount+currentLie-1
                    }
                } 
                else //多层的时候
                {
                    let curenCeng =  Math.ceil( (index+1)  / cengTotalCount)
                    let curentCengIndex = (index+1) % cengTotalCount
                    if (curentCengIndex==0 ) 
                    {
                        curentCengIndex=cengTotalCount
                    }
                    let curentHang   = Math.ceil( (index+1)  / rowCount) % hangCountNextCeng
                    if (curentHang == 0) {
                        curentHang =hangCountNextCeng
                    }
                    let currentLie  = (index+1)%rowCount
                    if (currentLie ==0) 
                    {
                        currentLie =rowCount
                    }
                    // Log.e( "GetSortHierarchyLeftout  curenCeng  "+curenCeng  )
                    if (totalCeng == curenCeng) //最后一层
                    {
                        let curentHang   = Math.ceil( (index+1)  / rowCount)%hangCountNextCeng
                        // Log.e( "GetSortHierarchyLeftout  curentHang  "+curentHang  )
                        // Log.e( "GetSortHierarchyLeftout  currentLie  "+currentLie  )
                        if (curentHang == maxHangLastCeng) //最后一行的时候
                        {
                            pos = (curenCeng-1) *cengTotalCount+   currentLie-1
                        }
                        else
                        {
                            // Log.e( "GetSortHierarchyLeftout  不是最后一行  "  )
                            pos = Count-curentHang*rowCount+currentLie-1
                        }
                    } else {

                        pos = curenCeng*cengTotalCount -curentHang*rowCount+currentLie-1
                    }
                }
                if (pos < Count)
                {
                    // Log.w("GetSortHierarchyLeftout   pos:" + pos + "    index:" + index);
                    resultArr[index] = pos;
                    index++;
                }
            }
        }
        return resultArr;
    }

    //如果有手上摸得牌name手上的那张牌坊到最右侧
    static SetSelfHandCardProp(list:fairygui.GList)
    {
        list.removeChildrenToPool()
        let mineCards = CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom];
        // Log.w(" SetSelfHandCardProp 刷新 mineCards  : ",mineCards);
        let handCardArr =MJTool.TableKVCopyToList(mineCards)
        dispatch("GetSelfMoCardId")
        // Log.w(" SetSelfHandCardProp 刷新 CommonMJConfig.selfMoCard  : ",CommonMJConfig.selfMoCard);
        // Log.w(" SetSelfHandCardProp 刷新 handCardArr  : ",handCardArr);
        if (CommonMJConfig.selfMoCard!=null && CommonMJConfig.selfMoCard !=0   )  
        {
            for (let index = 0; index < handCardArr.length; index++) 
            {
                if (CommonMJConfig.selfMoCard == handCardArr[index] ) 
                {
                    handCardArr.splice(index,1)
                    break;
                }
            }
        }
        MJManager.CardSortByLaiZiAndQue(handCardArr);
        for (let i = 0; i < handCardArr.length; i++) {
            let item: fgui.GButton = list.addItemFromPool().asButton;
            let cardItem = new MJNormalCard(item);
            // cardItem.setInit(false)
            cardItem.BaseSetCard(handCardArr[i])
            item.asButton.getChild("select").visible =false;
            item.asButton.getChild("mask").visible =false;
            item.data = {cardID:handCardArr[i],index:i,ismoCard:false}
        }
        if (CommonMJConfig.selfMoCard!=null && CommonMJConfig.selfMoCard !=0   )  
        {
            let item: fgui.GButton = list.addItemFromPool().asButton;
            let cardItem = new MJNormalCard(item);
            // cardItem.setInit(false)
            cardItem.BaseSetCard(CommonMJConfig.selfMoCard)
            item.asButton.getChild("select").visible =false;
            item.asButton.getChild("mask").visible =false;
            item.data = {cardID:CommonMJConfig.selfMoCard,index:0,ismoCard:true} 
        }
    }



}