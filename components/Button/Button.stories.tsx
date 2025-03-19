import { Meta, StoryObj } from "@storybook/react";
import { Button, ButtonProps } from "./Button";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

export default {
  title: "Components/Button",
  component: Button,
  argTypes: {
    intent: { control: "radio", options: ["primary", "secondary", "outline", "text"] },
    size: { control: "radio", options: ["small", "medium", "large", "custom"] },
    customSize: { control: "text" },
    disabled: { control: "boolean" },
    asChild: { control: "boolean" },
    leftIcon: { control: "boolean" },
    rightIcon: { control: "boolean" },
  },
} satisfies Meta<ButtonProps>;

export const Default: StoryObj<ButtonProps> = {
  args: {
    children: "Click Me",
    intent: "primary",
    size: "medium",
  },
};

export const WithIcons: StoryObj<ButtonProps> = {
  args: {
    children: "Click Me",
    intent: "primary",
    size: "medium",
    leftIcon: true,
    rightIcon: true,
  },
  render: (args) => (
    <Button
      {...args}
      leftIcon={args.leftIcon ? <FiArrowLeft /> : undefined}
      rightIcon={args.rightIcon ? <FiArrowRight /> : undefined}
    />
  ),
};

export const CustomSize: StoryObj<ButtonProps> = {
  args: {
    children: "Custom Button",
    intent: "primary",
    size: "custom",
    customSize: "px-10 py-5 text-lg",
  },
};

export const Disabled: StoryObj<ButtonProps> = {
  args: {
    children: "Disabled",
    intent: "primary",
    size: "medium",
    disabled: true,
  },
};

export const AsChild: StoryObj<ButtonProps> = {
  args: {
    asChild: true,
    children: <a href="https://example.com">Go to Link</a>,
  },
};