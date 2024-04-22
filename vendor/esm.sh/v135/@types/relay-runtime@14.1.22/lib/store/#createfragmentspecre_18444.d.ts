import { FragmentMap, FragmentSpecResolver, Props, RelayContext } from "./RelayStoreTypes.d.ts";

export function createFragmentSpecResolver(
    context: RelayContext,
    containerName: string,
    fragments: FragmentMap,
    props: Props,
    callback?: () => void,
): FragmentSpecResolver;
