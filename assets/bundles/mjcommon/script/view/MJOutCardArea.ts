import { Config } from "../../../../scripts/common/config/Config";
import { Tool } from "../../../gamecommon/script/tools/Tool";
import { CommonMJConfig } from "../Config/CommonMJConfig";
import { MJTool } from "../logic/MJTool";
import MJDispose from "../Manager/MJDispose";
import MJNormalCard from "./MJNormalCard";
import MJOutCard from "./MJOutCard";

export default class MJOutCardArea  {


    private playerRoot : fgui.GComponent = null;
    private root : fgui.GComponent = null;
    private hand_com: fgui.GComponent = null;


    private cardOne:fgui.GButton =null;

    // 客户端坐标
    // private direction:number;
    
    private m_GObjectPool: fgui.GObjectPool=null;
   


    m_tableOut:Array<MJOutCard>=[];

    private m_TimerArr:number[]=[];

    public constructor(root : fgui.GComponent) 
    {
        this.root =root;
    }



    setInit()
    {
        this.m_GObjectPool =new fgui.GObjectPool()
        this.root.visible =true;


        this.BindEvent();



    }

    /**設置玩家客户端坐标方位 */
     SetDirectioni(direction: number,playerRoot:fairygui.GComponent,hand_com:fairygui.GComponent) 
    {
        this.playerRoot= playerRoot;
        this.hand_com= hand_com;
        // if (this.hand_com == null) {
        //     let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, CommonMJConfig.OutHandPath[direction])
        //     // Log.e ("MJOutCardArea  :  url ",url  );
        //     this.hand_com =   this.m_GObjectPool.getObject(url).asCom
        //     this.root.addChild(this.hand_com)
        //     this.hand_com.sortingOrder =99

        // }


    }
     



    BindEvent()
    {

    }

    /** 播放打出的牌的 手的特效 */
    PlayHandOutSpain(cardObj: fairygui.GObject,direction:number) 
    {
        // Log.e("PlayHandOutSpain  00  direction+1  : "  ,direction+1 )
        if (this.hand_com!=null) {

            //设置位置
            let rectFrom = cardObj.localToGlobalRect(0, 0, cardObj.width, cardObj.height);
            rectFrom = this.playerRoot.globalToLocalRect(rectFrom.x, rectFrom.y, rectFrom.width, rectFrom.height);
            this.hand_com.x= rectFrom.x;
            this.hand_com.y= rectFrom.y;
            this.hand_com.visible=true
            let hand_load3d = <fgui.GLoader3D> this.hand_com.getChild("n0")

            hand_load3d.visible=false;
            Manager.utils.PlaySpine(hand_load3d,"mjsp_shou","ani"+(direction+1),Config.BUNDLE_MJCOMMON,()=>{
                this.hand_com.visible=false
            })
        }
    }



    /** 生成一张牌并设置牌的位置  */
    AddOutCard(mjId: number,direction: number ,isChonglian=false) :MJOutCard
    {
        // Log.e("MJOutCardArea AddOutCard  this.direction:  ",direction)
        let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, CommonMJConfig.OutsPath[direction])
        // Log.e ("MJOutCardArea  :  url ",url  );
        let cardObj =   this.m_GObjectPool.getObject(url)
        this.root.addChild(cardObj)
        cardObj.visible =true;
        let cardItem = new MJOutCard(cardObj.asCom);
        cardItem.BaseSetCard(mjId,isChonglian);
        this.m_tableOut.push(cardItem)
        this.ShuaXinCurrentPos(cardObj,this.m_tableOut.length,direction);
        this.ShuaXinCurrenSprite(cardItem,this.m_tableOut.length,direction);
        //还需要去设置层级 
        this.ShuaXinSortingOrder(direction);


        

