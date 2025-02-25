
import { MahHPGOPerate } from "../../def/GameEnums";
import { MJRuleConfig } from "./MJRuleConfig";


export default class paixingHuItem 
{

    private root : fgui.GComponent = null;
    private  load:fairygui.GLoader=null
    public constructor(root : fgui.GComponent) {

        this.root =root;
        this.load = this.root.getChild("load").asLoader
    }

    SetData(data: { des: string; hucard: number; handArr: number[]; PengGangArr: { mjid: number; type:MahHPGOPerate; }[]; isEWai:boolean}) 
    {
        this.load.visible =false
        this.root.getChild("paixingHuItem").visible =true
        this.root.getChild("destext").visible =true
        this.root.width = 1082
        this.root.height = 215
        this.root.getChild("destext").text = data.des
        let paixingHuItem_gc = this.root.getChild("paixingHuItem").asCom

        let hands_list =  paixingHuItem_gc.getChild("handCards").asList;
        let pengGang_list =  paixingHuItem_gc.getChild("pengGang").asList;
        let hucard_list =  paixingHuItem_gc.getChild("HuCard").asList;

        hands_list.removeChildrenToPool();
        hucard_list.removeChildrenToPool();
        pengGang_list.removeChildrenToPool();
        if (data.isEWai!=null&& data.isEWai) 
        {
            return
        }


        let handCardArr =data.handArr
        for (let index = 0; index < handCardArr.length; index++) {
            let item: fgui.GButton = hands_list.addItemFromPool().asButton;
            let urlStr = fgui.UIPackage.getItemURL("hall",MJRuleConfig.MahjongID[handCardArr[index]].spriteUrl)
            item.getChild("icon").icon =urlStr;   
            item.getChild("mask").visible =false
            item.getChild("quelaifu").visible =false
            item.getChild("daduo").visible =false
            item.getChild("eff").visible =false
        }
        let item: fgui.GButton = hucard_list.addItemFromPool().asButton;
        let urlStr = fgui.UIPackage.getItemURL("hall",MJRuleConfig.MahjongID[data.hucard].spriteUrl)
        item.getChild("icon").icon =urlStr;   
        item.getChild("mask").visible =false
        item.getChild("quelaifu").visible =false
        item.getChild("daduo").visible =false
        item.getChild("eff").visible =false

        for (let index = 0; index < data.PengGangArr.length; index++) 
        {
            let type = data.PengGangArr[index].type
            let card = data.PengGangArr[index].mjid
            let urlStr = fgui.UIPackage.getItemURL("hall",MJRuleConfig.MahjongID[card].spriteUrl)
            if (type == MahHPGOPerate.HPG_Peng ) 
            {
                let url =  fgui.UIPackage.getItemURL("hall", "altCardBottom")
                let obj=  pengGang_list.addItemFromPool(url)
                obj.visible=true;
                for (let c = 1; c <= 3; c++) 
                {
                    let cardBtn = obj.asButton.getChild("card"+c).asButton
                    cardBtn.getChild("mask").visible =false
                    cardBtn.asButton.getChild("towards").visible =false
                    cardBtn.asButton.getChild("icon").icon =urlStr;
                    cardBtn.asButton.getChild("quelaifu").visible =false   
                }
            }
            else if (type == MahHPGOPerate.HPG_AnGang ) 
            {
                let url =  fgui.UIPackage.getItemURL("hall", "darkBarBottom")
                let obj=  pengGang_list.addItemFromPool(url)
                obj.visible=true;
                let cardBtn = obj.asButton.getChild("card").asButton
                cardBtn.getChild("mask").visible =false
                cardBtn.asButton.getChild("towards").visible =false
                cardBtn.asButton.getChild("icon").icon =urlStr;
                cardBtn.asButton.getChild("quelaifu").visible =false      
            }
            else if (type == MahHPGOPerate.HPG_DianGang || type == MahHPGOPerate.HPG_BuGang  ) 
            {
                let url =  fgui.UIPackage.getItemURL("hall", "buDianGangBottom")
                let obj=  pengGang_list.addItemFromPool(url)
                obj.visible=true;
                for (let c = 1; c <= 4; c++) 
                {
                    let cardBtn = obj.asButton.getChild("card"+c).asButton
                    cardBtn.getChild("mask").visible =false
                    cardBtn.asButton.getChild("towards").visible =false
                    cardBtn.asButton.getChild("icon").icon =urlStr; 
                    cardBtn.asButton.getChild("quelaifu").visible =false     
                }
            }

        }

    
    }


    SetWanfa(index:number)
    {
        this.load.visible =true
        this.root.getChild("paixingHuItem").visible =false
        this.root.getChild("destext").visible =false
        let url =  fgui.UIPackage.getItemURL("hall", "fanxingwenben"+index)
        this.load.icon =url;
        this.root.width = 1082
        this.root.height = 656

    }



}

