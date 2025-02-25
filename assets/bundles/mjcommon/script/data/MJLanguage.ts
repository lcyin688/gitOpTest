/**@description 语言包具体的代码实现 */

import { LanguageEN } from "../../../../scripts/common/language/LanguageEN";
import { LanguageZH } from "../../../../scripts/common/language/LanguageZH";
import { Macro } from "../../../../scripts/framework/defines/Macros";
import { MJData } from "./MJData";
import { MJ_EN } from "./MJLanguageEN";
import { MJ_ZH } from "./MJLanguageZH";

export class MJLanguage implements Language.DataSourceDelegate{
    name = Macro.BUNDLE_RESOURCES;
    data( language : string , source : any): Language.Data {

        let data : any = source;
        if( data[`${this.name}`] && data[`${this.name}`].language == language ){
            return source;
        }
        let lan = LanguageZH;
        // if (language == LanguageEN.language) {
        //     lan = LanguageEN;
        // }
        data[`${this.name}`] = {};
        data[`${this.name}`] = lan.data;
        data[`${this.name}`].language = lan.language;
        //默认中文
        return source;
    }
}