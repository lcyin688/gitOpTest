/**
 * @description 公共工具
 */

import { BuyCurrencyType, CurrencyType } from "../../def/GameEnums";
import { ProtoDef } from "../../def/ProtoDef";
import { Resource } from "../../framework/core/asset/Resource";
import { HttpPackage } from "../../framework/core/net/http/HttpClient";
import { Config, ViewZOrder } from "../config/Config";
import { HotfixConfig } from "../config/HotfixConfig";
import GameData from "../data/GameData";
import PlayTimeOut from "../fairyui/PlayTimeOut";


const VIEW_ACTION_TAG = 999;

export class Utils {
    getGameTypeNum(arg0: number): any {
        throw new Error("Method not implemented.");
    }
    private static _instance: Utils = null!;
    public static Instance() { return this._instance || (this._instance = new Utils()); }
    
    public static min_coin = 10000000;
    private daoJuConfig : cc.JsonAsset = null
    private tsPeiZhiConfig : cc.JsonAsset = null
    private adsConfig : cc.JsonAsset = null

    // public static realShopId :number = 0;


    

    private mtl: cc.Material = null;
    /**@description 显示视图动画 */
    showView(node: cc.Node | null, complete: Function) {
        if (node) {
            cc.Tween.stopAllByTag(VIEW_ACTION_TAG);
            cc.tween(node).tag(VIEW_ACTION_TAG)
                .set({ scale: 0.2 })
                .to(0.2, { scale: 1.15 })
                .delay(0.05)
                .to(0.1, { scale: 1 })
                .call(() => {
                    if (complete) complete();
                })
                .start();
        }
    }

    /**@description 隐藏/关闭视图统一动画 */
    hideView(node: cc.Node | null, complete: Function) {
        if (node) {
            cc.Tween.stopAllByTag(VIEW_ACTION_TAG);
            cc.tween(node).tag(VIEW_ACTION_TAG)
                .to(0.2, { scale: 1.15 })
                .to(0.1, { scale: 0.3 })
                .call(() => {
                    if (complete) complete();
                })
                .start();
        }
    }

    get milliseconds() : number{
        return Date.timeNowMillisecons();
    }

    get seconds() : number{
        return Date.timeNow();
    }
    //本日开始时间
    getStartTimeOfDate()
    {
        return new Date().setHours(0,0,0,0)/1000;

    }
    
    get uuid() : string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    transformTs(d:number) : string {
        let t = Date.now();
        let diff = Math.floor((t-d) / 1000 / 60);
        Log.d(d,t,diff);
        if (diff < 60){
            if (diff < 2) {
                return "刚才"
            }
            return diff+"分钟之前"
        }
        if (diff >= 60 && diff < 60 * 24){
            return Math.floor(diff/60)+"小时之前"
        }
        return this.formatDateObject(new Date(d));
    }

    zero(t){
        return t>9?t:('0'+t);
    }

    formatYesDate():string{
        // 1. 获取到年 月 日 小时 分钟 秒
        //  并且给需要的时间 补0
        let time = new Date(Date.now()-86400000);
        let year = time.getFullYear();
        let month = this.zero(time.getMonth()+1);
        let day = this.zero(time.getDate());
        // 2. 拼接字符串
        return year + month + day;
    }

    transformDjs(d:number) : string {
        let t = Date.now() / 1000;
        let diff = Math.floor((d-t));
        if(diff < 60){
            return diff + "秒"
        }
        if(diff >= 60 && diff < 60 * 60){
            let dd = Math.floor(diff / 60);
            return dd + "分" + (dd % 60) + "秒";
        }
        if(diff >= 60 * 60 && diff < 60 * 60 * 24){
            let dd = Math.floor(diff / (60 * 60));
            return dd + "小时" + (dd % 60) + "分";
        }
        let dd = Math.floor(diff / (60 * 60 * 24));
        return dd + "天" + (diff % 24) + "小时";
    }

    transformDataTime(d:number) : string {
        return (new Date(d)).toLocaleString();
    }

    formatCoin(arg0:number,t:number=CurrencyType.CT_Coin) : string {
        let fh = "";
        if(arg0 < 0){
            fh = "-";
            arg0 = -1*arg0;
        }
        let rate = 1;
        if(t==CurrencyType.CT_Coin){
            rate = Utils.min_coin;
        }
        return fh+this.formatMoney(arg0*rate);
    }

    formatMoney(arg0:number) : string {
        let dw = 10000;
        let fomatlen = 1
        if(arg0 < dw){
            return arg0.toString();
        }
        dw = 100000000*fomatlen;
        if(arg0 < dw){
            let data = this.checkLength(arg0 / 10000);
            return data + "万";
        }
        dw = 100000000*10000*fomatlen;
        if(arg0 < dw){
            let data = this.checkLength(arg0 / 100000000);
            return data + "亿";
        }
        dw = 100000000*10000*10000*fomatlen;
        if(arg0 < dw){
            let data = this.checkLength(arg0 / (100000000*10000));
            return data + "兆";
        }
        dw = 100000000*10000*10000*10000*fomatlen;
        if(arg0 < dw){
            let data = this.checkLength(arg0 / (100000000*10000*10000));
            return data + "京";
        }
        let data = this.checkLength(arg0 / (100000000*10000*10000*10000));
        return data + "垓";
    }

