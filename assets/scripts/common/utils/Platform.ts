/**
 * @description 平台api封装
 */

import { AdSdkType, PkgType } from "../../def/GameEnums";
import { ProtoDef } from "../../def/ProtoDef";
import { GameEvent } from "../event/GameEvent";
import { GameService } from "../net/GameService";
import { Utils } from "./Utils";

 const DEBUG_TAG = "__log__ts__";

export class Platform {


    callbackWXLoginFun:() => void;
    private static _instance: Platform = null!;
    public static Instance() { return this._instance || (this._instance = new Platform()); }


    get jsb(){
        return CC_JSB;
    }

    static get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }

    //回调数据为json格式 {callId:xxxx},其中必定包含callId;
    public onCallback(jsonStr:any){
        Log.e(DEBUG_TAG,"platform onCallback ");

        if(jsonStr == null){
            Log.e(DEBUG_TAG,"platform onCallback err,jsonStr == null");
            return;
        }
        let jsonData = jsonStr;
        if (typeof(jsonStr) == "string") {
            Log.d(DEBUG_TAG,"onCallback:",jsonStr);
            jsonStr = jsonStr.toString().trim();
            if(jsonStr.length == 0){
                Log.e(DEBUG_TAG,"platform onCallback err,jsonStr isnull string");
                return;
            }
            jsonData = JSON.parse(jsonStr);
            if(jsonData == null){
                Log.e(DEBUG_TAG,"platform onCallback parse jsonStr err",jsonStr);
                return;
            }
        }

        if(jsonData.callId == null){
            Log.e(DEBUG_TAG,"platform onCallback err,jsonData.callId == null",jsonStr);
            return;
        }
        Log.d(DEBUG_TAG,"dispatch platform onCallback:",JSON.stringify(jsonData));
        dispatch(jsonData.callId,jsonData);
    }

    public isAdOpen():boolean{
        let uiconfig = Manager.gd.get<pb.S2CUISwitches>(ProtoDef.pb.S2CUISwitches);
        if(uiconfig != null && uiconfig.items != null){
            if(uiconfig.items["status_ad"] != null &&  uiconfig.items["status_ad"] > 0){
                return true;
            }
        }
        return false;
    }

    public printAdStatus(){
        Log.d(DEBUG_TAG,"status_ad:",this.isAdOpen(),"pl:",this.GetPkgType().PkgType);
    }
    public electricity():{cur:number,max:number}{
        let content = {cur:100,max:100};
        if(!this.jsb){
            return content;
        }
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            let jsonStr = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/util/Util", "electricity", "(Ljava/lang/String;)Ljava/lang/String;", "");
            content = JSON.parse(jsonStr);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            let jsonStr = jsb.reflection.callStaticMethod("Util", "electricity:", "");
            content = JSON.parse(jsonStr);
        } else {
            content = {cur:100,max:100};
        }
        Log.d(DEBUG_TAG,"electricity",content.cur,content.max);
        return content;
    }

    public deviceDesc():any{
        let content = JSON.stringify({udid:Manager.utils.uuid,os:cc.sys.os,model:"-1",bindData:""});
        if(!this.jsb){
            return content;
        }
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            content = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/util/Util", "deviceDesc", "(Ljava/lang/String;)Ljava/lang/String;", "");
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            content = jsb.reflection.callStaticMethod("Util", "deviceDesc:", "");
        }else{
          
        }
        Log.d(DEBUG_TAG,"deviceDesc",content);
        return content;
    }

    public getInstall(){

        if(!this.jsb){
            return ;
        }
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            let jsonStr = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/util/Util", "getInstall", "(Ljava/lang/String;)Ljava/lang/String;", "");
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            let jsonStr =jsb.reflection.callStaticMethod("Util", "getInstall:", "");
        }else{
          
        }
        Log.d(DEBUG_TAG,"getInstall");

    }

    public openInstallReportRegister(){

        if(!this.jsb){
            return ;
        }
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            let jsonStr = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/util/Util", "openInstallReportRegister", "(Ljava/lang/String;)Ljava/lang/String;", "");
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            let jsonStr = jsb.reflection.callStaticMethod("Util", "openInstallReportRegister:", "");
        }else{
          
        }
        Log.d(DEBUG_TAG,"openInstallReportRegister");

    }


    public isHaveWx():boolean{
        if(!this.jsb){
            return true;
        }
        if (cc.sys.os == cc.sys.OS_ANDROID) {
           let ishave =  jsb.reflection.callStaticMethod("org/cocos2dx/javascript/sdk/mm/WXLogin", "isHaveWx", "(Ljava/lang/String;)Z", "");
           return ishave;

        } else if (cc.sys.os == cc.sys.OS_IOS) {
           return jsb.reflection.callStaticMethod("Util", "isHaveWx:", "");
        }
        else
        {
            return false;
        }
    }


    public loginWx(wxstate:string):any{
        if(!this.jsb){
            return;
        }
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/sdk/mm/WXLogin", "login", "(Ljava/lang/String;)Ljava/lang/String;", wxstate);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            let jsonStr = jsb.reflection.callStaticMethod("Util", "loginWx:", wxstate);
            Log.e(DEBUG_TAG,"ios 暂未处理",jsonStr);
        }
    }


    public loginIOS():any{
        if(!this.jsb){
            return;
        }
        if (cc.sys.os == cc.sys.OS_IOS) {
            let jsonStr = jsb.reflection.callStaticMethod("Util", "loginIOS:", "");
            Log.e(DEBUG_TAG,"ios loginIOS",jsonStr);
        }
    }

    public loginHuawei():any{
        if(!this.jsb){
            return;
        }
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "loginHuawei", "(Ljava/lang/String;)Ljava/lang/String;", "");
        }
    }

    public loginOppo():any{
        if(!this.jsb){
            return;
        }
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/util/Util", "loginOppo", "(Ljava/lang/String;)Ljava/lang/String;", "");
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            let jsonStr = jsb.reflection.callStaticMethod("Util", "loginWx:", "");
            Log.e(DEBUG_TAG,"ios 暂未处理",jsonStr);
        }
    }


    public isTestPkg():boolean{
        if (this.GetPkgType().PkgType == PkgType.PkgType_TestH5){
            return true;
        }
        if (this.GetPkgType().PkgType == PkgType.PkgType_Test){
            return true;
        }
        // if (this.GetPkgType().PkgType == PkgType.PkgType_Normal){
        //     return true;
        // }

        return false;
    }

    public GetPkgType():{PkgType:PkgType}{
        // return {PkgType:PkgType.PkgType_Test};
        if(!this.jsb){
            return {PkgType:PkgType.PkgType_Test};
        }
        let content = {PkgType:PkgType.PkgType_Normal};
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            let jsonStr = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/util/Util", "GetPkgType", "(Ljava/lang/String;)Ljava/lang/String;", "");
            content = JSON.parse(jsonStr);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            content = {PkgType:PkgType.PkgType_Apple};
        }
        return content;
    }
    

    public WatchAds(data:any):any 
    {
        let content:any = {};
        if(!this.isAdOpen()){
            data.sdkType = AdSdkType.AdSdkType_Share;
            data.adCallName="OnC2SAdEnd",
            dispatch(GameEvent.SDK_CALLID_AD,data);
            Manager.platform.WxInvite();
            return content;
        }
        let adsJson = JSON.stringify(data)
        Log.e("WatchAds  data 进安卓 ",adsJson);
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            content = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/util/Util", "WatchAds", "(Ljava/lang/String;)Ljava/lang/String;", adsJson);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            content = jsb.reflection.callStaticMethod("Util", "WatchAds:", adsJson);
        }
        else
        {        
            let jsonData:any = {
                callId:"SDK_CALLID_AD",
                adCallName:"OnC2SAdEnd",
                code:1,
                sdkType:AdSdkType.AdSdkType_Ks,
                funcId:"1",
                adId:"1",
            };
            dispatch(GameEvent.SDK_CALLID_AD,jsonData);

        }
        return content;
    }

    //取消广告
    CancelAd(data:string):any
    {
        Log.e("CancelAd  data ",data);
        let content:any = {};

        if(!this.jsb){    
            return content;
        }

        if (cc.sys.os == cc.sys.OS_ANDROID) {
            content = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/util/Util", "CancelAd", "(Ljava/lang/String;)Ljava/lang/String;", data);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            Log.e(DEBUG_TAG,"ios 暂未处理");
        }
        return content;
    }


    public getLocation():any 
    {
        
        let content:any = {};
        if(!this.jsb){    
            let lbsData:any = {};
            lbsData.callId = "SDK_LBS";
            lbsData.latitude = Manager.utils.randf(20,45);
            lbsData.longitude = Manager.utils.randf(84,125); 
            lbsData.altitude = Manager.utils.randf(2,100);
            this.onCallback(JSON.stringify(lbsData));
            return content;
        }

        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/util/Util", "getLocation", "(Ljava/lang/String;)Ljava/lang/String;", "");
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("Util", "getLocation:", "");
        } else{
            let lbsData:any = {};
            lbsData.latitude = Manager.utils.randf(20,45);
            lbsData.longitude = Manager.utils.randf(84,125); 
            lbsData.altitude = Manager.utils.randf(2,100);
            this.onCallback(JSON.stringify(lbsData));
        }
        return content;
    }


   public IOSPay(data: pb.S2CIapGetOrderId) {
        Log.d(DEBUG_TAG,"IOSPay ",data);
        if (cc.sys.os == cc.sys.OS_IOS) {

            let shopId =data.item.shopId;
            let content = JSON.stringify({
                shopId:shopId, 
                orderId:data.orderId,
            });
            let jsonStr = jsb.reflection.callStaticMethod("Util", "IOSPay:", content);
            Log.e(DEBUG_TAG,"ios IOSPay",jsonStr);
        }



    }

    public wxPay(payData:string) 
    {
        Log.d(DEBUG_TAG,"wxPay",payData);
        if(!this.jsb){    
            return;
        }

        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/util/Util", "wxPay", "(Ljava/lang/String;)Ljava/lang/String;", payData);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            Log.e(DEBUG_TAG,"ios 暂未处理");
        } else{
            Manager.tips.debug("暂时不支持非移动支付");
        }
    }


    public isHaveAli():boolean{
        if(!this.jsb){
            return false;
        }
        if (cc.sys.os == cc.sys.OS_ANDROID) {
           let ishave =  jsb.reflection.callStaticMethod("org/cocos2dx/javascript/util/Util", "isHaveAli", "(Ljava/lang/String;)Z", "");
           return ishave;

        } else if (cc.sys.os == cc.sys.OS_IOS) {
           return jsb.reflection.callStaticMethod("Util", "isHaveAli:", "");
        }
        else
        {
            return false;
        }
    }

    public alipay(payData:string) 
    {
        if(!this.jsb){    
            return;
        }
        Log.d(DEBUG_TAG,"alipay",payData);
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/util/Util", "alipay", "(Ljava/lang/String;)Ljava/lang/String;", payData);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            Log.e(DEBUG_TAG,"ios 暂未处理");
        } else{
            Manager.tips.debug("暂时不支持非移动支付");
        }
    }

    public huaWeiPay(payData:string) 
    {
        if(!this.jsb){    
            return;
        }
        Log.d(DEBUG_TAG,"huaWeiPay",payData);
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/util/Util", "huaWeiPay", "(Ljava/lang/String;)Ljava/lang/String;", payData);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            Log.e(DEBUG_TAG,"ios 暂未处理");
        } else{
            Manager.tips.debug("暂时不支持非移动支付");
        }
    }



    public copyToClipboard(copyStr:string) 
    {
        if(!this.jsb){    
            return;
        }
        Log.d(DEBUG_TAG,"copyToClipboard",copyStr);
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/util/Util", "copyToClipboard", "(Ljava/lang/String;)Ljava/lang/String;", copyStr);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            Log.e(DEBUG_TAG,"ios 暂未处理");
        } else{
            Manager.tips.debug("暂时不支持非移动设备");
        }
    }

    public getClipboardStr(copyStr:string)
    {
        if(!this.jsb){    
            return;
        }

        if (cc.sys.os == cc.sys.OS_ANDROID) {
            copyStr = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/util/Util", "getClipboardStr", "(Ljava/lang/String;)Ljava/lang/String;", copyStr);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            Log.e(DEBUG_TAG,"ios 暂未处理");
        } else{
            Manager.tips.debug("暂时不支持非移动设备");
        }
        Log.d(DEBUG_TAG,"getClipboardStr",copyStr);
        return copyStr;
    }

    public getMetaData(metaKey:string)
    {
        if(!this.jsb){    
            return metaKey;
        }

        let metaData:string = "";
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            metaData = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/util/Util", "getMetaData", "(Ljava/lang/String;)Ljava/lang/String;", metaKey);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            metaData = "ios";
        } else{
            metaData = cc.sys.os;
        }
        return metaData;
    }
    

    public ReplacementOrder(payData:string) 
    {
        if(!this.jsb){    
            return;
        }
        Log.d(DEBUG_TAG,"ReplacementOrder",payData);
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/util/Util", "ReplacementOrder", "(Ljava/lang/String;)Ljava/lang/String;", payData);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            Log.e(DEBUG_TAG,"ios 暂未处理");
        } else{
            Manager.tips.debug("暂时不支持非移动支付");
        }
    }

    public WxInvite() 
    {
        let cfg = Manager.utils.getWebConfig();
        if(cfg == null){
            Manager.tips.show("分享参数未初始化，请登录重试");
            return;
        }
        let shareData:any = {};
        shareData.isTimelineCb = "false";
        shareData.title = cfg.info.share_title;
        shareData.description = cfg.info.share_description;
        shareData.webURL = cfg.info.share_url+Manager.gd.guid();
        shareData.path = cfg.info.share_icon;
        Manager.platform.ShareUrlToWx(shareData);
    }

    public ShareUrlToWx(shareData:any) 
    {
        if(CC_WECHATGAME){
            Manager.tips.debug("微信小程序不支持打开url");
            return;
        }
        if(!this.jsb){    
            cc.sys.openURL(shareData.webURL);
            return;
        }
        let shareJson = JSON.stringify(shareData);
        Log.d(DEBUG_TAG,"ShareUrlToWx",shareJson);
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/util/Util", "ShareUrl", "(Ljava/lang/String;)Ljava/lang/String;", shareJson);
        } else if (cc.sys.os == cc.sys.OS_IOS) {

            let jsonStr = jsb.reflection.callStaticMethod("Util", "ShareUrl:", shareJson);
            // Log.e(DEBUG_TAG,"ios 暂未处理");
            // if(!this.jsb){    
            //     cc.sys.openURL(shareData.webURL);
            //     return;
            // }
        } else{
            if(!this.jsb){    
                cc.sys.openURL(shareData.webURL);
                return;
            }
        }
    }


    //截图
    public catpureNodeForNative(imageName = "shareImage.png",endFun:(string) => void) {
        // let node = new cc.Node();
        let nodefgui  = fgui.GRoot.inst.node;
        // cc.log("nodefgui.anchorY  = ",nodefgui.anchorY);
        //注意了，这里要讲节点的位置改为右上角，不然截图只有1/4
        nodefgui.anchorX=0.5;
        nodefgui.anchorY=0.5;
        let camera = nodefgui.addComponent(cc.Camera);
        // 设置你想要的截图内容的 cullingMask
        camera.cullingMask = 0xffffffff;
        // 新建一个 RenderTexture，并且设置 camera 的 targetTexture 为新建的 RenderTexture，这样 camera 的内容将会渲染到新建的 RenderTexture 中。
        let texture = new cc.RenderTexture();
        texture.initWithSize(nodefgui.width, nodefgui.height);
        camera.targetTexture = texture;
        // 渲染一次摄像机，即更新一次内容到 RenderTexture 中
        nodefgui.parent.scaleY = -1;  // 截图默认是y轴反转的，渲染前需要将图像倒过来，渲染完倒回去
        camera.render();
        nodefgui.parent.scaleY = 1

        // 这样我们就能从 RenderTexture 中获取到数据了
        let data = texture.readPixels();
        let fullPath = jsb.fileUtils.getWritablePath() + imageName;
        if (jsb.fileUtils.isFileExist(fullPath)) {
            jsb.fileUtils.removeFile(fullPath);
        }
        // let success = jsb.saveImageData(data, width, height, fullPath);
        let success = jsb['saveImageData'](data, nodefgui.width, nodefgui.height, fullPath);
        if (success) {
            cc.log("截屏成功，fullPath,width,height = ",fullPath,nodefgui.width,nodefgui.height);
            nodefgui.anchorX=0;
            nodefgui.anchorY=1;
            setTimeout(() => {
                endFun(fullPath);
            }, 2000);
        }
        else {
            nodefgui.anchorX=0;
            nodefgui.anchorY=1;
            cc.error("截屏失败！");
        }
    }

   public ShareToWxPic(isTimelineCb:string)
   {
        if(cc.sys.platform === cc.sys.WECHAT_GAME){
            let tempFilePath="";
            // wx.authorize({
            //     scope: 'scope.writePhotosAlbum',   // 需要获取相册权限
            //     success: (res)=>{     
            //         // 将截图保存到相册中
            //         wx.saveImageToPhotosAlbum({
            //             filePath: tempFilePath,
            //             success: (res)=>{
            //                 wx.showToast({
            //                     title: '图片保存成功',
            //                     icon: 'success',
            //                     duration: 2000
            //                 });
            //             },
            //             fail: (res)=>{
            //                 console.log(res);
            //                 console.log('图片保存失败');
            //             }
            //         });
            //     },
            //     fail: (res)=>{
            //         console.log('授权失败');
            //     }
            // });
            return;
        }
        Manager.platform.catpureNodeForNative("tempImage.png",
            (tempFilePath)=>{
                let content = {
                    isTimelineCb:isTimelineCb,
                    path:tempFilePath, //渠道包
                };
                Manager.platform.ShareToWxPicFinal(content);
            }

        );





   } 


    public ShareToWxPicFinal(shareData:any) 
    {
        if(!this.jsb){    
            Manager.tips.debug("微信分享截图");
            return;
        }
        let shareJson = JSON.stringify(shareData);
        Log.d(DEBUG_TAG,"ShareUrlToWx",shareJson);
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/util/Util", "ShareToWxPic", "(Ljava/lang/String;)Ljava/lang/String;", shareJson);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            let jsonStr = jsb.reflection.callStaticMethod("Util", "ShareToWxPic:", shareJson);

        } else{

        }
    }



}