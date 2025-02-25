import { DouCardType } from "../../../../scripts/def/GameEnums";
import { ProtoDef } from "../../../../scripts/def/ProtoDef";
import { DdzData } from "../data/DdzData";
import DdzView from "./DdzView";

export default class PlayerCards {
    private root:fgui.GComponent = null;
    private view:DdzView = null;

    private cardWidth:number=0;
    private lineGap:number=0;
    private cardTouchWidth:number=0;
    private sendIndex:number=0;
    private defaultY:number=93;
    private isTidyCard:boolean = false;

    private lastMoveObj:fgui.GObject = null;
    
    private cardData:number[] = [];
    private svCardData:number[] = [];
    private sendData:number[] = [];

    private cardCountMap:any = {};

    private groupCount = 0;

    private list:fgui.GList = null;

    private addIndex:number = 0;

    private cardScale:number=1.2;

    public constructor(view:DdzView){
        this.view = view;
        this.root = this.view.root.getChild("player_cards").asCom;
        this.init();
    }

    init(){

        this.view.root.getChild("lucencylayer").onClick(this.onClickLucency,this);

        this.list = this.root.asList;
        this.lineGap = this.list.columnGap;
        this.cardWidth = this.list.getChildAt(0).width;
        this.cardTouchWidth = this.cardWidth + this.lineGap;
        Log.d("PlayerCards:", this.lineGap, this.cardWidth,this.cardTouchWidth,this.list);
        this.list.on(fgui.Event.CLICK_ITEM, this.onClickCard, this);
        this.list.on(fgui.Event.TOUCH_BEGIN, this.onMoveBeginCard, this);
        this.list.on(fgui.Event.TOUCH_MOVE, this.onMoveCard, this);
        this.list.on(fgui.Event.TOUCH_END, this.onMoveEndCard, this);
        this.initCard();
    }

    setServerCard(d:number[]){
        this.svCardData = d;
        // this.svCardData = [3,3,4,4,5,5,6,7,7,8,8,9,9,10,10,11,11];
        // this.svCardData = [3,3,3,4,4,4,6,7,7,8,8,9,9,10,10,11,11];
        // this.svCardData = [4,4,4,4,5,5,5,5,6,6,6,6,9,9,9,9,12];
        let dd = Manager.dataCenter.get(DdzData);
        for (let index = 0; index < this.svCardData.length; index++) {
            this.sendData.push(dd.cardMap[this.svCardData[index]]);
        }
        this.view.updateJpq(this.sendData);
        Log.d(this.svCardData);
        Log.d(this.sendData);
        this.sendData.sort(function() { return 0.5 - Math.random();})
        this.isTidyCard = false;
        Log.d(this.sendData);
    }

    private showBombEft(){
        if(this.cardData == null || this.cardData.length == 0){
            return;
        }
        let cm = {};
        let cards = [];
        for (let index = 0; index < this.cardData.length; index++) {
            let cardValue = this.cardData[index] % 1000;
            cardValue = Math.floor(cardValue / 10);
            let key = cm[cardValue];
            if (key == null){
                cm[cardValue] = [];
            }
            cm[cardValue].push(this.cardData[index]);
        }
        for (let index = 3; index < 16; index++) {
            if(cm[index] != null && cm[index].length == 4){
                cards = cards.concat(cm[index]);
            }
        }

        if (cards[16] != null && cards[17] != null) {
            cards.push(1165);
            cards.push(1175);
        }
        Log.d("cards bombs:",cards);
        this.showEft(cards);
    }

    private showEft(cards:number[]){
        for (let index = 0; index < this.list._children.length; index++) {
            let com = this.list._children[index].asCom;
            if (this.inCards(com.data,cards)){
                this.view.setCardList(com,true);
            }
        }
    }

    private inCards(c,cards:number[]):boolean{
        for (let index = 0; index < cards.length; index++) {
            if(c == cards[index]){
                return true;
            }
        }
        return false;
    }
    

    refreshCard(d:number[]){
        this.svCardData = d;
        let dd = Manager.dataCenter.get(DdzData);
        this.cardData = [];
        this.sendData = [];
        for (let index = 0; index < this.svCardData.length; index++) {
            this.cardData.push(dd.cardMap[this.svCardData[index]]);
            this.list.addItemFromPool();
        }
        this.onTidyCard();
    }

    outCard(card:number[]){
        let dd = Manager.dataCenter.get(DdzData);
        let tempCard = this.cardData.concat();
        for (let index = 0; index < card.length; index++) {
            let index1 = tempCard.indexOf(dd.cardMap[card[index]]);
            if (index1!=-1){
                tempCard.splice(index1,1);
            }
        }
        this.cardData = tempCard;

        this.list.removeChildrenToPool();
        for (let index = 0; index < this.cardData.length; index++) {
            let cardValue = this.cardData[index] % 1000;
            let cardType = cardValue % 10;
            cardValue = Math.floor(cardValue / 10);
            // Log.d(this.cardData[index],cardType,cardValue);
            let com = this.list.addItemFromPool().asCom;
            com.scaleX =this.cardScale;
            com.scaleY =this.cardScale;
            com.data = this.cardData[index];
            let item = com.getChild("item").asCom;
            this.view.setCardData(com,cardValue,cardType,this.view.dizhuIndex == 0);
            item.y = this.defaultY;
        }
    }

    addCard(){
        if(this.sendData == null || this.sendData.length == 0){
            return;
        }
        // this.addIndex = 0;
        // let com = this.list._children[this.addIndex].asCom;
        let com = this.list.addItemFromPool().asCom;
        // this.addIndex +=1;
        com.visible = false;
        com.scaleX =this.cardScale;
        com.scaleY =this.cardScale;
        fgui.GTween.delayedCall(0.01).setTarget(com).onComplete(function(gt:fgui.GTweener){
            gt.target.visible = true;
        }.bind(this));
        let item = com.getChild("item").asCom;
        this.setItemBack(item,true);
        let cd = this.sendData.pop();
        let dd = Manager.dataCenter.get(DdzData);
        let cardTV = dd.Card(cd);
        this.view.setCardData(com,cardTV.v,cardTV.t,this.view.dizhuIndex == 0);
        this.cardData.push(cd);
        com.data = cd;
        let t1 = com.getTransition("t1");
        let t0 = com.getTransition("t0");
        t1.setHook("flip",function () {
            this.setItemBack(item,false);
        }.bind(this));
        t1.play(function() {
            t0.playReverse(function () {
                if(this.list._children.length >= 17){
                    this.tidyCard();
                }
            }.bind(this));
        }.bind(this));
    }
    
    tidyCard(){
        if (this.isTidyCard){
            return;
        }
        this.isTidyCard = true;
        let t = this.view.root.getTransition("tidyCard");
        t.setHook("tidy",this.onTidyCard.bind(this));
        t.play(()=>{
            // this.showBombEft();
        });
    }

    // union.sort(function (A, B) {
    //     return A - B;
    // });
    onTidyCard(){
        // Log.d(this.cardData);
        this.cardData.sort(function (A, B) {
            return B - A;
        })
        this.list.align = fgui.AlignType.Center;
        for (let index = 0; index < this.cardData.length; index++) {
            let cardValue = this.cardData[index] % 1000;
            let cardType = cardValue % 10;
            cardValue = Math.floor(cardValue / 10);
            // Log.d(this.cardData[index],cardType,cardValue);
            let com = this.list.getChildAt(index).asCom;
            com.data = this.cardData[index];
            let item = com.getChild("item").asCom;
            this.view.setCardData(com,cardValue,cardType,this.view.dizhuIndex == 0);
        }
    }

    setItemBack(item:fgui.GComponent,v:boolean){
        this.view.setItemBack(item,v);
        // item.getChild("back").visible = v;
        // item.getChild("mask").visible = false;
    }

    setListalign(a:fgui.AlignType){
        this.list.align = a;
    }

    showDz(){
        for (let index = 0; index < this.list._children.length; index++) {
            let com = this.list._children[index].asCom;
            let item = com.getChild("item").asCom;
            item.getChild("dz").visible = true;
        }
    }

    clearCard(){
        // Log.e("-----------------clearCardclearCardclearCardclearCard");
        for (let index = 0; index < this.list._children.length; index++) {
            let com = this.list.getChildAt(index).asCom;
            com.getTransition("t0").stop(true);
            com.getTransition("t1").stop(true);
            com.getTransition("t2").stop(true);
            com.getTransition("t3").stop(true);
            com.scaleX =this.cardScale;
            com.scaleY =this.cardScale;
            let item = com.getChild("item").asCom;
            item.scaleX = 1;
            item.y = this.defaultY;
            // fgui.GTween.kill(com,false);
        }
        this.list.removeChildrenToPool();
        // this.addIndex = 0;
        // for (let index = 0; index < 17; index++) {
        //     this.list.addItemFromPool().visible = false;;
        // }
        this.sendIndex = 0;
        this.isTidyCard = false;
        this.cardData = [];
        this.svCardData = [];
        this.sendData = [];
        this.list.align = fgui.AlignType.Left;
        // this.setListalign(fgui.AlignType.Left);
    }

    initCard(){
        for (let index = 0; index < this.list._children.length; index++) {
            let com = this.list._children[index].asCom;
            let item = com.getChild("item").asCom;
            item.getChild("mask").visible = false;
        }
    }

    onClickLucency(){
        for (let index = 0; index < this.list._children.length; index++) {
            let com = this.list._children[index].asCom;
            let item = com.getChild("item").asCom;
            this.resetCard(com);
            item.getChild("mask").visible = false;
        }
    }

    onClickCard(com: fgui.GComponent){
        this.moveCard(com);
        let dd = Manager.dataCenter.get(DdzData);
        dd.PlayClickCard();
        Log.d("onClickCard:",com);
    }

    onMoveBeginCard(evt: fgui.Event){
        this.lastMoveObj = null;
        evt.captureTouch();
    }

    onMoveCard(evt: fgui.Event){
        // Log.d("onMoveCard:", evt.pos.x);
        let com = this.findItem(evt.pos.x);
        if (com == this.lastMoveObj){
            return;
        }
        if (com){
            let item = com.getChild("item").asCom;
            item.getChild("mask").visible = !item.getChild("mask").visible;
            this.lastMoveObj = com;
        }
    }

    onMoveEndCard(evt: fgui.Event){
        let isHave = false;
        for (let index = 0; index < this.list._children.length; index++) {
            let com = this.list._children[index].asCom;
            let item = com.getChild("item").asCom;
            if (item.getChild("mask").visible){
                this.moveCard(com);
                isHave = true;
            }
            item.getChild("mask").visible = false;
        }
        if(isHave){
            let dd = Manager.dataCenter.get(DdzData);
            dd.PlayClickCard();
        }
    }

    findItem(x:number):fgui.GComponent{
        x = x-this.list._container.x - this.list.width / 2 - this.cardWidth - this.lineGap/2;
        for (let index = 0; index < this.list._children.length; index++) {
            let w = this.cardTouchWidth;
            if (index == this.list._children.length){
                w = this.cardWidth;
            }
            if (x > this.list._children[index].x && x < this.list._children[index].x+w){
                return this.list._children[index].asCom;
            }
        }
        return null;
    }

    width():number{
        return this.list._children.length * this.lineGap + 80;
    }

    curPosition():cc.Vec2{
        // this.
        let p = cc.v2(this.list.x - this.cardWidth + this.sendIndex * this.cardTouchWidth + this.cardWidth,this.list.y-33);
        this.sendIndex=this.sendIndex+1;
        // Log.d("curPosition:",p.x,p.y);
        return p;
        // if (this.list._children.length==0){
        //     return cc.v2(this.list.width / 2 + this.list.x - this.cardWidth / 2,this.list.y);
        // }

        // return cc.v2(this.list._children.length*this.lineGap - this.list._alignOffset.x + this.list.x,this.list.y);
    }

    moveCard(com:fgui.GComponent){
        let item = com.getChild("item").asCom;
        let t = com.getTransition("t0");
        if (t.playing){
            return;
        }
        Log.d(item.y , this.defaultY)
        if (item.y >= this.defaultY){
            t.play();
        }else{
            t.playReverse();
        }
    }

    resetCard(com:fgui.GComponent){
        let item = com.getChild("item").asCom;
        let t = com.getTransition("t0");
        if (t.playing){
            return;
        }
        if (item.y >= this.defaultY){

        }else{
            t.playReverse();
        }
    }

    getSelectCard():number[]{
        let selectCard:number[] = [];
        let dd = Manager.dataCenter.get(DdzData);
        for (let index = 0; index < this.list._children.length; index++) {
            let com = this.list._children[index].asCom;
            let item = com.getChild("item").asCom;
            // Log.d(index,item.y,this.defaultY,dd.cardMap[com.data],item.y < this.defaultY);
            if (item.y < this.defaultY){
                selectCard.push(dd.cardMap[com.data]);
            }
        }
        // Log.e("getSelectCard:",selectCard);
        return selectCard;
    }

    private aaaaData = [];
    private aaaData = [];
    private aaData = [];
    private aData = [];
    private waData = [];
    private lzData = [];
    private twoData = [];
    private sendGroup = [];
    private sendGroupWeight:number[] = [];
    private curWeight:number=0;

    private maxWeightIndex:number = -1;
    private minCountIndex:number = -1;

    private maxWeight:number = -1;
    private minCount:number = 20;

    private groupIndex:number = 0;

    public isGroup = false;

    private curGroup:any[] = null;


    upCard(cards:number[]){
        for (let li = 0; li < this.list._children.length; li++) {
            let child = this.list._children[li].asCom;
            child.getChild("item").y = this.defaultY;
        }
        for (let index = 0; index < cards.length; index++) {
            for (let li = 0; li < this.list._children.length; li++) {
                let child = this.list._children[li].asCom;
                if(child.data == cards[index]){
                    this.moveCard(child);
                    break;
                }
            }
        }
    }

