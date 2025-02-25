import GameView from "../../framework/core/ui/GameView";
import {MainLogic} from "../MainLogic";;
import {CommonEvent} from "../../common/event/CommonEvent";
import {CommonService} from "../../common/net/CommonService";
import { GameEvent } from "../../common/event/GameEvent";
import { Config, ViewZOrder } from "../../common/config/Config";
import { GameService } from "../../common/net/GameService";
import { HotfixConfig } from "../../common/config/HotfixConfig";
import { Macro } from "../../framework/defines/Macros";
import { ProtoDef } from "../../def/ProtoDef";
import { AuthType } from "../../def/GameEnums";
import { Utils } from "../../common/utils/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainView extends GameView {

    static logicType = MainLogic;

    private loader:fgui.GLoader3D = null;

    // private loginBtns:any = {};
    private yzmBtn:fgui.GButton = null;
    private phoneInput:fgui.GTextInput = null;
    private yzmIuput:fgui.GTextInput = null;
    private yzmHandler:number = -1;

    private sltsDlg:fgui.GComponent = null;

    public get logic() : MainLogic | null {
        return this._logic as any;
    }

    static getPrefabUrl() {
        return "main/prefabs/MainView"
    }

    static getViewPath(): ViewPath {
        console.log(" MainView  getViewPath  0 ");
        // console.error(new Error().stack);
        let path : ViewPath = {
            	/**@description 资源路径 creator 原生使用*/
            assetUrl: "common/ui/base",
            /**@description 包名称 fgui 使用*/
            pkgName : "base",
            /**@description 资源名称 fgui 使用*/
            resName : "MainView",
        }
        return path;
    }

    private _main: cc.Node = null;

    protected start(): void {
        cc.debug.setDisplayStats(false);
    }

    onWVLoad(event){
        Log.d("onWVLoad:",event);
    }

    onWVError(event){
        Log.d("onWVError:",event);
    }


    private isShowTime( timeMini:number )
    {
      let timeShengyu =  this.getDaoJiShi(timeMini);

        return timeShengyu>= (60*60) ;

    }


    private getDaoJiShi( timeMini:number ):number
    {

        return 0;
    }


    onLoad() {

        this.isShowTime();
        

        super.onLoad();
        console.log(" 初始化 MainView  onLoad    ");
        cc.view.emit("canvas-resize");
        // this._main = cc.find("main", this.node);
        // this._main.on(cc.Node.EventType.TOUCH_END, () => {
        //     this.logic.connectServer();
        // });
        let node = cc.find("Canvas/splash");
        if(node){
            node.destroy();
        }

        Manager.globalAudio.playMusic("sound/login_bgm",Macro.BUNDLE_RESOURCES,true);

        Manager.utils.getUIConfig(this.onWebCallback.bind(this));
        // Manager.platform.getInstall();

        // let data = Manager.protoManager.lookup(ProtoDef.pb.S2CCfgs);
        // let cfg = new data();
        // Log.d("____",cfg,cfg.items.map != null);

        
        // for (let key in data) {
        //     Log.d("___tobj",key,typeof data[key]);
        //     // tobj[key] = obj[key];
        //     // if(typeof obj[key] == "object"){
        //     //     if(obj[key].low != null && obj[key].high != null){
        //     //         tobj[key] = obj[key].low;
        //     //     }else{
        //     //         this.decodeChild(obj[key],tobj[key]);
        //     //     }
        //     // }
        // }  
        
        let userAgreement_com = this.root.getChild("userAgreement").asCom;
        userAgreement_com.visible=true;
        if (cc.sys.localStorage.getItem("userAgreement")!=null  ) 
        {
            if (cc.sys.localStorage.getItem("userAgreement")==1) 
            {
                userAgreement_com.visible=false;
            }
        }
        userAgreement_com.getChild("surebtn").onClick(()=>{  cc.sys.localStorage.setItem('userAgreement',1)
            userAgreement_com.visible=false;
        ; },this);
        userAgreement_com.getChild("cenclebtn").onClick(()=>{  
            cc.sys.localStorage.setItem('userAgreement',0)
            setTimeout(() => {
                cc.game.end();
            }, 100);
        ; },this);

        userAgreement_com.getChild("des").asRichTextField.on(fgui.Event.LINK, this.onClickLink, this); 
    }

    // private prefabNode:cc.Node = null;

    // private addEft(){

    //     Manager.assetManager.load(Macro.BUNDLE_RESOURCES,"particles/prefab_xg",cc.Prefab,null,function(data: Resource.CacheData){
    //         if(data.data != null){
    //             this.prefabNode = cc.instantiate(data.data as cc.Prefab)
    //             this.root.getChild("login").parent.node.addChild(this.prefabNode);
    //         }else{
    //             Log.d("=====","加载失败");
    //         }
    //     }.bind(this));
            
    // }

    // update(dt: number): void {
    //     if(this.prefabNode != null){
    //         this.prefabNode.setPosition(this.root.getChild("login").node.getPosition());
    //     }
    // }

    onSpineLoad(){
        let sp = <sp.Skeleton> this.loader.content;
        this.loader.animationName = "ani";
        sp.setCompleteListener(function(){
            fgui.GTween.delayedCall(0.1).setTarget(this.loader).onComplete(()=>{
                this.loader.loop = true;
                this.loader.animationName = "ani2";
            })
        }.bind(this));
        this.loader.loop = false;
        sp.setEndListener(function(){
            // Log.d("onSpineLoad setEndListener",this.loader.animationName);
        }.bind(this));
        // sp.setEventListener((trackEntry, event) => {
        //     if(event.data.name == "1"){
        //         Manager.globalAudio.playEffect("sound/firecrackers",Macro.BUNDLE_RESOURCES);
        //     }
        // });
        
    }

    onDestroy(): void {
        super.onDestroy();
        if(this.yzmHandler >-1){
            clearInterval(this.yzmHandler);   
        }
        Log.d("onSpineLoad MainView.onDestroy");
    }

    onClickLink(url:string,evt:fgui.Event){
        Manager.utils.openUrl(url);
    }

    onClickYhxy(){
        let am = this.root.getChild("am").asCom;
        let btn = am.getChild("xy").asButton;
        if(btn.selected){
            Manager.localStorage.setItem("xy",true);
        }else{
            Manager.localStorage.setItem("xy",false);
        }
    }

    onClickSlts(){
        this.sltsDlg.visible = true;
        let list = this.sltsDlg.getChild("list").asList;
        let txt = list.getChildAt(0).asCom;
        let cfgs = Manager.utils.getWebConfig()
        // Log.d("===",cfgs);
        if(txt && cfgs){
            txt.getChild("txt").text = cfgs.info.age18;
        }
    }

    onClickLoginItem(item:fgui.GComponent){
        let am = this.root.getChild("am").asCom;
        let btn = am.getChild("xy").asButton;
        if(!btn.selected){
            Manager.tips.show("请先认真阅读并同意《用户协议》《隐私协议》《儿童保护协议》");
            return
        }

        if(item.data == "login_yk"){
            this.onClickLogin(item);
            return;
        }
        if(item.data == "login_wx"){
            this.onClickWxLogin(item);
            return;
        }
        if(item.data == "login_hw"){
            this.onClickHwLogin(item);
            return;
        }

        if(item.data == "login_tel"){
            this.onClickTelLogin(item);
            return;
        }

        if(item.data == "login_ios"){
            this.onClickIOSLogin(item);
            return;
        }

        if(item.data == "login_tt"){
            this.onClickttLogin(item);
            return;
        }

        if(item.data == "login_vivo"){
            this.onClickVivoLogin(item);
            return;
        }

        if(item.data == "login_oppo"){
            this.onClickOppoLogin(item);
            return;
        }
    }

    onFairyLoad(): void {
        Manager.platform.getInstall();
        let dlg = this.root.getChild("pld").asCom;
        dlg.visible = false;
        let pld = dlg.getChild("dlg").asCom;
        this.phoneInput = pld.getChild("tel").asTextInput;
        this.yzmIuput = pld.getChild("yzm").asTextInput;
        this.yzmBtn = pld.getChild("send").asButton;
        this.yzmBtn.onClick(this.onClickSendYzm,this);
        pld.getChild("login").onClick(this.onClickSendYzmLogin,this);
        pld.getChild("close").onClick(()=>{
            dlg.visible = false;
        });

        let am = this.root.getChild("am").asCom;
        let btn = am.getChild("xy").asButton;
        let txt = am.getChild("txt").asRichTextField;
        btn.onClick(this.onClickYhxy,this);
        txt.on(fgui.Event.LINK, this.onClickLink, this);    
        btn.selected = Manager.localStorage.getItem("xy",false);

        // this.loginBtns = {};
        Manager.gd.LocalPosition = "MainView";

        this.root.getChild("test").onClick(this.onClickTest,this);
        this.root.getChild("repair").onClick(this.onClickRepair,this);
        this.root.getChild("ver").text = "v"+Config.RES_BUILD;

        this.root.getChild("slts").onClick(this.onClickSlts,this);
        let list = this.root.getChild("loginlist").asList;
        list.on(fgui.Event.CLICK_ITEM, this.onClickLoginItem, this);

        this.loader = this.root.getChild("bgspine") as fgui.GLoader3D;
        this.loader._onLoad = this.onSpineLoad.bind(this);
        if(this.loader.content != null){
            this.onSpineLoad();
        }

        this.root.getChild("tacc").visible = false;
        this.root.getChild("taccbg").visible = false;
        let test = this.root.getChild("mode").asCom;
        test.visible = false;

        this.root.getChild("clear").visible = false;
        this.root.getChild("repair").visible = false;
        this.root.getChild("qw").visible = false;
        this.root.getChild("lh").visible = false;
        this.root.getChild("ww").visible = false;
        this.root.getChild("test").visible =false;

        this.sltsDlg = this.root.getChild("sltsDlg").asCom;
        this.sltsDlg.visible = false;
        this.sltsDlg.getChild("close").onClick(this.onClickCloseDlg,this);

        if(!Manager.platform.isTestPkg()){
            return;
        }
        this.root.getChild("test").visible =true;
        this.root.getChild("mode").visible = true;
        this.root.getChild("repair").visible = true;
        this.root.getChild("clear").visible = true;
        
        this.root.getChild("qw").visible = true;
        this.root.getChild("lh").visible = true;
        this.root.getChild("ww").visible = true;
        this.root.getChild("tacc").visible = true;
        this.root.getChild("taccbg").visible = true;

        let uuid = Manager.localStorage.getItem("uuid","");
        if(uuid != "" && uuid.length > 1){
            this.root.getChild("tacc").text = uuid;
        }

        uuid = Manager.localStorage.getItem("__tid","");
        if(uuid != "" && uuid.length > 1){
            this.root.getChild("tacc").text = uuid;
        }
    
        test.getChild("ip").text = Config.SERVER_ADDR_LOCAL_QW;
        let b = test.getChild("n0").asButton;
        if (Manager.netMode){
            b.text = "联网模式";
            b.selected = false;
        }else{
            b.text = "单机模式";
            b.selected = true;
        }
        b.onClick(function(){
            Manager.netMode = !Manager.netMode;
            if (b.text == "联网模式"){
                b.text = "单机模式"
            }else{
                b.text = "联网模式"
            }
            Log.d("b.text:",b.text);
        },this);

        this.clearLocalStorage();
        // Manager.localStorage.clear();
        this.root.getChild("clear").onClick(function(){
            Manager.localStorage.clear();
            Manager.localStorage.setItem("clear",this.root.getChild("clear").asButton.selected);
            this.root.getChild("tacc").text = "";
        },this);
        
        this.root.getChild("qw").onClick(this.onClickQw,this);
        this.root.getChild("lh").onClick(this.onClickLh,this);
        this.root.getChild("ww").onClick(this.onClickWW,this);
        let ip = Manager.localStorage.getItem("ip");
        if (ip != null){
            test.getChild("ip").text = ip;
            if (ip==Config.SERVER_ADDR_LOCAL_QW){
                this.root.getChild("qw").asButton.selected = true;
            }
            if (ip==Config.SERVER_ADDR_LOCAL_LH){
                this.root.getChild("lh").asButton.selected = true;
            }
            if (ip==Config.SERVER_ADDR_REMOTE){
                this.root.getChild("ww").asButton.selected = true;
            }
        }
    }

    onClickCloseDlg(){
        this.sltsDlg.visible = false;
    }

    onClickRepair(){
        Log.d("onClickRepair");
        Manager.localStorage.clearCache();
        setTimeout(function(){
            cc.game.restart();
        },200);
    }

    onClickTest(){
        Log.d("onClickTest");

        Manager.platform.WxInvite();

        let vis = this.root.getChild("qw").visible;
        this.root.getChild("qw").visible = !vis;
        this.root.getChild("lh").visible = !vis;
        this.root.getChild("ww").visible = !vis;
        this.root.getChild("mode").visible = !vis;
        // Manager.updateManager.isSkipCheckUpdate = vis;
        // if(Manager.updateManager.isSkipCheckUpdate){
        //     Manager.tips.debug("关闭热更新");
        // }else{
        //     Manager.tips.debug("开启热更新");
        // }

        // Manager.platform.loginWx();
    }

    clearLocalStorage(){
        let isclear = Manager.localStorage.getItem("clear");
        Log.e("isclear:",isclear);
        if (isclear == true){
            Manager.localStorage.clear();
            Manager.tips.debug("用户缓存数据已清除");
            this.root.getChild("tacc").text = "";
            this.root.getChild("clear").asButton.selected = true;
        }else{
            this.root.getChild("clear").asButton.selected = false;
        }
    }

    onClickQw(evt: fgui.Event) {
        let test = this.root.getChild("mode").asCom;
        test.getChild("ip").text = Config.SERVER_ADDR_LOCAL_QW;
        Manager.localStorage.setItem("ip",test.getChild("ip").text);
        Manager.serviceManager.close();

        // let ykLogin = this.root.getChild("login_yk");
        // if(ykLogin != null){
        //     ykLogin.visible = true;
        // }
        // this.root.getChild("tacc").visible = true;
        // this.root.getChild("taccbg").visible = true;
    }

    onClickLh(evt: fgui.Event) {
        let test = this.root.getChild("mode").asCom;
        test.getChild("ip").text = Config.SERVER_ADDR_LOCAL_LH;
        Manager.localStorage.setItem("ip",test.getChild("ip").text);
        Manager.serviceManager.close();

        // let ykLogin = this.root.getChild("login_yk");
        // if(ykLogin != null){
        //     ykLogin.visible = true;
        // }
        // this.root.getChild("tacc").visible = true;
        // this.root.getChild("taccbg").visible = true;
    }

    onClickWW(evt: fgui.Event) {
        let test = this.root.getChild("mode").asCom;
        test.getChild("ip").text = Config.SERVER_ADDR_REMOTE;
        Manager.localStorage.setItem("ip",test.getChild("ip").text);
        Manager.serviceManager.close();

        // let ykLogin = this.root.getChild("login_yk");
        // if(ykLogin != null){
        //     ykLogin.visible = false;
        // }
        // this.root.getChild("tacc").visible = false;
        // this.root.getChild("taccbg").visible = false;
    }

    onWebCallback(ret:boolean){
        Log.d("onWebCallback:",ret);
        if(!ret){
            return;
        }
        let uiconfig = Manager.gd.get<pb.S2CUISwitches>(ProtoDef.pb.S2CUISwitches);
        if(uiconfig != null){
            let list = this.root.getChild("loginlist").asList;
            list.removeChildrenToPool();
            for (const [key, val] of Object.entries(uiconfig.items)) {
                // let btn = this.loginBtns[key];
            if(key.indexOf("login_") != -1 
                && val > 0
                ){
                    // 如果没有微信的话就不展示微信登录按钮
                    if (key!="login_wx" || Manager.platform.isHaveWx() ) 
                    {
                        let com = list.addItemFromPool().asButton;
                        com.icon = fgui.UIPackage.getItemURL("base","denglu_"+key);
                        com.data = key;
                    }
                }
            }
        }

       let cfg = Manager.utils.getWebConfig();
       Log.d("getWebConfig:",cfg);    

       if(cfg.server_addr == null || cfg.server_addr.length == null || cfg.server_addr.length < 4){
           Manager.tips.show("服务器维护中，请稍后再试");
           return;
       }

       if(cfg != null){
            let test = this.root.getChild("mode").asCom;
            test.getChild("ip").text = cfg.server_addr;
            // test.getChild("ip").text = "gate1.66qp.com.cn";
           
            test.getChild("port").text = cfg.server_port;
       }  
       let token = Manager.localStorage.getItem("server_token",""); 

       Log.d("onWebCallback token",token);

       let atp = Manager.localStorage.getItem("accountType",0);
       if(AuthType.AT_Phone == atp || AuthType.AT_WeiXin == atp){
            if(token.length > 0){
                let gs = Manager.serviceManager.get(GameService) as GameService;
                let test = this.root.getChild("mode").asCom;
                // test.getChild("ip").text = "192.168.2.126";
                gs.setIp(test.getChild("ip").text);
                gs.setPort(Number(test.getChild("port").text));
                this.logic.connectServer();
                return;
            }
       }
       Manager.localStorage.setItem("server_token",""); 
    }
    
    private onLogin() {
        let gs = Manager.serviceManager.get(GameService) as GameService;
        let test = this.root.getChild("mode").asCom;
        gs.setIp(test.getChild("ip").text);
        gs.setPort(Number(test.getChild("port").text));
        let uuid = this.root.getChild("tacc").text.trim();
        if(uuid != "" && uuid.length > 0){
            Manager.localStorage.setItem("uuid",uuid);
        }
        Log.d("__ts__onLogin");
        this.logic.connectServer();
    }

    private onClickLogin(com: fgui.GComponent) {
        Manager.localStorage.setItem("accountType",AuthType.AT_Internal);
        let token = Manager.localStorage.getItem("token",""); 
        if(token == ""){
            Manager.localStorage.setItem("token",Manager.utils.uuid);
        }
        Log.d("onClickLogin","yk",token);
        this.onLogin();
    }

    private onClickWxLogin(com: fgui.GComponent) {
        Manager.platform.loginWx("login");
    }

    private onClickOppoLogin(com: fgui.GComponent) {
        Manager.platform.loginOppo();
    }

    private onClickHwLogin(com: fgui.GComponent) {

        Manager.platform.loginHuawei();

    }

    private onClickIOSLogin(com: fgui.GComponent) {
        Manager.platform.loginIOS();
    }

    private onClickttLogin(com: fgui.GComponent) {
 
    }

    private onClickTelLogin(com: fgui.GComponent) {
        let pld = this.root.getChild("pld").asCom;
        pld.visible = true;
        this.yzmBtn.enabled = true;
        this.yzmBtn.text = "获取验证码";
        Manager.localStorage.setItem("token","");
        Manager.localStorage.setItem("yzm","");
        Manager.localStorage.setItem("phone","");
        if(this.yzmHandler >-1){
            clearInterval(this.yzmHandler);   
        }
    }

    private onClickSendYzm() {
        if(this.phoneInput.text.trim().length != 11){
            Manager.tips.show("手机号长度错误");
            return;
        }
        if(this.phoneInput.text.trim().charAt(0) != "1"){
            Manager.tips.show("手机号格式不正常");
            return;
        }
        Manager.localStorage.setItem("phone",this.phoneInput.text.trim());
        let gs = Manager.serviceManager.get(GameService) as GameService;
        let test = this.root.getChild("mode").asCom;
        gs.setIp(test.getChild("ip").text);
        gs.setPort(Number(test.getChild("port").text));
        this.logic.connectServer();
        this.yzmBtn.enabled = false;
        this.yzmBtn.data = 60;
        this.yzmBtn.text = "已发送("+this.yzmBtn.data.toString()+")";
        this.yzmHandler = setInterval(this.updateYzmCountdown.bind(this),1000);
    }

    private updateYzmCountdown(){
        Log.d("updateYzmCountdown",this.yzmBtn.data);
        if(this.yzmBtn.data == null || this.yzmBtn.data <= 0){
            clearInterval(this.yzmHandler);  
            this.yzmBtn.enabled = true;
            this.yzmBtn.text = "获取验证码";
            return;
        }
        this.yzmBtn.data -=1;
        this.yzmBtn.text = "已发送("+this.yzmBtn.data.toString()+")";
    }

    private onClickSendYzmLogin() {
        if(this.phoneInput.text.trim().length != 11){
            Manager.tips.show("手机号长度错误");
            return;
        }
        if(this.phoneInput.text.trim().charAt(0) != "1"){
            Manager.tips.show("手机号格式不正常");
            return;
        }

        if(this.yzmIuput.text.trim().length != 4){
            Manager.tips.show("验证码长度错误");
            return;
        }
        Manager.localStorage.setItem("token",this.phoneInput.text.trim()+"|"+this.yzmIuput.text.trim());
        Manager.localStorage.setItem("yzm",this.yzmIuput.text.trim());
        if(this.yzmHandler >-1){
            clearInterval(this.yzmHandler);   
        }
        Manager.localStorage.setItem("accountType",AuthType.AT_Phone);
        this.logic.auth();
    }

    private onClickVivoLogin(com: fgui.GComponent) {

    }

    private onWxSdkLogin(data) {
        Log.d("__ts__onWxSdkLogin",data.code);
        if(data.state != "login"){
            Manager.tips.show("微信授权失败,请重试 !");
            return;
        }
        if(data.code == null || data.code.length == 0){
            Manager.tips.show("微信授权失败,请重试!");
            return;
        }
        Manager.localStorage.setItem("accountType",AuthType.AT_WeiXin);
        Manager.localStorage.setItem("token",data.code);
        this.onLogin();

    }


    private onIOSSdkLogin(data) {
        Log.d("__ts__onIOSSdkLogin",data.code);
        if( data.errCode == 0){
            // Manager.tips.show("IOS授权失败,请重试!");
            Manager.tips.show(data.errmsg);
            return;
        }
        Manager.localStorage.setItem("accountType",AuthType.AT_Apple);
        Manager.localStorage.setItem("token",data.token);
        this.onLogin();

    }
    


    private onhwSdkLogin(data) {
        Log.d("__ts__onhwSdkLogin",data.errCode);
        Log.d("__ts__onhwSdkLogin data.code ",data.code);
        if(data.errCode == null || data.errCode == 0){
            // Manager.tips.show("华为授权失败,请重试!");
            Manager.tips.show(data.errMsg);
            return;
        }
        Manager.localStorage.setItem("accountType",AuthType.AT_HuaWei);
        Manager.localStorage.setItem("token",data.code);
        this.onLogin();
    }

    private onOppoSdkLogin(data) {
        Log.d("__ts__ onOppoSdkLogin",data.errCode);
        Log.d("__ts__ onOppoSdkLogin data.code ",data.code);
        if(data.errCode == null || data.errCode == 0){
            Manager.tips.show("Oppo授权失败,请重试!");
            return;
        }
        Manager.localStorage.setItem("accountType",AuthType.AT_HuaWei);
        Manager.localStorage.setItem("token",data.code);
        this.onLogin();
    }

    
    
    protected addEvents() {
        super.addEvents();
        this.addEvent(CommonEvent.GAME_SERVICE_CONNECTED, this.onNetConnected);
        this.addEvent(CommonEvent.GAME_SERVICE_CLOSE, this.onNetClose);

        this.addEvent(GameEvent.ENTER_HALL, this.enterHall);

        this.addEvent(GameEvent.SDK_CALLID_LOGIN_WX, this.onWxSdkLogin);
        this.addEvent(GameEvent.SDK_CALLID_LOGIN_IOS, this.onIOSSdkLogin);
        this.addEvent(GameEvent.SDK_CALLID_LOGIN_HW, this.onhwSdkLogin);
        this.addEvent(GameEvent.SDK_CALLID_LOGIN_OPPO, this.onOppoSdkLogin);

        
    }

    public onNetConnected(service: CommonService) {
        Log.d(`${service.module} 连接成功!`);
        let phone = Manager.localStorage.getItem("phone","");
        let yzm = Manager.localStorage.getItem("yzm","");
        if(phone.length == 11 && yzm.length < 4){
            Manager.loading.hide();
            this.logic.sendYzm(phone);
        }else{
            this.logic.auth();
        }
    }

    public onNetClose(service: CommonService) {
        Log.d(`${service.module} 关闭成功!`);
        Manager.uiLoading.hide();
    }

    public enterHall(data:any){
        console.log("  enterHall  ");
        
        this.enterBundle(data);
        // Manager.entryManager.enterBundle(data);
    }


}
