import { Config } from "../../../../scripts/common/config/Config";
import GameData from "../../../../scripts/common/data/GameData";
import Toast from "../../../../scripts/common/fairyui/Toast";
import { GameService } from "../../../../scripts/common/net/GameService";
import { CurrencyType, GameCat, GroupId, OrderState, PlayerAttr, ScoreType } from "../../../../scripts/def/GameEnums";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";
import UIView from "../../../../scripts/framework/core/ui/UIView";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Commonjifen extends UIView {

    private content_gc:fgui.GComponent = null;
    private PhoneCZ_gc:fgui.GComponent = null;
    private rule_gc:fgui.GComponent = null;
    private hfRecord_gc:fgui.GComponent = null;
    private PhoneRefund_gc:fgui.GComponent = null;
    //所有榜单按钮
    private bangBtns :Array<fgui.GButton>= [];


    private rank_List:fgui.GList=null;
    private itemSelf_com:fgui.GComponent =null;

    private curPaiHangCfg:pb.IScoreTopRewardEx=null;

    private lingqu_List:fgui.GList=null;


    private jiFenRankReward_Btn:fgui.GButton = null;
    

    private PhoneCZ_com:fgui.GComponent=null;
    private hf_com:fgui.GComponent=null;
    private hfn6_com:fgui.GComponent=null;
    private hf_list:fgui.GList=null;
    
    private hfArr:number[]=[10,20,30,50,100,200,300,500];



    private hfRecord_List:fgui.GList=null;
    

    get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }


    protected addEvents(): void 
    {
        Log.e(" Commonjifen  注册了  ")
        this.addEvent(ProtoDef.pb.S2CGetScoreTop,this.ReflashPHView);
        this.addEvent(ProtoDef.pb.S2CGetScoreRewardList,this.ReflashLQView);
        this.addEvent(ProtoDef.pb.S2CGetHfqRechargeLog,this.ReflashHFRecordView);


    }





    
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
            resName : "Commonjifen",
        }
        return path;
    }

    onLoad() {
        super.onLoad();
        this.show();
        this.ReflashPHView()
    }

    onDispose(): void {

        super.onDispose();
    }

    onClickClose(){
        Manager.uiManager.close(Commonjifen);
    }

    onFairyLoad(): void {

        Log.w(" pochanchongzhi  onFairyLoad ")
        // this.root.makeFullScreen();

        this.content_gc = this.root.getChild("content").asCom;
        this.content_gc.makeFullScreen();

        this.PhoneCZ_gc = this.root.getChild("PhoneCZ").asCom;
        this.rule_gc = this.root.getChild("rule").asCom;
        this.hfRecord_gc = this.root.getChild("hfRecord").asCom;
        this.PhoneRefund_gc = this.root.getChild("PhoneRefund").asCom;
        this.content_gc.visible =true;
        this.PhoneCZ_gc.visible =false;
        this.rule_gc.visible =false;
        this.hfRecord_gc.visible =false;
        this.PhoneRefund_gc.visible =false;

        this.content_gc.getChild("closeBtn").onClick(this.onClickClose,this);
       
        let riBangBtn = this.content_gc.getChild("riBangBtn").asButton;
        this.SetBangBtn(riBangBtn,"日榜",ScoreType.ST_Day,true);
        this.bangBtns.push(riBangBtn)
        let zhouBangBtn = this.content_gc.getChild("zhouBangBtn").asButton;
        this.SetBangBtn(zhouBangBtn,"周榜",ScoreType.ST_Week,false);
        this.bangBtns.push(zhouBangBtn)
        let yueBangBtn = this.content_gc.getChild("yueBangBtn").asButton;
        this.SetBangBtn(yueBangBtn,"月榜",ScoreType.ST_Month,false);
        this.bangBtns.push(yueBangBtn)
        let nianBangBtn = this.content_gc.getChild("nianBangBtn").asButton;
        this.SetBangBtn(nianBangBtn,"年榜",ScoreType.ST_Year,false);
        this.bangBtns.push(nianBangBtn);

        this.rank_List=this.content_gc.getChild("rankList").asList;
        this.rank_List.setVirtual();
        this.rank_List.itemRenderer = this.renderyListItem.bind(this);

        this.itemSelf_com=this.content_gc.getChild("itemSelf").asCom;



        this.lingqu_List=this.content_gc.getChild("lingquList").asList;
        this.lingqu_List.setVirtual();
        this.lingqu_List.itemRenderer = this.renderyListItemLQ.bind(this);
        

        this.jiFenRankReward_Btn=this.content_gc.getChild("jiFenRankRewardBtn").asButton;
        
        this.jiFenRankReward_Btn.onClick(this.OnClickJiFenRankReward,this);

        this.initPhoneCZ_com();

        
        this.content_gc.getChild("jiFenHFCZBtn").onClick(()=>{this.PhoneCZ_com.visible =true; },this);
        this.content_gc.getChild("top").asCom.getChild("wenBtn").onClick(()=>{this.rule_gc.visible =true; },this);
        this.rule_gc.getChild("mask").onClick(()=>{this.rule_gc.visible =false; },this);
        this.rule_gc.getChild("close").onClick(()=>{this.rule_gc.visible =false; },this);


        this.content_gc.getChild("jiFenRefundBtn").onClick(()=>{
            this.PhoneRefund_gc.visible =true;
            this.ReflashPhoneRefund_com(ScoreType.ST_Day);
        },this);

        this.initPhoneRefund_com();
        this.initHfRecord_com();


        
        this.SetTopData();

    }

    initHfRecord_com()
    {
        this.content_gc.getChild("jiFenRecordBtn").onClick(()=>{
            this.hfRecord_gc.visible =true;
            this.service.getC2SGetHfqRechargeLog();
        },this);

        this.hfRecord_gc.getChild("mask").onClick(()=>{this.hfRecord_gc.visible =false; },this);
        this.hfRecord_gc.getChild("close").onClick(()=>{this.hfRecord_gc.visible =false; },this);



        this.hfRecord_List=this.hfRecord_gc.getChild("list").asList;
        this.hfRecord_List.setVirtual();
        this.hfRecord_List.itemRenderer = this.renderyListItemHFRecord.bind(this);

    }


    initPhoneRefund_com()
    {
        this.PhoneRefund_gc.getChild("mask").onClick(()=>{this.PhoneRefund_gc.visible =false; },this);
        this.PhoneRefund_gc.getChild("close").onClick(()=>{this.PhoneRefund_gc.visible =false; },this);

        this.PhoneRefund_gc.getChild("sureCzBtn").onClick(this.onClickhfCZReturn,this);

        this.PhoneRefund_gc.getChild("btn1").onClick(()=>{ this.ReflashPhoneRefund_com(ScoreType.ST_Day);},this);
        this.PhoneRefund_gc.getChild("btn2").onClick(()=>{ this.ReflashPhoneRefund_com(ScoreType.ST_Week);},this);
        this.PhoneRefund_gc.getChild("btn3").onClick(()=>{ this.ReflashPhoneRefund_com(ScoreType.ST_Month);},this);
        this.PhoneRefund_gc.getChild("btn4").onClick(()=>{ this.ReflashPhoneRefund_com(ScoreType.ST_Year);},this);

    }

    ReflashPhoneRefund_com(scoreType:ScoreType)
    {
        this.PhoneRefund_gc.data=scoreType;

        let gd = Manager.dataCenter.get(GameData);
        let edu = 0.00;
        this.PhoneRefund_gc.getChild("btn1").asButton.getController("button").selectedIndex = 0;
        this.PhoneRefund_gc.getChild("btn2").asButton.getController("button").selectedIndex = 0;
        this.PhoneRefund_gc.getChild("btn3").asButton.getController("button").selectedIndex = 0;
        this.PhoneRefund_gc.getChild("btn4").asButton.getController("button").selectedIndex = 0;
        if (scoreType==ScoreType.ST_Day ) {
            // edu =  gd.playerGV(GroupId.GI_RankNum,PlayerAttr.PA_DayAmount,0).toFixed(2);
            edu =   Manager.gd.playerAttr(PlayerAttr.PA_DayAmount).toFixed(2);
            this.PhoneRefund_gc.getChild("btn1").asButton.getController("button").selectedIndex = 1;
        }
        else if (scoreType==ScoreType.ST_Week ) {
            // edu =  gd.playerGV(GroupId.GI_RankNum,PlayerAttr.PA_WeekAmount,0).toFixed(2);
            edu =   Manager.gd.playerAttr(PlayerAttr.PA_WeekAmount).toFixed(2);
            this.PhoneRefund_gc.getChild("btn2").asButton.getController("button").selectedIndex = 1;
        }
        else if (scoreType==ScoreType.ST_Month ) {
            // edu =  gd.playerGV(GroupId.GI_RankNum,PlayerAttr.PA_MonthAmount,0).toFixed(2);
            edu =   Manager.gd.playerAttr(PlayerAttr.PA_MonthAmount).toFixed(2);
            this.PhoneRefund_gc.getChild("btn3").asButton.getController("button").selectedIndex = 1;
        }
        else if (scoreType==ScoreType.ST_Year ) {
            // edu =  gd.playerGV(GroupId.GI_RankNum,PlayerAttr.PA_YearAmount,0).toFixed(2);
            edu =   Manager.gd.playerAttr(PlayerAttr.PA_YearAmount).toFixed(2);
            this.PhoneRefund_gc.getChild("btn4").asButton.getController("button").selectedIndex = 1;
        }
        this.PhoneRefund_gc.getChild("tip").text = String.format("剩余可使用额度：{0}元",edu);
        // this.PhoneRefund_gc.getChild("input").asTextInput.text="请输入需返还金额"
        



    }

    //点击确认充值 返还领取
    onClickhfCZReturn(obj: fgui.GObject)
    {
        let str1 = this.PhoneRefund_gc.getChild("input").asTextInput.text;
        if (str1==""||str1=="请输入需返还金额") 
        {
            Manager.tips.show("请输入需返还金额");
            return;
        }

        let gd = Manager.dataCenter.get(GameData);

        let scoreType = this.PhoneRefund_gc.data;
        Log.e(" onClickhfCZReturn  scoreType ",scoreType)
        let edu = 0;
        if (scoreType==ScoreType.ST_Day ) {
            // edu =  gd.playerGV(GroupId.GI_RankNum,PlayerAttr.PA_DayAmount,0);
            edu = Manager.gd.playerAttr(PlayerAttr.PA_DayAmount).toFixed(2);
            
        }
        else if (scoreType==ScoreType.ST_Week ) {
            // edu =  gd.playerGV(GroupId.GI_RankNum,PlayerAttr.PA_WeekAmount,0);
            edu = Manager.gd.playerAttr(PlayerAttr.PA_WeekAmount).toFixed(2);
        }
        else if (scoreType==ScoreType.ST_Month ) {
            // edu =  gd.playerGV(GroupId.GI_RankNum,PlayerAttr.PA_MonthAmount,0);
            edu = Manager.gd.playerAttr(PlayerAttr.PA_MonthAmount).toFixed(2);
        }
        else if (scoreType==ScoreType.ST_Year ) {
            // edu =  gd.playerGV(GroupId.GI_RankNum,PlayerAttr.PA_YearAmount,0);
            edu = Manager.gd.playerAttr(PlayerAttr.PA_YearAmount).toFixed(2);
        }

        let ye = Number(str1);
        if (ye>edu) 
        {
            Manager.tips.show("当前余额不足,请重新选择");
            return;
        }
        //实名认证


        this.PhoneCZ_com.visible =false;


        Log.d("sdk wxhb");
        Manager.gd.put("__jfye",ye);
        Manager.gd.put("__jfscoreType",scoreType);
        Manager.platform.loginWx("wxjifen");
    }

    


    initPhoneCZ_com()
    {
        this.PhoneCZ_com=this.root.getChild("PhoneCZ").asCom;
        this.PhoneCZ_com.getChild("close").onClick(()=>{this.PhoneCZ_com.visible =false; },this);
        this.hf_com= this.PhoneCZ_com.getChild("hf").asCom;
        this.hfn6_com= this.hf_com.getChild("n6").asCom;
        this.hf_list= this.hfn6_com.getChild("list").asList;

        this.hfn6_com.visible=false;
        this.hf_list.on(fgui.Event.CLICK_ITEM, this.onClickhfItem, this);

        this.hf_com.onClick(()=>{
            this.hfn6_com.visible=!this.hfn6_com.visible;
        },this);

        this.hfn6_com.visible=false;
        this.Sethf_comData(0);
        this.ReflashPhoneCZ_com();

        this.PhoneCZ_com.getChild("sureCzBtn").onClick(this.onClickhfCZ,this);
        

    }

    onClickhfItem(obj: fgui.GObject){

        let index = this.hf_list.getChildIndex(obj);
        // Log.e("当前点击的是 第几个  index : ",index ,this.hfArr[index]);
        this.Sethf_comData(index);

    }

    Sethf_comData(index:number)
    {
        this.hf_com.data =this.hfArr[index];
        this.hf_com.getChild("title").text=this.hfArr[index]+"元"
    }


    ReflashPhoneCZ_com()
    {
        let gd = Manager.dataCenter.get(GameData);
        let edu =  (gd.playerCurrencies(CurrencyType.CT_HfqCash)/100).toFixed(2);
        this.PhoneCZ_com.getChild("tip").text = String.format("剩余可使用额度：{0}元",edu);

    }


    //点击确认充值
    onClickhfCZ(obj: fgui.GObject)
    {
        let str1 = this.PhoneCZ_com.getChild("phoneNum").asTextInput.text;
        let str2 = this.PhoneCZ_com.getChild("phoneNum1").asTextInput.text;

        if (str1==""||str2=="") 
        {
            Manager.tips.show("请输入电话号码");
            return;
        }
        if (str1!=str2) 
        {
            Manager.tips.show("号码输入不一致,请重新输入.");
            return;
        }
        let cznum = this.hf_com.data;
        let gd = Manager.dataCenter.get(GameData);
        let edu = gd.playerCurrencies(CurrencyType.CT_HfqCash)/100
        if (cznum>edu) 
        {
            Manager.tips.show("当前余额不足,请重新选择");
            return;
        }

        this.PhoneCZ_com.visible =false;
        this.service.getC2SHfqRecharge(str1,cznum)

    }



    OnClickJiFenRankReward(evt: fgui.Event) 
    {
        let data = fgui.GObject.cast(evt.currentTarget);
        Log.e("OnClickJiFenRankReward   data.data ",data.data);
        if (data.data==null) {
            Log.e("OnClickJiFenRankReward   数据为空 ");
            return;
        }
        // this.jiFenRankReward_Btn.data.index=state;
        // this.jiFenRankReward_Btn.data.scoreType=scoreType;
        if (data.data.index==0) //奖励领取
        {
            this.service.getSGetScoreRewardList(data.data.scoreType);
        }
        else
        {
            this.service.getBWHLInfo(data.data.scoreType);
        }

    }


    private SetBangBtn(item:fgui.GButton,name:string,scoreType:ScoreType,isSelect:boolean)
    {
        item.getChild("tittle").text =name;
        item.getChild("tittle1").text =name;
        item.data=scoreType;
        item.onClick(this.ClickBangBtn,this)
        this.SetBangBtnSelect(item,isSelect);
    }

    private SetBangBtnSelect(item:fgui.GButton,isSelect:boolean)
    {
        if (isSelect) {
            item.getController("c1").selectedIndex=0
        }
        else
        {
            item.getController("c1").selectedIndex=1
        }

    }


    ClickBangBtn(evt: fgui.Event) 
    {
        let obj = fgui.GObject.cast(evt.currentTarget);
        let scoreType = obj.data as ScoreType
        Log.d("Commonjifen.   scoreType ",scoreType );
        this.service.getBWHLInfo(scoreType);
    }
    public show(): void {
        Log.d("Commonjifen.   show");
        super.show();
    }

       
    ReflashPHView()
    {
        this.SetTopData();

        let data = Manager.gd.get<pb.S2CGetScoreTop>(ProtoDef.pb.S2CGetScoreTop);
        Log.d("Commonjifen. 排行榜  ReflashView  data " ,data);
        if (data==null|| data.scoreType==null) {
            Log.e("Commonjifen. 排行榜   没有数据 ");
            return;
        }
        this.GetCurPaiHangCfg(data.scoreType);

        

        this.SetBangBtnSState(data.scoreType);
        //虚拟列表 处理
        this.rank_List.numItems = data.items.length;
        this.rank_List.refreshVirtualList();

        this.rank_List.visible=true;
        this.itemSelf_com.visible=true;
        this.lingqu_List.visible=false;


        this.ReflashSelfItem();
        this.SetjiFenRankRewardBtn(0,data.scoreType);

        
    }
    //领取按钮
    private SetjiFenRankRewardBtn(state:number,scoreType:ScoreType)
    {
        this.jiFenRankReward_Btn.data={index:0,scoreType:0}
        this.jiFenRankReward_Btn.data.index=state;
        this.jiFenRankReward_Btn.data.scoreType=scoreType;
        this.jiFenRankReward_Btn.getController("c1").selectedIndex=state;
    }


    private ReflashSelfItem(): void {
        let com =this.itemSelf_com;
        let data = Manager.gd.get<pb.S2CGetScoreTop>(ProtoDef.pb.S2CGetScoreTop);
        Log.d("Commonjifen. 排行榜  ReflashView  data " ,data);
        let itemData : pb.IScoreTopData=null;
        if (data!=null && data.scoreType!=null) {
            let selfguid=Manager.dataCenter.get(GameData).player().guid;
            for (let i = 0; i < data.items.length; i++) 
            {
                if (data.items[i].player.guid == selfguid) 
                {
                    itemData=data.items[i];
                }
            }
        }
        if (itemData!=null) {
            this.SetSelfDateHave(itemData);
        }
        else
        {
            this.SetSelfDateNone(data.scoreType);
        }


    }

    private SetSelfDateHave(itemData : pb.IScoreTopData)
    {
        let com =this.itemSelf_com;
        let rank = itemData.rank;
        let player = itemData.player;
        if (rank<=3) 
        {
            com.getChild("rankIcon").visible=true;
            com.getChild("rankItem").visible=false;
            com.getChild("rankIcon").icon= fgui.UIPackage.getItemURL(Config.BUNDLE_HALL,"jifen_icon_"+rank);
        }
        else
        {
            com.getChild("rankIcon").visible=false;
            com.getChild("rankItem").visible=true;
            com.getChild("rankItem").asCom.getChild("tittle").text=rank.toString();

        }

        let gd = Manager.dataCenter.get(GameData);
        com.getChild("headIcon").icon= gd.playerheadUrl(player.portraits);
        com.getChild("jiantouIcon").visible=(itemData.changeVal!=0);
        if (itemData.changeVal<0) 
        {
            com.getChild("jiantouIcon").icon= fgui.UIPackage.getItemURL(Config.BUNDLE_HALL,"jifen_icon_9"); 
        }
        else
        {
            com.getChild("jiantouIcon").icon= fgui.UIPackage.getItemURL(Config.BUNDLE_HALL,"jifen_icon_8"); 
        }
        let strCfg=this.getPHCfgStr(rank);
        let cfgItem= this.GetCurPaiHangCfgItem(rank);
    
        com.getChild("nametext").text= String.format("[color=#2A52A9]{0}[/color]",player.name);
        // com.getChild("jifenTittletext").text= String.format("[color=#2A52A9]{0}[/color]","玩家积分");
        com.getChild("jifentext").text= String.format("[color=#4C84FF]{0}[/color]",itemData.score);
        com.getChild("n22").text= String.format("[color=#2A52A9]{0}[/color]","充值全额返还");
        com.getChild("n23").text= String.format("[color=#2A52A9]{0}[/color]",strCfg);
        com.getChild("n25").text= String.format("[color=#2A52A9]{0}[/color]","赠送话费");
        com.getChild("n26").text= String.format("[color=#2A52A9]{0}元[/color]",cfgItem.hfqReturn);
        com.getChild("n43").visible=true;
    }

    private SetSelfDateNone(scoreType:pb.ScoreType)
    {
        let com =this.itemSelf_com;
        com.getChild("rankIcon").visible=false;
        com.getChild("rankItem").visible=false;

        let gd = Manager.dataCenter.get(GameData);
        com.getChild("headIcon").icon= gd.headUrl();
        com.getChild("jiantouIcon").visible=false;

        let selfplayer =Manager.dataCenter.get(GameData).player();
        com.getChild("nametext").text= String.format("[color=#2A52A9]{0}[/color]",selfplayer.name);
        //获取玩家当前榜的 积分
        let score=0;
        if (scoreType==ScoreType.ST_Day ) 
        {
            // score = gd.playerGV(GroupId.GI_RankNum,PlayerAttr.PA_DayScore,0).toFixed(2);
            score = Manager.gd.playerAttr(PlayerAttr.PA_DayScore).toFixed(2);
        } else if (scoreType==ScoreType.ST_Week ) {
            // score = gd.playerGV(GroupId.GI_RankNum,PlayerAttr.PA_WeekScore,0).toFixed(2);
            score = Manager.gd.playerAttr(PlayerAttr.PA_WeekScore).toFixed(2);
        } else if (scoreType==ScoreType.ST_Month ) {
            // score = gd.playerGV(GroupId.GI_RankNum,PlayerAttr.PA_MonthScore,0).toFixed(2);
            score = Manager.gd.playerAttr(PlayerAttr.PA_MonthScore).toFixed(2);
        } else if (scoreType==ScoreType.ST_Year ) {
            // score = gd.playerGV(GroupId.GI_RankNum,PlayerAttr.PA_YearScore,0).toFixed(2);
            score = Manager.gd.playerAttr(PlayerAttr.PA_YearScore).toFixed(2);
        }

        com.getChild("jifentext").text= String.format("[color=#4C84FF]{0}[/color]",score);

        com.getChild("n43").visible=false;
    }


    //排行榜返还配置
    private GetCurPaiHangCfg(scoreType:pb.ScoreType)
    {
        let paiHangCfg = Manager.gd.get<pb.S2CGetScoreRewardCfgs>(ProtoDef.pb.S2CGetScoreRewardCfgs);
        for (let i = 0; i < paiHangCfg.items.length; i++) 
        {
            if (paiHangCfg.items[i].topType==scoreType) 
            {
                this.curPaiHangCfg=paiHangCfg.items[i];
            }    
        }
    }
    //获取当前 日榜/月榜/年榜/周榜 某一个
    private GetCurPaiHangCfgItem(rank:number):pb.IScoreTopReward
    {
        for (let i = 0; i < this.curPaiHangCfg.items.length; i++) 
        {
            if (this.curPaiHangCfg.items[i].rank==rank) 
            {
                return this.curPaiHangCfg.items[i];
            }    
        }
        return null;
    }

    private renderyListItem(index: number, obj: fgui.GObject): void {
        let com =obj.asCom;
        let data = Manager.gd.get<pb.S2CGetScoreTop>(ProtoDef.pb.S2CGetScoreTop);
        let itemData = data.items[index];    
        
        let selfguid=Manager.dataCenter.get(GameData).player().guid;
        let rank = itemData.rank;
        let player = itemData.player;
        
        if (rank<=3) 
        {
            com.getChild("rankIcon").visible=true;
            com.getChild("rankItem").visible=false;
            com.getChild("rankIcon").icon= fgui.UIPackage.getItemURL(Config.BUNDLE_HALL,"jifen_icon_"+rank);
            if (rank==1) 
            {
                com.getChild("bgicon").icon= fgui.UIPackage.getItemURL(Config.BUNDLE_HALL,"jifen_diban_5");
            }
            else
            {
                com.getChild("bgicon").icon= fgui.UIPackage.getItemURL(Config.BUNDLE_HALL,"jifen_diban_6");
            }

        }
        else
        {
            com.getChild("rankIcon").visible=false;
            com.getChild("rankItem").visible=true;
            com.getChild("bgicon").icon= fgui.UIPackage.getItemURL(Config.BUNDLE_HALL,"jifen_diban_6");
            com.getChild("rankItem").asCom.getChild("tittle").text=rank.toString();

        }

        let gd = Manager.dataCenter.get(GameData);
        com.getChild("headIcon").icon= gd.playerheadUrl(player.portraits);
        com.getChild("jiantouIcon").visible=(itemData.changeVal!=0);
        if (itemData.changeVal<0) 
        {
            com.getChild("jiantouIcon").icon= fgui.UIPackage.getItemURL(Config.BUNDLE_HALL,"jifen_icon_9"); 
        }
        else
        {
            com.getChild("jiantouIcon").icon= fgui.UIPackage.getItemURL(Config.BUNDLE_HALL,"jifen_icon_8"); 
        }
        let strCfg=this.getPHCfgStr(rank);
        let cfgItem= this.GetCurPaiHangCfgItem(rank);
    

        if (rank==1) 
        {

            com.getChild("nametext").text= String.format("[color=#9a5000]{0}[/color]",player.name);
            com.getChild("jifenTittletext").text= String.format("[color=#9a5000]{0}[/color]","玩家积分");
            com.getChild("jifentext").text= String.format("[color=#DF7A00]{0}[/color]",itemData.score);
            com.getChild("n22").text= String.format("[color=#DF7A00]{0}[/color]","充值全额返还");
            com.getChild("n23").text= String.format("[color=#DF7A00]{0}[/color]",strCfg);
            com.getChild("n25").text= String.format("[color=#9a5000]{0}[/color]","赠送话费");
            com.getChild("n26").text= String.format("[color=#9a5000]{0}元[/color]",cfgItem.hfqReturn);
            com.getChild("n39").visible=true;
            com.getChild("n42").visible=false;
        }
        else
        {
            com.getChild("nametext").text= String.format("[color=#2A52A9]{0}[/color]",player.name);
            com.getChild("jifenTittletext").text= String.format("[color=#2A52A9]{0}[/color]","玩家积分");
            com.getChild("jifentext").text= String.format("[color=#4C84FF]{0}[/color]",itemData.score);
            com.getChild("n22").text= String.format("[color=#2A52A9]{0}[/color]","充值全额返还");
            com.getChild("n23").text= String.format("[color=#2A52A9]{0}[/color]",strCfg);
            com.getChild("n25").text= String.format("[color=#2A52A9]{0}[/color]","赠送话费");
            com.getChild("n26").text= String.format("[color=#2A52A9]{0}元[/color]",cfgItem.hfqReturn);
            com.getChild("n39").visible=false;
            com.getChild("n42").visible=true;
        }

    }


    //获取当前配置的返还数据
    private getPHCfgStr(rank):string
    {
        let strCfg ="";
        let cfgItem= this.GetCurPaiHangCfgItem(rank);

        let fhstr="";
        for (let i = 0;  i < cfgItem.ctReturn.length; i++) 
        {
            fhstr=String.format("{0}+{1}%{2}",fhstr,cfgItem.ctReturn[i].value ,Manager.gd.getCurrencyHBTypeName(cfgItem.ctReturn[i].key)  );
        }
        strCfg=String.format("{0}%红包{1}",cfgItem.payReturn,fhstr);

        return strCfg;
    }



    private SetTopData()
    {
        Log.e("jifen SetTopData  SetTopData  ")

        let top_com= this.content_gc.getChild("top").asCom;

        let gd = Manager.dataCenter.get(GameData);
        // let score =  gd.playerGV(GroupId.GI_RankNum,PlayerAttr.PA_DayAmount,0);
        let score = Manager.gd.playerAttr(PlayerAttr.PA_DayAmount);

        
        top_com.getChild("n5").text=String.format("{0}元",score.toFixed(2));

        Log.e("jifen SetTopData  score  ",score)

        // score = gd.playerGV(GroupId.GI_RankNum,PlayerAttr.PA_WeekAmount,0);
        score = Manager.gd.playerAttr(PlayerAttr.PA_WeekAmount);
        top_com.getChild("n11").text=String.format("{0}元",score.toFixed(2));

        // score = gd.playerGV(GroupId.GI_RankNum,PlayerAttr.PA_MonthAmount,0);
        score = Manager.gd.playerAttr(PlayerAttr.PA_MonthAmount);
        top_com.getChild("n14").text=String.format("{0}元",score.toFixed(2));

        // score = gd.playerGV(GroupId.GI_RankNum,PlayerAttr.PA_YearAmount,0);
        score = Manager.gd.playerAttr(PlayerAttr.PA_YearAmount);
        top_com.getChild("n17").text=String.format("{0}元",score.toFixed(2));
        
        score = gd.playerCurrencies(CurrencyType.CT_HfqCash)/100;
        top_com.getChild("n20").text=String.format("{0}元",score.toFixed(2));


    }
    


    SetBangBtnSState(scoreType:ScoreType)
    {
        for (let i = 0;  i< this.bangBtns.length; i++) 
        {
            this.SetBangBtnSelect(this.bangBtns[i],this.bangBtns[i].data ==scoreType)
        }
    }




    ReflashLQView()
    {
        this.SetTopData();

        let data = Manager.gd.get<pb.S2CGetScoreRewardList>(ProtoDef.pb.S2CGetScoreRewardList);
        Log.d("Commonjifen.   ReflashLQView  data " ,data);
        if (data==null|| data.scoreType==null) {
            Log.e("Commonjifen. 领取  没有数据 ");
            return;
        }
        this.GetCurPaiHangCfg(data.scoreType);

        this.SetBangBtnSState(data.scoreType);


        this.rank_List.visible=false;
        this.itemSelf_com.visible=false;
        this.lingqu_List.visible=true;
        Log.d("Commonjifen.   ReflashLQView  data.items.length " ,data.items.length);
        //虚拟列表 处理
        this.lingqu_List.numItems = data.items.length;
        this.lingqu_List.refreshVirtualList();
        this.SetjiFenRankRewardBtn(1,data.scoreType);

    }

    
    //奖励领取刷新
    private renderyListItemLQ(index: number, obj: fgui.GObject): void {
        Log.e ("renderyListItemLQ   !  "  ,index  );
        let com =obj.asCom;
        let data = Manager.gd.get<pb.S2CGetScoreRewardList>(ProtoDef.pb.S2CGetScoreRewardList);
        let itemData = data.items[index];    
        
        // let selfguid=Manager.dataCenter.get(GameData).player().guid;
        let rank = itemData.rank;
        let player = itemData.player;
        let gd = Manager.dataCenter.get(GameData);
        com.getChild("n45").text =this.getTimeStr(itemData.date,data.scoreType);
        com.getChild("headIcon").icon= gd.playerheadUrl(player.portraits);
        let strCfg=this.getPHCfgStr(rank);
        // let cfgItem= this.GetCurPaiHangCfgItem(rank);
    
        com.getChild("nametext").text= String.format("[color=#2A52A9]{0}[/color]",player.name);
        com.getChild("rank").text= String.format("[color=#2A52A9]全国第{0}名[/color]",rank);
        com.getChild("n22").text= String.format("[color=#2A52A9]{0}[/color]","充值全额返还");
        com.getChild("n23").text= String.format("[color=#2A52A9]{0}[/color]",strCfg);

        if (itemData.state==1) 
        {
            com.getChild("n48").visible =true;
            com.getChild("n49").visible =false;
            com.getChild("n48").clearClick();
            com.getChild("n48").onClick(()=>{
                this.service.getC2SGetScoreReward(data.scoreType,itemData.date);
            },this);

        }
        else
        {
            com.getChild("n48").visible =false;
            com.getChild("n49").visible =true;
        }



    }
    getTimeStr(date: number, scoreType: pb.ScoreType): string 
    {
        let str ="";
        if (scoreType==ScoreType.ST_Day) 
        {
            str= String.format("{0}/{1}/{2}", date.toString().slice(0,4), date.toString().slice(4,6), date.toString().slice(6,8));
        } 
        else if (scoreType==ScoreType.ST_Week || scoreType==ScoreType.ST_Month) 
        {
            str= String.format("{0}/{1}", date.toString().slice(0,4), date.toString().slice(4,6) );
        } 
        else if (scoreType==ScoreType.ST_Year) 
        {
            str= String.format("{0}", date);
        } 
        Log.e("getTimeStr   str :   ",str);
        return str;
    }





    ReflashHFRecordView()
    {
        let data = Manager.gd.get<pb.S2CGetHfqRechargeLog>(ProtoDef.pb.S2CGetHfqRechargeLog);
        Log.d("Commonjifen.   ReflashHFRecordView  data " ,data);
        if (data==null) {
            Log.e("ReflashHFRecordView ");
            this.lingqu_List.numItems = 0;
            this.lingqu_List.refreshVirtualList();
            return;
        }
        //虚拟列表 处理
        this.lingqu_List.numItems = data.items.length;
        this.lingqu_List.refreshVirtualList();
    }
    


    private renderyListItemHFRecord(index: number, obj: fgui.GObject): void {
        let com =obj.asCom;
        let data = Manager.gd.get<pb.S2CGetHfqRechargeLog>(ProtoDef.pb.S2CGetHfqRechargeLog);
        let itemData = data.items[index];    

        com.getChild("n1").text =Manager.utils.formatTime(itemData.time);
        com.getChild("n2").text =String.format("{0}",itemData.id);
        com.getChild("n3").text =String.format("{0}",itemData.phone);
        com.getChild("n4").text =String.format("{0}",itemData.amount);
        let stateStr="";
        if (itemData.state== OrderState.OS_Succ) {
            stateStr ="充值成功"
        } else if (itemData.state== OrderState.OS_Fail) {
            stateStr ="充值失败"
        } else if (itemData.state== OrderState.OS_Process) {
            stateStr ="处理中"
        } else if (itemData.state== OrderState.OS_Audit) {
            stateStr ="审核中"
        } else if (itemData.state== OrderState.OS_Audit) {
            stateStr ="审核失败"
        } 
        com.getChild("n5").text =stateStr;
    }





}