    groupTypeCard(lastCard:pb.S2CDouPlayCards){
        if(this.isGroup){
            return;
        }

        let dd = Manager.dataCenter.get(DdzData);
        Log.d("server card:",lastCard.cards);
        let localCard = dd.ToLocalCard(lastCard.cards);
        Log.d("server localCard:",localCard);

        this.isGroup = true;
        this.groupIndex = 0;
        this.initPriorityData();
        this.curGroup = [];
        let cv = localCard[0];
        let cardInfo = dd.Card(localCard[0]);
        if(lastCard.cardType == DouCardType.DouCardType_Single){
            for (let count = 1; count < 4; count++) { 
                for (let index = 3; index < 18; index++) {
                    if(cardInfo.v < index){
                        if(this.cardCountMap[index] != null && this.cardCountMap[index].length == count){
                            this.curGroup.push([this.cardCountMap[index][0]]);
                        }
                    }
                }
            }
            for (let index = 3; index < 18; index++) {
                if(this.cardCountMap[index] != null){
                    if(this.cardCountMap[index].length == 4){
                        this.curGroup.push(this.cardCountMap[index]);
                    }
                }
            }
            if(this.waData.length == 2){
                this.curGroup.push(this.waData);
            }
        }else if(lastCard.cardType == DouCardType.DouCardType_Pair){
            // let cv = dd.cardMap[lastCard.cards[0]];
            for (let count = 2; count < 4; count++) {  
                for (let index = 3; index < 18; index++) {
                    if(cardInfo.v < index){
                        if(this.cardCountMap[index] != null){
                            if(this.cardCountMap[index].length == count){
                                let dataArray = [];
                                for (let mi = 0; mi < 2; mi++) {
                                    let data = this.cardCountMap[index][mi];
                                    dataArray.push(data);
                                }
                                if(dataArray.length == 2){
                                    this.curGroup.push(dataArray);
                                }
                            }
                        }
                    }
                }
            }

            for (let index = 3; index < 18; index++) {
                if(this.cardCountMap[index] != null){
                    if(this.cardCountMap[index].length == 4){
                        this.curGroup.push(this.cardCountMap[index]);
                    }
                }
            }
            if(this.waData.length == 2){
                this.curGroup.push(this.waData);
            }
        }else if(lastCard.cardType == DouCardType.DouCardType_Third){
            // let cv = dd.cardMap[lastCard.cards[0]];
            for (let index = 3; index < 18; index++) {
                if(cardInfo.v < index){
                    if(this.cardCountMap[index] != null){
                        if(this.cardCountMap[index].length == 3){
                            let dataArray = [];
                            for (let mi = 0; mi < 3; mi++) {
                                let data = this.cardCountMap[index][mi];
                                dataArray.push(data); 
                            }
                            if(dataArray.length == 3){
                                this.curGroup.push(dataArray);
                            }
                        }
                    }
                }
            }
            for (let index = 3; index < 18; index++) {
                if(this.cardCountMap[index] != null){
                    if(this.cardCountMap[index].length == 4){
                        this.curGroup.push(this.cardCountMap[index]);
                    }
                }
            }
            if(this.waData.length == 2){
                this.curGroup.push(this.waData);
            }
        }else if(lastCard.cardType == DouCardType.DouCardType_Bomb){
            // let cv = dd.cardMap[lastCard.cards[0]];
            for (let index = 3; index < 18; index++) {
                if(cardInfo.v < index){
                    if(this.cardCountMap[index] != null){
                        if(this.cardCountMap[index].length >= 4){
                            let dataArray = [];
                            for (let mi = 0; mi < 4; mi++) {
                                let data = this.cardCountMap[index][mi];       
                                dataArray.push(data);   
                            }
                            if(dataArray.length == 4){
                                this.curGroup.push(dataArray);
                            }
                        }
                    }
                }
            }
            if(this.waData.length == 2){
                this.curGroup.push(this.waData);
            }
        }else if(lastCard.cardType == DouCardType.DouCardType_Sequence){
            this.aData = [];
            // let cv = dd.cardMap[lastCard.cards[0]];
            for (let index = 3; index < 15; index++) {
                if(this.cardCountMap[index] != null){
                    if (this.cardCountMap[index].length>=1 && this.cardCountMap[index].length<4){
                        if(this.cardCountMap[index][0] > cv){
                            this.aData.push([this.cardCountMap[index][0]]);
                        }
                    }
                }
            }
            let tempGroup1 = [];
            //顺子
            for (let i0 = 0; i0 < this.aData.length; i0++) {
                let cs0 = this.aData[i0];
                let c0 = dd.Card(cs0[0]);
                // Log.d("i0--",i0);
                let tempGroup = [];
                tempGroup.push(this.aData[i0][0])
                let isLink = true;
                let cindex = i0+1;
                for (let i1 = cindex; i1 < this.aData.length; i1++) {
                    let cs1 = this.aData[i1];
                    let c1 = dd.Card(cs1[0]);
                    cindex = i1;
                    if (c1.v - c0.v == 1){
                        tempGroup.push(cs1[0]); 
                        c0 = c1;
                        if(tempGroup.length == lastCard.cards.length){
                            break;
                        }
                    }else{
                        isLink = false;
                        break;
                    }
                }
 
                if (tempGroup.length == lastCard.cards.length){
                    tempGroup1.push(tempGroup);
                    tempGroup = [];
                    // i0 = cindex;
                }
            }

            for (let index = 0; index < tempGroup1.length; index++) {
               if(tempGroup1[index].length >= lastCard.cards.length){
                    for (let c = 0; c < tempGroup1[index].length; c++) {
                        if(tempGroup1[index][c] > cv){
                            if(c+lastCard.cards.length <= tempGroup1[index].length){
                                let narr = tempGroup1[index].slice(c,c+lastCard.cards.length);
                                this.curGroup.push(narr);
                            }
                        }
                    }
                }
            }

            for (let index = 3; index < 18; index++) {
                if(this.cardCountMap[index] != null){
                    if(this.cardCountMap[index].length == 4){
                        this.curGroup.push(this.cardCountMap[index]);
                    }
                }
            }
            if(this.waData.length == 2){
                this.curGroup.push(this.waData);
            }
        }else if(lastCard.cardType == DouCardType.DouCardType_LinkPair){
            this.aaData = [];
            // let cv = dd.cardMap[lastCard.cards[0]];
            for (let index = 3; index < 15; index++) {
                if(this.cardCountMap[index] != null){
                    if (this.cardCountMap[index].length>=2 && this.cardCountMap[index].length<4){
                        if(this.cardCountMap[index][0] > cv){
                            this.aaData.push(this.cardCountMap[index]);
                        }
                    }
                }
            }

            let tempGroup1 = [];
            //连对
            for (let i0 = 0; i0 < this.aaData.length; i0++) {
                let cs0 = this.aaData[i0];
                let c0 = dd.Card(cs0[0]);
                // Log.d("i0--",i0);
                let tempGroup = this.aaData[i0].slice(0,2); 
                let isLink = true;
                let cindex = i0+1;
                for (let i1 = cindex; i1 < this.aaData.length; i1++) {
                    let cs1 = this.aaData[i1];
                    let c1 = dd.Card(cs1[0]);
                    cindex = i1;
                    if (c1.v - c0.v == 1){
                        for (let child = 0; child < cs1.length; child++) {
                            tempGroup.push(cs1[child]);   
                        }
                        c0 = c1;
                        if(tempGroup.length == lastCard.cards.length){
                            break;
                        }
                    }else{
                        break;
                    }
                }

                if (tempGroup.length == lastCard.cards.length){
                    tempGroup1.push(tempGroup);
                }
            }
            
            for (let index = 0; index < tempGroup1.length; index++) {
               if(tempGroup1[index].length >= lastCard.cards.length){
                    for (let c = 0; c < tempGroup1[index].length; c++) {
                        if(tempGroup1[index][c] > cv){
                            if(c+lastCard.cards.length <= tempGroup1[index].length){
                                let narr = tempGroup1[index].slice(c,c+lastCard.cards.length);
                                this.curGroup.push(narr);
                            }
                        }
                    }
                }
            }

            for (let index = 3; index < 18; index++) {
                if(this.cardCountMap[index] != null){
                    if(this.cardCountMap[index].length == 4){
                        this.curGroup.push(this.cardCountMap[index]);
                    }
                }
            }
            if(this.waData.length == 2){
                this.curGroup.push(this.waData);
            }
        }else if(lastCard.cardType == DouCardType.DouCardType_Airplane){
            this.aaaData = [];
            // let cv = dd.cardMap[lastCard.cards[0]];
            for (let index = 3; index < 15; index++) {
                if(cardInfo.v < index){
                    if(this.cardCountMap[index] != null){
                        if (this.cardCountMap[index].length>=3){
                            if(this.cardCountMap[index][0] > cv){
                                this.aaaData.push(this.cardCountMap[index]);
                            }
                        }
                    }
                }
            }

            let tempGroup1 = [];
            //飞机
            for (let i0 = 0; i0 < this.aaaData.length; i0++) {
                let cs0 = this.aaaData[i0];
                let c0 = dd.Card(cs0[0]);
                // Log.d("i0--",i0);
                let tempGroup = this.aaaData[i0].slice(0,3); 
                let isLink = true;
                let cindex = i0+1;
                for (let i1 = cindex; i1 < this.aaaData.length; i1++) {
                    let cs1 = this.aaaData[i1];
                    let c1 = dd.Card(cs1[0]);
                    cindex = i1;
                    if (c1.v - c0.v == 1){
                        for (let child = 0; child < cs1.length; child++) {
                            tempGroup.push(cs1[child]);   
                        }
                        c0 = c1;
                        if(tempGroup.length == lastCard.cards.length){
                            break;
                        }
                    }else{
                        break;
                    }
                }

                if (tempGroup.length == lastCard.cards.length){
                    tempGroup1.push(tempGroup);
                }
            }
            
            for (let index = 0; index < tempGroup1.length; index++) {
               if(tempGroup1[index].length >= lastCard.cards.length){
                    for (let c = 0; c < tempGroup1[index].length; c++) {
                        if(tempGroup1[index][c] > cv){
                            if(c+lastCard.cards.length <= tempGroup1[index].length){
                                let narr = tempGroup1[index].slice(c,c+lastCard.cards.length);
                                this.curGroup.push(narr);
                            }
                        }
                    }
                }
            }

            for (let index = 3; index < 18; index++) {
                if(this.cardCountMap[index] != null){
                    if(this.cardCountMap[index].length == 4){
                        this.curGroup.push(this.cardCountMap[index]);
                    }
                }
            }
            if(this.waData.length == 2){
                this.curGroup.push(this.waData);
            }
        }else if(lastCard.cardType == DouCardType.DouCardType_ThirdSingle){
            // let cv = dd.cardMap[lastCard.cards[0]];
            let tempGroup = [];
            for (let index = 3; index < 18; index++) {
                if(cardInfo.v < index){
                    if(this.cardCountMap[index] != null){
                        if(this.cardCountMap[index].length == 3){
                            let dataArray = [];
                            for (let mi = 0; mi < 3; mi++) {
                                let data = this.cardCountMap[index][mi];
                                if(data > cv){
                                    dataArray.push(data);
                                }
                            }
                            if(dataArray.length == 3){
                                tempGroup.push(dataArray);
                            }
                        }
                    }
                }
            }

            for (let index = 0; index < tempGroup.length; index++) {
                let cdd = dd.Card(tempGroup[index]);
                let isFind = false;
                for (let aindex = 0; aindex < this.aData.length; aindex++) {
                    // Log.d(index,aindex);
                    let td = dd.Card(this.aData[aindex][0]);
                    // Log.d(cdd.v , td.v);
                    if(cdd.v != td.v){
                        tempGroup[index].push(this.aData[aindex][0]);
                        isFind = true;
                        break;
                    }   

                }

                if(!isFind){
                    for (let cd = this.cardData.length - 1; cd >= 0; cd--) {
                        let td = dd.Card(this.cardData[cd]);
                        if(cdd.v != td.v){
                            tempGroup.push(this.cardData[cd]);
                        }
                    }
                }
            }

            for (let index = 0; index < tempGroup.length; index++) {
                if(tempGroup[index].length == lastCard.cards.length){
                    this.curGroup.push(tempGroup[index]);
                }
            }


            for (let index = 3; index < 18; index++) {
                if(this.cardCountMap[index] != null){
                    if(this.cardCountMap[index].length == 4){
                        this.curGroup.push(this.cardCountMap[index]);
                    }
                }
            }
            if(this.waData.length == 2){
                this.curGroup.push(this.waData);
            }
        }else if(lastCard.cardType == DouCardType.DouCardType_ThirdPair){
            // let cv = dd.cardMap[lastCard.cards[0]];
            let tempGroup = [];
            for (let index = 3; index < 18; index++) {
                if(cardInfo.v < index){
                    if(this.cardCountMap[index] != null){
                        if(this.cardCountMap[index].length == 3){
                            let dataArray = [];
                            for (let mi = 0; mi < 3; mi++) {
                                let data = this.cardCountMap[index][mi];
                                if(data > cv){
                                    dataArray.push(data);
                                }
                            }
                            if(dataArray.length == 3){
                                tempGroup.push(dataArray);
                            }
                        }
                    }
                }
            }

            // Log.d("tempGroup:",tempGroup,this.aaData);
            for (let index = 0; index < tempGroup.length; index++) {
                let cdd = dd.Card(tempGroup[index][0]);
                let isFind = false;
                for (let aindex = 0; aindex < this.aaData.length; aindex++) {
                    Log.d(index,aindex,this.aaData[aindex][0],dd.Card(this.aaData[aindex][0]));
                    let td = dd.Card(this.aaData[aindex][0]);
                    if(cdd.v != td.v){
                        // Log.d("find",cdd.v , td.v,tempGroup[index]);
                        tempGroup[index] = tempGroup[index].concat(this.aaData[aindex]);
                        // Log.d("find",cdd.v , td.v,tempGroup[index]);
                        isFind = true;
                        break;
                    }   
                }
                if(!isFind){
                    for (let aindex = 0; aindex < this.aaaData.length; aindex++) {
                        // Log.d(index,aindex);
                        let td = dd.Card(this.aaaData[aindex][0]);
                        // Log.d(cdd.v , td.v);
                        if(cdd.v != td.v){
                            tempGroup[index] = tempGroup[index].concat(this.aaaData[aindex].slice(0,2));
                            break;
                        }   
                    }
                }
            }

            for (let index = 0; index < tempGroup.length; index++) {
                if(tempGroup[index].length == lastCard.cards.length){
                    this.curGroup.push(tempGroup[index]);
                }
            }


            for (let index = 3; index < 18; index++) {
                if(this.cardCountMap[index] != null){
                    if(this.cardCountMap[index].length == 4){
                        this.curGroup.push(this.cardCountMap[index]);
                    }
                }
            }
            if(this.waData.length == 2){
                this.curGroup.push(this.waData);
            }
        }else if(lastCard.cardType == DouCardType.DouCardType_AirplaneSingle){
            this.aaaData = [];
            // let cv = dd.cardMap[lastCard.cards[0]];
            for (let index = 3; index < 15; index++) {
                if(cardInfo.v < index){
                    if(this.cardCountMap[index] != null){
                        if (this.cardCountMap[index].length>=3){
                            if(this.cardCountMap[index][0] > cv){
                                this.aaaData.push(this.cardCountMap[index]);
                            }
                        }
                    }
                }
            }

            let tempGroup1 = [];
            let sl = lastCard.cards.length / 4;
            let fl = sl * 3;

            //飞机
            for (let i0 = 0; i0 < this.aaaData.length; i0++) {
                let cs0 = this.aaaData[i0];
                let c0 = dd.Card(cs0[0]);
                // Log.d("i0--",i0);
                let tempGroup = this.aaaData[i0].slice(0,3); 
                let isLink = true;
                let cindex = i0+1;
                for (let i1 = cindex; i1 < this.aaaData.length; i1++) {
                    let cs1 = this.aaaData[i1];
                    let c1 = dd.Card(cs1[0]);
                    cindex = i1;
                    if (c1.v - c0.v == 1){
                        for (let child = 0; child < cs1.length; child++) {
                            tempGroup.push(cs1[child]);   
                        }
                        c0 = c1;
                        if(tempGroup.length == fl){
                            break;
                        }
                    }else{
                        break;
                    }
                }
                
                if (tempGroup.length == fl){
                    tempGroup1.push(tempGroup);
                }
            }
            
            for (let index = 0; index < tempGroup1.length; index++) {
               if(tempGroup1[index].length >= fl){
                    for (let c = 0; c < tempGroup1[index].length; c++) {
                        if(tempGroup1[index][c] > cv){
                            if(c+fl <= tempGroup1[index].length){
                                let narr = tempGroup1[index].slice(c,c+fl);

                                let add = [];

                                for (let ai = 0; ai < this.aData.length; ai++) {
                                    add.push(this.aData[ai][0]);
                                    if(add.length == sl){
                                        break;
                                    }
                                }

                                
                                if(add.length < sl){
                                    add = [];
                                    for (let cd = this.cardData.length - 1; cd >= 0; cd--) {
                                        let td = dd.Card(this.cardData[cd]);
                                        let noteq = false;
                                        for (let narrindex = 0; narrindex < narr.length; narrindex++) {
                                            const cdd = dd.Card(narr[narrindex]);
                                            if(cdd.v == td.v){
                                                noteq = true;
                                            }
                                        }
                                        if(!noteq){
                                            add.push(this.cardData[cd]);
                                        }
                                        if(add.length == sl){
                                            break;
                                        }
                                    }
                                }

                                if(add.length == sl){
                                    narr = narr.concat(add);
                                }
                                if(narr.length == lastCard.cards.length){
                                 this.curGroup.push(narr);
                                }
                            }
                        }
                    }
                }
            }

            for (let index = 3; index < 18; index++) {
                if(this.cardCountMap[index] != null){
                    if(this.cardCountMap[index].length == 4){
                        this.curGroup.push(this.cardCountMap[index]);
                    }
                }
            }
            if(this.waData.length == 2){
                this.curGroup.push(this.waData);
            }
        }else if(lastCard.cardType == DouCardType.DouCardType_AirplanePair){
            this.aaaData = [];
            // let cv = dd.cardMap[lastCard.cards[0]];
            for (let index = 3; index < 15; index++) {
                if(cardInfo.v < index){
                    if(this.cardCountMap[index] != null){
                        if (this.cardCountMap[index].length>=3){
                            if(this.cardCountMap[index][0] > cv){
                                this.aaaData.push(this.cardCountMap[index]);
                            }
                        }
                    }
                }
            }

            let tempGroup1 = [];
            let sl = lastCard.cards.length / 5;
            let fl = sl * 3;

            //飞机
            for (let i0 = 0; i0 < this.aaaData.length; i0++) {
                let cs0 = this.aaaData[i0];
                let c0 = dd.Card(cs0[0]);
                // Log.d("i0--",i0);
                let tempGroup = this.aaaData[i0].slice(0,3); 
                let isLink = true;
                let cindex = i0+1;
                for (let i1 = cindex; i1 < this.aaaData.length; i1++) {
                    let cs1 = this.aaaData[i1];
                    let c1 = dd.Card(cs1[0]);
                    cindex = i1;
                    if (c1.v - c0.v == 1){
                        for (let child = 0; child < cs1.length; child++) {
                            tempGroup.push(cs1[child]);   
                        }
                        c0 = c1;
                        if(tempGroup.length == fl){
                            break;
                        }
                    }else{
                        break;
                    }
                }
                
                if (tempGroup.length == fl){
                    tempGroup1.push(tempGroup);
                }
            }
            
            for (let index = 0; index < tempGroup1.length; index++) {
               if(tempGroup1[index].length >= fl){
                    for (let c = 0; c < tempGroup1[index].length; c++) {
                        if(tempGroup1[index][c] > cv){
                            if(c+fl <= tempGroup1[index].length){
                                let narr = tempGroup1[index].slice(c,c+fl);

                                this.aaData = [];
                                for (let index4 = 3; index4 < 15; index4++) {
                                    if(this.cardCountMap[index4] != null){
                                        if (this.cardCountMap[index4].length>=2){
                                            let noteq = false;
                                            for (let narrindex = 0; narrindex < narr.length; narrindex++) {
                                                const cdd = dd.Card(narr[narrindex]);
                                                if(cdd.v == index4){
                                                    noteq = true;
                                                }
                                            }
                                            if(!noteq){
                                                this.aaData.push(this.cardCountMap[index4].slice(0,2));
                                            }                                    
                                        }
                                    }
                                }
                                let add = [];
                                if(this.aaData.length >= sl){
                                    for (let index = 0; index < this.aaData.length; index++) {
                                        add = add.concat(this.aaData[index]);
                                        if(add.length == sl*2){
                                            break;
                                        }
                                    }
                                }


                                if(add.length == sl*2){
                                    narr = narr.concat(add);
                                }
                                if(narr.length == lastCard.cards.length){
                                 this.curGroup.push(narr);
                                }
                            }
                        }
                    }
                }
            }

            for (let index = 3; index < 18; index++) {
                if(this.cardCountMap[index] != null){
                    if(this.cardCountMap[index].length == 4){
                        this.curGroup.push(this.cardCountMap[index]);
                    }
                }
            }
            if(this.waData.length == 2){
                this.curGroup.push(this.waData);
            }
        }else if(lastCard.cardType == DouCardType.DouCardType_BombSingle){
            // let cv = dd.cardMap[lastCard.cards[0]];
            let tempGroup = [];
            let tempGroupSrc = [];
            for (let index = 3; index < 18; index++) {
                if(cardInfo.v < index){
                    if(this.cardCountMap[index] != null){
                        if(this.cardCountMap[index].length >= 4){
                            let dataArray = [];
                            let dataArray1 = [];
                            for (let mi = 0; mi < 4; mi++) {
                                let data = this.cardCountMap[index][mi];
                                if(data > cv){
                                    dataArray.push(data);
                                    dataArray1.push(data);
                                }
                            }
                            if(dataArray.length == 4){
                                tempGroupSrc.push(dataArray1);
                                tempGroup.push(dataArray);
                            }
                        }
                    }
                }
            }
            for (let index = 0; index < tempGroup.length; index++) {
                let add = [];
                let ccv =  dd.Card(tempGroup[index][0]);
                for (let cd = this.cardData.length - 1; cd >= 0; cd--) {
                    let td = dd.Card(this.cardData[cd]);
                    if(this.cardCountMap[td.v] != null && this.cardCountMap[td.v].length == 4){
                        continue;
                    }
                    if(ccv.v != td.v){
                        add.push(this.cardData[cd]);
                    }
                    if(add.length == 2){
                        tempGroup[index] = tempGroup[index].concat(add);
                        break;
                    }
                }


                if(tempGroup[index].length == lastCard.cards.length){
                    this.curGroup.push(tempGroup[index]);  
                }
            }
            for (let index = 0; index < tempGroupSrc.length; index++) {
                this.curGroup.push(tempGroupSrc[index]);      
            }
            if(this.waData.length == 2){
                this.curGroup.push(this.waData);
            }
        }else if(lastCard.cardType == DouCardType.DouCardType_BombPair){
            // let cv = dd.cardMap[lastCard.cards[0]];
            let tempGroup = [];
            let tempGroupSrc = [];
            for (let index = 3; index < 18; index++) {
                if(cardInfo.v < index){
                    if(this.cardCountMap[index] != null){
                        if(this.cardCountMap[index].length >= 4){
                            let dataArray = [];
                            let dataArray1 = [];
                            for (let mi = 0; mi < 4; mi++) {
                                let data = this.cardCountMap[index][mi];
                                if(data > cv){
                                    dataArray.push(data);
                                    dataArray1.push(data);
                                }
                            }
                            if(dataArray.length == 4){
                                tempGroupSrc.push(dataArray1);
                                tempGroup.push(dataArray);
                            }
                        }
                    }
                }
            }

            this.aaData = [];
            for (let index4 = 3; index4 < 15; index4++) {
                if(this.cardCountMap[index4] != null){
                    if (this.cardCountMap[index4].length>=2 && this.cardCountMap[index4].length <= 3){
                        this.aaData.push(this.cardCountMap[index4].slice(0,2));                                 
                    }
                }
            }
            Log.e(this.aaData,this.cardCountMap);

            for (let index = 0; index < tempGroup.length; index++) {
       
                // Log.d(tempGroup,"---");
                for (let index1 = 0; index1 < this.aaData.length; index1++) {
                    tempGroup[index] = tempGroup[index].concat(this.aaData[index1]);
                    break;
                }
            
                if(tempGroup[index].length == lastCard.cards.length){
                    this.curGroup.push(tempGroup[index]);  
                }
            }
            for (let index = 0; index < tempGroupSrc.length; index++) {
                this.curGroup.push(tempGroupSrc[index]);      
            }
            if(this.waData.length == 2){
                this.curGroup.push(this.waData);
            }
        }else if(lastCard.cardType == DouCardType.DouCardType_Rocket){
            for (let i0 = 0; i0 < this.aaaaData.length; i0++) {
                let cs0 = this.aaaaData[i0];
                let c0 = dd.Card(cs0[0]);
                // Log.d("i0--",i0);
                let tempGroup = this.aaaaData[i0].slice(0,4); 
                let isLink = true;
                let cindex = i0+1;
                for (let i1 = cindex; i1 < this.aaaaData.length; i1++) {
                    let cs1 = this.aaaaData[i1];
                    let c1 = dd.Card(cs1[0]);
                    cindex = i1;
                    if (c1.v - c0.v == 1){
                        tempGroup = tempGroup.concat(cs1);
                        c0 = c1;
                        if(tempGroup.length == 8){
                            break;
                        }
                    }else{
                        break;
                    }
                }

                if (tempGroup.length == 8){
                    this.curGroup.push(tempGroup);
                }
            }
        }else if(lastCard.cardType == DouCardType.DouCardType_BombLink){
            // let cv = dd.cardMap[lastCard.cards[0]];
            for (let i0 = 0; i0 < this.aaaaData.length; i0++) {
                let cs0 = this.aaaaData[i0];
                if(cs0 <= cv){
                    continue;
                }
                let c0 = dd.Card(cs0[0]);
                // Log.d("i0--",i0);
                let tempGroup = this.aaaaData[i0].slice(0,4); 
                let isLink = true;
                let cindex = i0+1;
                for (let i1 = cindex; i1 < this.aaaaData.length; i1++) {
                    let cs1 = this.aaaaData[i1];
                    let c1 = dd.Card(cs1[0]);
                    cindex = i1;
                    if (c1.v - c0.v == 1){
                        tempGroup = tempGroup.concat(cs1);
                        c0 = c1;
                        if(tempGroup.length == 8){
                            break;
                        }
                    }else{
                        break;
                    }
                }

                if (tempGroup.length == 8){
                    this.curGroup.push(tempGroup);
                }
            }
        }

        Log.d("groupTypeCard curGroup:",this.curGroup);
    }

