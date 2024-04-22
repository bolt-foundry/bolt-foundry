import { ExecutionResult, Plugin, TypedExecutionArgs } from 'https://esm.sh/v135/@envelop/types@5.0.0/typings/index.d.ts';
export type FormatterFunction = (result: ExecutionResult<any, any>, args: TypedExecutionArgs<any>) => false | ExecutionResult<any, any>;
export declare const usePayloadFormatter: (formatter: FormatterFunction) => Plugin;
