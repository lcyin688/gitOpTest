import { Config } from "../../../../scripts/common/config/Config";
import GameData from "../../../../scripts/common/data/GameData";
import { DouCardType, PlayerAttr } from "../../../../scripts/def/GameEnums";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";
import { Data } from "../../../../scripts/framework/data/Data";
import { RoomManager } from "../../../gamecommon/script/manager/RoomManager";
import DdzView from "../view/DdzView";
/**@description DDZ数据 */
export class DdzData extends Data {
    static bundle = Config.BUNDLE_DDZ;

    public eft:fgui.GLoader3D[]=[];
    public eftCenter:fgui.GLoader3D = null;
    public zdEft:fgui.GComponent=null;

    public zdSx:number = 0;
    public zdSy:number = 0;

    cardMap:{} = null;

    public l2nPosMap:{} = null;
    public n2lPosMap:{} = null;
    public Guid2lPosMap:{} = null;
    meNSeat:number = -1;
    meLSeat:number = -1;

    tablePlayer:pb.ITablePlayer[] = null;
    public douPlayerInfo:pb.IDouPlayerInfo[] = null;

    initData(){
        this.makeCardMap();

        if(this.zdEft){
            fgui.GTween.kill(this.zdEft);
        }
        // Log.d("CardMap",this.cardMap);
        this.l2nPosMap = {};
        this.n2lPosMap = {};
        this.Guid2lPosMap = {};
        this.meLSeat = -1;
        this.meNSeat = -1;

        let gd = Manager.dataCenter.get(GameData);
        let tableInfo = gd.get<pb.S2CDouTableInfo>(ProtoDef.pb.S2CDouTableInfo);
        if(tableInfo == null || tableInfo.tableBase == null){
            return;
        }
        Log.d("tableInfo",tableInfo);
        let meIndex = -1;

        RoomManager.tableId = tableInfo.tableBase.tableId;
        RoomManager.gameType = tableInfo.tableBase.gameType;
        RoomManager.roomcfgId = tableInfo.tableBase.tablecfgId;
        RoomManager.curRound = tableInfo.tableInfo.round;
        RoomManager.SelfIsPoChan = false;
        RoomManager.tableCommon = tableInfo.tableBase
        RoomManager.SetState(RoomManager.StateType.Playing);

        let tempData ={gameType:tableInfo.tableBase.gameType}
        Manager.gd.put("GameCommonData",tempData);
        
        this.tablePlayer = new Array<pb.ITablePlayer>(tableInfo.tableBase.playerCount);
        this.douPlayerInfo = new Array<pb.DouPlayerInfo>(tableInfo.tableBase.playerCount);

        let temp = new Array<pb.ITablePlayer>(tableInfo.tableBase.playerCount);

        for (let index = 0; index < tableInfo.tableBase.players.length; index++) {
            let p = tableInfo.tableBase.players[index];
            temp[p.pos-1] = p; 
            
            if (p.player.guid == gd.player().guid){
                this.meNSeat = p.pos;
                meIndex = p.pos-1;
            }
        }
        Log.e("temp",temp);
        let lindex = 0;
        while(true){
            let np = temp[meIndex];
            if(np != null){
                this.Guid2lPosMap[np.player.guid] = lindex;
                this.n2lPosMap[np.pos] = lindex;
                this.l2nPosMap[lindex] = np.pos;
                this.douPlayerInfo[lindex] = this.findDTablePlayer(np.pos,tableInfo); 
                this.tablePlayer[lindex] = this.findTablePlayer(np.pos,tableInfo); 
            }else{
                this.n2lPosMap[meIndex+1] = lindex;
                this.l2nPosMap[lindex] = meIndex+1;
                this.douPlayerInfo[lindex] = null; 
                this.tablePlayer[lindex] = null; 
            }

            meIndex++;
            lindex++;
            if(meIndex >= temp.length){
                meIndex = 0;
            }
            if(lindex >= tableInfo.tableBase.playerCount){
                break;
            }
        }


        RoomManager.SelfPosition = this.meNSeat;
        // RoomManager.RoomCategory = 

        Log.d("PosMap",this.n2lPosMap,this.l2nPosMap);
        Log.d("tablePlayer",this.tablePlayer);
    }

    HaveNullSit(){
        for (const [key, val] of Object.entries(this.tablePlayer)) {
            if(val == null){
                return true;
            }
        }
        return false;
    }

