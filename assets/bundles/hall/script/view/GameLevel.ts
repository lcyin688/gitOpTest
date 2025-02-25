
import { Config, ViewZOrder } from "../../../../scripts/common/config/Config";
import GameData from "../../../../scripts/common/data/GameData";
import { GameEvent } from "../../../../scripts/common/event/GameEvent";
import DDZRuleView from "../../../../scripts/common/fairyui/DDZRuleView";
import EnterGameProp from "../../../../scripts/common/fairyui/EnterGameProp";
import FLevel2UI from "../../../../scripts/common/fairyui/FLevel2UI";
import MJRuleView from "../../../../scripts/common/fairyui/MJRuleView";
import TopUI from "../../../../scripts/common/fairyui/TopUI";
import { GameService } from "../../../../scripts/common/net/GameService";
import { CurrencyType, GameCat } from "../../../../scripts/def/GameEnums";
import { HallLogic } from "../logic/HallLogic";
import HallView from "./HallView";


export default class GameLevel extends FLevel2UI {

    private leftTab:fgui.GButton[] = [];
    private curTitle:fgui.GObject = null;
    private topUI:TopUI = null;
    private tableList:fgui.GList = null;
    private curTabName:string = null;

    private curData:pb.S2CGetTables = null;

    private uiConfig:any = {
        "初级场":["lv_bg_1","lv_ft_1","glfont1"],
        "中级场":["lv_bg_2","lv_ft_2","glfont2"],
        "高级场":["lv_bg_3","lv_ft_3","glfont3"],
        "精英场":["lv_bg_4","lv_ft_4","glfont4"],
        "大师场":["lv_bg_5","lv_ft_5","glfont5"],
        "至尊场":["lv_bg_6","lv_ft_6","glfont6"],
    }
    get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }

    protected view(): HallView {
        return this._owner as HallView;
    }

    protected lg(): HallLogic {
        return this.view().logic;
    }


    private bg(key:string):string{
        return this.uiConfig[key][0];
    }

    private tt(key:string):string{
        return this.uiConfig[key][1];
    }

    private ft(key:string):string{
        return this.uiConfig[key][2];
    }

    addListeners(): void {
        super.addListeners();
        if(this.topUI){
            this.topUI.addListeners();
        }
    }

    removeEventListeners(): void {
        super.removeEventListeners();
        if(this.topUI){
            this.topUI.removeEventListeners();
        }
    }
    
    protected bindCloseClick(){
        this._close.onClick(this.onClickClose,this);
    }

    protected onClickClose(){
        this.lg().gobackLobby();
    }

    protected addEvents(): void {
        Log.e("GameLevel.addEvents");
        this.addEvent(GameEvent.RefreshPlayer,this.RefreshPlayer);
        this.addEvent("GameLevelSetGameName",this.setGameName);


        

    }

    protected onBind(): void {
        this.addEvents();
        Log.d(this.root.name);
        this._close = this.root.getChild("back").asCom.getChild("back");
        this.bindCloseClick();

        for (let index = 0; index < 5; index++) {
           this.leftTab[index]=this.root.getChild("tab"+index).asButton;
           this.leftTab[index].visible = false;
           this.leftTab[index].onClick(this.onClickLeftTab,this);
        }

        this.curTitle = this.root.getChild("back").asCom.getChild("back").asCom.getChild("gn");
        this.tableList = this.root.getChild("list").asList;
        this.tableList.on(fgui.Event.CLICK_ITEM, this.onClickItem, this);
        this.root.getChild("qs").asButton.onClick(this.ClickQSStart,this  )


        this.root.getChild("hint").asButton.onClick(this.ClickWanFaRecommend,this);

        this.topUI = new TopUI();
        this.topUI.setRoot(this.root);

        let list = this.root.getChild("list").asList;
        let ysw = list.width - list.initWidth;
        if(ysw > 0){
            list.columnGap += ysw / 3;
        }
        let left = this.root.getChild("left").width;
        list.x = (fgui.GRoot.inst.width - left) / 2 + left;
    }

    setGameName(name:string){
        this.curTitle.text = name;
    }

    public show(): void {
        super.show(); 
        this.topUI.refresh(); 
        // this.root.getTransition("t0").play();
    }
    
    private isShow(data:pb.S2CGetTables):boolean{
        if(data.quick == null || data.quick.catName == null || data.quick.cfgId == null || data.quick.catName.length == 0 || data.quick.cfgId == 0){
            return true;
        }
        return false;
    }

    open(data:pb.S2CGetTables){
        this.topUI.refresh();
        this.curData = data;
        //临时处理
        if(data.gameType == GameCat.GameCat_Dou){
            this.setGameName("斗地主");
        }else if(data.gameType == GameCat.GameCat_Mahjong){
            this.setGameName("红中血流");
        }else if(data.gameType == GameCat.GameCat_Mah3Ren2Fang){
            this.setGameName("三人两房");
        }
        // Log.e("gamelevel open ",data)
        
        let isNotQuick = this.isShow(data);
        if(isNotQuick){
            this.show();
        }


        for (let index = 0; index < 5; index++) {
            this.leftTab[index].visible = false;
        }
        for (let index = 0; index < data.tables.length; index++) {
            this.leftTab[index].title = data.tables[index].catName;
            this.leftTab[index].getChild("title1").text = data.tables[index].catName;
            this.leftTab[index].data = data.tables[index].items;
            this.leftTab[index].visible = true;
            if (data.tables[index].isRecommend){
                this.setListView(data.tables[index].items,data.tables[index].catName);
                this.root.getController("GIT").selectedIndex = index;
            }
        }

        if(!isNotQuick){
            this.silentQuickMatch()
        }
    }

    private silentQuickMatch(){
        // Log.d("silentQuickMatch:",this.tableList._children.length);
        // if(this.tableList._children.length == 0){
        //     return;
        // }
        // let coin = Manager.gd.playerCurrencies(CurrencyType.CT_Coin);
        // for (let index1 = 0; index1 < this.tableList._children.length; index1++) {
        //     const item = this.tableList.getChildAt(index1).asCom;
        //     let act = item.getChild("act").asCom;
        //     let et = item.data;
        //     if(et != null){
        //         if(coin>= et.recommCurrency.first && ( et.recommCurrency.second == 0 || coin <= et.recommCurrency.second)){
        //             this.onClickItem(item);
        //             return;
        //         }
        //     }
        // }

        this.enterGame(this.curData.gameType,this.curData.quick.cfgId)

        //没有找到要调用返回大厅接口
    }
    /** 玩法界面 */
    ClickWanFaRecommend() 
    {
        if(this.curData == null){
            return;
        }

        Manager.gd.put("RuleGameType",this.curData .gameType);

        //临时处理
        if(this.curData.gameType == GameCat.GameCat_Dou){
            Manager.uiManager.openFairy({ type: DDZRuleView, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.UI, name: "斗地主规则界面" });
        }else if(this.curData .gameType == GameCat.GameCat_Mahjong|| this.curData .gameType == GameCat.GameCat_Mah3Ren2Fang){
            
            // dispatch(GameEvent.UI_General_WanFa,this.curData .gameType);
            Manager.uiManager.openFairy({ type: MJRuleView, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.UI, name: "麻将规则界面" });
        }
    }



    /** 快速游戏 */
    ClickQSStart() 
    {
        if(this.tableList.data != null){
            let np = Manager.gd.getNextMatch(this.curTabName);
            if(np == null){
                Manager.tips.show("服务器数据错误,没有找到符合你的场次");
                return;
            }
            this.enterGame(np.gt,np.cfgId);
        }else{
            Manager.tips.show("客户端数据错误");
        }
    }


    enterGame(gameType:number,cfgId:number)
    {
        Log.w(" enterGame  cfgId:   ",cfgId)
        // this.view().enterGameProp.SetInit(gameType,cfgId)
        let tempData ={gameType:gameType,cfgId:cfgId,func:()=>{},isInGame:false}
        Manager.gd.put("EnterGamePropData",tempData);
        this.service.onC2SHasPoChan(gameType,cfgId);
    }


    setListView(d: pb.ITableInfo[],catName:string){
        // this.tableList.visible = false;
        this.curTabName = catName;

        let np = Manager.gd.getNextMatch(this.curTabName);
        if (np!=null) {
            this.root.getChild("qs").asButton.text = np.name;
        }
        this.tableList.removeChildrenToPool();
        this.tableList.data = d;
        let gd = Manager.dataCenter.get(GameData);
        let coin = gd.playerCurrencies(CurrencyType.CT_Coin);

        // fgui.GTween.delayedCall(0.1).setTarget(this.tableList).onComplete(this.onSetListComplete.bind(this));

        for (let index1 = 0; index1 < d.length; index1++) {
            const et = d[index1];
            let item = this.tableList.addItemFromPool().asCom;
            item.visible = true;
            let act = item.getChild("act").asCom;
            item.data = et;
            fgui.GTween.delayedCall(index1*0.1).setTarget(item).onComplete(this.onItemComplete.bind(this));
            act.getChild("bgloader").icon = fgui.UIPackage.getItemURL("hall",this.bg(et.changCiName));
            act.getChild("lv").icon = fgui.UIPackage.getItemURL("hall",this.tt(et.changCiName));
            let df = act.getChild("df").asTextField;
            df.font = fgui.UIPackage.getItemURL("hall",this.ft(et.changCiName));
            df.text = Manager.utils.formatCoin(et.radix); 
            act.getChild("rs").text = et.playerNum.toString();
            act.getChild("zr").text = et.cond;
            act.visible = false;
            if(coin>= et.recommCurrency.first && ( et.recommCurrency.second == 0 || coin <= et.recommCurrency.second)){
                act.getChild("eft").visible = true;
            }else{
                act.getChild("eft").visible = false;
            }
        }
    }

    // onSetListComplete(gt:fgui.GTweener){
    //     this.tableList.visible = true;
    // }

    onItemComplete(gt:fgui.GTweener){
        this.tableList.visible = true;
        let com = gt.target as fgui.GComponent;
        com.getChild("act").visible = true;
        if(com != null){
            com.getTransition("t0").play();
        }
    }
    onClickItem(obj: fgui.GObject){
        let gd = Manager.dataCenter.get(GameData);
        let coin = gd.playerCurrencies(CurrencyType.CT_Coin);
        Log.d(" GameLevel onClickItem:",coin,obj.data.recommCurrency.first,obj.data.recommCurrency.second);
        if(coin>= obj.data.recommCurrency.second && obj.data.recommCurrency.second != 0 ){
            let d = this.tableList.data;
            for (let index1 = 0; index1 < d.length; index1++) {
                const et = d[index1];
                if(coin>= et.recommCurrency.first && ( et.recommCurrency.second == 0 || coin <= et.recommCurrency.second)){
                    Manager.tips.show("请您前往"+et.changCiName+"挑战");
                    return;
                }
            }
            Manager.tips.show("服务器数据错误,没有找到符合你的场次");

        }else{
            this.enterGame(obj.data.gameType,obj.data.cfgId)
        }
    }

    onClickLeftTab(evt: fgui.Event){
        let data = fgui.GObject.cast(evt.currentTarget);
        Log.d("onClickLeftTab:",data);
        this.setListView(data.data,data.text);
    }

    public RefreshPlayer(){
        Log.d("GameLevel.RefreshPlayer");
        if(this.tableList._children.length == 0){
            return;
        }
        let coin = Manager.gd.playerCurrencies(CurrencyType.CT_Coin);
        for (let index1 = 0; index1 < this.tableList._children.length; index1++) {
            const item = this.tableList.getChildAt(index1).asCom;
            let act = item.getChild("act").asCom;
            let et = item.data;
            if(et != null){
                if(coin>= et.recommCurrency.first && ( et.recommCurrency.second == 0 || coin <= et.recommCurrency.second)){
                    act.getChild("eft").visible = true;
                }else{
                    act.getChild("eft").visible = false;
                }
            }
        }
    }
}