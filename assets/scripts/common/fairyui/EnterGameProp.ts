
import { Config, ViewZOrder } from "../config/Config";
import GameData from "../data/GameData";
import { GameEvent } from "../event/GameEvent";
import FLevel2UI from "./FLevel2UI";
import { CmmProto } from "../net/CmmProto";
import { GameService } from "../net/GameService";
import { AdFuncId, AdSdkType, BuyCurrencyType, CfgType, CommSubID, CurrencyType, GameCat, GroupId, PoChanRewardType, PropType } from "../../def/GameEnums";
import { ProtoDef } from "../../def/ProtoDef";
import HallView from "../../../bundles/hall/script/view/HallView";
import UIView from "../../framework/core/ui/UIView";
import PropBuy from "./PropBuy";


const {ccclass, property} = cc._decorator;

@ccclass
export default class EnterGameProp extends UIView {

    private tableList:fgui.GList = null;
    private bagData:pb.S2CGetBag=null;
    private gameType:number
    private cfgId:number
    private content_com:fgui.GComponent=null;
    private choose_btn :fgui.GButton=null;
    private isMoRenChoose :boolean;



    get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }
    protected addEvents(): void 
    {
        Log.e(" EnterGameProp  注册了  ")
        this.addEvent(ProtoDef.pb.S2CGetBag+"Enter", this.S2CGetBagReflashView);
        this.addEvent(ProtoDef.pb.S2CPropUpdate+"Enter", this.S2CPropUpdateReflashView);
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
            resName : "enterGameProp",
        }
        return path;
    }

    onLoad() {
        super.onLoad();
        this.ReFlashView()
    }


    public show(): void {
        super.show();
    }

    public hide(): void {
        super.hide();
    }


    SetEnterPropStorage(value:number,isForce:boolean)
    {
        if (cc.sys.localStorage.getItem("EnterPropStorage")==null ) {
            if (isForce) 
            {
                cc.sys.localStorage.setItem('EnterPropStorage',value);
            }
        }
        else
        {
            cc.sys.localStorage.setItem('EnterPropStorage',value);
        }
    }

    SetMoRenChoose(state:boolean)
    {
        this.isMoRenChoose =state;
    }

    onClickChoose()
    {
        if (this.isMoRenChoose) 
        {
            this.SetMoRenChoose(false);
            this.choose_btn.getChild("n1").visible=false
        }
        else
        {            
            this.SetMoRenChoose(true);
            this.choose_btn.getChild("n1").visible=true
        }
    }


    onFairyLoad(): void {


        // Log.w(" EnterGameProp onBind ")
        this.addEvents()
        let close = this.root.getChild("di");
        close.onClick(this.onClickClose,this);
        this.content_com = this.root.getChild("content").asCom

        this.content_com.getChild("closeBtn").onClick(this.onClickClose,this);

        this.choose_btn = this.content_com.getChild("choose").asButton
        this.choose_btn.onClick(this.onClickChoose,this);

        this.tableList =this.content_com.getChild("list").asList
        this.tableList.removeChildrenToPool()
        for (let index = 0; index < 3; index++) 
        {
            this.tableList.addItemFromPool().asCom;
        }
        let itemcom =    this.tableList.getChildAt(0).asCom
        itemcom.getChild("icon").visible = true;
        itemcom.getChild("des").visible =true
        Manager.utils.quickSetIcon(itemcom);

        let txt = itemcom.getChild("desTittle").asTextField;
        txt.align = cc.Label.HorizontalAlign.RIGHT;
        txt.text ="道具进入";

        let prop_com = itemcom.getChild("propKaItem").asCom;
        prop_com.getChild("propItemBg").icon =fgui.UIPackage.getItemURL("hall","ui_daoju_icon_4") 
        prop_com.asCom.getChild("propItemIcon").icon = fgui.UIPackage.getItemURL("hall","ui_daoju_icon_3");
        prop_com.setScale(1,1)


        itemcom = this.tableList.getChildAt(2).asCom

        itemcom.getChild("des").visible =false

        itemcom.getChild("desTittle").visible =true
        itemcom.getChild("desTittle").text ="无道具进入"

        prop_com = itemcom.getChild("propKaItem").asCom;
        prop_com.getChild("propItemBg").icon =fgui.UIPackage.getItemURL("hall","ui_daoju_icon_4") 
        prop_com.asCom.getChild("propItemIcon").icon = fgui.UIPackage.getItemURL("hall","ui_daoju_icon_5");
        prop_com.setScale(1,1)

        this.tableList.on(fgui.Event.CLICK_ITEM, this.onClickItem, this);
        this.service.getShopItems();
        this.SetMoRenChoose(true);
    }


    onClickClose(){
        this.onHide();
        let tab = Manager.gd.get<pb.S2CGetTables>(ProtoDef.pb.S2CGetTables);
        if(tab == null){
            return;
        }
        if(tab.quick){
            dispatch(GameEvent.Silent_GO_HALL,"EnterGameProp.onClickClose");
        }
    }


    onHide(){
        Manager.uiManager.close(EnterGameProp);
    }

    ReFlashView()
    {
        let data = Manager.gd.get<{gameType:number,cfgId:number,func:()=>{},isInGame:true}>("EnterGamePropData");
        this.cfgId=data.cfgId
        this.gameType=data.gameType
        this.content_com.getChild("tittle").text = this.GetTittileByGameType(this.gameType)
        this.content_com.getChild("des").text = this.GetDesByGameType(this.gameType)
        this.service.GetBag();

    }


    GetTittileByGameType(gameType:number)
    {
        let strDes =""
        if (gameType==GameCat.GameCat_Dou ) 
        {
            strDes ="额外获得炸弹"
        } 
        else  if (gameType==GameCat.GameCat_Mahjong ) 
        {
            strDes ="额外获得红中"
        }
        return strDes
    }

    GetDesByGameType(gameType:number)
    {
        let strDes ="看广告和使用道具可额外获得一个"
        if(!Manager.platform.isAdOpen()){
            strDes ="分享和使用道具可额外获得一个"
        }
        if (gameType==GameCat.GameCat_Dou ) 
        {
            strDes =strDes+"炸弹!"
        } 
        else  if (gameType==GameCat.GameCat_Mahjong ) 
        {
            strDes =strDes+"福卡红中!"
        }
        return strDes
    }

    S2CPropUpdateReflashView()
    {


        let data = Manager.gd.get<pb.S2CGetBag>(ProtoDef.pb.S2CGetBag);
        // Log.w(" S2CPropUpdateReflashView S2CGetBag  data ",data)
        let updataData = Manager.gd.get<pb.S2CPropUpdate>(ProtoDef.pb.S2CPropUpdate);
        // Log.w("S2CPropUpdateReflashView  S2CGetBag  updataData ",updataData)
        let isHave =false
        for (const [key, val] of Object.entries(data.items))
        {
            let et:pb.IPropItem =data.items[key]
            if (et.id==updataData.item.id) 
            {
                et.item.value= updataData.item.item.value;
                isHave =true
            }
        }
        if (!isHave) 
        {
            type Packet = typeof pb.PropItem;
            let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.PropItem);
            let dataTemp = new Packet();
            dataTemp.createTime=updataData.item.createTime
            dataTemp.expireTime=updataData.item.expireTime
            dataTemp.id=updataData.item.id
            dataTemp.item=updataData.item.item
            dataTemp.quantity=updataData.item.quantity
            dataTemp.uid=updataData.item.uid
            data.items.push(dataTemp)
        }
        Manager.dataCenter.get(GameData).put(ProtoDef.pb.S2CGetBag,data);

        this.S2CGetBagReflashView();
    }



    S2CGetBagReflashView()
    {
        // if (!this.root.visible) 
        // {
        //     return
        // }

        let data = Manager.gd.get<pb.S2CGetBag>(ProtoDef.pb.S2CGetBag);
        let hongchongCount = 0
        let itemcom =    this.tableList.getChildAt(1).asCom
        // itemcom.getChild("ggtitle").visible =false
        itemcom.getChild("desTittle").visible =true
        itemcom.getChild("desTittle").text ="使用道具"
        let daoJuConfig =  Manager.utils.GetDaoJuConfig();
        let itemDJData = this.getHZZhaDanDaoJuConfig()
        // Log.w("S2CGetBagReflashView Bag data : ",data)
        // Log.w("S2CGetBagReflashView itemDJData : ",itemDJData)
        
        let prop_com = itemcom.getChild("propKaItem").asCom;
        prop_com.getChild("propItemBg").icon =fgui.UIPackage.getItemURL("hall",itemDJData.bgPath) 
        prop_com.asCom.getChild("propItemIcon").icon = fgui.UIPackage.getItemURL("hall","daoju_kapai_"+itemDJData.XuHao);
        prop_com.setScale(0.7,0.7)
        let propID = itemDJData.XuHao
        let itemData = Manager.utils.GetDaoJuItemData( propID ,data );
        let daoJuId:number=0
        if (itemData!=null) 
        {
            hongchongCount = itemData.item.value
            daoJuId=itemData.id
        }
        itemcom.getChild("des").text =String.format("拥有数量: [color=#ffea7a]{0}[/color]",hongchongCount)
        itemcom.data={index:1,id:daoJuId,count:hongchongCount }

        let itemzzj =    this.tableList.getChildAt(2).asCom
        itemzzj.data={index:2,id:0,count:0 }

        let itemgg =    this.tableList.getChildAt(0).asCom
        itemgg.data={index:0,id:0,count:0 }

        let gd = Manager.dataCenter.get(GameData);
        // Log.e(" ReflashSelfBqPlayer gd  ",gd)
        let djhave =  Manager.utils.GetItemDataByKey(GroupId.GI_Comm);
        // Log.e(" ReflashSelfBqPlayer djhave  ",djhave)
        let cfg = Manager.gd.get<pb.S2CCfgs>(ProtoDef.pb.S2CCfgs);
        // Log.e(" ReflashSelfBqPlayer cfg  ",cfg)
        let totalCount = 10
        let currentCount = 0
        if (this.gameType==GameCat.GameCat_Dou ) 
        {
            if(cfg != null&&cfg.items!=null && cfg.items[CfgType.CfgType_AdGetBombCardTimes]!=null )
            {
                totalCount = cfg.items[CfgType.CfgType_AdGetBombCardTimes];  
            }
            if (djhave[CommSubID.CommSubID_AdBombCard]) {
                currentCount=djhave[CommSubID.CommSubID_AdBombCard].value
            }

        } 
        else  if (this.gameType==GameCat.GameCat_Mahjong ) 
        {
            if (cfg != null&&cfg.items!=null && cfg.items[CfgType.CfgType_AdGetHongZhongCardTimes]!=null )
            {
                totalCount = cfg.items[CfgType.CfgType_AdGetHongZhongCardTimes];  
            }
            if (djhave[CommSubID.CommSubID_AdHongZhongCard]) {
                currentCount=djhave[CommSubID.CommSubID_AdHongZhongCard].value
            }
        }
        itemgg.getChild("des").text =String.format("剩余次数: [color=#ffea7a]{0}/{1}[/color] ",currentCount,totalCount)


        let isShow=true;
        //如果道具进入游戏过就默认直接使用道具进入
        if (cc.sys.localStorage.getItem("EnterPropStorage")!=null  ) 
        {
            if (cc.sys.localStorage.getItem("EnterPropStorage")==1) {

                //并且有卡的时候先试用道具卡没得卡的时候默认使用看广告
                if (hongchongCount>0) 
                {
                    isShow =false;
                    this.UseDaoJuKa(hongchongCount,daoJuId);
                    return;
                }
                if (currentCount<totalCount ) 
                {
                    isShow =false;
                    this.UseLookGuangGaoKa();
                    return;
                }
            }
        }

        if (isShow) {
            this.show();
        }


    }

    //.当玩家没有初级道具，只有高级道具时，则表现高级道具 当玩家初级、高级道具都没有时，则表现高级道具
    getHZZhaDanDaoJuConfig() 
    {
        let data = Manager.gd.get<pb.S2CGetBag>(ProtoDef.pb.S2CGetBag);
        // Log.w(" onS2CGetBag ~~~~~~~~~~~ data: ",data )
        let daoJuConfig =  Manager.utils.GetDaoJuConfig();
        // Log.w(" getHZZhaDanDaoJuConfig  daoJuConfig ",daoJuConfig)
        let dataTemp =null
        
        let dataAll:any[]=[]

        for (const [key, val] of Object.entries(daoJuConfig.json))
        {
            const et =daoJuConfig.json[key]
            // Log.w(" onS2CGetBag  et this.gameType: ",et, this.gameType ,this.cfgId )
            if (et.DaoJuLeiXing == PropType.PropType_BombCard || et.DaoJuLeiXing == PropType.PropType_HongZhongCard   ) 
            {

                if (this.isCanUseById( et.WanFaXianZhi,this.gameType)) //并且在当前游戏玩法可以不限制
                {
                    let propID = et.XuHao
                    // Log.w(" onS2CGetBag  propID: ",propID )
                    let itemData = Manager.utils.GetDaoJuItemData( propID ,data );
                    // if (itemData!=null && itemData.item.value>0) 
                    // {
                        dataAll.push(et)
                    // }
                    if (this.isCanUseById( et.PaiZhuoXianZhi,this.cfgId)) //并且在当前游戏玩法可以不限制
                    {

                        // Log.w(" onS2CGetBag  itemData: ",itemData )
                        if (itemData!=null && itemData.item.value>0) 
                        {
                            return et
                        }
                        dataTemp =et
                    }

                }
            }
        }

        // Log.w(" onS2CGetBag ~~~~~~~~~~~ dataAll: ",dataAll )
        // Log.w(" onS2CGetBag ~~~~~~~~~~~ dataAll.length ",dataAll.length )
        // Log.w(" onS2CGetBag ~~~~~~~~~~~dataTemp",dataTemp )

        if (dataAll!=null&& dataAll!=[] && dataAll.length!=0) 
        {
            dataAll.sort(function (a, b) {
                return a.DaoJuDengJi-b.DaoJuDengJi
            });
            let daojuLevel = dataTemp.DaoJuDengJi

            for (let i = 0; i < dataAll.length; i++) 
            {
                const et =dataAll[i]

                if (et.daijuLevel > daojuLevel) 
                {
                    let propID = et.XuHao
                    // Log.w(" onS2CGetBag ffffffff propID: ",propID )
                    let itemData = Manager.utils.GetDaoJuItemData( propID ,data );
                    if (itemData!=null && itemData.item.value>0 ) 
                    {
                        return et
                    }
                }
            }
        }


        return dataTemp
    }

    isCanUseById(str: string,id:number) 
    {
        let strArr = str.split(",")
        for (let index = 0; index < strArr.length; index++) 
        {
            if (Number(strArr[index]) == id  ) 
            {
                return true
            }
        }
        return false
    }

    onClickItem(obj: fgui.GObject)
    {
        let enterData = Manager.gd.get<{gameType:number,cfgId:number,func:()=>{},isInGame:true}>("EnterGamePropData");
        let data = obj.data;
        //0 看广告 1  道具进入 2 直接进去
        if (data.index==0) 
        {
            this.UseLookGuangGaoKa()
        }
        else  if (data.index==1) 
        {
            this.UseDaoJuKa(data.count,data.id)
        }
        if (data.index==2) 
        {
            if (enterData.isInGame) {
                enterData.func();
            }
            else
            {
                this.service.matchTable(this.gameType,this.cfgId);
            }
            this.onHide()
            this.SetEnterPropStorage(0,true)    
        }


    }

    UseLookGuangGaoKa()
    {
        let enterData = Manager.gd.get<{gameType:number,cfgId:number,func:()=>{},isInGame:true}>("EnterGamePropData");

        // type Packet = typeof pb.AdData;
        // let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.AdData);
        // let packet = new Packet();
        // packet.sdkType=AdSdkType.AdSdkType_Ylh
        // packet.intParam =this.cfgId
        // if (this.gameType==GameCat.GameCat_Dou ) 
        // {
        //     packet.funcId =AdFuncId.Ad_BombGetMatch
        // } 
        // else  if (this.gameType==GameCat.GameCat_Mahjong ) 
        // {
        //     packet.funcId =AdFuncId.Ad_HongZhongGetMatch
        // }
        // this.service.c2SAdEnd(packet,null);

        let jsonData={adname:"",parms1:"",parms2:""}
        jsonData.adname="Ad_MatchEnter";
        jsonData.parms1=this.cfgId.toString();
        jsonData.parms2="";

        Manager.adManeger.WatchAds(jsonData,()=>{

            if (enterData.isInGame) {
                enterData.func();
            }
            else
            {
                if (!Manager.platform.isAdOpen()) {
                    this.service.matchTable(this.gameType,this.cfgId);
                } 

            }
            this.onHide()
    
            //看广告和道具进入就存储下
            if (this.isMoRenChoose) 
            {
                this.SetEnterPropStorage(1,true)    
            }

        })

    }




    UseDaoJuKa(count:number,id:number)
    {
        let enterData = Manager.gd.get<{gameType:number,cfgId:number,func:()=>{},isInGame:true}>("EnterGamePropData");

        if (count>0) 
        {
            this.service.c2SUseProp(id,null);
            if (enterData.isInGame) {
                enterData.func();
            }
            else
            {
                this.service.matchTable(this.gameType,this.cfgId);
             
            }
            this.onHide()
            
            //看广告和道具进入就存储下
            if (this.isMoRenChoose) 
            {
                this.SetEnterPropStorage(1,true)    
            }
        }
        else
        {

            let gd = Manager.dataCenter.get(GameData);
            let zuanshiCount= gd.playerCurrencies(CurrencyType.CT_Gem);
            let liquanCount= gd.playerCurrencies(CurrencyType.CT_HuafeiQuan);

            let daoJuConfig =  Manager.utils.GetDaoJuConfig();
            let itemDJData = this.getHZZhaDanDaoJuConfig()
            // Log.w("S2CGetBagReflashView Bag data : ",data)
            // Log.w("S2CGetBagReflashView itemDJData : ",itemDJData)
            let propID = itemDJData.XuHao
            // let itemDatadaoju = Manager.utils.GetDaoJuItemData( propID ,data );


            let costZuan = itemDJData.DaoJuGouMai[BuyCurrencyType.BuyCurrencyType_Gem][1]
            let costQuan = itemDJData.DaoJuGouMai[BuyCurrencyType.BuyCurrencyType_HuafeiQuan][1]
            // Log.w(" onS2CGetBag  costZuan ",costZuan)
            // Log.w(" onS2CGetBag  costQuan ",costQuan)
            let costType=0
            if (zuanshiCount>costZuan) 
            {
                costType= BuyCurrencyType.BuyCurrencyType_Gem
            }
            else if (liquanCount> costQuan) 
            {
                costType= BuyCurrencyType.BuyCurrencyType_HuafeiQuan
            }
            else
            {
                costType= BuyCurrencyType.BuyCurrencyType_Gem
            }

            let tempData ={propID:0,shopId:0,price:0,currentType:0}
            let shopData = Manager.gd.get<pb.S2CGetShopItems>(ProtoDef.pb.S2CGetShopItems);
            Log.e("PropUse onClickItem  propID ,costType",propID,costType);
            Log.e("PropUse onClickItem  shopData",shopData);
            let itemData = Manager.utils.GetShopItemData( propID,costType ,shopData );
            Log.e("PropUse onClickItem  itemData :",itemData);
            tempData.shopId = itemData.id
            tempData.price =itemData.price
            tempData.currentType = itemData.ct
            tempData.propID = propID
            Manager.gd.put("PropBuyData",tempData);
            Manager.uiManager.openFairy({ type: PropBuy, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.TwoUI, name: "道具购买" });

        } 


    }



}