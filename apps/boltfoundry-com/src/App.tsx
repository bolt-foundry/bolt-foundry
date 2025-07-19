import {
  AppEnvironmentProvider,
  type ServerProps,
} from "../contexts/AppEnvironmentContext.tsx";
import { AppRoot } from "../AppRoot.tsx";

function App(props: Partial<ServerProps>) {
  return (
    <div className="app">
      <AppEnvironmentProvider
        IS_SERVER_RENDERING={false}
        {...props}
      >
        <AppRoot />
      </AppEnvironmentProvider>
    </div>
  );
}

export default App;
