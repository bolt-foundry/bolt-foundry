import { React } from "aws/client/deps.ts";
import Button from "aws/client/ui_components/Button.tsx";

const styles: Record<string, React.CSSProperties> = {
  buttonGroup: {
    display: "flex",
    flexDirection: "row",
  },
};
type Props = {
  buttons: React.ReactElement[];
};

export default function ButtonGroup(
  { buttons }: Props,
): React.ReactElement<typeof Button> {
  return (
    <div style={styles.buttonGroup}>
      {buttons.map((button, index) => {
        let borderRadius = "0";
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