    formatCoinLoseWin(arg0:number,t:number=CurrencyType.CT_Coin) : string {
        let fh = "";
        if(arg0 < 0){
            fh = "-";
            arg0 = -1*arg0;
        }
        let rate = 1;
        if(t==CurrencyType.CT_Coin){
            rate = Utils.min_coin;
        }
        return fh+this.formatMoneyLoseWin(arg0*rate);
    }

    formatMoneyLoseWin(arg0:number) : string {
        let dw = 10000;
        let fomatlen = 10000
        let changNum = 10000000

        if(arg0 < dw){
            return arg0.toString();
        }
        dw = changNum*fomatlen;
        if(arg0 < dw){
            let data = this.checkLengthLoseWin(arg0 / 10000);
            return data + "万";
        }
        dw = changNum*10000*fomatlen;
        if(arg0 < dw){
            let data = this.checkLengthLoseWin(arg0 / 100000000);
            return data + "亿";
        }
        dw = changNum*10000*10000*fomatlen;
        if(arg0 < dw){
            let data = this.checkLengthLoseWin(arg0 / (100000000*10000));
            return data + "兆";
        }
        dw = changNum*10000*10000*10000*fomatlen;
        if(arg0 < dw){
            let data = this.checkLengthLoseWin(arg0 / (100000000*10000*10000));
            return data + "京";
        }
        let data = this.checkLengthLoseWin(arg0 / (100000000*10000*10000*10000));
        return data + "垓";
    }


    checkLength(data:number):string{
        if(data < 0){
            data = -1*data;
        }
        let str = data.toString();
        let sl = str.length;
        let lent = 6
        if(sl < lent){
            return str;
        }
        let index = str.indexOf(".");
        // Log.d("formatMoney:-",str,index,lent-index);
        if(index < lent - 1){
            let fixed = lent-index;
            if(fixed > 2){
                fixed = 2;
            }
            return str.substring(0,index+fixed);
            // return data.toFixed(fixed);
        }else if(index == lent - 1){
            return str.substring(0,index);
        }
        return Math.floor(data).toString();
    }


    checkLengthLoseWin(data:number):string{
        if(data < 0){
            data = -1*data;
        }
        //大于99的时候不表现小数
        if (data>99) 
        {
            data = Math.floor(data);
        }
        let str = data.toString();
        let sl = str.length;
        let lent = 10
        if(sl < lent){
            return this.AddQianFenWei(str)
            // return str;
        }
        let index = str.indexOf(".");
        // Log.d("formatMoney:-",str,index,lent-index);
        if(index < lent){
            let fixed = lent-index;
            if(fixed > 2){
                fixed = 2;
            }
            return this.AddQianFenWei(str.substring(0,index+fixed))
            // return str.substring(0,index+fixed);

        }



        return this.AddQianFenWei(Math.floor(data).toString() )
        // return Math.floor(data).toString();
    }


    AddQianFenWei(str:string)
    {
        return str.split("").reverse().join("").replace(/(\d{4})+?/g,function(s){
            return s+",";
        }).replace(/,$/,"").split("").reverse().join("")
    }


    //[]
    rand(min:number,max:number){
        return min + Math.floor((max-min+1) * Math.random())
    }

    randf(min:number,max:number):number{
        return Number((min + Math.floor(max-min+1) * Math.random()).toFixed(6));
    }

    formatDate(strDate: any, strFormat?: any) {
        if(strFormat == null){
            strFormat = "-"
        }
        var time = new Date(parseInt(strDate) * 1000);
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        var d = time.getDate();
        return y+strFormat+m+strFormat+d;
    }

    formatDateObject(time, strFormat?: any) {
        if(strFormat == null){
            strFormat = "-"
        }
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        var d = time.getDate();
        return y+strFormat+m+strFormat+d;
    }

    formatTime(strDate: any) {
        var time = new Date(parseInt(strDate) * 1000);
        var m = time.getMonth()+1;
        var d = time.getDate();
        var h = time.getHours();
        var s = time.getMinutes();
        return m+"-"+d + " " + h+":"+s;
    }

    formatTimeData() {
        var time = new Date();
        var h = time.getHours();
        var s = time.getMinutes();
        let hstr=""+h
        let sStr=""+s
        if (h<10) {
            hstr="0"+h
        }
        if (s<10) {
            sStr="0"+s
        }
        return hstr+":"+sStr;
       
    }

    dwIcon(iconId:number) :number{
        // let iconId = Math.floor((lv-1)/5) + 1;
        // Log.d("iconId:",iconId);
        if(iconId < 1){
            iconId = 1;
        }
        if(iconId > 14){
            iconId = 14;
        }
        return iconId;
    }

