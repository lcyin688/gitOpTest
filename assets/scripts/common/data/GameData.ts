import { AuthType, BuyCurrencyType, ClientDeviceType, CurrencyType, DouSubID, GroupId, MahSubID, PlayerAttr } from "../../def/GameEnums";
import { ProtoDef } from "../../def/ProtoDef";
import { Data } from "../../framework/data/Data";
import { ByteArray } from "../../framework/plugin/ByteArray";
import { Config } from "../config/Config";
import { GameEvent } from "../event/GameEvent";
import { CmmProto } from "../net/CmmProto";

export default class GameData extends Data {
    static bundle = "Main";

    private _datas: { [key: string]: any } = {};

    private _group = {};

    public isLocal:boolean = false;

    LocalPosition = "";

    inHall():boolean{
        if(this.LocalPosition == "HallView"){
            return true;
        }
        return false;
    }

    isPlayerInGameView():boolean{
        if(this.LocalPosition != "HallView" && this.LocalPosition != "MainView"){
            return true;
        }
        return false;
    }

    get<T>(dataName: string): T | null {
        return this._datas[dataName];
    }

    put(dataName: string, data: any) {
        this._datas[dataName] = data;
    }

    clear() {
        this._datas = {};
    }

    clearCache() {
        this._datas[ProtoDef.pb.S2CGoOnGame] = null;
        this._datas[ProtoDef.pb.S2CGetTables] = null;
    }

    updatePlayer(p:pb.IPlayer){
        if(p == null){
            return;
        }
        Log.e("updatePlayer   p : ",p);
        this.put(ProtoDef.pb.Player,p);
        this._group = {};
        this.updateGroupValue(p.groups);
    }


    private updateGroupValue(gv:pb.IGroupValue[]){
        Log.e("updateGroupValue   gv : ",gv);
        for (let index = 0; index < gv.length; index++) {
            const et = gv[index];
            let gs = this._group[et.groupId];
            if (gs == null){
                gs = {};
            }
            gs[et.subId] = et;
            this._group[et.groupId] = gs;
            dispatch(GameEvent.GP_Update+et.groupId+"_"+et.subId,et);
        }
    }

    printPlayerData(){
        if (cc.sys.isBrowser){
            let dataBuffer = new Uint8Array(16);
            let bf = this.player().safeBox as any;
            let buff = bf.buffer.slice(bf.offset,bf.limit);
            let uint8Arr = new Uint8Array(buff);
            for (let index = 0; index < uint8Arr.length; index++) {
                dataBuffer[index] = uint8Arr[index];
            }
            Log.w("player:",this.player(),dataBuffer,Manager.utils.ReadUint128(dataBuffer));
            Log.w("player_group:",this._group);
        }
    }


    getPlayerSafeBox():number{
        let dataBuffer = new Uint8Array(16);
        let bf = this.player().safeBox as any;
        let buff = bf.buffer.slice(bf.offset,bf.limit);
        let uint8Arr = new Uint8Array(buff);
        for (let index = 0; index < uint8Arr.length; index++) {
            dataBuffer[index] = uint8Arr[index];
        }
        return Manager.utils.ReadUint128(dataBuffer);
    }

    getPlayerSafeBoxStr() : string {
        return Manager.utils.formatCoin(this.getPlayerSafeBox());
    }

    player():pb.Player{
        return this.get<pb.Player>(ProtoDef.pb.Player);
    }

    guid(){
        let p = this.player();
        if(p){
            return p.guid;
        }
        return 0;
    }

    headUrl():string{
        if(this.player().portraits.indexOf("http") != -1){
            return this.player().portraits + "?a=a.jpg";
        }
        let icon = this.headIndex();
        icon = icon + 101;
        Log.d("headUrl","head_"+icon);
        let iconUrl = fgui.UIPackage.getItemURL("hall","head_"+icon);
        return iconUrl;
    }

    headIndex():number{
        let icon = this.transheadIndex(this.player().portraits);
        return icon;
    }

