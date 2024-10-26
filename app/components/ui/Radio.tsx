import { useState } from "react";
import * as Ariakit from "@ariakit/react";
export default function Radio({
  values,
  className,
  onChange,
  defaultValue,
}: {
  values: string[] | { value: string; label: string }[];
  className?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
}) {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const [focusVisible, setFocusVisible] = useState(false);

  return (
    <>
      {values.map((value) => {
        const valueString = typeof value === "string" ? value : value.value;
        const label = typeof value === "string" ? value : value.label;
        return (
          <label
            className={`checkbox ${className}`}
            data-checked={selectedValue === valueString}
            data-focus-visible={focusVisible || undefined}
            key={label}
          >
            <Ariakit.VisuallyHidden>
              <Ariakit.Checkbox
                value={valueString}
                clickOnEnter
                onFocusVisible={() => setFocusVisible(true)}
                onBlur={() => setFocusVisible(false)}
                onChange={(event) => {
                  setSelectedValue(event.target.value);
                  onChange?.(event.target.value);
                }}
              />
            </Ariakit.VisuallyHidden>
            <div className="check" data-checked={selectedValue === valueString}>
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
            {label}
          </label>
        );
      })}
    </>
  );
}
