import GameData from "../../../../scripts/common/data/GameData";
import { GameService } from "../../../../scripts/common/net/GameService";
import { ChatType, PlayerAttr } from "../../../../scripts/def/GameEnums";
import { GameConfig } from "../config/GameConfig";
import { RoomManager } from "../manager/RoomManager";
import { Tool } from "../tools/Tool";


export default class ChatOne 
{

    root : fgui.GComponent = null;
    chat_list :fgui.GList=null;

    // curPlayerData :pb.ITablePlayer=null


    public constructor(root : fgui.GComponent) {
        this.root =root;
        this.setInit()
    }

    setInit()
    {

        this.root.getChild("touming").onClick(()=>{
            this.SetActiveSelf(false)
        },this);


        this.chat_list=this.root.getChild("ChatViewOneItem").asCom.getChild("chatList").asList;
        this.chat_list.on(fgui.Event.CLICK_ITEM, this.onClickItem, this);


    }
    get service(){
        return Manager.serviceManager.get(GameService) as GameService;
    }






    SetActiveSelf(isShow:boolean)
    {
        this.root.visible = isShow
    }



    ReFlash()
    {
        this.SetActiveSelf(true)
        let gameNum = Manager.utils.gt( RoomManager.gameType );
        // Log.w("  ReFlash    ",GameConfig.KuaiJieYu[gameNum])
        let data =GameConfig.KuaiJieYu[gameNum]
        
        this.chat_list.removeChildrenToPool()
        for (const [key, val] of Object.entries(data))
        {
            let item = this.chat_list.addItemFromPool().asCom;
            item.visible=true
            let itemData = data[key]

            let str =itemData.des[0]
            if (itemData.des.length!=1) {
                let gd = Manager.dataCenter.get(GameData);
                if (gd.playerAttr(PlayerAttr.PA_Gender) != 1)
                {
                    str=itemData.des[1]
                }
            }


            item.getChild("tittle").text =Tool.ClipStringMoreAdd(str,10,"...");
            item.data = key;
        }



    }

        








    onClickItem(obj: fgui.GObject){
        // Log.d("PlayerDetails onClickItem  data :",obj.data);
        // Log.d("PlayerDetails onClickItem  Number(obj.data) :",Number(obj.data));
        let player = Manager.dataCenter.get(GameData).player();
        this.service.onC2SChat(ChatType.ChatType_ShortcutText,Number(obj.data),Number(player.guid));
        this.SetActiveSelf(false)
    }


    Reset()
    {
        this.SetActiveSelf(false)
    }





}



