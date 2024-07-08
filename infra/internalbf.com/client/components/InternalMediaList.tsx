import { React } from "deps.ts";
import { Progress } from "packages/bfDs/Progress.tsx";
import { Button } from "packages/bfDs/Button.tsx";
import { Table } from "packages/bfDs/Table.tsx";
import { TableCell } from "packages/bfDs/TableCell.tsx";
const { useState, useEffect } = React;
const columns = [
  { title: "Title", accessor: "title", width: "2fr" },
  { title: "Organization", accessor: "organization", width: "1fr" },
  { title: "Files", accessor: "files", width: "80px", align: "center" },
  { title: "Project", accessor: "project", width: "80px", align: "center" },
  { width: "60px" },
];
const fakeData = [
  { title: "Movie 1", organization: "Company A", progress: 65 },
  { title: "Movie 2", organization: "Company B", progress: 0.0 },
  { title: "Movie 3", organization: "Company C", progress: 100 },
  { title: "Movie 4", organization: "Company D" },
];
const data = [];
fakeData.map((item) => {
  data.push([
    <TableCell text={item.title} progress={item.progress} />,
    <TableCell text={item.organization} />,
    <TableCell
      align="center"
      element={<Button kind="overlay" iconLeft="download" />}
    />,
    <TableCell
      align="center"
      element={<Button kind="overlay" iconLeft="plus" />}
    />,
    <TableCell align="center" text="•••" />,
  ]);
});

export function InternalMediaList() {
  return <Table columns={columns} data={data} />;
}
