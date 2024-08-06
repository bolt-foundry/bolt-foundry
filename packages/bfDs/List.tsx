import { React } from "deps.ts";
import { classnames } from "lib/classnames.ts";
import { Icon } from "packages/bfDs/Icon.tsx";

type Props = {
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  header?: string;
  separator?: boolean;
};

export function List(
  { children, collapsible, defaultCollapsed, header, separator }:
    React.PropsWithChildren<Props>,
) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed ?? false);

  const listClasses = classnames([
    "list",
    { separator },
  ]);

  const expandClasses = classnames([
    "list-expandIcon",
    { collapsed },
  ]);

  const showContent = collapsible ? !collapsed : true;

  return (
    <div className={listClasses}>
      {header && (
        <div className="list-header">
          <div className="list-header-title">{header}</div>
          {collapsible && (
            <div
              className="list-header-toggle"
              onClick={() => setCollapsed(!collapsed)}
            >
              <div className={expandClasses}>
                <Icon name="arrowDown" />
              </div>
            </div>
          )}
        </div>
      )}
      {showContent && children}
    </div>
  );
}