    gt(g:number):number{
        let m = Math.floor(g / 1000) * 1000;
        // Log.e("gt",g,m,g / 1000);
        return m;
    }

    fontSetText(com:fgui.GComponent,text:string,title1:string="title1",title:string="title"){
        if(com.getChild(title1) != null){
            com.getChild(title1).text = text;
        }
        com.getChild(title).text = text;
    }

    fontSyncText(com:fgui.GComponent,title1:string="title1",title:string="title"){
        if(com.getChild(title1) == null){
            return;
        }
        com.getChild(title1).text = com.getChild(title).text;
    }

    fontSyncSize(com:fgui.GComponent,title1:string="title1",title:string="title"){
        if(com.getChild(title1) == null){
            return;
        }
        com.getChild(title1).asTextField.fontSize = com.getChild(title).asTextField.fontSize;
    }

    fontSyncAll(com:fgui.GComponent,title1:string="title1",title:string="title"){
        this.fontSyncText(com,title1,title);
        this.fontSyncSize(com,title1,title);
    }


    
    GetGroupValueByKey( groups: pb.IGroupValue[],zhuid:number,subId:number ):number
    {
        for (let i = 0; i < groups.length; i++) 
        {
            if (groups[i].groupId== zhuid && groups[i].subId == subId  ) 
            {
                return groups[i].value
            }
        }
        return 0
    }


    GetItemDataByKey(zhuid:number )
    {
        let gd = Manager.dataCenter.get(GameData);
        let tableInfo = gd.playerGroupAll()
        // Log.e(" GetItemDataByKey   tableInfo ",tableInfo)
        if (tableInfo[zhuid]!=null ) {
            return tableInfo[zhuid]
        }
        else
        {
            return null
        }
    }

    GetDaoJuConfig():cc.JsonAsset
    {
       if (this.daoJuConfig==null) {
           Manager.assetManager.load("hall","json/CSV_DaoJu",cc.JsonAsset,null,function(data: Resource.CacheData){
               if(data.data != null){
                   Log.w( "daoJuConfig   : ",data.data)
                   this.daoJuConfig=data.data as cc.JsonAsset
               }else{
                   Log.d("=====","加载失败");
               }
               return this.daoJuConfig
           }.bind(this))
       }
       else
       {
           return this.daoJuConfig
       }
    }
   
    GetDjName(id:number){
        let dj = this.GetDefaultDaoJuConfigItem(id);
        if(dj != null){
            return dj.MingZi;
        }
        return "";
    }

    GetDefaultDaoJuConfigItem(id:number){
        let dj = this.GetDaoJuConfig();
        return this.GetDaoJuConfigItem(id,dj);
    }

    GetDaoJuConfigItem(id:number, daoJuConfig:cc.JsonAsset)
    {
        for (const [key, val] of Object.entries(daoJuConfig.json))
        {
            let itemData = daoJuConfig.json[key]
            if (daoJuConfig.json[key].XuHao ==id) 
            {
                return itemData
            }
        }
        return null
    }


    HaveDaoJuItemDdzJpq(data:pb.S2CGetBag = null):boolean
    {
        if(data == null){
            data = Manager.gd.get<pb.S2CGetBag>(ProtoDef.pb.S2CGetBag);
        }
        if(data == null){
            return false;
        }
        for (let index = 0; index < data.items.length; index++) {
            let dataItem = data.items[index]
            if (dataItem.item.itemType >=10023 && dataItem.item.itemType <=10025 && dataItem.item.value > 0) {
                return true
            }
        }
        return false 
    }

    HaveDaoJuItemDdzKDp(data:pb.S2CGetBag = null):boolean
    {
        if(data == null){
            data = Manager.gd.get<pb.S2CGetBag>(ProtoDef.pb.S2CGetBag);
        }
        if(data == null){
            return false;
        }
        for (let index = 0; index < data.items.length; index++) {
            let dataItem = data.items[index]
            if (dataItem.item.itemType >=10019 && dataItem.item.itemType <=10020 && dataItem.item.value > 0) {
                return true
            }
        }
        return false 
    }

    HaveDaoJuItemDdzCJJB(data:pb.S2CGetBag = null):boolean
    {
        if(data == null){
            data = Manager.gd.get<pb.S2CGetBag>(ProtoDef.pb.S2CGetBag);
        }
        if(data == null){
            return false;
        }
        for (let index = 0; index < data.items.length; index++) {
            let dataItem = data.items[index]
            if (dataItem.item.itemType >=10030 && dataItem.item.itemType <=10031 && dataItem.item.value > 0) {
                return true
            }
        }
        return false 
    }

    GetDaoJuItemData(id:number, data:pb.S2CGetBag)
    {
        for (let index = 0; index < data.items.length; index++) {
            let dataItem = data.items[index]
            if (id == dataItem.item.itemType ) {
                return dataItem
            }
        }
        return null 
    }

    
    GetShopItemData(id:number,costtype:number ,data:pb.S2CGetShopItems)
    {
        // let dataItemAll =data.catShop[costtype].items

        for (let i = 0; i < data.catShop.length; i++) 
        {
            for (let c = 0; c < data.catShop[i].items.length; c++) 
            {
                let itemData = data.catShop[i].items[c]
                if (itemData.ct == costtype && id== itemData.itemType) 
                {
                    return itemData
                }
            }
        }
        return null
    }

