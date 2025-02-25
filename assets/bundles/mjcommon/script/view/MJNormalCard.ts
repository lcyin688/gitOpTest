

import { Config } from "../../../../scripts/common/config/Config";
import { LoggerImpl } from "../../../../scripts/framework/core/log/Logger";

import { CommonMJConfig } from "../Config/CommonMJConfig";
import { MJTool } from "../logic/MJTool";



export default class MJNormalCard {

    root : fgui.GButton = null;
    mask_ogloader: fgui.GLoader = null;
    bgicon_gloder:fgui.GLoader=null;
    icon_gloder:fgui.GLoader=null;


    private towards_gloder:fgui.GLoader=null;

    
    m_uCardID: number;

    public quelaifu_gloder:fgui.GLoader=null;
    private hu_gloder:fgui.GLoader=null;
    private zhishideng_obj :fgui.GObject =null;

    // private  mtl: cc.Material = null;
    private fire_3d:fairygui.GLoader3D=null;


    public constructor(root : fgui.GButton) {

        this.root =root;
        this.setInitNew();
    }



    setInitNew()
    {
        if (this.root.getChild("mask") ) 
        {
            this.mask_ogloader = this.root.getChild("mask").asLoader;
        }
        if (this.root.getChild("bgicon")) 
        {
            this.bgicon_gloder = this.root.getChild("bgicon").asLoader;
        }
        if (this.root.getChild("icon")) 
        {
            this.icon_gloder = this.root.getChild("icon").asLoader;
        }
        if (this.root.getChild("towards")) 
        {
            this.towards_gloder = this.root.getChild("towards").asLoader;
        }

        if (this.root.getChild("quelaifu")) 
        {
            this.quelaifu_gloder = this.root.getChild("quelaifu").asLoader;
        }
        if (this.root.getChild("zhishideng")) 
        {
            this.zhishideng_obj = this.root.getChild("zhishideng");
        }

        if (this.root.getChild("hu")) 
        {
            this.hu_gloder = this.root.getChild("hu").asLoader;
        }
        if (this.root.getChild("fire")) 
        {
            this.fire_3d = <fairygui.GLoader3D>this.root.getChild("fire");
        }

        

        
    }



    SetActiveFire(isShow: boolean) 
    {
        if (this.fire_3d!=null) 
        {
            this.fire_3d.visible =isShow;
        }
    }

    SetActivezhishideng(isShow: boolean) 
    {
        if (this.zhishideng_obj!=null) 
        {
            this.zhishideng_obj.visible =isShow;
        }
    }


    SetActiveQueLaiFu(isShow : boolean)
    {
        if (this.quelaifu_gloder!=null) 
        {
            this.quelaifu_gloder.visible =isShow;
        }
    }

