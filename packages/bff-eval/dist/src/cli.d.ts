import yargs from "yargs";
export declare const cli: yargs.Argv<{
    input: string | undefined;
} & {
    grader: string | undefined;
} & {
    demo: string | undefined;
} & {
    model: string;
} & {
    output: string | undefined;
} & {
    verbose: boolean;
}>;
//# sourceMappingURL=cli.d.ts.map