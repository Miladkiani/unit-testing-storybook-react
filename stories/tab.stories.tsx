import { Tab } from "../components/Tab";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

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
        content: <div>Tab content 1</div>,
      },
      {
        label: "Tab 2",
        value: "2",
        content: <div>Tab content 2</div>,
      },
      {
        label: "Tab 3",
        value: "3",
        content: <div>Tab content 3</div>,
      },
    ],
  },
};
