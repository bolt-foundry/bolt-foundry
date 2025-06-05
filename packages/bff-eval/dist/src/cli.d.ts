import yargs from "yargs";
export declare const cli: yargs.Argv<yargs.Omit<yargs.Omit<{
    input: unknown;
    grader: unknown;
}, "input"> & {
    input: string;
}, "grader"> & {
    grader: string;
} & {
    model: string;
} & {
    output: string | undefined;
} & {
    verbose: boolean;
}>;
//# sourceMappingURL=cli.d.ts.map