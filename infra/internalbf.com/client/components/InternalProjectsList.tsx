import { React } from "deps.ts";
import { Progress } from "packages/bfDs/Progress.tsx";
import { Button } from "packages/bfDs/Button.tsx";
import { Column, Table } from "packages/bfDs/Table.tsx";
import { TableCell } from "packages/bfDs/TableCell.tsx";
const { useState, useEffect } = React;

type DataType = {
  title: string;
  clips: number;
}

const columns: Array<Column<DataType>> = [
  {
    title: "Project Title",
    width: "2fr",
    renderer: (data) => <TableCell text={data.title} />,
  },
  {
    title: "Number of Clips",
    width: "1fr",
    renderer: (data) => <TableCell text={data.clips} />,
  },
  {
    title: "Download Media",
    width: "80px",
    align: "center",
    renderer: () => (
      <TableCell
        align="center"
        element={<Button kind="overlay" iconLeft="download" />}
      />
    ),
  },
  {
    title: "Project Link",
    width: "80px",
    align: "center",
    renderer: () => (
      <TableCell
        align="center"
        element={<Button kind="overlay" text="Open" />}
      />
    ),
  },
  { width: "60px", renderer: () => <TableCell align="center" text="•••" /> },
];
const fakeData = [
  { title: "Project 1", clips: 12 },
  { title: "Project 2", clips: 5 },
  { title: "Project 3", clips: 30 },
  { title: "Project 4", clips: 0 },
];

export function InternalProjectsList() {
  return <Table columns={columns} data={fakeData} />;
}
