import { MahColor, MahHu } from "../../../../scripts/def/GameEnums";
import MJCard from "../view/MJCard"
import MJOutCard from "../view/MJOutCard";

export namespace CommonMJConfig {

    export let TotalBingDingCount =0;

    //麻将的配置表 键就是 牌值
    export const MahjongID =
    {
        [1]: { Name: "1万", Color: 0, number: 1, spriteUrl: "mj_wan_01", Soundxlhz: ["wan1"],ISHave:true },
        [2]: { Name: "2万", Color: 0, number: 2, spriteUrl: "mj_wan_02", Soundxlhz: ["wan2"],ISHave:true },
        [3]: { Name: "3万", Color: 0, number: 3, spriteUrl: "mj_wan_03", Soundxlhz: ["wan3"],ISHave:true },
        [4]: { Name: "4万", Color: 0, number: 4, spriteUrl: "mj_wan_04", Soundxlhz: ["wan4"],ISHave:true },
        [5]: { Name: "5万", Color: 0, number: 5, spriteUrl: "mj_wan_05", Soundxlhz: ["wan5"],ISHave:true },
        [6]: { Name: "6万", Color: 0, number: 6, spriteUrl: "mj_wan_06", Soundxlhz: ["wan6"],ISHave:true },
        [7]: { Name: "7万", Color: 0, number: 7, spriteUrl: "mj_wan_07", Soundxlhz: ["wan7"],ISHave:true },
        [8]: { Name: "8万", Color: 0, number: 8, spriteUrl: "mj_wan_08", Soundxlhz: ["wan8"], ISHave:true },
        [9]: { Name: "9万", Color: 0, number: 9, spriteUrl: "mj_wan_09", Soundxlhz: ["wan9"], ISHave:true},

        [11]: { Name: "1筒", Color: 1, number: 1, spriteUrl: "mj_tong_01", Soundxlhz: ["tong1"], ISHave:true},
        [12]: { Name: "2筒", Color: 1, number: 2, spriteUrl: "mj_tong_02", Soundxlhz: ["tong2"], ISHave:true},
        [13]: { Name: "3筒", Color: 1, number: 3, spriteUrl: "mj_tong_03", Soundxlhz: ["tong3"], ISHave:true},
        [14]: { Name: "4筒", Color: 1, number: 4, spriteUrl: "mj_tong_04", Soundxlhz: ["tong4"], ISHave:true},
        [15]: { Name: "5筒", Color: 1, number: 5, spriteUrl: "mj_tong_05", Soundxlhz: ["tong5"],ISHave:true },
        [16]: { Name: "6筒", Color: 1, number: 6, spriteUrl: "mj_tong_06", Soundxlhz: ["tong6"], ISHave:true},
        [17]: { Name: "7筒", Color: 1, number: 7, spriteUrl: "mj_tong_07", Soundxlhz: ["tong7"], ISHave:true},
        [18]: { Name: "8筒", Color: 1, number: 8, spriteUrl: "mj_tong_08", Soundxlhz: ["tong8"],ISHave:true },
        [19]: { Name: "9筒", Color: 1, number: 9, spriteUrl: "mj_tong_09", Soundxlhz: ["tong9"], ISHave:true},

        [21]: { Name: "1条", Color: 2, number: 1, spriteUrl: "mj_tiao_01", Soundxlhz: ["tiao1"], ISHave:true},
        [22]: { Name: "2条", Color: 2, number: 2, spriteUrl: "mj_tiao_02", Soundxlhz: ["tiao2"],ISHave:true },
        [23]: { Name: "3条", Color: 2, number: 3, spriteUrl: "mj_tiao_03", Soundxlhz: ["tiao3"],ISHave:true },
        [24]: { Name: "4条", Color: 2, number: 4, spriteUrl: "mj_tiao_04", Soundxlhz: ["tiao4"], ISHave:true},
        [25]: { Name: "5条", Color: 2, number: 5, spriteUrl: "mj_tiao_05", Soundxlhz: ["tiao5"],ISHave:true },
        [26]: { Name: "6条", Color: 2, number: 6, spriteUrl: "mj_tiao_06", Soundxlhz: ["tiao6"],ISHave:true },
        [27]: { Name: "7条", Color: 2, number: 7, spriteUrl: "mj_tiao_07", Soundxlhz: ["tiao7"],ISHave:true },
        [28]: { Name: "8条", Color: 2, number: 8, spriteUrl: "mj_tiao_08", Soundxlhz: ["tiao8"], ISHave:true},
        [29]: { Name: "9条", Color: 2, number: 9, spriteUrl: "mj_tiao_09", Soundxlhz: ["tiao9"], ISHave:true},


        [31]: { Name: "东", Color: 3, number: 1, spriteUrl: "mj_zi_01", Soundxlhz: ["zhong"],ISHave:false},
        [32]: { Name: "南", Color: 3, number: 2, spriteUrl: "mj_zi_02", Soundxlhz: ["zhong"],ISHave:false },
        [33]: { Name: "西", Color: 3, number: 3, spriteUrl: "mj_zi_03", Soundxlhz: ["zhong"], ISHave:false},
        [34]: { Name: "北", Color: 3, number: 4, spriteUrl: "mj_zi_04", Soundxlhz: ["zhong"],ISHave:false },
        [35]: { Name: "红中", Color: 3, number: 5, spriteUrl: "mj_zi_05", Soundxlhz: ["zhong"],ISHave:false },
        [36]: { Name: "发财", Color: 3, number: 6, spriteUrl: "mj_zi_06", Soundxlhz: ["zhong"],ISHave:false },
        [37]: { Name: "白板", Color: 3, number: 7, spriteUrl: "mj_zi_0", Soundxlhz: ["zhong"],ISHave:false },
        [135]: { Name: "道具红中", Color: 3, number: 5, spriteUrl: "mj_zi_05", Soundxlhz: ["zhong"], ISHave:false},

    }


    export const Direction = {
        Bottom: 0,
        Right: 1,
        Top: 2,
        Left: 3,
    }


    export const HuaSeColor = {
        ZiSprite:{
            [0]: "mjgame_wan01",
            [1]: "mjgame_tong001",
            [2]: "mjgame_tiao01",
        },

        Start:{
            [0]: "mjgame_wan",
            [1]: "mjgame_tong",
            [2]: "mjgame_tiao",

        }
    }

    // 打出的牌的位置 1-18 张 多层的时候 整体位移
    export const OutCardsPosition = {
        [Direction.Bottom]:
        {
            [1]:{x:72,y:40},
            [2]:{x:112,y:40},
            [3]:{x:152,y:40},
            [4]:{x:192,y:40},
            [5]:{x:232,y:40},
            [6]:{x:272,y:40},

            [7]:{x:72,y:85},
            [8]:{x:112,y:85},
            [9]:{x:152,y:85},
            [10]:{x:192,y:85},
            [11]:{x:232,y:85},
            [12]:{x:273,y:85},

            [13]:{x:72,y:130},
            [14]:{x:112,y:130},
            [15]:{x:152,y:130},
            [16]:{x:192,y:130},
            [17]:{x:233,y:130},
            [18]:{x:274,y:130},
        },
        [Direction.Top]:
        {
            [1]:{x:217,y:97},
            [2]:{x:182,y:97},
            [3]:{x:147,y:97},
            [4]:{x:112,y:97},
            [5]:{x:77,y:97},
            [6]:{x:42,y:97},

            [7]:{x:217,y:62},
            [8]:{x:182,y:62},
            [9]:{x:147,y:62},
            [10]:{x:112,y:62},
            [11]:{x:77,y:62},
            [12]:{x:42,y:62},

            [13]:{x:217,y:27},
            [14]:{x:182,y:27},
            [15]:{x:147,y:27},
            [16]:{x:112,y:27},
            [17]:{x:77,y:27},
            [18]:{x:42,y:27},
        },
        [Direction.Left]:
        {
            [1]:{x:484,y:200},
            [2]:{x:482,y:228},
            [3]:{x:479,y:256},
            [4]:{x:477,y:284},
            [5]:{x:475,y:312},
            [6]:{x:473,y:340},

            [7]:{x:443,y:200},
            [8]:{x:441,y:228},
            [9]:{x:438,y:256},
            [10]:{x:435,y:284},
            [11]:{x:432,y:312},
            [12]:{x:429,y:340},

            [13]:{x:402,y:200},
            [14]:{x:399,y:228},
            [15]:{x:395,y:256},
            [16]:{x:392,y:284},
            [17]:{x:389,y:312},
            [18]:{x:386,y:340},
        },
        [Direction.Right]:
        {
            [1]:{x:3,y:302},
            [2]:{x:0,y:274},
            [3]:{x:-3,y:247},
            [4]:{x:-6,y:220},
            [5]:{x:-9,y:193},
            [6]:{x:-13,y:166},

            [7]:{x:49,y:302},
            [8]:{x:45,y:274},
            [9]:{x:42,y:247},
            [10]:{x:39,y:220},
            [11]:{x:35,y:193},
            [12]:{x:31,y:166},
            
            [13]:{x:94,y:302},
            [14]:{x:90,y:274},
            [15]:{x:87,y:247},
            [16]:{x:83,y:220},
            [17]:{x:79,y:193},
            [18]:{x:75,y:166},
        },






    }


    
    // 胡的牌的位置 多层的时候 整体位移
    export const HuCardsPosition = {
        [Direction.Bottom]:
        {
            [1]:{x:0,y:0},
            [2]:{x:40,y:0},
            [3]:{x:80,y:0},
            [4]:{x:120,y:0},
            [5]:{x:160,y:0},
        },
        [Direction.Top]:
        {
            [1]:{x:0,y:0},
            [2]:{x:-30,y:0},
            [3]:{x:-60,y:0},
            [4]:{x:-90,y:0},
            [5]:{x:-120,y:0},
        },
        [Direction.Left]:
        {
            [1]:{x:-0,y:0},
            [2]:{x:-8,y:31},
            [3]:{x:-55,y:0},
            [4]:{x:-63,y:31},
            [5]:{x:-110,y:0},
            [6]:{x:-119,y:31},
        },
        [Direction.Right]:
        {
            [1]:{x:0,y:0},
            [2]:{x:-7,y:-25},
            [3]:{x:-14,y:-50},
            [4]:{x:39,y:0},
            [5]:{x:31,y:-25},
            [6]:{x:23,y:-50},
        },
    }



