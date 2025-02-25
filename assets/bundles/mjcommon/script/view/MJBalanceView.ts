import GameData from "../../../../scripts/common/data/GameData";
import { AdFuncId, AdSdkType, CfgType, CommSubID, GameCat, GroupId, MahHPGOPerate } from "../../../../scripts/def/GameEnums";
import { RoomManager } from "../../../gamecommon/script/manager/RoomManager";
import { Tool } from "../../../gamecommon/script/tools/Tool";
import { CommonMJConfig } from "../Config/CommonMJConfig";
import { MJTool } from "../logic/MJTool";
import BlackGangCard from "./BlackGangCard";
import BuDianGangCard from "./BuDianGangCard";
import MJBalanceBillItem from "./MJBalanceBillItem";
import MJCard from "./MJCard";
import PengCard from "./PengCard";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";
import { Config, ViewZOrder } from "../../../../scripts/common/config/Config";
import MJManager from "../Manager/MJManager";
import { MJEvent } from "../Event/MJEvent";
import { GameService } from "../../../../scripts/common/net/GameService";
import InvitedPlayer from "../../../../scripts/common/fairyui/InvitedPlayer";
import ReFlashPosition from "../../../gamecommon/script/tools/ReFlashPosition";
import { MJC2SOperation } from "../net/MJC2SOperation";



export default class MJBalanceView   {

    private root : fgui.GComponent = null;
    private win_com :fgui.GComponent =null;
    private lose_com :fgui.GComponent =null;
    private close_btn:fgui.GButton =null;
    private inviteBtn_btn:fgui.GButton =null;
    private btn1_btn:fgui.GButton =null;
    private btn2_btn:fgui.GButton =null;
    private shareBtn_btn:fgui.GButton =null;

    private head_com :fgui.GComponent =null;
    private bigWin_obj :fgui.GObject =null;
    private selfName_text :fgui.GObject =null;
    private zhiwen_com:fgui.GComponent =null;
    

    private balanceResult_com :fgui.GComponent =null;
    private paixingHu_com :fgui.GComponent =null;
    private mjbillDetails_com :fgui.GComponent =null;
    





    private isUpBtn =false;
    private m_TimerArr:number[]=[];;
    private mjLiuShuiItemArr:Array<MJBalanceBillItem>=[];

    private des_obj :fgui.GObject=null;
    private m_GObjectPool: fgui.GObjectPool=null;

    private liushui_list:fgui.GList;
    private adaptiveBtns_com :fgui.GComponent =null;

    selfData :pb.IMahInningResult=null
    private reFlashNextInvite_SC:ReFlashPosition=null;



