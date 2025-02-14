import {
  Checkbox,
  useCheckboxStore,
  useStoreState,
  VisuallyHidden,
} from "@ariakit/react";
import { Button } from "../ui/Button";
import React, {
  type ComponentPropsWithoutRef,
  forwardRef,
  type ReactNode,
  useState,
} from "react";
import { Calendar } from "lucide-react";

interface CheckboxProps extends ComponentPropsWithoutRef<"input"> {
  children?: ReactNode;
}

export const ParticipationButton = forwardRef<HTMLInputElement, CheckboxProps>(
  function ParticipationButton(props, ref) {
    const [checked, setChecked] = useState(props.defaultChecked ?? false);
    const [focusVisible, setFocusVisible] = useState(false);

    return (
      <label
        className={`flex select-none items-center gap-2 border rounded-md p-3 transition-all duration-500 ${
          checked ? "border-accent" : "border-border"
        }`}
        data-checked={checked}
        data-focus-visible={focusVisible || undefined}
      >
        <VisuallyHidden>
          <Checkbox
            {...props}
            ref={ref}
            clickOnEnter
            onFocusVisible={() => setFocusVisible(true)}
            onBlur={() => setFocusVisible(false)}
            onChange={(event) => {
              setChecked(event.target.checked);
              props.onChange?.(event);
            }}
          />
        </VisuallyHidden>

        <div className="check" data-checked={checked}>
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 16 16"
            height="1em"
            width="1em"
          >
            <polyline points="4,8 7,12 12,4" />
          </svg>
        </div>
      </label>
    );
  }
);
