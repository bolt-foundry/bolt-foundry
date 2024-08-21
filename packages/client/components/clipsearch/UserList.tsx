import * as React from "react";
import { Table } from "packages/bfDs/Table.tsx";
import { TableCell } from "packages/bfDs/TableCell.tsx";

const data = [{
  name: "John Doe",
  email: "rdlnk@example.com",
}];
const columns = [
  {
    title: "User",
    width: "2fr",
    renderer: (data) => <TableCell text={data.name} />,
  },
  {
    title: "Email",
    width: "2fr",
    renderer: (data) => <TableCell text={data.email} />,
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
        <Table columns={columns} data={data} />
      </div>
    </>
  );
}
