import { React } from "deps.ts";
import { BfSymbol } from "packages/bfDs/static/BfSymbol.tsx";
import { Column, Table } from "packages/bfDs/Table.tsx";
import { TableCell } from "packages/bfDs/TableCell.tsx";
import { Icon } from "packages/bfDs/Icon.tsx";
import { useRouter } from "infra/internalbf.com/client/contexts/RouterContext.tsx";

type DataType = {
  title: string;
  numberOfChanges: number;
};

const columns: Array<Column<DataType>> = [
  { width: "1fr", renderer: (data) => <TableCell text={data.title} /> },
  {
    width: "30px",
    renderer: (data) => <TableCell
      align="center"
      text={data.numberOfChanges}
    />,
  },
  {
    width: "30px",
    renderer: (data) => (
      <TableCell
        align="center"
        element={<Icon name="down-arrow" />}
        /* this icon is wrong and needs to open the ClipChangesPage for said clip */
      />
    ),
  },
];
const fakeData = [
  { title: "Reflecting on being from Idaho", numberOfChanges: 5 },
  { title: "Exploring the mountains of Colorado", numberOfChanges: 3 },
  { title: "Learning to surf in California", numberOfChanges: 0 },
  { title: "A day in the life of a New Yorker", numberOfChanges: 4 },
  { title: "Experiencing the hustle of Tokyo", numberOfChanges: 0 },
  { title: "Street food adventures in Thailand", numberOfChanges: 12 },
];

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
        <Table columns={columns} data={fakeData} />
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
