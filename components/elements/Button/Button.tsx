"use client"

import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"

export const button = cva(
  [
    "justify-center",
    "inline-flex",
    "items-center",
    "rounded-xl",
    "text-center",
    "transition-colors",
    "delay-50",
    "cursor-pointer",
    "whitespace-nowrap",
  ],
  {
    variants: {
      intent: {
        primary: [
          "bg-[#5A28EE]",
          "text-Shade-White",
          "hover:bg-[#764CF1]",
          "active:bg-[#4010CE]",
          "disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed",
        ],
        secondary: [
          "bg-[#F1F5F9]",
          "text-[#5A28EE]",
          "hover:bg-[#F8FAFC] hover:text-[#764CF1]",
          "active:bg-[#E2E8F0] active:text-[#300C9B]",
          "disabled:bg-[#F1F5F9] disabled:text-[#5A28EE] disabled:pointer-events-none disabled:opacity-40",
        ],
        outline: [
          "border-1 border-[#F1F5F9] text-[#5A28EE]",
          "hover:border-[#764CF1] hover:text-[#764CF1]",
          "active:border-[#300C9B] active:text-[#4010CE]",
          "disabled:!border-[#a2a0d4] disabled:!text-[#A0A0A0] disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed",
        ],
        outline2: [
          "border border-[#F1F5F9] bg-transparent text-[#4641FB]",
          "hover:border-[#6561FC] hover:text-[#6561FC] hover:bg-[#F8FAFC]/50",
          "active:border-[#0C05F8] active:text-[#0904BA] active:bg-[#F1F5F9]",
          "disabled:!border-[#6561FC] disabled:!text-[#A0A0A0] disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed",
        ],
        ghost: [
          "bg-transparent text-[#4641FB]",
          "hover:bg-[#F1F5F9]/70 hover:text-[#6561FC]",
          "active:bg-[#F1F5F9] active:text-[#0C05F8]",
          "aria-selected:bg-Primary-P500main aria-selected:text-Shade-White aria-selected:rounded-xl aria-selected:font-semibold",
          "disabled:text-[#A0A0A0] disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed",
        ],
        text: [
          "bg-transparent text-[#5A28EE]",
          "hover:text-[#764CF1]",
          "active:text-[#300C9B]",
          "bg-transparent disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed",
        ],
      },
      size: {
        large: ["px-7", "py-4", "text-base", "rounded-xl", "inline-flex", "justify-center", "items-center", "gap-2"],
        medium: ["px-6", "py-3.5", "text-md", "rounded-xl", "inline-flex", "justify-center", "items-center", "gap-2"],
        small: [
          "px-5",
          "py-3.5",
          "text-[13px]",
          "font-semibold",
          "leading-none",
          "rounded-xl",
          "inline-flex",
          "justify-center",
          "items-center",
          "gap-1",
        ],
        custom: [],
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "large",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement>, VariantProps<typeof button> {
  href?: string
  disabled?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  asChild?: boolean
  customSize?: string
}

export function Button({
  className,
  intent,
  size,
  customSize,
  href,
  disabled,
  leftIcon,
  rightIcon,
  asChild,
  children,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : href ? "a" : "button"

  // Determine icon spacing based on button size
  const iconGap = size === "small" ? "gap-1" : "gap-2"

  return (
    <Component
      {...(href
        ? { href, target: "_blank", rel: "noopener noreferrer" }
        : { disabled, onClick: (e) => disabled && e.preventDefault() })}
      className={twMerge(
        button({ intent, size: size === "custom" ? undefined : size, className }),
        size === "custom" ? customSize : "",
        disabled ? "pointer-events-none cursor-not-allowed opacity-40" : ""
      )}
      {...props}
    >
      <span className={`flex items-center ${iconGap}`}>
        {leftIcon && <span>{leftIcon}</span>}
        {children}
        {rightIcon && <span>{rightIcon}</span>}
      </span>
    </Component>
  )
}
