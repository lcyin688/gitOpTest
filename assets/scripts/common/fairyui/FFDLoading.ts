/**@description 下载界面 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class FFDLoading {

    static getViewPath(): ViewPath {
        let path : ViewPath = {
            	/**@description 资源路径 creator 原生使用*/
            assetUrl: "common/ui/base",
            /**@description 包名称 fgui 使用*/
            pkgName : "base",
            /**@description 资源名称 fgui 使用*/
            resName : "Downloading",
        }
        return path;
    }

    /**@description 下载进度 */
    private progress: fgui.GProgressBar = null;

    /**@description 下载过程中显示文字的节点 */
    private tipsLabel: fgui.GRichTextField = null;

  
}
