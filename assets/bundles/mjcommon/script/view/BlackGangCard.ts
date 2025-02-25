
import MJNormalCard from "./MJNormalCard";



export default class BlackGangCard {



    private root : fgui.GButton = null;
    private card_obj: fgui.GButton = null;
    mjNormalCardSC: MJNormalCard = null;

    
    m_uCardID: number;

    public constructor(root : fgui.GButton) {

        this.root =root;
        this.setInit();
    }



    setInit()
    {
        this.card_obj = this.root.getChild("card").asButton;
        this.mjNormalCardSC = new MJNormalCard(this.card_obj);

    }

    /** 设置卡牌值 */
    SetCard(card:number )
    {
        this.m_uCardID =card;
        this.mjNormalCardSC.BaseSetCard(card);
        this.SetActiveAltCard(true);
    }


    SetActiveAltCard(isShow: boolean)
    {
        this.root.visible =isShow;
    }


    GetObj():fgui.GObject
    {
        return this.root
    }


    StopCoroutineTweenAni()
    {


    }

    Recycle() 
    {
        this.root.dispose()
    }

}



