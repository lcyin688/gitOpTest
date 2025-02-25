export class GameMessageQuaue  {

    funList = [];

    use=true;

    funItem ={}

    // public constructor(mjhandler: MJHandler) {

    // }


    public AddFun(fun)
    {
        // if (!this.use) {
        //     return;
        // }

        this.funItem={ funC : fun,OnDo :false,use :true  }

        this.funList.splice(this.funList.length,1,this.funItem);
        this.DoFunList();
    }
    
    public ClearFun()
    {
        this.use =false
        this.funList =[]
    }
    
    public DoFunList()
    {
        if ( this.GetFunListCount() > 0 &&  !this.funList[0].OnDo  ) {
            // Log.e( "messageQuaue   DoFunList  限制住 " );   
            this.funList[0].OnDo =true;
            this.funList[0].funC (()=>{
                // Log.e( "messageQuaue   DoFunList  正式处理" );   
                if (this.funList[0]!=null && this.funList[0].use) {
                    this.funList[0].OnDo =false;
                    this.funList.splice(0,1);
                    this.DoFunList();
                }
            } ,this

            );

        }
        
    }
    

    public GetFunListCount()
    {
        // Log.e( "messageQuaue   GetFunListCount  count : "+this.funList.length );   
        return this.funList.length;
    }


}
