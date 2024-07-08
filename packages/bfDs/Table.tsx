import { React } from "deps.ts";
import { TableCell } from "packages/bfDs/TableCell.tsx";
const { useState, useEffect } = React;

// Utility function to create unique keys for React elements
const createKey = (key, index) => `${key}-${index}`;

type Props = {
  columns: Array<unknown>,
  data: Array<unknown>,
}

export function Table({ columns, data }: Props) {
  const columnWidths = columns.reduce((string, column) => {
    const width = column.width ?? "auto";
    return string + `${column.width} `;
  }, "");

  return (
    <div className="grid-table">
      <div
        className="grid-header"
        style={{ gridTemplateColumns: columnWidths }}
      >
        {columns.map((column, index) => (
          <div
            key={createKey(column.title, index)}
            className="grid-cell header-cell"
            style={{ textAlign: column.align ?? "left" }}
          >
            {column.title}
          </div>
        ))}
      </div>
      <div className="grid-body">
        {data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="grid-row"
            style={{ gridTemplateColumns: columnWidths }}
          >
            {columns.map((column, colIndex) => (
              <div
                key={createKey(rowIndex, colIndex)}
                className="grid-cell"
              >
                {row[colIndex]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Example usage of the DynamicTable component
const Example = () => {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch or define your dynamic columns
    const fetchedColumns = [
      { title: "Name", accessor: "name" },
      { title: "Age", accessor: "age" },
      { title: "Email", accessor: "email" },
    ];
    setColumns(fetchedColumns);

    // Fetch or define your data
    const fetchedData = [
      [
        <TableCell text="John Doe" />,
        <TableCell text="30" />,
        <TableCell text="john.doe@example.com" />,
      ],
      [
        <TableCell text="Jane Smith" />,
        <TableCell text="25" />,
        <TableCell text="jane.smith@example.com" />,
      ],
    ];
    setData(fetchedData);
  }, []);

  return (
    <div>
      <h1>Dynamic Table Example</h1>
      <Table columns={columns} data={data} />
    </div>
  );
};
