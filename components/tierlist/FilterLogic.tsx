import { RadioGroup, RadioGroupItem } from "../ui/RadioGroup"

export default function FilterLogic({
  logic,
  setLogic,
}: {
  logic: "or" | "and"
  setLogic: (value: "or" | "and") => void
}) {
  return (
    <RadioGroup
      value={logic}
      onValueChange={(value) => setLogic(value as "or" | "and")}
      orientation="horizontal"
      className="flex items-center justify-center gap-4"
    >
      <div className="flex items-center gap-2">
        <RadioGroupItem value="or" id="r1" />
        <label htmlFor="r1" className="text-sm">
          OR
        </label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="and" id="r2" />
        <label htmlFor="r2" className="text-sm">
          AND
        </label>
      </div>
    </RadioGroup>
  )
}
