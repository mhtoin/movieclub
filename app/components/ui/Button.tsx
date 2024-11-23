import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import {
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Tooltip,
  TooltipPortal,
} from "components/ui/Tooltip";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent/80 hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-accent/80",
        ghost: "hover:bg-accent/60 hover:text-accent-foreground",
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
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  tooltip?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      tooltip,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return tooltip ? (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="cursor-not-allowed">
            <Comp
              className={cn(buttonVariants({ variant, size, className }))}
              ref={ref}
              {...props}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                props.children
              )}
            </Comp>
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent className="bg-card max-w-20 whitespace-pre-wrap p-2 z-50 hidden lg:block">
              {tooltip}
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      </TooltipProvider>
    ) : (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {isLoading ? <Loader2 className="animate-spin" /> : props.children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
