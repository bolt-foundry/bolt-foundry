import type * as React from "react";
import { useEffect, useState } from "react";
import { BfDsIcon, type BfDsIconName } from "./BfDsIcon.tsx";

export type BfDsTabItem = {
  /** Unique identifier for the tab */
  id: string;
  /** Display text for the tab */
  label: string;
  /** Content to show when tab is active */
  content: React.ReactNode;
  /** Optional icon to display in tab */
  icon?: BfDsIconName;
  /** When true, tab cannot be selected */
  disabled?: boolean;
  /** Optional nested subtabs */
  subtabs?: Array<BfDsTabItem>;
};

export type BfDsTabsProps = {
  /** Array of tab items to display */
  tabs: Array<BfDsTabItem>;
  /** Currently active tab ID (controlled) */
  activeTab?: string;
  /** Default active tab ID (uncontrolled) */
  defaultActiveTab?: string;
  /** Callback when tab selection changes */
  onTabChange?: (tabId: string) => void;
  /** Additional CSS classes */
  className?: string;
  /** Visual style variant */
  variant?: "primary" | "secondary";
  /** Size variant for tabs */
  size?: "small" | "medium" | "large";
};

export type BfDsTabsState = {
  activeTab: string;
  activeSubtabs: Record<string, string>; // parentTabId -> activeSubtabId
};

export function BfDsTabs({
  tabs,
  activeTab,
  defaultActiveTab,
  onTabChange,
  className,
  variant = "primary",
  size = "medium",
}: BfDsTabsProps) {
  // Determine if this is controlled or uncontrolled
  const isControlled = activeTab !== undefined;

  // Initialize state
  const [state, setState] = useState<BfDsTabsState>(() => {
    const initialActiveTab = activeTab || defaultActiveTab || tabs[0]?.id || "";
    const activeSubtabs: Record<string, string> = {};

    // Initialize subtab states
    tabs.forEach((tab) => {
      if (tab.subtabs && tab.subtabs.length > 0) {
        activeSubtabs[tab.id] = tab.subtabs[0].id;
      }
    });

    return {
      activeTab: initialActiveTab,
      activeSubtabs,
    };
  });

  // Update state when controlled activeTab changes
  useEffect(() => {
    if (isControlled && activeTab !== undefined) {
      setState((prev) => ({
        ...prev,
        activeTab,
      }));
    }
  }, [activeTab, isControlled]);

  const currentActiveTab = isControlled ? activeTab! : state.activeTab;

  const handleTabClick = (tabId: string) => {
    if (tabs.find((tab) => tab.id === tabId)?.disabled) return;

    if (!isControlled) {
      setState((prev) => ({
        ...prev,
        activeTab: tabId,
      }));
    }

    onTabChange?.(tabId);
  };

  const handleSubtabClick = (parentTabId: string, subtabId: string) => {
    const parentTab = tabs.find((tab) => tab.id === parentTabId);
    const subtab = parentTab?.subtabs?.find((sub) => sub.id === subtabId);
    if (subtab?.disabled) return;

    setState((prev) => ({
      ...prev,
      activeSubtabs: {
        ...prev.activeSubtabs,
        [parentTabId]: subtabId,
      },
    }));
  };

  const renderTab = (
    tab: BfDsTabItem,
    isActive: boolean,
    _index: number,
    _tabIds: Array<string>,
  ) => {
    const classes = [
      "bfds-tab",
      `bfds-tab--${variant}`,
      `bfds-tab--${size}`,
      isActive && "bfds-tab--active",
      tab.disabled && "bfds-tab--disabled",
    ].filter(Boolean).join(" ");

    return (
      <button
        key={tab.id}
        type="button"
        className={classes}
        onClick={() => handleTabClick(tab.id)}
        disabled={tab.disabled}
        role="tab"
        aria-selected={isActive}
        aria-controls={`panel-${tab.id}`}
      >
        {tab.icon && (
          <BfDsIcon
            name={tab.icon}
            size={size === "small"
              ? "small"
              : size === "large"
              ? "large"
              : "medium"}
          />
        )}
        <span>{tab.label}</span>
      </button>
    );
  };

  const renderSubtab = (
    subtab: BfDsTabItem,
    parentTab: BfDsTabItem,
    isActive: boolean,
    _index: number,
    _subtabIds: Array<string>,
  ) => {
    const classes = [
      "bfds-subtab",
      `bfds-subtab--${variant}`,
      `bfds-subtab--${size}`,
      isActive && "bfds-subtab--active",
      subtab.disabled && "bfds-subtab--disabled",
    ].filter(Boolean).join(" ");

    return (
      <button
        key={subtab.id}
        type="button"
        className={classes}
        onClick={() => handleSubtabClick(parentTab.id, subtab.id)}
        disabled={subtab.disabled}
        role="tab"
        aria-selected={isActive}
        aria-controls={`subpanel-${parentTab.id}-${subtab.id}`}
      >
        {subtab.icon && (
          <BfDsIcon
            name={subtab.icon}
            size="small"
          />
        )}
        <span>{subtab.label}</span>
      </button>
    );
  };

  const activeTabData = tabs.find((tab) => tab.id === currentActiveTab);
  const hasSubtabs = activeTabData?.subtabs && activeTabData.subtabs.length > 0;
  const activeSubtabId = hasSubtabs
    ? state.activeSubtabs[currentActiveTab]
    : null;
  const activeSubtabData = hasSubtabs
    ? activeTabData?.subtabs?.find((sub) => sub.id === activeSubtabId)
    : null;

  const tabIds = tabs.map((tab) => tab.id);
  const subtabIds = activeTabData?.subtabs?.map((sub) => sub.id) || [];

  const containerClasses = [
    "bfds-tabs",
    `bfds-tabs--${variant}`,
    `bfds-tabs--${size}`,
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={containerClasses}>
      {/* Main tabs */}
      <div
        className="bfds-tabs__header"
        role="tablist"
        aria-orientation="horizontal"
      >
        {tabs.map((tab, index) =>
          renderTab(tab, tab.id === currentActiveTab, index, tabIds)
        )}
      </div>

      {/* Subtabs */}
      {hasSubtabs && activeTabData?.subtabs && (
        <div
          className="bfds-tabs__subheader"
          role="tablist"
          aria-orientation="horizontal"
        >
          {activeTabData.subtabs.map((subtab, index) =>
            renderSubtab(
              subtab,
              activeTabData,
              subtab.id === activeSubtabId,
              index,
              subtabIds,
            )
          )}
        </div>
      )}

      {/* Content panels */}
      <div className="bfds-tabs__content">
        {/* Main tab content or subtab content */}
        {hasSubtabs && activeSubtabData
          ? (
            <div
              key={`${currentActiveTab}-${activeSubtabId}`}
              id={`subpanel-${currentActiveTab}-${activeSubtabId}`}
              className="bfds-tabs__panel bfds-tabs__subpanel"
              role="tabpanel"
              aria-labelledby={`subtab-${activeSubtabId}`}
            >
              {activeSubtabData.content}
            </div>
          )
          : (
            <div
              key={currentActiveTab}
              id={`panel-${currentActiveTab}`}
              className="bfds-tabs__panel"
              role="tabpanel"
              aria-labelledby={`tab-${currentActiveTab}`}
            >
              {activeTabData?.content}
            </div>
          )}
      </div>
    </div>
  );
}
