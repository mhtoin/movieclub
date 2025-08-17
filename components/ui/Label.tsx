import { cn } from "@/lib/utils"

const Label: React.FC<React.ComponentProps<"label">> = ({
  className,
  ...props
}) => (
  <label
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className,
    )}
    {...props}
  />
)
Label.displayName = "Label"

export { Label }
