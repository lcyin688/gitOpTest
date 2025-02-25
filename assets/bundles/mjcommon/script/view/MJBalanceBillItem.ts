import { Config } from "../../../../scripts/common/config/Config";
import { MahHu, MahScoreReason } from "../../../../scripts/def/GameEnums";
import { LoggerImpl } from "../../../../scripts/framework/core/log/Logger";
import { Tool } from "../../../gamecommon/script/tools/Tool";
import { CommonMJConfig } from "../Config/CommonMJConfig";
import { MJTool } from "../logic/MJTool";



export default class MJBalanceBillItem  {

    private root : fgui.GComponent = null;
    // bgobj  :fgui.GObject;
    flag_load  :fgui.GLoader;

    
    zuoweiText :fgui.GObject;
    scoreText :fgui.GObject;
    beinumText :fgui.GObject;
    desText   :fgui.GObject;
    moreBtn :fgui.GButton;
    morebg :fgui.GObject;
    moreBg01 :fgui.GObject;
    morebg1 :fgui.GObject;
    

    moreDesText :fgui.GObject;
    // moreNumBtn :fgui.GButton;
    // moreNumbg :fgui.GObject;
    // moreNumtext :fgui.GObject;

    desStr :string;


    
    //点杠补杠是刮风 暗杠是下雨

    HuDes=
    {
        [MahScoreReason.SR_UnDefine]:"",
        [MahScoreReason.SR_Hu]:"胡",
        [MahScoreReason.SR_DianGang]:"刮风",
        [MahScoreReason.SR_BuGang]:"刮风",
        [MahScoreReason.SR_AnGang]:"下雨",
        [MahScoreReason.SR_HuJiaoZhuanYi]:"呼叫转移",
        [MahScoreReason.SR_DaJiao]:"查大叫",
        [MahScoreReason.SR_HuaZhu]:"查花猪",
        [MahScoreReason.SR_TuiSui]:"退税",

    }


    public constructor(root : fgui.GComponent) 
    {
        this.root =root;
        this.setInit();
    }



    setInit()
    {
        // this.bgobj =  this.root.getChild("n3");
        this.flag_load =  this.root.getChild("flag").asLoader;

        
        this.zuoweiText =  this.root.getChild("zuowei");
        this.scoreText =  this.root.getChild("scoreText");
        this.desText =  this.root.getChild("des");
        this.moreDesText =  this.root.getChild("moreDes");
        this.beinumText =  this.root.getChild("beiNum");

        this.moreBtn =  this.root.getChild("moreDesBtn").asButton;
        this.morebg =  this.root.getChild("moreBg");
        this.moreBg01 =  this.root.getChild("moreBg01");
        this.morebg1 =  this.root.getChild("bg1moredes");


        // this.moreNumBtn =  this.root.getChild("moreNumBtn").asButton;
        // this.moreNumbg =  this.root.getChild("moreNumbg");
        // this.moreNumtext =  this.root.getChild("moreNumtext");
        



        this.BindEvent();
        this.SetActiveItem(true);
        this.SetActiveMore(false);
        this.SetActiveMoreBtn(false);
        this.SetActiveMoreNumBtn(false)
        this.SetActiveMoreNumDes(false)
    }

    GetIsShowFlag(isPofeng:boolean,isFengDing:boolean):{isShow:boolean,url:string}
    {
        let isShowTag =false;
        let urlStr="";
        if (isPofeng||isFengDing) {
            isShowTag =true;
        }
        if (isPofeng) {
            urlStr = fgui.UIPackage.getItemURL(Config.BUNDLE_GameCOMMON,"icon_pofeng")
        } 
        else if (isFengDing){
            urlStr = fgui.UIPackage.getItemURL(Config.BUNDLE_GameCOMMON,"icon_fengding")
        }
        return {isShow:isShowTag,url:urlStr}
    }

