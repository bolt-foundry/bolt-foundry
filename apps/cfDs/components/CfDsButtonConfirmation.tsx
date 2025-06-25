import * as React from "react";
import {
  type ButtonSizeType,
  CfDsButton,
} from "@bfmono/apps/cfDs/components/CfDsButton.tsx";
import {
  CfDsIcon,
  type CfDsIconType,
  type IconSizeType,
} from "@bfmono/apps/cfDs/components/CfDsIcon.tsx";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

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
  icon: CfDsIconType;
  iconSelected?: CfDsIconType;
  onConfirm: () => void;
  // onCancel?: () => void;
  showSpinner?: boolean;
  size?: ButtonSizeType;
  testId?: string; // for identifying the element in posthog
};

export function CfDsButtonConfirmation({
  icon,
  iconSelected = icon,
  onConfirm,
  // onCancel,
  showSpinner = false,
  size = "large",
  testId,
}: Props) {
  const [showConfirmation, setShowConfirmation] = React.useState(false);

  const handleConfirm = () => {
    setShowConfirmation(false);
    onConfirm();
  };

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
      <CfDsButton
        iconLeft={icon}
        kind="alert"
        onClick={() => setShowConfirmation(true)}
        size={size}
        testId={testId}
      />
      {showConfirmation && (
        <div style={styles.confirmation}>
          <CfDsButton
            iconLeft="back"
            kind="success"
            onClick={() => setShowConfirmation(false)}
            size={size}
            testId={`${testId}-cancel`}
          />
          <CfDsButton
            iconLeft="check"
            kind="alert"
            onClick={handleConfirm}
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
            <CfDsIcon
              name={iconSelected}
              color="var(--outlineDark)"
              size={iconSize}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function Example() {
  return (
    <CfDsButtonConfirmation
      icon="trash"
      onConfirm={() => logger.info("deleted")}
    />
  );
}
