/**
 * 框架常量宏定义
 */

import { Endian } from "../plugin/ByteArray";

export namespace Macro{
    /**@description 网络数据全以大端方式进行处理 */
    export const USING_LITTLE_ENDIAN = Endian.BIG_ENDIAN;
    /**@description 主包bundle名 */
    export const BUNDLE_RESOURCES = 'resources';
    /**@description 远程资源包bundle名 */
    export const BUNDLE_REMOTE = "__Remote__Caches__";
    /**@description 是否允许游戏启动后切换语言 */
    export const ENABLE_CHANGE_LANGUAGE = true;
    /**@description 语言包路径使用前缀 */
    export const USING_LAN_KEY = "i18n.";
    /**@description 语言变更 */
    export const CHANGE_LANGUAGE = "Event_CHANGE_LANGUAGE";
    /**@description 屏幕适配 */
    export const ADAPT_SCREEN = "Event_ADAPT_SCREEN";
    /**@description 未知 */
    export const UNKNOWN = "UNKNOWN"
    /**@description 应该层主动关闭Socket */
    export const ON_CUSTOM_CLOSE = "";
    /**@description 主包热更新模拟bundle名 */
    export const MAIN_PACK_BUNDLE_NAME = "main";
    /**@description FGUI 根节点 名称 */
    export const FGUI_ROOT_NAME = "GRoot";
    /**@description UI_FGUI_MODE */
    export const UI_FGUI_MODE = true;
        /**@description UI_FGUI_MODE */
    export const ViewPathNull : ViewPath = { assetUrl: "", pkgName : "", resName : "",
    };
}