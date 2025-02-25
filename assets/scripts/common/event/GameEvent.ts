/**@description 游戏内事件 */
export enum GameEvent {
    ENTER_HALL = "GameEvent_Enter_Hall",
    RefreshPlayer = "GameEvent_RefreshPlayer",
    //进入所有界面
    ENTER_GAME = "GameEvent_Enter_GAME",
    //刷新游戏匹配
    RefreshPlayerGameMatch = "GameEvent_RefreshPlayerGameMatch",
    Err_Close_GameList = "Err_Close_GameList",


    Update_PlayerAttr = "Update_PlayerAttr",
    Update_PlayerCurrency = "Update_PlayerCurrency",
    Update_Player = "Update_Player",
    
    //刷新游戏界面
    RefreshGameTable = "RefreshGameTable",

    //玩家加入房间
    ONPLAYERENTERROOMQUAUE = "ONPLAYERENTERROOMQUAUE",

    EnterBundle =  "EnterBundle",

    //UI通奖品弹出界面
    UI_General_Reward = "UI_General_Reward",
    //等级界面领取奖励成功刷新界面
    UI_ACH_RefreshGrade = "UI_ACH_RefreshGrade",
    //打开排位赛季界面
    UI_OpenGrid = "UI_OpenGrid",
    //排行榜界面领取奖励
    UI_Rank_RefreshList = "UI_Rank_RefreshList",
    //玩法界面
    UI_General_WanFa = "UI_General_WanFa",

    //DDZ匹配成功
    DDZ_Match_SUCC = "DDZ_Match_SUCC",

    //大厅快速匹配为了兼容服务器额外处理返回大厅
    Silent_GO_HALL = "Silent_GO_HALL",


    //数据二维数组变化
    GP_Update = "GP_Update_",

    //显示成就界面
    UI_SHOW_ATVIEW = "UI_SHOW_ATVIEW",


    //sdk event
    SDK_CALLID_LOGIN_WX = "SDK_CALLID_LOGIN_WX",
    SDK_CALLID_LOGIN_IOS = "SDK_CALLID_LOGIN_IOS",
    SDK_CALLID_LOGIN_HW = "SDK_CALLID_LOGIN_Huawei",
    SDK_CALLID_LOGIN_OPPO = "SDK_CALLID_LOGIN_Oppo",
    SDK_LBS = "SDK_LBS",
    SDK_CALLID_AD = "SDK_CALLID_AD",
    SDK_CALLID_COMMON = "SDK_CALLID_COMMON",


}
