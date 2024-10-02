import * as React from "react";
import { BfDsInput } from "packages/bfDs/BfDsInput.tsx";
import { DropdownSelector } from "packages/bfDs/DropdownSelector.tsx";
import { AiModel } from "packages/client/contexts/ClipSearchContext.tsx";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { FeatureFlag } from "packages/client/components/FeatureFlag.tsx";
import { graphql } from "packages/client/deps.ts";
import { Search_bfCollection$key } from "packages/__generated__/Search_bfCollection.graphql.ts";
import { useFragment, useMutation } from "react-relay";
import { SearchMutation } from "packages/__generated__/SearchMutation.graphql.ts";
import { getLogger } from "deps.ts";
import { useRouter } from "packages/client/contexts/RouterContext.tsx";

const logger = getLogger(import.meta);
const mutation = await graphql`
  mutation SearchMutation($query: String!, $collectionId: ID!) {
    searchCollection(query: $query, collectionId: $collectionId) {
      id
      query
    }
  }
`;

const fragment = await graphql`
  fragment Search_bfCollection on BfCollection {
    id
  }
`;

type Props = {
  bfCollection$key: Search_bfCollection$key;
};

export function Search({ bfCollection$key }: Props) {
  const { navigate } = useRouter();
  const [query, setQuery] = React.useState("");
  const data = useFragment(fragment, bfCollection$key);
  const [commit, isInFlight] = useMutation<SearchMutation>(mutation);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    commit({
      variables: {
        query,
        collectionId: data.id,
      },
      optimisticResponse: {
        searchCollection: {
          id: "",
          query,
        },
      },
      onCompleted: (data) => {
        const { id } = data.searchCollection ?? {};
        logger.info(id);
        navigate(`/search/${id}`);
      },
    });
  }

  return (
    <form onSubmit={onSubmit} className="cs-search">
      <div style={{ flex: 1 }}>
        <BfDsInput
          placeholder="Search"
          value={query}
          showSpinner={isInFlight}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
      </div>
      <BfDsButton type="submit" text="Search" />
    </form>
  );
}
