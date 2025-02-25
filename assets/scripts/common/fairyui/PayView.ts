
import { IapType, PkgType } from "../../def/GameEnums";
import { ProtoDef } from "../../def/ProtoDef";
import UIView from "../../framework/core/ui/UIView";
import { Config } from "../config/Config";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PayView extends UIView {

    private pay:fgui.GComponent = null;

    public static getPrefabUrl() {
        return "prefabs/HallView";
    }

    static getViewPath(): ViewPath {
        let path : ViewPath = {
            	/**@description 资源路径 creator 原生使用*/
            assetUrl: "ui/hall",
            /**@description 包名称 fgui 使用*/
            pkgName : "hall",
            /**@description 资源名称 fgui 使用*/
            resName : "PayView",
        }
        return path;
    }

    onLoad() {
        super.onLoad();
    }

    onFairyLoad(): void {
        this.pay = this.root.getChild("pay").asCom;
        this.pay.getChild("close").onClick(this.onClickClose,this);

        let uiconfig = Manager.gd.get<pb.S2CUISwitches>(ProtoDef.pb.S2CUISwitches);
        if(uiconfig != null && uiconfig.items != null){
            let list = this.pay.getChild("list").asList;
            list.removeChildrenToPool();
            if(uiconfig.items["pay_alipay"] != null && uiconfig.items["pay_alipay"] > 0){
                let com = list.addItemFromPool().asCom;
                com.getChild("icon").icon = fgui.UIPackage.getItemURL(Config.BUNDLE_HALL,"ui_shop_icon_8");
                com.getChild("title").text = "支付宝";
                com.asCom.getChild("line").visible = true;
                com.data = IapType.IapType_Alipay;
            }
            if(uiconfig.items["pay_wx"] != null && uiconfig.items["pay_wx"] > 0){
                let com = list.addItemFromPool().asCom;
                com.getChild("icon").icon = fgui.UIPackage.getItemURL(Config.BUNDLE_HALL,"ui_shop_icon_7");
                com.getChild("title").text = "微信支付";
                com.asCom.getChild("line").visible = true;
                com.data = IapType.IapType_WeiXin;
            }


            list.on(fgui.Event.CLICK_ITEM, this.onClickPay, this);
            let c = list.getChildAt(list._children.length-1);
            if(c != null){
                c.asCom.getChild("line").visible = false;
            }
        }

        let data = Manager.gd.get<pb.ShopItem>(ProtoDef.pb.ShopItem);
        if(data != null){
            this.pay.getChild("name").text = data.amount+"+"+data.donateAmount+data.catName;
            this.pay.getChild("je").text = "￥"+data.price.toString();
        }
    }

    onClickPay(com:fgui.GComponent){

        let data = Manager.gd.get<pb.ShopItem>(ProtoDef.pb.ShopItem);
        function callBackF(params:boolean) 
        {
            Log.e("Manager.alert !!!!!!!!!!!!!!!!!!!!!!!!!!ff",params);

        }
        if (Manager.platform.GetPkgType().PkgType != PkgType.PkgType_WeiXinH5) 
        {
            //如果没有微信或者支付宝的
            if (com.data== IapType.IapType_Alipay && !Manager.platform.isHaveAli() ) 
            {
                Manager.utils.CommonShowMsg("TS_ShangCheng_12",callBackF);
                return;
            }
            else if (com.data== IapType.IapType_WeiXin && !Manager.platform.isHaveWx() ) 
            {
                Manager.utils.CommonShowMsg("TS_ShangCheng_13",callBackF);
                return;
            }
        }


        if(data != null){
            if(com.data != null){
                Manager.pay.pay(com.data,data);
                this.onClickClose();
            }
        }
    }

    onClickClose(){
        Log.d("onClickClose");
        Manager.uiManager.close(PayView);
    }

}
