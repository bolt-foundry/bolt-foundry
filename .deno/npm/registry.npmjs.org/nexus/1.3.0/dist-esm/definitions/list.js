import { isType } from 'graphql';
import { isNexusMeta } from './nexusMeta';
import { isNexusStruct } from './wrapping';
import { NexusTypes, withNexusSymbol } from './_types';
export class NexusListDef {
    constructor(ofNexusType) {
        this.ofNexusType = ofNexusType;
        // @ts-ignore
        // Required field for TS to differentiate NonNull from Null from List
        this._isNexusListDef = true;
        /* istanbul ignore if */
        if (typeof ofNexusType !== 'string' &&
            !isNexusStruct(ofNexusType) &&
            !isNexusMeta(ofNexusType) &&
            !isType(ofNexusType)) {
            throw new Error('Cannot wrap unknown types in list(). Saw ' + ofNexusType);
        }
    }
}
withNexusSymbol(NexusListDef, NexusTypes.List);
export function list(type) {
    return new NexusListDef(type);
}
//# sourceMappingURL=list.js.map