import * as Ariakit from '@ariakit/react'
import { useEffect, useState } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

interface CheckboxProps extends ComponentPropsWithoutRef<'input'> {
  children?: ReactNode
  isLoading?: boolean
  provider: {
    provider_id: number
    provider_name: string
    logo_path: string
  }
  handleClick?: (value: string) => void
}

export const ProviderCheckbox: React.FC<CheckboxProps> = ({
  children,
  provider,
  isLoading,
  handleClick,
  ...props
}) => {
  const [checked, setChecked] = useState(props.defaultChecked ?? false)
  const [focusVisible, setFocusVisible] = useState(false)

  useEffect(() => {
    setChecked(props.defaultChecked ?? false)
  }, [props.defaultChecked])

  return (
    <label
      className="flex aspect-square h-10 w-10 cursor-pointer items-center gap-1 rounded transition-transform duration-200 ease-in-out hover:scale-105 lg:h-12 lg:w-12"
      data-checked={checked}
      data-focus-visible={focusVisible || undefined}
      htmlFor={`provider-${provider.provider_id}`}
    >
      <Ariakit.VisuallyHidden>
        <Ariakit.Checkbox
          {...props}
          id={`provider-${provider.provider_id}`}
          clickOnEnter
          onFocusVisible={() => setFocusVisible(true)}
          onBlur={() => setFocusVisible(false)}
          onChange={(event) => {
            setChecked(event.target.checked)
            props.onChange?.(event)
            handleClick?.(provider.provider_id.toString())
          }}
        />
      </Ariakit.VisuallyHidden>
      <img
        src={`https://image.tmdb.org/t/p/w500${provider.logo_path}`}
        className={`aspect-square rounded object-fill object-center transition-all duration-200 ease-in-out ${
          checked
            ? 'border-border border opacity-100 grayscale-0'
            : 'opacity-20 grayscale'
        } ${isLoading ? 'animate-pulse' : ''}`}
        alt={provider.provider_name}
      />
    </label>
  )
}
