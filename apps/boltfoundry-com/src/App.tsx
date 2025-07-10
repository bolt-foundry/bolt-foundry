import { Router, Routes } from "./Router.tsx";
import { Home } from "./components/Home.tsx";
import { UIDemo } from "./components/UIDemo.tsx";

function App({ initialPath }: { initialPath?: string }) {
  const routes = [
    { path: "/", component: Home },
    { path: "/ui", component: UIDemo },
  ];

  return (
    <div className="app">
      <Router initialPath={initialPath}>
        <Routes routes={routes} />
      </Router>
    </div>
  );
}

export default App;