    // 明牌摊牌的位置和 胡了后倒下去的牌位置 
    export const TangMingCardsPosition = {
        [Direction.Bottom]:
        {
            [1]:{xtan:0,ytan:0,xpa:0,ypa:0,quelaifu:{x:18,y:13,scalex:0.4,scaley:0.4 },icon:{x:29,y:25,scalex:0.43,scaley:0.43 }},
            [2]:{xtan:-92,ytan:0,xpa:30,ypa:0,quelaifu:{x:18,y:13,scalex:0.4,scaley:0.4 },icon:{x:29,y:25,scalex:0.43,scaley:0.43 }},
            [3]:{xtan:-184,ytan:0,xpa:60,ypa:0,quelaifu:{x:18,y:13,scalex:0.4,scaley:0.4 },icon:{x:29,y:25,scalex:0.43,scaley:0.43 }},
            [4]:{xtan:-275,ytan:0,xpa:90,ypa:0,quelaifu:{x:18,y:13,scalex:0.4,scaley:0.4 },icon:{x:29,y:25,scalex:0.43,scaley:0.43 }},
            [5]:{xtan:-367,ytan:0,xpa:120,ypa:0,quelaifu:{x:18,y:13,scalex:0.4,scaley:0.4 },icon:{x:29,y:25,scalex:0.43,scaley:0.43 }},
            [6]:{xtan:-459,ytan:0,xpa:150,ypa:0,quelaifu:{x:18,y:13,scalex:0.4,scaley:0.4 },icon:{x:29,y:25,scalex:0.43,scaley:0.43 }},
            [7]:{xtan:-550,ytan:0,xpa:177,ypa:0,quelaifu:{x:18,y:13,scalex:0.4,scaley:0.4 },icon:{x:29,y:25,scalex:0.43,scaley:0.43 }},
            [8]:{xtan:-641,ytan:0,xpa:207,ypa:0,quelaifu:{x:18,y:13,scalex:0.4,scaley:0.4 },icon:{x:29,y:25,scalex:0.43,scaley:0.43 }},
            [9]:{xtan:-733,ytan:0,xpa:237,ypa:0,quelaifu:{x:18,y:13,scalex:0.4,scaley:0.4 },icon:{x:29,y:25,scalex:0.43,scaley:0.43 }},
            [10]:{xtan:-825,ytan:0,xpa:267,ypa:0,quelaifu:{x:18,y:13,scalex:0.4,scaley:0.4 },icon:{x:29,y:25,scalex:0.43,scaley:0.43 }},
            [11]:{xtan:-917,ytan:0,xpa:297,ypa:0,quelaifu:{x:18,y:13,scalex:0.4,scaley:0.4 },icon:{x:29,y:25,scalex:0.43,scaley:0.43 }},
            [12]:{xtan:-1009,ytan:0,xpa:327,ypa:0,quelaifu:{x:18,y:13,scalex:0.4,scaley:0.4 },icon:{x:29,y:25,scalex:0.43,scaley:0.43 }},
            [13]:{xtan:-1101,ytan:0,xpa:357,ypa:0,quelaifu:{x:18,y:13,scalex:0.4,scaley:0.4 },icon:{x:29,y:25,scalex:0.43,scaley:0.43 }},
            [14]:{xtan:-1193,ytan:0,xpa:387,ypa:0,quelaifu:{x:18,y:13,scalex:0.4,scaley:0.4 },icon:{x:29,y:25,scalex:0.43,scaley:0.43 }},

        },
        [Direction.Top]:
        {
            [1]:{xtan:0,ytan:0,xpa:0,ypa:0  ,quelaifu:{x:30,y:23,scalex:0.35,scaley:0.35 },icon:{x:21,y:17,scalex:1,scaley:1 }},
            [2]:{xtan:30,ytan:0,xpa:30,ypa:0,quelaifu:{x:30,y:23,scalex:0.35,scaley:0.35 },icon:{x:21,y:17,scalex:1,scaley:1 }},
            [3]:{xtan:60,ytan:0,xpa:60,ypa:0,quelaifu:{x:30,y:23,scalex:0.35,scaley:0.35 },icon:{x:21,y:17,scalex:1,scaley:1 }},
            [4]:{xtan:90,ytan:0,xpa:90,ypa:0,quelaifu:{x:30,y:23,scalex:0.35,scaley:0.35 },icon:{x:21,y:17,scalex:1,scaley:1 }},
            [5]:{xtan:119,ytan:0,xpa:120,ypa:0,quelaifu:{x:30,y:23,scalex:0.35,scaley:0.35 },icon:{x:21,y:17,scalex:1,scaley:1 }},
            [6]:{xtan:148,ytan:0,xpa:150,ypa:0,quelaifu:{x:30,y:23,scalex:0.35,scaley:0.35 },icon:{x:21,y:17,scalex:1,scaley:1 }},
            [7]:{xtan:178,ytan:0,xpa:177,ypa:0,quelaifu:{x:30,y:23,scalex:0.35,scaley:0.35 },icon:{x:21,y:17,scalex:1,scaley:1 }},
            [8]:{xtan:207,ytan:0,xpa:207,ypa:0,quelaifu:{x:30,y:23,scalex:0.35,scaley:0.35 },icon:{x:21,y:17,scalex:1,scaley:1 }},
            [9]:{xtan:236,ytan:0,xpa:237,ypa:0,quelaifu:{x:30,y:23,scalex:0.35,scaley:0.35 },icon:{x:21,y:17,scalex:1,scaley:1 }},
            [10]:{xtan:266,ytan:0,xpa:267,ypa:0,quelaifu:{x:30,y:23,scalex:0.35,scaley:0.35 },icon:{x:21,y:17,scalex:1,scaley:1 }},
            [11]:{xtan:296,ytan:0,xpa:297,ypa:0,quelaifu:{x:30,y:23,scalex:0.35,scaley:0.35 },icon:{x:21,y:17,scalex:1,scaley:1 }},
            [12]:{xtan:325,ytan:0,xpa:327,ypa:0,quelaifu:{x:30,y:23,scalex:0.35,scaley:0.35 },icon:{x:21,y:17,scalex:1,scaley:1 }},
            [13]:{xtan:353,ytan:0,xpa:357,ypa:0,quelaifu:{x:30,y:23,scalex:0.35,scaley:0.35 },icon:{x:21,y:17,scalex:1,scaley:1 }},
            [14]:{xtan:384,ytan:0,xpa:387,ypa:0,quelaifu:{x:30,y:23,scalex:0.35,scaley:0.35 },icon:{x:21,y:17,scalex:1,scaley:1 }},

        },
        [Direction.Left]:
        {
            [1]:{xtan:0,ytan:0,xpa:0,ypa:0,quelaifu:{x:54,y:10,scalex:0.4,scaley:0.4 },icon:{x:36,y:17,scalex:1,scaley:1 }},
            [2]:{xtan:8,ytan:-30,xpa:8,ypa:-30,quelaifu:{x:54,y:10,scalex:0.4,scaley:0.4 },icon:{x:36,y:17,scalex:1,scaley:1 }},
            [3]:{xtan:16,ytan:-60,xpa:16,ypa:-60,quelaifu:{x:54,y:10,scalex:0.4,scaley:0.4 },icon:{x:36,y:17,scalex:1,scaley:1 }},
            [4]:{xtan:24,ytan:-90,xpa:24,ypa:-90,quelaifu:{x:53,y:10,scalex:0.38,scaley:0.38 },icon:{x:36,y:17,scalex:0.99,scaley:0.99 }},
            [5]:{xtan:32,ytan:-120,xpa:32,ypa:-120,quelaifu:{x:53,y:10,scalex:0.37,scaley:0.37 },icon:{x:36,y:17,scalex:0.98,scaley:0.98 }},
            [6]:{xtan:40,ytan:-150,xpa:40,ypa:-150,quelaifu:{x:53,y:10,scalex:0.36,scaley:0.36 },icon:{x:36,y:17,scalex:0.98,scaley:0.98 }},
            [7]:{xtan:48,ytan:-180,xpa:48,ypa:-180,quelaifu:{x:52,y:10,scalex:0.36,scaley:0.36 },icon:{x:36,y:17,scalex:0.95,scaley:0.95 }},
            [8]:{xtan:56,ytan:-210,xpa:56,ypa:-210,quelaifu:{x:52,y:10,scalex:0.36,scaley:0.36 },icon:{x:36,y:17,scalex:0.94,scaley:0.94 }},
            [9]:{xtan:64,ytan:-240,xpa:64,ypa:-240,quelaifu:{x:52,y:10,scalex:0.36,scaley:0.36 },icon:{x:36,y:17,scalex:0.93,scaley:0.93 }},
            [10]:{xtan:72,ytan:-270,xpa:72,ypa:-270,quelaifu:{x:51,y:11,scalex:0.36,scaley:0.36 },icon:{x:36,y:17,scalex:0.92,scaley:0.92 }},
            [11]:{xtan:80,ytan:-300,xpa:80,ypa:-300,quelaifu:{x:51,y:11,scalex:0.35,scaley:0.35 },icon:{x:36,y:17,scalex:0.9,scaley:0.9 }},
            [12]:{xtan:87,ytan:-329,xpa:88,ypa:-330,quelaifu:{x:51,y:11,scalex:0.35,scaley:0.35 },icon:{x:36,y:17,scalex:0.88,scaley:0.88 }},
            [13]:{xtan:95,ytan:-357,xpa:96,ypa:-358,quelaifu:{x:51,y:11,scalex:0.33,scaley:0.33 },icon:{x:36,y:17,scalex:0.85,scaley:0.85 }},
            [14]:{xtan:101,ytan:-385,xpa:102,ypa:-386,quelaifu:{x:51,y:11,scalex:0.33,scaley:0.33 },icon:{x:36,y:17,scalex:0.85,scaley:0.85 }},

        },
        [Direction.Right]:
        {
            [1]:{xtan:0,ytan:0,xpa:0,ypa:0,quelaifu:{x:25,y:21,scalex:0.4,scaley:0.4 },icon:{x:38,y:15,scalex:1,scaley:1 }},
            [2]:{xtan:8,ytan:30,xpa:8,ypa:30,quelaifu:{x:25,y:21,scalex:0.4,scaley:0.4 },icon:{x:38,y:15,scalex:1,scaley:1 }},
            [3]:{xtan:16,ytan:60,xpa:16,ypa:60,quelaifu:{x:25,y:21,scalex:0.4,scaley:0.4 },icon:{x:38,y:15,scalex:1,scaley:1 }},
            [4]:{xtan:24,ytan:90,xpa:24,ypa:90,quelaifu:{x:26,y:21,scalex:0.38,scaley:0.38 },icon:{x:38,y:15,scalex:0.99,scaley:0.99 }},
            [5]:{xtan:32,ytan:120,xpa:32,ypa:120,quelaifu:{x:26,y:22,scalex:0.38,scaley:0.38 },icon:{x:38,y:15,scalex:0.98,scaley:0.98 }},
            [6]:{xtan:40,ytan:150,xpa:40,ypa:150,quelaifu:{x:26,y:22,scalex:0.37,scaley:0.37 },icon:{x:38,y:15,scalex:0.98,scaley:0.98 }},
            [7]:{xtan:48,ytan:180,xpa:48,ypa:180,quelaifu:{x:26,y:22,scalex:0.36,scaley:0.36 },icon:{x:38,y:16,scalex:0.95,scaley:0.95 }},
            [8]:{xtan:56,ytan:210,xpa:56,ypa:210,quelaifu:{x:26,y:22,scalex:0.36,scaley:0.36 },icon:{x:38,y:16,scalex:0.94,scaley:0.94 }},
            [9]:{xtan:64,ytan:240,xpa:64,ypa:240,quelaifu:{x:26,y:22,scalex:0.36,scaley:0.36 },icon:{x:38,y:16,scalex:0.93,scaley:0.93 }},
            [10]:{xtan:72,ytan:270,xpa:72,ypa:270,quelaifu:{x:27,y:22,scalex:0.36,scaley:0.36 },icon:{x:38,y:16,scalex:0.92,scaley:0.92 }},
            [11]:{xtan:80,ytan:300,xpa:80,ypa:300,quelaifu:{x:28,y:23,scalex:0.35,scaley:0.35 },icon:{x:38,y:17,scalex:0.9,scaley:0.9 }},
            [12]:{xtan:87,ytan:329,xpa:88,ypa:330,quelaifu:{x:28,y:23,scalex:0.35,scaley:0.35 },icon:{x:38,y:17,scalex:0.88,scaley:0.88 }},
            [13]:{xtan:95,ytan:357,xpa:96,ypa:358,quelaifu:{x:28,y:23,scalex:0.33,scaley:0.33 },icon:{x:38,y:17,scalex:0.85,scaley:0.85 }},
            [14]:{xtan:102,ytan:384,xpa:104,ypa:385,quelaifu:{x:28,y:23,scalex:0.33,scaley:0.33 },icon:{x:38,y:17,scalex:0.85,scaley:0.85 }},
        },

    }


        
    // 碰杠的牌的 整体位移 和scale 控制
    export const PengGangCardsPosition = {
        [Direction.Bottom]:
        {
            [1]:{x:0,y:0,scaleX:1,scaleY:1},
            [2]:{x:200,y:0,scaleX:1,scaleY:1},
            [3]:{x:400,y:0,scaleX:1,scaleY:1},
            [4]:{x:600,y:0,scaleX:1,scaleY:1},
        },
        [Direction.Top]:
        {
            [1]:{x:0,y:0,scaleX:1,scaleY:1},
            [2]:{x:-96,y:0,scaleX:1,scaleY:1},
            [3]:{x:-192,y:0,scaleX:1,scaleY:1},
            [4]:{x:-288,y:0,scaleX:1,scaleY:1},
        },
        [Direction.Left]:
        {
            [1]:{x:6,y:26,scaleX:0.9375,scaleY:0.9785},
            [2]:{x:-26,y:126,scaleX:0.9625,scaleY:0.9892},
            [3]:{x:-58,y:226,scaleX:0.9750,scaleY:1},
            [4]:{x:-88,y:326,scaleX:1,scaleY:1},
        },
        [Direction.Right]:
        {
            [1]:{x:-30,y:-50,scaleX:1,scaleY:1},
            [2]:{x:-60,y:-150,scaleX:0.9750,scaleY:1},
            [3]:{x:-90,y:-250,scaleX:0.9625,scaleY:0.9892},
            [4]:{x:-120,y:-350,scaleX:0.9375,scaleY:0.9785},
        },
    }


