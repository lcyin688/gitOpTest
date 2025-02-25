import TopUI from "../../../../../scripts/common/fairyui/TopUI";
import { GameService } from "../../../../../scripts/common/net/GameService";
import { RaceType } from "../../../../../scripts/def/GameEnums";
import { ProtoDef } from "../../../../../scripts/def/ProtoDef";
import UIView from "../../../../../scripts/framework/core/ui/UIView";
import PaoMaDengView from "../PaoMaDengView";
import MatchItem from "./MatchItem";



const {ccclass, property} = cc._decorator;

@ccclass
export default class MatchDaTing extends UIView {


    private topUI:TopUI = null;
    private paoMaDengViewSC:PaoMaDengView = null;

    private selectIndex:number = 0;
    private matchList:fgui.GList=null;

    private leftTab:fgui.GButton[] = [];
    private ssbsDate:pb.IRaceShowItem[] =[];
    private xxbsDate:pb.IRaceShowItem[] =[];



    get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }
    protected addEvents(): void 
    {
        Log.e(" MatchDaTing  注册了  ")
        this.addEvent(ProtoDef.pb.S2CRaces, this.ReFlashView);
        if(this.topUI){
            this.topUI.addListeners();
        }


    }


    onDispose(): void {
        Log.e("   MatchDaTing onDispose ")

        this.removeEvent(ProtoDef.pb.S2CRaces);
        if(this.topUI){
            this.topUI.removeEventListeners();
        }
        if (this.paoMaDengViewSC) {
            this.paoMaDengViewSC.RemoveEvent()
        }

        super.onDispose();
    }


    public static getPrefabUrl() {
        return "prefabs/HallView";
    }

    static getViewPath(): ViewPath {
        let path : ViewPath = {
            	/**@description 资源路径 creator 原生使用*/
            assetUrl: "ui/hall",
            /**@description 包名称 fgui 使用*/
            pkgName : "hall",
            /**@description 资源名称 fgui 使用*/
            resName : "matchDaTing",
        }
        return path;
    }

    onLoad() {
        super.onLoad();
        this.ReFlashView();
    }


    public show(): void {
        super.show();
    }

    public hide(): void {
        super.hide();
    }







    onFairyLoad(): void {
        Log.w(" MatchDaTing onBind ")

        this.topUI = new TopUI();
        this.topUI.setRoot(this.root);
        this.topUI.refresh();
        this.paoMaDengViewSC = new PaoMaDengView(this.root.getChild("paoMaDeng").asCom);
        this.root.getChild("close").onClick(this.onClickClose,this);
        

        for (let index = 0; index < 5; index++) {
            this.leftTab[index]=this.root.getChild("tab"+index).asButton;
            // this.leftTab[index].visible = false;
            this.leftTab[index].onClick(this.onClickLeftTab,this);
            this.leftTab[index].data = index;
         }


        this.matchList = this.root.getChild("list").asList;

        this.matchList.setVirtual();
        this.matchList.itemRenderer = this.renderyListItem.bind(this);





        this.onClickLeftTabIndex(0);

    }


    onClickClose() {
        Manager.uiManager.close(MatchDaTing);
    }




    ReFlashView() {
        let data = Manager.gd.get<pb.S2CRaces>(ProtoDef.pb.S2CRaces);
        Log.d(" MatchDaTing  data   ",data)
        if (data==null) {
            return;
        }

        this.ssbsDate=[];
        this.xxbsDate=[];
        // this.matchList.numItems = this.dataItem.length+1;
        for (let i = 0; i < data.items.length; i++) {
            let item = data.items[i];
            //预约赛 常规赛是 线下比赛
            if (item.raceType == RaceType.RaceType_Appointment || item.raceType == RaceType.RaceType_Normal ) {
                this.ssbsDate.push(item);
            }
            else
            {
                this.xxbsDate.push(item);
            }
        }

        if (this.selectIndex == 0 || this.selectIndex == 1 ) 
        {
            if (this.selectIndex == 0) {
                this.matchList.numItems = this.ssbsDate.length;
            }
            else
            {
                this.matchList.numItems = this.xxbsDate.length;
            }
            this.matchList.refreshVirtualList();
        }

    }
    

    private SetCickState(index:number)
    {
        Log.d(" MatchDaTing  SetCickState  index   ",index)
        this.selectIndex = index;
    }

    onClickLeftTab(evt: fgui.Event){
        let data = fgui.GObject.cast(evt.currentTarget);
        this.onClickLeftTabIndex(data.asCom.data)




        // this.matchList.numItems = this.dataItem.length+1;

    }

    onClickLeftTabIndex(seleindex: number){
        Log.e("onClickLeftTabIndex   seleindex:",seleindex);
        this.SetCickState(seleindex)
        for (let index = 0; index < this.leftTab.length; index++) 
        {
            if (this.leftTab[index].data==seleindex ) 
            {
                this.leftTab[index].asCom.getController("c1").selectedIndex = 1;
            } else {
                this.leftTab[index].asCom.getController("c1").selectedIndex = 0;
            }
        }

        this.ReFlashView();

    }





    private renderyListItem(index: number, obj: fgui.GObject): void {
        let item = obj.asCom;
        let matchitem = new MatchItem(item);
        Log.d(" MatchDaTing  renderyListItem  index   ",index)
        if (this.selectIndex == 0) {
            matchitem.SetData(this.ssbsDate[index]);
        }
        else
        {
            matchitem.SetData(this.xxbsDate[index]);
        }
    }




}