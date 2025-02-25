import { Config, ViewZOrder } from "../../../../scripts/common/config/Config";
import FLevel2UI from "../../../../scripts/common/fairyui/FLevel2UI";
import SetView from "../../../../scripts/common/fairyui/SetView";
import { GameService } from "../../../../scripts/common/net/GameService";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";
import PaoMaDengView from "../../../hall/script/view/PaoMaDengView";
import { RoomManager } from "../manager/RoomManager";
import ChatOne from "./ChatOne";
import PlayerDetails from "./PlayerDetails";
import PropUse from "./PropUse";




export default class RoomView extends FLevel2UI {
    protected menu_Gc: fgui.GComponent = null;
    private menu_list : fgui.GList=null;
    private cont_control :fgui.Controller=null 
    private time_text :fgui.GObject=null
    private electricity_bar :fgui.GProgressBar=null

    
    private paoMaDengViewSC:PaoMaDengView = null;

    playerDetails_sc:PlayerDetails=null;
    propUse_sc:PropUse=null
    chatOne_sc:ChatOne=null
    chat_btn:fgui.GButton=null;
    //计时器工具
    timer_1: number;


    get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }

    public Init(ui: GameView, name?: string): void {
        super.Init(ui,name);
        this.setInit();
        Manager.utils.GetAdsConfig();
    }

    protected onBind(): void 
    {

        
    }

    public backUseDdzCjjb():boolean{
        return this.propUse_sc.backUseDdzCjjb();
    }

    public backUseDdzKdp():boolean{
        return this.propUse_sc.backUseDdzKdp();
    }

    public setInit() {
        this.root.makeFullScreen();
        this.show();
        this.menu_Gc = this.root.getChild("menu").asCom;
        this.menu_list = this.menu_Gc.getChild("list").asList;
        this.cont_control = this.root.getController("c1");
        this.playerDetails_sc = new PlayerDetails(this.root.getChild("playerDetails").asCom);

        this.time_text = this.root.getChild("time");
        this.electricity_bar = this.root.getChild("electricity").asProgress;

        
        this.chat_btn = this.root.getChild("chatBtn").asButton;
        this.chatOne_sc = new ChatOne(this.root.getChild("chatOne").asCom);
        this.paoMaDengViewSC = new PaoMaDengView(this.root.getChild("paoMaDeng").asCom);

        Manager.utils.GetTSPeiZhiConfig();
        this.ReFlashTime ()
        this.timer_1 = window.setInterval(this.ReFlashTime.bind(this), 30000);
        this.InitEvent()
        this.BindEvent()
    }

    ReflashElectricity_bar()
    {
        this.electricity_bar.value=Manager.platform.electricity().cur;
        this.electricity_bar.min=0;
        this.electricity_bar.max=Manager.platform.electricity().max;
    }



    SetPropUse(propUse_sc:PropUse)
    {
        // this.propUse_sc = new PropUse(this._owner.getChild("propUse").asCom);
        this.propUse_sc = propUse_sc;

    }


    leaveGame(){
        if(RoomManager.curState != RoomManager.StateType.Resulting && !RoomManager.SelfIsPoChan)
        {
            Manager.tips.show("游戏中不能离开");
            return;
        }
        RoomManager.ExitTableFinal();
    }

    private BindEvent()
    {
        this.root.getChild("exitBtn").onClick(this.leaveGame,this);
        this.menu_list.on(fgui.Event.CLICK_ITEM, this.onClickItem, this);
        this.chat_btn.onClick(this.OnclickChat,this)
        this.root.getChild("propBtn").onClick(this.ShowPropBag,this);
        
    }

    showBag(isShow:boolean=true){
        if (this.propUse_sc!=null) {
            this.propUse_sc.C2sGetBag()
            // this.propUse_sc.SetActiveSelf(isShow)
            this.propUse_sc.SetShowState(isShow); 
        }
    }

    hideBag(){
        if (this.propUse_sc!=null) {
            this.propUse_sc.SetActiveSelf(false)
            this.propUse_sc.SetShowState(false); 
        }
    }


    private onClickItem(com: fgui.GComponent){
        // ClickWanFa
        // ClickSet
        // ClickTuoGuan
        if(this.menu_list.parent != null && this.menu_list.parent.scaleY < 1){
            return;
        }
        Log.w("onClickItem  com.name  ", com.name)

        if(com.name == "ClickSet"){
            Manager.uiManager.openFairy({ type: SetView, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.UI, name: "设置界面",args:1});
        }else{
            dispatch(com.name);
        }
    }
    
    removeEventListeners(): void {
        this.RemoveEvent();
        super.removeEventListeners();
    }

    /** 添加事件 */
    protected InitEvent() {
        Manager.dispatcher.add("ShowPropBag", this.ShowPropBag, this);

    }

    ShowPropBag(){
        this.propUse_sc.C2sGetBag()
        // this.propUse_sc.SetActiveSelf(true)
        this.propUse_sc.SetShowState(true)
        dispatch(ProtoDef.pb.C2SPropTableState,{name:"propUse",isShow:true});
    }



    RemoveEvent()
    {
        window.clearInterval(this.timer_1);
        Manager.dispatcher.remove("ShowPropBag", this);
        this.playerDetails_sc.RemoveEvent()
        this.propUse_sc.RemoveEvent()
        this.paoMaDengViewSC.RemoveEvent()
    }


    SetActivePropBtn(isShow: boolean) 
    {
        if (this.root.getChild("propBtn")) 
        {
            this.root.getChild("propBtn").visible=isShow;    
        }
    }  
    

    SetActiveMenu(isShow: boolean) 
    {
        if (this.menu_Gc!=null) {
            this.menu_Gc.visible = isShow;
        }
    }


    OnclickChat()
    {
        Log.e("  OnclickChat  ")

        if (this.chatOne_sc.root.visible) 
        {
            this.chatOne_sc.SetActiveSelf(false)    
        }
        else
        {
            this.chatOne_sc.ReFlash()    
        }
    }

    ReFlashTime ()
    {
        this.ReflashElectricity_bar()
        this.time_text.text =  Manager.utils.formatTimeData();
    }
    

     Reset()
     {
        this.cont_control.selectedIndex = 0;
        this.playerDetails_sc.Reset()
        this.chatOne_sc.Reset()
        if (this.propUse_sc!=null) {
            this.propUse_sc.Reset()
        }
        this.SetActivePropBtn(false)
     }

}
