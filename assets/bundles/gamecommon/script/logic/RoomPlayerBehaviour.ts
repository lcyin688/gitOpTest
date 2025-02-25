import GameData from "../../../../scripts/common/data/GameData";
import FLevel2UISecond from "../../../../scripts/common/fairyui/FLevel2UISecond";
import { GameConfig } from "../config/GameConfig";
import { RoomManager } from "../manager/RoomManager";



export default class RoomPlayerBehaviour extends FLevel2UISecond {


    private self_Gc: fgui.GComponent = null;

    private ready_obj: fgui.GObject = null;
    // private zhuang_obj: fgui.GObject = null;
    // private color_obj: fgui.GObject = null;


    private headicon_loader:fgui.GLoader = null;

    private head_gc: fgui.GComponent = null;


    protected info_gc: fgui.GComponent = null;
    // private name_obj: fgui.GObject = null;
    private currency1_gc: fgui.GComponent = null;
    private currency1_text: fgui.GObject = null;


    // protected changeScore_gc: fgui.GComponent = null;
    protected moreChat_gc: fgui.GComponent = null;
    

    

    private curData :pb.ITablePlayer=null
    private isUpdate = true

    private index = 0

    m_TimerArr:number[]=[];

    public constructor(view: fgui.GComponent) {
        super(view);
        this.self_Gc=view;
    }

    protected onBind(): void {


        
    }

    public setInit() {
        this.show();
        
        // Log.e(" setInit  this.self_Gc :  "+this.self_Gc.name);
        this.ready_obj =this.self_Gc.getChild("ready");
        // this.stateZi_gc = this.self_Gc.getChild("stateZi").asCom;
        // this.zhuang_obj =this.self_Gc.getChild("zhuang");
        this.head_gc = this.self_Gc.getChild("head").asCom;
        this.headicon_loader = this.head_gc.getChild("head").asCom.getChild("icon").asLoader;
        
        this.info_gc = this.self_Gc.getChild("info").asCom;
        // this.name_obj =this.info_gc.getChild("nametext");
        this.currency1_gc =this.info_gc.getChild("currency1").asCom
        this.currency1_text =this.currency1_gc.getChild("text")

        this.moreChat_gc =this.self_Gc.getChild("moreChat").asCom
        
        

        // this.changeScore_gc = this.self_Gc.getChild("changeScore").asCom;
        
        // this.changeScoreY = this.changeScore_gc.y;


        this.head_gc.onClick(this.ClickPlayerHead,this)

    }

    /** 点击玩家头像 打开玩家具体信息 */
    ClickPlayerHead()
    {
        // Log.w(" 点击玩家头像 打开玩家具体信息 ",this.curData)
        if (this.curData!=null) 
        {
            dispatch("OpenReflashPlayerDetails",this.curData)
        }

    }









    
    /**
     * 设置玩家信息
     * @param data 玩家的数据
     * @param index  客户端坐标
     */
    public SetData(data:pb.ITablePlayer,index:number)
    {

        // Log.e (" 设置玩家信息 SetData index:  ",index);
        // Log.e (" 设置玩家信息 SetData data:  ",data);
        this.curData=data;

        if (data!=null) {
            
            // if (! this.isUpdate) {
            //     return
            // }
            this.index =index;
            this.SetActivePlayer(true);
            this.SetActiveinfo_gc(true);
            this.SetActiveCurrency1(true);


            // let currentType = 1
            // this.currencyIcon1_loader.icon = fgui.UIPackage.getItemURL(Config.BUNDLE_GameCOMMON,GameConfig.CurrentType[currentType]);
            // this.name_obj.text= Tool.ClipString(data.player.name,8)  ;
            let gd = Manager.dataCenter.get(GameData);
            // Log.d( "服务器给的玩家头像   data.player.portraits:  ",data.player.portraits)

            this.headicon_loader.icon = gd.playerheadUrl(data.player.portraits);
            // this.headicon_loader.icon = gd.playerheadUrl("file://13");
            this.SetCurrentCore(data.score)
        }
        else
        {
            if (RoomManager.curState == RoomManager.StateType.Resulting && RoomManager.curState == RoomManager.StateType.Playing) {
                
            }
            else
            {

                this.ReSetPlayer();
            }
        }
    }

    
    public SetActiveinfo_gc(isShow:boolean)
    {
        this.info_gc.visible=isShow;
    }






    public SetActiveCurrency1(isShow:boolean)
    {
        this.currency1_gc.visible=isShow;
    }
    



    public SetActivePlayer(isShow:boolean)
    {
        // Log.e(" SetActivePlayer  index :  ",this.index);
        // Log.e(" SetActivePlayer  isShow :  ",isShow);
        this.self_Gc.visible=isShow;
        // this.self_Gc.visible=true;
        
    }





    public SetActiveReady(isShow: boolean) 
    {
        if (this.ready_obj != null) {
            this.ready_obj.visible = isShow;
        }
    }



    SetActiveMoreChat(isShow :boolean )
    {
        this.moreChat_gc.visible =isShow;
    }
    



    OnChatKuaiJieYu(str:string)
    {
        this.SetActiveMoreChat(true)
        this.moreChat_gc.getChild("moredes").text = str

        let timerItem2=  window.setTimeout(()=>{
            this.SetActiveMoreChat(false);
        } ,  2000 );
        this.m_TimerArr.push(timerItem2)

        
    }



    GetHeadCom()
    {
        return this.headicon_loader
    }

    SetCurrentCore(value: number) 
    {
        if (this.currency1_text!=null) {
            this.currency1_text.text = Manager.utils.formatCoin(value)
        }

    }









    //停止到所有的计时器和动画
    StopCoroutineTweenAni()
    {
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






    public ReSetPlayer()
    {
        this.Reset();
        this.SetActivePlayer(false);
        this.StopCoroutineTweenAni();

    }

    public Reset() 
    {
        this.SetActiveReady(false);

        this.SetActiveMoreChat(false)
    }

}