    export const SortWanFaType = {
        //血流红中牌型排序
        xlhzmj_sort: [
            
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

            MahHu.Hu_HaiDiLaoYue,
            MahHu.Hu_MiaoShouHuiChun,
            MahHu.Hu_SanLongQiDui,
            MahHu.Hu_TianHu,
            MahHu.Hu_DiHu,
            MahHu.Hu_YiSeShuangLongHui,
            MahHu.Hu_ShiBaLuoHan,
            MahHu.Hu_QuanYaoJiu,
            MahHu.Hu_LianQiDui,
            MahHu.Hu_ShuangLongQiDui,
            MahHu.Hu_JiuLianBaoDeng,
            MahHu.Hu_SiAnKe,
            MahHu.Hu_QuanDaiWu,
            MahHu.Hu_LongQiDui,
            MahHu.Hu_QuanDa,
            MahHu.Hu_QuanZhong,
            MahHu.Hu_QuanXiao,
            MahHu.Hu_ShouZhongBaoYi,
            MahHu.Hu_LvYiSe,
            MahHu.Hu_SiJieGao,
            MahHu.Hu_YaoJiu,
            MahHu.Hu_ShiErJinChai,
            MahHu.Hu_JiangDui,
            MahHu.Hu_QiDui,
            MahHu.Hu_TuiBuDao,
            MahHu.Hu_BaiWanShi,
            MahHu.Hu_QuanShuangKe,
            MahHu.Hu_SanJieGao,
            
            MahHu.Hu_XiaoYuWu,
            MahHu.Hu_DaYuWu,
            MahHu.Hu_JinGouDiao,
            MahHu.Hu_SanAnKe,
            MahHu.Hu_YiTiaoLong,
            MahHu.Hu_MingPai,
            
            MahHu.Hu_WuXingBaGua,
            MahHu.Hu_QingYiSe,
            MahHu.Hu_BuQiuRen,
            MahHu.Hu_ZhuoWuKui,
            MahHu.Hu_ShuangAnKe,
            MahHu.Hu_HongZhongDiao,
            MahHu.Hu_DuanYaoJiu,
            MahHu.Hu_DuiDuiHu,
            MahHu.Hu_LaoSaoPei,
            MahHu.Hu_ShuangTongKe,
            MahHu.Hu_LiuLianShun,
            MahHu.Hu_YiBanGao,
            MahHu.Hu_DanDiao,
            MahHu.Hu_KanZhang,
            MahHu.Hu_BianZhang,
            MahHu.Hu_SuHu,
            MahHu.Hu_PingHu,



        ],


        xlhzmjCenterHu_sort: [
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
            
            MahHu.Hu_HaiDiLaoYue,
            MahHu.Hu_MiaoShouHuiChun,
            MahHu.Hu_SanLongQiDui,
            MahHu.Hu_TianHu,
            MahHu.Hu_DiHu,
            MahHu.Hu_YiSeShuangLongHui,
            MahHu.Hu_ShiBaLuoHan,
            MahHu.Hu_QuanYaoJiu,
            MahHu.Hu_LianQiDui,
            MahHu.Hu_ShuangLongQiDui,
            MahHu.Hu_JiuLianBaoDeng,
            MahHu.Hu_SiAnKe,
            MahHu.Hu_LongQiDui,
            MahHu.Hu_QuanDa,
            MahHu.Hu_QuanZhong,
            MahHu.Hu_QuanXiao,
            MahHu.Hu_ShouZhongBaoYi,
            MahHu.Hu_SiJieGao,
            MahHu.Hu_YaoJiu,
            MahHu.Hu_ShiErJinChai,
            MahHu.Hu_SanJieGao,
            MahHu.Hu_XiaoYuWu,
            MahHu.Hu_DaYuWu,
            MahHu.Hu_SanAnKe,
            MahHu.Hu_QingYiSe,
            MahHu.Hu_WuXingBaGua,

            
            MahHu.Hu_JinGouDiao,
            MahHu.Hu_QuanShuangKe,
            MahHu.Hu_BaiWanShi,
            MahHu.Hu_TuiBuDao,
            MahHu.Hu_YiTiaoLong,
            MahHu.Hu_QiDui,
            MahHu.Hu_JiangDui,
            MahHu.Hu_BuQiuRen,
            MahHu.Hu_ZhuoWuKui,
            MahHu.Hu_ShuangAnKe,
            MahHu.Hu_HongZhongDiao,
            MahHu.Hu_DuanYaoJiu,
            MahHu.Hu_DuiDuiHu,
            MahHu.Hu_LaoSaoPei,
            MahHu.Hu_ShuangTongKe,
            MahHu.Hu_LiuLianShun,
            MahHu.Hu_YiBanGao,
            MahHu.Hu_DanDiao,
            MahHu.Hu_LvYiSe,
            MahHu.Hu_KanZhang,
            MahHu.Hu_BianZhang,
            MahHu.Hu_QuanDaiWu,
            MahHu.Hu_SuHu,
            MahHu.Hu_PingHu,
        ],
    }



    // 获取自己手牌里是否有这一张
    export let MyHandsIsHave: boolean = false

    // //光标对应的玩家
    export let DirectionCurpos = 0

    // //打出的牌最后光标地点
    export let LastDaPaiPos = 0
    // //倒计时的具体时间
    export let RestTime = 15
    // //房间状态   自己胡牌了或者结算状态可以离开房间
    export let RoomState :number = 0

    //胡牌提示排序
    export let ColorListData=[{color:MahColor.CL_Wan,count:0,index:0},
        {color:MahColor.CL_Tong,count:0,index:0},
        {color:MahColor.CL_Tiao,count:0,index:0}];

    export const MineCardState = { Play: 1, Change: 2, Lock: 3, LockCompletely: 4 };

    export const MineCardStatePositon = { Bottom: 1, Top: 2, Lock: 3 };

