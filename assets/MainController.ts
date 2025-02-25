import ChangeColorCard from "./bundles/mjcommon/script/view/MJProp/ChangeColorCard";
import { Config } from "./scripts/common/config/Config";
import { DebugView } from "./scripts/common/debug/DebugView";
import EventComponent from "./scripts/framework/componects/EventComponent";
/**
 * @description 主控制器 
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("manager/MainController")
export default class MainController extends EventComponent {

    @property(cc.Asset)
    wssCacert: cc.Asset = null;

    private debugView : cc.Node | null = null!;

    @property(sp.Skeleton)
    clickHit: sp.Skeleton = null;

    
    @property(cc.Node)
    hitNode: cc.Node = null;

    @property(cc.Camera)
    camera: cc.Camera = null;

    // @property(cc.Material)
    // mtl: cc.Material = null;
    protected start(): void {
        cc.debug.setDisplayStats(Manager.platform.isTestPkg());
    }

    onLoad() {
        this.hitNode.on(cc.Node.EventType.TOUCH_START, this._onTouchBegin, this);
        // this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);

        super.onLoad();
        Manager.onLoad(this.node);
        Manager.utils.GetTSPeiZhiConfig();
        // Manager.utils.setmtl(this.mtl);
        // let bundle = Manager.bundleManager.getBundle(Macro.BUNDLE_RESOURCES);
        // fgui.UIPackage.loadPackage(bundle,"common/ui/base",this.onFairyLoad.bind(this));
        if (this.wssCacert) {
            Manager.wssCacertUrl = this.wssCacert.nativeUrl;
        }
        let debug = cc.find("debug", this.node);
        this.debugView = cc.find("debugView",this.node);
        if (debug&&this.debugView) {
            // let isVisibleDebugInfo = Manager.localStorage.getItem(Config.SHOW_DEBUG_INFO_KEY,true);
            // cc.debug.setDisplayStats(isVisibleDebugInfo);
            if(Manager.platform.isTestPkg()){
                debug.active = true;
                let view = this.debugView.addComponent(DebugView)
                if ( view ){
                    view.debug = debug;
                }
                this.debugView.active = false;
                debug.on(cc.Node.EventType.TOUCH_END,()=>{
                    if ( debug ) debug.active = false;
                    if ( this.debugView ){
                        this.debugView.active = true;
                    }
                });   
            }else{
                console.log(" 游戏开始启动  debugView  删除掉  ");
                debug.destroy();
                this.debugView.destroy();
            }
            
        }
        //游戏事件注册
        cc.game.on(cc.game.EVENT_HIDE, this.onEnterBackground, this);
        cc.game.on(cc.game.EVENT_SHOW, this.onEnterForgeground, this);
        //内存警告事件//Ts层已经同步，需要自己去导出事件上来
        // cc.game.on(cc.game.EVENT_LOW_MEMORY,this.onLowMemory,this);
    }

    update() {
        Manager.update(this.node);
    }

    onDestroy() {

        this.hitNode.off(cc.Node.EventType.TOUCH_START, this._onTouchBegin, this);
        // this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);

        //移除键盘事件
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP);
        //移除游戏事件注册
        cc.game.off(cc.game.EVENT_HIDE);
        cc.game.off(cc.game.EVENT_SHOW);
        Manager.onDestroy(this.node);
        super.onDestroy();
    }

    private onEnterBackground() {
        Manager.onEnterBackground();
    }

    private onEnterForgeground() {
        Manager.onEnterForgeground();
    }

    private onLowMemory(){
        Manager.onLowMemory();
    }

    _onTouchBegin(event: cc.Event.EventTouch) {
        // cc.log('_onTouchBegin',event);
        if(this.hitNode["_touchListener"] != null){
            this.hitNode["_touchListener"].setSwallowTouches(false);
        }
        if(this.clickHit == null){
            return;   
        }
        let pos = event.getLocation();

        let out = cc.v2();
        this.camera.getScreenToWorldPoint(pos,out); 

        pos = this.hitNode.convertToNodeSpaceAR(out);
        this.clickHit.node.x = pos.x;
        this.clickHit.node.y = pos.y;

        this.clickHit.animation = Manager.utils.rand(1,5).toString();
        this.clickHit.loop = false;
    }

    // _onTouchEnd(event) {
    //     cc.log('_onTouchEnd',event);
    // }
  
}
