import GameData from "../../../../scripts/common/data/GameData";
import { GameEvent } from "../../../../scripts/common/event/GameEvent";
import { GameService } from "../../../../scripts/common/net/GameService";
import { GameMessageQuaue } from "../../../../scripts/common/Quaue/GameMessageQuaue";
import { Utils } from "../../../../scripts/common/utils/Utils";
import { GameCat } from "../../../../scripts/def/GameEnums";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";
import { Logic } from "../../../../scripts/framework/core/logic/Logic";
import { RoomManager } from "../../../gamecommon/script/manager/RoomManager";
import { MJEvent } from "../Event/MJEvent";
import MJDispose from "../Manager/MJDispose";


export class MJLogic extends Logic {

    // private view:XlhzMJView = null;
    private view:GameView = null;
    
    private messageQuaue:GameMessageQuaue=null;


    onDestroy(): void {
        this.clearProto();

        this.ClearMessageQuaue();
        Manager.dispatcher.remove(MJEvent.ONRECONNECTGAMEDATA, this);
    }

    protected get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }


    protected registerProto(cmd: any, func: (data: any) => void, isQueue = true) {
        this.register(cmd,func,cmd,isQueue);
    }

    onLoad( gameView : GameView):void{
        super.onLoad(gameView)

        if (this.messageQuaue == null) {
            this.messageQuaue = this.service.GetMessageQuaue();
        }

        //注册网络事件
        //游戏开始
        this.registerProto(ProtoDef.pb.S2CGameBegin, this.onS2CGameBegin);
        //开始发牌
        this.registerProto(ProtoDef.pb.S2CMahFaPai, this.onS2CMahFaPai);
        //开始换三张
        this.registerProto(ProtoDef.pb.S2CMahHSZNotify, this.onS2CMahHSZNotify);
        //换三张结果
        this.registerProto(ProtoDef.pb.S2CMahHSZResult, this.onS2CMahHSZResult);
        //更新玩家状态  换三张 定缺  别人(状态改变) 操作
        this.registerProto(ProtoDef.pb.S2CMahUpdateTableAndPlayerState, this.onS2CMahUpdateTableAndPlayerState);
        //开始定缺
        this.registerProto(ProtoDef.pb.S2CMahDingQueNotify, this.onS2CMahDingQueNotify);
        //定缺结果
        this.registerProto(ProtoDef.pb.S2CMahDingQueResult, this.onS2CMahDingQueResult);
        //出牌
        this.registerProto(ProtoDef.pb.S2CMahChuPai, this.onS2CMahChuPai);
        //摸牌
        this.registerProto(ProtoDef.pb.S2CMahMoPai, this.onS2CMahMoPai);
        //有胡碰杠
        this.registerProto(ProtoDef.pb.S2CMahHasHPG, this.onS2CMahHasHPG);
        //碰杠结果
        this.registerProto(ProtoDef.pb.S2CMahPGResult, this.onS2CMahPGResult);
        //胡 结果
        this.registerProto(ProtoDef.pb.S2CMahHuResult, this.onS2CMahHuResult);
        //小结算
        this.registerProto(ProtoDef.pb.S2CMahInningOverData, this.onS2CMahInningOverData );        
        //破产 充钱
        this.registerProto(ProtoDef.pb.S2CMahGamePoChan, this.onS2CMahGamePoChan );         
        //有操作的玩家 完成了一个操作  优先级高的 操作了 我这边关掉操作框 跳出
        this.registerProto(ProtoDef.pb.S2CMahHPGDone, this.onS2CMahHPGDone );  
        

        //麻将流水
        this.registerProto(ProtoDef.pb.S2CMahLiuShui, this.onS2CMahLiuShui );  
        //麻将提示
        this.registerProto(ProtoDef.pb.S2CMahTiShi, this.onS2CMahTiShi );  
        //麻将提示
        this.registerProto(ProtoDef.pb.S2CMHuPaiTiShi, this.onS2CMHuPaiTiShi );      
        

        //托管结果
        this.registerProto(ProtoDef.pb.S2CMahAuto, this.onS2CMahAuto);
        //麻将使用道具
        this.registerProto(ProtoDef.pb.S2CMahPropResult, this.onS2CMahPropResult);
        

        //金钟罩使用次数
        this.registerProto(ProtoDef.pb.S2CUpdateJinZhongZhao, this.onS2CUpdateJinZhongZhao);
        //玩家明牌
        this.registerProto(ProtoDef.pb.S2CMahMingPai, this.onS2CMahMingPai);
        
        //自己使用摸牌卡提示个成功使用
        this.registerProto(ProtoDef.pb.S2CMahUseMoProp, this.onS2CMahUseMoProp);
        
        //新手推荐
        this.registerProto(ProtoDef.pb.S2CMahBetterMjSuggestion, this.onS2CMahBetterMjSuggestion);


        //重连刷新
        Manager.dispatcher.add(GameEvent.RefreshGameTable, this.OnReconnectGameData, this);
    }







    // 游戏开始
    protected    onS2CGameBegin(data: pb.S2CGameBegin) {
        // Log.w(" 游戏开始  onS2CGameBegin:",data);
        this.messageQuaue.AddFun( (endFun,t)=>{
            Log.w(" 游戏开始 messageQuaue  onS2CGameBegin:",data);
            dispatch(MJEvent.ONSTARTGAME, {data, endFun});
        });
    }

    /** 开始发牌 */
    onS2CMahFaPai(data: pb.S2CMahFaPai) 
    {
        Log.w(" 开始发牌  onS2CMahFaPai:",data);
        MJDispose.SetMJGameSmallResult(null);
        RoomManager.GameFinishResult = null;
        this.messageQuaue.AddFun( (endFun,t)=>{
            Log.w(" 开始发牌 messageQuaue onS2CMahFaPai:",data);
            dispatch(MJEvent.ONS2CMAHFAPAI, {data, endFun});
        });
    }


    /** 开始换三张 */
    onS2CMahHSZNotify(data: pb.S2CMahHSZNotify) 
    {

        // Log.w(" 开始换三张  S2CMahHSZNotify:",data);
        this.messageQuaue.AddFun( (endFun,t)=>{
            Log.w(" 开始换三张 messageQuaue S2CMahHSZNotify:",data);
            dispatch(MJEvent.ONS2CMAHHSZNOTIFY, {data, endFun});
        });
    }


    /** 换三张结果 */
    onS2CMahHSZResult(data: pb.S2CMahHSZResult) 
    {

        // Log.w(" 换三张结果  onS2CMahHSZResult:",data);
        this.messageQuaue.AddFun( (endFun,t)=>{
            Log.w(" 换三张结果 messageQuaue onS2CMahHSZResult:",data);
            dispatch(MJEvent.ONS2CMAHHSZRESULT, {data, endFun});
        });
    }
    
    
    /** 开始定缺 */
    onS2CMahDingQueNotify(data: pb.S2CMahDingQueNotify) 
    {

        // Log.w(" 开始定缺  S2CMahDingQueNotify:",data);
        this.messageQuaue.AddFun( (endFun,t)=>{
            Log.w(" 开始定缺 messageQuaue S2CMahDingQueNotify:",data);
            dispatch(MJEvent.ONS2CMAHDINGQUENOTIFY, {data, endFun});
        });
    }

    /** 定缺结果 */
    onS2CMahDingQueResult(data: pb.S2CMahDingQueResult) 
    {

        // Log.w(" 定缺结果  S2CMahDingQueResult:",data);
        this.messageQuaue.AddFun( (endFun,t)=>{
            Log.w(" 定缺结果 messageQuaue S2CMahDingQueResult:",data);
            dispatch(MJEvent.ONS2CMAHDINGQUERESULT, {data, endFun});
        });
    }
    
    /** 出牌 */
    onS2CMahChuPai(data: pb.S2CMahChuPai) 
    {

        Log.w(" 出牌  S2CMahChuPai :",data);
        this.messageQuaue.AddFun( (endFun,t)=>{
            Log.w(" 出牌 messageQuaue S2CMahChuPai :",data);
            dispatch(MJEvent.ONS2CMAHCHUPAI, {data, endFun});
        });
    }


    /** 摸牌 */
    onS2CMahMoPai(data: pb.S2CMahMoPai) 
    {
        Log.w(" 摸牌  S2CMahMoPai :",JSON.stringify(data));
        this.messageQuaue.AddFun( (endFun,t)=>{
            Log.w(" 摸牌 messageQuaue S2CMahMoPai :",JSON.stringify(data));
            dispatch(MJEvent.ONS2CMAHMOPAI, {data, endFun});
            // endFun();
        });
    }

    /** 可以胡碰杠的时候 */
    onS2CMahHasHPG(data: pb.S2CMahHasHPG) 
    {
        Log.w(" 可以胡碰杠的时候  S2CMahHasHPG :",data);
        this.messageQuaue.AddFun( (endFun,t)=>{
            // Log.w(" 可以胡碰杠的时候 messageQuaue S2CMahHasHPG :",data);
            dispatch(MJEvent.ONS2CMAHHASHPG, {data, endFun});
            endFun();
        });
    }

    
    /** 碰杠结果 */
    onS2CMahPGResult(data: pb.S2CMahPGResult) 
    {
        Log.w(" 胡碰杠结果  S2CMahPGResult :",data);
        this.messageQuaue.AddFun( (endFun,t)=>{
            // Log.w(" 胡碰杠结果 messageQuaue S2CMahPGResult :",data);
            dispatch(MJEvent.ONS2CMAHHPGRESULT, {data, endFun});
            // endFun();
        });
    }


        
    /** 胡的结果 */
    onS2CMahHuResult(data: pb.S2CMahHuResult) 
    {
        Log.w(" 胡结果  S2CMahHuResult :",data ,Manager.utils.milliseconds);
        this.messageQuaue.AddFun( (endFun,t)=>{
            Log.w(" 胡结果 messageQuaue  S2CMahHuResult :",data ,Manager.utils.milliseconds);
            dispatch(MJEvent.ONS2CMAHHURESULT, {data, endFun});
        });
    }

    
    

    /** 小结算 */
    onS2CMahInningOverData(data: pb.S2CMahInningOverData) 
    {
        Log.w(" 小结算  S2CMahInningOverData :",data);
        this.messageQuaue.AddFun( (endFun,t)=>{
            // Log.w(" 小结算 messageQuaue S2CMahInningOverData :",data);
            dispatch(MJEvent.ONS2CMAHINNINGOVERDATA, {data, endFun});
        });
    }






    
    /** 有操作的玩家 完成了一个操作  优先级高的 操作了 我这边关掉操作框 跳出 */
    onS2CMahHPGDone(data: pb.S2CMahHPGDone) 
    {
        Log.w(" 优先级高的 操作了 我这边关掉操作框 跳出  onS2CMahHPGDone :",data);
        this.messageQuaue.AddFun( (endFun,t)=>{
            dispatch(MJEvent.ONS2CMAHHPGDONE, {data, endFun});
            endFun();
        });
    }



    /** 托管结果 */
    onS2CMahAuto(data: pb.S2CMahAuto) 
    {
        Log.w(" 托管结果  onS2CMahAuto json :",JSON.stringify(data));
        this.messageQuaue.AddFun( (endFun,t)=>{
            dispatch(MJEvent.ONS2CMAHAUTO, data);
            endFun();
        });
    }
    
    /** 充值 破产 */
    onS2CMahGamePoChan(data: pb.S2CMahGamePoChan) 
    {
        Log.w("麻将  破产 充值  S2CMahGamePoChan :",data);
        this.messageQuaue.AddFun( (endFun,t)=>{
            dispatch(MJEvent.S2CMAHGAMEPOCHAN, data);
            endFun();
        });
    }

    /** 麻将流水 */
    onS2CMahLiuShui(data: pb.S2CMahLiuShui) 
    {
        Log.w(" 流水  S2CMahLiuShui :",data);
        // this.messageQuaue.AddFun( (endFun,t)=>{
            dispatch(MJEvent.ONS2CMAHLIUSHUI, data.liuShui);
        //     endFun();
        // });
    }


    /** 麻将提示 文字提示 过手胡  改变牌型不能杠  */
    onS2CMahTiShi(data: pb.S2CMahTiShi) 
    {
        Log.w(" 麻将提示  onS2CMahTiShi :",data);
        this.messageQuaue.AddFun( (endFun,t)=>{
            dispatch(MJEvent.S2CMAHTISHI, data);
            endFun();
        });
    }

    /** 麻将提示 */
    onS2CMHuPaiTiShi(data: pb.S2CMHuPaiTiShi) 
    {
        // Log.w(" 麻将胡牌 提示  onS2CMHuPaiTiShi :",data);
        this.messageQuaue.AddFun( (endFun,t)=>{
            // Log.w(" 麻将胡牌 提示 messageQuaue onS2CMHuPaiTiShi :",data);
            dispatch(MJEvent.ONS2CMHUPAITISHI, {data, endFun});
            // endFun();
        });
    }
    

    /** 麻将使用道具 */
    onS2CMahPropResult(data: pb.S2CMahPropResult) 
    {
        Log.w(" 麻将使用道具  S2CMahPropResult :",data ,Manager.utils.milliseconds);
        this.messageQuaue.AddFun( (endFun,t)=>{
            Log.w(" 麻将使用道具 messageQuaue  S2CMahPropResult :",data ,Manager.utils.milliseconds);
            dispatch(MJEvent.S2CMAHPROPRESULT, {data,endFun});
            //endFun();
        });
    }


    /** 麻将自动使用 道具 */
    onS2CMahAutoUseProp(data: pb.S2CMahAutoUseProp) 
    {
        Log.w(" 麻将自动使用道具  onS2CMahAutoUseProp :",data);
        // this.messageQuaue.AddFun( (endFun,t)=>{
        //     // dispatch(MJEvent.ONS2CMAHDINGQUERESULT, {data, endFun});
        //     endFun();
        // });
    }


    /** 更新玩家状态  换三张 定缺  别人(状态改变) 操作 */
    onS2CMahUpdateTableAndPlayerState(data: pb.S2CMahUpdateTableAndPlayerState) 
    {
        Log.w(" 更新玩家状态  换三张 定缺  别人(状态改变) 操作  onS2CMahUpdateTableAndPlayerState :",data);
        this.messageQuaue.AddFun( (endFun,t)=>{
            Log.w(" 更新玩家状态 messageQuaue 换三张 定缺  别人(状态改变) 操作  onS2CMahUpdateTableAndPlayerState :",data);
            dispatch(MJEvent.ONS2CMAHUPDATETABLEANDPLAYERSTATE, {data, endFun});
        });
    }


    /** 金钟罩次数 */
    onS2CUpdateJinZhongZhao(data: pb.S2CUpdateJinZhongZhao) 
    {
        Log.w(" 金钟罩次数  S2CUpdateJinZhongZhao :",data);
        this.messageQuaue.AddFun( (endFun,t)=>{
            dispatch(MJEvent.S2CUPDATEJINZHONGZHAO,data);
            endFun();
        });
    }
    
    
    /** 玩家明牌 */
    onS2CMahMingPai(data: pb.S2CMahMingPai) 
    {
        Log.w(" 玩家明牌  S2CMahMingPai :",data);
        this.messageQuaue.AddFun( (endFun,t)=>{
            dispatch(MJEvent.S2CMAHMINGPAI,data);
            endFun();
        });
    }

    
    /** 自己使用了摸牌卡 */
    onS2CMahUseMoProp(data: pb.S2CMahUseMoProp) 
    {
        Log.w(" 自己使用了摸牌卡  onS2CMahUseMoProp :",data);
        this.messageQuaue.AddFun( (endFun,t)=>{
            dispatch(ProtoDef.pb.S2CMahUseMoProp,data);
            endFun();
        });
    }


    /** 新手推荐 */
    onS2CMahBetterMjSuggestion(data: pb.S2CMahBetterMjSuggestion) 
    {
        Log.w(" 新手推荐  onS2CMahBetterMjSuggestion :",data);
        this.messageQuaue.AddFun( (endFun,t)=>{
            Log.w(" 新手推荐   onS2CMahBetterMjSuggestion :",data);
            dispatch(ProtoDef.pb.S2CMahBetterMjSuggestion,data);
            endFun();
        });
    }
    

    OnReconnectGameData()
    {
        if (this.messageQuaue == null || !this.messageQuaue.use ) {
            this.messageQuaue = this.service.GetMessageQuaue();
        }
        
        dispatch(MJEvent.ONRECONNECTGAMEDATA); 
    }

    syncState(){
        this.service.syncState();
    }

    
    ClearMessageQuaue()
    {
        if (this.messageQuaue != null  ) {
            if (this.service.GetMessageQuaue() !=null) {
                this.service.GetMessageQuaue().ClearFun();
            }
            this.messageQuaue =null;
        }

    }

}