    findTablePlayer(pos:number,tableInfo:pb.S2CDouTableInfo){
        for (let index = 0; index < tableInfo.tableBase.players.length; index++) {
            let p = tableInfo.tableBase.players[index];
            if (p.pos == pos){
                return p;
            }
        }
        return null;
    }

    findDTablePlayer(pos:number,tableInfo:pb.S2CDouTableInfo){
        for (let index = 0; index < tableInfo.players.length; index++) {
            let p = tableInfo.players[index];
            if (p.pos == pos){
                return p;
            }
        }
        return null;
    }

    clearPlayer(guid:number):number{
        let sit = -1;
        for (const [key, val] of Object.entries(this.tablePlayer)) {
            if(val.player.guid == guid){
                sit = Number(key);
                break;
            }
        }
        this.tablePlayer[sit] = null;
        return sit;
    }
    
    S2CSeat(pos:number):number{
        return pos;
    }

    reSort(localCard:number[]):number[]{
        let countMap = {}

        for (let index = 0; index < localCard.length; index++) {
            let card = this.Card(localCard[index]);
            let key = countMap[card.v];
            if (key == null){
                countMap[card.v] = [];
            }
            countMap[card.v].push(localCard[index]);
        }


        let newlocalCard:number[] = [];
        for (let io = 4; io > 0; io--) {
            for (let index = 3; index < 18; index++) {
                if(countMap[index] != null && countMap[index].length == io){
                    newlocalCard = newlocalCard.concat(countMap[index]);
                }
            }
        }
       return newlocalCard;
    }

    reSort10(localCard:number[]):number[]{
        let countMap = {}

        for (let index = 0; index < localCard.length; index++) {
            let card = this.Card(localCard[index]);
            let key = countMap[card.v];
            if (key == null){
                countMap[card.v] = [];
            }
            countMap[card.v].push(localCard[index]);
        }


        let newlocalCard:number[] = [];
 
        for (let index = 17; index > 2; index--) {
            newlocalCard = newlocalCard.concat(countMap[index]); 
        }
        
       return newlocalCard;
    }

    public makeCardMap(){
        this.cardMap = {};
        for (let index = 1; index < 14; index++) {
            let nn = index;
            if (nn < 3){
                nn = nn + 13;
            }
            let v = 1000+nn*10+CardType.HEI;
            this.cardMap[index] = v;
            this.cardMap[v] = index;
        }
        for (let index = 14; index < 27; index++) {
            let nn = index-13;
            if (nn < 3){
                nn = nn + 13;
            }
            let v = 1000+nn*10+CardType.HONG;
            this.cardMap[index] = v;
            this.cardMap[v] = index;
        }
        for (let index = 27; index < 40; index++) {
            let nn = index-26;
            if (nn < 3){
                nn = nn + 13;
            }
            let v = 1000+nn*10+CardType.MEI;
            this.cardMap[index] = v;
            this.cardMap[v] = index;
        }
        for (let index = 40; index < 53; index++) {
            let nn = index-39;
            if (nn < 3){
                nn = nn + 13;
            }
            let v = 1000+nn*10+CardType.FANG;
            this.cardMap[index] = v;
            this.cardMap[v] = index;
        }

        let xg = 1000+(16)*10+CardType.GUI;
        let dg = 1000+(17)*10+CardType.GUI;

        this.cardMap[53] = xg;
        this.cardMap[54] = dg;
        this.cardMap[xg] = 53;
        this.cardMap[dg] = 54;
        Log.d("cardMap",this.cardMap);
    }

    TransCard(value:number):number{
        return this.cardMap[value];
    }
    
    Card(value:number):any{
        let cardValue = value % 1000;
        let cardType = cardValue % 10;
        cardValue = Math.floor(cardValue / 10);
        // Log.d(cardType,cardValue);
        return {t:cardType,v:cardValue};
    }

    Sort(value:number[]):number[]{
        value.sort(function (A, B) {
            return B - A;
        })
        return value;      
    }

    CardValueStr(value:number):string{
        if(value == 17){
            return "大王";
        }
        if(value == 16){
            return "小王";
        }
        if(value == 15){
            return "2";
        }
        if(value == 14){
            return "A";
        }
        if(value == 13){
            return "K";
        }
        if(value == 12){
            return "Q";
        }
        if(value == 11){
            return "J";
        }
        return ""+value;
    }

    ToLoaclPos(p:number):number{
        let lpos = this.n2lPosMap[p];
        if(lpos == null){
            Log.e("ToLoaclPos:",p,JSON.stringify(this.n2lPosMap));
        }
        return lpos;
    }

