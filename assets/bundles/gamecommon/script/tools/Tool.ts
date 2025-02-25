import { RoomManager } from "../manager/RoomManager";


export class Tool  {




    static ClipString(str: string, len: number): string 
    {
        let len1 = str.length;
        if (len1>len) 
        {
            return str.substring(0,len)
        }
        return str
    
    }

    static ClipStringMoreAdd(str: string, len: number,stradd:string): string 
    {
        let len1 = str.length;
        if (len1>len) 
        {
            return str.substring(0,len)+stradd
        }
        return str
    
    }

    /**
     * @description 转换成string 万 亿
     * @param obj 
     */
    static CurrencyToString(arg0: number) 
    {
        let tabItem =  this.NumToString(arg0);
        return tabItem.valueNum+tabItem.unitString;

    }

    /** 转换成string */
    static NumToString(arg0: number)
    {
        let num = Math.abs(arg0);
        let isNegative = (arg0<0);
        let value =0;
        let unit ="";

        if (arg0 < 1000000 ) 
        {
            value =arg0;
        }
        else if (arg0 < 10000000 )
        {
            value =Math.floor(arg0/100)/100
            unit ="万";
        }
        else if (arg0 < 100000000 )
        {
            value =Math.floor(arg0/1000)/100
            unit ="万";
        }
        else
        {
            let lengt = String(arg0).length
            value =Math.floor(arg0/Math.pow(10,lengt-5)) /Math.pow(10,13-lengt)
            unit ="亿";
        }

        if (isNegative) {
            value = value*(-1)
        }
        return {valueNum : value,unitString :unit}
    }

    /** 转化为单位  */
    static GetPreciseDecimal(num:number, n:number)
    {
        let nDecimal = 10 ^ n
        let nTemp = Math.floor(num * nDecimal);
        let nRet = nTemp / nDecimal;
        return nRet
    }


    static  GetMultiple(num:number,xiaoShu:number):string
    {
        if (num < 10000 ) 
        {
            return String(num)
        } 
        else if (num >= 10000 && num < 100000000 ) 
        {
            if (num%1000==0) 
            {
                return (num/10000)+"万"
            }
            else
            {
                // return (num/10000).toFixed(xiaoShu)+"万"
                return this.FormatNumTwo(num/10000,xiaoShu)+"万"
            }
        }
        else if (num >= 100000000  ) 
        {
            if (num%1000000000 == 0) 
            {
                return (num/100000000)+"亿"
            }
            else
            {
                // return (num/100000000).toFixed(xiaoShu)+"亿"
                return this.FormatNumTwo(num/100000000,xiaoShu)+"亿"
            }
        }

    }

    static FormatNumTwo(num:number,xiaoShu:number)
    {
        let str = num.toString()
        str= str.substring(0,str.lastIndexOf('.')+(xiaoShu+1))
        return str
    }




    /**
     * @description 深度拷贝
     * @param obj 
     */
     static Clone(obj) {
        var obj3 = JSON.parse(JSON.stringify(obj));
        return obj3;
    }


    /**
         * 生成范围随机数
         * @Min 最小值
         * @Max 最大值
         */
    static GetRandomNum(Min, Max):number 
    {
        let Range = Max - Min;
        let Rand = Math.random();
        return  parseInt((Min + Math.round(Rand * Range))) ;
    }



    static BubbleSort(array: number[] ): number[] {
        const arr = [...array]
        for (let i = 0, len = arr.length; i < len; i++) {
            let noBubble = true
            // 循环走完第 n 轮循环的时候，数组的后 n 个元素就已经是有序的，所以是 len - 1 - i
            for (let j = 0; j < len - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {
                    ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
                    noBubble = false
                }
            }
            if (noBubble) {
                // 当前一轮没有进行冒泡，说明数组已然有序
                return arr
            }
        }
        return arr
    }

    static SelectSort(array: number[]): number[] {
        const arr = [...array]
        let minIndex: number
        for (let i = 0, len = arr.length; i < len - 1; i++) {
            minIndex = i
            for (let j = i; j < len; j++) {
                if (arr[minIndex] > arr[j]) {
                    minIndex = j
                }
            }
            if (minIndex !== i) {
                ;[arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
            }
        }
        return arr
    }

    static JudgeIsHave(arg :  {} , temp:number){
        let isHave= false;
        if (arg==null || arg=={}  ) {
            return false;
        } else {
            for (const [key, val] of Object.entries(arg)) {
                // Log.e("IsWeiCard : ",key, val)
                if (Number(val)== Number(temp)) 
                {
                    isHave =true;
                    return isHave
                }
            
            }
        }
        return isHave;
    }


    static GetBiaoQingConfigItem(subid:number, bqconfig:cc.JsonAsset)
    {
        for (const [key, val] of Object.entries(bqconfig.json))
        {
            let itemData = bqconfig.json[key]
            if (Number(key) ==subid) 
            {
                return itemData
            }
        }
        return null
    }


    // static  PlaySpine(l:fgui.GLoader3D,fileName:string,ani:string,buddleName:string,endFun:() => void,isLoop =false )
    // {

    //     if (l==null) {

    //         return
    //     }
    //     Log.w(" PlaySpine   fileName ： ",fileName)
    //     Log.w(" PlaySpine   ani ： ",ani)
    //     Log.w(" PlaySpine   fgui.GLoader3D ： ",l)

        
    //     l.loop = isLoop;
    //     l.visible = true;
    //     l._onLoad = function(){
    //         let sp = <sp.Skeleton>l.content;
    //         sp.setCompleteListener(function(){
    //             Log.w(" PlaySpine 播放完成  ani ： ",ani)
    //             // l.playing = false;
    //             l.loop = isLoop;
    //             // l.visible = false;
    //             endFun()
    //         }.bind(this));
    //         l.visible = true;
    //     }.bind(this);
    //     let url = fgui.UIPackage.getItemURL(buddleName,fileName); 
    //     l.icon = url
    //     l.skinName = "default";
    //     l.animationName = ani;
    // }

    static  PlaySpineOnly(l:fgui.GLoader3D,ani:string,endFun:() => void )
    {
        if (l==null) {
            return
        }

        l.loop = false;
        let sp = <sp.Skeleton>l.content;
        sp.setCompleteListener(function(){
            // l.playing = false;
            l.loop = false;
            endFun()
        }.bind(this));
        l.visible = true;
        l.animationName = ani;
    }






    static RemoveSmallArr(bigArr: number[], removeArr: number[]): number[] 
    {

        for (let i = 0; i < removeArr.length; i++) 
        {
            for (let c = 0; c < bigArr.length; c++) 
            {
                if (bigArr[c] == removeArr[i]  ) 
                {
                    bigArr.splice(c,1)
                    break;
                }
                
            }
            
        }
        return bigArr
    }


    static PlayRunNum(textObj:fgui.GObject,startValue,endValue,duringTime:number,isZhuanHuan:boolean): void 
    {
        fgui.GTween.to(startValue, endValue,duringTime)
            .setEase(fgui.EaseType.Linear)
            .onUpdate(function (tweener): void {
                if (isZhuanHuan) 
                {
                    textObj.text = Manager.utils.formatCoin(tweener.value.x)
                }
                else
                {
                    textObj.text = "" + Math.floor(tweener.value.x);
                }
            }, this);
    }
    

}
