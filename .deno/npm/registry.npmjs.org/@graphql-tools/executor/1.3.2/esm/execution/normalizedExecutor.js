import { getOperationAST } from 'graphql';
import { ValueOrPromise } from 'value-or-promise';
import { execute, flattenIncrementalResults, subscribe } from './execute.js';
export function normalizedExecutor(args) {
    const operationAST = getOperationAST(args.document, args.operationName);
    if (operationAST == null) {
        throw new Error('Must provide an operation.');
    }
    if (operationAST.operation === 'subscription') {
        return subscribe(args);
    }
    return new ValueOrPromise(() => execute(args))
        .then((result) => {
        if ('initialResult' in result) {
            return flattenIncrementalResults(result);
        }
        return result;
    })
        .resolve();
}
