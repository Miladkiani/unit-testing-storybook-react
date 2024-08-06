import { composeStories } from "@storybook/react";

import { render, screen, fireEvent, within } from "@testing-library/react";

import * as stories from "../../stories/tab.stories";
import { TabProps } from "#/components/Tab";

const { Default, WithDefaultValue, WithIcon, WithChildren } =
  composeStories(stories);

const TAB_STORIES = {
  Default: Default,
  WithDefaultValue: WithDefaultValue,
  WithIcon: WithIcon,
  WithChildren: WithChildren,
} as const;

const renderTab = (
  story: keyof typeof TAB_STORIES,
  tabProps?: Partial<TabProps>
) => {
  const Component = TAB_STORIES[story];

  render(<Component {...tabProps} />);

  const tabs = tabProps?.tabs || Component.args.tabs || [];

  const tabPanel = screen.getByRole("tabpanel");

  const getTabCotnentElementByLabel = (label: string) =>
    screen.getByText(new RegExp(label, "i"));

  const getTabElementByLabel = (label: string) =>
    screen.getByRole("tab", {
      name: new RegExp(label, "i"),
    });

  const findSelectedTabObjByValue = (
    defaultSelectedTabValue: TabProps["defaultSelectedTabValue"]
  ) => tabs?.find((item) => item.value === defaultSelectedTabValue);

  const getSelectedTabElementByLabel = (label: string) =>
    screen.getByRole("tab", {
      selected: true,
      name: new RegExp(label, "i"),
    });

  const expectSelectedTabToBe = (tabLabel: string) => {
    const activeTab = screen.getByRole("tab", {
      selected: true,
    });

    expect(activeTab).toHaveTextContent(tabLabel);
  };

  const expectTabPanelToContainElement = (
    activeRelatedContent: HTMLElement
  ) => {
    expect(tabPanel).toContainElement(activeRelatedContent);
  };

  return {
    tabs,
    getSelectedTabElementByLabel,
    getTabElementByLabel,
    getTabCotnentElementByLabel,
    findSelectedTabObjByValue,
    expectTabPanelToContainElement,
    expectSelectedTabToBe,
    args: Component.args,
  };
};

describe("Tab Component", () => {
  it("should render list of given tabs ", async () => {
    const { tabs } = renderTab("Default");

    const tabButtons = screen.getAllByRole("tab");

    expect(tabButtons).toHaveLength(tabs.length || 0);
  });

  it("Should render the content associated with the value of the first item in the tabs array and style the selected tab button if no default tab value is provided.", async () => {
    const {
      tabs,
      expectTabPanelToContainElement: expectٍTabPanelToContainElement,
      expectSelectedTabToBe,
    } = renderTab("Default");

    expectSelectedTabToBe(tabs[0].label.toString());

    const activeRelatedContent = screen.getByText(/tab 1 content/i);

    expectٍTabPanelToContainElement(activeRelatedContent);
  });

  it("Should render the content linked to a tab when clicked", async () => {
    const {
      tabs,
      expectTabPanelToContainElement,
      getTabElementByLabel: getTabByLabel,
      getTabCotnentElementByLabel,
    } = renderTab("Default");

    const tabOne = tabs[1];

    const tabOneElement = getTabByLabel(tabOne.label.toString());

    fireEvent.click(tabOneElement);

    let tabContentElement = getTabCotnentElementByLabel(
      `${tabOne.label.toString()} content`
    );

    expectTabPanelToContainElement(tabContentElement);

    const tabTwo = tabs[2];

    const tabTwoElement = getTabByLabel(tabTwo.label.toString());

    fireEvent.click(tabTwoElement);

    tabContentElement = getTabCotnentElementByLabel(
      `${tabTwo.label.toString()} content`
    );

    expectTabPanelToContainElement(tabContentElement);
  });

  it("Should render the content linked to the passed default value", async () => {
    const {
      findSelectedTabObjByValue,
      getSelectedTabElementByLabel,
      expectTabPanelToContainElement,
      getTabCotnentElementByLabel,
      args: { defaultSelectedTabValue },
    } = renderTab("WithDefaultValue");

    const selectedTab = findSelectedTabObjByValue(defaultSelectedTabValue);

    const selectedTabLabel = selectedTab?.label.toString() || "";

    const selectedTabElement = getSelectedTabElementByLabel(selectedTabLabel);

    expect(selectedTabElement).toBeInTheDocument();

    const tabContentElement = getTabCotnentElementByLabel(
      `${selectedTabLabel} content`
    );

    expectTabPanelToContainElement(tabContentElement);
  });

  it("Should render the children if not passed any content to selected tab", async () => {
    const {
      expectTabPanelToContainElement,
      tabs,
      getTabCotnentElementByLabel,
      getTabElementByLabel,
    } = renderTab("WithChildren");

    const defaultSelectedTab = tabs[0];

    const selectedTabLabel = defaultSelectedTab.label;

    let tabContentElement = getTabCotnentElementByLabel(
      `${selectedTabLabel} children`
    );

    expectTabPanelToContainElement(tabContentElement);

    const tabTwo = tabs[1];

    const tabTwoElement = getTabElementByLabel(tabTwo.label);

    fireEvent.click(tabTwoElement);

    tabContentElement = getTabCotnentElementByLabel(
      `${tabTwo.label.toString()} children`
    );

    expectTabPanelToContainElement(tabContentElement);
  });

  it.each<{ iconPosition: "startIcon" | "endIcon" }>([
    {
      iconPosition: "startIcon",
    },
    {
      iconPosition: "endIcon",
    },
  ])(
    `should render an icon if any of tabs include $iconPosition`,
    ({ iconPosition }) => {
      const { tabs, getTabElementByLabel } = renderTab("WithIcon");

      const tabsWithIcon = tabs?.filter((tab) => !!tab[iconPosition]);

      tabsWithIcon?.forEach((tab) => {
        const tabElement = getTabElementByLabel(tab.label.toString());

        const icon = within(tabElement).getByRole("img");

        if (iconPosition === "startIcon")
          expect(tabElement.firstChild).toBe(icon);
        else if (iconPosition === "endIcon")
          expect(tabElement.lastChild).toBe(icon);
      });
    }
  );

  // Negative tests

  it("should render the first element of the items if given wrong default selected tab", () => {
    const {
      getTabCotnentElementByLabel,
      expectTabPanelToContainElement,
      expectSelectedTabToBe,
      tabs,
    } = renderTab("WithDefaultValue", { defaultSelectedTabValue: "wrongKey" });

    expectSelectedTabToBe(tabs[0].label.toString());

    const activeRelatedContent = getTabCotnentElementByLabel("tab 1 content");

    expectTabPanelToContainElement(activeRelatedContent);
  });

  it("should render nothing in tabpanel if not passed any content to selected tab and children into the component ", () => {
    const newTabs = [
      {
        label: "Tab 1",
        value: "1",
      },
      {
        label: "Tab 2",
        value: "2",
        content: <div>Tab 2 content</div>,
      },
      {
        label: "Tab 3",
        value: "3",
        content: <div>Tab 3 content</div>,
      },
    ];

    const { expectSelectedTabToBe } = renderTab("Default", { tabs: newTabs });

    expectSelectedTabToBe(newTabs[0].label.toString());

    const tabPanel = screen.getByRole("tabpanel");

    expect(tabPanel.children).toHaveLength(0);
  });
});
