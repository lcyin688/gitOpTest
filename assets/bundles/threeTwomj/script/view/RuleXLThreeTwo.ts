import FLevel2UI from "../../../../scripts/common/fairyui/FLevel2UI";
import { MJRuleConfig } from "../../../../scripts/common/wanfa/MJRuleConfig";
import paixingHuItem from "../../../../scripts/common/wanfa/paixingHuItem";
import { MahHu } from "../../../../scripts/def/GameEnums";
import { CommonMJConfig } from "../../../mjcommon/script/Config/CommonMJConfig";



export default class RuleXLThreeTwo extends FLevel2UI {

    
    private dataItem:number[] = [];


    protected m_imageHuType: fgui.GObject = null;

    private fanxing_list:fgui.GList=null;
    private game_list:fgui.GList=null;
    private close_btn : fgui.GButton=null;
    private guize_list:fgui.GList=null;

    moRenIndex:number=0

    public Init(ui: GameView, name?: string): void {
        super.Init(ui,name);
        this.setInit();
    }
    protected onBind(): void 
    {

        
    }

    public setInit() {
        this.dataItem = [
            MahHu.Hu_PingHu,
            MahHu.Hu_SuHu,
            MahHu.Hu_BianZhang,
            MahHu.Hu_KanZhang,
            MahHu.Hu_DanDiao,
            MahHu.Hu_YiBanGao,
            MahHu.Hu_LiuLianShun,
            MahHu.Hu_ShuangTongKe,
            MahHu.Hu_LaoSaoPei,
            MahHu.Hu_DuiDuiHu,
            MahHu.Hu_DuanYaoJiu,
            MahHu.Hu_HongZhongDiao,
            MahHu.Hu_ShuangAnKe,
            MahHu.Hu_ZhuoWuKui,
            MahHu.Hu_BuQiuRen,
            MahHu.Hu_QingYiSe,
            MahHu.Hu_WuXingBaGua,
            MahHu.Hu_YiTiaoLong,
            MahHu.Hu_SanAnKe,
            MahHu.Hu_JinGouDiao,
            MahHu.Hu_DaYuWu,
            MahHu.Hu_XiaoYuWu,
            MahHu.Hu_SanJieGao,
            MahHu.Hu_QuanShuangKe,
            MahHu.Hu_TuiBuDao,
            MahHu.Hu_YaoJiu,
            MahHu.Hu_QuanXiao,
            MahHu.Hu_QuanZhong,
            MahHu.Hu_QuanDa,
            MahHu.Hu_JiangDui,
            MahHu.Hu_QuanDaiWu,
            MahHu.Hu_SiAnKe,
            MahHu.Hu_QiDui,
            MahHu.Hu_SiJieGao,
            MahHu.Hu_LvYiSe,
            MahHu.Hu_ShouZhongBaoYi,
            MahHu.Hu_LianQiDui,
            MahHu.Hu_QuanYaoJiu,
            MahHu.Hu_LongQiDui,
            MahHu.Hu_DiHu,
            MahHu.Hu_TianHu,
            MahHu.Hu_ShuangLongQiDui,
            MahHu.Hu_YiSeShuangLongHui,
            MahHu.Hu_ShiErJinChai,
            MahHu.Hu_JiuLianBaoDeng,
            MahHu.Hu_SanLongQiDui,
            MahHu.Hu_ShiBaLuoHan,
        ]
        this.fanxing_list = this.root.getChild("fanxinglist").asList
        this.guize_list = this.root.getChild("guizelist").asList
        this.close_btn = this.root.getChild("close").asButton
        this.close_btn.onClick(()=>{
            this.SetActiveRule(false)
        },this)

        this.root.getChild("btn1").asButton.getChild("title1").text ="规则"
        this.root.getChild("btn1").asButton.getChild("title2").text ="规则"
        this.root.getChild("btn2").asButton.getChild("title1").text ="番型"
        this.root.getChild("btn2").asButton.getChild("title2").text ="番型"
        this.root.getChild("btn3").asButton.getChild("title1").text ="结算"
        this.root.getChild("btn3").asButton.getChild("title2").text ="结算"
        this.game_list = this.root.getChild("gamesList").asList
    }

    SetData()
    {
        this.game_list.removeChildrenToPool();
        let item: fgui.GButton = this.game_list.addItemFromPool().asButton;
        let str=  "三人两房";
        item.getChild("title").text = str
        item.getChild("title1").text =str
        item.getController("c1").selectedIndex=1;


        this.guize_list.removeChildrenToPool();

        let index =0
        if (CommonMJConfig.MjRoomRule.hongZhongType==6) 
        {
            index=0
        } 
        else if (CommonMJConfig.MjRoomRule.hongZhongType==10)
        {
            index=1
        }
        else
        {
            index=2
        }
        this.SetFanXingInit(index)

        let url =  fgui.UIPackage.getItemURL("hall", "threeTworulewenben")
        this.guize_list.addItemFromPool(url)
        
    }


    private renderyListItem(index: number, obj: fgui.GObject): void {
        let item = obj.asCom;
        let paixingHuItemSc = new paixingHuItem(item);
        // Log.w("  renderyListItem   this.dataItem.length: index ",this.dataItem.length,index)
        if (this.dataItem.length > index)//不是最后一个的时候 
        {
            paixingHuItemSc.SetData(MJRuleConfig.RuleConfig[this.dataItem[this.dataItem.length-index-1]]);
        }
        else
        {
            paixingHuItemSc.SetWanfa(this.moRenIndex)
        }


    }


    SetFanXingInit(moRenIndex:number)
    {
        this.moRenIndex =moRenIndex
        this.fanxing_list.setVirtual();
        this.fanxing_list.itemRenderer = this.renderyListItem.bind(this);
        this.fanxing_list.numItems = this.dataItem.length+1;

    }







    SetActiveRule(isShow:boolean)
    {
        this.root.visible = isShow;
    }
























    


}
