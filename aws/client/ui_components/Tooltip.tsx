import { React, ReactDOM } from "aws/client/deps.ts";
import Icon, { IconType } from "aws/client/ui_components/Icon.tsx";
import Spinner from "aws/client/components/Spinner.tsx";
import Button from "aws/client/ui_components/Button.tsx";
import FeatureMenu from "aws/client/components/FeatureMenu.tsx";

const { createPortal } = ReactDOM;
const { useEffect, useMemo, useRef, useState } = React;

export type TooltipMenu = {
  button?: React.ReactElement<typeof Button>;
  disabled?: boolean;
  icon?: IconType;
  kind?: string;
  label?: string;
  onClick?: () => void;
  selected?: boolean;
  showSpinner?: boolean;
  xstyle?: React.CSSProperties;
  testId?: string; // used to identify the menu item in posthog
};
export type TooltipPosition = "top" | "bottom" | "left" | "right";
export type TooltipJustification = "center" | "end" | "start";
type Props = {
  text?: string | React.ReactNode;
  menu?: TooltipMenu[] | React.ReactElement<typeof FeatureMenu>;
  position?: TooltipPosition; // default: "top"
  justification?: TooltipJustification; // default: "center"
  delay?: number; // default: 1000
};

const OFFSET = 6; // number of pixels between the tooltip and the element it's attached to

const getStyles = (): Record<string, React.CSSProperties> => ({
  baseTooltip: {
    position: "absolute",
    backgroundColor: "black",
    color: "white",
    padding: "5px 10px",
    borderRadius: 5,
    fontSize: 12,
    textAlign: "center",
    maxWidth: 200,
    width: "max-content",
  },
  baseMenuTooltip: {
    position: "absolute",
    backgroundColor: "var(--menuBackground)",
    color: "var(--text)",
    padding: "5px 0",
    borderRadius: 5,
    fontSize: 12,
    textAlign: "center",
    boxShadow: "rgba(0, 0, 0, 0.25) 0px 4px 12px",
    maxWidth: 200,
    width: "max-content",
    pointerEvents: "all",
  },
  checkPlaceholder: {
    width: 12,
  },
  disabledStyle: {
    opacity: 0.3,
    cursor: "not-allowed",
  },
  menuItem: {
    color: "var(--text)",
    fontSize: 14,
    fontWeight: "normal",
    textAlign: "left",
    padding: "6px 20px 6px 6px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "row",
    gap: 8,
  },
  menuItemHovering: {
    backgroundColor: "var(--menuBackgroundHover)",
  },
  menuItemRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flex: "auto",
    gap: 2,
  },
  menuItemText: {
    flex: "auto",
  },
  separator: {
    height: 1,
    backgroundColor: "var(--border)",
    margin: "4px 0",
  },
  baseArrow: {
    width: 0,
    height: 0,
    position: "absolute",
    color: "black", // using this to set color of arrow
  },
  baseMenuArrow: {
    width: 0,
    height: 0,
    position: "absolute",
    color: "var(--menuBackground)", // using this to set color of arrow
  },
  tooltipContainer: {
    position: "relative",
    display: "inline-block", // This makes it wrap just around its child
  },
});

