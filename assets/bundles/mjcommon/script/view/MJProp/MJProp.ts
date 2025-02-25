import { GameService } from "../../../../../scripts/common/net/GameService";
import { ProtoDef } from "../../../../../scripts/def/ProtoDef";
import ChangeColorCard from "./ChangeColorCard";
import DingColorCard from "./DingColorCard";
import HDLYCard from "./HDLYCard";
import JinYinChangeCard from "./JinYinChangeCard";
import MJJiPaiQi from "./MJJiPaiQi";
import WishCard from "./WishCard";
import ZzChangeCard from "./ZzChangeCard";


export default class MJProp   {

    root : fgui.GComponent = null;

    private changeColorCardSC:ChangeColorCard=null
    private dingColorCardSC:DingColorCard=null
    private hdlyCardSC:HDLYCard=null
    private jinYinChangeCardSC:JinYinChangeCard=null
    private wishCardSC:WishCard=null
    private zzChangeCardSC:ZzChangeCard=null
    private mjJiPaiQiSC:MJJiPaiQi=null


    


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
        this.root.makeFullScreen();
        this.changeColorCardSC = new ChangeColorCard(this.root.getChild("ChangeColorCard").asCom);
        this.dingColorCardSC = new DingColorCard(this.root.getChild("DingColorCard").asCom);
        this.hdlyCardSC = new HDLYCard(this.root.getChild("HDLYCard").asCom);
        this.jinYinChangeCardSC = new JinYinChangeCard(this.root.getChild("JinYinChangeCard").asCom);
        this.wishCardSC = new WishCard(this.root.getChild("WishCard").asCom);
        this.zzChangeCardSC = new ZzChangeCard(this.root.getChild("zzChangeCard").asCom);
        this.mjJiPaiQiSC = new MJJiPaiQi(this.root.getChild("JipaiQi").asCom);

        
        this.root.getChild("di").onClick(()=>{
            this.SetActiveMJPropState(false)
        }, this);
        this.BindEvent();
    }
    
    BindEvent() 
    {
        //使用道具
        Manager.dispatcher.add("propUseCommon", this.PropUseCommon, this);
        Manager.dispatcher.add("SetActiveMJProp", this.SetActiveMJPropState, this);
        Manager.dispatcher.add("ShowJiShiQi", this.ShowJiShiQi, this);
        Manager.dispatcher.add(ProtoDef.pb.S2CMahUseMoProp, this.MahUseMoProp, this);
    }

    RemoveEvent()
    {
        Manager.dispatcher.remove("propUseCommon", this);
        Manager.dispatcher.remove("SetActiveMJProp", this);
        Manager.dispatcher.remove("ShowJiShiQi", this);
        Manager.dispatcher.remove(ProtoDef.pb.S2CMahUseMoProp, this);

        
    }

    SetActiveMJPropState(isShow:boolean)
    {
        this.SetActiveMJProp(isShow);
        dispatch(ProtoDef.pb.C2SPropTableState,{name:"mjProp",isShow:isShow});
    }

    SetActiveMJProp(isShow:boolean)
    {
        this.root.visible =isShow;
    }
    /** 点击了使用道具 */
    PropUseCommon(propID:number,id:number,dataSpe:pb.S2CMahBetterMjSuggestion)
    {
        // Log.w("点击了使用道具  propID  : ",propID)
        // Log.w("点击了使用道具  dataSpe  : ",dataSpe)
        this.HideAllChild();
        let isHaveView =false
        if (propID == 10003 || propID == 10004 || propID == 10005 || propID == 10006 ) //金银换牌卡
        {
            isHaveView=true
            this.jinYinChangeCardSC.SetData(propID,id)
        }
        else if (propID == 10007 || propID == 10008) //至尊换牌卡
        {
            isHaveView=true
            this.zzChangeCardSC.SetData(propID,id,dataSpe)
        }
        else if (propID == 10009 || propID == 10010) //定色卡
        {
            isHaveView=true
            this.dingColorCardSC.SetData(propID,id)
        }
        else if (propID == 10011 || propID == 10012) //海底捞月卡
        {
            isHaveView=true
            this.hdlyCardSC.SetData(propID,id)
        }
        else if (propID == 10013 || propID == 10014) //厌缺卡
        {

        }
        else if (propID == 10015 || propID == 10016) //如意卡
        {

            isHaveView=true
            this.wishCardSC.SetData(propID,id)
        }
        else if (propID == 10017 || propID == 10018) //换色卡
        {
            isHaveView=true
            this.changeColorCardSC.SetData(propID,id)
        }
        else if (propID == 10034 || propID == 10035 || propID == 10036) //换色卡
        {

            this.PropUseCommonTanKuang(propID,id)
            return
        }

        if (isHaveView) 
        {
           this.SetActiveMJProp(true)
           dispatch("SetActiveSelfAndState",false)
           dispatch(ProtoDef.pb.C2SPropTableState,{name:"mjProp",isShow:true});
        }
        else
        {
            dispatch("SetActiveSelfAndState",false)
            dispatch(ProtoDef.pb.C2SPropTableState,{name:"propUse",isShow:false});
            this.service.c2SUseProp(id,null);
        }
    }


    PropUseCommonTanKuang(propID:number,id:number)
    {
        function ff(params:boolean) {
            // Log.d("Manager.alert ff",params);
            if (params){
                dispatch("SetActiveSelfAndState",false)
                this.service.c2SUseProp(id,null);
            }else{
                Manager.tips.show("取消使用");
            }
        };

        let daoJuConfig =  Manager.utils.GetDaoJuConfig();
        let daoJuConfigItem = Manager.utils.GetDaoJuConfigItem( propID ,daoJuConfig );
        let cf:AlertConfig={
            // immediatelyCallback : true,
            title:"提示",
            text: "你要现在使用"+ daoJuConfigItem.MingZi +"吗？",   
            confirmCb: ff.bind(this),        
            cancelCb: ff.bind(this),
            confirmString:"使用",
            cancelString:"取消",
        };
        Manager.alert.show(cf);

    }


    HideAllChild()
    {
        this.changeColorCardSC.SetActive(false)
        this.dingColorCardSC.SetActive(false)
        this.hdlyCardSC.SetActive(false)
        this.jinYinChangeCardSC.SetActive(false)
        this.wishCardSC.SetActive(false)
        this.zzChangeCardSC.SetActive(false)
        this.mjJiPaiQiSC.SetActive(false)

    }

    // 记牌器
    SetJiPaiQIData(data:pb.IId2Val[])
    {
       
    }

    ShowJiShiQi()
    {
        this.HideAllChild();
        this.SetActiveMJProp(true)
        this.mjJiPaiQiSC.SetActive(true)
        this.mjJiPaiQiSC.SetData()
    }



    MahUseMoProp(data: pb.S2CMahUseMoProp)
    {
        Log.w(" MJProp 自己使用了摸牌卡  onS2CMahUseMoProp :",data);
        let daoJuConfig =  Manager.utils.GetDaoJuConfig();
        let daoJuConfigItem = Manager.utils.GetDaoJuConfigItem( data.type,daoJuConfig );
        Log.w(" MJProp 自己使用了摸牌卡  daoJuConfigItem :",daoJuConfigItem);
        Manager.tips.show(daoJuConfigItem.MingZi+"使用成功！");


    }



    Reflash()
    {
        if (this.zzChangeCardSC.root.visible) {
            this.zzChangeCardSC.Reflash();
        } 
        else if (this.changeColorCardSC.root.visible)
        {
            this.changeColorCardSC.Reflash();
        }
        else if (this.wishCardSC.root.visible)
        {
            this.wishCardSC.Reflash();
        }
        

    }



    Reset()
    {
        this.SetActiveMJProp(false)
    }





}


