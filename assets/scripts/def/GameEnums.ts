//auto make,please edit!!!
export enum AchievTargetType {
    AchievTarget_UnDef = 0,
    AchievTarget_PlayCount = 1,
    AchievTarget_ChunTian = 2,
    AchievTarget_FanChun = 3,
    AchievTarget_ZhaDan = 4,
    AchievTarget_LianSheng = 5,
    AchievTarget_Gang = 6,
    AchievTarget_LvyiSe = 7,
    AchievTarget_ShouZhongBaoYi = 8,
    AchievTarget_QuanXiao = 9,
    AchievTarget_QuanZhong = 10,
    AchievTarget_QuanDa = 11,
    AchievTarget_LongQiDui = 12,
    AchievTarget_QuanDaiWu = 13,
    AchievTarget_SiAnke = 14,
    AchievTarget_JiuLianBaoDeng = 15,
    AchievTarget_ShuangLongQiDui = 16,
    AchievTarget_LianQidui = 17,
    AchievTarget_QuanYaoJiu = 18,
    AchievTarget_ShiBaLuoHan = 19,
    AchievTarget_YiSeShuangLongHui = 20,
    AchievTarget_TianHu = 21,
    AchievTarget_DiHu = 22,
    AchievTarget_SanLongQiDui = 23,
    AchievTarget_FeiJi = 24,
    AchievTarget_Mul64More = 25
}
export enum AchievLoop {
    AchievLoop_UnDef = 0,
    AchievLoop_MeiRi = 1,
    AchievLoop_XunHuan = 2
}
export enum AchievReward {
    AchievReward_UnDef = 0,
    AchievReward_RandVal = 1,
    AchievReward_Conf = 2
}
export enum ActOption {
    ActOpt_Null = 0,
    ActOpt_Free = 1,
    ActOpt_Advert = 2,
    ActOpt_GetReward = 3
}
export enum ActivityType {
    ActivityType_Null = 0,
    ActivityType_Login = 1,
    ActivityType_Lottery = 2
}
export enum ActivityState {
    ActivityState_Null = 0,
    ActivityState_Normal = 1,
    ActivityState_Open = 2,
    ActivityState_Close = 3
}
export enum ActCondType {
    ActCondType_Login = 0,
    ActCondType_PlayWin = 1,
    ActCondType_Pay = 2,
    ActCondType_FinishLogin = 4
}
export enum ErrorCode {
    EC_Unknown = 0,
    EC_Ok = 1,
    EC_CoinNotEnough = 10,
    EC_CoinTooMany = 11,
    EC_GemNotEnough = 12,
    EC_HuafeiQuanNotEnough = 13,
    EC_CfgIdErr = 20,
    EC_FuncNotOpen = 21,
    EC_CantHandleMsg = 22,
    EC_SendAuthCodeFail = 23,
    EC_PlayerIsNotExist = 24,
    EC_AdClickTooFast = 40,
    EC_TableNotExists = 50,
    EC_AlreadyInTable = 51,
    EC_TableIsFull = 52,
    EC_TableIsPlaying = 53,
    EC_TableNotExist = 54,
    EC_EmojiNoTimes = 60,
    EC_CurrencyNotEnough = 61,
    EC_CoinLessChatCond = 62,
    EC_ChatMsgTooFast = 63,
    EC_DouFirstMustPlay = 70,
    EC_DouCardTypeErr = 71,
    EC_DouCardLength = 72,
    EC_DouCardLow = 73,
    EC_DouCardNotExist = 74,
    EC_TableNotInviteable = 80,
    EC_TargetPlayerIsPlaying = 81,
    EC_TargetPlayerNotOnline = 82,
    EC_MatchIdNotExist = 83,
    EC_MatchIsFull = 84,
    EC_LessThanSafeBoxMinLimit = 90,
    EC_MoreThanSafeBoxMaxLimit = 91,
    EC_MoreThanCoinCurrencyLimit = 92,
    EC_LessThanRetainLimit = 93,
    EC_PlayCantInSafeBox = 94,
    EC_PlayCantOutSafeBox = 95,
    EC_IdNumberError = 100,
    EC_LessThan16 = 101,
    EC_NameIllegal = 102,
    EC_Lt18LoginTimeError = 103,
    EC_Lt18PlayTimeout = 104,
    EC_PasswordIllegal = 110,
    EC_CantExitInGame = 111,
    EC_ShopDayBuyLimit = 120,
    EC_LessThan18CantBuy = 121,
    EC_AdTimesNotReach = 122,
    EC_HasTypeItem = 123,
    EC_UsePropErrRestMjs = 127,
    EC_UsePropErr = 128,
    EC_UsePropErrHued = 129,
    EC_UsePropDayLimit = 130,
    EC_UsePropGameTableErr = 131,
    EC_BuyRetainNotEnough = 132,
    EC_UsePropRoundLimit = 133,
    EC_UsePropSwapFail = 134,
    EC_UsePropHaiDiFail = 135,
    EC_UsePropRuYiFail = 136,
    EC_UsePropUsed = 137,
    EC_UsePropMoPaiFail = 138,
    EC_UsePropHaiDiUnXiaJiao = 139,
    EC_UsePropSeeFinalCardFail = 160,
    EC_GetMoneyNotEnough = 140,
    EC_GetMoneyRemainNotEnough = 141,
    EC_GetMoneyAdNotEnough = 142,
    EC_GetMoneyInviteNotEnough = 143,
    EC_GetMoneyOtherPlayTimeNotEnough = 144,
    EC_AdvertGetLimit = 150,
    EC_ActNotExist = 200,
    EC_ActNotOpen = 201,
    EC_ActFreeTimesNot = 202,
    EC_ActAdvertTimesNot = 203,
    EC_RewardAlreadyGeted = 204,
    EC_RewardNotReach = 205,
    EC_ActOpTypeError = 206,
    EC_ActSubIdError = 207,
    EC_PoChanErrCountLimit = 220,
    EC_ScoreTopRewardNotReach = 230,
    EC_ScoreTopRewardAlreadyGet = 231,
    EC_RetScoreNotEnough = 232,
    EC_WithdrawMoreThan200 = 233,
    EC_WxCodeIsInvalid = 234,
    EC_VipRewardNotReach = 240,
    EC_VipRewardAlreadyGet = 241,
    EC_VipDayRewardAlreadyGet = 242,
    EC_ServerWillShutdown = 10000,
    EC_ErrorGobackHall = 10001,
    EC_GameServerMaintain = 10002
}
export enum AdRewardType {
    AdRewardType_UnDef = 0,
    AdRewardType_0Buy = 1,
    AdRewardType_WinFanBei = 2,
    AdRewardType_MianShu = 3,
    AdRewardType_Achiev = 4,
    AdRewardType_Grade = 5,
    AdRewardType_DuanWei = 6,
    AdRewardType_SaiJi = 7,
    AdRewardType_ZhuanPan = 8,
    AdRewardType_QianDao = 9,
    AdRewardType_ShiDuan = 10,
    AdRewardType_GuaJi = 11,
    AdRewardType_PoChan = 12,
    AdRewardType_HuaFei = 13,
    AdRewardType_AdReward = 14
}
export enum AdRewardState {
    AdRewardState_Close = 0,
    AdRewardState_VideoSucc = 1
}
export enum AdSdkType {
    AdSdkType_Null = 0,
    AdSdkType_Ylh = 1,
    AdSdkType_Pangle = 2,
    AdSdkType_Bqt = 3,
    AdSdkType_Ks = 4,
    AdSdkType_Hw = 5,
    AdSdkType_Oppo = 6,
    AdSdkType_XiaoMi = 7,
    AdSdkType_Share = 10
}
export enum AdFuncId {
    Ad_Null = 0,
    Ad_MatchEnter = 100,
    Ad_NoLose = 110,
    Ad_WinMore = 111,
    Ad_AdReward = 112,
    Ad_LevelReward = 120,
    Ad_TaskReward = 121,
    Ad_RankListReward = 122,
    Ad_Lottery = 123,
    Ad_Relief = 124,
    Ad_OnlineReward = 125,
    Ad_TimedLogin = 126,
    Ad_FreeCoin = 127,
    Ad_FreeProp = 128,
    Ad_SignIn = 129,
    Ad_HfExchange = 132,
    Ad_PoChanfuhuo = 133,
    Ad_SeasonReward = 134,
    Ad_DuanweiReward = 135
}
export enum PlayerAttr {
    PA_Null = 0,
    PA_Gender = 1,
    PA_Grade = 2,
    PA_Exp = 3,
    PA_PortBorder = 4,
    PA_AccountType = 5,
    PA_TotalPlay = 6,
    PA_TotalWin = 7,
    PA_Inviter = 8,
    PA_Birthday = 9,
    PA_TrueNameAuth = 10,
    PA_HideInfo = 11,
    PA_ProvId = 12,
    PA_CityId = 13,
    PA_DistId = 14,
    PA_VipLevel = 15,
    PA_SeasonNum = 20,
    PA_SafeBox = 30,
    PA_TotalAdTimes = 35,
    PA_TotalInvite = 36,
    PA_ConsumeAdTimes = 37,
    PA_ConsumeInvite = 38,
    PA_Cash = 40,
    PA_CashShow = 41,
    PA_BeginnerMoney = 42,
    PA_TotalWithDraw = 43,
    PA_TotalPhoneRecharge = 44,
    PA_DayAmount = 50,
    PA_WeekAmount = 51,
    PA_MonthAmount = 52,
    PA_YearAmount = 53,
    PA_TotalAmount = 54,
    PA_DayScore = 60,
    PA_WeekScore = 61,
    PA_MonthScore = 62,
    PA_YearScore = 63,
    PA_VipDayReward = 70,
    PA_PlayDesk = 75,
    PA_SepVal = 10000,
    PA_InitPkgType = 10001,
    PA_TrueNameAuthRewardGet = 10005,
    PA_OnLineTime = 10010,
    PA_PkgType = 10011,
    PA_NppaStatus = 10012,
    PA_TotalPay = 10013,
    PA_LastMailId = 10014,
    PA_GiveBeginnerMoney = 10015,
    PA_AiGameCat = 10030,
    PA_AiCat = 10031,
    PA_AiZnLevel = 10032,
    PA_AiGroup = 10033,
    PA_MatchTimes = 10034,
    PA_RaceTimes = 10035,
    PA_LastMjCfgId = 10036,
    PA_LogoffState = 10037
}
export enum CfgType {
    CfgType_Null = 0,
    CfgType_SafeBoxStep = 1,
    CfgType_SafeBoxInLimit = 2,
    CfgType_SafeBoxInRetainCoin = 3,
    CfgType_AdGetBombCardTimes = 4,
    CfgType_AdGetHongZhongCardTimes = 5,
    CfGType_DayGiveBeginnerMoney = 6,
    CfgType_AdGetDayMaxHfq = 7,
    CfgType_GetMoneyVal = 8,
    CfgType_PhoneRechargeMin = 9,
    CfgType_PhoneRechargeMax = 10,
    CfgType_BeginnerTotalMoney = 11,
    CfgType_NoLoseTimes = 12,
    CfgType_WinMoreTimes = 13,
    CfgType_WinMultiple = 14
}
export enum ChatType {
    ChatType_ShortcutText = 0,
    ChatType_Emoji = 1,
    ChatType_Ani = 2
}
export enum CurrencyType {
    CT_Null = 0,
    CT_Coin = 1,
    CT_Gem = 2,
    CT_HuafeiQuan = 3,
    CT_RMB = 4,
    CT_HfqCash = 5
}
export enum ClientDeviceType {
    CDT_Unknown = 0,
    CDT_IOS = 1,
    CDT_Android = 2,
    CDT_WebPlayer = 3,
    CDT_Windows = 4,
    CDT_MacOS = 5
}
export enum PlayerLoc {
    PlayerLoc_Lobby = 0,
    PlayerLoc_Game = 1
}
export enum DouPhase {
    DouPhase_Wait = 0,
    DouPhase_Starting = 1,
    DouPhase_DealCard = 2,
    DouPhase_Landlord = 3,
    DouPhase_Double = 4,
    DouPhase_Play = 5,
    DouPhase_Settle = 6,
    DouPhase_Ended = 7
}
export enum DouDoubleType {
    DouDouble_None = 0,
    DouDouble_Double = 1,
    DouDouble_Super = 2,
    DouDouble_Null = -1
}
export enum SpringType {
    SpringType_None = 0,
    SpringType_Spring = 1,
    SpringType_Inverse = 2
}
export enum DouColorType {
    DouColor_Spade = 0,
    DouColor_Heart = 1,
    DouColor_Club = 2,
    DouColor_Diamond = 3
}
export enum DouPoint {
    DouPoint_Null = 0,
    DouPoint_J = 11,
    DouPoint_Q = 12,
    DouPoint_K = 13,
    DouPoint_A = 14,
    DouPoint_2 = 15,
    DouPoint_SJoker = 16,
    DouPoint_MJoker = 17
}
export enum DouCardType {
    DouCardType_Null = 0,
    DouCardType_Single = 1,
    DouCardType_Pair = 2,
    DouCardType_Third = 3,
    DouCardType_Bomb = 4,
    DouCardType_Sequence = 5,
    DouCardType_LinkPair = 6,
    DouCardType_Airplane = 7,
    DouCardType_ThirdSingle = 8,
    DouCardType_ThirdPair = 9,
    DouCardType_AirplaneSingle = 10,
    DouCardType_AirplanePair = 11,
    DouCardType_BombSingle = 12,
    DouCardType_BombPair = 13,
    DouCardType_Rocket = 14,
    DouCardType_BombLink = 15
}
export enum DouWinType {
    DouWin_Null = 0,
    DouWin_Landlord = 1,
    DouWin_Peasant = 2
}
export enum GameCat {
    GameCat_Null = 0,
    GameCat_Dou = 1001,
    GameCat_Mahjong = 3001,
    GameCat_Mah3Ren2Fang = 3002,
    GameCat_TuiDaoHuMah = 4001
}
export enum GameEndGiftType {
    GEGT_Null = 0,
    GEGT_NoLose = 1,
    GEGT_WinMore = 2
}
export enum GoodsType {
    GoodsType_Null = 0,
    GoodsType_Coin = 1,
    GoodsType_Gem = 2,
    GoodsType_HuaFeiQuan = 3,
    GoodsType_Sep = 10,
    GoodsType_PortBorder = 11
}
export enum GroupId {
    GI_Null = 0,
    GI_PlayTimes = 1,
    GI_WinTimes = 2,
    GI_EmojiTimes = 5,
    GI_ShopBuyTimes = 6,
    GI_ShopBuyDonate = 11,
    GI_ZeroBuyAdTimes = 8,
    GI_Mail = 7,
    GI_MacthTimes = 9,
    GI_Comm = 10,
    GI_Dou = 12,
    GI_Mj = 14,
    GI_RedDot = 15,
    GI_SeasonScore = 20,
    GI_SeasonDuanWei = 21,
    GI_SeasonDuanWeiReward = 22,
    GI_SeasonRank = 23,
    GI_SeasonHint = 24,
    GI_SeasonAreaId = 25,
    GI_SeasonReward = 26,
    GI_SeasonHighestRank = 30,
    GI_SeasonHighestDuanWei = 31,
    GI_SeasonHighestScore = 32,
    GI_SeasonHighestAreaId = 33,
    GI_GradeReward = 40,
    GI_RankData = 50,
    GI_RankRedDot = 51,
    GI_RankGetedReward = 52,
    GI_RankNum = 53,
    GI_UsePropNotInTable = 60,
    GI_UsePropTimes = 61,
    GI_AutoUseItem = 62,
    GI_GetMoneyUseAdTimes = 70,
    GI_GetMoneyUseInvite = 71,
    GI_PoChanInfo = 75,
    GI_ActLotteryFreeTimes = 80,
    GI_ActLotteryAdvertTimes = 81,
    GI_ActContLoginBack = 82,
    GI_ActProgress = 83,
    GI_ActContLoginRewardState = 84,
    GI_ActRedDot = 85,
    GI_ActState = 86,
    GI_ActCurDay = 87,
    GI_ActCurRound = 88,
    GI_SeasonRound = 1000,
    GI_DayScore = 100,
    GI_WeekScore = 101,
    GI_MonthScore = 102,
    GI_YearScore = 103,
    GI_DayPay = 104,
    GI_WeekPay = 105,
    GI_MonthPay = 106,
    GI_YearPay = 107,
    GI_DayScoreRewardState = 108,
    GI_WeekScoreRewardState = 109,
    GI_MonthScoreRewardState = 110,
    GI_YearScoreRewardState = 111,
    GI_DayPayScore = 114,
    GI_WeekPayScore = 115,
    GI_MonthPayScore = 116,
    GI_YearPayScore = 117,
    GI_VipReward = 130,
    GI_SepVal = 10000,
    GI_LuckyVal = 10001,
    GI_AIGameInit = 10002,
    GI_Relief = 10003,
    GI_LuckyValInit = 10004,
    GI_SeasonRankDate = 10005,
    GI_ActFirstJoinTime = 10006,
    GI_ActLastJoinTime = 10007,
    GI_FakeServerTime = 10009,
    GI_AchievStage = 10060,
    GI_AchievState = 10061,
    GI_AchievGroupVal = 10062,
    GI_AChievCD = 10063,
    GI_AchievInfo = 10064,
    GI_AchievAdCout = 10065,
    GI_AchievAdGetCount = 10067,
    GI_GuaJiInfo = 10070,
    GI_ShiDuanCoin = 10071,
    GI_ShiDuanState = 10072,
    GI_AdRewardSaveVal = 10074,
    GI_AdRewardInfo = 10075,
    GI_ZhanJi = 10076,
    GI_ShowBox = 10077
}
export enum CommSubID {
    CommSubID_Null = 0,
    CommSubID_ResetTime = 1,
    CommSubID_NoLoseTimes = 2,
    CommSubID_WinMultipleTimes = 3,
    CommSubID_GradeReward = 4,
    CommSubID_AdBombCard = 5,
    CommSubID_AdHongZhongCard = 6,
    CommSubID_Train = 7,
    CommSubID_RankDate = 8,
    CommSubID_AchievRed = 21,
    CommSubID_YinLiuRewardState = 22
}
export enum MailSubID {
    MailSubID_Null = 0,
    MailSubID_MailRedDot = 1
}
export enum DouSubID {
    DouSubID_Null = 0,
    DouSubID_RecordExpireTime = 1,
    DouSubID_BombCard = 2,
    DouSubID_WinStreak = 8
}
export enum MahSubID {
    MahSubID_Null = 0,
    MahSubID_JiPaiQiRestTime = 1,
    MahSubID_IsNew = 2,
    MahSubID_PlayerTime = 3,
    MahSubID_YinDao = 4
}
export enum RewardState {
    RewardState_Null = 0,
    RewardState_Reach = 1,
    RewardState_Geted = 2,
    RewardState_Back = 3
}
export enum AchievSubId {
    AchievSubId_Null = 0,
    AchievSubId_LianWin = 1
}
export enum PoChanSubId {
    PoChanSubId_UnDef = 0,
    PoChanSubId_AddGem = 1,
    PoChanSubId_DayFreeCount = 2,
    PoChanSubId_DayAdCount = 3,
    PoChanSubId_InningFreeCount = 4,
    PoChanSubId_InningAdCount = 5
}
export enum ActSubID {
    ActSubID_Unknown = 0,
    ActSubID_IN = 1,
    ActSubID_Finish = 2,
    ActSubID_Abort = 3
}
export enum GuaJiSubId {
    GuaJiSubId_cfgId = 0,
    GuaJiSubId_coin = 1,
    GuaJiSubId_RestTime = 2
}
export enum GsCat {
    GsCat_Normal = 0,
    GsCat_Rank = 1
}
export enum MahTableStage {
    TS_WaitForBegin = 0,
    TS_TableUnReady = 1,
    TS_TableBegin = 2,
    TS_FaPai = 3,
    TS_HuanSanZhang = 4,
    TS_DingQue = 5,
    TS_CalcIng = 6,
    TS_MoPaiStage = 7,
    TS_ChuPaiStage = 8,
    TS_InningOver = 9,
    TS_GameOver = 10,
    TS_InviteWait = 11,
    TS_Close = 12
}
export enum MahPlayerState {
    PS_UnReady = 0,
    PS_Ready = 1,
    PS_MoPaiing = 2,
    PS_ChuPaiing = 3,
    PS_FaPaiing = 4,
    PS_UnHSZ = 5,
    PS_HSZed = 6,
    PS_UnDingQue = 7,
    PS_DingQueed = 8,
    PS_UnableOperate = 11,
    PS_Operateing = 12,
    PS_PoChan = 15,
    PS_GameOver = 16,
    PS_ChongZhi = 17,
    PS_GiveUp = 21,
    PS_Leave = 22
}
export enum MahColor {
    CL_Wan = 0,
    CL_Tong = 1,
    CL_Tiao = 2,
    CL_Zi = 3,
    CL_Other = 13
}
export enum MahId {
    MJ_Id_Null = 0,
    Wan1 = 1,
    Wan2 = 2,
    Wan3 = 3,
    Wan4 = 4,
    Wan5 = 5,
    Wan6 = 6,
    Wan7 = 7,
    Wan8 = 8,
    Wan9 = 9,
    Tong1 = 11,
    Tong2 = 12,
    Tong3 = 13,
    Tong4 = 14,
    Tong5 = 15,
    Tong6 = 16,
    Tong7 = 17,
    Tong8 = 18,
    Tong9 = 19,
    Tiao1 = 21,
    Tiao2 = 22,
    Tiao3 = 23,
    Tiao4 = 24,
    Tiao5 = 25,
    Tiao6 = 26,
    Tiao7 = 27,
    Tiao8 = 28,
    Tiao9 = 29,
    ZiHongZhong = 35,
    FuKaHongZhong = 135
}
export enum MahHSZType {
    HSZ_ClockWise = 0,
    HSZ_AntiClockWise = 1,
    HSZ_OppoSiteSide = 2
}
export enum MahHPGOPerate {
    HPG_Guo = 0,
    HPG_Hu = 1,
    HPG_Peng = 2,
    HPG_DianGang = 4,
    HPG_BuGang = 8,
    HPG_AnGang = 16
}
export enum MahQiangGangState {
    QGS_Normal = 0,
    QGS_HasQiangGang = 1,
    QGS_NoQiangGang = 2,
    QGS_BackToPeng = 3
}
export enum MahHu {
    Hu_UnHu = 0,
    Hu_PingHu = 1,
    Hu_JinGouDiao = 2,
    Hu_YiBanGao = 3,
    Hu_ShuangAnKe = 4,
    Hu_QuanZhong = 5,
    Hu_QiDui = 6,
    Hu_GangShangPao = 7,
    Hu_SanJieGao = 8,
    Hu_QuanXiao = 9,
    Hu_DaYuWu = 10,
    Hu_YaoJiu = 11,
    Hu_QuanYaoJiu = 12,
    Hu_YiTiaoLong = 13,
    Hu_ShiErJinChai = 14,
    Hu_SuHu = 15,
    Hu_QuanDa = 16,
    Hu_DuanYaoJiu = 17,
    Hu_TuiBuDao = 18,
    Hu_BenJin = 19,
    Hu_JiuLianBaoDeng = 20,
    Hu_DanDiao = 21,
    Hu_SiJieGao = 22,
    Hu_QiangTiHu = 23,
    Hu_DiHu = 24,
    Hu_ZiMo = 25,
    Hu_YiSeShuangLongHui = 26,
    Hu_WuXingBaGua = 27,
    Hu_ZhuoWuKui = 28,
    Hu_HaiDiLaoYue = 29,
    Hu_MenQing = 30,
    Hu_QingYiSe = 31,
    Hu_SiAnKe = 32,
    Hu_TianHu = 33,
    Hu_SanLongQiDui = 34,
    Hu_LiuLianShun = 35,
    Hu_ShuangLongQiDui = 37,
    Hu_BuQiuRen = 38,
    Hu_LianQiDui = 39,
    Hu_ShouZhongBaoYi = 40,
    Hu_LaoSaoPei = 41,
    Hu_JiangDui = 42,
    Hu_ShuangTongKe = 43,
    Hu_ShiBaLuoHan = 44,
    Hu_KanZhang = 45,
    Hu_BaiWanShi = 46,
    Hu_DuiDuiHu = 47,
    Hu_BianZhang = 48,
    Hu_GangShangHua = 49,
    Hu_HongZhongDiao = 50,
    Hu_QuanDaiWu = 51,
    Hu_XiaoYuWu = 52,
    Hu_QuanShuangKe = 53,
    Hu_LongQiDui = 54,
    Hu_LvYiSe = 55,
    Hu_MiaoShouHuiChun = 56,
    Hu_QiangGangHu = 57,
    Hu_SanAnKe = 58,
    Hu_HongZhongGang = 59,
    Hu_MingPai = 60,
    Hu_WuHuSiHai = 61,
    Hu_TianLongBaBu = 62,
    Hu_XianHeZhiLu = 63,
    Hu_KaiMenJianShan = 64,
    Hu_ChangEBengYue = 65,
    Hu_BaiNiaoChaoFeng = 66,
    Hu_YouRenYouYu = 67,
    Hu_YiTongJiangShan = 68,
    Hu_WanMeiQingRenJie = 69,
    Hu_DianDaoQianKun = 70,
    Hu_JiuWuZhiZun = 71,
    Hu_ShiQuanShiMei = 72
}
export enum MahScoreReason {
    SR_UnDefine = 0,
    SR_Hu = 1,
    SR_DianGang = 2,
    SR_BuGang = 3,
    SR_AnGang = 4,
    SR_HuJiaoZhuanYi = 5,
    SR_DaJiao = 6,
    SR_HuaZhu = 7,
    SR_TuiSui = 8
}
export enum MahPoChanReason {
    PCR_Null = 0,
    PCR_PoChan = 1,
    PCR_ChongZhi = 2,
    PCR_FuHuo = 3,
    PCR_GiveUp = 4
}
export enum MahActionTime {
    MAT_Null = 0,
    MAT_KaiJuDongHua = 1001,
    MAT_FaPai = 1002,
    MAT_HSZ = 1003,
    MAT_DingQue = 1004,
    MAT_MoPai = 1005,
    MAT_DaPai = 1006,
    MAT_HuJiaoZhuanYi = 1007,
    MAT_HuaZhu = 1008,
    MAT_DaJiao = 1009,
    MAT_TuiShui = 1010,
    MAT_InningOver = 1011,
    MAT_Hu = 1012,
    MAT_Peng = 1013,
    MAT_Gang = 1014,
    MAT_PoFeng = 1015,
    MAT_GangShangHua = 1016
}
export enum MahExtraLiuShuiType {
    ELS_Null = 0,
    ELS_DaDanDiao = 1
}
export enum MahErrCode {
    MahErr_Sccuess = 0,
    MahErr_HSZHuaSeErr = 1,
    MahErr_HSZCountErr = 2,
    MahErr_UnableOpearte = 3,
    MahErr_Operated = 4,
    MahErr_UnableDaPai = 5
}
export enum MahTiShi {
    GuoShuiBuHu = 0,
    BuNengGang = 1
}
export enum MailState {
    MailState_UnRead = 0,
    MailState_Read = 1,
    MailState_GetAtt = 2
}
export enum MoneyType {
    MT_Null = 0,
    MT_Beginner = 1
}
export enum GetMoneyType {
    GMT_Null = 0,
    GMT_WithDraw = 1,
    GMT_PhoneCharge = 2
}
export enum GetMoneyState {
    GetMoneyState_Null = 0,
    GetMoneyState_Succ = 1,
    GetMoneyState_Fail = 2,
    GetMoneyState_Process = 3
}
export     enum TabType {
        Null = 0,
        Act = 1,
        Notice = 2,
        NotShow = 3
    }
