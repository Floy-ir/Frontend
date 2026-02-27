"use client"

import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import * as React from "react"

import { cn } from "@/lib/utils"

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "border-input dark:bg-input/30 data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[state=unchecked]:bg-Shade-White data-[state=unchecked]:border-Gray-N300 data-[state=checked]:bg-Primary-P500main data-[state=checked]:border-Primary-P500main peer size-4.5 shrink-0 rounded-full border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <div className="size-2 rounded-full bg-white" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