    transheadIndex(portraits:string):number{
        let icon = Number(portraits.replace("file://",""));
        icon = icon % 16;
        if (icon < 0){
            icon = 16;
        }
        return icon;
    }

    playerheadUrl(portraits:string):string{
        // if (portraits.)
        if(portraits.indexOf("http") != -1){
            return portraits + "?a=a.jpg";
        }
        let icon = this.transheadIndex(portraits);
        icon = icon + 101;
        // Log.d("playerheadUrl","head_"+icon);
        let iconUrl = fgui.UIPackage.getItemURL("hall","head_"+icon);
        return iconUrl;
    }

    playerAttr(key:string | number) : any {
        let attr = this.player();
        if (attr && attr.attrs){
            let a = attr.attrs[key];
            if(a){
                return a;
            }
        }
        return 0;
    }

    playerVipIcon() : string {
        let level = this.playerAttr(PlayerAttr.PA_VipLevel);
        if(level < 0){
            level = 0;
        }
        if(level > 15){
            level = 15;
        }
        return fgui.UIPackage.getItemURL(Config.BUNDLE_HALL,"vipzhang_"+level);
    }

    playerCurrencies(key:string | number) : any {
        let c = this.player();
        if (c && c.currencies){
            let cs = c.currencies[key];
            if(cs){
                return cs;
            }
        }
        return 0;
    }

    playerAttrStr(key:string | number) : string {
        let attr = this.playerAttr(key);
        if(key == PlayerAttr.PA_SafeBox){
            return Manager.utils.formatCoin(attr);
        }
        return attr + "";
    }

    playerCurrenciesStr(key:string | number) : string {
        let str = this.playerCurrencies(key);
        if(CurrencyType.CT_Coin == key){
            return Manager.utils.formatCoin(str);
        }
        return Manager.utils.formatMoney(str);
    }

    setPlayerCurrencies(attrs : pb.S2CCurrency){
        for (const [key, val] of Object.entries(attrs.items)) {
            this.setPlayerCurrencie(key,val);
        }
    }

    setPlayerCurrencie(key,val){
        this.player().currencies[key]=val;
        // dispatch(GameEvent.Update_PlayerCurrency+"_"+key,val);
    }

    setPlayerAttr(key,val){
        this.player().attrs[key]=val;
        // dispatch(GameEvent.Update_PlayerAttr+"_"+key,val);
    }

    setPlayerAttrs(attrs : pb.S2CPlayerAttr){
        for (const [key, val] of Object.entries(attrs.items)) {
            this.setPlayerAttr(key,val);
        }
    }
    
    setPlayerGroupValue(attrs : pb.S2CGroupValue){
        this.updateGroupValue(attrs.groups);
    }


    playerGroupAll() : any {

        return  this._group;
    }

    playerGroup(groupId:any) : any {
        let data = this._group[groupId];
        Log.d("group data this._group ",this._group );
        Log.d("group data",groupId,data);
        return data;
    }

    playerGroupValue(groupId:any,subId:any) : any {
        let sub = this.playerGroup(groupId);
        if (sub){
            return sub[subId];
        }
        return null;
    }

    playerGV(groupId:any,subId:any,df:any) : any {
        let sub = this.playerGroupValue(groupId,subId);
        if (sub){
            // Log.e("sub",sub);
            if(sub.value != null){
                return sub.value;
            }
        }
        return df;
    }