    ToLocalCard(cards:number[]):number[]{
        let localCard:number[] = [];
        let localMap:any = {};
        for (let index = 0; index < cards.length; index++) {
            let l = this.cardMap[cards[index]];
            let cardValue = l % 1000;
            let cardType = cardValue % 10;
            cardValue = Math.floor(cardValue / 10);
            let key = localMap[cardValue];
            if (key == null){
                localMap[cardValue] = [];
            }
            localMap[cardValue].push(l);
        }

        for (let zs = 4; zs > 0; zs--) {
            for (let index = 3; index < 18; index++) {     
                if(localMap[index] != null){
                    if (localMap[index].length==zs){
                        localCard = localCard.concat(localMap[index]);
                    }
                }     
            }
        }
        Log.d("ToLocalCard:",JSON.stringify(cards),JSON.stringify(localCard));
        return localCard; 
    }

    getGender(pos:number):any{
        let sex = this.tablePlayer[pos].player.attrs[PlayerAttr.PA_Gender]; 
        if(sex == null){
            sex = Manager.utils.rand(1,2);
            if(!Manager.platform.isTestPkg()){
                this.tablePlayer[pos].player.attrs[PlayerAttr.PA_Gender] = sex;
            }else{
                Manager.tips.debug("玩家["+this.tablePlayer[pos].player.name+ "]性别数据为空,随机一个性别:"+sex);
            }
        }
        return sex;
    }

    PlayQdz(pos:number,wq:boolean=false){
        let sex = this.getGender(pos); 
        // gd.setPlayerAttr(PlayerAttr.PA_Gender,data.sex);
        let index = 3;
        if(!wq){
            index = Manager.utils.rand(1,3);
        }
        let file = "QDZ_" + index + "_" + sex;
        this.PlayEffect(file);
    }

    PlayJdz(pos:number){
        let sex = this.getGender(pos); 
        // gd.setPlayerAttr(PlayerAttr.PA_Gender,data.sex);
        // let index = Manager.utils.rand(1,3);
        let file = "JDZ_" + "" + sex;
        this.PlayEffect(file);
    }

    PlayBj(pos:number){
        let sex = this.getGender(pos); 
        // gd.setPlayerAttr(PlayerAttr.PA_Gender,data.sex);
        let index = Manager.utils.rand(1,3);
        let file = "BJ_1_" + sex;
        this.PlayEffect(file);
    }

    PlayBq(pos:number){
        let sex = this.getGender(pos); 
        // gd.setPlayerAttr(PlayerAttr.PA_Gender,data.sex);
        // let index = Manager.utils.rand(1,3);
        let file = "BQ_" + sex;
        this.PlayEffect(file);
    }

    PlayJB(pos:number){
        let sex = this.getGender(pos); 
        // gd.setPlayerAttr(PlayerAttr.PA_Gender,data.sex);
        // let index = Manager.utils.rand(1,3);
        let file = "JB_" + sex;
        this.PlayEffect(file);
    }
    PlayCJJB(pos:number){
        let sex = this.getGender(pos); 
        // gd.setPlayerAttr(PlayerAttr.PA_Gender,data.sex);
        // let index = Manager.utils.rand(1,3);
        let file = "CJJB_" + sex;
        this.PlayEffect(file);
    }
    
    PlayBJB(pos:number){
        let sex = this.getGender(pos); 
        // gd.setPlayerAttr(PlayerAttr.PA_Gender,data.sex);
        // let index = Manager.utils.rand(1,3);
        let file = "BJB_" + sex;
        this.PlayEffect(file);
    }

    PlayPass(pos:number){
        let sex = this.getGender(pos); 
        // gd.setPlayerAttr(PlayerAttr.PA_Gender,data.sex);
        let index = Manager.utils.rand(1,3);
        // Log.d("PlayPass",pos,index,sex);
        let file = "Pass" + index +"_"+ sex;
        this.PlayEffect(file);
    }

    PlayBD(pos:number,count:number){
        let sex = this.getGender(pos); 
        // gd.setPlayerAttr(PlayerAttr.PA_Gender,data.sex);
        // let index = Manager.utils.rand(1,2);
        let file = "BD_" + count +"_"+ sex;
        this.PlayEffect(file);
        this.PlayEffect("ddz_jingbao");
    }

    PlaySingle(pos:number,num:number){
        let sex = this.getGender(pos); 
        // gd.setPlayerAttr(PlayerAttr.PA_Gender,data.sex);
        let index = Manager.utils.rand(1,2);
        let file = "dz" + num +"_"+ sex;
        // Log.d("PlayPass",pos,num,sex);
        this.PlayEffect(file);
    }

