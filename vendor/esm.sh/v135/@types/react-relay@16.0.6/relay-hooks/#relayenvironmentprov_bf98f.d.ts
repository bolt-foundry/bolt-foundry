import { ProviderProps, ReactElement, ReactNode } from "https://esm.sh/v128/@types/react@18.2.38/index.d.ts";
import { IEnvironment, RelayContext } from "https://esm.sh/v135/@types/relay-runtime@14.1.22/index.d.ts";

export interface Props {
    children: ReactNode;
    environment: IEnvironment;
}

export function RelayEnvironmentProvider(props: Props): ReactElement<ProviderProps<RelayContext>>;
