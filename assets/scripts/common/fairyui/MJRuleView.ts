
import { GameCat, MahHu } from "../../def/GameEnums";
import { ProtoDef } from "../../def/ProtoDef";
import UIView from "../../framework/core/ui/UIView";
import GameData from "../data/GameData";
import { MJRuleConfig } from "../wanfa/MJRuleConfig";
import paixingHuItem from "../wanfa/paixingHuItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MJRuleView extends UIView {

    protected m_imageHuType: fgui.GObject = null;

    private fanxing_list:fgui.GList=null;
    private game_list:fgui.GList=null;
    private guize_list:fgui.GList=null;
    private gameSelect_btnArr : fgui.GButton[]=[];
    private gameType:GameCat=null;

    private dataItem:number[] = [];
    moRenIndex:number=0
    private startTime=0;

    public static getPrefabUrl() {
        return "prefabs/HallView";
    }

    static getViewPath(): ViewPath {
        let path : ViewPath = {
            	/**@description 资源路径 creator 原生使用*/
            assetUrl: "ui/hall",
            /**@description 包名称 fgui 使用*/
            pkgName : "hall",
            /**@description 资源名称 fgui 使用*/
            resName : "MJRule",
        }
        return path;
    }

    onLoad() {
        super.onLoad();
    }

    onFairyLoad(): void {
        this.root.getChild("close").onClick(this.onClickClose,this);
        // Manager.gd.put("RuleGameType",this.curData .gameType);

        this.gameType = Manager.gd.get<number>("RuleGameType");
        Log.d("onFairyLoad   this.gameType ",this.gameType);
        

        this.fanxing_list = this.root.getChild("fanxinglist").asList
        this.game_list = this.root.getChild("gamesList").asList
        this.guize_list = this.root.getChild("guizelist").asList
        this.root.getChild("btn1").asButton.getChild("title1").text ="规则"
        this.root.getChild("btn1").asButton.getChild("title2").text ="规则"
        this.root.getChild("btn2").asButton.getChild("title1").text ="番型"
        this.root.getChild("btn2").asButton.getChild("title2").text ="番型"
        this.root.getChild("btn3").asButton.getChild("title1").text ="结算"
        this.root.getChild("btn3").asButton.getChild("title2").text ="结算"

        this.SetData(this.gameType)
    }

    onClickClose(){
        Log.d("onClickClose");
        Manager.uiManager.close(MJRuleView);
    }


    SetData(gameType:GameCat)
    {

        Log.w(" 点击了玩法 SetData gameType ",gameType   )
        this.gameType = gameType;
        let data = Manager.dataCenter.get(GameData).get(ProtoDef.pb.S2CGetTables)as pb.S2CGetTables;
        //默认选中的是第一个
        this.moRenIndex =0 
        for (let index = 0; index < data.tables.length; index++) 
        {
            let item: fgui.GButton = this.game_list.addItemFromPool().asButton;
            let name = data.tables[index].catName
            item.getChild("title").text = name
            item.getChild("title1").text = name
            if (this.moRenIndex ==index ) 
            {
                item.getController("c1").selectedIndex=1;
            } 
            else 
            {
                item.getController("c1").selectedIndex=0;
            }

            this.gameSelect_btnArr.push(item)

            item.onClick(()=>{
                this.OnClick(index)
            }, this);
        }
        if (data.gameType == GameCat.GameCat_Mahjong || data.gameType == GameCat.GameCat_Mah3Ren2Fang)
        {


            //规则会变   番型 不变
            this.SetMJGuiZe(this.moRenIndex)

            this.SetMJFanXingInit()

        }


    }


    OnClick(currentIndex:number) 
    {
        Log.w (" OnClick  游戏类型  ")
        for (let index = 0; index < this.gameSelect_btnArr.length; index++) 
        {
            if (currentIndex == index ) 
            {
                this.gameSelect_btnArr[index].getController("c1").selectedIndex=1;
            } 
            else 
            {
                this.gameSelect_btnArr[index].getController("c1").selectedIndex=0;
            }
        }
        this.SetMJGuiZe(currentIndex);
        this.moRenIndex =currentIndex;
        this.fanxing_list.refreshVirtualList();


    }


    SetMJGuiZe(currentIndex:number)
    {

        // Log.e("  SetMJGuiZe   currentIndex ",currentIndex)
        let urlStr=""
        if (this.gameType == GameCat.GameCat_Mahjong) {
            urlStr="xlhzrulewenben"+currentIndex
        }
        else  if (this.gameType == GameCat.GameCat_Mah3Ren2Fang) 
        {
            urlStr="threeTworulewenben"
        }
        
        this.guize_list.removeChildrenToPool();
        let url =  fgui.UIPackage.getItemURL("hall", urlStr)
        let item =this.guize_list.addItemFromPool(url)
    }




    SetMJFanXingInit()
    {

        this.fanxing_list.removeChildrenToPool();
        if (this.gameType == GameCat.GameCat_Mahjong) {
            this.dataItem  = [
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
                MahHu.Hu_BaiWanShi,
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
                MahHu.Hu_WuHuSiHai,
                MahHu.Hu_TianLongBaBu,
                MahHu.Hu_XianHeZhiLu,
                MahHu.Hu_KaiMenJianShan,
                MahHu.Hu_ChangEBengYue,
                MahHu.Hu_BaiNiaoChaoFeng,
                MahHu.Hu_YouRenYouYu,
                MahHu.Hu_YiTongJiangShan,
                MahHu.Hu_DianDaoQianKun,
                MahHu.Hu_JiuWuZhiZun,
                MahHu.Hu_ShiQuanShiMei,
            ]
        }
        else  if (this.gameType == GameCat.GameCat_Mah3Ren2Fang) 
        {
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
                MahHu.Hu_WuHuSiHai,
                MahHu.Hu_TianLongBaBu,
                MahHu.Hu_XianHeZhiLu,
                MahHu.Hu_KaiMenJianShan,
                MahHu.Hu_ChangEBengYue,
                MahHu.Hu_BaiNiaoChaoFeng,
                MahHu.Hu_YouRenYouYu,
                MahHu.Hu_YiTongJiangShan,
                MahHu.Hu_DianDaoQianKun,
                MahHu.Hu_JiuWuZhiZun,
                MahHu.Hu_ShiQuanShiMei,
            ]
        }

        this.SetFanXingInit()

        
    }

    SetMJFanXing(currentIndex:number)
    {
        let url =  fgui.UIPackage.getItemURL("hall", "fanxingwenben"+currentIndex)
        let item =this.fanxing_list.addItemFromPool(url)
    }


    SetFanXingInit()
    {

        this.fanxing_list.setVirtual();
        this.fanxing_list.itemRenderer = this.renderyListItem.bind(this);
        this.fanxing_list.numItems = this.dataItem.length+1;

    }

    private renderyListItem(index: number, obj: fgui.GObject): void {
        let item = obj.asCom;
        let paixingHuItemSc = new paixingHuItem(item);
        Log.w("  renderyListItem   this.dataItem.length: index ",this.dataItem.length,index)
        if (this.dataItem.length > index)//不是最后一个的时候 
        {
            paixingHuItemSc.SetData(MJRuleConfig.RuleConfig[this.dataItem[this.dataItem.length-index-1]]);
        }
        else
        {
            paixingHuItemSc.SetWanfa(this.moRenIndex)
        }


    }





}
