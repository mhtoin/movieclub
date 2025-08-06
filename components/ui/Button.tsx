import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps, cva } from "class-variance-authority"
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from "components/ui/Tooltip"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-foreground shadow-sm hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90",
        outline:
          "border border-border/80 bg-background shadow-xs hover:bg-accent/80 hover:border-accent/80 hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-accent/80",
        ghost: "hover:bg-accent/80 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        xxs: "h-5 px-2 py-1 text-xxs",
        xs: "h-6 px-1 py-1 text-xxs",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        iconXs: "h-5 w-5 p-0.5",
        iconSm: "h-6 w-6 py-2 px-1",
        icon: "h-9 w-9",
        iconLg: "h-12 w-12",
        avatar: "h-12 w-12 rounded-full overflow-hidden",
        avatarSm: "h-10 w-10 rounded-full overflow-hidden",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  tooltip?: string
}

const Button: React.FC<ButtonProps> = ({
  className,
  variant,
  size,
  asChild = false,
  isLoading = false,
  tooltip,
  ...props
}) => {
  const Comp = asChild ? Slot : "button"
  return tooltip ? (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : props.children}
          </Comp>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent
            className="bg-card text-foreground relative z-9999 hidden max-w-xs p-2 whitespace-pre-wrap lg:block"
            sideOffset={10}
            align="center"
            side="right"
          >
            {tooltip}
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {isLoading ? <Loader2 className="animate-spin" /> : props.children}
    </Comp>
  )
}
Button.displayName = "Button"

export { Button, buttonVariants }
