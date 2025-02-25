
export default class PropCardItem   {


    private root : fgui.GComponent = null;



    public constructor(root : fgui.GComponent) 
    {
        this.root =root;
    }

    SetData(propID: number) 
    {
        let daoJuConfig =  Manager.utils.GetDaoJuConfig();
        let daoJuConfigItem = Manager.utils.GetDaoJuConfigItem( propID ,daoJuConfig );
        this.root.getChild("propItemBg").icon =fgui.UIPackage.getItemURL("hall",daoJuConfigItem.bgPath) 
        this.root.getChild("propItemIcon").icon = fgui.UIPackage.getItemURL("hall","daoju_kapai_"+propID);
    }


















}


