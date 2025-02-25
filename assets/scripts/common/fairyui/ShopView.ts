import TopUI from "./TopUI";
import { BuyCurrencyType, CurrencyType, GroupId } from "../../def/GameEnums";
import { ProtoDef } from "../../def/ProtoDef";
import UIView from "../../framework/core/ui/UIView";
import { Config, ViewZOrder } from "../config/Config";
import { GameEvent } from "../event/GameEvent";
import { GameService } from "../net/GameService";
import PropBuy from "./PropBuy";
import GameData from "../data/GameData";
import { Utils } from "../utils/Utils";


const {ccclass, property} = cc._decorator;

@ccclass
export default class ShopView extends UIView {



    private close_btn :fgui.GButton=null;

    private topUI:TopUI = null;
    private leftTab:fgui.GButton[] = [];
    private tableList:fgui.GList = null;
    private selectIndex:number = 0;

    private longTouchId:number;


    // private shopItemObj: fgui.GObject=null;

    get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }

    protected addEvents(): void 
    {
        Log.e("注册 ShopView ")
        this.addEvent(ProtoDef.pb.S2CGetShopItems+"shopView", this.S2CGetShopItemsReflashView);
        this.addEvent(ProtoDef.pb.S2CBuyShopItem+"_refresh", this.S2CGetShopItemsReflashView);
        if(this.topUI){
            this.topUI.addListeners();
        }
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
            resName : "ShopView",
        }
        return path;
    }

    onLoad() {
        Log.e("   ShopView onLoad ")
        super.onLoad();
        this.show();
        this.service.getShopItems();
    }

    onDispose(): void {
        Log.e("   ShopView onDispose ")
        super.onDispose();

        if(this.topUI){
            this.topUI.removeEventListeners();
        }
        clearTimeout( this.longTouchId)
    }



    protected onEnterForgeground(inBackgroundTime: number) {
        // Log.e("   ShopView onEnterForgeground  ")
        this.longTouchId = setTimeout(() => {
            this.S2CGetShopItemsReflashView();
        }, 200);

    }

    onFairyLoad(): void {
        Log.d("   ShopView onFairyLoad ")
        this.enableFrontAndBackgroundSwitch = true;
        this.close_btn = this.root.getChild("close").asButton;
        this.close_btn.onClick(this.onClickClose, this);
        this.root.getChild("hint").visible = false;
        this.close_btn.asCom.getChild("back").asCom.getChild("gn").text = "商城";
        for (let index = 0; index < 6; index++) {
            this.leftTab[index]=this.root.getChild("tab"+index).asButton;
            this.leftTab[index].visible = false;
            this.leftTab[index].onClick(this.onClickLeftTab,this);
            this.leftTab[index].getChild("title1").data = index;
            this.leftTab[index].getChild("title1").asTextField.fontSize = this.leftTab[index].getChild("title").asTextField.fontSize;
         }

         this.tableList = this.root.getChild("list").asList;
         this.tableList.on(fgui.Event.CLICK_ITEM, this.onClickItem, this);
         this.addEvents()

         this.root.makeFullScreen();

         this.topUI = new TopUI();
         this.topUI.setRoot(this.root);
         
         let list = this.root.getChild("list").asList;
         let ysw = list.width - list.initWidth;
         if(ysw > 0){
             list.columnGap += ysw / 4;
         }
         let left = this.root.getChild("left").width;
         list.x = (fgui.GRoot.inst.width - left) / 2 + left;
         this.topUI.refresh();
    }

    onClickClose(){
        Manager.uiManager.close(ShopView);
        dispatch(GameEvent.Silent_GO_HALL,"ShopView.onClickClose");
    }

    

    public show(): void {
        super.show();
        this.topUI.refresh();
    }



    S2CGetShopItemsReflashView()
    {
        // if (Manager.gd.LocalPosition != "HallView") {
        //     return
        // }

        // Manager.platform.printAdStatus();

        let data = Manager.gd.get<pb.S2CGetShopItems>(ProtoDef.pb.S2CGetShopItems);
        let isFind = -1;
        let cn = Manager.gd.get(ProtoDef.pb.S2CGetShopItems+"Index") as any;
        if(cn != null && cn.catName != null && cn.catName.length > 0){
            for (let index = 0; index < data.catShop.length; index++) {
                // Log.d(this.leftTab[index].text ,cn.catName,this.leftTab[index].text == cn.catName)
                if(data.catShop[index].catName == cn.catName){
                    isFind = index;
                    break;
                }   
            }
        }
  
        if (isFind != -1) {
            this.selectIndex = isFind;
        }
        Log.d("this.selectIndex",this.selectIndex,isFind);
        this.Reflash(data)
        this.leftTab[this.selectIndex].selected = true;
    }

    onClickLeftTab(evt: fgui.Event){
        let data = fgui.GObject.cast(evt.currentTarget);
        // Log.e("onClickLeftTab:",data.data.items);
        if(data.asCom){
            this.selectIndex = data.asCom.getChild("title1").data;
            Manager.gd.put(ProtoDef.pb.S2CGetShopItems+"Index",null);
        }
        this.updateListView(data.data.items);
    }

    setRootVisible(v:boolean) {
        if(this.root){
            this.root.visible = v;
        }
    }

    Reflash(data:pb.IS2CGetShopItems){
        // this.show();
        let isSelect = false;
        // Log.d("shop this.selectIndex:",this.selectIndex);

        Log.d("shop data:",data);
        for (let index = 0; index < data.catShop.length; index++) {
            this.leftTab[index].text = data.catShop[index].catName;
            this.leftTab[index].getChild("title1").text = data.catShop[index].catName;
            this.leftTab[index].getChild("title1").data = index;
            this.leftTab[index].visible = true;
            this.leftTab[index].data = data.catShop[index];
            if(data.catShop[index].catName.search("免费") != -1){
                this.leftTab[index].getChild("rp").visible = true;
            }
            if(index==this.selectIndex){
                this.updateListView(data.catShop[index].items);
                isSelect = true;
            }
        }
        if(!isSelect){
            this.updateListView(data.catShop[0].items);
        }
    }

    updateListView(data:pb.IShopItem[]){
        this.tableList.removeChildrenToPool();
        data.sort((item1, item2) => item1.price - item2.price);
        for (let index = 0; index < data.length; index++) {
            const et = data[index];
            let item = this.tableList.addItemFromPool().asCom;
            item.getChild("name").text = et.name;
            item.getChild("gzk").visible = false;
            if(et.catName == "钻石" || et.catName == "金币"){
                if(et.donateAmount > 0){
                    item.getChild("gzk").visible = true;
                    if(et.catName == "钻石"){
                        item.getChild("name").text = et.amount+"+"+et.donateAmount+et.catName;
                    }else{
                        item.getChild("name").text = Manager.utils.formatCoin(et.amount+et.donateAmount,et.itemType)+"金豆";
                    }
                    let zk = Number(10*et.amount/(et.amount+et.donateAmount)).toFixed(1);
                    item.getChild("zk").text = zk+"折";
                }else{
                    item.getChild("name").text = et.amount+et.catName;
                }
            }
            if (et.ct == BuyCurrencyType.BuyCurrencyType_Rmb) {
                item.getChild("jiage").text = "￥"+et.price.toString()
                item.getChild("jiage").x = 110;
            } 
            else 
            {
                item.getChild("jiage").text = et.price.toString()
                item.getChild("jiage").x =120
            }

            item.getChild("costType").visible =false;
            if (et.ct != BuyCurrencyType.BuyCurrencyType_Rmb && et.ct != BuyCurrencyType.BuyCurrencyType_Advert && et.ct != BuyCurrencyType.BuyCurrencyType_Share) {
                item.getChild("costType").visible =true;
                item.getChild("costType").icon = Manager.gd.getCurrencyTypeIcon(et.ct);  
            }
            let ad = item.getChild("ad");
            ad.visible = false;
            item.getChild("jiage").visible = true;

            if(et.ct == BuyCurrencyType.BuyCurrencyType_Advert){
                item.getChild("jiage").visible = false;
                ad.visible = true;
                if(et.price == 0){
                    ad.text = "明日再来";
                }else{
                    let ggcsid = Manager.gd.playerGV(GroupId.GI_ZeroBuyAdTimes ,et.id,0);
                    ad.text =String.format( "剩余视频次数:\n{0}/{1}",ggcsid,et.price)
                }
                
            }
            item.enabled = true;
            if(et.ct == BuyCurrencyType.BuyCurrencyType_Share){
                item.getChild("jiage").visible = false;
                ad.visible = true;
                if(et.dayLimit == 0){
                    ad.text = "明日再来";
                    item.enabled = false;
                }else{
                    let ggcsid = Manager.gd.playerGV(GroupId.GI_ZeroBuyAdTimes,et.id,0);
                    ad.text =String.format( "剩余分享次数:\n{0}/{1}",ggcsid,et.price)
                }
                
            }

            let url = Manager.gd.getShopIcon(et.itemType,index);
            item.getChild("loader").icon = url;
            item.getChild("loader").setScale(1,1)
            item.getChild("kaicon").visible=false
            if (et.itemType>10000) //道具卡
            {
                // Log.w(" updateListView et.itemType  ",et.itemType)
                item.getChild("kaicon").icon =  fgui.UIPackage.getItemURL("hall","daoju_kapai_"+et.itemType);
                item.getChild("kaicon").visible=true
                item.getChild("kaicon").setScale(0.7,0.7)
                item.getChild("loader").setScale(0.7,0.7)

            } 
            item.data = et;
        }
    }

    onClickItem(obj: fgui.GObject){

        if(obj.data == null){
            return;
        }
        let itemData = obj.data as pb.IShopItem;

        if(itemData.ct == BuyCurrencyType.BuyCurrencyType_Advert){
            let jsonData={adname:"Ad_FreeCoin",parms1:itemData.id.toString(),parms2:""}
            Manager.adManeger.WatchAds(jsonData ,()=>{
                if (!Manager.platform.isAdOpen()) {
                    this.service.onc2SBuyShopItem(obj.data.id,1);
                } 

            })
            return;
        }

        if(itemData.ct == BuyCurrencyType.BuyCurrencyType_Share){
            let jsonData={adname:"Ad_FreeCoin",parms1:itemData.id.toString(),parms2:""}
            Manager.adManeger.WatchAds(jsonData ,()=>{
                if (!Manager.platform.isAdOpen()) {
                    this.service.onc2SBuyShopItem(obj.data.id,1);
                } 

            })
            return;
        }


        let gd = Manager.dataCenter.get(GameData);
        let zuanshiCount= gd.playerCurrencies(CurrencyType.CT_Gem);

        function ff(params:boolean) {
            // Log.d("Manager.alert ff",params);
            if (params){
                this.service.onc2SBuyShopItem(obj.data.id,1);
            }else{
                Manager.tips.show("购买已取消");
            }
        }

        let cf:AlertConfig={
            // immediatelyCallback : true,
            title:"提示",
            text: "你确定要花费"+ obj.data.price +"购买这件商品吗",   
            confirmCb: ff.bind(this),        
            cancelCb: ff.bind(this),
        };

        
        function callBackF(params:boolean) 
        {
            if (params) //跳转充值 在钻石合适的价格范围内拉起支付
            {
                Manager.utils.onClickItemBuy(obj.data.price,obj.data.id,1);
            }
        }
            
        if (obj.data.itemType>10000) 
        {
            let tempData ={propID:Number,shopId:Number,price:Number,currentType:Number}
            tempData.propID = obj.data.itemType
            tempData.shopId = obj.data.id
            tempData.price = obj.data.price
            tempData.currentType = obj.data.ct
            Manager.gd.put("PropBuyData",tempData);
            Manager.uiManager.openFairy({ type: PropBuy, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.TwoUI, name: "道具购买" });
        }
        else
        {
            if (itemData.ct == BuyCurrencyType.BuyCurrencyType_Rmb){
                Manager.pay.choosePay(obj.data);
            }
            else if (itemData.ct == BuyCurrencyType.BuyCurrencyType_Gem){

                if (zuanshiCount<obj.data.price ) {
                    // Manager.tips.show("钻石不足");
                    Manager.utils.CommonShowMsg("12",callBackF);
                    // Manager.utils.CommonShowMsg("12",callBackF.bind(this));
                } else {
                    Manager.alert.show(cf);
                }
            }
            else{
                Manager.alert.show(cf);
            }
        }
    }

    
}


