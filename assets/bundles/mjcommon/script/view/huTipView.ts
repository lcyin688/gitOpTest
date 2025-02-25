import { CurrencyType, MahColor } from "../../../../scripts/def/GameEnums";
import { Tool } from "../../../gamecommon/script/tools/Tool";
import { CommonMJConfig } from "../Config/CommonMJConfig";
import { MJTool } from "../logic/MJTool";
import MJDispose from "../Manager/MJDispose";

export default class huTipView  {

    private root : fgui.GComponent = null;
    private single_gc:fgui.GComponent=null;
    private more_gc:fgui.GComponent=null;


    // private fengdingDes_text :fgui.GObject;
    // private huTotalCount_text :fgui.GObject;
    // private totalbeiNum_text :fgui.GObject;
    // private totalScore_text :fgui.GObject;
    private singlehu_list :fgui.GList;
    // private tipTotal_gc:fgui.GComponent;
    // private mjtipleft_gc:fgui.GComponent;

    



    public constructor(root : fgui.GComponent) 
    {
        this.root =root;
        this.setInit();
    }



    setInit()
    {
        this.root.getChild("close").onClick(()=>{ this.SetActiveHuTip(false) },this);

        this.single_gc = this.root.getChild("singleContent").asCom
        this.more_gc = this.root.getChild("moreContent").asCom
        
        this.singlehu_list = this.single_gc.getChild("n16").asList
        this.singlehu_list.removeChildrenToPool();

        // this.tipTotal_gc =this.root.getChild("mjtipTotal").asCom
        // this.totalbeiNum_text = this.tipTotal_gc.getChild("totalbeiNum")
        // this.totalScore_text = this.tipTotal_gc.getChild("totalScore")

        // this.mjtipleft_gc =this.root.getChild("mjtipleft").asCom
        // this.fengdingDes_text = this.mjtipleft_gc.getChild("fengdingDes")
        // this.huTotalCount_text = this.mjtipleft_gc.getChild("huTotalCount")

        this.BindEvent();
    }

    



    BindEvent()
    {

    }

    ReFreshHu_listWidth(count:number)
    {
        if ( count > 2 ) 
        {
            this.singlehu_list.width =(count*96)
        } 
        else 
        {
            this.singlehu_list.width =200
        }
    }