    PlayCard(pos:number,card:number[],ct:number){
        let sex = this.getGender(pos); 
        let num = this.Card(card[0]);
        let file = "";
        if(ct == DouCardType.DouCardType_Single){
            file = "dz" + num.v +"_"+ sex;
        }else if(ct == DouCardType.DouCardType_Pair){
            file = "dui" + num.v +"_"+ sex;
        }else if(ct == DouCardType.DouCardType_Third){
            file = "sange_" + num.v +"_"+ sex;
        }else if(ct == DouCardType.DouCardType_Bomb){
            file = "zhadan_"+ sex;
            this.PlaySpineZD(this.eftCenter);
        }else if(ct == DouCardType.DouCardType_Sequence){
            this.PlaySpineSZ(this.eft[pos]);
            file = "shunzi_"+ sex;
        }else if(ct == DouCardType.DouCardType_LinkPair){
            this.PlaySpineLD(this.eft[pos]);
            file = "Liandui_"+ sex;
        }else if(ct == DouCardType.DouCardType_Airplane){
            this.PlaySpineFJ(this.eftCenter);
            file = "Feiji_"+ sex;
        }else if(ct == DouCardType.DouCardType_ThirdSingle){
            file = "sandaiyi_"+ sex;
        }else if(ct == DouCardType.DouCardType_ThirdPair){
            file = "sandaiyidui_"+ sex;
        }else if(ct == DouCardType.DouCardType_AirplaneSingle){
            this.PlaySpineFJ(this.eftCenter);
            file = "Feiji_"+ sex;
        }else if(ct == DouCardType.DouCardType_AirplanePair){
            this.PlaySpineFJ(this.eftCenter);
            file = "Feiji_"+ sex;
        }else if(ct == DouCardType.DouCardType_BombSingle){
            file = "sidaier_"+ sex;  
        }else if(ct == DouCardType.DouCardType_BombPair){
            file = "sidailiangdui_"+ sex; 
        }else if(ct == DouCardType.DouCardType_Rocket){
            file = "wangzha_"+ sex;
            this.PlaySpineWZ(this.eftCenter);
        }else if(ct == DouCardType.DouCardType_BombLink){
            let len = card.length / 4;
            if(len < 0){
                len = 1;
            }
            if(len > 4){
                len = 4;
            }
            file = "sange" + len +"_"+ sex;
            this.PlaySpineZD(this.eftCenter,len);
        }
        this.PlayEffect(file);
        this.PlayEffect("ddz_chupai");
    }


    PlayEnd(re:boolean){
        if(re){
            this.PlayEffect("ddz_shengli_donghua");
        }else{
            this.PlayEffect("ddz_pochan");
        }
    }

    PlayClickCard(){
        this.PlayEffect("ddz_xuanpai");
    }

    PlayDJS(){
        this.PlayEffect("ddz_daojishi");
    }

    PlaySendCard(){
        this.PlayEffect("ddz_fapai");
    }


    PlayEffect(path:string){
        Manager.globalAudio.playEffect("sound/"+path,Config.BUNDLE_DDZ);
    }


    // PlaySpineCT(){
    //     this.PlaySpine(this.eftCenter,"dzz_ct","ani");
    // }

    
    PlaySpineCTResult(isWin:boolean){
        this.eftCenter._onLoad = function(){
                let sp = <sp.Skeleton>this.eftCenter.content;
                sp.setCompleteListener(function(){
                    // l.playing = false;
                    this.eftCenter.loop = false;
                    this.eftCenter.visible = false;
                    this.PlayResult(isWin);
                }.bind(this));
                this.eftCenter.visible = true;
                this.eftCenter.loop = false;
                this.eftCenter.skinName = "default";
                this.eftCenter.animationName = "ani";
            }.bind(this);
        this.eftCenter.visible = true;
        this.eftCenter.icon = fgui.UIPackage.getItemURL(DdzView.getViewPath().pkgName,"dzz_ct"); 
    }

    PlayResult(isWin:boolean){
        if(isWin){
            this.PlaySpine(this.eftCenter,"ddz_sl","ani");
        }else{
            this.PlaySpine(this.eftCenter,"ddz_sl","ani2");
        }

    }

