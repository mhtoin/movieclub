import * as Ariakit from "@ariakit/react"
import { useState } from "react"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface CheckboxProps
  extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
  children?: ReactNode
  size?: "sm" | "md" | "lg"
  variant?: "default" | "ghost"
}

export const Checkbox: React.FC<CheckboxProps> = ({
  children,
  size = "md",
  variant = "default",
  className,
  ...props
}) => {
  const [checked, setChecked] = useState(props.defaultChecked ?? false)
  const [focusVisible, setFocusVisible] = useState(false)

  // Size-based styling
  const sizeClasses = {
    sm: "p-2 gap-2 text-sm",
    md: "p-3 gap-3",
    lg: "p-4 gap-4 text-lg",
  }

  const checkSizeClasses = {
    sm: "p-0.5 text-sm",
    md: "p-1 text-base",
    lg: "p-1.5 text-lg",
  }

  return (
    <label
      className={cn("checkbox", sizeClasses[size], className)}
      data-checked={checked}
      data-focus-visible={focusVisible || undefined}
      htmlFor={props.id}
    >
      <Ariakit.VisuallyHidden>
        <Ariakit.Checkbox
          {...props}
          clickOnEnter
          onFocusVisible={() => setFocusVisible(true)}
          onBlur={() => setFocusVisible(false)}
          onChange={(event) => {
            setChecked(event.target.checked)
            props.onChange?.(event)
          }}
        />
      </Ariakit.VisuallyHidden>
      <div
        className={cn("check", checkSizeClasses[size])}
        data-checked={checked}
        data-variant={variant}
      >
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 16 16"
          height="1em"
          width="1em"
        >
          <title>Checkbox</title>
          <polyline points="4,8 7,12 12,4" />
        </svg>
      </div>
      {children}
    </label>
  )
}
