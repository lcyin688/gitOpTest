
import { CommonMJConfig } from "../Config/CommonMJConfig";
import MJManager from "../Manager/MJManager";
import MJNormalCard from "./MJNormalCard";



export default class PengCard {



    private root : fgui.GButton = null;
    private card1_obj: fgui.GButton = null;
    private card2_obj: fgui.GButton = null;
    private card3_obj: fgui.GButton = null;

    mjNormalCardSC1: MJNormalCard = null;
    mjNormalCardSC2: MJNormalCard = null;
    mjNormalCardSC3: MJNormalCard = null;

    
    m_uCardID: number;
    //碰牌朝向
    m_eAltOri:number;

    public constructor(root : fgui.GButton) {

        this.root =root;
        this.setInit()
    }



    setInit()
    {
        this.card1_obj = this.root.getChild("card1").asButton;
        this.card2_obj = this.root.getChild("card2").asButton;
        this.card3_obj = this.root.getChild("card3").asButton;
    }

    /** 设置卡牌值 */
    SetCard(card:number , altori:number )
    {
        this.m_uCardID =card;
        this.m_eAltOri =altori;
        this.mjNormalCardSC1 = new MJNormalCard(this.card1_obj);
        this.mjNormalCardSC2 = new MJNormalCard(this.card2_obj);
        this.mjNormalCardSC3 = new MJNormalCard(this.card3_obj);
        this.mjNormalCardSC1.BaseSetCard(card);
        this.mjNormalCardSC2.BaseSetCard(card);
        this.mjNormalCardSC2.SetCardTowards(altori);
        this.mjNormalCardSC3.BaseSetCard(card);
        // MJManager.AddLookCards(card, [this.mjNormalCardSC1,  this.mjNormalCardSC2,  this.mjNormalCardSC3] );
        this.SetActiveAltCard(true);

    }


    

    SetActiveToward(isShow: boolean)
    {
        this.mjNormalCardSC2.SetActiveToward(isShow);
    }


    SetActiveAltCard(isShow: boolean)
    {
        this.root.visible =isShow;
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