function createTooltipArrowStyle(
  baseArrowStyle: React.CSSProperties,
  position: string,
  justification: string,
): React.CSSProperties {
  const arrowStyle = { ...baseArrowStyle };
  switch (position) {
    case "bottom":
      arrowStyle.borderBottom = `10px solid ${arrowStyle.color}`;
      arrowStyle.top = `-${OFFSET}px`;
      if (justification === "end") {
        arrowStyle.borderLeft = "16px solid transparent";
        arrowStyle.borderRight = "0px solid transparent";
        arrowStyle.right = "5px";
      } else if (justification === "start") {
        arrowStyle.borderLeft = "0px solid transparent";
        arrowStyle.borderRight = "16px solid transparent";
        arrowStyle.left = "5px";
      } else { // center
        arrowStyle.borderLeft = "8px solid transparent";
        arrowStyle.borderRight = "8px solid transparent";
        arrowStyle.left = "50%";
        arrowStyle.transform = "translateX(-50%)";
      }
      break;
    case "left":
      arrowStyle.borderLeft = `10px solid ${arrowStyle.color}`;
      arrowStyle.right = `-${OFFSET}px`;
      if (justification === "end") {
        arrowStyle.borderTop = "16px solid transparent";
        arrowStyle.borderBottom = "0px solid transparent";
        arrowStyle.bottom = "5px";
      } else if (justification === "start") {
        arrowStyle.borderTop = "0px solid transparent";
        arrowStyle.borderBottom = "16px solid transparent";
        arrowStyle.top = "5px";
      } else { // center
        arrowStyle.borderTop = "8px solid transparent";
        arrowStyle.borderBottom = "8px solid transparent";
        arrowStyle.top = "50%";
        arrowStyle.transform = "translateY(-50%)";
      }
      break;
    case "right":
      arrowStyle.borderRight = `10px solid ${arrowStyle.color}`;
      arrowStyle.left = `-${OFFSET}px`;
      if (justification === "end") {
        arrowStyle.borderTop = "16px solid transparent";
        arrowStyle.borderBottom = "0px solid transparent";
        arrowStyle.bottom = "5px";
      } else if (justification === "start") {
        arrowStyle.borderTop = "0px solid transparent";
        arrowStyle.borderBottom = "16px solid transparent";
        arrowStyle.top = "5px";
      } else { // center
        arrowStyle.borderTop = "8px solid transparent";
        arrowStyle.borderBottom = "8px solid transparent";
        arrowStyle.top = "50%";
        arrowStyle.transform = "translateY(-50%)";
      }
      break;
    default: // top
      arrowStyle.borderLeft = "0px solid transparent";
      arrowStyle.borderRight = "16px solid transparent";
      arrowStyle.borderTop = `10px solid ${arrowStyle.color}`;
      arrowStyle.bottom = `-${OFFSET}px`;
      if (justification === "end") {
        arrowStyle.borderLeft = "16px solid transparent";
        arrowStyle.borderRight = "0px solid transparent";
        arrowStyle.right = "5px";
      } else if (justification === "start") {
        arrowStyle.borderLeft = "0px solid transparent";
        arrowStyle.borderRight = "16px solid transparent";
        arrowStyle.left = "5px";
      } else { // center
        arrowStyle.borderLeft = "8px solid transparent";
        arrowStyle.borderRight = "8px solid transparent";
        arrowStyle.left = "50%";
        arrowStyle.transform = "translateX(-50%)";
      }
  }
  return arrowStyle;
}

function createTooltipStyle(
  baseStyle: React.CSSProperties,
  position: string,
  justification: string,
): React.CSSProperties {
  const tooltipStyle = { ...baseStyle };
  switch (position) {
    case "bottom":
      tooltipStyle.top = `calc(100% + ${OFFSET}px)`;
      if (justification === "end") {
        tooltipStyle.right = OFFSET;
      } else if (justification === "start") {
        tooltipStyle.left = OFFSET;
      } else { // center
        tooltipStyle.left = "50%";
        tooltipStyle.transform = "translateX(-50%)";
      }
      break;
    case "left":
      tooltipStyle.right = `calc(100% + ${OFFSET}px)`;
      if (justification === "end") {
        tooltipStyle.bottom = OFFSET;
      } else if (justification === "start") {
        tooltipStyle.top = OFFSET;
      } else { // center
        tooltipStyle.top = "50%";
        tooltipStyle.transform = "translateY(-50%)";
      }
      break;
    case "right":
      tooltipStyle.left = `calc(100% + ${OFFSET}px)`;
      if (justification === "end") {
        tooltipStyle.bottom = OFFSET;
      } else if (justification === "start") {
        tooltipStyle.top = OFFSET;
      } else { // center
        tooltipStyle.top = "50%";
        tooltipStyle.transform = "translateY(-50%)";
      }
      break;
    default: // top
      tooltipStyle.bottom = `calc(100% + ${OFFSET}px)`;
      if (justification === "end") {
        tooltipStyle.right = OFFSET;
      } else if (justification === "start") {
        tooltipStyle.left = OFFSET;
      } else { // center
        tooltipStyle.left = "50%";
        tooltipStyle.transform = "translateX(-50%)";
      }
  }
  return tooltipStyle;
}

type MenuItemProps = {
  menuItem: TooltipMenu;
  hovering: boolean;
};
function MenuItem({ menuItem, hovering }: MenuItemProps) {
  if (menuItem.button) return menuItem.button;
  const isHoverable = menuItem.onClick != null;
  const styles = useMemo(() => getStyles(), []);
  const disabled = menuItem.disabled ?? false;
  const itemStyle = {
    ...styles.menuItem,
    ...(hovering === true && isHoverable && styles.menuItemHovering),
    ...(disabled === true && styles.disabledStyle),
    ...(menuItem.xstyle ?? {}),
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (disabled || !menuItem.onClick) return;
    menuItem.onClick();
  };

  if (menuItem.kind === "separator") return <div style={styles.separator} />;

  return (
    <div
      className="tooltip-menu-item"
      onClick={handleClick}
      style={itemStyle}
      data-bf-testid={menuItem.testId}
    >
      {menuItem.icon && !menuItem.showSpinner && (
        <div className="tooltip-menu-item-icon">
          <Icon name={menuItem.icon} size={12} />
        </div>
      )}
      {menuItem.showSpinner && (
        <div className="tooltip-menu-item-spinner">
          <Spinner size={12} />
        </div>
      )}
      <div style={styles.menuItemRow}>
        {menuItem.selected
          ? <Icon color={"var(--success)"} name="check" size={12} />
          : <div style={styles.checkPlaceholder} />}
        <div className="tooltip-menu-item-label" style={styles.menuItemText}>
          {menuItem.label}
        </div>
      </div>
    </div>
  );
}

