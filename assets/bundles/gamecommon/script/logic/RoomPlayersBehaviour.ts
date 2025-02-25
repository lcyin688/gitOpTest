import { Config } from "../../../../scripts/common/config/Config";
import GameData from "../../../../scripts/common/data/GameData";
import FLevel2UI from "../../../../scripts/common/fairyui/FLevel2UI";
import { ChatType, PlayerAttr } from "../../../../scripts/def/GameEnums";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";
import GameView from "../../../../scripts/framework/core/ui/GameView";
import { GameConfig } from "../config/GameConfig";
import { RoomManager } from "../manager/RoomManager";
import { Tool } from "../tools/Tool";
import RoomPlayerBehaviour from "./RoomPlayerBehaviour";



export default class RoomPlayersBehaviour extends FLevel2UI {


    // protected selfGc: fgui.GComponent = null;
    // private gameName_text: fgui.GObject = null;
    // private mjmiddleGC:fgui.GComponent = null;

    // 所有玩家的对象
    t_PlayersTable :Array<RoomPlayerBehaviour>= [];
    private m_GObjectPool: fgui.GObjectPool=null;

    m_TimerArr:number[]=[];

    protected onBind(): void {
        Log.d("onBind RoomPlayersBehaviour : ", this.root.name);



    }

    public setInit() {
        this.show();
        this.m_GObjectPool =new fgui.GObjectPool();

        for(let i = 0;i< 4;i++) 
        {
            // Log.e( " RoomPlayersBehaviour  setInit i    : "+i  );
            let itemobj : fgui.GObject  =   this.root.getChild("player"+i)
            // Log.e( " RoomPlayersBehaviour  setInit itemobj.name    : "+itemobj.name  );
            let item = new RoomPlayerBehaviour(itemobj.asCom);
            item.setInit();
            this.t_PlayersTable[i]=item;
        }
        this.InitEvent()

    }

    /** 添加事件 */
    protected InitEvent() {
        Manager.dispatcher.add(ProtoDef.pb.S2CChat,this.OnS2CChat,this);
    }

   

    removeEventListeners(): void {
        this.RemoveEvent();
        super.removeEventListeners();
    }
    /** 移除事件 */
    RemoveEvent() {
        Manager.dispatcher.remove(ProtoDef.pb.S2CChat, this);
    }

    /**
     * @description 刷新玩家头像信息
     * @param pos 客户端坐标 
     */
    OnReFlashPlayer(clinePos: number,data:pb.ITablePlayer) {
        // Log.e(" OnReFlashPlayer clinePos :  ",clinePos);
        // Log.e(" OnReFlashPlayer  this.t_PlayersTable :  ", this.t_PlayersTable);
        if (this.t_PlayersTable[clinePos] !=null ) 
        {
            this.t_PlayersTable[clinePos].SetData(data,clinePos);
            // Log.e(" OnReFlashPlayer RoomManager.GetPlayerByIndex(clinePos) :  ",RoomManager.GetPlayerByIndex(clinePos));
        }
        else
        {
            Log.e(" 传入数据错误 ");
        }
    }

    ReSetOnePlayer(clinePos: number) {
        if (this.t_PlayersTable[clinePos] !=null ) 
        {
            this.t_PlayersTable[clinePos].ReSetPlayer();
            // Log.e(" OnReFlashPlayer RoomManager.GetPlayerByIndex(clinePos) :  ",RoomManager.GetPlayerByIndex(clinePos));
        }
        else
        {
            Log.e(" 传入数据错误 ");
        }
    }

    /** 隐藏掉所有准备 */
    SetActiveReadyAllHide() 
    {
        for (let index = 0; index < this.t_PlayersTable.length; index++) 
        {
            this.t_PlayersTable[index].SetActiveReady(false);
        }
    }




    // //播放庄的动画
    // PlayZhuangAni()
    // {
    //     // Log.e("  PlayZhuangAni  RoomManager.zhuang ",RoomManager.zhuang )
    //     // Log.e("  PlayZhuangAni  RoomManager.ConvertLocalIndex(RoomManager.zhuang) ",RoomManager.ConvertLocalIndex(RoomManager.zhuang))
    //     this.t_PlayersTable[RoomManager.ConvertLocalIndex(RoomManager.zhuang)].PlayZhuangAni( )
    // }

    //是否显示准备
    SetActiveReady(pos: number, isShow: boolean) 
    {
        this.t_PlayersTable[RoomManager.ConvertLocalIndex(pos)].SetActiveReady(isShow)
    }

    // PlayScore(pos: number, value: number,isfdPc:boolean) 
    // {
    //     // Log.w(" PlayScore    pos   :  ",pos)
    //     // Log.w(" PlayScore    RoomManager.ConvertLocalIndex(pos)   :  ", RoomManager.ConvertLocalIndex(pos))

    //     this.t_PlayersTable[RoomManager.ConvertLocalIndex(pos)].PlayScore(value,isfdPc)

    // }

    SetCurrentCore(pos: number, value: number) 
    {
        this.t_PlayersTable[RoomManager.ConvertLocalIndex(pos)].SetCurrentCore(value)
    }


