import { Config } from "../../../../../scripts/common/config/Config";
import { GameService } from "../../../../../scripts/common/net/GameService";
import { MahColor } from "../../../../../scripts/def/GameEnums";
import { Tool } from "../../../../gamecommon/script/tools/Tool";
import PropTittle from "../../../../hall/script/view/PropTittle";
import { CommonMJConfig } from "../../Config/CommonMJConfig";
import { MJTool } from "../../logic/MJTool";
import MJDispose from "../../Manager/MJDispose";
import MJNormalCard from "../MJNormalCard";
export default class ZzChangeCard   {



    root : fgui.GComponent = null;
    propID :number
    cardID :number
    getCardID :number
    id:number
    cardIndex :number
    isUseMoPai :boolean

    hands_list:fairygui.GList =null
    select_list:fairygui.GList =null
    selectColor_list:fairygui.GList =null
    propTittleSC:PropTittle=null
    

    private tip_com:fgui.GComponent=null;

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
        this.root.getChild("handCards").asCom.getChild("tittle").text ="手牌选择"

        this.select_list = this.root.getChild("selectCards").asCom.getChild("list").asList
        this.select_list.on(fgui.Event.CLICK_ITEM, this.onClickSelectItem, this);
        this.root.getChild("selectCards").asCom.getChild("tittle").text ="换牌选择"


        this.selectColor_list = this.root.getChild("selectColor").asCom.getChild("selectColorList").asList
        this.selectColor_list.on(fgui.Event.CLICK_ITEM, this.onClickSelectColorItem, this);
        // this.root.getChild("bg").asCom.getChild("n1").visible =false;

        this.tip_com =this.root.getChild("tip").asCom;

        this.propTittleSC =new PropTittle(this.root.getChild("tittle").asCom)
        this.propTittleSC.SetData(10008)

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
        if (this.cardID == null || this.cardID == 0) 
        {
            Manager.tips.show("您还没选需要换的牌");
            return;
        }
        if (this.getCardID == null || this.getCardID == 0) 
        {
            Manager.tips.show("您还没选想要的牌");
            return;
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
        data.push(this.getCardID)
        this.OnClickClose()

        Log.w(" SetSelfHandCardProp 发送 data  : ",data);
        this.service.c2SUseProp(this.id,data);
        MJDispose.SetPropIndex(this.cardIndex)

    }

    SetData(propID: number,id:number,dataSpe:pb.S2CMahBetterMjSuggestion) 
    {
        
        this.propID=propID
        this.id=id
        
        this.cardID=0

        this.isUseMoPai=false
        this.SetActive(true)
        MJTool.SetSelfHandCardProp(this.hands_list)

        let colorArr=Tool.Clone(CommonMJConfig.HaveColorArr)
        Log.w("zzchangeCard SetData :  ",colorArr)

        //自己没缺的牌里边随便选一个
        for (let i = 0; i < colorArr.length; i++) 
        {
            if (CommonMJConfig.MineQueCard==colorArr[i]) 
            {
                colorArr.splice(i,1)
            }
        }
        //牌多的推荐~
        
        let tuijianColor = MahColor.CL_Wan;

        if (dataSpe!=null)//如果有新手引导推荐的牌
        {
            let getCardid = dataSpe.goodMjs;
            tuijianColor =  Math.floor(getCardid/10);
        }
        else
        {
            let tuijianCount = 0
            for (let i = 0; i < colorArr.length; i++) {
                let  count = MJTool.GetHasCardCountByColor(colorArr[i])
                if (count>tuijianCount) 
                {
                    tuijianCount= count;
                    tuijianColor= colorArr[i]
                }
            }
        }



        this.SetSelfSelectCard(tuijianColor,this.select_list)
        this.SetSeletColorBtns(colorArr,this.selectColor_list)

        this.tip_com.visible=false;
        if (dataSpe!=null) 
        {
            this.tip_com.visible=true;
            Log.e(" 至尊换牌卡  dataSpe ",dataSpe)
            
            let allchild = this.hands_list._children
            for (let index = 0; index < allchild.length; index++) 
            {
                let dataItem = allchild[index].data as  {cardID:number,index:Number,ismoCard:boolean}
                if (dataItem.cardID == dataSpe.badMjs )//找到换走的牌 
                {
                    this.onClickItem(allchild[index]);
                }
            }

            allchild = this.select_list._children
            for (let index = 0; index < allchild.length; index++) 
            {
                let cardID = allchild[index].data
                if (cardID == dataSpe.goodMjs )//找到想换来的牌
                {
                    this.onClickSelectItem(allchild[index]);
                    this.SetTipPos(allchild[index]);
                }
            }
        }


    }


