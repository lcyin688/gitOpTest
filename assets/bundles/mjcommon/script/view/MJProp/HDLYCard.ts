import { GameService } from "../../../../../scripts/common/net/GameService";
import PropTittle from "../../../../hall/script/view/PropTittle";
import PropCardItem from "../../../../hall/script/view/PropCardItem";

export default class HDLYCard   {


    private root : fgui.GComponent = null;

    propID :number
    id :number
    propCardItemSC:PropCardItem=null
    propTittleSC: PropTittle=null
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
        this.root.getChild("sureBtn").asButton.text="确认"
        this.propCardItemSC =new PropCardItem(this.root.getChild("propCard").asCom)

        this.propTittleSC =new PropTittle(this.root.getChild("tittle").asCom)
        this.propTittleSC.SetData(10011)

    }
    
    OnClickClose() 
    {
        dispatch("SetActiveMJProp",false)
    }

    OnClickSureBtn()
    {
        this.OnClickClose()
        this.service.c2SUseProp(this.id,null);

    }

    SetActive(isShow:boolean)
    {
        this.root.visible =isShow;
    }


    SetData(propID: number,id:number) 
    {
        this.id=id
        this.propID=propID
        this.propCardItemSC.SetData(propID)
        this.SetActive(true)
    }











}


