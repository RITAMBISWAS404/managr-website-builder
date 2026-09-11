import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg font-semibold transition-[background-color,border-color,box-shadow,color,transform] duration-100 ease-smooth active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-xs hover:bg-brand-strong",
        navy: "bg-navy text-navy-foreground shadow-xs hover:bg-navy-active",
        blue: "border border-secondary-blue-border bg-secondary-blue-surface text-secondary-blue hover:bg-secondary-blue-surface/60",
        secondary: "bg-secondary text-secondary-foreground hover:bg-border",
        outline: "border border-border bg-surface text-foreground shadow-xs hover:border-border-strong hover:bg-surface-2",
        ghost: "text-foreground hover:bg-accent",
        destructive: "border border-destructive/25 bg-surface text-destructive shadow-xs hover:bg-destructive/[0.06]",
        link: "text-brand underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-3.5 text-sm",
        sm: "h-8 px-3 text-caption",
        lg: "h-10 px-4 text-body",
        xs: "h-7 px-2.5 text-caption",
        icon: "size-9",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: { variant: "outline", size: "default" },
  },
);

const iconSize: Record<string, string> = {
  default: "[&_svg]:size-4",
  sm: "[&_svg]:size-3.5",
  lg: "[&_svg]:size-4",
  xs: "[&_svg]:size-3.5",
  icon: "[&_svg]:size-4",
  "icon-sm": "[&_svg]:size-3.5",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const cls = cn(buttonVariants({ variant, size }), iconSize[size ?? "default"], className);

    if (asChild) {
      return (
        <Slot className={cls} ref={ref} {...props}>
          {children}
        </Slot>
      );
    }

    return (
      <button
        className={cls}
        ref={ref}
        disabled={disabled || loading || undefined}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && (
          <span className="absolute inset-0 grid place-items-center">
            <Loader2 className="size-4 animate-spin" />
          </span>
        )}
        <span className={cn("inline-flex items-center gap-1.5", loading && "invisible")}>{children}</span>
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
