import { Config } from "../../../../scripts/common/config/Config";
import FLevel2UI from "../../../../scripts/common/fairyui/FLevel2UI";
import { Resource } from "../../../../scripts/framework/core/asset/Resource";
import { RoomManager } from "../../../gamecommon/script/manager/RoomManager";
import { CommonMJConfig } from "../Config/CommonMJConfig";
import { MJEvent } from "../Event/MJEvent";
import { MJTool } from "../logic/MJTool";
import MJHeadPlayer from "./MJHeadPlayer";



export default class MJHeadPlayers extends FLevel2UI {





    protected selfGc: fgui.GComponent = null;
    private gameName_text: fgui.GObject = null;


    PlayersHeadTable:Array<MJHeadPlayer>=[];
    m_TimerArr:number[]=[];
    private m_GObjectPool: fgui.GObjectPool=null;

    private eftIndex:number = 0;
    private cardObjSet:any = {};
    private xgSet:any = {};

    public setInit() {
        this.show();
        this.addEvents();
        this.m_GObjectPool =new fgui.GObjectPool();

        for(let i = 0;i< 4;i++) 
        {
            // Log.e( " MJHeadPlayers  setInit i    : "+i  );
            let itemobj : fgui.GObject = this.root.getChild("player"+i)
            let item = new MJHeadPlayer(itemobj.asCom);
            item.setInit();

            this.PlayersHeadTable.push(item);
            // this.PlayersHeadTable.splice(i,0,item);
        }
        // this.DoOnePlayerGoldAni(2,0,10)
        cc.director.getScheduler().scheduleUpdate(this,0,false);
    }


    public addEvents(): void 
    {
        Manager.dispatcher.add(MJEvent.PIAOGOLDANI, this.DoPlayGoldAnim, this);
    }

    /** 移除事件 */
    RemoveEvent() {
        Manager.dispatcher.remove(MJEvent.PIAOGOLDANI, this);
        cc.director.getScheduler().unscheduleUpdate(this);
    }

    SetActiveHideAllhead_3dLoad() 
    {
        for (let index = 0; index < this.PlayersHeadTable.length; index++) 
        {
            this.PlayersHeadTable[index].SetActivehead_3dLoad(false);
        }

    }
    

    SetActivehead_3dLoad(direct: number) 
    {
        this.SetActiveHideAllhead_3dLoad();
        this.PlayersHeadTable[direct].SetActivehead_3dLoad(true);
    }


    /** 定缺花色 */
    PlaySeAni(direct: number, color: number) 
    {
        // Log.e(" PlaySeAni direct   : ",direct);
        // Log.e(" PlaySeAni color   : ",color);

        this.PlayersHeadTable[direct].PlaySeAni(color);
    }




    SetSe(direct: number, color: number) 
    {
        this.PlayersHeadTable[direct].SetSe(color);
    }


