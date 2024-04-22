import { DefaultContext, Plugin } from 'https://esm.sh/v135/@envelop/types@5.0.0/typings/index.d.ts';
import { SerializableGraphQLErrorLike } from './use-masked-errors.d.ts';
export type ErrorHandler = ({ errors, context, phase, }: {
    errors: readonly Error[] | readonly SerializableGraphQLErrorLike[];
    context: Readonly<DefaultContext>;
    phase: 'parse' | 'validate' | 'context' | 'execution';
}) => void;
export declare const useErrorHandler: <ContextType extends Record<string, any>>(errorHandler: ErrorHandler) => Plugin<ContextType>;
