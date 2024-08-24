import type { NexusInterfaceTypeDef } from './interfaceType';
import type { NexusObjectTypeDef } from './objectType';
/** Symbol marking an object as something that can provide Nexus schema definitions */
export declare const NEXUS_TYPE: unique symbol;
export declare const NEXUS_BUILD: unique symbol;
declare type OutType = NexusObjectTypeDef<any> | NexusInterfaceTypeDef<any>;
/** Object representing a single output or interface type */
export declare type NexusMetaTypeProp = {
    [NEXUS_TYPE]: OutType;
};
export declare type NexusMetaTypeFn = {
    [NEXUS_TYPE]: () => OutType;
};
export declare type NexusMetaType = NexusMetaTypeProp | NexusMetaTypeFn;
/** Object containing a symbol defining a function that should be fed into the Nexus type construction layer */
export declare type NexusMetaBuild = {
    [NEXUS_BUILD]: () => any;
};
export declare type NexusMeta = NexusMetaType | NexusMetaBuild;
export declare function isNexusMetaBuild(obj: any): obj is NexusMetaBuild;
export declare function isNexusMetaType(obj: any): obj is NexusMetaType;
export declare function isNexusMetaTypeProp(obj: any): obj is NexusMetaTypeProp;
export declare function isNexusMetaTypeFn(obj: any): obj is NexusMetaTypeFn;
export declare function isNexusMeta(obj: any): obj is NexusMetaBuild | NexusMetaTypeFn | NexusMetaType;
/**
 * Evaluates the thunk, replacing it with the type
 *
 * @param obj
 */
export declare function resolveNexusMetaType(obj: NexusMetaType): OutType;
export {};
