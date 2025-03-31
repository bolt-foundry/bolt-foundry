import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { BfDsList } from "apps/bfDs/components/BfDsList.tsx";
import { BfDsListItem } from "apps/bfDs/components/BfDsListItem.tsx";
import { getLogger } from "packages/logger/logger.ts";
const logger = getLogger(import.meta);

export const HistorySidebar = iso(`
  field BfOrganization.HistorySidebar @component {
    __typename
  }
`)(
  function HistorySidebar(
    { data },
  ) {
    logger.debug(data.__typename);
    return (
      <div className="flexColumn right-side-bar">
        <div className="sessions-container">
          <BfDsList header="History">
            <BfDsListItem content="Initial suggestion" isHighlighted />
          </BfDsList>
        </div>
      </div>
    );
  },
);
