import type { React } from "deps.ts";
import { SearchResultItem } from "packages/client/components/clipsearch/SearchResultItem.tsx";
import { BfDsFullPageSpinner } from "packages/bfDs/BfDsSpinner.tsx";
import { isValidJSON } from "packages/lib/jsonUtils.ts";
import { GoogleFilePicker } from "packages/client/components/clipsearch/GoogleFilePicker.tsx";
import { useFragment } from "react-relay";
import { graphql } from "packages/client/deps.ts";
import { useClipSearchState } from "packages/client/contexts/ClipSearchContext.tsx";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { BfDsCallout } from "packages/bfDs/BfDsCallout.tsx";
import { ClipsViewGlimmer } from "packages/client/components/clipsearch/ClipsViewGlimmer.tsx";
import { ClipsViewNullState } from "packages/client/components/clipsearch/ClipsViewNullState.tsx";
import { useRouter } from "packages/client/contexts/RouterContext.tsx";
import { ClipsView_bfSearchResult$key } from "packages/__generated__/ClipsView_bfSearchResult.graphql.ts"; 

type Props = {
  currentViewer$key: unknown;
  bfSearchResult$key: ClipsView_bfSearchResult$key | null;
};

const bfSearchResultFragment = await graphql`
  fragment ClipsView_bfSearchResult on BfSearchResult {
    collectionLength
    query
    status
    searchResultItems(first: 10) {
      count
      edges {
        node {
          id
        }
      }
    }
  }

`;

const currentViewerFragment = await graphql`
  fragment ClipsView_currentViewer on BfCurrentViewer {
  __typename
  }

`;

export function ClipsView({ currentViewer$key, bfSearchResult$key }: Props) {
  if (!bfSearchResult$key) {
    return <ClipsViewNullState />
  }

  const { navigate } = useRouter();

  const { collectionLength, query, status} = useFragment(bfSearchResultFragment, bfSearchResult$key);
  // const { collectionLength, query, searchResultItems: {count}, status } = useFragment(bfSearchResultFragment, bfSearchResult$key);
  
  const count = 137;
  const italicPrompt = (text: string) => {
    return (
      <span style={{ fontStyle: "italic" }}>
        {text}
      </span>
    );
  };
  if (status === "SEARCHING") {
    return (
      <div className="flexColumn" style={{ gap: "20px" }}>
        <div className="cs-page-hero-callout">
          Searching {collectionLength} videos for "{italicPrompt(query)}".
        </div>
        <ClipsViewGlimmer />
      </div>
    );
  }

  

  if (status === "COMPLETE" && count === 0) {
    return (
      <div className="flexColumn" style={{ gap: "20px" }}>
        <div className="cs-page-hero-callout">
          No clips found for "{italicPrompt(query)}".{" "}
        </div>
      </div>
    );
  }

  return (
    <div className="cs-clipsView">
      {/* {data?.googleAuthAccessToken == null &&
        <GoogleAuthSection />} */}
      <div
        className="cs-page-section-outside-header flexRow"
        style={{ alignItems: "center", gap: 8 }}
      >
        <div className="cs-page-section-title" style={{ flex: 1 }}>
          Search results for "{italicPrompt(query)}"
        </div>
        <div>
          {count} clips found in {collectionLength} videos
        </div>
        <div>
          <BfDsButton
            kind="secondary"
            iconLeft="cross"
            onClick={() => navigate("/search")}
            tooltip="Clear search"
          />
        </div>
      </div>
      {/* {data.searchResultItems.edges.map((searchResultItem) => (
        <SearchResultItem
          key={searchResultItem.id}
          searchResultItem$key={searchResultItem}
        />
      ))} */}
    </div>
  );
}