    /** 飘金币的动画 */
    DoPlayGoldAnim( data :pb.IId2Val[]) 
    {
        if (data.length != 0 ) 
        {
            for (let i = 0; i < data.length; i++) 
            {
                //只有自己赢得时候才飘金币
                let clienttoPos = MJTool.PositionToDirection(data[i].value)
                if (clienttoPos == CommonMJConfig.Direction.Bottom) {
                    MJTool.PlaySound(CommonMJConfig.SoundEffPath.FlyGold,Config.BUNDLE_MJCOMMON);
                    this.DoOnePlayerGoldAni(data[i].key,data[i].value,10)
                }
            }
        }
    }
    /** 飘金币的动画 */
    DoOnePlayerGoldAni(fromPos: number, toPos: any, count: number) 
    {
        this.m_GObjectPool.clear();
        let clientfromPos = MJTool.PositionToDirection(fromPos)
        // Log.w("  DoOnePlayerGoldAni  clientfromPos  ",clientfromPos)
        let fromCom = this.PlayersHeadTable[clientfromPos].GetHeadCom()
        // Log.w("  DoOnePlayerGoldAni  fromCom  ",fromCom)
        let rectFrom = fromCom.localToGlobalRect(0, 0, fromCom.width, fromCom.height);
        rectFrom = this.root.globalToLocalRect(rectFrom.x, rectFrom.y, rectFrom.width, rectFrom.height);
        let clienttoPos = MJTool.PositionToDirection(toPos)
        // Log.w("  DoOnePlayerGoldAni  clienttoPos  ",clienttoPos)
        let toCom = this.PlayersHeadTable[clienttoPos].GetHeadCom()
        // Log.w("  DoOnePlayerGoldAni  toCom  ",toCom)
        let rectTo = toCom.localToGlobalRect(0, 0, toCom.width, toCom.height);
        rectTo = this.root.globalToLocalRect(rectTo.x, rectTo.y, rectTo.width, rectTo.height);

        let fromVect = new cc.Vec2();
        fromVect.x =rectFrom.x;
        fromVect.y =rectFrom.y;
        // let points= this.getCirclePoints(60,fromVect,count);
        let scTime = 0.3;
        for (let i = 0; i < count; i++) 
        {
            // let timerItem = window.setTimeout(()=>{
                let url = fgui.UIPackage.getItemURL(Config.BUNDLE_GameCOMMON, CommonMJConfig.PiaoGoldPath);
                let cardObj = this.m_GObjectPool.getObject(url);
                cardObj.data = {};
                cardObj.data.id = this.eftIndex;
                this.cardObjSet[cardObj.data.id] = cardObj;
                this.eftIndex++;
                this.root.addChild(cardObj);
        
                fgui.GTween.to2(0.2, 0.2, 1, 1, scTime)
                .setTarget(cardObj, cardObj.setScale)
                .setEase(fgui.EaseType.CubicOut).onComplete(() => {
                //缩放完成
                }, this);

                // cardObj.asCom.getChild("n3").visible=((Math.random()*2) >1 ) 
                // cardObj.visible =true;
                cardObj.data.i = i;
                cardObj.data.rectTo = rectTo;
                fgui.GTween.to2(fromVect.x, fromVect.y, Manager.utils.rand(-60,60)+fromVect.x,fromVect.y + Manager.utils.rand(-60,60),scTime)
                .setTarget(cardObj, cardObj.setPosition)
                .setEase(fgui.EaseType.QuadIn)
                .onComplete(this.moveComplete,this);
            // } , 50*i);


        }

        // for (let i = 0; i < count; i++) 
        // {
        //     let timerItem=  window.setTimeout(()=>{
        //         this.DoOnePlayerGoldAniItem(rectFrom,toPos);
        //     } , 50*i);
        //     this.m_TimerArr.push(timerItem)
        // }
    }

    moveComplete(gt:fgui.GTweener){
        let cardObj = gt.target;
        fgui.GTween.delayedCall(0.025*cardObj.data.i).setTarget(cardObj).onComplete(function(){
            let i = cardObj.data.i;
            let rectTo = cardObj.data.rectTo;


            Manager.assetManager.load(Config.BUNDLE_GameCOMMON,"prefab/prefab_xg",cc.Prefab,null,function(data: Resource.CacheData){
                if(data.data != null){
                    let diffX = fgui.GRoot.inst.width / 2;
                    let diffY = fgui.GRoot.inst.height / 2;
                    let prefab = cc.instantiate(data.data as cc.Prefab)
                    this.root.node.addChild(prefab,1); 
                    cardObj.data.xg = prefab;
                    prefab.userData = cardObj.data.id;
                    this.xgSet[prefab.userData] = prefab;
                    prefab.setPosition(cardObj.node.x - diffX + cardObj.width / 2,cardObj.node.y+diffY - cardObj.height / 2);
                    this.resetPs(prefab);
                }else{
                    Log.d("=====","加载失败");
                }
            }.bind(this));

            
            let runTime = 0.7;

            fgui.GTween.to2(cardObj.x, cardObj.y, rectTo.x, rectTo.y, runTime)
            .setTarget(cardObj, cardObj.setPosition)
            .setEase(fgui.EaseType.QuadIn)
            .onComplete(this.moveFinish,this);


            fgui.GTween.delayedCall(0.5).setTarget(cardObj).onComplete(function(){
                fgui.GTween.to2(cardObj.scaleX, cardObj.scaleY, 0.2, 0.2, 0.2)
                .setTarget(cardObj, cardObj.setScale)
                .setEase(fgui.EaseType.QuadIn);
            },this);
        },this);


    }