    getGroupCardCount():number{
        if(this.curGroup == null){
            return 0;
        }
        return this.curGroup.length;
    }
   
    getGroupCard():number[]{
        // Log.d("getGroupCard:",this.curGroup);
        // Log.d("groupIndex:",this.groupIndex);
        let c = this.curGroup[this.groupIndex];
        this.groupIndex++;
        if (this.groupIndex>=this.curGroup.length){
            this.groupIndex = 0;
        }
        // Log.d("groupIndex11:",this.groupIndex);
        return c;
    }

    groupCard(){
        if(this.isGroup){
            return;
        }
        this.isGroup = true;
        this.groupIndex = 0;
        this.maxWeightIndex = -1;
        this.minCountIndex = -1;
        this.maxWeight = -1;
        this.minCount = 20;

        this.groupCount = this.cardData.length;
        this.tryPriority1();
        this.sendGroupWeight.push(this.curWeight);
        this.tryPriority2();
        this.sendGroupWeight.push(this.curWeight);
        this.tryPriority3();
        this.sendGroupWeight.push(this.curWeight);
        this.tryPriority4();
        this.sendGroupWeight.push(this.curWeight);
        this.tryPriority5();
        this.sendGroupWeight.push(this.curWeight);

        this.curGroup = this.sendGroup[this.maxWeightIndex];
        if(this.sendGroup[this.maxWeightIndex].length > this.minCount){
            this.curGroup = this.sendGroup[this.minCountIndex];
        }
        Log.d("sendGroup",this.sendGroup);
        Log.d("sendGroupWeight",this.sendGroupWeight);
        Log.d("curGroup",this.curGroup);
    }

    filterAAAA(){
        //炸弹
        for (let index = 3; index < 15; index++) {
            if(this.cardCountMap[index] != null){
                if (this.cardCountMap[index].length==4){
                    this.aaaaData.push([].concat(this.cardCountMap[index]));
                    // this.cardCountMap[index] = null;
                    continue;
                }
            }
        }
    }


    filterAAA(){
        for (let index = 3; index < 15; index++) {
            if(this.cardCountMap[index] != null){
                if (this.cardCountMap[index].length==3){
                    this.aaaData.push([].concat(this.cardCountMap[index]));
                    // this.cardCountMap[index] = null;
                    continue;
                }
            }
        }
    }

    filterAA(){
        for (let index = 3; index < 15; index++) {
            if(this.cardCountMap[index] != null){
                if (this.cardCountMap[index].length==2){
                    this.aaData.push([].concat(this.cardCountMap[index]));
                    // this.cardCountMap[index] = null;
                    continue;
                }
            }
        }
    }

    filterA(){
        for (let index = 3; index < 15; index++) {
            if(this.cardCountMap[index] != null){
                if (this.cardCountMap[index].length==1){
                    this.aData.push([].concat(this.cardCountMap[index]));
                    // this.cardCountMap[index] = null;
                    continue;
                }
            }
        }
    }
    
    removeCard(filterTempGroup:any[],data:any[]){
        for (let index = 0; index < filterTempGroup.length; index++) {
            for (let aai = 0; aai < data.length; aai++) {
                let index1 = data[aai].indexOf(filterTempGroup[index]);
                // Log.d(index1,this.aaData[aai],filterTempGroup[index]);
                if (index1 != -1){
                    data[aai].splice(index1,1);
                }
                if (data[aai].length == 0){
                    data.splice(aai,1);
                }
            }
        }
    }

    tryPriorityAAAA(p1Group:any[]){
        // Log.e("tryPriorityAAAA",JSON.stringify(this.aaaaData));
        //炸弹
        for (let index = 0; index < this.aaaaData.length; index++) {
            p1Group.push(this.aaaaData[index]);    
            this.curWeight += 7;        
        }
    }

    tryPriorityAAA(p1Group:any[]){
        // Log.e("tryPriorityAAA",JSON.stringify(this.aaaData));
        // Log.e("tryPriorityAAA -- aa",JSON.stringify(this.aaData));
        let dd = Manager.dataCenter.get(DdzData);
        //三条
        let tempGroup = [];
        for (let i0 = 0; i0 < this.aaaData.length; i0++) {
            let cs0 = this.aaaData[i0];
            let c0 = dd.Card(cs0[0]);
            // Log.d("i0--",i0);
            tempGroup.push([].concat(this.aaaData[i0]))
            for (let i1 = i0+1; i1 < this.aaaData.length; i1++) {
                let cs1 = this.aaaData[i1];
                let c1 = dd.Card(cs1[0]);
                if (c1.v - c0.v == 1){
                    for (let child = 0; child < cs1.length; child++) {
                        tempGroup[tempGroup.length-1].push(cs1[child]);   
                    }
                    c0 = c1;
                    i0 = i1;
                }else{
                    break;
                }
            }
        }

        this.curWeight += tempGroup.length*3; 
        //飞机
        for (let index = 0; index < tempGroup.length; index++) {
            if(tempGroup[index].length == 4){
                continue
            }
            let c = tempGroup[index].length / 3;
            if (this.aData.length > 0 && this.aData.length >= c){
                let filterTempGroup = [] ;
                for (let i = 0; i < c; i++) {
                    tempGroup[index].push(this.aData[i][0]); 
                    filterTempGroup.push(this.aData[i][0]);
                    this.curWeight +=3;
                }
                this.removeCard(filterTempGroup,this.aData);
                continue;
            }

            if (this.aaData.length > 0 && this.aaData.length >= c){
                let filterTempGroup = [];
                for (let i = 0; i < c; i++) {
                    tempGroup[index].push(this.aaData[i][0]);
                    tempGroup[index].push(this.aaData[i][1]);
                    filterTempGroup.push(this.aaData[i][0]);
                    filterTempGroup.push(this.aaData[i][1]);
                    this.curWeight +=3;
                }
                this.removeCard(filterTempGroup,this.aaData);
                continue;
            }
        }
        for (let index = 0; index < tempGroup.length; index++) {
            if (tempGroup[index].length > 0 ){
                p1Group.push(tempGroup[index]);
            }
        }
        // Log.d("tryPriorityAAA tempGroup",JSON.stringify(tempGroup));
    }

    tryPriorityAABBCC(p1Group:any[]){
        // Log.e("tryPriorityAABBCC",JSON.stringify(this.aaData));
        let filterTempGroup = [] ;
        let dd = Manager.dataCenter.get(DdzData);
        // Log.e("aaData:",this.aaData);
        //连对
        for (let i0 = 0; i0 < this.aaData.length; i0++) {
            let cs0 = this.aaData[i0];
            let c0 = dd.Card(cs0[0]);
            // Log.d("i0--",i0);
            let tempGroup = []; 
            tempGroup.push(this.aaData[i0].concat())
            let isLink = true;
            let cindex = i0+1;
            for (let i1 = cindex; i1 < this.aaData.length; i1++) {
                let cs1 = this.aaData[i1];
                let c1 = dd.Card(cs1[0]);
                cindex = i1;
                if (c1.v - c0.v == 1){
                    for (let child = 0; child < cs1.length; child++) {
                        tempGroup[tempGroup.length-1].push(cs1[child]);   
                    }
                    c0 = c1;
                }else{
                    isLink = false;
                    break;
                }
            }
            if (tempGroup[tempGroup.length-1].length >= 6){
                for (let index = 0; index < tempGroup.length; index++) {
                    this.curWeight += 5;
                    p1Group.push(tempGroup[index]);
                    for (let ti = 0; ti < tempGroup[index].length; ti++) {
                        filterTempGroup.push(tempGroup[index][ti]);
                    }
                    // filterTempGroup.push(tempGroup[index]);
                }
                i0 = cindex-1;
            }
        }

        // Log.e("filterTempGroup:",filterTempGroup,this.aaData);
        for (let index = 0; index < filterTempGroup.length; index++) {
            for (let aai = 0; aai < this.aaData.length; aai++) {
                let index1 = this.aaData[aai].indexOf(filterTempGroup[index]);
                // Log.d(index1,this.aaData[aai],filterTempGroup[index]);
                if (index1 != -1){
                    this.aaData[aai].splice(index1,1);
                }
                if (this.aaData[aai].length == 0){
                    this.aaData.splice(aai,1);
                }
            }
        }
    }

    tryPriorityAA(p1Group:any[]){
        // Log.e("tryPriorityAA",JSON.stringify(this.aaData));
        //对子
        for (let i0 = 0; i0 < this.aaData.length; i0++) {
            if (this.aaData[i0].length == 2){
                p1Group.push(this.aaData[i0]);
                this.curWeight += 2;
            }
        }
        this.aaData = [];
    }

    tryPriorityABC(p1Group:any[]){
        // Log.e("tryPriorityABC",JSON.stringify(this.aData));
        let filterTempGroup = [];
        let dd = Manager.dataCenter.get(DdzData);
        //顺子
        for (let i0 = 0; i0 < this.aData.length; i0++) {
            let cs0 = this.aData[i0];
            let c0 = dd.Card(cs0[0]);
            // Log.d("i0--",i0);
            let tempGroup = [];
            tempGroup.push(this.aData[i0][0])
            let isLink = true;
            let cindex = i0+1;
            for (let i1 = cindex; i1 < this.aData.length; i1++) {
                let cs1 = this.aData[i1];
                let c1 = dd.Card(cs1[0]);
                cindex = i1;
                if (c1.v - c0.v == 1){
                    tempGroup.push(cs1[0]); 
                    c0 = c1;
                }else{
                    isLink = false;
                    break;
                }
            }
            // Log.e("tempGroup:",tempGroup);
            if (tempGroup.length >= 5){
                p1Group.push(tempGroup);
                this.curWeight += 4;
                for (let ti = 0; ti < tempGroup.length; ti++) {
                    filterTempGroup.push(tempGroup[ti]);
                }
                // Log.e("tempGroup1:",this,tempGroup);
                i0 = cindex-1;
            }
        }

        // Log.e("filterTempGroup:",filterTempGroup,this.aData);
        for (let index = 0; index < filterTempGroup.length; index++) {
            for (let ai = 0; ai < this.aData.length; ai++) {
                let index1 = this.aData[ai].indexOf(filterTempGroup[index]);
                // Log.d(index1,this.aaData[aai],filterTempGroup[index]);
                if (index1 != -1){
                    this.aData[ai].splice(index1,1);
                }
                if (this.aData[ai].length == 0){
                    this.aData.splice(ai,1);
                }
            }
        }
    }

    tryPriorityLeft(p1Group:any[]){
        //单牌
        for (let i0 = 0; i0 < this.aData.length; i0++) {
            if (this.aData[i0].length == 1){
                p1Group.push(this.aData[i0]);
                this.curWeight += 1;
            }
        }
        this.aData = [];

        if (this.waData.length > 0){
            p1Group.push(this.waData);
            if(this.waData.length == 2){
                this.curWeight += 7;
            }else{
                this.curWeight += 1;
            }
        }
        if (this.twoData.length > 0){
            p1Group.push(this.twoData);
            if (this.twoData.length == 4){
                this.curWeight += 7;
            }else{
                this.curWeight += this.twoData.length;
            }
        }
    }

    tryGroupCount(p1Group:any[],index:number){
        let l = 0;
        for (let index = 0; index < p1Group.length; index++) {
            l += p1Group[index].length;
        }
        if (this.groupCount != l){
            Log.e("group err ·················································index:",index,l,this.groupCount);
        }else{
            Log.d("group ok ·················································index:",index,l,this.groupCount);
        }
    }

    initPriorityData(){
        this.cardCountMap = {};
        this.aaaaData = [];
        this.aaaData = [];
        this.aaData = [];
        this.aData = [];
        this.waData = [];
        this.twoData = [];
        this.lzData = [];
        this.curWeight = 0;

        // this.cardData = [
        //     1114,
        //     1111,
        //     1103,
        //     1102,
        //     1101,
        //     1094,
        //     1091,
        //     1083,
        //     1064,
        //     1063,
        //     1061,
        //     1043,
        //     1042,
        //     1041,
        //     1033,
        //     1032,
        //     1031
        // ];   

        for (let index = 0; index < this.cardData.length; index++) {
            let cardValue = this.cardData[index] % 1000;
            let cardType = cardValue % 10;
            cardValue = Math.floor(cardValue / 10);
            let key = this.cardCountMap[cardValue];
            if (key == null){
                this.cardCountMap[cardValue] = [];
            }
            this.cardCountMap[cardValue].push(this.cardData[index]);
        }

        if (this.cardCountMap[16] != null) {
            this.waData.push(1165);
        }
        if (this.cardCountMap[17] != null) {
            this.waData.push(1175);
        }

        if (this.cardCountMap[15] != null) {
            this.twoData = this.cardCountMap[15];
        }

        //过滤连炸
        let lzIndex = -1;
        let lzDataCell = [];
        for (let index = 3; index < 14; index++) {
            let isFind = false;
            if(index - lzIndex == 1){
                if (this.cardCountMap[index] != null && this.cardCountMap[index].length==4){
                    lzDataCell = lzDataCell.concat(this.cardCountMap[index]);
                    Log.d("lzDataCell:",lzDataCell);
                    lzIndex = index;
                    isFind = true;
                }
            }
            if(!isFind || index == 13){
                if(lzDataCell.length >= 8){
                    this.lzData.push(lzDataCell);
                }
                lzDataCell = [];
                lzIndex = -1;
            }
            if(lzIndex == -1){
                if (this.cardCountMap[index] != null && this.cardCountMap[index].length==4){
                    lzIndex = index;
                    lzDataCell = lzDataCell.concat(this.cardCountMap[index]);
                }
            }
        }

        // Log.d("this.cardData",this.cardData);
        // Log.d("this.cardCountMap",this.cardCountMap);
        Log.d("this.lzData",this.lzData);
        this.filterAAAA();
        this.filterAAA();
        this.filterAA();
        this.filterA();

        // Log.d("AAAA",this.aaaaData);
        // Log.d("AAA",this.aaaData);
        // Log.d("AA",this.aaData);
        // Log.d("A",this.aData);
        // Log.d("2",this.twoData);
        // Log.d("G",this.waData);
    }

    tryPriority1(){
        this.initPriorityData();
        let p1Group = [];
        this.tryPriorityAAAA(p1Group);
        this.tryPriorityAAA(p1Group);
        this.tryPriorityAABBCC(p1Group);
        this.tryPriorityAA(p1Group);
        this.tryPriorityABC(p1Group);
        this.tryPriorityLeft(p1Group);
        this.tryGroupCount(p1Group,0);
        this.sendGroup.push(p1Group);
        if (p1Group.length < this.minCount){
            this.minCountIndex = this.sendGroup.length - 1;
            this.minCount = p1Group.length;
        }
        if (this.curWeight > this.maxWeight){
            this.maxWeight = this.curWeight;
            this.maxWeightIndex = this.sendGroup.length - 1;
        }
    }

    tryPriority2(){
        this.initPriorityData();
        let p2Group = [];
        this.tryPriorityAAAA(p2Group);
        this.tryPriorityAAA(p2Group);
        this.tryPriorityABC(p2Group);
        this.tryPriorityAABBCC(p2Group);
        this.tryPriorityAA(p2Group);
        this.tryPriorityLeft(p2Group);
        this.tryGroupCount(p2Group,1);

        this.sendGroup.push(p2Group);

    }

    tryPriority3(){
        this.initPriorityData();
        let p3Group = [];
  
        this.tryPriorityAAAA(p3Group);
        // Log.e("4",JSON.stringify(p3Group));
        this.tryPriorityAABBCC(p3Group);
        // Log.e("223344",JSON.stringify(p3Group));
        this.tryPriorityAA(p3Group);
        // Log.e("aa",JSON.stringify(p3Group));
        this.tryPriorityABC(p3Group);
        // Log.e("abc",JSON.stringify(p3Group));
        this.tryPriorityAAA(p3Group);
        // Log.e("aaa",JSON.stringify(p3Group));
        this.tryPriorityLeft(p3Group);
        // Log.e("left",JSON.stringify(p3Group));
        this.tryGroupCount(p3Group,2);

        this.sendGroup.push(p3Group);
    }

    tryPriority4(){
        this.initPriorityData();
        let p4Group = [];
        this.tryPriorityAAAA(p4Group);
        this.tryPriorityABC(p4Group);
        this.tryPriorityAAA(p4Group);
        this.tryPriorityAABBCC(p4Group);
        this.tryPriorityAA(p4Group);
        this.tryPriorityLeft(p4Group);
        this.tryGroupCount(p4Group,3);


        this.sendGroup.push(p4Group);

    }

    tryPriority5(){
        this.initPriorityData();
        let p5Group = [];
        this.tryPriorityABC(p5Group);
        this.tryPriorityAAAA(p5Group);
        this.tryPriorityAAA(p5Group);
        this.tryPriorityAABBCC(p5Group);
        this.tryPriorityAA(p5Group);
        this.tryPriorityLeft(p5Group);
        this.tryGroupCount(p5Group,4);
        this.sendGroup.push(p5Group)
    }

    private serverGroup:any = [];
    private serverGroupPair:any = [];
    private serverGroupSingle:any = [];
    public setServerGroup(group: pb.IDouCardGroup){
        Log.e("主动：",group);
        let dd = Manager.dataCenter.get(DdzData);
        dd.makeCardMap();
        let jsonStr = JSON.stringify(group);
        Log.e("DouCardGroup:",jsonStr);
        if(group == null){
            Log.e("DouCardGroup is null");
            return;
        }
        // return;
        this.serverGroup = [];
        this.serverGroupPair = [];
        this.serverGroupSingle = [];
        this.transformServerGroupPair(group.pair);
        this.transformServerGroupSingle(group.single);
        this.transformServerGroup(group.sequence);
        this.transformServerGroup(group.linkPair);
        this.transformServerGroupAirplane(group.airplane);
        this.transformServerGroupThird(group.third);
        this.transformServerGroup(group.bomb);
        this.transformServerGroup(group.bombLink);
        this.transformServerGroupJoker(group.joker);
        if(this.serverGroupPair.length > 0){
            Array.prototype.unshift.apply(this.serverGroup,this.serverGroupPair);                 
        }
        if(this.serverGroupSingle.length > 0){
            for (let index = this.serverGroupSingle.length-1; index >=0; index--) {
                Array.prototype.unshift.apply(this.serverGroup,[[this.serverGroupSingle[index]]])                
            }
        }
        this.curGroup = this.serverGroup;
        this.sendIndex = 0;
        Log.e("DouCardGroup",this.serverGroup);
    }

