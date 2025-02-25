import { Config, ViewZOrder } from "../../../../scripts/common/config/Config";
import RecommendChongZhi from "../../../../scripts/common/fairyui/RecommendChongZhi";
import { GameService } from "../../../../scripts/common/net/GameService";
import { MahHPGOPerate } from "../../../../scripts/def/GameEnums";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";
import { CommonMJConfig } from "../Config/CommonMJConfig";
import { MJTool } from "../logic/MJTool";
import MJDispose from "../Manager/MJDispose";
import MJManager from "../Manager/MJManager";
import BlackGangCard from "./BlackGangCard";
import BuDianGangCard from "./BuDianGangCard";
import MJCard from "./MJCard";
import PengCard from "./PengCard";




export default class PoChanView {



    private root : fgui.GComponent = null;
    private buyBtn :fgui.GButton=null;
    private loseBtn :fgui.GButton=null;
    private paixingHu_com :fgui.GComponent =null;

    m_uCountDown =0
    //计时器工具
    timer_1: number;
    isCanClickPoChan =false
    public constructor(root : fgui.GComponent) 
    {
        this.root =root;
        this.setInit();
    }



    setInit()
    {
        this.root.getChild("closebtn").onClick(this.onClickLose,this);
        this.buyBtn = this.root.getChild("huangBtn").asButton
        this.buyBtn.text ="去购买"
        this.buyBtn.onClick(this.onClickBuy,this);

        this.loseBtn = this.root.getChild("lanBtn").asButton
        this.loseBtn.text ="认输"
        this.loseBtn.onClick(this.onClickLose,this);

        this.paixingHu_com= this.root.getChild("paixingHuItem").asCom;
        this.BindEvent() 

    
    }
    


    BindEvent() 
    {
        Manager.dispatcher.add("PoChanRefresh", this.MJPoChanRefresh, this);

    }






    RemoveEvent()
    {
        Manager.dispatcher.remove("PoChanRefresh", this);
        window.clearInterval(this.timer_1);
    }




    SetActivePoChan(isShow:boolean)
    {
        this.root.visible = isShow;

    }

    onClickBuy()
    {
        Log.w("点击了去购买 ")
        // dispatch("PoChanChongZhiShow")
        let data = Manager.gd.get<pb.S2CPoChanMsg>(ProtoDef.pb.S2CPoChanMsg);
        data.waittime= this.m_uCountDown
        Manager.gd.put(ProtoDef.pb.S2CPoChanMsg,data);
        Manager.uiManager.openFairy({ type: RecommendChongZhi, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.UI, name: "破产救济金" });
    }

    onClickLose()
    {
        this.isCanClickPoChan =false
        this.SetActivePoChan(false)
        Log.w("点击了认输  ")
        let sw= Manager.serviceManager.get(GameService) as GameService
        sw.onC2SPoChanMsg(0,0);
    }

    //如果 没听牌 就直接破产
    MJPoChanRefresh(time:number)
    {
        this.isCanClickPoChan =true
        this.timer_1 = window.setInterval(this.UpdateCountDown.bind(this), 1000);
        this.m_uCountDown =time
        if (CommonMJConfig.CurrenMahKeHuDataArr!=null && CommonMJConfig.CurrenMahKeHuDataArr.length!=0 ) 
        {
            this.SetActivePoChan(true)
            this.root.getChild("des").text = String.format("放弃复活,本次您将失去赢[color=#ff0000]{0}[/color]金豆的机会",Manager.utils.formatCoin(CommonMJConfig.yuJiShouYi))
            let hands_list =  this.paixingHu_com.getChild("handCards").asList;
            let pengGang_list =  this.paixingHu_com.getChild("pengGang").asList;
            hands_list.removeChildrenToPool()
            pengGang_list.removeChildrenToPool()


            let mineCards = CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom];
            Log.e(" pochan 刷新 mineCards  : ",mineCards);
            let handCardArr =MJTool.TableKVCopyToList(mineCards)
            MJManager.CardSortByLaiZiAndQue(handCardArr);
            for (let index = 0; index < handCardArr.length; index++) {
                let item: fgui.GButton = hands_list.addItemFromPool().asButton;
                let cardItem = new MJCard(item);
                cardItem.SetCard(handCardArr[index],null)
            }

            let penggangData =    CommonMJConfig.PlayerPengGang[CommonMJConfig.Direction.Bottom]
            Log.e(" pochan 刷新 0 penggangData  : ",penggangData);
            MJManager.PengGangSort(penggangData);
            Log.e(" pochan 刷新  1 penggangData  : ",penggangData);

            for (let index = 0; index < penggangData.length; index++) 
            {
                let type = penggangData[index].type
                let card = penggangData[index].cardOne
                let directionIndex = penggangData[index].ori
                // Log.e(" SetBalanceResultData AltPath  card :   ", card  )
    
                if (type == MahHPGOPerate.HPG_Peng ) 
                {
                    let url =  fgui.UIPackage.getItemURL("hall", CommonMJConfig.AltPath[0])
                    let obj=  pengGang_list.addItemFromPool(url)
                    obj.visible=true;
                    let cardItem = new PengCard(obj.asButton);
                    // cardItem.setInit();
                    cardItem.SetCard(card,directionIndex);
                    cardItem.SetActiveToward(false)
                }
                else if (type == MahHPGOPerate.HPG_AnGang ) 
                {
                    let url =  fgui.UIPackage.getItemURL("hall", CommonMJConfig.BlackCtrlsPath[0])
                    // Log.e(" SetBalanceResultData AddBlackCtrlCard  url :   ", url  )
                    let obj=  pengGang_list.addItemFromPool(url)
                    obj.visible=true;
                    let cardItem = new BlackGangCard(obj.asButton);
                    // cardItem.setInit();
                    cardItem.SetCard(card);
                }
                else if (type == MahHPGOPerate.HPG_DianGang || type == MahHPGOPerate.HPG_BuGang  ) 
                {
                    let url =  fgui.UIPackage.getItemURL("hall", CommonMJConfig.BuDianGangPath[0])
                    // Log.e(" SetBalanceResultData BuDianGangPath  url :   ", url  )
                    let obj=  pengGang_list.addItemFromPool(url)
                    obj.visible=true;
                    let cardItem = new BuDianGangCard(obj.asButton);
                    cardItem.SetCard(card,directionIndex);
                    cardItem.SetActiveToward(false)
                }
            }
        }
        else
        {
            this.onClickLose()
        }
    }


    /**
     * 倒计时循环调用
     */
     public UpdateCountDown() {
        // Log.e(" UpdateCountDown  ");
        if ( this.m_uCountDown > 0) {
            this.m_uCountDown = this.m_uCountDown- 1;
        }
        
        if ( this.isCanClickPoChan && this.m_uCountDown==0  ) 
        {
            Log.e(" UpdateCountDown 倒计时时间到破产  ");
            this.onClickLose()
        }
    }





}



