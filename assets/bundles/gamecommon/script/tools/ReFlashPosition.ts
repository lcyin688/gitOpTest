



export default class ReFlashPosition {

    private root : fgui.GComponent = null;
    private  space:number=0
    public constructor(root : fgui.GComponent,space:number) 
    {

        this.root =root;
        this.space =space;
    }



    ReFlash()
    {
        let showObjArr:fairygui.GObject[]=[]
        for (let index = 0; index < this.root._children.length; index++) 
        {
            if (this.root._children[index].visible) 
            {
                showObjArr.push(this.root._children[index])   
            }
        }
        let count =showObjArr.length
        if (count==0) {
            return
        }

        let changduTotal = this.root.width
        let changduItem = this.root._children[0].width
        // Log.e("ReFlash count ",count)
        // Log.e("ReFlash changduTotal ",changduTotal)
        // Log.e("ReFlash changduItem ",changduItem)

        if (count==1) 
        {
            showObjArr[0].x = changduTotal/2
            
        }
        else  if (count>1) 
        {

            for (let i = 0; i < showObjArr.length; i++) 
            {
                let x = 0
                if ( count%2==0 ) 
                {
                    let danbianCount =  (count/2) 
                    if ( i < danbianCount ) 
                    {
                        x= changduTotal/2- (changduItem+this.space)*(danbianCount-i-0.5)
                    }
                    else
                    {
                        x= changduTotal/2+ (changduItem+this.space)*(i-(danbianCount-0.5) )
                    }

                }
                else
                {
                    let danbianCount =  (count-1/2) 
                    if ( i < danbianCount ) {
                        x= changduTotal/2- (changduItem+this.space)*i-changduItem/2
                    }
                    else if ( i == danbianCount ) 
                    {
                        x= changduTotal/2
                    }
                    else
                    {
                        x= changduTotal/2+ (changduItem+this.space)*(i-(danbianCount-1) )+changduItem/2
                    }
                }
                Log.w("ReFlash x :i ",x,i)
                showObjArr[i].x= x
            
            }

        }
        





    }



}



