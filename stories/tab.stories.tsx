import { Tab } from "../components/Tab";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { FaInfo } from "react-icons/fa";

import { expect, fn, userEvent, waitFor, within } from "@storybook/test";

const meta: Meta<typeof Tab> = {
  title: "components/Tab",
  component: Tab,
  parameters: {
    layout: null,
  },
} satisfies Meta<typeof Tab>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tabs: [
      {
        label: "Tab 1",
        value: "1",
        content: <div>Tab 1 content</div>,
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
    ],
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultSelectedTabValue: "5",
    tabs: [
      {
        label: "Tab 1",
        value: "1",
        content: <div>Tab 1 content</div>,
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
    ],
  },
};

export const WithIcon: Story = {
  args: {
    defaultSelectedTabValue: "1",
    tabs: [
      {
        label: "Tab 1",
        value: "1",
        content: <div>Tab 1 content</div>,
        startIcon: <FaInfo role="img" />,
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
        endIcon: <FaInfo role="img" />,
      },
    ],
  },
};

export const WithChildren: Story = {
  args: {
    defaultSelectedTabValue: "1",
    tabs: [
      {
        label: "Tab 1",
        value: "1",
        startIcon: <FaInfo role="img" />,
      },
      {
        label: "Tab 2",
        value: "2",
      },
      {
        label: "Tab 3",
        value: "3",
        endIcon: <FaInfo role="img" />,
      },
    ],
  },
  render: ({ tabs: items }) => {
    const tabContents: { [k in string]: React.ReactNode } = {
      "1": <div>Tab 1 children</div>,
      "2": <div>Tab 2 children</div>,
      "3": <div>Tab 3 children</div>,
    };

    return <Tab tabs={items}>{(activeTab) => tabContents[activeTab]}</Tab>;
  },
};