    playerAuth(serverToken:string=""){
        type Packet = typeof rpc.C2SAuth;
        let Packet:Packet = Manager.protoManager.getProto(ProtoDef.rpc.C2SAuth);
        let auth = new CmmProto<rpc.C2SAuth>(Packet);
        auth.cmd = ProtoDef.rpc.C2SAuth;
        auth.data = new Packet();
        
        
        // auth.data.accountType = rpc.AuthType.AT_Internal;
        auth.data.accountType = Manager.localStorage.getItem("accountType",AuthType.AT_Internal);
        let LoginArgs = Manager.protoManager.getProto(ProtoDef.rpc.LoginArgs);
        auth.data.loginArgs = new LoginArgs();

        let uuid = Manager.localStorage.getItem("uuid","");
        auth.data.loginArgs.token = Manager.localStorage.getItem("server_token","");
        if(auth.data.loginArgs.token == ""){
            auth.data.loginArgs.token = Manager.localStorage.getItem("token","");
        }
        // auth.data.loginArgs.token = "aa16546608831";
        // auth.data.loginArgs.token = "weixin_oeQgx55Rq-jnHpv3pYVZGmXjM_QE";

        Log.d("auth.data.loginArgs.token",auth.data.loginArgs.token);
        if(auth.data.accountType == AuthType.AT_Internal){
            if (uuid == null){
                uuid = Manager.utils.uuid;
                Manager.localStorage.setItem("uuid",uuid);
            }
            auth.data.loginArgs.did = uuid;
            if(auth.data.loginArgs.token == ""){
                auth.data.loginArgs.token = uuid;
            }
        }
        if (serverToken.length > 0){
            auth.data.loginArgs.token = serverToken;
        }
        auth.data.loginArgs.devDesc = Manager.platform.deviceDesc();
        auth.data.loginArgs.pkg = Manager.platform.GetPkgType().PkgType;
        // msg.PkgType.PkgType_Official
        auth.data.loginArgs.authType = auth.data.accountType;

        let ver = Config.RES_BUILD;
        let __ver = Manager.localStorage.getItem("__ver","");
        if(__ver != "" && __ver.length > 1){
            ver = __ver;
        }

        auth.data.loginArgs.version = ver;
        
        if(cc.sys.platform == cc.sys.ANDROID){
            auth.data.loginArgs.devType = ClientDeviceType.CDT_Android;
        }else if(cc.sys.platform == cc.sys.IPHONE){
            auth.data.loginArgs.devType = ClientDeviceType.CDT_IOS;
        }else if(cc.sys.platform == cc.sys.IPAD){
            auth.data.loginArgs.devType = ClientDeviceType.CDT_IOS;
        }else if(cc.sys.platform == cc.sys.MACOS){
            auth.data.loginArgs.devType = ClientDeviceType.CDT_MacOS;
        }else if(cc.sys.platform == cc.sys.WIN32){
            auth.data.loginArgs.devType = ClientDeviceType.CDT_Windows;
        }else if(cc.sys.platform == cc.sys.WINRT){
            auth.data.loginArgs.devType = ClientDeviceType.CDT_Windows;
        }else{
            if(cc.sys.isBrowser){
                auth.data.loginArgs.devType = ClientDeviceType.CDT_WebPlayer;
            }
        }

        let __aid = Manager.localStorage.getItem("__aid","");
        if(__aid != "" && __aid.length > 0){
            auth.data.accountType = Number(__aid);
            auth.data.loginArgs.authType = auth.data.accountType;
        }

        let __cid = Manager.localStorage.getItem("__cid","");
        if(__cid != "" && __cid.length > 0){
            auth.data.loginArgs.pkg = Number(__cid);
        }

        auth.data.loginArgs.time = Manager.utils.milliseconds;


        


        let group =             
        auth.data.loginArgs.authType
        +auth.data.loginArgs.token
        +auth.data.loginArgs.devType
        +auth.data.loginArgs.did
        +auth.data.loginArgs.time
        let sign = md5(group).toString();
        auth.data.loginArgs.param = sign;
        Log.d("___authData",auth);
        return auth;
    }

    // getPropIcon(id:number):string{
    //     let name = "icon_jinbi";
    //     if (id==CurrencyType.CT_Coin){
    //         name = "icon_jinbi";
    //     }else if (id==CurrencyType.CT_Gem){
    //         name = "icon_zuan";
    //     }else if (id==CurrencyType.CT_HuafeiQuan ){
    //         name = "ui_sign_dou2";
    //     }else{
    //         name = "propKaItem";
    //     }
    //     return fgui.UIPackage.getItemURL("hall",name);
    // }

