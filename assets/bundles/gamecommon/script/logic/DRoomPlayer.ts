import RoomPlayersBehaviour from "./RoomPlayersBehaviour";

export default class DRoomPlayer extends RoomPlayersBehaviour {

    public n2lPosMap:{} = null;

    public heads:fgui.GComponent[] = null;

    public setInit(): void {
        this.InitEvent();
    }

    Guid2LocalPos(input:any):any{
        Log.d("this.n2lPosMap",input,this.n2lPosMap);
        return this.n2lPosMap[input];
    }


    ShowChatStr(startClientPos:any,str:string){
        let com = this.heads[startClientPos].getChild("chat");
        fgui.GTween.kill(com);
        com.text = str;
        com.visible = true;
        fgui.GTween.delayedCall(2).setTarget(com).onComplete(()=>{
            com.visible = false;
        });
    }

    getHeadCom(clientfromPos:any):fgui.GObject{
        Log.d("this.getHeadCom",clientfromPos,this.heads);
        return this.heads[clientfromPos].getChild("headbd");
    }

    getAniObj():fgui.GObject{
        let cardObj = super.getAniObj();
        cardObj.sortingOrder = 5;
        return cardObj;
    }
    // OnS2CChat(data:pb.S2CChat) 
    // {
    //     Log.w(" 正式收到服务器 表情消息 data ",data,this.heads,this.n2lPosMap);
    //     let bqId = data.id
    //     if (data.chatType==ChatType.ChatType_Emoji ) 
    //     {
    //         let startClientPos = this.n2lPosMap[data.player]; 
    //         let stopClientPos = this.n2lPosMap[data.target]; 

    //         this.DoOnePlayerEmojiAni(startClientPos,stopClientPos,bqId)
    //     } 
    //     else if (data.chatType==ChatType.ChatType_ShortcutText ) 
    //     {
            
    //         let startClientPos =  this.n2lPosMap[data.player]; 
    //         let gameNum = Manager.utils.gt( RoomManager.gameType );
    //         let dataConfigItem =GameConfig.KuaiJieYu[gameNum][bqId]
    //         let gd = Manager.dataCenter.get(GameData);
    //         let str=dataConfigItem.des[0]
    //         let sexInt = gd.playerAttr(PlayerAttr.PA_Gender) 
    //         if (sexInt != 1)
    //         {
    //             if (dataConfigItem.des.length>1) 
    //             {
    //                 str=dataConfigItem.des[1]
    //             }
    //         }
    //         let audiopath="audio/"+dataConfigItem.path+"_"+sexInt
    //         Manager.globalAudio.playEffect(audiopath,Config.BUNDLE_GameCOMMON);
    //         let com = this.heads[startClientPos].getChild("chat");
    //         fgui.GTween.kill(com);
    //         com.text = str;
    //         com.visible = true;
    //         fgui.GTween.delayedCall(2).setTarget(com).onComplete(()=>{
    //             com.visible = false;
    //         });
    //     }
    // }




    // /** 表情 */
    // DoOnePlayerEmojiAni(clientfromPos: number, clienttoPos: number, bqId: number) 
    // {
    //     // Log.w( " DoOnePlayerEmojiAni biaoQingConfig    clientfromPos: ",clientfromPos)
    //     // Log.w( " DoOnePlayerEmojiAni biaoQingConfig    clienttoPos: ",clienttoPos)
    //     // Log.w( " DoOnePlayerEmojiAni biaoQingConfig    bqId: ",bqId)
    //     let fromCom = this.heads[clientfromPos].getChild("n2");
    //     let rectFrom = fromCom.localToGlobalRect(0, 0, fromCom.width, fromCom.height);
    //     rectFrom = this.root.globalToLocalRect(rectFrom.x, rectFrom.y, rectFrom.width, rectFrom.height);

    //     let toCom = this.heads[clienttoPos].getChild("n2");
    //     let rectTo = toCom.localToGlobalRect(0, 0, toCom.width, toCom.height);
    //     rectTo = this.root.globalToLocalRect(rectTo.x, rectTo.y, rectTo.width, rectTo.height);

    //     let fromVect = new cc.Vec2();
    //     fromVect.x =rectFrom.x
    //     fromVect.y =rectFrom.y
    //     let cardObj = fgui.UIPackage.createObject(Config.BUNDLE_GameCOMMON, "painEmoji")
    //     this.root.addChild(cardObj)
    //     cardObj.visible =true;

    //     //生成对应的spain 和动画
    //     let biaoQingConfig = RoomManager.GetBiaoQingConfig();
    //     let dataItem = Tool.GetBiaoQingConfigItem(bqId,biaoQingConfig)
    //     let eff_load3d = <fgui.GLoader3D>cardObj.asCom.getChild("n50");
    //     Manager.utils.PlaySpine(eff_load3d,dataItem.loadPath,dataItem.painone,Config.BUNDLE_GameCOMMON,()=>{})
    //     fgui.GTween.to2(rectFrom.x, rectFrom.y, rectTo.x, rectTo.y, 0.5 )
    //     .setTarget(cardObj, cardObj.setPosition)
    //     .setEase(fgui.EaseType.CircOut)
    //     .onComplete(()=>{
    //         //飞到了之后 就播放 下一个特效
    //         Manager.utils.PlaySpineOnly(eff_load3d,dataItem.paintwo,()=>{
    //             cardObj.dispose()
    //         });
    //         setTimeout(() => {
    //             cardObj.dispose()
    //         }, 2000);
    //     },this);
    // }

}
