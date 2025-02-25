import { Config } from "../../../../scripts/common/config/Config";
import { CommonMJConfig } from "../Config/CommonMJConfig";
import { MJTool } from "../logic/MJTool";
import MJNormalCard from "./MJNormalCard";


export default class MJHuCardArea  {




    private root : fgui.GComponent = null;

    private cardOne:fgui.GButton =null;
 
    // 客户端坐标
    // private direction:number;
    
    private m_GObjectPool: fgui.GObjectPool=null;
   
    //所有胡的牌
    obj_HuCards : MJNormalCard[]=[];


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





    BindEvent()
    {

    }




    AddHuCard(direction: number, data: pb.IMahHuData, huori: number, isreconnection: boolean) :MJNormalCard
    {
        let mjId = data.mjId;
        let isZiMo = (data.fromIndex == data.huIndex);

        // Log.e("MJOutCardArea AddOutCard  this.direction:  ",direction)
        let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, CommonMJConfig.HuCardPath[direction])
        // Log.e ("MJOutCardArea  :  url ",url  );
        let cardObj =   this.m_GObjectPool.getObject(url)
        this.root.addChild(cardObj)
        cardObj.visible =true;
        let eff_load3d = <fgui.GLoader3D>cardObj.asButton.getChild("eff");
        eff_load3d.visible =false;

        

        let cardItem = new MJNormalCard(cardObj.asButton);
        cardItem.setInitNew();
        cardItem.BaseSetCard(mjId);

        // cardItem.SetCardHuTowards(huori)
        // cardItem.SetActiveToward(false)

        if (data.translucent) 
        {
            cardItem.SetAlpha(0.9)
        } 
        else 
        {
            cardItem.SetAlpha(1)
            if ( ( direction != CommonMJConfig.Direction.Bottom && isZiMo) || isreconnection) 
            {
                CommonMJConfig.AllCards[mjId] = CommonMJConfig.AllCards[mjId] - 1;
            }
        }
        this.obj_HuCards.push(cardItem)
        this.ShuaXinCurrenSprite(cardItem,this.obj_HuCards.length,direction);
        this.ShuaXinCurrentPos(cardObj,this.obj_HuCards.length,direction);


        //还需要去设置层级 
        this.ShuaXinSortingOrder(direction);



