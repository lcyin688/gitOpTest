import { Config } from "../../../../scripts/common/config/Config";
import { MahHPGOPerate } from "../../../../scripts/def/GameEnums";
import { Tool } from "../../../gamecommon/script/tools/Tool";
import { CommonMJConfig } from "../Config/CommonMJConfig";
import { MJEvent } from "../Event/MJEvent";
import { MJTool } from "../logic/MJTool";
import MJNormalCard from "./MJNormalCard";



export default class MJHandles {


    private root : fgui.GList = null;

    private btnArr_obj :fairygui.GObject[]=[];
    private huBeiNum:number=0

    public constructor(root : fgui.GList) 
    {
        this.root =root;
        this.setInit()
    }



    setInit()
    {
    //     Log.d("  ffffffff 001  ,",Tool.GetPreciseDecimal(999999/10000,0))

        

    }






    /** 点击胡 */
    OnHu()
    {
        Log.d(" 点击胡   ffffffff 001  ")
        dispatch(MJEvent.CLICK_HU)
    }
    /** 点击飞 */
    OnFei()
    {
        dispatch(MJEvent.CLICK_FEI)
    }
    /** 点击提 */
    OnTi()
    {
        dispatch(MJEvent.CLICK_TI)
    }
    /** 点击躺 */
    OnTang()
    {
        this.SetActiveHandle(false)
        CommonMJConfig.ClickedTang = true
        dispatch(MJEvent.CLICK_TANG)
    }

    /** 点击碰 */
    OnPeng()
    {
        dispatch(MJEvent.CLICK_PENG)
    }
    /** 点击杠 */
    OnGang()
    {
        dispatch(MJEvent.CLICK_GANG)
    }

    /** 点击明牌 */
    OnMingPai()
    {
        dispatch(MJEvent.CLICK_MINGPAI)
    }

    /** 点击过 */
    OnGuo()
    {
        dispatch(MJEvent.CLICK_PASS)
    }


    /** 点击破封 */
    OnPoFeng()
    {
        dispatch(MJEvent.CLICK_POFENG)
    }
    

    SetActiveHandle(isShow:boolean)
    {
        this.root.visible =isShow;
    }

    HideAllHandle()
    {
        this.SetActiveHandle(false);
    }


    HideMingPaiHandle()
    {
        Log.w("HideMingPaiHandle   this.btnArr_obj.length ",this.btnArr_obj.length)
        for (let index = 0; index < this.btnArr_obj.length; index++) 
        {   
            if (this.btnArr_obj[index].data == CommonMJConfig.HandleTag.MingPai ) {
                if (this.btnArr_obj[index].hasClickListener()) {
                    this.btnArr_obj[index].clearClick();
                }
               
                this.btnArr_obj.splice(index,1)
                this.root.removeChildToPoolAt(index)
            }
        }

        if (this.btnArr_obj.length==1 &&  this.btnArr_obj[0].data == CommonMJConfig.HandleTag.Pass    ) 
        {
            if (this.btnArr_obj[0].hasClickListener()) {
                this.btnArr_obj[0].clearClick();
            }

            this.btnArr_obj.splice(0,1)
            this.root.removeChildToPoolAt(0)
        }

    }

    //明牌后 刷新 倍数
    SetHuHandleText(mingBei:number)
    {
        for (let index = 0; index < this.btnArr_obj.length; index++) 
        {   
            if (this.btnArr_obj[index].data == CommonMJConfig.HandleTag.Hu ) {

                let manx = this.huBeiNum*mingBei
                if (manx >CommonMJConfig.MjRoomRule.max_fan ) {
                    manx = CommonMJConfig.MjRoomRule.max_fan
                }
                this.btnArr_obj[index].asButton.getChild("num").text =  manx+(CommonMJConfig.ISBei ?"倍":"番") ;
            }
        }
    }



    /** 获取到所有操作 */
    GetOpraArr(data:pb.IKeCaoZuo):number[]
    {
        let operateArr:number[] =data.operate
        let handles :number[]=[];
        for (let i = 0;  i< operateArr.length; i++) 
        {
            let itemOp =operateArr[i]
            if (itemOp == MahHPGOPerate.HPG_Guo ) 
            {
                handles.push(CommonMJConfig.HandleTag.Pass)
            } 
            else if (itemOp == MahHPGOPerate.HPG_Peng ) 
            {
                handles.push(CommonMJConfig.HandleTag.Peng)
            }        
            else if (itemOp == MahHPGOPerate.HPG_BuGang || itemOp == MahHPGOPerate.HPG_DianGang || itemOp == MahHPGOPerate.HPG_AnGang ) 
            {
                if(! MJTool.JudgeIsHave(handles, CommonMJConfig.HandleTag.Gang) )
                {
                    handles.push(CommonMJConfig.HandleTag.Gang)
                }
            }  
            else if (itemOp == MahHPGOPerate.HPG_Hu ) 
            {
                handles.push(CommonMJConfig.HandleTag.Hu)
            } 
        }
        if (data.CanMingPai) 
        {
            handles.push(CommonMJConfig.HandleTag.MingPai)
        }
        if (data.CanPoFen) 
        {
            handles.push(CommonMJConfig.HandleTag.PoFeng)
        }
        handles.sort(function (a, b) {
            return b-a
        });

        return handles;

    }



