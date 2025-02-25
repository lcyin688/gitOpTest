import { CfgType, CurrencyType, ErrorCode, PlayerAttr, PoChanRewardType, PoChanTable } from "../../def/GameEnums";
import { ProtoDef } from "../../def/ProtoDef";
import UIView from "../../framework/core/ui/UIView";
import { Config, ViewZOrder } from "../config/Config";
import GameData from "../data/GameData";
import { GameEvent } from "../event/GameEvent";
import { CmmProto } from "../net/CmmProto";
import { GameService } from "../net/GameService";
import { Utils } from "../utils/Utils";
import StrongBox from "./StrongBox";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RecommendChongZhi extends UIView {

    private recommendCZ_gc:fgui.GComponent = null;
    private jjj_gc:fgui.GComponent = null;

    private jjcdes_text : fgui.GObject=null;
    private jjj_list:fgui.GList=null;
    
    private freeCount :number=0

    private pochanTimer_com :fgui.GComponent = null;
    private countDown_text :fgui.GObject = null;
    //计时器工具
    timer_1: number;
    //当前倒计时
    m_uCountDown:number =15;

    private recommend_list : fgui.GList=null;

    // private rewardItemArr:fgui.GComponent[]=[]
    // private rewardItemArr:RewardItem[]=[]


    get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }

    protected addEvents(): void 
    {
        Log.e(" RecommendChongZhi  注册了  ")
        this.addEvent(ProtoDef.pb.S2CGetPoChanReWard,this.OnS2CGetPoChanReWard);
        this.addEvent(ProtoDef.pb.S2COutSafeBox,this.onS2COutSafeBox);
        this.addEvent(ProtoDef.pb.S2CInSafeBox,this.onS2CInSafeBox);
    }


    
    public static getPrefabUrl() {
        return "prefabs/HallView";
    }

    static getViewPath(): ViewPath {
        let path : ViewPath = {
            	/**@description 资源路径 creator 原生使用*/
            assetUrl: "ui/hall",
            /**@description 包名称 fgui 使用*/
            pkgName : "hall",
            /**@description 资源名称 fgui 使用*/
            resName : "RecommendJJJCZ",
        }
        return path;
    }

    onLoad() {
        super.onLoad();
        this.show();
        this.ReFlashView()
    }

    onDispose(): void {
        if (this.timer_1!=null) {
            window.clearInterval(this.timer_1);    
        }
        super.onDispose();
    }

    onClickClose(){
        Manager.uiManager.close(RecommendChongZhi);
        // this.hide()
        let data = Manager.gd.get<pb.S2CPoChanMsg>(ProtoDef.pb.S2CPoChanMsg);
        if (data.type == PoChanTable.PoChanTable_PoChan) 
        {
            dispatch("PoChanRefresh",this.m_uCountDown)
        }
        dispatch(GameEvent.Silent_GO_HALL,"RecommendChongZhi.onClickClose");
    }

    onFairyLoad(): void {

        Log.w(" pochanchongzhi  onFairyLoad ")

        this.recommendCZ_gc = this.root.getChild("recommendCZ").asCom;
        let close = this.recommendCZ_gc.getChild("closebtn");
        close.onClick(this.onClickClose,this);

        this.pochanTimer_com = this.recommendCZ_gc.getChild("pochanTimer").asCom
        this.countDown_text=  this.pochanTimer_com.getChild("time");


        this.jjj_gc = this.root.getChild("jjj").asCom;
        this.jjcdes_text = this.jjj_gc.getChild("moredes")

        this.jjj_list =this.jjj_gc.getChild("jjjlist").asList
        this.jjj_list.on(fgui.Event.CLICK_ITEM, this.onClickJJJItem, this);

        let closejjj = this.jjj_gc.getChild("closebtn");
        closejjj.onClick(this.onClickClose,this);

        this.root.getChild("di").onClick(this.onClickClose,this);

        this.recommend_list =this.recommendCZ_gc.getChild("recommendList").asList;
        this.recommend_list.on(fgui.Event.CLICK_ITEM, this.onClickItem, this);

        this.service.getShopItems();
    }



    //点击了领取奖励 救济金
    onClickJJJItem(obj: fgui.GObject){
        // Log.d("onClickJJJItem:",obj.data);


        if (obj.data.type == PoChanRewardType.PoChanReward_Ad) 
        {
            let jsonData={adname:"",parms1:"",parms2:""}
            jsonData.adname="Ad_Relief";
            jsonData.parms1=obj.data.id.toString();
            jsonData.parms2="";

            Manager.adManeger.WatchAds(jsonData,()=>{
                this.service.onc2SBuyShopItem(obj.data.id,1);
                obj.asCom.getChild("lingquBtn").visible =false
            })
            
        }
        else if (obj.data.type == PoChanRewardType.PoChanReward_Free) 
        {
            
            this.service.onC2SPoChanMsg(obj.data.id,obj.data.type);
            obj.asCom.getChild("lingquBtn").visible =false
        }



        // Manager.uiManager.close(RecommendChongZhi);

    }



    //点击了领取奖励
    onClickItem(obj: fgui.GObject){


        let data = obj.data as pb.IPoChanData;
        Log.d("onClickItem:",data);

        function ff(params:boolean) {
            // Log.d("Manager.alert ff",params);
            if (params){
                this.service.onC2SPoChanMsg(data.id,data.type);
            }else{
                Manager.tips.show("购买已取消");
            }
        }

        if (data.type == PoChanRewardType.PoChanReward_Ad) 
        {
            let jsonData={adname:"",parms1:"",parms2:""}
            jsonData.adname="Ad_PoChanfuhuo";
            jsonData.parms1=data.id.toString();
            jsonData.parms2="";

            Manager.adManeger.WatchAds(jsonData,()=>{
                Manager.uiManager.close(RecommendChongZhi);
            });
            this.service.OnC2SPoChangAdStart();

        }
        else
        {
            //如果钱够的时候给2次确认弹框
            let gd = Manager.dataCenter.get(GameData);
            let zuanshiCount= gd.playerCurrencies(CurrencyType.CT_Gem);

            Log.d("onClickItem  zuanshiCount :",zuanshiCount);
            Log.d("onClickItem  data.cost.value :",data.cost.value);

            if (zuanshiCount>= data.cost.value ) {
                
                let cf:AlertConfig={
                    // immediatelyCallback : true,
                    title:"提示",
                    text: "你确定要花费"+ data.cost.value +"钻石,购买这件商品吗",   
                    confirmCb: ff.bind(this),        
                    cancelCb: ff.bind(this),
                };
                Manager.alert.show(cf);
            }
            else
            {
                this.service.onC2SPoChanMsg(data.id,data.type);
            }


        }


    }
    

    public show(): void {
        Log.d("RecommendChongZhi.   show");
        super.show();
    }

       
    ReFlashView()
    {
        let data = Manager.gd.get<pb.S2CPoChanMsg>(ProtoDef.pb.S2CPoChanMsg);
        Log.w(" 破产救济金  show onS2CPoChanMsg:",data);
        let gd = Manager.dataCenter.get(GameData);
        // this.rewardItemArr =[]
        if (data.type== PoChanTable.PoChanTable_JJJ) 
        {
            this.jjj_gc.visible=true
            this.recommendCZ_gc.visible=false
            let  dataItem = data.data[0]
            let shengyuCount = dataItem.totalCount-dataItem.curCount
            this.jjcdes_text.text = String.format( "免費领取次数剩余：[b]{0}[/b]  次",shengyuCount)
            this.freeCount = shengyuCount
            this.jjj_list.removeChildrenToPool();
            for (let index = 0; index < dataItem.reward.length; index++) 
            {
                const et = dataItem.reward[index]
                let item = this.jjj_list.addItemFromPool().asCom;
                item.visible = true
                Log.w(" count 救济金  : ",Manager.utils.formatCoin(Number(et.value)) )
                item.getChild("count").text =Manager.utils.formatCoin(Number(et.value)); 

                if ( dataItem.type == PoChanRewardType.PoChanReward_Free ) 
                {
                    item.getChild("lingquBtn").visible =true; 
                    item.getChild("gglingquBtn").visible =false; 
                }
                else  if ( dataItem.type == PoChanRewardType.PoChanReward_Ad ) 
                {
                    item.getChild("lingquBtn").visible =false; 
                    item.getChild("gglingquBtn").visible =true; 
                }
                // let url = "jiuji_kuang_2";
                // url = fgui.UIPackage.getItemURL("hall",url);
                // item.getChild("loader").icon = url;
                item.data = dataItem;
            }
        }
        else 
        {

            this.recommendCZ_gc.getChild("baoxiancount").text =  Manager.gd.getPlayerSafeBoxStr() ;
            this.recommendCZ_gc.getChild("bxx").onClick(this.onClickStrong,this);
            this.jjj_gc.visible=false
            this.recommendCZ_gc.visible=true
            let url =""
            
            if (data.type== PoChanTable.PoChanTable_PoChan) 
            {
                this.timer_1 = window.setInterval(this.UpdateCountDown.bind(this), 1000);
                url = "fuhuo_zi_2";
                this.pochanTimer_com.visible = true
                this.SetCountDown(data.waittime)
                this.recommendCZ_gc.getChild("n32").visible=false;
            }
            else if  (data.type== PoChanTable.PoChanTable_TuiJian) 
            {
                url = "fuhuo_zi_1";
                this.pochanTimer_com.visible = false
                this.recommendCZ_gc.getChild("n32").visible=true;
            } 
            url = fgui.UIPackage.getItemURL("hall",url);
            this.recommendCZ_gc.getChild("tittle").asLoader.icon = url;
            this.recommend_list.removeChildrenToPool();

            let dataOne = data.data
            for (let index = 0; index < dataOne.length; index++) 
            {
                const et = dataOne[index]
                let item = this.recommend_list.addItemFromPool().asCom;
                item.data = et;
                item.visible = true
                item.getChild("zheKou").visible =false
                if (et.zheKou!=null && et.zheKou!="") 
                {
                    item.getChild("zheKou").text =et.zheKou;
                }


                let tuiJianItem = item.getChild("tuiJianItem").asCom
                let fuHuoItem = item.getChild("fuHuoItem").asCom

                if (data.type== PoChanTable.PoChanTable_PoChan) 
                {
                    tuiJianItem.visible =false
                    fuHuoItem.visible =true
                    item.getChild("bgicon").asLoader.icon = fgui.UIPackage.getItemURL("hall","fuhuo_diban_5");


                    let des_text = fuHuoItem.getChild("des")
                    let totalDouDou = 0
                    for (let i = 0; i < et.reward.length; i++) 
                    {
                        totalDouDou = totalDouDou +Number(et.reward[i].value)
                    }
                    fuHuoItem.getChild("goldItem").asCom.getChild("num").text =Manager.utils.formatCoin(totalDouDou); 
                    let rList =fuHuoItem.getChild("rewardList").asList;
                    rList.removeChildrenToPool();
                    let rItem = rList.addItemFromPool().asCom;
                    
                    let url1 = fgui.UIPackage.getItemURL("hall","fuhuo_icon_2");
                    rItem.getChild("loader").icon = url1;
                    rItem.getChild("des").text ="复活"
                    rItem.getChild("itemCount").visible =false
                    if (et.JinZhongZhao==0) 
                    {
                        des_text.text="仅复活本局"
                    }
                    else
                    {
                        des_text.text="复活+免死X"+et.JinZhongZhao
                        let rItem1 = rList.addItemFromPool().asCom;
                        let url2 = fgui.UIPackage.getItemURL("hall","fuhuo_icon_1");
                        rItem1.getChild("loader").icon = url2;
                        rItem1.getChild("des").visible =false
                        rItem1.getChild("itemCount").text ="X"+et.JinZhongZhao
                    }

                }
                else if  (data.type== PoChanTable.PoChanTable_TuiJian) 
                {
                    tuiJianItem.visible =true
                    fuHuoItem.visible =false
                    item.getChild("bgicon").asLoader.icon = fgui.UIPackage.getItemURL("hall","fuhuo_diban_4");
                    let totalDouDou = 0
                    for (let i = 0; i < et.reward.length; i++) 
                    {
                        totalDouDou = totalDouDou +Number(et.reward[i].value)
                    }
                    tuiJianItem.getChild("goldItem").asCom.getChild("num").text =Manager.utils.formatCoin(totalDouDou); 
                } 
                
                let ggdes_com = item.getChild("btn").asButton.getChild("ggdes").asCom
                let costItem_com = item.getChild("btn").asButton.getChild("costItem").asCom

                if (et.type == PoChanRewardType.PoChanReward_Ad) 
                {
                    ggdes_com.visible = true
                    costItem_com.visible = false
                    ggdes_com.getChild("title").text=this.getAdBtnName(data.type,et);
                    if(Manager.platform.isAdOpen()){
                        ggdes_com.icon = fgui.UIPackage.getItemURL("hall","ui_daoju_icon_3");
                    }else{
                        ggdes_com.icon = fgui.UIPackage.getItemURL("hall","ui_daoju_icon_33");
                    }
                }
                else
                {
                    ggdes_com.visible = false
                    costItem_com.visible = true
                    if (CurrencyType.CT_Coin ==Number(et.cost.key) ) 
                    {
                        costItem_com.getChild("count").text= Manager.utils.formatCoin(et.cost.value);
                    } 
                    else 
                    {
                        costItem_com.getChild("count").text= et.cost.value
                    }
                    costItem_com.getChild("HBicon").icon = gd.getPropIcon(Number(et.cost.key));
                }
            }
        }



    }
    getAdBtnName(type: number, et: pb.IPoChanData): string 
    {
        let str ="";
        if (type== PoChanTable.PoChanTable_PoChan) 
        {
            str =String.format("广告复活({0}/{1})",et.curCount,et.totalCount)
            if (et.totalCount==0 ) 
            {
                str ="广告复活"
            }
        }
        else if  (type== PoChanTable.PoChanTable_TuiJian) 
        {
            str =String.format("广告领取({0}/{1})",et.curCount,et.totalCount)
            if (et.totalCount==0 ) 
            {
                str ="广告领取"
            }
        } 
        return str;
    }





    onClickStrong(){
        Manager.uiManager.openFairy({ type: StrongBox, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.UI+10, name: "保险箱" });
    }


    protected onS2CInSafeBox(data:pb.S2CInSafeBox){
        if(data.ec == 1){
            this.recommendCZ_gc.getChild("baoxiancount").text =Manager.gd.getPlayerSafeBoxStr();
        }
    }

    protected onS2COutSafeBox(data:pb.S2COutSafeBox){
        if(data.ec == 1){
            this.recommendCZ_gc.getChild("baoxiancount").text = Manager.gd.getPlayerSafeBoxStr();
        }
    }

    /**
     * 倒计时循环调用
     */
     public UpdateCountDown() {
        // Log.e(" UpdateCountDown  ");
        if ( this.m_uCountDown > 0) {
            this.m_uCountDown = this.m_uCountDown- 1;
            this.SetCountDownText();
        }
        
        if (this.m_uCountDown==0 ) 
        {
            // this.hide()
            Manager.uiManager.close(RecommendChongZhi);
        }
    }


        /**
     * 设置游戏倒计时
     */
         public SetCountDown(tnum: number) {
            this.m_uCountDown = tnum;
            this.SetCountDownText()
        }
    
        /**
         * 设置游戏倒计时
         */
        public SetCountDownText() 
        {
            if (this.countDown_text!=null) 
            {
                this.countDown_text.text =this.m_uCountDown.toString() ;
            }
        }
    

    OnS2CGetPoChanReWard(data:pb.S2CGetPoChanReWard){
        // Log.e(" 进来啊 OnS2CGetPoChanReWard  data ",data )
        function ff(params:boolean) {
            // Log.d("Manager.alert ff",params);
            if (params){
                this.service.onc2SBuyShopItem(data.TuiJianId,1);
            }else{
                Manager.tips.show("购买已取消");
            }
        }

        if(data.errCode == ErrorCode.EC_Ok){
            Manager.uiManager.close(RecommendChongZhi);
        }
        else if(data.errCode == ErrorCode.EC_GemNotEnough)
        {
            let dataShop = Manager.gd.get<pb.S2CGetShopItems>(ProtoDef.pb.S2CGetShopItems);
            for (let i = 0; i < dataShop.catShop.length; i++) {
                let shopItem = dataShop.catShop[i];
                for (let c = 0; c < shopItem.items.length; c++) 
                {
                    if (shopItem.items[c].id ==data.TuiJianId ) {
                        Manager.pay.choosePay(shopItem.items[c]);
                         Log.d("找到合适的商品",shopItem.items[c]);
                        return ;
                    }
                }
                
            }
            Manager.tips.show("没找到合适的商品");
        }

        else
        {
            Manager.tips.showFromId("TS_Denglu_35");
        }
    }




    
}