    transformLeftTime(d:number) : string {
        Log.d("transformLeftTime:",d);
        if(d < 60){
            return d + "秒";
        }
        d = Math.floor(d / 60);
        if(d < 60){
            return d + "分钟";
        }
        d = Math.floor(d / 60);
        return d + "小时";
    }

    GetTSPeiZhiConfig():cc.JsonAsset
    {
       if (this.tsPeiZhiConfig==null) {
           Manager.assetManager.load("resources","json/CSV_TSPeiZhi",cc.JsonAsset,null,function(data: Resource.CacheData){
               if(data.data != null){
                   Log.w( "TSPeiZhiConfig   : ",data.data)
                   this.tsPeiZhiConfig=data.data as cc.JsonAsset
               }else{
                   Log.d("=====","加载失败");
               }
               return this.tsPeiZhiConfig
           }.bind(this))
       }
       else
       {
           return this.tsPeiZhiConfig
       }
    }

    GetTiShiConfigItem(xuhao:string, config:cc.JsonAsset = null)
    {
        if(config == null){
            config = Manager.utils.GetTSPeiZhiConfig();
        }
        return config.json[xuhao]
        // for (const [key, val] of Object.entries(config.json))
        // {
        //     let itemData = config.json[key]
        //     if (config.json[key].TiShiIXuHao ==xuhao) 
        //     {
        //         return itemData
        //     }
        // }
        return null
    }
    
    PlaySpine(l:fgui.GLoader3D,fileName:string,ani:string,buddleName:string,endFun:() => void,isLoop =false )
    {
        if (l==null) {

            return
        }
        // Log.w(" PlaySpine   fileName ： ",fileName)
        // Log.w(" PlaySpine   ani ： ",ani)
        // Log.w(" PlaySpine   fgui.GLoader3D ： ",l._id,l.url)
        l.loop = isLoop;
        l.visible = true;
        l._onLoad = function(){
            let sp = <sp.Skeleton>l.content;
            sp.setCompleteListener(function(){
                // Log.w(" PlaySpine 播放完成  ani ： ",ani)
                // l.playing = false;
                l.loop = isLoop;
                // l.visible = false;
                endFun()
            }.bind(this));
            l.visible = true;
            // Log.w(" PlaySpine   _onLoad ： ",l._id,fileName)
        }.bind(this);
        let url = fgui.UIPackage.getItemURL(buddleName,fileName); 
        // Log.w(" PlaySpine   getItemURL ： ",l._id,url)
        l.icon = url
        l.skinName = "default";
        l.animationName = ani;
    }


    PlaySpineOnly(l:fgui.GLoader3D,ani:string,endFun:() => void )
    {
        let sp = <sp.Skeleton>l.content;
        sp.setCompleteListener(function(){
            // l.playing = false;
            endFun()
        }.bind(this));
        l.visible = true;
        l.animationName = ani;
    }


    JudgeIsHave(arg :  {} , temp:number){
        let isHave= false;
        if (arg==null || arg=={}  ) {
            return false;
        } else {
            for (const [key, val] of Object.entries(arg)) {
                // Log.e("IsWeiCard : ",key, val)
                if (Number(val)== Number(temp)) 
                {
                    isHave =true;
                    return isHave
                }
            
            }
        }
        return isHave;
    }

    showTips(nr:string,params:string[]=null){
        if(nr == null || nr.length == 0){
            Manager.tips.debug("未知提示[-3]");
            return;
        }
        Log.e(nr, params);
        let tips = String.format(nr, params);
        if(tips == null || tips.length == 0){
            Manager.tips.debug("未知提示[-2]");
            return;
        }
        Log.e(tips);
        Manager.tips.show(tips);
    }

    formatCNY(fen:number,fh:boolean=true,strfh="¥ "):string{
        // Log.d("fen:",fen);
        let data = fen / 100;
        // Log.d("data:",data);
        let sta = data.toFixed(2);
        // Log.d("sta:",sta);
        let last = sta.substring(sta.length-1,sta.length);
        if(last == "0"){
            sta = sta.substring(0,sta.length-1);
        }
        last = sta.substring(sta.length-2,sta.length);
        if(last == ".0"){
            sta = sta.replace(".0","");
        }
        if(fh){
            return strfh+sta;
        }
        return sta;
    }


    getCfgItem(key:string | number):number{
        let cfg = Manager.gd.get<pb.S2CCfgs>(ProtoDef.pb.S2CCfgs);
        if(cfg){
            if(cfg.items[key.toString()] != null){
                return cfg.items[key.toString()];
            }
        }
        return 0;
    }

    setInputTips(input:fgui.GTextInput,tips:string){
        input.promptText = String.format("[color=#999999]{0}[/color]",tips);
        input._editBox.placeholderLabel.horizontalAlign = input._editBox.textLabel.horizontalAlign;
        input._editBox.placeholderLabel.verticalAlign = input._editBox.textLabel.verticalAlign;
    }


