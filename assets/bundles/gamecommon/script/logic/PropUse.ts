import { Config, ViewZOrder } from "../../../../scripts/common/config/Config";
import GameData from "../../../../scripts/common/data/GameData";
import PropBuy from "../../../../scripts/common/fairyui/PropBuy";
import { GameService } from "../../../../scripts/common/net/GameService";
import { BuyCurrencyType, ChatType, CurrencyType, GameCat, GroupId, PlayerAttr, PropType } from "../../../../scripts/def/GameEnums";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";
import PropTittle from "../../../hall/script/view/PropTittle";
import { MJC2SOperation } from "../../../mjcommon/script/net/MJC2SOperation";
import { RoomManager } from "../manager/RoomManager";
import { Tool } from "../tools/Tool";


export default class PropUse 
{

    root : fgui.GComponent = null;

    rootView_gc: fgui.GComponent = null;


    tableList :fgui.GList=null;

    bagData:pb.S2CGetBag
    private packsackPropDes_com:fgui.GComponent=null;
    private contentDes_com:fgui.GComponent=null;
    propTittleSC:PropTittle=null

    isShow =false;

    public constructor(root : fgui.GComponent) {
        this.root =root;
        this.setInit()
    }
    setInit()
    {
        this.root.makeFullScreen();
        // let strArr = "3001,3002".split(",")
        // let strAr1 = "3001,3002,10001,1002".split(",")
        // Log.e(" PropUse  setInit    strArr :",strArr)
        // Log.e(" PropUse  setInit    strArr1 :",strAr1)
        this.InitEvent();
        this.packsackPropDes_com = this.root.getChild("packsackPropDes").asCom;
        this.packsackPropDes_com.getChild("di").onClick(()=>{ 
            this.SetActivePropDes(false) ; },this)
        this.contentDes_com = this.packsackPropDes_com.getChild("content").asCom;
        this.propTittleSC =new PropTittle(this.contentDes_com.getChild("tittle").asCom)
        this.contentDes_com.getChild("closeBtn").asButton.onClick(()=>{
            this.SetActivePropDes(false);},this);
        this.contentDes_com.getChild("sureBtn").asButton.onClick(()=>{
            this.SetActivePropDes(false)
        },this);
        this.contentDes_com.getChild("sureBtn").asButton.text ="确认"



        RoomManager.GetBiaoQingConfig();
        this.root.getChild("di").onClick(()=>{
            this.SetActiveSelf(false);
            dispatch(ProtoDef.pb.C2SPropTableState,{name:"propUse",isShow:false});
        },this);
        this.rootView_gc = this.root.getChild("content").asCom
        this.rootView_gc.getChild("closeBtn").onClick(()=>{
            this.SetActiveSelf(false);
            dispatch(ProtoDef.pb.C2SPropTableState,{name:"propUse",isShow:false});

        },this);
        this.tableList=this.rootView_gc.getChild("list").asList;
        this.tableList.on(fgui.Event.CLICK_ITEM, this.onClickItem, this);
        


        Manager.utils.GetDaoJuConfig();
        this.SetActiveSelf(false)
        this.service.getShopItems();
        this.C2sGetBag()


    }



