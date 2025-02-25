
export default class DingColorCard   {


    private root : fgui.GComponent = null;



    public constructor(root : fgui.GComponent) 
    {
        this.root =root;
    }

    SetData(propID: number) 
    {
        let str ="ui_daoju_zi_101"
        if (propID == 10001 || propID == 10002 ) //红中福卡
        {
            str = "ui_daoju_zi_100"
        }
        else if (propID == 10003 || propID == 10004 ) //银换牌卡
        {
            str = "ui_daoju_zi_101"
        }
        else if (propID == 10005 || propID == 10006 ) //金换牌卡
        {
            str = "ui_daoju_zi_102"
        }
        else if (propID == 10007 || propID == 10008) //至尊换牌卡
        {
            str = "ui_daoju_zi_103"
        }
        else if (propID == 10009 || propID == 10010) //定色卡
        {
            str = "ui_daoju_zi_104"
        }
        else if (propID == 10011 || propID == 10012) //海底捞月卡
        {
            str = "ui_daoju_zi_105"
        }
        else if (propID == 10013 || propID == 10014) //厌缺卡
        {
            str = "ui_daoju_zi_106"
        }
        else if (propID == 10015 || propID == 10016) //如意卡
        {
            str = "ui_daoju_zi_107"
        }
        else if (propID == 10017 || propID == 10018) //换色卡
        {
            str = "ui_daoju_zi_108"
        }
        else if (propID == 10019 || propID == 10020) //看牌卡
        {
            str = "ui_daoju_zi_109"
        }
        else if (propID == 10021 || propID == 10022) //炸弹卡
        {
            str = "ui_daoju_zi_110"
        }
        else if (propID == 10023 || propID == 10024|| propID == 10025) //斗地主记牌器
        {
            str = "ui_daoju_zi_"+propID
        }
        else if (propID == 10026 || propID == 10027) //1/4查牌卡
        {
            str = "ui_daoju_zi_112_4"
        }
        else if (propID == 10028 || propID == 10029) //1/3查牌卡
        {
            str = "ui_daoju_zi_112_3"
        }
        else if (propID == 10030 || propID == 10031) // 超级加倍
        {
            str = "ui_daoju_zi_113"
        }
        else if (propID == 10032 || propID == 10033) // 破封卡
        {
            str = "ui_daoju_zi_114"
        }
        else if (propID == 10034 || propID == 10035|| propID == 10036 ) //麻将记牌器
        {
            str = "ui_daoju_zi_"+propID
        }
        this.root.getChild("tittle").icon = fgui.UIPackage.getItemURL("hall",str);
    }


















}