    // setmtl(mtl: cc.Material)
    // {
    //     this.mtl=mtl;
    // }
    // getmtl()
    // {
    //     return this.mtl
    // }

    GetAdsConfig():cc.JsonAsset
    {
       if (this.adsConfig==null) {
           Manager.assetManager.load("hall","json/CSV_AdsConfig",cc.JsonAsset,null,function(data: Resource.CacheData){
               if(data.data != null){
                   Log.w( "adsConfig   : ",data.data)
                   this.adsConfig=data.data as cc.JsonAsset
               }else{
                   Log.d("=====","加载失败");
               }
               return this.adsConfig
           }.bind(this))
       }
       else
       {
           return this.adsConfig
       }
    }


    setHz(hz:fgui.GComponent,stars:fgui.GComponent,lv:number,dwData:pb.S2CGetSeasonDuanWeiCfg,showTitle:boolean=true,showAni=true){
        Log.d("dwData",dwData);
        if(dwData == null){
            return;
        }
        hz.visible = true;
        hz.getChild("tg").visible = showTitle;
        hz.getChild("ani").visible = showAni;
        let tt = hz.getChild("tile");
        tt.visible = showTitle;
        let item = dwData.items[lv-1];
        tt.text = item.name;
        let iconId = Manager.utils.dwIcon(item.diTuIcon);
        hz.getChild("n0").icon = fgui.UIPackage.getItemURL(Config.BUNDLE_HALL,"ui_rank_dw_di_"+iconId); 
        let starCount = Math.floor(lv%5);
        if(starCount == 0){
            starCount = 5;
        }
        Log.d("starCount:",starCount);
        let txt = hz.getChild("level").asTextField;
        // if (fontIndex > )
        let fontUrl = "SJYiShuZi"+item.dengJiIcon;
        Log.d("SJYiShuZi:",fontUrl);
        txt.font = fgui.UIPackage.getItemURL(Config.BUNDLE_HALL,fontUrl);
        txt.text = starCount.toString();

        if (stars != null){
            stars.visible = true;
            for (let index = 0; index < stars._children.length; index++) {
                let star = stars.getChild("s"+index).asCom;
                if(index < starCount){
                    star.getChild("star").visible = true;
                }else{
                    star.getChild("star").visible = false;
                }
            }
        }
    }

    setDwLabel(lb:fgui.GLabel,dwData:pb.IDuanWeiRewardCfg){
        let iconId = Manager.utils.dwIcon(dwData.diTuIcon);
        // Log.d("icon",iconId);
        lb.icon = fgui.UIPackage.getItemURL(Config.BUNDLE_HALL,"ui_rank_dw_di_"+iconId); 
        let starCount = Math.floor(dwData.level%5);
        if(starCount == 0){
            starCount = 5;
        }
        lb.text = starCount.toString();
        let tt = lb.getChild("title").asTextField;
        let fontUrl = "SJYiShuZi"+dwData.dengJiIcon;
        tt.font = fgui.UIPackage.getItemURL(Config.BUNDLE_HALL,fontUrl);
    }

    ReadUint128(arr, off=0) {

        if(arr.length < 16 || off > arr.length) //sanity check
        {
            Log.e("ReadUint128LE err",arr.length,off);
            return 0;
        }
        
        return parseInt("0x" +
            arr[off + 15].toString(16) +
            arr[off + 14].toString(16) +
            arr[off + 13].toString(16) +
            arr[off + 12].toString(16) +
            arr[off + 11].toString(16) +
            arr[off + 10].toString(16) +
            arr[off + 9].toString(16) +
            arr[off + 8].toString(16) +
            arr[off + 7].toString(16) +
            arr[off + 6].toString(16) +
            arr[off + 5].toString(16) +
            arr[off + 4].toString(16) +
            arr[off + 3].toString(16) +
            arr[off + 2].toString(16) +
            arr[off + 1].toString(16) +
            arr[off].toString(16)
        );
    }

