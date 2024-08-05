import { React } from "deps.ts";
import { classnames } from "lib/classnames.ts";

type Props = {
  separator?: boolean;
};

export function List({ children, separator }: React.PropsWithChildren<Props>) {
  const listClasses = classnames([
    "list",
    { separator },
  ]);
  return (
    <div className={listClasses}>
      {children}
    </div>
  );
}
