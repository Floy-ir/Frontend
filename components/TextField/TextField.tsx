"use client"

import * as Form from "@radix-ui/react-form"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { twMerge } from "tailwind-merge"
import { englishToFarsiNumber } from "utils/numbers"

const textFieldContainer = cva(["flex", "flex-col", "gap-2", "w-full"], {
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

const textFieldLabel = cva(["text-right", "text-sm", "font-medium"], {
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

const textFieldWrapper = cva(
  ["flex", "items-center", "border", "rounded-xl", "w-full", "overflow-hidden", "transition-colors", "delay-50"],
  {
    variants: {
      intent: {
        primary: ["border-slate-300", "focus-within:border-blue-400"],
        error: ["border-red-500"],
      },
      size: {
        sm: ["h-12", "text-sm"],
        md: ["h-14", "text-base"],
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
      filled: false,
      disabled: false,
    },
  }
)

const textFieldInput = cva(
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

const textFieldIcon = cva(["flex", "items-center", "justify-center", "w-6", "h-6", "flex-shrink-0"], {
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

const textFieldAffix = cva(["flex", "items-center", "whitespace-nowrap", "text-slate-500"], {
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

const textFieldHelperText = cva(["flex", "items-center", "text-xs", "px-3"], {
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

export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'disabled'>, 
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
}

export function TextField({
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
  filled,
  disabled,
  placeholder,
  value = "",
  onChange,
  containerClassName,
  labelClassName,
  inputClassName,
  helperTextClassName,
  ...props
}: TextFieldProps) {
  const [inputValue, setInputValue] = React.useState(value?.toString() || "");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (maxLength && newValue.length > maxLength) return;
    
    setInputValue(newValue);
    onChange?.(e);
  };
  
  // Determine text alignment based on input direction
  const textAlign = props.dir === "ltr" ? "left" : "right";

  return (
    <Form.Root className={twMerge(textFieldContainer({ intent, disabled, className: containerClassName }))}>
      <Form.Field name={id || "textfield"}>
        {label && (
          <Form.Label className={twMerge(textFieldLabel({ intent, className: labelClassName }))}>
            {label}
          </Form.Label>
        )}
        
        <div className={twMerge(textFieldWrapper({ intent, size, filled, disabled }))}>
          <div className="flex items-center h-full w-full px-4">
            {rightIcon && (
              <div className={twMerge(textFieldIcon({ position: "right" }))}>
                {rightIcon}
              </div>
            )}
            
            {prefix && (
              <div className={twMerge(textFieldAffix({ position: "prefix" }))}>
                {prefix}
              </div>
            )}
            
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
              />
            </Form.Control>
            
            {suffix && (
              <div className={twMerge(textFieldAffix({ position: "suffix" }))}>
                {suffix}
              </div>
            )}
            
            {leftIcon && (
              <div className={twMerge(textFieldIcon({ position: "left" }))}>
                {leftIcon}
              </div>
            )}
          </div>
        </div>
        
        {(helperText || (showCharCount && maxLength)) && (
          <div className="flex justify-between w-full">
            {showCharCount && maxLength && (
              <div className={twMerge(textFieldHelperText({ intent }))}>
                {props.dir === "rtl" 
                  ? `${englishToFarsiNumber(inputValue.length)} / ${englishToFarsiNumber(maxLength || 0)}`
                  : `${inputValue.length} / ${maxLength}`
                }
              </div>
            )}
            
            {helperText && (
              <div className={twMerge(textFieldHelperText({ intent, className: helperTextClassName }))}>
                {helperText}
              </div>
            )}
          </div>
        )}
      </Form.Field>
    </Form.Root>
  );
} 