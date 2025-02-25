
import { GroupId } from "../../def/GameEnums";
import { ProtoDef } from "../../def/ProtoDef";
import UIView from "../../framework/core/ui/UIView";
import { Config } from "../config/Config";
import GameData from "../data/GameData";
import { GameService } from "../net/GameService";
import Toast from "./Toast";

const {ccclass, property} = cc._decorator;

@ccclass
export default class InvitedPlayer extends UIView {

    private daTingInvite_gc:fgui.GComponent = null;
    private search_gc:fgui.GComponent = null;
    private game_list:fgui.GList=null;
    private dating_list:fgui.GList=null;
    private invite_btn:fgui.GButton=null;
    private refresh_btn:fgui.GButton=null;
    private search_list:fgui.GList=null;
    private input_text :fgui.GTextInput=null

    get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }

    static getViewPath(): ViewPath {
        let path : ViewPath = {
            	/**@description 资源路径 creator 原生使用*/
            assetUrl: "ui/hall",
            /**@description 包名称 fgui 使用*/
            pkgName : "hall",
            /**@description 资源名称 fgui 使用*/
            resName : "InvitedPlayerView",
        }
        return path;
    }

    protected addEvents(): void 
    {
        Log.w("注册 InvitedPlayer ")
        this.addEvent(ProtoDef.pb.S2CGetIdlePlayers,this.ReFlashDaTingView);
    }

    onLoad() {
        super.onLoad();
        this.show();

    }

    onClickClose(){
        Manager.uiManager.close(InvitedPlayer);
    }

    onFairyLoad(): void {
        Log.w("加载完成 onFairyLoad ")

        this.root.getChild("closeBtn").onClick(this.onClickClose,this);
        this.root.getChild("n1").onClick(this.onClickClose,this);

        this.game_list = this.root.getChild("gamesList").asList
        let item: fgui.GButton = this.game_list.addItemFromPool().asButton;
        item.getChild("title").text = "大厅列表"
        item.getChild("title1").text = "大厅列表"
        item.data = 0
        item = this.game_list.addItemFromPool().asButton;
        item.getChild("title").text = "搜索邀请"
        item.getChild("title1").text = "搜索邀请"
        item.data = 1

        this.game_list.on(fgui.Event.CLICK_ITEM, this.onClickItem, this);



        this.daTingInvite_gc = this.root.getChild("daTingInvite").asCom
        this.search_gc = this.root.getChild("search").asCom

        this.dating_list = this.daTingInvite_gc.getChild("list").asList

        this.invite_btn = this.daTingInvite_gc.getChild("inviteBtn").asButton
        this.invite_btn.text ="一键邀请"
        this.invite_btn.onClick(this.onClickYJYQ,this);

        this.refresh_btn = this.daTingInvite_gc.getChild("refreshBtn").asButton
        this.refresh_btn.text ="换一批"
        this.refresh_btn.onClick(this.onClickRefresh,this);

        this.search_list = this.search_gc.getChild("list").asList
        this.input_text = this.search_gc.getChild("search").asCom.getChild("input").asTextInput
        
        this.search_gc.getChild("search").asCom.getChild("searchBtn").onClick(this.OnClickSearchBtn,this)
        
        this.input_text.text =""
        this.OnClickDatingSerSearch(0)
    }


    onClickYJYQ()
    {
        this.service.onC2SInvitePlay(0);
        for (let i = 0; i < this.dating_list._children.length; i++) 
        {
            this.dating_list._children[i].asCom.getChild("inviteBtn").visible=false
            this.dating_list._children[i].asCom.getChild("inviteOverBtn").visible=true
            
        }
    }

    onClickRefresh()
    {
        this.service.onC2SGetIdlePlayers(null);
    }

    onClickItem(obj: fgui.GObject){
        Log.d("onClickItem:",obj.data);

        this.OnClickDatingSerSearch(obj.data)

    }

    
    OnClickDatingSerSearch(currentIndex:number) 
    {
    
        for (let index = 0; index < this.game_list._children.length; index++) 
        {
            let item = this.game_list._children[index].asButton;
            if (index== currentIndex) 
            {
                item.getController("c1").selectedIndex =1
            }
            else
            {
                item.getController("c1").selectedIndex =0
            }
        }
        // let data = Manager.gd.get<pb.S2CGetIdlePlayers>(ProtoDef.pb.S2CGetIdlePlayers);
        // if (data!=null) 
        // {
        //     this.ReFlashView()
        // }
        if (currentIndex==0) 
        {
            this.daTingInvite_gc.visible = true;
            this.search_gc.visible =false;
        }
        else  if (currentIndex==1) 
        {
            this.daTingInvite_gc.visible = false;
            this.search_gc.visible =true;
            this.ClearSearchList();
            this.input_text.text =""

        }

        
    }


    public show(): void {
        super.show();
    }

       
    ReFlashDaTingView()
    {
        let data = Manager.gd.get<pb.S2CGetIdlePlayers>(ProtoDef.pb.S2CGetIdlePlayers);
        Log.w("ReFlashView  data ; ",data)
        
        let datalv = Manager.gd.get<pb.IGradeCfg[]>(ProtoDef.pb.S2CGradeCfgs);
        Log.e("pb.IGradeCfg[]", datalv);

        this.ClearDatingList()
        let getTables = Manager.gd.get<pb.S2CGetTables>(ProtoDef.pb.S2CGetTables);
        let dwData:pb.S2CGetSeasonDuanWeiCfg = Manager.dataCenter.get(GameData).get<pb.S2CGetSeasonDuanWeiCfg>(ProtoDef.pb.S2CGetSeasonDuanWeiCfg+"_"+Manager.utils.gt(getTables.gameType));

        // Log.w("ReFlashView  dwData ; ",dwData)

        for (let i = 0; i < data.items.length; i++) 
        {

            let item: fgui.GComponent = this.dating_list.addItemFromPool().asCom;
            const et = data.items[i]

            let gd = Manager.dataCenter.get(GameData);
            item.getChild("name").text = et.name
            item.getChild("face").asCom.getChild("icon").icon=gd.playerheadUrl(et.portraits);

            let gender = et.gender //1男2 女
            if (gender== 1) {
                item.getChild("genderIcon").icon= fgui.UIPackage.getItemURL("hall","player_info_icon_2");
            }
            else
            {
                item.getChild("genderIcon").icon= fgui.UIPackage.getItemURL("hall","player_info_icon_3");
            }
            item.getChild("stateIcon").icon= fgui.UIPackage.getItemURL("hall","invitezi_"+et.state);

            item.getChild("inviteBtn").asCom.getChild("title").text="邀请游戏"
            item.getChild("inviteOverBtn").asCom.getChild("title").text="已邀请"
            item.getChild("inviteBtn").visible = true;
            item.getChild("inviteOverBtn").visible = false;
            // let iconId = Manager.utils.dwIcon(et.level);
            // item.getChild("sjloader").icon = fgui.UIPackage.getItemURL(Config.BUNDLE_HALL,"ui_rank_dw_di_"+iconId); 

            let dl = item.getChild("dwlabel").asLabel;
            Manager.utils.setDwLabel(dl,dwData.items[et.level-1]);

            if(datalv != null)
            {
                item.getChild("dw").text = datalv[et.level].title;
            }

            item.getChild("inviteBtn").onClick(()=>{
                item.getChild("inviteBtn").visible = false;
                item.getChild("inviteOverBtn").visible = true;
                this.service.onC2SInvitePlay(et.guid);
            },this);

        }

        this.ReFlashSearchView()

    }



    ReFlashSearchView()
    {
        let data = Manager.gd.get<pb.S2CGetIdlePlayers>(ProtoDef.pb.S2CGetIdlePlayers+"search");
        if ( data==null) 
        {
            return
        }
        Log.w("ReFlashView  data ; ",data)

        let datalv = Manager.gd.get<pb.IGradeCfg[]>(ProtoDef.pb.S2CGradeCfgs);
        Log.e("pb.IGradeCfg[]", datalv);

        this.ClearSearchList()

        let getTables = Manager.gd.get<pb.S2CGetTables>(ProtoDef.pb.S2CGetTables);
        let dwData:pb.S2CGetSeasonDuanWeiCfg = Manager.dataCenter.get(GameData).get<pb.S2CGetSeasonDuanWeiCfg>(ProtoDef.pb.S2CGetSeasonDuanWeiCfg+"_"+Manager.utils.gt(getTables.gameType));

        for (let i = 0; i < data.items.length; i++) 
        {

            let item: fgui.GComponent = this.search_list.addItemFromPool().asCom;
            const et = data.items[i]

            let gd = Manager.dataCenter.get(GameData);
            item.getChild("name").text = et.name
            item.getChild("face").asCom.getChild("icon").icon=gd.playerheadUrl(et.portraits);

            let gender = et.gender //1男2 女
            if (gender== 1) {
                item.getChild("genderIcon").icon= fgui.UIPackage.getItemURL("hall","player_info_icon_2");
            }
            else
            {
                item.getChild("genderIcon").icon= fgui.UIPackage.getItemURL("hall","player_info_icon_3");
            }
            item.getChild("stateIcon").icon= fgui.UIPackage.getItemURL("hall","invitezi_"+et.state);

            item.getChild("inviteBtn").asCom.getChild("title").text="邀请游戏"
            item.getChild("inviteOverBtn").asCom.getChild("title").text="已邀请"
            item.getChild("inviteBtn").visible = true;
            item.getChild("inviteOverBtn").visible = false;
            // let iconId = Manager.utils.dwIcon(et.level);
            // item.getChild("sjloader").icon = fgui.UIPackage.getItemURL(Config.BUNDLE_HALL,"ui_rank_dw_di_"+iconId);
            
            let dl = item.getChild("dwlabel").asLabel;
            Manager.utils.setDwLabel(dl,dwData.items[et.level-1]);

            if(datalv != null)
            {
                item.getChild("dw").text = datalv[et.level].title;
            }

            item.getChild("inviteBtn").onClick(()=>{
                item.getChild("inviteBtn").visible = false;
                item.getChild("inviteOverBtn").visible = true;
                this.service.onC2SInvitePlay(et.guid);
            },this);

        }




    }




    OnClickSearchBtn()
    {

        if (this.input_text.text==null || this.input_text.text=="" ) 
        {
            Manager.tips.showFromId("TS_INPUT_NULL");
            return;
        }
        this.service.onC2SGetIdlePlayers(Number(this.input_text.text) );


    }

    

    ClearDatingList()
    {

        for (let i = 0; i < this.dating_list._children.length; i++) 
        {
            this.dating_list._children[i].asCom.getChild("inviteBtn").offClick(()=>{},this)
            
        }
        this.dating_list.removeChildrenToPool()

    }

    ClearSearchList()
    {

        for (let i = 0; i < this.search_list._children.length; i++) 
        {
            this.search_list._children[i].asCom.getChild("inviteBtn").offClick(()=>{},this)
            
        }
        this.search_list.removeChildrenToPool()

    }

    
}