    private apendBomb(aaaa:boolean=true,wz:boolean=true,lz:boolean=true){
        Log.e("apendBomb:",this.aaaaData,this.curGroup);
        if(aaaa){
            if(this.aaaaData.length > 0){
                this.curGroup = this.curGroup.concat(this.aaaaData);
            }
        }
        if(wz){
            if(this.waData.length == 2){
                this.curGroup.push(this.waData);
            }
        }
        if(lz){
            if(this.lzData.length > 0){
                this.curGroup = this.curGroup.concat(this.lzData);
            }
        }
        Log.e("apendBomb end:",this.curGroup);
    }


    private transformServerGroup(dc:pb.IDouCards[]):any[]{
        let lcg = [];  
        let dd = Manager.dataCenter.get(DdzData);
        if(dc != null && dc.length > 0){
            for (let index = 0; index < dc.length; index++) {
                let si = dc[index];
                let lc = dd.ToLocalCard(si.cards);
                Log.d("DouCardGroup group ss",lc);
                lcg.push(lc)
            }
            this.serverGroup = this.serverGroup.concat(lcg);
            return lcg;
        }
        return null;
    }

    private transformServerGroupPair(dc:pb.IDouCards[]):any[]{
        let lcg = [];  
        let dd = Manager.dataCenter.get(DdzData);
        if(dc != null && dc.length > 0){
            for (let index = 0; index < dc.length; index++) {
                let si = dc[index];
                let lc = dd.ToLocalCard(si.cards);
                Log.d("DouCardGroup Pair ss",lc);
                lcg.push(lc)
            }
            this.serverGroupPair = this.serverGroupPair.concat(lcg);
            return lcg;
        }
        return null;
    }

    private transformServerGroupSingle(dc:number[]):any[]{
        let dd = Manager.dataCenter.get(DdzData);
        if(dc != null && dc.length > 0){
            this.serverGroupSingle = this.serverGroupSingle.concat(dd.ToLocalCard(dc));
            Log.d("DouCardGroup Single ss",this.serverGroupSingle);
            return this.serverGroupSingle;
        }
        return null;
    }

    
    private transformServerGroupJoker(dc:number[]):any[]{
        let dd = Manager.dataCenter.get(DdzData);
        if(dc != null && dc.length == 2){
            this.serverGroup.push(dd.ToLocalCard(dc));
            Log.d("DouCardGroup Joker ss",this.serverGroup);
            return this.serverGroup;
        }
        return null;
    }

    private transformServerGroupAirplane(dc:pb.IDouCards[]):any[]{
        let lcg = [];  
        let dd = Manager.dataCenter.get(DdzData);
        if(dc != null && dc.length > 0){
            for (let index = 0; index < dc.length; index++) {
                let si = dc[index];
                let lc = dd.ToLocalCard(si.cards);
                Log.d("DouCardGroup Airplane ss",lc);
                let len = Math.floor(si.cards.length / 3);
                let find = false;
                if(this.serverGroupSingle.length >= len){
                    for (let leni = 0; leni < len; leni++) {
                        lc.push(this.serverGroupSingle.pop());
                    }
                    find = true;
                }
                if(!find){
                    if(this.serverGroupPair.length >= len){
                        for (let leni = 0; leni < len; leni++) {
                            lc = lc.concat(this.serverGroupPair.pop());
                        }
                        find = true;
                    }
                }
                lcg.push(lc)
            }
            Log.d("setServerGroup.transformServerGroupAirplane",lcg);
            this.serverGroup = this.serverGroup.concat(lcg);
            return lcg;
        }
        return null;
    }

    private transformServerGroupThird(dc:pb.IDouCards[]):any[]{
        let lcg = [];  
        let dd = Manager.dataCenter.get(DdzData);
        if(dc != null && dc.length > 0){
            for (let index = 0; index < dc.length; index++) {
                let si = dc[index];
                let lc = dd.ToLocalCard(si.cards);
                let len = Math.floor(si.cards.length / 3);
                Log.d("DouCardGroup Third ss",lc);
                lcg.push(lc)
                let leftLen = len;
                if(this.serverGroupSingle.length >= len){
                    for (let leni = 0; leni < len; leni++) {
                        lc.push(this.serverGroupSingle.pop());
                        leftLen--;
                    }
                }
                if(leftLen > 0){
                    if(this.serverGroupPair.length >= leftLen){
                        for (let leni = 0; leni < leftLen; leni++) {
                            lc = lc.concat(this.serverGroupPair.pop());
                        }
                    }
                }
            }
            Log.d("setServerGroup.transformServerGroupThird",lcg);
            this.serverGroup = this.serverGroup.concat(lcg);
            return lcg;
        }
        return null;
    }

    // quickGroupTypeCard(lastCard:pb.S2CDouPlayCards){
    //     if(this.isGroup){
    //         return;
    //     }

    //     let dd = Manager.dataCenter.get(DdzData);
    //     Log.d("server card:",lastCard.cards);
    //     let localCard = dd.ToLocalCard(lastCard.cards);
    //     Log.d("server localCard:",localCard);

    //     this.isGroup = true;
    //     this.groupIndex = 0;
    //     this.initPriorityData();
    //     this.curGroup = [];

    //     if(lastCard.cardType == DouCardType.DouCardType_Single){
    //         this.DouCardType_Single(localCard);
    //     }else if(lastCard.cardType == DouCardType.DouCardType_Pair){
    //         this.DouCardType_Pair(localCard);
    //     }else if(lastCard.cardType == DouCardType.DouCardType_Third){
    //         this.DouCardType_Third(localCard);
    //     }else if(lastCard.cardType == DouCardType.DouCardType_Bomb){
    //         this.DouCardType_Bomb(localCard);
    //     }else if(lastCard.cardType == DouCardType.DouCardType_Sequence){
    //         this.DouCardType_Sequence(localCard,lastCard);
    //     }else if(lastCard.cardType == DouCardType.DouCardType_LinkPair){
    //         this.DouCardType_LinkPair(localCard,lastCard);
    //     }else if(lastCard.cardType == DouCardType.DouCardType_Airplane){
    //         this.DouCardType_Airplane(localCard,lastCard);
    //     }else if(lastCard.cardType == DouCardType.DouCardType_ThirdSingle){
    //         this.DouCardType_ThirdSingle(localCard,lastCard);
    //     }else if(lastCard.cardType == DouCardType.DouCardType_ThirdPair){
    //         this.DouCardType_ThirdPair(localCard,lastCard);
    //     }else if(lastCard.cardType == DouCardType.DouCardType_AirplaneSingle){
    //         this.DouCardType_AirplaneSingle(localCard,lastCard);
    //     }else if(lastCard.cardType == DouCardType.DouCardType_AirplanePair){
    //         this.DouCardType_AirplanePair(localCard,lastCard);
    //     }else if(lastCard.cardType == DouCardType.DouCardType_BombSingle){
    //         this.DouCardType_BombSingle(localCard,lastCard);
    //     }else if(lastCard.cardType == DouCardType.DouCardType_BombPair){
    //         this.DouCardType_BombPair(localCard,lastCard);
    //     }else if(lastCard.cardType == DouCardType.DouCardType_Rocket){
    //         this.DouCardType_Rocket(localCard,lastCard);
    //     }else if(lastCard.cardType == DouCardType.DouCardType_BombLink){
    //         this.DouCardType_BombLink(localCard,lastCard);
    //     }
    //     Log.d("this.curGroup:",this.curGroup);
    // }

    // private DouCardType_Single(localCard:number[]){
    //     let dd = Manager.dataCenter.get(DdzData);
    //     let cv = localCard[0];
    //     let cardInfo = dd.Card(localCard[0]);
   
    //     for (let index = cardInfo.v+1; index < 18; index++) {
    //         if(this.cardCountMap[index] != null && this.cardCountMap[index].length >= 1){
    //             this.curGroup.push([this.cardCountMap[index][0]]);
    //         } 
    //     }
    //     this.apendBomb();
    // }
    
    // private DouCardType_Pair(localCard:number[]){
    //     let dd = Manager.dataCenter.get(DdzData);
    //     let cv = localCard[0];
    //     let cardInfo = dd.Card(localCard[0]);

    //     for (let index = cardInfo.v+1; index < 18; index++) {
    //         if(this.cardCountMap[index] != null && this.cardCountMap[index].length >= 2){
    //             this.curGroup.push(this.cardCountMap[index].slice(0,2));
    //         } 
    //     }
        
    //     this.apendBomb();
    // }

    // private DouCardType_Third(localCard:number[]){
    //     let dd = Manager.dataCenter.get(DdzData);
    //     let cv = localCard[0];
    //     let cardInfo = dd.Card(localCard[0]);

    //     for (let index = cardInfo.v+1; index < 18; index++) {
    //         if(this.cardCountMap[index] != null && this.cardCountMap[index].length >= 3){
    //             this.curGroup.push(this.cardCountMap[index].slice(0,3));
    //         } 
    //     }
        
    //     this.apendBomb();
    // }

    // private DouCardType_Bomb(localCard:number[]){
    //     let dd = Manager.dataCenter.get(DdzData);
    //     let cv = localCard[0];
    //     let cardInfo = dd.Card(localCard[0]);

    //     for (let index = cardInfo.v+1; index < 18; index++) {
    //         if(this.cardCountMap[index] != null && this.cardCountMap[index].length == 4){
    //             this.curGroup.push(this.cardCountMap[index]);
    //         } 
    //     }
        
    //     this.apendBomb(false);
    // }

    private DouCardType_Sequence(localCard:number[],lastCard:pb.S2CDouPlayCards){
        let dd = Manager.dataCenter.get(DdzData);
        let cv = localCard[0];
        let cardInfo = dd.Card(localCard[0]);


        this.aData = [];
        // let cv = dd.cardMap[lastCard.cards[0]];
        for (let index = cardInfo.v+1; index < 15; index++) {
            if(this.cardCountMap[index] != null){
                if (this.cardCountMap[index].length>=1 && this.cardCountMap[index].length<4){
                    if(this.cardCountMap[index][0] > cv){
                        this.aData.push([this.cardCountMap[index][0]]);
                    }
                }
            }
        }
        let tempGroup1 = [];
        //顺子
        for (let i0 = 0; i0 < this.aData.length; i0++) {
            let cs0 = this.aData[i0];
            let c0 = dd.Card(cs0[0]);
            // Log.d("i0--",i0);
            let tempGroup = [];
            tempGroup.push(this.aData[i0][0])
            let isLink = true;
            let cindex = i0+1;
            for (let i1 = cindex; i1 < this.aData.length; i1++) {
                let cs1 = this.aData[i1];
                let c1 = dd.Card(cs1[0]);
                cindex = i1;
                if (c1.v - c0.v == 1){
                    tempGroup.push(cs1[0]); 
                    c0 = c1;
                    if(tempGroup.length == lastCard.cards.length){
                        break;
                    }
                }else{
                    isLink = false;
                    break;
                }
            }

            if (tempGroup.length == lastCard.cards.length){
                tempGroup1.push(tempGroup);
                tempGroup = [];
                // i0 = cindex;
            }
        }

        for (let index = 0; index < tempGroup1.length; index++) {
            if(tempGroup1[index].length >= lastCard.cards.length){
                for (let c = 0; c < tempGroup1[index].length; c++) {
                    if(tempGroup1[index][c] > cv){
                        if(c+lastCard.cards.length <= tempGroup1[index].length){
                            let narr = tempGroup1[index].slice(c,c+lastCard.cards.length);
                            this.curGroup.push(narr);
                        }
                    }
                }
            }
        }

        this.apendBomb();

    }

    // private DouCardType_LinkPair(localCard:number[],lastCard:pb.S2CDouPlayCards)
    // {
    //     let dd = Manager.dataCenter.get(DdzData);
    //     let cv = localCard[0];
    //     let cardInfo = dd.Card(localCard[0]);
    //     this.aaData = [];
    //     // let cv = dd.cardMap[lastCard.cards[0]];
    //     for (let index = cardInfo.v+1; index < 15; index++) {
    //         if(this.cardCountMap[index] != null){
    //             if (this.cardCountMap[index].length>=2 && this.cardCountMap[index].length<4){
    //                 if(this.cardCountMap[index][0] > cv){
    //                     this.aaData.push(this.cardCountMap[index]);
    //                 }
    //             }
    //         }
    //     }

    //     let tempGroup1 = [];
    //     //连对
    //     for (let i0 = 0; i0 < this.aaData.length; i0++) {
    //         let cs0 = this.aaData[i0];
    //         let c0 = dd.Card(cs0[0]);
    //         // Log.d("i0--",i0);
    //         let tempGroup = this.aaData[i0].slice(0,2); 
    //         let isLink = true;
    //         let cindex = i0+1;
    //         for (let i1 = cindex; i1 < this.aaData.length; i1++) {
    //             let cs1 = this.aaData[i1];
    //             let c1 = dd.Card(cs1[0]);
    //             cindex = i1;
    //             if (c1.v - c0.v == 1){
    //                 for (let child = 0; child < cs1.length; child++) {
    //                     tempGroup.push(cs1[child]);   
    //                 }
    //                 c0 = c1;
    //                 if(tempGroup.length == lastCard.cards.length){
    //                     break;
    //                 }
    //             }else{
    //                 break;
    //             }
    //         }

    //         if (tempGroup.length == lastCard.cards.length){
    //             tempGroup1.push(tempGroup);
    //         }
    //     }
    
    //     for (let index = 0; index < tempGroup1.length; index++) {
    //         if(tempGroup1[index].length >= lastCard.cards.length){
    //             for (let c = 0; c < tempGroup1[index].length; c++) {
    //                 if(tempGroup1[index][c] > cv){
    //                     if(c+lastCard.cards.length <= tempGroup1[index].length){
    //                         let narr = tempGroup1[index].slice(c,c+lastCard.cards.length);
    //                         this.curGroup.push(narr);
    //                     }
    //                 }
    //             }
    //         }
    //     }

    //     this.apendBomb();
    // }

    // private DouCardType_Airplane(localCard:number[],lastCard:pb.S2CDouPlayCards)
    // {
    //     let dd = Manager.dataCenter.get(DdzData);
    //     let cv = localCard[0];
    //     let cardInfo = dd.Card(localCard[0]);
    //     this.aaaData = [];
    //     // let cv = dd.cardMap[lastCard.cards[0]];
    //     for (let index = cardInfo.v+1; index < 15; index++) {
    //         if(this.cardCountMap[index] != null){
    //             if (this.cardCountMap[index].length>=3){
    //                 if(this.cardCountMap[index][0] > cv){
    //                     this.aaaData.push(this.cardCountMap[index]);
    //                 }
    //             }
    //         }
    //     }

    //     let tempGroup1 = [];
    //     let sl = lastCard.cards.length / 5;
    //     let fl = sl * 3;

    //     //飞机
    //     for (let i0 = 0; i0 < this.aaaData.length; i0++) {
    //         let cs0 = this.aaaData[i0];
    //         let c0 = dd.Card(cs0[0]);
    //         // Log.d("i0--",i0);
    //         let tempGroup = this.aaaData[i0].slice(0,3); 
    //         let isLink = true;
    //         let cindex = i0+1;
    //         for (let i1 = cindex; i1 < this.aaaData.length; i1++) {
    //             let cs1 = this.aaaData[i1];
    //             let c1 = dd.Card(cs1[0]);
    //             cindex = i1;
    //             if (c1.v - c0.v == 1){
    //                 for (let child = 0; child < cs1.length; child++) {
    //                     tempGroup.push(cs1[child]);   
    //                 }
    //                 c0 = c1;
    //                 if(tempGroup.length == fl){
    //                     break;
    //                 }
    //             }else{
    //                 break;
    //             }
    //         }
            
    //         if (tempGroup.length == fl){
    //             tempGroup1.push(tempGroup);
    //         }
    //     }
        
    //     for (let index = 0; index < tempGroup1.length; index++) {
    //        if(tempGroup1[index].length >= fl){
    //             for (let c = 0; c < tempGroup1[index].length; c++) {
    //                 if(tempGroup1[index][c] > cv){
    //                     if(c+fl <= tempGroup1[index].length){
    //                         let narr = tempGroup1[index].slice(c,c+fl);

    //                         this.aaData = [];
    //                         for (let index4 = 3; index4 < 15; index4++) {
    //                             if(this.cardCountMap[index4] != null){
    //                                 if (this.cardCountMap[index4].length>=2){
    //                                     let noteq = false;
    //                                     for (let narrindex = 0; narrindex < narr.length; narrindex++) {
    //                                         const cdd = dd.Card(narr[narrindex]);
    //                                         if(cdd.v == index4){
    //                                             noteq = true;
    //                                         }
    //                                     }
    //                                     if(!noteq){
    //                                         this.aaData.push(this.cardCountMap[index4].slice(0,2));
    //                                     }                                    
    //                                 }
    //                             }
    //                         }
    //                         let add = [];
    //                         if(this.aaData.length >= sl){
    //                             for (let index = 0; index < this.aaData.length; index++) {
    //                                 add = add.concat(this.aaData[index]);
    //                                 if(add.length == sl*2){
    //                                     break;
    //                                 }
    //                             }
    //                         }