    // //是否限制 三张是 不同的花色
    export let LimitColour : boolean = true
    // //-已经选中的三张牌
    export let TabelThreeCards:Array<MJCard> = []
    // export let S2CMjDingQue = null


    // //客户端发送的换三张
    export let MineChangeThreeCards:number[] = []
    // //有没有播放过换三张收到服务器之后动画
    export let EffectResultHSZ : boolean = false

    export let EffectResultDQ  : boolean = false  ////有没有播放过定缺

    export let S2CMjDingQueResult = null

    //定庄状态准备
    export let SetSelectLackingOver : boolean = false;

    export let ModelMineState : number = MineCardState.Lock  //去控制玩家能否出牌


    //剩余牌数
    export let ResidueCards = 55;

    //是否初始化
    export let m_blInit = false;

    //所有的牌数量
    export let AllCards = null;



    //房间数据
    export let RoomData = {};

    //庄的客户端坐标
    export let ClientZhuangIndex :number;

    //玩家信息
    export let MJMemberInfo = {}

    //玩家头像信息
    export let MJMemberHeadInfo = {};



    //房间信息
    export let RoomInfo = {};

    //麻将数据
    export let PlayerCardsInfo = null;
    //碰杠飞数据排序
    export let PlayerPengGang = { };

    //自己是否是好牌不换
    export let SelfHaoPaiBuHuan = false

    //好牌不换的玩家服务器坐标
    export let HuanSanZhangBuHuanData={}

    //已经换过牌的玩家
    export let HuanPosData :  number[]  = [];

    //自己在碰杠区的牌
    // export let MineHandleCardsPeng:number[] =[];
    
    //自己在碰杠区的牌
    // export let MineHandleCardsGang:number[] =[];

    //预计总收益总数
    export let yuJiShouYi :  number=0

    // //自己杠的所有类型牌
    // export let MineGangTypeCards = null;

    //自己杠的补杠牌
    // export let MineGangTypeCardsBuGang:number[] =[];
    //自己杠的点杠牌
    // export let MineGangTypeCardsDianGang:number[] =[];
    //自己杠的暗杠牌
    // export let MineGangTypeCardsAnGang:number[] =[];



    //换来后的三张牌
    export let MineGetThreeCards:number[] =[];

    //拿走的三张牌
    export let OldChangeThreeCards:number[]=[] ;

    //推荐的换三张牌
    export let DefaultThreeCards:number[] = null;

    //通知换三张牌服务器发的数据
    export let HuanSanZhangData = null;

    //换牌特效完成
    export let ChangeEffectOver : boolean = false;

    //当前选中的牌
    export let CurrentSelectCard:MJCard  = null

    //当前打出的牌对象
    export let PickOutCardTable = null

    //杠的类型
    export let m_OpgangType :number = null
    //记牌器时间
    export let JiPaiQiTime :number = null

    


    //最后出的一张牌
    export let LastOutCard :MJOutCard =null;

    //最后摸的一张牌
    export let LastPickCard = null;

    //自己定缺的
    export let MineQueCard :number = -1

    //是否已经打缺
    export let AlreadyQue : boolean = false;

    //是否已经胡牌
    export let AlreadyHu : boolean = false;

    //自己是否飞过
    export let AlreadyFei : boolean = false;


    //当前状态胡的牌
    export let CurrentHuTip :number[];



    //当前状态胡牌番数
    export let CurrentHuFanShuTip :number[];

    //当前打牌胡牌提示
    export let CurrentOutHandHuTip = null;

    //当前打牌胡牌番数
    export let CurrentOutHandHuFanShuTip = null;

    // type Packet = typeof pb.MahKeHuData;
    // let Packet:Packet = Manager.protoManager.getProto("pb.MahKeHuData");
    // let packet = new Packet();

    //当前能胡的所有牌 数据
    export let CurrenMahKeHuDataArr:pb.IMahKeHuData[]=[];

    


    //总结算数据
    export let m_objAllBalance = null;

    export const CardTypeGenre = {
        Jiang: 1,
        Ke: 2,
        Shun: 3,
        Group: 4,
        LaiZi: 5,
    }




    // //花色
    // export const StylorType = {
    //     Wan: 1,
    //     Tong: 2,
    //     Tiao: 3,
    //     Zi: 3,
    // }

    //操作标示
    export const HandleTag = {
        //过
        Pass: 1,
        //明牌
        MingPai: 2,  
        //碰
        Peng: 3,
        //杠
        Gang: 4,
        //飞
        Fei: 5,
        //提
        Ti: 6,
        //躺
        Tang: 7,
        //破封
        PoFeng: 8,
        //胡
        Hu: 9,

    }

    export const MJComonHuType = {
        //杠上开花
        GangShangKaiHua: "GangShangKaiHua",
        //抢杠胡
        QiangGangHu: "QiangGangHu",
        //平胡点炮
        PingHuDianPao: "PingHuDianPao",
        //平胡自摸
        PingHuZiMo: "PingHuZiMo",
        //对子胡
        DuiZiHu: "DuiZiHu",
        //清一色
        QingYiSe: "QingYiSe",
        //清对
        QingDui: "QingDui",
        //金钩钓
        JinGouDiao: "JinGouDiao",
        //清一色金钩钓
        QingYiSeJinGouDiao: "QingYiSeJinGouDiao",
        //七对
        QiDui: "QiDui",
        //龙七对
        LongQiDui: "LongQiDui",
        //清一色七对
        QingYiSeQiDui: "QingYiSeQiDui",
        //清一色龙七对
        QingYiSeLongQiDui: "QingYiSeLongQiDui",

        //杠上炮
        GangShangPao: "GangShangPao",


    }


    //杠类型
    export const GangType = {
        //普通杠 自己手里三个杠别人的
        DianGang: 1,
        //弯杠 补杠
        BuGang: 2,
        //暗杠
        AnGang: 3
    }

    //操作的牌类型
    export const HandleCardType = {
        //碰
        Peng: 1,
        //杠
        Gang: 2,
        //飞
        Fei: 3,
    }



    export const SoundPath = ""

    export const SoundEffPath = {
        EnterPlayer: ["audio_enter"], //打出牌的声音
        Ready  : ["audio_ready"], //打出牌的声音
        

        ChuPai: ["chupai"], //打出牌的声音
        DingQueFei: ["dingquefei"], //定缺后飞字符到头像的音效
        // StartGame: ["duijukaishi"],
        EffHu: ["eff_hu"],
        EffDianPaoShanDian: ["eff_hu"],
        FaPaiFour: ["facard"], //四张四张的
        TuiDaoPai: ["tuidaopai"], //倒牌后立起来
        TuiDao: ["tuidao"], //倒牌后立起来

        
        MoPai: ["mopai"],
        PoChan: ["pochan"],
        FlyGold: ["flygold"], //飞金币的声音
        XiaYu: ["xiayu"],
        GuaFeng: ["guafeng"],
        Huansanzhang: ["huansanzhang"], //换三张中换牌动画是播放音效
        Lose:["lose"],//失败
        Win:["win"],//失败

        PlayerQuit:["playerQuit"],// 玩家退出


        TimeOut: ["naozhong"], //自己的倒计时时间到
        TimeOutThree: ["timeup_alarm"], //倒计时三秒
        TuoGuan: ["tuoguan"], //托管
        TouZi: ["touzi"], //骰子
        PoFeng: ["pofeng"], //破封
        FuHuo: ["xintiaofuhuo"], //心跳复活
        

        ChiMan:["man_chi_0"],
        GangMan:["man_gang_0"],
        HuMan:["women_hu_0","women_hu_0","women_hu_1"],
        PengMan:["man_peng_0"],
        TingMan:["man_ting_0"],
        ZiMoMan:["man_zimo_0"],
 

        GangWomen:["women_gang_0"],
        HuWomen:["women_hu_0","women_hu_0","women_hu_0"],
        PengWomen:["women_peng_0"],
        TingWomen:["women_ting_0"],
        ZiMoWomen:["man_zimo_0"],

        NanMingpai: ["nanmingpai"],
        NvMingpai: ["nvmingpai"],

    }









    //  特效路径
    export const EffectPath = {

        EndGame: "Effect_UI_OverGame",
        LiuJuEndGame: "Effect_UI_liuju",
        StartGame: { path: "mjsp_djks",aniName:"ani",sound: ["duijukaishi"] },
        GangGuaFeng: { path: "mjsp_guafeng",aniName:"animation",sound:["guafeng"] },
        GangXiaYu: { path: "mjsp_xiayu",aniName:"ani",sound:["xiayu"] },

        CuoPai: "Effect_UI_cuopai_1",

        ClockWise: "shunshizhen",
        AntiClockWise: "niushizhen",
        Opposite: "duijiahuanpai"
    }


    // 出牌路径
    export const OutHandPath = {
        [0]: "outHandBottom",
        [1]: "outHandRight",
        [2]: "outHandTop",
        [3]: "outHandLeft",
    }

    // 出牌手
    export const OutsPath = {
        [0]: "outCardBottom",
        [1]: "outCardRight",
        [2]: "outCardTop",
        [3]: "outCardLeft",
    }

    // 胡牌路径
    export const HuCardPath = {
        [0]: "huBottom",
        [1]: "huRight",
        [2]: "huTop",
        [3]: "huLeft",
    }





    export const HuBalancePath = {
        common: "UI/Game/MJGame/huCard",
    }






    // 操作标示
    export const HandleViewPath = [
        // 过
        "pass",
        // 碰
        "peng",
        // 杠
        "gang",
        // 胡
        "hu",
        //飞
        "fei",
        //提
        "ti",
        //躺
        "tang",
    ]

    // 动画操作
    export const AnimationType = {
        // 初始化摸牌动画
        FirstMoPai: "bottom1",

        // 初始化倒牌在站立动画
        DaoPai: "bottom2",

        // 摸牌
        GetCard: "getcard_",
        // 出牌
        OutCard: "outcard_",
        // 自己回合点击牌
        MineClick: "mineclick_",
        // 非自己回合点牌
        NoMineClick: "nomineclick_",
        // 换三张
        ChangeThreeCard: "changeThree_",
        // 盖牌
        BreakCard: "breakcard_",
        //万条筒缺牌动画
        Lacking: "lacking"
    }


    
    export const SelfHandCardPath="handStandBottom" 

