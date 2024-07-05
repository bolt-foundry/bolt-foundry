import { React, ReactRelay } from "deps.ts";
import { BfSymbol } from "packages/bfDs/static/BfSymbol.tsx";
import { Icon, IconType } from "packages/bfDs/Icon.tsx";
import { classnames } from "lib/classnames.ts";
import { List } from "packages/bfDs/List.tsx";
import { ListItem } from "packages/bfDs/ListItem.tsx";
import { Tooltip } from "packages/bfDs/Tooltip.tsx";
import { ClipChangesPage } from "infra/internalbf.com/client/pages/ClipChangesPage.tsx";
import { graphql } from "infra/internalbf.com/client/deps.ts";
const { useState } = React;
const { useLazyLoadQuery } = ReactRelay;

type Tab = {
  header: string;
  icon: IconType;
  label: string;
};
type Tabs = Record<string, Tab>;

const query = await graphql`
  query QcPageQuery($ids: [ID!]!) {
    clipsByOldClipIds(oldClipIds: $ids) {
      id
      title
      owner
      client
      oldClipId
    }
  }
`;

const tabs: Tabs = {
  qc: {
    header: "Clips ready for QC",
    icon: "starSolid",
    label: "QC",
  },
  changes: {
    header: "Clips with changes",
    icon: "back",
    label: "Changes",
  },
  approved: {
    header: "Clips approved",
    icon: "check",
    label: "Approved",
  },
  rejected: {
    header: "Clips rejected",
    icon: "cross",
    label: "Rejected",
  },
};

export function QcPage() {
  const [currentTab, setCurrentTab] = useState("qc");
  const [ownerFilter, setOwnerFilter] = useState<string | null>(null);
  const [clientFilter, setClientFilter] = useState<string | null>(null);
  const [currentClipId, setCurrentClipId] = useState<string | null>(null);
  const stuff = useLazyLoadQuery(query, { "ids": ["old14", "old15", "old5"] });
  console.log("stuff", stuff.clipsByOldClipIds);
  let returnedArrays = stuff.clipsByOldClipIds;

  const filteredData = returnedArrays.filter(
    (item) => {
      // let showItem = false;
      // if (currentTab === "qc") {
      //   showItem = item.status === null;
      // } else {
      //   showItem = item.status === currentTab;
      // }
      // if (ownerFilter) {
      //   showItem = showItem && item.owner === ownerFilter;
      // }
      // if (clientFilter) {
      //   showItem = showItem && item.client === clientFilter;
      // }

      return item;
    },
  );
  // take clipIds and then see if they have reviews, if they have reviews dont display on qc
  // if Clip has review, render on changes page
  //do we need to add status to fakeData?
  console.log("filteredData", filteredData);

  const currentClip = filteredData.find((item) => item.id === currentClipId);

  return (
    <>
      <div className="internalPage flexColumn">
        <div className="internalMainHeader">
          <div className="internalLogo">
            <div style={{ height: 32 }}>
              <BfSymbol
                color="var(--backgroundIcon)"
                color2="var(--textSecondary)"
              />
            </div>
            <div>{tabs[currentTab].header}</div>
          </div>
        </div>
        <div className="internalMainFilters">
          {
            /* <Tooltip
            menu={[
              { label: "All people", onClick: () => setOwnerFilter(null) },
            ].concat(
              Array.from(new Set(fakeData.map((item) => item.owner)))
                .sort()
                .map((owner) => ({
                  label: owner,
                  onClick: () => setOwnerFilter(owner),
                })),
            )}
            position="bottom"
            justification="start"
          >
            <div className="pill">
              {ownerFilter ?? "All people"}
              <Icon name="arrowDown" size={12} />
            </div>
          </Tooltip> */
          }
          {
            /* <Tooltip
            menu={[
              { label: "All clients", onClick: () => setClientFilter(null) },
            ].concat(
              Array.from(new Set(fakeData.map((item) => item.client)))
                .sort()
                .map((client) => ({
                  label: client,
                  onClick: () => setClientFilter(client),
                })),
            )}
            position="bottom"
            justification="start"
          >
            <div className="pill">
              {clientFilter ?? "All clients"}
              <Icon name="arrowDown" size={12} />
            </div>
          </Tooltip> */
          }
        </div>
        <div className="internalMainContent" style={{ flex: "auto" }}>
          <List>
            {console.log("filteredData", filteredData)}
            {filteredData.map((item) => {
              let statusColor = "var(--textLight)";
              switch (item.status) {
                case "changes":
                  statusColor = "var(--primaryColor)";
                  break;
                case "approved":
                  statusColor = "var(--success)";
                  break;
                case "rejected":
                  statusColor = "var(--alert)";
                  break;
                default:
                  break;
              }
              const content = (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      className="statusDot"
                      style={{ backgroundColor: statusColor }}
                    />
                  </div>
                  <div className="ellipsis" style={{ flex: "1" }}>
                    {item.title}
                  </div>
                </div>
              );
              const footer = (
                <div
                  style={{ display: "flex", flexDirection: "row", gap: "8px" }}
                >
                  <div className="pill">{item.owner}</div>
                  <div className="pill">{item.client}</div>
                  {item.comments?.length > 0 && (
                    <div className="pill">
                      <Icon name="comment" size={12} />
                      {item.comments?.length}
                    </div>
                  )}
                </div>
              );
              return (
                <ListItem
                  footer={footer}
                  onClick={() => setCurrentClipId(item.id)}
                  content={content}
                />
              );
            })}
          </List>
        </div>
        <div className="internalMobileTabs">
          {Object.entries(tabs).map(([key, tab]) => {
            const color = key === currentTab
              ? "var(--secondaryColor)"
              : undefined;
            const classes = classnames([
              "internalMobileTab",
              { "selected": key === currentTab },
            ]);
            return (
              <div
                className={classes}
                onClick={() => setCurrentTab(key)}
              >
                <Icon name={tab.icon as IconType} color={color} />
                <div>{tab.label}</div>
              </div>
            );
          })}
        </div>
      </div>
      {currentClipId && currentClip?.status === "changes" &&
        (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: "100%",
            }}
          >
            <ClipChangesPage
              currentClip={currentClip}
              onClose={() => setCurrentClipId(null)}
            />
          </div>
        )}
    </>
  );
}
