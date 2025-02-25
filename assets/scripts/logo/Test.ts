// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Test extends cc.Component {

    @property(cc.EditBox)
    cId: cc.EditBox = null;

    @property(cc.EditBox)
    aId: cc.EditBox = null;

    @property(cc.EditBox)
    tId: cc.EditBox = null;

    @property(cc.EditBox)
    ver: cc.EditBox = null;

    @property(cc.EditBox)
    web: cc.EditBox = null;

    start () {
        let __cid = cc.sys.localStorage.getItem("__cid");
        let __aid = cc.sys.localStorage.getItem("__aid");
        let __tid = cc.sys.localStorage.getItem("__tid");
        let __ver = cc.sys.localStorage.getItem("__ver");
        let __web = cc.sys.localStorage.getItem("__web");
        if(__cid != null && __cid.length > 0){
            this.cId.string = __cid;
        }

        if(__aid != null && __aid.length > 0){
            this.aId.string = __aid;
        }

        if(__tid != null && __tid.length > 0){
            this.tId.string = __tid;
        }

        
        if(__ver != null && __ver.length > 0){
            this.ver.string = __ver;
        }

        if(__web != null && __web.length > 0){
            this.web.string = __web;
        }
    }

    onClickEnter () {
        cc.sys.localStorage.setItem("__cid",this.cId.string);
        cc.sys.localStorage.setItem("__aid",this.aId.string);
        cc.sys.localStorage.setItem("__tid",this.tId.string);
        cc.sys.localStorage.setItem("__ver",this.ver.string);
        cc.sys.localStorage.setItem("__web",this.web.string);
        cc.director.loadScene("Main");
    }
}
