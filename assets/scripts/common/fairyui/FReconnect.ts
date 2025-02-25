import FLoading from "./FLoading";

/**
 * @description 重连专用提示UI
 */
export class FReconnect  extends FLoading{
    protected static _instance: FReconnect = null!;
    public static Instance() { return this._instance || (this._instance = new FReconnect()); }
    

    protected startTimeOutTimer(timeout: number){
        //do nothing
    }

    protected stopTimeOutTimer(){
        //do nothing
    }

}
