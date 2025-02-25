import { RollingNoticeType } from "../../../../scripts/def/GameEnums";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";



export default class PaoMaDengView  {
    protected root : fgui.GComponent=null
    private list:fgui.GList=null;    

    private curDatas:MyRollingNotice[]=[];
    // private curDatas:pb.IRollingNotice[]=[];

    private curOnPlaying=false
    private curIndex =0
    protected one_com : fgui.GComponent=null
    protected two_com : fgui.GComponent=null
    m_TimerArr:number[]=[];
    
    public constructor(root : fgui.GComponent) {
        this.root =root
        this.setInit();
    }

    public setInit() {
        this.root.visible=false;
        this.list = this.root.getChild("list").asList;
        // this.list.removeChildrenToPool();
        this.one_com = this.list.getChildAt(0).asCom;
        this.two_com = this.list.getChildAt(1).asCom;
        Manager.dispatcher.add(ProtoDef.pb.S2CRollingNotice, this.OnS2CRollingNotice,this);
    }


    RemoveEvent() {
    /** 移除事件 */
        Manager.dispatcher.remove(ProtoDef.pb.S2CRollingNotice, this);
        this.StopCoroutineTweenAni()
    }

    OnS2CRollingNotice()
    {
        this.curDatas=[]
        this.StopCoroutineTweenAni()
        let data = Manager.gd.get<pb.S2CRollingNotice>(ProtoDef.pb.S2CRollingNotice);
        // Log.e(" OnS2CRollingNotice  data: ",data)
        let nowTime:number = Manager.utils.seconds;
        for (let i = 0; i < data.items.length; i++) 
        {

            let v =data.items[i]
            if (v.opentime==0|| (nowTime>= v.opentime && nowTime< v.endtime    ) ) 
            {
                let cardItem = new MyRollingNotice();
                cardItem.cd=v.cd
                cardItem.endtime=v.endtime
                cardItem.id=v.id
                cardItem.opentime=v.opentime
                cardItem.state=v.state
                cardItem.text=v.text
                cardItem.type=v.type
                cardItem.lastPlayTime=0
                this.curDatas.push(cardItem)
            }
        }
        this.ReFlashPlaying()
    }

    ReFlashPlaying()
    {
        if (this.curDatas!=null&& this.curDatas!=[]&& !this.curOnPlaying && this.curDatas.length>0 ) 
        {
            this.PlayNotice()
            this.root.visible = true
        }
    }


    PlayNotice()
    {
        // Log.e(" PlayNotice   this.curDatas  ",this.curDatas)
        let nowTime:number = Manager.utils.seconds;
        let canUseDatas:MyRollingNotice[]=[];
        for (let i = 0; i < this.curDatas.length; i++) 
        {
            let v =this.curDatas[i]
            if (v.opentime==0|| (nowTime>= v.opentime && nowTime< v.endtime    ) ) 
            {
                // Log.e(" PlayNotice   v.cd ,v.lastPlayTime+v.cd ",v.cd ,v.lastPlayTime+v.cd )
                // Log.e(" PlayNotice   nowTime ",nowTime )

                if (nowTime- v.lastPlayTime-v.cd >0   ) //CD 已经过了
                // if (v.lastPlayTime+100 <=  nowTime ) //CD 已经过了
                {
                    let cardItem = new MyRollingNotice();
                    cardItem.cd=v.cd
                    cardItem.endtime=v.endtime
                    cardItem.id=v.id
                    cardItem.opentime=v.opentime
                    cardItem.state=v.state
                    cardItem.text=v.text
                    cardItem.type=v.type
                    cardItem.lastPlayTime=0
                    canUseDatas.push(cardItem)
                    
                }
            }
        }


        if (canUseDatas.length==0) {
            this.root.visible=false;
            let timerItem=  window.setTimeout(()=>{
                this.PlayNotice()
            } , 10000);
            this.m_TimerArr.push(timerItem)
            return;
        }
        //在起始时间和结束时间之间的在播放 滚动公告
        this.root.visible=true;
        if (this.curIndex> canUseDatas.length-1) {
            this.curIndex =0
        }
        let dataItem1 = canUseDatas[this.curIndex]


        this.removeS2CRollingNotice(dataItem1)


        this.curIndex = this.curIndex +1

        for (let i = 0; i < this.curDatas.length; i++) 
        {
            let v =this.curDatas[i]
            if (v.id== dataItem1.id  ) 
            {
                v.lastPlayTime =nowTime;
            }
        }
        this.curOnPlaying =true;
        //游戏里边的和没得起始时间的 是只播一次 其他是循环滚动 
        if (dataItem1.type == RollingNoticeType.RNT_Game || dataItem1.opentime==0 ) 
        {
            this.curDatas.splice(this.curIndex,1)
        }
        this.one_com.setPosition(700,this.one_com.y)//解决闪一下
        this.one_com.getChild("des").text =dataItem1.text
        fgui.GTween.to2(700, this.one_com.y, 0-this.one_com.getChild("des").width, this.one_com.y, 10)
        .setTarget(this.one_com, this.one_com.setPosition)
        .setEase(fgui.EaseType.Linear)
        .onComplete(()=>
        {
            // Log.e(" PlayNotice   yes ing  ")
            this.PlayNotice()
        },this)


    }


    removeS2CRollingNotice(data: MyRollingNotice)
    {
        if (data.opentime == 0) //播一次就移除
        {
            let dataOld = Manager.gd.get<pb.S2CRollingNotice>(ProtoDef.pb.S2CRollingNotice);
            if (dataOld!=null&& dataOld.items!=null && dataOld.items.length!=0) //已经有过数据了
            {
                for (let i = 0; i < dataOld.items.length; i++) 
                {
                    if (dataOld.items[i].id== data.id) 
                    {
                        dataOld.items.splice(i,1)
                        Manager.gd.put(ProtoDef.pb.S2CRollingNotice,dataOld);
                        return;
                    }
                }
            }
        }
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


class  MyRollingNotice
{
	id:number = 1;
	text:string = "";//公告文字
	cd :number= 1;//cd时间
	opentime:number = 0;
	endtime:number = 1;
	type:RollingNoticeType = 1;//公告类型
	state:number = 0;// 0.open-end time 1 常开 2 常关
	lastPlayTime:number = 0;// 0.open-end time 1 常开 2 常关
}