import { React } from "deps.ts";
import { Progress } from "packages/bfDs/Progress.tsx";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { BfDsColumn, BfDsTable } from "packages/bfDs/BfDsTable.tsx";
import { BfDsTableCell } from "packages/bfDs/BfDsTableCell.tsx";
const { useState, useEffect } = React;

type DataType = {
  title: string;
  clips: number;
}

const columns: Array<Column<DataType>> = [
  {
    title: "Project Title",
    width: "2fr",
    renderer: (data) => <BfDsTableCell text={data.title} />,
  },
  {
    title: "Number of Clips",
    width: "1fr",
    renderer: (data) => <BfDsTableCell text={data.clips} />,
  },
  {
    title: "Download Media",
    width: "80px",
    align: "center",
    renderer: () => (
      <BfDsTableCell
        align="center"
        element={<BfDsButton kind="overlay" iconLeft="download" />}
      />
    ),
  },
  {
    title: "Project Link",
    width: "80px",
    align: "center",
    renderer: () => (
      <BfDsTableCell
        align="center"
        element={<BfDsButton kind="overlay" text="Open" />}
      />
    ),
  },
  { width: "60px", renderer: () => <BfDsTableCell align="center" text="•••" /> },
];
const fakeData = [
  { title: "Project 1", clips: 12 },
  { title: "Project 2", clips: 5 },
  { title: "Project 3", clips: 30 },
  { title: "Project 4", clips: 0 },
];

export function InternalProjectsList() {
  return <BfDsTable columns={columns} data={fakeData} />;
}
