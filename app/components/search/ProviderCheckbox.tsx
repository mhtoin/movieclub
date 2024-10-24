import * as Ariakit from "@ariakit/react";
import { forwardRef, useState } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Button } from "../ui/Button";

interface CheckboxProps extends ComponentPropsWithoutRef<"input"> {
  children?: ReactNode;
  provider: {
    provider_id: number;
    provider_name: string;
    logo_path: string;
  };
  handleClick?: (value: string) => void;
}

export const ProviderCheckbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function ProviderCheckbox({ children, provider, ...props }, ref) {
    const [checked, setChecked] = useState(props.defaultChecked ?? false);
    const [focusVisible, setFocusVisible] = useState(false);

    return (
      <label
        className="flex items-center gap-1 h-10 w-10 lg:h-12 lg:w-12 aspect-square border border-ring rounded cursor-pointer hover:scale-110 transition-transform ease-in-out duration-200"
        data-checked={checked}
        data-focus-visible={focusVisible || undefined}
      >
        <Ariakit.VisuallyHidden>
          <Ariakit.Checkbox
            {...props}
            ref={ref}
            clickOnEnter
            onFocusVisible={() => setFocusVisible(true)}
            onBlur={() => setFocusVisible(false)}
            onChange={(event) => {
              setChecked(event.target.checked);
              props.onChange?.(event);
              props.handleClick?.(provider.provider_id.toString());
            }}
          />
        </Ariakit.VisuallyHidden>
        <img
          src={`https://image.tmdb.org/t/p/w500${provider.logo_path}`}
          className={`transition-opacity ease-in-out duration-200 object-fill aspect-square object-center rounded opacity-10 ${
            checked ? "opacity-100" : ""
          }`}
          alt={provider.provider_name}
        />
      </label>
    );
  }
);