    writeUInt128(buffer, value, offset=0) {
        var INT_2_16 = Math.pow(2, 16);
        var INT_2_21 = Math.pow(2, 21);
        var INT_2_32 = Math.pow(2, 32);
        
        /* 2^32 = 429 4967296 */
        var INT_2_32_0 = 4967296;
        var INT_2_32_1 = 429;
        
        /* 2^64 = 184467 4407370 9551616 */
        var INT_2_64_0 = 9551616;
        var INT_2_64_1 = 4407370;
        var INT_2_64_2 = 184467;
        
        /* 10^7 for base 2^16 */
        var BIN_10_7_0 = 38528;
        var BIN_10_7_1 = 152;
        
        /* 10^14 for base 2^16 */
        var BIN_10_14_0 = 16384;
        var BIN_10_14_1 = 4218;
        var BIN_10_14_2 = 23283;
        
        /* 10^21 for base 2^16 */
        var BIN_10_21_0 = 0;
        var BIN_10_21_1 = 56992;
        var BIN_10_21_2 = 44485;
        var BIN_10_21_3 = 13769;
        var BIN_10_21_4 = 54;
        
        /* 10^28 for base 2^16 */
        var BIN_10_28_0 = 0;
        var BIN_10_28_1 = 4096;
        var BIN_10_28_2 = 609;
        var BIN_10_28_3 = 15909;
        var BIN_10_28_4 = 52830;
        var BIN_10_28_5 = 8271;
        
        /* 10^35 for base 2^16 */
        var BIN_10_35_0 = 0;
        var BIN_10_35_1 = 0;
        var BIN_10_35_2 = 36840;
        var BIN_10_35_3 = 11143;
        var BIN_10_35_4 = 19842;
        var BIN_10_35_5 = 29383;
        var BIN_10_35_6 = 16993;
        var BIN_10_35_7 = 19;

        let l, a, b, c, d, e, f,
          x0, x1, x2, x3, y0, y1, z0, z1, z2, z3, z4, z5, z6, z7;
      
        l = value.length;
      
        a = +value.substring(l - 7);
        if (l > 7) {
          b = +value.substring(l - 14, l - 7);
        } else {
          b = 0;
        }
        if (l > 14) {
          c = +value.substring(l - 21, l - 14);
        } else {
          c = 0;
        }
        if (l > 21) {
          d = +value.substring(l - 28, l - 21);
        } else {
          d = 0;
        }
        if (l > 28) {
          e = +value.substring(l - 35, l - 28);
        } else {
          e = 0;
        }
        if (l > 35) {
          f = +value.substring(0, l - 35);
        } else {
          f = 0;
        }
      
        z0 = z1 = z2 = z3 = z4 = z5 = z6 = z7 = 0;
      
        // set a * 10^0
        if (a) {
          z0 = a % INT_2_16;
          z1 = Math.floor(a / INT_2_16);
        }
      
        // add b * 10^7
        if (b) {
          y0 = b % INT_2_16;
          y1 = Math.floor(b / INT_2_16);
          z0 += y0 * BIN_10_7_0;
          z1 += y0 * BIN_10_7_1 + y1 * BIN_10_7_0;
          z2 += y1 * BIN_10_7_1;
        }
      
        // add c * 10^14
        if (c) {
          y0 = c % INT_2_16;
          y1 = Math.floor(c / INT_2_16);
          z0 += y0 * BIN_10_14_0;
          z1 += y0 * BIN_10_14_1 + y1 * BIN_10_14_0;
          z2 += y0 * BIN_10_14_2 + y1 * BIN_10_14_1;
          z3 += y1 * BIN_10_14_2;
        }
      
        // add d * 10^21
        if (d) {
          y0 = d % INT_2_16;
          y1 = Math.floor(d / INT_2_16);
          z0 += y0 * BIN_10_21_0;
          z1 += y0 * BIN_10_21_1 + y1 * BIN_10_21_0;
          z2 += y0 * BIN_10_21_2 + y1 * BIN_10_21_1;
          z3 += y0 * BIN_10_21_3 + y1 * BIN_10_21_2;
          z4 += y0 * BIN_10_21_4 + y1 * BIN_10_21_3;
          z5 += y1 * BIN_10_21_4;
        }
      
        // add e * 10^28
        if (e) {
          y0 = e % INT_2_16;
          y1 = Math.floor(e / INT_2_16);
          z0 += y0 * BIN_10_28_0;
          z1 += y0 * BIN_10_28_1 + y1 * BIN_10_28_0;
          z2 += y0 * BIN_10_28_2 + y1 * BIN_10_28_1;
          z3 += y0 * BIN_10_28_3 + y1 * BIN_10_28_2;
          z4 += y0 * BIN_10_28_4 + y1 * BIN_10_28_3;
          z5 += y0 * BIN_10_28_5 + y1 * BIN_10_28_4;
          z6 += y1 * BIN_10_28_5;
        }
      
        // add f * 10^35
        if (f) {
          y0 = f % INT_2_16;
          z0 += y0 * BIN_10_35_0;
          z1 += y0 * BIN_10_35_1;
          z2 += y0 * BIN_10_35_2;
          z3 += y0 * BIN_10_35_3;
          z4 += y0 * BIN_10_35_4;
          z5 += y0 * BIN_10_35_5;
          z6 += y0 * BIN_10_35_6;
          z7 += y0 * BIN_10_35_7;
        }
      
        if (z0 >= INT_2_16) {
          z1 += Math.floor(z0 / INT_2_16);
          z0 %= INT_2_16;
        }
        if (z1 >= INT_2_16) {
          z2 += Math.floor(z1 / INT_2_16);
          z1 %= INT_2_16;
        }
        if (z2 >= INT_2_16) {
          z3 += Math.floor(z2 / INT_2_16);
          z2 %= INT_2_16;
        }
        if (z3 >= INT_2_16) {
          z4 += Math.floor(z3 / INT_2_16);
          z3 %= INT_2_16;
        }
        if (z4 >= INT_2_16) {
          z5 += Math.floor(z4 / INT_2_16);
          z4 %= INT_2_16;
        }
        if (z5 >= INT_2_16) {
          z6 += Math.floor(z5 / INT_2_16);
          z5 %= INT_2_16;
        }
        if (z6 >= INT_2_16) {
          z7 += Math.floor(z6 / INT_2_16);
          z6 %= INT_2_16;
        }
      
        x0 = z1 * INT_2_16 + z0;
        x1 = z3 * INT_2_16 + z2;
        x2 = z5 * INT_2_16 + z4;
        x3 = z7 * INT_2_16 + z6;
      
        buffer[offset + 3] = (x0 >>> 24) & 0xff;
        buffer[offset + 2] = (x0 >>> 16) & 0xff;
        buffer[offset + 1] = (x0 >>> 8) & 0xff;
        buffer[offset] = x0 & 0xff;
        offset += 4;
      
        buffer[offset + 3] = (x1 >>> 24) & 0xff;
        buffer[offset + 2] = (x1 >>> 16) & 0xff;
        buffer[offset + 1] = (x1 >>> 8) & 0xff;
        buffer[offset] = x1 & 0xff;
        offset += 4;
      
        buffer[offset + 3] = (x2 >>> 24) & 0xff;
        buffer[offset + 2] = (x2 >>> 16) & 0xff;
        buffer[offset + 1] = (x2 >>> 8) & 0xff;
        buffer[offset] = x2 & 0xff;
        offset += 4;
      
        buffer[offset + 3] = (x3 >>> 24) & 0xff;
        buffer[offset + 2] = (x3 >>> 16) & 0xff;
        buffer[offset + 1] = (x3 >>> 8) & 0xff;
        buffer[offset] = x3 & 0xff;
      }


