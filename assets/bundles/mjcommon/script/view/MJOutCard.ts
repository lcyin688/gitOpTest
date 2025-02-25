
import { Config } from "../../../../scripts/common/config/Config";
import { LoggerImpl } from "../../../../scripts/framework/core/log/Logger";
import { Tool } from "../../../gamecommon/script/tools/Tool";
import { CommonMJConfig } from "../Config/CommonMJConfig";
import { MJTool } from "../logic/MJTool";
import MJNormalCard from "./MJNormalCard";



export default class MJOutCard 
{

    public root : fgui.GComponent = null;

    mJNormalCard:MJNormalCard=null
    zhishideng_obj :fgui.GObject=null
    mask_ogloader: fgui.GLoader = null;
    bgicon_gloder:fgui.GLoader=null;
    
    eff_load3d:fgui.GLoader3D =null
    sd_load3d:fgui.GLoader3D =null

    // hand_com:fgui.GComponent =null
    // hand_load3d:fgui.GLoader3D =null

    m_uCardID: number;
    m_TimerArr:number[]=[];

    public constructor(root : fgui.GComponent) {
        this.root =root;
        this.setInit()
    }



    setInit()
    {
        this.root.visible =true
        this.mJNormalCard = new MJNormalCard(this.root.getChild("card").asButton);
        this.zhishideng_obj=  this.root.getChild("card").asButton.getChild("zhishideng")

        this.sd_load3d = <fgui.GLoader3D>this.root.getChild("card").asButton.getChild("sd");
        this.eff_load3d = <fgui.GLoader3D>this.root.getChild("card").asButton.getChild("eff");

        // this.root.getChild("hand").asCom.visible=false
        // this.hand_com =this.root.getChild("hand").asCom;
        // this.hand_load3d = <fgui.GLoader3D> this.hand_com.getChild("n0")

        if (this.root.getChild("card").asButton.getChild("mask") ) 
        {
            this.mask_ogloader = this.root.getChild("card").asButton.getChild("mask").asLoader;
        }
        if (this.root.getChild("card").asButton.getChild("bgicon")) 
        {
            this.bgicon_gloder = this.root.getChild("card").asButton.getChild("bgicon").asLoader;
        }


        // this.hand_com.sortingOrder = this.hand_com.sortingOrder+99
        this.SetActiveSD(false)    
        this.SetActivezhishideng(false)
    }

    BaseSetCard(mjId:number,isChonglian:boolean)
    {
        this.m_uCardID = mjId
        this.mJNormalCard.BaseSetCard(mjId);
        if (CommonMJConfig.MjRoomRule.isHongZhongGang && mjId==35) //10和16红中的时候红中算杠
        {
            this.mJNormalCard.SetActiveGang(true);
        }
        //关掉指示灯
        if (isChonglian) 
        {
            // Log.e("  关掉指示灯 ")
            this.SetActivezhishideng(false)
            // this.SetActiveHand(false)
            this.SetActiveEff(false)
        }
    }

    SetActiveGang(isShow:boolean)
    {
        this.mJNormalCard.SetActiveGang(isShow);
    }
    //遮罩显示GetObj
    SetActiveMask(isShow: boolean) 
    {
        if (this.mask_ogloader!=null) 
        {
            this.mask_ogloader.visible =isShow;
        }
        // this.root.grayed= isShow;
    }

    // SetActiveHand(isShow:boolean)
    // {
    //     this.hand_load3d.visible=isShow;
    // }

    SetActiveCard(isShow:boolean)
    {
        this.mJNormalCard.SetActiveCard(isShow);
    }

    SetActiveSD(isShow:boolean)
    {
        if (this.sd_load3d!=null) {
            this.sd_load3d.visible = isShow
        }

    }

    SetActiveEff(isShow:boolean)
    {
        if (this.eff_load3d!=null) {
            this.eff_load3d.visible = isShow 
        }

    }
    
    GetCardId():number
    {
        return this.m_uCardID
    }

    SetActivezhishideng(isShow:boolean)
    {
        // Log.w("SetActivezhishideng  :isShow  ",isShow)
        this.zhishideng_obj.visible =isShow;
    }

    GetObj():fgui.GObject
    {
        return this.root
    }
    
    /** 播放打出的牌的 扩散光圈 */
    PlayKsGuang(direction:number) 
    {
        let name = "ks"+(direction+1)
        Manager.utils.PlaySpine(this.eff_load3d,"mjsp_tyks",name,Config.BUNDLE_MJCOMMON,()=>{
            this.SetActiveEff(false)
        })
        this.SetActiveSD(false)
        this.SetActivezhishideng(true)
        
    }








    /** 播放打出的牌的 扩散光圈 */
    PlayDianPaoSD() 
    {
        this.SetActiveSD(true)
        MJTool.PlaySound(CommonMJConfig.SoundEffPath.EffDianPaoShanDian,Config.BUNDLE_MJCOMMON);
        let timerItem2=  window.setTimeout(()=>{
            this.SetActiveSD(false)
        } ,  500 );
        this.m_TimerArr.push(timerItem2)

    }

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



}