    OnS2CChat(data:pb.S2CChat) 
    {
        Log.w(" 正式收到服务器 表情消息 data ",data)
        let bqId = data.id
        if (data.chatType==ChatType.ChatType_Emoji ) 
        {
            Log.d("OnS2CChat",data.player,data.target);
            let startClientPos = this.Guid2LocalPos(data.player);
            let stopClientPos = this.Guid2LocalPos(data.target)
            this.DoOnePlayerEmojiAni(startClientPos,stopClientPos,bqId)

        } 
        else if (data.chatType==ChatType.ChatType_ShortcutText ) 
        {
            
            let startClientPos = this.Guid2LocalPos(data.player);
            let gameNum = Manager.utils.gt( RoomManager.gameType );
            let dataConfigItem =GameConfig.KuaiJieYu[gameNum][bqId]
            let gd = Manager.dataCenter.get(GameData);
            let str=dataConfigItem.des[0]
            let sexInt = gd.playerAttr(PlayerAttr.PA_Gender) 
            if (sexInt != 1)
            {
                if (dataConfigItem.des.length>1) 
                {
                    str=dataConfigItem.des[1]
                }
            }
            let audiopath="audio/"+dataConfigItem.path+"_"+sexInt
            Manager.globalAudio.playEffect(audiopath,Config.BUNDLE_GameCOMMON);
            // this.t_PlayersTable[startClientPos].OnChatKuaiJieYu(str)
            this.ShowChatStr(startClientPos,str);
        }
    }


    Guid2LocalPos(input:any):any{
        return RoomManager.GetPlayerClientPosByGuid(input);
    }


    ShowChatStr(startClientPos:any,str:string){
        this.t_PlayersTable[startClientPos].OnChatKuaiJieYu(str);
    }

    getHeadCom(clientfromPos:any):fgui.GObject{
        return this.t_PlayersTable[clientfromPos].GetHeadCom();
    }


    getAniObj():fgui.GObject{
        let cardObj =fgui.UIPackage.createObject(Config.BUNDLE_GameCOMMON, "painEmoji")
        this.root.addChild(cardObj)
        cardObj.visible =true;
        return cardObj;
    }

    /** 表情 */
    DoOnePlayerEmojiAni(clientfromPos: number, clienttoPos: number, bqId: number) 
    {
        // Log.w( " DoOnePlayerEmojiAni biaoQingConfig    clientfromPos: ",clientfromPos)
        // Log.w( " DoOnePlayerEmojiAni biaoQingConfig    clienttoPos: ",clienttoPos)
        // Log.w( " DoOnePlayerEmojiAni biaoQingConfig    bqId: ",bqId)
        let fromCom = this.getHeadCom(clientfromPos);
        let rectFrom = fromCom.localToGlobalRect(0, 0, fromCom.width, fromCom.height);
        rectFrom = this.root.globalToLocalRect(rectFrom.x, rectFrom.y, rectFrom.width, rectFrom.height);

        let toCom = this.getHeadCom(clienttoPos);
        let rectTo = toCom.localToGlobalRect(0, 0, toCom.width, toCom.height);
        rectTo = this.root.globalToLocalRect(rectTo.x, rectTo.y, rectTo.width, rectTo.height);

        let fromVect = new cc.Vec2()
        fromVect.x =rectFrom.x
        fromVect.y =rectFrom.y
        let cardObj = this.getAniObj();

        //生成对应的spain 和动画
        let biaoQingConfig = RoomManager.GetBiaoQingConfig();
        let dataItem = Tool.GetBiaoQingConfigItem(bqId,biaoQingConfig)



        let eff_load3d = <fgui.GLoader3D>cardObj.asCom.getChild("n50");
        Manager.utils.PlaySpine(eff_load3d,dataItem.loadPath,dataItem.painone,Config.BUNDLE_GameCOMMON,()=>{})
        fgui.GTween.to2(rectFrom.x, rectFrom.y, rectTo.x, rectTo.y, 0.5 )
        .setTarget(cardObj, cardObj.setPosition)
        .setEase(fgui.EaseType.CircOut)
        .onComplete(()=>{
            //飞到了之后 就播放 下一个特效
            //播放声音
            Manager.globalAudio.playEffect("audio/bq_"+bqId,Config.BUNDLE_GameCOMMON);
            Manager.utils.PlaySpineOnly(eff_load3d,dataItem.paintwo,()=>{
                cardObj.dispose()
            });

            let timerItem2=  window.setTimeout(()=>{
                cardObj.dispose()
            } ,  2000 );
            this.m_TimerArr.push(timerItem2)

        },this);
    }


    
    StopCoroutineTweenAni()
    {
        for (const [key, val] of Object.entries(this.t_PlayersTable)) {
            this.t_PlayersTable[key].StopCoroutineTweenAni();
        }
        
        if (this.m_TimerArr !=null ) 
        {
            //关掉所有的延迟函数
            for (let i = 0; i <this.m_TimerArr.length ; i++) 
            {
                if ( this.m_TimerArr[i]!=null) {
                    clearTimeout( this.m_TimerArr[i])
                    this.m_TimerArr[i]=null;
                }
            }
            this.m_TimerArr=[];
        }
        
    }



    ReSetPlayer() 
    {
        for (const [key, val] of Object.entries(this.t_PlayersTable)) {
            // Log.e(" SetActivePlayer ~~~  key :  ",key);
            this.t_PlayersTable[key].ReSetPlayer();
        }

    }

    Reset() 
    {
        for (const [key, val] of Object.entries(this.t_PlayersTable)) {
            this.t_PlayersTable[key].Reset();
        }

        this.m_GObjectPool.clear();

    }


}