export enum NoticeType {
    NoticeType_Null = 0,
    NoticeType_Login = 1,
    NoticeType_Rolling = 2
}
export enum RollingNoticeType {
    RNT_Null = 0,
    RNT_System = 1,
    RNT_Game = 2
}
export enum NoticeState {
    NS_effectiveTime = 0,
    NS_Open = 1,
    NS_Close = 2
}
export enum NoticeTarget {
    NT_Url = 0,
    NT_Uuid = 1
}
export enum OrderState {
    OS_Null = 0,
    OS_Succ = 1,
    OS_Fail = 2,
    OS_Process = 3,
    OS_Audit = 4,
    OS_AuditFail = 5
}
export enum IapType {
    IapType_Null = 0,
    IapType_WeiXin = 1,
    IapType_Apple = 2,
    IapType_Alipay = 3,
    IapType_HuaWei = 4,
    IapType_Oppo = 5,
    IapType_Vivo = 6,
    IapType_WeiXinVp = 7,
    IapType_MI = 8
}
export enum PkgType {
    PkgType_Test = 0,
    PkgType_Apple = 1,
    PkgType_HuaWei = 2,
    PkgType_WeiXinH5 = 3,
    PkgType_DouYinH5 = 5,
    PkgType_TMallH5 = 6,
    PkgType_Oppo = 7,
    PkgType_Vivo = 8,
    PkgType_NormalH5 = 9,
    PkgType_Normal = 10,
    PkgType_TestH5 = 11,
    PkgType_MI = 12
}
export enum PoChanRewardType {
    PoChanReward_Free = 0,
    PoChanReward_Ad = 1,
    PoChanReward_Gem = 2,
    PoChanReward_HuaFeiQuan = 3
}
export enum PoChanTable {
    PoChanTable_None = 0,
    PoChanTable_JJJ = 1,
    PoChanTable_PoChan = 2,
    PoChanTable_TuiJian = 3
}
export enum PropType {
    PropType_Null = 0,
    PropType_Currency = 1,
    PropType_ChatEmoji = 2,
    PropType_ChatAni = 3,
    PropType_PortFrame = 10,
    PropType_Desk = 11,
    PropType_HongZhongCard = 100,
    PropType_SilverSwapCard = 101,
    PropType_GoldSwapCard = 102,
    PropType_SuperSwapCard = 103,
    PropType_FixColorCard = 104,
    PropType_HaiDiLaoYue = 105,
    PropType_YanQueCard = 106,
    PropType_RuYiCard = 107,
    PropType_SwapColorCard = 108,
    PropType_PoFengCard = 114,
    PropType_JiPaiQi = 115,
    PropType_FinalCard = 109,
    PropType_BombCard = 110,
    PropType_RecordCard = 111,
    PropType_ViewOther = 112,
    PropType_SuperDouble = 113
}
export enum MatchState {
    MatchState_Null = 0,
    MatchState_WaitGame = 1,
    MatchState_WaitEnd = 2
}
export enum ThroughtState {
    Through_Wait = 0,
    Through_Succ = 1,
    Through_Fail = 2
}
export enum ChampionTimesType {
    ChampionTimesType_Null = 0,
    ChampionTimesType_RealTime = 1,
    ChampionTimesType_Normal = 2
}
export enum RaceLoopType {
    RaceLoopType_Null = 0,
    RaceLoopType_Loop = 1,
    RaceLoopType_Single = 2,
    RaceLoopType_LoopEveryday = 3
}
export enum RaceStartRule {
    RaceStartRule_Null = 0,
    RaceStartRule_Arrive = 1,
    RaceStartRule_Time = 2
}
export enum RaceType {
    RaceType_Null = 0,
    RaceType_Gold = 1,
    RaceType_CallCharge = 2,
    RaceType_RealObject = 3,
    RaceType_Normal = 4,
    RaceType_Appointment = 5,
    RaceType_RedEnv = 6,
    RaceType_GoldRob = 7
}
export enum RaceRule {
    RaceRule_Null = 0,
    RaceRule_PlayOut = 1,
    RaceRule_FixRoundScore = 2
}
export enum RacePhase {
    Phase_Null = 0,
    Phase_Audition = 1,
    Phase_Preliminary = 2,
    Phase_Semi = 3,
    Phase_Semifinal = 4,
    Phase_Final = 5
}
export enum RaceState {
    RaceState_Null = 0,
    RaceState_Enroll = 1,
    RaceState_Play = 2,
    RaceState_End = 3,
    RaceState_Fail = 4
}
export enum EnrollNeedType {
    ENT_Null = 0,
    ENT_Level = 1,
    ENT_DanLevel = 2,
    ENT_Vip = 3,
    ENT_Coin = 4,
    ENT_Gem = 5,
    ENT_HuafeiQuan = 6
}
export enum RankCat {
    RankCat_Null = 0,
    RankCat_Coin = 1,
    RankCat_WinCoin = 2,
    RankCat_PlayTimes = 3,
    RankCat_Multiples = 4
}
export enum RedDotId {
    RedDotId_Null = 0,
    RedDotId_Mail = 1,
    RedDotId_Shop = 2,
    RedDotId_RankList = 3,
    RedDotId_SignIn = 4,
    RedDotId_Lottery = 5,
    RedDotId_Bag = 6,
    RedDotId_Money = 7,
    RedDotId_Achiev = 8,
    RedDotId_Act = 9,
    RedDotId_TimedLogin = 10,
    RedDotId_Set = 11
}
export enum ScoreType {
    ST_Null = 0,
    ST_Day = 1,
    ST_Week = 2,
    ST_Month = 3,
    ST_Year = 4
}
export     enum State {
        Offline = 0,
        Playing = 1,
        Idle = 2
    }