        if (!isChonglian) 
        {
            MJDispose.SetLastOutCard(cardItem)
            // cardItem.PlayHandOutSpain(cardObj,direction)

            this.PlayHandOutSpain(cardObj,direction);

            cardItem.SetActiveCard(false);
            let timerItem =  setTimeout(() => {
                cardItem.SetActiveCard(true);
                cardItem.PlayKsGuang(direction);
            }, 500);
            this.m_TimerArr.push(timerItem )
        }
        return cardItem
    }





    /** 刷新层级 */
    ShuaXinSortingOrder(direction: number) 
    {
        let hangCountNextCeng = 3
        if (direction ==CommonMJConfig.Direction.Right ) 
        {
            let rowCount = 6
            let orderArr = MJTool.GetSortHierarchyRightout(this.m_tableOut.length,rowCount,hangCountNextCeng);
            for (let i = 0; i < this.m_tableOut.length; i++) 
            {
                this.m_tableOut[i].GetObj().sortingOrder= orderArr[i];
            }
        }
        else if (direction ==CommonMJConfig.Direction.Left ) 
        {
            let rowCount = 6
            let orderArr = MJTool.GetSortHierarchyLeftout(this.m_tableOut.length,rowCount,hangCountNextCeng);
            // Log.e ( "ShuaXinSortingOrder   orderArr ",orderArr )
            for (let i = 0; i < this.m_tableOut.length; i++) 
            {
                this.m_tableOut[i].GetObj().sortingOrder= orderArr[i];
            }
        }
        else if (direction ==CommonMJConfig.Direction.Top ) 
        {
            let rowCount = 6
            let orderArr = MJTool.GetSortHierarchyRightout(this.m_tableOut.length,rowCount,hangCountNextCeng);
            // Log.e ( "ShuaXinSortingOrder   orderArr ",orderArr )
            for (let i = 0; i < this.m_tableOut.length; i++) 
            {
                this.m_tableOut[i].GetObj().sortingOrder= orderArr[i];
            }
        }





    }


    


   /** 刷新当前图片 */
   ShuaXinCurrenSprite(cardItem: MJOutCard, index: number, direction: number) 
   {
        let yuCount=6;  //一排几个
        let lieIndex=1  //当前第几列
        let hangIndex=1 //当前第几行

        let dieHang = 3 //第几行之后开始叠牌
        let cengCount = 0  

        let scalNum = 1
        if (direction == CommonMJConfig.Direction.Bottom ) 
        {
            yuCount=6;
            
            hangIndex= Math.ceil(index/yuCount)  
            lieIndex= index%yuCount 
            if (lieIndex==0) {
                lieIndex=yuCount
            }
            cengCount = Math.ceil(index/yuCount/dieHang)  

            if ( hangIndex <=  dieHang  ) 
            {

                if (hangIndex==1 ) 
                {
                    let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "mj_zij_feipai"+(lieIndex-1) )
                    cardItem.bgicon_gloder.icon =url
                    cardItem.mask_ogloader.icon =url
                }
                else if(hangIndex== 2)
                {
                    let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "mj_zij_feipai"+(lieIndex-1+6) )
                    cardItem.bgicon_gloder.icon =url
                    cardItem.mask_ogloader.icon =url
                }
                else if(hangIndex== 3)
                {
                    let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "mj_zij_feipai"+(lieIndex-1+6) )
                    cardItem.bgicon_gloder.icon =url
                    cardItem.mask_ogloader.icon =url
                }

            } 
            else 
            {
                let currenthang = hangIndex%dieHang
                if (currenthang==0) 
                {
                    currenthang=3
                }
                if (currenthang==1 ) 
                {
                    let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "mj_zij_feipai"+(lieIndex-1) )
                    cardItem.bgicon_gloder.icon =url
                    cardItem.mask_ogloader.icon =url
                }
                else if(currenthang== 2)
                {
                    let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "mj_zij_feipai"+(lieIndex-1+6) )
                    cardItem.bgicon_gloder.icon =url
                    cardItem.mask_ogloader.icon =url
                }
                else if(currenthang== 3)
                {
                    let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "mj_zij_feipai"+(lieIndex-1+6) )
                    cardItem.bgicon_gloder.icon =url
                    cardItem.mask_ogloader.icon =url
                }
            }
        } 
        else if (direction == CommonMJConfig.Direction.Top ) 
        {
            yuCount=6;
            
            hangIndex= Math.ceil(index/yuCount)  
            lieIndex= index%yuCount 
            if (lieIndex==0) {
                lieIndex=yuCount
            }
            cengCount = Math.ceil(index/yuCount/dieHang)  

            if ( hangIndex <=  dieHang  ) 
            {

                if (hangIndex==1 ) 
                {
                    let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "mj_shang_feipai"+(lieIndex-1) )
                    cardItem.bgicon_gloder.icon =url
                    cardItem.mask_ogloader.icon =url
                }
                else if(hangIndex== 2)
                {
                    let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "mj_shang_feipai"+(lieIndex-1+6) )
                    cardItem.bgicon_gloder.icon =url
                    cardItem.mask_ogloader.icon =url
                }
                else if(hangIndex== 3)
                {
                    let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "mj_shang_feipai"+(lieIndex-1+6) )
                    cardItem.bgicon_gloder.icon =url
                    cardItem.mask_ogloader.icon =url
                }

            } 
            else 
            {
                let currenthang = hangIndex%dieHang
                if (currenthang==0) 
                {
                    currenthang=3
                }
                if (currenthang==1 ) 
                {
                    let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "mj_shang_feipai"+(lieIndex-1) )
                    cardItem.bgicon_gloder.icon =url
                    cardItem.mask_ogloader.icon =url
                }
                else if(currenthang== 2)
                {

                    let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "mj_shang_feipai"+(lieIndex-1+6) )
                    cardItem.bgicon_gloder.icon =url
                    cardItem.mask_ogloader.icon =url
                }
                else if(currenthang== 3)
                {
                    let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "mj_shang_feipai"+(lieIndex-1+6) )
                    cardItem.bgicon_gloder.icon =url
                    cardItem.mask_ogloader.icon =url
                }
            }
        } 
        else if (direction == CommonMJConfig.Direction.Left ) 
        {
            yuCount=6;
            
            hangIndex= Math.ceil(index/yuCount)  
            lieIndex= index%yuCount 
            if (lieIndex==0) {
                lieIndex=yuCount
            }
            cengCount = Math.ceil(index/yuCount/dieHang)  

            if ( hangIndex <=  dieHang  ) 
            {

                if (hangIndex==1 ) 
                {
                    let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "mj_zuo_feipai"+(lieIndex-1) )
                    cardItem.bgicon_gloder.icon =url
                    cardItem.mask_ogloader.icon =url
                }
                else if(hangIndex== 2)
                {   

                    // Log.e ("MJOutCardArea  :  lieIndex ",lieIndex  );
                    let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "mj_zuo_feipai"+(lieIndex-1+6) )
                    cardItem.bgicon_gloder.icon =url
                    cardItem.mask_ogloader.icon =url
                }
                else if(hangIndex== 3)
                {
                    let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "mj_zuo_feipai"+(lieIndex-1+6) )
                    cardItem.bgicon_gloder.icon =url
                    cardItem.mask_ogloader.icon =url
                }

            } 
            else 
            {
                let currenthang = hangIndex%dieHang
                if (currenthang==0) 
                {
                    currenthang=3
                }
                if (currenthang==1 ) 
                {
                    let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "mj_zuo_feipai"+(lieIndex-1) )
                    cardItem.bgicon_gloder.icon =url
                    cardItem.mask_ogloader.icon =url
                }
                else if(currenthang== 2)
                {

                    let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "mj_zuo_feipai"+(lieIndex-1+6) )
                    cardItem.bgicon_gloder.icon =url
                    cardItem.mask_ogloader.icon =url
                }
                else if(currenthang== 3)
                {
                    let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "mj_zuo_feipai"+(lieIndex-1+6) )
                    cardItem.bgicon_gloder.icon =url
                    cardItem.mask_ogloader.icon =url
                }
            }
        } 
        else if (direction == CommonMJConfig.Direction.Right ) 
        {
            yuCount=6;
            hangIndex= Math.ceil(index/yuCount)  
            lieIndex= index%yuCount 
            if (lieIndex==0) {
                lieIndex=yuCount
            }
            cengCount = Math.ceil(index/yuCount/dieHang)  

            if ( hangIndex <=  dieHang  ) 
            {

                if (hangIndex==1 ) 
                {
                    let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "mj_you_feipai"+(lieIndex-1) )
                    cardItem.bgicon_gloder.icon =url
                    cardItem.mask_ogloader.icon =url
                }
                else if(hangIndex== 2)
                {   

                    // Log.e ("MJOutCardArea  :  lieIndex ",lieIndex  );
                    let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "mj_you_feipai"+(lieIndex-1+6) )
                    cardItem.bgicon_gloder.icon =url
                    cardItem.mask_ogloader.icon =url
                }
                else if(hangIndex== 3)
                {
                    let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "mj_you_feipai"+(lieIndex-1+6) )
                    cardItem.bgicon_gloder.icon =url
                    cardItem.mask_ogloader.icon =url
                }

            } 
            else 
            {
                let currenthang = hangIndex%dieHang
                if (currenthang==0) 
                {
                    currenthang=3
                }
                if (currenthang==1 ) 
                {
                    let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "mj_you_feipai"+(lieIndex-1) )
                    cardItem.bgicon_gloder.icon =url
                    cardItem.mask_ogloader.icon =url
                }
                else if(currenthang== 2)
                {

                    let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "mj_you_feipai"+(lieIndex-1+6) )
                    cardItem.bgicon_gloder.icon =url
                    cardItem.mask_ogloader.icon =url
                }
                else if(currenthang== 3)
                {
                    let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "mj_you_feipai"+(lieIndex-1+6) )
                    cardItem.bgicon_gloder.icon =url
                    cardItem.mask_ogloader.icon =url
                }
            }
        } 






   }


   

    /** 刷新某一张牌的位置 */
    ShuaXinCurrentPos(cardObj:fgui.GObject,index:number,direction: number)
    {
        // Log.e ("MJOutCardArea  :  index ",index  );
        let tempX=0;
        let tempy=0;

        let xoff=-1; //X 轴偏差
        let yoff=-1; // y 轴偏差
        let yuCount=6;  //一排几个
        let lieIndex=1  //当前第几列
        let hangIndex=1 //当前第几行

        let startX=0 //起始位置
        let startY=0 //起始位置


        let dieHang = 3 //第几行之后开始叠牌
        let dieX =0   
        let dieY =0 
        let cengCount = 0  
        let scalNum = 1

        let indexTemp = index%18
        if (indexTemp==0) {
            indexTemp =18
        }

        if (direction == CommonMJConfig.Direction.Bottom ) 
        {
            startX =70;
            startY =40;
            xoff=-9;
            yoff=-20;
            yuCount=6;
            
            hangIndex= Math.ceil(index/yuCount)  
            lieIndex= index%yuCount 
            if (lieIndex==0) {
                lieIndex=yuCount
            }
            cengCount = Math.ceil(index/yuCount/dieHang)  
            dieX = 0  
            dieY = -8

            tempX= cengCount*dieX+CommonMJConfig.OutCardsPosition[direction][indexTemp].x
            tempy=cengCount*dieY+CommonMJConfig.OutCardsPosition[direction][indexTemp].y


        } 
        else if (direction == CommonMJConfig.Direction.Right ) 
        {

            startX =3;
            startY =302;

            xoff=-11;
            yoff=-20;
            yuCount=6;
            hangIndex= Math.ceil(index/yuCount)  
            lieIndex= index%yuCount 
            if (lieIndex==0) {
                lieIndex=yuCount
            }
            cengCount = Math.ceil(index/yuCount/dieHang)  
            dieX = 1 
            dieY = -17 
            tempX= cengCount*dieX+CommonMJConfig.OutCardsPosition[direction][indexTemp].x
            tempy=cengCount*dieY+CommonMJConfig.OutCardsPosition[direction][indexTemp].y

        }
        else if (direction == CommonMJConfig.Direction.Top ) 
        {

            startX =217;
            startY =97;

            xoff=-2;
            yoff=-15;
            yuCount=6;
            hangIndex= Math.ceil(index/yuCount)  
            lieIndex= index%yuCount 
            if (lieIndex==0) {
                lieIndex=yuCount
            }
            cengCount = Math.ceil(index/yuCount/dieHang)  
            dieX = 0  
            dieY = -18

            tempX= cengCount*dieX+CommonMJConfig.OutCardsPosition[direction][indexTemp].x
            tempy=cengCount*dieY+CommonMJConfig.OutCardsPosition[direction][indexTemp].y
        }
        else if (direction == CommonMJConfig.Direction.Left ) 
        {

            startX =483;
            startY =200;

            xoff= -16;
            yoff=-20;
            yuCount=6;
            hangIndex= Math.ceil(index/yuCount)  
            lieIndex= index%yuCount 
            if (lieIndex==0) {
                lieIndex=yuCount
            }

            cengCount = Math.ceil(index/yuCount/dieHang)  
            dieX = 0  
            dieY = -18

            tempX= cengCount*dieX+CommonMJConfig.OutCardsPosition[direction][indexTemp].x
            tempy=cengCount*dieY+CommonMJConfig.OutCardsPosition[direction][indexTemp].y

        }
        cardObj.x = tempX;
        cardObj.y = tempy;

    }


    SetScaleObj(cardObj:fgui.GObject,scalNum)
    {
        cardObj.scaleX=scalNum
        cardObj.scaleY=scalNum

    }


    /** 点炮的闪电 */
    SHowOutCardHuEff(direction:number)
    {
        if (this.m_tableOut!=null && this.m_tableOut.length!=0 ) 
        {
           this.m_tableOut[this.m_tableOut.length-1].PlayDianPaoSD()
        }
    }

    //重连的时候最后一张就是出的牌
    OnSetOutCardPointShow() 
    {
        if (this.GetLastOutCard() !=null) 
        {
            this.GetLastOutCard().SetActivezhishideng(true)
            MJDispose.SetLastOutCard(this.GetLastOutCard())
        }
       
    }

    // 不能用啊 有可能别人胡走了
    // GetOutHongZhongCount():number
    // {
    //     let count =0
    //     if (CommonMJConfig.MjRoomRule.isHongZhongGang) 
    //     {
    //         for (let index = 0; index < this.m_tableOut.length; index++) 
    //         {
    //             if (this.m_tableOut[index].GetCardId() ==35 || this.m_tableOut[index].GetCardId() ==135   ) {
    //                 count = count+1
    //             }
    //         }
    //     } 
    //     return count
    // }



    /** 获取最后打牌区域的牌 */
    GetLastOutCard():MJOutCard
    {
        if (this.m_tableOut!=null && this.m_tableOut.length!=0 ) 
        {
            return this.m_tableOut[this.m_tableOut.length-1]
        }
        else
        {
            return null
        }
    }








    /** 删除出牌 */
    RemoveLastOutCard()
    {
        if (this.m_tableOut!=null && this.m_tableOut.length!=0 ) 
        {
            // if (CommonMJConfig.LastOutCard!=null) 
            // {
            //     CommonMJConfig.LastOutCard.SetActivezhishideng(false)
            //     Log.e("删除了最后一张牌  CommonMJConfig.LastOutCard ")
            //     // CommonMJConfig.LastOutCard =null;
            // }
            this.m_tableOut[this.m_tableOut.length-1].SetActivezhishideng(false)
            this.m_tableOut[this.m_tableOut.length-1].GetObj().dispose();
            this.m_tableOut.pop();

        }
    }


    ReSet()
    {
        this.StopCoroutineTweenAni()
        for (let index = 0; index < this.m_tableOut.length; index++) {
            // this.m_tableOut[index].GetObj().dispose()
            this.m_GObjectPool.returnObject(this.m_tableOut[index].GetObj() );
        }
        this.m_tableOut=[]
        this.m_GObjectPool.clear()

        // if (this.hand_com!=null) {
        //     this.hand_com.visible=false
        // }

    }






    StopCoroutineTweenAni()
    {
        for (let index = 0; index < this.m_tableOut.length; index++) 
        {
            this.m_tableOut[index].StopCoroutineTweenAni()
        }

        if (this.m_TimerArr !=null ) 
        {
            // Log.w(" StopCoroutineTweenAni MJOutCardArea  this.m_TimerArr.length ",this.m_TimerArr.length)
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


