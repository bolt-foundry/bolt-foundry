import { React } from "deps.ts";

type Props = {};

export function List({ children }: React.PropsWithChildren<Props>) {
  return (
    <div className="list">
      {children}
    </div>
  );
}