export enum AreaId {
    AreaId_Null = 0,
    AreaId_Nation = -1
}
export enum AreaUnit {
    AreaUnit_Null = 0,
    AreaUnit_Nation = 1,
    AreaUnit_Province = 2,
    AreaUnit_City = 3
}
export enum SeasonState {
    SeasonState_Null = 0,
    SeasonState_Run = 1,
    SeasonState_End = 2,
    SeasonState_Wait = 3
}
export enum BuyCurrencyType {
    BuyCurrencyType_Null = 0,
    BuyCurrencyType_Rmb = 1,
    BuyCurrencyType_Gem = 2,
    BuyCurrencyType_HuafeiQuan = 3,
    BuyCurrencyType_Advert = 4,
    BuyCurrencyType_Share = 5
}
export enum ShopCat {
    ShopCat_Null = 0,
    ShopCat_Coin = 1,
    ShopCat_Gem = 2,
    ShopCat_GemExchange = 3
}
export enum BoxType {
    BoxType_Reward = 0,
    BoxType_Notify = 1
}
export enum BoxNotifyType {
    BoxNotifyType_Null = 0
}
export enum BoxFuncType {
    BoxFuncType_Null = 0,
    BoxFuncType_RenWu = 1,
    BoxFuncType_DuanWeiReward = 2,
    BoxFuncType_QuanGuoPaiMin = 3,
    BoxFuncType_SeasonReward = 4,
    BoxFuncType_DingShiDengLu = 5,
    BoxFuncType_DengJi = 6,
    BoxFuncType_PaiHangBangReward = 7,
    BoxFuncType_PaiHangBangUpdate = 8,
    BoxFuncType_QianDao = 9
}
export     enum State {
        Normal = 0,
        ReadyInvit = 1,
        Inviting = 2
    }