    get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }

    public constructor(root : fgui.GComponent) 
    {
        this.root =root;
        this.setInit();
    }



    setInit()
    {
        this.root.makeFullScreen();
        this.m_GObjectPool =new fgui.GObjectPool();
        // Log.d("MJBalanceView  onBind setInit ffffffff  : ",   this.root );
        this.win_com= this.root.getChild("win").asCom;
        this.lose_com= this.root.getChild("lose").asCom;
        this.close_btn= this.root.getChild("closeBtn").asButton;
        this.inviteBtn_btn= this.root.getChild("inviteBtn").asButton;
        this.inviteBtn_btn.text = "邀请玩家游戏"

        this.adaptiveBtns_com =  this.root.getChild("AdaptiveBtns").asCom;

        
        this.btn1_btn= this.adaptiveBtns_com.getChild("Btn1").asButton;
        this.btn2_btn= this.adaptiveBtns_com.getChild("Btn2").asButton;
        this.btn2_btn.text = "再来一局"

        this.shareBtn_btn= this.root.getChild("shareBtn").asButton;
        
        this.bigWin_obj =this.root.getChild("bigWin");
        this.selfName_text =this.root.getChild("name");
        this.zhiwen_com= this.root.getChild("mask").asCom;

        this.balanceResult_com= this.root.getChild("balanceResult").asCom;
        this.mjbillDetails_com= this.root.getChild("mjbillDetails").asCom;
        this.liushui_list = this.mjbillDetails_com.getChild("liushui").asList;

        this.head_com= this.root.getChild("head").asCom;

        this.paixingHu_com= this.balanceResult_com.getChild("paixingHuItem").asCom;


        this.liushui_list.on(fgui.Event.SCROLL,()=>{
            this.HideAllItemDetail()
        },this)
        
        this.BindEvent();
        this.SetActiveBalance(false);

        this.reFlashNextInvite_SC = new ReFlashPosition (this.adaptiveBtns_com,150);


        this.setUISwitches();

    }
    
    setUISwitches()
    {
        this.shareBtn_btn.visible=true;
        let uiconfig = Manager.gd.get<pb.S2CUISwitches>(ProtoDef.pb.S2CUISwitches);
        if(uiconfig == null || uiconfig.items == null){
            return;
        }
        if(uiconfig.items["game_share"] == null || uiconfig.items["game_share"] == 0)
        {
            this.shareBtn_btn.visible=false;
        }
    }


    BindEvent() 
    {
        Manager.dispatcher.add("MJBalanceBillHide", this.HideAllItemDetail, this);
        Manager.dispatcher.add("MJBalanceSetMoreDes", this.MJBalanceSetMoreDes, this);


        this.close_btn.onClick(this.ClickQuiuGame,this  )
        this.inviteBtn_btn.onClick(this.ClickInviteBtnGame,this  )
        this.btn1_btn.onClick(this.ClickDoubleRewardBtn,this  )
        this.btn2_btn.onClick(this.ClickNextRoundGameBtn,this  )
        this.shareBtn_btn.onClick(this.ClickShareGameBtn,this  )

        // this.zhiwen_com.draggable = true;
        this.zhiwen_com.on(fgui.Event.TOUCH_BEGIN, this.onTouchStart, this);
        this.zhiwen_com.on(fgui.Event.TOUCH_END, this.onTouchEnd, this);
        
        this.balanceResult_com.getChild("billBtn").onClick(()=>{
            this.SetActiveBalanceResult(false)
            this.SetActiveBillDetails(true)
        },this  )
        this.mjbillDetails_com.getChild("resultbtn").onClick(()=>{
            this.SetActiveBalanceResult(true)
            this.SetActiveBillDetails(false)
        },this  )

    }






    RemoveEvent()
    {
        Manager.dispatcher.remove("MJBalanceBillHide", this);
        Manager.dispatcher.remove("MJBalanceSetMoreDes", this);

    }

    /** 退出游戏 */
    ClickQuiuGame(ClickQuiuGame: any, arg1: this) 
    {
        // Log.e("  退出游戏  ");
        this.SetActiveBalance(false)
        dispatch(MJEvent.SETACTIVENEXTGAMEMJ,true)
        dispatch(MJEvent.SETACTIVEINVITEBTN,false)

        let dataTab =  Manager.dataCenter.get(GameData).get<pb.S2CGetTables >(ProtoDef.pb.S2CGetTables);
        let tablecfgId = RoomManager.tableCommon.tablecfgId
        let inviteable = RoomManager.tableCommon.inviteable
        // Log.e("房间列表信息没有找到 dataTab  :  ",dataTab);
        if(dataTab != null){
            Log.e("房间列表信息没有找到");
            for (let i = 0; i < dataTab.tables.length; i++) 
            {
                for (let c = 0; c < dataTab.tables[i].items.length; c++) 
                {
                    let et = dataTab.tables[i].items[c]
                    if (et.cfgId== tablecfgId && et.inviteable && !inviteable )
                    {
                        let uiconfig = Manager.gd.get<pb.S2CUISwitches>(ProtoDef.pb.S2CUISwitches);
                        if(uiconfig == null || uiconfig.items == null){
                            return;
                        }
                        if(uiconfig.items["game_share"] == null || uiconfig.items["game_share"] == 0)
                        {

                        }
                        else
                        {
                            dispatch(MJEvent.SETACTIVEINVITEBTN,true)
                        }

                    }
                }
            }
        }


        

        
    }


    /** 点击下一局游戏  先用道具  */
    ClickNextRoundGameBtn() 
    {
        Log.e("  点击下一局游戏  ");
        let tempData ={gameType:RoomManager.tableCommon.gameType,cfgId:RoomManager.tableCommon.tablecfgId,func:RoomManager.NextMatch,isInGame:true}
        Manager.gd.put("EnterGamePropData",tempData);
        this.service.onC2SHasPoChan(RoomManager.tableCommon.gameType,RoomManager.tableCommon.tablecfgId)
    }

    

    /** 邀请游戏 */
    ClickInviteBtnGame() 
    {
        let tempData ={gameType:RoomManager.tableCommon.gameType,cfgId:RoomManager.tableCommon.tablecfgId,func:this.InviteBtnGame,isInGame:true}
        Manager.gd.put("EnterGamePropData",tempData);
        this.service.onC2SHasPoChan(RoomManager.tableCommon.gameType,RoomManager.tableCommon.tablecfgId)
    }

    //邀请的时候 
    InviteBtnGame()
    {
        Log.e("  InviteBtnGame!!!!!!!  ");
        Manager.gd.put("GameMatchAutoInvite",{isInvite:true});
        RoomManager.NextMatch();

        // let inviteable = RoomManager.tableCommon.inviteable
        // if (inviteable) 
        // {
            // this.service.onC2SGetIdlePlayers(null);
            // Manager.uiManager.openFairy({ type: InvitedPlayer, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.UI, name: "邀请好友" });
            
        // }
        // else
        // {

            // MJC2SOperation.C2SMjZhunBei();
        // }



    }


    /** 2倍奖励 看广告 免输 */
    ClickDoubleRewardBtn() 
    {
        Log.e("  2倍奖励看广告 或者免输  ");
        // type Packet = typeof pb.AdData;
        // let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.AdData);
        // let packet = new Packet();
        // packet.sdkType=AdSdkType.AdSdkType_Ylh
        // packet.intParam =RoomManager.roomcfgId
        // packet.funcId =AdFuncId.Ad_NoLoseWinMore
        // this.service.c2SAdEnd(packet,null);

        let adFuncId="Ad_NoLose"
        if (this.selfData!=null) 
        {
            if (this.selfData.coin >= 0) 
            {
                adFuncId="Ad_WinMore"
            } 
            else 
            {
                adFuncId="Ad_NoLose"
            }
        }
        let jsonData={adname:"",parms1:"",parms2:""}
        jsonData.adname=adFuncId;
        jsonData.parms1="";
        jsonData.parms2="";
        Manager.adManeger.WatchAds(jsonData,()=>{
            if (!Manager.platform.isAdOpen() ) {
                this.service.OnC2SNoLoseWinMore();
            }
            this.SetActiveLookGGBtn(false);
        })


    }
    

    
    /** 分享游戏 */
    ClickShareGameBtn() 
    {
        Log.e("  点击分享游戏  游戏当前截图发给玩家 ");
        Manager.platform.ShareToWxPic("true");

    }
    
    /** 长按查看牌桌 */
    onTouchStart() 
    {
        // Log.e("  长按查看牌桌  ");
        this.isUpBtn =true;
        let timerItem=  window.setTimeout(()=>
        {
            if (this.isUpBtn) 
            {
                // Log.e("  长按查看牌桌   0001  ");
                this.root.alpha=0
            }
        } , 500);
        
        this.m_TimerArr.push(timerItem)
    }
        
    onTouchEnd() 
    {
        // Log.e("  松手了  ");
        this.isUpBtn =false;
        this.root.alpha=1
    }
        
    
    SetMianShuYingFanbei()
    {

        let cfg = Manager.gd.get<pb.S2CCfgs>(ProtoDef.pb.S2CCfgs);
        let mianShuTotal  = 0;
        let fanBeiTotal  = 0;
        let isShow=true;
        if(cfg != null){
            mianShuTotal = cfg.items[CfgType.CfgType_NoLoseTimes];  
            fanBeiTotal = cfg.items[CfgType.CfgType_WinMoreTimes];  
            let currentMianShuCount = Manager.gd.playerGV(GroupId.GI_Comm ,CommSubID.CommSubID_NoLoseTimes,0);
            let currentFanBeiCount = Manager.gd.playerGV(GroupId.GI_Comm ,CommSubID.CommSubID_WinMultipleTimes,0);
            if (this.selfData.coin > 0 && currentFanBeiCount >=fanBeiTotal ) 
            {
                isShow =false;
            }
            else if (this.selfData.coin < 0 && currentMianShuCount >=mianShuTotal ) 
            {
                isShow =false;
            }
        }
        this.SetActiveLookGGBtn(isShow);
    }
    

    /** 麻将结算数据刷新 */
    onS2CMahInningResult(data: pb.S2CMahInningOverData )
    {
        this.SetActiveBalance(true)
        this.inviteBtn_btn.visible= false

        let dataTab =  Manager.dataCenter.get(GameData).get<pb.S2CGetTables >(ProtoDef.pb.S2CGetTables);
        let tablecfgId = RoomManager.tableCommon.tablecfgId
        let inviteable = RoomManager.tableCommon.inviteable
        // Log.e("房间列表信息没有找到 dataTab  :  ",dataTab);
        if(dataTab != null){
            Log.e("房间列表信息没有找到");
            for (let i = 0; i < dataTab.tables.length; i++) 
            {
                for (let c = 0; c < dataTab.tables[i].items.length; c++) 
                {
                    let et = dataTab.tables[i].items[c]
                    if (et.cfgId== tablecfgId && et.inviteable && !inviteable )
                    {
                        this.inviteBtn_btn.visible= true;
                        let uiconfig = Manager.gd.get<pb.S2CUISwitches>(ProtoDef.pb.S2CUISwitches);
                        if(uiconfig == null || uiconfig.items == null){
                            return;
                        }
                        if(uiconfig.items["game_share"] == null || uiconfig.items["game_share"] == 0)
                        {
                            this.inviteBtn_btn.visible=false;
                        }

                    }
                }
            }
        }


        let gd = Manager.dataCenter.get(GameData);
        this.head_com.getChild("icon").icon=gd.headUrl();
        




        for (let i = 0; i < data.result.length; i++) 
        {
            if (MJTool.PositionToDirection(data.result[i].index) == CommonMJConfig.Direction.Bottom ) 
            {
                this.selfData = data.result[i];
            }
        }
        this.bigWin_obj.visible = (this.selfData.coin == this.GetMaxScore(data) ) ;
        
        let playerData :pb.ITablePlayer =    RoomManager.GetPlayerByIndex(CommonMJConfig.Direction.Bottom)
        this.selfName_text.text = playerData.player.name;

        this.SetActiveLookGGBtn(this.selfData.coin != 0)

        if (this.selfData.coin >= 0) 
        {
            this.win_com.visible =true
            this.lose_com.visible =false
            this.btn1_btn.text = "双倍领取"
            MJTool.PlaySound(CommonMJConfig.SoundEffPath.Win, Config.BUNDLE_MJCOMMON);
        } 
        else 
        {
            this.btn1_btn.text = "看广告免输"
            this.win_com.visible =false
            this.lose_com.visible =true
            MJTool.PlaySound(CommonMJConfig.SoundEffPath.Lose, Config.BUNDLE_MJCOMMON);
        }
        this.SetActiveBalanceResult(true);
        this.SetActiveBillDetails(false);

        this.SetBalanceResultData( data,this.selfData);
        this.SetBillDetailsData(data);

        this.refreshDw();
        this.SetMianShuYingFanbei();


    }

    private refreshDw(){
        let bar = this.root.getChild("exp").asProgress;
        bar.visible = true;

        let gd = Manager.dataCenter.get(GameData);
        let gt = Manager.utils.gt(GameCat.GameCat_Mahjong);

        let score = gd.playerGV(GroupId.GI_SeasonScore,gt,0);
        let lv = gd.playerGV(GroupId.GI_SeasonDuanWei,gt,1);
        let dwData:pb.S2CGetSeasonDuanWeiCfg = Manager.dataCenter.get(GameData).get<pb.S2CGetSeasonDuanWeiCfg>(ProtoDef.pb.S2CGetSeasonDuanWeiCfg+"_"+gt);
        if(dwData == null){
            return;
        }
        let need = score;
        let cfgLevel = lv;
        if(lv >= dwData.items.length){
            cfgLevel = dwData.items.length - 1;
        }

        let conf = dwData.items[cfgLevel];
        need = conf.needScore;
        bar.min = 0;
        bar.max = need;
        bar.value = score;

        let hz = this.root.getChild("hz").asCom;
        // hz.getChild("tg").visible = false;
        // hz.getChild("tile").visible = false;
        // let iconId = Manager.utils.dwIcon(lv);
        // hz.getChild("n0").icon = fgui.UIPackage.getItemURL(Config.BUNDLE_HALL,"ui_rank_dw_di_"+iconId); 
        // let starCount = Math.floor(lv%5);
        // if(starCount == 0){
        //     starCount = 5;
        // }
        // Log.d("starCount:",starCount);

        let stars = this.root.getChild("star").asCom;
        // stars.visible = true;
        // for (let index = 0; index < stars._children.length; index++) {
        //     let star = stars.getChild("s"+index).asCom;
        //     if(index < starCount){
        //         star.getChild("star").visible = true;
        //     }else{
        //         star.getChild("star").visible = false;
        //     }
        // }

        Manager.utils.setHz(hz,stars,lv,dwData);
    }


    SetBillDetailsData(data: pb.S2CMahInningOverData) 
    {
        for (let i = 0; i < this.mjLiuShuiItemArr.length; i++) 
        {
            this.mjLiuShuiItemArr[i].Recle();
        }
        this.mjLiuShuiItemArr=[];

        
        this.liushui_list.removeChildrenToPool();

        let score_text= this.mjbillDetails_com.getChild("scoreText").asTextField
        let liushiData:pb.IMahLiuShui[] = data.liuShui

        if (liushiData.length == 0) 
        {
            score_text.font=fgui.UIPackage.getItemURL(Config.BUNDLE_GameCOMMON,"jiesuanShengFont");
            
            score_text.text ="0";
            
            return ;
        }
        let totalScore = 0 
        for (let  i= 0; i < data.liuShui.length; i++) 
        {
            let item: fgui.GComponent = this.liushui_list.addItemFromPool().asCom;
            let balanceBillItem = new MJBalanceBillItem(item);
            balanceBillItem.setData(i , data.liuShui[i])
            this.mjLiuShuiItemArr.push(balanceBillItem)
            totalScore = totalScore+ data.liuShui[i].coin
        }
        if (totalScore<0) 
        {
            score_text.font=fgui.UIPackage.getItemURL(Config.BUNDLE_GameCOMMON,"jiesuanFuFont");
        }
        else
        {
            score_text.font=fgui.UIPackage.getItemURL(Config.BUNDLE_GameCOMMON,"jiesuanShengFont");
        }

        this.mjbillDetails_com.getChild("scoreText").text = Manager.utils.formatCoin(totalScore) ;

        // Tool.PlayRunNum( this.mjbillDetails_com.getChild("scoreText"),0,totalScore,0.3,true)

    }

    HideAllItemDetail()
    {

        this.clearDesObj();
        // for (let i = 0; i < this.mjLiuShuiItemArr.length; i++) 
        // {
        //     // this.mjLiuShuiItemArr[i].SetActiveMoreNumDes(false);
        //     this.mjLiuShuiItemArr[i].SetActiveMore(false);
        // }
    }




    SetBalanceResultData(data: pb.S2CMahInningOverData, selfData: pb.IMahInningResult) 
    {

        let score_text= this.balanceResult_com.getChild("scoreText").asTextField
        if (selfData.coin<0) 
        {
            score_text.font=fgui.UIPackage.getItemURL(Config.BUNDLE_GameCOMMON,"jiesuanFuFont");
        }
        else
        {
            score_text.font=fgui.UIPackage.getItemURL(Config.BUNDLE_GameCOMMON,"jiesuanShengFont");
        }
        // score_text.text = Manager.utils.formatCoin(selfData.coin) ;

        Tool.PlayRunNum(score_text,0,selfData.coin,0.8,true)


        let hands_list =  this.paixingHu_com.getChild("handCards").asList;
        let pengGang_list =  this.paixingHu_com.getChild("pengGang").asList;
        let hucard_list =  this.paixingHu_com.getChild("HuCard").asList;

        hands_list.removeChildrenToPool();
        hucard_list.removeChildrenToPool();

        let handCardArr = Tool.Clone(selfData.mjs)
        MJManager.CardSortByLaiZiAndQue(handCardArr)
        // Log.w(" SetBalanceResultData   handCardArr ",handCardArr)

        for (let index = 0; index < handCardArr.length; index++) {
            let item: fgui.GButton = hands_list.addItemFromPool().asButton;
            let cardItem = new MJCard(item);
            cardItem.setInit(false)
            cardItem.SetCard(handCardArr[index],null)
        }


        let curType_load = this.root.getChild("currentType").asLoader
        if (selfData.hu!=null && selfData.hu.length > 0) 
        {
            
            //最大的胡牌类型胡的牌
            let item: fgui.GButton = hucard_list.addItemFromPool().asButton;
            let cardItem = new MJCard(item);
            cardItem.setInit(false)
            cardItem.SetCard(selfData.hu[0].mjId,null)
            
            cardItem.SetActiveHu(true)
            //最大牌型
            let dataItem = Tool.Clone(selfData.hu[0].type )
            MJTool.SortHuPaiTypeCenterHu(dataItem)
            let hutypeConfig = CommonMJConfig.HuTypeEffConfig[dataItem[0]]
            Log.w(" SetBalanceResultData   dataItem ",dataItem)
            Log.w(" SetBalanceResultData   hutypeConfig ",hutypeConfig)
            let strpath = hutypeConfig.huwin
            if (selfData.coin < 0 ) 
            {
                strpath = hutypeConfig.hulose
            } 
            let urlStr = fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON,strpath)
            curType_load.icon = urlStr
            curType_load.visible = true
        }
        else
        {
            curType_load.visible = false
        }



        //自己的服务器坐标
        let selfPos = selfData.index

        pengGang_list.removeChildrenToPool();
        for (let index = 0; index < selfData.pengGangs.length; index++) 
        {


            let type = selfData.pengGangs[index].type
            let card = selfData.pengGangs[index].mjId
            // Log.e(" SetBalanceResultData AltPath  card :   ", card  )

            if (type == MahHPGOPerate.HPG_Peng ) 
            {
                let url =  fgui.UIPackage.getItemURL("hall", CommonMJConfig.AltPath[0])



                // Log.e(" SetBalanceResultData AltPath  url :   ", url  )
                let obj=  pengGang_list.addItemFromPool(url)
                obj.visible=true;
                let cardItem = new PengCard(obj.asButton);
                // cardItem.setInit();
                let directionIndex = CommonMJConfig.AltOriTab[0][MJTool.AltPositionToDirection( selfData.pengGangs[index].fromIndex, selfPos)]
                cardItem.SetCard(card,directionIndex);
                cardItem.SetActiveToward(false)
            }
            else if (type == MahHPGOPerate.HPG_AnGang ) 
            {
                let url =  fgui.UIPackage.getItemURL("hall", CommonMJConfig.BlackCtrlsPath[0])
                // Log.e(" SetBalanceResultData AddBlackCtrlCard  url :   ", url  )
                let obj=  pengGang_list.addItemFromPool(url)
                obj.visible=true;
                let cardItem = new BlackGangCard(obj.asButton);
                // cardItem.setInit();
                cardItem.SetCard(card);
            }
            else if (type == MahHPGOPerate.HPG_DianGang || type == MahHPGOPerate.HPG_BuGang  ) 
            {
                let url =  fgui.UIPackage.getItemURL("hall", CommonMJConfig.BuDianGangPath[0])
                // Log.e(" SetBalanceResultData BuDianGangPath  url :   ", url  )
                let obj=  pengGang_list.addItemFromPool(url)
                obj.visible=true;
                let cardItem = new BuDianGangCard(obj.asButton);
                // cardItem.setInit();
                let directionIndex = CommonMJConfig.AltOriTab[0][MJTool.AltPositionToDirection( selfData.pengGangs[index].fromIndex, selfPos)]
                if (type == MahHPGOPerate.HPG_BuGang) 
                {
                    directionIndex = 5
                }
                cardItem.SetCard(card,directionIndex);
                cardItem.SetActiveToward(false)
            }

        }
        

        this.SetBalanceResultDataOthers( data)


    }

    /** 设置胡牌界面其他玩家的数据 */
    SetBalanceResultDataOthers(data: pb.S2CMahInningOverData) 
    {
        let otherplayers_list =  this.balanceResult_com.getChild("otherplayers").asList;
        otherplayers_list.removeChildrenToPool();
        let zuoweiStrArr = ["下家","对家","上家"];
        for (let i = 0; i < data.result.length; i++) 
        {
            let direct = MJTool.PositionToDirection( data.result[i].index ) ;
            if (direct != CommonMJConfig.Direction.Bottom ) 
            {
                let playerData :pb.ITablePlayer =    RoomManager.GetPlayerByIndex(direct)
                let item_com: fgui.GComponent = otherplayers_list.addItemFromPool().asCom;
                let gd = Manager.dataCenter.get(GameData);
                item_com.getChild("head").asCom.getChild("icon").icon=gd.playerheadUrl(playerData.player.portraits);
                item_com.getChild("name").text= playerData.player.name;
                item_com.getChild("zuoweiText").text= zuoweiStrArr[direct-1] ;
                item_com.getChild("pochanFlag").visible=data.result[i].bBankruptcy;

                let scoreDes = Manager.utils.formatCoin(data.result[i].coin)

                item_com.getChild("bigWin").visible = (data.result[i].coin == this.GetMaxScore(data) ) ;

                if (data.result[i].coin >= 0 ) 
                {
                    item_com.getChild("bglan").visible = false
                    item_com.getChild("bgred").visible = true
                    item_com.getChild("scoreText").text= String.format("[color=##ffff00]{0}[/color]",scoreDes );
                }
                else
                {
                    item_com.getChild("bglan").visible = true
                    item_com.getChild("bgred").visible = false
                    item_com.getChild("scoreText").text=String.format("[color=##0284DF]{0}[/color]",scoreDes );
                    
                }
            }
        }

    }



    
    GetMaxHu(selfData: pb.IMahInningResult)
    {
        let maxHu =0
        let maxHuData =null;
        for (let index = 0; index < selfData.hu.length; index++) 
        {
            if (selfData.hu[index] > maxHu  ) 
            {
                maxHuData =selfData.hu[index];
            }
        }
        return maxHuData;

    }


    GetMaxScore(data: pb.S2CMahInningOverData):number
    {
        let maxScore = 0
        for (let i = 0; i < data.result.length; i++) 
        {
            if ( data.result[i].coin > maxScore ) 
            {
                maxScore = data.result[i].coin;
            }
        }
        return maxScore ;
    }
    
   
    SetActiveBalance(isShow:boolean)
    {
        this.root.visible=isShow;
        
    }

    SetActiveBalanceResult(isShow:boolean)
    {
        this.balanceResult_com.visible=isShow;
    }

    SetActiveBillDetails(isShow:boolean)
    {
        this.mjbillDetails_com.visible=isShow;
    }


    GetActiveBalanceView():boolean
    {
       return this.root.visible
    }

    MJBalanceSetMoreDes(des:string, toGo:fgui.GButton)
    {
        this.clearDesObj();
        let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "moreDes")
        let posx = toGo.x+toGo.parent.x+toGo.parent.parent.x+(toGo.width/2)
        let posy = toGo.y+toGo.parent.y+toGo.parent.parent.y-toGo.height
        // let posx = toGo.x+toGo.parent.x+toGo.parent.parent.x+toGo.parent.parent.parent.x+(toGo.width/2)
        // let posy = toGo.y+toGo.parent.y+toGo.parent.parent.y+toGo.parent.parent.parent.y-toGo.height
        this.des_obj =   this.m_GObjectPool.getObject(url)
        this.mjbillDetails_com.addChild(this.des_obj)
        this.des_obj.visible =true;
        this.des_obj.x =posx
        this.des_obj.y =posy-this.liushui_list.scrollPane.posY
        this.des_obj.asCom.getChild("moredes").text =des;
    }




    SetActiveLookGGBtn(isShow:boolean)
    {
        if (this.btn1_btn!=null) {
            this.btn1_btn.visible =isShow;
        }
        this.reFlashNextInvite_SC.ReFlash()
    }



    clearDesObj()
    {
        if ( this.des_obj!=null) 
        {
            this.des_obj.dispose()
        }

        this.m_GObjectPool.clear();
    }

    ReSet ()
    {

        this.SetActiveBalance(false);
        this.StopCoroutineTweenAni();
    }


    /**
     * 移除掉所有的计时器
     */
     public StopCoroutineTweenAni()
     {
         if (this.m_TimerArr !=null ) 
         {
             //关掉所有的延迟函数
             for (let i = 0; i <this.m_TimerArr.length ; i++) 
             {
                 if ( this.m_TimerArr[i]!=null) {
                     clearTimeout( this.m_TimerArr[i])
                     this.m_TimerArr[i]=null;
                 }
             }
             this.m_TimerArr=[];
         }
 
 
     }




}


