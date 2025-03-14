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
    "cursor-pointer", // Ensure cursor changes on hover
  ],
  {
    variants: {
      intent: {
        primary: [
          "bg-[#4641FB]", "text-white",
          "hover:bg-[#6561FC]",
          "active:bg-[#0C05F8]",
          "disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed" // Added cursor-not-allowed
        ],
        secondary: [
          "bg-[#F1F5F9]", "text-[#4641FB]",
          "hover:bg-[#F8FAFC] hover:text-[#6561FC]",
          "active:bg-[#E2E8F0] active:text-[#0C05F8]",
          "disabled:bg-[#F1F5F9] disabled:text-[#4641FB] disabled:pointer-events-none disabled:opacity-40"
        ],
        outline: [
          "border-1 border-[#F1F5F9] text-[#4641FB]", // Default styles
          "hover:border-[#6561FC] hover:text-[#6561FC]", // Hover styles
          "active:border-[#0C05F8] active:text-[#0904BA]", // Active styles
          "disabled:!border-[#6561FC] disabled:!text-[#A0A0A0] disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed" // Force apply disabled styles
        ],
        text: [
          "bg-transparent text-[#4641FB]",
          "hover:text-[#6561FC]",
          "active:text-[#0C05F8]",
          "bg-transparent disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed"
        ],
      },
      size: {
        small: ["inline-flex", "p-[14px_20px]", "justify-center", "items-center", "gap-1"],
        medium: ["inline-flex", "p-[16px_24px]", "justify-center", "items-center", "gap-2"],
        large: ["inline-flex", "p-[16px_28px]", "justify-center", "items-center", "gap-2"],
      // todo: custom size
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "large",
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof button> {
  href?: string;
  disabled?: boolean;
}

export function Button({ className, intent, size, href, disabled, ...props }: ButtonProps) {
  return (
    <a
      href={disabled ? undefined : href} // Prevent navigation when disabled
      className={twMerge(button({ intent, size, className }), disabled && "pointer-events-none opacity-40")}
      {...props}
    >
      {props.children}
    </a>
  );
}