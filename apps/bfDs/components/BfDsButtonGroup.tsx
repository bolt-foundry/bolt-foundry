import * as React from "react";
import type {
  BfDsButton,
  ButtonType,
} from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
const styles: Record<string, React.CSSProperties> = {
  buttonGroup: {
    display: "flex",
    flexDirection: "row",
  },
};
type Props = {
  buttons: Array<React.ReactElement<ButtonType>>;
};

export function BfDsButtonGroup(
  { buttons }: Props,
): React.ReactElement<typeof BfDsButton> {
  return (
    <div style={styles.buttonGroup}>
      {buttons.map((button, index) => {
        let borderRadius: "0" | "6px 0 0 6px" | "0 6px 6px 0" = "0";
        if (index === 0) { // first button
          borderRadius = "6px 0 0 6px";
        } else if (index === buttons.length - 1) { // last button
          borderRadius = "0 6px 6px 0";
        }
        return React.cloneElement(button, {
          key: index,
          xstyle: { borderRadius, flex: "auto" },
        });
      })}
    </div>
  );
}