    // 躺牌明牌
    export const TangMingPath = {
        [0]: "tangCardBottom",
        [1]: "tangCardRight",
        [2]: "tangCardTop",
        [3]: "tangCardLeft",
    }


    // 碰牌组件
    export const AltPath = {
        [0]: "altCardBottom",
        [1]: "altCardRight",
        [2]: "altCardTop",
        [3]: "altCardLeft",
    }


    // 点杠 补杠 杠牌路径 
    export const BuDianGangPath = {
        [0]: "buDianGangBottom",
        [1]: "buDianGangRight",
        [2]: "buDianGangTop",
        [3]: "buDianGangLeft",
    }

    // 暗杠牌路径
    export const BlackCtrlsPath = {
        [0]: "darkBarBottom",
        [1]: "darkBarRight",
        [2]: "darkBarTop",
        [3]: "darkBarLeft",
    }


    // 碰牌朝向图片位置
    export const AltOriPath = {
        [0]: "icon_xia",
        [1]: "icon_you",
        [2]: "icon_shang",
        [3]: "icon_zuo",
        [5]: "icon_bu",
    }






    export const HuOriPath = {
        [0]: "icon_xia",
        [1]: "icon_you",
        [2]: "icon_shang",
        [3]: "icon_zuo",
        [5]: "icon_zimo",
    }





    export const HuTypeSprite = {
        Win: {
            weitingweihu: "mjhutype1_weiting",
            jibenhu: "mjhutype1_jibenhu",
            jingoudiao: "mjhutype1_jingoudiao",
            longqidui: "mjhutype1_longqidui",
            pengpenghu: "mjhutype1_pengpenghu",
            qidui: "mjhutype1_qidui",
            qingjingoudiao: "mjhutype1_qingjingoudiao",
            qinglongqidui: "mjhutype1_qinglongqidui",
            qingpeng: "mjhutype1_qingpeng",
            qingqidui: "mjhutype1_qingqidui",
            qingyise: "mjhutype1_qingyise",
            weitinghz: "mjhutypehz1_wt",
        },
        Lose: {
            weitingweihu: "mjhutype2_weiting",
            jibenhu: "mjhutype2_jibenhu",
            jingoudiao: "mjhutype2_jingoudiao",
            longqidui: "mjhutype2_longqidui",
            pengpenghu: "mjhutype2_pengpenghu",
            qidui: "mjhutype2_qidui",
            qingjingoudiao: "mjhutype2_qingjingoudiao",
            qinglongqidui: "mjhutype2_qinglongqidui",
            qingpeng: "mjhutype2_qingpeng",
            qingqidui: "mjhutype2_qingqidui",
            qingyise: "mjhutype2_qingyise",
            weitinghz: "mjhutypehz1_wt",
        },


    }

    // 轮盘图片位置
    export const TableWheelPath = {
        Wheel: {
            [Direction.Bottom]: "mjgame_wheelpan_001",
            [Direction.Right]: "mjgame_wheelpan_004",
            [Direction.Top]: "mjgame_wheelpan_003",
            [Direction.Left]: "mjgame_wheelpan_002",
        },
        [Direction.Bottom]: {
            [Direction.Bottom]: "mjgame_wheelpan_001_01",
            [Direction.Right]:  "mjgame_wheelpan_001_04",
            [Direction.Top]:    "mjgame_wheelpan_001_03",
            [Direction.Left]:   "mjgame_wheelpan_001_02",
        },
        [Direction.Right]: {
            [Direction.Bottom]: "mjgame_wheelpan_004_01",
            [Direction.Right]:  "mjgame_wheelpan_004_04",
            [Direction.Top]:    "mjgame_wheelpan_004_03",
            [Direction.Left]:   "mjgame_wheelpan_004_02",
        },
        [Direction.Top]: {
            [Direction.Bottom]: "mjgame_wheelpan_003_01",
            [Direction.Right]:  "mjgame_wheelpan_003_04",
            [Direction.Top]:    "mjgame_wheelpan_003_03",
            [Direction.Left]:   "mjgame_wheelpan_003_02",
        },
        [Direction.Left]: {
            [Direction.Bottom]: "mjgame_wheelpan_002_01",
            [Direction.Right]:  "mjgame_wheelpan_002_04",
            [Direction.Top]:    "mjgame_wheelpan_002_03",
            [Direction.Left]:   "mjgame_wheelpan_002_02",
        },

    }

    export const HuTypePath = {
        // gangshanghua: "hunode_gangshanghua",
        // gangshangpao: "hunode_gangshangpao",
        zimo: "mjgame_zimo_wenzi",
        pinghu: "mjgame_hu_wenzi",
        yiPaoSuangXiang: { texture: "mjgame_yipaoduoxiang", sound: ["eff_lv_1"] },

    }


    export const huPath =
    {
        [Direction.Bottom]: "tyself",
        [Direction.Right]: "tyother",
        [Direction.Left]: "tyother",
        [Direction.Top]: "tyother",
    }

    export const PiaoGoldPath = "game_jinbi"

