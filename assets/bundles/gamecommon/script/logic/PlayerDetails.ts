import { Config } from "../../../../scripts/common/config/Config";
import GameData from "../../../../scripts/common/data/GameData";
import { GameService } from "../../../../scripts/common/net/GameService";
import { ChatType, GameCat, GroupId, PlayerAttr } from "../../../../scripts/def/GameEnums";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";
import { RoomManager } from "../manager/RoomManager";
import { Tool } from "../tools/Tool";


export default class PlayerDetails 
{

    root : fgui.GComponent = null;

    rootView_gc: fgui.GComponent = null;

    head_loader:fgui.GLoader=null;
    bg_loader:fgui.GLoader=null;

    
    nick_text:fgui.GObject=null;
    id_text:fgui.GObject=null;
    address_text:fgui.GObject=null;
    zsl_text:fgui.GObject=null;
    zdj_text:fgui.GObject=null;

    dwCom: fgui.GComponent = null;
    starCom: fgui.GComponent = null;

    bq_list :fgui.GList=null;

    curPlayerData :pb.ITablePlayer=null


    public constructor(root : fgui.GComponent) {
        this.root =root;
        this.setInit()
    }
    setInit()
    {
        RoomManager.GetBiaoQingConfig();
        this.root.getChild("di").onClick(()=>{
            this.SetActiveSelf(false)

        },this);

        this.rootView_gc =this.root.getChild("rootView").asCom;
        this.bg_loader=this.rootView_gc.getChild("bgicon").asLoader;
        this.head_loader=this.rootView_gc.getChild("icon_loader").asLoader;
        this.nick_text=this.rootView_gc.getChild("nick")
        this.id_text=this.rootView_gc.getChild("ID")
        this.address_text=this.rootView_gc.getChild("address")
        this.zsl_text=this.rootView_gc.getChild("zsl")
        this.zdj_text=this.rootView_gc.getChild("zdj")
        this.bq_list=this.rootView_gc.getChild("list").asList;
        this.bq_list.on(fgui.Event.CLICK_ITEM, this.onClickItem, this);

        this.dwCom = this.rootView_gc.getChild("dw").asCom;
        this.starCom = this.rootView_gc.getChild("stars").asCom;
        
        this.InitEvent()



    }
    get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }


    /** 添加事件 */
    protected InitEvent() {
        Manager.dispatcher.add("OpenReflashPlayerDetails", this.OpenReflashPlayerDetails, this);

    }

   


    /** 移除事件 */
    RemoveEvent() {
        Manager.dispatcher.remove("OpenReflashPlayerDetails", this);

    }



    SetActiveSelf(isShow:boolean)
    {
        this.root.visible = isShow
    }


    OpenReflashPlayerDetails(curData :pb.ITablePlayer)
    {
        this.SetActiveSelf(true)
        this.ReflashPlayerDetails(curData)
    }


    ReflashPlayerDetails(data :pb.ITablePlayer)
    {
        this.curPlayerData =data
        Log.e("PlayerDetails ReflashPlayerDetails data : ",data )
        let gd = Manager.dataCenter.get(GameData);
        let addurl = gd.playerheadUrl(data.player.portraits);
        this.head_loader.icon = gd.playerheadUrl(data.player.portraits);

        this.nick_text.text = String.format("昵称：{0}",data.player.name) ;
        this.id_text.text =String.format("ID   ：{0}",data.player.guid) ;
        this.address_text.text = data.player.lbs;
        this.zsl_text.text = this.GetStrShengLv(data.player.groups)

        // let dw = this.GetStrDuanWei(data.player.groups)
        // let iconId = Manager.utils.dwIcon(dw.level);
        // this.rootView_gc.getChild("dw").icon = fgui.UIPackage.getItemURL("hall","ui_rank_dw_di_"+iconId);

        if (data.player.guid != Manager.gd.player().guid ) 
        {
            this.bq_list.visible=true
            this.ReflashSelfBqPlayer();
            this.bg_loader.icon =  fgui.UIPackage.getItemURL(Config.BUNDLE_GameCOMMON,"shape_personal");
        }
        else
        {
            this.bq_list.visible=false
            this.bg_loader.icon =  fgui.UIPackage.getItemURL(Config.BUNDLE_GameCOMMON,"shape_personal1");
        }
        let lv = this.getDwLevel(data.player.groups);
        this.updateDw(lv);
    }

    getDwLevel(pv:pb.IGroupValue[]):number{
        if(pv == null || pv.length == 0){
            Manager.tips.debug("玩家的groupvalue为null");
            return 0;
        }
        let gt = Manager.utils.gt(RoomManager.tableCommon.gameType);
        for (let index = 0; index < pv.length; index++) {
            let gv = pv[index]
            if(gv.groupId == GroupId.GI_SeasonDuanWei && gv.subId == gt){
                return gv.value;
            }   
        }
        Manager.tips.debug("玩家的groupvalue中木有找到 "+GroupId.GI_SeasonDuanWei+" "+gt);
        return 0;
    }

    updateDw(lv:number){
        // let hz = this.dwCom;

        let gt = Manager.utils.gt(RoomManager.tableCommon.gameType);
        let dwData:pb.S2CGetSeasonDuanWeiCfg = Manager.dataCenter.get(GameData).get<pb.S2CGetSeasonDuanWeiCfg>(ProtoDef.pb.S2CGetSeasonDuanWeiCfg+"_"+gt);

        Manager.utils.setHz(this.dwCom,this.starCom,lv,dwData,true,false);


        // hz.getChild("tg").visible = false;
        // hz.getChild("tile").visible = false;
        // let iconId = Manager.utils.dwIcon(lv);
        // hz.getChild("n0").icon = fgui.UIPackage.getItemURL(Config.BUNDLE_HALL,"ui_rank_dw_di_"+iconId); 
        // let starCount = Math.floor(lv%5);
        // if(starCount == 0){
        //     starCount = 5;
        // }

        // let stars = this.starCom;
        // stars.visible = true;
        // for (let index = 0; index < stars._children.length; index++) {
        //     let star = stars.getChild("s"+index).asCom;
        //     if(index < starCount){
        //         star.getChild("star").visible = true;
        //     }else{
        //         star.getChild("star").visible = false;
        //     }
        // }
    }

    GetBiaoQingConfigData(subid:number, bqconfig:cc.JsonAsset):[boolean,any]
    {
        // Log.w("GetBiaoQingConfigData  subid ",subid)
        for (const [key, val] of Object.entries(bqconfig.json))
        {
            let itemData = bqconfig.json[key]
            // Log.w("GetBiaoQingConfigData  itemData ",itemData)
            if (Number(key) ==subid) 
            {
                if (itemData.ShiYongXiaoHao[RoomManager.roomcfgId]!=null) 
                {
                    return [true,itemData.ShiYongXiaoHao[RoomManager.roomcfgId]]
                }
            }
        }
        return [false,null]
    }


    /** 刷新道具数据 */
    ReflashSelfBqPlayer()
    {
        this.bq_list.removeChildrenToPool()
        let gd = Manager.dataCenter.get(GameData);
        // Log.e(" ReflashSelfBqPlayer gd  ",gd)
        let djhave =  Manager.utils.GetItemDataByKey(GroupId.GI_EmojiTimes);
        // Log.e(" ReflashSelfBqPlayer    djhave  ",djhave)
        let biaoQingConfig =    RoomManager.GetBiaoQingConfig();
        // Log.w( "ReflashSelfBqPlayer biaoQingConfig    : ",biaoQingConfig)
        let havaMianfeiArr:number[]=[]
        for (const [key, val] of Object.entries(djhave)) {
            //首先是本地配置有资源的才能展示
            let dataItem = this.GetBiaoQingConfigData(Number(key ),biaoQingConfig)
        //    Log.w( " ReflashSelfBqPlayer biaoQingConfig    dataItem: ",dataItem)
            let haveItemData = djhave[key]
            if (dataItem[0] && Number(haveItemData.value)!=0 ) 
            {
                let item = this.bq_list.addItemFromPool().asCom;

                // Log.w( " ReflashSelfBqPlayer haveItemData: ",haveItemData)
                // Log.w( " ReflashSelfBqPlayer haveItemData.value  : ",haveItemData.value)
                // Log.w( " ReflashSelfBqPlayer haveItemData.subId: ",haveItemData.subId)
                item.getChild("cose").visible =false
                item.getChild("costHBType").visible =false
                item.getChild("have").text ="X"+haveItemData.value
                item.getChild("icon").icon =fgui.UIPackage.getItemURL(Config.BUNDLE_GameCOMMON,"mjgame_hudong_"+haveItemData.subId);
                item.getChild("have").visible =true
                item.getChild("icon").visible =true
                item.data = key;
                havaMianfeiArr.push(Number(key ))
            }
        }
        //免费的生成完成在生成需要花钱的
        for (const [key, val] of Object.entries(biaoQingConfig.json))
        {
            let itemData = biaoQingConfig.json[key]
            if ( ! Tool.JudgeIsHave(havaMianfeiArr ,Number(key)) ) 
            {
                if (itemData.ShiYongXiaoHao[RoomManager.roomcfgId]!=null) 
                {
                    let item = this.bq_list.addItemFromPool().asCom;
 

                    let nohaveItemData = itemData.ShiYongXiaoHao[RoomManager.roomcfgId]
                    // Log.w( " ReflashSelfBqPlayer nohaveItemData: ",nohaveItemData)
                    item.getChild("have").visible =false
                    item.getChild("cose").text = nohaveItemData[2]
                    item.getChild("costHBType").icon = gd.getPropIcon(Number(nohaveItemData[1]));
                    item.getChild("icon").icon = fgui.UIPackage.getItemURL(Config.BUNDLE_GameCOMMON,"mjgame_hudong_"+key);

                    item.getChild("cose").visible = true
                    item.getChild("costHBType").visible = true
                    item.getChild("icon").visible =true
                    
                    item.data = key;

                }
            }
        }
    }




    GetStrAddres(attrs: { [k: string]: any; }): string 
    {
        let str =""
        //省 市 区

        attrs[PlayerAttr.PA_ProvId] 


        
        return str ;
    
    }



    
    GetStrDuanWei(groups: pb.IGroupValue[]): pb.IDuanWeiRewardCfg 
    {
        Log.w(" GetStrDuanWei  RoomManager.gameType  ",RoomManager.gameType )



        let gameNum = Manager.utils.gt( RoomManager.gameType );
        let duanweiv = Manager.utils.GetGroupValueByKey(groups,GroupId.GI_SeasonDuanWei ,gameNum );
        let dwData:pb.S2CGetSeasonDuanWeiCfg = Manager.dataCenter.get(GameData).get<pb.S2CGetSeasonDuanWeiCfg>(ProtoDef.pb.S2CGetSeasonDuanWeiCfg+"_"+gameNum);
        Log.w(" GetStrDuanWei  dwData ",dwData)
        let conf = dwData.items[duanweiv-1];  
        return conf ;
    }

    GetStrShengLv(groups: pb.IGroupValue[]): string 
    {
        let str =""
        let gameNum = Manager.utils.gt( RoomManager.gameType );
        let totalNum = Manager.utils.GetGroupValueByKey(groups,GroupId.GI_PlayTimes ,gameNum );
        let winNum = Manager.utils.GetGroupValueByKey(groups,GroupId.GI_WinTimes ,gameNum );

        this.zdj_text.text =  totalNum.toString() 
        if (totalNum>0) 
        {
           let num=  (winNum/totalNum)*100
           str = num.toFixed(2)+"%"
        }
        else
        {
            str = "0%"
        }
        return str ;
    
    }



    onClickItem(obj: fgui.GObject){
        // Log.d("PlayerDetails onClickItem  data :",obj.data);
        Log.d("PlayerDetails onClickItem  Number(obj.data) :",Number(obj.data));

        let guid = this.curPlayerData.player.guid
        this.service.onC2SChat(ChatType.ChatType_Emoji,Number(obj.data),Number(guid));
        this.SetActiveSelf(false)
    }



    Reset()
    {
        this.SetActiveSelf(false)
    }



}



