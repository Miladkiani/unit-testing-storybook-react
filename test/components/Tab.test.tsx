import { composeStories } from "@storybook/react";

import { render, screen, fireEvent, within } from "@testing-library/react";

import * as stories from "../../stories/tab.stories";

const { Default, WithDefaultValue, WithIcon, WithChildren } =
  composeStories(stories);

const renderDefaultStory = () => {
  render(<Default />);

  const tabs = Default.args.items || [];
  return {
    tabs,
  };
};

describe("Tab Component", () => {
  it("should render list of given tabs ", async () => {
    const { tabs } = renderDefaultStory();

    const tabButtons = screen.getAllByRole("tab");

    expect(tabButtons).toHaveLength(tabs.length || 0);
  });

  it("Should render the content associated with the value of the first item in the tabs array and style the selected tab button if no default tab value is provided.", async () => {
    const { tabs } = renderDefaultStory();

    const activeTab = screen.getByRole("tab", {
      selected: true,
    });

    expect(activeTab).toHaveTextContent(tabs[0].label.toString());

    const tabPanel = screen.getByRole("tabpanel");

    const activeRelatedContent = screen.getByText(/tab 1 content/i);

    expect(tabPanel).toContainElement(activeRelatedContent);
  });

  it("Should render the content linked to a tab when clicked", async () => {
    const { tabs } = renderDefaultStory();

    const tabPanel = screen.getByRole("tabpanel");

    const tabOne = tabs[1];

    const tabOneElement = screen.getByRole("tab", {
      name: new RegExp(tabOne.label.toString(), "i"),
    });

    fireEvent.click(tabOneElement);

    const regExTab1 = `${tabOne.label.toString()} content`;

    let tabContentElement = screen.getByText(new RegExp(regExTab1, "i"));

    expect(tabPanel).toContainElement(tabContentElement);

    const tabTwo = tabs[2];

    const tabTwoElement = screen.getByRole("tab", {
      name: new RegExp(tabTwo.label.toString(), "i"),
    });

    fireEvent.click(tabTwoElement);

    const regExTab2 = `${tabTwo.label.toString()} content`;

    tabContentElement = screen.getByText(new RegExp(regExTab2, "i"));

    expect(tabPanel).toContainElement(tabContentElement);
  });

  it("Should render the content linked to the passed default value", async () => {
    render(<WithDefaultValue />);

    const { items, defaultSelectedTabValue: defaultValue } =
      WithDefaultValue.args;

    const tabPanel = screen.getByRole("tabpanel");

    const selectedTab = items?.find((item) => item.value === defaultValue);

    const selectedTabLabel = selectedTab?.label.toString() || "";

    const selectedTabElement = screen.getByRole("tab", {
      selected: true,
      name: new RegExp(selectedTabLabel, "i"),
    });

    expect(selectedTabElement).toBeInTheDocument();

    const regExTabContent = new RegExp(`${selectedTabLabel} content`, "i");

    const tabContentElement = screen.getByText(regExTabContent);

    expect(tabPanel).toContainElement(tabContentElement);
  });

  it("Should render the children if not passed any content to selected tab", async () => {
    render(<WithChildren />);

    const { items } = WithChildren.args;

    const tabs = items || [];

    const tabPanel = screen.getByRole("tabpanel");

    const defaultSelectedTab = tabs[0];

    const selectedTabLabel = defaultSelectedTab.label.toString() || "";

    const regExTabContent = new RegExp(`${selectedTabLabel} children`, "i");

    let tabContentElement = screen.getByText(regExTabContent);

    expect(tabPanel).toContainElement(tabContentElement);

    const tabTwo = tabs[1];

    const tabTwoElement = screen.getByRole("tab", {
      name: new RegExp(tabTwo.label, "i"),
    });

    fireEvent.click(tabTwoElement);

    const regExTab2 = `${tabTwo.label.toString()} children`;

    tabContentElement = screen.getByText(new RegExp(regExTab2, "i"));

    expect(tabPanel).toContainElement(tabContentElement);
  });

  it("should render an icon if any of tabs include startIcon", () => {
    render(<WithIcon />);

    const tabs = WithIcon.args.items;

    const tabsWithAfterIcon = tabs?.filter((tab) => !!tab.startIcon);

    tabsWithAfterIcon?.forEach((tab) => {
      const tabElement = screen.getByRole("tab", {
        name: new RegExp(tab.label.toString(), "i"),
      });

      const icon = within(tabElement).getByRole("img");

      expect(tabElement.firstChild).toBe(icon);
    });
  });

  it("should render an icon if any of tabs include endIcon", () => {
    render(<WithIcon />);

    const tabs = WithIcon.args.items;

    const tabsWithAfterIcon = tabs?.filter((tab) => !!tab.endIcon);

    tabsWithAfterIcon?.forEach((tab) => {
      const tabElement = screen.getByRole("tab", {
        name: new RegExp(tab.label.toString(), "i"),
      });

      const icon = within(tabElement).getByRole("img");

      expect(tabElement.lastChild).toBe(icon);
    });
  });

  // Negative tests

  it("should render the first element of the items if given wrong default selected tab", () => {
    render(<WithDefaultValue defaultSelectedTabValue={"wrongKey"} />);

    const activeTab = screen.getByRole("tab", {
      selected: true,
    });

    const tabs = WithDefaultValue.args.items || [];

    expect(activeTab).toHaveTextContent(tabs[0].label.toString());

    const tabPanel = screen.getByRole("tabpanel");

    const activeRelatedContent = screen.getByText(/tab 1 content/i);

    expect(tabPanel).toContainElement(activeRelatedContent);
  });

  it("should render nothing in tabpanel if not passed any content to selected tab and children into the component ", () => {
    const items = [
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
    render(<Default items={items} />);

    const activeTab = screen.getByRole("tab", {
      selected: true,
    });

    expect(activeTab).toHaveTextContent(items[0].label.toString());

    const tabPanel = screen.getByRole("tabpanel");

    expect(tabPanel.children).toHaveLength(0);
  });
});
