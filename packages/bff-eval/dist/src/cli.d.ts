import yargs from "yargs";
export declare const cli: yargs.Argv<yargs.Omit<yargs.Omit<{
    input: unknown;
    deck: unknown;
}, "input"> & {
    input: string;
}, "deck"> & {
    deck: string;
} & {
    model: string;
} & {
    output: string | undefined;
} & {
    verbose: boolean;
}>;
//# sourceMappingURL=cli.d.ts.map