      getUIConfig(cb:Function){
        let httpPackage = new HttpPackage;
        let platformId = Manager.platform.GetPkgType().PkgType;
        let __cid = Manager.localStorage.getItem("__cid","");
        if(__cid != "" && __cid.length > 1){
            platformId = Number(__cid);
        }
        let ver = Config.RES_BUILD;
        let __ver = Manager.localStorage.getItem("__ver","");
        if(__ver != "" && __ver.length > 1){
            ver = __ver;
        }
        let args = String.format("platform={0}&ssid=1&version={1}&secret=kLJZOkncYLP0V28aTmVRkXQEZ2TkQ4KP",platformId,ver);
        Log.d("___web args,",args);

        let __web = Manager.localStorage.getItem("__web","");
        if(__web != "" && __web.length > 1){
            Manager.updateManager.webUrl = __web;
        }

        httpPackage.data.url = Manager.updateManager.webUrl + String.format(`api/v1/client/init?token=4zY2XOahQaF9XiWy&ssid=1&version={0}&platform={1}&sign={2}`,ver,platformId,md5(args));

        httpPackage.data.isAutoAttachCurrentTime = false;
        httpPackage.sendEx((data) => {
            Log.d("___web data,",data.data);
            this.onUIConfig(data)
            cb(true);
        }, (err) => {
            Log.d("getUIConfig",err);
            Manager.tips.show("连接服务器失败,请检查网络,将自动为您尝试重新连接");
            cb(false);
        });
        }

    onUIConfig(dataStr:string){
        let data = JSON.parse(dataStr);
        Log.d("onUIConfig",data);
        let uiconfig = Manager.gd.get<pb.S2CUISwitches>(ProtoDef.pb.S2CUISwitches);
        if(uiconfig == null){
            type Packet = typeof pb.S2CUISwitches;
            let Packet:Packet = Manager.protoManager.getProto(ProtoDef.pb.S2CUISwitches);
            uiconfig = new Packet();
        }
        
        for (const [key, val] of Object.entries(data.data.ui)) {
            Log.d("onUIConfig key "+key+"  v  "+val);
            uiconfig.items[key] = val ? 1 : 0;
        }
        Manager.gd.put(ProtoDef.pb.S2CUISwitches,uiconfig);

        Manager.gd.put("webCfg",data.data);
        Log.d("S2CUISwitches",uiconfig);
    }

    getWebConfig():any{
        return Manager.gd.get("webCfg");
    }

    openUrl(url:string){
        cc.sys.openURL(url);
    }    

    openYhxy(){
        cc.sys.openURL('https://m.66qp.com.cn/service/yhxy.html');
    }    
    
    openYszc(){
        cc.sys.openURL('https://m.66qp.com.cn/service/yszc.html');
    }    

    openEtyszc(){
        cc.sys.openURL('https://m.66qp.com.cn/service/etyszc.html');
    }  
    
    getShopItem(shopId:number,data:pb.IS2CGetShopItems): pb.IShopItem
    {
        for (let i = 0; i < data.catShop.length; i++) 
        {
            for (let c = 0; c < data.catShop[i].items.length; c++) 
            {
                let item = data.catShop[i].items[c];
                if (shopId == item.id) 
                {
                    return item
                }
            }
        }
        return null;
        
    }
    
