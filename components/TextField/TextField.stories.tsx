import type { Meta, StoryObj } from "@storybook/react"
import { Eye, User } from "iconsax-react"
import { TextField } from "./TextField"

const meta: Meta<typeof TextField> = {
  title: "TextField",
  component: TextField,
  args: {
    label: "عنوان",
    placeholder: "متن ورودی",
    helperText: "متن راهنما",
    intent: "primary",
    size: "md",
    filled: false,
    disabled: false,
  },
  argTypes: {
    intent: {
      options: ["primary", "error"],
      control: { type: "select" },
    },
    size: {
      options: ["sm", "md"],
      control: { type: "select" },
    },
    filled: {
      control: { type: "boolean" },
    },
    disabled: {
      control: { type: "boolean" },
    },
    showCharCount: {
      control: { type: "boolean" },
    },
    dir: {
      options: ["ltr", "rtl"],
      control: { type: "select" },
      defaultValue: "rtl",
    },
    leftIcon: {
      control: false,
    },
    rightIcon: {
      control: false,
    },
    width: {
      options: ["full", "auto", "xs", "sm", "md", "lg", "xl"],
      control: { type: "select" },
    },
    customWidth: {
      control: { type: "text" },
      description: "Custom width value (e.g., '200px', '15rem')",
    },
    customHeight: {
      control: { type: "text" },
      description: "Custom height value (e.g., '50px', '4rem')",
    },
  },
}

type Story = StoryObj<typeof TextField>

export const Default: Story = {
  render: (args) => <TextField {...args} />,
}

export const WithIcons: Story = {
  render: (args) => (
    <TextField
      {...args}
      leftIcon={<Eye size={18} variant="Outline" />}
      rightIcon={<User size={18} variant="Outline" />}
    />
  ),
}

export const WithAffixes: Story = {
  render: (args) => <TextField {...args} prefix="پیشوند" suffix="پسوند" />,
}

export const WithCharacterCount: Story = {
  render: (args) => <TextField {...args} maxLength={50} showCharCount={true} />,
}

export const Filled: Story = {
  render: (args) => <TextField {...args} filled={true} />,
}

export const Error: Story = {
  render: (args) => <TextField {...args} intent="error" helperText="این فیلد با خطا مواجه است" />,
}

export const Disabled: Story = {
  render: (args) => <TextField {...args} disabled={true} />,
}

export const RTL: Story = {
  render: (args) => <TextField {...args} dir="rtl" placeholder="متن ورودی" label="عنوان" helperText="متن راهنما" />,
}

export const LTR: Story = {
  render: (args) => <TextField {...args} dir="ltr" label="عنوان" placeholder="متن ورودی" helperText="متن راهنما" />,
}

export const Complex: Story = {
  render: (args) => (
    <TextField
      {...args}
      leftIcon={<Eye color="var(--color-Gray-N500)" />}
      rightIcon={<User color="var(--color-Gray-N500)" />}
      prefix="$"
      suffix=".00"
      maxLength={20}
      showCharCount={true}
      filled={true}
    />
  ),
}

export const FixedWidth: Story = {
  render: (args) => (
    <TextField
      {...args}
      width="md"
      label="Medium Width Field"
    />
  ),
};

export const CustomSized: Story = {
  render: (args) => (
    <TextField
      {...args}
      customWidth="250px"
      customHeight="70px"
      label="Custom Sized Field"
    />
  ),
};

export default meta