    get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }





    /** 添加事件 */
    protected InitEvent() {
        // Log.e("  propUse  InitEvent ")
        Manager.dispatcher.add(ProtoDef.pb.S2CGetBag, this.S2CGetBagReflashView, this);
        Manager.dispatcher.add(ProtoDef.pb.S2CPropUpdate+"Use", this.S2CPropUpdateReflashView, this);
        Manager.dispatcher.add("SetActiveSelfAndState", this.SetActiveSelfAndState, this);
        Manager.dispatcher.add("SpecialPropUse", this.SpecialPropUse, this);
        
    }




    /** 移除事件 */
    RemoveEvent() {
        // Log.e("  propUse  RemoveEvent ")

        Manager.dispatcher.remove(ProtoDef.pb.S2CGetBag, this);
        Manager.dispatcher.remove(ProtoDef.pb.S2CPropUpdate+"Use", this);
        Manager.dispatcher.remove("SetActiveSelfAndState", this);
        Manager.dispatcher.remove("SpecialPropUse", this);

    }


    C2sGetBag()
    {
        this.service.GetBag();
    }

    SetActiveSelfAndState(isShow:boolean)
    {
        this.SetActiveSelf(isShow);
        this.SetShowState(isShow);
    }


    SetActiveSelf(isShow:boolean)
    {
        this.root.visible = isShow;

    }

    
    SetShowState(isShow:boolean)
    {
        this.isShow = isShow;
    }

    S2CGetBagReflashView()
    {
        // Log.w(" S2CGetBag PropUse  游戏里边道具背包 ")
        let data = Manager.gd.get<pb.S2CGetBag>(ProtoDef.pb.S2CGetBag);
        this.Reflash(data)
        if(this.isShow)
        {
            this.SetActiveSelf(true)
        }
    }

    S2CPropUpdateReflashView()
    {
        let data = Manager.gd.get<pb.S2CGetBag>(ProtoDef.pb.S2CGetBag);
        // Log.w(" propUse  S2CPropUpdateReflashView S2CGetBag  data ",data)
        let updataData = Manager.gd.get<pb.S2CPropUpdate>(ProtoDef.pb.S2CPropUpdate);
        // Log.w(" propUse S2CPropUpdateReflashView  S2CGetBag  updataData ",updataData)
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
        this.Reflash(data)
        if(this.isShow)
        {
            this.SetActiveSelf(true)
        }
    }

    Reflash(data:pb.S2CGetBag){
        this.bagData =data;
        // Log.w(" Reflash.S2CGetBag  PropUse bagData fu~~~~~~~~~~ ",this.bagData)
        // Log.w(" S2CGetBag  RoomManager.gameType ",RoomManager.gameType)
        // Log.w(" S2CGetBag  RoomManager.roomcfgId ",RoomManager.roomcfgId)
        this.tableList.removeChildrenToPool()
        let gd = Manager.dataCenter.get(GameData);
        let zuanshiCount= gd.playerCurrencies(CurrencyType.CT_Gem);
        let liquanCount= gd.playerCurrencies(CurrencyType.CT_HuafeiQuan);
        let daoJuConfig =  Manager.utils.GetDaoJuConfig();
        let daoJuArr:any[]=[] ;
        for (const [key, val] of Object.entries(daoJuConfig.json))
        {
            daoJuArr.push(daoJuConfig.json[key] )
        }
            //价格排序便宜的放前边
        daoJuArr.sort(function (a, b) {

            if (a.DaoJuGouMai!=null && a.DaoJuGouMai!="" && b.DaoJuGouMai && b.DaoJuGouMai!="" ) {
                let costZuanA = a.DaoJuGouMai[BuyCurrencyType.BuyCurrencyType_Gem][1]
                let costZuanB = b.DaoJuGouMai[BuyCurrencyType.BuyCurrencyType_Gem][1]
                return costZuanA - costZuanB
            }
            else if (a.DaoJuGouMai==null || a.DaoJuGouMai=="" )
            {
                return 1
            }
            else if (b.DaoJuGouMai==null || b.DaoJuGouMai=="" )
            {
                return -1
            }
        });
        let haveArrPropId :number[] =[]
        if (this.bagData.items.length==0) 
        {
            for (let i = 0; i < daoJuArr.length; i++) 
            {
                this.addPropItem(daoJuArr[i],zuanshiCount,liquanCount,0,0)
            }
        }
        else
        {
            // let daoJuConfigItem = Manager.utils.GetDaoJuConfigItem( propID,daoJuConfig );

            for (let i = 0; i < this.bagData.items.length; i++) 
            {
                let itemData =  this.bagData.items[i].item
                let propID =itemData.itemType
                if (itemData.value>0) 
                {
                    haveArrPropId.push(propID)
                }
                const et = Manager.utils.GetDaoJuConfigItem( propID,daoJuConfig );

                // Log.w(" Reflash  et ",et)
                this.addPropItem(et,zuanshiCount,liquanCount,itemData.value,this.bagData.items[i].id)
            }

            for (const [key, val] of Object.entries(daoJuConfig.json))
            {
                const et =daoJuConfig.json[key]
                // Log.w(" onS2CGetBag  et ",et)
                if (!Tool.JudgeIsHave(haveArrPropId,Number(et.XuHao))) 
                {
                    this.addPropItem(et,zuanshiCount,liquanCount,0,0)
                }
            }
        }

    }



    addPropItem(et :any,zuanshiCount:number,liquanCount:number,haveCount:number,id:number)
    {
        if (this.isCanShowProp(et,haveCount)) 
        {
            let item = this.tableList.addItemFromPool().asCom;
            item.getChild("ad").visible=false;
            item.getChild("loader").icon = fgui.UIPackage.getItemURL("hall",et.bgPath);
            item.getChild("kaicon").icon =  fgui.UIPackage.getItemURL("hall","daoju_kapai_"+et.XuHao);

            let costType=0
            if (haveCount>0) 
            {
                item.getChild("jiage").x =111
                // item.getChild("y").visible =false
                item.getChild("costType").visible =false
                item.getChild("name").text = "X"+haveCount ;
                item.getChild("jiage").text = "使用" ;
            }
            else
            {
                let costZuan = et.DaoJuGouMai[BuyCurrencyType.BuyCurrencyType_Gem][1]
                let costQuan = et.DaoJuGouMai[BuyCurrencyType.BuyCurrencyType_HuafeiQuan][1]
                // Log.w(" addPropItem 02 costZuan ",costZuan,et.MingZi,et.XuHao)
                // Log.w(" addPropItem 03 costQuan ",costQuan)

                // item.getChild("y").visible =true
                item.getChild("name").visible =true
                item.getChild("costType").visible =true
                item.getChild("name").text = "X1"

                if (zuanshiCount>costZuan) 
                {
                    item.getChild("costType").icon = fgui.UIPackage.getItemURL("hall","icon_zuan");
                    item.getChild("jiage").text =costZuan.toString() ;
                    costType= BuyCurrencyType.BuyCurrencyType_Gem
                }
                else if (liquanCount> costQuan) 
                {
                    item.getChild("costType").icon = fgui.UIPackage.getItemURL("hall","icon_lijuan");
                    item.getChild("jiage").text =costQuan.toString() ;
                    costType= BuyCurrencyType.BuyCurrencyType_HuafeiQuan
                }
                else
                {
                    item.getChild("costType").icon = fgui.UIPackage.getItemURL("hall","icon_zuan");
                    item.getChild("jiage").text =costZuan.toString() ;
                    costType= BuyCurrencyType.BuyCurrencyType_Gem
                }
                item.getChild("jiage").x =120
            }
            item.data = {propId:et.XuHao,havecount:haveCount,costtype:costType,id:id,leiXing:et.DaoJuLeiXing };
        }
    }


    isCanShowProp(dataItem: any,haveCount:number) 
    {
        let isCanShow =false
        // Log.e("isCanShowProp  dataItem ",dataItem)
        if ( dataItem.XuHao>10000 && ( dataItem.DaoJuHuoDe==1 || haveCount>0 ) )//可以购买获得 并且是道具 或者本身就有
        {
            if (this.isCanUseById( dataItem.WanFaXianZhi,RoomManager.gameType)) //并且在当前游戏玩法可以不限制
            {
                if (this.isCanUseById( dataItem.PaiZhuoXianZhi,RoomManager.roomcfgId)) //并且在当前游戏玩法可以不限制
                {
                    if (dataItem.DaoJuLeiXing == PropType.PropType_HongZhongCard || dataItem.DaoJuLeiXing == PropType.PropType_BombCard ) 
                    {
                        if (RoomManager.curState == RoomManager.StateType.Resulting ) //红中和炸弹卡只有在结算的时候才能用
                        {
                            return true
                        }
                        else
                        {
                            return false
                        }
                    }
                    else
                    {
                        return true
                    }

                }

            }
        }
        return false
    }

    isCanUseById(str: string,id:number) 
    {
        let reg=/^\d*$/;
        if (!reg.test(str)) {
            let strArr = str.split(",")
            for (let index = 0; index < strArr.length; index++) 
            {
                if (Number(strArr[index]) == id  ) 
                {
                    return true
                }
            }
        }
        else
        {
            cc.log(str);
            if (Number(str) == id  ) 
            {
                return true
            } 
        }
        return false
    }

    backUseDdzCjjb():boolean{
        if(this.tableList == null){
            return false;
        }
        let data = Manager.gd.get<pb.S2CGetBag>(ProtoDef.pb.S2CGetBag);
        this.Reflash(data)

        let shopData = Manager.gd.get<pb.S2CGetShopItems>(ProtoDef.pb.S2CGetShopItems);
        Log.d("backUseDdzCjjb:",this.tableList._children.length);
        for (let index = 0; index < this.tableList._children.length; index++) {
            let data = this.tableList.getChildAt(index).data;
            if(data != null && data.havecount == 0){
                let propID = data.propId;
                Log.d("backUseDdzCjjb propID:",index,propID);
                if(propID >=10030 && propID<=10031){
                    let itemData = Manager.utils.GetShopItemData( propID,data.costtype ,shopData );
                    let tempData ={propID:0,shopId:0,price:0,currentType:0,title:"购买并使用"}
                    tempData.shopId = itemData.id
                    tempData.price =itemData.price
                    tempData.currentType = itemData.ct
                    tempData.propID = propID
                    Manager.gd.put("PropBuyData",tempData);
                    Manager.uiManager.openFairy({ type: PropBuy, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.TwoUI, name: "道具购买" });
                    return true;     
                }
            }
        }
        return false;
    }

    backUseDdzKdp():boolean{
        if(this.tableList == null){
            return false;
        }

        let data = Manager.gd.get<pb.S2CGetBag>(ProtoDef.pb.S2CGetBag);
        this.Reflash(data)
        
        let shopData = Manager.gd.get<pb.S2CGetShopItems>(ProtoDef.pb.S2CGetShopItems);
        Log.d("backUseDdzCjjb:",this.tableList._children.length);
        for (let index = 0; index < this.tableList._children.length; index++) {
            let data = this.tableList.getChildAt(index).data;
            if(data != null && data.havecount == 0){
                let propID = data.propId;
                if(propID >=10019 && propID<=10020){
                    let itemData = Manager.utils.GetShopItemData( propID,data.costtype ,shopData );
                    let tempData ={propID:0,shopId:0,price:0,currentType:0,title:"购买"}
                    tempData.shopId = itemData.id
                    tempData.price =itemData.price
                    tempData.currentType = itemData.ct
                    tempData.propID = propID
                    Manager.gd.put("PropBuyData",tempData);
                    Manager.uiManager.openFairy({ type: PropBuy, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.TwoUI, name: "道具购买" });
                    return true;     
                }
            }
        }
        return false;
    }

    onClickItem(obj: fgui.GObject){
        Log.d("PropUse onClickItem  data :",obj.data);
        let data = obj.data
        let shopData = Manager.gd.get<pb.S2CGetShopItems>(ProtoDef.pb.S2CGetShopItems);
        // 有道具的时候走使用没得道具的时候走购买
        // Log.d("PropUse onClickItem  shopData :",shopData);
        let propID = data.propId
        //{propId:et.XuHao,haveCount:haveCount,costType:costType }
        if (data.havecount>0) 
        {
            if (data.leiXing== PropType.PropType_PoFengCard) 
            {
                this.ShowPropDes(propID )
            }
            else
            {
                dispatch("propUseCommon",propID,data.id)
            }
        }
        else
        {
            let tempData ={propID:0,shopId:0,price:0,currentType:0}
            
            let itemData = Manager.utils.GetShopItemData( propID,data.costtype ,shopData );
            Log.d("PropUse onClickItem  itemData :",itemData);
            tempData.shopId = itemData.id
            tempData.price =itemData.price
            tempData.currentType = itemData.ct
            tempData.propID = propID
            Manager.gd.put("PropBuyData",tempData);
            Manager.uiManager.openFairy({ type: PropBuy, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.TwoUI, name: "道具购买" });
        }
    }
    SetActivePropDes(isShow:boolean)
    {   
        this.packsackPropDes_com.visible =isShow;

    }

    ShowPropDes(propId: number)
    {
        this.SetActivePropDes(true)
        let daoJuConfig =  Manager.utils.GetDaoJuConfig();
        let daoJuConfigItem = Manager.utils.GetDaoJuConfigItem( propId,daoJuConfig );
        this.contentDes_com.getChild("des").text = daoJuConfigItem.WenBenMiaoShu
        this.contentDes_com.getChild("propCard").asCom.getChild("propItemBg").icon =fgui.UIPackage.getItemURL("hall",daoJuConfigItem.bgPath) 
        this.contentDes_com.getChild("propCard").asCom.getChild("propItemIcon").icon = fgui.UIPackage.getItemURL("hall","daoju_kapai_"+ propId);
        this.propTittleSC.SetData(propId)

    }


    //点击破封的时候 先判断有没有卡 有卡直接使用     没有卡 就打开购买破封卡界面购买之后

    SpecialPropUse()
    {
        //isBackUse 返回后在使用道具
        let data = Manager.gd.get<{func:(isBackUse:boolean)=>{},propType:number,dataSpe:pb.S2CMahBetterMjSuggestion}>("SpecialPropUse");
        Log.w(" SpecialPropUse  data ",data)
        Log.w(" SpecialPropUse  this.bagData ",this.bagData)
        let propType = data.propType;

        let gd = Manager.dataCenter.get(GameData);
        let zuanshiCount= gd.playerCurrencies(CurrencyType.CT_Gem);
        let liquanCount= gd.playerCurrencies(CurrencyType.CT_HuafeiQuan);
        let daoJuConfig =  Manager.utils.GetDaoJuConfig();


        // let propBagId =0 //背包的物品ID

        // let haveArrPropId :number[] =[]
        if (this.bagData.items.length>=0) 
        {
            for (let i = 0; i < this.bagData.items.length; i++) 
            {
                let itemData =  this.bagData.items[i].item
                let propID =itemData.itemType
                const et = Manager.utils.GetDaoJuConfigItem( propID,daoJuConfig );
                if (et.DaoJuLeiXing== propType) 
                {
                    // Log.w(" SpecialPropUse  有得时候 et ",et)
                    // propBagId = this.bagData.items[i].id
                    if (itemData.value>0) 
                    {


                        dispatch("propUseCommon",propID,this.bagData.items[i].id,data.dataSpe)
                        data.func(false)
                        this.SetActiveSelf(false)
                        this.SetShowState(false);
                        return
                    }
                }
            }
        }

        for (const [key, val] of Object.entries(daoJuConfig.json))
        {
            const et =daoJuConfig.json[key]
            // Log.w(" SpecialPropUse  et ",et)
            if (this.isCanShowProp(et,0)) 
            {
                let costZuan = et.DaoJuGouMai[BuyCurrencyType.BuyCurrencyType_Gem][1]
                let costQuan = et.DaoJuGouMai[BuyCurrencyType.BuyCurrencyType_HuafeiQuan][1]
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
                if (et.DaoJuLeiXing== propType ) {
                    let tempData ={propID:0,shopId:0,price:0,currentType:0,title:"购买并使用" }
                    let propID = et.XuHao
                    let shopData = Manager.gd.get<pb.S2CGetShopItems>(ProtoDef.pb.S2CGetShopItems);
                    let itemData = Manager.utils.GetShopItemData( propID,costType ,shopData );
                    // Log.e("PropUse onClickItem  itemData :",itemData);
                    tempData.shopId = itemData.id
                    tempData.price =itemData.price
                    tempData.currentType = itemData.ct
                    tempData.propID = propID
                    Manager.gd.put("PropBuyData",tempData);
                    Manager.uiManager.openFairy({ type: PropBuy, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.TwoUI, name: "道具购买" });
                    data.func(true)
                    this.SetShowState(false);
                }


            }



        }
        

    }





    Reset()
    {
        this.SetActiveSelf(false);
        this.SetShowState(false);
    }



}



