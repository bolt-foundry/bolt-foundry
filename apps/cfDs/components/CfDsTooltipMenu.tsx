import * as React from "react";
import { createPortal } from "react-dom";
import {
  CfDsIcon,
  type CfDsIconType,
} from "@bfmono/apps/cfDs/components/CfDsIcon.tsx";
import type { CfDsButton } from "@bfmono/apps/cfDs/components/CfDsButton.tsx";
import { CfDsSpinner } from "@bfmono/apps/cfDs/components/CfDsSpinner.tsx";
import type {
  CfDsTooltipJustification,
  CfDsTooltipPosition,
} from "@bfmono/apps/cfDs/components/CfDsTooltip.tsx";
import {
  createTooltipArrowStyle,
  createTooltipStyle,
  getStyles as getTooltipStyles,
} from "@bfmono/apps/cfDs/lib/tooltips.ts";

const { useEffect, useMemo, useRef, useState } = React;

export type CfDsTooltipMenuType = {
  button?: React.ReactElement<typeof CfDsButton>;
  closeOnClick?: boolean;
  disabled?: boolean;
  icon?: CfDsIconType;
  kind?: string;
  label?: string;
  onClick?: () => void;
  selected?: boolean;
  showSpinner?: boolean;
  xstyle?: React.CSSProperties;
  testId?: string; // used to identify the menu item in posthog
};

type Props = {
  menu: Array<CfDsTooltipMenuType>;
  position?: CfDsTooltipPosition; // default: "top"
  justification?: CfDsTooltipJustification; // default: "center"
  xstyle?: React.CSSProperties;
};

const getStyles = (): Record<string, React.CSSProperties> => ({
  ...getTooltipStyles(),
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
});

type MenuItemProps = {
  menuItem: CfDsTooltipMenuType;
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
  const closeOnClick = menuItem.closeOnClick ?? true;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (closeOnClick === false) {
      e.stopPropagation();
    }
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
          <CfDsIcon name={menuItem.icon} size={12} />
        </div>
      )}
      {menuItem.showSpinner && (
        <div className="tooltip-menu-item-spinner">
          <CfDsSpinner size={12} />
        </div>
      )}
      <div style={styles.menuItemRow}>
        {menuItem.selected
          ? <CfDsIcon color="var(--success)" name="check" size={12} />
          : <div style={styles.checkPlaceholder} />}
        <div className="tooltip-menu-item-label" style={styles.menuItemText}>
          {menuItem.label}
        </div>
      </div>
    </div>
  );
}

function Menu({ menu }: { menu: Array<CfDsTooltipMenuType> }) {
  const [hovering, setHovering] = useState<number | null>(null);

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

export function CfDsTooltipMenu(
  {
    menu,
    position = "top",
    justification = "center",
    children,
    xstyle,
  }: React.PropsWithChildren<Props>,
) {
  const [showMenu, setShowMenu] = useState(false);
  const [tooltipSize, setTooltipSize] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  const styles = useMemo(() => getStyles(), []);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // get the size of the tooltip-container and set the size of the tooltip-base
    if (showMenu) {
      const tooltipContainer = tooltipRef.current;
      if (!tooltipContainer) return;
      const { width, height, x, y } = tooltipContainer.getBoundingClientRect();
      setTooltipSize({ width, height, x, y });
    }
  }, [showMenu]);

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
      style={{ ...styles.tooltipContainer, ...xstyle }}
      onClick={handleShowMenu}
    >
      {children}
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
