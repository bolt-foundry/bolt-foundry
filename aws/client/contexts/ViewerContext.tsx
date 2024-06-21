// ViewerContext.tsx
import { React } from "aws/client/deps.ts";
const { createContext, useContext, useState } = React;

interface ViewerContextValue {
  viewer: null;
  setViewer: (session: null) => void;
}

const ViewerContext = createContext<ViewerContextValue>({
  viewer: null,
  setViewer: () => { },
});

type ViewerProviderProps = React.PropsWithChildren;

export const ViewerProvider = ({ children }: ViewerProviderProps) => {
  const [viewer, setViewer] = useState<null>(null);

  return (
    <ViewerContext.Provider value={{ viewer, setViewer }}>
      {children}
    </ViewerContext.Provider>
  );
};

export const useViewer = () => {
  const context = useContext(ViewerContext);
  if (!context) {
    throw new Error("useViewer must be used within a ViewerProvider");
  }
  return context;
};
