import { Data } from "../../framework/data/Data"
import { Macro } from "../../framework/defines/Macros"

export class Global extends Data{
    static bundle = Macro.BUNDLE_RESOURCES;
    where : string  = Macro.UNKNOWN;
    prevWhere : string = Macro.UNKNOWN;
}