import { Config, ViewZOrder } from "../../../../scripts/common/config/Config";
import FLevel2UI from "../../../../scripts/common/fairyui/FLevel2UI";
import { GameService } from "../../../../scripts/common/net/GameService";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";
import HallView from "./HallView";
import PropTittle from "./PropTittle";

export default class PacksackView extends FLevel2UI {

    private packsackContent_com:fgui.GComponent=null;
    private tableList:fgui.GList = null;

    private none_obj:fgui.GObject=null

    private topArr_btn:fgui.GButton[]=[]


    private bagData:pb.S2CGetBag=null;

    private packsackPropDes_com:fgui.GComponent=null;
    private contentDes_com:fgui.GComponent=null;
    propTittleSC:PropTittle=null
    protected view(): HallView {
        return this._owner as HallView;
    }

    get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }

    protected onBind(): void {



        this.packsackContent_com = this.root.getChild("packsackContent").asCom;
        this._close = this.packsackContent_com.getChild("closeBtn");
        this.bindCloseClick();
        this.root.getChild("di").onClick(()=>{this.hide()},this)
        
        this.none_obj = this.packsackContent_com.getChild("none");
        this.tableList = this.packsackContent_com.getChild("list").asList;
        this.tableList.on(fgui.Event.CLICK_ITEM, this.onClickItem, this);

        this.packsackContent_com.getChild("btn1").asButton.getChild("title1").text ="高级"
        this.packsackContent_com.getChild("btn1").asButton.getChild("title2").text ="高级"
        this.packsackContent_com.getChild("btn2").asButton.getChild("title1").text ="初级"
        this.packsackContent_com.getChild("btn2").asButton.getChild("title2").text ="初级"

        this.topArr_btn.push(this.packsackContent_com.getChild("btn1").asButton)
        this.topArr_btn.push(this.packsackContent_com.getChild("btn2").asButton)
        this.packsackContent_com.getChild("btn1").asButton.onClick(()=>{
                this.onClickTopTab(0)
            },this);
        this.packsackContent_com.getChild("btn2").asButton.onClick(()=>{
            this.onClickTopTab(1)
        },this);




        this.packsackPropDes_com = this.root.getChild("packsackPropDes").asCom;
        this.packsackPropDes_com.getChild("di").onClick(()=>{ this.SetActivePropDes(false)  },this)
        this.contentDes_com = this.packsackPropDes_com.getChild("content").asCom;
        this.propTittleSC =new PropTittle(this.contentDes_com.getChild("tittle").asCom)
        this.contentDes_com.getChild("closeBtn").asButton.onClick(()=>{
            this.SetActivePropDes(false)
        },this);
        this.contentDes_com.getChild("sureBtn").asButton.onClick(()=>{
            this.SetActivePropDes(false)
        },this);
        this.contentDes_com.getChild("sureBtn").text ="确认"

        
        this.addEvents()

    }

    addEvents() {
        super.addEvents();
        this.addEvent(ProtoDef.pb.S2CGetBag, this.S2CGetBagReflashView);
    }


    onClickTopTab(index:number)
    {
        for (let i = 0; i < this.topArr_btn.length; i++) 
        {
            this.topArr_btn[i].getChild("bg1").visible = true    
            this.topArr_btn[i].getChild("bg2").visible = false
            this.topArr_btn[i].getChild("title1").visible = true  
            this.topArr_btn[i].getChild("title2").visible = false
        }
        this.topArr_btn[index].getChild("bg1").visible = false  
        this.topArr_btn[index].getChild("bg2").visible = true        
        this.topArr_btn[index].getChild("title1").visible = false    
        this.topArr_btn[index].getChild("title2").visible = true 
        this.updateListView(index)
    }

    open(){
        this.show();
        this.SetActivePropDes(false)
    }
    S2CGetBagReflashView()
    {
        Log.w(" S2CGetBag hall 外边背包 ")
        let data = Manager.gd.get<pb.S2CGetBag>(ProtoDef.pb.S2CGetBag);
        Log.w(" S2CGetBag hall 外边背包 data  ",data)
        this.Reflash(data)
    }

    Reflash(data:pb.S2CGetBag){
        this.bagData =data;
        // Log.w(" onS2CGetBag  bagData ",this.bagData)
        this.SetActivePropDes(false)
        if (this.bagData.items.length==0) 
        {
            this.none_obj.visible=true;
            this.tableList.visible =false;
            this.onClickTopTab(0)
            return;
        }
        this.none_obj.visible=false;
        this.tableList.visible =true;
        this.onClickTopTab(0)



        
        
    }


    SetActivePropDes(isShow:boolean)
    {   
        this.packsackPropDes_com.visible =isShow;

    }

    updateListView(index: number){
        this.tableList.removeChildrenToPool();
        let gaojiData =[];
        let chujiData =[];
        let daoJuConfig =  Manager.utils.GetDaoJuConfig();
        for (let i = 0; i < this.bagData.items.length; i++) 
        {
            let itemData =  this.bagData.items[i].item
            let propID =itemData.itemType
            let daoJuConfigItem = Manager.utils.GetDaoJuConfigItem( propID,daoJuConfig );
         
            if (daoJuConfigItem.DaoJuDengJi==2) 
            {
                gaojiData.push(itemData)
            }
            else
            {
                chujiData.push(itemData)
            }
        }
        if (index==0) //高级
        {
            for (let i = 0; i < gaojiData.length; i++) 
            {
                const et = gaojiData[i];
                // Log.w(" onS2CGetBag  et ",et)
                let item = this.tableList.addItemFromPool().asCom;
                item.getChild("name").text = et.name;
                item.getChild("count").text = ""+et.value;
                let url =Manager.gd.getShopIcon(et.itemType,i);
                item.getChild("loader").icon = url;
                item.getChild("kaicon").icon =  fgui.UIPackage.getItemURL("hall","daoju_kapai_"+et.itemType);
                item.data = et;
            }
            this.none_obj.visible=(gaojiData.length==0);

        } 
        else //1 初级
        {
            for (let i = 0; i < chujiData.length; i++) 
            {
                const et = chujiData[i];
                // Log.w(" onS2CGetBag  et ",et)
                let item = this.tableList.addItemFromPool().asCom;
                item.getChild("name").text = et.name;
                item.getChild("count").text = ""+et.value;
                let url =Manager.gd.getShopIcon(et.itemType,i);
                item.getChild("loader").icon = url;
                item.getChild("kaicon").icon =  fgui.UIPackage.getItemURL("hall","daoju_kapai_"+et.itemType);
                item.data = et;
            }
            this.none_obj.visible=(chujiData.length==0);
        }



    }


    onClickItem(obj: fgui.GObject){
        Log.d("onClickItem:",obj);
        this.SetActivePropDes(true)
        let data = obj.data
        let daoJuConfig =  Manager.utils.GetDaoJuConfig();
        let daoJuConfigItem = Manager.utils.GetDaoJuConfigItem( data.itemType,daoJuConfig );
        this.contentDes_com.getChild("des").text = daoJuConfigItem.WenBenMiaoShu
        Log.e(daoJuConfigItem.bgPath)

        this.contentDes_com.getChild("propCard").asCom.getChild("propItemBg").icon =fgui.UIPackage.getItemURL("hall",daoJuConfigItem.bgPath) 
        this.contentDes_com.getChild("propCard").asCom.getChild("propItemIcon").icon = fgui.UIPackage.getItemURL("hall","daoju_kapai_"+ data.itemType);
        this.propTittleSC.SetData(data.itemType)

    }




}