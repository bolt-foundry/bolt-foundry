import { usePaginationFragment } from "react-relay";
import type { SettingsPageQuery$data } from "packages/__generated__/SettingsPageQuery.graphql.ts";
import { type BfDsColumns, BfDsTable } from "packages/bfDs/BfDsTable.tsx";
import { BfDsTableCell } from "packages/bfDs/BfDsTableCell.tsx";
import { graphql } from "packages/client/deps.ts";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { WatchFolderListMenu } from "packages/client/components/settings/WatchFolderListMenu.tsx";
import type { ClipSearchPageQuery$data } from "packages/__generated__/ClipSearchPageQuery.graphql.ts";

const fragment = await graphql`
  fragment WatchFolderList_bfOrganization on BfOrganization
  @refetchable(queryName: "WatchFolderListPaginationQuery")
  @argumentDefinitions(
    after: { type: "String" }
    first: { type: "Int", defaultValue: 5 }
  ) {
    collections(first: $first, after: $after) @connection(key: "WatchFolderList_collections") {
      count
      edges {
        node {
          name
          id
          watchedFolders(first: 10) {
            count
            edges {
              node {
                __typename
                name
                id
              }
            }
          }
          media(first: 10) {
            __typename
            count
            edges {
              node {
                name
              }
            }
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`;

type Props = {
  settings$key: SettingsPageQuery$data | ClipSearchPageQuery$data | null;
};

type Data = {
  id: string;
  folder: string;
  videos: number;
  active: boolean;
  status: string;
};

export function WatchFolderList({ settings$key }: Props) {
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment(
    fragment,
    settings$key,
  );
  const collection = data?.collections?.edges?.[0]?.node;
  const watchedFolders = collection?.watchedFolders?.edges?.map((edge) =>
    edge?.node
  );

  const tableData = watchedFolders?.map((folder) => {
    if (!folder) {
      return null;
    }
    return {
      id: folder?.id,
      folder: folder.name ?? collection?.name ?? "Untitled",
      videos: collection?.media?.count ?? 0,
      active: false,
      status: "INGESTING",
    };
  }).filter(Boolean) ?? [];

  const columns: BfDsColumns<Data> = [
    {
      title: "Folder name",
      width: "2fr",
      renderer: (data) => <BfDsTableCell text={data.folder} />,
    },
    {
      title: "Videos",
      width: "2fr",
      renderer: (data) => <BfDsTableCell text={data.videos} />,
    },
    {
      width: "0.5fr",
      renderer: (data) => <WatchFolderListMenu resourceId={data.id} />,
    },
  ];

  return (
    <div>
      {watchedFolders?.length === 0 &&
        (
          <div className="cs-page-section">
            Authenticate with Google, then choose a folder.
          </div>
        )}
      <div className="cs-page-section">
        <BfDsTable columns={columns} data={tableData} />
        <BfDsButton
          disabled={!hasNext}
          kind="outline"
          text={isLoadingNext ? "Loading..." : "Load more"}
          onClick={() => loadNext(10)}
          size="medium"
        />
      </div>
    </div>
  );
}
