import {
  BfDsIcon,
  type BfDsIconType,
} from "@bfmono/apps/bfDs/components/BfDsIcon.tsx";
import { classnames } from "@bfmono/lib/classnames.ts";

type Props = {
  kind: "info" | "warning" | "error" | "success";
  header: string;
  body: string;
  action?: React.ReactNode;
};

export function BfDsCallout({ kind, header, body, action }: Props) {
  let iconColor;
  let iconName;
  let calloutClass;
  switch (kind) {
    case "warning":
      iconColor = "var(--primaryColor)";
      iconName = "exclamationTriangle";
      calloutClass = "warning";
      break;
    case "error":
      iconColor = "var(--alert)";
      iconName = "exclamationStop";
      calloutClass = "error";
      break;
    case "success":
      iconColor = "var(--success)";
      iconName = "checkCircle";
      calloutClass = "success";
      break;
    default:
      iconColor = "var(--text)";
      iconName = "exclamationCircle";
      calloutClass = "info";
      break;
  }
  const classes = classnames([
    "callout",
    "flexRow",
    calloutClass,
  ]);
  return (
    <div
      className={classes}
      style={{ gap: 20, alignItems: "center" }}
    >
      <div className="callout-icon">
        <BfDsIcon name={iconName as BfDsIconType} color={iconColor} size={32} />
      </div>
      <div className="flexColumn" style={{ flex: 1 }}>
        <div className="callout-title">
          {header}
        </div>
        <div>
          {body}
        </div>
      </div>
      <div>
        {action}
      </div>
    </div>
  );
}

export function Example() {
  return (
    <div className="ui-group">
      <BfDsCallout kind="info" header="Info" body="Info callout" />
      <BfDsCallout kind="warning" header="Warning" body="Warning callout" />
      <BfDsCallout kind="error" header="Error" body="Error callout" />
      <BfDsCallout kind="success" header="Success" body="Success callout" />
    </div>
  );
}
