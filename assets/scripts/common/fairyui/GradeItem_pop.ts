import { BoxFuncType, GroupId, PlayerAttr, RewardState } from "../../def/GameEnums";
import { ProtoDef } from "../../def/ProtoDef";
import { Config } from "../config/Config";
import GameData from "../data/GameData";
import { GameService } from "../net/GameService";
import CommonPop from "./CommonPop";



export default class GradeItem_pop  {

    private root : fgui.GComponent = null;
    public constructor(root : fgui.GComponent) 
    {
        this.root =root;
    }

    get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }
    

    setData(index:number , data: pb.IBoxData,boxFuncType:BoxFuncType) 
    {
        Log.d("GradeItem_pop  index  ",index,data)
        if(this.root == null){
            return;
        }
        if(data == null){
            return;
        }

        if (boxFuncType==BoxFuncType.BoxFuncType_RenWu ) {
            this.setDateRenWu(index,data,boxFuncType);
        }
        else if (boxFuncType==BoxFuncType.BoxFuncType_DuanWeiReward)
        {
            this.setDateDuanWeiReward(index,data,boxFuncType);
        }
        else if (boxFuncType==BoxFuncType.BoxFuncType_DengJi)
        {
            this.setDateDengJiReward(index,data,boxFuncType);
        }
        else if (boxFuncType==BoxFuncType.BoxFuncType_PaiHangBangReward)
        {
            this.setDatePaiHangBangReward(index,data,boxFuncType);
        }



        let list = this.root.getChild("rlist").asList;
        list.removeChildrenToPool();
        for (let index = 0; index < data.reward.length; index++) {
            let cdi = data.reward[index];
            let ccom = list.addItemFromPool().asCom;
            ccom.getChild("num").text = Manager.utils.formatCoin(cdi.value,cdi.itemType);  
            ccom.getChild("loader").icon = Manager.gd.getPropIcon(cdi.itemType);       
        }

        this.root.getChild("recvd").visible = false;
        let recvBtn = this.root.getChild("recv");
        recvBtn.visible = false;
        recvBtn.clearClick();
        recvBtn.offClick(this.onClickItem,this);
        recvBtn.onClick(this.onClickItem,this);
        recvBtn.data = {};
        recvBtn.data.id = data.intParam;
        recvBtn.data.boxFuncType = boxFuncType;
        Manager.utils.quickSetIcon(recvBtn);
    
        if (data.state == RewardState.RewardState_Null){
            Log.d("GradeItem_pop   不可能出现 没有奖励的时候 ")
        }else if (data.state == RewardState.RewardState_Reach){
            recvBtn.visible = true;
            recvBtn.text = "领取";
            Manager.utils.quickSetIcon(recvBtn);
        }else if (data.state == RewardState.RewardState_Geted){
            this.root.getChild("recvd").visible = true;
        }



    
    }

    setDateRenWu(index:number , data: pb.IBoxData,boxFuncType:BoxFuncType )
    {
        this.root.getChild("dw").visible = false;
        this.root.getChild("des").visible = true;
        let taskCfg = Manager.dataCenter.get(GameData).get<pb.S2CAchievCfg>(ProtoDef.pb.S2CAchievCfg);
        Log.d("GradeItem_pop  taskCfg  ",taskCfg)
        let conf = taskCfg.cfg[data.intParam];
        if(conf == null){
            Manager.tips.debug("任务id在配置中木有找到："+data.intParam);
            return;
        }
        Log.d("GradeItem_pop  conf  ",conf)
        this.root.getChild("des").text = conf.title;




    }


    onClickItem(evt: fgui.Event){
        let obj = fgui.GObject.cast(evt.currentTarget);
        if(obj.data != null){
                let id =obj.data.id;
                let boxFuncType =obj.data.boxFuncType;
                let jsonData={adname:"",parms1:"",parms2:""}
                jsonData.parms1=id.toString();

                if (boxFuncType == BoxFuncType.BoxFuncType_RenWu) {
                    jsonData.adname="Ad_TaskReward";
                    jsonData.parms2="";
                    Manager.adManeger.WatchAds(jsonData,()=>{
                        if (!Manager.platform.isAdOpen()) {
                            Log.d("onClickTaskItem  假装看了广告  ",id)
                            this.service.getAchievReward(id);
                        } 
                    })
                }
                else if (boxFuncType == BoxFuncType.BoxFuncType_DuanWeiReward) {
                    jsonData.adname="Ad_DuanweiReward";
                    jsonData.parms2="";
                    Manager.adManeger.WatchAds(jsonData,()=>{
                        if (!Manager.platform.isAdOpen()) {
                            this.service.getDuanWeiReward(id);
                        } 
                    })
                }
                else if (boxFuncType == BoxFuncType.BoxFuncType_DengJi) {
                    jsonData.adname="Ad_LevelReward";
                    jsonData.parms2="";
                    Manager.adManeger.WatchAds(jsonData,()=>{
                        if (!Manager.platform.isAdOpen()) {
                            this.service.getGradeReward(id);
                        } 
                    })
                }
                else if (boxFuncType == BoxFuncType.BoxFuncType_PaiHangBangReward) {
                    jsonData.adname="Ad_RankListReward";
                    jsonData.parms2="";
                    Manager.adManeger.WatchAds(jsonData,()=>{
                        // if (!Manager.platform.isAdOpen()) {
                            // this.service.getGradeReward(id);
                        // } 
                    })
                }



        }
    }

    setDateDuanWeiReward(index:number , data: pb.IBoxData,boxFuncType:BoxFuncType )
    {
        this.root.getChild("dw").visible = true;
        this.root.getChild("des").visible = false;
        let gd = Manager.dataCenter.get(GameData);
        let gt = Manager.utils.gt(data.otherParam);

        
        let lv = gd.playerGV(GroupId.GI_SeasonDuanWei,gt,1);
        let dwData:pb.S2CGetSeasonDuanWeiCfg = Manager.dataCenter.get(GameData).get<pb.S2CGetSeasonDuanWeiCfg>(ProtoDef.pb.S2CGetSeasonDuanWeiCfg+"_"+gt);
        Log.d(" S2CShowBox  CommonPop  段位 lv   ",lv)
        Log.d(" S2CShowBox  CommonPop  段位 dwData   ",dwData)
        if(dwData == null){
            return;
        }
        let item = dwData.items[lv-1];
        Log.d(" S2CShowBox  CommonPop  段位 item   ",item)
        let iconId = Manager.utils.dwIcon(item.diTuIcon);
        Log.d(" S2CShowBox  CommonPop  段位 iconId   ",iconId)
        this.root.getChild("loader").icon = this.getLvBgUrl(iconId);
        this.root.getChild("lv").text =item.level.toString();
        this.root.getChild("ch").icon = this.getAchjBgUrl(iconId);




        
    }

    private getLvBgUrl(lv:number):string{
        return fgui.UIPackage.getItemURL(Config.BUNDLE_HALL,this.getLvBg(lv))
    }
    private getLvBg(lv:number):string{

        let data = Manager.gd.get<pb.IGradeCfg[]>(ProtoDef.pb.S2CGradeCfgs);
        // Log.d(" S2CShowBox  CommonPop  段位 ProtoDef.pb.S2CGradeCfgs   ",data)

        if(lv>0 && lv<=data.length){
            return data[lv-1].icon;
        }
        return "";
    }
    private getAchjBgUrl(lv:number):string{
        return fgui.UIPackage.getItemURL(Config.BUNDLE_HALL,this.getAchjBg(lv))
    }
    private getAchjBg(lv:number):string{
        let data = Manager.gd.get<pb.IGradeCfg[]>(ProtoDef.pb.S2CGradeCfgs);
        if(lv>0 && lv<=data.length){
            return data[lv-1].titleImg;
        }
        return "";
    }

    setDateDengJiReward(index:number , data: pb.IBoxData,boxFuncType:BoxFuncType )
    {
        this.root.getChild("dw").visible = true;
        this.root.getChild("des").visible = false;
        this.root.getChild("loader").icon = this.getLvBgUrl(data.intParam);
        this.root.getChild("lv").text =data.intParam.toString();
        this.root.getChild("ch").icon = this.getAchjBgUrl(data.intParam);
    }


    setDatePaiHangBangReward(index:number , data: pb.IBoxData,boxFuncType:BoxFuncType )
    {
        this.root.getChild("dw").visible = true;
        this.root.getChild("des").visible = false;
        let gd = Manager.dataCenter.get(GameData);
        let gt = Manager.utils.gt(data.otherParam);
        let lv = gd.playerGV(GroupId.GI_SeasonDuanWei,gt,1);
        let dwData:pb.S2CGetSeasonDuanWeiCfg = Manager.dataCenter.get(GameData).get<pb.S2CGetSeasonDuanWeiCfg>(ProtoDef.pb.S2CGetSeasonDuanWeiCfg+"_"+gt);
        Log.d(" S2CShowBox  CommonPop  段位 lv   ",lv)
        Log.d(" S2CShowBox  CommonPop  段位 dwData   ",dwData)
        if(dwData == null){
            return;
        }
        let item = dwData.items[lv-1];
        Log.d(" S2CShowBox  CommonPop  段位 item   ",item)
        let iconId = Manager.utils.dwIcon(item.diTuIcon);
        Log.d(" S2CShowBox  CommonPop  段位 iconId   ",iconId)
        this.root.getChild("loader").icon = this.getLvBgUrl(iconId);
        this.root.getChild("lv").text =item.level.toString();
        this.root.getChild("ch").icon = this.getAchjBgUrl(iconId);
    }





}


