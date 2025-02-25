
import GameData from "../../../../scripts/common/data/GameData";
import FLevel2UI from "../../../../scripts/common/fairyui/FLevel2UI";
import { HallLogic } from "../logic/HallLogic";
import HallView from "./HallView";

export default class EmailView extends FLevel2UI {


    private tableList:fgui.GList = null;
    private emailGroup:fgui.GGroup = null;
    private content:fgui.GComponent = null;
    private reward:fgui.GComponent = null;

    private curItem:fgui.GComponent = null;
    private clickLq:boolean = false;

    private ids:number[] = [];

    protected view(): HallView {
        return this._owner as HallView;
    }

    protected lg(): HallLogic {
        return this.view().logic;
    }

    protected onBind(): void {
      
        this._close = this.root.getChild("close");
        this.bindCloseClick();
        this.emailGroup = this.root.getChild("emailList").asGroup;
        this.content = this.root.getChild("content").asCom;
        // this.reward = this.root.getChild("reward").asCom;

        this.tableList = this.root.getChild("list").asList;
        this.tableList.on(fgui.Event.CLICK_ITEM, this.onClickItem, this);

        this.content.getChild("close").onClick(this.closeItem,this);
        this.content.getChild("cl").onClick(this.closeItem,this);
        this.content.getChild("ok").onClick(this.onClickItemSure,this);
        // this.reward.getChild("close").onClick(this.closeReward,this);
        // this.reward.getChild("lq").onClick(this.onRewardSure,this);
        
        this.root.getChild("del").onClick(this.delAll,this);
        this.root.getChild("rcv").onClick(this.recvAll,this);
    }


    public showLayer(layer:fgui.GObject): void {
        if (layer.visible){
            return
        }
        this.emailGroup.visible = false;
        // this.reward.visible = false;
        this.content.visible = false;
        if (layer == this.emailGroup){
            this.emailGroup.visible = true;
        }
        // if (layer == this.reward){
        //     this.reward.visible = true;
        // }
        if (layer == this.content){
            this.content.visible = true;
        }
    }

    open(data:pb.S2CMails){
        this.show();
        if (!this.clickLq){
            this.showLayer(this.emailGroup);   
        }
        this.ids = [];
        this.clickLq = false;
        this.tableList.removeChildrenToPool();
        if (data.mail.length > 0){
            this.tableList.data = data.mail;
            for (let index = 0; index < data.mail.length; index++) {
                this.ids.push(data.mail[index].id);
                this.setListView(data.mail[index]);
            }
            this.root.getChild("email_null").visible = false;
            this.root.getChild("email_context").visible = true;
            
        }else{
            this.root.getChild("email_null").visible = true;
            this.root.getChild("email_context").visible = false;
        }
        // this.tableList.scrollToView(0);
    }

    setListView(d: pb.IUserMail){
        let item = this.tableList.addItemFromPool().asCom;
        let status = "ui_eml_icon_4";
        if (d.state > 0){
            status = "ui_eml_icon_3";
        }
        let lq = false;
        if (d.state==2){
            lq = true;
        }
        item.getChild("loader").icon = fgui.UIPackage.getItemURL("hall",status);
        item.getChild("ylq").visible = lq;
        item.getChild("etitle").text = d.title.toString();
        item.getChild("time").text = Manager.utils.transformTs(d.date*1000);
        item.data = d;
    }

    onClickItem(obj: fgui.GObject){
        Log.d("onClickItem:",obj);
        this.curItem = obj.asCom;
        // this.lg().matchTable(obj.data.gameType,obj.data.cfgId);
        let item = obj.asCom;
        let gd = Manager.dataCenter.get(GameData);
        item.getChild("loader").icon = fgui.UIPackage.getItemURL("hall","ui_eml_icon_3");
        this.showItem(obj.data);
        this.lg().readMail([obj.data.id]);
    }

    onClickItemSure(evt: fgui.Event){
        let obj = fgui.GObject.cast(evt.currentTarget);
        Log.d("onClickItemSure:",obj);

        if(this.content.getChild("ok").text == "删除"){
            this.lg().delMail([obj.data.id]);
            this.showLayer(this.emailGroup);
            return;
        }
        this.lg().getMailAtta([obj.data.id]);
        this.content.getChild("ok").text = "删除";
        obj.data.atta = null;
        this.clickLq = true;
    }

    onRewardSure(evt: fgui.Event){
        let obj = fgui.GObject.cast(evt.currentTarget);
        Log.d("onRewardSure:",obj);
    }

    closeItem(){
        this.showLayer(this.emailGroup);
    }

    closeReward(){
        this.showLayer(this.content);
        this.clickLq = false;
    }

    recvAll(){
        if(this.ids.length > 0){
            this.lg().getMailAtta(this.ids);
        }
    }

    delAll(){
        if(this.ids.length > 0){
            this.lg().delMail(this.ids);
        }
    }

    showItem(d: pb.IUserMail){
        this.showLayer(this.content);
        this.lg().readMail([d.id]);
        Log.d("showItem",d);
        this.content.getChild("et").text = d.title.toString();
        this.content.getChild("sender").text = d.senderName.toString();
        this.content.getChild("desc").text = d.content.toString();
        this.content.getChild("date").text = Manager.utils.transformDataTime(d.date*1000);
        this.content.getChild("ok").data = d;
        let adj = this.content.getChild("adj").asCom;
        adj.visible = true;
        if (d.atta == null || d.atta.length == 0){
            adj.visible = false;
        }
        if (!adj.visible){
            this.content.getChild("ok").text = "删除";
            this.content.getChild("desc").y = 286;
            this.content.getChild("date").y = 448;
        }else{
            this.content.getChild("ok").text = "提取";
            if (d.state == 2){
                this.content.getChild("ok").text = "删除";
            }
            this.content.getChild("desc").y = 221;
            this.content.getChild("date").y = 383;
            let list = adj.getChild("list").asList;
            list.removeChildrenToPool();
            let gd = Manager.dataCenter.get(GameData);
            for (let index = 0; index < d.atta.length; index++) {
                let item = list.addItemFromPool().asCom;
                item.getChild("loader").icon = gd.getPropIcon(d.atta[index].itemType);
                item.getChild("num").text =  Manager.utils.formatCoin(d.atta[index].value,d.atta[index].itemType);
            }
        }
    }

    removeItem(evt: fgui.Event){
        let obj = fgui.GObject.cast(evt.currentTarget);
        Log.d("onRewardSure:",obj);
    }

    showRward(d: pb.S2CGetMailAtta){
        this.clickLq = true;
        // this.showLayer(this.reward);
        // let list = this.reward.getChild("list").asList;
        // list.removeChildrenToPool();
        // let gd = Manager.dataCenter.get(GameData);
        // for (let index = 0; index < d.atta.length; index++) {
        //     let item = list.addItemFromPool().asCom;
        //     // item.getChild("n2").text = d.atta[index].name.toString();  
        //     item.getChild("loader").icon = gd.getPropIcon(d.atta[index].itemType);
        //     item.getChild("num").text = d.atta[index].value.toString();   
        // }
    }
}