import { Config } from "../../../../scripts/common/config/Config";
import FLevel2UI from "../../../../scripts/common/fairyui/FLevel2UI";
import { GameCat, MahTableStage } from "../../../../scripts/def/GameEnums";
import { RoomManager } from "../../../gamecommon/script/manager/RoomManager";
import { Tool } from "../../../gamecommon/script/tools/Tool";
import { CommonMJConfig } from "../Config/CommonMJConfig";
import { MJEvent } from "../Event/MJEvent";
import { MJTool } from "../logic/MJTool";
import { MJC2SOperation } from "../net/MJC2SOperation";



export default class Mjmiddle extends FLevel2UI {


    private gameName_text: fgui.GObject = null;
    private ruleDes_text: fgui.GObject = null;
    private countDown_text: fgui.GTextField = null;

    private tableWheelGC:fgui.GComponent = null;
    
    private remainGC: fgui.GComponent = null;

    private remain_text: fgui.GObject = null;

    private pay_obj: fgui.GObject = null;



    private wheelIcon:fgui.GLoader=null;

    private wheelIcon0:fgui.GLoader=null;
    private wheelIcon1:fgui.GLoader=null;
    private wheelIcon2:fgui.GLoader=null;
    private wheelIcon3:fgui.GLoader=null;


    private load3d0: fgui.GObject = null;
    private load3d1: fgui.GObject = null;
    private load3d2: fgui.GObject = null;
    private load3d3: fgui.GObject = null;






    touzi_gload:fgui.GLoader3D=null;



    private  tableTowards = {
        [0]: { iconItem:this.wheelIcon0,load3d:this.load3d0 },
        [1]: { iconItem:this.wheelIcon1 ,load3d:this.load3d1 },
        [2]: { iconItem:this.wheelIcon2 ,load3d:this.load3d2 },
        [3]: { iconItem:this.wheelIcon3 ,load3d:this.load3d3 },
    };

    //计时器工具
    timer_1: number;

    //当前倒计时
    m_uCountDown:number =15;

    public setInit() {
        this.onBind();
        this.show();

        this.InitEvent();
        // Log.d("setInit  0-2 middle : ", Manager.utils.formatCoin(9) );
        // Log.d("setInit  0-1 middle : ", Manager.utils.formatCoin(12) );
        // Log.d("setInit  0   middle : ", Manager.utils.formatCoin(123) );
        // Log.d("setInit  01  middle : ", Manager.utils.formatCoin(1234) );
        // Log.d("setInit  02  middle : ", Manager.utils.formatCoin(12345) );
        // Log.d("setInit  03  middle : ", Manager.utils.formatCoin(123456) );
        // Log.d("setInit  05  middle : ", Manager.utils.formatCoin(1234567) );
        // Log.d("setInit  06  middle : ", Manager.utils.formatCoin(12345678) );
        // Log.d("setInit  07  middle : ", Manager.utils.formatCoin(12345679) );
        // Log.d("setInit  08  middle : ", Manager.utils.formatCoin(123456791) );
        // Log.d("setInit  09  middle : ", Manager.utils.formatCoin(1234567912) );
        // Log.d("setInit  10  middle : ", Manager.utils.formatCoin(12345679123) );
        // Log.d("setInit  11  middle : ", Manager.utils.formatCoin(123456791234) );
        // Log.d("setInit  12  middle : ", Manager.utils.formatCoin(1234567912345) );
        // Log.d("setInit  13  middle : ", Manager.utils.formatCoin(12345679123456) );
        // Log.d("setInit  14  middle : ", Manager.utils.formatCoin(123456791234567) );


        

        this.gameName_text = this.root.getChild("name");
        this.ruleDes_text = this.root.getChild("ruleDes");
        this.remainGC = this.root.getChild("remain").asCom
        this.remain_text = this.root.getChild("remain").asCom.getChild("count")
        this.pay_obj = this.root.getChild("pay")

        

        this.tableWheelGC = this.root.getChild("tableWheel").asCom;
        this.countDown_text = this.tableWheelGC.getChild("timeCount").asTextField;
        this.wheelIcon = this.tableWheelGC.getChild("icon").asLoader;
        this.wheelIcon0 = this.tableWheelGC.getChild("icon0").asLoader;
        this.wheelIcon1 = this.tableWheelGC.getChild("icon1").asLoader;
        this.wheelIcon2 = this.tableWheelGC.getChild("icon2").asLoader;
        this.wheelIcon3 = this.tableWheelGC.getChild("icon3").asLoader;



        this.load3d0 = this.tableWheelGC.getChild("load3d0");
        this.load3d1 = this.tableWheelGC.getChild("load3d1");
        this.load3d2 = this.tableWheelGC.getChild("load3d2");
        this.load3d3 = this.tableWheelGC.getChild("load3d3");

        this.touzi_gload =<fgui.GLoader3D> this.tableWheelGC.getChild("eff")

        this.tableTowards = {
            [0]: { iconItem:this.wheelIcon0,load3d:this.load3d0 },
            [1]: { iconItem:this.wheelIcon1,load3d:this.load3d1 },
            [2]: { iconItem:this.wheelIcon2,load3d:this.load3d2 },
            [3]: { iconItem:this.wheelIcon3,load3d:this.load3d3 },
        };
        this.timer_1 = window.setInterval(this.UpdateCountDown.bind(this), 1000);



    }


