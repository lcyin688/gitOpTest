import { GameService } from "../../../../../scripts/common/net/GameService";
import PropCardItem from "../../../../hall/script/view/PropCardItem";
import PropTittle from "../../../../hall/script/view/PropTittle";
import { MJTool } from "../../logic/MJTool";
import MJDispose from "../../Manager/MJDispose";

export default class JinYinChangeCard   {


    private root : fgui.GComponent = null;
    propTittleSC:PropTittle=null
    propCardItemSC:PropCardItem=null
    propID :number
    cardID :number
    cardIndex :number
    isUseMoPai :boolean
    id:number
    hands_list:fairygui.GList =null

    public constructor(root : fgui.GComponent) 
    {
        this.root =root;
        this.setInit();
    }


    get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }


    setInit()
    {
        this.root.getChild("closeBtn").onClick(this.OnClickClose, this);
        this.root.getChild("sureBtn").onClick(this.OnClickSureBtn, this);
        this.hands_list = this.root.getChild("handCards").asCom.getChild("list").asList
        this.hands_list.on(fgui.Event.CLICK_ITEM, this.onClickItem, this);

        this.propTittleSC =new PropTittle(this.root.getChild("tittle").asCom)
        this.propCardItemSC =new PropCardItem(this.root.getChild("propCard").asCom)
        // this.root.getChild("bg").asCom.getChild("n1").visible =false;
    }
    OnClickClose() 
    {
        dispatch("SetActiveMJProp",false)
    }

    OnClickSureBtn() //满足选了牌的情况在关闭
    {
        if (this.cardID == null || this.cardID == 0) 
        {
            Manager.tips.show("您还没选牌");
            return
        }
        let data :number[]=[]
        if (this.isUseMoPai) 
        {
           data.push(1)
        }
        else
        {
            data.push(0)
        }
        data.push(this.cardID)
        this.OnClickClose()

        Log.w(" SetSelfHandCardProp 发送 data  : ",data);
        this.service.c2SUseProp(this.id,data);
        MJDispose.SetPropIndex(this.cardIndex)

    }
    



    SetActive(isShow:boolean)
    {
        this.root.visible =isShow;
    }


    SetData(propID: number,id:number) 
    {
        this.propID=propID
        this.id=id
        this.cardID=0
        this.isUseMoPai=false
        this.SetActive(true)
        this.propTittleSC.SetData(propID)
        this.propCardItemSC.SetData(propID)
        let daoJuConfig =  Manager.utils.GetDaoJuConfig();
        let daoJuConfigItem = Manager.utils.GetDaoJuConfigItem( propID ,daoJuConfig );
        this.root.getChild("des").text =daoJuConfigItem.WenBenMiaoShu
        
        MJTool.SetSelfHandCardProp(this.hands_list)
    }




    onClickItem(obj: fgui.GObject)
    {
        Log.d("onClickItem:",obj.data);
        // {cardID:CommonMJConfig.selfMoCard,index:0,ismoCard:true} 
        let data = obj.data;
        this.cardID = data.cardID
        this.cardIndex = data.index
        this.isUseMoPai = data.ismoCard
        let allchild = this.hands_list._children
        
        for (let index = 0; index < allchild.length; index++) 
        {
            allchild[index].asButton.getChild("select").visible=false
            allchild[index].asButton.getChild("mask").visible=false
        }
        obj.asButton.getChild("mask").visible=true
        obj.asButton.getChild("select").visible=true

    }






}


