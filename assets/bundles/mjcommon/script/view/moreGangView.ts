import { Tool } from "../../../gamecommon/script/tools/Tool";
import { CommonMJConfig } from "../Config/CommonMJConfig";
import { MJC2SOperation } from "../net/MJC2SOperation";
import MJNormalCard from "./MJNormalCard";

export default class moreGangView  {



    private root : fgui.GComponent = null;

    private moreGang_list :fgui.GList;

    
    


    public constructor(root : fgui.GComponent) 
    {
        this.root =root;
        this.setInit();
    }



    setInit()
    {

        this.moreGang_list = this.root.getChild("moreGangList").asList
        this.moreGang_list.on(fgui.Event.CLICK_ITEM, this.onClickItem, this);
    }


    SetActiveMoreGangView(isShow: boolean) 
    {
        this.root.visible =isShow;
    }




    onClickItem(obj: fgui.GObject){


        Log.d("onClickItem:",obj.data);
        let data = obj.data;
        this.GangSureView(Number(data.value),data.key)
        // MJC2SOperation.GangCard(Number(data.value),data.key);
    }


    GangSureView(cardId:number,gangType:number) 
    {
        function ff(params:boolean) 
        {
            Log.d("Manager.alert ff",params);
            if (params)
            {
                MJC2SOperation.GangCard(cardId,gangType);
                this.SetActiveMoreGangView(false)
            }
        }

        
        if ( cardId == 35 || cardId == 135) 
        {
            let cf:AlertConfig=
            {
                title:"提示",
                text: "您确定暗杠4个红中吗?",   
                confirmString:"确认",
                cancelString:"取消",
                confirmCb: ff.bind(this),        
                cancelCb: ff.bind(this),

            };
            Manager.alert.show(cf);
        } 
        else 
        {
            MJC2SOperation.GangCard(cardId,gangType);
            this.SetActiveMoreGangView(false)
        }

    }


    /** 设置多杠 界面数据 */
    SetMoreGangView(dat: pb.IId2Val[]) 
    {
        this.SetActiveMoreGangView(true)
        Log.d(" 多杠的时候  SetMoreGangView : ",dat)
        this.moreGang_list.removeChildrenToPool();

        
        for (let index = 0; index < dat.length; index++) 
        {
            let item = this.moreGang_list.addItemFromPool().asCom;
            item.data = dat[index];
            let card1 = new MJNormalCard(item.getChild("card1").asButton)
            let card2 = new MJNormalCard(item.getChild("card2").asButton)
            let card3 = new MJNormalCard(item.getChild("card3").asButton)
            let card4 = new MJNormalCard(item.getChild("card4").asButton)
            card1.BaseSetCard(Number(dat[index].value));
            card2.BaseSetCard(Number(dat[index].value));
            card3.BaseSetCard(Number(dat[index].value));
            card4.BaseSetCard(Number(dat[index].value));
        }
        

    }




    StopCoroutineTweenAni()
    {


    }



}