    SetActiveQue(isShow : boolean)
    {
        if (isShow && this.quelaifu_gloder!=null ) 
        {
            this.SetActiveQueLaiFu(true); 
            let urlStr = fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON,"othermj_tag_que")
            // Log.e("othermj_tag_que 01  ",urlStr  );
            this.quelaifu_gloder.icon =urlStr;   
        }
    }

    SetActiveHu(isShow : boolean)
    {
        if (this.hu_gloder!=null) 
        {
            this.hu_gloder.visible =isShow;
            if (isShow) 
            {
                let urlStr = fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON,"othermj_tag_hu")
                this.hu_gloder.icon =urlStr;   
            }
        }
    }

    SetActiveGang(isShow : boolean)
    {
        if (this.quelaifu_gloder!=null) 
        {
            this.quelaifu_gloder.visible =isShow;
            if (isShow) 
            {
                let urlStr = fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON,"othermj_tag_gang")
                this.quelaifu_gloder.icon =urlStr;   
            }
        }
    }


    /** 设置卡牌值 */
    BaseSetCard(card:number )
    {
        if (card ==null || card==0) //别人站立的牌
        {
            return;    
        }
        
        this.SetActiveFire(false);
        this.SetActiveCard(true);
        this.SetActiveMask(false);
        this.SetActiveToward(false);
        this.SetActiveQueLaiFu(false)
        this.SetActiveHu(false)
        this.SetActiveIcon(true)
        
        this.m_uCardID = card;
        if ( this.icon_gloder!=null ) 
        {
            let urlStr = fgui.UIPackage.getItemURL("hall",CommonMJConfig.MahjongID[this.m_uCardID].spriteUrl)
            // Log.e("  BaseSetCard card : ",card )
            // Log.e("  BaseSetCard urlStr : ",urlStr )
            this.icon_gloder.icon =urlStr;   
        }
        this.SetActiveLai(false)
        if (CommonMJConfig.IsCanShowLai && card !=135 ) 
        {
            if (MJTool.JudgeIsHave(CommonMJConfig.TingYong, this.m_uCardID)) 
            {
                this.SetActiveLai(true)
            }
        }

        if (this.m_uCardID == 135) 
        {
           this.SetActiveFu(true)
        }


        // if ( this.icon_gloder!=null ) 
        // {

        //     let im = this.icon_gloder.asImage;
        //     let sprite = im._content;
        //     let sf = sprite.spriteFrame;
        //     sprite.spriteFrame = null;
        //     CommonMJConfig.MeshCard.w=80
        //     CommonMJConfig.MeshCard.h=115

        //     // Log.e("  BaseSetCard  mjmh.tex : ", cc.loader.getRes("mjzhengoutcard_bottom", cc.Texture2D) )
        //     // Log.e("  BaseSetCard  Manager.utils.getmtl() : ", Manager.utils.getmtl() )
        //     cc.loader.loadRes("faces/"+CommonMJConfig.MahjongID[this.m_uCardID].spriteUrl, (error: Error, resource: cc.Texture2D)=>
        //     {
        //         Log.e("  BaseSetCard  this.m_uCardID : ", this.m_uCardID )
        //         // Log.e("  BaseSetCard  resource : ", resource )
        //         // Log.e("  BaseSetCard  icon_gloder : ", this.icon_gloder, this.icon_gloder.width,this.icon_gloder.height,this.icon_gloder.scaleX,this.icon_gloder.scaleY,this.icon_gloder.rotation )
        //         // this.icon_gloder.x,this.icon_gloder.y,
        //         let node = new cc.Node();
        //         let mjmh = node.addComponent(MeshCard);
        //         mjmh.offset0 = -100
        //         mjmh.offset1 = -100;
        //         mjmh.tex =resource ;
        //         mjmh.mtl = Manager.utils.getmtl();
        //         sprite.node.addChild(node);
        //         // node.width = this.icon_gloder.width;
        //         // node.height = this.icon_gloder.height;
        //         // node.scaleX = this.icon_gloder.scaleX;
        //         // node.scaleY = this.icon_gloder.scaleY;
        //         node.width = 80;
        //         node.height = 115;
        //         node.scaleX = -1;
        //         node.scaleY = 1;
        //         node.x = sprite.node.width / 2 
        //         node.y = -sprite.node.height / 2;
        //         Log.e("  BaseSetCard   sprite.node.width / 2 : ",  sprite.node.width / 2,-sprite.node.height / 2 )
        //         node.setRotation(this.icon_gloder.rotation);
        //     });


        // }




       
    }


    SetActiveLai(isShow : boolean)
    {
        if (isShow && this.quelaifu_gloder!=null ) 
        {
            this.SetActiveQueLaiFu(true); 
            let urlStr = fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON,"othermj_tag_lai")
            // Log.e("othermj_tag_lai 01  ",urlStr  );
            this.quelaifu_gloder.icon =urlStr;   
        }
    }

    SetActiveFu(isShow : boolean)
    {
        if (isShow && this.quelaifu_gloder!=null ) 
        {
            this.SetActiveQueLaiFu(true);
            let urlStr = fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON,"othermj_tag_fu")
            // Log.e("othermj_tag_fu 01  ",urlStr  );
            this.quelaifu_gloder.icon =urlStr;   
        }
    }

    SetCardBgIcon(path: string )
    {
        if (this.bgicon_gloder!=null) 
        {
            let urlStr = fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON,path)
            // Log.e("  SetCardBgIcon urlStr : ",urlStr )
            this.bgicon_gloder.icon =urlStr;   
        } 
    }

    SetCardBgIconScale(x:number,y:number )
    {
        if (this.bgicon_gloder!=null) 
        {
            this.bgicon_gloder.setScale(x,y)
        } 
    }


    BaseSetCardPosition(x:number,y:number )
    {
        this.root.x =x;
        this.root.y =y;
    }
    


    /** 设置牌的朝向 */
    SetCardTowards(altori: number) 
    {
        // this.SetActiveToward(true);
        // let url =CommonMJConfig.AltOriPath[altori];
        // this.SetTowardIcon(url);

    }
    /** 设置牌的朝向 胡 */
    SetCardHuTowards(huori: number) 
    {
        // this.SetActiveToward(true);
        // let url =CommonMJConfig.HuOriPath[huori];
        // this.SetTowardIcon(url);
    }


    /** 设置朝向的显示隐藏 */
    SetActiveToward(isShow: boolean) 
    {
        if (this.towards_gloder!= null) 
        {
            this.towards_gloder.visible =isShow;
        }

    }


    /** 设置朝向的显示隐藏 */
    SetTowardIcon(path: string) 
    {
        // if (this.towards_gloder!= null) 
        // {
        //     let urlStr = fgui.UIPackage.getItemURL(Config.BUNDLE_MJCOMMON,path)
        //     this.towards_gloder.icon =urlStr;   
        // }

    }


    SetActiveCard(isShow: boolean) 
    {
        this.root.visible =isShow;
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

    GetCardId():number
    {
        return this.m_uCardID
    }

    SetActiveIcon(isShow:boolean)
    {
        // Log.w(" SetActiveIcon  isShow ",isShow)
        if (this.icon_gloder!=null) {
            this.icon_gloder.visible = isShow;
        }
    }



    SetCardSit()
    {
        this.SetActiveQueLaiFu(false)
        this.SetActiveIcon(false)
        this.SetActiveFire(false)

    }


    //设置
    SetAlpha(num:number)
    {
        this.root.alpha= num;
    }
    //设置颜色
    SetColor(color:cc.Color)
    {
        // let c =new cc.Color;
        // c.a=0.3;
        // c.b=0.3;
        // c.g=0.3;
        // c.b=0.3;
        this.root.titleColor= color;
    }



    GetObj():fgui.GObject
    {
        return this.root
    }


    Recycle() 
    {
        this.root.dispose()
    }

    StopCoroutineTweenAni()
    {


    }



}



