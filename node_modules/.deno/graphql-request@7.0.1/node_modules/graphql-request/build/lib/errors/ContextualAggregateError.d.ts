import { ContextualError } from './ContextualError.js';
import type { Cause } from './types.js';
/**
 * Aggregation Error enhanced with a context object and types members.
 *
 * The library also exports a serializer you can use.
 */
export declare class ContextualAggregateError<$Errors extends Error | ContextualError<string, object, Cause | undefined> = ContextualError<string, object, Cause | undefined>, $Name extends string = `ContextualAggregateError`, $Context extends object = object> extends ContextualError<$Name, $Context> {
    readonly errors: readonly $Errors[];
    name: $Name;
    constructor(message: string, context: $Context, errors: readonly $Errors[]);
}
//# sourceMappingURL=ContextualAggregateError.d.ts.map