    /** 添加事件 */
    protected InitEvent() {
        Manager.dispatcher.add(MJEvent.SHOW_PAY_TAX, this.OnPayTax, this);
        // Manager.dispatcher.add(MJEvent.SET_RESIDUE_CARDS, this.OnSetResidueCards, this);
        Manager.dispatcher.add(MJEvent.STOP_COUNTDOWU, this.OnStop_CountDown, this);
    }

    /** 移除事件 */
    RemoveEvent() {
        Manager.dispatcher.remove(MJEvent.SHOW_PAY_TAX, this);
        // Manager.dispatcher.remove(MJEvent.SET_RESIDUE_CARDS, this);
        Manager.dispatcher.remove(MJEvent.STOP_COUNTDOWU, this);
        window.clearInterval(this.timer_1);
    }



    /**  倒计时关闭 */
    OnStop_CountDown() 
    {
        this.SetCountDown(0);
    }

 


    /**  骰子 */
    SetActiveTouZi(isShow:boolean) 
    {
        this.touzi_gload.visible =isShow;
    }


    PlayTouZiAni(touZi: number[])
    {
        let aniName = String.format("mjsp_touzi{0}{1}",touZi[0],touZi[1])
        // Log.w("PlayTouZiAni  aniName : ",aniName)
        this.SetActiveTimer(false)
        Manager.utils.PlaySpine(this.touzi_gload,"mjsp_touzi",aniName,Config.BUNDLE_MJCOMMON,()=>{
            this.SetActiveTouZi(false)
            this.SetActiveTimer(true)
        })
        MJTool.PlaySound(CommonMJConfig.SoundEffPath.TouZi, Config.BUNDLE_MJCOMMON);

    }



    /**
     * 设置游戏游戏名字
     */
    public SetGameNameText() {
        let str =""
        if (RoomManager.gameType == GameCat.GameCat_Mahjong  ) 
        {
          str=   CommonMJConfig.MjRoomRule.hongZhongType+"血流红中";
        }

        // this.gameName_text.text = str

        this.gameName_text.text = String.format("[color={0}]{1}[/color]",CommonMJConfig.TablePretended.common.name,str);

    }

    /**
     * 设置底分和封顶 和游戏名字
     */
    public OnSetFengDingDiFen() 
    {
        this.SetGameNameText()
        let difenScore = Manager.utils.formatCoin(CommonMJConfig.MjRoomRule.diFen)  
        let str = String.format("底分 {0}   封顶 {1}{2}",difenScore,CommonMJConfig.MjRoomRule.max_fan,CommonMJConfig.ISBei  ?"倍" : "番");
        this.ruleDes_text.text =String.format("[color={0}]{1}[/color]",CommonMJConfig.TablePretended.common.ruleDes,str);
    }



    /**
     * 设置游戏倒计时
     */
    public SetCountDown(tnum: number) {
        this.m_uCountDown = tnum;
        this.SetCountDownText()
    }

