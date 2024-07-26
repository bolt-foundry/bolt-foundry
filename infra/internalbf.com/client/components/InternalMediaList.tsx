import { React } from "deps.ts";
import { Progress } from "packages/bfDs/Progress.tsx";
import { Button } from "packages/bfDs/Button.tsx";
import { Column, Table } from "packages/bfDs/Table.tsx";
import { TableCell } from "packages/bfDs/TableCell.tsx";
const { useState, useEffect } = React;

type DataType = {
  title: string;
  organization: string;
};

const columns: Array<Column<DataType>> = [
  {
    title: "Title",
    width: "2fr",
    renderer: (data) => <TableCell text={data.title} />,
  },
  {
    title: "Organization",
    width: "1fr",
    renderer: (data) => <TableCell text={data.organization} />,
  },
  {
    title: "Files",
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
    title: "Project",
    width: "80px",
    align: "center",
    renderer: () => (
      <TableCell
        align="center"
        element={<Button kind="overlay" iconLeft="plus" />}
      />
    ),
  },
  { width: "60px", renderer: () => <TableCell align="center" text="•••" /> },
];
const fakeData = [
  { title: "Movie 1", organization: "Company A", progress: 65 },
  { title: "Movie 2", organization: "Company B", progress: 0.0 },
  { title: "Movie 3", organization: "Company C", progress: 100 },
  { title: "Movie 4", organization: "Company D" },
];

export function InternalMediaList() {
  return <Table columns={columns} data={fakeData} />;
}
