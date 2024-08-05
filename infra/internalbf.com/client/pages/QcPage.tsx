import { React } from "deps.ts";
import { BfSymbol } from "packages/bfDs/static/BfSymbol.tsx";
import { Icon, IconType } from "packages/bfDs/Icon.tsx";
import { classnames } from "lib/classnames.ts";
import { List } from "packages/bfDs/List.tsx";
import { ListItem } from "packages/bfDs/ListItem.tsx";
import { Tooltip } from "packages/bfDs/Tooltip.tsx";
import { ClipChangesPage } from "infra/internalbf.com/client/pages/ClipChangesPage.tsx";
const { useState } = React;

type Comment = {
  timecode: number;
  comment: string;
};
type ClipReview = {
  id: string;
  title: string;
  status: "approved" | "rejected" | "changes" | null;
  comments: Array<Comment>;
  owner: string;
  client: string;
};
const fakeData: Array<ClipReview> = [
  {
    id: "a1b2c3",
    title: "Reflecting on being from Idaho",
    status: null,
    comments: [],
    owner: "george",
    client: "Shock Collar",
  },
  {
    id: "d4e5f6",
    title: "Exploring the mountains of Colorado",
    status: null,
    comments: [],
    owner: "mofe",
    client: "Tiny Cupboard",
  },
  {
    id: "g7h8i9",
    title: "Learning to surf in California",
    status: null,
    comments: [],
    owner: "george",
    client: "Comedy Shows Near Me",
  },
  {
    id: "j1k2l3",
    title: "A day in the life of a New Yorker",
    status: null,
    comments: [],
    owner: "mofe",
    client: "Tiny Cupboard",
  },
  {
    id: "m4n5o6",
    title: "Experiencing the hustle of Tokyo",
    status: null,
    comments: [],
    owner: "george",
    client: "Shock Collar",
  },
  {
    id: "p7q8r9",
    title: "Street food adventures in Thailand",
    status: null,
    comments: [],
    owner: "mofe",
    client: "Tiny Cupboard",
  },
  {
    id: "s1t2u3",
    title: "Discovering the pyramids of Egypt",
    status: null,
    comments: [],
    owner: "george",
    client: "Comedy Shows Near Me",
  },
  {
    id: "v4w5x6",
    title: "A culinary journey through Italy",
    status: null,
    comments: [],
    owner: "mofe",
    client: "Tiny Cupboard",
  },
  {
    id: "y7z8a1",
    title: "Wildlife safari in Kenya",
    status: null,
    comments: [],
    owner: "george",
    client: "Shock Collar",
  },
  {
    id: "b2c3d4",
    title: "Navigating the canals of Venice",
    status: null,
    comments: [],
    owner: "mofe",
    client: "Tiny Cupboard",
  },
  {
    id: "e5f6g7",
    title: "Finding peace in the Tibetan monasteries",
    status: null,
    comments: [],
    owner: "george",
    client: "Comedy Shows Near Me",
  },
  {
    id: "h8i9j1",
    title: "Scuba diving in the Great Barrier Reef",
    status: null,
    comments: [],
    owner: "mofe",
    client: "Tiny Cupboard",
  },
  {
    id: "k2l3m4",
    title: "Exploring the fjords of Norway",
    status: null,
    comments: [],
    owner: "george",
    client: "Shock Collar",
  },

  {
    id: "n5o6p7",
    title: "A Journey into Coding",
    comments: [
      { timecode: 5, comment: "Fix syntax error" },
      { timecode: 10, comment: "Update variable names for clarity" },
      { timecode: 15, comment: "Refactor function to improve performance" },
      { timecode: 20, comment: "Add error handling for edge cases" },
      { timecode: 25, comment: "Update documentation for new features" },
    ],
    status: "changes",
    owner: "mofe",
    client: "Tiny Cupboard",
  },
  {
    id: "q8r9s1",
    title: "The Beauty of Nature",
    comments: [{ timecode: 3, comment: "Improve image resolution" }, {
      timecode: 7,
      comment: "Increase video brightness",
    }, { timecode: 9, comment: "Correct typo in subtitle" }],
    status: "changes",
    owner: "george",
    client: "Comedy Shows Near Me",
  },
  {
    id: "t2u3v4",
    title: "Historic Sites of Europe",
    comments: [
      { timecode: 4, comment: "Correct historical dates" },
      { timecode: 8, comment: "Verify architectural accuracy" },
      { timecode: 13, comment: "Adjust lighting levels" },
      { timecode: 21, comment: "Add background music" },
    ],
    status: "changes",
    owner: "mofe",
    client: "Tiny Cupboard",
  },
  {
    id: "w5x6y7",
    title: "Adventures in Space",
    comments: [
      { timecode: 12, comment: "Update scientific data" },
      { timecode: 18, comment: "Correct trajectory formulas" },
      { timecode: 24, comment: "Add missing audio commentary" },
      { timecode: 30, comment: "Adjust color balance" },
      { timecode: 35, comment: "Update mission timeline" },
      { timecode: 42, comment: "Improve graphical overlays" },
      { timecode: 50, comment: "Verify astronaut bios" },
      { timecode: 55, comment: "Update space station specs" },
      { timecode: 60, comment: "Enhance star maps accuracy" },
      { timecode: 65, comment: "Revise orbital data" },
      { timecode: 70, comment: "Correct planetary distances" },
      { timecode: 75, comment: "Review spacewalk procedures" },
    ],
    status: "changes",
    owner: "george",
    client: "Shock Collar",
  },

  {
    id: "z8a1b2",
    title: "Adventures in the Amazon",
    status: "approved",
    comments: [],
    owner: "george",
    client: "Comedy Shows Near Me",
  },
  {
    id: "c3d4e5",
    title: "Tranquil Beaches of Bali",
    status: "approved",
    comments: [],
    owner: "mofe",
    client: "Tiny Cupboard",
  },
  {
    id: "f6g7h8",
    title: "Cultural Festivities of India",
    status: "approved",
    comments: [],
    owner: "george",
    client: "Shock Collar",
  },
  {
    id: "i9j1k2",
    title: "Skiing in the Alps",
    status: "approved",
    comments: [],
    owner: "mofe",
    client: "Tiny Cupboard",
  },

  {
    id: "l3m4n5",
    title: "Challenges of Arctic Exploration",
    status: "rejected",
    comments: [],
    owner: "george",
    client: "Comedy Shows Near Me",
  },
  {
    id: "o6p7q8",
    title: "Hidden Treasures of the Sahara",
    status: "rejected",
    comments: [],
    owner: "mofe",
    client: "Tiny Cupboard",
  },
  {
    id: "r9s1t2",
    title: "Diving into Deep Learning",
    comments: [
      { timecode: 2, comment: "Improve model accuracy" },
      { timecode: 14, comment: "Optimize data preprocessing" },
      { timecode: 27, comment: "Refine hyperparameters" },
    ],
    status: "changes",
    owner: "george",
    client: "Shock Collar",
  },
  {
    id: "u3v4w5",
    title: "Secrets of the Rainforest",
    status: "rejected",
    comments: [],
    owner: "mofe",
    client: "Tiny Cupboard",
  },
];

type Tab = {
  header: string;
  icon: IconType;
  label: string;
};
type Tabs = Record<string, Tab>;

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

  const filteredData = fakeData.filter((item) => {
    let showItem = false;
    if (currentTab === "qc") {
      showItem = item.status === null;
    } else {
      showItem = item.status === currentTab;
    }
    if (ownerFilter) {
      showItem = showItem && item.owner === ownerFilter;
    }
    if (clientFilter) {
      showItem = showItem && item.client === clientFilter;
    }
    return showItem;
  });

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
          <Tooltip
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
          </Tooltip>
          <Tooltip
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
          </Tooltip>
        </div>
        <div className="internalMainContent" style={{ flex: "auto" }}>
          <List separator={true}>
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
