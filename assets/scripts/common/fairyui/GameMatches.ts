import { CfgType, CurrencyType, PlayerAttr, PoChanRewardType, PoChanTable } from "../../def/GameEnums";
import { ProtoDef } from "../../def/ProtoDef";
import UIView from "../../framework/core/ui/UIView";
import { Config, ViewZOrder } from "../config/Config";
import GameData from "../data/GameData";
import { GameEvent } from "../event/GameEvent";
import { CmmProto } from "../net/CmmProto";
import { GameService } from "../net/GameService";
import { Utils } from "../utils/Utils";
import InvitedPlayer from "./InvitedPlayer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameMatches extends UIView {
    private tableList:fgui.GList = null;

    private countDown_text:fgui.GObject=null;
    private playersArr_gc:Array<fgui.GComponent> =[]
    private close_btn :fgui.GButton=null;
    //计时器工具
    timer_1: number;
    m_uCountDown = 10;
    PlayersCount = 4
    private tittle_text:fgui.GObject=null

    private haveGuid:number[]=[]

    //匹配界面中，房间为可邀请玩家配置，在进入匹配界面后，若匹配邀请倒计时结束，则隐藏邀请玩家按钮
    private isTimeOutHideInvite:boolean=false;

    curData:pb.S2CMatchUpdate=null;

    get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }

    protected addEvents(): void 
    {
        Log.w("注册 S2CMatchUpdate ")
        this.addEvent(ProtoDef.pb.S2CMatchUpdate,this.OnS2CMatchUpdate);
        this.addEvent("OnExitMatch",this.OnExitMatch);
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
            resName : "GameMatchesView",
        }
        return path;
    }

    onLoad() {
        super.onLoad();
        this.ReFlashView()
        // this.show();
    }

    onDispose(): void {
        // Log.e(" onS2CMatchUpdate  ffffffff  清理  ")
        Manager.dataCenter.get(GameData).put(ProtoDef.pb.S2CMatchUpdate,null);
        window.clearInterval(this.timer_1);
        super.onDispose();
    }


    onFairyLoad(): void {
        this.haveGuid=[]
        this.close_btn = this.root.getChild("closeBtn").asButton; 
        this.tableList = this.root.getChild("n5").asList; 
        this.countDown_text = this.root.getChild("time");
        this.tittle_text= this.root.getChild("tittle");
        

        this.close_btn.onClick(this.OnClickExit, this);
        this.m_uCountDown =10;
        this.timer_1 = window.setInterval(this.UpdateCountDown.bind(this), 1000);
        this.SetCountDownText();
        this.InitView()

        //加载完成就播放
        let bgSpine = this.root.getChild("bgspine") as fgui.GLoader3D;
        Manager.utils.PlaySpine(bgSpine,"dt_pp","ani1","hall",()=>{

        },true)
        // Manager.utils.PlaySpine(bgSpine,"dt_pp","ani","hall",()=>{
        //     Manager.utils.PlaySpineOnly(bgSpine,"ani1",()=>{
        //         bgSpine.loop=true
        //     });
        // })

        let data = Manager.gd.get<{isInvite:true}>("GameMatchAutoInvite");
        if (data!=null&& data.isInvite) {
            Manager.gd.put("GameMatchAutoInvite",{isInvite:false});
            this.OnClickInvite()
        }
    }



    

    public show(): void {
        super.show();
    }




    OnExitMatch()
    {
        window.clearInterval(this.timer_1);
        this.Reset();
        // this.hide();
        Manager.uiManager.hide(GameMatches);
        if(Manager.gd.isPlayerInGameView()){
            dispatch(GameEvent.EnterBundle,Config.BUNDLE_HALL);
        }else{
            let tab = Manager.gd.get<pb.S2CGetTables>(ProtoDef.pb.S2CGetTables);
            if(tab == null){
                return;
            }
            if(tab.quick){
                dispatch(GameEvent.Silent_GO_HALL,"GameMatches.OnExitMatch");
            }
        }
    }

    public UpdateCountDown() {
        if ( this.m_uCountDown > 0) {
            this.m_uCountDown = this.m_uCountDown- 1;
            this.SetCountDownText();

            
        }
        else
        {
            this.m_uCountDown =10
            if (this.curData.inviteable && this.curData.state== 2 ) 
            {
                this.isTimeOutHideInvite=true;
                for (let index = 0; index < this.playersArr_gc.length; index++) {
                    this.playersArr_gc[index].getChild("inviteBtn").visible =false;
                }
            }

        }
    }


    public SetCountDownText() 
    {
        if (this.countDown_text!=null) 
        {
            this.countDown_text.text =  String.format("{0}",this.m_uCountDown) ;
        }
    }


    /** 点击退出匹配 */
    OnClickExit() 
    {
        this.service.exitMatch();
    }
  





    InitView()
    {
        if (this.PlayersCount==3) 
        {
            this.tableList.columnGap=54 //纵队间距
        }
        else
        {
            this.tableList.columnGap=54
        }
        this.tableList.removeChildrenToPool();
        for (let index1 = 0; index1 < this.PlayersCount; index1++) 
        {
            let item = this.tableList.addItemFromPool().asCom;
            let indexWz = (index1+1)%4
            if (indexWz==0) {
                indexWz = 4
            }
            item.getChild("icon_zi").icon =fgui.UIPackage.getItemURL("hall","pipei_zs_"+ indexWz );
            this.playersArr_gc.push(item)
        }

    }

    ReFlashView()
    {
        let data = Manager.gd.get<pb.S2CMatchUpdate>(ProtoDef.pb.S2CMatchUpdate);
        this.OnS2CMatchUpdate(data)
    }


    OnS2CMatchUpdate(data:pb.S2CMatchUpdate)
    {
        Log.w(" OnS2CMatchUpdate  : ",data)
        this.curData = data;
        if (this.curData.state== 1 || this.curData.state== 2 ) //0 常规匹配 1 准备(可邀请) 2 邀请阶段
        {
            if (this.curData.state== 1) 
            {
                this.tittle_text.visible=false
            }
            else if (this.curData.state== 2) 
            {
                this.tittle_text.visible=true
            }
            this.m_uCountDown =this.curData.leftSec;
            this.SetCountDownText();    
        }
        else
        {
            this.m_uCountDown = 10;
            this.tittle_text.visible=false    
        }
       
        if (this.PlayersCount!= data.playerCount ) 
        {
            this.PlayersCount=data.playerCount;
            this.InitView()
        }
        this.Reset();
        this.tableList.visible =true;
        this.setListView(data.players);
        // this.logic.openGameList(obj.data.id,obj.data.name);
        if (data.players.length < data.playerCount && data.inviteable && !this.isTimeOutHideInvite ) //人没满的时候下一个没人的地方展示 邀请玩家按键 并且可以邀请的
        {
            this.playersArr_gc[data.players.length].getChild("inviteBtn").visible =true;
            this.playersArr_gc[data.players.length].getChild("inviteBtn").onClick(this.OnClickInvite, this);
        }



    }



    setListView(d: pb.IPlayer[]){

        for (let i = 0; i < d.length; i++) {
            const et = d[i];
            //新进来的先播放跳 
            let guid = d[i].guid
            let effSpine =  this.playersArr_gc[i].getChild("eff") as fgui.GLoader3D;
            effSpine.visible =true
            let aniNameenter="nv1"
            let aniloop="nv2"
            if (Number(et.attrs[PlayerAttr.PA_Gender] ) == 1 ) //男生
            {
                aniNameenter="nan1"
                aniloop="nan2"
            }
            if (!Manager.utils.JudgeIsHave(this.haveGuid,guid)) 
            {
                Manager.utils.PlaySpine(effSpine,"xlh",aniloop,"hall",()=>{
                    // Manager.utils.PlaySpineOnly(effSpine,aniloop,()=>{
                    //     effSpine.loop=true
                    // });
                },true)
            }
            this.playersArr_gc[i].getChild("inviteBtn").visible =false;


            // this.playersArr_gc[i].getChild("inviteBtn").onClick(this.OnClickInvite, this);
            
        }


        this.haveGuid=[]
        for (let i = 0; i < d.length; i++) 
        {
            this.haveGuid.push(d[i].guid)
        }


    }


    private OnClickInvite() 
    {
        Log.w("OnClickInvite 点击了邀请按钮 ")
        this.service.onC2SGetIdlePlayers(null);
        Manager.uiManager.openFairy({ type: InvitedPlayer, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.UI, name: "邀请好友" });
    }


    Reset()
    {
        if (this.playersArr_gc!= null) 
        {
            // Log.e("playersArr_gc  ",this.playersArr_gc.length)

            for (let index = 0; index < this.playersArr_gc.length; index++) 
            {
                this.playersArr_gc[index].getChild("eff").visible=false;
                this.playersArr_gc[index].getChild("inviteBtn").visible =false;
            }
        }
    }


    
}


