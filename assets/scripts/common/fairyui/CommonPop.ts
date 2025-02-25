
/**
 * @description 通用弹框奖励
 */
 import { BoxFuncType, GameCat, GroupId, SeasonState } from "../../def/GameEnums";
import { ProtoDef } from "../../def/ProtoDef";
import { Config, ViewZOrder } from "../config/Config";
 import GameData from "../data/GameData";
 import { GameService } from "../net/GameService";
import GradeItem_pop from "./GradeItem_pop";
 
  class GeneralCommonPop {
        private root :fgui.GComponent = null;
        private data :pb.S2CShowBox = null;
        private pop_com:fgui.GComponent=null;
        private tittle_gloder:fgui.GLoader=null;
        private icon_gloder:fgui.GLoader=null;
        private content1_list:fgui.GList=null;
        private content2_obj:fgui.GObject=null;
        private content2_list:fgui.GList=null;
        private content2_text:fgui.GTextField=null;
        private btns_list:fgui.GList=null;
        private reward_ob:fgui.GObject=null;
        private duanwei_com:fgui.GComponent=null;
        private hide_btn :fgui.GButton =null;

        private boxData: pb.IBoxData[]=[];
        private boxFuncType: BoxFuncType=BoxFuncType.BoxFuncType_RenWu;

        private popConfig={
            [BoxFuncType.BoxFuncType_Null]:{up:"",down:"",isRewardOne:true,desUp:"",desDown:""},
            [BoxFuncType.BoxFuncType_RenWu]:{up:"pop_diban_zi_3",down:"pop_diban_zi_3",isRewardOne:true,desUp:"任务奖励",desDown:""},
            [BoxFuncType.BoxFuncType_DuanWeiReward]:{up:"pop_diban_zi_1",down:"pop_diban_zi_1",isRewardOne:true,desUp:"段位提升奖励",desDown:"段位降低"},
            [BoxFuncType.BoxFuncType_QuanGuoPaiMin]:{up:"pop_diban_zi_5",down:"pop_diban_zi_11",isRewardOne:false,desUp:"全国排名提升奖励",desDown:"全国排名降低"},
            [BoxFuncType.BoxFuncType_SeasonReward]:{up:"pop_diban_zi_4",down:"pop_diban_zi_4",isRewardOne:false,desUp:"赛季奖励",desDown:"赛季奖励"},
            // [BoxFuncType.BoxFuncType_DingShiDengLu]:{up:"pop_diban_zi_5",down:"pop_diban_zi_11",isRewardOne:true,desUp:"段位提升奖励",desDown:"段位降低"},
            [BoxFuncType.BoxFuncType_DengJi]:{up:"pop_diban_zi_2",down:"pop_diban_zi_2",isRewardOne:true,desUp:"等级提升奖励",desDown:""},
            [BoxFuncType.BoxFuncType_PaiHangBangReward]:{up:"pop_diban_zi_8",down:"pop_diban_zi_8",isRewardOne:true,desUp:"每日排名奖励",desDown:"每日排名奖励"},
            [BoxFuncType.BoxFuncType_PaiHangBangUpdate]:{up:"pop_diban_zi_6",down:"pop_diban_zi_9",isRewardOne:false,desUp:"排行榜奖励",desDown:"排行榜奖励"},
            // [BoxFuncType.BoxFuncType_QianDao]:{up:"pop_diban_zi_6",down:"pop_diban_zi_9"},
        }




      get service(){
         return Manager.serviceManager.get(GameService) as GameService;
     }
 
    private addEvents(): void 
    {
        Log.d(" S2CShowBox  CommonPop  注册了  ")
        Manager.dispatcher.add(ProtoDef.pb.S2CShowBox+"ReFlash",this.OnReFlash,this);
    }

    private removeEvents(): void 
    {
        Log.d(" S2CShowBox  CommonPop  移除了  ")
        Manager.dispatcher.remove(ProtoDef.pb.S2CShowBox+"ReFlash",this.OnReFlash);
    }

    public constructor(data:pb.S2CShowBox) {
        Log.d(" GeneralCommonPop data ",data)
        this.addEvents()
        this.data = data;
        this.root = fgui.UIPackage.createObject("hall","CommonPop").asCom;
        this.root.name = "GeneralCommonPop";
        this.root.visible = true;
        Manager.uiManager.addFairyView(this.root, ViewZOrder.UI);

        this.root.makeFullScreen();
        this.pop_com = this.root.getChild("pop").asCom;
        this.pop_com.getChild("close").onClick(this.close,this);
        this.tittle_gloder = this.pop_com.getChild("tittle").asLoader;
        this.content1_list = this.pop_com.getChild("content1").asList;
        this.content2_obj = this.pop_com.getChild("content2");
        this.content2_list = this.pop_com.getChild("rewardList").asList;
        this.content2_text = this.pop_com.getChild("des").asTextField;
        this.btns_list = this.pop_com.getChild("Btns").asList;
        this.icon_gloder = this.pop_com.getChild("icon").asLoader;
        this.content1_list.setVirtual();
        this.content1_list.itemRenderer = this.renderyListItem1.bind(this);
        this.btns_list.removeChildrenToPool();
        this.reward_ob = this.pop_com.getChild("reward");
        this.duanwei_com = this.pop_com.getChild("duanwei").asCom;
        this.hide_btn =  this.pop_com.getChild("hide").asButton;
        this.OnS2CShowBoxReFlash(data);

    }
 
     
    OnS2CShowBoxReFlash(data:pb.S2CShowBox)
    {
        this.btns_list.removeChildrenToPool();

        Log.d(" S2CShowBox  CommonPop  弹窗 data  ",data)
        this.boxData=data.box;
        this.boxFuncType =data.boxType;

        let gd = Manager.dataCenter.get(GameData);
        // if (this.boxData.length==0) {
        //     Log.d(" S2CShowBox  CommonPop  服务器数据错误 ")
        //     return;
        // }

        // data.pmData.type //1.全国排名  2，今日排名
        let urlStr = fgui.UIPackage.getItemURL("hall",this.popConfig[this.boxFuncType].up )
        let isUp =true;
        if (data.pmData!=null&& data.pmData.curRank < data.pmData.orRank ) {
            isUp=false;
            urlStr = fgui.UIPackage.getItemURL("hall",this.popConfig[this.boxFuncType].down )

        }
       
        Log.d(" S2CShowBox  OnS2CShowBoxReFlash urlStr : ",urlStr )
        Log.d(" S2CShowBox  OnS2CShowBoxReFlash this.boxFuncType : ",this.boxFuncType )
        this.tittle_gloder.icon =urlStr;  
        this.pop_com.getChild("sjbg").visible =false;
        this.content2_text.visible =true;

        if (this.boxFuncType == BoxFuncType.BoxFuncType_DuanWeiReward || this.boxFuncType == BoxFuncType.BoxFuncType_SeasonReward ) //任务 和等级 放 ui_sign_dou13 段位的时候放 段位ICon
        {
            // iconurlStr = fgui.UIPackage.getItemURL("hall","ui_sign_dou13" )

            this.reward_ob.visible =false;
            this.duanwei_com.visible =true;
            let hzcom = this.duanwei_com.getChild("hz").asCom
            let stars = this.duanwei_com.getChild("stars").asCom;
            let gt = Manager.utils.gt(this.boxData[0].otherParam);

            let lv = gd.playerGV(GroupId.GI_SeasonDuanWei,gt,1);

            let dwData:pb.S2CGetSeasonDuanWeiCfg = Manager.dataCenter.get(GameData).get<pb.S2CGetSeasonDuanWeiCfg>(ProtoDef.pb.S2CGetSeasonDuanWeiCfg+"_"+gt);
            Log.d(" S2CShowBox  CommonPop  段位 lv   ",lv)
            Log.d(" S2CShowBox  CommonPop  段位 dwData   ",dwData)
            if(dwData == null){
                return;
            }
            Manager.utils.setHz(hzcom,stars,lv,dwData,true);
        }

        else if (this.boxFuncType == BoxFuncType.BoxFuncType_QuanGuoPaiMin  ) 
        {

            this.reward_ob.visible =false;
            this.duanwei_com.visible =true;
            let hzcom = this.duanwei_com.getChild("hz").asCom
            let stars = this.duanwei_com.getChild("stars").asCom;

            let gt = Manager.utils.gt(data.pmData.gameCat);

            let lv = gd.playerGV(GroupId.GI_SeasonDuanWei,gt,1);

            let dwData:pb.S2CGetSeasonDuanWeiCfg = Manager.dataCenter.get(GameData).get<pb.S2CGetSeasonDuanWeiCfg>(ProtoDef.pb.S2CGetSeasonDuanWeiCfg+"_"+gt);
            Log.d(" S2CShowBox  CommonPop  段位 lv   ",lv)
            Log.d(" S2CShowBox  CommonPop  段位 dwData   ",dwData)
            if(dwData == null){
                Log.d(" S2CShowBox  CommonPop  段位 没获取到异常情况  ")
                return;
            }
            Manager.utils.setHz(hzcom,stars,lv,dwData,true);
        }

        else
        {
            this.reward_ob.visible =true;
            let strdes = this.popConfig[this.boxFuncType].desUp
            if (data.pmData!=null&& data.pmData.curRank < data.pmData.orRank ) {
                strdes = this.popConfig[this.boxFuncType].desDown
            }
            this.pop_com.getChild("n14").text =strdes;

            this.duanwei_com.visible =false;
            let iconurlStr = fgui.UIPackage.getItemURL("hall","ui_sign_dou13" )
            this.icon_gloder.icon =iconurlStr;  
        }


        if (this.boxFuncType == BoxFuncType.BoxFuncType_RenWu || this.boxFuncType == BoxFuncType.BoxFuncType_DuanWeiReward
            || this.boxFuncType == BoxFuncType.BoxFuncType_DengJi || this.boxFuncType == BoxFuncType.BoxFuncType_PaiHangBangReward   )  
        {
            this.content1_list.visible =true;
            this.content2_obj.visible =false;
            if (this.boxData!=null) {
                if (this.popConfig[this.boxFuncType].isRewardOne) //第一种列表展示 用虚拟列表
                {
                    this.content1_list.numItems = this.boxData.length;
                    this.content1_list.refreshVirtualList();
                }
            }
            
        }
        else if(this.boxFuncType == BoxFuncType.BoxFuncType_QuanGuoPaiMin)
        {
            this.content1_list.visible =false;
            this.content2_obj.visible =true;
            this.content2_list.removeChildrenToPool();
            if (data.pmData!=null) 
            {
                let diquStr= "全国"
                let desStr= String.format("恭喜您当前段位排名从"+diquStr+"第{0}名提升至"+diquStr+"第{1}名；期待您再接再厉，赛季结束时达到"+diquStr+"排名第一名可领取大量奖励！",data.pmData.orRank,data.pmData.curRank);
                if (data.pmData.curRank < data.pmData.orRank) 
                {
                    desStr= String.format("很遗憾您当前段位排名从"+diquStr+"第{0}名下降至"+diquStr+"第{1}名；期待您再接再厉，赛季结束时达到"+diquStr+"排名第一名可领取大量奖励！",data.pmData.orRank,data.pmData.curRank);
                }
                this.content2_text.text=desStr;

                for (let i = 0; i < data.pmData.reward.length; i++) 
                {
                    let  itemData = data.pmData.reward[i];
                    let ccom = this.content2_list.addItemFromPool().asCom;
                    ccom.getChild("num").text = Manager.utils.formatCoin(itemData.value,itemData.itemType);  
                    ccom.getChild("loader").icon = Manager.gd.getPropIcon(itemData.itemType);  
                }
            }
        }
        else if(this.boxFuncType == BoxFuncType.BoxFuncType_PaiHangBangUpdate)
        {
            this.content1_list.visible =false;
            this.content2_obj.visible =true;
            this.content2_list.removeChildrenToPool();
            
            if (data.pmData!=null) 
            {
                let diquStr= "全国"
                let desStr= String.format("恭喜您在昨日"+diquStr+"排名荣获第{0}名提升至"+diquStr+"第{1}名；您将获得以下奖励,期待您再接再厉!",data.pmData.orRank,data.pmData.curRank);
                if (data.pmData.curRank < data.pmData.orRank) 
                {
                    desStr= String.format("很遗憾,您在"+diquStr+"排行中从"+diquStr+"第{0}名；下降到{1}名,在截止时间时达到今日第一名可领取以下奖励！",data.pmData.orRank,data.pmData.curRank);
                }
                this.content2_text.text=desStr;

                for (let i = 0; i < data.pmData.reward.length; i++) 
                {
                    let  itemData = data.pmData.reward[i];
                    let ccom = this.content2_list.addItemFromPool().asCom;
                    ccom.getChild("num").text = Manager.utils.formatCoin(itemData.value,itemData.itemType);  
                    ccom.getChild("loader").icon = Manager.gd.getPropIcon(itemData.itemType);  
                }
            }
        }
        else if(this.boxFuncType == BoxFuncType.BoxFuncType_SeasonReward)
        {
            this.content1_list.visible =false;
            this.content2_obj.visible =true;
            this.content2_list.removeChildrenToPool();
            this.pop_com.getChild("sjbg").visible =true;
            this.content2_text.visible =false;
            
            Log.d(" S2CShowBox  CommonPop 赛季奖励的时候  ")

            let dataSeason = Manager.gd.get<pb.S2CSeason>(ProtoDef.pb.S2CSeason);

            Log.d(" S2CShowBox  CommonPop 赛季奖励的时候 dataSeason  ",dataSeason)
            if (dataSeason!=null) {
                let t = this.pop_com.getChild("time").asTextField;
                if(dataSeason.season.state == SeasonState.SeasonState_Wait){
                    t.text = "距离赛季开启剩余"+Manager.utils.transformDjs(dataSeason.season.startTime);
                }else{
                    let start = Manager.utils.formatDate(dataSeason.season.startTime,"/");
                    let end = Manager.utils.formatDate(dataSeason.season.startTime + dataSeason.season.duration * 86400,"/");
                    t.text = start + "-" + end;;
                }
                let sjName = this.pop_com.getChild("sjname");
                this.updateSJname(sjName,dataSeason);
            }


            if (this.boxData!=null) 
            {
                for (let i = 0; i < this.boxData.length; i++) 
                {
                    let ItemData =  this.boxData[i];
                    if (i==0) 
                    {
                        for (let c = 0; c < ItemData.reward.length; c++) 
                        {
                            let  tempData =ItemData.reward[c];
                            let ccom = this.content2_list.addItemFromPool().asCom;
                            ccom.getChild("num").text = Manager.utils.formatCoin(tempData.value,tempData.itemType);  
                            ccom.getChild("loader").icon = Manager.gd.getPropIcon(tempData.itemType);  

                        }
                    }
                }
            }



        }
        

        if (this.boxFuncType == BoxFuncType.BoxFuncType_RenWu || this.boxFuncType == BoxFuncType.BoxFuncType_DuanWeiReward  ) 
        {
            Log.d(" S2CShowBox  CommonPop  关掉所有按钮 ")
            this.btns_list.visible =false;

        }
        else if (this.boxFuncType == BoxFuncType.BoxFuncType_QuanGuoPaiMin|| this.boxFuncType == BoxFuncType.BoxFuncType_PaiHangBangUpdate)
        {
            this.btns_list.visible =true;
            let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_BASE, "BtnYL1")
            let item =this.btns_list.addItemFromPool(url)
            item.asCom.getChild("title").text="立即前往";
            item.clearClick();
            item.onClick(()=>{
                this.close();
                this.service.openGameList(data.pmData.gameCat);
            },this);
        }
        else if (this.boxFuncType == BoxFuncType.BoxFuncType_SeasonReward)
        {
            this.btns_list.visible =true;
            let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_HALL, "BtnADShare")
            let item =this.btns_list.addItemFromPool(url)
            item.asCom.getChild("title").text="立即领取";
            Manager.utils.quickSetIcon(item)
    

            item.clearClick();
            item.onClick(()=>{

                let jsonData={adname:"",parms1:"",parms2:""}
                jsonData.adname="Ad_SeasonReward";
                jsonData.parms1="";
                jsonData.parms2="";
                Manager.adManeger.WatchAds(jsonData,()=>{
                    if (!Manager.platform.isAdOpen()) {
                        let gametypeData = Manager.gd.get<{gameType:number}>("GameCommonData");
                        if (gametypeData!=null) {
                            this.service.getSeasonReward(gametypeData.gameType);
                        }
                        else
                        {
                            this.service.getSeasonReward(GameCat.GameCat_Mahjong);
                        }

                    } 
                })
            },this);
        }
        else
        {
            // this.btns_list.visible =true;
            // let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_BASE, "BtnYL1")
            // let item =this.btns_list.addItemFromPool(url)
            // item.asCom.getChild("title").text="确认";
            // item.clearClick();
            // item.offClick(this.onClickClose,this);
        }





    }



    protected updateSJname(sjName:fgui.GObject,data){
        Log.d("data.season.state",data.season.state);
        if(data.season.state == SeasonState.SeasonState_Wait){
            sjName.text = "休赛期";
        }else if(data.season.state == SeasonState.SeasonState_Run){
            sjName.text = "S"+data.season.seasonNum+"赛季";
        }else{
            sjName.text = "赛季未开启";
        }
    }


    private renderyListItem1(index: number, obj: fgui.GObject): void {
        let com =obj.asCom;
        let item = new GradeItem_pop(com);
        
        item.setData(index,this.boxData[index],this.boxFuncType)



    }
    

  
      public run():GeneralCommonPop{
 
          Manager.uiqueue.addToQueue(this);

          return this;
      }


      private OnReFlash(id:number)
      {
        
            if (this.boxFuncType == BoxFuncType.BoxFuncType_RenWu || this.boxFuncType == BoxFuncType.BoxFuncType_DuanWeiReward
                || this.boxFuncType == BoxFuncType.BoxFuncType_DengJi || this.boxFuncType == BoxFuncType.BoxFuncType_PaiHangBangReward   )  
            {
                ////第一种列表领取的

                if (this.boxData!=null) {
                    if (this.popConfig[this.boxFuncType].isRewardOne) 
                    {
                        if (this.boxData.length<=1) {
                            this.close();
                        }
                        else
                        {
                            for (let index = 0; index < this.boxData.length; index++) {
                                if (this.boxData[index].intParam == id  ) {
                                    this.boxData.splice(index,1)
                                    break;
                                }
                            }
                            this.content1_list.numItems = this.boxData.length;
                            this.content1_list.refreshVirtualList();
                        }
                    }
                }
            }
            else
            {
                this.close();
            }

      }


  
      public remove(){
          this.root.dispose();
      }
  
 
      private close(){
        this.service.OnC2SCloseShowBox(this.boxFuncType,!this.hide_btn.selected);
        this.removeEvents();
        Manager.commonPop.close(this);
        Manager.uiqueue.close(this);

      }
  }
   
  export default class CommonPop {
  
      private static _instance: CommonPop = null;
      public static Instance() { return this._instance || (this._instance = new CommonPop()); }
 
      private _queue : pb.S2CShowBox [] = [];
  
      private cur:GeneralCommonPop = null;
  
      private _isPause:boolean = false;
 
 
      public set pause(v:boolean){
         this._isPause = v;
         this.update();
      }

 
      private update(){ 
         Log.d("  CommonPop.update:",this._queue.length,this.cur,this._isPause);
         if(this.cur != null){
             return;
          }
         if (this._queue.length > 0){
             let msg = this._queue.shift();
             this.cur = new GeneralCommonPop(msg).run();
         }
      }
  
      public show( msg : pb.S2CShowBox ){
          if ( msg == null || msg == undefined){
              return;
          }
          Log.d("------------:",msg);
          this._queue.push(msg);
          this.update();
      }
  
      public close(ft:GeneralCommonPop){
          this.cur = null;
          Log.e("close");
          ft.remove();
          this.update();
      }
  
      public clear(){
          this._queue = [];
      }
  
  }







    



