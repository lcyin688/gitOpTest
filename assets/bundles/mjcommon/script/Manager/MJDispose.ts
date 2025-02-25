import { GameConfig } from "../../../gamecommon/script/config/GameConfig";
import { RoomManager } from "../../../gamecommon/script/manager/RoomManager";
import { MJProConfig } from "../Config/MJProConfig";
import { MJTool } from "../logic/MJTool";
import { Tool } from "../../../gamecommon/script/tools/Tool";
import { CommonMJConfig } from "../Config/CommonMJConfig";
import MJOutCard from "../view/MJOutCard";
import { MahTableStage } from "../../../../scripts/def/GameEnums";



export default class MJDispose {

    // //是否是红中杠玩法
    // static SetHaveHongZhongGang(isHZG: boolean) 
    // {
    //     CommonMJConfig.HaveHongZhongGang = isHZG;
    // }

    
    static SetIsWaitBuystate(state: boolean) 
    {
        CommonMJConfig.isWaitBuy = state;
    }

    
    // static SetPoFengstate(state: boolean) 
    // {
    //     CommonMJConfig.poFengstate = state;
    // }

    

    static SetSelfLastPickCard(cardID: number) 
    {
        CommonMJConfig.LastPickCard = cardID;
    }


    static SetSelfMoCard(cardID: number) 
    {
        CommonMJConfig.selfMoCard= cardID
    }

    static SetSelfMoCardIsUp(isUp: boolean) 
    {
        Log.w(" SetSelfMoCardIsUp isUp  : ",isUp);
        CommonMJConfig.selfMoCardIsUp= isUp
    }
    

    static SetLastOutCard(cardItem: MJOutCard) 
    {
        CommonMJConfig.LastOutCard = cardItem
    }

    static SetJiPaiQiTime(time: number) 
    {
        CommonMJConfig.JiPaiQiTime = time
    }



    static SetPropIndex(index: number) {
        CommonMJConfig.PropIndex= index

    }
     /**
      * @description 设置 剩余牌数
      */
      static SetResidueCards(count: number) {
        CommonMJConfig.ResidueCards = count;
    }



    static SetTotalCount(count: number) {
        CommonMJConfig.totalCount = count;
    }


    
     /**
      * @description 设置 胡没胡
      */
    static SetAlreadyHu(_state: boolean) {
        CommonMJConfig.AlreadyHu = _state;
    }


     /**
      * @description 设置 有没有播放过换三张收到服务器之后动画
      */
      static SetEffectResultHSZ(_state: boolean) {
        CommonMJConfig.EffectResultHSZ = _state;
    }


        /**
     * @description 设置 有没有播放过定缺
     */
        static SetEffectResultDQ(_state: boolean) {
        CommonMJConfig.EffectResultDQ = _state;
    }



     /**
      * @description 设置 红中道具使用了没
      */
    static SetUseHongZhongPropState (_state: boolean) {
        if (_state!=null) {
            CommonMJConfig.ISUseHZProp = _state
        }
        else
        {
            CommonMJConfig.ISUseHZProp = false 
        }

    }

     /**
      * @description 设置 是否确认过了大于6张牌的换三张
      */
    static SetSureQueMoreState (_state: boolean) {
        CommonMJConfig.ISUseHZProp = _state
    }

    static SetYuJiShouYi (num: number) {
        CommonMJConfig.yuJiShouYi = num
    }

    

    /**
     * @description 设置 是否确认过了大于6张牌的换三张
     */
        static SetSelfHaoPaiBuHuan (_state: boolean) {
        CommonMJConfig.SelfHaoPaiBuHuan = _state
    }
    

    

     /**
      * @description 设置 缺没缺
      */
    static SetAlreadyQueState(_state: boolean) {
        CommonMJConfig.AlreadyQue = _state;
    }
     /**
      * @description 设置 躺没躺
      */
    static SetAlreadyTang(_state: boolean){
        CommonMJConfig.AlreadyTang = _state;
    }
    /**
     * 
     * @description 设置自己 飞没飞
     */
    static SetSelfAlreadyFei(_state: boolean){
        CommonMJConfig.AlreadyFei =_state
    }

