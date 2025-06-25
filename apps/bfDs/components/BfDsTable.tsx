import { BfDsTableCell } from "@bfmono/apps/bfDs/components/BfDsTableCell.tsx";

// Utility function to create unique keys for React elements
const createKey = (key: unknown, index: unknown) => `${key}-${index}`;

type Data = string | number | undefined;
type RowData = Record<string, Data> | Data;
export type BfDsColumns<T = RowData> = Array<BfDsColumn<T>>;
export type BfDsColumn<T = RowData> = {
  title?: string;
  width?: string;
  align?: "left" | "center" | "right";
  renderer?: (data: T) => React.ReactElement;
};

type Props<T = RowData> = {
  columns: Array<BfDsColumn<T>>;
  data: Array<T>;
};

export function BfDsTable<T = RowData>({ columns, data }: Props<T>) {
  const columnWidths = columns.reduce((string, column) => {
    const width = column.width ?? "auto";
    return string + `${width} `;
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
                style={{ textAlign: column.align ?? "left" }}
              >
                {column.renderer
                  ? column.renderer(row)
                  : <BfDsTableCell align={column.align} text={row as Data} />}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// an example of using a table

type ExampleData = {
  name: string;
  age: number;
  email: string;
};
export function Example() {
  const columns: BfDsColumns<ExampleData> = [{
    title: "Name",
    width: "1fr",
    renderer: (data) => <BfDsTableCell text={data.name} />,
  }, {
    title: "Age",
    width: "0.5fr",
    align: "center",
    renderer: (data) => <BfDsTableCell align="center" text={data.age} />,
  }, {
    title: "Email",
    width: "2fr",
    renderer: (data) => <BfDsTableCell text={data.email} />,
  }];
  const data = [
    { name: "John Doe", age: 28, email: "john.doe@example.com" },
    { name: "Jane Smith", age: 34, email: "jane.smith@example.com" },
    { name: "Sam Johnson", age: 45, email: "sam.johnson@example.com" },
  ];

  return <BfDsTable columns={columns} data={data} />;
}
