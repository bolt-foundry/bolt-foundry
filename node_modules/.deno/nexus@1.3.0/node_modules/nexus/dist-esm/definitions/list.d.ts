import { NexusListableTypes } from './wrapping';
export declare class NexusListDef<TypeName extends NexusListableTypes> {
    readonly ofNexusType: TypeName;
    private _isNexusListDef;
    constructor(ofNexusType: TypeName);
}
export declare function list<TypeName extends NexusListableTypes>(type: TypeName): NexusListDef<TypeName>;
