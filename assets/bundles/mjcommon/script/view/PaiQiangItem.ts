import { CommonMJConfig } from "../Config/CommonMJConfig";

export default class PaiQiangItem  {


    private root : fgui.GComponent = null;

    // private paiqiangArr:fgui.GObject[]=[];
    private paiqiangArrUse:fgui.GObject[]=[];
    private paiqiangArrNotUse:fgui.GObject[]=[];
    
   



    public constructor(root : fgui.GComponent) 
    {
        this.root =root;
        this.setInit();
    }



    setInit()
    {


        this.BindEvent();
        this.SetActivePaiQiang(false)
    }

    /**設置玩家客户端坐标方位 */
     SetDirectioni(direction: number) 
    {
        // this.direction = direction;
    }
     
    



    BindEvent()
    {

    }

    //startCardIndex 筛子的起点
    SetInitPaiQiangDataStart(count:number,direction,starIndex:number,startCardIndex:number)
    {
        // Log.e(" SetInitByCount 0 count  ",count,direction,starIndex,startCardIndex  )
            let notUseNum= 34- count
            // Log.w(" SetInitByCount 1 notUseNum  ",notUseNum  )
            if (count%2==0) //偶数的时候 展示中间的牌 两边的牌对称隐藏
            {
                let indexStartCard = Math.floor(notUseNum/4)*2 
                // Log.w(" SetInitByCount 2 indexStartDun  ",indexStartCard  )
                let finalIndex = indexStartCard
                if (direction==starIndex ) //第一家拿牌的位置 分
                {
                    // Log.w(" SetInitByCount 3 indexStartDun 是第一家的时候  "  )
                    finalIndex = indexStartCard+startCardIndex*2

                    // Log.w(" SetInitByCount 4 finalIndex  ",finalIndex  )
                    for (let i = finalIndex; i <  count+indexStartCard  ; i++) 
                    {
                        // Log.e(" InitPaiQiangDataStart 5 i  ",i+1  )
                        let item_obj = this.root.getChild("n"+(i+1))
                        item_obj.visible=true;
                        this.paiqiangArrUse.push(item_obj)
                        CommonMJConfig.allPaiqiangArr.push(item_obj)
                    }
    
                    for (let index = 0; index < indexStartCard; index++) 
                    {
                        let item_obj = this.root.getChild("n"+(index+1))
                        item_obj.visible =false;
                        this.paiqiangArrNotUse.push(item_obj)
                    }
                    for (let index = count+indexStartCard; index < 34; index++) 
                    {
                        let item_obj = this.root.getChild("n"+(index+1))
                        item_obj.visible =false;
                        this.paiqiangArrNotUse.push(item_obj)
                    }


                }
                else
                {
                    // Log.w(" SetInitByCount indexStartCard  6 ",indexStartCard  )
                    for (let i = indexStartCard; i < count+indexStartCard ; i++) 
                    {
                        // Log.e(" InitPaiQiangDataStart 7 i  ",i  )
                        let item_obj = this.root.getChild("n"+(i+1))
                        item_obj.visible=true;
                        this.paiqiangArrUse.push(item_obj)
                        CommonMJConfig.allPaiqiangArr.push(item_obj)
                    }
    
                    for (let index = 0; index < indexStartCard; index++) 
                    {
                        // Log.e(" InitPaiQiangDataStart 8 index  ",index  )
                        let item_obj = this.root.getChild("n"+(index+1))
                        item_obj.visible =false;
                        this.paiqiangArrNotUse.push(item_obj)
                    }
                    for (let index = count+indexStartCard; index < 34; index++) 
                    {
                        // Log.e(" InitPaiQiangDataStart 9 index  ",index  )
                        let item_obj = this.root.getChild("n"+(index+1))
                        item_obj.visible =false;
                        this.paiqiangArrNotUse.push(item_obj)
                    }


                }

            }
            else //只有第一家可能是奇数
            {
                let indexStartCard = Math.floor(notUseNum/4)*2 
                if (indexStartCard==0) {
                    indexStartCard=2
                }

                // Log.w(" SetInitByCount 奇数  8 indexStartDun   ",indexStartCard  )
                let finalIndex = indexStartCard
                if (direction==starIndex ) //第一家拿牌的位置
                {
                    // Log.w(" SetInitByCount 奇数 indexStartDun 9 是第一家的时候  "  )
                    finalIndex = indexStartCard+startCardIndex*2

                    // Log.w(" SetInitByCount 奇数 10 finalIndex   ",finalIndex  )



                    for (let i = finalIndex; i < count-1+indexStartCard ; i++) 
                    {
                        // Log.e(" InitPaiQiangDataStart 11 奇数 i  ",i+1  )
                        let item_obj = this.root.getChild("n"+(i+1))
                        item_obj.visible=true;
                        this.paiqiangArrUse.push(item_obj)
                        CommonMJConfig.allPaiqiangArr.push(item_obj)
                    }
                    for (let index = 0; index < indexStartCard-2; index++) 
                    {
                        let item_obj = this.root.getChild("n"+(index+1))
                        item_obj.visible =false;
                        this.paiqiangArrNotUse.push(item_obj)
                    }

                    let item_obj = this.root.getChild("n"+(indexStartCard-1))
                    item_obj.visible =false;
                    this.paiqiangArrNotUse.push(item_obj)


                    for (let index = count+indexStartCard-1; index < 34; index++) 
                    {
                        let item_obj = this.root.getChild("n"+(index+1))
                        item_obj.visible =false;
                        this.paiqiangArrNotUse.push(item_obj)
                    }
                }
            }
            // Log.e(" SetInitByCount 0 CommonMJConfig.allPaiqiangArr  ",CommonMJConfig.allPaiqiangArr.length  )
    }
    //startCardIndex 筛子的起点 
    SetInitPaiQiangDataEnd(count:number,direction,starIndex:number,startCardIndex:number)
    {
        
        // Log.e(" SetInitPaiQiangDataEnd 0 count  ",count,direction,starIndex,startCardIndex  )
        // Log.e(" SetInitPaiQiangDataEnd 0 ~~~~~~~  ",CommonMJConfig.allPaiqiangArr.length )
            let notUseNum= 34- count
            // Log.w(" SetInitPaiQiangDataEnd 1 notUseNum  ",notUseNum  )
            if (count%2==0) //偶数的时候 展示中间的牌 两边的牌对称隐藏
            {
                let indexStartCard = Math.floor(notUseNum/4)*2 
                // Log.w(" SetInitPaiQiangDataEnd 2 indexStartDun  ",indexStartCard  )
                let finalIndex = indexStartCard
                if (direction==starIndex ) //第一家拿牌的位置 分
                {
                    // Log.w(" SetInitPaiQiangDataEnd 3 indexStartDun 是第一家的时候  "  )
                    finalIndex = indexStartCard+startCardIndex*2

                    // Log.w(" SetInitPaiQiangDataEnd 4 finalIndex  ",finalIndex  )
                    for (let i = indexStartCard; i <  finalIndex  ; i++) 
                    {
                        // Log.e(" SetInitPaiQiangDataEnd 5 偶数 i  ",i  )
                        let item_obj = this.root.getChild("n"+(i+1))
                        item_obj.visible=true;
                        this.paiqiangArrUse.push(item_obj)
                        CommonMJConfig.allPaiqiangArr.push(item_obj)
                    }

                }

            }
            else //只有第一家可能是奇数
            {
                let indexStartCard = Math.floor(notUseNum/4)*2 
                if (indexStartCard==0) {
                    indexStartCard=2
                }

                // Log.w(" SetInitPaiQiangDataEnd 6 奇数 indexStartDun  ",indexStartCard  )
                let finalIndex = indexStartCard
                if (direction==starIndex ) //第一家拿牌的位置
                {
                    // Log.w(" SetInitPaiQiangDataEnd 7 奇数 indexStartDun 是第一家的时候  "  )
                    finalIndex = indexStartCard+startCardIndex*2

                    // Log.w(" SetInitPaiQiangDataEnd 8 finalIndex  ",finalIndex  )
                    let item_obj = this.root.getChild("n"+(indexStartCard))
                    item_obj.visible=true;
                    this.paiqiangArrUse.push(item_obj)
                    CommonMJConfig.allPaiqiangArr.push(item_obj)

                    for (let i = indexStartCard; i <  finalIndex  ; i++) 
                    {
                        // Log.e(" SetInitPaiQiangDataEnd 9 偶数 i  ",i  )
                        let item_obj = this.root.getChild("n"+(i+1))
                        item_obj.visible=true;
                        this.paiqiangArrUse.push(item_obj)
                        CommonMJConfig.allPaiqiangArr.push(item_obj)
                    }
                }
            }

    }



    SetActiveHidePQCardByIndex(index:number)
    {

        this.paiqiangArrUse[index].visible =false;

    }



    SetActivePaiQiang(isShow:boolean)
    {
        this.root.visible =isShow;
    }


    Reset()
    {

        this.paiqiangArrUse=[]
        this.paiqiangArrNotUse=[]

        this.SetActivePaiQiang(false)



    }




}


