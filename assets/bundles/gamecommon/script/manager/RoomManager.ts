import { Config, ViewZOrder } from "../../../../scripts/common/config/Config";
import GameData from "../../../../scripts/common/data/GameData";
import { GameEvent } from "../../../../scripts/common/event/GameEvent";
import EnterGameProp from "../../../../scripts/common/fairyui/EnterGameProp";
import ShopView from "../../../../scripts/common/fairyui/ShopView";
import { CmmProto } from "../../../../scripts/common/net/CmmProto";
import { GameService } from "../../../../scripts/common/net/GameService";
import { CurrencyType, GameCat } from "../../../../scripts/def/GameEnums";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";
import { Resource } from "../../../../scripts/framework/core/asset/Resource";
import { LoggerImpl } from "../../../../scripts/framework/core/log/Logger";


export class RoomManager  {
    static get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }
    /** --游戏类型 */
    static gameType: number;

    /** ---自建房,匹配房,比赛场 */
    static RoomCategory = null;
    /** --自己的座位号 */
    static SelfPosition :number;
    // 玩家信息
    static  MemberInfo = { };
    // -- 房间类型 初中高级场
    static roomType :number;
    //桌子id
    static tableId :number;
    // -- 货币类型
    static CurrencyType:number;
    // --房间id
    static roomcfgId :number;
    // -- 玩家数量
    // static playerCount :number = 4;
    // -- 庄的坐标
    static zhuang = 1;
    // --投掷表情冷却
    static lastChatTime = 0;

    // --免输赢翻倍
    static GameEndWelfareType :number;
    // --免输赢翻倍
    static GameEndWelfareParam = 0;
    //第几局
    static curRound = 0;

    // --大结算数据
    static GameFinishResult = null;

    static XiPaiType=0;
    static NaiZiType=0;
    static BalanceCount=0;

    static InRoomPlay=false;

    // --每次大退了游戏需要去显示自动使用的道具
    static isShowAutoProp = {};
    // --每次大退了游戏需要去自动显示 使用道具弹框
    static IsNeedShowProp =true;

    //动画管理器
    static loader3DArray:fgui.GLoader3D[] = [];

    //ReliefTime 救济金弹出延迟时间
    static ReliefTime =0;

    //自己游戏中是否破产
    static SelfIsPoChan = false;

    static StateType = {
        Absent : 0, //不在房间中
        RoomList : 1, //房间列表
        Matching : 2, //匹配中
        UnReady : 3, //还没正式开打
        Playing : 4, //游戏中
        Resulting : 5, //结算中
        SelfHu : 5.5, //自己胡牌
        Compete : 6, //比赛服
        CompeteWaiting : 7, //比赛等待
        CompeteStarting : 8, //比赛开始
        CompeteThrough : 9, //比赛晋级等待
        CompeteMatching : 10, //比赛匹配中
        CompeteResulting : 11, //比赛结算
        BuildRoomWaiting : 12, //自建房等待中
        CompeteGamePlayingResult : 13, //比赛等待游戏结算动画
    }

    static curState: number = RoomManager.StateType.Absent;
    static BiaoQingConfig: cc.JsonAsset = null;


    static tableCommon:pb.ITableCommon=null



    /** 获取状态 */
    static GetRoomState()
    {
        return this.curState;
    }
    /** --设自己破产状态 */
    static SetSelfIsPoChan( state: boolean )
    {
        // Log.e( " SetState  state  :  ",state );
        this.SelfIsPoChan= state;
    }



    static SetState( state: number )
    {
        // Log.e( " SetState  state  :  ",state );
        this.curState= state;
    }

     /**
      * @description 设置救济金是延迟时间
      * @param temp 时间
      */
      static SetReliefTime( temp:number){
        this.ReliefTime= temp;
    }

    //  /**
    //   * @description 设置当前游戏是几人场
    //   * @param temp 时间
    //   */
    //   static SetPlayerCount( temp:number){
    //     this.playerCount= temp;
    // }


    static SetSelfPosition(pos :number)
    {

        Log.e(" SetSelfPosition  pos: ",pos)
        RoomManager.SelfPosition =pos;
    }


    /**
     * @description 通过玩家Guid获取玩家
     * @param playerguid 
     * @returns 
     */
     static GetPlayerByGuid(playerguid: number) 
     {
        for (const [key, val] of Object.entries(RoomManager.MemberInfo))
        {
            // Log.w(" GetPlayerByGuid   ",key ,val)
            let playerData = RoomManager.MemberInfo[key]
            // Log.w(" GetPlayerByGuid   ",playerData)
            if (playerData.player.guid ==playerguid ) 
            {
                return playerData
            }
        }
        return null
     }



    /**
     * @description 通过玩家Guid获取玩家客户端坐标
     * @param playerguid 
     * @returns 
     */
     static GetPlayerClientPosByGuid(playerguid: number) 
     {
        // Log.w(" GetPlayerClientPosByGuid  playerguid  ",playerguid )
        for (const [key, val] of Object.entries(RoomManager.MemberInfo))
        {
            // Log.w(" GetPlayerClientPosByGuid   ",key ,val)
            let playerData = RoomManager.MemberInfo[key]
            // Log.w(" GetPlayerClientPosByGuid   ",playerData)
            // Log.w(" GetPlayerClientPosByGuid  playerData.player.guid  ",playerData.player.guid)

            if (playerData.player.guid ==playerguid ) 
            {
                return this.ConvertLocalIndex(playerData.pos)
            }
        }
        return null
     }

     

    /**
     * @description 通过客户端获取玩家信息
     * @param index 
     * @returns 
     */
    static GetPlayerByIndex(index: number) 
    {

        // Log.e("GetPlayerByIndex  index  : ",index);
        // Log.e("GetPlayerByIndex  RoomManager.MemberInfo  : ",RoomManager.MemberInfo);
        // Log.e("GetPlayerByIndex  this.ConvertServerPos(index)  : ",this.ConvertServerPos(index));
        // Log.e("GetPlayerByIndex  RoomManager.MemberInfo[this.ConvertServerPos(index)]  : ",RoomManager.MemberInfo[this.ConvertServerPos(index)] );

        return RoomManager.MemberInfo[this.ConvertServerPos(index)]
    }

    /**
     * @description 客户端座位转换成服务器座位
     * @param index 
     * @returns 
     */
    static ConvertServerPos(index: number) {

        let gameType = RoomManager.tableCommon.gameType;
        let playerCount = RoomManager.tableCommon.playerCount;
        // Log.e("ConvertServerPos this.SelfPosition : ",this.SelfPosition );
        // Log.e("ConvertServerPos playerCount : ",playerCount );
        // Log.e("ConvertServerPos index : ",index );
        
        if (gameType == GameCat.GameCat_Mah3Ren2Fang) //规则的循环后可以用else
        {
            let serPos = 0;
            if (index == 0) 
            {
                serPos = RoomManager.SelfPosition;
            }
            else if(index == 1 )
            {
                serPos = (RoomManager.SelfPosition+1)%playerCount;
                if (serPos== 0) {
                    serPos = playerCount
                }
            }
            else if(index == 3 )
            {
                serPos = (RoomManager.SelfPosition+2)%playerCount;
                if (serPos== 0) {
                    serPos = playerCount
                }
            }
            // Log.e("ConvertServerPos  009  serPos : ",serPos );
            return serPos
        }
        else
        {
            let pos =index + this.SelfPosition
            if (pos <= playerCount  ) {
                return pos
            }
            else
            {
                return pos - playerCount
            }
        }


    }
    
    /**
     * @description 服务器座位号转客户端座位号
     * @param index 
     * @returns 
     */
    static ConvertLocalIndex(pos:number)
    {
        let playerCount = RoomManager.tableCommon.playerCount;
        // Log.e("ConvertLocalIndex pos   ",pos)
        // Log.e("ConvertLocalIndex playerCount   ",playerCount)
        // Log.e("ConvertLocalIndex RoomManager.SelfPosition   ",RoomManager.SelfPosition)
        let index = pos - RoomManager.SelfPosition;
        let gameType = RoomManager.tableCommon.gameType;
        if (gameType == GameCat.GameCat_Mah3Ren2Fang) //规则的循环后可以用else
        {
            let direct = 0;
            if (playerCount >= 3) 
            {
                if (pos == RoomManager.SelfPosition) 
                {
                    direct = 0;
                }
                else if(pos == RoomManager.SelfPosition - 1 || pos == RoomManager.SelfPosition + (playerCount - 1) )
                {
                    direct = 3;
                }
                else if( pos == RoomManager.SelfPosition + 1 || pos == RoomManager.SelfPosition - (playerCount - 1) )
                {
                    direct = 1;
                }
                else if( pos == RoomManager.SelfPosition + playerCount / 2 || pos == RoomManager.SelfPosition - playerCount / 2 )
                {
                    direct = 2;
                }
    
            } 
            else
            {
                if (pos == RoomManager.SelfPosition)
                {
                    direct = 0;
                } 
                else 
                {
                    direct = 1;
                }
            }
            return direct
        }
        else
        {
            if (index >= 0) {
                return index;
            }
            else
            {
                return  (index + playerCount)
            }
        }


    }


    /**
     * @description 设置庄的服务器位置
     * @param index 
     * @returns 
     */
     static SetZhaungPos(pos:number)
     {
        RoomManager.zhuang=pos;
     }


     static ExitTableFinal()
     {
        // Log.d("OnC2SExitTable",RoomManager.curState ," ", RoomManager.StateType.Resulting);
        RoomManager.OnC2SExitTable()
     }


     //是否是邀请房
     static IsInviteRoom()
     {
         
        let isInvite =false;
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
                        isInvite= true
                        return isInvite
                    }
                }
            }
        }
        return isInvite;

     }


     static NextMatch()
     {
        // 根据携带货币判断，进入下一局匹配或者携带货币不足降低场次指引
        Manager.uiManager.close(EnterGameProp);
        
        let gameType :number
        let cfgId :number
        function ff(params:boolean) 
        {
            // Log.d("Manager.alert ff",params);
            if (params)
            {
                RoomManager.service.nextMatchTable(gameType,cfgId)

                
            }
        }


        function hbbz(params:boolean) 
        {
            Log.d("Manager.alert   hbbz",params);
            if (params)//确认打开商城金币
            {
                Manager.gd.put(ProtoDef.pb.S2CGetShopItems+"Index",{catName:"金币"});
                Manager.uiManager.openFairy({ type: ShopView, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.ShopUI, name: "商城" });
            }
            else //取消退出游戏
            {
                this.ExitTableFinal()
            }
        }


       
        let data =  Manager.dataCenter.get(GameData).get<pb.S2CGetTables >(ProtoDef.pb.S2CGetTables);
        if(data == null){
            // Log.e("房间列表信息没有找到");
            return null;
        }
        let gd = Manager.dataCenter.get(GameData);
        let coin= gd.playerCurrencies(CurrencyType.CT_Coin);
        let current:pb.ITableInfo

        let isInvite = RoomManager.IsInviteRoom()
        //首先如果满足当前场次的话就直接 下一局就好 不满足的时候在去找推荐场次
        // Log.e("NextMatch  data.tables   ：",data.tables)
        // Log.e("NextMatch  RoomManager.tableCommon.catName  ：",RoomManager.tableCommon.catName)
        // Log.e("NextMatch  RoomManager.tableCommon.cfgId  ：",RoomManager.tableCommon.tablecfgId)
        // Log.e("NextMatch  RoomManager.tableCommon.gameType  ：",RoomManager.tableCommon.gameType)
        // Log.e("NextMatch  coin  ：",coin)

        for (let index = 0; index < data.tables.length; index++) {
            let t = data.tables[index];
            if(t.catName == RoomManager.tableCommon.catName){
                //满足情况直接进游戏
                for (let gIndex = 0; gIndex < t.items.length; gIndex++) 
                {
                    const et = t.items[gIndex];
                    if (RoomManager.tableCommon.gameType== et.gameType && RoomManager.tableCommon.tablecfgId== et.cfgId ) 
                    {
                        current =et
                        if(coin >= et.EnterCurrency.first && ( et.EnterCurrency.second == 0 || coin <= et.EnterCurrency.second))
                        {
                            RoomManager.service.nextMatchTable(et.gameType,et.cfgId)
                            return
                        }
                    }
                }
                
                let minScore = 999999999999
                for (let gIndex = 0; gIndex < t.items.length; gIndex++) 
                {
                    const et = t.items[gIndex];
                    if (et.recommCurrency.first< minScore ) 
                    {
                        minScore =et.recommCurrency.first
                    }
                    if(coin >= et.recommCurrency.first && ( et.recommCurrency.second == 0 || coin <= et.recommCurrency.second))
                    {   
                        gameType = et.gameType
                        cfgId = et.cfgId
                        //邀请房中，玩家货币不足时，点击开始或下一局，
                        //给与玩家提示货币不足是否前往充值提示，当玩家点击取消按钮时，玩家返回房间列表界面，点击前往则打开商城金币标签页
                        if (isInvite) // 邀请房只要满足金币下限就可以
                        {
                            if (coin > current.recommCurrency.second) 
                            {
                                RoomManager.service.nextMatchTable(et.gameType,et.cfgId)
                                return;
                            }
                            else
                            {
                                let str ="货币不足是否前往充值?"
                                let cf:AlertConfig=
                                {
                                    title:"提示",
                                    text: str,   
                                    confirmCb: hbbz.bind(this),        
                                    cancelCb: hbbz.bind(this),
                                };
                                Manager.alert.show(cf);
                                return
                            }


                        }
                        else
                        {
                            let str ="货币不足建议您去,"+et.changCiName
                            if (coin > current.recommCurrency.second) 
                            {
                                str ="货币太多建议您去,"+et.changCiName
                            }
                            let cf:AlertConfig=
                            {
                                title:"提示",
                                text: str,   
                                confirmCb: ff.bind(this),        
                                cancelCb: ff.bind(this),
                            };
                            Manager.alert.show(cf);
                            return
                        }
                    }
                }
                if (coin< minScore ) 
                {
                    this.ExitTableFinal()
                }
            }
        }



     }


     static onErrorBackHall(){
        Log.e("数据错误,返回大厅");
    }



     //发送退出游戏消息
     static OnC2SExitTable()
     {
        let gs = Manager.serviceManager.get(GameService) as GameService;
        // Log.w("OnC2SExitTable ",gs);
        if(gs){
            gs.exitTable();
            Log.w("OnC2SExitTable 退出游戏 ")
        }
     }

     //获取到表情表
     static GetBiaoQingConfig():cc.JsonAsset
     {
        if (this.BiaoQingConfig==null) {
            Manager.assetManager.load(Config.BUNDLE_GameCOMMON,"json/CSV_BiaoQing",cc.JsonAsset,null,function(data: Resource.CacheData){
                if(data.data != null){
                    // Log.w( "GetBiaoQingConfig   : ",data.data)
                    this.BiaoQingConfig=data.data as cc.JsonAsset
                }else{
                    Log.d("=====","加载失败");
                }
                return this.BiaoQingConfig
            }.bind(this))
        }
        else
        {
            return this.BiaoQingConfig
        }
     }
    

}
