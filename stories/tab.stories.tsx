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
    items: [
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
    defaultValue: "3",
    items: [
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
    defaultValue: "1",
    items: [
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
