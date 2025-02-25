import { AdFuncId, AdSdkType, PkgType } from "../../def/GameEnums";
import { ProtoDef } from "../../def/ProtoDef";
import { Config } from "../config/Config";
import GameData from "../data/GameData";
import { GameEvent } from "../event/GameEvent";
import { GameService } from "../net/GameService";
import { Utils } from "./Utils";

export class ADManeger {


    private static _instance: ADManeger = null!;
    public static Instance() { return this._instance || (this._instance = new ADManeger()  ); }
    static isShowreward:boolean =true;
    callbackFun:() => void;
    //广告类型
    private sdkTypes={
        [AdSdkType.AdSdkType_Null]:"AdvertSdkType_ks",
        [AdSdkType.AdSdkType_Ylh]:"AdvertSdkType_Ylh",
        [AdSdkType.AdSdkType_Pangle]:"AdvertSdkType_Pangle",
        [AdSdkType.AdSdkType_Bqt]:"AdvertSdkType_Bqt",
        [AdSdkType.AdSdkType_Ks]:"AdvertSdkType_ks",
        [AdSdkType.AdSdkType_Hw]:"AdvertSdkType_Hw",
        [AdSdkType.AdSdkType_Oppo]:"AdvertSdkType_Oppo",
        [AdSdkType.AdSdkType_XiaoMi]:"AdvertSdkType_XiaoMi",


    }

    //渠道包类型
    private pkgTypes=["PkgType_Official","PkgType_Apple","PkgType_HuaWei","PkgType_Oppo","PkgType_Vivo","PkgType_XiaoMi",];
    
    guanggaoCD:any = {
        [AdFuncId.Ad_AdReward]:0,
        [AdFuncId.Ad_DuanweiReward]:0,
        [AdFuncId.Ad_FreeCoin]:0,
        // [AdFuncId.Ad_FreeProp]:0,
        [AdFuncId.Ad_HfExchange]:0,
        [AdFuncId.Ad_LevelReward]:0,
        [AdFuncId.Ad_Lottery]:0,
        [AdFuncId.Ad_MatchEnter]:0,
        [AdFuncId.Ad_NoLose]:0,
        [AdFuncId.Ad_Null]:0,
        [AdFuncId.Ad_OnlineReward]:0,
        [AdFuncId.Ad_PoChanfuhuo]:0,
        [AdFuncId.Ad_RankListReward]:0,
        [AdFuncId.Ad_Relief]:0,
        [AdFuncId.Ad_SeasonReward]:0,
        [AdFuncId.Ad_SignIn]:0,
        [AdFuncId.Ad_TaskReward]:0,
        [AdFuncId.Ad_TimedLogin]:0,
        [AdFuncId.Ad_WinMore]:0,
    };
    loadedAd=false; //当前广告加载完成
    isInit= false;
    
