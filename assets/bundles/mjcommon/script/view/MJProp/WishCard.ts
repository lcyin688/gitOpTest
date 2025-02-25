import { GameService } from "../../../../../scripts/common/net/GameService";
import { MahColor } from "../../../../../scripts/def/GameEnums";
import PropTittle from "../../../../hall/script/view/PropTittle";
import { Tool } from "../../../../gamecommon/script/tools/Tool";
import { CommonMJConfig } from "../../Config/CommonMJConfig";
import { MJTool } from "../../logic/MJTool";
import MJDispose from "../../Manager/MJDispose";
import MJCard from "../MJCard";
import { Config } from "../../../../../scripts/common/config/Config";

export default class WishCard   {




    root : fgui.GComponent = null;
    propID :number
    id :number
    getCardID :number
    select_list:fairygui.GList =null
    selectColor_list:fairygui.GList =null
    propTittleSC:PropTittle=null


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

        this.select_list = this.root.getChild("selectCards").asCom.getChild("list").asList
        this.select_list.on(fgui.Event.CLICK_ITEM, this.onClickSelectItem, this);
        this.root.getChild("selectCards").asCom.getChild("tittle").text ="指定摸牌"


        this.selectColor_list = this.root.getChild("selectColor").asCom.getChild("selectColorList").asList
        this.selectColor_list.on(fgui.Event.CLICK_ITEM, this.onClickSelectColorItem, this);
        

        this.propTittleSC =new PropTittle(this.root.getChild("tittle").asCom)
        this.propTittleSC.SetData(10015)
    }
    


    SetActive(isShow:boolean)
    {
        this.root.visible =isShow;
    }
    OnClickClose() 
    {
        dispatch("SetActiveMJProp",false)
    }

    OnClickSureBtn() //满足选了牌的情况在关闭
    {
        if (this.getCardID == null || this.getCardID == 0) 
        {
            Manager.tips.show("您还没选想要的牌");
            return;
        }
        let data :number[]=[]
        data.push(this.getCardID)
        this.OnClickClose()
        Log.w(" OnClickSureBtn 发送 data  : ",data);
        this.service.c2SUseProp(this.id,data);

    }

    SetData(propID: number,id:number) 
    {
        
        this.propID=propID
        this.id=id
        this.SetActive(true)

        let colorArr=Tool.Clone(CommonMJConfig.HaveColorArr)
        //自己没缺的牌里边随便选一个
        for (let i = 0; i < colorArr.length; i++) 
        {
            if (CommonMJConfig.MineQueCard==colorArr[i]) 
            {
                colorArr.splice(i,1)
            }
        }


        this.SetSeletColorInitBtns(colorArr,this.selectColor_list)
        this.SetSelfSelectCard(colorArr[0],this.select_list)
    }



    SetSeletColorInitBtns(arrColor:number[],list:fgui.GList)
    {
        list.removeChildrenToPool()
        for (let i = 0; i < arrColor.length; i++) 
        {
            let item: fgui.GButton = list.addItemFromPool().asButton;
            item.data = arrColor[i]
            let aniName = "wan2"
            if (arrColor[i]== MahColor.CL_Wan) 
            {
                aniName = "wan2"
            } 
            else if (arrColor[i]== MahColor.CL_Tong) 
            {
                aniName = "tong2"
            }
            else if (arrColor[i]== MahColor.CL_Tiao) 
            {
                aniName = "tiao1"
            }
            let eff_load3d = <fgui.GLoader3D>item.asCom.getChild("eff");
            Manager.utils.PlaySpine(eff_load3d,"mjsp_dingque1",aniName,Config.BUNDLE_MJCOMMON,()=>{
            })
            item.asCom.getChild("quan").visible = (i!=arrColor.length-1)
        }

    }


    SetSelfSelectCard(curColor:number,list:fairygui.GList)
    {
        this.getCardID =0
        list.removeChildrenToPool()
        for (let i = 1; i < 10; i++) {
            let carId =  curColor*10+i
            let item: fgui.GButton = list.addItemFromPool().asButton;
            let cardItem = new MJCard(item);
            cardItem.setInit(false)
            cardItem.SetCard(carId,null)
            item.asButton.getChild("mask").visible=false
            item.asButton.getChild("select").visible=false
            item.data = carId
        }
    }




    onClickSelectItem(obj: fgui.GObject)
    {
        Log.d("onClickSelectItem:",obj.data);
        this.getCardID = obj.data
        let allchild = this.select_list._children
        for (let index = 0; index < allchild.length; index++) 
        {
            allchild[index].asButton.getChild("mask").visible=false
            allchild[index].asButton.getChild("select").visible=false
        }
        obj.asButton.getChild("mask").visible=true
        obj.asButton.getChild("select").visible=true
    }

    onClickSelectColorItem(obj: fgui.GObject)
    {
        Log.d("onClickSelectColorItem:",obj.data);
        let seColor =Number(obj.data)
        this.SetSelfSelectCard(seColor,this.select_list)
        let allchild = this.selectColor_list._children
        for (let index = 0; index < allchild.length; index++) 
        {
            let colorItem = allchild[index].data
            let aniName = "wan2"
            if ( colorItem == MahColor.CL_Wan) 
            {
                aniName = "wan2"
            } 
            else if (colorItem == MahColor.CL_Tong) 
            {
                aniName = "tong2"
            }
            else if (colorItem == MahColor.CL_Tiao) 
            {
                aniName = "tiao1"
            }
            let eff_load3d = <fgui.GLoader3D>allchild[index].asCom.getChild("eff");
            Manager.utils.PlaySpine(eff_load3d,"mjsp_dingque1",aniName,Config.BUNDLE_MJCOMMON,()=>{
            })

        }
        let aniName = "wan"
        if ( seColor == MahColor.CL_Wan) 
        {
            aniName = "wan"
        } 
        else if (seColor == MahColor.CL_Tong) 
        {
            aniName = "tong"
        }
        else if ( seColor == MahColor.CL_Tiao) 
        {
            aniName = "tiao"
        }
        let eff_load3d = <fgui.GLoader3D>obj.asCom.getChild("eff");
        Manager.utils.PlaySpine(eff_load3d,"mjsp_dingque1",aniName,Config.BUNDLE_MJCOMMON,()=>{
        },true)
        
    }

    Reflash() 
    {
        let colorArr=Tool.Clone(CommonMJConfig.HaveColorArr)
        //自己没缺的牌里边随便选一个
        for (let i = 0; i < colorArr.length; i++) 
        {
            if (CommonMJConfig.MineQueCard==colorArr[i]) 
            {
                colorArr.splice(i,1)
            }
        }
        this.SetSeletColorInitBtns(colorArr,this.selectColor_list)
        this.SetSelfSelectCard(colorArr[0],this.select_list)
    }

}