    setData(index:number , data: pb.IMahLiuShui) 
    {
        this.flag_load.visible =this.GetIsShowFlag(data.bPoFeng,data.bMaxMultiple).isShow;
        this.flag_load.icon =this.GetIsShowFlag(data.bPoFeng,data.bMaxMultiple).url;
        
        let scoreDes= Manager.utils.formatCoin(data.coin) ;
        this.zuoweiText.text =this.GetZuoWeiDes(data)
        
        if (data.coin >= 0 ) 
        {
            this.scoreText.text= String.format("[color=##FC703A]{0}[/color]",scoreDes );
        } 
        else 
        {
            this.scoreText.text=String.format("[color=##0284DF]{0}[/color]",scoreDes );
        }
        this.beinumText.text = Tool.GetMultiple(data.multiple,2)+(CommonMJConfig.ISBei ?"倍":"番") ;
        this.SetActiveMoreBtn(this.IsShowDetBtn(data) );
        if (data.hus.length> 0 ) 
        {
            let desArr = this.GetParticularsDes(data.hus,data.AAAA,data.coin);
            this.desText.text = desArr[0]
            // this.moreDesText.text = desArr[1]
            this.desStr=desArr[1]
        } 
        else 
        {
            this.desText.text = this.HuDes[data.reason]
        }
        //生成的时候就自适应好详情宽度



    
    }
    GetParticularsDes(datahus: number[], AAAA: number,score:number):string[] 
    {
        let arrStrArr :string[]=[];
        let strone=""
        let strtwo=""
        let dataArr :number[]=[]
        for (let i = 0; i < datahus.length; i++) 
        {
            if (datahus[i] == MahHu.Hu_PingHu || datahus[i] == MahHu.Hu_ZiMo ) 
            {
                if (datahus[i] == MahHu.Hu_PingHu) 
                {
                    strone="吃胡"
                    if (score < 0 ) 
                    {
                        strone="点炮"
                    }
                }
                else if (datahus[i] == MahHu.Hu_ZiMo)
                {
                    strone="自摸"
                    if (score < 0 ) 
                    {
                        strone="被自摸"
                    }
                }
            }
            else
            {
                dataArr.push(datahus[i])
            }
            
        }

        MJTool.SortHuPaiType(dataArr)
        for (let i = 0; i < dataArr.length; i++) 
        {
            if ( i==0 ) 
            {
                strtwo = CommonMJConfig.MJ_HPType[dataArr[i]]
                strone =strone+"(" +CommonMJConfig.MJ_HPType[dataArr[i]]
                
            } 
            else 
            {
                if ( i==1 ) 
                {
                    strone = strone+"、"+CommonMJConfig.MJ_HPType[dataArr[i]] 
                }
                strtwo = strtwo+"、"+CommonMJConfig.MJ_HPType[dataArr[i]] 
            }
        }

        if (AAAA >0 ) 
        {
            strtwo = strtwo+"、根*"+AAAA; 
            if (dataArr.length < 2 ) 
            {
                if (dataArr.length < 1) {
                    strone = strone+"(根*"+AAAA;
                }
                else
                {
                    strone = strone+"、根*"+AAAA;
                } 
            } 
        }
        if (dataArr.length==0 && AAAA ==0 ) //啥也没有强行给个平胡
        {
            strone =strone+"(平胡"
        }
        strone =strone+")"
        // Log.e(" GetParticularsDes  strone  ",strone);
        // Log.e(" GetParticularsDes  strtwo  ",strtwo);
        arrStrArr.push(strone)
        arrStrArr.push(strtwo)
        return arrStrArr;
    }
    IsShowDetBtn(data: pb.IMahLiuShui): boolean 
    {
        if (data.hus.length > 2 ) 
        {
            return true
        } 
        else 
        {
            if (data.AAAA > 0) 
            {
                return data.hus.length >1;
            }
        }
        return false;
    }
    GetZuoWeiDes(data: pb.IMahLiuShui): string 
    {
        let strDes = "下家";
        if (data.from.length == 1) 
        {
            let client_pos =MJTool.PositionToDirection(data.from[0])
            if ( client_pos == CommonMJConfig.Direction.Right) 
            {
                strDes ="下家"
            } 
            else if ( client_pos == CommonMJConfig.Direction.Top) 
            {
                strDes ="对家"
            }
            else if ( client_pos == CommonMJConfig.Direction.Left) 
            {
                strDes ="上家"
            }
        } 
        else 
        {
            if (data.hus.length > 0  ) 
            {
                strDes = "自摸"
            } 
            else 
            {
                strDes = data.from.length+"家"
            }
        }
        return strDes;

    }

    GetMultiple(num:number):string
    {
        if (num < 100000 ) 
        {
            return String(num)
        } 
        else if (num >= 100000 && num < 100000000 ) 
        {
            return Tool.GetPreciseDecimal(num/10000,0)+"万"
        }
        else if (num >= 100000000  ) 
        {
            return Tool.GetPreciseDecimal(num/100000000,0)+"亿"
        }

    }



    BindEvent()
    {
        this.moreBtn.onClick(this.OnClickMoreBtn,this);
        this.root.getChild("di").onClick(this.OnClickDi,this);

    }

    Recle()
    {
        this.moreBtn.offClick(this.OnClickMoreBtn,this);
        this.root.getChild("di").offClick(this.OnClickDi,this);

    }

    OnClickMoreBtn() 
    {
        dispatch("MJBalanceBillHide")
        // this.SetActiveMore(true);
        //刷新 宽度
        dispatch("MJBalanceSetMoreDes",this.desStr,this.moreBtn)
    }

    OnClickDi() 
    {
        dispatch("MJBalanceBillHide")
    }
   



    SetActiveItem(isShow:boolean)
    {
        this.root.visible=isShow;
        
    }

    SetActiveMore(isShow:boolean)
    {
        this.morebg.visible=isShow;
        this.moreDesText.visible=isShow;
        this.moreBg01.visible=isShow;
    }

    SetActiveMoreBtn(isShow:boolean)
    {
        this.moreBtn.visible=isShow;
    }
    
    SetActiveMoreNumBtn(isShow:boolean)
    {
        // this.moreNumBtn.visible=isShow;
    }

    SetActiveMoreNumDes(isShow:boolean)
    {
        // this.moreNumbg.visible=isShow;
        // this.moreNumtext.visible=isShow;
    }






}


