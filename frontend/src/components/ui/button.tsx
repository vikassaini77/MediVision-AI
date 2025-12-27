import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_hsl(190_85%_50%/0.3)]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-border bg-transparent text-foreground hover:bg-secondary hover:border-primary/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-secondary hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        medical: "bg-gradient-to-r from-[hsl(190_85%_50%)] to-[hsl(200_90%_55%)] text-[hsl(210_20%_6%)] font-semibold hover:shadow-[0_0_40px_hsl(190_85%_50%/0.4)] transition-shadow",
        "medical-outline": "border border-[hsl(190_85%_50%/0.5)] bg-transparent text-[hsl(190_85%_50%)] hover:bg-[hsl(190_85%_50%/0.1)] hover:border-[hsl(190_85%_50%)] hover:shadow-[0_0_10px_hsl(190_85%_50%/0.2)]",
        "medical-ghost": "text-[hsl(190_85%_50%)] hover:bg-[hsl(190_85%_50%/0.1)]",
        hero: "bg-gradient-to-r from-[hsl(190_85%_50%)] to-[hsl(200_90%_55%)] text-[hsl(210_20%_6%)] font-semibold px-8 py-6 text-base hover:shadow-[0_0_60px_hsl(190_85%_50%/0.5)] transition-all hover:scale-105",
        "hero-outline": "border-2 border-[hsl(190_85%_50%/0.6)] bg-transparent text-foreground font-semibold px-8 py-6 text-base hover:bg-[hsl(190_85%_50%/0.1)] hover:border-[hsl(190_85%_50%)] hover:shadow-[0_0_20px_hsl(190_85%_50%/0.3)] transition-all",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