    /**
     * 设置游戏倒计时
     */
    public SetCountDownText() 
    {
        if (this.countDown_text!=null) 
        {

            if (!CommonMJConfig.ISReCharge ) 
            {
            
                if (this.m_uCountDown<=8) 
                {
                    this.countDown_text.font=fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON,"daojishired");
                    this.countDown_text.text =this.m_uCountDown.toString() ;
                }
                else 
                {
                    this.countDown_text.font=fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON,"mjdaojishi");
                    let ShowCount=this.m_uCountDown%8
                    if (ShowCount==0) {
                        ShowCount=8
                    }
                    this.countDown_text.text =ShowCount.toString() ;
                }
            }
            else
            {
                this.countDown_text.font=fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON,"mjdaojishi");
                this.countDown_text.text =this.m_uCountDown.toString() ;
            }
        }
    }

    SetActiveTimer(isShow:boolean)
    {
        this.countDown_text.visible = isShow;
    }


    /**
     * 倒计时循环调用
     */
    public UpdateCountDown() {
        // Log.e(" UpdateCountDown  ");
        if ( this.m_uCountDown > 0) {
            this.m_uCountDown = this.m_uCountDown- 1;
            if (this.m_uCountDown == 3) {
                MJTool.PlaySound(CommonMJConfig.SoundEffPath.TimeOutThree,Config.BUNDLE_MJCOMMON);
            }
            this.SetCountDownText();
        }
    }



    /**
     * 设置剩余牌数
     */
     public SetActiveResidue(isShow :boolean) {
        this.remainGC.visible=isShow;
    }
    

    /**
     * 设置剩余牌数
     */
     public OnSetResidueCards(count :number) {
         if (count>0) 
         {
             this.SetActiveResidue(true)
         }
        if (this.remain_text!=null) 
        {
            // Log.e("OnSetResidueCards  count : ",count )
            if (count<=10) 
            {
                this.remain_text.text =String.format("[color=#ff0000]{0}[/color]",count)
            }      
            else
            {
                this.remain_text.text =count.toString();
            }   
        }
    }

    /**
     * 设置轮盘 每次定庄
     */
     public SetTableWheel(clientZhuangPos :number) {
        this.wheelIcon.icon =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON,CommonMJConfig.TableWheelPath.Wheel[clientZhuangPos]);
        this.tableTowards[0].iconItem.icon=  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON,CommonMJConfig.TableWheelPath[clientZhuangPos][CommonMJConfig.Direction.Bottom]);
        this.tableTowards[1].iconItem.icon=  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON,CommonMJConfig.TableWheelPath[clientZhuangPos][CommonMJConfig.Direction.Right]);
        this.tableTowards[2].iconItem.icon=  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON,CommonMJConfig.TableWheelPath[clientZhuangPos][CommonMJConfig.Direction.Top]);
        this.tableTowards[3].iconItem.icon=  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON,CommonMJConfig.TableWheelPath[clientZhuangPos][CommonMJConfig.Direction.Left]);
        this.OnSetOutCardDirection(clientZhuangPos);

    }

    /**
     * 设置轮盘 朝向指示灯
     */
     public OnSetOutCardDirection(clientChaoPos :number) {
        // console.trace('OnSetOutCardDirection clientChaoPos :',clientChaoPos)
        for (const [key, val] of Object.entries(this.tableTowards)) 
        {
            // Log.e("OnSetOutCardDirection   : ",key, val)
            let clientPos = Number(key);
            this.tableTowards[key].iconItem.visible =( clientPos==clientChaoPos)

            this.tableTowards[key].load3d.visible =( clientPos==clientChaoPos)
        }

    }

    SetActivePayText(isShow :boolean)
    {
        this.pay_obj.visible = isShow;
    }


    /**本局消费 */
    OnPayTax(num:number)
    {
        let str = String.format(" 本局扣除{0}服务费",num);
        this.pay_obj.text =String.format("[color={0}]{1}[/color]",CommonMJConfig.TablePretended.common.pay,str);
        this.SetActivePayText(true);
    }





    public ResetView()
    {

        this.remain_text.text = "";
        for (const [key, val] of Object.entries(this.tableTowards)) {
            // Log.e("OnSetOutCardDirection   : ",key, val)
            val.iconItem.visible =false;
            val.load3d.visible =false;
        }
        this.SetCountDown(0);
        this.SetActivePayText(false);

        this.SetActiveTimer(true)

    }






    /**
     * 清理所有计时器 和延迟函数
     */
    public StopCoroutineTweenAni() {
        //去掉定时器的方法 




    }



}