    /**
     * 
     * @description 设置自己 是否是充值阶段 
     */
    static SetReChargeState(_state: boolean){
        CommonMJConfig.ISReCharge =_state
    }



    
























     /**
      * @description 设置 当前状态
      */
    static SetState(statenum :number) {
        // console.trace('statenum statenum ',statenum)
        // Log.w('statenum statenum ',statenum)
        CommonMJConfig.ModelMineState = statenum;
    }
     /**
      * @description 设置 杠操作类型
      */
    static SetOpgangType(_state: number) {
        CommonMJConfig.m_OpgangType = _state;
    }


     /**
      * @description 设置 额外的红中数量
      */
      static SetExtraHZCount(_state: number) {
        CommonMJConfig.extraHZCount = _state;
    }

    /**
      * @description 设置 自己定缺的花色 -1 表示还没有定缺
      */
     static SetMineQueCard(_state: number){
        CommonMJConfig.MineQueCard = _state
    }

    /**
      * @description 设置 房间状态
      */
    static SetRoomState(_state: number,isSet:boolean){
        // Log.e("  SetRoomState _state   ",_state )
        CommonMJConfig.RoomState =_state
        if (isSet) {
            MJDispose.SetPropConfigGameState();
        }

    }



    /**
     * @description 设置 房间状态
     */
    static SetClientZhuangIndex(clientPos: number)
    {
        CommonMJConfig.ClientZhuangIndex =clientPos
    }



    











     /**
      * @description 设置 小结算数据
      */
    static SetMJGameSmallResult(data)
    {
        CommonMJConfig.MjGameSmallResult = data
    }



    static ClearHuTip(){
        CommonMJConfig.huCards = {}
        CommonMJConfig.fanshu = {}
        CommonMJConfig.cardcount = {}

        CommonMJConfig.CurrentOutHandHuTip=null
        CommonMJConfig.CurrentOutHandHuFanShuTip=null
    }


    // //道具控制房间阶段
    static SetPropConfigGameState(){

        if (CommonMJConfig.RoomState ==MahTableStage.TS_WaitForBegin) {
            RoomManager.SetState(RoomManager.StateType.UnReady)
        } 
        else if(CommonMJConfig.RoomState ==MahTableStage.TS_TableUnReady)
        {
            RoomManager.SetState(RoomManager.StateType.UnReady)
        }
        else if(CommonMJConfig.RoomState ==MahTableStage.TS_TableBegin)
        {
            RoomManager.SetState(RoomManager.StateType.Playing)
        }
        else if(CommonMJConfig.RoomState ==MahTableStage.TS_FaPai)
        {
            RoomManager.SetState(RoomManager.StateType.Playing)
        }
        else if(CommonMJConfig.RoomState ==MahTableStage.TS_HuanSanZhang)
        {
            RoomManager.SetState(RoomManager.StateType.Playing)
        }
        else if(CommonMJConfig.RoomState ==MahTableStage.TS_DingQue)
        {
            RoomManager.SetState(RoomManager.StateType.Playing)
        }
        else if(CommonMJConfig.RoomState ==MahTableStage.TS_MoPaiStage)
        {
            RoomManager.SetState(RoomManager.StateType.Playing)
        }
        else if(CommonMJConfig.RoomState ==MahTableStage.TS_ChuPaiStage)
        {
            RoomManager.SetState(RoomManager.StateType.Playing)
        }
        else if(CommonMJConfig.RoomState ==MahTableStage.TS_InningOver)
        {
            RoomManager.SetState(RoomManager.StateType.Resulting)
        }
        else if(CommonMJConfig.RoomState ==MahTableStage.TS_GameOver)
        {
            RoomManager.SetState(RoomManager.StateType.Resulting)
        }
        else if(CommonMJConfig.RoomState ==MahTableStage.TS_InviteWait)
        {
            RoomManager.SetState(RoomManager.StateType.Resulting)
        }
        else if(CommonMJConfig.RoomState ==MahTableStage.TS_Close)
        {
            RoomManager.SetState(RoomManager.StateType.Resulting)
        }
    }











