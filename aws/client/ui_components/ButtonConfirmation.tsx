import { React } from "aws/client/deps.ts";
import Button, { ButtonSizeType } from "aws/client/ui_components/Button.tsx";
import Icon, {
  IconSizeType,
  IconType,
} from "aws/client/ui_components/Icon.tsx";

const styles: Record<string, React.CSSProperties> = {
  confirmation: {
    position: "absolute",
    backgroundColor: "var(--backgroundIcon)",
    borderRadius: 20,
    display: "flex",
    flexDirection: "row",
    right: 0,
    top: 0,
    zIndex: 1,
  },
  confirmationBase: {
    position: "relative",
  },
  selectedIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

type Props = {
  icon: IconType;
  iconSelected?: IconType;
  onConfirm: () => void;
  onCancel?: () => void;
  showSpinner?: boolean;
  size?: ButtonSizeType;
  testId?: string; // for identifying the element in posthog
};

export default function ButtonConfirmation({
  icon,
  iconSelected = icon,
  onConfirm,
  onCancel,
  showSpinner = false,
  size = "large",
  testId,
}: Props) {
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  let iconSize: IconSizeType;
  let iconSizeSelected;
  switch (size) {
    case "xlarge":
      iconSize = 32;
      iconSizeSelected = 64;
      break;
    case "large":
    default:
      iconSize = 16;
      iconSizeSelected = 40;
      break;
    case "medium":
      iconSize = 12;
      iconSizeSelected = 30;
      break;
    case "small":
      iconSize = 10;
      iconSizeSelected = 22;
      break;
  }
  return (
    <div className="confirmationBase" style={styles.confirmationBase}>
      <Button
        iconLeft={icon}
        kind="alert"
        onClick={() => setShowConfirmation(true)}
        size={size}
        testId={testId}
      />
      {showConfirmation && (
        <div style={styles.confirmation}>
          <Button
            iconLeft="back"
            kind="success"
            onClick={() => setShowConfirmation(false)}
            size={size}
            testId={`${testId}-cancel`}
          />
          <Button
            iconLeft="check"
            kind="alert"
            onClick={onConfirm}
            showSpinner={showSpinner}
            size={size}
            testId={`${testId}-confirm`}
          />
          <div
            style={{
              ...styles.selectedIcon,
              width: iconSizeSelected,
              height: iconSizeSelected,
            }}
            onClick={() => setShowConfirmation(false)}
            data-bf-testid={`${testId}-cancel-icon`}
          >
            <Icon
              name={iconSelected}
              color={"var(--overlayDark)"}
              size={iconSize}
            />
          </div>
        </div>
      )}
    </div>
  );
}