    /** 刷新胡牌提示界面 */
    RefreshView(data : pb.IMahKeHuData )
    {



        Log.w(" RefreshView  data : ",data)

        let dataCopy:pb.IKeHuItem[] = Tool.Clone(data.data)
        this.HuDataSort(dataCopy);
        let totalZhang =0 
        let totalBei =0 
        let maxScore =0 


        if (dataCopy.length<=10) 
        {
            this.single_gc.visible =true
            this.more_gc.visible =false
            for (let index = 0; index < this.singlehu_list._children.length; index++) 
            {
                this.singlehu_list._children[index].asCom.getChild("fanXingBtn").clearClick()
            }
            this.singlehu_list.removeChildrenToPool();
            this.ReFreshHu_listWidth(dataCopy.length)

            for (let i = 0; i < dataCopy.length; i++) 
            {
                let mjCard = dataCopy[i].mjid;
                let beiNum = Number(dataCopy[i].mul);
                let zhangNum =  Number(CommonMJConfig.AllCards[mjCard]);
                if (mjCard==35 && CommonMJConfig.MahjongID[135].ISHave ) 
                {
                    zhangNum  = CommonMJConfig.AllCards[mjCard]+ CommonMJConfig.AllCards[135]
                }            

                totalZhang= totalZhang+ zhangNum;
                totalBei = totalBei + beiNum*totalZhang;
                maxScore = maxScore + beiNum*totalZhang*CommonMJConfig.MjRoomRule.diFen
                let item: fgui.GButton = this.singlehu_list.addItemFromPool().asButton;
                let icon_gloder = item.getChild("icon").asLoader;
                let zhang_text = item.getChild("zhangNum");
                let fanNum_text = item.getChild("fanNum");
                zhang_text.text = String.format("[color=#ff0000]{0}[/color]张",zhangNum)
                if (beiNum>9999) {
                    fanNum_text.asTextField.fontSize= 18
                    fanNum_text.asTextField.autoSize= fgui.AutoSizeType.Both
                }
                else
                {
                    fanNum_text.asTextField.fontSize= 25
                }
                fanNum_text.text = String.format("[color=#ff0000]{0}[/color]倍",beiNum)
                if ( icon_gloder!=null ) 
                {
                    let urlStr = fgui.UIPackage.getItemURL("hall",CommonMJConfig.MahjongID[mjCard].spriteUrl)
                    icon_gloder.icon =urlStr;   
                }
                item.getChild("mask").visible= (zhangNum == 0)
                // item.getChild("fanXingBtn").offClick(()=>{});
                item.getChild("fanXingBtn").onClick(()=>{dispatch("MJSetFanXingInit",dataCopy[i].type)},this);
            }
            this.single_gc.getChild("mjtipleft").asCom.getChild("huTotalCount").text=totalZhang.toString();
            this.single_gc.getChild("mjtipleft").asCom.getChild("fengdingDes").text= String.format("封顶{0}{1}",Tool.CurrencyToString(CommonMJConfig.MjRoomRule.max_fan),CommonMJConfig.ISBei  ?"倍" : "番");
            this.single_gc.getChild("mjtipTotal").asCom.getChild("totalbeiNum").text =Manager.utils.formatCoin(totalBei,CurrencyType.CT_Null);
            this.single_gc.getChild("mjtipTotal").asCom.getChild("totalScore").text=   Manager.utils.formatCoin(maxScore);

        }
        else
        {
            this.single_gc.visible =false
            this.more_gc.visible =true
            let n16_list = this.more_gc.getChild("n16").asList
            for (let index = 0; index < n16_list._children.length; index++) 
            {
                n16_list._children[index].asCom.getChild("fanXingBtn").clearClick()
            }
            n16_list.removeChildrenToPool();

            for (let i = 0; i < dataCopy.length; i++) 
            {
                let mjCard = dataCopy[i].mjid;
                let beiNum = Number(dataCopy[i].mul);
                let zhangNum =  Number(CommonMJConfig.AllCards[mjCard]);

                if (mjCard==35 && CommonMJConfig.MahjongID[135].ISHave ) 
                {
                    zhangNum  = CommonMJConfig.AllCards[mjCard]+ CommonMJConfig.AllCards[135]
                }

                totalZhang= totalZhang+ zhangNum;
                totalBei = totalBei + beiNum*totalZhang;
                maxScore = maxScore + beiNum*totalZhang*CommonMJConfig.MjRoomRule.diFen
                let item: fgui.GButton = n16_list.addItemFromPool().asButton;
                let icon_gloder = item.getChild("icon").asLoader;
                let zhang_text = item.getChild("zhangNum");
                let fanNum_text = item.getChild("fanNum");
                zhang_text.text = String.format("[color=#ff0000]{0}[/color]张",zhangNum)
                if (beiNum>9999) {
                    fanNum_text.asTextField.fontSize= 18
                    fanNum_text.asTextField.autoSize= fgui.AutoSizeType.Both
                }
                else
                {
                    fanNum_text.asTextField.fontSize= 25
                }
                fanNum_text.text = String.format("[color=#ff0000]{0}[/color]倍",beiNum)
                if ( icon_gloder!=null ) 
                {
                    let urlStr = fgui.UIPackage.getItemURL("hall",CommonMJConfig.MahjongID[mjCard].spriteUrl)
                    icon_gloder.icon =urlStr;   
                }
                item.getChild("mask").visible= (zhangNum == 0)
                // item.getChild("fanXingBtn").offClick(()=>{});
                item.getChild("fanXingBtn").onClick(()=>{dispatch("MJSetFanXingInit",dataCopy[i].type)},this);
                
            }
            this.more_gc.getChild("mjtipleft").asCom.getChild("huTotalCount").text=totalZhang.toString();
            this.more_gc.getChild("mjtipleft").asCom.getChild("fengdingDes").text= String.format("封顶{0}{1}",Tool.CurrencyToString(CommonMJConfig.MjRoomRule.max_fan),CommonMJConfig.ISBei  ?"倍" : "番");
            this.more_gc.getChild("mjtipTotal").asCom.getChild("totalbeiNum").text =Manager.utils.formatCoin(totalBei,CurrencyType.CT_Null);
            this.more_gc.getChild("mjtipTotal").asCom.getChild("totalScore").text=   Manager.utils.formatCoin(maxScore);
        }

        MJDispose.SetYuJiShouYi(maxScore)


    }

    


    /** 用倍数排序倍数大的放前边 */
    HuDataSort(tempArr:pb.IKeHuItem[] )
    {
        let  countWan = MJTool.GetHasCardCountByColor(MahColor.CL_Wan)
        let  countTong = MJTool.GetHasCardCountByColor(MahColor.CL_Tong)
        let  countTiao = MJTool.GetHasCardCountByColor(MahColor.CL_Tiao)
        CommonMJConfig.ColorListData=[{color:MahColor.CL_Wan,count:countWan,index:0},
            {color:MahColor.CL_Tong,count:countTong,index:0},
            {color:MahColor.CL_Tiao,count:countTiao,index:0}];
            CommonMJConfig.ColorListData.sort(function (a, b)
        {
            return Number(b.count)-Number(a.count);
        });
        for (let i = 0;  i< CommonMJConfig.ColorListData.length; i++) 
        {
            CommonMJConfig.ColorListData[i].index=i;
        }
        tempArr.sort(function (a, b)
        {
            let tempA=CommonMJConfig.MahjongID[a.mjid]
            let tempB=CommonMJConfig.MahjongID[b.mjid]

            if (tempA.Color==MahColor.CL_Zi ) 
            {
                return -1
            }
            else
            {
                if (tempA.Color==tempB.Color) 
                {
                    return tempA.number-tempB.number
                }
                else
                {
                    let temIndexa=0
                    for (let i = 0; i < CommonMJConfig.ColorListData.length; i++) 
                    {
                        if (CommonMJConfig.ColorListData[i].color== tempA.Color) {
                            temIndexa = CommonMJConfig.ColorListData[i].index;
                            break;
                        }
                    }
                    let temIndexb=0
                    for (let i = 0; i < CommonMJConfig.ColorListData.length; i++) 
                    {
                        if (CommonMJConfig.ColorListData[i].color== tempB.Color) {
                            temIndexb = CommonMJConfig.ColorListData[i].index;
                            break;
                        }
                    }
                    return temIndexa-temIndexb
                }

            }
        });
    }

    

    SetActiveHuTip(isShow:boolean)
    {
        this.root.visible=isShow;
    }


    StopCoroutineTweenAni()
    {


    }



}


