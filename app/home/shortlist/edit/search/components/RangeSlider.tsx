"use client";

import { useState } from "react";

export default function RangeSlider({
  startingValue,
  min,
  max,
  step,
  label,
  onChange,
}: {
  startingValue: string;
  min: string;
  max: string;
  step: string;
  label: string;
  onChange: any;
}) {
  const [value, setValue] = useState(startingValue);
  return (
    <div className="my-5">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        className="range"
        step={step}
        onChange={(event) => {
          setValue(event.target.value);
          onChange(label, event.target.value)
        }}
      />
      <div className="w-full flex justify-between text-xs px-2">
        <span>{min}</span>
        <span>{value}</span>
      </div>
    </div>
  );
}
