import type { Decorator, Preview } from "@storybook/react"
import React, { ReactElement } from "react"

import "../styles/tailwind.css"

// Define the decorator with correct typing
const withDirectionAndFont: Decorator = (Story, context): ReactElement => {
  return (
    <div dir={context.globals.direction} className="font-family-anjoman-max">
      <Story />
    </div>
  )
}

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    direction: "rtl",
  },
  globalTypes: {
    direction: {
      name: 'Direction',
      description: 'Direction for layout',
      defaultValue: 'rtl',
      toolbar: {
        icon: 'transfer',
        items: [
          { value: 'ltr', title: 'LTR' },
          { value: 'rtl', title: 'RTL' },
        ],
      },
    },
  },
  decorators: [withDirectionAndFont],
}

export default preview