    quickSetIcon(obj:fgui.GObject,hide:boolean=false){
        if(obj == null){
            return;
        }
        let com = obj.asCom;
        if(com){
            com.getChild("icon").visible = !hide;
            let tt = com.getChild("title");
            if(hide){
                if(tt){
                    tt.x = 120;
                }
            }else{
                if(tt){
                    tt.x = 142;
                }
                if(Manager.platform.isAdOpen()){
                    obj.icon = fgui.UIPackage.getItemURL("hall","ui_daoju_icon_3");
                }else{
                    obj.icon = fgui.UIPackage.getItemURL("hall","ui_daoju_icon_33");
                }
            }
        }
    }



    //通用提示框
    CommonShowMsg(codeKey:string,	confirmCb?: (isOK: boolean) => void ,str0:string="",str1:string="" ,str2:string="")
    {
        let ts = Manager.utils.GetTiShiConfigItem(codeKey);
        if(ts == null){
            Manager.tips.debug("未知错误["+codeKey+"]");
            return;
        }
        Log.e("CommonShowMsg ts : ",ts);
        if(ts.NeiRong == null || ts.NeiRong.length == 0){
            Manager.tips.debug("未知错误[-1]");
            return;
        }
        let desStr =this.ComBinationStrFormat(ts.NeiRong,str0,str1,str2);
        Log.e("CommonShowMsg desStr : ",desStr);
        // function zuanshiff(params:boolean) 
        // {
        //     // Log.d("Manager.alert ff",params);
        // }
        if (ts.TiShiBiaoXian==1) // 提示表现(1=单按钮提示;2=双按钮提示;3=飘字提示;4=牌局飘字提示)
        {
            let cf:AlertConfig=
            {
                title:"提示",
                text: desStr, 
                confirmString:  ts.CaoZuoAnNiuWenBen1,
                confirmCb: confirmCb.bind(this),  
     
            };
            Manager.alert.show(cf);
        } 
        else  if (ts.TiShiBiaoXian==2) 
        {

            let cf:AlertConfig=
            {
                title:"提示",
                text: desStr,
                confirmString:  ts.CaoZuoAnNiuWenBen1,
                cancelString:  ts.CaoZuoAnNiuWenBen2,   
                confirmCb: confirmCb.bind(this),        
                cancelCb: confirmCb.bind(this),
            };
            Manager.alert.show(cf);
        }
        else  if (ts.TiShiBiaoXian== 3 ||ts.TiShiBiaoXian== 4 ) 
        {
            Manager.tips.show(desStr);
        }

    }


    ComBinationStrFormat(desStr:string ,str0:string="",str1:string="" ,str2:string=""):string
    {
        if (str0!="" ) {
            if (str1!="") 
            {
                if (str2!="") 
                {
                    desStr =String.format(desStr,str0,str1,str2)
                } 
                else 
                {
                    desStr =String.format(desStr,str0,str1)
                }

            }
            else
            {
                desStr =String.format(desStr,str0)
            }
        }
        return desStr;


    }

    //钻石不够得时候 直接人民币后买
    onClickItemBuy(price:number,id:number,num:number)
    {

        let gd = Manager.dataCenter.get(GameData);
        let zuanshiCount= gd.playerCurrencies(CurrencyType.CT_Gem);
        let needZuanCount = price-zuanshiCount;
        Log.e("onClickItemBuy  还需要钻石  :  ", needZuanCount   );
        let shopData = Manager.gd.get<pb.S2CGetShopItems>(ProtoDef.pb.S2CGetShopItems);
        let shopBuy : pb.ICatShopItem =null;
        for (let index = 0; index < shopData.catShop.length; index++) {
            if(shopData.catShop[index].catName == "钻石"){
                shopBuy= shopData.catShop[index];
                break;
            }   
        }
        if (shopBuy==null) //没得人民币购买钻石数据
        {
            Manager.utils.CommonShowMsg("TS_Dou_2");
            return;
        }
        let needIShopItem :pb.IShopItem =null;

        Log.e("onClickItemBuy  shopBuy.items  :  ", shopBuy.items   );

        for (let index = 0; index < shopBuy.items.length; index++) 
        {
            let et =shopBuy.items[index];
            Log.e("onClickItemBuy  et  :  ", et   );
            if (et.amount+et.donateAmount >= needZuanCount ) 
            {
                needIShopItem= et;
                break;
            }
        }
        if (needIShopItem == null) 
        {
            needIShopItem =shopBuy.items[shopBuy.items.length-1];
        }
        // Utils.realShopId =id;
        let tempData ={shopId:id,num:num,orderId:""}
        Manager.gd.put("C2SSetBuyCb",tempData);


        Manager.pay.choosePay(needIShopItem);

    }

    getRewardDes(adItem: pb.IAdRewardItem): string 
    {
       return String.format(adItem.shuoming,this.formatCoin(adItem.value,adItem.type)+Manager.gd.getCurrencyHBTypeName(adItem.type));
    }


}