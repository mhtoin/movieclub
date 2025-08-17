import { cn } from "@/lib/utils"

const Card: React.FC<React.ComponentProps<"div">> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className,
    )}
    {...props}
  />
)
Card.displayName = "Card"

const CardHeader: React.FC<React.ComponentProps<"div">> = ({
  className,
  ...props
}) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
)
CardHeader.displayName = "CardHeader"

const CardTitle: React.FC<React.ComponentProps<"h3">> = ({
  className,
  ...props
}) => (
  <h3
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
)
CardTitle.displayName = "CardTitle"

const CardContent: React.FC<React.ComponentProps<"div">> = ({
  className,
  ...props
}) => <div className={cn("p-6 pt-0", className)} {...props} />
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }
