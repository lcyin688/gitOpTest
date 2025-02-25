import { GameService } from "../../../../../scripts/common/net/GameService";
import { CommonMJConfig } from "../../Config/CommonMJConfig";
export default class MJJiPaiQi   {



    private root : fgui.GComponent = null;
    list:fairygui.GList =null

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
        this.list =this.root.getChild("list").asList
        this.list.removeChildrenToPool()
    }
    
    OnClickClose() 
    {
        dispatch("SetActiveMJProp",false)
    }


    SetActive(isShow:boolean)
    {
        this.root.visible =isShow;
    }


    SetData() 
    {

        let wanArr = []
        let tongArr = []
        let tiaoArr = []
        let ziArr = []
        for (let i = 1; i < 10; i++) 
        {
            wanArr.push({cardID:i,Count:CommonMJConfig.AllCards[i]})
        }
        for (let i = 11; i < 20; i++) 
        {
            tongArr.push({cardID:i,Count:CommonMJConfig.AllCards[i]})
        }
        
        for (let i = 21; i < 30; i++) 
        {
            tiaoArr.push({cardID:i,Count:CommonMJConfig.AllCards[i]})
        }
        if (CommonMJConfig.MahjongID[35].ISHave) 
        {
            ziArr.push({cardID:35,Count:CommonMJConfig.AllCards[35]})
        }
        if (CommonMJConfig.MahjongID[135].ISHave) 
        {
            ziArr.push({cardID:135,Count:CommonMJConfig.AllCards[135]})
        }

        this.list.removeChildrenToPool()
        this.SetItem(wanArr)
        this.SetItem(tongArr)
        this.SetItem(tiaoArr)
        this.SetItem(ziArr)
    
    }


    SetItem(arr)
    {
        let totalNum :number=0
        let item: fgui.GComponent = this.list.addItemFromPool().asCom;
        item.getChild("list").asList.removeChildrenToPool()
        for (let i = 0; i < arr.length; i++) 
        {
           let cardItem= item.getChild("list").asList.addItemFromPool().asCom;
           cardItem.getChild("count").text =arr[i].Count
           let urlStr = fgui.UIPackage.getItemURL("hall",CommonMJConfig.MahjongID[arr[i].cardID].spriteUrl)
           // Log.e("SetCard 01  ",urlStr  );
           cardItem.getChild("icon").icon =urlStr;   
           totalNum =totalNum + arr[i].Count
        }
        item.getChild("totalcount").text = totalNum.toString()

    }








}


