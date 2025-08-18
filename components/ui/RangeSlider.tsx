import type { SliderProps } from "react-aria-components"
import {
  Slider,
  SliderOutput,
  SliderThumb,
  SliderTrack,
} from "react-aria-components"

interface MySliderProps<T> extends SliderProps<T> {
  label?: string
  thumbLabels?: string[]
}

export default function RangeSlider<T extends number | number[]>({
  label,
  thumbLabels,
  ...props
}: MySliderProps<T>) {
  return (
    <Slider
      {...props}
      className="grid w-full grid-cols-[1fr_auto] gap-2"
      aria-label={label}
    >
      <SliderTrack className="group col-span-2 flex h-6 items-center">
        {({ state }) => {
          const minPercent = state.getThumbPercent(0) * 100
          const maxPercent = state.getThumbPercent(1) * 100
          return (
            <>
              <div className="relative h-[8px] w-full">
                <div className="bg-accent/50 absolute h-full w-full rounded-full" />
                <div
                  className="bg-accent absolute h-full w-full rounded-full"
                  style={{
                    left: `${minPercent}%`,
                    width: `${maxPercent - minPercent}%`,
                  }}
                />
              </div>
              {state.values.map((_, i) => (
                <SliderThumb
                  key={i}
                  index={i}
                  aria-label={thumbLabels?.[i]}
                  className="bg-primary border-border relative mt-8 flex h-8 w-8 items-center justify-center rounded-full border-2"
                >
                  <SliderOutput className="text-background cursor-pointer text-sm font-medium">
                    {({ state }) => state.getThumbValue(i)}
                  </SliderOutput>
                </SliderThumb>
              ))}
            </>
          )
        }}
      </SliderTrack>
    </Slider>
  )
}
