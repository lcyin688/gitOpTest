import { Config } from "../../../../scripts/common/config/Config";
import { MahHu, MahScoreReason } from "../../../../scripts/def/GameEnums";
import { Tool } from "../../../gamecommon/script/tools/Tool";
import { CommonMJConfig } from "../Config/CommonMJConfig";
import { MJTool } from "../logic/MJTool";



export default class MJLiuShuiItem  {

    private root : fgui.GComponent = null;
    flag_load:fgui.GLoader;
    zuoweiText :fgui.GObject;
    scoreText :fgui.GObject;
    beinumText :fgui.GObject;
    desText   :fgui.GObject;
    moreBtn :fgui.GButton;
    // morebg :fgui.GObject;
    // morebg1 :fgui.GObject;
    
    // moreDesText :fgui.GObject;
    moreNumBtn :fgui.GButton;
    // moreNumbg :fgui.GObject;
    // moreNumbg1 :fgui.GObject;
    // moreNumtext :fgui.GObject;

    desStr :string;

    iconload :fgui.GLoader;
    data: pb.IMahLiuShui
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
        this.flag_load =  this.root.getChild("flag").asLoader;
        
        this.zuoweiText =  this.root.getChild("zuowei");
        this.scoreText =  this.root.getChild("score");
        this.beinumText =  this.root.getChild("beinum");
        this.desText =  this.root.getChild("des");
        this.moreBtn =  this.root.getChild("showMoreBtn").asButton;
        // this.morebg =  this.root.getChild("bgmoredes");
        // this.morebg1 =  this.root.getChild("bg1moredes");
        
        // this.moreDesText =  this.root.getChild("moredes");
        this.iconload =  this.root.getChild("icon").asLoader;

        this.moreNumBtn =  this.root.getChild("moreNumBtn").asButton;
        // this.moreNumbg =  this.root.getChild("bgmorenum");
        // this.moreNumbg1 =  this.root.getChild("bg1morenum");
        // this.moreNumtext =  this.root.getChild("moreNumtext");
        

        this.BindEvent();
        this.SetActiveItem(true);
        // this.SetActiveMore(false);
        this.SetActiveMoreBtn(false);
        this.SetActiveMoreNumBtn(false)
        // this.SetActiveMoreNumDes(false)
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
        this.data =data
        this.flag_load.visible =this.GetIsShowFlag(data.bPoFeng,data.bMaxMultiple).isShow;
        this.flag_load.icon =this.GetIsShowFlag(data.bPoFeng,data.bMaxMultiple).url;
        // this.bgobj.visible== (index%2 == 0);
        let scoreDes= Manager.utils.formatCoin(data.coin) ;
        this.scoreText.text= scoreDes
        if (data.coin >= 0 ) 
        {
            this.scoreText.asTextField.color=cc.color(241,130,0)
        } 
        else 
        {
            this.scoreText.asTextField.color=cc.color(67,158,1)
            // this.scoreText.text=String.format("[color=##439E01]{0}[/color]",scoreDes );
        }


        this.beinumText.text = Tool.GetMultiple(data.multiple,2)+(CommonMJConfig.ISBei ?"倍":"番") ;
        this.zuoweiText.text =this.GetZuoWeiDes(data)
        this.SetActiveMoreBtn(data.multiple >= 10000 );
        // this.moreNumtext.text = data.multiple+(CommonMJConfig.ISBei ?"倍":"番") ;

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

            if (dataArr.length < 1 ) 
            {
                strone = strone+"（根*"+AAAA; 
                strtwo = strtwo+"(根*"+AAAA; 
            } 
            else
            {
                strtwo = strtwo+"、根*"+AAAA; 
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

        let strDes = "上家";
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





    BindEvent()
    {
        this.moreBtn.onClick(this.OnClickMoreBtn,this);
        this.root.getChild("di").onClick(()=>{
            dispatch("MJLiuShuiHide")
        },this);

        this.root.getChild("fanXingBtn").onClick(this.OnClickFanXingBtn,this);
    }

    Recle()
    {
        this.moreBtn.offClick(this.OnClickMoreBtn,this);
        this.root.getChild("fanXingBtn").offClick(this.OnClickFanXingBtn,this);
    }

    OnClickMoreBtn() 
    {
        dispatch("MJLiuShuiHide")
        // this.SetActiveMore(true);
        dispatch("MJLiuShuiSetMoreDes",this.desStr,this.moreBtn)
        
    }


    OnClickFanXingBtn() 
    {
        Log.w("OnClickFanXingBtn   this.data.hus :  ",this.data.hus)
        dispatch("MJSetFanXingInit",this.data.hus)
    }

   
    SetActiveItem(isShow:boolean)
    {
        this.root.visible=isShow;
        
    }

    // SetActiveMore(isShow:boolean)
    // {
    //     this.morebg.visible=isShow;
    //     this.morebg1.visible=isShow;
    //     this.moreDesText.visible=isShow;
    // }

    SetActiveMoreBtn(isShow:boolean)
    {
        this.moreBtn.visible=isShow;
    }
    
    SetActiveMoreNumBtn(isShow:boolean)
    {
        this.moreNumBtn.visible=isShow;
    }

    // SetActiveMoreNumDes(isShow:boolean)
    // {
    //     this.moreNumbg.visible=isShow;
    //     this.moreNumbg1.visible=isShow;
    //     this.moreNumtext.visible=isShow;
    // }






}