    //获取道具图标 只能在包内
    getPropIcon(id:number,l:fgui.GLoader = null):string{
        // Log.d("l",l);
        let name = "icon_jinbi";
        if (id==CurrencyType.CT_Coin){
            name = "icon_jinbi";
        }else if (id==CurrencyType.CT_Gem){
            name = "icon_zuan";
        }else if (id==CurrencyType.CT_HuafeiQuan ){
            name = "ui_sign_dou2";
        }else{
            name = "";
            if(l != null){
                l.icon = fgui.UIPackage.getItemURL("hall","propKaItem");
                if(l._content2 != null){
                    let com = l._content2.asCom;
                    if(com){
                        let djData = Manager.utils.GetDefaultDaoJuConfigItem(id);
                        com.getChild("propItemBg").icon = fgui.UIPackage.getItemURL("hall",djData.bgPath);
                        com.getChild("propItemIcon").icon = fgui.UIPackage.getItemURL("hall","daoju_kapai_"+id);
                    }
                }
            }
            return name;
        }
        if(l == null){
            return fgui.UIPackage.getItemURL("hall",name);
        }
        l.icon = fgui.UIPackage.getItemURL("hall",name);
    }

    getNBPropIcon(id:number,l:fgui.GLoader = null):string{
        // Log.d("l",l);
        let name = "ui_shop_dou_6";
        if (id==CurrencyType.CT_Coin){
            name = "ui_shop_dou_6";
        }else if (id==CurrencyType.CT_Gem){
            name = "ui_shop_icon_6";
        }else if (id==CurrencyType.CT_HuafeiQuan ){
            name = "ui_sign_dou2";
        }else{
            name = "";
            if(l != null){
                l.icon = fgui.UIPackage.getItemURL("hall","propKaItem");
                if(l._content2 != null){
                    let com = l._content2.asCom;
                    if(com){
                        let djData = Manager.utils.GetDefaultDaoJuConfigItem(id);
                        com.getChild("propItemBg").icon = fgui.UIPackage.getItemURL("hall",djData.bgPath);
                        com.getChild("propItemIcon").icon = fgui.UIPackage.getItemURL("hall","daoju_kapai_"+id);
                    }
                }
            }
            return name;
        }
        if(l == null){
            return fgui.UIPackage.getItemURL("hall",name);
        }
        l.icon = fgui.UIPackage.getItemURL("hall",name);
    }

    getActivePropIcon(id:number,l:fgui.GLoader = null):string{
        // Log.d("l",l);
        let name = "ui_shop_dou_2";
        if (id==CurrencyType.CT_Coin){
            name = "ui_shop_dou_2";
        }else if (id==CurrencyType.CT_Gem){
            name = "ui_shop_icon_6";
        }else if (id==CurrencyType.CT_HuafeiQuan ){
            name = "ui_sign_dou2";
        }else{
            name = "";
            if(l != null){
                l.icon = fgui.UIPackage.getItemURL("hall","propKaItem");
                if(l._content2 != null){
                    let com = l._content2.asCom;
                    if(com){
                        let djData = Manager.utils.GetDefaultDaoJuConfigItem(id);
                        com.getChild("propItemBg").icon = fgui.UIPackage.getItemURL("hall",djData.bgPath);
                        com.getChild("propItemIcon").icon = fgui.UIPackage.getItemURL("hall","daoju_kapai_"+id);
                    }
                }
            }
            return name;
        }
        if(l == null){
            return fgui.UIPackage.getItemURL("hall",name);
        }
        l.icon = fgui.UIPackage.getItemURL("hall",name);
    }

    getActivePropIcon4(id:number):string{
        let name = "ui_shop_dou_4";
        if (id==CurrencyType.CT_Coin){
            name = "ui_shop_dou_4";
        }else if (id==CurrencyType.CT_Gem){
            name = "ui_shop_icon_4";
        }else if (id==CurrencyType.CT_HuafeiQuan ){
            name = "ui_sign_dou2";
        }else{
            Log.e("getPropIcon err:",id);
            return ""
        }
        return fgui.UIPackage.getItemURL("hall",name);
    }