    export const HuTypeEffConfig = {

        [MahHu.Hu_PingHu]: { time:1000,huPath: "mjsp_ty_ty2",aniName:"ty2", texture: "mjcomEff_pinghu", sound: ["eff_lv_1"], huwin: "mjcomEff_pinghuWin", hulose: "mjcomEff_pinghuLose" },
        [MahHu.Hu_SuHu]: {time:1000, huPath: "mjsp_ty_ty2",aniName:"ty2", texture: "mjcomEff_wutingyong", sound: ["eff_lv_1"], huwin: "mjcomEff_wutingyongWin", hulose: "mjcomEff_wutingyongLose" },
        [MahHu.Hu_BianZhang]: {time:1000, huPath: "mjsp_ty_ty2",aniName:"ty2", texture: "mjcomEff_bianzhang", sound: ["eff_lv_1"], huwin: "mjcomEff_bianzhangWin", hulose: "mjcomEff_bianzhangLose" },
        [MahHu.Hu_KanZhang]: {time:1000, huPath: "mjsp_ty_ty2",aniName:"ty2", texture: "mjcomEff_kanzhang", sound: ["eff_lv_1"], huwin: "mjcomEff_kanzhangWin", hulose: "mjcomEff_kanzhangLose" },
        [MahHu.Hu_DanDiao]: {time:1000, huPath: "mjsp_ty_ty2",aniName:"ty2", texture: "mjcomEff_dandiao", sound: ["eff_lv_1"], huwin: "mjcomEff_dandiaoWin", hulose: "mjcomEff_dandiaoLose" },
        [MahHu.Hu_YiBanGao]: {time:1000, huPath: "mjsp_ty_ty2",aniName:"ty2", texture: "mjcomEff_yibangao", sound: ["eff_lv_1"], huwin: "mjcomEff_yibangaoWin", hulose: "mjcomEff_yibangaoLose" },
        [MahHu.Hu_LiuLianShun]: {time:1000, huPath: "mjsp_ty_ty2",aniName:"ty2", texture: "mjcomEff_liulianshun", sound: ["eff_lv_1"], huwin: "mjcomEff_liulianshunWin", hulose: "mjcomEff_liulianshunLose" },
        [MahHu.Hu_ShuangTongKe]: {time:1000, huPath: "mjsp_ty_ty2",aniName:"ty2", texture: "mjcomEff_shuangtongke", sound: ["eff_lv_1"], huwin: "mjcomEff_shuangtongkeWin", hulose: "mjcomEff_shuangtongkeLose" },
        [MahHu.Hu_LaoSaoPei]: {time:1000, huPath: "mjsp_ty_ty2",aniName:"ty2", texture: "mjcomEff_laoshaopei", sound: ["eff_lv_1"], huwin: "mjcomEff_laoshaopeiWin", hulose: "mjcomEff_laoshaopeiLose" },
        [MahHu.Hu_DuiDuiHu]: {time:1000, huPath: "mjsp_ty_ty2",aniName:"ty2", texture: "mjcomEff_duiduihu", sound: ["eff_lv_1"], huwin: "mjcomEff_duiduihuWin", hulose: "mjcomEff_duiduihuLose" },
        [MahHu.Hu_DuanYaoJiu]: {time:1000, huPath: "mjsp_ty_ty2",aniName:"ty2", texture: "mjcomEff_duanyaojiu", sound: ["eff_lv_1"], huwin: "mjcomEff_duanyaojiuWin", hulose: "mjcomEff_duanyaojiuLose" },
        [MahHu.Hu_HongZhongDiao]: {time:1000, huPath: "mjsp_ty_ty2",aniName:"ty2", texture: "mjcomEff_hongzhongdiao", sound: ["eff_lv_1"], huwin: "mjcomEff_hongzhongdiaoWin", hulose: "mjcomEff_hongzhongdiaoLose" },
        [MahHu.Hu_ShuangAnKe]: {time:1000, huPath: "mjsp_ty_ty2",aniName:"ty2", texture: "mjcomEff_shuanganke", sound: ["sananke"], huwin: "mjcomEff_shuangankeWin", hulose: "mjcomEff_shuangankeLose" },
        [MahHu.Hu_ZhuoWuKui]: {time:1000, huPath: "mjsp_ty_ty2",aniName:"ty2", texture: "mjcomEff_zhuawukui", sound: ["eff_lv_1"], huwin: "mjcomEff_zhuawukuiWin", hulose: "mjcomEff_zhuawukuiLose" },
        [MahHu.Hu_BuQiuRen]: {time:1000, huPath: "mjsp_ty_ty2",aniName:"ty2", texture: "mjcomEff_buqiuren", sound: ["eff_lv_1"], huwin: "mjcomEff_buqiurenWin", hulose: "mjcomEff_buqiurenLose" },
        [MahHu.Hu_QingYiSe]: {time:1566, huPath: "mjsp_tsani_qingyise",aniName:"ani", texture: "mjcomEff_qingyise", sound: ["eff_lv_1"], huwin: "mjcomEff_qingyiseWin", hulose: "mjcomEff_qingyiseLose" },
        [MahHu.Hu_WuXingBaGua]: {time:1566, huPath: "mjsp_tsani_wxbg",aniName:"ani", texture: "mjcomEff_wuxingbagua", sound: ["eff_lv_3"], huwin: "mjcomEff_wuxingbaguaWin", hulose: "mjcomEff_wuxingbaguaLose" },

        [MahHu.Hu_MenQing]: { time:1000,huPath: "mjsp_ty_ty2",aniName:"ty2", texture: "mjcomEff_menqing", sound: ["eff_lv_2"], huwin: "mjcomEff_menqingWin", hulose: "mjcomEff_menqingLose" },
        [MahHu.Hu_ZiMo]: {time:1000, huPath: "mjsp_sp",aniName:"ani", texture: "mjcomEff_pinghu", sound: ["eff_lv_2"], huwin: "mjcomEff_zimo_win", hulose: "mjcomEff_zimoLose" },
        [MahHu.Hu_GangShangHua]: {time:1533, huPath: "mjsp_tsani_gangshanghua",aniName:"ani", texture: "mjcomEff_gangshanghua", sound: ["gangshanghua"], huwin: "mjcomEff_gangshanghuaWin", hulose: "mjcomEff_gangshanghuaLose" },
        [MahHu.Hu_GangShangPao]: { time:1000,huPath: "mjsp_ty_ty2",aniName:"ty2", texture: "mjcomEff_gangshangpao", sound: ["eff_lv_2"], huwin: "mjcomEff_gangshangpaoWin", hulose: "mjcomEff_gangshangpaoLose" },
        [MahHu.Hu_QiangGangHu]: {time:1000, huPath: "mjsp_ty_ty2",aniName:"ty2", texture: "mjcomEff_qiangganghu", sound: ["eff_lv_2"], huwin: "mjcomEff_qiangganghuWin", hulose: "mjcomEff_qiangganghuLose" },
        [MahHu.Hu_HaiDiLaoYue]: { time:1500,huPath: "mjsp_tsani_hdly",aniName:"ani", texture: "mjcomEff_haidilaoyue", sound: ["haidilaoyue"], huwin: "mjcomEff_haidilaoyueWin", hulose: "mjcomEff_haidilaoyueLose" },
        [MahHu.Hu_MiaoShouHuiChun]: {time:2100, huPath: "mjsp_tsani_mshc",aniName:"ani", texture: "mjcomEff_miaoshouhuichun", sound: ["miaoshouhuichun"], huwin: "mjcomEff_miaoshouhuichunWin", hulose: "mjcomEff_miaoshouhuichunLose" },

        [MahHu.Hu_YiTiaoLong]: {time:1000, huPath: "mjsp_ty_ty2",aniName:"ty3", texture: "mjcomEff_yitiaolong", sound: ["eff_lv_3"], huwin: "mjcomEff_yitiaolongWin", hulose: "mjcomEff_yitiaolongLose" },
        [MahHu.Hu_SanAnKe]: {time:1533, huPath: "mjsp_tsani_sak",aniName:"ani", texture: "mjcomEff_sananke", sound: ["sananke"], huwin: "mjcomEff_sanankeWin", hulose: "mjcomEff_sanankeLose" },
        [MahHu.Hu_JinGouDiao]: { time:1000,huPath: "mjsp_ty_ty2",aniName:"ty3", texture: "mjcomEff_jingoudiao", sound: ["eff_lv_3"], huwin: "mjcomEff_jingoudiaoWin", hulose: "mjcomEff_jingoudiaoLose" },
        [MahHu.Hu_DaYuWu]: {time:2000, huPath: "mjsp_tsani_qdy",aniName:"ani_dayuwu", texture: "mjcomEff_dayuwu", sound: ["eff_lv_3"], huwin: "mjcomEff_dayuwuWin", hulose: "mjcomEff_dayuwuLose" },
        [MahHu.Hu_XiaoYuWu]: {time:2000, huPath: "mjsp_tsani_qdy",aniName:"ani_xiaoyuwu", texture: "mjcomEff_xiaoyuwu", sound: ["eff_lv_3"], huwin: "mjcomEff_xiaoyuwuWin", hulose: "mjcomEff_xiaoyuwuLose" },
        [MahHu.Hu_SanJieGao]: {time:1666, huPath: "mjsp_tsani_sjg",aniName:"ani", texture: "mjcomEff_sanjiegao", sound: ["sanjiegao"], huwin: "mjcomEff_sanjiegaoWin", hulose: "mjcomEff_sanjiegaoLose" },
        [MahHu.Hu_QuanShuangKe]: { time:1000,huPath: "mjsp_ty_ty2",aniName:"ty3", texture: "mjcomEff_quanshuangke", sound: ["eff_lv_3"], huwin: "mjcomEff_quanshuangkeWin", hulose: "mjcomEff_quanshuangkeLose" },
        [MahHu.Hu_BaiWanShi]: {time:1000, huPath: "mjsp_ty_ty2",aniName:"ty3", texture: "mjcomEff_baiwanshi", sound: ["eff_lv_3"], huwin: "mjcomEff_baiwanshiWin", hulose: "mjcomEff_baiwanshiLose" },
        [MahHu.Hu_TuiBuDao]: { time:1000,huPath: "mjsp_ty_ty2",aniName:"ty3", texture: "mjcomEff_tuibudao", sound: ["eff_lv_3"], huwin: "mjcomEff_tuibudaoWin", hulose: "mjcomEff_tuibudaoLose" },
        [MahHu.Hu_QiDui]: {time:1000, huPath: "mjsp_ty_ty2",aniName:"ty3", texture: "mjcomEff_qidui", sound: ["eff_lv_3"], huwin: "mjcomEff_qiduiWin ", hulose: "mjcomEff_qiduiLose " },
        [MahHu.Hu_JiangDui]: { time:1000,huPath: "mjsp_ty_ty2",aniName:"ty3", texture: "mjcomEff_jiangdui", sound: ["eff_lv_3"], huwin: "mjcomEff_jiangduiWin", hulose: "mjcomEff_jiangduiLose" },
        [MahHu.Hu_ShiErJinChai]: {time:1833, huPath: "mjsp_tsani_sejc",aniName:"ani", texture: "mjcomEff_shierjinchai", sound: ["shierjinchai"], huwin: "mjcomEff_shierjinchaiWin", hulose: "mjcomEff_shierjinchaiLose" },
        [MahHu.Hu_YaoJiu]: {time:1666, huPath: "mjsp_tsani_qdy",aniName:"ani_quandaiyao", texture: "mjcomEff_quanyaojiu", sound: ["eff_lv_3"], huwin: "mjcomEff_quanyaojiuWin", hulose: "mjcomEff_quanyaojiuWinLose" },
        [MahHu.Hu_SiJieGao]: { time:1000,huPath: "mjsp_tsani_sijiegao",aniName:"ani", texture: "mjcomEff_sijiegao", sound: ["sijiegao"], huwin: "mjcomEff_sijiegaoWin", hulose: "mjcomEff_sijiegaoLose" },
        [MahHu.Hu_LvYiSe]: {time:1000, huPath: "mjsp_ty_ty2",aniName:"ty3", texture: "mjcomEff_lvyise", sound: ["eff_lv_3"], huwin: "mjcomEff_lvyiseWin", hulose: "mjcomEff_lvyiseLose" },
        [MahHu.Hu_ShouZhongBaoYi]: {time:1566, huPath: "mjsp_tsani_wxbg",aniName:"ani1", texture: "mjcomEff_shouzhongbaoyi", sound: ["shouzhongbaoyi"], huwin: "mjcomEff_shouzhongbaoyiWin", hulose: "mjcomEff_shouzhongbaoyiLose" },
        [MahHu.Hu_QuanXiao]: {time:2000, huPath: "mjsp_tsani_qdy",aniName:"ani_quanxiao", texture: "mjcomEff_quanxiao", sound: ["eff_lv_3"], huwin: "mjcomEff_quanxiaoWin", hulose: "mjcomEff_quanxiaoLose" },
        [MahHu.Hu_QuanZhong]: {time:2000, huPath: "mjsp_tsani_qdy",aniName:"ani_quanzhong", texture: "mjcomEff_quanzhong", sound: ["eff_lv_3"], huwin: "mjcomEff_quanzhongWin", hulose: "mjcomEff_quanzhongLose" },
        [MahHu.Hu_QuanDa]: {time:2000, huPath: "mjsp_tsani_qdy",aniName:"ani_quanda", texture: "mjcomEff_quanda", sound: ["eff_lv_3"], huwin: "mjcomEff_quandaWin", hulose: "mjcomEff_quandaLose" },


        [MahHu.Hu_LongQiDui]: {time:1666, huPath: "mjsp_tsani_lqd", aniName:"ani1",texture: "mjcomEff_longqidui", sound: ["longqidui"], huwin: "mjcomEff_longqiduiWin", hulose: "mjcomEff_longqiduiLose" },
        [MahHu.Hu_QuanDaiWu]: {time:2000, huPath: "mjsp_ty_ty2",aniName:"ty3", texture: "mjcomEff_quandaiwu", sound: ["eff_lv_4"], huwin: "mjcomEff_quandaiwuWin", hulose: "mjcomEff_quandaiwuLose" },
        [MahHu.Hu_SiAnKe]: {time:1533, huPath: "mjsp_tsani_sak",aniName:"ani2", texture: "mjcomEff_sianke", sound: ["sinanke"], huwin: "mjcomEff_siankeWin", hulose: "mjcomEff_siankeLose" },
        [MahHu.Hu_JiuLianBaoDeng]: {time:2000, huPath: "mjsp_tsani_jlbd",aniName:"ani", texture: "mjcomEff_jiulianbaodeng", sound: ["jiulianbaodeng"], huwin: "mjcomEff_jiulianbaodengWin", hulose: "mjcomEff_jiulianbaodengLose" },
        [MahHu.Hu_ShuangLongQiDui]: { time:1833,huPath: "mjsp_tsani_shuanglqd",aniName:"ani", texture: "mjcomEff_shuanglongqidui", sound: ["shuanglongqidui"], huwin: "mjcomEff_shuanglongqiduiWin", hulose: "mjcomEff_shuanglongqiduiLose" },
        [MahHu.Hu_LianQiDui]: {time:1000, huPath: "mjsp_tsani_lianqidui",aniName:"ani", texture: "mjcomEff_lianqidui", sound: ["eff_lv_4"], huwin: "mjcomEff_lianqiduiWin", hulose: "mjcomEff_lianqiduiLose" },
        [MahHu.Hu_QuanYaoJiu]: {time:1000, huPath: "mjsp_tsani_qyj",aniName:"ani", texture: "mjcomEff_quanyaojiu", sound: ["eff_lv_4"], huwin: "mjcomEff_quanyaojiuWin", hulose: "mjcomEff_quanyaojiuLose" },
        [MahHu.Hu_ShiBaLuoHan]: {time:1333, huPath: "mjsp_tsani_sblh",aniName:"ani", texture: "mjcomEff_shibaluohan", sound: ["shibaluohan"], huwin: "mjcomEff_shibaluohanWin", hulose: "mjcomEff_shibaluohanLose" },
        [MahHu.Hu_YiSeShuangLongHui]: {time:1666, huPath: "mjsp_tsani_lqd",aniName:"ani", texture: "mjcomEff_ysslh", sound: ["eff_lv_4"], huwin: "mjcomEff_ysslhWin", hulose: "mjcomEff_ysslhLose" },
        [MahHu.Hu_TianHu]: {time:1400, huPath: "mjsp_tsani_tdh",aniName:"ani", texture: "mjcomEff_tianhu", sound: ["tiandihu"], huwin: "mjcomEff_tianhuWin", hulose: "mjcomEff_tianhuLose" },
        [MahHu.Hu_DiHu]: {time:1400, huPath: "mjsp_tsani_tdh", aniName:"ani2",texture: "mjcomEff_dihu", sound: ["tiandihu"], huwin: "mjcomEff_dihuWin", hulose: "mjcomEff_dihuLose" },
        [MahHu.Hu_SanLongQiDui]: { time:3366,huPath: "mjsp_tsani_sanlqd",aniName:"ani", texture: "mjcomEff_sanlongqidui", sound: ["sanlongqidui"], huwin: "mjcomEff_sanlongqiduiWin", hulose: "mjcomEff_sanlongqiduiLose" },
        
        [MahHu.Hu_WuHuSiHai]: { time:1666,huPath: "mjsp_tsani_whsh",aniName:"ani", texture: "mjcomEff_whsh", sound: ["big_whsh"], huwin: "mjcomEff_whshWin", hulose: "mjcomEff_whshLose" },
        [MahHu.Hu_TianLongBaBu]: { time:1666,huPath: "mjsp_tsani_tnbb",aniName:"ani", texture: "mjcomEff_tlbb", sound: ["big_tnbb"], huwin: "mjcomEff_tlbbWin", hulose: "mjcomEff_tlbbLose" },
        [MahHu.Hu_XianHeZhiLu]: { time:1666,huPath: "mjsp_tsani_xhzl",aniName:"ani", texture: "mjcomEff_xhzl", sound: ["big_xhzl"], huwin: "mjcomEff_yhzlWin", hulose: "mjcomEff_yhzlLose" },
        [MahHu.Hu_KaiMenJianShan]: { time:1666,huPath: "mjsp_tsani_kmjs",aniName:"ani", texture: "mjcomEff_kmjs", sound: ["big_kmjs"], huwin: "mjcomEff_kmjsWin", hulose: "mjcomEff_kmjsLose" },
        [MahHu.Hu_ChangEBengYue]: { time:1666,huPath: "mjsp_tsani_ceby",aniName:"ani", texture: "mjcomEff_ceby", sound: ["big_ceby"], huwin: "mjcomEff_cebyWin", hulose: "mjcomEff_cebyLose" },
        [MahHu.Hu_BaiNiaoChaoFeng]: { time:1666,huPath: "mjsp_tsani_bncf",aniName:"ani", texture: "mjcomEff_bncf", sound: ["big_bncf"], huwin: "mjcomEff_bncfWin", hulose: "mjcomEff_bncfLose" },
        [MahHu.Hu_YouRenYouYu]: { time:1666,huPath: "mjsp_tsani_yzyy",aniName:"ani", texture: "mjcomEff_yryy", sound: ["big_yzyy"], huwin: "mjcomEff_yryyWin", hulose: "mjcomEff_yryyLose" },
        [MahHu.Hu_YiTongJiangShan]: { time:1666,huPath: "mjsp_tsani_ytjs",aniName:"ani", texture: "mjcomEff_ytjs", sound: ["big_ytjs"], huwin: "mjcomEff_ytjsWin", hulose: "mjcomEff_ytjsLose" },
        [MahHu.Hu_WanMeiQingRenJie]: { time:1666,huPath: "mjsp_tsani_qej",aniName:"ani", texture: "mjcomEff_wmqrj", sound: ["big_qej"], huwin: "mjcomEff_wmqrjWin", hulose: "mjcomEff_wmqrjLose" },
        [MahHu.Hu_DianDaoQianKun]: { time:1666,huPath: "mjsp_tsani_ddqk",aniName:"ani", texture: "mjcomEff_ddqk", sound: ["big_ddqk"], huwin: "mjcomEff_ddqkWin", hulose: "mjcomEff_ddqkLose" },
        [MahHu.Hu_JiuWuZhiZun]: { time:1666,huPath: "mjsp_tsani_jwzz",aniName:"ani", texture: "mjcomEff_jwzz", sound: ["big_jwzz"], huwin: "mjcomEff_jwzzWin", hulose: "mjcomEff_jwzzLose" },
        [MahHu.Hu_ShiQuanShiMei]: { time:1666,huPath: "sqsm",aniName:"ani", texture: "mjcomEff_sssm", sound: ["big_sqsm"], huwin: "mjcomEff_sqsmWin", hulose: "mjcomEff_sqsmLose" },
    
    
    }





