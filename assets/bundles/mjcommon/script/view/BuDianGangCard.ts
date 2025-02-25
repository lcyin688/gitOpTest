
import { CommonMJConfig } from "../Config/CommonMJConfig";
import MJManager from "../Manager/MJManager";
import MJNormalCard from "./MJNormalCard";



export default class BuDianGangCard {



    private root : fgui.GButton = null;
    private card1_obj: fgui.GButton = null;
    private card2_obj: fgui.GButton = null;
    private card3_obj: fgui.GButton = null;
    private card4_obj: fgui.GButton = null;

    mjNormalCardSC1: MJNormalCard = null;
    mjNormalCardSC2: MJNormalCard = null;
    mjNormalCardSC3: MJNormalCard = null;
    mjNormalCardSC4: MJNormalCard = null;

    
    m_uCardID: number;
    //杠牌朝向
    m_eAltOri:number;

    public constructor(root : fgui.GButton) {

        this.root =root;
        this.setInit();
    }



    setInit()
    {
        this.card1_obj = this.root.getChild("card1").asButton;
        this.card2_obj = this.root.getChild("card2").asButton;
        this.card3_obj = this.root.getChild("card3").asButton;
        this.card4_obj = this.root.getChild("card4").asButton;

        this.mjNormalCardSC1 = new MJNormalCard(this.card1_obj);
        this.mjNormalCardSC2 = new MJNormalCard(this.card2_obj);
        this.mjNormalCardSC3 = new MJNormalCard(this.card3_obj);
        this.mjNormalCardSC4 = new MJNormalCard(this.card4_obj);

    }

    /** 设置卡牌值 */
    SetCard(card:number , altori:number )
    {
        // Log.e( " 补杠的时候  SetCard  :  ", card )
        this.m_uCardID =card;
        this.m_eAltOri =altori;

        this.mjNormalCardSC1.BaseSetCard(card);
        this.mjNormalCardSC2.BaseSetCard(card);
        this.mjNormalCardSC3.BaseSetCard(card);
        this.mjNormalCardSC4.BaseSetCard(card);
        this.mjNormalCardSC4.SetCardTowards(altori);

        //明牌的设置去遍历
        // MJManager.AddLookCards(card, [this.mjNormalCardSC1,  this.mjNormalCardSC2,  this.mjNormalCardSC3,this.mjNormalCardSC4] );
        this.SetActiveAltCard(true);



        
    }

    SetActiveToward(isShow: boolean)
    {
        this.mjNormalCardSC4.SetActiveToward(isShow)

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