type MenuProps = {
  menu: TooltipMenu[] | React.ReactElement<typeof FeatureMenu> | undefined;
};
function Menu({ menu }: MenuProps) {
  const [hovering, setHovering] = useState<number | null>(null);
  if (!menu) return null;
  if (Array.isArray(menu)) {
    return (
      <div className="tooltip-menu">
        {menu.map((menuItem, i) => (
          <div
            key={i}
            onMouseOver={() => setHovering(i)}
            onMouseLeave={() => setHovering(null)}
          >
            <MenuItem menuItem={menuItem} hovering={hovering === i} />
          </div>
        ))}
      </div>
    );
  }
  return <div className="tooltip-menu">{menu}</div>;
}

export default function Tooltip(
  {
    text,
    menu,
    position = "top",
    justification = "center",
    delay = 1000,
    children,
  }: React.PropsWithChildren<Props>,
) {
  const [shouldShowTooltip, setShouldShowTooltip] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [tooltipSize, setTooltipSize] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  const styles = useMemo(() => getStyles(), []);
  const timeoutRef = useRef<number | undefined>();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // get the size of the tooltip-container and set the size of the tooltip-base
    if (showTooltip || showMenu) {
      const tooltipContainer = tooltipRef.current;
      if (!tooltipContainer) return;
      const { width, height, x, y } = tooltipContainer.getBoundingClientRect();
      setTooltipSize({ width, height, x, y });
    }
  }, [showTooltip, showMenu]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !tooltipRef.current?.contains(e.target as Node) &&
        !menuRef.current?.contains(e.target as Node)
      ) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    if (shouldShowTooltip) {
      if (delay === 0) {
        setShowTooltip(true);
        return;
      }
      timeoutRef.current = setTimeout(() => {
        setShowTooltip(true);
      }, delay);
    } else {
      timeoutRef.current = setTimeout(() => {
        setShowTooltip(false);
      }, 500);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [shouldShowTooltip]);

  const tooltipStyle = menu != null
    ? createTooltipStyle(
      styles.baseTooltip,
      position === "top" ? "bottom" : "top",
      "center",
    )
    : createTooltipStyle(
      styles.baseTooltip,
      position,
      justification,
    );
  const tooltipArrowStyle = menu != null
    ? createTooltipArrowStyle(
      styles.baseArrow,
      position === "top" ? "bottom" : "top",
      "center",
    )
    : createTooltipArrowStyle(
      styles.baseArrow,
      position,
      justification,
    );
  const tooltipMenuStyle = createTooltipStyle(
    styles.baseMenuTooltip,
    position,
    justification,
  );
  const tooltipMenuArrowStyle = createTooltipArrowStyle(
    styles.baseMenuArrow,
    position,
    justification,
  );

  const handleShowMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowMenu(!showMenu);
  };

  return (
    <div
      className="tooltip-container"
      ref={tooltipRef}
      style={styles.tooltipContainer}
      onMouseEnter={() => setShouldShowTooltip(true)}
      onMouseLeave={() => setShouldShowTooltip(false)}
      onClick={menu != null ? handleShowMenu : undefined}
    >
      {children}
      {showTooltip && text != null && createPortal(
        <div
          className="tooltip-base"
          style={{
            position: "absolute",
            width: tooltipSize.width,
            height: tooltipSize.height,
            left: tooltipSize.x,
            top: tooltipSize.y,
          }}
        >
          <div className="tooltip" style={tooltipStyle}>
            <div className="tooltip-text">{text}</div>
            <div
              className="tooltip-arrow"
              style={tooltipArrowStyle}
            />
          </div>
        </div>,
        document.getElementById("tooltip-root") as Element,
      )}
      {showMenu && createPortal(
        <div
          className="tooltip-base"
          style={{
            position: "absolute",
            width: tooltipSize.width,
            height: tooltipSize.height,
            left: tooltipSize.x,
            top: tooltipSize.y,
          }}
        >
          <div
            className="tooltip"
            style={tooltipMenuStyle}
            onMouseEnter={() => setShouldShowTooltip(false)}
            ref={menuRef}
          >
            <Menu menu={menu} />
            <div
              className="tooltip-menu-arrow"
              style={tooltipMenuArrowStyle}
            />
          </div>
        </div>,
        document.getElementById("tooltip-root") as Element,
      )}
    </div>
  );
}
