import { Config } from "../../../../scripts/common/config/Config";
import GameData from "../../../../scripts/common/data/GameData";
import { GameEvent } from "../../../../scripts/common/event/GameEvent";
import GameMatches from "../../../../scripts/common/fairyui/GameMatches";
import { GameService } from "../../../../scripts/common/net/GameService";
import { MahColor, MahHPGOPerate, MahHu, MahPlayerState, MahQiangGangState, MahTableStage, PlayerAttr } from "../../../../scripts/def/GameEnums";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";
import GameView from "../../../../scripts/framework/core/ui/GameView";
import PropUse from "../../../gamecommon/script/logic/PropUse";
import RoomPlayersBehaviour from "../../../gamecommon/script/logic/RoomPlayersBehaviour";
import RoomView from "../../../gamecommon/script/logic/RoomView";
import { RoomManager } from "../../../gamecommon/script/manager/RoomManager";
import { Tool } from "../../../gamecommon/script/tools/Tool";
import { CommonMJConfig } from "../../../mjcommon/script/Config/CommonMJConfig";
import { MJEvent } from "../../../mjcommon/script/Event/MJEvent";
import { MJTool } from "../../../mjcommon/script/logic/MJTool";
import MJDispose from "../../../mjcommon/script/Manager/MJDispose";
import MJManager from "../../../mjcommon/script/Manager/MJManager";
import { MJC2SOperation } from "../../../mjcommon/script/net/MJC2SOperation";
import CMJPlayers from "../../../mjcommon/script/view/CMJPlayers";
import MjGameView from "../../../mjcommon/script/view/MjGameView";
import MJHeadPlayers from "../../../mjcommon/script/view/MJHeadPlayers";
import Mjmiddle from "../../../mjcommon/script/view/Mjmiddle";
import MjPanel from "../../../mjcommon/script/view/MjPanel";
import { XLThreeTwoMJLogic } from "../logic/XLThreeTwoMJLogic";
import mjXLThreeTwocplayers from "./mjXLThreeTwocplayers";
import RuleXLThreeTwo from "./RuleXLThreeTwo";




const { ccclass, property } = cc._decorator;

@ccclass
export default class XLThreeTwoMJView extends GameView {

    ReS2CMahTestMsgGC :fgui.GComponent =null;
    _input : fgui.GTextInput;

    private mjmiddleGC:fgui.GComponent = null;
    public mjmiddleSC:Mjmiddle = null;
    public mjGameViewSC:MjGameView = null;
    public mjcplayersSC:CMJPlayers = null;
    public mjXLThreeTwocplayersSC:mjXLThreeTwocplayers = null;
    public roomPlayersBehaviourSC:RoomPlayersBehaviour = null;
    public mjPanelSC:MjPanel = null;
    public roomViewSC:RoomView = null;
    public mjHeadPlayersSC:MJHeadPlayers = null;

    
    public ruleXLThreeTwoSC:RuleXLThreeTwo = null;


    //计时器工具
    timer_1: number;


    // PlayersHeadTable={};
    // PlayersHeadTable:{};


    fengDing = {
        [0] : "不封顶",
        [1] : 16,
        [2] : 32,
        [3] : 64,
        [4] : 128,
        [5] : 256,
        [6] : 512,
    }
    m_tipsTimer: number;
    m_TimerArr:number[]=[];



    specalEff = [
        MahHu.Hu_JiuLianBaoDeng,
        MahHu.Hu_LongQiDui,
        MahHu.Hu_SanAnKe,
        MahHu.Hu_SanJieGao,
        MahHu.Hu_ShiBaLuoHan,
        MahHu.Hu_ShiErJinChai,
        MahHu.Hu_SiAnKe,
        MahHu.Hu_QuanYaoJiu,
        MahHu.Hu_QingYiSe,

        MahHu.Hu_YaoJiu,
        MahHu.Hu_QuanZhong,
        MahHu.Hu_QuanDa,
        MahHu.Hu_QuanXiao,
        MahHu.Hu_DaYuWu,
        MahHu.Hu_XiaoYuWu,
        MahHu.Hu_ShouZhongBaoYi,
        MahHu.Hu_WuXingBaGua,
        MahHu.Hu_MiaoShouHuiChun,
        MahHu.Hu_TianHu,
        MahHu.Hu_DiHu,
        MahHu.Hu_SiJieGao,
        MahHu.Hu_HaiDiLaoYue,
        MahHu.Hu_GangShangHua,
        MahHu.Hu_ShuangLongQiDui,
        MahHu.Hu_SanLongQiDui,
        MahHu.Hu_LianQiDui,
        
        MahHu.Hu_WuHuSiHai,
        MahHu.Hu_TianLongBaBu,
        MahHu.Hu_XianHeZhiLu,
        MahHu.Hu_KaiMenJianShan,
        MahHu.Hu_ChangEBengYue,
        MahHu.Hu_BaiNiaoChaoFeng,
        MahHu.Hu_YouRenYouYu,
        MahHu.Hu_YiTongJiangShan,
        MahHu.Hu_DianDaoQianKun,
        MahHu.Hu_JiuWuZhiZun,
        MahHu.Hu_ShiQuanShiMei,
        

    ]
    btnTest: fairygui.GObject;



    public static getPrefabUrl() {
        return "prefabs/MjThreeTwoView";
    }

    static getViewPath(): ViewPath {
        // console.error(new Error().stack);
        let path : ViewPath = {
            	/**@description 资源路径 creator 原生使用*/
            assetUrl: "ui/threeTwomj",
            /**@description 包名称 fgui 使用*/
            pkgName : "threeTwomj",
            /**@description 资源名称 fgui 使用*/
            resName : "MjThreeTwoView",
        }
        return path;
    }
    
    static logicType = XLThreeTwoMJLogic;

    public get logic(): XLThreeTwoMJLogic | null {
        return this._logic as any;
    }

    private onClick(ev: cc.Event.EventTouch) {
        this.enterBundle((ev.target as cc.Node).userData);
    }

