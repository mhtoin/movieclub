import { useState } from "react";
import * as Ariakit from "@ariakit/react";
export default function Radio({
  values,
  className,
  onChange,
}: {
  values: string[];
  className?: string;
  onChange?: (value: string, direction?: string) => void;
}) {
  const [selectedValue, setSelectedValue] = useState(values[0]);
  const [focusVisible, setFocusVisible] = useState(false);

  return (
    <>
      {values.map((value) => (
        <label
          className={`checkbox ${className}`}
          data-checked={selectedValue === value}
          data-focus-visible={focusVisible || undefined}
          key={value}
        >
          <Ariakit.VisuallyHidden>
            <Ariakit.Checkbox
              value={value}
              clickOnEnter
              onFocusVisible={() => setFocusVisible(true)}
              onBlur={() => setFocusVisible(false)}
              onChange={(event) => {
                setSelectedValue(event.target.value);
              }}
            />
          </Ariakit.VisuallyHidden>
          <div className="check" data-checked={selectedValue === value}>
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
          {value}
        </label>
      ))}
    </>
  );
}
