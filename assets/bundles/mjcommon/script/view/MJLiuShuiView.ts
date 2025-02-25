import { Config } from "../../../../scripts/common/config/Config";
import { Tool } from "../../../gamecommon/script/tools/Tool";
import { MJEvent } from "../Event/MJEvent";
import MJLiuShuiItem from "./MJLiuShuiItem";



export default class MJLiuShuiView  {

    private root : fgui.GComponent = null;
    private list :fgui.GList = null;
    private none_obj :fgui.GObject = null;
    private have_gc : fgui.GComponent = null;
    private totalScore_text : fgui.GObject = null;

    // private mjLiuShuiItemArr:Array<MJLiuShuiItem>=[];
    private m_GObjectPool: fgui.GObjectPool=null;

    private des_obj :fgui.GObject=null;

    dataLiushui: pb.IMahLiuShui[];

    public constructor(root : fgui.GComponent) 
    {
        this.root =root;
        this.setInit();
    }



    setInit()
    {
        this.m_GObjectPool =new fgui.GObjectPool();
        
        this.have_gc= this.root.getChild("have").asCom;
        this.none_obj= this.root.getChild("none");
        this.list = this.have_gc.getChild("n0").asList;

        this.totalScore_text =this.have_gc.getChild("totalScore").asCom.getChild("totalScore");
        this.root.getChild("closeBtn").onClick( ()=>{
            this.SetActiveLiuShui(false);
        }  , this);



        this.root.getChild("di").onClick(()=>{
            this.SetActiveLiuShui(false)
        },this);

        this.root.getChild("bg").onClick(()=>{
            this.HideAllItemDetail()
        },this);
        this.list.on(fgui.Event.SCROLL,()=>{
            this.HideAllItemDetail()
        },this)



        this.BindEvent();
        this.SetActiveLiuShui(false);


        this.list.setVirtual();
        this.list.itemRenderer = this.renderyListItem.bind(this);

    }



    BindEvent()
    {
        
        Manager.dispatcher.add(MJEvent.ONS2CMAHLIUSHUI, this.onS2CMahLiuShui, this);
        Manager.dispatcher.add("MJLiuShuiHide", this.HideAllItemDetail, this);
        Manager.dispatcher.add("MJLiuShuiSetMoreDes", this.MJLiuShuiSetMoreDes, this);

    }

    
    RemoveEvent()
    {
        Manager.dispatcher.remove(MJEvent.ONS2CMAHLIUSHUI, this);
        Manager.dispatcher.remove("MJLiuShuiHide", this);

    }


    MJLiuShuiSetMoreDes(des:string, toGo:fgui.GButton)
    {
        this.clearDesObj();
        let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "moreDes")
        let posx = toGo.x+toGo.parent.x+toGo.parent.parent.x+toGo.parent.parent.parent.x+(toGo.width/2)
        let posy = toGo.y+toGo.parent.y+toGo.parent.parent.y+toGo.parent.parent.parent.y-toGo.height
        this.des_obj =   this.m_GObjectPool.getObject(url)
        this.root.addChild(this.des_obj)
        this.des_obj.visible =true;
        this.des_obj.x =posx
        this.des_obj.y =posy-this.list.scrollPane.posY
        this.des_obj.asCom.getChild("moredes").text =des;
    }

    

    onS2CMahLiuShui(data: pb.IMahLiuShui[])
    {
        // Log.w(" 正式进入到了麻将流水数据  data ",data)
        this.SetActiveLiuShui(true);
        this.Reset()
        this.dataLiushui=data;

        if (data==null || data.length == 0 ) //没有数据直接显示没有
        {
            this.SetActiveNone(true)
            this.SetActiveHave(false)
            return
        }
        this.SetActiveNone(false)
        this.SetActiveHave(true)


        let totalScore =0
        for (let index = 0; index < data.length; index++) {
            // let com = this.list.addItemFromPool().asCom;
            // let item = new MJLiuShuiItem(com);
            // item.setData(index,data[index])
            // this.mjLiuShuiItemArr.push(item)
            totalScore = totalScore +data[index].coin
        }
        // Log.w(" onS2CMahLiuShui  this.mjLiuShuiItemArr ",this.mjLiuShuiItemArr)

        this.list.numItems = data.length;

        this.list.refreshVirtualList();


        if (totalScore > 0 ) 
        {
            this.totalScore_text.text = "+"+Manager.utils.formatCoin(totalScore)
        }
        else
        {
            this.totalScore_text.text = Manager.utils.formatCoin(totalScore)
        }


        
        
    }


    private renderyListItem(index: number, obj: fgui.GObject): void {
        let com =obj.asCom;
        let item = new MJLiuShuiItem(com);
        item.setData(index,this.dataLiushui[index])

    }


    HideAllItemDetail()
    {
        this.clearDesObj();

    }

    SetActiveLiuShui(isShow:boolean)
    {
        this.root.visible=isShow;
        
    }

    SetActiveHave(isShow:boolean)
    {
        this.have_gc.visible=isShow;

    }

    SetActiveNone(isShow:boolean)
    {
        this.none_obj.visible=isShow;
    }


    clearDesObj()
    {
        if ( this.des_obj!=null) 
        {
            this.des_obj.dispose()
        }

        this.m_GObjectPool.clear();
    }


    Reset()
    {
        this.clearDesObj()

    }




}