export enum TableMode {
    TM_Null = 0,
    TM_Match = 1,
    TM_Race = 2
}
export enum GenderType {
    Gender_Null = 0,
    Gender_Male = 1,
    Gender_Female = 2
}
export enum SetNameResult {
    SetName_Fail = 0,
    SetName_Ok = 1,
    SetName_Illegal = 2
}
export enum InformType {
    InformType_Null = 0,
    InformType_Text = 1,
    InformType_Ani = 2
}
export enum ZaiXianRewardState {
    DSRS_NotInTime = 0,
    DSRS_InTime = 1,
    DSRS_Geted = 2
}
export enum AuthType {
    AT_Unknown = 0,
    AT_Internal = 1,
    AT_Apple = 2,
    AT_WeiXin = 3,
    AT_Phone = 4,
    AT_HuaWei = 5,
    AT_Oppo = 6,
    AT_WeiXinMG = 7,
    AT_Vivo = 8,
    AT_MI = 9
}
export enum AuthResult {
    AR_Fail = 0,
    AR_Ok = 1,
    AR_ConnectionMax = 2,
    AR_DupLogin = 3,
    AR_TokenInvalid = 4,
    AR_ForbidLogin = 5,
    AR_AuthNone = 6,
    AR_LobbyNone = 7,
    AR_VersionErr = 8,
    AR_NotOpen = 9,
    AR_ParamInvalid = 10
}
export enum KickReason {
    KR_DupLogin = 0,
    KR_Forbid = 1
}