    export const CardMoveExtent = {
        [Direction.Bottom]: { ClickUpExtent: 65, },

    };

    //倒计时
    export const TimeCountDown = {
        Common: 15,
        TuoGuan: 1,
    }

    // 杠牌朝向
    export const CtrlOri = {
        LeftSide: 1,
        Front: 2,
        RightSide: 3,
        Mine: 4,
        Bu: 5
    }


    // 碰牌朝向
    export const AltOriTab = {
        [Direction.Bottom]: {
            [0]: 0,
            [1]: 1,
            [2]: 2,
            [3]: 3,
        },
        [Direction.Right]: {
            [0]: 1,
            [1]: 2,
            [2]: 3,
            [3]: 0,
        },
        [Direction.Top]: {
            [0]: 2,
            [1]: 3,
            [2]: 0,
            [3]: 1,
        },
        [Direction.Left]: {
            [0]: 3,
            [1]: 0,
            [2]: 1,
            [3]: 2,
        }

    }


    // 碰牌朝向
    export const AltOri = {
        LeftSide: 1,
        Front: 2,
        RightSide: 3
    }



    // 根据牌数 手牌位置不一样 1为14张 2为7张
    export let CardNumberHandsPosition = {
        [Direction.Bottom]: { IOS: { x: 687, y: 50, z: 0 }, Android: { x: 687, y: 27, z: 0 } },
        [Direction.Right]: { IOS: { x: -247, y: 250, z: 0 }, Android: { x: -246, y: 250, z: 0 } },
        [Direction.Top]: { IOS: { x: -332, y: -69, z: 0 }, Android: { x: -332, y: -69, z: 0 } },
        [Direction.Left]: { IOS: { x: 241, y: -207, z: 0 }, Android: { x: 241, y: -207, z: 0 } },

    }
    // 摸牌位置
    export const CardNumberPicksPosition = {
        [Direction.Bottom]: { IOS: { x: 836, y: 50, z: 0 }, Android: { x: 836, y: 27, z: 0 } },
        [Direction.Right]: { IOS: { x: -254, y: 316, z: 0 }, Android: { x: -254, y: 316, z: 0 } },
        [Direction.Top]: { IOS: { x: -410, y: -69, z: 0 }, Android: { x: -410, y: -69, z: 0 } },
        [Direction.Left]: { IOS: { x: 229, y: -273, z: 0 }, Android: { x: 229, y: -273, z: 0 } },
    }


    // 摸牌每个牌的位移长度
    export const CardPositionWidth = {
        [Direction.Bottom]: 127,
        [Direction.Right]: 40,
        [Direction.Top]: 40,
        [Direction.Left]: 40,
    }
    // 摸牌弹起来的高度
    export const CardPositionHeight = {
        [Direction.Bottom]: 250,
        [Direction.Right]: 100,
        [Direction.Top]: 100,
        [Direction.Left]: 100,
    }

    // 麻将提示
    export const TipsSprite = {
        // 等待充值
        WaitPay: { Sprite: "tiptext_dengdai", Time: 5000, IsAutoQut: true ,Des:"等待充值中..." },
        // 等待定缺
        WaitDingQue: { Sprite: "tiptext_dingque", Time: 5000, IsAutoQut: false,Des:"定缺中..."  },
        // 过手才能胡
        GuoShouCaiHu: { Sprite: "tiptext_guoshou", Time: 1000, IsAutoQut: true,Des:"过手才能胡..."  },
        // 改变牌型才能杠
        MjXLCanNotGang: { Sprite: "xueliu_bunenggang", Time: 2000, IsAutoQut: true,Des:"改变牌型才能杠..."  },
        // 等待换牌中
        WaitHuanPai: { Sprite: "tip_huanpai", Time: 5000, IsAutoQut: true,Des:"等待换牌中..."  },
        // 对家换牌
        HuanPaiDuiJia: { Sprite: "mjgame_huanpai_001_001", Time: 5000, IsAutoQut: true,Des:"对家换牌..."  },
        // 逆时针换牌
        HuanPaiNiShiZhen: { Sprite: "mjgame_huanpai_002_001", Time: 5000, IsAutoQut: true,Des:"逆时针换牌..."  },
        // 顺时针换牌
        HuanPaiShunShiZhen: { Sprite: "mjgame_huanpai_003_001", Time: 5000, IsAutoQut: true,Des:"顺时针换牌..."  },


        // 请先打出定缺
        MustQue: { Sprite: "tip_xianchupai", Time: 5000, IsAutoQut: false ,Des:"请打出定缺..."  },

        // 好牌不换
        HaoPaiBuHuan: { Sprite: "mjTips_haopaibuhuan", Time: 5000, IsAutoQut: false,Des:"好牌不换..."  },



    }




    // 好牌不换需要隐藏的三张牌特效路径
    export const HuanSanZHangHidePath = {
        [Direction.Bottom]: "HuanSanZhangEff/player0",
        [Direction.Right]: "HuanSanZhangEff/player1",
        [Direction.Top]: "HuanSanZhangEff/player2",
        [Direction.Left]: "HuanSanZhangEff/player3",
    }

