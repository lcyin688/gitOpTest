export namespace HotfixConfig {
    /**@description 热更新级别
     * 0关闭
     * 1开启内网热更
     * 2开启外网热更
    */
    export const UpdateLevel = 2;

    /**@description 测试热更新服务器内网地址 */
    // export const HOT_UPDATE_URL_LOCAL = "http://192.168.1.24:8899/ssm/remote";
    // export const HOT_UPDATE_URL_LOCAL = "http://192.168.2.244:8866/static_service";
    export const HOT_UPDATE_URL_LOCAL = "http://192.168.2.130:8866/static_service";
   
    /**@description 测试热更新服务器外网地址 */
    export const HOT_UPDATE_URL_REMOTE = "https://cdn.66qp.com.cn/hotfix/";


}