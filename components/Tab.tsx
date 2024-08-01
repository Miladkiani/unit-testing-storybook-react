import clsx from "clsx";
import { ReactNode, useCallback, useMemo, useRef, useState } from "react";
import "./tab.scss";

interface ITabItem {
  label: string;
  value: string | number;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  content?: ReactNode;
}

interface TabProps<T extends ITabItem> {
  items: T[];
  defaultSelectedTabValue?: T["value"];
  children?: ReactNode | ((activeTab: T["value"]) => ReactNode);
}

export const Tab = <T extends ITabItem>({
  items,
  defaultSelectedTabValue,
  children,
}: TabProps<T>) => {
  const { current: defaultSelectedTab } = useRef(defaultSelectedTabValue);

  const obtainDefaultSelectedTabValue = () => {
    if (defaultSelectedTab == undefined) return items[0].value;

    const isDefaultValueValid = items.some(
      (tab) => tab.value === defaultSelectedTab
    );

    if (isDefaultValueValid) return defaultSelectedTab;
    else return items[0].value;
  };

  const [selectedTab, setSelectedTab] = useState<T["value"]>(
    obtainDefaultSelectedTabValue()
  );

  const isTabSelected = useCallback(
    (tabValue: T["value"]) => selectedTab === tabValue,
    [selectedTab]
  );

  const renderContent = useMemo(() => {
    if (typeof children === "function") return children(selectedTab);
    const selectedItem = items.find((tab) => isTabSelected(tab.value));

    return selectedItem?.content || children;
  }, [items, children, isTabSelected]);

  return (
    <div className="tab-container">
      <div className="tabs" role="tablist">
        {items.map((tab) => {
          return (
            <div
              key={String(tab.value)}
              role="tab"
              aria-controls={`panel-${tab.value.toString()}`}
              aria-selected={isTabSelected(tab.value)}
              onClick={() => setSelectedTab(tab.value)}
              className={clsx("tabs__item", {
                "tabs__item--active": isTabSelected(tab.value),
              })}
            >
              {tab.startIcon}
              {tab.label}
              {tab.endIcon}
            </div>
          );
        })}
      </div>
      <div className="tabpanel" role="tabpanel">
        {renderContent}
      </div>
    </div>
  );
};