    PlaySpineFJ(l:fgui.GLoader3D){
        // l.icon = fgui.UIPackage.getItemURL(DdzView.getViewPath().pkgName,"ddz_fj"); 
        // l.skinName = "default";
        // l.animationName = "ddz_fj";
        // l._onLoad = function(){
        //     l.loop = false;
        //     let sp = <sp.Skeleton>l.content;
        //     sp.setCompleteListener(function(){
        //         l.visible = false;
        //     }.bind(this));
        //     l.visible = true;
        // }.bind(this);
        this.PlaySpine(l,"ddz_fj","ddz_fj");
        this.PlayEffect("ddz_feiji_fei");
    }

    PlaySpineSZ(l:fgui.GLoader3D){
        // l.icon = fgui.UIPackage.getItemURL(DdzView.getViewPath().pkgName,"ddz_ty"); 
        // l.skinName = "default";
        // l.animationName = "ddz_sz";
        // l._onLoad = function(){
        //     l.loop = false;
        //     let sp = <sp.Skeleton>l.content;
        //     sp.setCompleteListener(function(){
        //         l.visible = false;
        //     }.bind(this));
        //     l.visible = true;
        // }.bind(this);
        this.PlaySpine(l,"ddz_ty","ddz_sz");
    }

    PlaySpineLD(l:fgui.GLoader3D){
        // l.icon = fgui.UIPackage.getItemURL(DdzView.getViewPath().pkgName,"ddz_ty"); 
        // l.skinName = "default";
        // l.animationName = "ddz_ld";
        // l._onLoad = function(){
        //     l.loop = false;
        //     let sp = <sp.Skeleton>l.content;
        //     sp.setCompleteListener(function(){
        //         l.visible = false;
        //     }.bind(this));
        //     l.visible = true;
        // }.bind(this);
        this.PlaySpine(l,"ddz_ty","ddz_ld");
    }

    PlaySpineZD(l:fgui.GLoader3D,count:number=1){
        // l.icon = fgui.UIPackage.getItemURL(DdzView.getViewPath().pkgName,"ddz_zd"); 
        // l.skinName = "default";
        // l.animationName = "ddz_zd";
        // l._onLoad = function(){
        //     l.loop = false;
        //     let sp = <sp.Skeleton>l.content;
        //     sp.setCompleteListener(function(){
        //         l.visible = false;
        //     }.bind(this));
        //     l.visible = true;
        // }.bind(this);

        
        this.zdEft.visible = true;
        Log.d("PlaySpineZD:",this.zdEft,this.zdSx,this.zdSy,this.eftCenter.x,this.eftCenter.y);
        this.zdEft.setPosition(this.zdSx,this.zdSy);
        fgui.GTween.to2(this.zdSx,this.zdSy,this.eftCenter.x,this.eftCenter.y,0.3).setTarget(this.zdEft,this.zdEft.setPosition)
        .onComplete(()=>{
            fgui.GTween.delayedCall(0.1).setTarget(this.zdEft).onComplete(()=>{
                this.PlaySpine(l,"ddz_zd","ddz_zd"+count);
                this.PlayEffect("ddz_zhadan");
            })
            this.zdEft.visible = false;
        })
    }

    PlaySpineWZ(l:fgui.GLoader3D){
        // l.icon = fgui.UIPackage.getItemURL(DdzView.getViewPath().pkgName,"ddz_zd"); 
        // l.skinName = "default";
        // l.animationName = "ddz_zd";
        // l._onLoad = function(){
        //     l.loop = false;
        //     let sp = <sp.Skeleton>l.content;
        //     sp.setCompleteListener(function(){
        //         l.visible = false;
        //     }.bind(this));
        //     l.visible = true;
        // }.bind(this);
        this.PlaySpine(l,"ddz_wz","ani");
        this.PlayEffect("ddz_zhadan");
    }

    PlaySpine(l:fgui.GLoader3D,fileName:string,ani:string){
        l._onLoad = function(){
            let sp = <sp.Skeleton>l.content;
            sp.setCompleteListener(function(){
                // l.playing = false;
                l.loop = false;
                l.visible = false;
            }.bind(this));
            l.visible = true;
            l.loop = false;
            l.skinName = "default";
            l.animationName = ani;
        }.bind(this);
        l.icon = fgui.UIPackage.getItemURL(DdzView.getViewPath().pkgName,fileName); 
    }
}

export namespace CardType {
    export const GUI = 5;
    export const HEI = 4;
    export const HONG = 3;
    export const MEI = 2;
    export const FANG = 1;

    export const ValueMax = 15;
    export const ValueMin = 1;
}

export enum GameStep {
    Wait = 1,
    SendCard = 2,
    QiangDz = 3, 
    JiaBei = 4,
    Game = 5,
    GameEnd = 6,
}