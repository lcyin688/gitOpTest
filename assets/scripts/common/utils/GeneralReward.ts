/**
 * @description 通用奖励
 */
import { AdRewardState, AdRewardType } from "../../def/GameEnums";
import { Config, ViewZOrder } from "../config/Config";
import GameData from "../data/GameData";
import ShopView from "../fairyui/ShopView";
import { GameService } from "../net/GameService";

 class GeneralReward {
     private root :fgui.GComponent = null;
     private data :pb.S2CShowItems = null;

     get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }

     public constructor(data:pb.S2CShowItems) {
        Log.d(" GeneralReward data ",data)

         this.data = data;
         this.root = fgui.UIPackage.createObject("hall","GeneralReward").asCom;
         this.root.name = "GeneralReward";
         this.root.visible = true;
         this.root.getChild("close").onClick(this.close,this);
         let list = this.root.getChild("list").asList;
         list.removeChildrenToPool();
         let gd = Manager.dataCenter.get(GameData);
         for (let index = 0; index < data.items.length; index++) {
             let item = list.addItemFromPool().asCom;  
             gd.getNBPropIcon(data.items[index].itemType,item.getChild("loader").asLoader);
             item.getChild("num").text = Manager.utils.formatCoin(data.items[index].value,(data.items[index].itemType));   
         }
         Manager.uiManager.addFairyView(this.root, ViewZOrder.Reward);
         let txt = data.adItem.btnText.trim();
         let lq = this.root.getChild("lq");
         let des_text = this.root.getChild("des");
         if(txt == "" || txt.length == 0){
            lq.visible = false;
            des_text.visible =false;
         }else{
            lq.visible = true;
            let txtDes = data.adItem.shuoming.trim();
            let adName ="Ad_AdReward";
            if (txtDes == "" || txtDes.length == 0) 
            {
                lq.y=637;
                des_text.visible =false;
            } else {
                lq.y=600;
                des_text.visible =true;
                des_text.text= Manager.utils.getRewardDes(data.adItem);
                adName ="Ad_OnlineReward";
            }
            lq.text = txt;
            lq.onClick(()=>{
                this.showAd(data.adItem.id,adName );
            },this);
         }
        Manager.utils.quickSetIcon(lq);
        //  * let node = new cc.Node();
		//  * let par = node.addComponent(cc.ParticleSystem);
		//  * par.loadFile({url:GAME_RES( "res/action/DDZ_win_lizi" ),view:null});
		//  * this.node.addChild(node);
        //  this.root.setPivot(0.5, 0.5);
         this.root.makeFullScreen();

         this.service.OnC2SShowItemsReply(data.uid);
     }

 
     public run():GeneralReward{

        Manager.uiManager.getView(ShopView).then((view : ShopView)=>{
            if ( view ){
                view.setRootVisible(false);
            }
        });
        
         if(this.data.adItem.id != AdRewardType.AdRewardType_AdReward){
            let trans = this.root.getTransition("default");
            if (trans){
                trans.play(()=>{
                });
            }
         }

         this.addEft();
         this.addEft();
         Manager.globalAudio.playEffect("audio/reward_xiayu",Config.BUNDLE_HALL);
         return this;
     }

     private addEft(){
        let node = new cc.Node();
        let par = node.addComponent(cc.ParticleSystem);
        par.loadFile({bundle:Config.BUNDLE_HALL,url:"particles/jby",view:null});
        node.x = this.root.node.width / 2;
        node.y = this.root.node.height / 5;
        par.autoRemoveOnFinish = true;
        par.emissionRate = 40;
        this.root.node.addChild(node);
     }

     private showAd(id:number,adname:string ){

        let jsonData={adname:"",parms1:"",parms2:""}
        jsonData.adname= adname ;
        jsonData.parms1=id.toString();
        jsonData.parms2="";
        Manager.adManeger.WatchAds(jsonData,()=>{
            if (!Manager.platform.isAdOpen()) {
                let s = Manager.serviceManager.get(GameService) as GameService;
                s.getAdReward(this.data.adItem.id,AdRewardState.AdRewardState_VideoSucc);
            } 
            Manager.reward.close(this);
        })

        // Manager.loading.show("观看广告中",function(){

        // }.bind(this),5);
    }
 
     public remove(){
         this.root.dispose();
     }
 

     private close(){

        Manager.uiManager.getView(ShopView).then((view : ShopView)=>{
            if ( view ){
                view.setRootVisible(true);
            }
        });
        
        let s = Manager.serviceManager.get(GameService) as GameService;
        s.getAdReward(this.data.adItem.id,AdRewardState.AdRewardState_Close);
        Manager.reward.close(this);
        cc.audioEngine.stopAllEffects();
        this.service.refreshUIPlayer();
     }
 }
  
 export default class Reward {
 
     private static _instance: Reward = null;
     public static Instance() { return this._instance || (this._instance = new Reward()); }

     private _queue : pb.S2CShowItems [] = [];
 
     private cur:GeneralReward = null;
 
     private _isPause:boolean = false;


     public set pause(v:boolean){
        this._isPause = v;
        this.update();
     }

     public get pause():boolean{
        return this._isPause;
     }

     private update(){ 
        Log.d("Reward.update:",this._queue.length,this.cur,this._isPause);
        if(this._isPause){
            return;
        }
        if(this.cur != null){
            return;
         }
        if (this._queue.length > 0){
            let msg = this._queue.shift();
            this.cur = new GeneralReward(msg).run();
        }
     }
 
     public show( msg : pb.S2CShowItems ){
         if ( msg == null || msg == undefined){
             return;
         }
         Log.d("------------:",msg);
         if(msg.adItem.id == AdRewardType.AdRewardType_AdReward){
            this._queue.unshift(msg);
         }else{
            this._queue.push(msg);
         }
         this.update();
     }
 
     public close(ft:GeneralReward){
         this.cur = null;
         Log.e("close");
         ft.remove();
         this.update();
     }
 
     public clear(){
         this._queue = [];
     }
 
 }