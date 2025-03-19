"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const button = cva(
  [
    "justify-center",
    "inline-flex",
    "items-center",
    "rounded-xl",
    "text-center",
    "transition-colors",
    "delay-50",
    "cursor-pointer",
  ],
  {
    variants: {
      intent: {
        primary: [
          "bg-[#4641FB]",
          "text-white",
          "hover:bg-[#6561FC]",
          "active:bg-[#0C05F8]",
          "disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed",
        ],
        secondary: [
          "bg-[#F1F5F9]",
          "text-[#4641FB]",
          "hover:bg-[#F8FAFC] hover:text-[#6561FC]",
          "active:bg-[#E2E8F0] active:text-[#0C05F8]",
          "disabled:bg-[#F1F5F9] disabled:text-[#4641FB] disabled:pointer-events-none disabled:opacity-40",
        ],
        outline: [
          "border-1 border-[#F1F5F9] text-[#4641FB]",
          "hover:border-[#6561FC] hover:text-[#6561FC]",
          "active:border-[#0C05F8] active:text-[#0904BA]",
          "disabled:!border-[#6561FC] disabled:!text-[#A0A0A0] disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed",
        ],
        text: [
          "bg-transparent text-[#4641FB]",
          "hover:text-[#6561FC]",
          "active:text-[#0C05F8]",
          "bg-transparent disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed",
        ],
      },
      size: {
        large: ["px-7", "py-4", "text-lg", "rounded-xl", "inline-flex", "justify-center", "items-center", "gap-2"],
        medium: ["px-6", "py-3.5", "text-md", "rounded-xl", "inline-flex", "justify-center", "items-center", "gap-2"],
        small: ["px-5", "py-3", "text-sm", "rounded-xl", "inline-flex", "justify-center", "items-center", "gap-1"],
        custom: [], 
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "large",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement>,
    VariantProps<typeof button> {
  href?: string;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
  customSize?: string;
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
  const Component = asChild ? Slot : href ? "a" : "button";

  return (
    <Component
      {...(href
        ? { href, target: "_blank", rel: "noopener noreferrer" }
        : { disabled, onClick: (e) => disabled && e.preventDefault() })}
        className={twMerge(
          button({ intent, size: size === "custom" ? undefined : size, className }),
          size === "custom" ? customSize : "",
          disabled ? "pointer-events-none opacity-40 cursor-not-allowed" : ""
        )}
      {...props}
    >
      <span className="flex items-center">
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </span>
    </Component>
  );
}