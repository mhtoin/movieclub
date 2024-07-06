import { useState } from "react";
import Popover from "../ui/PopoverBox";
import RangeSlider from "../ui/RangeSlider";

interface FilterRangeProps {
  onChange: (value: number[]) => void;
}

export default function FilterRange({ onChange }: FilterRangeProps) {
  const [value, setValue] = useState([0, 10]);

  const handleRangeSelect = (value: string) => {};
  return (
    <Popover label="Rating">
      <div className="flex flex-col">
        <RangeSlider
          label="Rating"
          value={value}
          onChange={setValue}
          step={0.1}
          minValue={0}
          maxValue={10}
          thumbLabels={["from", "to"]}
          onChangeEnd={onChange}
        />
      </div>
    </Popover>
  );
}