    get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }
    
    private  Init()
    {
        Log.d("OnSDKCallAD  Init ");
        this.isInit=true;
        Manager.dispatcher.add(GameEvent.SDK_CALLID_AD, this.OnSDKCallAD, this);
        // Manager.dispatcher.add("AdError", this.AdError, this);

    }

    //广告回调
    private OnSDKCallAD(data) {
        Log.e("OnSDKCallAD",data.toString(),data.adCallName );
        if(data.adCallName != null )
        {
            if (data.adCallName =="OnC2SAdEnd") 
            {
                this.OnC2SAdEnd(data)
            }
            else if (data.adCallName =="GGerror") //广告没有填充或者出错的时候 看其他广告
            {
                //渠道类型
                let pkgT=Manager.platform.GetPkgType().PkgType;
                if (pkgT == PkgType.PkgType_Normal || pkgT == PkgType.PkgType_Apple ) 
                {
                    if (data.sdkType ==AdSdkType.AdSdkType_Ks) //快手没有去穿山甲
                    {
                        this.WatchAdsFinal(data.adname,data.intParam,data.strParam,{sdkName: this.sdkTypes[AdSdkType.AdSdkType_Pangle],sdkType:AdSdkType.AdSdkType_Pangle});
                    }
                    else if (data.sdkType ==AdSdkType.AdSdkType_Pangle) 
                    {
                        this.WatchAdsFinal(data.adname,data.intParam,data.strParam,{sdkName: this.sdkTypes[AdSdkType.AdSdkType_Ylh],sdkType:AdSdkType.AdSdkType_Ylh});
                    }
                    else if (data.sdkType ==AdSdkType.AdSdkType_Ylh) 
                    {
                        this.WatchAdsFinal(data.adname,data.intParam,data.strParam,{sdkName: this.sdkTypes[AdSdkType.AdSdkType_Ks],sdkType:AdSdkType.AdSdkType_Ks});
                    }

                }




            }


        }

    }



    private OnC2SAdStart(data:{
        adId: any; 
        pkgType: PkgType;
        sdkName: string; 
        sdkType: AdSdkType;
        funcId: AdFuncId;
        ip: string; intParam: any; strParam: any; adname: any;
    }) {
        type Packet = typeof pb.AdData;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.AdData);
        let packet = new Packet();
        packet.sdkType= Number(data.sdkType)
        packet.funcId =Number(data.funcId) 
        packet.intParam =Number(data.intParam)  //参数
        this.service.c2SAdStart(packet);
    }


    private OnC2SAdEnd(data) {
        Log.d("OnC2SAdEnd admanager ",data);
        this.loadedAd =true;
        if (ADManeger.isShowreward) {
            Log.d("OnC2SAdEnd admanager 设置成false 不暂停了 ");
            Manager.reward.pause = false;  
        }
        this.service.OnC2SGetShowItems();
        this.service.c2SAdEnd(data);
        if (this.callbackFun!=null) {
            this.callbackFun();
        }

        

    }

    public WatchAds(jsonData:{adname:string,parms1:string,parms2:string},endFun:() => void,isShowreward:boolean=true )
    {
        Manager.reward.pause = true;
        ADManeger.isShowreward=isShowreward;
        let adname = jsonData.adname;
        let parms1 = jsonData.parms1;
        let parms2 = jsonData.parms2;
        if (!this.isInit) 
        {
            this.Init();
        }
        this.callbackFun =endFun;
        
        //渠道类型
        let PkgType=Manager.platform.GetPkgType().PkgType;

        //sdk 广告类型
        let sdkType = this.GetSdkType(PkgType);
       
        this.WatchAdsFinal(adname,parms1,parms2,sdkType);


    }



    private WatchAdsFinal(adname,parms1,parms2, sdkType:{sdkName:string,sdkType:AdSdkType})
    {
        let adconfig=  Manager.utils.GetAdsConfig().json;
        // Log.w("  WatchAds  adconfig  ",adconfig)
        // Log.w("  WatchAds  adconfig adname  ",adconfig[adname])
        let adid =adconfig[adname][sdkType.sdkName];
        if (cc.sys.os == cc.sys.OS_IOS) 
        {
            adid =adconfig[adname][sdkType.sdkName+"IOS"];
        }
        else
        {
            adid =adconfig[adname][sdkType.sdkName];
        }
        let funcId :AdFuncId  = Number(adconfig[adname]["AdFuncId"])


        let pkgType=Manager.platform.GetPkgType().PkgType;
        let selfguid=Manager.dataCenter.get(GameData).player().guid;
        Log.w("  WatchAds  selfguid  ",selfguid)
        let content = {
            adId:adid.toString(), //广告ID 统一当成 字符串 传给原生
            pkgType:pkgType, //渠道包
            sdkName:sdkType.sdkName, //广告类型名字
            sdkType:sdkType.sdkType, 
            udid:selfguid, //guid
            funcId:funcId, //广告位置 枚举
            ip:Config.SERVER_ADDR_REMOTE,
            intParam:parms1,
            strParam:parms2,
            adname:adname,
        };
        //广告是否准备好
        this.loadedAd=false;
        Manager.platform.WatchAds(content);

        //10秒钟只能看一次广告
        if ( Number(Manager.utils.milliseconds) -Number(this.guanggaoCD[funcId])  < 1000*10 ) {

            Manager.tips.show("10秒内只能看一次广告");
            return;
        }
        this.guanggaoCD[funcId]  = Number(Manager.utils.milliseconds) 
        this.OnC2SAdStart(content);

        if(Manager.platform.isAdOpen()){
            let timerItem =  setTimeout(() => {
                if (!this.loadedAd) {
                    Manager.tips.show("广告还没准备好，请稍后重试！");
                    let content = JSON.stringify({
                        sdkName:sdkType.sdkName,
                    });
            
                    Manager.platform.CancelAd(content);
                }
            }, 1000*10);
        }
    }



    /**
     * 
     * @param pkgType 渠道包
     * @returns 
     */
    GetSdkType(pkgType:PkgType):{sdkName:string,sdkType:AdSdkType}
    {
        //暂时都是优量汇
        if (PkgType.PkgType_HuaWei== pkgType)
        {
            return {sdkName:"AdvertSdkType_Hw",sdkType:AdSdkType.AdSdkType_Hw}
        }
        else if (PkgType.PkgType_Oppo== pkgType) 
        {
            return {sdkName:"AdvertSdkType_Oppo",sdkType:AdSdkType.AdSdkType_Oppo}
        }
        else if (PkgType.PkgType_Vivo== pkgType) 
        {
            return {sdkName:"AdvertSdkType_Vivo",sdkType:AdSdkType.AdSdkType_Null}
        }
        // else if (PkgType.PkgType_WeiXinH5== pkgType) 
        // {
        //     return {sdkName:"AdvertSdkType_XiaoMi",sdkType:AdSdkType.AdSdkType_Null}
        // }
        else 
        {
            //广告分时间段
            let data = Manager.gd.get<pb.S2CAdCfgs>(ProtoDef.pb.S2CAdCfgs);
            Log.d("GetSdkType  S2CAdCfgs  data ",data);
            if (data!=null) 
            {
                let tt =Date.timeNow()-Manager.utils.getStartTimeOfDate()

                // Log.d("GetSdkType  tt ",tt );
                for (let i = 0; i < data.items.length; i++) 
                {
                    let item = data.items[i];

                    if (tt > item.startTime  && tt<= item.endTime )  
                    {
                        
                        //  Log.d("GetSdkType  009  [item.sdkType ",item.sdkType );
                        return {sdkName:this.sdkTypes[item.sdkType],sdkType:item.sdkType}
                    }
                }
            }

        }

         return {sdkName:this.sdkTypes[AdSdkType.AdSdkType_Ks],sdkType:AdSdkType.AdSdkType_Ks}

    }



    //广告播放错误
    AdError(jsonStr:string):any
    {
        this.loadedAd =true;
       let content = JSON.parse(jsonStr);

        Log.w("AdError content ",content)
        Manager.tips.show("广告播放异常，请稍后重试！");


        
    }

    //广告加载完成 失败
    LoadAds(jsonStr:string):any
    {

       let content = JSON.parse(jsonStr);
       this.loadedAd =true;
        Log.w("AdError content ",content)
        Manager.tips.show("广告播放异常，请稍后重试！");


        
    }
    


}