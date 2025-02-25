import { MJRuleConfig } from "../../../../scripts/common/wanfa/MJRuleConfig";
import paixingHuItem from "../../../../scripts/common/wanfa/paixingHuItem";
import { MJTool } from "../logic/MJTool";



export default class FanXingDes {
    protected m_imageHuType: fgui.GObject = null;

    private fanxing_list:fgui.GList=null;
    private root : fgui.GComponent = null;
    
    public constructor(root : fgui.GComponent) 
    {
        this.root =root;
        this.setInit();
    }


    protected onBind(): void 
    {

        
    }


    /** 添加事件 */
    protected InitEvent() {
        Manager.dispatcher.add("MJSetFanXingInit", this.SetFanXingInit, this);

    }

    RemoveEvent()
    {
        Manager.dispatcher.remove("MJSetFanXingInit", this);
    }

    public setInit() {
        this.InitEvent()
        this.fanxing_list = this.root.getChild("fanxinglist").asList

        this.root.getChild("closeBtn").onClick(()=>{
            this.SetActiveRule(false)
        },this)
        this.root.getChild("di").onClick(()=>{
            this.SetActiveRule(false)
        },this)

        this.root.getChild("tittle").text ="番型计算"
    }


    SetFanXingInit(dataItem:number[])
    {
        this.SetActiveRule(true)

        Log.w(" SetFanXingInit  dataItem  ", dataItem)
        this.fanxing_list.removeChildrenToPool();

        MJTool.SortHuPaiType(dataItem)
        Log.w(" SetFanXingInit 111 dataItem  ", dataItem)
        for (let index = 0; index <dataItem.length ; index++) 
        {
            let item: fgui.GComponent = this.fanxing_list.addItemFromPool().asCom;
            let paixingHuItemSc = new paixingHuItem(item);
            
            Log.w(" SetFanXingInit  dataItem[index-1]  ", dataItem[index])
            Log.w(" SetFanXingInit 001 ",MJRuleConfig.RuleConfig[dataItem[index]] )

            paixingHuItemSc.SetData(MJRuleConfig.RuleConfig[dataItem[index]])
        }

    }





    SetActiveRule(isShow:boolean)
    {
        this.root.visible = isShow;
    }
























    


}
