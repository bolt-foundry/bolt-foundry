import { ProvidedVariablesType } from "./RelayConcreteNode.d.ts";
import { Variables } from "./RelayRuntimeTypes.d.ts";

interface WithProvidedVariablesFn {
    (
        userSuppliedVariables: Variables,
        providedVariables: ProvidedVariablesType | null | undefined,
    ): Variables;
    tests_only_resetDebugCache: undefined | (() => void);
}
declare const withProvidedVariables: WithProvidedVariablesFn;
export default withProvidedVariables;