        return cardItem
    }

    /** 刷新层级 */
    ShuaXinSortingOrder(direction: number) 
    {
        let hangCountNextCeng = 1
        if (direction ==CommonMJConfig.Direction.Right ) 
        {
            let rowCount = 3
            hangCountNextCeng = 2
            // Log.w ( "ShuaXinSortingOrder right   this.obj_HuCards.length ",this.obj_HuCards.length )
            let orderArr = MJTool.GetSortHierarchyRightout(this.obj_HuCards.length,rowCount,hangCountNextCeng);
            // Log.w ( "ShuaXinSortingOrder right   orderArr ",orderArr )
            for (let i = 0; i < this.obj_HuCards.length; i++) 
            {
                this.obj_HuCards[i].GetObj().sortingOrder= orderArr[i];
            }
        }
        else if (direction ==CommonMJConfig.Direction.Left ) 
        {
            let rowCount = 2
            hangCountNextCeng = 3
            // Log.e ( "ShuaXinSortingOrder left   this.obj_HuCards.length ",this.obj_HuCards.length )
            let orderArr = MJTool.GetSortHierarchyMore(this.obj_HuCards.length,rowCount,hangCountNextCeng);
            // Log.e ( "ShuaXinSortingOrder left   orderArr ",orderArr )

            for (let i = 0; i < this.obj_HuCards.length; i++) 
            {
                this.obj_HuCards[i].GetObj().sortingOrder= orderArr[i];
            }

        }
        else if (direction ==CommonMJConfig.Direction.Top ) 
        {
            let rowCount = 5
            // Log.e ( "ShuaXinSortingOrder   this.obj_HuCards.length ",this.obj_HuCards.length )
            let orderArr = MJTool.GetSortHierarchy2(this.obj_HuCards.length,rowCount);

            // Log.e ( "ShuaXinSortingOrder   orderArr ",orderArr )
            for (let i = 0; i < this.obj_HuCards.length; i++) 
            {
                this.obj_HuCards[i].GetObj().sortingOrder= orderArr[i];
            }
        }
        else if (direction ==CommonMJConfig.Direction.Bottom ) 
        {
            let rowCount = 5
            // Log.e ( "ShuaXinSortingOrder   this.obj_HuCards.length ",this.obj_HuCards.length )
            let orderArr = MJTool.GetSortHierarchy2(this.obj_HuCards.length,rowCount);
            // Log.e ( "ShuaXinSortingOrder   orderArr ",orderArr )
            for (let i = 0; i < this.obj_HuCards.length; i++) 
            {
                this.obj_HuCards[i].GetObj().sortingOrder= orderArr[i];
            }
        }




    }





    /** 刷新某一张牌的位置 */
    ShuaXinCurrenSprite(cardItem:MJNormalCard,index:number,direction: number)
    {

        let tempX=0;
        let tempy=0;
        let yuCount=4;  //一排几个
        let lieIndex=1  //当前第几列
        let hangIndex=1 //当前第几行
        let dieHang =1
        let cengCount =0

        if (direction == CommonMJConfig.Direction.Bottom ) 
        {
            yuCount=5;
            hangIndex= Math.ceil(index/yuCount)  
            lieIndex= index%yuCount 

            cengCount = Math.ceil(index/yuCount/dieHang)  

            if (lieIndex==0) {
                lieIndex=yuCount
            }
            // Log.e ("ShuaXinCurrenSprite  :  index   lieIndex  cengCount ",index ,lieIndex ,cengCount  );
            let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "mj_ziji_hu"+(lieIndex-1) )
            cardItem.bgicon_gloder.icon =url
        } 
        else if (direction == CommonMJConfig.Direction.Top ) 
        {
            yuCount=5;
            hangIndex= Math.ceil(index/yuCount)  
            lieIndex= index%yuCount 

            cengCount = Math.ceil(index/yuCount/dieHang)  

            if (lieIndex==0) {
                lieIndex=yuCount
            }
            let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "mj_shang_hu"+(lieIndex-1) )
            cardItem.bgicon_gloder.icon =url
        }
        else if (direction == CommonMJConfig.Direction.Left ) 
        {
            yuCount=6;
            let danCengIndex= Math.ceil(index/yuCount)  
            if (danCengIndex==0) {
                danCengIndex=yuCount
            }
            let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "maj_zuo_hu"+(danCengIndex-1) )
            cardItem.bgicon_gloder.icon =url
        }
        else if (direction == CommonMJConfig.Direction.Right ) 
        {
            yuCount=6;
            let danCengIndex= Math.ceil(index/yuCount)  
            if (danCengIndex==0) {
                danCengIndex=yuCount
            }
            let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "mj_you_hu"+(danCengIndex-1) )
            cardItem.bgicon_gloder.icon =url
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
        let yuCount=4;  //一排几个
        let lieIndex=1  //当前第几列
        let hangIndex=1 //当前第几行

        let startX=0 //起始位置
        let startY=0 //起始位置

        let dieHang =1
        let dieX = 0  
        let dieY = 0 
        let cengCount =0

        if (direction == CommonMJConfig.Direction.Bottom ) 
        {
            yuCount=5;
            hangIndex= Math.ceil(index/yuCount)  
            lieIndex= index%yuCount 
            if (lieIndex==0) {
                lieIndex=yuCount
            }
            cengCount = Math.ceil(index/yuCount/dieHang)  

            dieX = 2  
            dieY = -14 
            tempX= cengCount*dieX+CommonMJConfig.HuCardsPosition[direction][lieIndex].x
            tempy=cengCount*dieY+CommonMJConfig.HuCardsPosition[direction][lieIndex].y

        } 
        else if (direction == CommonMJConfig.Direction.Top ) 
        {
            startX =0;
            startY =0;
            xoff=-10;
            yoff=-5;
            yuCount=5;
            hangIndex= Math.ceil(index/yuCount)  
            lieIndex= index%yuCount 

            cengCount = Math.ceil(index/yuCount/dieHang)  

            if (lieIndex==0) {
                lieIndex=yuCount
            }

            dieX = -1  
            dieY = -13 
            tempX= cengCount*dieX+CommonMJConfig.HuCardsPosition[direction][lieIndex].x
            tempy=cengCount*dieY+CommonMJConfig.HuCardsPosition[direction][lieIndex].y
        }
        else if (direction == CommonMJConfig.Direction.Right ) 
        {
            yuCount=6;
            let danCengIndex= index%yuCount
            if (danCengIndex==0) {
                danCengIndex=yuCount
            }
            cengCount = Math.ceil(index/yuCount)  
            dieX = 3 
            dieY = -13 
            tempX= cengCount*dieX+CommonMJConfig.HuCardsPosition[direction][danCengIndex].x
            tempy=cengCount*dieY+CommonMJConfig.HuCardsPosition[direction][danCengIndex].y
        }
        else if (direction == CommonMJConfig.Direction.Left ) 
        {
            yuCount=6;
            let danCengIndex= index%yuCount
            if (danCengIndex==0) {
                danCengIndex=yuCount
            }
            cengCount = Math.ceil(index/yuCount)  
            dieX = -1  
            dieY = -13 
            tempX= cengCount*dieX+CommonMJConfig.HuCardsPosition[direction][danCengIndex].x
            tempy=cengCount*dieY+CommonMJConfig.HuCardsPosition[direction][danCengIndex].y
        }
        cardObj.x = tempX;
        cardObj.y = tempy;

    }




    GetHuCount():number
    {
        return this.obj_HuCards.length
    }


    /** 播放 胡牌光圈和声音 */
    PlayHPGuangEff(direction:number) 
    {
        let obj= this.obj_HuCards[this.obj_HuCards.length-1].GetObj()
        this.PlayHPGuang( obj ,direction)
    
    }

        
    /** 播放胡德牌 扩散光圈 */
    PlayHPGuang(cardObj: fairygui.GObject,direction:number) 
    {
        MJTool.PlaySound(CommonMJConfig.SoundEffPath.EffHu,Config.BUNDLE_MJCOMMON);
        // Log.w("PlayHPGuang 胡牌光圈  direction  ",direction)
        let eff_load3d = <fgui.GLoader3D>cardObj.asButton.getChild("eff");
        let name = "hp"+(direction+1)
        Manager.utils.PlaySpine(eff_load3d,"mjsp_hp1",name,Config.BUNDLE_MJCOMMON,()=>{
            eff_load3d.visible=false
        })
    }



    


    /** 清理掉所有的胡牌 */
    RemoveAllHuCard()
    {

        for (let i = 0; i < this.obj_HuCards.length; i++) 
        {
            // this.obj_HuCards[i].Recycle();
            this.m_GObjectPool.returnObject(this.obj_HuCards[i].GetObj() );
        }

        this.obj_HuCards= [];
        this.m_GObjectPool.clear()
    }







    StopCoroutineTweenAni()
    {


    }



}


