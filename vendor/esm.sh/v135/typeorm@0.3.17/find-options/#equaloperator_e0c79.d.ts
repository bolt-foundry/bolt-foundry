import { FindOperator } from "./FindOperator.d.ts";
export declare class EqualOperator<T> extends FindOperator<T> {
    readonly "@instanceof": symbol;
    constructor(value: T | FindOperator<T>);
}
