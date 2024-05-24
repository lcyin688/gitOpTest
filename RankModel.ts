import { GameConsts } from '../../../../../Script/game/GameConsts';
import { UIPa } from '../../../../../Script/game/UIParam';
import { UIModelBase } from './../../../../../c2f-framework/gui/layer/UIModelBase';

const { ccclass, property } = cc._decorator;
@ccclass
export default class RankModel extends UIModelBase {

    /** 预制名 给实例调用 */
    public prefabName = 'F_Rank';
    public data: UIPa.RankNewArgs
    public selfData: UIPa.RankItemArgs
    public argsArr: UIPa.RankItemArgs[]
    public setData(dataInput: UIPa.RankNewArgs) {
        this.data = dataInput
    }

    public getCurData(dataInput: UIPa.RankNewArgs) {
        let typ = dataInput.typ
        let data: msg.RankData
        if (GameConsts.RankTypeArrDirect.includes(typ)) {
            data = {
                RankId: typ,
                Recs: dataInput.data,
                Idx: 0,
                Score: 0
            }
            return data
        } else {
            if (dataInput.seq && dataInput.seq > 0) {//活动类型的时候
                data = szg.player.rank.getActSeqRankMapBySeq(dataInput.seq)
            } else {
                data = szg.player.rank.getRankMapDataByTyp(typ)
            }
        }
        return data
    }


    public initData(dataInput: UIPa.RankNewArgs) {
        let data = this.getCurData(dataInput)
        let typ = dataInput.typ
        if (!data || !data.Recs || data.Recs.length == 0) {
            this.argsArr = []
            let dataItem: UIPa.RankArgs = {
                data: data.Recs,
                selfIdx: data.Idx,
                Score: data.Score,
                typ: typ
            }
            this.initDataBy(dataItem)
            return
        }
        //如果没传新的分数 就使用服务器的分数
        if (!dataInput.Score) {
            dataInput.Score = data.Score
        }
        if (dataInput.Score != null) {
            //巅峰争霸 自己在榜里边的时候才去合并
            if (typ == GameConsts.RankType.arenaPeak) {
                if (data.Idx && data.Idx > 0 && data.Score > 0) {
                    szg.player.rank.megeRankData(data, dataInput)
                }
            } else {
                szg.player.rank.megeRankData(data, dataInput)
            }

        }
        let dataItem: UIPa.RankArgs = {
            data: data.Recs,
            selfIdx: data.Idx,
            Score: data.Score,
            typ: typ
        }
        this.initDataBy(dataItem)
        this.argsArr = this.getArgList(this.data)
    }

    private initDataBy(data: UIPa.RankArgs) {
        let typ = data.typ
        let isGuildState = GameConsts.RankTypeGuild.includes(typ)  //是否使用的公会数据
        let selfPlayerId = szg.player.base.getBaseInfo().PlrId
        let selfGuildId = szg.player.base.getBaseInfo().GuildId

        //组装的数据 可能自己在榜
        let isHaveSelf = false
        for (const v of data.data) {
            if (v.Plr) {
                if (selfPlayerId == v.Plr.PlrId) {
                    isHaveSelf = true
                }
            } else if (v.Gld) {
                if (selfGuildId == v.Gld.GldId) {
                    isHaveSelf = true
                }
            }
            if (isHaveSelf) {
                this.selfData = {
                    data: v,
                    index: data.index,
                    typ: data.typ,
                }
                break
            }
        }
        if (!isHaveSelf) {//确实没有数据在自己组装空数据
            let selfDataItem: msg.RankRec
            if (isGuildState) {
                selfDataItem = {
                    Gld: szg.player.guild.guildInfo.Info,
                    Score: data.Score,
                    Idx: data.selfIdx,
                }
            } else {
                selfDataItem = {
                    Plr: szg.player.base.getBaseInfo(),
                    Score: data.Score,
                    Idx: data.selfIdx,
                }
            }
            this.selfData = {
                data: selfDataItem,
                index: data.index,
                typ: data.typ,
            }
        }
    }


    private getArgList(dataTemp: UIPa.RankNewArgs) {
        let argsArr: UIPa.RankItemArgs[] = []
        let dataAll = this.getCurData(dataTemp)
        let data = dataAll.Recs
        data.forEach(v => {
            if (v.Idx > 3) {
                let index = 0
                if (dataTemp.index) {
                    index = dataTemp.index
                }
                let itemData: UIPa.RankItemArgs = {
                    data: v,
                    typ: dataTemp.typ,
                    index: index,
                }
                argsArr.push(itemData)
            }
        });
        return argsArr
    }

    protected onDestroy(): void {
        this.data = null
        this.selfData = null
        this.argsArr = null
        super.onDestroy()
    }

}