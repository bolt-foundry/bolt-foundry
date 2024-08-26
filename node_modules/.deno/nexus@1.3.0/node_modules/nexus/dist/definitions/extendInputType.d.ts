import type { GetGen } from '../typegenTypeHelpers';
import type { InputDefinitionBlock } from './definitionBlocks';
export interface NexusExtendInputTypeConfig<TypeName extends string> {
    type: TypeName;
    definition(t: InputDefinitionBlock<TypeName>): void;
}
export declare class NexusExtendInputTypeDef<TypeName extends string> {
    readonly name: TypeName;
    protected config: NexusExtendInputTypeConfig<any> & {
        name: string;
    };
    constructor(name: TypeName, config: NexusExtendInputTypeConfig<any> & {
        name: string;
    });
    get value(): NexusExtendInputTypeConfig<any> & {
        name: string;
    };
}
/**
 * Adds new fields to an existing inputObjectType in the schema. Useful when splitting your schema across
 * several domains.
 *
 * @see https://nexusjs.org/docs/api/extend-type
 */
export declare function extendInputType<TypeName extends GetGen<'inputNames', string>>(config: NexusExtendInputTypeConfig<TypeName>): NexusExtendInputTypeDef<TypeName>;