    //                         if(add.length == sl*2){
    //                             narr = narr.concat(add);
    //                         }
    //                         if(narr.length == lastCard.cards.length){
    //                          this.curGroup.push(narr);
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }

    //     this.apendBomb();
    // }

    // private DouCardType_ThirdSingle(localCard:number[],lastCard:pb.S2CDouPlayCards)
    // {
    //     let dd = Manager.dataCenter.get(DdzData);
    //     let cv = localCard[0];
    //     let cardInfo = dd.Card(localCard[0]);
    //     // let cv = dd.cardMap[lastCard.cards[0]];
    //     let tempGroup = [];
    //     for (let index = cardInfo.v+1; index < 18; index++) {
    //         if(this.cardCountMap[index] != null){
    //             if(this.cardCountMap[index].length == 3){
    //                 let dataArray = [];
    //                 for (let mi = 0; mi < 3; mi++) {
    //                     let data = this.cardCountMap[index][mi];
    //                     if(data > cv){
    //                         dataArray.push(data);
    //                     }
    //                 }
    //                 if(dataArray.length == 3){
    //                     tempGroup.push(dataArray);
    //                 }
    //             }
    //         }  
    //     }

    //     for (let index = 0; index < tempGroup.length; index++) {
    //         let cdd = dd.Card(tempGroup[index]);
    //         let isFind = false;
    //         for (let aindex = 0; aindex < this.aData.length; aindex++) {
    //             // Log.d(index,aindex);
    //             let td = dd.Card(this.aData[aindex][0]);
    //             // Log.d(cdd.v , td.v);
    //             if(cdd.v != td.v){
    //                 tempGroup[index].push(this.aData[aindex][0]);
    //                 isFind = true;
    //                 break;
    //             }   

    //         }

    //         if(!isFind){
    //             for (let cd = this.cardData.length - 1; cd >= 0; cd--) {
    //                 let td = dd.Card(this.cardData[cd]);
    //                 if(cdd.v != td.v){
    //                     tempGroup.push(this.cardData[cd]);
    //                 }
    //             }
    //         }
    //     }

    //     for (let index = 0; index < tempGroup.length; index++) {
    //         if(tempGroup[index].length == lastCard.cards.length){
    //             this.curGroup.push(tempGroup[index]);
    //         }
    //     }


    //     this.apendBomb();
    // }

    
    // private DouCardType_ThirdPair(localCard:number[],lastCard:pb.S2CDouPlayCards)
    // {
    //     let dd = Manager.dataCenter.get(DdzData);
    //     let cv = localCard[0];
    //     let cardInfo = dd.Card(localCard[0]);
    //     let tempGroup = [];
    //     for (let index = cardInfo.v+1; index < 18; index++) {
    //         if(this.cardCountMap[index] != null){
    //             if(this.cardCountMap[index].length == 3){
    //                 let dataArray = [];
    //                 for (let mi = 0; mi < 3; mi++) {
    //                     let data = this.cardCountMap[index][mi];
    //                     if(data > cv){
    //                         dataArray.push(data);
    //                     }
    //                 }
    //                 if(dataArray.length == 3){
    //                     tempGroup.push(dataArray);
    //                 }
    //             }
    //         }
    //     }

    //     // Log.d("tempGroup:",tempGroup,this.aaData);
    //     for (let index = 0; index < tempGroup.length; index++) {
    //         let cdd = dd.Card(tempGroup[index][0]);
    //         let isFind = false;
    //         for (let aindex = 0; aindex < this.aaData.length; aindex++) {
    //             Log.d(index,aindex,this.aaData[aindex][0],dd.Card(this.aaData[aindex][0]));
    //             let td = dd.Card(this.aaData[aindex][0]);
    //             if(cdd.v != td.v){
    //                 // Log.d("find",cdd.v , td.v,tempGroup[index]);
    //                 tempGroup[index] = tempGroup[index].concat(this.aaData[aindex]);
    //                 // Log.d("find",cdd.v , td.v,tempGroup[index]);
    //                 isFind = true;
    //                 break;
    //             }   
    //         }
    //         if(!isFind){
    //             for (let aindex = 0; aindex < this.aaaData.length; aindex++) {
    //                 // Log.d(index,aindex);
    //                 let td = dd.Card(this.aaaData[aindex][0]);
    //                 // Log.d(cdd.v , td.v);
    //                 if(cdd.v != td.v){
    //                     tempGroup[index] = tempGroup[index].concat(this.aaaData[aindex].slice(0,2));
    //                     break;
    //                 }   
    //             }
    //         }
    //     }

    //     for (let index = 0; index < tempGroup.length; index++) {
    //         if(tempGroup[index].length == lastCard.cards.length){
    //             this.curGroup.push(tempGroup[index]);
    //         }
    //     }


    //     this.apendBomb();
    // }

    // private DouCardType_AirplaneSingle(localCard:number[],lastCard:pb.S2CDouPlayCards)
    // {
    //     let dd = Manager.dataCenter.get(DdzData);
    //     let cv = localCard[0];
    //     let cardInfo = dd.Card(localCard[0]);

    //     this.aaaData = [];
    //     // let cv = dd.cardMap[lastCard.cards[0]];
    //     for (let index = cardInfo.v+1; index < 15; index++) {
    //         if(this.cardCountMap[index] != null){
    //             if (this.cardCountMap[index].length>=3){
    //                 if(this.cardCountMap[index][0] > cv){
    //                     this.aaaData.push(this.cardCountMap[index]);
    //                 }
    //             }
    //         }
    //     }

    //     let tempGroup1 = [];
    //     let sl = lastCard.cards.length / 4;
    //     let fl = sl * 3;

    //     //飞机
    //     for (let i0 = 0; i0 < this.aaaData.length; i0++) {
    //         let cs0 = this.aaaData[i0];
    //         let c0 = dd.Card(cs0[0]);
    //         // Log.d("i0--",i0);
    //         let tempGroup = this.aaaData[i0].slice(0,3); 
    //         let isLink = true;
    //         let cindex = i0+1;
    //         for (let i1 = cindex; i1 < this.aaaData.length; i1++) {
    //             let cs1 = this.aaaData[i1];
    //             let c1 = dd.Card(cs1[0]);
    //             cindex = i1;
    //             if (c1.v - c0.v == 1){
    //                 for (let child = 0; child < cs1.length; child++) {
    //                     tempGroup.push(cs1[child]);   
    //                 }
    //                 c0 = c1;
    //                 if(tempGroup.length == fl){
    //                     break;
    //                 }
    //             }else{
    //                 break;
    //             }
    //         }
            
    //         if (tempGroup.length == fl){
    //             tempGroup1.push(tempGroup);
    //         }
    //     }
        
    //     for (let index = 0; index < tempGroup1.length; index++) {
    //         if(tempGroup1[index].length >= fl){
    //             for (let c = 0; c < tempGroup1[index].length; c++) {
    //                 if(tempGroup1[index][c] > cv){
    //                     if(c+fl <= tempGroup1[index].length){
    //                         let narr = tempGroup1[index].slice(c,c+fl);

    //                         let add = [];

    //                         for (let ai = 0; ai < this.aData.length; ai++) {
    //                             add.push(this.aData[ai][0]);
    //                             if(add.length == sl){
    //                                 break;
    //                             }
    //                         }

                            
    //                         if(add.length < sl){
    //                             add = [];
    //                             for (let cd = this.cardData.length - 1; cd >= 0; cd--) {
    //                                 let td = dd.Card(this.cardData[cd]);
    //                                 let noteq = false;
    //                                 for (let narrindex = 0; narrindex < narr.length; narrindex++) {
    //                                     const cdd = dd.Card(narr[narrindex]);
    //                                     if(cdd.v == td.v){
    //                                         noteq = true;
    //                                     }
    //                                 }
    //                                 if(!noteq){
    //                                     add.push(this.cardData[cd]);
    //                                 }
    //                                 if(add.length == sl){
    //                                     break;
    //                                 }
    //                             }
    //                         }

    //                         if(add.length == sl){
    //                             narr = narr.concat(add);
    //                         }
    //                         if(narr.length == lastCard.cards.length){
    //                             this.curGroup.push(narr);
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }

    //     this.apendBomb();
    // }

    
    // private DouCardType_AirplanePair(localCard:number[],lastCard:pb.S2CDouPlayCards)
    // {
    //     let dd = Manager.dataCenter.get(DdzData);
    //     let cv = localCard[0];
    //     let cardInfo = dd.Card(localCard[0]);

    //     this.aaaData = [];
    //     // let cv = dd.cardMap[lastCard.cards[0]];
    //     for (let index = cardInfo.v+1; index < 15; index++) {
            
    //         if(this.cardCountMap[index] != null){
    //             if (this.cardCountMap[index].length>=3){
    //                 if(this.cardCountMap[index][0] > cv){
    //                     this.aaaData.push(this.cardCountMap[index]);
    //                 }
    //             }
    //         }
            
    //     }

    //     let tempGroup1 = [];
    //     let sl = lastCard.cards.length / 5;
    //     let fl = sl * 3;

    //     //飞机
    //     for (let i0 = 0; i0 < this.aaaData.length; i0++) {
    //         let cs0 = this.aaaData[i0];
    //         let c0 = dd.Card(cs0[0]);
    //         // Log.d("i0--",i0);
    //         let tempGroup = this.aaaData[i0].slice(0,3); 
    //         let isLink = true;
    //         let cindex = i0+1;
    //         for (let i1 = cindex; i1 < this.aaaData.length; i1++) {
    //             let cs1 = this.aaaData[i1];
    //             let c1 = dd.Card(cs1[0]);
    //             cindex = i1;
    //             if (c1.v - c0.v == 1){
    //                 for (let child = 0; child < cs1.length; child++) {
    //                     tempGroup.push(cs1[child]);   
    //                 }
    //                 c0 = c1;
    //                 if(tempGroup.length == fl){
    //                     break;
    //                 }
    //             }else{
    //                 break;
    //             }
    //         }
            
    //         if (tempGroup.length == fl){
    //             tempGroup1.push(tempGroup);
    //         }
    //     }
        
    //     for (let index = 0; index < tempGroup1.length; index++) {
    //         if(tempGroup1[index].length >= fl){
    //             for (let c = 0; c < tempGroup1[index].length; c++) {
    //                 if(tempGroup1[index][c] > cv){
    //                     if(c+fl <= tempGroup1[index].length){
    //                         let narr = tempGroup1[index].slice(c,c+fl);

    //                         this.aaData = [];
    //                         for (let index4 = 3; index4 < 15; index4++) {
    //                             if(this.cardCountMap[index4] != null){
    //                                 if (this.cardCountMap[index4].length>=2){
    //                                     let noteq = false;
    //                                     for (let narrindex = 0; narrindex < narr.length; narrindex++) {
    //                                         const cdd = dd.Card(narr[narrindex]);
    //                                         if(cdd.v == index4){
    //                                             noteq = true;
    //                                         }
    //                                     }
    //                                     if(!noteq){
    //                                         this.aaData.push(this.cardCountMap[index4].slice(0,2));
    //                                     }                                    
    //                                 }
    //                             }
    //                         }
    //                         let add = [];
    //                         if(this.aaData.length >= sl){
    //                             for (let index = 0; index < this.aaData.length; index++) {
    //                                 add = add.concat(this.aaData[index]);
    //                                 if(add.length == sl*2){
    //                                     break;
    //                                 }
    //                             }
    //                         }


    //                         if(add.length == sl*2){
    //                             narr = narr.concat(add);
    //                         }
    //                         if(narr.length == lastCard.cards.length){
    //                             this.curGroup.push(narr);
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     this.apendBomb();
    // }

    
    // private DouCardType_BombSingle(localCard:number[],lastCard:pb.S2CDouPlayCards)
    // {
    //     let dd = Manager.dataCenter.get(DdzData);
    //     let cv = localCard[0];
    //     let cardInfo = dd.Card(localCard[0]);

    //     let tempGroup = [];
    //     let tempGroupSrc = [];
    //     for (let index = 3; index < 18; index++) {
    //         if(cardInfo.v < index){
    //             if(this.cardCountMap[index] != null){
    //                 if(this.cardCountMap[index].length >= 4){
    //                     let dataArray = [];
    //                     let dataArray1 = [];
    //                     for (let mi = 0; mi < 4; mi++) {
    //                         let data = this.cardCountMap[index][mi];
    //                         if(data > cv){
    //                             dataArray.push(data);
    //                             dataArray1.push(data);
    //                         }
    //                     }
    //                     if(dataArray.length == 4){
    //                         tempGroupSrc.push(dataArray1);
    //                         tempGroup.push(dataArray);
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     for (let index = 0; index < tempGroup.length; index++) {
    //         let add = [];
    //         let ccv =  dd.Card(tempGroup[index][0]);
    //         for (let cd = this.cardData.length - 1; cd >= 0; cd--) {
    //             let td = dd.Card(this.cardData[cd]);
    //             if(this.cardCountMap[td.v] != null && this.cardCountMap[td.v].length == 4){
    //                 continue;
    //             }
    //             if(ccv.v != td.v){
    //                 add.push(this.cardData[cd]);
    //             }
    //             if(add.length == 2){
    //                 tempGroup[index] = tempGroup[index].concat(add);
    //                 break;
    //             }
    //         }

    //         if(tempGroup[index].length == lastCard.cards.length){
    //             this.curGroup.push(tempGroup[index]);  
    //         }
    //     }
    //     for (let index = 0; index < tempGroupSrc.length; index++) {
    //         this.curGroup.push(tempGroupSrc[index]);      
    //     }

    //     this.apendBomb();
    // }

    // private DouCardType_BombPair(localCard:number[],lastCard:pb.S2CDouPlayCards)
    // {
    //     let dd = Manager.dataCenter.get(DdzData);
    //     let cv = localCard[0];
    //     let cardInfo = dd.Card(localCard[0]);

    //     let tempGroup = [];
    //     let tempGroupSrc = [];
    //     for (let index = cardInfo.v+1; index < 18; index++) {

    //         if(this.cardCountMap[index] != null){
    //             if(this.cardCountMap[index].length >= 4){
    //                 let dataArray = [];
    //                 let dataArray1 = [];
    //                 for (let mi = 0; mi < 4; mi++) {
    //                     let data = this.cardCountMap[index][mi];
    //                     if(data > cv){
    //                         dataArray.push(data);
    //                         dataArray1.push(data);
    //                     }
    //                 }
    //                 if(dataArray.length == 4){
    //                     tempGroupSrc.push(dataArray1);
    //                     tempGroup.push(dataArray);
    //                 }
    //             }
    //         }
            
    //     }

    //     this.aaData = [];
    //     for (let index4 = 3; index4 < 15; index4++) {
    //         if(this.cardCountMap[index4] != null){
    //             if (this.cardCountMap[index4].length>=2 && this.cardCountMap[index4].length <= 3){
    //                 this.aaData.push(this.cardCountMap[index4].slice(0,2));                                 
    //             }
    //         }
    //     }
    //     Log.e(this.aaData,this.cardCountMap);

    //     for (let index = 0; index < tempGroup.length; index++) {
    
    //         // Log.d(tempGroup,"---");
    //         for (let index1 = 0; index1 < this.aaData.length; index1++) {
    //             tempGroup[index] = tempGroup[index].concat(this.aaData[index1]);
    //             break;
    //         }
        
    //         if(tempGroup[index].length == lastCard.cards.length){
    //             this.curGroup.push(tempGroup[index]);  
    //         }
    //     }
    //     for (let index = 0; index < tempGroupSrc.length; index++) {
    //         this.curGroup.push(tempGroupSrc[index]);      
    //     }

    //     this.apendBomb();
    // }


    // private DouCardType_Rocket(localCard:number[],lastCard:pb.S2CDouPlayCards)
    // {
    //     this.apendBomb(false,false);
    // }

    // private DouCardType_BombLink(localCard:number[],lastCard:pb.S2CDouPlayCards)
    // {

    //     let dd = Manager.dataCenter.get(DdzData);
    //     let cv = localCard[0];
    //     let cardInfo = dd.Card(localCard[0]);
    //     //过滤连炸
    //     let lzIndex = -1;
    //     let lzDataCell = [];
    //     this.lzData = [];

    //     for (let index = 3; index < 14; index++) {
    //         let isFind = false;
    //         if(index - lzIndex == 1){
    //             if (this.cardCountMap[index] != null && this.cardCountMap[index].length==4){
    //                 lzDataCell = lzDataCell.concat(this.cardCountMap[index]);
    //                 lzIndex = index;
    //                 isFind = true;
    //             }
    //         }
    //         if(!isFind || index == 13){
    //             if(lzDataCell.length >= 8){
    //                 let isPush = false
    //                 if(lzDataCell[0] > cv){
    //                     this.lzData.push(lzDataCell);
    //                     isPush = true;
    //                 }
    //                 if(!isPush && lzDataCell.length > lastCard.cards.length){
    //                     this.lzData.push(lzDataCell);
    //                 }
    //             }
    //             lzDataCell = [];
    //             lzIndex = -1;
    //         }
    //         if(lzIndex == -1){
    //             if (this.cardCountMap[index] != null && this.cardCountMap[index].length==4){
    //                 lzIndex = index;
    //                 lzDataCell = lzDataCell.concat(this.cardCountMap[index]);
    //             }
    //         }
    //     }

    //     if(this.lzData.length > 0){
    //         this.curGroup = this.curGroup.concat(this.lzData);
    //     }
    // }

    private reSort(localCard:number[]):number[]{
        let dd = Manager.dataCenter.get(DdzData);
        return dd.reSort(localCard);
    }
    
    public setBeServerGroup(lastCard: pb.S2CDouPlayCards,group: pb.IDouCardGroup){
        Log.e("被动",group,lastCard);
        if(this.isGroup){
            return;
        }
        if(lastCard.cards == null || lastCard.cards.length == 0){
            Manager.tips.debug("上一个人出牌数据错误");
            return;
        }
        let dd = Manager.dataCenter.get(DdzData);
        Log.d("server card:",lastCard.cards);
        let localCard = dd.ToLocalCard(lastCard.cards);
        Log.d("server localCard:",localCard);
        if(localCard == null || localCard.length == 0){
            Manager.tips.debug("网络牌值转化到本地错误");
            return;
        }

        this.isGroup = true;
        this.groupIndex = 0;
        this.initPriorityData();
        this.curGroup = [];

        if(lastCard.cardType == DouCardType.DouCardType_Single){
            this.beDouCardType_Single(localCard,group);
        }else if(lastCard.cardType == DouCardType.DouCardType_Pair){
            this.beDouCardType_Pair(localCard,group);
        }else if(lastCard.cardType == DouCardType.DouCardType_Third){
            this.beDouCardType_Third(localCard,group);
        }else if(lastCard.cardType == DouCardType.DouCardType_Bomb){
            this.beDouCardType_Bomb(localCard,group);
        }else if(lastCard.cardType == DouCardType.DouCardType_Sequence){
            this.beDouCardType_Sequence(localCard,group);
        }else if(lastCard.cardType == DouCardType.DouCardType_LinkPair){
            this.beDouCardType_LinkPair(localCard,group);
        }else if(lastCard.cardType == DouCardType.DouCardType_Airplane){
            this.beDouCardType_Airplane(localCard,group);
        }else if(lastCard.cardType == DouCardType.DouCardType_ThirdSingle){
            this.beDouCardType_ThirdSingle(localCard,group);
        }else if(lastCard.cardType == DouCardType.DouCardType_ThirdPair){
            this.beDouCardType_ThirdPair(localCard,group);
        }else if(lastCard.cardType == DouCardType.DouCardType_AirplaneSingle){
            this.beDouCardType_AirplaneSingle(localCard,group);
        }else if(lastCard.cardType == DouCardType.DouCardType_AirplanePair){
            this.beDouCardType_AirplanePair(localCard,group);
        }else if(lastCard.cardType == DouCardType.DouCardType_BombSingle){
            this.beDouCardType_BombSingle(localCard,group);
        }else if(lastCard.cardType == DouCardType.DouCardType_BombPair){
            this.beDouCardType_BombPair(localCard,group);
        }else if(lastCard.cardType == DouCardType.DouCardType_Rocket){
            this.beDouCardType_Rocket(localCard,group);
        }else if(lastCard.cardType == DouCardType.DouCardType_BombLink){
            this.beDouCardType_BombLink(localCard,group);
        }

        Log.d("this.curGroup:",this.curGroup);
    }

    private addBomb(dd:DdzData,group: pb.IDouCardGroup){
        if(group.bomb != null && group.bomb.length > 0){
            for (let index = 0; index < group.bomb.length; index++) {
                const element = group.bomb[index];
                let localCard = dd.ToLocalCard(element.cards);
                this.curGroup.push(localCard);
            }
        }
    }

    private addJoker(dd:DdzData,group: pb.IDouCardGroup){
        if(group.joker != null && group.joker.length == 2){
            let localCard = dd.ToLocalCard(group.joker);
            this.curGroup.push(localCard);
        }
    }

    private addbombLink(dd:DdzData,group: pb.IDouCardGroup){
        if(group.bombLink != null && group.bombLink.length > 0){
            for (let index = 0; index < group.bombLink.length; index++) {
                const element = group.bombLink[index];
                let localCard = dd.ToLocalCard(element.cards);
                this.curGroup.push(localCard);
            }
        }
        if(group.bombLink != null && group.bombLink.length > 0){
            for (let index = 0; index < group.bombLink.length; index++) {
                const element = group.bombLink[index];
                let localCard = dd.ToLocalCard(element.cards);
                for (let lzi = 0; lzi < localCard.length; lzi=lzi+4) {
                    if(lzi+8< localCard.length){
                        this.curGroup.push(localCard.slice(lzi,lzi+8));
                    }   
                }
            }
        }
        if(group.bombLink != null && group.bombLink.length > 0){
            for (let index = 0; index < group.bombLink.length; index++) {
                const element = group.bombLink[index];
                let localCard = dd.ToLocalCard(element.cards);
                for (let lzi = 0; lzi < localCard.length; lzi=lzi+4) {
                    this.curGroup.push(localCard.slice(lzi,lzi+4));   
                }
            }
        }
    }

    private addbombLinkBigger(dd:DdzData,group: pb.IDouCardGroup,src:number){
        if(group.bombLink != null && group.bombLink.length > 0){
            for (let index = 0; index < group.bombLink.length; index++) {
                const element = group.bombLink[index];
                let localCard = dd.ToLocalCard(element.cards);
                this.curGroup.push(localCard);
            }
        }
        if(group.bombLink != null && group.bombLink.length > 0){
            for (let index = 0; index < group.bombLink.length; index++) {
                const element = group.bombLink[index];
                let localCard = dd.ToLocalCard(element.cards);
                for (let lzi = 0; lzi < localCard.length; lzi=lzi+4) {
                    if(lzi+8< localCard.length){
                        this.curGroup.push(localCard.slice(lzi,lzi+8));
                    }   
                }
            }
        }
        if(group.bombLink != null && group.bombLink.length > 0){
            for (let index = 0; index < group.bombLink.length; index++) {
                const element = group.bombLink[index];
                let localCard = dd.ToLocalCard(element.cards);
                if(localCard[0] > src){
                    for (let lzi = 0; lzi < localCard.length; lzi=lzi+4) {
                        this.curGroup.push(localCard.slice(lzi,lzi+4));   
                    }
                }
            }
        }
    }

    private isBigger(ser:number,src:number):boolean{
        if(ser == null || src == null){
            Log.e("isBigger err",ser,src);
        }
        let dd = Manager.dataCenter.get(DdzData);
        if(dd.Card(ser).v > dd.Card(src).v){
            return true;
        }
        return false;
    }

    private beDouCardType_Single(localCard:number[],group: pb.IDouCardGroup){
        let dd = Manager.dataCenter.get(DdzData);
        //1 找单牌
        if(group.single != null && group.single.length > 0){
            let localSingle = dd.ToLocalCard(group.single);
            for (let index = 0; index < localSingle.length; index++) {
                const element = localSingle[index];
                if(this.isBigger(element,localCard[0])){
                    this.curGroup.push([element]);
                }
            }
        }
        //2 找炸弹
        this.addBomb(dd,group);
        this.addJoker(dd,group);
        this.addbombLink(dd,group);
 
        //3 拆大于五张的连子
        if(group.sequence != null && group.sequence.length > 0){
            for (let index = 0; index < group.sequence.length; index++) {
                const element = group.sequence[index];
                if(element.cards.length > 5){
                    let localGroup = dd.ToLocalCard(element.cards);
                    for (let ei = localGroup.length-1; ei > 4; ei--) {
                        const cards = localGroup[ei];
                        if(this.isBigger(cards , localCard[0])){
                            this.curGroup.push([cards]);
                        }
                    }
                }
            }
        }

        //4 拆对子
        if(group.pair != null && group.pair.length > 0){
            for (let index = 0; index < group.pair.length; index++) {
                const element = group.pair[index];
                let localGroup = dd.ToLocalCard(element.cards);
                if(this.isBigger(localGroup[0] , localCard[0])){
                    this.curGroup.push([localGroup[0]]);
                }
            }
        }
        //5 拆连对
        if(group.linkPair != null && group.linkPair.length > 0){
            for (let index = 0; index < group.linkPair.length; index++) {
                const element = group.linkPair[index];
                let localGroup = dd.ToLocalCard(element.cards);
                for (let lpi = 0; lpi < localGroup.length; lpi=lpi+2) {
                    if(this.isBigger(localGroup[lpi] , localCard[0])){
                        this.curGroup.push([localGroup[lpi]]);
                    }   
                }
            }
        }
        //6 拆三张
        if(group.third != null && group.third.length > 0){
            for (let index = 0; index < group.third.length; index++) {
                const element = group.third[index];
                let localGroup = dd.ToLocalCard(element.cards);
                if(this.isBigger(localGroup[0] , localCard[0])){
                    this.curGroup.push([localGroup[0]]);
                }
            }
        }
        //6 拆飞机
        if(group.airplane != null && group.airplane.length > 0){
            for (let index = 0; index < group.airplane.length; index++) {
                const element = group.airplane[index];
                let localGroup = dd.ToLocalCard(element.cards);
                for (let aindex = 0; aindex < localGroup.length; aindex=aindex+3) {
                    if(this.isBigger(localGroup[aindex] , localCard[0])){
                        this.curGroup.push([localGroup[aindex]]);
                    }  
                }
            }
        }
        //7 拆炸弹
        if(group.bomb != null && group.bomb.length > 0){
            for (let index = 0; index < group.bomb.length; index++) {
                const element = group.bomb[index];
                let localGroup = dd.ToLocalCard(element.cards);
                if(this.isBigger(localGroup[0] , localCard[0])){
                    this.curGroup.push([localGroup[0]]);
                }
            }
        }
        //8 拆王炸
        if(group.joker != null && group.joker.length == 2){
            let localGroup = dd.ToLocalCard(group.joker);
            if(this.isBigger(localGroup[0] , localCard[0])){
                this.curGroup.push([localGroup[0]]);
            }
            if(this.isBigger(localGroup[1] , localCard[0])){
                this.curGroup.push([localGroup[1]]);
            }
        }
        //9 拆连炸
        if(group.bombLink != null && group.bombLink.length > 0){
            for (let index = 0; index < group.bombLink.length; index++) {
                const element = group.bombLink[index];
                let localGroup = dd.ToLocalCard(element.cards);
                for (let bi = 0; bi < localGroup.length; bi=bi+4) {
                    const biData = localGroup[bi];
                    if(this.isBigger(biData , localCard[0])){
                        this.curGroup.push([biData]);
                    }
                }
            }
        }

        //10 拆五张的连子
        if(group.sequence != null && group.sequence.length > 0){
            for (let index = 0; index < group.sequence.length; index++) {
                const element = group.sequence[index];
                let localGroup = dd.ToLocalCard(element.cards);
                for (let ei = 0; ei < localGroup.length; ei++) {
                    if(ei < 5){
                        const cards = localGroup[ei];
                        if(this.isBigger(cards , localCard[0])){
                            this.curGroup.push([cards]);
                        }
                    }
                }
            }
        }
        
    }

    private beDouCardType_Pair(localCard:number[],group: pb.IDouCardGroup){
        let dd = Manager.dataCenter.get(DdzData);
        //找对子
        if(group.pair != null && group.pair.length > 0){
            for (let index = 0; index < group.pair.length; index++) {
                const element = group.pair[index];
                let localGroup = dd.ToLocalCard(element.cards);
                if(this.isBigger(localGroup[0] , localCard[0])){
                    this.curGroup.push(localGroup);
                }
            }
        }
        //找炸弹
        this.addBomb(dd,group);
        this.addJoker(dd,group);
        this.addbombLink(dd,group);
 
        //拆连对
        if(group.linkPair != null && group.linkPair.length > 0){
            for (let index = 0; index < group.linkPair.length; index++) {
                const element = group.linkPair[index];
                let localGroup = dd.ToLocalCard(element.cards);
                for (let lpi = 0; lpi < localGroup.length; lpi=lpi+2) {
                    if(this.isBigger(localGroup[lpi] , localCard[0])){  
                        this.curGroup.push(localGroup.slice(lpi,lpi+2));
                    }   
                }
            }
        }
        //拆三张
        if(group.third != null && group.third.length > 0){
            for (let index = 0; index < group.third.length; index++) {
                const element = group.third[index];
                let localGroup = dd.ToLocalCard(element.cards);
                if(this.isBigger(localGroup[0] , localCard[0])){
                    this.curGroup.push(localGroup.slice(0,2));
                }
            }
        }
        //拆炸弹
        if(group.bomb != null && group.bomb.length > 0){
            for (let index = 0; index < group.bomb.length; index++) {
                const element = group.bomb[index];
                let localGroup = dd.ToLocalCard(element.cards);
                if(this.isBigger(localGroup[0] , localCard[0])){
                    this.curGroup.push(localGroup.slice(0,2));
                }
            }
        }
        //拆飞机
        if(group.airplane != null && group.airplane.length > 0){
            for (let index = 0; index < group.airplane.length; index++) {
                const element = group.airplane[index];
                let localGroup = dd.ToLocalCard(element.cards);
                for (let aindex = 0; aindex < localGroup.length; aindex=aindex+3) {
                    if(this.isBigger(localGroup[aindex] , localCard[0])){
                        this.curGroup.push(localGroup.slice(aindex,aindex+2));
                    }  
                }
            }
        }
        //拆连炸
        if(group.bombLink != null && group.bombLink.length > 0){
            for (let index = 0; index < group.bombLink.length; index++) {
                const element = group.bombLink[index];
                let localGroup = dd.ToLocalCard(element.cards);
                for (let bi = 0; bi < localGroup.length; bi=bi+4) {
                    const biData = localGroup[bi];
                    if(this.isBigger(biData , localCard[0])){
                        this.curGroup.push(localGroup.slice(bi,bi+2));
                    }
                }
            }
        }
    }

    private beDouCardType_Third(localCard:number[],group: pb.IDouCardGroup){
        let dd = Manager.dataCenter.get(DdzData);
        if(group.third != null && group.third.length > 0){
            for (let index = 0; index < group.third.length; index++) {
                const element = group.third[index];
                let localGroup = dd.ToLocalCard(element.cards);
                if(this.isBigger(localGroup[0] , localCard[0])){
                    this.curGroup.push(localGroup);
                }
            }
        }

        this.addBomb(dd,group);
        this.addJoker(dd,group);
        this.addbombLink(dd,group);

        if(group.airplane != null && group.airplane.length > 0){
            for (let index = 0; index < group.airplane.length; index++) {
                const element = group.airplane[index];
                let localGroup = dd.ToLocalCard(element.cards);
                for (let aindex = 0; aindex < localGroup.length; aindex=aindex+3) {
                    if(this.isBigger(localGroup[aindex] , localCard[0])){
                        this.curGroup.push(localGroup.slice(aindex,aindex+3));
                    }  
                }
            }
        }

        if(group.bomb != null && group.bomb.length > 0){
            for (let index = 0; index < group.bomb.length; index++) {
                const element = group.bomb[index];
                let localGroup = dd.ToLocalCard(element.cards);
                if(this.isBigger(localGroup[0] , localCard[0])){
                    this.curGroup.push(localGroup.slice(0,3));
                }
            }
        }

        if(group.bombLink != null && group.bombLink.length > 0){
            for (let index = 0; index < group.bombLink.length; index++) {
                const element = group.bombLink[index];
                let localGroup = dd.ToLocalCard(element.cards);
                for (let bi = 0; bi < localGroup.length; bi=bi+4) {
                    const biData = localGroup[bi];
                    if(this.isBigger(biData , localCard[0])){
                        this.curGroup.push(localGroup.slice(bi,bi+3));
                    }
                }
            }
        }
    }


    private beDouCardType_Bomb(localCard:number[],group: pb.IDouCardGroup){
        let dd = Manager.dataCenter.get(DdzData);
        if(group.bomb != null && group.bomb.length > 0){
            for (let index = 0; index < group.bomb.length; index++) {
                const element = group.bomb[index];
                let localGroup = dd.ToLocalCard(element.cards);
                if(this.isBigger(localGroup[0] , localCard[0])){
                    this.curGroup.push(localGroup);
                }
            }
        }
        this.addJoker(dd,group);
        this.addbombLinkBigger(dd,group,localCard[0]);
    }

    private checkZd(zd:number[],lz:number[]):boolean{
        let dd = Manager.dataCenter.get(DdzData);
        for (let index = 0; index < zd.length; index++) {
            const zdIndex = zd[index];
            for (let zlIndex = 0; zlIndex < lz.length; zlIndex++) {
                let lzData = dd.Card(lz[zlIndex]);
                if(lzData.v == zdIndex){
                    return true;
                }
            }
        }
        return false;
    }

    private beDouCardType_Sequence(localCard:number[],group: pb.IDouCardGroup){
        let dd = Manager.dataCenter.get(DdzData);
        let localSeq = [];
        if(group.sequence != null && group.sequence.length > 0){
            for (let index = 0; index < group.sequence.length; index++) {
                const element = group.sequence[index];
                if(element.cards.length >= localCard.length){
                    let localGroup = dd.ToLocalCard(element.cards);
                    for (let ei = 0; ei < localGroup.length; ei++) {
                        const cards = localGroup[ei];
                        if(this.isBigger(cards , localCard[0]) && ei+localCard.length <= localGroup.length){
                            let seq = localGroup.slice(ei,ei+localCard.length);
                            localSeq.push(seq);
                            this.curGroup.push(seq);
                        }
                    }
                }
            }
        }

        this.addBomb(dd,group);
        this.addJoker(dd,group);
        this.addbombLink(dd,group);


        let filter = [];
        let cardInfo = dd.Card(localCard[0]);
        let sIndex = -1;

        let temp = [];
        for (let index = cardInfo.v+1; index < 15; index++) {
            if(sIndex != -1 && (index - sIndex != 1)){
                sIndex = -1;
                if(temp.length >= group.sequence.length){
                    filter.push(temp);
                }
                temp = [];
            }   
            if(this.cardCountMap[index] != null){
                if (this.cardCountMap[index].length>=1 && this.cardCountMap[index].length<=4){
                    if(sIndex == -1 || (index - sIndex == 1)){
                        temp = temp.concat(this.cardCountMap[index].slice(0,1));
                        sIndex=index;
                    }
                }
            }
        }
        if(temp.length >= group.sequence.length){
            filter.push(temp);
        }

        let result = [];
        for (let index = 0; index < filter.length; index++) {
            let fi = filter[index];
            for (let findex = 0; findex < fi.length; findex++) {
                if(findex+localCard.length<=fi.length){
                    result.push(fi.slice(findex,findex+localCard.length));
                }
            }
        }
        let wi = [];
        for (let index = 0; index < result.length; index++) {
            let fi = result[index];
            let fiJson = JSON.stringify(dd.Sort(fi));
            for (let findex = 0; findex < localSeq.length; findex++) {
                let fd = localSeq[findex];
                if(fiJson != JSON.stringify(dd.Sort(fi))){
                    wi.push(fi);
                }
            }
        }
        if(wi.length > 0){
            result = wi;
        }
  
        for (let index = 0; index < result.length; index++) {
            let s = result[index];
            for (let zindex = 0; zindex < s.length; zindex++) {
                if(zindex+localCard.length<=s.length){
                    let data = s.slice(zindex,index+localCard.length);
                    this.curGroup.push(data);
                }
            }
        }
    }

    // DouCards 16|17|18,30|31|32|33|19|20|17|18|21|34|47|8,42|43|45,54|53|3|4|5|7|8
    private beDouCardType_LinkPair(localCard:number[],group: pb.IDouCardGroup){
        let dd = Manager.dataCenter.get(DdzData);
        let localPair = [];
        if(group.linkPair != null && group.linkPair.length > 0){
            for (let index = 0; index < group.linkPair.length; index++) {
                const element = group.linkPair[index];
                if(element.cards.length >= localCard.length){
                    let localGroup = dd.ToLocalCard(element.cards);
                    for (let ei = 0; ei < localGroup.length; ei=ei+2) {
                        const cards = localGroup[ei];
                        if(this.isBigger(cards , localCard[0]) && ei+localCard.length <= localGroup.length){
                            let fd = localGroup.slice(ei,ei+localCard.length);
                            localPair.push(fd);
                            this.curGroup.push(fd);
                        }
                    }
                }
            }
        }

        this.addBomb(dd,group);
        this.addJoker(dd,group);
        this.addbombLink(dd,group);

        let filter = [];
        let cardInfo = dd.Card(localCard[0]);
        let sIndex = -1;

        let temp = [];
        for (let index = cardInfo.v+1; index < 15; index++) {
            if(sIndex != -1 && (index - sIndex != 1)){
                sIndex = -1;
                if(temp.length >= group.linkPair.length){
                    filter.push(temp);
                }
                temp = [];
            }   
            if(this.cardCountMap[index] != null){
                if (this.cardCountMap[index].length>=2 && this.cardCountMap[index].length<=4){
                    if(sIndex == -1 || (index - sIndex == 1)){
                        temp = temp.concat(this.cardCountMap[index].slice(0,2));
                        sIndex=index;
                    }
                }
            }
        }
        if(temp.length >= group.linkPair.length){
            filter.push(temp);
        }


        let result = [];
        for (let index = 0; index < filter.length; index++) {
            let fi = filter[index];
            for (let findex = 0; findex < fi.length; findex=findex+2) {
                if(findex+localCard.length<=fi.length){
                    result.push(fi.slice(findex,findex+localCard.length));
                }
            }
        }
        let wi = [];
        for (let index = 0; index < result.length; index++) {
            let fi = result[index];
            let fiJson = JSON.stringify(dd.Sort(fi));
            for (let findex = 0; findex < localPair.length; findex++) {
                let fd = localPair[findex];
                if(fiJson != JSON.stringify(dd.Sort(fd))){
                    wi.push(fi);
                }
            }
        }
        if(wi.length > 0){
            result = wi;
        }
  
        for (let index = 0; index < result.length; index++) {
            let s = result[index];
            for (let zindex = 0; zindex < s.length; zindex++) {
                if(zindex+localCard.length<=s.length){
                    let data = s.slice(zindex,index+localCard.length);
                    this.curGroup.push(data);
                }
            }
        }
    }

    private beDouCardType_Airplane(localCard:number[],group: pb.IDouCardGroup){
        let dd = Manager.dataCenter.get(DdzData);
        let findFj = [];
        if(group.airplane != null && group.airplane.length > 0){
            for (let index = 0; index < group.airplane.length; index++) {
                const element = group.airplane[index];
                if(element.cards.length >= localCard.length){
                    let localGroup = dd.ToLocalCard(element.cards);
                    for (let ei = 0; ei < localGroup.length; ei++) {
                        const cards = localGroup[ei];
                        if(this.isBigger(cards , localCard[0]) && ei+localCard.length <= localGroup.length){
                            findFj.push(localGroup.slice(ei,ei+localCard.length));
                            this.curGroup.push(localGroup.slice(ei,ei+localCard.length));
                        }
                    }
                }
            }
        }
        this.addBomb(dd,group);
        this.addJoker(dd,group);
        this.addbombLink(dd,group);


        let filter = [];
        let cardInfo = dd.Card(localCard[0]);
        let sIndex = -1;

        let tempFj = [];
        for (let index = cardInfo.v+1; index < 15; index++) {
            if(sIndex != -1 && (index - sIndex != 1)){
                sIndex = -1;
                if(tempFj.length >= localCard.length){
                    filter.push(tempFj);
                }
                tempFj = [];
            }   
            if(this.cardCountMap[index] != null){
                if (this.cardCountMap[index].length>=3 && this.cardCountMap[index].length<=4){
                    if(sIndex == -1 || (index - sIndex == 1)){
                        tempFj = tempFj.concat(this.cardCountMap[index].slice(0,3));
                        sIndex=index;
                    }
                }
            }
        }
        if(tempFj.length >= localCard.length){
            filter.push(tempFj);
        }

        let zdFj = [];
        for (let index = 0; index < filter.length; index++) {
            let fi = filter[index];
            for (let findex = 0; findex < fi.length; findex=findex+3) {
                if(findex+localCard.length<=fi.length){
                    zdFj.push(fi.slice(findex,findex+localCard.length));
                }
            }
        }
        let wi = [];
        for (let index = 0; index < zdFj.length; index++) {
            let fi = zdFj[index];
            let fiJson = JSON.stringify(dd.Sort(fi));
            for (let findex = 0; findex < findFj.length; findex++) {
                let fd = findFj[findex];
                if(fiJson != JSON.stringify(dd.Sort(fd))){
                    wi.push(fi);
                }
            }
        }
        if(wi.length > 0){
            zdFj = wi;
        }

        for (let index = 0; index < zdFj.length; index++) {
            this.curGroup.push(zdFj[index]);
        }
    }
        
    private getSingleBefore(dd:DdzData,group: pb.IDouCardGroup):number{
        if(group.single != null && group.single.length > 0){
            let ls = dd.ToLocalCard(group.single);
            return ls[0];
        }
        return -1;
    }
    private getSingle(dd:DdzData,group: pb.IDouCardGroup,cv:number):number{
        //3 拆大于五张的连子
        if(group.sequence != null && group.sequence.length > 0){
            for (let index = 0; index < group.sequence.length; index++) {
                const element = group.sequence[index];
                if(element.cards.length > 5){
                    let localGroup = dd.ToLocalCard(element.cards);
                    return localGroup[localGroup.length-1];
                }
            }
        }

        //4 拆对子
        if(group.pair != null && group.pair.length > 0){
            for (let index = 0; index < group.pair.length; index++) {
                const element = group.pair[index];
                let localGroup = dd.ToLocalCard(element.cards);
                return localGroup[0];
            }
        }
        //5 拆连对
        if(group.linkPair != null && group.linkPair.length > 0){
            for (let index = 0; index < group.linkPair.length; index++) {
                const element = group.linkPair[index];
                let localGroup = dd.ToLocalCard(element.cards);
                return localGroup[0];
            }
        }
        //6 拆三张
        if(group.third != null && group.third.length > 0){
            for (let index = 0; index < group.third.length; index++) {
                const element = group.third[index];
                let localGroup = dd.ToLocalCard(element.cards);
                let localCard = dd.Card(localGroup[0]);
                if(localCard.v != cv){
                    return localGroup[0];
                }
            }
        }

        //拆飞机
        if(group.airplane != null && group.airplane.length > 0){
            for (let index = 0; index < group.airplane.length; index++) {
                const element = group.airplane[index];
                let localGroup = dd.ToLocalCard(element.cards);
                for (let aindex = 0; aindex < localGroup.length; aindex=aindex+3) {
                    let localCard = dd.Card(localGroup[aindex]);
                    if(localCard.v != cv){
                        return localGroup[aindex];
                    }  
                }
            }
        }
        

        //7 拆炸弹
        if(group.bomb != null && group.bomb.length > 0){
            for (let index = 0; index < group.bomb.length; index++) {
                const element = group.bomb[index];
                let localGroup = dd.ToLocalCard(element.cards);
                let localCard = dd.Card(localGroup[0]);
                if(localCard.v != cv){
                    return localGroup[0];
                }
            }
        }
        //8 拆王炸
        if(group.joker != null && group.joker.length == 2){
            let localGroup = dd.ToLocalCard(group.joker);
            let localCard = dd.Card(localGroup[0]);
            if(localCard.v != cv){
                return localGroup[0];
            }
            localCard = dd.Card(localGroup[1]);
            if(localCard.v != cv){
                return localGroup[1];
            }
        }
        //9 拆连炸
        if(group.bombLink != null && group.bombLink.length > 0){
            for (let index = 0; index < group.bombLink.length; index++) {
                const element = group.bombLink[index];
                let localGroup = dd.ToLocalCard(element.cards);
                let localCard = dd.Card(localGroup[0]);
                if(localCard.v != cv){
                    return localGroup[0];
                }
            }
        }

        //10 拆五张的连子
        if(group.sequence != null && group.sequence.length > 0){
            for (let index = 0; index < group.sequence.length; index++) {
                const element = group.sequence[index];
                if(element.cards.length == 5){
                    let localGroup = dd.ToLocalCard(element.cards);
                    return localGroup[0];
                }
            }
        }
        return -1;
    }

    private getPairBefore(dd:DdzData,group: pb.IDouCardGroup):number[]{
        //4 拆对子
        if(group.pair != null && group.pair.length > 0){
            for (let index = 0; index < group.pair.length; index++) {
                const element = group.pair[index];
                let localGroup = dd.ToLocalCard(element.cards);
                return localGroup;
            }
        }
        //5 拆连对
        if(group.linkPair != null && group.linkPair.length > 0){
            for (let index = 0; index < group.linkPair.length; index++) {
                const element = group.linkPair[index];
                let localGroup = dd.ToLocalCard(element.cards);
                return localGroup.slice(0,2);
            }
        }
        return [];
    }

    private getPair(dd:DdzData,group: pb.IDouCardGroup,cv:number):number[]{
        //6 拆三张
        if(group.third != null && group.third.length > 0){
            for (let index = 0; index < group.third.length; index++) {
                const element = group.third[index];
                let localGroup = dd.ToLocalCard(element.cards);
                let localCard = dd.Card(localGroup[0]);
                Log.d("localCard:",localCard);
                if(localCard.v != cv){
                    return localGroup.slice(0,2);
                }
            }
        }

        //拆飞机
        if(group.airplane != null && group.airplane.length > 0){
            for (let index = 0; index < group.airplane.length; index++) {
                const element = group.airplane[index];
                let localGroup = dd.ToLocalCard(element.cards);
                for (let aindex = 0; aindex < localGroup.length; aindex=aindex+3) {
                    let localCard = dd.Card(localGroup[aindex]);
                    if(localCard.v != cv){
                        return localGroup.slice(aindex,aindex+2);
                    }  
                }
            }
        }

        //7 拆炸弹
        if(group.bomb != null && group.bomb.length > 0){
            for (let index = 0; index < group.bomb.length; index++) {
                const element = group.bomb[index];
                let localGroup = dd.ToLocalCard(element.cards);
                let localCard = dd.Card(localGroup[0]);
                if(localCard.v != cv){
                    return localGroup.slice(0,2);
                }
            }
        }

        //9 拆连炸
        if(group.bombLink != null && group.bombLink.length > 0){
            for (let index = 0; index < group.bombLink.length; index++) {
                const element = group.bombLink[index];
                let localGroup = dd.ToLocalCard(element.cards);
                for (let lz = 0; lz < localGroup.length; lz=lz+4) {
                    let localCard = dd.Card(localGroup[lz]);
                    if(localCard.v > cv){
                        return localGroup.slice(lz,lz+2);
                    }     
                }
            }
        }
        return [];
    }

    private getThree(dd:DdzData,group: pb.IDouCardGroup,cv:number):number[][]{
        //拆飞机
        let th = []; 
        if(group.airplane != null && group.airplane.length > 0){
            for (let index = 0; index < group.airplane.length; index++) {
                const element = group.airplane[index];
                let localGroup = dd.ToLocalCard(element.cards);
                for (let aindex = 0; aindex < localGroup.length; aindex=aindex+3) {
                    let localCard = dd.Card(localGroup[aindex])
                    if(localCard.v > cv){
                        th.push(localGroup.slice(aindex,aindex+3));
                    }  
                }
            }
        }
        //7 拆炸弹
        if(group.bomb != null && group.bomb.length > 0){
            for (let index = 0; index < group.bomb.length; index++) {
                const element = group.bomb[index];
                let localGroup = dd.ToLocalCard(element.cards);
                let localCard = dd.Card(localGroup[0]);
                if(localCard.v > cv){
                    th.push(localGroup.slice(0,3));
                }
            }
        }
        //9 拆连炸
        if(group.bombLink != null && group.bombLink.length > 0){
            for (let index = 0; index < group.bombLink.length; index++) {
                const element = group.bombLink[index];
                let localGroup = dd.ToLocalCard(element.cards);
                for (let lz = 0; lz < localGroup.length; lz=lz+4) {
                    let localCard = dd.Card(localGroup[lz]);
                    if(localCard.v > cv){
                        th.push(localGroup.slice(lz,lz+3));
                    }     
                }
            }
        }
        return th;
    }

    private beDouCardType_ThirdSingle(localCard:number[],group: pb.IDouCardGroup){
        let dd = Manager.dataCenter.get(DdzData);
        let newlocalCard = this.reSort(localCard);
        Log.e("reSort:",localCard,newlocalCard);
        if(newlocalCard.length != localCard.length){
            Manager.tips.debug("重新排序错误");
            return;
        }
        localCard = newlocalCard;

        // if(group.third != null && group.third.length > 0 && group.single != null && group.single.length > 0){
        //     for (let index = 0; index < group.third.length; index++) {
        //         const element = group.third[index];
        //         if(element.cards.length >= localCard.length-1){
        //             let localGroup = dd.ToLocalCard(element.cards);
        //             for (let fj = 0; fj < localGroup.length; fj++) {
        //                 if(this.isBigger(localGroup[fj] , localCard[0])){
        //                     let ls = dd.ToLocalCard(group.single)
        //                     this.curGroup.push(localGroup.concat([ls[0]]));
        //                 }
        //             }
        //         }
        //     }
        // }

        let thirds = [];
        if(group.third != null && group.third.length > 0){
            for (let index = 0; index < group.third.length; index++) {
                const element = group.third[index];
                let localGroup = dd.ToLocalCard(element.cards);
                if(this.isBigger(localGroup[0] , localCard[0])){
                    thirds.push(localGroup);
                } 
            }
        }
        let dp = this.getSingleBefore(dd,group);
        if(thirds.length > 0 && dp>0){
            for (let index = 0; index < thirds.length; index++) {
                const thData = thirds[index];
                this.curGroup.push(thData.concat([dp]));    
            }    
        }

        this.addBomb(dd,group);
        this.addJoker(dd,group);
        this.addbombLink(dd,group);

        if(thirds.length > 0 && dp < 0){
            for (let index = 0; index < thirds.length; index++) {
                const thData = thirds[index];
                let cardData = dd.Card(thData[0]);
                let dp = this.getSingle(dd,group,cardData.v);
                if(dp>0){
                    this.curGroup.push(thData.concat([]));
                }
            } 
        }
  
        let th = this.getThree(dd,group,dd.Card(localCard[0]).v);
        if(th.length > 0){
            for (let index = 0; index < th.length; index++) {
                const element = th[index];
                if(element != null && element.length > 0){
                    let fs = dp;
                    if(fs < 0){
                        fs = this.getSingle(dd,group,dd.Card(element[0]).v);
                    }
                    if(fs != -1){
                        this.curGroup.push(element.concat([fs]));
                    }  
                } 
            }
        }
    }

    private beDouCardType_ThirdPair(localCard:number[],group: pb.IDouCardGroup){
        let dd = Manager.dataCenter.get(DdzData);

        let newlocalCard = this.reSort(localCard);
        Log.e("reSort:",localCard,newlocalCard);
        if(newlocalCard.length != localCard.length){
            Manager.tips.debug("重新排序错误");
            return;
        }
        localCard = newlocalCard;

        // if(group.third != null && group.third.length > 0 && group.pair != null && group.pair.length > 0){
        //     for (let index = 0; index < group.third.length; index++) {
        //         const element = group.third[index];
        //         if(element.cards.length >= localCard.length-2){
        //             let localGroup = dd.ToLocalCard(element.cards);
        //             for (let fj = 0; fj < localGroup.length; fj++) {
        //                 if(this.isBigger(localGroup[fj] , localCard[0])){
        //                     let ls = dd.ToLocalCard(group.pair[0].cards)
        //                     this.curGroup.push(localGroup.concat(ls));
        //                 }
        //             }
        //         }
        //     }
        // }

        let thirds = [];
        if(group.third != null && group.third.length > 0){
            for (let index = 0; index < group.third.length; index++) {
                const element = group.third[index];
                let localGroup = dd.ToLocalCard(element.cards);
                if(this.isBigger(localGroup[0] , localCard[0])){
                    thirds.push(localGroup);
                }
            }
        }
        let dp = this.getPairBefore(dd,group);
        if(thirds.length > 0 && dp.length == 2){
            for (let index = 0; index < thirds.length; index++) {
                const thData = thirds[index];
                this.curGroup.push(thData.concat(dp));
            }    
        }

        this.addBomb(dd,group);
        this.addJoker(dd,group);
        this.addbombLink(dd,group);

        if(thirds.length > 0 && dp.length == 0){
            for (let index = 0; index < thirds.length; index++) {
                const thData = thirds[index];
                let cardData = dd.Card(thData[0]);
                Log.e("thData:",cardData);
                let dp = this.getPair(dd,group,cardData.v);
                if(dp.length==2){
                    this.curGroup.push(thData.concat(dp));
                }
            }    
        }

        let th = this.getThree(dd,group,dd.Card(localCard[0]).v);
        if(th.length > 0){
            for (let index = 0; index < th.length; index++) {
                const element = th[index];
                if(element != null && element.length > 0){
                    let fs = dp;
                    if(fs.length == 0){
                        fs = this.getPair(dd,group,dd.Card(element[0]).v);
                    }
                    if(fs.length == 2){
                        this.curGroup.push(element.concat(fs));
                    }  
                } 
            }
        }
    }

    private getAirplaneSingleBefore(dd:DdzData ,len:number,group: pb.IDouCardGroup):number[]{
        let as = [];    
        if(group.single != null && group.single.length > 0){
            let localGroup = dd.ToLocalCard(group.single);
            let sl = len-as.length;
            if(localGroup.length < sl){
                sl = localGroup.length;
            }
            as = localGroup.slice(0,sl);
            if(as.length == len){
                return as;
            }
        }
        if(group.single != null && group.sequence != null){
            for (let index = 0; index < group.sequence.length; index++) {
                const seq = group.sequence[index];
                let localseq = dd.ToLocalCard(seq.cards);
                if(localseq.length - 5 >=len){
                    let left = len - as.length;
                    if(left > 0){
                        let leftArr = [];
                        for (let leftIndex = localseq.length-1; leftIndex > 4; leftIndex--) {
                            leftArr.push(localseq[leftIndex]);
                        }

                        let sl = len-as.length;
                        if(leftArr.length < sl){
                            sl = leftArr.length;
                        }
                        as = as.concat(leftArr.slice(0,sl));
                        if(as.length == len){
                            return as;
                        }
                    }
                }
            }
        }
        if(group.pair != null && group.pair.length > 0){
            let data = [];
            for (let index = 0; index < group.pair.length; index++) {
                data = data.concat(data,group.pair[index].cards);
            }
            if(data.length > 0){
                let ld = dd.ToLocalCard(data);
                let sl = len-as.length;
                if(ld.length < sl){
                    sl = ld.length;
                }
                as = as.concat(ld.slice(0,sl));
                if(as.length == len){
                    return as;
                }
            }
        }
        if(group.linkPair != null && group.linkPair.length > 0){
            let data = [];
            for (let index = 0; index < group.linkPair.length; index++) {
                data = data.concat(data,group.linkPair[index].cards);
            }
            if(data.length > 0){
                let ld = dd.ToLocalCard(data);
                let sl = len-as.length;
                if(ld.length < sl){
                    sl = ld.length;
                }
                as = as.concat(ld.slice(0,sl));
                if(as.length == len){
                    return as;
                }
            }
        }
        return as;
    }

    private getAirplaneSingleAfter(dd:DdzData ,len:number,group: pb.IDouCardGroup,as:number[],fj:number[]):number[]{ 
        Log.d("fj:",fj);
        if(group.third != null && group.third.length > 0){
            let data = [];
            for (let index = 0; index < group.third.length; index++) {
                data = data.concat(data,group.third[index].cards);
            }
      
            let ldd = dd.ToLocalCard(data);
            let ndd = [];
            for (let lddindex = 0; lddindex < ldd.length; lddindex++) {
                const lddele = dd.Card(ldd[lddindex]);
                for (let fjIndex = 0; fjIndex < fj.length; fjIndex++) {
                    const fjele = fj[fjIndex];
                    if(lddele.v != fjele){
                        ndd.push(ldd[lddindex]);
                    }
                }
            }
            let sl = len-as.length;
            if(ndd.length < sl){
                sl = ndd.length;
            }
            as = as.concat(ndd.slice(0,sl));
            if(as.length == len){
                return as;
            }

        }

        if(group.airplane != null && group.airplane.length > 0){
            let data = [];
            for (let index = 0; index < group.airplane.length; index++) {
                data = data.concat(data,group.airplane[index].cards);
            }
        
            let ldd = dd.ToLocalCard(data);
            let ndd = [];
            for (let lddindex = 0; lddindex < ldd.length; lddindex++) {
                const lddele = dd.Card(ldd[lddindex]);
                for (let fjIndex = 0; fjIndex < fj.length; fjIndex++) {
                    const fjele = fj[fjIndex];
                    if(lddele.v != fjele){
                        ndd.push(ldd[lddindex]);
                    }
                }
            }

            let sl = len-as.length;
            if(ndd.length < sl){
                sl = ndd.length;
            }
            as = as.concat(ndd.slice(0,sl));
            if(as.length == len){
                return as;
            }
        }

        if(group.bomb != null && group.bomb.length > 0){
            let data = [];
            for (let index = 0; index < group.bomb.length; index++) {
                data = data.concat(data,group.bomb[index].cards);
            }

            let ldd = dd.ToLocalCard(data);
            let ndd = [];
            for (let lddindex = 0; lddindex < ldd.length; lddindex++) {
                const lddele = dd.Card(ldd[lddindex]);
                for (let fjIndex = 0; fjIndex < fj.length; fjIndex++) {
                    const fjele = fj[fjIndex];
                    if(lddele.v != fjele){
                        ndd.push(ldd[lddindex]);
                    }
                }
            }

            let sl = len-as.length;
            if(ndd.length < sl){
                sl = ndd.length;
            }
            as = as.concat(ndd.slice(0,sl));
            if(as.length == len){
                return as;
            }
        }

        if(group.joker != null && group.joker.length > 0){
            let ldd = dd.ToLocalCard(group.joker);
            if(ldd.length > 0){
                let sl = len-as.length;
                if(ldd.length < sl){
                    sl = ldd.length;
                }
                as = as.concat(ldd.slice(0,sl));
                if(as.length == len){
                    return as;
                }
            } 
        }

        if(group.bombLink != null && group.bombLink.length > 0){
            let data = [];
            for (let index = 0; index < group.bombLink.length; index++) {
                data = data.concat(data,group.bombLink[index].cards);
            }

            let ldd = dd.ToLocalCard(data);
            let ndd = [];
            for (let lddindex = 0; lddindex < ldd.length; lddindex++) {
                const lddele = dd.Card(ldd[lddindex]);
                for (let fjIndex = 0; fjIndex < fj.length; fjIndex++) {
                    const fjele = fj[fjIndex];
                    if(lddele.v != fjele){
                        ndd.push(ldd[lddindex]);
                    }
                }
            }

            let sl = len-as.length;
            if(ndd.length < sl){
                sl = ndd.length;
            }
            as = as.concat(ndd.slice(0,sl));
            if(as.length == len){
                return as;
            }
        }

        return as;
    }

    private beDouCardType_AirplaneSingle(localCard:number[],group: pb.IDouCardGroup){
        let dd = Manager.dataCenter.get(DdzData);
        let len = localCard.length / 4;

        let newlocalCard = this.reSort(localCard);
        Log.e("reSort:",localCard,newlocalCard);
        if(newlocalCard.length != localCard.length){
            Manager.tips.debug("重新排序错误");
            return;
        }
        localCard = newlocalCard;

        let findFj = [];
        if(group.airplane != null && group.airplane.length > 0){
            for (let index = 0; index < group.airplane.length; index++) {
                const element = group.airplane[index];
                if(element.cards.length >= len*3){
                    let localGroup = dd.ToLocalCard(element.cards);
                    for (let fj = 0; fj < localGroup.length; fj++) {
                        if(this.isBigger(localGroup[fj] , localCard[0])){
                            if(fj+len*3 <= localGroup.length){
                                let fjData = localGroup.slice(fj,fj+len*3)
                                findFj.push(fjData);
                            }
                        }    
                    }
                }
            }
        }
        let td = this.getAirplaneSingleBefore(dd,len,group);
        if(findFj.length>0){
            if(td.length == len){
                for (let index = 0; index < findFj.length; index++) {
                    let fj = findFj[index];
                    this.curGroup.push(fj.concat(td));
                }
            }
        }


        this.addBomb(dd,group);
        this.addJoker(dd,group);
        this.addbombLink(dd,group);

        if(findFj.length>0 && td.length < len){
            for (let index = 0; index < findFj.length; index++) {
                let fj = findFj[index];
                let fjValue = [];
                for (let fjIndex = 0; fjIndex < fj.length; fjIndex=fjIndex+3) {
                    const element = dd.Card(fj[fjIndex]).v;
                    fjValue.push(element);
                }
                let tda = td;
                if(tda.length < len){
                    tda = this.getAirplaneSingleAfter(dd,len,group,td,fjValue);
                }

                if(tda.length == len){
                    this.curGroup.push(fj.concat(tda));
                }
            }
        }


        let filter = [];
        let cardInfo = dd.Card(localCard[0]);
        let sIndex = -1;

        let tempFj = [];
        for (let index = cardInfo.v+1; index < 15; index++) {
            if(sIndex != -1 && (index - sIndex != 1)){
                sIndex = -1;
                if(tempFj.length >= len*3){
                    filter.push(tempFj);
                }
                tempFj = [];
            }   
            if(this.cardCountMap[index] != null){
                if (this.cardCountMap[index].length>=3 && this.cardCountMap[index].length<=4){
                    if(sIndex == -1 || (index - sIndex == 1)){
                        tempFj = tempFj.concat(this.cardCountMap[index].slice(0,3));
                        sIndex=index;
                    }
                }
            }
        }
        if(tempFj.length >= len*3){
            filter.push(tempFj);
        }
        let zdFj = [];
        for (let index = 0; index < filter.length; index++) {
            let fi = filter[index];
            for (let findex = 0; findex < fi.length; findex=findex+3) {
                if(findex+len*3<=fi.length){
                    zdFj.push(fi.slice(findex,findex+len*3));
                }
            }
        }
        let wi = [];
        for (let index = 0; index < zdFj.length; index++) {
            let fi = zdFj[index];
            let fiJson = JSON.stringify(dd.Sort(fi));
            for (let findex = 0; findex < findFj.length; findex++) {
                let fd = findFj[findex];
                if(fiJson != JSON.stringify(dd.Sort(fd))){
                    wi.push(fi);
                }
            }
        }
        if(wi.length > 0){
            zdFj = wi;
        }

        if(zdFj.length>0){
            for (let index = 0; index < zdFj.length; index++) {
                let fj = zdFj[index];
                let fjValue = [];
                for (let fjIndex = 0; fjIndex < fj.length; fjIndex=fjIndex+3) {
                    const element = dd.Card(fj[fjIndex]).v;
                    fjValue.push(element);
                }
                let tda = td;
                if(tda.length < len){
                    tda = this.getAirplaneSingleAfter(dd,len,group,td,fjValue);
                }
                if(tda.length == len){
                    this.curGroup.push(fj.concat(tda));
                }
            }
        }
    }
    

    private getAirplanePairBefore(dd:DdzData ,len:number,group: pb.IDouCardGroup):number[]{
        let as = [];    
        if(group.pair != null && group.pair.length > 0){
            let data = [];
            for (let index = 0; index < group.pair.length; index++) {
                data = data.concat(group.pair[index].cards);
            }
            if(data.length > 0){
                let ld = dd.ToLocalCard(data);
                let sl = len-as.length;
                if(ld.length < sl){
                    sl = ld.length;
                }
                as = as.concat(ld.slice(0,sl));
                if(as.length == len){
                    return as;
                }
            }
        }
        if(group.linkPair != null && group.linkPair.length > 0){
            let data = [];
            for (let index = 0; index < group.linkPair.length; index++) {
                data = data.concat(group.linkPair[index].cards);
            }
            if(data.length > 0){
                let ld = dd.ToLocalCard(data);
                let sl = len-as.length;
                if(ld.length < sl){
                    sl = ld.length;
                }
                as = as.concat(ld.slice(0,sl));
                if(as.length == len){
                    return as;
                }
            }
        }
        return as;
    }

    private getAirplanePairAfter(dd:DdzData ,len:number,group: pb.IDouCardGroup,ass:number[],fj:number[]):number[]{ 
        let as = ass.concat([]);
        if(group.third != null && group.third.length > 0){
            let data = [];
            for (let index = 0; index < group.third.length; index++) {
                data = data.concat(group.third[index].cards.slice(0,2));
            }
      
            let ldd = dd.ToLocalCard(data);
            let ndd = [];
            for (let lddindex = 0; lddindex < ldd.length; lddindex++) {
                const lddele = dd.Card(ldd[lddindex]);
                for (let fjIndex = 0; fjIndex < fj.length; fjIndex++) {
                    const fjele = dd.Card(fj[fjIndex]).v;
                    if(lddele.v != fjele){
                        ndd.push(ldd[lddindex]);
                    }
                }
            }
            let sl = len-as.length;
            if(ndd.length < sl){
                sl = ndd.length;
            }
            as = as.concat(ndd.slice(0,sl));
            if(as.length == len){
                return as;
            }

        }

        if(group.airplane != null && group.airplane.length > 0){
            let data = [];
            for (let index = 0; index < group.airplane.length; index++) {
                let lc = dd.ToLocalCard(group.airplane[index].cards);
                for (let fi = 0; fi < lc.length; fi=fi+3) {
                    data = data.concat(lc.slice(fi,fi+2));
                }
     
            }
            let ldd = data;
            let ndd = [];
            for (let lddindex = 0; lddindex < ldd.length; lddindex++) {
                const lddele = dd.Card(ldd[lddindex]);
                let nofound = false;
                for (let fjIndex = 0; fjIndex < fj.length; fjIndex++) {
                    const fjele = dd.Card(fj[fjIndex]).v;
                    if(lddele.v == fjele){
                        nofound = true;
                        break;
                    }
                }
                if(!nofound){
                    ndd.push(ldd[lddindex]);
                }
            }

            let sl = len-as.length;
            if(ndd.length < sl){
                sl = ndd.length;
            }
            as = as.concat(ndd.slice(0,sl));
            if(as.length == len){
                return as;
            }
        }

        if(group.bomb != null && group.bomb.length > 0){
            let data = [];
            for (let index = 0; index < group.bomb.length; index++) {
                data = data.concat(group.bomb[index].cards.slice(0,2));
            }

            let ldd = dd.ToLocalCard(data);
            let ndd = [];
            for (let lddindex = 0; lddindex < ldd.length; lddindex++) {
                const lddele = dd.Card(ldd[lddindex]);
                let nofound = false;
                for (let fjIndex = 0; fjIndex < fj.length; fjIndex++) {
                    const fjele = dd.Card(fj[fjIndex]).v;
                    if(lddele.v == fjele){
                        nofound = true;
                        break;
                    }
                }
                if(!nofound){
                    ndd.push(ldd[lddindex]);
                }
            }

            let sl = len-as.length;
            if(ndd.length < sl){
                sl = ndd.length;
            }
            as = as.concat(ndd.slice(0,sl));
            if(as.length == len){
                return as;
            }
        }

        if(group.bombLink != null && group.bombLink.length > 0){
            let data = [];
            for (let index = 0; index < group.bombLink.length; index++) {
                for (let lz = 0; lz < group.bombLink[index].cards.length; lz=lz+4) {
                    data = data.concat(group.bombLink[index].cards.slice(lz,lz+2));
                }

            }

            let ldd = dd.ToLocalCard(data);
            let ndd = [];
            for (let lddindex = 0; lddindex < ldd.length; lddindex++) {
                const lddele = dd.Card(ldd[lddindex]);
                let nofound = false;
                for (let fjIndex = 0; fjIndex < fj.length; fjIndex++) {
                    const fjele = dd.Card(fj[fjIndex]).v;
                    if(lddele.v == fjele){
                        nofound = true;
                        break;
                    }
                }
                if(!nofound){
                    ndd.push(ldd[lddindex]);
                }
            }

            let sl = len-as.length;
            if(ndd.length < sl){
                sl = ndd.length;
            }
            as = as.concat(ndd.slice(0,sl));
            if(as.length == len){
                return as;
            }
        }

        return as;
    }

    private beDouCardType_AirplanePair(localCard:number[],group: pb.IDouCardGroup){
        let dd = Manager.dataCenter.get(DdzData);
        let len = localCard.length / 5;

        let newlocalCard = this.reSort(localCard);
        Log.e("reSort:",localCard,newlocalCard);
        if(newlocalCard.length != localCard.length){
            Manager.tips.debug("重新排序错误");
            return;
        }
        localCard = newlocalCard;

        let findFj = [];
        if(group.airplane != null && group.airplane.length > 0){
            for (let index = 0; index < group.airplane.length; index++) {
                const element = group.airplane[index];
                if(element.cards.length >= len*3){
                    let localGroup = dd.ToLocalCard(element.cards);
                    for (let fj = 0; fj < localGroup.length; fj++) {
                        if(this.isBigger(localGroup[fj] , localCard[0])){
                            if(fj+len*3 <= localGroup.length){
                                findFj.push(localGroup.slice(fj,fj+len*3));
                            }
                        }    
                    }
                }
            }
        }
        let td = this.getAirplanePairBefore(dd,len*2,group);
        if(findFj.length > 0){
            if(td.length == len*2){
                for (let index = 0; index < findFj.length; index++) {
                    let fj = findFj[index];
                    this.curGroup.push(fj.concat(td));
                }
            }
        }

        this.addBomb(dd,group);
        this.addJoker(dd,group);
        this.addbombLink(dd,group);

        if(findFj.length > 0 && td.length < len*2){
            for (let index = 0; index < findFj.length; index++) {
                let fj = findFj[index];
                let fjValue = [];
                for (let fjIndex = 0; fjIndex < fj.length; fjIndex=fjIndex+3) {
                    const element = fj[fjIndex];
                    fjValue.push(element);
                }
                let tda = this.getAirplanePairAfter(dd,len*2,group,td,fjValue);
                if(tda.length == len*2){
                    this.curGroup.push(fj.concat(tda));
                }
            }
        }


        let filter = [];
        let cardInfo = dd.Card(localCard[0]);
        let sIndex = -1;

        let tempFj = [];
        for (let index = cardInfo.v+1; index < 15; index++) {
            if(sIndex != -1 && (index - sIndex != 1)){
                sIndex = -1;
                if(tempFj.length >= len*3){
                    filter.push(tempFj);
                }
                tempFj = [];
            }   
            if(this.cardCountMap[index] != null){
                if (this.cardCountMap[index].length>=3 && this.cardCountMap[index].length<=4){
                    if(sIndex == -1 || (index - sIndex == 1)){
                        tempFj = tempFj.concat(this.cardCountMap[index].slice(0,3));
                        sIndex=index;
                    }
                }
            }
        }
        if(tempFj.length >= len*3){
            filter.push(tempFj);
        }

        let zdFj = [];
        for (let index = 0; index < filter.length; index++) {
            let fi = filter[index];
            for (let findex = 0; findex < fi.length; findex=findex+3) {
                if(findex+len*3<=fi.length){
                    zdFj.push(fi.slice(findex,findex+len*3));
                }
            }
        }
        let wi = [];
        for (let index = 0; index < zdFj.length; index++) {
            let fi = zdFj[index];
            let fiJson = JSON.stringify(dd.Sort(fi));
            for (let findex = 0; findex < findFj.length; findex++) {
                let fd = findFj[findex];
                if(fiJson != JSON.stringify(dd.Sort(fd))){
                    wi.push(fi);
                }
            }
        }
        if(wi.length > 0){
            zdFj = wi;
        }

        if(zdFj.length>0){
            for (let index = 0; index < zdFj.length; index++) {
                let fj = zdFj[index];
                let tda = td;
                if(tda.length < len*2){
                    let fjValue = [];
                    for (let fjIndex = 0; fjIndex < fj.length; fjIndex=fjIndex+3) {
                        const element = fj[fjIndex];
                        fjValue.push(element);
                    }
                    tda = this.getAirplanePairAfter(dd,len*2,group,td,fjValue);
                }
                if(tda.length == len*2){
                    this.curGroup.push(fj.concat(tda));
                }
            }
        }
    }
    
    private beDouCardType_BombSingle(localCard:number[],group: pb.IDouCardGroup){
        let dd = Manager.dataCenter.get(DdzData);
        let len = localCard.length / 3;

        let newlocalCard = this.reSort(localCard);
        Log.e("reSort:",localCard,newlocalCard);
        if(newlocalCard.length != localCard.length){
            Manager.tips.debug("重新排序错误");
            return;
        }
        localCard = newlocalCard;

        let findBomb = [];
        if(group.bomb != null && group.bomb.length > 0){
            for (let index = 0; index < group.bomb.length; index++) {
                const element = group.bomb[index];
                let localGroup = dd.ToLocalCard(element.cards); 
                if(this.isBigger(localGroup[0] , localCard[0])){
                    findBomb.push(localGroup);
                }
            }
        }
        let td = this.getAirplaneSingleBefore(dd,len,group);
        if(findBomb.length > 0){
            if(td.length == len){
                for (let index = 0; index < findBomb.length; index++) {
                    let fj = findBomb[index];
                    this.curGroup.push(fj.concat(td));
                }
            }
        }

        this.addBomb(dd,group);
        this.addJoker(dd,group);
        this.addbombLink(dd,group);

        if(findBomb.length>0 && td.length < len){
            for (let index = 0; index < findBomb.length; index++) {
                let fj = findBomb[index];
                let fjValue = [];
                for (let fjIndex = 0; fjIndex < fj.length; fjIndex=fjIndex+4) {
                    const element = dd.Card(fj[fjIndex]).v;
                    fjValue.push(element);
                }
                let tda = td;
                if(tda.length < len){
                    tda = this.getAirplaneSingleAfter(dd,len,group,td,fjValue);
                }
                if(tda.length == len){
                    this.curGroup.push(fj.concat(tda));
                }
            }
        }

        findBomb = [];
        for (let index = 0; index < group.bombLink.length; index++) {
            let bl = dd.ToLocalCard(group.bombLink[index].cards);
            for (let blIndex = 0; blIndex < bl.length; blIndex=blIndex+4) {
                if(this.isBigger(bl[blIndex],localCard[0])){
                    findBomb.push(bl.slice(blIndex,blIndex+4));
                }
            }
        }

        if(findBomb.length>0){
            for (let index = 0; index < findBomb.length; index++) {
                let fj = findBomb[index];
                let fjValue = [];
                for (let fjIndex = 0; fjIndex < fj.length; fjIndex=fjIndex+4) {
                    const element = dd.Card(fj[fjIndex]).v;
                    fjValue.push(element);
                }
                let tda = td;
                if(tda.length < len){
                    tda = this.getAirplaneSingleAfter(dd,len,group,td,fjValue);
                }
                if(tda.length == len){
                    this.curGroup.push(fj.concat(tda));
                }
            }
        }

    }

    private beDouCardType_BombPair(localCard:number[],group: pb.IDouCardGroup){
        let dd = Manager.dataCenter.get(DdzData);
        let len = localCard.length / 4;
        
        let newlocalCard = this.reSort(localCard);
        Log.e("reSort:",localCard,newlocalCard);
        if(newlocalCard.length != localCard.length){
            Manager.tips.debug("重新排序错误");
            return;
        }
        localCard = newlocalCard;

        let findBomb = [];
        if(group.bomb != null && group.bomb.length > 0){
            for (let index = 0; index < group.bomb.length; index++) {
                const element = group.bomb[index];
                let localGroup = dd.ToLocalCard(element.cards); 
                if(this.isBigger(localGroup[0] , localCard[0])){
                    findBomb.push(localGroup);
                }
            }
        }
        let td = this.getAirplanePairBefore(dd,len*2,group);
        if(findBomb.length > 0){
            if(td.length == len*2){
                for (let index = 0; index < findBomb.length; index++) {
                    let fj = findBomb[index];
                    this.curGroup.push(fj.concat(td));
                }
            }
        }

        this.addBomb(dd,group);
        this.addJoker(dd,group);
        this.addbombLink(dd,group);

        if(findBomb.length>0 && td.length < len*2){
            for (let index = 0; index < findBomb.length; index++) {
                let fj = findBomb[index];
                let fjValue = [];
                for (let fjIndex = 0; fjIndex < fj.length; fjIndex=fjIndex+4) {
                    const element = fj[fjIndex];
                    fjValue.push(element);
                }
                let tda = this.getAirplanePairAfter(dd,len*2,group,td,fjValue);
                if(tda.length == len*2){
                    this.curGroup.push(fj.concat(tda));
                }
            }
        }

        findBomb = [];
        for (let index = 0; index < group.bombLink.length; index++) {
            let bl = dd.ToLocalCard(group.bombLink[index].cards);
            for (let blIndex = 0; blIndex < bl.length; blIndex=blIndex+4) {
                if(this.isBigger(bl[blIndex],localCard[0])){
                    findBomb.push(bl.slice(blIndex,blIndex+4));
                }
            }
        }

        if(findBomb.length>0){
            for (let index = 0; index < findBomb.length; index++) {
                let fj = findBomb[index];
                let fjValue = [];
                for (let fjIndex = 0; fjIndex < fj.length; fjIndex=fjIndex+4) {
                    const element = dd.Card(fj[fjIndex]).v;
                    fjValue.push(element);
                }
                let tda = td;
                if(tda.length < len){
                    tda = this.getAirplanePairAfter(dd,len,group,td,fjValue);
                }
                if(tda.length == len){
                    this.curGroup.push(fj.concat(tda));
                }
            }
        }
    }
    
    private beDouCardType_Rocket(localCard:number[],group: pb.IDouCardGroup){
        let dd = Manager.dataCenter.get(DdzData);
        if(group.bombLink != null && group.bombLink.length > 0){
            for (let index = 0; index < group.bombLink.length; index++) {
                const element = group.bombLink[index];
                let localCard = dd.ToLocalCard(element.cards);
                this.curGroup.push(localCard);
            }
        }
        if(group.bombLink != null && group.bombLink.length > 0){
            for (let index = 0; index < group.bombLink.length; index++) {
                const element = group.bombLink[index];
                let localCard = dd.ToLocalCard(element.cards);
                for (let lzi = 0; lzi < localCard.length; lzi=lzi+4) {
                    if(lzi+8< localCard.length){
                        this.curGroup.push(localCard.slice(lzi,lzi+8));
                    }   
                }
            }
        }
    }

    private beDouCardType_BombLink(localCard:number[],group: pb.IDouCardGroup){
        let dd = Manager.dataCenter.get(DdzData);
        if(group.bombLink != null && group.bombLink.length > 0){
            for (let index = 0; index < group.bombLink.length; index++) {
                const element = group.bombLink[index];
                if(element.cards.length >= localCard.length){
                    let localGroup = dd.ToLocalCard(element.cards);
                    for (let ei = 0; ei < localGroup.length; ei++) {
                        const cards = localGroup[ei];
                        if(this.isBigger(cards, localCard[0]) && ei+localCard.length <= localGroup.length){
                            this.curGroup.push(localGroup.slice(ei,ei+localCard.length));
                        }
                    }
                }
            }

            for (let index = 0; index < group.bombLink.length; index++) {
                const element = group.bombLink[index];
                if(element.cards.length > localCard.length){
                    let localGroup = dd.ToLocalCard(element.cards);
                    this.curGroup.push(localGroup);
                }
            }
        }

    }

}   