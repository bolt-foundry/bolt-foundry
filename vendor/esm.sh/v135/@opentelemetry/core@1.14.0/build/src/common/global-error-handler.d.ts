import { Exception } from 'https://esm.sh/v135/@opentelemetry/api@1.4.1/build/src/index.d.ts';
import { ErrorHandler } from './types.d.ts';
/**
 * Set the global error handler
 * @param {ErrorHandler} handler
 */
export declare function setGlobalErrorHandler(handler: ErrorHandler): void;
/**
 * Return the global error handler
 * @param {Exception} ex
 */
export declare function globalErrorHandler(ex: Exception): void;
//# sourceMappingURL=global-error-handler.d.ts.map