    /**
      * @description 设置 当前能胡的所有牌
      */
    static SetHuTipCards(hucards){
        CommonMJConfig.CurrentHuTip =hucards
    }

    
    /**
      * @description 设置 当前能胡的番数
    */
    static SetHuTipFanShu(fanshus){
        CommonMJConfig.CurrentHuFanShuTip =fanshus
    }


    /**
      * @description 设置 红中的个数
      */
    static SetHZCount(num:number){
        CommonMJConfig.HZTotalCount= num;
    }

    /**
      * @description 设置 是否是血流模式玩法
      */
    static SetXueLiuState(state: boolean){
        CommonMJConfig.ISXueLiu = state
    }

    /**
      * @description 设置 获取是否为定缺花色
      */
    static CheckEqualQue(card){
        if (card!=0) {
            let colour = CommonMJConfig.MahjongID[card].Color;
            return colour == CommonMJConfig.MineQueCard;
        } 
        else
        {
            return true;
        }
    }





    /**
      * @description 获取胡的朝向
      * @param fromPos 点炮的玩家坐标
      * @param huPos   胡牌的玩家坐标
      */
    static HuPositionToDirection(fromPos, huPos){
        let direct = CommonMJConfig.Direction.Bottom;
        let playerCount = RoomManager.tableCommon.playerCount;
        if (playerCount >= 3 ) 
        {
            if (fromPos == huPos - 1 ||  fromPos == huPos + (playerCount - 1)  )
            {
                direct = CommonMJConfig.Direction.Left;
            }else if(fromPos == huPos + 1 ||  fromPos == huPos - (playerCount - 1)  )
            {
                direct = CommonMJConfig.Direction.Right;
            }
            else if (fromPos == huPos + playerCount / 2 || fromPos == huPos - playerCount / 2)
            {
                direct = CommonMJConfig.Direction.Top;
            }
            else
            {
                direct = CommonMJConfig.Direction.Bottom;
            };
        } 
        else // 2人麻将
        {
            if (huPos != huPos ) {
                direct = CommonMJConfig.AltOri.Front;
            }
        }
        return direct;
    }


    /**
      * @description 获取当前卡牌是否打了有叫
      * @param card 打出的牌
      */
    // 
    static GetHuTipState(outCardId):pb.IMahKeHuData
    {
        
        for (let index = 0; index < CommonMJConfig.CurrenMahKeHuDataArr.length; index++) 
        {
            if (outCardId == CommonMJConfig.CurrenMahKeHuDataArr[index].mjId ) //打出这张牌能胡
            {
                return CommonMJConfig.CurrenMahKeHuDataArr[index]
            }
        }
        return null;
    }
    /**
      * @description 获取大牌后胡的牌
      * @param card 打出的牌
      */
    // 
    static GetHuTipFanShuTip(card){
        if (CommonMJConfig.CurrentOutHandHuTip == null) {
            return [[],[], []];
        }
        let zhangshu = [] ;
        if (CommonMJConfig.CurrentOutHandHuTip[card] != null) {
            for (const iterator of CommonMJConfig.CurrentOutHandHuTip[card]) {
                if (iterator==35 ) {
                   zhangshu.splice(zhangshu.length,0,CommonMJConfig.AllCards[iterator] + CommonMJConfig.AllCards[135] );
                }
                else{
                    zhangshu.splice(zhangshu.length,0, CommonMJConfig.AllCards[iterator]);
                }

            }

        }
        let huCards = Tool.Clone(CommonMJConfig.CurrentOutHandHuTip[card])
        let fanshu = Tool.Clone(CommonMJConfig.CurrentOutHandHuFanShuTip[card])
        return [huCards , fanshu, zhangshu];

    }

