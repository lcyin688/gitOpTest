import { CurrencyType } from "../../def/GameEnums";
import { ProtoDef } from "../../def/ProtoDef";
import UIView from "../../framework/core/ui/UIView";
import { Config, ViewZOrder } from "../config/Config";
import GameData from "../data/GameData";
import { GameService } from "../net/GameService";
import ShopView from "./ShopView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PropBuy extends UIView {

    private propBuy_gc:fgui.GComponent = null;
    //默认买一个
    buyCount:number;

    // buyCount_text:fgui.GObject;
    buyCount_textInput:fgui.GTextInput;
    costTotal_text:fgui.GObject;

    get service(){
        return Manager.serviceManager.get(GameService) as GameService;
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
            resName : "PropBuyView",
        }
        return path;
    }

    onLoad() {
        super.onLoad();
        this.show();
        this.ReFlashView()
    }
    
    onClickClose(){
        Manager.uiManager.close(PropBuy);
    }

    onFairyLoad(): void {
        this.propBuy_gc = this.root.getChild("content").asCom;
        this.propBuy_gc.getChild("closeBtn").onClick(this.onClickClose,this);
        this.propBuy_gc.getChild("reduceBtn").onClick(this.onClickReduce,this);
        this.propBuy_gc.getChild("addBtn").onClick(this.onClickAdd,this);
        this.propBuy_gc.getChild("buyBtn").onClick(this.onClickItem,this);

        let data = Manager.gd.get<{propID:number,shopId:number,price:number,currentType:number,title:string}>("PropBuyData");

        if(data.title != null && data.title.length > 0){
            this.propBuy_gc.getChild("buyBtn").text = data.title;
        }else{
            this.propBuy_gc.getChild("buyBtn").text ="购买"
        }
        this.costTotal_text = this.propBuy_gc.getChild("totalCost").asCom.getChild("moredes")
        this.buyCount_textInput = this.propBuy_gc.getChild("buyCount").asCom.getChild("moredes").asTextInput
        this.buyCount_textInput.on(fgui.Event.TEXT_CHANGE, this.onTextChange, this);

        
    }
    onTextChange(eve) 
    {
        this.buyCount = parseInt(eve.string)
        if (this.buyCount==null || this.buyCount.toString()=="NaN" || this.buyCount<=1) 
        {
            this.buyCount=1
        }
        else if (this.buyCount>999) 
        {
            this.buyCount = 999
        }
        this.buyCount_textInput.text = this.buyCount.toString()
        this.ChangeTotalCost()
    }

    onClickReduce()
    {
        this.buyCount= this.buyCount-1
        if (this.buyCount<=1) 
        {
            this.buyCount=1
        }
        this.ChangeTotalCost()
    }
    onClickAdd()
    {
        this.buyCount= this.buyCount+1
        if (this.buyCount>999) 
        {
            this.buyCount = 999
        }
        this.ChangeTotalCost()
    }




    
    //点击了立即购买
    onClickItem(){
        this.onClickClose()
        let data = Manager.gd.get<{propID:number,shopId:number,price:number,currentType:number,title:string}>("PropBuyData");
        if(data.title != null && data.title.length > 0){
            this.propBuy_gc.getChild("buyBtn").text = data.title;
        }
        let gd = Manager.dataCenter.get(GameData);
        let zuanshiCount= gd.playerCurrencies(CurrencyType.CT_Gem);
        let goldCount= gd.playerCurrencies(CurrencyType.CT_Coin);
        let hfqCount= gd.playerCurrencies(CurrencyType.CT_HuafeiQuan);


        function goldff(params:boolean) 
        {
            // Log.d("Manager.alert ff",params);
            if (params)
            {
                
                if (!Manager.uiManager.isShow(ShopView)) {
                    Manager.gd.put(ProtoDef.pb.S2CGetShopItems+"Index",{catName:"金币"});
                    Manager.uiManager.openFairy({ type: ShopView, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.ShopUI, name: "商城" });
                }
                else
                {
                    Manager.gd.put(ProtoDef.pb.S2CGetShopItems+"Index",{catName:"金币"});
                    dispatch(ProtoDef.pb.S2CGetShopItems+"shopView");
                }
            }
        }

        function zuanshiff(params:boolean) 
        {
            // Log.d("Manager.alert ff",params);
            if (!Manager.uiManager.isShow(ShopView)) {
                Manager.gd.put(ProtoDef.pb.S2CGetShopItems+"Index",{catName:"钻石"});
                Manager.uiManager.openFairy({ type: ShopView, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.ShopUI, name: "商城" });
            }
            else
            {
                Manager.gd.put(ProtoDef.pb.S2CGetShopItems+"Index",{catName:"钻石"});
                dispatch(ProtoDef.pb.S2CGetShopItems+"shopView");
            }
        }

        function callBackF(params:boolean) 
        {
            if (params) //跳转充值 在钻石合适的价格范围内拉起支付
            {

                Manager.utils.onClickItemBuy(this.buyCount*data.price,data.shopId,this.buyCount);
            }
        }


        if (CurrencyType.CT_Gem ==data.currentType && zuanshiCount<this.buyCount*data.price) 
        {

            Manager.utils.CommonShowMsg("12",callBackF.bind(this));
        } 
        else if (CurrencyType.CT_Coin ==data.currentType && goldCount<this.buyCount*data.price)
        {
            let str ="金币不足是否前往充值?"
            let cf:AlertConfig=
            {
                title:"提示",
                text: str,   
                confirmCb: goldff.bind(this),        
                cancelCb: goldff.bind(this),
            };
            Manager.alert.show(cf);
            
        }
        else if (CurrencyType.CT_HuafeiQuan ==data.currentType && hfqCount<this.buyCount*data.price)
        {
            Manager.tips.show("话费券不足");
        }
        else
        {
            this.service.onc2SBuyShopItem(data.shopId,this.buyCount);
        }
    }



    public show(): void {
        super.show();
    }

       
    ReFlashView()
    {
        let data = Manager.gd.get<{propID:number,shopId:number,price:number,currentType:number}>("PropBuyData");
        // Log.w(" PropBuy  ReFlashView    data:  ",data)
        // Log.w(" PropBuy  ReFlashView    data.propID  ",data.propID)
        // Log.w(" PropBuy  ReFlashView    data.price  ",data.price)
        let daoJuConfig =  Manager.utils.GetDaoJuConfig();
        let daoJuConfigItem = Manager.utils.GetDaoJuConfigItem( data.propID ,daoJuConfig );
        // this.propBuy_gc.text = daoJuConfigItem.MingZi+"购买"
        this.propBuy_gc.getChild("propKaItem").asCom.getChild("propItemBg").icon =fgui.UIPackage.getItemURL("hall",daoJuConfigItem.bgPath) 
        this.propBuy_gc.getChild("propKaItem").asCom.getChild("propItemIcon").icon = fgui.UIPackage.getItemURL("hall","daoju_kapai_"+data.propID);
        this.propBuy_gc.getChild("name").text = daoJuConfigItem.MingZi
        this.propBuy_gc.getChild("des").text = daoJuConfigItem.WenBenMiaoShu
        this.propBuy_gc.getChild("moreLeftProp").asCom.getChild("iconType").icon = Manager.gd.getCurrencyTypeIcon(data.currentType)
        this.propBuy_gc.getChild("moreLeftProp").asCom.getChild("moredes").text = data.price.toString()
        this.propBuy_gc.getChild("totalCost").asCom.getChild("iconType").icon = Manager.gd.getCurrencyTypeIcon(data.currentType)
        this.buyCount=1
        this.ChangeTotalCost()
    }



    ChangeTotalCost()
    {
        let data = Manager.gd.get<{propID:number,shopId:number,price:number,currentType:number}>("PropBuyData");
        this.buyCount_textInput.text = this.buyCount.toString()
        this.costTotal_text.text = (this.buyCount*data.price).toString()
    }




    
}