    SetTipPos(obCard:fairygui.GObject)
    {
        let rectFrom = obCard.localToGlobalRect(0, 0, obCard.width, obCard.height);
        rectFrom = this.root.globalToLocalRect(rectFrom.x, rectFrom.y, rectFrom.width, rectFrom.height);
        this.tip_com.visible=true;
        // let posx = toGo.x+toGo.parent.x+toGo.parent.parent.x+toGo.parent.parent.parent.x+(toGo.width/2)
        this.tip_com.x =rectFrom.x+obCard.width*0.4 ;
        

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
                // eff_load3d.playing=false;
            },false)
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
            let cardItem = new MJNormalCard(item);
            cardItem.BaseSetCard(carId);
            item.asButton.getChild("select").visible=false;
            item.asButton.getChild("mask").visible=false;
            item.data = carId
        }
    }


    onClickItem(obj: fgui.GObject)
    {
        Log.d("onClickItem:",obj.data);
        let data = obj.data;
        this.cardID = data.cardID
        this.cardIndex = data.index
        this.isUseMoPai = data.ismoCard
        let allchild = this.hands_list._children
        
        for (let index = 0; index < allchild.length; index++) 
        {
            allchild[index].asButton.getChild("select").visible=false;
            allchild[index].asButton.getChild("mask").visible=false;
        }

        obj.asButton.getChild("select").visible=true;
        obj.asButton.getChild("mask").visible=true;
    }

    onClickSelectItem(obj: fgui.GObject)
    {
        Log.d("onClickSelectItem:",obj.data);
        this.getCardID = obj.data
        let allchild = this.select_list._children
        for (let index = 0; index < allchild.length; index++) 
        {
            allchild[index].asButton.getChild("select").visible=false;
            allchild[index].asButton.getChild("mask").visible=false;
        }
        obj.asButton.getChild("select").visible=true;
        obj.asButton.getChild("mask").visible=true;

        // this.SetTipPos(obj);

    }

    onClickSelectColorItem(obj: fgui.GObject)
    {
        Log.d("onClickSelectColorItem:",obj.data);

        let seColor =Number(obj.data)
        // let colorArr=[MahColor.CL_Wan,MahColor.CL_Tong,MahColor.CL_Tiao]
        // //自己没缺的牌里边随便选一个
        // for (let i = 0; i < colorArr.length; i++) 
        // {
        //     if (seColor==colorArr[i]) 
        //     {
        //         this.SetSelfSelectCard(seColor,this.select_list)
        //     }
        // }
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
                // eff_load3d.playing=false;
            },false)
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
        else if (seColor == MahColor.CL_Tiao) 
        {
            aniName = "tiao"
        }
        let eff_load3d = <fgui.GLoader3D>obj.asCom.getChild("eff");
        Manager.utils.PlaySpine(eff_load3d,"mjsp_dingque1",aniName,Config.BUNDLE_MJCOMMON,()=>{
            // eff_load3d.playing=false;
        },true)

    }

    



    Reflash() 
    {
        this.cardID=0
        this.isUseMoPai=false
        MJTool.SetSelfHandCardProp(this.hands_list)
        let colorArr=Tool.Clone(CommonMJConfig.HaveColorArr)
        Log.w("zzchangeCard SetData :  ",colorArr)
        //自己没缺的牌里边随便选一个
        for (let i = 0; i < colorArr.length; i++) 
        {
            if (CommonMJConfig.MineQueCard==colorArr[i]) 
            {
                colorArr.splice(i,1)
            }
        }
        //牌多的推荐~
        
        let tuijianColor = MahColor.CL_Wan;
        let tuijianCount = 0
        for (let i = 0; i < colorArr.length; i++) {
            let  count = MJTool.GetHasCardCountByColor(colorArr[i])
            if (count>tuijianCount) 
            {
                tuijianCount= count;
                tuijianColor= colorArr[i]
            }
        }
        this.SetSelfSelectCard(tuijianColor,this.select_list)
        this.SetSeletColorBtns(colorArr,this.selectColor_list)
        this.tip_com.visible=false;

    }




}


