import { React } from "deps.ts";
import { BfSymbol } from "packages/bfDs/static/BfSymbol.tsx";
import { Table } from "packages/bfDs/Table.tsx";
import { TableCell } from "packages/bfDs/TableCell.tsx";
import { Icon } from "packages/bfDs/Icon.tsx";
import { useRouter } from "infra/internalbf.com/client/contexts/RouterContext.tsx";
const columns = [{ width: "1fr" }, { width: "30px" }, { width: "30px" }];
const fakeData = [
  { title: "Reflecting on being from Idaho", numberOfChanges: 5 },
  { title: "Exploring the mountains of Colorado", numberOfChanges: 3 },
  { title: "Learning to surf in California", numberOfChanges: 0 },
  { title: "A day in the life of a New Yorker", numberOfChanges: 4 },
  { title: "Experiencing the hustle of Tokyo", numberOfChanges: 0 },
  { title: "Street food adventures in Thailand", numberOfChanges: 12 },
];

const data = [];
fakeData.map((item) => {
  if (item.numberOfChanges > 0) {
    data.push([
      <TableCell text={item.title} />,
      <TableCell align="center" text={item.numberOfChanges} />,
      <TableCell
        align="center"
        element={<Icon name="down-arrow" />}
        /* this icon is wrong and needs to open the ClipChangesPage for said clip */
      />,
    ]);
  }
});
export function ChangesPage() {
  const { navigate } = useRouter();
  return (
    <div className="internalPage flexColumn">
      <div className="internalMainHeader">
        <div className="internalLogo">
          <div style={{ height: 32 }}>
            <BfSymbol
              color="var(--backgroundIcon)"
              color2="var(--textSecondary)"
            />
          </div>
          <div>Clips with changes</div>
        </div>
      </div>
      <div className="internalMainContent" style={{ flex: "auto" }}>
        <Table columns={columns} data={data} />
      </div>
      <div className="internalMobileTabs">
        <div className="internalMobileTab" onClick={() => navigate("/qc")}>
          <Icon name="starSolid" />
          QC
        </div>
        <div className="internalMobileTab selected">
          <Icon name="back" color="var(--secondaryColor)" />
          Changes
        </div>
        <div className="internalMobileTab">
          <Icon name="check" />
          Approved
        </div>
        <div className="internalMobileTab">
          <Icon name="cross" />
          Rejected
        </div>
      </div>
    </div>
  );
}