    protected get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }


    onLoad() {
        super.onLoad();
        // this.bindHead();
        // this.bindProperty();
        // this.refreshUI();

        
    }

    


    onFairyLoad(): void {

        // Log.e(" Manager.utils.formatCoinLoseWin 0   ",Manager.utils.formatCoinLoseWin( 1 ))
        // Log.e(" Manager.utils.formatCoinLoseWin 1   ",Manager.utils.formatCoinLoseWin( 12 ))
        // Log.e(" Manager.utils.formatCoinLoseWin 2   ",Manager.utils.formatCoinLoseWin( 123 ))
        // Log.e(" Manager.utils.formatCoinLoseWin 3   ",Manager.utils.formatCoinLoseWin( 1234 ))
        // Log.e(" Manager.utils.formatCoinLoseWin 4   ",Manager.utils.formatCoinLoseWin( 12345 ))
        // Log.e(" Manager.utils.formatCoinLoseWin 5   ",Manager.utils.formatCoinLoseWin( 123456 ))
        // Log.e(" Manager.utils.formatCoinLoseWin 6   ",Manager.utils.formatCoinLoseWin( 1234567 ))
        // Log.e(" Manager.utils.formatCoinLoseWin 7   ",Manager.utils.formatCoinLoseWin( 12345678 ))

        let startTime:number = Manager.utils.milliseconds;

        Manager.gd.LocalPosition = "XLThreeTwoMJView";
        this.enableFrontAndBackgroundSwitch = true;

        // let num = 454545
        // let str =  Tool.GetPreciseDecimal(num/10000,1)+"万"
        // Log.e(" ffffffff str ", str ) 

        // this.root.onClick(function(){
        //     function ff(params:boolean) {
        //         Log.d("Manager.alert ff",params);
        //         if (params){
                 
        //         }else{
        //             Manager.tips.show("测试关闭");
        //         }
        //     }
    
        //     let cf:AlertConfig={
        //         // immediatelyCallback : true,
        //         title:"提示",
        //         text: "测试",   
        //         confirmCb: ff.bind(this),        
        //         cancelCb: ff.bind(this),
     
        //     };
        //     Manager.alert.show(cf);
        // }.bind(this),this);

        this.ReS2CMahTestMsgGC = this.root.getChild("ReS2CMahTestMsg").asCom;
        this.ReS2CMahTestMsgGC.getChild("n1").onClick(this.OnReS2CMahTestMsg,this);

        this._input =  this.ReS2CMahTestMsgGC.getChild("input").asTextInput

        if(Manager.platform.isTestPkg()){
            this.ReS2CMahTestMsgGC.visible = true;
        }else{
            this.ReS2CMahTestMsgGC.visible = false;
        }

        this.ruleXLThreeTwoSC = new RuleXLThreeTwo ();
        this.ruleXLThreeTwoSC.Init(this,"rule");



        this.mjGameViewSC = new MjGameView ();
        this.mjGameViewSC.Init(this);
        this.mjGameViewSC.setInit(this.root);

        this.mjmiddleGC = this.root.getChild("middle").asCom;

        this.mjmiddleSC = new Mjmiddle();
        this.mjmiddleSC.Init(this,"middle");
        this.mjmiddleSC.setInit();
        

        this.mjPanelSC = new MjPanel();
        this.mjPanelSC.Init(this,"mjView");
        this.mjPanelSC.setInit();

        this.roomViewSC = new RoomView();
        this.roomViewSC.Init(this,"roomView");
        this.roomViewSC.SetPropUse(new PropUse(this.root.getChild("propUseView").asCom));

        


        this.roomPlayersBehaviourSC = new RoomPlayersBehaviour();
        this.roomPlayersBehaviourSC.Init(this,"players");
        this.roomPlayersBehaviourSC.setInit();

        this.mjHeadPlayersSC = new MJHeadPlayers();
        this.mjHeadPlayersSC.Init(this,"players");
        this.mjHeadPlayersSC.setInit();


        this.mjcplayersSC = new CMJPlayers();
        this.mjcplayersSC.Init(this,"mjPlayers");
        this.mjcplayersSC.setInit();

        this.mjXLThreeTwocplayersSC = new mjXLThreeTwocplayers();
        this.mjXLThreeTwocplayersSC.Init(this,"mjPlayers");
        this.mjXLThreeTwocplayersSC.setInit();

        //#region 給各个组件 传参数进入方便调用 必须在赋值之后在去设置
        this.mjGameViewSC.SetRoomViewSC(this.roomViewSC)
        this.mjGameViewSC.SetRoomPlayersBehaviourSC(this.roomPlayersBehaviourSC)
        this.mjGameViewSC.SetMjmiddleSC(this.mjmiddleSC)
        this.mjGameViewSC.SetmjcplayersSC(this.mjcplayersSC)
        this.mjGameViewSC.SetMjPanelSC(this.mjPanelSC)
        this.mjGameViewSC.SetMJHeadPlayersSC(this.mjHeadPlayersSC)

    

        this.mjXLThreeTwocplayersSC.SetCMJPlayer(CommonMJConfig.Direction.Bottom ,this.mjcplayersSC.GetMJCMJPlayer(CommonMJConfig.Direction.Bottom))
        this.mjXLThreeTwocplayersSC.SetCMJPlayer(CommonMJConfig.Direction.Right ,this.mjcplayersSC.GetMJCMJPlayer(CommonMJConfig.Direction.Right))
        this.mjXLThreeTwocplayersSC.SetCMJPlayer(CommonMJConfig.Direction.Top ,this.mjcplayersSC.GetMJCMJPlayer(CommonMJConfig.Direction.Top))
        this.mjXLThreeTwocplayersSC.SetCMJPlayer(CommonMJConfig.Direction.Left ,this.mjcplayersSC.GetMJCMJPlayer(CommonMJConfig.Direction.Left))
        Log.d("XLThreeTwo onFairyLoad ","use time :",Manager.utils.milliseconds-startTime);


        startTime = Manager.utils.milliseconds;
        this.iniDate();
        Log.d("XLThreeTwo onFairyLoad iniDate","use time :",Manager.utils.milliseconds-startTime); 



        Manager.globalAudio.playMusic("audio/XLThreeTwo_bgm",Config.BUNDLE_XLThreeTwo,true);
    }


    protected onEnterForgeground(inBackgroundTime: number) {
        Log.d("重连请求 ",inBackgroundTime);
        if (RoomManager.GetRoomState() != RoomManager.StateType.Resulting) {
            Log.d("重连请求 没在结算中 ");
            this.StopCoroutineTweenAni()
            //从后台返回刷新数据
            this.logic.syncState();
        }
    }

    protected addEvents() {
        // Log.w(" XLThreeTwoMJView   addEvents   ");

        this.addEvent(MJEvent.ONS2CMAHHPGRESULT, this.OnS2CMahPGResult);
        this.addEvent(GameEvent.EnterBundle, this.enterBundle);
        this.addEvent(MJEvent.ONRECONNECTGAMEDATA, this.OnReconnectGameData);
        this.addEvent(MJEvent.INITMJ, this.InitMJ);
        this.addEvent(MJEvent.HU_CARD, this.OnHuCard);
        this.addEvent(MJEvent.RESET_CARDS, this.OnResetCards);
        this.addEvent(MJEvent.MJPLAYSOUNDCARD, this.PlayCardSound);
        this.addEvent(MJEvent.SETLAIZI, this.SetLaiZi);
        this.addEvent("ClickWanFa", this.ClickWanFa);
        this.addEvent(ProtoDef.pb.S2CExitTable, this.onS2CExitTable);

        

    }

    onS2CExitTable(data:pb.S2CExitTable){
        if(data.guid == Manager.gd.player().guid){
            // this.StopCoroutineTweenAni();
            // this.onDestroy();
            //自己出去游戏的时候直接去大厅 数据清空 队列清空
            Manager.gd.put(ProtoDef.pb.S2CGoOnGame,null);
            this.logic.ClearMessageQuaue()
            return;
        }
        let direct = RoomManager.GetPlayerClientPosByGuid(data.guid);
        this.roomPlayersBehaviourSC.ReSetOnePlayer(direct);

        
    }


    onDispose(): void {
        this.StopCoroutineTweenAni();
        this.mjGameViewSC.RemoveEvent()
        this.mjmiddleSC.RemoveEvent()
        this.mjPanelSC.RemoveEvent()
        this.mjcplayersSC.RemoveEvent()
        this.roomViewSC.RemoveEvent()
        this.roomPlayersBehaviourSC.RemoveEvent();
        this.removeEvent(GameEvent.RefreshGameTable);
        this.removeEvent(MJEvent.ONS2CMAHHPGRESULT);
        this.removeEvent(GameEvent.EnterBundle);
        this.removeEvent(MJEvent.INITMJ);
        this.removeEvent(MJEvent.HU_CARD);
        this.removeEvent(MJEvent.RESET_CARDS);
        this.removeEvent(MJEvent.MJPLAYSOUNDCARD);
        this.removeEvent(MJEvent.SETLAIZI);
        this.removeEvent("ClickWanFa");
        this.removeEvent(ProtoDef.pb.S2CExitTable);
        super.onDispose();
    }

    onDestroy() {
        super.onDestroy();
    }


    PlayCardSound(cardId : number , isMan:boolean  )
    {
        let pathArr = CommonMJConfig.MahjongID[cardId].Soundxlhz
        let intRodom = Tool.GetRandomNum(1,pathArr.length);
        // Log.e (" PlaySound  intRodom  "+intRodom   );
        let name = pathArr[intRodom-1]
        let buddleName = Config.BUNDLE_MJCOMMON
        // Log.e(" PlaySound name  ",name)
        if (isMan) 
        {
            Manager.globalAudio.playEffect("audio/man/"+name,buddleName);
        }else
        {
            Manager.globalAudio.playEffect("audio/women/"+name,buddleName);
        }
    }

    /** 自己游戏的玩法处理 */
    ClickWanFa() 
    {
        Log.w ("血流红中玩法处理")
        
        this.ruleXLThreeTwoSC.SetActiveRule(true)

    }

    // SetMjOutCardHPTS() 
    // {
        
    // }
    // SetMjXiaJiaoTiShi() 
    // {
        
    // }

    // PlayCardSound() 
    // {
        
    // }

    // SetInitCardShowHuTip() 
    // {
        
    // }
    // SetMJHuTip() 
    // {
        
    // }
    // SetRuleDes() 
    // {
        
    // }
    // OnMjDingQueResultQueue()
    // {
        
    // }
    // OnMjMoPai() 
    // {
        
    // }
    // OnMjOperateCardResultQueue() 
    // {
        
    // }
    // OnMjBigResult()
    // {
        
    // }


    iniDate()
    {

        CommonMJConfig.LimitColour = false
        CommonMJConfig.IsCanShowQue = true
        CommonMJConfig.IsCanPickOutLai = true
        CommonMJConfig.IsCanShowLai = true
        CommonMJConfig.IsCanShowLaiBg = false
        CommonMJConfig.AlreadyHuShowTip = true
        CommonMJConfig.ISBei = true
        CommonMJConfig.IsQueShowMask = true
        CommonMJConfig.HaveColorArr=[MahColor.CL_Tong,MahColor.CL_Tiao]

        this.OnReconnectGameData();
        this.service.onC2SUILoaded();

    }


    /** 碰杠结果 */
    OnS2CMahPGResult( dataAll:{data: pb.S2CMahPGResult,endFun:()=>{}} )
    {
        let data =dataAll.data;
        Log.w( " 血流红中 碰杠结果 OnS2CMahPGResult  data : ",  data  )
        
        if (MJTool.PositionToDirection(data.index) == CommonMJConfig.Direction.Bottom) 
        {
            this.mjPanelSC.SetActiveMJTipDeng(false);
            this.mjPanelSC.SetActiveHuTipContent(false);
            this.mjPanelSC.HideAllHandleAndSelectGang();
            // dispatch(MJEvent.HIDE_ALL_HANDLE_BTN);
        }
        

        let typeNum = data.pg.type
        let isTiBuGangOp = (typeNum == MahHPGOPerate.HPG_BuGang);
        if (typeNum == MahHPGOPerate.HPG_Peng ) 
        {
            this.OnPengCardQueue(dataAll)
        } 
        else if (typeNum == MahHPGOPerate.HPG_DianGang || typeNum == MahHPGOPerate.HPG_BuGang || typeNum == MahHPGOPerate.HPG_AnGang ) 
        {
            this.OnGangCardQueue(dataAll)
        }

        //自己碰杠之后先设置 提示关闭
        if (MJTool.PositionToDirection(data.index) == CommonMJConfig.Direction.Bottom) 
        {

        }
        else
        {
            //抢提胡和抢杠胡的时候不能关掉
            if (isTiBuGangOp && ! CommonMJConfig.AlreadyHu) 
            {
                dispatch(MJEvent.HIDE_HANDLE_OTHERHU);
            } 
            else 
            {
                dispatch(MJEvent.HIDE_ALL_HANDLE_BTN);
            }
        }
    }


    /** 碰牌成功 */
    OnPengCardQueue(dataAll: { data: pb.S2CMahPGResult; endFun: () => {}; }) 
    {
        let data =dataAll.data;
        let pengDirect = MJTool.PositionToDirection(data.index);
        let removeTable:number[] = [];
        let cardId = data.pg.mjId
        let playerData =    CommonMJConfig.MJMemberInfo[data.index] as pb.IMahPlayerData
        
        if (data.pg.qiangType == MahQiangGangState.QGS_Normal ) 
        {
            if (pengDirect == CommonMJConfig.Direction.Bottom) 
            {
                let mineCards = CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom];
                mineCards[cardId] = mineCards[cardId] - 2;
                removeTable = [cardId,cardId];
                // CommonMJConfig.MineHandleCardsPeng.push(cardId)
                dispatch(MJEvent.HIDE_ALL_HANDLE_BTN);
            } 
            else 
            {
                if (playerData.bMingPai) 
                {
                    CommonMJConfig.PlayerCardsInfo[pengDirect][cardId] = CommonMJConfig.PlayerCardsInfo[pengDirect][cardId]-2
                    removeTable=[cardId,cardId]
                    CommonMJConfig.AllCards[cardId] = CommonMJConfig.AllCards[cardId] - 2;
                }
                else
                {
                    CommonMJConfig.PlayerCardsInfo[pengDirect][0] = CommonMJConfig.PlayerCardsInfo[pengDirect][0]-2
                    removeTable=[0,0]
                    CommonMJConfig.AllCards[cardId] = CommonMJConfig.AllCards[cardId] - 2;
                }
            }
            let playerDataTab :pb.ITablePlayer =    RoomManager.GetPlayerByIndex(pengDirect)
            if (  Number(playerDataTab.player.attrs[PlayerAttr.PA_Gender] ) == 1 ) //男
            {
                MJTool.PlaySound(CommonMJConfig.SoundEffPath.PengMan, Config.BUNDLE_MJCOMMON); 
            }
            else
            {
                MJTool.PlaySound(CommonMJConfig.SoundEffPath.PengWomen, Config.BUNDLE_MJCOMMON); 
            }

            this.mjcplayersSC.ShowPGHEffect(pengDirect,CommonMJConfig.HandleTag.Peng);
            // this,this.mjcplayersSC.RemoveHandCards(pengDirect,removeTable,1,2)
            // this.mjcplayersSC.HandsToPick(pengDirect)

            // if (pengDirect == CommonMJConfig.Direction.Bottom) 
            // {
            //     MJDispose.SetSelfMoCard(0) // 没必要我能碰牌一定是打过牌 或者胡过牌
            // }
            //暂时直接刷新牌
            this.mjcplayersSC.ReFalshCardView(pengDirect);
            this.mjcplayersSC.RemoveLastOutCard(MJTool.PositionToDirection(data.pg.fromIndex));

            //算出碰的牌的朝向
            let directionIndex = CommonMJConfig.AltOriTab[pengDirect][MJTool.AltPositionToDirection(data.pg.fromIndex, data.index)]
            Log.e(" OnPengCardQueue  directionIndex : ",directionIndex )
            if (pengDirect == CommonMJConfig.Direction.Bottom) //自己碰后可以出牌
            {
                MJDispose.SetState(CommonMJConfig.MineCardState.Play)
                this.mjPanelSC.SetActiveMJTipDeng(false);
                this.mjPanelSC.SetActiveHuTipContent(false);
                //自己碰后有听牌的时候需要点击牌的时候显示听牌提示 
                // dispatch(MJEvent.SET_INITCARDSHOWHUTIP);

                //显示 自己碰在桌子上的牌
                this.mjcplayersSC.AddAltCard(pengDirect, data.pg.mjId, directionIndex,false)

                let timerItem=  window.setTimeout(()=>{
                    if (data.ShowKeHu) {
                        this.mjGameViewSC.SetCommonHuTip(data.data,0) 
                    }
                    dataAll.endFun();
                    this.mjGameViewSC.mjPropSC.Reflash();
                } , 200);
                this.m_TimerArr.push(timerItem)
            } 
            else 
            {
                this.mjcplayersSC.AddAltCard(pengDirect, data.pg.mjId, directionIndex,false)
                dataAll.endFun();
            }
            this.mjmiddleSC.SetCountDown(CommonMJConfig.TimeCountDown.Common);

        } 
        else if (data.pg.qiangType == MahQiangGangState.QGS_HasQiangGang ) 
        {
            if (pengDirect == CommonMJConfig.Direction.Bottom) 
            {
                if (data.ShowKeHu) {
                    this.mjGameViewSC.SetCommonHuTip(data.data,0)
                }
            } 
            dataAll.endFun();
        }
        else if (data.pg.qiangType == MahQiangGangState.QGS_NoQiangGang ) 
        {
            if (pengDirect == CommonMJConfig.Direction.Bottom) 
            {
                if (data.ShowKeHu) {
                    this.mjGameViewSC.SetCommonHuTip(data.data,0)  
                }

            } 
            dataAll.endFun();
        }
        else if (data.pg.qiangType == MahQiangGangState.QGS_BackToPeng ) 
        {
            this.mjcplayersSC.ChangCtrlToAlt(pengDirect, data.pg.mjId, MJTool.PositionToDirection(data.pg.fromIndex), data.pg.type)
            if (pengDirect == CommonMJConfig.Direction.Bottom) 
            {
                if (data.ShowKeHu) {
                    this.mjGameViewSC.SetCommonHuTip(data.data,0)
                }

            } 
            
            dataAll.endFun();
        }

        dispatch(MJEvent.SET_OUTCARD_DIRECTION, pengDirect);
    }


    /** 杠牌成功 */
    OnGangCardQueue(dataAll: { data: pb.S2CMahPGResult; endFun: () => {}; }) 
    {
        let data =dataAll.data;
        let direct = MJTool.PositionToDirection(data.index);
        let removeTable:number[] = [];
        let cardId = data.pg.mjId
        let mineCards ;
        let playerData =    CommonMJConfig.MJMemberInfo[data.index] as pb.IMahPlayerData
        let scgangType = data.pg.type;
        if (scgangType == MahHPGOPerate.HPG_BuGang ) //补杠的时候
        {

            if (direct == CommonMJConfig.Direction.Bottom) 
            {
                mineCards = CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom];
                mineCards[cardId] = mineCards[cardId] - 1;
                removeTable = [cardId];
                dispatch(MJEvent.HIDE_ALL_HANDLE_BTN);
            } 
            else 
            {
                if (playerData.bMingPai) 
                {
                    CommonMJConfig.PlayerCardsInfo[direct][cardId] = CommonMJConfig.PlayerCardsInfo[direct][cardId]-1
                    removeTable=[cardId]
                }
                else
                {
                    CommonMJConfig.PlayerCardsInfo[direct][0] = CommonMJConfig.PlayerCardsInfo[direct][0]-1
                    removeTable=[0]
                }
            }
        } 
        else if (scgangType == MahHPGOPerate.HPG_AnGang ) //暗杠的时候
        {
            if (direct == CommonMJConfig.Direction.Bottom) 
            {
                mineCards = CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom];

                if (cardId == 35 ) //并且没有明牌
                {
                    
                    for (let i = 0; i < data.pg.otherMj.length; i++) 
                    {
                        let cardTemp = data.pg.otherMj[i]
                        mineCards[cardTemp] = mineCards[cardTemp] - 1;
                        removeTable.push(cardTemp)
                    }
                    mineCards[35] = mineCards[35] - (4-data.pg.otherMj.length);
                    for (let c = 0; c < 4-data.pg.otherMj.length; c++) {
                        removeTable.push(35)
                    }
                }
                else
                {
                    mineCards[cardId] = mineCards[cardId] - 4;
                    removeTable = [cardId,cardId,cardId,cardId];
                }

                dispatch(MJEvent.HIDE_ALL_HANDLE_BTN);
            } 
            else 
            {   
                //没有明牌的时候 明牌的时候特殊处理
                if (playerData.bMingPai) 
                {
                    if (cardId == 35 ) //并且没有明牌
                    {
                        for (let i = 0; i < data.pg.otherMj.length; i++) 
                        {
                            let cardTemp = data.pg.otherMj[i]
                            CommonMJConfig.PlayerCardsInfo[direct][cardTemp] = CommonMJConfig.PlayerCardsInfo[direct][cardTemp]-1
                            removeTable.push(cardTemp)
                        }
                        CommonMJConfig.PlayerCardsInfo[direct][35] = CommonMJConfig.PlayerCardsInfo[direct][35]- (4-data.pg.otherMj.length);
                        for (let c = 0; c < 4-data.pg.otherMj.length; c++) {
                            removeTable.push(35)
                        }
                    }
                    else
                    {
                        CommonMJConfig.PlayerCardsInfo[direct][cardId] = CommonMJConfig.PlayerCardsInfo[direct][cardId]-4
                        removeTable = [cardId,cardId,cardId,cardId];
                    }
                }
                else
                {
                    CommonMJConfig.PlayerCardsInfo[direct][0] = CommonMJConfig.PlayerCardsInfo[direct][0]-4
                    removeTable = [0,0,0,0];
                    if (cardId == 35 ) //并且没有明牌
                    {
                        for (let i = 0; i < data.pg.otherMj.length; i++) 
                        {
                            let cardTemp = data.pg.otherMj[i]
                            CommonMJConfig.AllCards[cardTemp] = CommonMJConfig.AllCards[cardTemp]-1;
                        }
                        CommonMJConfig.AllCards[35] = CommonMJConfig.AllCards[35]-(4-data.pg.otherMj.length);
                    }
                }


            }
        }
        else if (scgangType == MahHPGOPerate.HPG_DianGang ) //点杠的时候
        {
            if (direct == CommonMJConfig.Direction.Bottom) 
            {
                mineCards = CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom];
                mineCards[cardId] = mineCards[cardId] - 3;
                removeTable = [cardId,cardId,cardId];
                dispatch(MJEvent.HIDE_ALL_HANDLE_BTN);
            } 
            else 
            {
                if (playerData.bMingPai) 
                {
                    CommonMJConfig.PlayerCardsInfo[direct][cardId] = CommonMJConfig.PlayerCardsInfo[direct][cardId]-3
                    removeTable = [cardId,cardId,cardId];
                }
                else
                {
                    CommonMJConfig.PlayerCardsInfo[direct][0] = CommonMJConfig.PlayerCardsInfo[direct][0]-3
                    removeTable = [0,0,0];
                }
            }
        }
        if (cardId!=35 ) 
        {
            CommonMJConfig.AllCards[cardId] = 0;
        } 

        let playerDataTab :pb.ITablePlayer =    RoomManager.GetPlayerByIndex(direct)
        if (  Number(playerDataTab.player.attrs[PlayerAttr.PA_Gender] ) == 1 ) //男
        {
            MJTool.PlaySound(CommonMJConfig.SoundEffPath.GangMan, Config.BUNDLE_MJCOMMON); 
        }
        else
        {
            MJTool.PlaySound(CommonMJConfig.SoundEffPath.GangWomen, Config.BUNDLE_MJCOMMON); 
        }
        this.OnGangCard(dataAll,removeTable);
    }

    OnGangCard(dataAll: { data: pb.S2CMahPGResult; endFun: () => {}; },removeTable:number[]  ) 
    {
        //0.默认无特殊处理 1.只做杠不飘分（type是杠）  2.飘分（type是杠） 3. 变回碰（type是碰）
        // this.mjcplayersSC.ResetOutCardPoint();

        let data =dataAll.data;

        let direct = MJTool.PositionToDirection(data.index);
        let showtype = data.pg.qiangType;
        if (showtype == MahQiangGangState.QGS_Normal  ) 
        {
            let timerItem=  window.setTimeout(()=>{
                this.mjcplayersSC.HidePGHEffect(direct,CommonMJConfig.HandleTag.Gang);
                this.OnGangCardShowScore(data)
            } , 1000);
            this.m_TimerArr.push(timerItem)
            this.OnGangCardReal(direct,data,removeTable,data.pg.type);

            let timerItem1=  window.setTimeout(()=>{
                dataAll.endFun();
            } , CommonMJConfig.OperateTime.Gang);
            this.m_TimerArr.push(timerItem1)
        }
        else if (showtype == MahQiangGangState.QGS_HasQiangGang  ) 
        {
            this.OnGangCardReal(direct,data,removeTable,data.pg.type);
            let timerItem=  window.setTimeout(()=>{
                dataAll.endFun();
            } , CommonMJConfig.OperateTime.Gang);
            this.m_TimerArr.push(timerItem)
        }
        else if (showtype == MahQiangGangState.QGS_NoQiangGang  ) 
        {
            this.OnGangCardShowScore(data)
            dataAll.endFun(); //碰里边处理
        }
        else if (showtype == MahQiangGangState.QGS_BackToPeng  ) 
        {
            dataAll.endFun(); //碰里边处理
        }
    }
    /** 杠牌飘分 */
    OnGangCardShowScore(data: pb.S2CMahPGResult) 
    {
        for (let index = 0; index < data.pg.coin.length; index++) 
        {
            let itemData = data.pg.coin[index]
            let bUseJinZhongZhao=false
            if (itemData.bUseJinZhongZhao!=null )
            {
                bUseJinZhongZhao = itemData.bUseJinZhongZhao
            }
            this.mjHeadPlayersSC.PlayScore(itemData.idx ,itemData.coin,itemData.bFengDing,bUseJinZhongZhao);

            if (bUseJinZhongZhao) 
            {
                this.mjHeadPlayersSC.SetActiveMianSi(MJTool.PositionToDirection( itemData.idx),true )
                this.mjHeadPlayersSC.SetActiveJinzhongzhao_3d(MJTool.PositionToDirection( itemData.idx),true )
            }
        }
        MJManager.DoPiaoAniByCoinData(data.pg.coin)   


        let timerItem1 =  window.setTimeout(()=>{
            //刷新飘分后直接刷新玩家的 当前货币
            for (let index = 0; index < data.pg.curcoin.length; index++) 
            {
                this.roomPlayersBehaviourSC.SetCurrentCore(data.pg.curcoin[index].key ,data.pg.curcoin[index].value );
            }

        } , CommonMJConfig.OperateTime.PiaofenShuaXin );
        this.m_TimerArr.push(timerItem1 )

    }

    /** 播放特效 删除杠的牌并生成杠的牌 */
    OnGangCardReal(direct: number, data: pb.S2CMahPGResult, removeTable: number[], type: pb.MahHPGOPerate)
    {
        this.mjcplayersSC.ShowPGHEffect(direct,CommonMJConfig.HandleTag.Tang)
        let handRemoveCount =1

        if (type == MahHPGOPerate.HPG_DianGang ) 
        {
            handRemoveCount=3
            //播放各自特效 点杠 补杠 播放刮风 暗杠播放下雨
            MJTool.PlaySound(CommonMJConfig.EffectPath.GangGuaFeng.sound,Config.BUNDLE_MJCOMMON);
            this.mjPanelSC.PlayCenterEff(CommonMJConfig.EffectPath.GangGuaFeng.path,CommonMJConfig.EffectPath.GangGuaFeng.aniName)
            // dispatch("PLAYCENTEREFF", CommonMJConfig.EffectPath.GangGuaFeng.path,CommonMJConfig.EffectPath.GangGuaFeng.aniName  )
        } 
        else if (type == MahHPGOPerate.HPG_BuGang ) 
        {
            handRemoveCount=1
            MJTool.PlaySound(CommonMJConfig.EffectPath.GangGuaFeng.sound,Config.BUNDLE_MJCOMMON);
            this.mjPanelSC.PlayCenterEff(CommonMJConfig.EffectPath.GangGuaFeng.path,CommonMJConfig.EffectPath.GangGuaFeng.aniName)
            // dispatch("PLAYCENTEREFF", CommonMJConfig.EffectPath.GangGuaFeng.path,CommonMJConfig.EffectPath.GangGuaFeng.aniName  )
        } 
        else if (type == MahHPGOPerate.HPG_AnGang ) 
        {
            handRemoveCount=4
            MJTool.PlaySound(CommonMJConfig.EffectPath.GangXiaYu.sound,Config.BUNDLE_MJCOMMON);
            this.mjPanelSC.PlayCenterEff(CommonMJConfig.EffectPath.GangXiaYu.path,CommonMJConfig.EffectPath.GangXiaYu.aniName)
            // dispatch("PLAYCENTEREFF", CommonMJConfig.EffectPath.GangXiaYu.path,CommonMJConfig.EffectPath.GangXiaYu.aniName  )
        } 
        if (direct == CommonMJConfig.Direction.Bottom) 
        {
            this.mjcplayersSC.ShowEffectGangSelf()
        }

        this.mjcplayersSC.RemoveHandCards(direct,removeTable,2,handRemoveCount);

        this.OnGangCardDesk(direct, data,type)




    }

    /** 删除手上的杠牌 在桌子上显示杠牌 */
    OnGangCardDesk(direct: number, data: pb.S2CMahPGResult,type:pb.MahHPGOPerate) 
    {

        if (type == MahHPGOPerate.HPG_DianGang ) 
        {
            let directionIndex = CommonMJConfig.AltOriTab[direct][MJTool.AltPositionToDirection(data.pg.fromIndex, data.index)]
            this.mjcplayersSC.AddCtrlCard(direct, data.pg.mjId, directionIndex,false)
            this.mjcplayersSC.RemoveLastOutCard(MJTool.PositionToDirection(data.pg.fromIndex ))
        } 
        else if (type == MahHPGOPerate.HPG_BuGang ) 
        {
            //碰变杠 

            this.mjcplayersSC.ChangAltToCtrl(direct, data.pg.mjId, 0)

        } 
        else if (type == MahHPGOPerate.HPG_AnGang ) 
        {
            this.mjcplayersSC.AddBlackCtrlCard(direct, data.pg.mjId,false)
        } 


    }

        

    /** 通知胡牌 每个玩法单独处理 */
    OnHuCard( dataAll:{data: pb.S2CMahHuResult,endFun:()=>{}} )
    {
        let data =dataAll.data;
        let directFrom = MJTool.PositionToDirection(data.hu[0].fromIndex );

        // Log.w( "OnHuCard   directFrom   : ",directFrom  );


        for (let i = 0; i < data.hu.length; i++) 
        {
            let direct = MJTool.PositionToDirection(data.hu[i].huIndex);
            if (direct == CommonMJConfig.Direction.Bottom ) 
            {
                //自己胡牌的时候 锁定出牌 关掉胡牌 总计多少张的具体界面提示
                MJDispose.SetState(CommonMJConfig.MineCardState.Lock)
                this.mjPanelSC.SetActiveOutCardHuTip(false)
                if (data.hu[i].huIndex==data.hu[i].fromIndex )
                {
                    //自摸自摸 关掉自己胡牌提示的Flag  如果自己听牌提示按钮亮起来
                    if (CommonMJConfig.AlreadyHu || CommonMJConfig.AlreadyHuShowTip) 
                    {
                        this.mjcplayersSC.OnSetOutHandHuCardsState(false);
                        // dispatch(MJEvent.OUTCARDHPTS, data.hu[i].mjId)
                    }
                    
                }
                if (CommonMJConfig.AlreadyHu || CommonMJConfig.AlreadyHuShowTip) 
                {

                }

            }
        }


        if (data.zhuanYi.length == 0 ) 
        {
            //不是呼叫转移
            this.OnHuCardDefinite(dataAll);
        } 
        else 
        {
            this.OnHuCardDefinite(dataAll);
            fgui.GTween.delayedCall(3).setTarget(this).onComplete(()=>{
                for (let index = 0; index < data.hu.length; index++) 
                {
                    this.mjcplayersSC.SeHuJiaoZhuanYiActive(MJTool.PositionToDirection(data.hu[index].fromIndex),true)
                }
                fgui.GTween.delayedCall(1.5).setTarget(this).onComplete(()=>{
                    for (let index = 0; index < data.hu.length; index++) 
                    {
                        this.mjcplayersSC.SeHuJiaoZhuanYiActive(MJTool.PositionToDirection(data.hu[index].fromIndex),false)
                    }
    
                    for (let index = 0; index < data.zhuanYi.length; index++) 
                    {
                        let dataItem = data.zhuanYi[index]

                        this.mjHeadPlayersSC.PlayScore(dataItem.key , dataItem.value ,false,false);
                    }
                    MJManager.DoPiaoAniByKV(data.zhuanYi)
                });
            });
            
            // let timerItem=  window.setTimeout(()=>{
            //     for (let index = 0; index < data.hu.length; index++) 
            //     {
            //         this.mjcplayersSC.SeHuJiaoZhuanYiActive(MJTool.PositionToDirection(data.hu[index].fromIndex),true)
            //     }

            //     let timerItem1 =  window.setTimeout(()=>{
            //         for (let index = 0; index < data.hu.length; index++) 
            //         {
            //             this.mjcplayersSC.SeHuJiaoZhuanYiActive(MJTool.PositionToDirection(data.hu[index].fromIndex),false)
            //         }
    
            //         for (let index = 0; index < data.zhuanYi.length; index++) 
            //         {
            //             let dataItem = data.zhuanYi[index]

            //             this.mjHeadPlayersSC.PlayScore(dataItem.key , dataItem.value ,false,false);
            //         }
            //         MJManager.DoPiaoAniByKV(data.zhuanYi)
            //     } , 1500);
            //     this.m_TimerArr.push(timerItem1)

            // } , 3000);
            // this.m_TimerArr.push(timerItem)
        }
    }

    GetMaxHuData(dataItem)
    {
        let dataItemEff =  dataItem[0]
        if (dataItemEff== MahHu.Hu_MingPai) 
        {
            dataItemEff= dataItem[1]
        }
        return  dataItemEff
    }
    

    /** 胡牌 生成胡牌 */
    OnHuCardDefinite(dataAll: { data: pb.S2CMahHuResult; endFun: () => {}; }) 
    {
        let data = dataAll.data;
        let isYPSX = this.OnGetSetYiPaoSXS(data);
        let selfIsHu = this.GetSelfCurrentHu(data)
        let isHaveCenterEff = this.GetIsOwnCenterEff(data, isYPSX)
        let isCenterShowed = false
        let ZiMo =false
        let piaofenTime = 1000
        let isHaveGangShangHua=false;

        for (let i = 0; i < data.hu.length; i++) 
        {
            let hudirect = MJTool.PositionToDirection(data.hu[i].huIndex) ;
            let playerData =    CommonMJConfig.MJMemberInfo[data.hu[i].huIndex] as pb.IMahPlayerData

            let boolArr = this.GetGangShangHuaPao(data.hu[i].type)
            let isZiMo = data.hu[i].fromIndex == data.hu[i].huIndex
            let dataItem = Tool.Clone(data.hu[i].type )
            MJTool.SortHuPaiTypeCenterHu(dataItem)
            let maxHu =dataItem[0]
            let hutypeConfig = CommonMJConfig.HuTypeEffConfig[maxHu]
            if (piaofenTime<hutypeConfig.time) {
                piaofenTime =  hutypeConfig.time                      
            }

            let playerDataTab :pb.ITablePlayer =    RoomManager.GetPlayerByIndex(hudirect)
            if (isZiMo) 
            {
                if (boolArr[0]) //杠上花一定是自摸
                {
                    isHaveGangShangHua=true;
                    this.ShowCenterHuAll(CommonMJConfig.HuTypeEffConfig[MahHu.Hu_GangShangHua], maxHu)
                }
                else
                {
                    if (hudirect == CommonMJConfig.Direction.Bottom) {
                        this.ShowCenterHuAll(CommonMJConfig.HuTypeEffConfig[MahHu.Hu_ZiMo],maxHu )
                    }
                    else
                    {
                        this.mjcplayersSC.ShowEffectHu( hudirect, CommonMJConfig.HuTypePath.zimo, data.hu[i].AAAA, false);
                    }

                }


                if (hudirect == CommonMJConfig.Direction.Bottom) 
                {
                    // dispatch(MJEvent.OUTCARDHPTS, data.hu[i].mjId)
                    //自己自摸的时候一定是真实的牌 需要删除数据
                    CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom][data.hu[i].mjId] = CommonMJConfig.PlayerCardsInfo[CommonMJConfig.Direction.Bottom][data.hu[i].mjId] - 1;
                }
                else
                {
                    if (playerData.bMingPai) 
                    {
                        playerData.moPaiId = 0
                        CommonMJConfig.PlayerCardsInfo[hudirect][data.hu[i].mjId] = CommonMJConfig.PlayerCardsInfo[hudirect][data.hu[i].mjId] - 1;
                    }
                    else
                    {
                        CommonMJConfig.PlayerCardsInfo[hudirect][0] = CommonMJConfig.PlayerCardsInfo[hudirect][0] - 1;
                    }

                }

                if (  Number(playerDataTab.player.attrs[PlayerAttr.PA_Gender] ) == 1 ) //男
                {
                    MJTool.PlaySound(CommonMJConfig.SoundEffPath.ZiMoMan, Config.BUNDLE_MJCOMMON); 
                }
                else
                {
                    MJTool.PlaySound(CommonMJConfig.SoundEffPath.ZiMoWomen, Config.BUNDLE_MJCOMMON); 
                }
                
            }
            else
            {
                // if (boolArr[1]) //杠上花一定是自摸
                // {
                //     let clientPos =MJTool.PositionToDirection(data.hu[i].fromIndex );
                //     this.mjcplayersSC.PlaySpainEff(clientPos,"mjsp_tsani_gangshanghua","ani")
                // }
                // else
                // {
                    this.mjcplayersSC.ShowEffectHu( hudirect, CommonMJConfig.HuTypePath.pinghu, data.hu[i].AAAA, false);
                // }
                if (  Number(playerDataTab.player.attrs[PlayerAttr.PA_Gender] ) == 1 ) //男
                {
                    MJTool.PlaySound(CommonMJConfig.SoundEffPath.HuMan,Config.BUNDLE_MJCOMMON); 
                }
                else
                {
                    MJTool.PlaySound(CommonMJConfig.SoundEffPath.HuWomen,Config.BUNDLE_MJCOMMON); 
                }
            }

            // if ( maxHu != MahHu.Hu_ZiMo ) 
            // {
                //只是自摸 加底 加番 不显示通用特效了
                
                let yanShiHuEffTime= 1500;
                // if (isHaveGangShangHua)
                // {
                //     yanShiHuEffTime = yanShiHuEffTime+1533

                // }
                let timerItem=  window.setTimeout(()=>{
                    if ( hudirect == CommonMJConfig.Direction.Bottom ) 
                    {
                        // this.mjcplayersSC.SetActiveHuEffect(hudirect,false) ;

                        if (MJTool.JudgeIsHave(this.specalEff, maxHu )) 
                        {

                            this.ShowCenterHuAll(hutypeConfig, maxHu)
                        }
                        else
                        {
                            // Log.w(" OnHuCardDefinite  展示通用胡  "    ) 
                            this.mjcplayersSC.ShowEffectHuTY(hudirect, maxHu );
                        }
                        // Log.w("胡牌的 倍数  data.hu[i].truthMultiple : ", data.hu[i].truthMultiple)
                        if (data.hu[i].truthMultiple > 12 ) //12倍以上播放火焰特效
                        {
                            let playerData =    CommonMJConfig.MJMemberInfo[data.hu[i].huIndex] as pb.IMahPlayerData
                            this.mjcplayersSC.PlayEffFire(CommonMJConfig.Direction.Bottom,playerData.bMingPai)   
                        }

                    }
                    else
                    {
                        //一炮双响如果有独立特效,自己参与胡牌的时候展示自己的特效
                        //别人的通用特效不一起展示，自己不参与时展示最大的牌型特效
                        if ( isYPSX ) 
                        {
                            if (!selfIsHu ) 
                            {
                                if ( this.GetIsNeedCenterHu( data ,maxHu ,isCenterShowed ) ) 
                                {
                                    isCenterShowed = true;
                                    // Log.w(" 锤子 1   dataItem ",dataItem)
                                    this.ShowCenterHuAll(hutypeConfig, maxHu) ; //一炮双响一定不是杠上花
                                } 
                                else 
                                {
                                    if (!isHaveCenterEff) 
                                    {
                                        this.mjcplayersSC.ShowEffectHuTY(hudirect, maxHu);
                                    }
                                }
                            }

                        } 
                        else 
                        {
                            if ( this.GetIsNeedCenterHu( data ,maxHu ,isCenterShowed )) 
                            {
                                //其他玩家展示中心胡特效
                                isCenterShowed = true
                                this.ShowCenterHuAll(hutypeConfig, maxHu)
                            } 
                            else 
                            {
                                this.mjcplayersSC.ShowEffectHuTY(hudirect, maxHu );
                            }
                            
                        }
                    }
                    
                } , yanShiHuEffTime );
                this.m_TimerArr.push(timerItem)
                let huori = CommonMJConfig.AltOriTab[hudirect][MJDispose.HuPositionToDirection(data.hu[i].fromIndex,data.hu[i].huIndex)]
                if (isZiMo) 
                {
                    huori = 5;
                    ZiMo =true;
                }
                this.mjXLThreeTwocplayersSC.OnHu( hudirect,data.hu[i] ,huori )
                let timerItem2=  window.setTimeout(()=>{
                    this.mjXLThreeTwocplayersSC.SHowHuCardHuEff(hudirect )
                    this.mjHeadPlayersSC.SHowHuCountEff(hudirect, this.mjXLThreeTwocplayersSC.GetHuCount(hudirect ) )
                } , 500);
                this.m_TimerArr.push(timerItem2)
            // }

            let dianPaoClientPos =MJTool.PositionToDirection(data.hu[0].fromIndex );
            // 不是自摸就需要删除点炮牌
            if (!ZiMo) 
            {
                MJTool.PlaySound(CommonMJConfig.SoundEffPath.EffHu,Config.BUNDLE_MJCOMMON);
                let timerItem=  window.setTimeout(()=>{
                    this.mjcplayersSC.SHowOutCardHuEff( dianPaoClientPos )
                } , 200);
                this.m_TimerArr.push(timerItem)

                let timerItem1 =  window.setTimeout(()=>{
                    if (!data.hu[i].translucent) {
                        this.mjcplayersSC.RemoveLastOutCard( dianPaoClientPos )
                    }
                } , 1000 );
                this.m_TimerArr.push(timerItem1 )
            }
        }

        if (isHaveGangShangHua) {
            piaofenTime = piaofenTime+1533
        }

        let timerItem2 =  window.setTimeout(()=>{
            this.HuPiaoFenAni(dataAll);
            dataAll.endFun();
        } , piaofenTime+1500 );
        this.m_TimerArr.push(timerItem2 )

    }

    /** 胡牌飘分 */
    HuPiaoFenAni(dataAll: { data: pb.S2CMahHuResult; endFun: () => {}; }) 
    {
        let data = dataAll.data;

        for (let index = 0; index < data.score.length; index++) 
        {
            let dataItem = data.score[index]
            this.mjHeadPlayersSC.PlayScore(dataItem.idx ,dataItem.coin,dataItem.bFengDing,dataItem.bUseJinZhongZhao );

            if (dataItem.bUseJinZhongZhao) 
            {
                this.mjHeadPlayersSC.SetActiveMianSi(MJTool.PositionToDirection( dataItem.idx),true )
                this.mjHeadPlayersSC.SetActiveJinzhongzhao_3d(MJTool.PositionToDirection( dataItem.idx),true )
            }

        }
        MJManager.DoPiaoAniByCoinData(data.score)

        let timerItem1 =  window.setTimeout(()=>{
            //刷新飘分后直接刷新玩家的 当前货币
            for (let index = 0; index < data.curcoin.length; index++) 
            {
                this.roomPlayersBehaviourSC.SetCurrentCore(data.curcoin[index].key ,data.curcoin[index].value );
            }

        } , CommonMJConfig.OperateTime.PiaofenShuaXin );
        this.m_TimerArr.push(timerItem1 )



        // let timerItem =  window.setTimeout(()=>{

        //     dataAll.endFun();
        // } , CommonMJConfig.OperateTime.Piaofen );
        // this.m_TimerArr.push(timerItem )


    }



    /** 单独处理三龙七对的震动 */
    ShowCenterHuAll(hutypeConfig: { huPath: string;aniName: string; texture: string; sound: string[]; huwin: string; hulose: string; }, hucurrent: number) 
    {

        if ( hucurrent == MahHu.Hu_SanLongQiDui) 
        {
            //屏幕震动下
            
        }

        this.ShowCenterHu(hutypeConfig,hucurrent);

    }
    /** 播放中心胡 */
    ShowCenterHu(hutypeConfig: { huPath: string;aniName: string; texture: string; sound: string[]; huwin: string; hulose: string; },hucurrent:number) 
    {
        // Log.e(  "ShowCenterHu   hutypeConfig  ",hutypeConfig )
        MJTool.PlaySound(hutypeConfig.sound,Config.BUNDLE_MJCOMMON);
        //播放中心胡
        this.mjPanelSC.PlayCenterEff(hutypeConfig.huPath,hutypeConfig.aniName)

    }




    /** -获取到是否是杠上花 杠上炮 */
    GetGangShangHuaPao(data: pb.MahHu[]) :boolean[]
    {
        let isGangShangHua = false
        let isGangShangPao = false
        for (let i = 0; i < data.length; i++) 
        {
            if (data[i]== MahHu.Hu_GangShangHua) 
            {
                isGangShangHua=true
            } 
            else if (data[i]== MahHu.Hu_GangShangPao) 
            {
                isGangShangPao=true
            } 
        }
        return [isGangShangHua,isGangShangPao];
    }

    /** 是否展示中心胡  */
    GetIsOwnCenterEff(data: pb.S2CMahHuResult, isYPSX: boolean) 
    {
        let isHave =false;
        for (let i = 0;  i< data.hu.length; i++) 
        {
            let dataItem = Tool.Clone(data.hu[i].type )
            MJTool.SortHuPaiTypeCenterHu(dataItem)

            if (MJTool.PositionToDirection(data.hu[i].huIndex) == CommonMJConfig.Direction.Bottom ) 
            {
                isHave = true;
            } 
            else 
            {
                // 如果有独立特效，自己参与胡牌时，展示自己的特效
                //别人的通用特效不一起展示，自己不参与时展示最大的牌型特效
                if (isYPSX) 
                {
                    if (this.GetIsNeedCenterHu( data ,dataItem[0] ,false )  ) 
                    {
                        isHave = true;
                    }
                    
                }
            }
        }

        return isHave;
    }

    /** 其他玩家胡的时候时候放中心播放 */
    GetIsNeedCenterHu(data: pb.S2CMahHuResult, hucurrent: number , isCenterShowed:boolean):boolean 
    {
        let selfHu =this.GetSelfCurrentHu(data);
        let isYiPaoDuoXiang = (data.hu.length>1 )
        if (isCenterShowed) //展示了中心特效一定不在展示
        {
            return false
        }
        if (selfHu) //自己胡了一定不去展示中心胡
        {
            return false
        } 
        if ( !isYiPaoDuoXiang ) 
        {
            //不是一炮多响一定可以展示
            if (MJTool.JudgeIsHave(this.specalEff, hucurrent)) 
            {
                return true;
            }
        }
        else
        {
            if (MJTool.JudgeIsHave(this.specalEff, hucurrent)) 
            {
                //当前胡是在特殊特效胡 找出最大的特殊特效
                let allmaxhuType:number[] = [];
                for (let i = 0; i < data.hu.length; i++) 
                {
                    let dataItem = Tool.Clone(data.hu[i].type );
                    MJTool.SortHuPaiTypeCenterHu(dataItem);
                    allmaxhuType.push(dataItem[0] );
                }
                MJTool.SortHuPaiTypeCenterHu(allmaxhuType)
                let maxhuItem = allmaxhuType[1];
                //最大的才可以
                return maxhuItem== hucurrent
            }
        }
        return false
    }


    /** 自己是否胡了 */
    GetSelfCurrentHu(data: pb.S2CMahHuResult) 
    {
        let isHave = false
        for (let index = 0; index < data.hu.length; index++) 
        {
            if (  MJTool.PositionToDirection(data.hu[index].huIndex) == CommonMJConfig.Direction.Bottom ) 
            {
                isHave =true;
            }
        }
        return isHave;
    }

    /** 返回是否是一炮双响 播放动画 */
    OnGetSetYiPaoSXS(data: pb.S2CMahHuResult)
    {
        let isYPSX = false;
        if (data.hu.length > 1 ) 
        {
            isYPSX = (data.hu[0].fromIndex == data.hu[1].fromIndex);
        }
        if (isYPSX) 
        {
            // this.mjcplayersSC.ShowEffectHu( MJTool.PositionToDirection(data.hu[0].fromIndex), CommonMJConfig.HuTypePath.yiPaoSuangXiang.texture, 0, false);
            MJTool.PlaySound(CommonMJConfig.HuTypePath.yiPaoSuangXiang.sound,Config.BUNDLE_MJCOMMON);
        }
        return isYPSX
    }











    // 游戏里边重连
    OnReconnectGameData()
    {
        // if (this.logic.messageQuaue && this.logic.messageQuaue.use) {
        //     // this.logic.messageQuaue = this.logic.service.GetMessageQuaue();
        // }
        
        this.StopCoroutineTweenAni()
        this.OnResetCards()

        let startTime = Manager.utils.milliseconds;
        Manager.uiManager.close(GameMatches);
        let dataAll = Manager.dataCenter.get(GameData).get<{data:pb.S2CMahResetTable,endFun:()=>{}} >(ProtoDef.pb.S2CMahResetTable);
        Log.w(" 麻将重连 OnReconnectGameData data All : ",dataAll);
        RoomManager.SetReliefTime(2000);
        //设置游戏玩法数据
        this.SetGameRule(dataAll.data);
        // 小结算关重置
        // dispatch(MJEvent.RESETMJBANLANCE);
        //关掉所有玩家头像
        this.roomPlayersBehaviourSC.ReSetPlayer();

        CommonMJConfig.RoomInfo = dataAll.data.tableCommon

        CommonMJConfig.MJMemberInfo = {}
        let hzCount =0
        for (const iterator of dataAll.data.gamePlayers) {
            CommonMJConfig.MJMemberInfo[iterator.index] = iterator
            if ( iterator.usedHongZhong!=null && iterator.usedHongZhong ) {
                hzCount= hzCount+1
            }
            if (iterator.bZhuang) 
            {
                RoomManager.SetZhaungPos(iterator.index)    
            }
        }
        MJDispose.SetExtraHZCount(hzCount)

        Log.d("XLThreeTwo onFairyLoad OnReconnectGameData 0","use time :",Manager.utils.milliseconds-startTime); 
        startTime = Manager.utils.milliseconds;

        let selfguid=Manager.dataCenter.get(GameData).player().guid;
        // Log.w(  " OnReconnectGameData    selfguid   :   ",selfguid    )
        for (const iterator of dataAll.data.tableCommon.players) {
            CommonMJConfig.MJMemberHeadInfo[iterator.pos] = iterator
            RoomManager.MemberInfo[iterator.pos] = iterator
            // Log.e(  " OnReconnectGameData iterator.player.guid   :   ",iterator.player.guid    )
            if ( selfguid == iterator.player.guid ) {
                // Log.e(  " OnReconnectGameData iterator.pos   :   ",iterator.pos    )

                RoomManager.SetSelfPosition(iterator.pos)
            }
        }
        Log.d("XLThreeTwo onFairyLoad OnReconnectGameData 1","use time :",Manager.utils.milliseconds-startTime); 
        startTime = Manager.utils.milliseconds;
        RoomManager.tableId = dataAll.data.tableCommon.tableId
        RoomManager.gameType = dataAll.data.tableCommon.gameType
        RoomManager.roomcfgId = dataAll.data.tableCommon.tablecfgId
        RoomManager.curRound = dataAll.data.gameTable.curInning
        RoomManager.tableCommon =dataAll.data.tableCommon

        let tempData ={gameType:dataAll.data.tableCommon.gameType}
        Manager.gd.put("GameCommonData",tempData);

        MJDispose.SetXueLiuState(true);
        MJDispose.SetRoomState(dataAll.data.gameTable.tableStage,true)


        Log.d("XLThreeTwo onFairyLoad OnReconnectGameData 2","use time :",Manager.utils.milliseconds-startTime); 
        startTime = Manager.utils.milliseconds;

        //结算中 不去处理重连 比赛场不去处理
        Log.d("XLThreeTwo onFairyLoad OnReconnectGameData 3","use time :",Manager.utils.milliseconds-startTime); 
        startTime = Manager.utils.milliseconds;

        this.ruleXLThreeTwoSC.SetData()
        Log.d("XLThreeTwo onFairyLoad OnReconnectGameData 4","use time :",Manager.utils.milliseconds-startTime); 
        startTime = Manager.utils.milliseconds;
        this.mjmiddleSC.OnSetFengDingDiFen();
        this.mjPanelSC.OnSetView()
        // Log.w ("麻将重连  自己的时候 dataAll.data.gameTable.tableStage ",  dataAll.data.gameTable.tableStage  )
        if (dataAll.data.gameTable.tableStage <= MahTableStage.TS_TableUnReady) 
        {
            for (const [key, val] of Object.entries(CommonMJConfig.MJMemberInfo)) {
                let serverPos = Number(key);
                let cilentPos = MJTool.PositionToDirection(serverPos)
                let v =CommonMJConfig.MJMemberInfo[key]
                if (cilentPos==CommonMJConfig.Direction.Bottom) 
                {
                    // Log.w ("麻将重连  自己的时候 v.state  ",v.state)
                    if (v.state== MahPlayerState.PS_UnReady) 
                    {
                        MJC2SOperation.C2SMjZhunBei();
                    }
                }
            }
        }

        if (CommonMJConfig.RoomState == MahTableStage.TS_GameOver && RoomManager.RoomCategory == "比赛场" ) {
            dataAll.endFun()
            return;

        }

        Log.d("XLThreeTwo onFairyLoad OnReconnectGameData 5","use time :",Manager.utils.milliseconds-startTime); 
        startTime = Manager.utils.milliseconds;

        let needReconnect = false;
        // this.mjGameViewSC.OnSetRoomRule();

        for (const iterator of dataAll.data.tableCommon.players) {
            dispatch(MJEvent.UPDATE_PLAYER_HEAD_INFO, iterator);
        }

        if (dataAll.data.gameTable.tableStage >= MahTableStage.TS_FaPai ) {
            //发过牌了 初始化的时候需要恢复所有数据
            needReconnect = true;
        }
        else
        {   
            //单纯处理亮起 邀请好友 准备按键和每个玩家是否准备
            dataAll.endFun();
            // Log.e("单纯处理亮起 邀请好友 准备按键和每个玩家是否准备 ");
            return;
        }

        CommonMJConfig.DirectionCurpos = dataAll.data.gameTable.curIndex
        CommonMJConfig.RestTime = dataAll.data.gameTable.restTime
        CommonMJConfig.LastDaPaiPos = dataAll.data.gameTable.lastIndex

        if (needReconnect) {
            //重连发牌后需要初始化牌墙
            this.InitMJ()
            MJManager.InitBoard();

            this.mjGameViewSC.InitPaiQiang(dataAll.data.gameTable.touZi,RoomManager.zhuang)
            // Log.e(" CommonMJConfig.allPaiqiangArr CommonMJConfig.totalCount  :  ",CommonMJConfig.allPaiqiangArr.length, CommonMJConfig.totalCount)
            MJDispose.SetResidueCards(dataAll.data.gameTable.restMahCount)
            // this.mjGameViewSC.SetPaiQingDataByTouZi(dataAll.data.gameTable.touZi,RoomManager.zhuang)
            this.mjcplayersSC.SetActiveAllPaiQiang(true)
            this.SetReconnect(dataAll.endFun)
        }
        // dispatch(MJEvent.SET_RESIDUE_CARDS, CommonMJConfig.ResidueCards);
        this.mjmiddleSC.OnSetResidueCards(CommonMJConfig.ResidueCards)   
        this.mjPanelSC.SettipsText_Gc(CommonMJConfig.ResidueCards)
        Log.d("XLThreeTwo onFairyLoad OnReconnectGameData all","use time :",Manager.utils.milliseconds-startTime); 
    }

    SetGameRule(data:pb.S2CMahResetTable)
    {

        CommonMJConfig.MjRoomRule.max_fan = data.gameRule.maxMultiple;
        CommonMJConfig.MjRoomRule.diFen = data.gameRule.diFen;
        CommonMJConfig.MjRoomRule.round = data.gameRule.inning;
        CommonMJConfig.MjRoomRule.hsz = data.gameRule.huanSanZhang;
        CommonMJConfig.MjRoomRule.dingQue = data.gameRule.dingQue;
        CommonMJConfig.MjRoomRule.ziMoType = data.gameRule.ziMoType;
        CommonMJConfig.MjRoomRule.hongZhongType = data.gameRule.xlhzRule.hongZhongType;
        CommonMJConfig.MjRoomRule.isHongZhongGang = data.gameRule.xlhzRule.isHongZhongGang;
        
    }

    //停止到所有的计时器和动画
    StopCoroutineTweenAni()
    {
        fgui.GTween.kill(this);
        if (this.timer_1) {
            window.clearInterval(this.timer_1);
        }
        this.mjGameViewSC.StopCoroutineTweenAni();
        this.mjmiddleSC.StopCoroutineTweenAni();
        this.mjcplayersSC.StopCoroutineTweenAni();
        this.mjPanelSC.StopCoroutineTweenAni(); 
        this.mjXLThreeTwocplayersSC.StopCoroutineTweenAni();

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


    
    /**
     * @description 初始化牌
     */
    InitMJ()
    {

        CommonMJConfig.MahjongID[35].ISHave=true;
        MJDispose.SetHZCount(CommonMJConfig.MjRoomRule.hongZhongType);
        CommonMJConfig.IsShowOutCardTip = true 
        //初始化牌墙
        let totalCount = 72 +CommonMJConfig.HZTotalCount+CommonMJConfig.extraHZCount
        MJDispose.SetTotalCount(totalCount)
        MJDispose.SetResidueCards(totalCount)
        //城墙 多出来的牌放到起始 摸牌前边

        if (!CommonMJConfig.MjRoomRule.hsz) 
        {
            this.roomViewSC.SetActivePropBtn(true)
        }


    }




    /**
     * @description 设置癞子
     */
     SetLaiZi()
     {
        CommonMJConfig.TingYong = {}
        CommonMJConfig.TingYong[0]=35;
        CommonMJConfig.TingYong[1]=135;
     }
 


    /**
     * @description     重连界面数据恢复 data.curpos 标对着的位置
                        重连的时候需要先清空游戏内所有数据 动画延迟函数
     */
    SetReconnect(endFun:()=>{})
    {
        this.SetLaiZi();
        if (CommonMJConfig.RoomState == MahTableStage.TS_HuanSanZhang )
        {
            this.mjPanelSC.SetActiveHuanSanZhangEff(true)
        }
        for (const [key, val] of Object.entries(CommonMJConfig.MJMemberInfo)) {
            let serverPos = Number(key);
            let v =CommonMJConfig.MJMemberInfo[key]
            //有一个人处于充值阶段就是充值阶段
            if (v.state == MahPlayerState.PS_ChongZhi ) 
            {
                MJDispose.SetReChargeState(true);
            }
            //自己的数据
            if (MJTool.PositionToDirection(serverPos) == CommonMJConfig.Direction.Bottom ) {
                if (CommonMJConfig.RoomState > MahTableStage.TS_DingQue ) {
                    MJDispose.SetMineQueCard(v.quetype);
                }
                this.mjcplayersSC.SetActiveTuoGuan(CommonMJConfig.Direction.Bottom,v.autoOpeateState)
                // this.mjPanelSC.SetTuoGuanrobotActive(!v.bZhuDong)
            }
            
            if (CommonMJConfig.RoomState > MahTableStage.TS_DingQue ) 
            {
                this.mjHeadPlayersSC.SetSe(MJTool.PositionToDirection(serverPos),v.quetype)
            }

            if (v.state == MahPlayerState.PS_UnHSZ || v.state == MahPlayerState.PS_HSZed ) 
            {
                this.mjPanelSC.SetActiveThreeCards(serverPos,v.state == MahPlayerState.PS_HSZed );
            }
        }


        for (const [key, val] of Object.entries(CommonMJConfig.MJMemberInfo)) {
            let serverPos = Number(key);
            let cilentPos = MJTool.PositionToDirection(serverPos)
            let v =CommonMJConfig.MJMemberInfo[key]
            this.mjXLThreeTwocplayersSC.SetPlayerReconnect(cilentPos,v )
            this.mjHeadPlayersSC.SetHongZhongCount(cilentPos,v.nChuHongZhong)
            if (cilentPos==CommonMJConfig.Direction.Bottom) 
            {
                //自己破产的话 展示下一局
                if (v.state ==MahPlayerState.PS_GiveUp ) 
                {
                    this.mjPanelSC.SetActiveNextGame(true)
                }


                if ( CommonMJConfig.RoomState > MahTableStage.TS_HuanSanZhang   && v.state ==MahPlayerState.PS_HSZed  ) 
                {
                    //换三张提示亮起来 重连外层处理
                    this.mjPanelSC.SetMJTips( CommonMJConfig.TipsSprite.WaitHuanPai )
                }
                //胡的操作亮不  重连外层处理
                if (v.operate !=null && v.operate.operate!=null   && v.operate.operate.length!=0 ) 
                {
                    // this.mjPanelSC.OnShowHandles( false,v.operate.operate,v.mjId,v.operate.KeGangMjs,v.mjId,false ,v.operate.HuFan)
                    this.mjPanelSC.OnShowHandles( v.operate,false )
                }
                else
                {
                    this.mjPanelSC.HideAllHandle()
                }
                this.mjPanelSC.SetActiveChangeThree(false)
                if ( v.state ==MahPlayerState.PS_UnHSZ  ) 
                {
                    //在换三张状态中
                    MJDispose.SetState(CommonMJConfig.MineCardState.Change)
                    this.mjPanelSC.SetActiveChangeThree(true)
                }
                else if ( v.state ==MahPlayerState.PS_UnDingQue  ) 
                {
                    MJDispose.SetState(CommonMJConfig.MineCardState.Lock)
                    this.mjPanelSC.OnStartSelectLackingMjPanel(v)
                }
            }

            if (v.bZhuang) 
            {
                this.mjmiddleSC.SetTableWheel(cilentPos)    
            }
        }


        // this.roomPlayersBehaviourSC.SetActiveZhuang()
        this.mjGameViewSC.OnSetOutCardDirection(MJTool.PositionToDirection(CommonMJConfig.DirectionCurpos) )
        this.mjmiddleSC.SetCountDown(CommonMJConfig.RestTime)



        for (const [key, val] of Object.entries(CommonMJConfig.MJMemberInfo)) {
            let serverPos = Number(key);
            let cilentPos = MJTool.PositionToDirection(serverPos)
            let v =CommonMJConfig.MJMemberInfo[key] as pb.IMahPlayerData
            //明牌后自己的头像冒火

            if (v.bMingPai) {
                this.mjHeadPlayersSC.SetActivefire_3d(cilentPos,true)
            }

            if (cilentPos==CommonMJConfig.Direction.Bottom) 
            {
                if ( CommonMJConfig.RoomState == MahTableStage.TS_DingQue && v.state == MahPlayerState.PS_UnDingQue  ) //重连定缺
                {
                    this.mjPanelSC.OnTuiJianDingQue(v.quetype)
                }

                if (CommonMJConfig.RoomState > MahTableStage.TS_DingQue) 
                {
                    // Log.w(" SetPlayerReconnect 自己  v  :  ",v)
                    //胡牌提示
                    if (v.data!=null && v.data.length!=0 ) 
                    {
                        //自己
                        if (MJTool.GetIsCanChuPai(v.mjs.length)) 
                        {
                            //胡牌提示
                            if (v.ShowKeHu) {
                                this.mjGameViewSC.SetCommonHuTip(v.data,v.moPaiId)
                            }
                        }
                        else
                        {
                            this.mjPanelSC.RefreshHuTipView(v.data[0])
                        }
                    }
                }
            }
        }

        if ( CommonMJConfig.RoomState == MahTableStage.TS_DingQue   ) //重连定缺
        {
            this.mjPanelSC.SetMJTips( CommonMJConfig.TipsSprite.WaitDingQue )
        }

        if ( CommonMJConfig.RoomState > MahTableStage.TS_DingQue &&  CommonMJConfig.RoomState < MahTableStage.TS_InningOver   ) 
        {
            this.roomViewSC.SetActivePropBtn(true)
            this.mjPanelSC.SetActivejpqBtn(true)
        }
        else if ( CommonMJConfig.RoomState == MahTableStage.TS_HuanSanZhang)
        {
            if (!CommonMJConfig.MjRoomRule.dingQue )
            {
                this.roomViewSC.SetActivePropBtn(true)
                this.mjPanelSC.SetActivejpqBtn(true)
            }
        }
        else if ( CommonMJConfig.RoomState == MahTableStage.TS_FaPai)
        {
            if (!CommonMJConfig.MjRoomRule.dingQue && !CommonMJConfig.MjRoomRule.hsz )//没有换三张和发牌的时候 
            {
                this.roomViewSC.SetActivePropBtn(true)
                this.mjPanelSC.SetActivejpqBtn(true)
            }
        }

        if (CommonMJConfig.LastDaPaiPos!=0) 
        {
            this.mjcplayersSC.OnSetOutCardPointShow(MJTool.PositionToDirection(CommonMJConfig.LastDaPaiPos))
        }

        this.mjGameViewSC.ReconnectPaiQiang();

        let timerItem=  window.setTimeout(()=>{
            Log.w(" SetReconnect  结束 ")
            endFun()
        } , 300);
        this.m_TimerArr.push(timerItem)

    }













    /**
     * @description 重置所有数据
     */
    OnResetCards()
    {

        
        this.mjGameViewSC.OnResetCards();
        this.mjXLThreeTwocplayersSC.ResetPlayer();
        this.StopCoroutineTweenAni();
    }












    OnReS2CMahTestMsg()
    {
        let str = this._input.text;
        let strArr =    str.split(":")
        let optype = Number(strArr[0])
        let arr :number[]=[];

        let strArr2 =  strArr[1].split(",");
        
        for (let index = 0; index < strArr2.length; index++) 
        {
            arr[index]=Number(strArr2[index])
        }
        MJC2SOperation.ReS2CMahTestMsg(optype,arr);

    }























}
