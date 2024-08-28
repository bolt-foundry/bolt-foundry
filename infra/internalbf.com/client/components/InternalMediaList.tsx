import { React } from "deps.ts";
import type { Progress } from "packages/bfDs/Progress.tsx";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { type BfDsColumn, BfDsTable } from "packages/bfDs/BfDsTable.tsx";
import { BfDsTableCell } from "packages/bfDs/BfDsTableCell.tsx";
const { useState, useEffect } = React;

type DataType = {
  title: string;
  organization: string;
};

const columns: Array<BfDsColumn<DataType>> = [
  {
    title: "Title",
    width: "2fr",
    renderer: (data) => <BfDsTableCell text={data.title} />,
  },
  {
    title: "Organization",
    width: "1fr",
    renderer: (data) => <BfDsTableCell text={data.organization} />,
  },
  {
    title: "Files",
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
    title: "Project",
    width: "80px",
    align: "center",
    renderer: () => (
      <BfDsTableCell
        align="center"
        element={<BfDsButton kind="overlay" iconLeft="plus" />}
      />
    ),
  },
  {
    width: "60px",
    renderer: () => <BfDsTableCell align="center" text="•••" />,
  },
];
const fakeData = [
  { title: "Movie 1", organization: "Company A", progress: 65 },
  { title: "Movie 2", organization: "Company B", progress: 0.0 },
  { title: "Movie 3", organization: "Company C", progress: 100 },
  { title: "Movie 4", organization: "Company D" },
];

export function InternalMediaList() {
  return <BfDsTable columns={columns} data={fakeData} />;
}