    moveFinish(gt:fgui.GTweener){
        let cardObj = gt.target;
        if(cardObj.data != null && cardObj.data.id != null){
            let xg = this.xgSet[cardObj.data.id];
            if(xg != null){
                xg.removeFromParent(true);
            }
            this.xgSet[cardObj.data.id] = null;
            this.cardObjSet[cardObj.data.id] = null;
        }
        cardObj.visible = false;
        // cardObj.parent.node.removeChild(cardObj.node);
        this.m_GObjectPool.returnObject(cardObj);
    }

    update(dt ){
        let diffX = fgui.GRoot.inst.width / 2;
        let diffY = fgui.GRoot.inst.height / 2;
        for (const [key, val] of Object.entries(this.cardObjSet)) {
            if(val != null){
                let xg = this.xgSet[Number(key)];
                if(xg != null){
                    let obj = val as fgui.GObject;
                    if (obj == null || obj.node == null){
                        this.cardObjSet[key] == null;
                        continue;
                    }
                    let pos = obj.node.getPosition();
                    xg.setPosition(pos.x - diffX + obj.width / 2,pos.y + diffY - obj.height / 2);
                }
            }
        }
    }

    private resetPs(node:cc.Node){
        let ps = node.getComponent(cc.ParticleSystem);
        if(ps == null){
            Log.e("resetPs err");
            return;
        }
        ps.resetSystem();
    }

    /**
     * 以某点为圆心，生成圆周上等分点的坐标
     *
     * @param {number} r 半径
     * @param {cc.Vec2} pos 圆心坐标
     * @param {number} count 等分点数量
     * @param {number} [randomScope=80] 等分点的随机波动范围
     * @returns {cc.Vec2[]} 返回等分点坐标
     */
    getCirclePoints(r: number, pos: cc.Vec2, count: number, randomScope: number = 20): cc.Vec2[] {
        let points = [];
        let radians = (Math.PI / 180) * Math.round(360 / count);
        for (let i = 0; i < count; i++) {
          let x = pos.x + r * Math.sin(radians * i);
          let y = pos.y + r * Math.cos(radians * i);
          points.unshift(cc.v3(x + Math.random() * randomScope, y + Math.random() * randomScope, 0));
        }
        return points;
    }

    // /** 飘单个 金币的动画 */
    // DoOnePlayerGoldAniItem(rectFrom:cc.Rect , toPos: number) 
    // {
    //     //飘金币具体表现

    //     let clienttoPos = MJTool.PositionToDirection(toPos)

    //     let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_GameCOMMON, CommonMJConfig.PiaoGoldPath)
    //     let cardObj =   this.m_GObjectPool.getObject(url)
    //     this.root.addChild(cardObj)
    //     let com = cardObj.asCom;
    //     let ps = com.node.getComponent(cc.ParticleSystem);
    //     if(ps == null){
    //         ps = com.node.addComponent(cc.ParticleSystem);
    //     }
    //     Manager.assetManager.load(Config.BUNDLE_GameCOMMON,"xg",cc.ParticleAsset,null,function(data: Resource.CacheData){
    //         if(data.data != null){
    //             ps.file = data.data as cc.ParticleAsset;
    //             ps.custom = true;
    //         }else{
    //             Log.d("=====","加载失败");
    //         }
    //     }.bind(this))
    //     cardObj.visible =true;
        
