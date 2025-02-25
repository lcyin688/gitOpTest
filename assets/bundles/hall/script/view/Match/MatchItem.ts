import { RaceType } from "../../../../../scripts/def/GameEnums";




export default class MatchItem 
{


    private root : fgui.GComponent = null;
    private contr :fgui.Controller=null;
               


    public constructor(root : fgui.GComponent) {

        this.root =root;
        this.contr=this.root.asCom.getController("c1");
    }


    SetData(data: pb.IRaceShowItem) 
    {
        // 预约赛 常规赛是 线下比赛

        let itemGc:fgui.GComponent=null;
        if (data.raceType == RaceType.RaceType_Appointment) //常规赛 
        {
            this.contr.selectedIndex = 0
            itemGc = this.root.getChild("item0").asCom;
            itemGc.getChild("icon").icon = data.rewardUrl;
            itemGc.getChild("t0").text = data.name;
            itemGc.getChild("t1").visible= data.showEnrollNum;
            itemGc.getChild("n19").visible= data.showEnrollNum;
            if (data.showEnrollNum) {
                itemGc.getChild("t1").text = data.enrollPlayerNum.toString() ;
            }


            if (this.isShowTime(data.playTime)) //开打前一个小时显示 时间 一个小时以内 显示倒计时
            {
                itemGc.getChild("t2").text = data.playTime.toString() ;
            } else {
                
            }



            itemGc.getChild("t3").text = data.address ;


            
        } else {
            
        }

    }

    private isShowTime( timeMini:number )
    {
      let timeShengyu =  this.getDaoJiShi(timeMini);

        return timeShengyu>= (60*60) ;

    }


    private getDaoJiShi( timeMini:number ):number
    {

        return 0;
    }



}

