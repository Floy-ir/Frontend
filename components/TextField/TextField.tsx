"use client"

import * as Form from "@radix-ui/react-form"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { twMerge } from "tailwind-merge"

export const textFieldContainer = cva(["flex", "flex-col", "gap-2", "w-full"], {
  variants: {
    intent: {
      primary: ["text-slate-700"],
      error: ["text-red-500"],
    },
    disabled: {
      true: ["opacity-50", "cursor-not-allowed"],
      false: [],
    },
  },
  defaultVariants: {
    intent: "primary",
    disabled: false,
  },
})

export const textFieldLabel = cva(["text-right", "text-sm", "font-medium"], {
  variants: {
    intent: {
      primary: ["text-slate-700"],
      error: ["text-red-500"],
    },
  },
  defaultVariants: {
    intent: "primary",
  },
})

export const textFieldWrapper = cva(
  ["flex", "items-center", "border", "rounded-xl", "overflow-hidden", "transition-colors", "delay-50"],
  {
    variants: {
      intent: {
        primary: ["border-slate-300", "focus-within:border-blue-400"],
        error: ["border-red-500"],
      },
      size: {
        sm: ["text-sm", "min-h-12"],
        md: ["text-base", "min-h-14"],
        lg: ["text-lg", "min-h-16"],
      },
      width: {
        full: ["w-full"],
        auto: ["w-auto"],
        xs: ["w-32", "min-w-[8rem]", "max-w-xs"],
        sm: ["w-64", "min-w-[12rem]", "max-w-sm"],
        md: ["w-80", "min-w-[16rem]", "max-w-md"],
        lg: ["w-96", "min-w-[20rem]", "max-w-lg"],
        xl: ["w-[28rem]", "min-w-[24rem]", "max-w-xl"],
      },
      filled: {
        true: ["bg-slate-50"],
        false: ["bg-white"],
      },
      disabled: {
        true: ["bg-slate-100", "cursor-not-allowed"],
        false: [],
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
      width: "full",
      filled: false,
      disabled: false,
    },
  }
)

export const textFieldInput = cva(
  ["flex-grow", "h-full", "outline-none", "bg-transparent", "text-slate-900", "w-full", "px-0", "py-3"],
  {
    variants: {
      textAlign: {
        left: ["text-left"],
        right: ["text-right"],
      },
      disabled: {
        true: ["cursor-not-allowed"],
        false: [],
      },
    },
    defaultVariants: {
      textAlign: "right",
      disabled: false,
    },
  }
)

export const textFieldIcon = cva(["flex", "items-center", "justify-center", "w-6", "h-6", "flex-shrink-0"], {
  variants: {
    position: {
      left: ["ml-4"],
      right: ["mr-4"],
    },
  },
  defaultVariants: {
    position: "left",
  },
})

export const textFieldAffix = cva(["flex", "items-center", "whitespace-nowrap", "text-slate-500"], {
  variants: {
    position: {
      prefix: ["mr-2"],
      suffix: ["ml-2"],
    },
  },
  defaultVariants: {
    position: "prefix",
  },
})

export const textFieldHelperText = cva(["flex", "items-center", "text-xs", "px-3"], {
  variants: {
    intent: {
      primary: ["text-slate-500"],
      error: ["text-red-500"],
    },
  },
  defaultVariants: {
    intent: "primary",
  },
})

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "disabled" | "width">,
    VariantProps<typeof textFieldWrapper> {
  label?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  prefix?: string
  suffix?: string
  maxLength?: number
  showCharCount?: boolean
  containerClassName?: string
  labelClassName?: string
  inputClassName?: string
  helperTextClassName?: string
  customWidth?: string
  customHeight?: string
  noBorder?: boolean
  hasError?: boolean
}

export const TextField = React.forwardRef<
  HTMLInputElement,
  TextFieldProps
>(function TextField(
  {
    id,
    label,
    helperText,
    leftIcon,
    rightIcon,
    prefix,
    suffix,
    maxLength,
    showCharCount = false,
    intent,
    size,
    width,
    filled,
    disabled,
    placeholder,
    value = "",
    onChange,
    containerClassName,
    labelClassName,
    inputClassName,
    helperTextClassName,
    customWidth,
    customHeight,
    noBorder = false,
    hasError = false,
    ...props
  },
  ref
) {
  const [inputValue, setInputValue] = React.useState(value?.toString() || "")

  // Set the intent to error if hasError is true
  const fieldIntent = hasError ? "error" : intent

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    if (maxLength && newValue.length > maxLength) return

    setInputValue(newValue)
    onChange?.(e)
  }

  // Determine text alignment based on input direction
  const textAlign = props.dir === "ltr" ? "left" : "right"

  // Custom styles for width and height if provided
  const customStyles: React.CSSProperties = {}
  if (customWidth) {
    // Support for responsive width values (min/max/clamp)
    customStyles.width =
      customWidth.includes("clamp") || customWidth.includes("min") || customWidth.includes("max")
        ? customWidth
        : customWidth
  }
  if (customHeight) {
    // Support for responsive height values (min/max/clamp)
    customStyles.height =
      customHeight.includes("clamp") || customHeight.includes("min") || customHeight.includes("max")
        ? customHeight
        : customHeight
  }

  return (
    <Form.Root
      className={twMerge(textFieldContainer({ intent: fieldIntent, disabled, className: containerClassName }), noBorder && "gap-0")}
    >
      <Form.Field name={id || "textfield"}>
        {label && (
          <Form.Label className={twMerge(textFieldLabel({ intent: fieldIntent, className: labelClassName }))}>{label}</Form.Label>
        )}

        <div
          className={twMerge(
            textFieldWrapper({ intent: fieldIntent, size, width, filled, disabled }),
            noBorder && "border-0 bg-transparent"
          )}
          style={Object.keys(customStyles).length > 0 ? customStyles : undefined}
        >
          <div className={`flex h-full w-full items-center ${noBorder ? "" : "px-4"}`}>
            {rightIcon && <div className={twMerge(textFieldIcon({ position: "right" }))}>{rightIcon}</div>}

            {prefix && <div className={twMerge(textFieldAffix({ position: "prefix" }))}>{prefix}</div>}

            <Form.Control asChild>
              <input
                id={id}
                type="text"
                value={inputValue}
                onChange={handleChange}
                disabled={disabled ?? undefined}
                placeholder={placeholder}
                className={twMerge(textFieldInput({ textAlign, disabled, className: inputClassName }))}
                {...props}
                ref={ref}
              />
            </Form.Control>

            {suffix && <div className={twMerge(textFieldAffix({ position: "suffix" }))}>{suffix}</div>}

            {leftIcon && <div className={twMerge(textFieldIcon({ position: "left" }))}>{leftIcon}</div>}
          </div>
        </div>

        {(helperText || (showCharCount && maxLength)) && (
          <div className="flex justify-between">
            {helperText && (
              <div className={twMerge(textFieldHelperText({ intent: fieldIntent, className: helperTextClassName }))}>
                {helperText}
              </div>
            )}
            {showCharCount && maxLength && (
              <div className="text-xs text-slate-500 px-3">
                {inputValue.length}/{maxLength}
              </div>
            )}
          </div>
        )}
      </Form.Field>
    </Form.Root>
  )
})
