import * as React from "react";
import { BfDsColumns, BfDsTable } from "packages/bfDs/BfDsTable.tsx";
import { BfDsTableCell } from "packages/bfDs/BfDsTableCell.tsx";

type Data = {
  name: string;
  email: string;
};
const data = [{
  name: "John Doe",
  email: "rdlnk@example.com",
}];
const columns: BfDsColumns<Data> = [
  {
    title: "User",
    width: "2fr",
    renderer: (data) => <BfDsTableCell text={data.name} />,
  },
  {
    title: "Email",
    width: "2fr",
    renderer: (data) => <BfDsTableCell text={data.email} />,
  },
];

export function UserList() {
  return (
    <>
      <div className="cs-page-section-title">
        User List
      </div>
      Invite Co-workers to collaborate....
      <div
        className="cs-page-section"
        style={{ boxShadow: "none" }}
      >
        <BfDsTable columns={columns} data={data} />
      </div>
    </>
  );
}
