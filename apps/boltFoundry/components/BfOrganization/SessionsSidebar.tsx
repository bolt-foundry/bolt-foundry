import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { BfDsList } from "apps/bfDs/components/BfDsList.tsx";
import { BfDsListItem } from "apps/bfDs/components/BfDsListItem.tsx";
import { getLogger } from "packages/logger/logger.ts";
const logger = getLogger(import.meta);

export const SessionsSidebar = iso(`
  field BfOrganization.SessionsSidebar @component {
    __typename
  }
`)(
  function SessionsSidebar(
    { data },
  ) {
    logger.debug(data.__typename);
    return (
      <div className="flexColumn right-side-bar">
        <div className="sessions-container">
          <BfDsList header="Sessions">
            <BfDsListItem content="Tweet 2/12/2025 2" onClick={() => null} />
            <BfDsListItem content="Tweet 2/12/2025" onClick={() => null} />
            <BfDsListItem content="Tweet 2/10/2025" onClick={() => null} />
          </BfDsList>
        </div>
      </div>
    );
  },
);
