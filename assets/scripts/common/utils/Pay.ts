import { IapType, PkgType } from "../../def/GameEnums";
import { ProtoDef } from "../../def/ProtoDef";
import { Config, ViewZOrder } from "../config/Config";
import PayView from "../fairyui/PayView";
import { GameService } from "../net/GameService";

export class Pay {
    private static _instance: Pay = null!;
    public static Instance() { return this._instance || (this._instance = new Pay()); }

    choosePay(data:pb.IShopItem){

        //微信小游戏 IOS 平台直接走客服机器人
        if (PkgType.PkgType_WeiXinH5 == Manager.platform.GetPkgType().PkgType && cc.sys.os == cc.sys.OS_IOS ) 
        {
            
            // openapi.customerServiceMessage.send
            return ;
        }


        let uiconfig = Manager.gd.get<pb.S2CUISwitches>(ProtoDef.pb.S2CUISwitches);
        if(uiconfig == null){
            Manager.tips.show("暂未开启支付系统[0]");
            return;
        }
        if(uiconfig.items == null){
            Manager.tips.show("暂未开启支付系统[1]");
            return;
        }
 
        let payCount = 0;
        let payType = IapType.IapType_Null;
        if(uiconfig.items["pay_alipay"] != null && uiconfig.items["pay_alipay"] > 0){
            payCount++;
            payType = IapType.IapType_Alipay;
        }
        if(uiconfig.items["pay_wx"] != null && uiconfig.items["pay_wx"] > 0){
            payCount++;
            payType = IapType.IapType_WeiXin;
        }
        if(uiconfig.items["pay_hw"] != null && uiconfig.items["pay_hw"] > 0){
            payCount++;
            payType = IapType.IapType_HuaWei;
        }
        if(uiconfig.items["pay_ios"] != null && uiconfig.items["pay_ios"] > 0){
            payCount++;
            payType = IapType.IapType_Apple;
        }
        if(payCount == 0){
            Manager.tips.show("暂未开启支付系统[2]");
            return;
        }
        if(payCount == 1){
            this.pay(payType,data);
            return;
        }

        Manager.gd.put(ProtoDef.pb.ShopItem,data);
        Manager.uiManager.openFairy({ type: PayView, bundle: Config.BUNDLE_HALL, zIndex: ViewZOrder.Alert, name: "支付界面" });
    }

    get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }
    
    pay(payType:any,data:pb.IShopItem){
        this.service.getC2SIapGetOrderId(payType,data.id.toString());
    }
    
}