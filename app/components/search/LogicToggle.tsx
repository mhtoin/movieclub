import { Label, Radio, RadioGroup } from "react-aria-components";

export default function LogicToggle() {
  return (
    <RadioGroup
      className={"flex gap-2 bg-popoverbg/10 w-fit items-center p-2 shadow-lg"}
      defaultValue={"AND"}
    >
      <Radio
        value="AND"
        className={({ isFocusVisible, isSelected, isPressed }) => `
      group relative flex cursor-default rounded-lg px-4 py-3 w-1/2 shadow-lg outline-none bg-clip-padding border border-solid
      ${
        isFocusVisible
          ? "ring-2 ring-primary ring-offset-1 ring-offset-white/80"
          : ""
      }
      ${
        isSelected
          ? "bg-primary border-white/30 text-black"
          : "border-transparent"
      }
      ${isPressed && !isSelected ? "ring-black" : ""}
      ${!isSelected && !isPressed ? "bg-background" : ""}
    `}
      >
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex items-center shrink-0 group-selected:text-black">
            AND
          </div>
        </div>
      </Radio>
      <Radio
        value="OR"
        className={({ isFocusVisible, isSelected, isPressed }) => `
      group relative flex cursor-default rounded-lg px-4 py-3 w-1/2 shadow-lg outline-none bg-clip-padding border border-solid
      ${
        isFocusVisible
          ? "ring-2 ring-primary ring-offset-1 ring-offset-white/80"
          : ""
      }
      ${
        isSelected
          ? "bg-primary border-white/30 text-black"
          : "border-transparent"
      }
      ${isPressed && !isSelected ? "ring-black" : ""}
      ${!isSelected && !isPressed ? "bg-background" : ""}
    `}
      >
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex items-center shrink-0 group-selected:text-black">
            OR
          </div>
        </div>
      </Radio>
    </RadioGroup>
  );
}
