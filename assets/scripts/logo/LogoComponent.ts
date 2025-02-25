const {ccclass, property} = cc._decorator;

@ccclass
export default class LogoComponent extends cc.Component {

    @property(cc.VideoPlayer)
    videoPlayer: cc.VideoPlayer = null;
   

    protected onLoad(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onClick, this);
    }

    protected start(): void {
        cc.debug.setDisplayStats(false);
        if(cc.sys.platform == cc.sys.WIN32 || cc.sys.isBrowser || cc.sys.platform == cc.sys.MACOS){
            this.onLogoEnd();
        }
    }

    onVideoPlayerEvent(sender, event){
        console.log(sender,event);
        if(event == 6){
            this.videoPlayer.play();
        }
        if(event == 3 || event == 5){
            this.onLogoEnd();
        }
    }

    onClick(){
        console.log("onClick");
        this.onLogoEnd();
    }

    onLogoEnd(){
        cc.director.loadScene("Main");
    }
}
