import type { SliderProps } from 'react-aria-components'
import {
  Slider,
  SliderOutput,
  SliderThumb,
  SliderTrack,
} from 'react-aria-components'

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
      className="grid grid-cols-[1fr_auto]  gap-2 w-full"
      aria-label={label}
    >
      <SliderTrack className="group col-span-2 h-6 flex items-center">
        {({ state }) => {
          const minPercent = state.getThumbPercent(0) * 100
          const maxPercent = state.getThumbPercent(1) * 100
          return (
            <>
              <div className="relative w-full h-[8px]">
                <div className="absolute rounded-full h-full bg-accent/50 w-full" />
                <div
                  className="absolute rounded-full h-full bg-accent w-full"
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
                  className="w-8 h-8 mt-8 rounded-full bg-primary border-2 border-border relative flex items-center justify-center"
                >
                  <SliderOutput className="text-sm text-background font-medium cursor-pointer">
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
