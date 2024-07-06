import { useEffect, useState } from "react";
import type { SliderProps } from "react-aria-components";
import {
  Label,
  Slider,
  SliderOutput,
  SliderThumb,
  SliderTrack,
} from "react-aria-components";

interface MySliderProps<T> extends SliderProps<T> {
  label?: string;
  thumbLabels?: string[];
}

export default function RangeSlider<T extends number | number[]>({
  label,
  thumbLabels,
  ...props
}: MySliderProps<T>) {
  return (
    <Slider
      {...props}
      className="grid grid-cols-[1fr_auto] items-center gap-2 w-64"
    >
      <Label>{label}</Label>
      <SliderOutput className="text-sm text-foreground font-medium">
        {({ state }) =>
          state.values.map((_, i) => state.getThumbValueLabel(i)).join(" – ")
        }
      </SliderOutput>
      <SliderTrack className="group col-span-2 h-6 flex items-center">
        {({ state, ...renderProps }) => (
          <>
            <div className="rounded full w-full h-[6px] bg-card" />
            {state.values.map((_, i) => (
              <SliderThumb
                key={i}
                index={i}
                aria-label={thumbLabels?.[i]}
                className="w-6 h-6 mt-6 rounded-full bg-gray-50 dark:bg-primary border-2 border-gray-700 dark:border-gray-300"
              />
            ))}
          </>
        )}
      </SliderTrack>
    </Slider>
  );
}