    //     let toCom = this.PlayersHeadTable[clienttoPos].GetHeadCom()
    //     let rectTo = toCom.localToGlobalRect(0, 0, toCom.width, toCom.height);
    //     rectTo = this.root.globalToLocalRect(rectTo.x, rectTo.y, rectTo.width, rectTo.height);
    //     fgui.GTween.to2(rectFrom.x, rectFrom.y, rectTo.x, rectTo.y, 0.8 )
    //     .setTarget(cardObj, cardObj.setPosition)
    //     .setEase(fgui.EaseType.CircOut)
    //     .onComplete(()=>{
    //         cardObj.visible =false;
    //     },this);
    // }


    //** 展示胡了几次的 特效 */
    SHowHuCountEff(direct:number,count: number) 
    {
        this.PlayersHeadTable[direct].SHowHuCountEff(count);
    }


    SetActiveMianSi(direct:number,isShow: boolean) 
    {
        this.PlayersHeadTable[direct].SetActiveMianSi(isShow);
    }


    PlayScore(pos: number, value: number,isfdPc:boolean,bUseJinZhongZhao:boolean) 
    {
        // Log.w(" PlayScore    pos   :  ",pos)
        // Log.w(" PlayScore    RoomManager.ConvertLocalIndex(pos)   :  ", RoomManager.ConvertLocalIndex(pos))
        this.PlayersHeadTable[RoomManager.ConvertLocalIndex(pos)].PlayScore(value,isfdPc,bUseJinZhongZhao)
    }
    

    SetMianSiCount(direct:number,count: number) 
    {
        // Log.w(" SetMianSiCountEff   direct  ",direct)
        this.PlayersHeadTable[direct].SetMianSiCount(count);
    }


    SetHongZhongCount(direct:number,count: number) 
    {
        // Log.w(" SetHongZhongCountEff   direct  ",direct)
        this.PlayersHeadTable[direct].SetHongZhongCount(count);
    }

    SetHongZhongADDCount(direct:number) 
    {
        // Log.w(" SetHongZhongCountEff   direct  ",direct)
        this.PlayersHeadTable[direct].SetHongZhongADDCount();
    }


    

    SetActiveJinzhongzhao_3d(direct:number,isShow:boolean)
    {
        this.PlayersHeadTable[direct].SetActiveJinzhongzhao_3d(isShow);

    }

    //明牌玩家头上冒火
    SetActivefire_3d(direct:number,isShow:boolean)
    {
        this.PlayersHeadTable[direct].SetActivefire_3d(isShow);

    }

    // SetActiveZhuang() 
    // {
    //     for (let i = 0; i < this.PlayersHeadTable.length; i++) 
    //     {
    //         this.PlayersHeadTable[i].SetActiveZhuang( RoomManager.ConvertLocalIndex(RoomManager.zhuang) == i  )
    //     }
    // }

    //播放庄的动画
    PlayZhuangAni()
    {
        // Log.e("  PlayZhuangAni  RoomManager.zhuang ",RoomManager.zhuang )
        // Log.e("  PlayZhuangAni  RoomManager.ConvertLocalIndex(RoomManager.zhuang) ",RoomManager.ConvertLocalIndex(RoomManager.zhuang))
        this.PlayersHeadTable[RoomManager.ConvertLocalIndex(RoomManager.zhuang)].PlayZhuangAni( )
    }


    //播放复仇的动画
    PlayFuChou(direct:number)
    {
        this.PlayersHeadTable[direct].PlayFuChou( )
    }

    


    /** 重置每个玩家的头像 */
    Reset() 
    {
        this.SetActiveHideAllhead_3dLoad()


        for (let i = 0; i < this.PlayersHeadTable.length; i++) 
        {
            this.PlayersHeadTable[i].Reset();
        }

    }
    
    StopCoroutineTweenAni() {
        for (let i = 0; i < this.PlayersHeadTable.length; i++) 
        {
            this.PlayersHeadTable[i].StopCoroutineTweenAni();
        }
        
    }




}
