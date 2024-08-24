import { SerializedConstitutionalPrinciple } from "../../chains/serde.d.ts";
export declare class ConstitutionalPrinciple {
    critiqueRequest: string;
    revisionRequest: string;
    name: string;
    constructor({ critiqueRequest, revisionRequest, name, }: {
        critiqueRequest: string;
        revisionRequest: string;
        name?: string;
    });
    serialize(): SerializedConstitutionalPrinciple;
}
export declare const PRINCIPLES: {
    [key: string]: ConstitutionalPrinciple;
};
