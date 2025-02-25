import { Config } from "../../../../scripts/common/config/Config";
import FLevel2UISecond from "../../../../scripts/common/fairyui/FLevel2UISecond";
import { MahScoreReason } from "../../../../scripts/def/GameEnums";
import { Tool } from "../../../gamecommon/script/tools/Tool";
import { CommonMJConfig } from "../Config/CommonMJConfig";
import { MJEvent } from "../Event/MJEvent";
import { MJTool } from "../logic/MJTool";



export default class MJHeadPlayer extends FLevel2UISecond {


    protected self_Gc: fgui.GComponent = null;
    private zhaung_obj: fgui.GObject = null;
    private miansi_obj: fgui.GObject = null;
    private jinzhongzhao_3d: fairygui.GLoader3D = null;
    // private pofeng_3d: fairygui.GLoader3D = null;
    private fuchou_3d: fairygui.GLoader3D = null;
    

    private se_load: fgui.GLoader = null;
    private startPosition_obj: fgui.GObject = null;
    // private lacking_obj: fgui.GObject = null;
    // private haopai_obj: fgui.GObject = null;
    private recharge_obj: fgui.GObject = null;
    private hjzy_obj: fgui.GObject = null;
    private cha_text: fgui.GObject = null;


    private startIcon_load: fgui.GLoader = null;
    // private stopIcon_load: fgui.GLoader = null;

    protected head_Gc: fgui.GComponent = null;

    protected obj_huCount: fgui.GComponent = null;
    protected huText_obj: fgui.GObject = null;

    private eff_3dLoad:fgui.GLoader3D=null;
    private head_3dLoad:fgui.GLoader3D=null;
    protected changeScore_list: fgui.GList = null;
    
    m_TimerArr:number[]=[];

    
    private mianSICount_gc:fgui.GComponent =null
    private hongZhongCount_gc:fgui.GComponent =null

    private fire_3d: fairygui.GLoader3D = null;
    private hzCount:number =0;

    public constructor(view: fgui.GComponent) {
        super(view);
        this.self_Gc=view;
    }

    public setInit() {
        

        this.head_Gc =this.self_Gc.getChild("head").asCom;
        this.head_3dLoad =<fgui.GLoader3D> this.head_Gc.getChild("head").asCom.getChild("eff");

        this.fire_3d =<fgui.GLoader3D> this.head_Gc.getChild("fire");


        this.zhaung_obj =this.self_Gc.getChild("zhuang");
        this.se_load =this.self_Gc.getChild("color").asLoader;

        
        this.startPosition_obj =this.self_Gc.getChild("startPosition");
        // this.lacking_obj =this.self_Gc.getChild("lacking");
        // this.haopai_obj =this.self_Gc.getChild("haopaiobj");
        this.recharge_obj =this.self_Gc.getChild("rechargeobj");
        this.hjzy_obj =this.self_Gc.getChild("hjzyobj");
        this.cha_text =this.self_Gc.getChild("chaText");

        this.startIcon_load =this.self_Gc.getChild("startIcon").asLoader;
        // this.stopIcon_load =this.self_Gc.getChild("stopIcon").asLoader;
        
        this.obj_huCount =this.self_Gc.getChild("hucount").asCom;
        this.huText_obj =this.obj_huCount.getChild("count");
        this.eff_3dLoad =<fgui.GLoader3D> this.obj_huCount.getChild("eff");

        this.miansi_obj =this.self_Gc.getChild("miansi").asCom;

        this.jinzhongzhao_3d =<fgui.GLoader3D> this.self_Gc.getChild("jinzhongzhao");
        // this.pofeng_3d =<fgui.GLoader3D> this.self_Gc.getChild("pofeng");
        this.fuchou_3d =<fgui.GLoader3D> this.self_Gc.getChild("fuchou");


        
        this.changeScore_list = this.self_Gc.getChild("changeScoreList").asList;
        
        this.mianSICount_gc =this.self_Gc.getChild("zhongMianSi").asCom.getChild("mianSICount").asCom;
        this.hongZhongCount_gc =this.self_Gc.getChild("zhongMianSi").asCom.getChild("hongZhongCount").asCom;
        

    }