    getShopIcon(itemType:number,index:number):string{
        let name = "icon_jinbi";
        if (itemType==CurrencyType.CT_Coin){
            name = "ui_shop_dou_6";
            if (index<6 ) 
            {
                name = "ui_shop_dou_"+(index+1);
            }
        }else if (itemType==CurrencyType.CT_Gem){
            name = "ui_shop_icon_6";
            if (index < 6 ) 
            {
                name = "ui_shop_icon_"+(index+1);
                // Log.d("url",name);
            }
        }else if (itemType==CurrencyType.CT_HuafeiQuan ){
            name = "ui_sign_dou2";
        }else if (itemType>10000){
            name = "ui_sign_dou2";
            let daoJuConfig = Manager.utils.GetDaoJuConfig();
            let daoJuConfigItem = Manager.utils.GetDaoJuConfigItem( itemType ,daoJuConfig );
            name = daoJuConfigItem.bgPath;
        }
        else
        {
            Log.e("getPropIcon err:",itemType);
            return ""
        }
        return fgui.UIPackage.getItemURL("hall",name);
    }


    getCurrencyTypeName(ct:number):string{
        let name = "钻石";
        if (ct==BuyCurrencyType.BuyCurrencyType_Rmb){
            name = "￥";
        }else if (ct==BuyCurrencyType.BuyCurrencyType_Gem){
            name = "钻石";
        }
        else if (ct==BuyCurrencyType.BuyCurrencyType_HuafeiQuan){
            name = "券";
        }
        
        return name
    }

    getCurrencyTypeIcon(ct:number):string{
        let name = "icon_zuan";
        if (ct==BuyCurrencyType.BuyCurrencyType_Rmb){
            Log.w("不能用人民币直接购买 ")
            name = "";
        }else if (ct==BuyCurrencyType.BuyCurrencyType_Gem){
            name = "icon_zuan";
        }
        else if (ct==BuyCurrencyType.BuyCurrencyType_HuafeiQuan){
            name = "ui_sign_dou2";
        }
        return fgui.UIPackage.getItemURL("hall",name);
    }

    getNextMatch(curGameType:string):any{
        let data = this.get<pb.S2CGetTables>(ProtoDef.pb.S2CGetTables);
        if(data == null){
            Log.e("房间列表信息没有找到");
            return null;
        }
        if(curGameType.trim().length == 0){
            Log.e("错误传入玩法类型参数为空");
            return null;
        }
        let coin = this.playerCurrencies(CurrencyType.CT_Coin);
        for (let index = 0; index < data.tables.length; index++) {
            let t = data.tables[index];
            Log.d(curGameType,t.catName);
            if(t.catName == curGameType){
                for (let gIndex = 0; gIndex < t.items.length; gIndex++) {
                    const et = t.items[gIndex];
                    if(coin >= et.recommCurrency.first && ( et.recommCurrency.second == 0 || coin <= et.recommCurrency.second)){
                        return {gt:data.gameType,cfgId:et.cfgId,name:et.name}
                    }
                }
            }
        }
        Log.e("没有找到适合的场次");
        return null;
    }

    JqpLeftTime():number{
        return this.playerGV(GroupId.GI_Dou,DouSubID.DouSubID_RecordExpireTime,0);
    }
    MJJqpLeftTime():number{
        return this.playerGV(GroupId.GI_Mj,MahSubID.MahSubID_JiPaiQiRestTime,0);
    }  
    
    getCurrencyHBTypeName(ct:number):string{
        let name = "钻石";
        if (ct==CurrencyType.CT_Null){
            name = "";
        }else if (ct==CurrencyType.CT_Coin){
            name = "金币";
        }
        else if (ct==CurrencyType.CT_Gem){
            name = "钻石";
        }
        else if (ct==CurrencyType.CT_HuafeiQuan){
            name = "话费券";
        }
        return name
    }
}
