import * as Ariakit from '@ariakit/react'
import { useState } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

interface CheckboxProps extends ComponentPropsWithoutRef<'input'> {
  children?: ReactNode
}

export const Checkbox: React.FC<CheckboxProps> = ({ children, ...props }) => {
  const [checked, setChecked] = useState(props.defaultChecked ?? false)
  const [focusVisible, setFocusVisible] = useState(false)
  return (
    <label
      className={`checkbox ${props.className}`}
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
      <div className="check" data-checked={checked}>
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
