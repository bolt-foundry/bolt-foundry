import * as React from "react";
import {
  BfDsButton,
  type ButtonSizeType,
} from "apps/bfDs/components/BfDsButton.tsx";
import {
  BfDsIcon,
  type BfDsIconType,
  type IconSizeType,
} from "apps/bfDs/components/BfDsIcon.tsx";
import { getLogger } from "packages/logger/logger.ts";

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
  icon: BfDsIconType;
  iconSelected?: BfDsIconType;
  onConfirm: () => void;
  // onCancel?: () => void;
  showSpinner?: boolean;
  size?: ButtonSizeType;
  testId?: string; // for identifying the element in posthog
  text?: string; // Button text
};

export function BfDsButtonConfirmation({
  icon = "trash",
  iconSelected = icon,
  onConfirm,
  // onCancel,
  showSpinner = false,
  size = "large",
  testId,
  text,
  children,
  ..._otherProps
}:
  & Props
  & { children?: React.ReactNode }
  & React.HTMLAttributes<HTMLDivElement>) {
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
    <div
      className="confirmationBase"
      style={styles.confirmationBase}
      data-testid="confirmation-container"
      data-confirmation-visible={showConfirmation ? "true" : "false"}
    >
      <BfDsButton
        iconLeft={icon}
        text={text || (typeof children === "string" ? children : undefined)}
        kind="alert"
        onClick={() => setShowConfirmation(true)}
        size={size}
        testId={testId}
        data-testid="confirmation-trigger"
        data-size={size}
      >
        {typeof children !== "string" ? children : null}
      </BfDsButton>
      {showConfirmation && (
        <div style={styles.confirmation}>
          <BfDsButton
            iconLeft="back"
            text="Cancel"
            kind="success"
            onClick={() => setShowConfirmation(false)}
            size={size}
            testId={`${testId}-cancel`}
            data-testid="cancel-button"
          />
          <BfDsButton
            iconLeft="check"
            text="Confirm"
            kind="alert"
            onClick={handleConfirm}
            showSpinner={showSpinner}
            size={size}
            testId={`${testId}-confirm`}
            data-testid="confirm-button"
          />
          <div
            style={{
              ...styles.selectedIcon,
              width: iconSizeSelected,
              height: iconSizeSelected,
            }}
            onClick={() => setShowConfirmation(false)}
            data-bf-testid={`${testId}-cancel-icon`}
            data-testid="cancel-icon"
          >
            <BfDsIcon
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
    <BfDsButtonConfirmation
      icon="trash"
      onConfirm={() => logger.info("deleted")}
    />
  );
}