    /**
      * @description 当前牌型胡的牌
      */
    // 
    static GetCurrentHuCards(){
        let zhangshu:number[] ;
        if( CommonMJConfig.CurrentHuTip != null) {
            
            for (const iterator of CommonMJConfig.CurrentHuTip) {
                if (iterator==35 ) {
                    zhangshu.splice(zhangshu.length,0,CommonMJConfig.AllCards[iterator] + CommonMJConfig.AllCards[135] );
                 }
                 else{
                     zhangshu.splice(zhangshu.length,0, CommonMJConfig.AllCards[iterator]);
                 }
            }
        }
        return CommonMJConfig.CurrentHuTip, CommonMJConfig.CurrentHuFanShuTip, zhangshu;
    }


    /**
      * @description 当前牌是否需要展示危牌Flag
      * @param cardId 
      */
    // 
    static IsNeedShowWeiFlag(cardId){
        let isShow = false;
        if ( CommonMJConfig.AlreadyHu && MJDispose.IsWeiCard(cardId) ){
            isShow =true
        }            
        return isShow

    }

    /**
      * @description 是否是危牌
      * @param cardId 
      */
    // 
    static IsWeiCard(cardId){
        let isWei = false
        //自己的躺牌不用计算
        // Log.e("IsWeiCard  ")
        for (const [key, val] of Object.entries(CommonMJConfig.TangCards)) {
            // Log.e("IsWeiCard : ",key, val)
            let clientPos = Number(key);
            if (clientPos>1 ) {
                if (MJTool.JudgeIsHave(val.HuCards,cardId) &&  MJTool.JudgeIsHave(CommonMJConfig.PoChanClientPos,clientPos)  )
                {
                    isWei = true
                    return isWei
                }
            }
        }

        return isWei
    }


    /**
      * @description 换三张后是否需要添加三张牌
      * @param cardId 
      */
    // 
    static GetIsNeedAddThreed(clientPos){
        let isNeedAdd = true
        for (const [key, val] of Object.entries(CommonMJConfig.HuanSanZhangBuHuanData)) {
            // Log.e("GetIsNeedAddThreed : ",key, val)
            let clientPosTemp = MJTool.PositionToDirection(Number(val) );
            if (clientPosTemp == clientPos)
            {
                isNeedAdd =false
                return isNeedAdd
            }
        }
        return isNeedAdd
    }

    /**
      * @description 是否换过牌了
      * @param cardId 
      */
    // 
    
    static GetIsHuanByPos(pos){
        let isHave = false
        for (const [key, val] of Object.entries(CommonMJConfig.HuanPosData)) {
            // Log.e("GetIsHuanByPos : ",key, val)
            let clientPos = Number(val);
            if (clientPos == pos ) {
                isHave =true
                return isHave
            }
        }
        return isHave
    }

    static SetCurrenMahKeHuDataArrBei(mingBei: number)
    {
        if (CommonMJConfig.CurrenMahKeHuDataArr!=null && CommonMJConfig.CurrenMahKeHuDataArr!=[]) 
        {
            for (let i = 0; i < CommonMJConfig.CurrenMahKeHuDataArr.length; i++) 
            {
        
                for (let c = 0;  c< CommonMJConfig.CurrenMahKeHuDataArr[i].data.length; c++) 
                {
                    let et = CommonMJConfig.CurrenMahKeHuDataArr[i].data[c]
                    
                    let manx = et.mul*mingBei
                    if (manx >CommonMJConfig.MjRoomRule.max_fan ) {
                        manx = CommonMJConfig.MjRoomRule.max_fan
                    }
                    et.mul= manx
                }
            }
        }
    }



}