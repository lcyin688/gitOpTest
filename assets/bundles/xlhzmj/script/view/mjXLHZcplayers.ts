import FLevel2UI from "../../../../scripts/common/fairyui/FLevel2UI";
import CMJPlayer from "../../../mjcommon/script/view/CMJPlayer";
import MjPlayerXLHZ from "./MjPlayerXLHZ";



export default class mjXLHZcplayers extends FLevel2UI {

    // protected selfGc: fgui.GComponent = null;
    private gameName_text: fgui.GObject = null;


    m_tablePlayers:MjPlayerXLHZ[]=[];


    public setInit() {
        this.show();

        for(let i = 0;i< 4;i++) 
        {
            // Log.e( " MJHeadPlayers  setInit i    : "+i  );
            let itemobj : fgui.GObject  =   this.root.getChild("mjplayer"+i)
            let item = new MjPlayerXLHZ(itemobj.asCom);
            item.setInit();
            item.SetDirectioni(i);
            this.m_tablePlayers[i]=item;
        }


    }


    SetCMJPlayer(direct:number,mjlayer: CMJPlayer)
    {
        this.m_tablePlayers[direct].SetCMJPlayer(mjlayer)
    }



    OnHu( direct:number,data: pb.IMahHuData, huori: number) 
    {
        this.m_tablePlayers[direct].OnHu(data,huori)
    }


    SHowHuCardHuEff(direct: number) 
    {
        this.m_tablePlayers[direct].SHowHuCardHuEff()
    
    }


    
    GetHuCount(direct: number): number 
    {
        return   this.m_tablePlayers[direct].mjHuCardAreaSC.GetHuCount()
    }



    /** 玩家重连数据恢复 */
    SetPlayerReconnect(direct:number,data: pb.MahPlayerData)
    {
    
        this.m_tablePlayers[direct].SetPlayerReconnect(data)
    
    }





    /**
     * @description 重置所有玩家
     */
    ResetPlayer() 
    {

        // for (const [key, val] of Object.entries(this.m_tablePlayers)) {
        //     this.m_tablePlayers[key].ResetPlayer();
        // }

        for (let index = 0; index < this.m_tablePlayers.length; index++) 
        {
            this.m_tablePlayers[index].ResetPlayer()
        }

        

        this.StopCoroutineTweenAni()

    }

    
    StopCoroutineTweenAni()
    {
        

        // for (const [key, val] of Object.entries(this.m_tablePlayers)) {
        //     this.m_tablePlayers[key].StopCoroutineTweenAni();
        // }
        for (let index = 0; index < this.m_tablePlayers.length; index++) 
        {
            this.m_tablePlayers[index].StopCoroutineTweenAni()
        }


    }


}
