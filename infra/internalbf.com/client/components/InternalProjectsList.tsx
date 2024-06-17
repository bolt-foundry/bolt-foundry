import { React } from "deps.ts";
import { Progress } from "packages/bfDs/Progress.tsx";
import { Button } from "packages/bfDs/Button.tsx";
import { Table } from "packages/bfDs/Table.tsx";
import { TableCell } from "packages/bfDs/TableCell.tsx";
const { useState, useEffect } = React;
const columns = [
  { title: "Project Title", accessor: "title", width: "2fr" },
  {
    title: "Number of Clips",
    accessor: "clips",
    width: "1fr",
  },
  {
    title: "Download Media",
    accessor: "files",
    width: "80px",
    align: "center",
  },
  {
    title: "Project Link",
    accessor: "project",
    width: "80px",
    align: "center",
  },
  { width: "60px" },
];
const fakeData = [
  { title: "Project 1", clips: 12 },
  { title: "Project 2", clips: 5 },
  { title: "Project 3", clips: 30 },
  { title: "Project 4", clips: 0 },
];
const data = [];
fakeData.map((item) => {
  data.push([
    <TableCell text={item.title} />,
    <TableCell text={item.clips} />,
    <TableCell
      align="center"
      element={<Button kind="overlay" iconLeft="download" />}
    />,
    <TableCell
      align="center"
      element={<Button kind="overlay" text={"Open"} />}
    />,
    <TableCell align="center" text="•••" />,
  ]);
});

export function InternalProjectsList() {
  return <Table columns={columns} data={data} />;
}
