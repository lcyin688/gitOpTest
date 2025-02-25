

import FLevel2UI from "../../../../scripts/common/fairyui/FLevel2UI";
import { TabType } from "../../../../scripts/def/GameEnums";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";
import { HallLogic } from "../logic/HallLogic";
import HallView from "./HallView";

export default class ActivityView extends FLevel2UI {


    private dlg:fgui.GComponent = null;
    private hdData:pb.ILoginNotice[] = null;
    private ggData:pb.ILoginNotice[] = null;

    private listTab:fgui.GList = null;
    private txtList:fgui.GList = null;
    private txtTitle:fgui.GTextField = null;
    private cx:fgui.Controller = null;
    private img:fgui.GLoader = null;

    protected view(): HallView {
        return this._owner as HallView;
    }

    protected lg(): HallLogic {
        return this.view().logic;
    }

    protected addEvents(): void {
        this.addEvent(ProtoDef.pb.S2CActNotice,this.onS2CActNotice);
    }

    protected onBind(): void {
        this.addEvents();
        this.dlg = this.root.getChild("dialog").asCom;
        this._close = this.dlg.getChild("close");
        this.bindCloseClick();

        this.dlg.getChild("ab").onClick(this.onClickHD,this);
        this.dlg.getChild("nb").onClick(this.onClickGG,this);

        this.listTab = this.dlg.getChild("list").asList;
        this.txtTitle = this.dlg.getChild("att").asTextField;
        this.txtList = this.dlg.getChild("txtlist").asList;
        this.img = this.dlg.getChild("image").asLoader; 
        this.cx = this.dlg.getController("cx");

        this.listTab.on(fgui.Event.CLICK_ITEM, this.onClickItem, this);
    }

    public show(): void {
        super.show();
        let data = Manager.gd.get<pb.S2CActNotice>(ProtoDef.pb.S2CActNotice);
        if(data == null){
            this.lg().getActivityNotice();
        }else{
            this.onS2CActNotice(data);
        }
    }

    onS2CActNotice(data:pb.S2CActNotice){
        Log.d("S2CActNotice av:",data);
        if(this.hdData == null || this.ggData == null){
            this.hdData = [];
            this.ggData = [];
            for (let index = 0; index < data.items.length; index++) {
                if(data.items[index].tabType == TabType.Act){
                    this.hdData.push(data.items[index]);
                }else if(data.items[index].tabType == TabType.Notice){
                    this.ggData.push(data.items[index]);
                }
            }
        }
        this.onClickHD();
    }

    onClickHD(){
        this.listTab.removeChildrenToPool();
        for (let index = 0; index < this.hdData.length; index++) {
            let com = this.listTab.addItemFromPool().asCom;
            com.data = this.hdData[index];
            com.text = this.hdData[index].title;
        }
        if(this.hdData.length <= 0){
            return;
        }
        this.listTab.selectedIndex = 0;
        this.setData(this.hdData[0]);
    }

    onClickGG(){
        this.listTab.removeChildrenToPool();
        for (let index = 0; index < this.ggData.length; index++) {
            let com = this.listTab.addItemFromPool().asCom;
            com.data = this.ggData[index];
            com.text = this.ggData[index].title;
        }
        if(this.ggData.length <= 0){
            return;
        }
        this.listTab.selectedIndex = 0;
        this.setData(this.ggData[0]);
    }
    
    onClickItem(item:fgui.GComponent){
        let data = item.data;
        if(data != null){
            this.setData(data);
        }
    }

    setData(data:pb.ILoginNotice){
        if(data.imageUrl.length > 0){
            this.cx.selectedIndex = 2;
            this.img.icon = data.imageUrl;
        }else{
            this.cx.selectedIndex = 1;
            this.txtTitle.text = data.title;
            if(this.txtList._children.length > 0){
                let lb = this.txtList.getChildAt(0).asLabel;
                lb.width = this.txtList.width;
                lb.text = data.text;
            }
        }
    }
}