    OnShowHandlesDefinite(data:pb.IKeCaoZuo,isMineTurn:boolean)
    {
        this.SetActiveHandle(true);
        this.Recycle()
        let hucardId:number =data.KeHuMjs[0]
        let fanshu:number =data.HuFan
        let operateArr = this.GetOpraArr(data);
        Log.w ("OnShowHandlesDefinite   :  ",operateArr);

        for (let i = 0; i < operateArr.length; i++) 
        {

            if (CommonMJConfig.HandleTag.Gang == operateArr[i] ) 
            {
                let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "gangBtn")
                // Log.e ("OnShowHandlesDefinite  :  url ",url  );
                
               let item =this.root.addItemFromPool(url)
               item.onClick(()=>{
                    this.OnGang();
                }, this);
                item.data = CommonMJConfig.HandleTag.Gang
                this.btnArr_obj.push(item)
            } 
            else if (CommonMJConfig.HandleTag.Peng == operateArr[i] ) 
            {
                let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "pengBtn")
                // Log.e ("MJOutCardArea  :  url ",url  );
               let item =this.root.addItemFromPool(url)
                item.onClick(()=>{
                    this.OnPeng();
                }, this);
                item.data = CommonMJConfig.HandleTag.Peng
                this.btnArr_obj.push(item)
            } 
            else if (CommonMJConfig.HandleTag.Hu == operateArr[i] ) 
            {
                let strPath ="huBtn"
                if (isMineTurn) 
                {
                    // Log.e(" 不是吧 又是自摸 ")
                    strPath="ziMoBtn"
                }
                let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, strPath)
                // Log.e ("MJOutCardArea  :  url ",url  );
               let item =this.root.addItemFromPool(url)
               item.asButton.getChild("num").text = fanshu+(CommonMJConfig.ISBei ?"倍":"番") ;
               this.huBeiNum =  fanshu
               let cardHu = new MJNormalCard(item.asButton.getChild("card").asButton);
               cardHu.BaseSetCard(hucardId);
                item.onClick(()=>{
                    this.OnHu();
                }, this);
                item.data = CommonMJConfig.HandleTag.Hu
                this.btnArr_obj.push(item)
            }
            else if (CommonMJConfig.HandleTag.MingPai == operateArr[i] ) 
            {
                let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "mingPaiBtn")
                // Log.e ("mingpai  :  url ",url  );
                let item =this.root.addItemFromPool(url)
                item.onClick(()=>{
                    this.OnMingPai();
                }, this);
                item.data = CommonMJConfig.HandleTag.MingPai
                this.btnArr_obj.push(item)
            }  
            else if (CommonMJConfig.HandleTag.PoFeng == operateArr[i] ) 
            {
                let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "pofengBtn")
                // Log.e ("MJOutCardArea  :  url ",url  );
                let item =this.root.addItemFromPool(url)
                item.onClick(()=>{
                    this.OnPoFeng();
                }, this);
                item.data = CommonMJConfig.HandleTag.PoFeng
                this.btnArr_obj.push(item)
            } 
            else if (CommonMJConfig.HandleTag.Pass == operateArr[i] ) 
            {
                let url =  fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON, "passBtn")
                // Log.e ("MJOutCardArea  :  url ",url  );
                let item =this.root.addItemFromPool(url)
                item.onClick(()=>{
                    this.OnGuo();
                }, this);
                item.data = CommonMJConfig.HandleTag.Pass
                this.btnArr_obj.push(item)
            } 
        }


    }


    Recycle()
    {
        for (let index = 0; index < this.btnArr_obj.length; index++) 
        {
            this.btnArr_obj[index].clearClick();
        }
        this.btnArr_obj=[]
        this.root.removeChildrenToPool();

    }
    

    OnShowOnlyHu()
    {
        this.HideAllHandle();
        this.SetActiveHandle(true);

    }


    StopCoroutineTweenAni()
    {


    }



}


