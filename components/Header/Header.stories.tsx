import type { Meta, StoryObj } from "@storybook/react"
import { Header } from "./Header"

const meta: Meta<typeof Header> = {
  title: "Header",
  component: Header,
  args: {
    menuItems: [
      { label: "صفحه اصلی", href: "/", isActive: true },
      { label: "پشتیبانی", href: "/support" },
      { label: "بلاگ", href: "/blog" },
      { label: "درباره ما", href: "/about" },
    ],
  },
}

type Story = StoryObj<typeof Header>

export const Default: Story = {
  render: (args) => <Header {...args} />,
}

export const WithCustomBackground: Story = {
  render: (args) => (
    <Header 
      {...args} 
      className="bg-slate-50"
    />
  ),
}

export default meta 