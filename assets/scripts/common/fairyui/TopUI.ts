import { Config, ViewZOrder } from "../config/Config";
import { GameEvent } from "../event/GameEvent";
import FLevel2UI from "./FLevel2UI";
import KeFuView from "./KeFuView";
import SetView from "./SetView";
import ShopView from "./ShopView";
import { GameService } from "../net/GameService";
import { CurrencyType } from "../../def/GameEnums";
import { ProtoDef } from "../../def/ProtoDef";
import GameView from "../../framework/core/ui/GameView";
import HallView from "../../../bundles/hall/script/view/HallView";

export default class TopUI extends FLevel2UI {

    private hallJb:fgui.GObject = null;
    private hallZs:fgui.GObject = null;
    private hallLj:fgui.GObject = null;

    public refresh(){
        Log.e("refresh=========");
        this.hallJb.text = Manager.gd.playerCurrenciesStr(CurrencyType.CT_Coin);
        this.hallZs.text = Manager.gd.playerCurrenciesStr(CurrencyType.CT_Gem);
        this.hallLj.text = Manager.gd.playerCurrenciesStr(CurrencyType.CT_HuafeiQuan);
    }

    protected addEvents(): void {
        this.addEvent(GameEvent.RefreshPlayer,this.refresh);
    }
    
    public Init(ui: GameView, name?: string): void {
        this._owner = ui;
        this.root = ui.root.getChild(name).asCom;
        this.hallJb = this.root.getChild("coin").asCom.getChild("count");
        this.hallZs = this.root.getChild("diam").asCom.getChild("count");
        this.hallLj = this.root.getChild("gift").asCom.getChild("count");

        this.root.getChild("coin").onClick(this.onClickJinbi,this);
        this.root.getChild("diam").onClick(this.onClickZuanshi,this);
        this.root.getChild("gift").onClick(this.onClickLijuan,this);
        this.root.visible = true;

        this.root.getChild("sz").onClick(this.onClickSet,this);
        this.root.getChild("kf").onClick(this.onClickKf,this);

        this.addEvents();
        this.dySet();
    }


    private dySet(){
        this.root.getChild("kf").visible = false;
        let uiconfig = Manager.gd.get<pb.S2CUISwitches>(ProtoDef.pb.S2CUISwitches);
        if(uiconfig == null || uiconfig.items == null){
            return;
        }
        if(uiconfig.items["helper"] == null){
            return;
        }

        if(uiconfig.items["helper"] == 0){
            return;
        }

        this.root.getChild("kf").visible = true;
    }
    onClickKf(){
        Manager.uiManager.openFairy({ type: KeFuView, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.Alert, name: "客服界面" });
    }

    //设置
    onClickSet(){
        // dispatch(GameEvent.ENTER_GAME, [Config.BUNDLE_GameCOMMON,Config.BUNDLE_MJCOMMON,Config.BUNDLE_XLHZ]);
        Manager.uiManager.openFairy({ type: SetView, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.Alert, name: "设置界面" });
        // console.log(" 点击了 血流红中入口按键 ");
    }
    
    public setRoot(parent:fgui.GComponent): void {
        this.root = parent.getChild("top").asCom;
        this.hallJb = this.root.getChild("coin").asCom.getChild("count");
        this.hallZs = this.root.getChild("diam").asCom.getChild("count");
        this.hallLj = this.root.getChild("gift").asCom.getChild("count");

        this.root.getChild("coin").onClick(this.onClickJinbi,this);
        this.root.getChild("diam").onClick(this.onClickZuanshi,this);
        this.root.getChild("gift").onClick(this.onClickLijuan,this);
        this.root.visible = true;

        
        this.root.getChild("sz").onClick(this.onClickSet,this);
        this.root.getChild("kf").onClick(this.onClickKf,this);
        
        this.addEvents();
        this.dySet();
    }

    protected onClickJinbi(evt: fgui.Event){
        // let btn: fgui.GObject = fgui.GObject.cast(evt.currentTarget);
        Manager.uiManager.getView("HallView").then((view : HallView)=>{
            if ( view ){
                if (!Manager.uiManager.isShow(ShopView)) {
                    Manager.gd.put(ProtoDef.pb.S2CGetShopItems+"Index",{catName:"免费金豆"});
                    Manager.uiManager.openFairy({ type: ShopView, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.ShopUI, name: "商城" });
                }
                else
                {
                    Manager.gd.put(ProtoDef.pb.S2CGetShopItems+"Index",{catName:"免费金豆"});
                    dispatch(ProtoDef.pb.S2CGetShopItems+"shopView");
                }
            }
        })
    }

    protected onClickZuanshi(evt: fgui.Event){
        Manager.uiManager.getView("HallView").then((view : HallView)=>{
            if ( view ){
                if (!Manager.uiManager.isShow(ShopView)) {
                    Manager.gd.put(ProtoDef.pb.S2CGetShopItems+"Index",{catName:"钻石"});
                    Manager.uiManager.openFairy({ type: ShopView, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.ShopUI, name: "商城" });
                }
                else
                {
                    Manager.gd.put(ProtoDef.pb.S2CGetShopItems+"Index",{catName:"钻石"});
                    dispatch(ProtoDef.pb.S2CGetShopItems+"shopView");
                }
            }
        })
    }

    protected onClickLijuan(evt: fgui.Event){
        // let btn: fgui.GObject = fgui.GObject.cast(evt.currentTarget);
        // this.view().shop.setSelectIndex(4);
        // this.service.getShopItems();
        // this.view().shop.show();
        Manager.uiManager.getView("HallView").then((view : HallView)=>{
            if ( view ){
                if (!Manager.uiManager.isShow(ShopView)) {
                    Manager.gd.put(ProtoDef.pb.S2CGetShopItems+"Index",{catName:"道具兑换"});
                    Manager.uiManager.openFairy({ type: ShopView, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.ShopUI, name: "商城" });
                }
                else
                {
                    Manager.gd.put(ProtoDef.pb.S2CGetShopItems+"Index",{catName:"道具兑换"});
                    dispatch(ProtoDef.pb.S2CGetShopItems+"shopView");
                }
            }
        });
    }

    get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }
}