    export const FengDing = {
        [0]: "不封顶",
        [1]: 16,
        [2]: 32,
        [3]: 64,
    }
    // 房间规则参数

    

    export let MjRoomRule = {

        
        round:1,//局数 
        diFen:1  ,//底分
        max_fan:1,//封顶
        hsz:false,//换三张
        ziMoType:false, //// 自摸 0：自摸加底 1：自摸加番
        yao_jiu:false,//幺九
        jiang_dui:false,//将对
        men_qing:false,//门清
        tian_di_hu:false,//天地胡

        dian_gang_hua:1,// 点杠花 点杠炮
        dingQue:false,// 缺
        hongZhongType:0, // 是几就是几个红中
        isHongZhongGang:false, //是否是红中杠玩法
    };



    //小结算数据
    export let MjGameSmallResult: pb.S2CMahInningOverData = null;



    //杠胡特效播放分 完成后下家出牌
    //export let EffectGangHuOver = true

    export let DragCardCount = 0

    //玩法新增房间数据
    export let RoomGameData = {}
    export let BenJinCard = 0
    export let TingYong = {};

    export let PiaoData = {}


    //自己有没有飘
    export let IsPiao : boolean = false
    //自己有没有躺
    export let IsTang : boolean = false

    export let ClickedTang : boolean = false

    export let AllHuGroup = {}

    export let TangCards = {
        [Direction.Bottom]: {
            IsHu: false,
            TanCards: [],
            HuCards: [],
        },
        [Direction.Right]: {
            IsHu: false,
            TanCards: [],
            HuCards: [],
        },
        [Direction.Top]: {
            IsHu: false,
            TanCards: [],
            HuCards: [],
        },
        [Direction.Left]: {
            IsHu: false,
            TanCards: [],
            HuCards: [],
        }
    }

    export let PoChanClientPos ={}

    export let AlreadyTang  : boolean = false


    //自适应比例
    export let AdapScale = null

    export let HuCardTemp = 0

    export let HuCardTempTwo = 0

    export let TimeTest = 0

    //时间
    export let OperateTime = {
        Piaofen: 500,
        PiaofenShuaXin: 800, // 飘分多久后开始刷新玩家当前玩家货币
        Hu: 2000,
        PingHu: 1000,
        OtherMo: 200,
        SelfMo: 1000,
        Da: 300,
        Gang: 2000,
        Fei: 1000,
        Ti: 1000,
        Peng: 1000,
    }
    //游戏玩法有的花色
    export let HaveColorArr : MahColor[] = []

    // 是否需要显示缺的标记(目前只有血流红中需要显示缺)
    export let IsCanShowQue : boolean = false
    // 缺的牌带遮罩还是不缺的牌带遮罩
    export let IsQueShowMask : boolean = false
    // 是否要弹红中弹框(目前只有血流红中 红中需要提示)
    export let IsShowOutCardTip : boolean = false
    //打出的红中是否要显示杠
    // export let IsShowOutCardGang : boolean = false

    // 是否能打出癞子
    export let IsCanPickOutLai  : boolean= false
    // 是否显示癞子标记癞子
    export let IsCanShowLai : boolean = false

    // 是否显示癞子黄底背景
    export let IsCanShowLaiBg : boolean = false

    // 胡牌之后是否还要胡牌提示
    export let AlreadyHuShowTip : boolean = false

    // 是否确认过了大于6张牌的换三张
    export let IsSureQueMore  : boolean = false

    export let huCards = {}
    export let fanshu = {}
    export let cardcount = {}
    export let mjTuoGuan : boolean= false
    export let mjAutoNext : boolean = false
    export let curLimit : boolean = null
    // 道具的时候是选的第几张
    export let PropIndex = 0
    //红中总数
    export let HZTotalCount = 0
    //牌的总张数
    export let totalCount = 0

    
    //是否血流模式
    export let ISXueLiu : boolean = false
    //是否倍数显示 否则显示番数
    export let ISBei : boolean = true
    // 是否是充值阶段(不是充值阶段处理倒计时 摸打阶段 处理倒计时)
    export let ISReCharge : boolean = false
    // 自己是否使用的红中道具
    export let ISUseHZProp : boolean = false
    // 额外的红中牌数量
    export let extraHZCount = 0

    // 自己摸的牌的牌值
    export let selfMoCard = 0
    // 自己摸的牌是否被选中
    export let selfMoCardIsUp = false
    

    

    export const MJ_HPType =
    {
        [MahHu.Hu_PingHu]:"平胡",
        [MahHu.Hu_JinGouDiao]:"金钩钓",
        [MahHu.Hu_YiBanGao]:"一般高",
        [MahHu.Hu_ShuangAnKe ]:"双暗刻",
        [MahHu.Hu_QuanZhong ]:"全中",
        [MahHu.Hu_QiDui  ]:"七对",
        [MahHu.Hu_GangShangPao  ]:"杠上炮",
        [MahHu.Hu_SanJieGao ]:"三节高",
        [MahHu.Hu_QuanXiao ]:"全小",
        [MahHu.Hu_DaYuWu ]:"大于五",
        [MahHu.Hu_YaoJiu ]:"幺九", //全带幺
        [MahHu.Hu_QuanYaoJiu ]:"全幺九",
        [MahHu.Hu_YiTiaoLong ]:"一条龙",
        [MahHu.Hu_ShiErJinChai ]:"十二金钗",
        [MahHu.Hu_SuHu ]:"素胡",
        [MahHu.Hu_QuanDa  ]:"全大",
        [MahHu.Hu_DuanYaoJiu ]:"断幺九",
        [MahHu.Hu_TuiBuDao ]:"推不倒",
        [MahHu.Hu_BenJin ]:"本金",
        [MahHu.Hu_JiuLianBaoDeng  ]:"九莲宝灯",
        [MahHu.Hu_DanDiao  ]:"单吊",
        [MahHu.Hu_SiJieGao  ]:"四节高",
        [MahHu.Hu_QiangTiHu  ]:"抢提胡",
        [MahHu.Hu_DiHu   ]:"地胡",
        [MahHu.Hu_ZiMo   ]:"自摸",
        [MahHu.Hu_YiSeShuangLongHui]:"一色双龙会",
        [MahHu.Hu_WuXingBaGua ]:"五行八卦",
        [MahHu.Hu_ZhuoWuKui ]:"捉五魁",
        [MahHu.Hu_HaiDiLaoYue]:"海底捞月",
        [MahHu.Hu_MenQing ]:"门清",
        [MahHu.Hu_QingYiSe  ]:"清一色",
        [MahHu.Hu_SiAnKe  ]:"四暗刻",
        [MahHu.Hu_TianHu  ]:"天胡",
        [MahHu.Hu_SanLongQiDui  ]:"三龙七对",
        [MahHu.Hu_LiuLianShun   ]:"六连顺",
        // [MahHu.Hu_ZiMoJiaFan  ]:"自摸加番",
        [MahHu.Hu_ShuangLongQiDui  ]:"双龙七对",
        [MahHu.Hu_BuQiuRen ]:"不求人",
        [MahHu.Hu_LianQiDui ]:"连七对",
        [MahHu.Hu_ShouZhongBaoYi ]:"守中抱一",
        [MahHu.Hu_LaoSaoPei ]:"老少配",
        [MahHu.Hu_JiangDui ]:"将对",
        [MahHu.Hu_ShuangTongKe ]:"双同刻",
        [MahHu.Hu_ShiBaLuoHan ]:"十八罗汉",
        [MahHu.Hu_KanZhang ]:"坎张",
        [MahHu.Hu_BaiWanShi ]:"百万石",
        [MahHu.Hu_DuiDuiHu ]:"对对胡",
        [MahHu.Hu_BianZhang ]:"边张",
        [MahHu.Hu_GangShangHua]:"杠上花",
        [MahHu.Hu_HongZhongDiao]:"红中吊",
        [MahHu.Hu_QuanDaiWu]:"全带五",
        [MahHu.Hu_XiaoYuWu  ]:"小于五",
        [MahHu.Hu_QuanShuangKe]:"全双刻",
        [MahHu.Hu_LongQiDui]:"龙七对",
        [MahHu.Hu_LvYiSe]:"绿一色",
        [MahHu.Hu_MiaoShouHuiChun]:"妙手回春",
        [MahHu.Hu_QiangGangHu]:"抢杠胡",
        [MahHu.Hu_SanAnKe]:"三暗刻",
        [MahHu.Hu_HongZhongGang]:"红中杠",
        [MahHu.Hu_MingPai]:"明牌",
        [MahHu.Hu_WuHuSiHai]:"五湖四海",
        [MahHu.Hu_TianLongBaBu]:"天龙八部",
        [MahHu.Hu_XianHeZhiLu]:"仙人指路",
        [MahHu.Hu_KaiMenJianShan]:"开门见山",
        [MahHu.Hu_ChangEBengYue]:"嫦娥奔月",
        [MahHu.Hu_BaiNiaoChaoFeng]:"百鸟朝凤",
        [MahHu.Hu_YouRenYouYu]:"游刃有余",
        [MahHu.Hu_YiTongJiangShan]:"一统江山",
        [MahHu.Hu_WanMeiQingRenJie]:"完美情人节",
        [MahHu.Hu_DianDaoQianKun]:"颠倒乾坤",
        [MahHu.Hu_JiuWuZhiZun]:"九五之尊",
        [MahHu.Hu_ShiQuanShiMei]:"十全十美",
        
    }


    export let allPaiqiangArr:fgui.GObject[]=[]; 

    //中心播放破封的时候 播放其他中心胡 延迟
    export let poFengstate:boolean=false;
    //购买并使用道具破封卡 
    export let isWaitBuy:boolean=false; 
    
    export let MeshCard:{w:number,h:number} ={w:80,h:115} 


    export const TablePretended = {
        common:{
            name: "#054D4D",
            ruleDes: "#054D4D",
            pay: "#042929",

        },

        hetanbyuese:{
            name: "#3C9BC5",
            ruleDes: "#3C9BC5",
            pay: "#3C9BC5",

        },

        huangjinlong:{
            name: "#3C9BC5",
            ruleDes: "#3C9BC5",
            pay: "#3C9BC5",

        },

    }



}