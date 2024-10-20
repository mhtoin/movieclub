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
      className="grid grid-cols-[1fr_auto] items-center gap-2 w-64 px-7"
      aria-label={label}
    >
      <SliderOutput className="text-sm text-foreground font-medium absolute left-0 px-3">
        {({ state }) => state.getThumbValue(0)}
      </SliderOutput>
      <SliderOutput className="text-sm text-foreground font-medium absolute right-0 px-3">
        {({ state }) => state.getThumbValue(1)}
      </SliderOutput>
      <SliderTrack className="group col-span-2 h-6 flex items-center px-2">
        {({ state, ...renderProps }) => (
          <>
            <div className="rounded-full w-full h-[4px] bg-secondary" />
            {state.values.map((_, i) => (
              <SliderThumb
                key={i}
                index={i}
                aria-label={thumbLabels?.[i]}
                className="w-4 h-4 mt-4 rounded-full bg-gray-50 dark:bg-primary border-2 border-gray-700 dark:border-gray-300"
              />
            ))}
          </>
        )}
      </SliderTrack>
    </Slider>
  );
}
