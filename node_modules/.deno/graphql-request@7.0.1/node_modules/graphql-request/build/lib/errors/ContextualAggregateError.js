import { ContextualError } from './ContextualError.js';
/**
 * Aggregation Error enhanced with a context object and types members.
 *
 * The library also exports a serializer you can use.
 */
export class ContextualAggregateError extends ContextualError {
    errors;
    name = `ContextualAggregateError`;
    constructor(message, context, errors) {
        super(message, context, undefined);
        this.errors = errors;
    }
}
//# sourceMappingURL=ContextualAggregateError.js.map