import {
  Checkbox,
  useCheckboxStore,
  useStoreState,
  VisuallyHidden,
} from "@ariakit/react";
import { Button } from "../ui/Button";
import React, {
  ComponentPropsWithoutRef,
  forwardRef,
  ReactNode,
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

        <Calendar
          className={`h-5 w-5 transition-all duration-500 ${
            checked
              ? "stroke-2 stroke-accent opacity-100"
              : "stroke-1 opacity-60"
          }`}
        />
      </label>
    );
  }
);
