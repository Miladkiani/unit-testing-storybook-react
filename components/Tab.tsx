import { ReactNode, useState } from "react";
import clsx from "clsx";
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
  defaultValue?: T["value"];
  children?: ReactNode | ((activeTab: T["value"]) => ReactNode);
}

export const Tab = <T extends ITabItem>({
  items,
  defaultValue,
  children,
}: TabProps<T>) => {
  const [activeTab, setActiveTab] = useState<T["value"]>(
    defaultValue || items[0].value
  );

  const isActiveTab = (tabValue: T["value"]) => activeTab === tabValue;

  const renderContent = () => {
    if (typeof children === "function") return children(activeTab);
    const activeItem = items.find((tab) => isActiveTab(tab.value));

    return activeItem?.content || children;
  };

  return (
    <div className="tab-container">
      <div className="tabs" role="tablist">
        {items.map((tab) => {
          return (
            <div
              key={String(tab.value)}
              role="tab"
              aria-controls={`panel-${tab.value.toString()}`}
              aria-selected={isActiveTab(tab.value)}
              onClick={() => setActiveTab(tab.value)}
              className={clsx("tabs__item", {
                "tabs__item--active": isActiveTab(tab.value),
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
        {renderContent()}
      </div>
    </div>
  );
};
