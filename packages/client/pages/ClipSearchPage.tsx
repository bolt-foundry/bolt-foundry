import { React } from "deps.ts";
import { Sidebar } from "packages/client/components/clipsearch/Sidebar.tsx";
import { Search } from "packages/client/components/clipsearch/Search.tsx";
import { ClipsView } from "packages/client/components/clipsearch/ClipsView.tsx";

export function ClipSearchPage() {
  return (
    <div className="cs-page flexRow">
      <Sidebar />
      <div className="cs-main">
        <Search />
        <ClipsView />
      </div>
    </div>
  );
}
