import { Config } from "../../../../../scripts/common/config/Config";
import { GameService } from "../../../../../scripts/common/net/GameService";
import { MahColor } from "../../../../../scripts/def/GameEnums";
import { Tool } from "../../../../gamecommon/script/tools/Tool";
import PropTittle from "../../../../hall/script/view/PropTittle";
import { CommonMJConfig } from "../../Config/CommonMJConfig";


export default class ChangeColorCard   {

    root : fgui.GComponent = null;
    propID :number
    id :number
    curselectColor:number
    propTittleSC:PropTittle=null
    selectColor_list:fairygui.GList =null


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
        this.selectColor_list = this.root.getChild("selectColorList").asList
        this.selectColor_list.on(fgui.Event.CLICK_ITEM, this.onClickSelectColorItem, this);

        this.propTittleSC =new PropTittle(this.root.getChild("tittle").asCom)
        this.propTittleSC.SetData(10017)
    }
    
    OnClickClose() 
    {
        dispatch("SetActiveMJProp",false)
    }

    OnClickSureBtn() //满足选了牌的情况在关闭
    {
        if (this.curselectColor == null || this.curselectColor == -1) 
        {
            Manager.tips.show("您还没选花色");
            return;
        }
        let data :number[]=[]
        data.push(this.curselectColor)
        this.OnClickClose()

        Log.w(" SetSelfHandCardProp 发送 data  : ",data);
        this.service.c2SUseProp(this.id,data);

    }
    

    SetActive(isShow:boolean)
    {
        this.root.visible =isShow;
    }


    onClickSelectColorItem(obj: fgui.GObject)
    {
        Log.d("onClickSelectColorItem:",obj.data);
        this.curselectColor =Number(obj.data)
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
            },false)
        }
        let aniName = "wan"
        if ( this.curselectColor == MahColor.CL_Wan) 
        {
            aniName = "wan"
        } 
        else if (this.curselectColor == MahColor.CL_Tong) 
        {
            aniName = "tong"
        }
        else if (this.curselectColor == MahColor.CL_Tiao) 
        {
            aniName = "tiao"
        }
        let eff_load3d = <fgui.GLoader3D>obj.asCom.getChild("eff");
        Manager.utils.PlaySpine(eff_load3d,"mjsp_dingque1",aniName,Config.BUNDLE_MJCOMMON,()=>{
        },true)

    }


    SetData(propID: number,id:number) 
    {
        
        this.propID=propID
        this.id=id
        this.curselectColor = -1
        this.SetActive(true)
        this.propTittleSC.SetData(propID)
        let colorArr=Tool.Clone(CommonMJConfig.HaveColorArr)
        // Log.w("changcolor SetData :  ",colorArr)


        this.SetSeletColorBtns(colorArr,this.selectColor_list)
    }





    SetSeletColorBtns(arrColor:number[],list:fgui.GList)
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



    Reflash() 
    {
        this.curselectColor = -1
        let colorArr=Tool.Clone(CommonMJConfig.HaveColorArr)
        this.SetSeletColorBtns(colorArr,this.selectColor_list)
    }






}


