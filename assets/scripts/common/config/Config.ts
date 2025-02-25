/**@description 全局配置 */

import { Update } from "../../framework/core/update/Update";

export namespace Config {
    /**@description 是否显示调试按钮 */
    export const isShowDebugButton = true;

    /**@description 公共Prefabs预置路径 */
    export const CommonPrefabs = {
        tips: "common/prefabs/Tips",
        uiLoading: "common/prefabs/UILoading",
        loading: "common/prefabs/Loading",
        alert: "common/prefabs/Alert",
    }

    /**@description 公共音效路径 */
    export const audioPath = {
        dialog: "common/audio/dlg_open",
        button: "common/audio/btn_click",
    }

    /**@description 主包包含目录 */
    export const MIAN_PACK_INCLUDE: string[] = ["src","jsb-adapter","assets/resources","assets/main","assets/internal"];

    /**@description Loading动画显示超时回调默认超时时间 */
    export const LOADING_TIME_OUT = 30;

    /**@description Loading提示中切换显示内容的时间间隔 */
    export const LOADING_CONTENT_CHANGE_INTERVAL = 3;

    /**@description 加载界面超时时间,如果在LOAD_VIEW_TIME_OUT秒未加载出，提示玩家加载界面超时 */
    export const LOAD_VIEW_TIME_OUT = 20;

    /**@description UILoading显示默认时间，即在打开界面时，如果界面在LOAD_VIEW_DELAY之内未显示，就会弹出一的加载界面的进度 
     * 在打开界面时，也可直接指定delay的值
     * @example  
     * Manager.uiManager.open({ type : LoginLayer, zIndex: ViewZOrder.zero, delay : 0.2});
     */
    export const LOAD_VIEW_DELAY = 0.1;

    export const BUNDLE_BASE = "base";

    /**@description 大厅bundle名 */
    export const BUNDLE_HALL = "hall";

    /**@description 斗地主bundle名 */
    export const BUNDLE_DDZ = "ddz";

    /**@description 血流红中bundle名 */
    export const BUNDLE_XLHZ = "xlhzmj";
    export const BUNDLE_MJCOMMON = "mjcommon";
    export const BUNDLE_GameCOMMON = "gamecommon";
    /**@description 三人两房bundle名 */
    export const BUNDLE_XLThreeTwo = "threeTwomj";


    /**@description 重连的超时时间 */
    export const RECONNECT_TIME_OUT = 50;

    /**@description 进入后台最大时间（单位秒）大于这个时间时就会进入重连*/
    export const MAX_INBACKGROUND_TIME = 60;
    /**@description 进入后台最小时间（单位秒）大于这个时间时就会进入重连*/
    export const MIN_INBACKGROUND_TIME = 40;

    /**@description 网络重连弹出框tag */
    export const RECONNECT_ALERT_TAG = 100;

    export const ENTRY_CONFIG: { [key: string]: Update.Config } = {};

    export const SHOW_DEBUG_INFO_KEY = "SHOW_DEBUG_INFO_KEY";

    /**@description 测试热更新服务器外网地址 */
    export const WEB_URL_REMOTE = "https://api.66qp.com.cn/";
    // export const WEB_URL_LOCAL = "http://192.168.2.121:90/";
    export const WEB_URL_LOCAL = WEB_URL_REMOTE;

    export const SERVER_ADDR_LOCAL_QW = "192.168.2.126";
    export const SERVER_ADDR_LOCAL_LH = "192.168.2.129";
    export const SERVER_ADDR_REMOTE = "gate1.66qp.com.cn";
    export const RES_BUILD = "1.0.0";
}

/**
 * @description 界面层级定义
 */

export namespace ViewZOrder {


    /**@description 最底层 */
    export const zero = 0;

    /**@description 小喇叭显示层 */
    export const Horn = 10;

    /**@description ui层 */
    export const UI = 100;

    /**@description 商城ui层 */
    export const ShopUI = 120;

    /**@description 大于商城的 二级面板 */
    export const TwoUI = 130;

    /**@description 提示 */
    export const Tips = 300;

    /**@description 提示弹出框 */
    export const Alert = 299;

    /**@description 通用奖励 */
    export const Reward = 298;

    /**@description Loading层 */
    export const Loading = 600;

    /**@description 界面加载动画层，暂时放到最高层，加载动画时，界面未打开完成时，不让玩家点击其它地方 */
    export const UILoading = 700;

    export const Top = 1000;
}

/**@description 网络优先级,值越大，优化级越高 */
export enum NetPriority{
    Game,
    Chat,
    Lobby,
}