    SHowHuCountEff(num :number)
    {
        this.SetActiveHuCountEff(true);
        this.huText_obj.text= String(num) ;
        let aniName ="mj_hujici0"
        if (num>=5) 
        {
            aniName ="mj_hujici1"
        }
        this.PlayHuCountSpain(aniName)
    }


    PlayHuCountSpain(aniName:string) 
    {
        this.eff_3dLoad._onLoad = function(){
             this.eff_3dLoad.loop = false;
             this.eff_3dLoad.animationName = aniName;
            let sp = <sp.Skeleton> this.eff_3dLoad.content;
            sp.setCompleteListener(function(){
                this.eff_3dLoad.animationName = aniName;
            }.bind(this));
        }.bind(this);
         this.eff_3dLoad.icon = fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON,"mj_hujici1"); 
         this.eff_3dLoad.skinName = "default";
    }




    SetActiveHuCountEff(isShow:boolean)
    {
        this.obj_huCount.visible = isShow;
    }




    GetHeadCom():fgui.GComponent
    {
        return this.head_Gc
    }


    /** 定缺花色 */
    PlaySeAni(lackingColor:number)
    {

        //玩家还没有定缺 的图片或者特效展示
        if (lackingColor == -1 || lackingColor== 4 ) 
        {
            return;
        }

        MJTool.PlaySound(CommonMJConfig.SoundEffPath.DingQueFei, Config.BUNDLE_MJCOMMON);
        this.SetActivestartIcon_load(true)
        this.startIcon_load.url= fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON,CommonMJConfig.HuaSeColor.Start[lackingColor]);
        
        // let rect = this.startIcon_load.localToGlobalRect(0, 0, this.startIcon_load.width, this.startIcon_load.height);
        // rect = this.se_load.globalToLocalRect(rect.x, rect.y, rect.width, rect.height);

        fgui.GTween.to2(1, 1, 0.3,0.3 , 1)
        .setTarget(this.startIcon_load, this.startIcon_load.setScale)
        .setEase(fgui.EaseType.CubicOut).onComplete(() => {
        //缩放完成
        }, this);

        fgui.GTween.to2(this.startPosition_obj.x, this.startPosition_obj.y, this.se_load.x, this.se_load.y, 1)
        .setTarget(this.startIcon_load, this.startIcon_load.setPosition)
        .onComplete(()=>
        {
            this.SetSe(lackingColor);
            this.SetActivestartIcon_load(false)
        },this)



        

    }


    


    /** 设置缺的花色 */
    SetSe(lackingColor:number)
    {
        //玩家还没有定缺 的图片或者特效展示
        if (lackingColor== -1 || lackingColor== 4 ) 
        {
            return;
        }
        this.SetActiveSe(true);
        let iconStr =fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON,CommonMJConfig.HuaSeColor.ZiSprite[lackingColor])
        this.se_load.icon = iconStr;
        //刷新UI 的位置

    }



    //播放庄动画
    public PlayZhuangAni() 
    {
        // MJTool.PlaySound(CommonMJConfig.SoundEffPath.DingQueFei, Config.BUNDLE_MJCOMMON);
        this.startIcon_load.url= fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON,"mjgame_zhuang001");
        this.startIcon_load.x= this.startPosition_obj.x
        this.startIcon_load.y= this.startPosition_obj.y
        this.startIcon_load.setScale(1,1)
        this.SetActivestartIcon_load(true)
        fgui.GTween.to2(this.startPosition_obj.x, this.startPosition_obj.y, this.zhaung_obj.x, this.zhaung_obj.y, 1)
        .setTarget(this.startIcon_load, this.startIcon_load.setPosition)
        .onComplete(()=>
        {
            // this.SetActivestartIcon_load(false)
            // this.SetActiveZhuang(true);
        },this)

    }
    

    
    //播放复活动画
    public PlayFuChou() 
    {
        // MJTool.PlaySound(CommonMJConfig.SoundEffPath.DingQueFei, Config.BUNDLE_MJCOMMON);
        Manager.utils.PlaySpine(this.fuchou_3d,"mjsp_ksfc","ani2",Config.BUNDLE_MJCOMMON,()=>{
            this.SetActiveFuChou_3d(false)
        })

    }
    



    SetChaText(data)
    {
        var arr:Array<any> = Object.keys(data); 
        var len:number=arr.length;
        if (len==0) {
            return;
        }
        this.SetActiveChaText(true)
        let desStr=""

        let temp = 
        {
            [MahScoreReason.SR_DaJiao] :"查大叫",
            [MahScoreReason.SR_HuaZhu] :"查花猪",
            [MahScoreReason.SR_TuiSui] :"退税",
        }


        for (const [key, val] of Object.entries(data)) {
            // Log.e("SetChaText : ",key, val)
            desStr =desStr+temp[Number(val)];
        }
        this.cha_text.text = desStr;

        let timerItem2=  window.setTimeout(()=>{
            this.SetActiveChaText(false);
        } ,  2000 );
        this.m_TimerArr.push(timerItem2)
    }

    
    

    SetActivehead_3dLoad(isShow: boolean) {
        this.head_3dLoad.visible = isShow;
    }

    SetActiveStopIcon(isShow: boolean) {
        // this.stopIcon_load.visible = isShow;
    }

    SetActiveStartLoad(isShow: boolean) {
        this.startIcon_load.visible = isShow;
    }


    SetActiveSe(isShow: boolean) {
        this.se_load.visible = isShow;
    }

    // HaoPaiSetActive(isShow: boolean) {
    //     // this.haopai_obj.visible = isShow;
    // }

    SetActiveRecharge(isShow: boolean) {
        this.recharge_obj.visible = isShow;
    }


    SetActiveHuJiaoZhuanYi(isShow: boolean) {
        this.hjzy_obj.visible = isShow;
    }

    /** 查花猪 查大叫的文本 */
    SetActiveChaText(isShow: boolean) {
        this.cha_text.visible = isShow;
    }


    SetActivestartIcon_load(isShow: boolean) {
        this.startIcon_load.visible = isShow;
    }

    SetActiveZhuang(isShow: boolean) {
        this.zhaung_obj.visible = isShow;
    }
    
    SetActiveMianSiCount(isShow: boolean) {
        if (this.mianSICount_gc) {
            this.mianSICount_gc.visible = isShow;
        }
    }

    SetActiveHongZhongCount(isShow: boolean) {
        this.hongZhongCount_gc.visible = isShow;
    }


    SetActivefire_3d(isShow: boolean) {
        if (this.fire_3d!=null) {
            this.fire_3d.visible = isShow;
        }
    }


    SetActiveFuChou_3d(isShow: boolean) {
        if (this.fuchou_3d!=null) {
            this.fuchou_3d.visible = isShow;
        }
    }
    
    SetHongZhongADDCount()
    {
        this.SetHongZhongCount(this.hzCount+1)
    }


    SetHongZhongCount(count:number)
    {
        this.SetHZCount(count)
        if (count>0) 
        {
            if (CommonMJConfig.MjRoomRule.isHongZhongGang) 
            {
                this.SetActiveHongZhongCount(true)
                this.hongZhongCount_gc.getChild("count").text = "x"+count
            }
        }
        else
        {
            this.SetActiveHongZhongCount(false)
        }
    }

    SetMianSiCount(count:number)
    {
        if (count>0) 
        {
            this.SetActiveMianSiCount(true)
            this.mianSICount_gc.getChild("count").text = "x"+count
        }
        else
        {
            this.SetActiveMianSiCount(false)
            this.SetActiveMianSi(false)
        }
    }
    

    SetActiveMianSi(isShow: boolean) 
    {
        if ( this.miansi_obj) {
            this.miansi_obj.visible=isShow;
        }

    }


    SetActiveJinzhongzhao_3d(isShow: boolean) 
    {
        this.jinzhongzhao_3d.visible=isShow;

        if (isShow==true) {
            Manager.utils.PlaySpine(this.jinzhongzhao_3d,"mjsp_jzz","ani",Config.BUNDLE_MJCOMMON,()=>{
                this.jinzhongzhao_3d.visible =false
            })
        }
    }

    


    SetActiveChangeScore(isShow :boolean )
    {
        if (this.changeScore_list!=null) {
            this.changeScore_list.visible =isShow;
        }
    }

    SetHZCount(count:number)
    {
        this.hzCount =count;
    }



    /** 播放分数变化 */
    PlayScore(score:number,isfdPc:boolean,bUseJinZhongZhao:boolean)
    {



        if (isfdPc==null) {
            isfdPc =false
        }
        if (bUseJinZhongZhao==null) {
            bUseJinZhongZhao =false
        }

        if (bUseJinZhongZhao) 
        {
            this.SetActiveMianSi(true)
        }


        //播放分数变化
        this.SetActiveChangeScore(true);
        let one_gc =  this.changeScore_list.getChildAt(0).asCom
        let two_gc =  this.changeScore_list.getChildAt(1).asCom
        one_gc.visible =true
        two_gc.visible = bUseJinZhongZhao


        let score_text =  one_gc.getChild("addScoreText").asTextField
        if (score_text==null) //飘分前退出游戏
        {
            Log.e(" PlayScore 为空 ")
            return
        }
        score_text.visible =true
        let bg_load =  one_gc.getChild("bgicon").asLoader
        if (score >= 0 ) 
        {
            bg_load.icon =fgui.UIPackage.getItemURL(Config.BUNDLE_GameCOMMON,"jiesuansheng_di")
            score_text.font=fgui.UIPackage.getItemURL(Config.BUNDLE_GameCOMMON,"winScoreFont");

            if (isfdPc) 
            {
                score_text.text =  "+"+Manager.utils.formatCoinLoseWin( score )+"(封顶)" ;
            }
            else
            {
                score_text.text =  "+"+Manager.utils.formatCoinLoseWin( score ) ;
            }
        }
        else
        {
            if (bUseJinZhongZhao) 
            {
                two_gc.getChild("bgicon").asLoader.icon =fgui.UIPackage.getItemURL(Config.BUNDLE_GameCOMMON,"jiesuanfu_di")
                two_gc.getChild("addScoreText").asTextField.font=fgui.UIPackage.getItemURL(Config.BUNDLE_GameCOMMON,"loseScoreFont");
                two_gc.getChild("addScoreText").asTextField.text =  "-0(无敌)"
            }
            bg_load.icon =fgui.UIPackage.getItemURL(Config.BUNDLE_GameCOMMON,"jiesuanfu_di")
            score_text.font=fgui.UIPackage.getItemURL(Config.BUNDLE_GameCOMMON,"loseScoreFont");
            if (isfdPc) 
            {
                score_text.text =  Manager.utils.formatCoinLoseWin( score )+"(破产)"
            }
            else
            {
                if (bUseJinZhongZhao) 
                {
                    score_text.text =  Manager.utils.formatCoinLoseWin( score ) +"(系统)" ;
                }
                else
                {
                    score_text.text =  Manager.utils.formatCoinLoseWin( score ) ;
                }
            }
        }
        let timerItem2=  window.setTimeout(()=>{
            this.SetActiveChangeScore(false);
        } ,  1000 );
        this.m_TimerArr.push(timerItem2)

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


    public Reset()
    {
        this.SetActiveZhuang(false)
        this.SetActiveSe(false);
        this.SetActiveChaText(false);
        this.SetActiveRecharge(false);
        this.SetActiveHuJiaoZhuanYi(false);
        this.SetActiveHuCountEff(false);
        this.SetActiveStartLoad(false)
        this.SetActiveChangeScore(false);
        this.SetActiveHongZhongCount(false);
        this.SetActiveMianSiCount(false);
        this.SetActiveMianSi(false);
        this.SetActiveJinzhongzhao_3d(false);
        this.SetActivestartIcon_load(false)
        this.SetActivefire_3d(false)
        // this.SetActivePoFeng_3d(false)
        this.SetActivehead_3dLoad(false)
        this.SetActiveFuChou_3d(false)
        this.SetHZCount(0)
        
    }





}
