import GameData from "../../../../scripts/common/data/GameData";
import { GameEvent } from "../../../../scripts/common/event/GameEvent";
import FLevel2UI from "../../../../scripts/common/fairyui/FLevel2UI";
import { GroupId, PlayerAttr, RewardState } from "../../../../scripts/def/GameEnums";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";
import HallView from "./HallView";
import TopUI from "../../../../scripts/common/fairyui/TopUI";
import { GameService } from "../../../../scripts/common/net/GameService";

export default class ATView extends FLevel2UI {


    public listTask:fgui.GList = null;

    public listAchj:fgui.GList = null;
    public lvLoader:fgui.GLoader = null;
    public lvText:fgui.GTextField = null;
    public lvbar:fgui.GProgressBar = null;

    private taskCfg:pb.S2CAchievCfg = null;

    private data:pb.IGradeCfg[] = null;
    private dataAchiev :pb.S2CReplyAchiev = null;

    private topUI:TopUI = null;

    protected view(): HallView {
        return this._owner as HallView;
    }

    get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }
    
    protected addEvents(): void {
        this.addEvent(GameEvent.UI_ACH_RefreshGrade,this.eventRefreshGrade);
        this.addEvent(ProtoDef.pb.S2CReplyAchiev, this.onS2CReplyAchiev);
        this.addEvent(ProtoDef.pb.S2CAchievReward, this.onS2CAchievReward);
        this.addEvent(ProtoDef.pb.S2CAchievCfg, this.onS2CAchievCfg);
    }

    protected onBind(): void {
        Log.d(this.root.name);
        this._close = this.root.getChild("close");
        this._close.asCom.getChild("back").asCom.getChild("gn").text = "成就";
        this.bindCloseClick();
        this.root.getChild("tab0").asCom.getChild("title1").text = this.root.getChild("tab0").text;
        this.root.getChild("tab1").asCom.getChild("title1").text = this.root.getChild("tab1").text;

        let atjd = this.root.getChild("lvLoader").asCom;

        this.listTask = this.root.getChild("list_task").asList;
        this.listAchj = this.root.getChild("list_achj").asList;
        this.lvLoader = atjd.getChild("lvLoader").asLoader;
        this.lvText = atjd.getChild("lv").asTextField;
        this.lvbar = atjd.getChild("bar").asProgress;
        // this.listTask = this.root.getChild("list_task").asList;
        this.listAchj.removeChildrenToPool();
        this.listTask.removeChildrenToPool();
        this.addEvents();

        this.topUI = new TopUI();
        this.topUI.setRoot(this.root);

        let left = this.root.getChild("left").width;
        let cx = (fgui.GRoot.inst.width - left) / 2 + left;
        atjd.x = cx;
        this.listTask.x = cx;
        this.listAchj.x = cx;
    }

    addListeners(): void {
        super.addListeners();
        if(this.topUI){
            this.topUI.addListeners();
        }
    }

    removeEventListeners(): void {
        super.removeEventListeners();
        if(this.topUI){
            this.topUI.removeEventListeners();
        }
    }

    private getLvBg(lv:number):string{
        // let gd = Manager.dataCenter.get(GameData);
        // let lv = gd.playerAttr(PlayerAttr.PA_Grade);
        let data = Manager.gd.get<pb.IGradeCfg[]>(ProtoDef.pb.S2CGradeCfgs);
        if(lv>0 && lv<=data.length){
            return data[lv-1].icon;
        }
        return "";
    }

    private getLvBgUrl(lv:number):string{
        return fgui.UIPackage.getItemURL(HallView.getViewPath().pkgName,this.getLvBg(lv))
    }

    private getAchjBg(lv:number):string{
        let data = Manager.gd.get<pb.IGradeCfg[]>(ProtoDef.pb.S2CGradeCfgs);
        if(lv>0 && lv<=data.length){
            return data[lv-1].titleImg;
        }
        return "";
    }

    private getAchjBgUrl(lv:number):string{
        return fgui.UIPackage.getItemURL(HallView.getViewPath().pkgName,this.getAchjBg(lv))
    }

    public show(){
        super.show();
        this.topUI.refresh();
        let gd = Manager.dataCenter.get(GameData);
        // gd.setPlayerAttr(PlayerAttr.PA_Grade,100);
        this.lvText.text = gd.playerAttrStr(PlayerAttr.PA_Grade);
        this.lvLoader.icon = fgui.UIPackage.getItemURL(HallView.getViewPath().pkgName,this.getLvBg(gd.playerAttr(PlayerAttr.PA_Grade)));
        this.lvbar.value = gd.playerAttr(PlayerAttr.PA_Grade);

        this.data = gd.get<pb.IGradeCfg[]>(ProtoDef.pb.S2CGradeCfgs);
        Log.e("pb.IGradeCfg[]", this.data);
        if(this.data == null){
            return;
        }
        // this.listAchj.removeChildrenToPool();
        this.listAchj.setVirtual();
        this.listAchj.itemRenderer = this.renderListItem.bind(this);
        this.listAchj.numItems = this.data.length;

        this.service.getAchievCfg();

        dispatch(GameEvent.UI_SHOW_ATVIEW,this.root);
    }

    private renderListItem(index: number, obj: fgui.GObject): void {
        let com = obj.asCom;
        if(com == null){
            return;
        }
        let data = this.data;
        if(data == null){
            return;
        }
        if(index >= data.length){
            return;
        }
        com.width = this.listAchj.width;
        let pGrade = Manager.gd.playerAttr(PlayerAttr.PA_Grade);
        com.data = data[index];
        com.getChild("loader").icon = this.getLvBgUrl(data[index].grade);
        com.getChild("lv").text = data[index].grade.toString();
        com.getChild("ch").icon = this.getAchjBgUrl(data[index].grade);

        let gv = Manager.gd.playerGroupValue(GroupId.GI_GradeReward,data[index].grade);
        // Log.d("gv",gv);
        let recv = com.getChild("recv");
        recv.asButton.enabled = true;
        recv.visible = true;
        com.getChild("recvd").visible = true;

        Manager.utils.quickSetIcon(recv);

        if (gv == null || gv == undefined){
            com.getChild("recvd").visible = false;
            recv.asButton.enabled = false;
        }else{
            if (gv.value == 2){
                com.getChild("recvd").visible = true;
                recv.visible = false;
            }else{
                com.getChild("recvd").visible = false;
                recv.data = data[index];
                recv.offClick(this.onClickAchItem,this);
                recv.onClick(this.onClickAchItem,this);
            }
        }

        let have = false;
        let rlist = com.getChild("rlist").asList;
        rlist.removeChildrenToPool();
        for (const [moneyType, moneyCount] of Object.entries(data[index].rewards)) {
            have = true;
            let com = rlist.addItemFromPool().asCom;
            com.getChild("loader").icon = Manager.gd.getPropIcon(Number(moneyType));
            com.getChild("num").text = Manager.utils.formatCoin(moneyCount,Number(moneyType)); 
        }
        com.getChild("shang").visible = false;
        com.getChild("xia").visible = false;
        com.getChild("shang_").visible = true;
        com.getChild("xia_").visible = true;

        com.getChild("y_shang").visible = true;
        com.getChild("y_xia_").visible = true;
        com.getChild("y_shang_").visible = true;
        com.getChild("y_xia").visible = true;
        com.getChild("n5").visible = true;

        if (index==0){
            com.getChild("y_shang_").visible = false;
            com.getChild("shang_").visible = false;
            com.getChild("shang").visible = true;
        }else if(index==data.length-1){
            com.getChild("y_xia_").visible = false;
            com.getChild("xia_").visible = false;
            com.getChild("xia").visible = true;
        }

        if ((index+1)==pGrade){
            if (data.length != pGrade){
                com.getChild("y_xia_").visible = false;
                com.getChild("y_xia").visible = false;
            }
        }else if((index+1)>pGrade){
            com.getChild("y_xia_").visible = false;
            com.getChild("y_xia").visible = false;
            com.getChild("n5").visible = false;
            com.getChild("y_shang").visible = false;
            com.getChild("y_shang_").visible = false;
        }
    }

    onClickAchItem(evt: fgui.Event){
        let obj = fgui.GObject.cast(evt.currentTarget).asCom;
        Log.d("onClickAchItem:",obj.data);
        let jsonData={adname:"Ad_LevelReward",parms1:obj.data.grade.toString(),parms2:""}
        Manager.adManeger.WatchAds(jsonData,()=>{
            if (!Manager.platform.isAdOpen()) {
                this.service.getGradeReward(obj.data.grade);
            } 

        })



    }

    eventRefreshGrade(data:any){
        Log.d("eventRefreshGrade:",data);
        if (data > 0 && data <= this.listAchj._children.length){
            this.listAchj.refreshVirtualList();
        }
    }

    //任务
    protected onS2CReplyAchiev(data :pb.S2CReplyAchiev){
        this.dataAchiev = data;
        // this.listTask.removeChildrenToPool();
        this.dataAchiev.achievs.sort((item1, item2) => item2.state - item1.state);
        // data.sort((item1, item2) => item1.price - item2.price);
        this.listTask.setVirtual();
        this.listTask.itemRenderer = this.renderyAchievListItem.bind(this);
        this.listTask.numItems = this.dataAchiev.achievs.length;
    }

    private renderyAchievListItem(index: number, obj: fgui.GObject): void {
        let com = obj.asCom;
        if(com == null){
            return;
        }
        let data = this.dataAchiev;
        if(data == null){
            return;
        }
        let di = data.achievs[index];
        com.data = di;
        com.width = this.listTask.width;
        let conf = this.taskCfg.cfg[di.id];
        if(conf == null){
            Manager.tips.debug("任务id在配置中木有找到："+di.id);
            return;
        }
        com.getChild("ttitle").text = conf.title;
        let list = com.getChild("rlist").asList;
        list.removeChildrenToPool();
        for (let index = 0; index < conf.reward.length; index++) {
            let cdi = conf.reward[index];
            let ccom = list.addItemFromPool().asCom;
            ccom.getChild("num").text = Manager.utils.formatCoin(cdi.value,cdi.key);  
            ccom.getChild("loader").icon = Manager.gd.getPropIcon(cdi.key);       
        }
        let ps = com.getChild("ps").asProgress;
        ps.max = conf.targetVal;
        ps.min = 0;
        ps.value = di.val;
        com.getChild("recvd").visible = false;
        let recvBtn = com.getChild("recv");
        recvBtn.visible = false;
        recvBtn.clearClick();
        recvBtn.offClick(this.onClickTaskItem,this);
        recvBtn.onClick(this.onClickTaskItem,this);
        recvBtn.data = {};
        recvBtn.data.id = di.id;
        if (di.state == RewardState.RewardState_Null){
            recvBtn.visible = true;
            Manager.utils.quickSetIcon(recvBtn,true);
            let str = conf.buttomInfo.split("|");
            let isConfOk = false;
            if(str.length > 1){
                recvBtn.text = str[1];
                let idarr = str[0].split(";");
                if(idarr.length > 1){
                    let id = idarr[1].trim();
                    recvBtn.data.target = id;
                    isConfOk = true;
                }
            }
            if(!isConfOk){
                Manager.tips.debug("任务前往游戏列表的配置错误");
                return;
            }

        }else if (di.state == RewardState.RewardState_Reach){
            recvBtn.visible = true;
            recvBtn.text = "领取";
            Manager.utils.quickSetIcon(recvBtn);
        }else if (di.state == RewardState.RewardState_Geted){

            com.getChild("recvd").visible = true;
        }
    }

    onClickTaskItem(evt: fgui.Event){
        let obj = fgui.GObject.cast(evt.currentTarget);
        if(obj.data != null){
            if(obj.data.target == null){
                let jsonData={adname:"",parms1:"",parms2:""}
                jsonData.adname="Ad_TaskReward";
                jsonData.parms1=obj.data.id.toString();
                jsonData.parms2="";

                Manager.adManeger.WatchAds(jsonData,()=>{
                    if (!Manager.platform.isAdOpen()) {
                        this.service.getAchievReward(obj.data.id);
                    } 
                })

            }else{
                this.hide();
                this.service.openGameList(obj.data.target);
            }
        }
    }

    protected onS2CAchievReward(data :pb.S2CAchievReward){
        this.service.getASKAchievData();
    }


    protected onS2CAchievCfg(data :pb.S2CAchievCfg){
        this.taskCfg = data;
        this.service.getASKAchievData();
    }

}

